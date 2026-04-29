"use client";

import { useState } from "react";

export type Tweaks = {
  showAnnotations: boolean;
  density: "compact" | "regular" | "comfy";
};

export const DEFAULT_TWEAKS: Tweaks = {
  showAnnotations: true,
  density: "regular",
};

export function useTweaks() {
  return useState<Tweaks>(DEFAULT_TWEAKS);
}

export function TweaksPanel({
  tweaks,
  onChange,
}: {
  tweaks: Tweaks;
  onChange: (next: Tweaks) => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        right: 20,
        top: 20,
        width: 240,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(0,0,0,0.08)",
        borderRadius: 8,
        padding: 14,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
        fontSize: 12,
        color: "#2a251f",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        zIndex: 50,
      }}
    >
      <div
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          color: "rgba(60,50,40,0.6)",
          marginBottom: 10,
        }}
      >
        Tweaks
      </div>

      <SectionLabel>Annotations</SectionLabel>
      <Toggle
        label="Show pins & legend"
        value={tweaks.showAnnotations}
        onChange={(v) => onChange({ ...tweaks, showAnnotations: v })}
      />

      <div style={{ height: 12 }} />

      <SectionLabel>List density</SectionLabel>
      <Radio
        value={tweaks.density}
        options={["compact", "regular", "comfy"]}
        onChange={(v) => onChange({ ...tweaks, density: v as Tweaks["density"] })}
      />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: 0.6,
        color: "rgba(60,50,40,0.5)",
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 0",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        font: "inherit",
        color: "inherit",
        width: "100%",
        textAlign: "left",
      }}
    >
      <span
        style={{
          width: 28,
          height: 16,
          borderRadius: 8,
          background: value ? "oklch(0.62 0.14 50)" : "rgba(0,0,0,0.15)",
          position: "relative",
          flexShrink: 0,
          transition: "background 0.15s",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: value ? 14 : 2,
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "white",
            transition: "left 0.15s",
            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
          }}
        />
      </span>
      <span>{label}</span>
    </button>
  );
}

function Radio({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            style={{
              flex: 1,
              padding: "5px 6px",
              border: `1px solid ${active ? "oklch(0.62 0.14 50)" : "rgba(0,0,0,0.12)"}`,
              borderRadius: 4,
              background: active ? "oklch(0.94 0.04 50)" : "white",
              color: active ? "oklch(0.62 0.14 50)" : "#5a4a2a",
              cursor: "pointer",
              font: "inherit",
              fontSize: 11,
              textTransform: "capitalize",
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
