import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import {
  FileText,
  Tag,
  BarChart2,
  Download,
  Check,
  User,
  Building2,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

// ─── RK design tokens (server-safe; resolved via CSS vars in globals.css) ───

const RK = {
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
  mono: "var(--rk-mono)",
  sans: "var(--rk-sans)",
} as const;

type Tone = "ink" | "ok" | "warn" | "accent";

// ─── Primitive: bracketed mono link/button ──────────────────────────────────

function BracketLink({
  href,
  children,
  accent,
  block,
  size = "sm",
}: {
  href: string;
  children: ReactNode;
  accent?: boolean;
  block?: boolean;
  size?: "sm" | "md";
}) {
  const padding = size === "md" ? "9px 14px" : "5px 10px";
  const fontSize = size === "md" ? 12.5 : 11;
  return (
    <Link
      href={href}
      style={{
        display: block ? "flex" : "inline-flex",
        alignItems: "center",
        gap: 6,
        width: block ? "100%" : "auto",
        justifyContent: block ? "center" : "flex-start",
        border: `1px solid ${accent ? RK.accent : RK.rule}`,
        background: accent ? RK.accentSoft : "transparent",
        color: accent ? RK.accent : RK.ink2,
        padding,
        borderRadius: 3,
        fontFamily: RK.mono,
        fontSize,
        letterSpacing: 0.3,
        textDecoration: "none",
        transition: "background 120ms, border-color 120ms, color 120ms",
      }}
    >
      {children}
    </Link>
  );
}

// ─── Primitive: pill ────────────────────────────────────────────────────────

function Pill({ tone = "ink", children }: { tone?: Tone; children: ReactNode }) {
  const map: Record<Tone, [string, string, string]> = {
    ink: [RK.paper2, RK.ink2, RK.rule],
    ok: [RK.okSoft, RK.ok, RK.ok],
    warn: [RK.warnSoft, RK.warn, RK.warn],
    accent: [RK.accentSoft, RK.accent, RK.accent],
  };
  const [bg, fg, br] = map[tone];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: 999,
        background: bg,
        color: fg,
        border: `1px solid ${br}`,
        fontFamily: RK.mono,
        fontSize: 9.5,
        letterSpacing: 0.4,
        lineHeight: 1.5,
      }}
    >
      {children}
    </span>
  );
}

// ─── Primitive: kicker (uppercase mono eyebrow) ─────────────────────────────

function Kicker({ children, tone = "ink3" }: { children: ReactNode; tone?: "ink3" | "accent" }) {
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

// ─── Primitive: section heading ─────────────────────────────────────────────

function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "left",
}: {
  kicker?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div
      style={{
        textAlign: align,
        marginBottom: 48,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        alignItems: align === "center" ? "center" : "flex-start",
      }}
    >
      {kicker && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              width: 18,
              height: 1,
              background: RK.rule,
              display: "inline-block",
            }}
          />
          <Kicker tone="accent">{kicker}</Kicker>
        </div>
      )}
      <h2
        style={{
          fontFamily: RK.sans,
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 500,
          color: RK.ink,
          letterSpacing: -0.5,
          lineHeight: 1.1,
          margin: 0,
          maxWidth: 720,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontFamily: RK.sans,
            fontSize: 14.5,
            color: RK.ink2,
            lineHeight: 1.6,
            margin: 0,
            maxWidth: 560,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Navbar ─────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: `color-mix(in oklab, ${RK.paper} 85%, transparent)`,
        backdropFilter: "blur(8px)",
        borderBottom: `1px solid ${RK.rule}`,
      }}
    >
      <div
        className="mx-auto flex max-w-6xl items-center justify-between"
        style={{ padding: "10px 24px", height: 52 }}
      >
        <Link
          href="/"
          style={{
            fontFamily: RK.mono,
            fontSize: 13,
            letterSpacing: 0.5,
            color: RK.ink,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          resitly<span style={{ color: RK.accent }}>.</span>
        </Link>

        <nav className="hidden md:flex" style={{ gap: 4 }}>
          {[
            { label: "product", href: "#product" },
            { label: "features", href: "#features" },
            { label: "pricing", href: "#pricing" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontFamily: RK.mono,
                fontSize: 11,
                color: RK.ink2,
                padding: "4px 10px",
                borderRadius: 3,
                textDecoration: "none",
                letterSpacing: 0.3,
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link
            href="/sign-in"
            style={{
              fontFamily: RK.mono,
              fontSize: 11,
              color: RK.ink2,
              padding: "5px 10px",
              textDecoration: "none",
              letterSpacing: 0.3,
            }}
          >
            sign in
          </Link>
          <BracketLink href="/sign-up" accent>
            ＋ start free
          </BracketLink>
        </div>
      </div>
    </header>
  );
}

// ─── Hero wireframe mock ────────────────────────────────────────────────────

function ReceiptHatch({ height = 240 }: { height?: number }) {
  const id = "rk-landing-hatch";
  return (
    <svg
      width="100%"
      height={height}
      style={{ display: "block", background: RK.surface }}
      preserveAspectRatio="none"
      viewBox={`0 0 220 ${height}`}
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
      {/* Header strip */}
      <rect x="14" y="18" width="192" height="14" fill={RK.rule2} />
      <rect x="14" y="38" width="120" height="8" fill={RK.rule2} />
      {/* Body hatch */}
      <rect x="14" y="60" width="192" height={height - 130} fill={`url(#${id})`} />
      {/* Footer */}
      <rect x="14" y={height - 60} width="192" height="1" fill={RK.rule} />
      <rect x="14" y={height - 50} width="80" height="8" fill={RK.rule2} />
      <rect x="150" y={height - 50} width="56" height="10" fill={RK.ink2} opacity="0.7" />
      <rect x="14" y={height - 32} width="140" height="6" fill={RK.rule2} />
      <rect x="14" y={height - 22} width="100" height="6" fill={RK.rule2} />
    </svg>
  );
}

function HeroMockUI() {
  const fields: [string, string, Tone | undefined][] = [
    ["Vendor", "99 Speedmart", undefined],
    ["Date", "12 Apr 2026", undefined],
    ["Subtotal", "RM 45.10", undefined],
    ["SST · 6%", "RM 2.70", "accent"],
    ["Total", "RM 47.80", undefined],
  ];

  return (
    <div
      style={{
        position: "relative",
        margin: "56px auto 0",
        maxWidth: 880,
        background: RK.surface,
        border: `1px solid ${RK.rule}`,
        borderRadius: 4,
        boxShadow: "0 1px 0 0 rgba(0,0,0,0.02), 0 24px 48px -24px rgba(0,0,0,0.18)",
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          height: 30,
          padding: "0 12px",
          borderBottom: `1px solid ${RK.rule}`,
          fontFamily: RK.mono,
          fontSize: 10,
          color: RK.ink3,
          letterSpacing: 0.3,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: 999, background: RK.rule }} />
        <span style={{ width: 8, height: 8, borderRadius: 999, background: RK.rule }} />
        <span style={{ width: 8, height: 8, borderRadius: 999, background: RK.rule }} />
        <span style={{ marginLeft: 12 }}>resitly.app / inbox / IMG_0421.jpg</span>
        <span style={{ flex: 1 }} />
        <Pill tone="ok">extraction · complete</Pill>
      </div>

      {/* Two-column body */}
      <div
        className="grid grid-cols-1 md:grid-cols-[280px_1fr]"
        style={{ minHeight: 360 }}
      >
        {/* Left — receipt scan */}
        <div
          style={{
            position: "relative",
            padding: 18,
            borderRight: `1px solid ${RK.rule}`,
            background: RK.paper2,
          }}
        >
          <div style={{ position: "relative" }}>
            <ReceiptHatch height={300} />
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
                padding: "1px 5px",
                border: `1px solid ${RK.rule}`,
              }}
            >
              IMG_0421.jpg
            </div>
            {/* Detection box overlays */}
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 14,
                width: 130,
                height: 22,
                border: `1.5px dashed ${RK.accent}`,
                background: RK.accentSoft,
                opacity: 0.85,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 24,
                right: 18,
                width: 64,
                height: 18,
                border: `1.5px solid ${RK.accent}`,
                background: RK.accentSoft,
                opacity: 0.85,
              }}
            />
          </div>
        </div>

        {/* Right — extracted fields */}
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <Kicker>extracted · 1.2s</Kicker>
              <div
                style={{
                  fontFamily: RK.sans,
                  fontSize: 18,
                  color: RK.ink,
                  fontWeight: 500,
                  marginTop: 2,
                }}
              >
                99 Speedmart Sdn Bhd
              </div>
            </div>
            <Pill tone="accent">groceries</Pill>
          </div>

          <div style={{ border: `1px solid ${RK.rule}`, background: RK.paper }}>
            {fields.map(([label, value, tone], i) => (
              <div
                key={label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "100px 1fr auto",
                  gap: 10,
                  alignItems: "center",
                  padding: "8px 12px",
                  borderBottom: i === fields.length - 1 ? "none" : `1px solid ${RK.rule2}`,
                }}
              >
                <span
                  style={{
                    fontFamily: RK.mono,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: 0.4,
                    color: RK.ink3,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: RK.mono,
                    fontSize: 12,
                    color: tone === "accent" ? RK.accent : RK.ink,
                  }}
                >
                  {value}
                </span>
                <span style={{ display: "inline-flex", gap: 2 }}>
                  {[1, 2, 3].map((n) => (
                    <span
                      key={n}
                      style={{
                        width: 6,
                        height: 8,
                        background: RK.ok,
                        border: `1px solid ${RK.ok}`,
                      }}
                    />
                  ))}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Pill>auto · category</Pill>
            <Pill>auto · sst</Pill>
            <Pill tone="ok">3/3 confidence</Pill>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── How It Works ───────────────────────────────────────────────────────────

const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Capture",
    description:
      "Snap with your phone or drag in JPG, PNG, HEIC, or PDF. Bulk uploads supported.",
  },
  {
    number: "02",
    title: "Extract",
    description:
      "AI reads vendor, date, line items, totals, and SST. Confidence shown per field.",
  },
  {
    number: "03",
    title: "Organize",
    description:
      "Auto-categorized and ready to filter, search, or export to CSV / Excel.",
  },
] as const;

function HowItWorks() {
  return (
    <section id="product" style={{ padding: "96px 24px" }}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          kicker="how it works"
          title="Three steps to zero manual entry"
          align="center"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 0,
            border: `1px solid ${RK.rule}`,
            background: RK.surface,
          }}
        >
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <div
              key={step.number}
              style={{
                position: "relative",
                padding: "28px 24px 32px",
                borderRight:
                  i === HOW_IT_WORKS_STEPS.length - 1 ? "none" : `1px solid ${RK.rule}`,
              }}
            >
              <div
                style={{
                  fontFamily: RK.mono,
                  fontSize: 10,
                  letterSpacing: 0.6,
                  color: RK.ink3,
                  textTransform: "uppercase",
                  marginBottom: 16,
                }}
              >
                step / {step.number}
              </div>
              <div
                style={{
                  fontFamily: RK.sans,
                  fontSize: 20,
                  fontWeight: 500,
                  color: RK.ink,
                  marginBottom: 8,
                }}
              >
                {step.title}
              </div>
              <p
                style={{
                  fontFamily: RK.sans,
                  fontSize: 13.5,
                  color: RK.ink2,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {step.description}
              </p>
              {/* Connector dot at top-right corner */}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: -3,
                  right: i === HOW_IT_WORKS_STEPS.length - 1 ? -3 : undefined,
                  left: i === HOW_IT_WORKS_STEPS.length - 1 ? undefined : -3,
                  width: 6,
                  height: 6,
                  background: RK.accent,
                  borderRadius: 999,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Core Features ──────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: FileText,
    title: "Smart receipt extraction",
    description:
      "Line items, totals, SST, vendor detection. Works with crumpled, blurred, or low-light photos.",
  },
  {
    icon: Tag,
    title: "Auto categorization",
    description:
      "F&B, transport, office, utilities, and custom rules. Learns from your edits over time.",
  },
  {
    icon: BarChart2,
    title: "Clean dashboard",
    description:
      "Monthly spend, category breakdowns, instant search and filtering across every receipt.",
  },
  {
    icon: Download,
    title: "Export anywhere",
    description:
      "CSV and Excel export, ready for your accountant, AutoCount, SQL, or bookkeeping tools.",
  },
] as const;

function CoreFeatures() {
  return (
    <section id="features" style={{ padding: "96px 24px" }}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          kicker="features"
          title="Everything you need. Nothing you don't."
          subtitle="No bloat, no steep learning curve — just the tools Malaysian SMEs actually use day to day."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {FEATURES.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              style={{
                background: RK.surface,
                border: `1px solid ${RK.rule}`,
                padding: 24,
                borderRadius: 4,
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: RK.mono,
                  fontSize: 9.5,
                  color: RK.ink3,
                  letterSpacing: 0.5,
                  marginBottom: 14,
                }}
              >
                ／{String(i + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  width: 36,
                  height: 36,
                  border: `1px solid ${RK.rule}`,
                  background: RK.paper2,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 3,
                  marginBottom: 14,
                  color: RK.accent,
                }}
              >
                <Icon className="size-4" />
              </div>
              <div
                style={{
                  fontFamily: RK.sans,
                  fontSize: 15,
                  fontWeight: 500,
                  color: RK.ink,
                  marginBottom: 6,
                }}
              >
                {title}
              </div>
              <p
                style={{
                  fontFamily: RK.sans,
                  fontSize: 13,
                  color: RK.ink2,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Built for Malaysia ─────────────────────────────────────────────────────

const MALAYSIA_POINTS = [
  "Reads BM, English, and Chinese receipts",
  "Understands local merchants — 99 Speedmart, mamak, kopitiam",
  "Handles every SST format used by Malaysian businesses",
  "Works with Shopee and Lazada order invoices",
] as const;

function BuiltForMalaysia() {
  return (
    <section style={{ padding: "96px 24px" }}>
      <div className="mx-auto max-w-6xl">
        <div
          style={{
            background: RK.surface,
            border: `1px solid ${RK.rule}`,
            borderRadius: 4,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top metadata strip */}
          <div
            style={{
              padding: "10px 24px",
              borderBottom: `1px solid ${RK.rule}`,
              background: RK.paper2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontFamily: RK.mono,
              fontSize: 10,
              color: RK.ink3,
              letterSpacing: 0.5,
              textTransform: "uppercase",
            }}
          >
            <span>region · MY-12</span>
            <span>built for malaysia</span>
            <span>schema · v2.4</span>
          </div>

          <div
            className="grid md:grid-cols-2"
            style={{ gap: 0 }}
          >
            <div
              style={{
                padding: "40px 32px",
                borderRight: `1px solid ${RK.rule}`,
              }}
            >
              <div
                style={{
                  fontSize: 40,
                  marginBottom: 18,
                  filter: "drop-shadow(0 1px 0 rgba(0,0,0,0.05))",
                }}
              >
                🇲🇾
              </div>
              <h2
                style={{
                  fontFamily: RK.sans,
                  fontSize: "clamp(24px, 3.2vw, 32px)",
                  fontWeight: 500,
                  color: RK.ink,
                  letterSpacing: -0.4,
                  lineHeight: 1.15,
                  margin: 0,
                }}
              >
                Built for Malaysia.
                <br />
                <span style={{ color: RK.ink3 }}>
                  Most tools fail here. Resitly doesn&apos;t.
                </span>
              </h2>
              <p
                style={{
                  fontFamily: RK.sans,
                  fontSize: 13.5,
                  color: RK.ink2,
                  lineHeight: 1.65,
                  marginTop: 16,
                  maxWidth: 460,
                }}
              >
                Generic expense trackers can&apos;t read your mamak receipt. Resitly is
                trained on real Malaysian receipts and understands the local tax system.
              </p>
            </div>

            <ul
              style={{
                margin: 0,
                padding: "40px 32px",
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 14,
                background: RK.paper2,
              }}
            >
              {MALAYSIA_POINTS.map((point, i) => (
                <li
                  key={point}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    paddingBottom: i === MALAYSIA_POINTS.length - 1 ? 0 : 14,
                    borderBottom:
                      i === MALAYSIA_POINTS.length - 1 ? "none" : `1px solid ${RK.rule2}`,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 18,
                      height: 18,
                      border: `1px solid ${RK.accent}`,
                      background: RK.accentSoft,
                      display: "grid",
                      placeItems: "center",
                      color: RK.accent,
                      borderRadius: 3,
                    }}
                  >
                    <Check className="size-3" />
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <span
                      style={{
                        fontFamily: RK.mono,
                        fontSize: 9,
                        color: RK.ink3,
                        textTransform: "uppercase",
                        letterSpacing: 0.6,
                      }}
                    >
                      capability · {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontFamily: RK.sans,
                        fontSize: 14,
                        color: RK.ink,
                        lineHeight: 1.4,
                      }}
                    >
                      {point}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Who It's For ───────────────────────────────────────────────────────────

const WHO_ITS_FOR = [
  {
    icon: User,
    role: "freelancers",
    title: "Freelancers",
    description:
      "Stop manually logging expenses. Snap, upload, done — your records stay current.",
  },
  {
    icon: Building2,
    role: "small business",
    title: "Small business owners",
    description:
      "Track spending without hiring a bookkeeper. Resitly handles the grunt work.",
  },
  {
    icon: ShoppingBag,
    role: "ecommerce",
    title: "E-commerce sellers",
    description:
      "Organize supplier invoices and Shopee / Lazada receipts. Export when filing.",
  },
] as const;

function WhoItsFor() {
  return (
    <section style={{ padding: "96px 24px" }}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading kicker="for you" title="Who uses Resitly" align="center" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {WHO_ITS_FOR.map(({ icon: Icon, role, title, description }) => (
            <div
              key={title}
              style={{
                background: RK.surface,
                border: `1px solid ${RK.rule}`,
                padding: 28,
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    border: `1px dashed ${RK.rule}`,
                    background: RK.paper2,
                    display: "grid",
                    placeItems: "center",
                    color: RK.ink2,
                    borderRadius: 3,
                  }}
                >
                  <Icon className="size-4" />
                </div>
                <Pill>{role}</Pill>
              </div>
              <div
                style={{
                  fontFamily: RK.sans,
                  fontSize: 16,
                  fontWeight: 500,
                  color: RK.ink,
                  marginBottom: 6,
                }}
              >
                {title}
              </div>
              <p
                style={{
                  fontFamily: RK.sans,
                  fontSize: 13,
                  color: RK.ink2,
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ────────────────────────────────────────────────────────────────

const PRICING_PLANS = [
  {
    name: "Free",
    price: "RM 0",
    period: "/month",
    description: "Get started, no commitment.",
    features: [
      "20 receipts per month",
      "Basic AI extraction",
      "Manual categorization",
      "7-day history",
    ],
    cta: "get started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "RM 19",
    period: "/month",
    description: "For individuals & small teams.",
    features: [
      "200 receipts per month",
      "Smart auto-categorization",
      "CSV & Excel export",
      "Full receipt history",
      "Priority email support",
    ],
    cta: "start pro trial",
    highlight: true,
    badge: "most popular",
  },
  {
    name: "Business",
    price: "RM 49",
    period: "/month",
    description: "For growing businesses.",
    features: [
      "Unlimited receipts",
      "Priority processing",
      "Advanced analytics",
      "Team seats (up to 5)",
      "Dedicated support",
    ],
    cta: "contact sales",
    highlight: false,
  },
] as const;

function Pricing() {
  return (
    <section id="pricing" style={{ padding: "96px 24px" }}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          kicker="pricing"
          title="Simple, transparent pricing"
          subtitle="Start free, upgrade when you need more."
          align="center"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              style={{
                position: "relative",
                background: RK.surface,
                border: `1px solid ${plan.highlight ? RK.accent : RK.rule}`,
                padding: 28,
                borderRadius: 4,
                display: "flex",
                flexDirection: "column",
                boxShadow: plan.highlight
                  ? `0 0 0 4px color-mix(in oklab, ${RK.accent} 14%, transparent)`
                  : undefined,
              }}
            >
              {plan.highlight && plan.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: -10,
                    left: 20,
                  }}
                >
                  <Pill tone="accent">★ {plan.badge}</Pill>
                </div>
              )}

              <div
                style={{
                  fontFamily: RK.mono,
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                  color: plan.highlight ? RK.accent : RK.ink3,
                  marginBottom: 8,
                }}
              >
                plan / {plan.name.toLowerCase()}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 4,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontFamily: RK.sans,
                    fontSize: 36,
                    fontWeight: 500,
                    color: RK.ink,
                    letterSpacing: -1,
                    lineHeight: 1,
                  }}
                >
                  {plan.price}
                </span>
                <span
                  style={{
                    fontFamily: RK.mono,
                    fontSize: 11,
                    color: RK.ink3,
                  }}
                >
                  {plan.period}
                </span>
              </div>
              <p
                style={{
                  fontFamily: RK.sans,
                  fontSize: 13,
                  color: RK.ink2,
                  margin: 0,
                  marginBottom: 22,
                }}
              >
                {plan.description}
              </p>

              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  marginBottom: 26,
                  flex: 1,
                  borderTop: `1px solid ${RK.rule2}`,
                  paddingTop: 18,
                }}
              >
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      fontFamily: RK.sans,
                      fontSize: 13,
                      color: RK.ink,
                      lineHeight: 1.45,
                    }}
                  >
                    <Check
                      className="size-3.5"
                      style={{
                        marginTop: 3,
                        flexShrink: 0,
                        color: plan.highlight ? RK.accent : RK.ok,
                      }}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <BracketLink
                href="/sign-up"
                accent={plan.highlight}
                block
                size="md"
              >
                {plan.cta} →
              </BracketLink>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ──────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section style={{ padding: "96px 24px" }}>
      <div className="mx-auto max-w-6xl">
        <div
          style={{
            position: "relative",
            background: RK.surface,
            border: `1px solid ${RK.rule}`,
            borderRadius: 4,
            padding: "64px 32px",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          {/* corner brackets */}
          {([
            { top: 8, left: 8, borderRight: 0, borderBottom: 0 },
            { top: 8, right: 8, borderLeft: 0, borderBottom: 0 },
            { bottom: 8, left: 8, borderRight: 0, borderTop: 0 },
            { bottom: 8, right: 8, borderLeft: 0, borderTop: 0 },
          ] as CSSProperties[]).map((style, i) => (
            <span
              key={i}
              aria-hidden
              style={{
                position: "absolute",
                width: 16,
                height: 16,
                border: `1px solid ${RK.accent}`,
                ...style,
              }}
            />
          ))}

          <Kicker tone="accent">// stop typing receipts</Kicker>
          <h2
            style={{
              fontFamily: RK.sans,
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 500,
              color: RK.ink,
              letterSpacing: -0.5,
              lineHeight: 1.1,
              margin: "16px auto 0",
              maxWidth: 620,
            }}
          >
            Stop typing receipts into spreadsheets.
          </h2>
          <p
            style={{
              fontFamily: RK.sans,
              fontSize: 14.5,
              color: RK.ink2,
              margin: "12px auto 0",
              maxWidth: 480,
              lineHeight: 1.6,
            }}
          >
            Join hundreds of Malaysian SMEs already saving hours every week.
          </p>

          <div
            style={{
              marginTop: 28,
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <BracketLink href="/sign-up" accent size="md">
              start scanning — free <ArrowRight className="size-3.5" />
            </BracketLink>
            <BracketLink href="#features" size="md">
              see features
            </BracketLink>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${RK.rule}`, background: RK.paper2 }}>
      <div className="mx-auto max-w-6xl" style={{ padding: "32px 24px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
          className="sm:flex-row! sm:items-start sm:justify-between"
        >
          <div>
            <Link
              href="/"
              style={{
                fontFamily: RK.mono,
                fontSize: 13,
                color: RK.ink,
                fontWeight: 600,
                letterSpacing: 0.5,
                textDecoration: "none",
              }}
            >
              resitly<span style={{ color: RK.accent }}>.</span>
            </Link>
            <p
              style={{
                fontFamily: RK.sans,
                fontSize: 12.5,
                color: RK.ink2,
                marginTop: 6,
                maxWidth: 320,
                lineHeight: 1.5,
              }}
            >
              AI receipt and invoice processing, built for Malaysian SMEs.
            </p>
          </div>

          <nav
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px 22px",
              fontFamily: RK.mono,
              fontSize: 11,
              letterSpacing: 0.3,
            }}
          >
            {[
              { label: "product", href: "#product" },
              { label: "features", href: "#features" },
              { label: "pricing", href: "#pricing" },
              { label: "privacy", href: "/privacy" },
              { label: "terms", href: "/terms" },
              { label: "sign in", href: "/sign-in" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{
                  color: RK.ink2,
                  textDecoration: "none",
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div
          style={{
            marginTop: 28,
            paddingTop: 16,
            borderTop: `1px solid ${RK.rule2}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
            fontFamily: RK.mono,
            fontSize: 10,
            color: RK.ink3,
            letterSpacing: 0.4,
          }}
        >
          <span>© 2026 resitly · all rights reserved</span>
          <span>build · v2.4 · myr</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div
      style={{
        background: RK.paper,
        color: RK.ink,
        minHeight: "100vh",
        fontFamily: RK.sans,
      }}
    >
      <Navbar />

      {/* Hero */}
      <section style={{ position: "relative", padding: "96px 24px 0", overflow: "hidden" }}>
        {/* Grid backdrop */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(to right, ${RK.rule2} 1px, transparent 1px), linear-gradient(to bottom, ${RK.rule2} 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at center top, black 0%, transparent 65%)",
            opacity: 0.6,
            pointerEvents: "none",
          }}
        />
        {/* Soft accent glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: -120,
            width: 720,
            height: 360,
            transform: "translateX(-50%)",
            background: `radial-gradient(closest-side, ${RK.accentSoft}, transparent 70%)`,
            pointerEvents: "none",
            opacity: 0.7,
          }}
        />

        <div
          className="mx-auto max-w-4xl"
          style={{ position: "relative", textAlign: "center" }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 12px",
              border: `1px solid ${RK.rule}`,
              background: RK.surface,
              borderRadius: 999,
              fontFamily: RK.mono,
              fontSize: 10.5,
              color: RK.ink2,
              letterSpacing: 0.4,
              marginBottom: 28,
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
            built for malaysian SMEs · 2026
          </div>

          <h1
            style={{
              fontFamily: RK.sans,
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 500,
              color: RK.ink,
              letterSpacing: -1.2,
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Turn receipts into clean
            <br className="hidden sm:block" />{" "}
            <span
              style={{
                background: `linear-gradient(180deg, ${RK.ink} 65%, ${RK.accent} 100%)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              financial data in seconds.
            </span>
          </h1>

          <p
            style={{
              fontFamily: RK.sans,
              fontSize: 16,
              color: RK.ink2,
              maxWidth: 640,
              margin: "20px auto 0",
              lineHeight: 1.6,
            }}
          >
            Snap a photo or upload a file. Resitly extracts, categorises, and organises
            your expenses automatically — with confidence scores you can trust.
          </p>

          <div
            style={{
              marginTop: 32,
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <BracketLink href="/sign-up" accent size="md">
              ＋ scan your first receipt — free
            </BracketLink>
            <BracketLink href="#product" size="md">
              view demo →
            </BracketLink>
          </div>

          {/* Tiny trust line */}
          <div
            style={{
              marginTop: 24,
              fontFamily: RK.mono,
              fontSize: 10.5,
              color: RK.ink3,
              letterSpacing: 0.4,
              display: "inline-flex",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <span>· no credit card</span>
            <span>· 20 free receipts / month</span>
            <span>· export to CSV</span>
          </div>

          <HeroMockUI />
        </div>
      </section>

      <HowItWorks />
      <CoreFeatures />
      <BuiltForMalaysia />
      <WhoItsFor />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}
