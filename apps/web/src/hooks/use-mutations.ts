import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import type {
  CreateInvoiceInput,
  UpdateInvoiceInput,
  Invoice,
} from "@resitly/types";

export function useCreateInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInvoiceInput) =>
      apiClient<{ data: Invoice }>("/v1/invoices", {
        method: "POST",
        body:   JSON.stringify(data),
      }).then((r) => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to create invoice");
    },
  });
}

export function useUpdateInvoice(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateInvoiceInput) =>
      apiClient<{ data: Invoice }>(`/v1/invoices/${id}`, {
        method: "PATCH",
        body:   JSON.stringify(data),
      }).then((r) => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["invoices", id] });
      void qc.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to update invoice");
    },
  });
}

export function useDeleteInvoice() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient(`/v1/invoices/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice deleted");
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to delete invoice");
    },
  });
}

export function useExtractInvoice(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient(`/v1/invoices/${id}/extract`, { method: "POST" }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["invoices", id] });
      void qc.invalidateQueries({ queryKey: ["invoices", id, "poll"] });
    },
    onError: (err) => {
      toast.error(err.message ?? "Extraction failed. Please try again.");
    },
  });
}

export function useConfirmInvoice(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiClient<{ data: Invoice }>(`/v1/invoices/${id}/confirm`, {
        method: "PATCH",
      }).then((r) => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["invoices", id] });
      void qc.invalidateQueries({ queryKey: ["invoices"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Invoice confirmed");
    },
    onError: (err) => {
      toast.error(err.message ?? "Failed to confirm invoice");
    },
  });
}
