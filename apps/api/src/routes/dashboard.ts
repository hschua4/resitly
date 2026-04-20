import { Hono } from "hono";
import { requireSession } from "../middleware/session.ts";
import { createRateLimit } from "../middleware/rate-limit.ts";
import {
  getDashboardSummary,
  getSpendByCategory,
  getSpendByMonth,
} from "../data-access/dashboard.ts";
import type { AppEnv } from "../lib/hono.ts";

export const dashboardRouter = new Hono<AppEnv>()
  .use("*", requireSession)
  .use("*", createRateLimit({ limit: 30, windowMs: 60_000, keyPrefix: "rl:dashboard" }))
  /**
   * GET /v1/dashboard/summary
   * Total spend this month, last month, counts, avg per invoice.
   */
  .get("/summary", async (c) => {
    const user    = c.get("user");
    const summary = await getDashboardSummary(user.id);
    return c.json({ data: summary });
  })

  /**
   * GET /v1/dashboard/by-category
   * Spend grouped by category for pie chart.
   */
  .get("/by-category", async (c) => {
    const user = c.get("user");
    const data = await getSpendByCategory(user.id);
    return c.json({ data });
  })

  /**
   * GET /v1/dashboard/by-month
   * Spend grouped by month, last 12 months, for bar chart.
   */
  .get("/by-month", async (c) => {
    const user = c.get("user");
    const data = await getSpendByMonth(user.id);
    return c.json({ data });
  });
