import { createMiddleware } from "hono/factory";
import type { Context } from "hono";
import type { AppEnv } from "../lib/hono.ts";
import { defaultStore, type RateLimiterStore } from "../lib/rate-limiter.ts";

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
  keyPrefix: string;
  store?: RateLimiterStore;
}

function getClientIp(c: Context): string {
  return (
    c.req.header("cf-connecting-ip") ??
    c.req.header("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}

export function createRateLimit(config: RateLimitConfig) {
  const store = config.store ?? defaultStore;

  return createMiddleware<AppEnv>(async (c, next) => {
    const userId = c.get("user")?.id;
    const identifier = userId ? `user:${userId}` : `ip:${getClientIp(c)}`;
    const key = `${config.keyPrefix}:${identifier}`;

    const { count, resetAt } = await store.increment(key, config.windowMs);
    const remaining = Math.max(0, config.limit - count);
    const resetSec = Math.ceil(resetAt / 1000);

    c.header("X-RateLimit-Limit", String(config.limit));
    c.header("X-RateLimit-Remaining", String(remaining));
    c.header("X-RateLimit-Reset", String(resetSec));

    if (count > config.limit) {
      const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
      c.header("Retry-After", String(retryAfter));
      return c.json({ error: "Too many requests", code: "RATE_LIMIT_EXCEEDED" }, 429);
    }

    await next();
  });
}
