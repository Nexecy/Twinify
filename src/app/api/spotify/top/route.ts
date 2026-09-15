import { NextRequest, NextResponse } from "next/server";
import { getTopArtists, getTopTracks } from "@/lib/spotify";
import type { ItemType, TimeRange } from "@/types/spotify";

const VALID_RANGES: TimeRange[] = ["short_term", "medium_term", "long_term"];
const VALID_TYPES: ItemType[] = ["tracks", "artists"];

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = (searchParams.get("type") ?? "tracks") as ItemType;
  const timeRange = (searchParams.get("time_range") ??
    "medium_term") as TimeRange;
  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get("limit") ?? 10)),
  );

  if (!VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }
  if (!VALID_RANGES.includes(timeRange)) {
    return NextResponse.json({ error: "Invalid time_range" }, { status: 400 });
  }

  const result =
    type === "tracks"
      ? await getTopTracks(timeRange, limit)
      : await getTopArtists(timeRange, limit);

  if (result.error || !result.data) {
    return NextResponse.json(
      { error: result.error ?? "Failed to fetch top items" },
      { status: result.status || 500 },
    );
  }

  if (result.data.items.length === 0) {
    return NextResponse.json(
      {
        error:
          "Not enough listening history for this time range. Try a longer range or listen to more music on Spotify.",
        items: [],
      },
      { status: 200 },
    );
  }

  return NextResponse.json({
    items: result.data.items,
    total: result.data.total,
  });
}
