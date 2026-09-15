import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/spotify";

export async function GET() {
  const result = await getCurrentUser();
  if (result.error || !result.data) {
    return NextResponse.json(
      { error: result.error ?? "Unauthorized" },
      { status: result.status || 401 },
    );
  }
  return NextResponse.json({ user: result.data });
}
