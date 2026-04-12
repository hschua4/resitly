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
  Upload,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold text-primary">
          Resitly
        </Link>

        {/* Nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="#product"
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Product
          </Link>
          <Link
            href="#pricing"
            className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
        </nav>

        {/* Auth CTAs */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/sign-up">Start Free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

// ─── Hero mock UI ─────────────────────────────────────────────────────────────

function HeroMockUI() {
  return (
    <div className="relative mx-auto mt-12 w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
      {/* Window chrome */}
      <div className="flex h-9 items-center gap-1.5 border-b border-border px-4">
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="ml-3 text-xs text-muted-foreground">
          resitly.app / upload
        </span>
      </div>

      {/* Two-column panel */}
      <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-2 md:divide-x md:divide-y-0">
        {/* Left — upload dropzone */}
        <div className="flex flex-col items-center justify-center gap-3 px-8 py-12">
          <div className="flex size-14 items-center justify-center rounded-xl border-2 border-dashed border-border">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              Drop receipt here
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              or{" "}
              <span className="cursor-pointer text-primary underline-offset-2 hover:underline">
                browse files
              </span>
            </p>
          </div>
          <p className="text-[11px] text-muted-foreground/60">
            JPG, PNG, PDF — up to 10 MB
          </p>
        </div>

        {/* Right — parsed receipt */}
        <div className="flex flex-col gap-4 px-8 py-8">
          {/* Header row */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                Extracted Receipt
              </p>
              <p className="mt-1 text-base font-semibold text-foreground">
                99 Speedmart
              </p>
            </div>
            <Badge variant="default" className="text-[10px]">
              Food &amp; Beverage
            </Badge>
          </div>

          {/* Data rows */}
          <div className="space-y-2 rounded-lg border border-border bg-background/50 p-3 text-sm">
            {[
              ["Merchant", "99 Speedmart"],
              ["Date", "12 Apr 2026"],
              ["Total", "RM 47.80"],
              ["SST (6%)", "RM 2.86"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-xs font-medium text-foreground">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Category badges */}
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-[10px]">
              Groceries
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              Retail
            </Badge>
          </div>

          {/* Status pill */}
          <div className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-green-500" />
            <span className="text-[11px] text-muted-foreground">
              Extraction complete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Section heading helper ───────────────────────────────────────────────────

function SectionHeading({
  eyebrow,
  heading,
  subheading,
  center = false,
}: {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("mb-12", center && "text-center")}>
      {eyebrow && (
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {heading}
      </h2>
      {subheading && (
        <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
          {subheading}
        </p>
      )}
    </div>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

const HOW_IT_WORKS_STEPS = [
  {
    number: "01",
    title: "Upload",
    description:
      "Snap a photo or drag in your receipt or invoice. Supports JPG, PNG, and PDF.",
  },
  {
    number: "02",
    title: "Extract",
    description:
      "AI reads and structures all key details — merchant, date, line items, totals, and SST.",
  },
  {
    number: "03",
    title: "Organize",
    description:
      "Expenses are automatically categorized and ready to export, search, or share.",
  },
] as const;

function HowItWorks() {
  return (
    <section id="product" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="How It Works"
          heading="Three steps to zero manual entry"
          center
        />

        <div className="grid gap-8 md:grid-cols-3">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div
              key={step.number}
              className="relative rounded-xl border border-border bg-card p-8"
            >
              <span className="absolute right-6 top-6 select-none text-6xl font-bold leading-none text-primary/10">
                {step.number}
              </span>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Core Features ────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: FileText,
    title: "Smart Receipt Extraction",
    description:
      "Line items, totals, SST, merchant detection. Works with messy, crumpled, or low-quality images.",
  },
  {
    icon: Tag,
    title: "Auto Categorization",
    description:
      "Food, transport, office, utilities, and more. Learns from your edits over time.",
  },
  {
    icon: BarChart2,
    title: "Clean Dashboard",
    description:
      "Monthly spending overview, category breakdown, search and filter receipts instantly.",
  },
  {
    icon: Download,
    title: "Export Anywhere",
    description:
      "CSV &amp; Excel export. Ready for accountants or bookkeeping tools.",
  },
] as const;

function CoreFeatures() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Features"
          heading="Everything you need to manage expenses"
          subheading="No bloat, no steep learning curve — just the tools Malaysian SMEs actually use."
        />

        <div className="grid gap-6 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="size-5 text-primary" />
              </div>
              <h3 className="mb-1.5 font-semibold text-foreground">{title}</h3>
              <p
                className="text-sm leading-relaxed text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Built for Malaysia ───────────────────────────────────────────────────────

const MALAYSIA_POINTS = [
  "Handles BM, English, and Chinese receipts",
  "Understands local merchants (99 Speedmart, mamak stalls, etc.)",
  "Supports SST formats used by Malaysian businesses",
  "Works with Shopee and Lazada order invoices",
] as const;

function BuiltForMalaysia() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-8 py-14 sm:px-14">
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            {/* Left */}
            <div>
              <div className="mb-4 text-5xl">🇲🇾</div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Built for Malaysia.
                <br />
                <span className="text-muted-foreground">
                  Most tools fail here. Resitly doesn&apos;t.
                </span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Generic expense trackers can&apos;t read your mamak receipt.
                Resitly is trained on real Malaysian receipts and understands the
                local tax system.
              </p>
            </div>

            {/* Right — checklist */}
            <ul className="flex flex-col justify-center gap-4">
              {MALAYSIA_POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <Check className="size-3 text-primary" />
                  </span>
                  <span className="text-sm text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Who It's For ─────────────────────────────────────────────────────────────

const WHO_ITS_FOR = [
  {
    icon: User,
    title: "Freelancers",
    description:
      "Stop manually logging expenses. Snap, upload, done — your records are always up to date.",
  },
  {
    icon: Building2,
    title: "Small Business Owners",
    description:
      "Track spending without hiring a bookkeeper. Resitly handles the grunt work.",
  },
  {
    icon: ShoppingBag,
    title: "E-commerce Sellers",
    description:
      "Organize supplier invoices and Shopee/Lazada receipts effortlessly. Export when you need to.",
  },
] as const;

function WhoItsFor() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="For You" heading="Who uses Resitly" center />

        <div className="grid gap-6 md:grid-cols-3">
          {WHO_ITS_FOR.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-8 text-center"
            >
              <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="size-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

const PRICING_PLANS = [
  {
    name: "Free",
    price: "RM 0",
    period: "/month",
    description: "Get started with no commitment.",
    features: [
      "20 receipts per month",
      "Basic AI extraction",
      "Manual categorization",
      "7-day history",
    ],
    cta: "Get Started Free",
    ctaVariant: "outline" as const,
    highlight: false,
  },
  {
    name: "Pro",
    price: "RM 19",
    period: "/month",
    description: "For individuals and small teams.",
    features: [
      "200 receipts per month",
      "Smart auto-categorization",
      "CSV &amp; Excel export",
      "Full receipt history",
      "Priority email support",
    ],
    cta: "Start Pro Trial",
    ctaVariant: "default" as const,
    highlight: true,
    badge: "Most Popular",
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
    cta: "Contact Sales",
    ctaVariant: "outline" as const,
    highlight: false,
  },
] as const;

function Pricing() {
  return (
    <section id="pricing" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <SectionHeading
            eyebrow="Pricing"
            heading="Simple, transparent pricing"
            subheading="Start free, upgrade when you need more."
            center
          />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-xl border bg-card p-8",
                plan.highlight
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border"
              )}
            >
              {plan.highlight && plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="default" className="px-3 text-xs shadow-sm">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm font-medium text-muted-foreground">
                  {plan.name}
                </p>
                <div className="mt-2 flex items-end gap-1">
                  <span className="text-4xl font-bold tracking-tight text-foreground">
                    {plan.price}
                  </span>
                  <span className="mb-1 text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-foreground"
                  >
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span dangerouslySetInnerHTML={{ __html: feature }} />
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.ctaVariant}
                className="w-full"
                size="lg"
                asChild
              >
                <Link href="/sign-up">{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 px-8 py-20 text-center">
          {/* Decorative glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl"
          />

          <h2 className="relative text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Stop typing receipts into spreadsheets.
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-base text-muted-foreground">
            Join hundreds of Malaysian SMEs already saving hours every week.
          </p>

          <div className="relative mt-8">
            <Button size="lg" className="gap-2 px-8 text-base" asChild>
              <Link href="/sign-up">
                Start Scanning for Free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Top row */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/" className="text-base font-bold text-primary">
              Resitly
            </Link>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              AI receipt and invoice processing for Malaysian SMEs.
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { label: "Product", href: "#product" },
              { label: "Pricing", href: "#pricing" },
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Sign In", href: "/sign-in" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom row */}
        <div className="mt-8 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 Resitly. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pb-0 pt-24 sm:pt-32">
        {/* Background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-96 w-150 -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Badge variant="outline" className="mb-6 px-3 py-1">
            Built for Malaysian SMEs
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Turn receipts into clean
            <br className="hidden sm:block" />
            financial data in seconds
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Snap a photo or upload a file. Resitly extracts, categorizes, and
            organizes your expenses automatically.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="gap-2 px-6 text-base" asChild>
              <Link href="/sign-up">
                Scan Your First Receipt — It&apos;s Free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="px-6 text-base" asChild>
              <Link href="#product">View Demo</Link>
            </Button>
          </div>

          <HeroMockUI />
        </div>
      </section>

      {/* Sections */}
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
