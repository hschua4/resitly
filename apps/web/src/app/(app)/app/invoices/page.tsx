"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  Trash2,
  Upload,
  Search,
  Filter,
} from "lucide-react";
import { useInvoices } from "@/hooks/use-api";
import { useDeleteInvoice } from "@/hooks/use-mutations";
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatMYR, formatDate } from "@/lib/utils";
import type { InvoiceStatus } from "@resitly/types";

export default function InvoicesPage() {
  const router = useRouter();
  const [vendor, setVendor]   = useState("");
  const [status, setStatus]   = useState<InvoiceStatus | "all">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useInvoices({
    vendor: vendor || undefined,
    status: status === "all" ? undefined : status,
    limit:  50,
  });

  const deleteInvoice = useDeleteInvoice();

  const invoices = data?.data ?? [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {data?.total ?? 0} total invoices
          </p>
        </div>
        <Button asChild>
          <Link href="/app/invoices/upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload Invoice
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendor..."
            className="pl-9"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => setStatus(v as InvoiceStatus | "all")}
        >
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="exported">Exported</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Invoice No.</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <p>No invoices yet.</p>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/app/invoices/upload">Upload your first invoice</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => {
                const firstCategory = inv.lineItems?.[0]?.category?.name;
                return (
                  <TableRow
                    key={inv.id}
                    className="cursor-pointer hover:bg-muted/40"
                    onClick={() => router.push(`/app/invoices/${inv.id}`)}
                  >
                    <TableCell className="text-sm">
                      {formatDate(inv.invoiceDate)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {inv.vendor ?? <span className="text-muted-foreground italic">Unknown</span>}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {inv.invoiceNo ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {firstCategory ?? <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatMYR(inv.total)}
                    </TableCell>
                    <TableCell>
                      <InvoiceStatusBadge status={inv.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={`/app/invoices/${inv.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(inv.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the invoice and its uploaded file. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={async () => {
                if (deleteId) {
                  await deleteInvoice.mutateAsync(deleteId);
                  setDeleteId(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
