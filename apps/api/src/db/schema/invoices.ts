import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  numeric,
  index,
} from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";
import { relations } from "drizzle-orm";
import { users } from "./auth.ts";
import { categories } from "./categories.ts";

// ── Enums ─────────────────────────────────────────────────────
// Status lifecycle: pending → extracting → review → reviewed → exported
export const invoiceStatusEnum = pgEnum("invoice_status", [
  "pending",
  "extracting",
  "review",
  "reviewed",
  "exported",
]);

export const taxTypeEnum = pgEnum("tax_type", [
  "SST_SERVICE",
  "SST_SALES",
  "GST",
  "NONE",
]);

// ── Invoices ──────────────────────────────────────────────────
export const invoices = pgTable(
  "invoices",
  {
    id:     text("id").primaryKey().$defaultFn(() => uuidv7()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // R2 storage
    fileKey:      text("file_key").notNull(),      // "userId/uuid.jpg"
    fileUrl:      text("file_url").notNull(),       // public URL
    fileType:     text("file_type").notNull(),      // "image/jpeg" | "application/pdf"
    originalName: text("original_name").notNull(),

    // Status lifecycle
    status: invoiceStatusEnum("status").notNull().default("pending"),

    // AI-extracted fields (nullable until extracted)
    vendor:      text("vendor"),
    invoiceDate: timestamp("invoice_date"),
    invoiceNo:   text("invoice_no"),
    currency:    text("currency").default("MYR"),

    // Monetary values stored as numeric strings (avoids float rounding)
    subtotal:  numeric("subtotal",  { precision: 12, scale: 2 }),
    taxAmount: numeric("tax_amount", { precision: 12, scale: 2 }),
    taxType:   taxTypeEnum("tax_type"),
    taxRate:   numeric("tax_rate",   { precision: 5,  scale: 2 }), // e.g. "6.00"
    total:     numeric("total",      { precision: 12, scale: 2 }),

    notes:         text("notes"),
    aiConfidence:  numeric("ai_confidence", { precision: 4, scale: 3 }), // 0.000–1.000
    extractionRaw: text("extraction_raw"),  // full Gemini JSON response for debugging

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").$onUpdate(() => new Date()),
  },
  (t) => [
    index("invoices_user_idx").on(t.userId),
    index("invoices_status_idx").on(t.status),
    index("invoices_date_idx").on(t.invoiceDate),
    index("invoices_vendor_idx").on(t.vendor),
  ]
);

// ── Invoice Line Items ────────────────────────────────────────
export const invoiceLineItems = pgTable(
  "invoice_line_items",
  {
    id:          text("id").primaryKey().$defaultFn(() => uuidv7()),
    invoiceId:   text("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }),
    categoryId:  text("category_id")
      .references(() => categories.id, { onDelete: "set null" }),
    description: text("description").notNull(),
    quantity:    numeric("quantity",   { precision: 10, scale: 3 }).default("1"),
    unitPrice:   numeric("unit_price", { precision: 12, scale: 2 }),
    amount:      numeric("amount",     { precision: 12, scale: 2 }).notNull(),
    sortOrder:   text("sort_order").default("0"),
  },
  (t) => [
    index("line_items_invoice_idx").on(t.invoiceId),
    index("line_items_category_idx").on(t.categoryId),
  ]
);

// ── Relations ─────────────────────────────────────────────────
export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  user:      one(users, { fields: [invoices.userId], references: [users.id] }),
  lineItems: many(invoiceLineItems),
}));

export const invoiceLineItemsRelations = relations(invoiceLineItems, ({ one }) => ({
  invoice:  one(invoices,    { fields: [invoiceLineItems.invoiceId],  references: [invoices.id] }),
  category: one(categories,  { fields: [invoiceLineItems.categoryId], references: [categories.id] }),
}));
