"use client";

import { useInvoices } from "@/hooks/use-api";
import type { InvoiceStatus } from "@resitly/types";

export type InboxFilter = "all" | "needs-review" | "approved" | InvoiceStatus;

const inboxToBackend: Record<InboxFilter, InvoiceStatus | undefined> = {
  "all":          undefined,
  "needs-review": "review",
  "approved":     "reviewed",
  "pending":      "pending",
  "extracting":   "extracting",
  "review":       "review",
  "reviewed":     "reviewed",
  "exported":     "exported",
};

export function useInboxFeed({
  search,
  filter,
  page,
  pageSize,
}: {
  search: string;
  filter: InboxFilter;
  page: number;
  pageSize: number;
}) {
  const status = inboxToBackend[filter];
  return useInvoices({
    vendor: search || undefined,
    status,
    page,
    limit: pageSize,
  });
}
