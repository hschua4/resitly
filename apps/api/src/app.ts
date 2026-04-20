import { Hono } from "hono";
import { corsMiddleware } from "./middleware/cors.ts";
import { createRateLimit } from "./middleware/rate-limit.ts";
import { auth } from "./auth.ts";
import { AppError } from "./lib/errors.ts";
import type { AppEnv } from "./lib/hono.ts";
import { uploadsRouter } from "./routes/uploads.ts";
import { invoicesRouter } from "./routes/invoices.ts";
import { extractRouter } from "./routes/extract.ts";
import { categoriesRouter } from "./routes/categories.ts";
import { dashboardRouter } from "./routes/dashboard.ts";
import { exportRouter } from "./routes/export.ts";

/**
 * Creates and configures the Hono application instance.
 */
export function createApp() {
  const app = new Hono<AppEnv>();

  // ── Global middleware ─────────────────────────────────────
  app.use("*", corsMiddleware);
  app.use("*", createRateLimit({ limit: 300, windowMs: 60_000, keyPrefix: "rl:global" }));

  // ── Better Auth routes ────────────────────────────────────
  app.use("/api/auth/**", createRateLimit({ limit: 10, windowMs: 60_000, keyPrefix: "rl:auth" }));
  app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

  // ── Health check ──────────────────────────────────────────
  app.get("/v1/health", (c) =>
    c.json({ status: "ok", timestamp: new Date().toISOString() })
  );

  // ── API routes (user-scoped, no org prefix in v1) ─────────
  app.route("/v1/uploads",   uploadsRouter);
  app.route("/v1/invoices",  invoicesRouter);
  app.route("/v1/invoices",  extractRouter);   // POST /v1/invoices/:id/extract
  app.route("/v1/categories", categoriesRouter);
  app.route("/v1/dashboard", dashboardRouter);
  app.route("/v1/export",    exportRouter);

  // ── 404 handler ───────────────────────────────────────────
  app.notFound((c) =>
    c.json({ error: "Not found", code: "NOT_FOUND" }, 404)
  );

  // ── Global error handler ──────────────────────────────────
  app.onError((err, c) => {
    if (err instanceof AppError) {
      return c.json(
        { error: err.message, code: err.code },
        err.statusCode as Parameters<typeof c.json>[1]
      );
    }
    console.error("[unhandled error]", err);
    return c.json({ error: "Internal server error" }, 500);
  });

  return app;
}
