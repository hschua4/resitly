import { z } from "zod";

// ── Invoice status ────────────────────────────────────────────
export const InvoiceStatusEnum = z.enum([
  "pending",
  "extracting",
  "review",
  "reviewed",
  "exported",
]);
export type InvoiceStatus = z.infer<typeof InvoiceStatusEnum>;

// ── Tax type ──────────────────────────────────────────────────
export const TaxTypeEnum = z.enum([
  "SST_SERVICE",
  "SST_SALES",
  "GST",
  "NONE",
]);
export type TaxType = z.infer<typeof TaxTypeEnum>;

// ── Category ──────────────────────────────────────────────────
export const CategorySchema = z.object({
  id:        z.string(),
  name:      z.string(),
  slug:      z.string(),
  color:     z.string(),
  icon:      z.string(),
  isDefault: z.string(),
  createdAt: z.string(),
});
export type Category = z.infer<typeof CategorySchema>;

// ── Line item ─────────────────────────────────────────────────
export const LineItemSchema = z.object({
  id:          z.string().optional(),
  invoiceId:   z.string().optional(),
  categoryId:  z.string().nullable().optional(),
  description: z.string().min(1, "Description is required"),
  quantity:    z.string().default("1"),
  unitPrice:   z.string().nullable().optional(),
  amount:      z.string().min(1, "Amount is required"),
  sortOrder:   z.string().default("0"),
  category:    CategorySchema.nullable().optional(),
});
export type LineItem = z.infer<typeof LineItemSchema>;

// ── Invoice ───────────────────────────────────────────────────
export const InvoiceSchema = z.object({
  id:            z.string(),
  userId:        z.string(),
  fileKey:       z.string(),
  fileUrl:       z.string(),
  fileType:      z.string(),
  originalName:  z.string(),
  status:        InvoiceStatusEnum,
  vendor:        z.string().nullable(),
  invoiceDate:   z.string().nullable(),
  invoiceNo:     z.string().nullable(),
  currency:      z.string().nullable(),
  subtotal:      z.string().nullable(),
  taxAmount:     z.string().nullable(),
  taxType:       TaxTypeEnum.nullable(),
  taxRate:       z.string().nullable(),
  total:         z.string().nullable(),
  notes:         z.string().nullable(),
  aiConfidence:  z.string().nullable(),
  extractionRaw: z.string().nullable(),
  createdAt:     z.string(),
  updatedAt:     z.string().nullable(),
  lineItems:     z.array(LineItemSchema).optional(),
});
export type Invoice = z.infer<typeof InvoiceSchema>;

// ── Create invoice request ────────────────────────────────────
export const CreateInvoiceSchema = z.object({
  fileKey:      z.string().min(1),
  fileUrl:      z.string().url(),
  fileType:     z.string().min(1),
  originalName: z.string().min(1),
});
export type CreateInvoiceInput = z.infer<typeof CreateInvoiceSchema>;

// ── Update invoice request ────────────────────────────────────
export const UpdateInvoiceSchema = z.object({
  vendor:      z.string().optional(),
  invoiceDate: z.string().optional().nullable(),
  invoiceNo:   z.string().optional().nullable(),
  currency:    z.string().optional(),
  subtotal:    z.string().optional().nullable(),
  taxType:     TaxTypeEnum.optional().nullable(),
  taxRate:     z.string().optional().nullable(),
  taxAmount:   z.string().optional().nullable(),
  total:       z.string().optional().nullable(),
  notes:       z.string().optional().nullable(),
  lineItems:   z.array(LineItemSchema).optional(),
});
export type UpdateInvoiceInput = z.infer<typeof UpdateInvoiceSchema>;

// ── Invoice list filters ──────────────────────────────────────
export const InvoiceFiltersSchema = z.object({
  status:     InvoiceStatusEnum.optional(),
  vendor:     z.string().optional(),
  dateFrom:   z.string().optional(),
  dateTo:     z.string().optional(),
  categoryId: z.string().optional(),
  page:       z.coerce.number().default(1),
  limit:      z.coerce.number().default(20),
});
export type InvoiceFilters = z.infer<typeof InvoiceFiltersSchema>;

// ── Export filters ────────────────────────────────────────────
export const ExportFiltersSchema = z.object({
  dateFrom:   z.string().optional(),
  dateTo:     z.string().optional(),
  status:     InvoiceStatusEnum.optional(),
  categoryId: z.string().optional(),
  ids:        z.string().optional(), // comma-separated invoice IDs
});
export type ExportFilters = z.infer<typeof ExportFiltersSchema>;

// ── Presign upload request ────────────────────────────────────
export const PresignUploadSchema = z.object({
  filename:    z.string().min(1),
  contentType: z.string().refine(
    (ct) => [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "application/pdf",
    ].includes(ct),
    { message: "Only JPEG, PNG, WEBP, HEIC images and PDFs are accepted" }
  ),
});
export type PresignUploadInput = z.infer<typeof PresignUploadSchema>;

// ── Paginated response ────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Dashboard types ───────────────────────────────────────────
export interface DashboardSummary {
  totalSpendThisMonth: string;
  totalSpendLastMonth: string;
  invoiceCountThisMonth: number;
  invoiceCountLastMonth: number;
  invoiceCountTotal: number;
  avgPerInvoice: string;
}

export interface SpendByCategory {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  total: string;
}

export interface SpendByMonth {
  month: string; // "2024-01"
  total: string;
  count: number;
}
