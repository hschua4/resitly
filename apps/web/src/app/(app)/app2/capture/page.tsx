"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Bracket, H, RK } from "@/components/v2/kit";
import { CaptureDropzone } from "@/components/v2/capture-dropzone";
import { apiClient } from "@/lib/api-client";
import type { Invoice } from "@resitly/types";

type UploadStep = "idle" | "uploading" | "creating" | "triggering";

const stepLabel: Record<UploadStep, string> = {
  idle:       "process with AI",
  uploading:  "uploading…",
  creating:   "saving invoice…",
  triggering: "starting AI extraction…",
};

export default function CapturePage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [step, setStep] = useState<UploadStep>("idle");
  const isLoading = step !== "idle";

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setStep("uploading");
      const presignRes = await apiClient<{
        data: { uploadUrl: string; key: string; publicUrl: string };
      }>("/v1/uploads/presign", {
        method: "POST",
        body: JSON.stringify({
          filename: selectedFile.name,
          contentType: selectedFile.type,
        }),
      });
      const { uploadUrl, key, publicUrl } = presignRes.data;

      const r2Res = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      if (!r2Res.ok) throw new Error("Failed to upload file to storage");

      setStep("creating");
      const invoiceRes = await apiClient<{ data: Invoice }>("/v1/invoices", {
        method: "POST",
        body: JSON.stringify({
          fileKey: key,
          fileUrl: publicUrl,
          fileType: selectedFile.type,
          originalName: selectedFile.name,
        }),
      });
      const invoice = invoiceRes.data;

      setStep("triggering");
      void apiClient(`/v1/invoices/${invoice.id}/extract`, { method: "POST" }).catch(() => {});

      router.push(`/app2/invoices/${invoice.id}`);
    } catch (err) {
      setStep("idle");
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
  };

  return (
    <div style={{ background: RK.paper, color: RK.ink, minHeight: "calc(100dvh - 48px)" }}>
      <H
        kicker="capture"
        title="Add a receipt"
        right={
          <span style={{ fontFamily: RK.mono, fontSize: 10, color: RK.ink3 }}>
            JPEG · PNG · WEBP · HEIC · PDF · 10 MB
          </span>
        }
      />
      <div
        style={{
          padding: "0 18px 24px",
          maxWidth: 720,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <CaptureDropzone onFileSelect={setSelectedFile} isUploading={isLoading} />
        <Bracket
          accent
          block
          disabled={!selectedFile || isLoading}
          onClick={handleUpload}
        >
          {isLoading && (
            <Loader2 size={11} className="animate-spin" style={{ display: "inline", marginRight: 6 }} />
          )}
          {stepLabel[step]}
        </Bracket>
        <div
          style={{
            fontFamily: RK.mono,
            fontSize: 10,
            color: RK.ink3,
            textAlign: "center",
            letterSpacing: 0.4,
          }}
        >
          your files are stored securely · AI extraction takes 5–15 seconds
        </div>
      </div>
    </div>
  );
}
