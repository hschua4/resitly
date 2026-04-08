import { db } from "../db/index.ts";
import {
  invoices,
  invoiceLineItems,
  categories,
} from "../db/schema/index.ts";
import { eq, desc, and, gte, lte, like, inArray, sql, count } from "drizzle-orm";
import type { InvoiceFilters, ExportFilters } from "@resitly/types";

// ── Get invoice by ID (with line items) ──────────────────────
export async function getInvoiceById(id: string, userId: string) {
  const rows = await db.query.invoices.findFirst({
    where: and(eq(invoices.id, id), eq(invoices.userId, userId)),
    with: {
      lineItems: {
        with: { category: true },
        orderBy: (li, { asc }) => [asc(li.sortOrder)],
      },
    },
  });
  return rows ?? null;
}

// ── List invoices with filters ────────────────────────────────
export async function listInvoices(userId: string, filters: InvoiceFilters) {
  const { status, vendor, dateFrom, dateTo, categoryId, page, limit } = filters;
  const offset = (page - 1) * limit;

  // Build WHERE conditions
  const conditions = [eq(invoices.userId, userId)];
  if (status)   conditions.push(eq(invoices.status, status));
  if (vendor)   conditions.push(like(invoices.vendor, `%${vendor}%`));
  if (dateFrom) conditions.push(gte(invoices.invoiceDate, new Date(dateFrom)));
  if (dateTo)   conditions.push(lte(invoices.invoiceDate, new Date(dateTo)));

  // If filtering by category, we need a subquery for invoice IDs
  let invoiceIds: string[] | undefined;
  if (categoryId) {
    const items = await db
      .select({ invoiceId: invoiceLineItems.invoiceId })
      .from(invoiceLineItems)
      .where(eq(invoiceLineItems.categoryId, categoryId));
    invoiceIds = [...new Set(items.map((i) => i.invoiceId))];
    if (invoiceIds.length === 0) return { data: [], total: 0, page, limit, totalPages: 0 };
    conditions.push(inArray(invoices.id, invoiceIds));
  }

  const where = and(...conditions);

  const [rows, countResult] = await Promise.all([
    db.query.invoices.findMany({
      where,
      orderBy: [desc(invoices.createdAt)],
      limit,
      offset,
      with: {
        lineItems: {
          with: { category: true },
          limit: 1,
          orderBy: (li, { asc }) => [asc(li.sortOrder)],
        },
      },
    }),
    db.select({ count: count() }).from(invoices).where(where),
  ]);

  const total = countResult[0]?.count ?? 0;
  return {
    data: rows,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// ── Create invoice ────────────────────────────────────────────
export async function createInvoice(data: {
  userId:       string;
  fileKey:      string;
  fileUrl:      string;
  fileType:     string;
  originalName: string;
}) {
  const rows = await db.insert(invoices).values(data).returning();
  return rows[0]!;
}

// ── Update invoice fields ─────────────────────────────────────
export async function updateInvoice(
  id: string,
  userId: string,
  data: Partial<typeof invoices.$inferInsert>
) {
  const rows = await db
    .update(invoices)
    .set(data)
    .where(and(eq(invoices.id, id), eq(invoices.userId, userId)))
    .returning();
  return rows[0] ?? null;
}

// ── Update invoice status (internal) ─────────────────────────
export async function updateInvoiceStatus(
  id: string,
  status: "pending" | "extracting" | "review" | "reviewed" | "exported"
) {
  await db
    .update(invoices)
    .set({ status })
    .where(eq(invoices.id, id));
}

// ── Delete invoice ────────────────────────────────────────────
export async function deleteInvoice(id: string, userId: string) {
  const rows = await db
    .delete(invoices)
    .where(and(eq(invoices.id, id), eq(invoices.userId, userId)))
    .returning();
  return rows[0] ?? null;
}

// ── Upsert line items (replace all) ──────────────────────────
export async function replaceLineItems(
  invoiceId: string,
  items: Array<{
    categoryId?:  string | null;
    description:  string;
    quantity?:    string;
    unitPrice?:   string | null;
    amount:       string;
    sortOrder?:   string;
  }>
) {
  await db.transaction(async (tx) => {
    await tx.delete(invoiceLineItems).where(eq(invoiceLineItems.invoiceId, invoiceId));
    if (items.length > 0) {
      await tx.insert(invoiceLineItems).values(
        items.map((item, i) => ({
          invoiceId,
          categoryId:  item.categoryId ?? null,
          description: item.description,
          quantity:    item.quantity ?? "1",
          unitPrice:   item.unitPrice ?? null,
          amount:      item.amount,
          sortOrder:   item.sortOrder ?? String(i),
        }))
      );
    }
  });
}

// ── Get invoices for CSV export ───────────────────────────────
export async function getInvoicesForExport(userId: string, filters: ExportFilters) {
  const { dateFrom, dateTo, status, ids } = filters;

  const conditions = [eq(invoices.userId, userId)];
  if (status)   conditions.push(eq(invoices.status, status));
  if (dateFrom) conditions.push(gte(invoices.invoiceDate, new Date(dateFrom)));
  if (dateTo)   conditions.push(lte(invoices.invoiceDate, new Date(dateTo)));
  if (ids) {
    const idList = ids.split(",").map((s) => s.trim()).filter(Boolean);
    if (idList.length > 0) conditions.push(inArray(invoices.id, idList));
  }

  return db.query.invoices.findMany({
    where: and(...conditions),
    orderBy: [desc(invoices.invoiceDate)],
    with: {
      lineItems: {
        with: { category: true },
        orderBy: (li, { asc }) => [asc(li.sortOrder)],
      },
    },
  });
}
