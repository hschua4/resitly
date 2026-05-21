import type { CSSProperties } from "react";
import Link from "next/link";

// RK tokens (resolved via CSS vars in globals.css) — kept inline so this
// stays a server component, matching the landing page's token usage.
const RK = {
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
  mono: "var(--rk-mono)",
  sans: "var(--rk-sans)",
} as const;

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: RK.paper,
        color: RK.ink,
        fontFamily: RK.sans,
        padding: "40px 16px",
      }}
    >
      {/* Grid backdrop */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(to right, ${RK.rule2} 1px, transparent 1px), linear-gradient(to bottom, ${RK.rule2} 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 0%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 0%, transparent 70%)",
          opacity: 0.55,
          pointerEvents: "none",
        }}
      />
      {/* Soft accent glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: -80,
          width: 640,
          height: 320,
          transform: "translateX(-50%)",
          background: `radial-gradient(closest-side, ${RK.accentSoft}, transparent 70%)`,
          opacity: 0.7,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", width: "100%", maxWidth: 400 }}>
        {/* Brand row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: RK.mono,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: 0.5,
              color: RK.ink,
              textDecoration: "none",
            }}
          >
            resitly<span style={{ color: RK.accent }}>.</span>
          </Link>
          <span
            style={{
              fontFamily: RK.mono,
              fontSize: 10,
              letterSpacing: 0.5,
              color: RK.ink3,
              textTransform: "uppercase",
            }}
          >
            built for malaysia
          </span>
        </div>

        {/* Window panel */}
        <div
          style={{
            position: "relative",
            background: RK.surface,
            border: `1px solid ${RK.rule}`,
            borderRadius: 4,
            boxShadow:
              "0 1px 0 0 rgba(0,0,0,0.02), 0 24px 48px -24px rgba(0,0,0,0.22)",
          }}
        >
          {/* Corner brackets */}
          {([
            { top: -1, left: -1, borderRight: 0, borderBottom: 0 },
            { top: -1, right: -1, borderLeft: 0, borderBottom: 0 },
            { bottom: -1, left: -1, borderRight: 0, borderTop: 0 },
            { bottom: -1, right: -1, borderLeft: 0, borderTop: 0 },
          ] as CSSProperties[]).map((pos, i) => (
            <span
              key={i}
              aria-hidden
              style={{
                position: "absolute",
                width: 12,
                height: 12,
                border: `1px solid ${RK.accent}`,
                ...pos,
              }}
            />
          ))}

          {/* Window chrome */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 30,
              padding: "0 12px",
              borderBottom: `1px solid ${RK.rule}`,
              background: RK.paper2,
              fontFamily: RK.mono,
              fontSize: 10,
              color: RK.ink3,
              letterSpacing: 0.3,
            }}
          >
            <span
              style={{ width: 7, height: 7, borderRadius: 999, background: RK.rule }}
            />
            <span
              style={{ width: 7, height: 7, borderRadius: 999, background: RK.rule }}
            />
            <span
              style={{ width: 7, height: 7, borderRadius: 999, background: RK.rule }}
            />
            <span style={{ marginLeft: 10 }}>resitly.app / auth</span>
            <span style={{ flex: 1 }} />
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                textTransform: "uppercase",
                letterSpacing: 0.4,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: RK.ok,
                }}
              />
              secure
            </span>
          </div>

          {/* Content */}
          <div style={{ padding: 24 }}>{children}</div>
        </div>

        {/* Footer note */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            justifyContent: "space-between",
            fontFamily: RK.mono,
            fontSize: 10,
            color: RK.ink3,
            letterSpacing: 0.4,
          }}
        >
          <span>© 2026 resitly</span>
          <span>tls · encrypted</span>
        </div>
      </div>
    </div>
  );
}
