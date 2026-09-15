import {
  clearTokenCookies,
  getTokenCookies,
  setTokenCookies,
} from "@/lib/auth";
import { SPOTIFY_SCOPES } from "@/lib/constants";
import type {
  CreatedPlaylist,
  SpotifyUser,
  TimeRange,
  TokenSet,
  TopArtistsResponse,
  TopTracksResponse,
} from "@/types/spotify";

const SPOTIFY_ACCOUNTS = "https://accounts.spotify.com";
const SPOTIFY_API = "https://api.spotify.com/v1";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function basicAuthHeader() {
  const id = requireEnv("SPOTIFY_CLIENT_ID");
  const secret = requireEnv("SPOTIFY_CLIENT_SECRET");
  return `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`;
}

export function getAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: requireEnv("SPOTIFY_CLIENT_ID"),
    response_type: "code",
    redirect_uri: requireEnv("SPOTIFY_REDIRECT_URI"),
    scope: SPOTIFY_SCOPES.join(" "),
    state,
    show_dialog: "true",
  });
  return `${SPOTIFY_ACCOUNTS}/authorize?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string): Promise<TokenSet> {
  const res = await fetch(`${SPOTIFY_ACCOUNTS}/api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: basicAuthHeader(),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: requireEnv("SPOTIFY_REDIRECT_URI"),
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${body}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<TokenSet> {
  const res = await fetch(`${SPOTIFY_ACCOUNTS}/api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: basicAuthHeader(),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Token refresh failed: ${res.status} ${body}`);
  }

  const data = (await res.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? refreshToken,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
}

/** Returns a valid access token, refreshing cookies when needed. */
export async function getValidAccessToken(): Promise<string | null> {
  const tokens = await getTokenCookies();
  if (!tokens) return null;

  const skewMs = 60_000;
  if (Date.now() < tokens.expiresAt - skewMs) {
    return tokens.accessToken;
  }

  try {
    const refreshed = await refreshAccessToken(tokens.refreshToken);
    await setTokenCookies(refreshed);
    return refreshed.accessToken;
  } catch {
    await clearTokenCookies();
    return null;
  }
}

async function spotifyFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<{ data?: T; error?: string; status: number }> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    return { status: 401, error: "Not authenticated" };
  }

  const res = await fetch(`${SPOTIFY_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (res.status === 204) {
    return { status: 204, data: undefined };
  }

  if (res.status === 429) {
    const retryAfter = res.headers.get("Retry-After") ?? "unknown";
    return {
      status: 429,
      error: `Spotify rate limit hit. Try again in ${retryAfter} seconds.`,
    };
  }

  if (!res.ok) {
    let message = `Spotify API error (${res.status})`;
    const text = await res.text().catch(() => "");
    if (text) {
      try {
        const err = JSON.parse(text) as {
          error?: { message?: string } | string;
        };
        if (typeof err.error === "string" && err.error) {
          message = err.error;
        } else if (
          err.error &&
          typeof err.error === "object" &&
          err.error.message
        ) {
          message = err.error.message;
        } else {
          message = text.slice(0, 200);
        }
      } catch {
        message = text.slice(0, 200);
      }
    }

    if (res.status === 403 && /^forbidden$/i.test(message.trim())) {
      message =
        "Spotify returned Forbidden. Try logging out and back in, then create the playlist again.";
    }

    return { status: res.status, error: message };
  }

  const data = (await res.json()) as T;
  return { status: res.status, data };
}

export async function getCurrentUser() {
  return spotifyFetch<SpotifyUser>("/me");
}

export async function getTopTracks(timeRange: TimeRange, limit: number) {
  const params = new URLSearchParams({
    time_range: timeRange,
    limit: String(limit),
  });
  return spotifyFetch<TopTracksResponse>(`/me/top/tracks?${params}`);
}

export async function getTopArtists(timeRange: TimeRange, limit: number) {
  const params = new URLSearchParams({
    time_range: timeRange,
    limit: String(limit),
  });
  return spotifyFetch<TopArtistsResponse>(`/me/top/artists?${params}`);
}

export async function createPlaylist(input: {
  name: string;
  description: string;
  isPublic: boolean;
  trackUris: string[];
}) {
  const created = await spotifyFetch<CreatedPlaylist>("/me/playlists", {
    method: "POST",
    body: JSON.stringify({
      name: input.name,
      description: input.description,
      public: input.isPublic,
    }),
  });

  if (!created.data) {
    return created;
  }

  if (input.trackUris.length > 0) {
    // Spotify Feb 2026: /tracks renamed to /items
    const added = await spotifyFetch(`/playlists/${created.data.id}/items`, {
      method: "POST",
      body: JSON.stringify({ uris: input.trackUris }),
    });
    if (added.error) {
      return { status: added.status, error: added.error };
    }
  }

  return created;
}
