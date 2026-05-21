"use client";

import { forwardRef, useState } from "react";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

// ─── RK design tokens (shared with landing page; resolved via globals.css) ───

export const RK = {
  ink: "var(--rk-ink)",
  ink2: "var(--rk-ink2)",
  ink3: "var(--rk-ink3)",
  rule: "var(--rk-rule)",
  rule2: "var(--rk-rule2)",
  paper: "var(--rk-paper)",
  paper2: "var(--rk-paper2)",
  surface: "var(--rk-surface)",
  accent: "var(--rk-accent)",
  accentSoft: "var(--rk-accent-soft)",
  ok: "var(--rk-ok)",
  okSoft: "var(--rk-ok-soft)",
  err: "var(--rk-err)",
  errSoft: "var(--rk-err-soft)",
  mono: "var(--rk-mono)",
  sans: "var(--rk-sans)",
} as const;

// ─── Kicker — uppercase mono eyebrow ─────────────────────────────────────────

export function Kicker({
  children,
  tone = "ink3",
}: {
  children: ReactNode;
  tone?: "ink3" | "accent";
}) {
  return (
    <div
      style={{
        fontFamily: RK.mono,
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: 0.8,
        color: tone === "accent" ? RK.accent : RK.ink3,
      }}
    >
      {children}
    </div>
  );
}

// ─── Field label — tiny uppercase mono (matches HeroMockUI field labels) ─────

export function RKLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: "block",
        fontFamily: RK.mono,
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        color: RK.ink3,
      }}
    >
      {children}
    </label>
  );
}

// ─── Input — blueprint field: mono value, paper bg, accent focus ring ────────

export const RKInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
>(function RKInput({ invalid, style, onFocus, onBlur, ...props }, ref) {
  const [focused, setFocused] = useState(false);
  const borderColor = invalid ? RK.err : focused ? RK.accent : RK.rule;
  return (
    <input
      ref={ref}
      className="rk-input"
      {...props}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      style={{
        width: "100%",
        fontFamily: RK.mono,
        fontSize: 13,
        color: RK.ink,
        background: RK.paper,
        border: `1px solid ${borderColor}`,
        borderRadius: 3,
        padding: "9px 11px",
        outline: "none",
        letterSpacing: 0.2,
        boxShadow: focused
          ? `0 0 0 3px color-mix(in oklab, ${
              invalid ? RK.err : RK.accent
            } 16%, transparent)`
          : "none",
        transition: "border-color 120ms, box-shadow 120ms",
        ...style,
      }}
    />
  );
});

// ─── Bracket button — bordered mono, accent / outline variants ───────────────

export function BracketButton({
  children,
  accent,
  block = true,
  size = "md",
  style,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  accent?: boolean;
  block?: boolean;
  size?: "sm" | "md";
}) {
  const padding = size === "md" ? "10px 14px" : "6px 10px";
  const fontSize = size === "md" ? 12.5 : 11;
  return (
    <button
      {...props}
      className={["rk-btn", accent ? "rk-btn-accent" : "", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        width: block ? "100%" : "auto",
        border: `1px solid ${accent ? RK.accent : RK.rule}`,
        background: accent ? RK.accentSoft : "transparent",
        color: accent ? RK.accent : RK.ink2,
        padding,
        borderRadius: 3,
        fontFamily: RK.mono,
        fontSize,
        letterSpacing: 0.3,
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ─── Divider with centered mono label ────────────────────────────────────────

export function RKDivider({ label }: { label: string }) {
  return (
    <div style={{ position: "relative", margin: "18px 0" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <span style={{ width: "100%", height: 1, background: RK.rule }} />
      </div>
      <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
        <span
          style={{
            background: RK.surface,
            padding: "0 10px",
            fontFamily: RK.mono,
            fontSize: 9.5,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            color: RK.ink3,
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

// ─── Field-level error message ───────────────────────────────────────────────

export function RKError({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        fontFamily: RK.mono,
        fontSize: 10,
        letterSpacing: 0.3,
        color: RK.err,
      }}
    >
      {children}
    </p>
  );
}

// ─── Page heading block (kicker + title + subtitle) ──────────────────────────

export function RKHeading({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div style={{ marginBottom: 22, display: "flex", flexDirection: "column", gap: 8 }}>
      <Kicker tone="accent">{kicker}</Kicker>
      <h2
        style={{
          fontFamily: RK.sans,
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: -0.4,
          lineHeight: 1.15,
          color: RK.ink,
          margin: 0,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontFamily: RK.sans,
          fontSize: 13,
          color: RK.ink2,
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}

// ─── Google mark ─────────────────────────────────────────────────────────────

export function GoogleMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
