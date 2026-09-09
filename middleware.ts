import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  SESSION_COOKIE_NAME,
  deriveSessionToken,
} from "@/lib/auth";

// Public asset/route matcher to exclude from authentication
const PUBLIC_PREFIXES = [
  "/_next",
  "/api/images",
  "/api/auth",
  "/login",
  "/favicon",
  "/icon",
  "/apple-touch-icon",
  "/logo",
  "/manifest.json",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = process.env.PLANTSTACK_API_SECRET?.trim();

  // 1. CSRF Protection for state-changing requests
  const mutatingMethods = ["POST", "PUT", "DELETE", "PATCH"];
  if (mutatingMethods.includes(request.method)) {
    // Exempt auth login/logout from strict CSRF origin check
    if (!pathname.startsWith("/api/auth/")) {
      const authHeader = request.headers.get("authorization");
      const bearerToken = authHeader?.startsWith("Bearer ")
        ? authHeader.substring(7)
        : undefined;
      const apiKey = request.headers.get("x-api-key") || undefined;
      const hasValidApiAuth = Boolean(
        secret && (bearerToken === secret || apiKey === secret)
      );

      // Programmatic clients with valid API secret bypass ambient-cookie CSRF check
      const origin = request.headers.get("origin");
      if (origin && !hasValidApiAuth) {
        try {
          const originHost = new URL(origin).host;
          const hostHeader = request.headers.get("host") || "";
          const forwardedHost = request.headers
            .get("x-forwarded-host")
            ?.split(",")[0]
            .trim();

          const allowedHosts = new Set([hostHeader, forwardedHost].filter(Boolean));

          // Also check without ports if origin or host has non-standard port mapping
          const originHostname = originHost.split(":")[0];
          const hostHostname = hostHeader.split(":")[0];
          const forwardedHostname = forwardedHost ? forwardedHost.split(":")[0] : "";

          const matchesHost =
            allowedHosts.has(originHost) ||
            allowedHosts.has(originHostname) ||
            originHostname === hostHostname ||
            originHostname === forwardedHostname;

          if (!matchesHost) {
            return NextResponse.json(
              { error: "CSRF check failed: Origin does not match Host" },
              { status: 403 }
            );
          }
        } catch (e) {
          return NextResponse.json(
            { error: "CSRF check failed: Malformed Origin header" },
            { status: 403 }
          );
        }
      }
    }
  }

  // 2. Authentication Gate
  // If no secret configured, allow everything (default zero-friction LAN mode)
  if (!secret) {
    // If no secret is configured and user visits /login, redirect to dashboard
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Check if requested path is public
  const isPublic = PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix)
  );

  // Authenticate request
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : undefined;
  const apiKey = request.headers.get("x-api-key") || undefined;
  const queryToken = request.nextUrl.searchParams.get("token") || undefined;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const expectedSessionToken = await deriveSessionToken(secret);

  const isAuthenticated =
    bearerToken === secret ||
    apiKey === secret ||
    queryToken === secret ||
    sessionCookie === expectedSessionToken ||
    sessionCookie === secret;

  // If authenticated and visiting /login, redirect to /
  if (pathname === "/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // If path is public, allow access regardless of auth state
  if (isPublic) {
    return NextResponse.next();
  }

  // If user is authenticated, proceed
  if (isAuthenticated) {
    return NextResponse.next();
  }

  // If unauthenticated:
  // For API endpoints, return 401 Unauthorized
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or missing authentication" },
      { status: 401 }
    );
  }

  // For Web UI pages, redirect to login page
  const loginUrl = new URL("/login", request.url);
  if (pathname !== "/") {
    loginUrl.searchParams.set("from", pathname);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     */
    "/((?!_next/static|_next/image).*)",
  ],
};
