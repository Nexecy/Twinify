import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { setOAuthState } from "@/lib/auth";
import { getAuthorizeUrl } from "@/lib/spotify";

export async function GET() {
  try {
    const state = randomBytes(16).toString("hex");
    await setOAuthState(state);
    const url = getAuthorizeUrl(state);
    return NextResponse.redirect(url);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to start login";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
