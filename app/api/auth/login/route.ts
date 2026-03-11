import { NextResponse } from "next/server";
import { generatePKCE, generateState, buildAuthUrl } from "@/lib/x-auth";

export async function GET() {
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
