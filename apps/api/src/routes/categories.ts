import { Hono } from "hono";
import { requireSession } from "../middleware/session.ts";
import { getAllCategories } from "../data-access/categories.ts";
import type { AppEnv } from "../lib/hono.ts";

export const categoriesRouter = new Hono<AppEnv>()
  /**
   * GET /v1/categories
   * Returns all expense categories (seeded defaults + user-added ones).
   */
  .get("/", requireSession, async (c) => {
    const cats = await getAllCategories();
    return c.json({ data: cats });
  });
