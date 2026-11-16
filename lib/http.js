// Small helpers shared by route handlers: JSON responses, rate limiting, spam checks.
import { NextResponse } from "next/server";
import crypto from "node:crypto";

export const json = (data, status = 200) => NextResponse.json(data, { status });
export const fail = (message, status = 400, extra = {}) => NextResponse.json({ ok: false, error: message, ...extra }, { status });

export function clientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export const hashIp = (ip) =>
  crypto.createHash("sha256").update(ip + (process.env.AUTH_SECRET || "")).digest("hex").slice(0, 24);

// In-memory sliding-window rate limiter. Per-instance on serverless — good enough to
// blunt abuse; swap for Upstash/Redis for strict global limits.
const buckets = globalThis.__rateBuckets || (globalThis.__rateBuckets = new Map());

export function rateLimit(request, { key = "global", limit = 10, windowMs = 60_000 } = {}) {
  const id = `${key}:${clientIp(request)}`;
  const now = Date.now();
  const hits = (buckets.get(id) || []).filter((t) => now - t < windowMs);
  hits.push(now);
  buckets.set(id, hits);
  if (buckets.size > 5000) buckets.clear();
  return hits.length <= limit;
}

/** Honeypot + minimum fill-time spam check for public forms. */
export function looksLikeSpam(body) {
  if (body?.website) return true; // hidden field humans never fill
  const started = Number(body?.startedAt);
  if (started && Date.now() - started < 2500) return true; // submitted too fast
  return false;
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function dbUnavailable() {
  return fail("This form isn't accepting submissions just yet. Please try again soon.", 503, { code: "NO_DATABASE" });
}
