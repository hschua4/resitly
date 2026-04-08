import { createMiddleware } from "hono/factory";
import { auth } from "../auth.ts";
import { UnauthorizedError } from "../lib/errors.ts";
import type { AppEnv, AppUser, AppSession } from "../lib/hono.ts";

/**
 * Attaches the current session/user to context (if any).
 * Does NOT reject unauthenticated requests — use requireSession for that.
 */
export const sessionMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (session?.user) {
    c.set("user", session.user as AppUser);
    c.set("session", session.session as AppSession);
  }
  await next();
});

/**
 * Rejects unauthenticated requests with 401.
 */
export const requireSession = createMiddleware<AppEnv>(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session?.user) {
    throw new UnauthorizedError();
  }
  c.set("user", session.user as AppUser);
  c.set("session", session.session as AppSession);
  await next();
});
