"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  CheckCircle,
  FileText,
  Loader2,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { useCategories, useInvoiceProcessingPoll } from "@/hooks/use-api";
import {
  useConfirmInvoice,
  useExtractInvoice,
  useUpdateInvoice,
} from "@/hooks/use-mutations";
import { Bracket, Pill, RK, type Tone } from "@/components/v2/kit";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import type { InvoiceStatus } from "@resitly/types";

const lineItemSchema = z.object({
  id:          z.string().optional(),
  categoryId:  z.string().nullable().optional(),
  description: z.string().min(1, "Required"),
  quantity:    z.string().default("1"),
  unitPrice:   z.string().nullable().optional(),
  amount:      z.string().min(1, "Required"),
  sortOrder:   z.string().default("0"),
});

const formSchema = z.object({
  vendor:      z.string().optional(),
  invoiceDate: z.string().optional(),
  invoiceNo:   z.string().optional(),
  currency:    z.string().default("MYR"),
  subtotal:    z.string().optional(),
  taxType:     z.enum(["SST_SERVICE", "SST_SALES", "GST", "NONE", ""]).optional(),
  taxRate:     z.string().optional(),
  taxAmount:   z.string().optional(),
  total:       z.string().optional(),
  notes:       z.string().optional(),
  lineItems:   z.array(lineItemSchema),
});

type FormValues = z.infer<typeof formSchema>;

const statusToPill: Record<InvoiceStatus, { tone: Tone; label: string }> = {
  pending:    { tone: "ink",    label: "Pending" },
  extracting: { tone: "accent", label: "Extracting" },
  review:     { tone: "warn",   label: "Needs review" },
  reviewed:   { tone: "ok",     label: "Approved" },
  exported:   { tone: "ok",     label: "Exported" },
};

export default function InvoiceReviewPageV2() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: invoice, isLoading } = useInvoiceProcessingPoll(id);
  const { data: categories = [] } = useCategories();
  const updateInvoice = useUpdateInvoice(id);
  const confirmInvoice = useConfirmInvoice(id);
  const extractInvoice = useExtractInvoice(id);

  const [receiptOpenMobile, setReceiptOpenMobile] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendor: "",
      invoiceDate: "",
      invoiceNo: "",
      currency: "MYR",
      subtotal: "",
      taxType: undefined,
      taxRate: "",
      taxAmount: "",
      total: "",
      notes: "",
      lineItems: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  useEffect(() => {
    if (!invoice) return;
    form.reset({
      vendor:      invoice.vendor ?? "",
      invoiceDate: invoice.invoiceDate ? invoice.invoiceDate.slice(0, 10) : "",
      invoiceNo:   invoice.invoiceNo ?? "",
      currency:    invoice.currency ?? "MYR",
      subtotal:    invoice.subtotal ?? "",
      taxType:     (invoice.taxType as FormValues["taxType"]) ?? undefined,
      taxRate:     invoice.taxRate ?? "",
      taxAmount:   invoice.taxAmount ?? "",
      total:       invoice.total ?? "",
      notes:       invoice.notes ?? "",
      lineItems: (invoice.lineItems ?? []).map((li, i) => ({
        id:          li.id,
        categoryId:  li.categoryId ?? null,
        description: li.description,
        quantity:    li.quantity ?? "1",
        unitPrice:   li.unitPrice ?? null,
        amount:      li.amount,
        sortOrder:   li.sortOrder ?? String(i),
      })),
    });
  }, [invoice, form]);

  const buildPayload = (values: FormValues) => ({
    vendor:      values.vendor || undefined,
    invoiceDate: values.invoiceDate || undefined,
    invoiceNo:   values.invoiceNo || undefined,
    currency:    values.currency,
    subtotal:    values.subtotal || undefined,
    taxType:     (values.taxType as "SST_SERVICE" | "SST_SALES" | "GST" | "NONE") || undefined,
    taxRate:     values.taxRate || undefined,
    taxAmount:   values.taxAmount || undefined,
    total:       values.total || undefined,
    notes:       values.notes || undefined,
    lineItems:   values.lineItems.map((li, index) => ({
      id:          li.id,
      categoryId:  li.categoryId,
      description: li.description,
      quantity:    li.quantity,
      unitPrice:   li.unitPrice,
      amount:      li.amount,
      sortOrder:   String(index),
    })),
  });

  const onSave = async (values: FormValues) => {
    await updateInvoice.mutateAsync(buildPayload(values));
    toast.success("Saved");
  };

  const onConfirm = async () => {
    const values = form.getValues();
    await updateInvoice.mutateAsync(buildPayload(values));
    await confirmInvoice.mutateAsync();
    router.push("/app2/inbox");
  };

  const onReExtract = async () => {
    await extractInvoice.mutateAsync();
    toast.success("Re-extracting…");
  };

  if (isLoading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full mt-4" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: 80,
          fontFamily: RK.mono,
          color: RK.ink3,
        }}
      >
        Invoice not found.
      </div>
    );
  }

  if (invoice.status === "extracting") {
    return (
      <div
        style={{
          minHeight: "calc(100dvh - 48px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          fontFamily: RK.sans,
          color: RK.ink,
        }}
      >
        <Loader2 className="size-10 animate-spin" style={{ color: RK.accent }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 500 }}>Extracting invoice data</div>
          <div style={{ fontSize: 13, color: RK.ink2, marginTop: 4 }}>
            AI is processing your invoice. This usually takes 5–15 seconds.
          </div>
        </div>
      </div>
    );
  }

  const status = statusToPill[invoice.status];
  const confidence = invoice.aiConfidence ? parseFloat(invoice.aiConfidence) : null;
  const isPdf = invoice.fileType === "application/pdf";

  return (
    <div
      style={{
        background: RK.paper,
        color: RK.ink,
        minHeight: "calc(100dvh - 48px)",
      }}
    >
      <Header
        invoice={invoice}
        statusLabel={status.label}
        statusTone={status.tone}
        confidence={confidence}
        onSave={form.handleSubmit(onSave)}
        onConfirm={onConfirm}
        onReExtract={onReExtract}
        savePending={updateInvoice.isPending}
        confirmPending={confirmInvoice.isPending}
        extractPending={extractInvoice.isPending}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 0 }}>
        <div
          className="hidden md:block"
          style={{
            borderRight: `1px solid ${RK.rule}`,
            background: RK.paper2,
            padding: 18,
            position: "sticky",
            top: 48,
            alignSelf: "start",
            maxHeight: "calc(100dvh - 48px)",
            overflow: "auto",
          }}
        >
          <ReceiptViewer invoice={invoice} isPdf={isPdf} />
        </div>

        <div className="md:hidden" style={{ padding: 12 }}>
          <Bracket onClick={() => setReceiptOpenMobile(true)}>
            view receipt
          </Bracket>
        </div>

        <div style={{ padding: 18 }}>
          <FieldsCard form={form} />
          <LineItems
            form={form}
            fields={fields}
            append={append}
            remove={remove}
            categories={categories}
          />
        </div>
      </div>

      {receiptOpenMobile && (
        <div
          onClick={() => setReceiptOpenMobile(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 50,
            display: "flex",
            alignItems: "stretch",
            justifyContent: "stretch",
            padding: 12,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: RK.paper,
              flex: 1,
              padding: 16,
              overflow: "auto",
              position: "relative",
            }}
          >
            <button
              onClick={() => setReceiptOpenMobile(false)}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: RK.surface,
                border: `1px solid ${RK.rule}`,
                padding: 6,
                cursor: "pointer",
              }}
              aria-label="close receipt"
            >
              <X size={14} />
            </button>
            <ReceiptViewer invoice={invoice} isPdf={isPdf} />
          </div>
        </div>
      )}
    </div>
  );
}

function Header({
  invoice,
  statusLabel,
  statusTone,
  confidence,
  onSave,
  onConfirm,
  onReExtract,
  savePending,
  confirmPending,
  extractPending,
}: {
  invoice: { vendor: string | null; originalName: string; createdAt: string; status: InvoiceStatus };
  statusLabel: string;
  statusTone: Tone;
  confidence: number | null;
  onSave: () => void;
  onConfirm: () => void;
  onReExtract: () => void;
  savePending: boolean;
  confirmPending: boolean;
  extractPending: boolean;
}) {
  const finalized =
    invoice.status === "reviewed" || invoice.status === "exported";
  return (
    <div
      style={{
        padding: "14px 18px 12px",
        borderBottom: `1px solid ${RK.rule}`,
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "center",
      }}
    >
      <Link
        href="/app2/inbox"
        style={{
          fontFamily: RK.mono,
          fontSize: 11,
          color: RK.ink3,
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        <ArrowLeft size={12} /> back to inbox
      </Link>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <h1
            style={{
              fontFamily: RK.sans,
              fontSize: 20,
              color: RK.ink,
              fontWeight: 500,
              margin: 0,
            }}
          >
            {invoice.vendor ?? invoice.originalName}
          </h1>
          <Pill tone={statusTone}>{statusLabel}</Pill>
        </div>
        <div
          style={{
            fontFamily: RK.mono,
            fontSize: 10,
            color: RK.ink3,
            marginTop: 4,
          }}
        >
          {invoice.originalName} · uploaded {formatDate(invoice.createdAt)}
          {confidence !== null && (
            <>
              {" "}
              ·{" "}
              <span
                style={{
                  color:
                    confidence >= 0.85
                      ? RK.ok
                      : confidence >= 0.6
                        ? RK.warn
                        : RK.err,
                }}
              >
                ai confidence {(confidence * 100).toFixed(0)}%
              </span>
            </>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {!finalized && (
          <Bracket onClick={onReExtract} disabled={extractPending}>
            {extractPending ? (
              <Loader2 size={11} className="animate-spin inline" />
            ) : (
              <RotateCcw size={11} style={{ display: "inline" }} />
            )}{" "}
            re-extract
          </Bracket>
        )}
        {invoice.status === "review" && (
          <>
            <Bracket onClick={onSave} disabled={savePending}>
              {savePending ? "saving…" : "save"}
            </Bracket>
            <Bracket
              accent
              onClick={onConfirm}
              disabled={confirmPending || savePending}
            >
              <CheckCircle size={11} style={{ display: "inline" }} />{" "}
              {confirmPending ? "confirming…" : "confirm"}
            </Bracket>
          </>
        )}
      </div>
    </div>
  );
}

function ReceiptViewer({
  invoice,
  isPdf,
}: {
  invoice: { fileUrl: string; fileType: string };
  isPdf: boolean;
}) {
  if (isPdf) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: 40,
          color: RK.ink3,
          border: `1px dashed ${RK.rule}`,
          background: RK.surface,
        }}
      >
        <FileText size={36} />
        <a
          href={invoice.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: RK.mono,
            fontSize: 11,
            color: RK.accent,
            textDecoration: "underline",
          }}
        >
          Open PDF
        </a>
      </div>
    );
  }
  return (
    <div
      style={{
        background: RK.surface,
        border: `1px solid ${RK.rule}`,
        padding: 8,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={invoice.fileUrl}
        alt="Receipt"
        style={{
          width: "100%",
          maxHeight: "calc(100dvh - 140px)",
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
}

function FieldsCard({ form }: { form: ReturnType<typeof useForm<FormValues>> }) {
  return (
    <div
      style={{
        border: `1px solid ${RK.rule}`,
        background: RK.surface,
        marginBottom: 18,
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          borderBottom: `1px solid ${RK.rule}`,
          fontFamily: RK.mono,
          fontSize: 10,
          color: RK.ink3,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Invoice details
      </div>
      <div className="grid grid-cols-2 gap-3" style={{ padding: 14 }}>
        <FormField label="Vendor">
          <Input {...form.register("vendor")} placeholder="e.g. TNB, Grab" />
        </FormField>
        <FormField label="Invoice no.">
          <Input {...form.register("invoiceNo")} placeholder="INV-001" />
        </FormField>
        <FormField label="Date">
          <Input type="date" {...form.register("invoiceDate")} />
        </FormField>
        <FormField label="Currency">
          <Input {...form.register("currency")} placeholder="MYR" />
        </FormField>
        <FormField label="Subtotal (RM)">
          <Input {...form.register("subtotal")} placeholder="0.00" />
        </FormField>
        <FormField label="Tax type">
          <Select
            value={form.watch("taxType") ?? ""}
            onValueChange={(v) =>
              form.setValue("taxType", v as FormValues["taxType"])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SST_SERVICE">SST Service (6%)</SelectItem>
              <SelectItem value="SST_SALES">SST Sales (8%)</SelectItem>
              <SelectItem value="GST">GST (6%)</SelectItem>
              <SelectItem value="NONE">No tax</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Tax rate (%)">
          <Input {...form.register("taxRate")} placeholder="6.00" />
        </FormField>
        <FormField label="Tax amount (RM)">
          <Input {...form.register("taxAmount")} placeholder="0.00" />
        </FormField>
      </div>
      <div
        style={{
          padding: "12px 14px",
          borderTop: `1px solid ${RK.rule2}`,
          background: RK.paper2,
        }}
      >
        <FormField label="Total (RM)" emphasis>
          <Input
            {...form.register("total")}
            placeholder="0.00"
            style={{ fontWeight: 600, fontSize: 16 }}
          />
        </FormField>
      </div>
      <div style={{ padding: 14 }}>
        <FormField label="Notes">
          <Input {...form.register("notes")} placeholder="Optional note" />
        </FormField>
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
  emphasis,
}: {
  label: string;
  children: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label
        style={{
          fontFamily: RK.mono,
          fontSize: 9.5,
          color: RK.ink3,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          fontWeight: emphasis ? 600 : 400,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function LineItems({
  form,
  fields,
  append,
  remove,
  categories,
}: {
  form: ReturnType<typeof useForm<FormValues>>;
  fields: { id: string }[];
  append: (v: {
    description: string;
    quantity: string;
    unitPrice: string | null;
    amount: string;
    categoryId: string | null;
    sortOrder: string;
  }) => void;
  remove: (i: number) => void;
  categories: { id: string; name: string }[];
}) {
  return (
    <div style={{ border: `1px solid ${RK.rule}`, background: RK.surface }}>
      <div
        style={{
          padding: "10px 14px",
          borderBottom: `1px solid ${RK.rule}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: RK.mono,
            fontSize: 10,
            color: RK.ink3,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            flex: 1,
          }}
        >
          Line items
        </span>
        <Bracket
          onClick={() =>
            append({
              description: "",
              quantity: "1",
              unitPrice: null,
              amount: "",
              categoryId: null,
              sortOrder: String(fields.length),
            })
          }
        >
          <Plus size={11} style={{ display: "inline" }} /> add row
        </Bracket>
      </div>
      <div style={{ padding: 14 }}>
        {fields.length === 0 ? (
          <div
            style={{
              fontFamily: RK.mono,
              fontSize: 11,
              color: RK.ink3,
              textAlign: "center",
              padding: 24,
            }}
          >
            No line items. Click &ldquo;add row&rdquo; to add one.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: "1fr 70px 90px 90px 130px 32px",
                fontFamily: RK.mono,
                fontSize: 9.5,
                color: RK.ink3,
                textTransform: "uppercase",
                letterSpacing: 0.4,
                paddingBottom: 4,
              }}
            >
              <span>Description</span>
              <span>Qty</span>
              <span>Unit</span>
              <span>Amount</span>
              <span>Category</span>
              <span />
            </div>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid gap-2 items-center"
                style={{ gridTemplateColumns: "1fr 70px 90px 90px 130px 32px" }}
              >
                <Input
                  {...form.register(`lineItems.${index}.description`)}
                  placeholder="Description"
                  className="h-8 text-sm"
                />
                <Input
                  {...form.register(`lineItems.${index}.quantity`)}
                  placeholder="1"
                  className="h-8 text-sm"
                />
                <Input
                  {...form.register(`lineItems.${index}.unitPrice`)}
                  placeholder="0.00"
                  className="h-8 text-sm"
                />
                <Input
                  {...form.register(`lineItems.${index}.amount`)}
                  placeholder="0.00"
                  className="h-8 text-sm font-medium"
                />
                <Select
                  value={form.watch(`lineItems.${index}.categoryId`) ?? ""}
                  onValueChange={(v) =>
                    form.setValue(`lineItems.${index}.categoryId`, v || null)
                  }
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label="remove row"
                  style={{
                    background: "transparent",
                    border: `1px solid ${RK.rule}`,
                    width: 28,
                    height: 28,
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                    color: RK.ink3,
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
