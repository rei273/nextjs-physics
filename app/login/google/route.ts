import { generateState } from "arctic";
import { google } from "@/app/lib/session";
import { cookies } from "next/headers";

export async function GET(request: Request): Promise<Response> {
  const refererUrl = request.headers.get("referer");
  console.log("referer URL", refererUrl);

  if (!process.env.AUTH_SECRET || !google) {
    return new Response("Google OAuth is not configured", {
      status: 500,
    });
  }

  const codeVerifier = process.env.AUTH_SECRET;
  const state = generateState();
  const cookieStore = await cookies();
  const url: URL = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["email", "profile"],
  });

  cookieStore.set("google_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  // Set the callbackUrl cookie
  if (refererUrl) {
    cookieStore.set("callbackUrl", refererUrl, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true, // Optional: secure callback URL from client-side access
      maxAge: 60 * 10, // 10 minutes
      sameSite: "lax",
    });
  }

  return Response.redirect(url);
}
