import {
  GoogleGenerativeAI,
  SchemaType,
  type Schema,
} from "@google/generative-ai";
import { env } from "../lib/env.ts";
import { AppError } from "../lib/errors.ts";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

// ── Extraction result type ────────────────────────────────────
export interface ExtractionResult {
  vendor: string | null;
  invoiceDate: string | null; // ISO "YYYY-MM-DD"
  invoiceNo: string | null;
  currency: string; // always "MYR" for Malaysian receipts
  subtotal: string | null;
  taxType: "SST_SERVICE" | "SST_SALES" | "GST" | "NONE" | null;
  taxRate: string | null; // "6.00", "8.00"
  taxAmount: string | null;
  total: string | null;
  lineItems: Array<{
    description: string;
    quantity: string;
    unitPrice: string | null;
    amount: string;
    suggestedCategory: string; // category slug
  }>;
  confidence: number; // 0.0–1.0
}

// ── Gemini response schema ────────────────────────────────────
const extractionSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    vendor: {
      type: SchemaType.STRING,
      nullable: true,
      description: "Vendor/merchant name",
    },
    invoiceDate: {
      type: SchemaType.STRING,
      nullable: true,
      description: "Invoice date as YYYY-MM-DD",
    },
    invoiceNo: {
      type: SchemaType.STRING,
      nullable: true,
      description: "Invoice or receipt number",
    },
    currency: {
      type: SchemaType.STRING,
      nullable: false,
      description: "Currency code, almost always MYR",
    },
    subtotal: {
      type: SchemaType.STRING,
      nullable: true,
      description: "Amount before tax, no currency symbol",
    },
    taxType: {
      type: SchemaType.STRING,
      nullable: true,
      format: "enum",
      enum: ["SST_SERVICE", "SST_SALES", "GST", "NONE"],
      description: "Type of Malaysian tax applied",
    },
    taxRate: {
      type: SchemaType.STRING,
      nullable: true,
      description: "Tax rate as percentage e.g. '6.00'",
    },
    taxAmount: {
      type: SchemaType.STRING,
      nullable: true,
      description: "Tax amount, no currency symbol",
    },
    total: {
      type: SchemaType.STRING,
      nullable: true,
      description: "Total amount payable, no currency symbol",
    },
    confidence: {
      type: SchemaType.NUMBER,
      nullable: false,
      description: "Overall extraction confidence 0.0 to 1.0",
    },
    lineItems: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          description: { type: SchemaType.STRING, nullable: false },
          quantity: {
            type: SchemaType.STRING,
            nullable: true,
            description: "Quantity, default '1'",
          },
          unitPrice: { type: SchemaType.STRING, nullable: true },
          amount: { type: SchemaType.STRING, nullable: false },
          suggestedCategory: {
            type: SchemaType.STRING,
            nullable: false,
            format: "enum",
            enum: [
              "transport",
              "meals",
              "utilities",
              "office-supplies",
              "professional-fees",
              "accommodation",
              "entertainment",
              "medical",
              "insurance",
              "other",
            ],
          },
        },
        required: ["description", "amount", "suggestedCategory"],
      },
    },
  },
  required: ["currency", "lineItems", "confidence"],
};

// ── System prompt ─────────────────────────────────────────────
const SYSTEM_PROMPT = `You are an expert receipt and invoice parser for Malaysian SMEs and freelancers.

## Malaysian Tax Context
- SST (Sales and Service Tax) replaced GST in September 2018
- Service Tax: 6% applied to services (restaurants, professional services, Grab rides)
- Sales Tax: 8% applied to taxable goods (most physical products)
- Some receipts show "Service Charge" (10%) separately — this is NOT a government tax, ignore it
- GST (6%) was abolished in June 2018 — may appear on very old receipts
- If a receipt shows "SST" without specifying the rate — infer from vendor type (service=6%, goods=8%)

## Common Malaysian Vendors and Categories
- TNB (Tenaga Nasional) → utilities
- Unifi, Maxis, Celcom, Digi → utilities
- Grab, AirAsia → transport
- Petron, BHP, Shell, Petronas → transport
- Giant, Tesco, Aeon, Mydin → office-supplies or meals
- McDonald's, KFC, Marrybrown, Secret Recipe, restaurants → meals
- Lazada, Shopee → office-supplies
- Pos Malaysia, J&T, DHL, GDex → transport
- Law firms, accounting firms, consultants → professional-fees
- Clinics, hospitals, pharmacies → medical
- Hotels, Airbnb → accommodation

## Date Formats (Malaysian)
- DD/MM/YYYY (most common)
- DD-MM-YYYY
- DD MMM YYYY (e.g. 15 Jan 2024)
Always output dates as YYYY-MM-DD (ISO format).

## Rules
- Always output amounts WITHOUT currency symbols
- Use "." as decimal separator (e.g. "125.50")
- Currency is almost always MYR — only use another code if explicitly stated
- If a field cannot be determined with confidence, use null
- Provide a confidence score: 0.9+ for clear printed receipts, 0.7-0.9 for slightly unclear, below 0.7 for very unclear or partial receipts`;

// ── Model factory ─────────────────────────────────────────────
function getModel() {
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: extractionSchema,
    },
    systemInstruction: SYSTEM_PROMPT,
  });
}

// ── Main extraction function ──────────────────────────────────
/**
 * Extracts invoice/receipt data from a file buffer.
 * Works for images (JPEG, PNG, WEBP, HEIC) and PDFs.
 * Gemini accepts both as inline base64 — no separate Files API needed.
 */
export async function extractFromFile(
  fileBuffer: Buffer,
  mimeType: string,
): Promise<ExtractionResult> {
  const model = getModel();

  let result;
  try {
    result = await model.generateContent([
      {
        inlineData: {
          data: fileBuffer.toString("base64"),
          mimeType,
        },
      },
      "Extract all invoice/receipt data from this file. Follow the schema exactly.",
    ]);
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      "status" in err &&
      (err as { status: number }).status === 429
    ) {
      throw new AppError(
        "AI extraction quota exceeded. Please try again in a few minutes.",
        503,
        "AI_QUOTA_EXCEEDED",
      );
    }
    throw err;
  }

  const text = result.response.text();

  try {
    const parsed = JSON.parse(text) as ExtractionResult;

    // Normalize line item quantities
    parsed.lineItems = parsed.lineItems.map((item) => ({
      ...item,
      quantity: item.quantity ?? "1",
    }));

    return parsed;
  } catch {
    throw new Error(`Gemini returned invalid JSON: ${text.slice(0, 200)}`);
  }
}
