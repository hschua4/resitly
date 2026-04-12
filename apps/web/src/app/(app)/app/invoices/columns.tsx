"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";
import { formatMYR, formatDate } from "@/lib/utils";
import type { Invoice } from "@resitly/types";

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "invoiceDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm">{formatDate(row.getValue("invoiceDate"))}</span>
    ),
    sortingFn: "alphanumeric",
  },
  {
    accessorKey: "vendor",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Vendor
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    cell: ({ row }) => {
      const vendor: string | null = row.getValue("vendor");
      return vendor ? (
        <span className="font-medium">{vendor}</span>
      ) : (
        <span className="text-muted-foreground italic">Unknown</span>
      );
    },
  },
  {
    accessorKey: "invoiceNo",
    header: "Invoice No.",
    cell: ({ row }) => {
      const val: string | null = row.getValue("invoiceNo");
      return (
        <span className="text-sm text-muted-foreground">{val ?? "—"}</span>
      );
    },
  },
  {
    id: "category",
    header: "Category",
    cell: ({ row }) => {
      const firstCategory = row.original.lineItems?.[0]?.category?.name;
      return firstCategory ? (
        <span className="text-sm">{firstCategory}</span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Total
        <ArrowUpDown data-icon="inline-end" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{formatMYR(row.getValue("total"))}</span>
    ),
    sortingFn: (rowA, rowB) => {
      const a = parseFloat(rowA.original.total ?? "0");
      const b = parseFloat(rowB.original.total ?? "0");
      return a - b;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <InvoiceStatusBadge status={row.getValue("status")} />,
    filterFn: (row, _columnId, filterValue: string) => {
      if (filterValue === "all") return true;
      return row.getValue("status") === filterValue;
    },
  },
];
