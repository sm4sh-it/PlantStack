import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  SESSION_COOKIE_NAME,
  constantTimeEqual,
  getAuthSecret,
  getStatusToken,
  isValidApiCredential,
  isValidSession,
  revokeSessionToken,
  sanitizeRedirectPath,
} from "@/lib/auth";

// Route prefixes (matched only at segment boundary) and root static files exempt from auth
const PUBLIC_ROUTE_PREFIXES = [
  "/_next",
  "/api/auth",
  "/login",
];

const BACKUP_MAX_CONTENT_LENGTH = 151 * 1024 * 1024; // 150 MB archive + multipart boundary overhead
const IMAGE_UPLOAD_MAX_CONTENT_LENGTH = 11 * 1024 * 1024; // 10 MB image + multipart boundary overhead

const PUBLIC_ASSET_BASES = [
  "/favicon",
  "/icon",
  "/apple-touch-icon",
  "/logo",
];

const MUTATING_METHODS = new Set(["POST", "PUT", "DELETE", "PATCH"]);

// ponytail: in-memory fixed-window throttle for Edge auth header/token attempts; bounded at MAX_ATTEMPT_KEYS
const AUTH_WINDOW_MS = 60_000;
const AUTH_PER_KEY_LIMIT = 20;
const AUTH_GLOBAL_LIMIT = 120;
const MAX_ATTEMPT_KEYS = 2000;
const authAttempts = new Map<string, { count: number; resetAt: number }>();

function isPublicPath(pathname: string): boolean {
  if (
    PUBLIC_ROUTE_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )
  ) {
    return true;
  }
  if (pathname === "/manifest.json") {
    return true;
  }
  if (!pathname.slice(1).includes("/")) {
    return PUBLIC_ASSET_BASES.some(
      (base) =>
        pathname === base ||
        pathname.startsWith(`${base}.`) ||
        pathname.startsWith(`${base}-`)
    );
  }
  return false;
}

function getEffectiveProtocol(request: NextRequest, trustProxy: boolean): string {
  if (trustProxy) {
    const forwardedProto = request.headers
      .get("x-forwarded-proto")
      ?.split(",")
      .pop()
      ?.trim()
      .toLowerCase();
    if (forwardedProto === "http" || forwardedProto === "https") {
      return `${forwardedProto}:`;
    }
  }
  return request.nextUrl.protocol === "https:" ? "https:" : "http:";
}

function tryNormalizeOrigin(rawHost: string | undefined, proto: string): string | null {
  if (!rawHost) return null;
  try {
    const parsed = new URL(`${proto}//${rawHost.trim()}`);
    return parsed.host ? parsed.origin : null;
  } catch {
    return null;
  }
}

function getAllowedOrigins(request: NextRequest): Set<string> {
  const trustProxy = process.env.PLANTSTACK_TRUST_PROXY === "true";
  const proto = getEffectiveProtocol(request, trustProxy);
  const allowed = new Set<string>();

  const hostOrigin = tryNormalizeOrigin(request.headers.get("host") || undefined, proto);
  if (hostOrigin) {
    allowed.add(hostOrigin);
  }

  if (trustProxy) {
    const forwardedHost = request.headers
      .get("x-forwarded-host")
      ?.split(",")
      .pop()
      ?.trim();
    const forwardedOrigin = tryNormalizeOrigin(forwardedHost, proto);
    if (forwardedOrigin) {
      allowed.add(forwardedOrigin);
    }
  }

  const publicOriginEnv = process.env.PLANTSTACK_PUBLIC_ORIGIN;
  if (publicOriginEnv) {
    for (const candidate of publicOriginEnv.split(",")) {
      const trimmed = candidate.trim();
      if (!trimmed) continue;
      try {
        const parsed = new URL(trimmed);
        if (
          (parsed.protocol === "http:" || parsed.protocol === "https:") &&
          parsed.host
        ) {
          allowed.add(parsed.origin);
        }
      } catch {
        // Ignore invalid configured origin entries
      }
    }
  }

  return allowed;
}

function parseHttpOrigin(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    if (
      (parsed.protocol !== "http:" && parsed.protocol !== "https:") ||
      !parsed.host
    ) {
      return null;
    }
    return parsed.origin;
  } catch {
    return null;
  }
}

function bumpAttemptBucket(key: string, now: number, limit: number): boolean {
  const existing = authAttempts.get(key);
  if (!existing || now > existing.resetAt) {
    if (authAttempts.size >= MAX_ATTEMPT_KEYS) {
      authAttempts.forEach((v, k) => {
        if (now > v.resetAt) authAttempts.delete(k);
      });
      if (authAttempts.size >= MAX_ATTEMPT_KEYS) {
        const oldestKey = authAttempts.keys().next().value;
        if (oldestKey !== undefined) authAttempts.delete(oldestKey);
      }
    }
    authAttempts.set(key, { count: 1, resetAt: now + AUTH_WINDOW_MS });
    return true;
  }
  if (existing.count >= limit) {
    return false;
  }
  existing.count += 1;
  return true;
}

function isAttemptAllowed(request: NextRequest): boolean {
  const now = Date.now();
  const trustProxy = process.env.PLANTSTACK_TRUST_PROXY === "true";
  const clientKey = trustProxy
    ? request.headers.get("x-forwarded-for")?.split(",").pop()?.trim() ||
      request.headers.get("x-real-ip")?.trim() ||
      "proxy"
    : "direct";

  const perKeyOk = bumpAttemptBucket(`ip:${clientKey}`, now, AUTH_PER_KEY_LIMIT);
  const globalOk = bumpAttemptBucket("__global__", now, AUTH_GLOBAL_LIMIT);
  return perKeyOk && globalOk;
}

function checkUploadContentLength(
  request: NextRequest,
  pathname: string
): NextResponse | null {
  if (request.method !== "POST") return null;
  const contentLengthHeader = request.headers.get("content-length");
  if (!contentLengthHeader) return null;
  const contentLength = Number(contentLengthHeader);
  if (!Number.isFinite(contentLength)) return null;

  if (
    pathname === "/api/backup/import" &&
    contentLength > BACKUP_MAX_CONTENT_LENGTH
  ) {
    return NextResponse.json(
      { error: "Backup archive exceeds the 150 MB upload limit" },
      { status: 413 }
    );
  }
  if (
    (pathname === "/api/upload" ||
      /^\/api\/plants\/[^/]+\/photos$/.test(pathname)) &&
    contentLength > IMAGE_UPLOAD_MAX_CONTENT_LENGTH
  ) {
    return NextResponse.json(
      { error: "Image upload exceeds the 10 MB size limit" },
      { status: 413 }
    );
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = getAuthSecret();
  const statusToken = getStatusToken();

  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim() || undefined
    : undefined;
  const apiKey = request.headers.get("x-api-key")?.trim() || undefined;
  const queryToken = request.nextUrl.searchParams.get("token")?.trim() || undefined;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // 1. CSRF protection for state-changing requests (exempt only login; logout stays protected)
  if (MUTATING_METHODS.has(request.method) && pathname !== "/api/auth/login") {
    const hasValidApiAuth = Boolean(
      secret &&
        ((bearerToken && (await isValidApiCredential(bearerToken, secret))) ||
          (apiKey && (await isValidApiCredential(apiKey, secret))))
    );

    if (!hasValidApiAuth) {
      const secFetchSite = request.headers.get("sec-fetch-site");
      if (secFetchSite === "cross-site" || secFetchSite === "same-site") {
        return NextResponse.json(
          { error: "CSRF check failed: Cross-site request blocked" },
          { status: 403 }
        );
      }

      const allowedOrigins = getAllowedOrigins(request);
      const origin = request.headers.get("origin");
      if (origin !== null) {
        const normalizedOrigin = parseHttpOrigin(origin);
        if (!normalizedOrigin || !allowedOrigins.has(normalizedOrigin)) {
          return NextResponse.json(
            { error: "CSRF check failed: Origin does not match allowed host" },
            { status: 403 }
          );
        }
      } else {
        const referer = request.headers.get("referer");
        if (referer) {
          const normalizedReferer = parseHttpOrigin(referer);
          if (!normalizedReferer || !allowedOrigins.has(normalizedReferer)) {
            return NextResponse.json(
              { error: "CSRF check failed: Referer does not match allowed host" },
              { status: 403 }
            );
          }
        }
      }
    }
  }

  // Revoke session token inside Edge VM on verified logout POST before forwarding to Node handler
  if (
    request.method === "POST" &&
    pathname === "/api/auth/logout" &&
    secret &&
    sessionCookie
  ) {
    await revokeSessionToken(sessionCookie, secret);
  }

  // 2. Authentication Gate
  // If no secret configured, allow everything (default zero-friction LAN mode)
  if (!secret) {
    if (pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    const sizeRejection = checkUploadContentLength(request, pathname);
    if (sizeRejection) return sizeRejection;
    return NextResponse.next();
  }

  const isPublic = isPublicPath(pathname);

  const hasValidSession = sessionCookie
    ? await isValidSession(sessionCookie, secret)
    : false;
  const hasValidApiAuth =
    (bearerToken ? await isValidApiCredential(bearerToken, secret) : false) ||
    (apiKey ? await isValidApiCredential(apiKey, secret) : false);

  // ?token= and statusToken are strictly scoped to read-only GET /api/plants/status
  const isStatusRoute =
    request.method === "GET" && pathname === "/api/plants/status";
  const hasValidStatusAuth =
    isStatusRoute &&
    Boolean(statusToken) &&
    Boolean(
      (queryToken && (await constantTimeEqual(queryToken, statusToken!))) ||
        (bearerToken && (await constantTimeEqual(bearerToken, statusToken!))) ||
        (apiKey && (await constantTimeEqual(apiKey, statusToken!)))
    );

  const isAuthenticated = hasValidSession || hasValidApiAuth || hasValidStatusAuth;

  if (pathname === "/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (isPublic) {
    return NextResponse.next();
  }

  if (isAuthenticated) {
    const sizeRejection = checkUploadContentLength(request, pathname);
    if (sizeRejection) return sizeRejection;
    return NextResponse.next();
  }

  // Throttle repeated failed header/query-token attempts
  if ((bearerToken || apiKey || queryToken) && !isAttemptAllowed(request)) {
    return NextResponse.json(
      { error: "Too many failed authentication attempts" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: "Unauthorized: Invalid or missing authentication" },
      { status: 401 }
    );
  }

  const loginUrl = new URL("/login", request.url);
  const safeFrom = sanitizeRedirectPath(pathname);
  if (safeFrom !== "/") {
    loginUrl.searchParams.set("from", safeFrom);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image).*)",
  ],
};
