export const SESSION_COOKIE_NAME = "plantstack_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const SESSION_TOKEN_PREFIX = "v1";
const MAX_REVOKED_SESSIONS = 10_000;

// ponytail: in-memory revocation map covers the active runtime isolate (resets on restart);
// upgrade path is storing a monotonic sessionEpoch / revoked-jti table in SQLite.
const revokedSessions = new Map<string, number>();

const encoder = new TextEncoder();

export function getAuthSecret(): string | undefined {
  const secret = process.env.PLANTSTACK_API_SECRET;
  if (!secret || secret.trim() === "") {
    return undefined;
  }
  return secret.trim();
}

export function getStatusToken(): string | undefined {
  const token = process.env.PLANTSTACK_STATUS_TOKEN;
  if (!token || token.trim() === "") {
    return undefined;
  }
  return token.trim();
}

export function isAuthRequired(): boolean {
  return getAuthSecret() !== undefined;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Constant-time equality over SHA-256 digests so secret length cannot leak via timing.
 */
export async function constantTimeEqual(a: string, b: string): Promise<boolean> {
  const [hashA, hashB] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);
  const viewA = new Uint8Array(hashA);
  const viewB = new Uint8Array(hashB);
  let diff = 0;
  for (let i = 0; i < viewA.length; i++) {
    diff |= viewA[i] ^ viewB[i];
  }
  return diff === 0;
}

async function signSessionPayload(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(`plantstack-session-hmac:${secret}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return bytesToHex(new Uint8Array(sig));
}

function pruneRevokedSessions(nowSec: number): void {
  revokedSessions.forEach((exp, jti) => {
    if (exp <= nowSec) {
      revokedSessions.delete(jti);
    }
  });
  while (revokedSessions.size >= MAX_REVOKED_SESSIONS) {
    const oldest = revokedSessions.keys().next();
    if (oldest.done) break;
    revokedSessions.delete(oldest.value);
  }
}

/**
 * Generates a unique, signed, expiring session token (`v1.<jti>.<exp>.<hmac>`).
 */
export async function createSessionToken(secret: string): Promise<string> {
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  const jti = bytesToHex(randomBytes);
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const payload = `${SESSION_TOKEN_PREFIX}.${jti}.${exp}`;
  const signature = await signSessionPayload(payload, secret);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(
  token: string | null | undefined,
  secret: string
): Promise<{ valid: boolean; jti?: string; exp?: number }> {
  if (!token) return { valid: false };
  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== SESSION_TOKEN_PREFIX) {
    return { valid: false };
  }

  const [, jti, expStr, providedSig] = parts;
  if (!/^[a-f0-9]{32}$/.test(jti) || !/^\d{1,12}$/.test(expStr) || !/^[a-f0-9]{64}$/.test(providedSig)) {
    return { valid: false };
  }

  const exp = Number(expStr);
  const nowSec = Math.floor(Date.now() / 1000);
  if (!Number.isSafeInteger(exp) || exp <= nowSec) {
    return { valid: false };
  }

  const revokedExp = revokedSessions.get(jti);
  if (revokedExp !== undefined) {
    return { valid: false };
  }

  const payload = `${SESSION_TOKEN_PREFIX}.${jti}.${expStr}`;
  const expectedSig = await signSessionPayload(payload, secret);
  if (!(await constantTimeEqual(providedSig, expectedSig))) {
    return { valid: false };
  }

  return { valid: true, jti, exp };
}

export async function revokeSessionToken(
  token: string | null | undefined,
  secret: string
): Promise<void> {
  const verified = await verifySessionToken(token, secret);
  if (!verified.valid || !verified.jti || !verified.exp) return;
  const nowSec = Math.floor(Date.now() / 1000);
  pruneRevokedSessions(nowSec);
  revokedSessions.set(verified.jti, verified.exp);
}

/**
 * Validates a signed session cookie value (never accepts raw secrets).
 */
export async function isValidSession(
  token: string | null | undefined,
  secret: string
): Promise<boolean> {
  const result = await verifySessionToken(token, secret);
  return result.valid;
}

/**
 * Validates an API header credential (Bearer / X-API-Key / status token) in constant time.
 */
export async function isValidApiCredential(
  token: string | null | undefined,
  secret: string
): Promise<boolean> {
  if (!token) return false;
  return constantTimeEqual(token, secret);
}

/**
 * Ensures post-login redirects remain strictly single-slash relative same-origin paths.
 */
export function sanitizeRedirectPath(raw: string | null | undefined): string {
  if (!raw || typeof raw !== "string") return "/";
  const trimmed = raw.trim();
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.startsWith("/\\") ||
    /[\x00-\x1f\x7f\\]/.test(trimmed)
  ) {
    return "/";
  }
  try {
    const parsed = new URL(trimmed, "http://localhost");
    if (parsed.origin !== "http://localhost" || !parsed.pathname.startsWith("/")) {
      return "/";
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "/";
  }
}
