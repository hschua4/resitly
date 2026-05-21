import Link from "next/link";

// Linear tokens (resolved via CSS vars in globals.css) — kept inline so this
// stays a server component.
const RK = {
  ink: "var(--rk-ink)",
  ink2: "var(--rk-ink2)",
  ink3: "var(--rk-ink3)",
  rule: "var(--rk-rule)",
  rule2: "var(--rk-rule2)",
  paper: "var(--rk-paper)",
  surface: "var(--rk-surface)",
  accent: "var(--rk-accent)",
  accentSoft: "var(--rk-accent-soft)",
  ok: "var(--rk-ok)",
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
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 0%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 0%, transparent 70%)",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
      {/* Accent glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: -120,
          width: 680,
          height: 360,
          transform: "translateX(-50%)",
          background: `radial-gradient(closest-side, ${RK.accentSoft}, transparent 70%)`,
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
            marginBottom: 18,
          }}
        >
          <Link
            href="/"
            style={{
              fontSize: 16,
              fontWeight: 590,
              letterSpacing: "-0.3px",
              color: RK.ink,
              textDecoration: "none",
            }}
          >
            resitly<span style={{ color: RK.accent }}>.</span>
          </Link>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: RK.ink3,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: 999, background: RK.ok }} />
            Secure sign-in
          </span>
        </div>

        {/* Card */}
        <div
          style={{
            background: RK.surface,
            border: `1px solid ${RK.rule}`,
            borderRadius: 12,
            padding: 28,
            boxShadow:
              "rgba(0,0,0,0.4) 0px 2px 4px, rgba(0,0,0,0.3) 0px 24px 60px -24px",
          }}
        >
          {children}
        </div>

        {/* Footer note */}
        <div
          style={{
            marginTop: 18,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: RK.ink3,
          }}
        >
          <span>© 2026 Resitly</span>
          <span>TLS encrypted</span>
        </div>
      </div>
    </div>
  );
}
