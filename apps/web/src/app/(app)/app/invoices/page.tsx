"use client";

import { useState, useEffect } from "react";
import { useInvoices } from "@/hooks/use-api";
import { columns } from "./columns";
import { InvoicesDataTable } from "./data-table";
import type { InvoiceStatus } from "@resitly/types";

export default function InvoicesPage() {
  const [vendorInput, setVendorInput] = useState("");
  const [vendor, setVendor] = useState("");
  const [status, setStatus] = useState<InvoiceStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Debounce vendor input → reset to page 1 on change
  useEffect(() => {
    const timer = setTimeout(() => {
      setVendor(vendorInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [vendorInput]);

  const { data, isLoading, isFetching } = useInvoices({
    vendor: vendor || undefined,
    status: status === "all" ? undefined : status,
    page,
    limit: pageSize,
  });

  return (
    <InvoicesDataTable
      columns={columns}
      data={data?.data ?? []}
      isLoading={isLoading}
      isFetching={isFetching}
      total={data?.total ?? 0}
      page={page}
      totalPages={data?.totalPages ?? 1}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setPage(1);
      }}
      vendorInput={vendorInput}
      onVendorInputChange={setVendorInput}
      status={status}
      onStatusChange={(v: InvoiceStatus | "all") => {
        setStatus(v);
        setPage(1);
      }}
    />
  );
}
