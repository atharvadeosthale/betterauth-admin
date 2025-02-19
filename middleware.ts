import { betterFetch } from "@better-fetch/fetch";
import type { authClient } from "@/lib/auth-client";
import { NextRequest, NextResponse } from "next/server";

type Session = typeof authClient.$Infer.Session;

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: process.env.NEXT_PUBLIC_BETTERAUTH_BASE_URL,
      headers: {
        cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
      },
    }
  );

  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check if user is admin
  if (session.user.role !== "admin") {
    await betterFetch<Session>("/api/auth/sign-out", {
      method: "POST",
      baseURL: process.env.NEXT_PUBLIC_BETTERAUTH_BASE_URL,
      headers: {
        cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
      },
    });
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Apply middleware to specific routes
};
