import { NextRequest, NextResponse } from "next/server";
import { generatePKCE, generateState, buildAuthUrl } from "@/lib/x-auth";
import { rateLimit, getClientIP, rateLimitHeaders } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  // Rate limit: 10 login attempts per minute per IP
  const ip = getClientIP(request);
  const rl = rateLimit(`login:${ip}`, { limit: 10, windowSeconds: 60 });
  if (!rl.success) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${appUrl}/?error=rate_limited`);
  }

  const { codeVerifier, codeChallenge } = generatePKCE();
  const state = generateState();

  const authUrl = buildAuthUrl({ codeChallenge, state });

  const response = NextResponse.redirect(authUrl);

  // Store PKCE verifier and state in httpOnly cookies
  response.cookies.set("x_code_verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });

  response.cookies.set("x_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return response;
}
