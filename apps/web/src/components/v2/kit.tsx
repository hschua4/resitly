"use client";

import type { CSSProperties, ReactNode } from "react";

export const RK = {
  ink: "var(--rk-ink)",
  ink2: "var(--rk-ink2)",
  ink3: "var(--rk-ink3)",
  rule: "var(--rk-rule)",
  rule2: "var(--rk-rule2)",
  paper: "var(--rk-paper)",
  paper2: "var(--rk-paper2)",
  surface: "var(--rk-surface)",
  hi: "var(--rk-hi)",
  accent: "var(--rk-accent)",
  accentSoft: "var(--rk-accent-soft)",
  ok: "var(--rk-ok)",
  okSoft: "var(--rk-ok-soft)",
  warn: "var(--rk-warn)",
  warnSoft: "var(--rk-warn-soft)",
  err: "var(--rk-err)",
  errSoft: "var(--rk-err-soft)",
  mono: "var(--rk-mono)",
  sans: "var(--rk-sans)",
} as const;

export type Tone = "ink" | "ok" | "warn" | "err" | "accent";
export type Density = "compact" | "regular" | "comfy";
export type StyleProps = CSSProperties;

export function Bracket({
  children,
  block,
  accent,
  disabled,
  onClick,
}: {
  children: ReactNode;
  block?: boolean;
  accent?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={["ln-btn", accent ? "ln-btn-primary" : "ln-btn-ghost"].join(" ")}
      style={{
        display: block ? "flex" : "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        width: block ? "100%" : "auto",
        padding: "6px 12px",
        borderRadius: 6,
        fontFamily: RK.sans,
        fontSize: 13,
        fontWeight: 510,
        cursor: disabled ? "not-allowed" : onClick ? "pointer" : "default",
      }}
    >
      {children}
    </button>
  );
}

export function Pill({
  tone = "ink",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  const tones: Record<Tone, [string, string, string]> = {
    ink: ["transparent", RK.ink2, RK.rule],
    ok: [RK.okSoft, RK.ok, "transparent"],
    warn: [RK.warnSoft, RK.warn, "transparent"],
    err: [RK.errSoft, RK.err, "transparent"],
    accent: [RK.accentSoft, RK.accent, "transparent"],
  };
  const [bg, fg, br] = tones[tone] || tones.ink;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 9px",
        borderRadius: 9999,
        background: bg,
        color: fg,
        border: `1px solid ${br}`,
        fontFamily: RK.sans,
        fontSize: 12,
        fontWeight: 510,
        lineHeight: 1.5,
      }}
    >
      {children}
    </span>
  );
}

export function Meter({ level = 3, label }: { level?: number; label?: string }) {
  const cells = [1, 2, 3].map((i) => i <= level);
  const tone = level >= 3 ? RK.ok : level === 2 ? RK.warn : RK.err;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontFamily: RK.mono,
        fontSize: 9.5,
        color: RK.ink3,
      }}
    >
      <span style={{ display: "inline-flex", gap: 2 }}>
        {cells.map((on, i) => (
          <span
            key={i}
            style={{
              width: 6,
              height: 8,
              background: on ? tone : "transparent",
              border: `1px solid ${on ? tone : RK.rule}`,
            }}
          />
        ))}
      </span>
      {label && <span>{label}</span>}
    </span>
  );
}

let scanIdCounter = 0;
function nextScanId() {
  scanIdCounter += 1;
  return `hatch-${scanIdCounter}`;
}

export function ReceiptScan({
  w = 220,
  h = 320,
  rotate = 0,
  label = "RECEIPT · IMG_0421.jpg",
}: {
  w?: number;
  h?: number;
  rotate?: number;
  label?: string;
}) {
  const id = nextScanId();
  return (
    <div
      style={{
        position: "relative",
        width: w,
        height: h,
        transform: `rotate(${rotate}deg)`,
        transformOrigin: "center",
        filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.04))",
      }}
    >
      <svg
        width={w}
        height={h}
        style={{ display: "block", background: RK.surface, border: `1px solid ${RK.rule}` }}
      >
        <defs>
          <pattern
            id={id}
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="6" stroke={RK.rule} strokeWidth="1" />
          </pattern>
        </defs>
        <rect x="14" y="18" width={w - 28} height="14" fill={RK.rule2} />
        <rect x="14" y="38" width={(w - 28) * 0.6} height="8" fill={RK.rule2} />
        <rect x="14" y="62" width={w - 28} height={h - 130} fill={`url(#${id})`} />
        <rect x="14" y={h - 60} width={w - 28} height="1" fill={RK.rule} />
        <rect x="14" y={h - 50} width={(w - 28) * 0.4} height="8" fill={RK.rule2} />
        <rect x={w - 70} y={h - 50} width="56" height="10" fill={RK.ink2} opacity="0.7" />
        <rect x="14" y={h - 32} width={(w - 28) * 0.7} height="6" fill={RK.rule2} />
        <rect x="14" y={h - 22} width={(w - 28) * 0.5} height="6" fill={RK.rule2} />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 6,
          left: 6,
          fontFamily: RK.mono,
          fontSize: 8.5,
          color: RK.ink3,
          letterSpacing: 0.4,
          background: RK.surface,
          padding: "1px 4px",
          border: `1px solid ${RK.rule}`,
        }}
      >
        {label}
      </div>
    </div>
  );
}

export function ScanBox({
  x,
  y,
  w,
  h,
  n,
  tone = "accent",
  dashed,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  n?: number;
  tone?: "accent" | "warn" | "err";
  dashed?: boolean;
}) {
  const c = tone === "warn" ? RK.warn : tone === "err" ? RK.err : RK.accent;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        border: `${dashed ? "1.5px dashed" : "1.5px solid"} ${c}`,
        background: tone === "warn" ? RK.warnSoft : RK.accentSoft,
        opacity: 0.85,
      }}
    >
      {n != null && (
        <div
          style={{
            position: "absolute",
            top: -9,
            left: -9,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: c,
            color: "white",
            fontFamily: RK.mono,
            fontSize: 9.5,
            display: "grid",
            placeItems: "center",
            fontWeight: 600,
          }}
        >
          {n}
        </div>
      )}
    </div>
  );
}

export function Field({
  label,
  value,
  conf,
  tone,
  edited,
}: {
  label: string;
  value: ReactNode;
  conf?: number;
  tone?: "warn";
  edited?: boolean;
}) {
  const meter = conf == null ? null : <Meter level={conf} />;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "90px 1fr auto",
        gap: 10,
        padding: "8px 12px",
        borderBottom: `1px solid ${RK.rule2}`,
        alignItems: "center",
      }}
    >
      <div
        style={{
          fontFamily: RK.sans,
          fontSize: 13,
          color: RK.ink3,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: RK.sans,
          fontSize: 13.5,
          fontWeight: 510,
          color: tone === "warn" ? RK.warn : RK.ink,
          background: edited ? RK.accentSoft : "transparent",
          padding: edited ? "2px 6px" : 0,
          borderRadius: 4,
        }}
      >
        {value}
      </div>
      <div>{meter}</div>
    </div>
  );
}

export function H({
  kicker,
  title,
  right,
}: {
  kicker?: ReactNode;
  title?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 12, padding: "14px 18px 10px" }}>
      <div>
        {kicker && (
          <div
            style={{
              fontFamily: RK.sans,
              fontSize: 12,
              fontWeight: 510,
              color: RK.ink3,
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            {kicker}
          </div>
        )}
        {title && (
          <div
            style={{
              fontFamily: RK.sans,
              fontSize: 18,
              color: RK.ink,
              fontWeight: 590,
              letterSpacing: "-0.2px",
              marginTop: 2,
            }}
          >
            {title}
          </div>
        )}
      </div>
      <div style={{ flex: 1 }} />
      {right}
    </div>
  );
}
