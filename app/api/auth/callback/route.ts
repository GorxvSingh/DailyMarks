import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, fetchXUser } from "@/lib/x-auth";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Handle user denial
  if (error) {
    return NextResponse.redirect(`${appUrl}/?error=auth_denied`);
  }

  // Validate state
  const storedState = request.cookies.get("x_oauth_state")?.value;
  if (!state || state !== storedState) {
    return NextResponse.redirect(`${appUrl}/?error=invalid_state`);
  }

  // Get PKCE verifier
  const codeVerifier = request.cookies.get("x_code_verifier")?.value;
  if (!code || !codeVerifier) {
    return NextResponse.redirect(`${appUrl}/?error=missing_params`);
  }

  try {
    // Exchange code for tokens
    const tokens = await exchangeCodeForToken(code, codeVerifier);

    // Fetch user profile
    const xUser = await fetchXUser(tokens.accessToken);

    // Upsert user in database
    const user = await prisma.user.upsert({
      where: { xId: xUser.id },
      update: {
        xUsername: xUser.username,
        xDisplayName: xUser.name,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
      },
      create: {
        xId: xUser.id,
        xUsername: xUser.username,
        xDisplayName: xUser.name,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        tokenExpiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
      },
    });

    // Create session
    await createSession(user.id);

    // Clear OAuth cookies and redirect
    const response = NextResponse.redirect(`${appUrl}/dashboard`);
    response.cookies.delete("x_code_verifier");
    response.cookies.delete("x_oauth_state");
    return response;
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(`${appUrl}/?error=auth_failed`);
  }
}
