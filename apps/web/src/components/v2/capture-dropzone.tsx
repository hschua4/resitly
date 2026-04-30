"use client";

import { useCallback, useRef, useState } from "react";
import { Camera, FileText, Upload, X } from "lucide-react";
import { Bracket, RK } from "./kit";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/pdf",
];
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

export function CaptureDropzone({
  onFileSelect,
  isUploading,
}: {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState<{ url: string; name: string; type: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Only JPEG, PNG, WEBP, HEIC and PDF supported.");
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError("File must be under 10 MB.");
        return;
      }
      const url = file.type.startsWith("image/") ? URL.createObjectURL(file) : "";
      setPreview({ url, name: file.name, type: file.type });
      onFileSelect(file);
    },
    [onFileSelect],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const clearPreview = () => {
    if (preview?.url) URL.revokeObjectURL(preview.url);
    setPreview(null);
    setError(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => !preview && inputRef.current?.click()}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: 56,
          border: `1.5px dashed ${dragging ? RK.accent : RK.rule}`,
          background: dragging ? RK.accentSoft : RK.surface,
          textAlign: "center",
          cursor: preview ? "default" : "pointer",
          transition: "background 120ms, border-color 120ms",
          fontFamily: RK.sans,
          color: RK.ink2,
        }}
      >
        {preview ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              width: "100%",
            }}
          >
            {preview.type.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview.url}
                alt="preview"
                style={{
                  maxHeight: 240,
                  maxWidth: "100%",
                  objectFit: "contain",
                  border: `1px solid ${RK.rule}`,
                  background: "white",
                }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  color: RK.ink2,
                }}
              >
                <FileText size={48} />
                <span style={{ fontFamily: RK.mono, fontSize: 11 }}>{preview.name}</span>
              </div>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearPreview();
              }}
              aria-label="clear"
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: RK.surface,
                border: `1px solid ${RK.rule}`,
                padding: 4,
                cursor: "pointer",
                color: RK.ink2,
              }}
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <Upload size={28} style={{ color: RK.ink3 }} />
            <div>
              <div style={{ color: RK.ink, fontSize: 14, fontWeight: 500 }}>
                Drop receipt or invoice
              </div>
              <div style={{ fontSize: 12, color: RK.ink3, marginTop: 4 }}>
                JPEG, PNG, WEBP, HEIC or PDF — up to 10 MB
              </div>
            </div>
            <Bracket>browse files</Bracket>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        style={{ display: "none" }}
        onChange={onInputChange}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={onInputChange}
      />

      <div className="flex gap-2 md:hidden">
        <Bracket
          onClick={() => cameraRef.current?.click()}
          disabled={isUploading}
          block
        >
          <Camera size={12} style={{ display: "inline" }} /> take photo
        </Bracket>
        <Bracket
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          block
        >
          <FileText size={12} style={{ display: "inline" }} /> upload file
        </Bracket>
      </div>

      {error && (
        <div
          style={{
            fontFamily: RK.mono,
            fontSize: 11,
            color: RK.err,
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
