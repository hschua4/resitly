"use client";

import { forwardRef, useState } from "react";
import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";

// ─── Linear design tokens (resolved via CSS vars in globals.css) ─────────────

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

// ─── Eyebrow — small uppercase label ─────────────────────────────────────────

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
        fontSize: 12,
        fontWeight: 510,
        textTransform: "uppercase",
        letterSpacing: 0.6,
        color: tone === "accent" ? RK.accent : RK.ink3,
      }}
    >
      {children}
    </div>
  );
}

// ─── Field label ─────────────────────────────────────────────────────────────

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
        fontSize: 13,
        fontWeight: 510,
        color: RK.ink2,
      }}
    >
      {children}
    </label>
  );
}

// ─── Input — Linear text field: subtle surface, accent focus ring ────────────

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
        fontFamily: RK.sans,
        fontSize: 14,
        color: RK.ink,
        background: "color-mix(in oklab, var(--rk-ink) 2%, transparent)",
        border: `1px solid ${borderColor}`,
        borderRadius: 6,
        padding: "10px 12px",
        outline: "none",
        boxShadow: focused
          ? `0 0 0 3px color-mix(in oklab, ${
              invalid ? RK.err : RK.accent
            } 18%, transparent)`
          : "none",
        transition: "border-color 120ms, box-shadow 120ms",
        ...style,
      }}
    />
  );
});

// ─── Button — accent (primary indigo) / ghost variants ───────────────────────

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
  const padding = size === "md" ? "10px 16px" : "7px 12px";
  const fontSize = size === "md" ? 14 : 13;
  return (
    <button
      {...props}
      className={["ln-btn", accent ? "ln-btn-primary" : "ln-btn-ghost", className]
        .filter(Boolean)
        .join(" ")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: block ? "100%" : "auto",
        padding,
        borderRadius: 6,
        fontFamily: RK.sans,
        fontSize,
        fontWeight: 510,
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ─── Divider with centered label ─────────────────────────────────────────────

export function RKDivider({ label }: { label: string }) {
  return (
    <div style={{ position: "relative", margin: "20px 0" }}>
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
            padding: "0 12px",
            fontFamily: RK.sans,
            fontSize: 12,
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
        fontFamily: RK.sans,
        fontSize: 12.5,
        color: RK.err,
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

// ─── Page heading block (eyebrow + title + subtitle) ─────────────────────────

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
    <div style={{ marginBottom: 24, display: "flex", flexDirection: "column", gap: 8 }}>
      <Kicker tone="accent">{kicker}</Kicker>
      <h2
        style={{
          fontFamily: RK.sans,
          fontSize: 24,
          fontWeight: 510,
          letterSpacing: "-0.5px",
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
          fontSize: 14.5,
          color: RK.ink3,
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
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
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
