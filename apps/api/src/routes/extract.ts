import { Hono } from "hono";
import { requireSession } from "../middleware/session.ts";
import { createRateLimit } from "../middleware/rate-limit.ts";
import { NotFoundError, ValidationError } from "../lib/errors.ts";
import {
  getInvoiceById,
  updateInvoice,
  updateInvoiceStatus,
  replaceLineItems,
} from "../data-access/invoices.ts";
import { getAllCategories } from "../data-access/categories.ts";
import { fetchFileBuffer } from "../lib/r2.ts";
import { extractFromFile } from "../use-cases/ai-extract.ts";
import type { AppEnv } from "../lib/hono.ts";

const extractRateLimit = createRateLimit({ limit: 5, windowMs: 10 * 60_000, keyPrefix: "rl:extract" });

export const extractRouter = new Hono<AppEnv>()
  .use("*", requireSession)
  /**
   * POST /v1/invoices/:id/extract
   *
   * Fetches the invoice file from R2, sends it to Gemini for extraction,
   * then stores the structured results and transitions status to "review".
   * On failure, reverts status to "pending" so the user can retry.
   */
  .post("/:id/extract", extractRateLimit, async (c) => {
    const user = c.get("user");
    const id   = c.req.param("id");

    const invoice = await getInvoiceById(id, user.id);
    if (!invoice) throw new NotFoundError("Invoice");

    // Only allow extraction from pending or review state (re-extraction)
    if (invoice.status === "extracting") {
      throw new ValidationError("Extraction already in progress");
    }
    if (invoice.status === "reviewed" || invoice.status === "exported") {
      throw new ValidationError("Invoice already confirmed — re-extract is not available");
    }

    // Mark as extracting
    await updateInvoiceStatus(id, "extracting");

    try {
      // Fetch file buffer from R2
      const fileBuffer = await fetchFileBuffer(invoice.fileKey);

      // Extract with Gemini
      const result = await extractFromFile(fileBuffer, invoice.fileType);

      // Resolve category slugs → IDs
      const allCategories = await getAllCategories();
      const categoryMap   = new Map(allCategories.map((cat) => [cat.slug, cat.id]));

      // Update invoice with extracted data + set status to "review"
      await updateInvoice(id, user.id, {
        status:       "review",
        vendor:       result.vendor ?? undefined,
        invoiceDate:  result.invoiceDate ? new Date(result.invoiceDate) : undefined,
        invoiceNo:    result.invoiceNo ?? undefined,
        currency:     result.currency,
        subtotal:     result.subtotal ?? undefined,
        taxType:      result.taxType ?? undefined,
        taxRate:      result.taxRate ?? undefined,
        taxAmount:    result.taxAmount ?? undefined,
        total:        result.total ?? undefined,
        aiConfidence: String(result.confidence),
        extractionRaw: JSON.stringify(result),
      });

      // Replace line items with extracted ones
      if (result.lineItems.length > 0) {
        await replaceLineItems(
          id,
          result.lineItems.map((item, i) => ({
            categoryId:  categoryMap.get(item.suggestedCategory) ?? null,
            description: item.description,
            quantity:    item.quantity,
            unitPrice:   item.unitPrice ?? null,
            amount:      item.amount,
            sortOrder:   String(i),
          }))
        );
      }

      const fresh = await getInvoiceById(id, user.id);
      return c.json({ data: fresh });

    } catch (err) {
      // Revert to pending on failure so user can retry
      await updateInvoiceStatus(id, "pending");
      console.error("[extract] AI extraction failed for invoice", id, err);
      throw err;
    }
  });
