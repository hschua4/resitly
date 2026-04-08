import { db } from "../db/index.ts";
import { invoices, invoiceLineItems, categories } from "../db/schema/index.ts";
import { eq, and, gte, lte, sql, sum, count } from "drizzle-orm";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export async function getDashboardSummary(userId: string) {
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd   = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd   = endOfMonth(subMonths(now, 1));

  const [thisMonth, lastMonth, totalCount] = await Promise.all([
    // This month
    db
      .select({
        total: sql<string>`COALESCE(SUM(${invoices.total}), 0)::text`,
        count: count(),
      })
      .from(invoices)
      .where(
        and(
          eq(invoices.userId, userId),
          gte(invoices.invoiceDate, thisMonthStart),
          lte(invoices.invoiceDate, thisMonthEnd)
        )
      ),
    // Last month
    db
      .select({
        total: sql<string>`COALESCE(SUM(${invoices.total}), 0)::text`,
        count: count(),
      })
      .from(invoices)
      .where(
        and(
          eq(invoices.userId, userId),
          gte(invoices.invoiceDate, lastMonthStart),
          lte(invoices.invoiceDate, lastMonthEnd)
        )
      ),
    // All time count
    db
      .select({ count: count() })
      .from(invoices)
      .where(eq(invoices.userId, userId)),
  ]);

  const thisMonthTotal = parseFloat(thisMonth[0]?.total ?? "0");
  const thisMonthCount = thisMonth[0]?.count ?? 0;
  const lastMonthTotal = parseFloat(lastMonth[0]?.total ?? "0");
  const lastMonthCount = lastMonth[0]?.count ?? 0;
  const total          = totalCount[0]?.count ?? 0;
  const avg = thisMonthCount > 0 ? (thisMonthTotal / thisMonthCount).toFixed(2) : "0.00";

  return {
    totalSpendThisMonth:   thisMonthTotal.toFixed(2),
    totalSpendLastMonth:   lastMonthTotal.toFixed(2),
    invoiceCountThisMonth: thisMonthCount,
    invoiceCountLastMonth: lastMonthCount,
    invoiceCountTotal:     total,
    avgPerInvoice:         avg,
  };
}

export async function getSpendByCategory(userId: string) {
  // Join line items → categories, group by category, sum amounts for this user's invoices
  const rows = await db
    .select({
      categoryId:    invoiceLineItems.categoryId,
      categoryName:  categories.name,
      categoryColor: categories.color,
      total:         sql<string>`COALESCE(SUM(${invoiceLineItems.amount}), 0)::text`,
    })
    .from(invoiceLineItems)
    .innerJoin(invoices, eq(invoiceLineItems.invoiceId, invoices.id))
    .leftJoin(categories, eq(invoiceLineItems.categoryId, categories.id))
    .where(eq(invoices.userId, userId))
    .groupBy(invoiceLineItems.categoryId, categories.name, categories.color)
    .orderBy(sql`SUM(${invoiceLineItems.amount}) DESC`);

  return rows.map((r) => ({
    categoryId:    r.categoryId ?? "uncategorized",
    categoryName:  r.categoryName ?? "Uncategorized",
    categoryColor: r.categoryColor ?? "#6b7280",
    total:         r.total,
  }));
}

export async function getSpendByMonth(userId: string) {
  // Last 12 months of spend grouped by month
  const twelveMonthsAgo = subMonths(new Date(), 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const rows = await db
    .select({
      month: sql<string>`TO_CHAR(${invoices.invoiceDate}, 'YYYY-MM')`,
      total: sql<string>`COALESCE(SUM(${invoices.total}), 0)::text`,
      count: count(),
    })
    .from(invoices)
    .where(
      and(
        eq(invoices.userId, userId),
        gte(invoices.invoiceDate, twelveMonthsAgo)
      )
    )
    .groupBy(sql`TO_CHAR(${invoices.invoiceDate}, 'YYYY-MM')`)
    .orderBy(sql`TO_CHAR(${invoices.invoiceDate}, 'YYYY-MM')`);

  return rows.map((r) => ({
    month: r.month,
    total: r.total,
    count: r.count,
  }));
}
