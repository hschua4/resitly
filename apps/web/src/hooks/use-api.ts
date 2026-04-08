import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { buildQueryString } from "@/lib/utils";
import type {
  Invoice,
  Category,
  InvoiceFilters,
  PaginatedResponse,
  DashboardSummary,
  SpendByCategory,
  SpendByMonth,
} from "@resitly/types";

// ── Invoices ──────────────────────────────────────────────────
export function useInvoices(filters: Partial<InvoiceFilters> = {}) {
  return useQuery({
    queryKey: ["invoices", filters],
    queryFn:  () =>
      apiClient<PaginatedResponse<Invoice>>(
        `/v1/invoices${buildQueryString(filters as Record<string, unknown>)}`
      ),
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ["invoices", id],
    queryFn:  () =>
      apiClient<{ data: Invoice }>(`/v1/invoices/${id}`).then((r) => r.data),
    enabled: Boolean(id),
  });
}

/**
 * Polls the invoice status every 2 seconds while status === "extracting".
 * Auto-stops when extraction completes or fails.
 */
export function useInvoiceProcessingPoll(id: string) {
  return useQuery({
    queryKey: ["invoices", id, "poll"],
    queryFn:  () =>
      apiClient<{ data: Invoice }>(`/v1/invoices/${id}`).then((r) => r.data),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Keep polling while extracting or pending (just uploaded, not yet started)
      if (status === "extracting") return 2000;
      return false; // Stop polling
    },
  });
}

// ── Categories ────────────────────────────────────────────────
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn:  () =>
      apiClient<{ data: Category[] }>("/v1/categories").then((r) => r.data),
    staleTime: Infinity, // Categories are static — never refetch
  });
}

// ── Dashboard ─────────────────────────────────────────────────
export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn:  () =>
      apiClient<{ data: DashboardSummary }>("/v1/dashboard/summary").then(
        (r) => r.data
      ),
  });
}

export function useSpendByCategory() {
  return useQuery({
    queryKey: ["dashboard", "by-category"],
    queryFn:  () =>
      apiClient<{ data: SpendByCategory[] }>("/v1/dashboard/by-category").then(
        (r) => r.data
      ),
  });
}

export function useSpendByMonth() {
  return useQuery({
    queryKey: ["dashboard", "by-month"],
    queryFn:  () =>
      apiClient<{ data: SpendByMonth[] }>("/v1/dashboard/by-month").then(
        (r) => r.data
      ),
  });
}
