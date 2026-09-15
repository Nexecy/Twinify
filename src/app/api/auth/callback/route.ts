import { NextRequest, NextResponse } from "next/server";
import { consumeOAuthState, setTokenCookies } from "@/lib/auth";
import { exchangeCodeForTokens } from "@/lib/spotify";

export async function GET(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${appUrl}/?error=${encodeURIComponent(error)}`,
    );
  }

  if (!code || !state) {
    return NextResponse.redirect(`${appUrl}/?error=missing_code`);
  }

  const savedState = await consumeOAuthState();
  if (!savedState || savedState !== state) {
    return NextResponse.redirect(`${appUrl}/?error=invalid_state`);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    await setTokenCookies(tokens);
    return NextResponse.redirect(`${appUrl}/dashboard`);
  } catch {
    return NextResponse.redirect(`${appUrl}/?error=token_exchange`);
  }
}
