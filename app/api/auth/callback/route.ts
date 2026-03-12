import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, fetchXUser } from "@/lib/x-auth";
import { prisma } from "@/lib/db";
import { createSessionOnResponse } from "@/lib/session";
import { encrypt } from "@/lib/crypto";
import { rateLimit, getClientIP } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Rate limit: 10 callbacks per minute per IP
  const ip = getClientIP(request);
  const rl = rateLimit(`callback:${ip}`, { limit: 10, windowSeconds: 60 });
  if (!rl.success) {
    return NextResponse.redirect(`${appUrl}/?error=rate_limited`);
  }

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
    let tokens;
    try {
      tokens = await exchangeCodeForToken(code, codeVerifier);
    } catch (e) {
      console.error("Token exchange failed:", e);
      return NextResponse.redirect(`${appUrl}/?error=token_exchange_failed&detail=${encodeURIComponent(String(e))}`);
    }

    // Fetch user profile
    let xUser;
    try {
      xUser = await fetchXUser(tokens.accessToken);
    } catch (e) {
      console.error("Fetch X user failed:", e);
      return NextResponse.redirect(`${appUrl}/?error=fetch_user_failed`);
    }

    // Encrypt tokens before storing
    let encryptedAccessToken, encryptedRefreshToken;
    try {
      encryptedAccessToken = encrypt(tokens.accessToken);
      encryptedRefreshToken = encrypt(tokens.refreshToken);
    } catch (e) {
      console.error("Encryption failed:", e);
      return NextResponse.redirect(`${appUrl}/?error=encryption_failed`);
    }

    // Upsert user in database
    let user;
    try {
      user = await prisma.user.upsert({
        where: { xId: xUser.id },
        update: {
          xUsername: xUser.username,
          xDisplayName: xUser.name,
          accessToken: encryptedAccessToken,
          refreshToken: encryptedRefreshToken,
          tokenExpiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
        },
        create: {
          xId: xUser.id,
          xUsername: xUser.username,
          xDisplayName: xUser.name,
          accessToken: encryptedAccessToken,
          refreshToken: encryptedRefreshToken,
          tokenExpiresAt: new Date(Date.now() + tokens.expiresIn * 1000),
        },
      });
    } catch (e) {
      console.error("Database upsert failed:", e);
      return NextResponse.redirect(`${appUrl}/?error=db_failed`);
    }

    // Clear OAuth cookies and redirect
    const response = NextResponse.redirect(`${appUrl}/dashboard`);
    response.cookies.delete("x_code_verifier");
    response.cookies.delete("x_oauth_state");

    // Set session cookie directly on the redirect response
    await createSessionOnResponse(user.id, response);

    return response;
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(`${appUrl}/?error=auth_failed`);
  }
}
