import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { requireSession } from "../middleware/session.ts";
import { getInvoicesForExport } from "../data-access/invoices.ts";
import type { AppEnv } from "../lib/hono.ts";
import { ExportFiltersSchema } from "@resitly/types";
import { format } from "date-fns";

export const exportRouter = new Hono<AppEnv>()
  /**
   * GET /v1/export.csv
   * Download CSV of invoices with filters.
   */
  .get(
    "/",
    requireSession,
    zValidator("query", ExportFiltersSchema),
    async (c) => {
      const user    = c.get("user");
      const filters = c.req.valid("query");

      const invoicesData = await getInvoicesForExport(user.id, filters);

      // Build CSV rows — one row per line item, invoice fields repeat
      const headers = [
        "Date",
        "Invoice No",
        "Vendor",
        "Line Description",
        "Category",
        "Qty",
        "Unit Price (RM)",
        "Amount (RM)",
        "Tax Type",
        "Tax Rate (%)",
        "Tax Amount (RM)",
        "Invoice Total (RM)",
        "Currency",
        "Status",
      ];

      const rows: string[][] = [];

      for (const inv of invoicesData) {
        const date       = inv.invoiceDate ? format(inv.invoiceDate, "dd/MM/yyyy") : "";
        const invoiceNo  = inv.invoiceNo ?? "";
        const vendor     = inv.vendor ?? "";
        const taxType    = inv.taxType ?? "";
        const taxRate    = inv.taxRate ?? "";
        const taxAmount  = inv.taxAmount ?? "";
        const total      = inv.total ?? "";
        const currency   = inv.currency ?? "MYR";
        const status     = inv.status;

        if (inv.lineItems && inv.lineItems.length > 0) {
          for (const item of inv.lineItems) {
            rows.push([
              date,
              invoiceNo,
              vendor,
              item.description,
              item.category?.name ?? "",
              item.quantity ?? "1",
              item.unitPrice ?? "",
              item.amount,
              taxType,
              taxRate,
              taxAmount,
              total,
              currency,
              status,
            ]);
          }
        } else {
          // No line items — one row for the invoice itself
          rows.push([
            date,
            invoiceNo,
            vendor,
            "",
            "",
            "",
            "",
            total,
            taxType,
            taxRate,
            taxAmount,
            total,
            currency,
            status,
          ]);
        }
      }

      const csvContent = [
        headers.map(escapeCSV).join(","),
        ...rows.map((row) => row.map(escapeCSV).join(",")),
      ].join("\r\n");

      const filename = `resitly-export-${format(new Date(), "yyyy-MM-dd")}.csv`;

      return c.body(csvContent, 200, {
        "Content-Type":        "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      });
    }
  );

function escapeCSV(value: string): string {
  if (!value) return "";
  // If value contains commas, quotes, or newlines — wrap in quotes and escape inner quotes
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
