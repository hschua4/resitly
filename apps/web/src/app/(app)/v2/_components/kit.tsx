"use client";

import type { CSSProperties, ReactNode } from "react";

export const RK = {
  ink: "oklch(0.22 0.01 60)",
  ink2: "oklch(0.42 0.01 60)",
  ink3: "oklch(0.62 0.01 60)",
  rule: "oklch(0.86 0.005 60)",
  rule2: "oklch(0.92 0.005 60)",
  paper: "oklch(0.985 0.003 80)",
  paper2: "oklch(0.965 0.005 80)",
  hi: "oklch(0.95 0.02 50)",
  accent: "oklch(0.62 0.14 50)",
  accentSoft: "oklch(0.94 0.04 50)",
  ok: "oklch(0.6 0.1 150)",
  okSoft: "oklch(0.94 0.04 150)",
  warn: "oklch(0.7 0.13 80)",
  warnSoft: "oklch(0.95 0.05 80)",
  err: "oklch(0.58 0.16 25)",
  errSoft: "oklch(0.95 0.04 25)",
  mono: "'JetBrains Mono', ui-monospace, monospace",
  sans: "'Geist', 'Inter', system-ui, sans-serif",
} as const;

export type Tone = "ink" | "ok" | "warn" | "err" | "accent";

export function Shell({
  children,
  title,
  sub,
  bg,
}: {
  children: ReactNode;
  title?: string;
  sub?: string;
  bg?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: bg || RK.paper,
        fontFamily: RK.sans,
        color: RK.ink,
        fontSize: 12,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {(title || sub) && (
        <div
          style={{
            padding: "10px 18px",
            borderBottom: `1px solid ${RK.rule}`,
            display: "flex",
            alignItems: "baseline",
            gap: 14,
            fontFamily: RK.mono,
            fontSize: 11,
            color: RK.ink3,
            letterSpacing: 0.5,
          }}
        >
          <span style={{ textTransform: "uppercase" }}>{title}</span>
          {sub && <span style={{ color: RK.ink3 }}>{sub}</span>}
        </div>
      )}
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>{children}</div>
    </div>
  );
}

export function AppChrome({
  active = "Inbox",
  children,
  condense = false,
}: {
  active?: string;
  children: ReactNode;
  condense?: boolean;
}) {
  const items = ["Inbox", "Receipts", "Vendors", "SST", "Reports", "Export"];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        gridTemplateColumns: condense ? "160px 1fr" : "180px 1fr",
        gridTemplateRows: "40px 1fr",
      }}
    >
      <div
        style={{
          gridColumn: "1 / 3",
          borderBottom: `1px solid ${RK.rule}`,
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 14,
          fontFamily: RK.mono,
          fontSize: 11,
        }}
      >
        <span style={{ fontWeight: 600, color: RK.ink, letterSpacing: 0.5 }}>
          resitly<span style={{ color: RK.accent }}>.</span>
        </span>
        <Bracket>⌘K  search</Bracket>
        <span style={{ flex: 1 }} />
        <span style={{ color: RK.ink3 }}>SDN BHD · MYR</span>
        <Avatar />
      </div>
      <div
        style={{
          borderRight: `1px solid ${RK.rule}`,
          padding: "14px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          fontFamily: RK.mono,
          fontSize: 11,
        }}
      >
        <NavCap>workspace</NavCap>
        {items.map((n) => (
          <NavItem key={n} active={n === active}>
            {n}
          </NavItem>
        ))}
        <div style={{ height: 14 }} />
        <NavCap>this period</NavCap>
        <NavItem dim>April 2026</NavItem>
        <NavItem dim>Q2 SST cycle</NavItem>
        <div style={{ flex: 1 }} />
        <Bracket block>＋ new receipt</Bracket>
      </div>
      <div style={{ overflow: "hidden", position: "relative" }}>{children}</div>
    </div>
  );
}

function NavCap({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: 1,
        color: RK.ink3,
        padding: "8px 8px 4px",
      }}
    >
      {children}
    </div>
  );
}

function NavItem({
  children,
  active,
  dim,
}: {
  children: ReactNode;
  active?: boolean;
  dim?: boolean;
}) {
  return (
    <div
      style={{
        padding: "6px 8px",
        borderRadius: 4,
        background: active ? RK.hi : "transparent",
        color: dim ? RK.ink3 : active ? RK.ink : RK.ink2,
        borderLeft: active ? `2px solid ${RK.accent}` : "2px solid transparent",
        paddingLeft: 8,
      }}
    >
      {children}
    </div>
  );
}

function Avatar() {
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: RK.rule2,
        border: `1px solid ${RK.rule}`,
        display: "grid",
        placeItems: "center",
        fontSize: 10,
        color: RK.ink2,
      }}
    >
      AZ
    </div>
  );
}

export function Bracket({
  children,
  block,
  accent,
  onClick,
}: {
  children: ReactNode;
  block?: boolean;
  accent?: boolean;
  onClick?: () => void;
}) {
  return (
    <span
      onClick={onClick}
      style={{
        display: block ? "block" : "inline-block",
        border: `1px solid ${accent ? RK.accent : RK.rule}`,
        color: accent ? RK.accent : RK.ink2,
        padding: "4px 8px",
        borderRadius: 3,
        fontFamily: RK.mono,
        fontSize: 10.5,
        letterSpacing: 0.3,
        textAlign: block ? "center" : "left",
        cursor: "default",
        background: accent ? RK.accentSoft : "transparent",
      }}
    >
      {children}
    </span>
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
    ink: [RK.paper2, RK.ink2, RK.rule],
    ok: [RK.okSoft, RK.ok, RK.ok],
    warn: [RK.warnSoft, RK.warn, RK.warn],
    err: [RK.errSoft, RK.err, RK.err],
    accent: [RK.accentSoft, RK.accent, RK.accent],
  };
  const [bg, fg, br] = tones[tone] || tones.ink;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 7px",
        borderRadius: 999,
        background: bg,
        color: fg,
        border: `1px solid ${br}`,
        fontFamily: RK.mono,
        fontSize: 9.5,
        letterSpacing: 0.3,
        lineHeight: 1.4,
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

export function Pin({ n, hidden }: { n: number; hidden?: boolean }) {
  if (hidden) return null;
  return (
    <span
      style={{
        display: "inline-grid",
        placeItems: "center",
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: RK.accent,
        color: "white",
        fontFamily: RK.mono,
        fontSize: 9.5,
        fontWeight: 600,
        verticalAlign: "middle",
        marginLeft: 4,
      }}
    >
      {n}
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
        style={{ display: "block", background: "white", border: `1px solid ${RK.rule}` }}
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
          background: "white",
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
  n,
  tone,
  edited,
  hidePins,
}: {
  label: string;
  value: ReactNode;
  conf?: number;
  n?: number;
  tone?: "warn";
  edited?: boolean;
  hidePins?: boolean;
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
          fontFamily: RK.mono,
          fontSize: 10,
          color: RK.ink3,
          textTransform: "uppercase",
          letterSpacing: 0.4,
        }}
      >
        {label}
        {!hidePins && n != null && <Pin n={n} />}
      </div>
      <div
        style={{
          fontFamily: RK.mono,
          fontSize: 12,
          color: tone === "warn" ? RK.warn : RK.ink,
          background: edited ? RK.accentSoft : "transparent",
          padding: edited ? "2px 4px" : 0,
          borderRadius: 2,
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
              fontFamily: RK.mono,
              fontSize: 10,
              color: RK.ink3,
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            {kicker}
          </div>
        )}
        {title && (
          <div style={{ fontSize: 18, color: RK.ink, fontWeight: 500, marginTop: 2 }}>{title}</div>
        )}
      </div>
      <div style={{ flex: 1 }} />
      {right}
    </div>
  );
}

export function Legend({ items, hidden }: { items: string[]; hidden?: boolean }) {
  if (hidden) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: 12,
        top: 12,
        width: 200,
        background: "white",
        border: `1px solid ${RK.rule}`,
        padding: 10,
        fontFamily: RK.mono,
        fontSize: 10,
        color: RK.ink2,
      }}
    >
      <div
        style={{
          fontSize: 9,
          textTransform: "uppercase",
          letterSpacing: 0.6,
          color: RK.ink3,
          marginBottom: 6,
        }}
      >
        annotations
      </div>
      {items.map((it, i) => (
        <div
          key={i}
          style={{ display: "grid", gridTemplateColumns: "20px 1fr", gap: 6, padding: "3px 0" }}
        >
          <Pin n={i + 1} />
          <span>{it}</span>
        </div>
      ))}
    </div>
  );
}

export type Density = "compact" | "regular" | "comfy";

export type StyleProps = CSSProperties;
