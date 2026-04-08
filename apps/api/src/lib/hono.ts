import type { users, sessions } from "../db/schema/index.ts";

// ── Inferred DB types ─────────────────────────────────────────
export type AppUser    = typeof users.$inferSelect;
export type AppSession = typeof sessions.$inferSelect;

/**
 * Shared Hono environment type.
 * Provides typed access to context variables set by session middleware.
 * Apply to all routers: new Hono<AppEnv>()
 */
export type AppEnv = {
  Variables: {
    user:    AppUser;
    session: AppSession;
  };
};
