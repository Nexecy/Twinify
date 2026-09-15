import { NextResponse } from "next/server";
import { clearTokenCookies } from "@/lib/auth";

export async function POST() {
  await clearTokenCookies();
  return NextResponse.json({ ok: true });
}

export async function GET() {
  await clearTokenCookies();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return NextResponse.redirect(appUrl);
}
