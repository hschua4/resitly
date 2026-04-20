import { Hono } from "hono";
import { requireSession } from "../middleware/session.ts";
import { createRateLimit } from "../middleware/rate-limit.ts";
import { getAllCategories } from "../data-access/categories.ts";
import type { AppEnv } from "../lib/hono.ts";

export const categoriesRouter = new Hono<AppEnv>()
  .use("*", requireSession)
  .use("*", createRateLimit({ limit: 60, windowMs: 60_000, keyPrefix: "rl:categories" }))
  /**
   * GET /v1/categories
   * Returns all expense categories (seeded defaults + user-added ones).
   */
  .get("/", async (c) => {
    const cats = await getAllCategories();
    return c.json({ data: cats });
  });
