import type { NextRequest } from "next/server";

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// ponytail: process-local bounded Map caps rate-limit memory per runtime isolate;
// multi-instance deployments would need a shared store such as Redis.
const MAX_RATE_LIMIT_ENTRIES = 5000;
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute
const rateLimitStore = new Map<string, RateLimitRecord>();
let lastCleanup = Date.now();

function cleanupStore(now: number, force: boolean = false): void {
  if (!force && now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  rateLimitStore.forEach((record, key) => {
    if (now > record.resetAt) {
      rateLimitStore.delete(key);
    }
  });
}

function sanitizeIpToken(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length > 45) return null;
  if (!/^[0-9a-fA-F:.]+$/.test(trimmed)) return null;
  return trimmed;
}

export function getClientIp(req: NextRequest): string {
  if (process.env.PLANTSTACK_TRUST_PROXY !== "true") {
    return "direct";
  }

  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const proxyHop = sanitizeIpToken(forwardedFor.split(",").pop());
    if (proxyHop) return proxyHop;
  }

  const realIp = sanitizeIpToken(req.headers.get("x-real-ip") || undefined);
  if (realIp) return realIp;

  return "proxy";
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
}

/**
 * In-memory rate limiter using a fixed window with bounded capacity.
 * @param key Identifier (e.g. IP address + route name)
 * @param limit Max allowed requests within windowMs
 * @param windowMs Time window in milliseconds (default 60s)
 */
export function checkRateLimit(
  key: string,
  limit: number = 30,
  windowMs: number = 60 * 1000
): RateLimitResult {
  const now = Date.now();
  cleanupStore(now);

  const existing = rateLimitStore.get(key);
  if (!existing || now > existing.resetAt) {
    if (existing) {
      rateLimitStore.delete(key);
    }
    if (rateLimitStore.size >= MAX_RATE_LIMIT_ENTRIES) {
      cleanupStore(now, true);
      while (rateLimitStore.size >= MAX_RATE_LIMIT_ENTRIES) {
        const oldest = rateLimitStore.keys().next();
        if (oldest.done) break;
        rateLimitStore.delete(oldest.value);
      }
    }

    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      allowed: true,
      remaining: Math.max(0, limit - 1),
      resetSeconds: Math.max(1, Math.ceil(windowMs / 1000)),
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, limit - existing.count),
    resetSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
  };
}
