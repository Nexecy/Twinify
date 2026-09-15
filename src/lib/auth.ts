import { cookies } from "next/headers";
import { COOKIE_NAMES } from "@/lib/constants";
import type { TokenSet } from "@/types/spotify";

const isProd = process.env.NODE_ENV === "production";

const baseCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax" as const,
  path: "/",
};

export async function setTokenCookies(tokens: TokenSet) {
  const jar = await cookies();
  const maxAge = 60 * 60 * 24 * 30; // 30 days for refresh persistence

  jar.set(COOKIE_NAMES.accessToken, tokens.accessToken, {
    ...baseCookieOptions,
    maxAge: Math.max(60, Math.floor((tokens.expiresAt - Date.now()) / 1000)),
  });
  jar.set(COOKIE_NAMES.refreshToken, tokens.refreshToken, {
    ...baseCookieOptions,
    maxAge,
  });
  jar.set(COOKIE_NAMES.expiresAt, String(tokens.expiresAt), {
    ...baseCookieOptions,
    maxAge,
  });
}

export async function clearTokenCookies() {
  const jar = await cookies();
  for (const name of Object.values(COOKIE_NAMES)) {
    jar.delete(name);
  }
}

export async function getTokenCookies(): Promise<TokenSet | null> {
  const jar = await cookies();
  const accessToken = jar.get(COOKIE_NAMES.accessToken)?.value;
  const refreshToken = jar.get(COOKIE_NAMES.refreshToken)?.value;
  const expiresAtRaw = jar.get(COOKIE_NAMES.expiresAt)?.value;

  if (!accessToken || !refreshToken || !expiresAtRaw) return null;

  return {
    accessToken,
    refreshToken,
    expiresAt: Number(expiresAtRaw),
  };
}

export async function setOAuthState(state: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAMES.oauthState, state, {
    ...baseCookieOptions,
    maxAge: 60 * 10,
  });
}

export async function consumeOAuthState(): Promise<string | undefined> {
  const jar = await cookies();
  const state = jar.get(COOKIE_NAMES.oauthState)?.value;
  jar.delete(COOKIE_NAMES.oauthState);
  return state;
}
