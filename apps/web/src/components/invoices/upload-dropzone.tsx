"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, FileText, ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/pdf",
];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
}

export function UploadDropzone({ onFileSelect, isUploading }: UploadDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview]   = useState<{ url: string; name: string; type: string } | null>(null);
  const [error, setError]       = useState<string | null>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Only JPEG, PNG, WEBP, HEIC images and PDFs are supported.");
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError("File size must be under 10 MB.");
        return;
      }

      const url = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : "";
      setPreview({ url, name: file.name, type: file.type });
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = ""; // Reset input so same file can be re-selected
  };

  const clearPreview = () => {
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragEnter={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => !preview && inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-colors",
          dragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          preview && "cursor-default"
        )}
      >
        {preview ? (
          /* Preview state */
          <div className="w-full flex flex-col items-center gap-3">
            {preview.type.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview.url}
                alt="Preview"
                className="max-h-48 max-w-full rounded-md object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <FileText className="h-14 w-14" />
                <span className="text-sm font-medium">{preview.name}</span>
              </div>
            )}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); clearPreview(); }}
              className="absolute top-3 right-3 rounded-full bg-background border border-border p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="flex gap-2">
              <Upload className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                Drag &amp; drop your invoice or receipt
              </p>
              <p className="text-xs mt-1">
                JPEG, PNG, WEBP, HEIC or PDF — up to 10 MB
              </p>
            </div>
            <Button variant="outline" size="sm" type="button">
              Browse files
            </Button>
          </div>
        )}
      </div>

      {/* Hidden file inputs */}
      {/* Desktop file picker */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={onInputChange}
      />

      {/* Mobile camera capture */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onInputChange}
      />

      {/* Mobile: show camera button */}
      <div className="flex gap-2 md:hidden">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => cameraRef.current?.click()}
          disabled={isUploading}
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Take Photo
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          <FileText className="h-4 w-4 mr-2" />
          Upload File
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}
    </div>
  );
}
