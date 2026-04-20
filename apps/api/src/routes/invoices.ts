import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { requireSession } from "../middleware/session.ts";
import { createRateLimit } from "../middleware/rate-limit.ts";
import { NotFoundError, ValidationError } from "../lib/errors.ts";
import {
  getInvoiceById,
  listInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  replaceLineItems,
  updateInvoiceStatus,
} from "../data-access/invoices.ts";
import { deleteObject } from "../lib/r2.ts";
import type { AppEnv } from "../lib/hono.ts";
import {
  CreateInvoiceSchema,
  UpdateInvoiceSchema,
  InvoiceFiltersSchema,
} from "@resitly/types";

export const invoicesRouter = new Hono<AppEnv>()
  .use("*", requireSession)
  .use("*", createRateLimit({ limit: 60, windowMs: 60_000, keyPrefix: "rl:invoices" }))
  /**
   * GET /v1/invoices
   * List invoices with optional filters.
   */
  .get(
    "/",
    zValidator("query", InvoiceFiltersSchema),
    async (c) => {
      const user    = c.get("user");
      const filters = c.req.valid("query");
      const result  = await listInvoices(user.id, filters);
      return c.json(result);
    }
  )

  /**
   * POST /v1/invoices
   * Create an invoice record after R2 upload.
   */
  .post(
    "/",
    zValidator("json", CreateInvoiceSchema),
    async (c) => {
      const user = c.get("user");
      const body = c.req.valid("json");
      const invoice = await createInvoice({ userId: user.id, ...body });
      return c.json({ data: invoice }, 201);
    }
  )

  /**
   * GET /v1/invoices/:id
   * Single invoice with line items and categories.
   */
  .get("/:id", async (c) => {
    const user    = c.get("user");
    const id      = c.req.param("id");
    const invoice = await getInvoiceById(id, user.id);
    if (!invoice) throw new NotFoundError("Invoice");
    return c.json({ data: invoice });
  })

  /**
   * PATCH /v1/invoices/:id
   * Update invoice fields (review edits).
   */
  .patch(
    "/:id",
    zValidator("json", UpdateInvoiceSchema),
    async (c) => {
      const user = c.get("user");
      const id   = c.req.param("id");
      const body = c.req.valid("json");

      const { lineItems, ...invoiceFields } = body;

      // Update invoice fields
      const updated = await updateInvoice(id, user.id, {
        vendor:      invoiceFields.vendor,
        invoiceDate: invoiceFields.invoiceDate ? new Date(invoiceFields.invoiceDate) : undefined,
        invoiceNo:   invoiceFields.invoiceNo ?? undefined,
        currency:    invoiceFields.currency,
        subtotal:    invoiceFields.subtotal ?? undefined,
        taxType:     invoiceFields.taxType ?? undefined,
        taxRate:     invoiceFields.taxRate ?? undefined,
        taxAmount:   invoiceFields.taxAmount ?? undefined,
        total:       invoiceFields.total ?? undefined,
        notes:       invoiceFields.notes ?? undefined,
      });

      if (!updated) throw new NotFoundError("Invoice");

      // Replace line items if provided
      if (lineItems !== undefined) {
        await replaceLineItems(id, lineItems);
      }

      const fresh = await getInvoiceById(id, user.id);
      return c.json({ data: fresh });
    }
  )

  /**
   * PATCH /v1/invoices/:id/confirm
   * Mark invoice as reviewed.
   */
  .patch("/:id/confirm", async (c) => {
    const user = c.get("user");
    const id   = c.req.param("id");

    const invoice = await getInvoiceById(id, user.id);
    if (!invoice) throw new NotFoundError("Invoice");
    if (invoice.status !== "review") {
      throw new ValidationError("Only invoices in 'review' state can be confirmed");
    }

    await updateInvoiceStatus(id, "reviewed");
    const fresh = await getInvoiceById(id, user.id);
    return c.json({ data: fresh });
  })

  /**
   * DELETE /v1/invoices/:id
   * Delete invoice and its R2 file.
   */
  .delete("/:id", async (c) => {
    const user    = c.get("user");
    const id      = c.req.param("id");
    const invoice = await getInvoiceById(id, user.id);
    if (!invoice) throw new NotFoundError("Invoice");

    await deleteInvoice(id, user.id);

    // Best-effort R2 cleanup — don't fail if file is already gone
    await deleteObject(invoice.fileKey).catch((err) => {
      console.warn("[r2] failed to delete file", invoice.fileKey, err);
    });

    return c.json({ data: { id } });
  });
