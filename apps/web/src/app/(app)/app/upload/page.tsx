"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { UploadDropzone } from "@/components/invoices/upload-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api-client";
import type { Invoice } from "@resitly/types";

type UploadStep = "idle" | "uploading" | "creating" | "triggering";

export default function UploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [step, setStep]                 = useState<UploadStep>("idle");

  const isLoading = step !== "idle";

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setStep("uploading");

      // 1. Get presigned URL
      const presignRes = await apiClient<{ data: { uploadUrl: string; key: string; publicUrl: string } }>(
        "/v1/uploads/presign",
        {
          method: "POST",
          body: JSON.stringify({
            filename:    selectedFile.name,
            contentType: selectedFile.type,
          }),
        }
      );
      const { uploadUrl, key, publicUrl } = presignRes.data;

      // 2. PUT directly to R2
      const r2Res = await fetch(uploadUrl, {
        method:  "PUT",
        headers: { "Content-Type": selectedFile.type },
        body:    selectedFile,
      });
      if (!r2Res.ok) throw new Error("Failed to upload file to storage");

      setStep("creating");

      // 3. Create invoice record
      const invoiceRes = await apiClient<{ data: Invoice }>("/v1/invoices", {
        method: "POST",
        body: JSON.stringify({
          fileKey:      key,
          fileUrl:      publicUrl,
          fileType:     selectedFile.type,
          originalName: selectedFile.name,
        }),
      });
      const invoice = invoiceRes.data;

      setStep("triggering");

      // 4. Trigger AI extraction (fire and forget — don't await)
      void apiClient(`/v1/invoices/${invoice.id}/extract`, { method: "POST" }).catch(() => {
        // Silently fail — processing page will show the error state
      });

      // 5. Navigate to processing page immediately
      router.push(`/app/invoices/${invoice.id}/processing`);

    } catch (err) {
      setStep("idle");
      const message = err instanceof Error ? err.message : "Upload failed";
      toast.error(message);
    }
  };

  const stepLabel: Record<UploadStep, string> = {
    idle:       "Process with AI",
    uploading:  "Uploading file...",
    creating:   "Saving invoice...",
    triggering: "Starting AI extraction...",
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Select file</CardTitle>
          <CardDescription>
            Supports Malaysian receipts, invoices, and PDFs. Max 10 MB.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <UploadDropzone
            onFileSelect={setSelectedFile}
            isUploading={isLoading}
          />

          <Button
            className="w-full"
            disabled={!selectedFile || isLoading}
            onClick={handleUpload}
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {stepLabel[step]}
          </Button>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        Your files are stored securely. AI extraction typically takes 5–15 seconds.
      </p>
    </div>
  );
}
