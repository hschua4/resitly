"use client";

import { useInvoices } from "@/hooks/use-api";
import { columns } from "./columns";
import { InvoicesDataTable } from "./data-table";

export default function InvoicesPage() {
  const { data, isLoading } = useInvoices({ limit: 200 });
  const invoices = data?.data ?? [];

  return <InvoicesDataTable columns={columns} data={invoices} isLoading={isLoading} />;
}
