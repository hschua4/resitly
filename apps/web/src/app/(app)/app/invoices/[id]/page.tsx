"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle,
  ArrowLeft,
  FileText,
} from "lucide-react";
import { useInvoice, useCategories } from "@/hooks/use-api";
import { useUpdateInvoice, useConfirmInvoice, useExtractInvoice } from "@/hooks/use-mutations";
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMYR, formatDate } from "@/lib/utils";
import Link from "next/link";

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

export default function InvoiceReviewPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();

  const { data: invoice, isLoading } = useInvoice(id);
  const { data: categories = [] }    = useCategories();
  const updateInvoice  = useUpdateInvoice(id);
  const confirmInvoice = useConfirmInvoice(id);
  const extractInvoice = useExtractInvoice(id);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendor:      "",
      invoiceDate: "",
      invoiceNo:   "",
      currency:    "MYR",
      subtotal:    "",
      taxType:     undefined,
      taxRate:     "",
      taxAmount:   "",
      total:       "",
      notes:       "",
      lineItems:   [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  // Populate form when invoice loads
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
      lineItems:   (invoice.lineItems ?? []).map((li, i) => ({
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

  const onSave = async (values: FormValues) => {
    await updateInvoice.mutateAsync({
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
      lineItems:   values.lineItems.map((li) => ({
        id:          li.id,
        categoryId:  li.categoryId,
        description: li.description,
        quantity:    li.quantity,
        unitPrice:   li.unitPrice,
        amount:      li.amount,
      })),
    });
    toast.success("Invoice saved");
  };

  const onConfirm = async () => {
    const values = form.getValues();
    await updateInvoice.mutateAsync({
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
      lineItems:   values.lineItems.map((li) => ({
        id:          li.id,
        categoryId:  li.categoryId,
        description: li.description,
        quantity:    li.quantity,
        unitPrice:   li.unitPrice,
        amount:      li.amount,
      })),
    });
    await confirmInvoice.mutateAsync();
    router.push("/app/invoices");
  };

  const onReExtract = async () => {
    await extractInvoice.mutateAsync();
    router.push(`/app/invoices/${id}/processing`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Invoice not found.
      </div>
    );
  }

  if (invoice.status === "extracting") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <div>
          <p className="font-medium">Extracting invoice data</p>
          <p className="text-sm text-muted-foreground mt-1">
            AI is processing your invoice. This usually takes 5–15 seconds.
          </p>
        </div>
      </div>
    );
  }

  const confidence = invoice.aiConfidence ? parseFloat(invoice.aiConfidence) : null;
  const confidenceColor =
    confidence === null ? "" :
    confidence >= 0.85 ? "text-green-600" :
    confidence >= 0.6  ? "text-amber-600" :
    "text-red-600";

  const isPdf = invoice.fileType === "application/pdf";

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-2 mb-2">
            <Link href="/app/invoices">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {invoice.vendor ?? invoice.originalName}
            </h1>
            <InvoiceStatusBadge status={invoice.status} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {invoice.originalName} &middot; Uploaded {formatDate(invoice.createdAt)}
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          {invoice.status !== "reviewed" && invoice.status !== "exported" && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReExtract}
              disabled={extractInvoice.isPending}
            >
              {extractInvoice.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4 mr-2" />
              )}
              Re-extract
            </Button>
          )}
          {invoice.status === "review" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={form.handleSubmit(onSave)}
                disabled={updateInvoice.isPending}
              >
                {updateInvoice.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save changes
              </Button>
              <Button
                size="sm"
                onClick={onConfirm}
                disabled={confirmInvoice.isPending || updateInvoice.isPending}
              >
                {confirmInvoice.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirm
              </Button>
            </>
          )}
        </div>
      </div>

      {/* AI Confidence */}
      {confidence !== null && (
        <p className={`text-xs font-medium ${confidenceColor}`}>
          AI confidence: {(confidence * 100).toFixed(0)}%{" "}
          {confidence < 0.7 && "— Please review carefully"}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Source document</CardTitle>
          </CardHeader>
          <CardContent>
            {isPdf ? (
              <div className="flex flex-col items-center justify-center h-64 gap-3 text-muted-foreground border rounded-md">
                <FileText className="h-12 w-12" />
                <a
                  href={invoice.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Open PDF
                </a>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={invoice.fileUrl}
                alt="Invoice"
                className="rounded-md w-full max-h-96 object-contain border"
              />
            )}
          </CardContent>
        </Card>

        {/* Invoice fields */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Invoice details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Vendor</Label>
                <Input {...form.register("vendor")} placeholder="e.g. TNB, Grab" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Invoice No.</Label>
                <Input {...form.register("invoiceNo")} placeholder="INV-001" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Date</Label>
                <Input type="date" {...form.register("invoiceDate")} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Currency</Label>
                <Input {...form.register("currency")} placeholder="MYR" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Subtotal (RM)</Label>
                <Input {...form.register("subtotal")} placeholder="0.00" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tax Type</Label>
                <Select
                  value={form.watch("taxType") ?? ""}
                  onValueChange={(v) =>
                    form.setValue("taxType", v as FormValues["taxType"])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SST_SERVICE">SST Service (6%)</SelectItem>
                    <SelectItem value="SST_SALES">SST Sales (8%)</SelectItem>
                    <SelectItem value="GST">GST (6%)</SelectItem>
                    <SelectItem value="NONE">No Tax</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tax Rate (%)</Label>
                <Input {...form.register("taxRate")} placeholder="6.00" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Tax Amount (RM)</Label>
                <Input {...form.register("taxAmount")} placeholder="0.00" />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold">Total (RM)</Label>
              <Input
                {...form.register("total")}
                placeholder="0.00"
                className="text-base font-semibold"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Notes</Label>
              <Input {...form.register("notes")} placeholder="Optional note" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Line items */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-sm">Line items</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                description: "",
                quantity:    "1",
                unitPrice:   null,
                amount:      "",
                categoryId:  null,
                sortOrder:   String(fields.length),
              })
            }
          >
            <Plus className="h-4 w-4 mr-1" />
            Add row
          </Button>
        </CardHeader>
        <CardContent>
          {fields.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No line items. Click &ldquo;Add row&rdquo; to add one.
            </p>
          ) : (
            <div className="space-y-2">
              {/* Header row */}
              <div className="grid grid-cols-[1fr_80px_90px_90px_140px_32px] gap-2 text-xs text-muted-foreground font-medium px-1">
                <span>Description</span>
                <span>Qty</span>
                <span>Unit Price</span>
                <span>Amount</span>
                <span>Category</span>
                <span />
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr_80px_90px_90px_140px_32px] gap-2 items-center"
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
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </div>
              ))}

              {/* Total row */}
              {fields.length > 0 && (
                <div className="pt-2 border-t flex justify-end">
                  <p className="text-sm font-semibold">
                    Total: {formatMYR(invoice.total)}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
