export const SESSION_COOKIE_NAME = "plantstack_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function getAuthSecret(): string | undefined {
  const secret = process.env.PLANTSTACK_API_SECRET;
  if (!secret || secret.trim() === "") {
    return undefined;
  }
  return secret.trim();
}

export function isAuthRequired(): boolean {
  return getAuthSecret() !== undefined;
}

/**
 * Derives a deterministic session hash from the secret using standard Web Crypto.
 */
export async function deriveSessionToken(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`plantstack-session:${secret}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Validates a session token or provided secret.
 */
export async function isValidSession(
  token: string | null | undefined,
  secret: string
): Promise<boolean> {
  if (!token) return false;
  const expected = await deriveSessionToken(secret);
  return token === expected || token === secret;
}
