import type { ReactNode } from "react";
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
  Sparkles,
} from "lucide-react";

// ─── Linear design tokens (resolved via CSS vars in globals.css) ─────────────

const LN = {
  ink: "var(--rk-ink)",
  ink2: "var(--rk-ink2)",
  ink3: "var(--rk-ink3)",
  rule: "var(--rk-rule)",
  rule2: "var(--rk-rule2)",
  bg: "var(--rk-paper)",
  surface: "var(--rk-surface)",
  elevated: "var(--rk-paper2)",
  hi: "var(--rk-hi)",
  accent: "var(--rk-accent)",
  accentSoft: "var(--rk-accent-soft)",
  brand: "#5e6ad2",
  ok: "var(--rk-ok)",
  okSoft: "var(--rk-ok-soft)",
} as const;

// ─── Primitives ──────────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 510,
        textTransform: "uppercase",
        letterSpacing: 0.6,
        color: LN.accent,
      }}
    >
      {children}
    </span>
  );
}

function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "ok" | "accent";
}) {
  const map = {
    neutral: { bg: "transparent", fg: LN.ink2, br: LN.rule },
    ok: { bg: LN.okSoft, fg: LN.ok, br: "transparent" },
    accent: { bg: LN.accentSoft, fg: LN.accent, br: "transparent" },
  }[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "2px 10px",
        borderRadius: 9999,
        background: map.bg,
        color: map.fg,
        border: `1px solid ${map.br}`,
        fontSize: 12,
        fontWeight: 510,
        lineHeight: 1.5,
      }}
    >
      {children}
    </span>
  );
}

function PrimaryButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="ln-btn ln-btn-primary"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "9px 18px",
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 510,
        textDecoration: "none",
      }}
    >
      {children}
    </Link>
  );
}

function GhostButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="ln-btn ln-btn-ghost"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "9px 18px",
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 510,
        textDecoration: "none",
      }}
    >
      {children}
    </Link>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div
      style={{
        textAlign: align,
        marginBottom: 56,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        alignItems: align === "center" ? "center" : "flex-start",
      }}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        style={{
          fontSize: "clamp(28px, 4vw, 44px)",
          fontWeight: 510,
          color: LN.ink,
          letterSpacing: "-0.96px",
          lineHeight: 1.05,
          margin: 0,
          maxWidth: 720,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontSize: 17,
            fontWeight: 400,
            color: LN.ink3,
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

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: `color-mix(in oklab, ${LN.bg} 80%, transparent)`,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${LN.rule2}`,
      }}
    >
      <div
        className="mx-auto flex max-w-6xl items-center justify-between"
        style={{ padding: "0 24px", height: 56 }}
      >
        <Link
          href="/"
          style={{
            fontSize: 16,
            fontWeight: 590,
            letterSpacing: "-0.3px",
            color: LN.ink,
            textDecoration: "none",
          }}
        >
          resitly<span style={{ color: LN.accent }}>.</span>
        </Link>

        <nav className="hidden items-center md:flex" style={{ gap: 4 }}>
          {[
            { label: "Product", href: "#product" },
            { label: "Features", href: "#features" },
            { label: "Pricing", href: "#pricing" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="ln-navlink"
              style={{
                fontSize: 14,
                fontWeight: 510,
                padding: "6px 12px",
                borderRadius: 6,
                textDecoration: "none",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link
            href="/sign-in"
            className="ln-navlink"
            style={{
              fontSize: 14,
              fontWeight: 510,
              padding: "6px 12px",
              borderRadius: 6,
              textDecoration: "none",
            }}
          >
            Sign in
          </Link>
          <PrimaryButton href="/sign-up">Start free</PrimaryButton>
        </div>
      </div>
    </header>
  );
}

// ─── Hero product mock ───────────────────────────────────────────────────────

function HeroMock() {
  const fields: [string, string, boolean][] = [
    ["Vendor", "99 Speedmart Sdn Bhd", false],
    ["Date", "12 Apr 2026", false],
    ["Subtotal", "RM 45.10", false],
    ["SST · 6%", "RM 2.70", true],
    ["Total", "RM 47.80", false],
  ];

  return (
    <div
      style={{
        position: "relative",
        margin: "64px auto 0",
        maxWidth: 920,
        background: LN.surface,
        border: `1px solid ${LN.rule}`,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow:
          "rgba(0,0,0,0.4) 0px 2px 4px, rgba(0,0,0,0.3) 0px 24px 60px -24px",
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          height: 38,
          padding: "0 14px",
          borderBottom: `1px solid ${LN.rule}`,
          background: LN.elevated,
          fontSize: 12,
          color: LN.ink3,
        }}
      >
        <span style={{ width: 9, height: 9, borderRadius: 999, background: LN.rule }} />
        <span style={{ width: 9, height: 9, borderRadius: 999, background: LN.rule }} />
        <span style={{ width: 9, height: 9, borderRadius: 999, background: LN.rule }} />
        <span style={{ marginLeft: 12 }}>resitly.app / inbox / IMG_0421.jpg</span>
        <span style={{ flex: 1 }} />
        <Pill tone="ok">
          <span style={{ width: 6, height: 6, borderRadius: 999, background: LN.ok }} />
          extracted
        </Pill>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-[300px_1fr]"
        style={{ minHeight: 380 }}
      >
        {/* Left — receipt preview */}
        <div
          style={{
            padding: 22,
            borderRight: `1px solid ${LN.rule}`,
            background: LN.bg,
          }}
        >
          <div
            style={{
              position: "relative",
              height: "100%",
              minHeight: 300,
              borderRadius: 8,
              border: `1px solid ${LN.rule}`,
              background: `linear-gradient(180deg, ${LN.elevated}, ${LN.surface})`,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              padding: 18,
            }}
          >
            <div style={{ height: 12, width: "60%", background: LN.hi, borderRadius: 3 }} />
            <div style={{ height: 8, width: "40%", background: LN.rule2, borderRadius: 3 }} />
            <div style={{ height: 1, background: LN.rule, margin: "8px 0" }} />
            {[0.9, 0.7, 0.8, 0.55, 0.75].map((w, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ height: 8, width: `${w * 60}%`, background: LN.rule2, borderRadius: 3 }} />
                <div style={{ height: 8, width: 40, background: LN.rule2, borderRadius: 3 }} />
              </div>
            ))}
            <div style={{ flex: 1 }} />
            {/* detection highlight */}
            <div
              style={{
                position: "absolute",
                top: 14,
                left: 14,
                width: "62%",
                height: 18,
                borderRadius: 4,
                border: `1.5px solid ${LN.accent}`,
                background: LN.accentSoft,
              }}
            />
          </div>
        </div>

        {/* Right — extracted fields */}
        <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: LN.ink3, marginBottom: 4 }}>Extracted in 1.2s</div>
              <div style={{ fontSize: 20, fontWeight: 590, color: LN.ink, letterSpacing: "-0.24px" }}>
                99 Speedmart Sdn Bhd
              </div>
            </div>
            <Pill tone="accent">Groceries</Pill>
          </div>

          <div style={{ border: `1px solid ${LN.rule}`, borderRadius: 8, overflow: "hidden" }}>
            {fields.map(([label, value, accent], i) => (
              <div
                key={label}
                style={{
                  display: "grid",
                  gridTemplateColumns: "110px 1fr auto",
                  gap: 12,
                  alignItems: "center",
                  padding: "11px 14px",
                  borderBottom: i === fields.length - 1 ? "none" : `1px solid ${LN.rule2}`,
                  background: i % 2 ? "transparent" : LN.elevated,
                }}
              >
                <span style={{ fontSize: 13, color: LN.ink3 }}>{label}</span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 510,
                    color: accent ? LN.accent : LN.ink,
                  }}
                >
                  {value}
                </span>
                <Check className="size-3.5" style={{ color: LN.ok }} />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Pill>Auto category</Pill>
            <Pill>Auto SST</Pill>
            <Pill tone="ok">High confidence</Pill>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── How it works ────────────────────────────────────────────────────────────

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
          eyebrow="How it works"
          title="Three steps to zero manual entry"
          align="center"
        />
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: 16 }}
        >
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div
              key={step.number}
              className="ln-card ln-card-hover"
              style={{
                background: "color-mix(in oklab, var(--rk-ink) 2%, transparent)",
                border: `1px solid ${LN.rule}`,
                borderRadius: 12,
                padding: "28px 24px 30px",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 590,
                  color: LN.accent,
                  marginBottom: 16,
                }}
              >
                {step.number}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 590,
                  color: LN.ink,
                  letterSpacing: "-0.24px",
                  marginBottom: 8,
                }}
              >
                {step.title}
              </div>
              <p style={{ fontSize: 15, color: LN.ink3, lineHeight: 1.6, margin: 0 }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Core features ───────────────────────────────────────────────────────────

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
          eyebrow="Features"
          title="Everything you need. Nothing you don't."
          subtitle="No bloat, no steep learning curve — just the tools Malaysian SMEs actually use day to day."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 16 }}>
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="ln-card ln-card-hover"
              style={{
                background: "color-mix(in oklab, var(--rk-ink) 2%, transparent)",
                border: `1px solid ${LN.rule}`,
                borderRadius: 12,
                padding: 26,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  border: `1px solid ${LN.rule}`,
                  background: LN.accentSoft,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: 8,
                  marginBottom: 16,
                  color: LN.accent,
                }}
              >
                <Icon className="size-[18px]" />
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 590,
                  color: LN.ink,
                  letterSpacing: "-0.2px",
                  marginBottom: 6,
                }}
              >
                {title}
              </div>
              <p style={{ fontSize: 14.5, color: LN.ink3, lineHeight: 1.6, margin: 0 }}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Built for Malaysia ──────────────────────────────────────────────────────

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
            background: LN.surface,
            border: `1px solid ${LN.rule}`,
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div style={{ padding: "44px 36px" }}>
              <div style={{ fontSize: 40, marginBottom: 20 }}>🇲🇾</div>
              <h2
                style={{
                  fontSize: "clamp(24px, 3.2vw, 34px)",
                  fontWeight: 510,
                  color: LN.ink,
                  letterSpacing: "-0.7px",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Built for Malaysia.
                <br />
                <span style={{ color: LN.ink3 }}>Most tools fail here. Resitly doesn&apos;t.</span>
              </h2>
              <p
                style={{
                  fontSize: 15,
                  color: LN.ink3,
                  lineHeight: 1.65,
                  marginTop: 18,
                  maxWidth: 440,
                }}
              >
                Generic expense trackers can&apos;t read your mamak receipt. Resitly is trained on
                real Malaysian receipts and understands the local tax system.
              </p>
            </div>

            <ul
              style={{
                margin: 0,
                padding: "44px 36px",
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                background: LN.elevated,
                borderLeft: `1px solid ${LN.rule}`,
              }}
            >
              {MALAYSIA_POINTS.map((point, i) => (
                <li
                  key={point}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 0",
                    borderBottom:
                      i === MALAYSIA_POINTS.length - 1 ? "none" : `1px solid ${LN.rule2}`,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 22,
                      height: 22,
                      background: LN.accentSoft,
                      display: "grid",
                      placeItems: "center",
                      color: LN.accent,
                      borderRadius: 6,
                    }}
                  >
                    <Check className="size-3.5" />
                  </span>
                  <span style={{ fontSize: 15, color: LN.ink, lineHeight: 1.4 }}>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Who it's for ────────────────────────────────────────────────────────────

const WHO_ITS_FOR = [
  {
    icon: User,
    title: "Freelancers",
    description:
      "Stop manually logging expenses. Snap, upload, done — your records stay current.",
  },
  {
    icon: Building2,
    title: "Small business owners",
    description:
      "Track spending without hiring a bookkeeper. Resitly handles the grunt work.",
  },
  {
    icon: ShoppingBag,
    title: "E-commerce sellers",
    description:
      "Organize supplier invoices and Shopee / Lazada receipts. Export when filing.",
  },
] as const;

function WhoItsFor() {
  return (
    <section style={{ padding: "96px 24px" }}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow="For you" title="Who uses Resitly" align="center" />
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 16 }}>
          {WHO_ITS_FOR.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="ln-card ln-card-hover"
              style={{
                background: "color-mix(in oklab, var(--rk-ink) 2%, transparent)",
                border: `1px solid ${LN.rule}`,
                borderRadius: 12,
                padding: 28,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  border: `1px solid ${LN.rule}`,
                  background: LN.elevated,
                  display: "grid",
                  placeItems: "center",
                  color: LN.ink2,
                  borderRadius: 8,
                  marginBottom: 18,
                }}
              >
                <Icon className="size-[18px]" />
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 590,
                  color: LN.ink,
                  letterSpacing: "-0.2px",
                  marginBottom: 6,
                }}
              >
                {title}
              </div>
              <p style={{ fontSize: 14.5, color: LN.ink3, lineHeight: 1.6, margin: 0 }}>
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

const PRICING_PLANS = [
  {
    name: "Free",
    price: "RM 0",
    period: "/month",
    description: "Get started, no commitment.",
    features: ["20 receipts per month", "Basic AI extraction", "Manual categorization", "7-day history"],
    cta: "Get started",
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
    cta: "Start Pro trial",
    highlight: true,
    badge: "Most popular",
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
    cta: "Contact sales",
    highlight: false,
  },
] as const;

function Pricing() {
  return (
    <section id="pricing" style={{ padding: "96px 24px" }}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple, transparent pricing"
          subtitle="Start free, upgrade when you need more."
          align="center"
        />
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 16 }}>
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              style={{
                position: "relative",
                background: plan.highlight ? LN.surface : "color-mix(in oklab, var(--rk-ink) 2%, transparent)",
                border: `1px solid ${plan.highlight ? LN.accent : LN.rule}`,
                padding: 28,
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                boxShadow: plan.highlight
                  ? `0 0 0 4px color-mix(in oklab, ${LN.accent} 12%, transparent)`
                  : undefined,
              }}
            >
              {plan.highlight && "badge" in plan && plan.badge && (
                <div style={{ position: "absolute", top: -12, left: 24 }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "3px 10px",
                      borderRadius: 9999,
                      background: LN.accent,
                      color: "#fff",
                      border: `1px solid ${LN.accent}`,
                      fontSize: 12,
                      fontWeight: 590,
                      lineHeight: 1.5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Sparkles className="size-3" />
                    {plan.badge}
                  </span>
                </div>
              )}

              <div
                style={{
                  fontSize: 13,
                  fontWeight: 590,
                  color: plan.highlight ? LN.accent : LN.ink3,
                  marginBottom: 12,
                }}
              >
                {plan.name}
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span
                  style={{
                    fontSize: 38,
                    fontWeight: 510,
                    color: LN.ink,
                    letterSpacing: "-1.2px",
                    lineHeight: 1,
                  }}
                >
                  {plan.price}
                </span>
                <span style={{ fontSize: 14, color: LN.ink3 }}>{plan.period}</span>
              </div>
              <p style={{ fontSize: 14, color: LN.ink3, margin: "0 0 22px" }}>{plan.description}</p>

              <ul
                style={{
                  margin: 0,
                  padding: "20px 0 0",
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginBottom: 26,
                  flex: 1,
                  borderTop: `1px solid ${LN.rule2}`,
                }}
              >
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      fontSize: 14,
                      color: LN.ink2,
                      lineHeight: 1.45,
                    }}
                  >
                    <Check
                      className="size-4"
                      style={{ marginTop: 1, flexShrink: 0, color: plan.highlight ? LN.accent : LN.ok }}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.highlight ? (
                <PrimaryButton href="/sign-up">
                  {plan.cta}
                  <ArrowRight className="size-3.5" />
                </PrimaryButton>
              ) : (
                <GhostButton href="/sign-up">{plan.cta}</GhostButton>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ───────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section style={{ padding: "96px 24px" }}>
      <div className="mx-auto max-w-6xl">
        <div
          style={{
            position: "relative",
            background: LN.surface,
            border: `1px solid ${LN.rule}`,
            borderRadius: 16,
            padding: "72px 32px",
            textAlign: "center",
            overflow: "hidden",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "50%",
              top: -80,
              width: 640,
              height: 320,
              transform: "translateX(-50%)",
              background: `radial-gradient(closest-side, ${LN.accentSoft}, transparent 70%)`,
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative" }}>
            <Eyebrow>Stop typing receipts</Eyebrow>
            <h2
              style={{
                fontSize: "clamp(28px, 4vw, 44px)",
                fontWeight: 510,
                color: LN.ink,
                letterSpacing: "-0.96px",
                lineHeight: 1.05,
                margin: "16px auto 0",
                maxWidth: 620,
              }}
            >
              Stop typing receipts into spreadsheets.
            </h2>
            <p
              style={{
                fontSize: 17,
                color: LN.ink3,
                margin: "14px auto 0",
                maxWidth: 480,
                lineHeight: 1.6,
              }}
            >
              Join hundreds of Malaysian SMEs already saving hours every week.
            </p>
            <div
              style={{
                marginTop: 32,
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <PrimaryButton href="/sign-up">
                Start scanning — free
                <ArrowRight className="size-3.5" />
              </PrimaryButton>
              <GhostButton href="#features">See features</GhostButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ borderTop: `1px solid ${LN.rule2}` }}>
      <div className="mx-auto max-w-6xl" style={{ padding: "40px 24px" }}>
        <div
          className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between"
        >
          <div>
            <Link
              href="/"
              style={{
                fontSize: 16,
                fontWeight: 590,
                letterSpacing: "-0.3px",
                color: LN.ink,
                textDecoration: "none",
              }}
            >
              resitly<span style={{ color: LN.accent }}>.</span>
            </Link>
            <p style={{ fontSize: 14, color: LN.ink3, marginTop: 8, maxWidth: 320, lineHeight: 1.5 }}>
              AI receipt and invoice processing, built for Malaysian SMEs.
            </p>
          </div>

          <nav style={{ display: "flex", flexWrap: "wrap", gap: "10px 24px" }}>
            {[
              { label: "Product", href: "#product" },
              { label: "Features", href: "#features" },
              { label: "Pricing", href: "#pricing" },
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Sign in", href: "/sign-in" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="ln-navlink"
                style={{ fontSize: 14, fontWeight: 510, textDecoration: "none" }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div
          style={{
            marginTop: 32,
            paddingTop: 20,
            borderTop: `1px solid ${LN.rule2}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
            fontSize: 13,
            color: LN.ink3,
          }}
        >
          <span>© 2026 Resitly · All rights reserved</span>
          <span>Made in Malaysia · MYR</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div style={{ background: LN.bg, color: LN.ink, minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ position: "relative", padding: "112px 24px 0", overflow: "hidden" }}>
        {/* Grid backdrop */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(to right, ${LN.rule2} 1px, transparent 1px), linear-gradient(to bottom, ${LN.rule2} 1px, transparent 1px)`,
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at center top, black 0%, transparent 60%)",
            WebkitMaskImage: "radial-gradient(ellipse at center top, black 0%, transparent 60%)",
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
            top: -160,
            width: 820,
            height: 420,
            transform: "translateX(-50%)",
            background: `radial-gradient(closest-side, ${LN.accentSoft}, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <div className="mx-auto max-w-4xl" style={{ position: "relative", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <Pill>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: LN.ok }} />
              Built for Malaysian SMEs · 2026
            </Pill>
          </div>

          <h1
            style={{
              fontSize: "clamp(40px, 6.4vw, 68px)",
              fontWeight: 510,
              color: LN.ink,
              letterSpacing: "-2px",
              lineHeight: 1.02,
              margin: 0,
            }}
          >
            Turn receipts into clean
            <br className="hidden sm:block" />{" "}
            <span style={{ color: LN.accent }}>financial data in seconds.</span>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: LN.ink3,
              maxWidth: 620,
              margin: "22px auto 0",
              lineHeight: 1.6,
            }}
          >
            Snap a photo or upload a file. Resitly extracts, categorises, and organises your
            expenses automatically — with confidence scores you can trust.
          </p>

          <div
            style={{
              marginTop: 32,
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <PrimaryButton href="/sign-up">
              Scan your first receipt — free
              <ArrowRight className="size-4" />
            </PrimaryButton>
            <GhostButton href="#product">View demo</GhostButton>
          </div>

          <div
            style={{
              marginTop: 24,
              fontSize: 13,
              color: LN.ink3,
              display: "inline-flex",
              gap: 18,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <span>No credit card</span>
            <span>20 free receipts / month</span>
            <span>Export to CSV</span>
          </div>

          <HeroMock />
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
