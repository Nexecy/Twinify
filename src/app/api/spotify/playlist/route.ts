import { NextRequest, NextResponse } from "next/server";
import { createPlaylist, getCurrentUser } from "@/lib/spotify";

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

  const userResult = await getCurrentUser();
  if (!userResult.data) {
    return NextResponse.json(
      { error: userResult.error ?? "Unauthorized" },
      { status: userResult.status || 401 },
    );
  }

  const result = await createPlaylist({
    userId: userResult.data.id,
    name,
    description: body.description?.trim() || "Created with Twinify",
    isPublic: body.isPublic ?? true,
    trackUris,
  });

  if (result.error || !result.data) {
    return NextResponse.json(
      { error: result.error ?? "Failed to create playlist" },
      { status: result.status || 500 },
    );
  }

  return NextResponse.json({ playlist: result.data });
}
