import { NextRequest, NextResponse } from "next/server";
import { createPlaylist, getValidAccessToken } from "@/lib/spotify";

export async function POST(request: NextRequest) {
  let body: {
    name?: string;
    description?: string;
    isPublic?: boolean;
    trackUris?: string[];
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = body.name?.trim();
  const trackUris = body.trackUris ?? [];

  if (!name) {
    return NextResponse.json(
      { error: "Playlist name is required" },
      { status: 400 },
    );
  }
  if (trackUris.length === 0) {
    return NextResponse.json(
      { error: "At least one track is required" },
      { status: 400 },
    );
  }

  const token = await getValidAccessToken();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await createPlaylist({
    name,
    description: body.description?.trim() || "Created with Twinify",
    isPublic: body.isPublic ?? true,
    trackUris,
  });

  if (result.error || !result.data) {
    const raw = result.error ?? "Failed to create playlist";
    const friendly =
      result.status === 403
        ? "Spotify blocked playlist creation. Log out and log back in so Twinify can get playlist permissions, then try again."
        : raw;

    return NextResponse.json(
      { error: friendly },
      { status: result.status || 500 },
    );
  }

  return NextResponse.json({ playlist: result.data });
}
