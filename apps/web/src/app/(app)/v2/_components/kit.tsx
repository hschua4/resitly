"use client";

import type { ReactNode } from "react";
import {
  Bracket,
  H,
  Meter,
  Pill,
  ReceiptScan,
  RK,
  ScanBox,
  type Density,
  type StyleProps,
  type Tone,
} from "@/components/v2/kit";

export {
  Bracket,
  H,
  Meter,
  Pill,
  ReceiptScan,
  RK,
  ScanBox,
};
export type { Density, StyleProps, Tone };

// ── Gallery-only scaffolding ─────────────────────────────────────────────

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

export function Legend({ items, hidden }: { items: string[]; hidden?: boolean }) {
  if (hidden) return null;
  return (
    <div
      style={{
        position: "absolute",
        right: 12,
        top: 12,
        width: 200,
        background: RK.surface,
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
