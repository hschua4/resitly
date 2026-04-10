"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useInvoiceProcessingPoll } from "@/hooks/use-api";
import { Button } from "@/components/ui/button";

export default function ProcessingPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();
  const { data: invoice, isLoading } = useInvoiceProcessingPoll(id);

  useEffect(() => {
    if (!invoice) return;

    // Redirect to review page when extraction completes
    if (invoice.status === "review" || invoice.status === "reviewed") {
      void qc.invalidateQueries({ queryKey: ["invoices"] });
      router.replace(`/app/invoices/${id}`);
    }

    // Invalidate list when extraction fails so it reflects the reverted status
    if (invoice.status === "pending") {
      void qc.invalidateQueries({ queryKey: ["invoices"] });
    }
  }, [invoice, id, router, qc]);

  if (isLoading || !invoice) {
    return <ProcessingView status="extracting" />;
  }

  if (invoice.status === "pending") {
    // Extraction failed — reverted to pending
    return <ProcessingView status="failed" invoiceId={id} />;
  }

  return <ProcessingView status="extracting" />;
}

function ProcessingView({
  status,
  invoiceId,
}: {
  status: "extracting" | "failed";
  invoiceId?: string;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      {status === "extracting" ? (
        <>
          <div className="relative">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Extracting invoice data</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-sm">
              Gemini AI is reading your invoice and extracting line items, amounts, and tax details.
              This usually takes 5–15 seconds.
            </p>
          </div>
          <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>File uploaded to secure storage</span>
            </div>
            <div className="flex items-center gap-2">
              <Loader2 className="h-3 w-3 animate-spin text-primary" />
              <span>AI extracting invoice data...</span>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Extraction failed</h2>
            <p className="text-muted-foreground text-sm mt-2 max-w-sm">
              The AI could not process your file. Please make sure the image is clear and try again.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/app/invoices")}
            >
              Back to invoices
            </Button>
            {invoiceId && (
              <Button onClick={() => router.push(`/app/invoices/${invoiceId}`)}>
                View invoice
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
