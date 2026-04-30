"use client";

import { useMemo, useState } from "react";
import { useInvoices } from "@/hooks/use-api";
import { Bracket, H, Pill, RK } from "@/components/v2/kit";
import { formatMYR } from "@/lib/utils";

type Quarter = 1 | 2 | 3 | 4;

function quarterRange(year: number, q: Quarter): { from: string; to: string; label: string } {
  const startMonth = (q - 1) * 3;
  const endMonth = startMonth + 2;
  const from = new Date(year, startMonth, 1);
  const to = new Date(year, endMonth + 1, 0);
  const monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const label = `Q${q} ${year} · ${monthShort[startMonth]}–${monthShort[endMonth]}`;
  const ymd = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return { from: ymd(from), to: ymd(to), label };
}

function currentQuarter(): { year: number; q: Quarter } {
  const now = new Date();
  const q = (Math.floor(now.getMonth() / 3) + 1) as Quarter;
  return { year: now.getFullYear(), q };
}

export default function SstFrontPage() {
  const init = currentQuarter();
  const [year, setYear] = useState(init.year);
  const [q, setQ] = useState<Quarter>(init.q);

  const range = useMemo(() => quarterRange(year, q), [year, q]);

  const { data, isLoading } = useInvoices({
    page: 1,
    limit: 500,
    dateFrom: range.from,
    dateTo: range.to,
  });

  const invoices = data?.data ?? [];

  const stats = useMemo(() => {
    const reviewed = invoices.filter(
      (i) => i.status === "reviewed" || i.status === "exported",
    );
    const inReview = invoices.filter(
      (i) => i.status === "review" || i.status === "extracting" || i.status === "pending",
    );

    let taxTotal = 0;
    let bandSix = 0;
    let bandEight = 0;
    let bandZero = 0;
    const byCategory: Record<string, number> = {};

    for (const inv of reviewed) {
      const tax = parseFloat(inv.taxAmount ?? "0") || 0;
      const rate = parseFloat(inv.taxRate ?? "0") || 0;
      taxTotal += tax;
      if (rate === 6) bandSix += tax;
      else if (rate === 8) bandEight += tax;
      else if (rate === 0) bandZero += tax;

      const cat = inv.lineItems?.[0]?.category?.name ?? "Uncategorized";
      const total = parseFloat(inv.total ?? "0") || 0;
      byCategory[cat] = (byCategory[cat] ?? 0) + total;
    }

    const sortedCategories = Object.entries(byCategory)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);

    return {
      taxTotal,
      bandSix,
      bandEight,
      bandZero,
      receiptCount: invoices.length,
      verifiedCount: reviewed.length,
      reviewCount: inReview.length,
      categories: sortedCategories,
    };
  }, [invoices]);

  const cycleQuarter = (delta: -1 | 1) => {
    let nq = q + delta;
    let ny = year;
    if (nq < 1) {
      nq = 4;
      ny -= 1;
    } else if (nq > 4) {
      nq = 1;
      ny += 1;
    }
    setQ(nq as Quarter);
    setYear(ny);
  };

  return (
    <div style={{ background: RK.paper, color: RK.ink, minHeight: "calc(100dvh - 48px)" }}>
      <H
        kicker={`taxable period · ${range.label.toLowerCase()}`}
        title="SST filing readiness"
        right={
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <Bracket onClick={() => cycleQuarter(-1)}>‹ prev qtr</Bracket>
            <Bracket onClick={() => cycleQuarter(1)}>next qtr ›</Bracket>
            <Bracket disabled accent>
              generate SST-02
            </Bracket>
          </div>
        }
      />

      {isLoading ? (
        <div style={{ padding: 32, fontFamily: RK.mono, color: RK.ink3 }}>
          Loading…
        </div>
      ) : (
        <div
          style={{
            padding: "0 18px 24px",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: 14,
          }}
        >
          <div
            style={{
              border: `1px solid ${RK.rule}`,
              background: RK.surface,
              padding: 18,
            }}
          >
            <div
              style={{
                fontFamily: RK.mono,
                fontSize: 10,
                color: RK.ink3,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              output tax collected
            </div>
            <div
              style={{
                fontFamily: RK.mono,
                fontSize: 32,
                color: RK.ink,
                marginTop: 4,
              }}
            >
              {formatMYR(stats.taxTotal.toFixed(2))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              <Pill tone="accent">6% · {formatMYR(stats.bandSix.toFixed(2))}</Pill>
              <Pill tone="warn">8% · {formatMYR(stats.bandEight.toFixed(2))}</Pill>
              <Pill tone="ink">0% · {formatMYR(stats.bandZero.toFixed(2))}</Pill>
            </div>
            <div style={{ height: 1, background: RK.rule2, margin: "18px 0" }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Stat label="Receipts" value={stats.receiptCount.toLocaleString()} />
              <Stat label="Verified" value={stats.verifiedCount.toLocaleString()} />
              <Stat label="In review" value={stats.reviewCount.toLocaleString()} />
            </div>
            <div style={{ height: 1, background: RK.rule2, margin: "18px 0" }} />
            <div
              style={{
                fontFamily: RK.mono,
                fontSize: 10,
                color: RK.ink3,
                textTransform: "uppercase",
                marginBottom: 10,
                letterSpacing: 0.5,
              }}
            >
              category split
            </div>
            {stats.categories.length === 0 ? (
              <div style={{ fontFamily: RK.mono, fontSize: 11, color: RK.ink3 }}>
                No verified receipts in this period yet.
              </div>
            ) : (
              <CategorySplit categories={stats.categories} />
            )}
          </div>

          <div
            style={{
              border: `1px solid ${RK.rule}`,
              background: RK.surface,
              padding: 18,
            }}
          >
            <div
              style={{
                fontFamily: RK.mono,
                fontSize: 10,
                color: RK.ink3,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              filing checklist
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: "12px 0 0",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                fontFamily: RK.mono,
                fontSize: 11.5,
              }}
            >
              <ChecklistItem
                done={stats.reviewCount === 0}
                label={`All receipts reviewed (${stats.reviewCount} in review)`}
              />
              <ChecklistItem
                done={stats.verifiedCount > 0}
                label={`At least one verified receipt (${stats.verifiedCount})`}
              />
              <ChecklistItem
                done={false}
                label="SST-02 draft generated · coming soon"
              />
              <ChecklistItem
                done={false}
                label="Submitted to MySST · coming soon"
              />
            </ul>
            <div
              style={{
                marginTop: 18,
                padding: 12,
                background: RK.paper2,
                border: `1px dashed ${RK.rule}`,
                fontFamily: RK.mono,
                fontSize: 10.5,
                color: RK.ink2,
                lineHeight: 1.5,
              }}
            >
              Aggregations are computed from your verified receipts in this
              period. The SST-02 draft and MySST submission flow are on the
              roadmap.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: RK.mono,
          fontSize: 9.5,
          color: RK.ink3,
          textTransform: "uppercase",
          letterSpacing: 0.4,
        }}
      >
        {label}
      </div>
      <div style={{ fontFamily: RK.mono, fontSize: 18, color: RK.ink, marginTop: 2 }}>
        {value}
      </div>
    </div>
  );
}

function CategorySplit({ categories }: { categories: [string, number][] }) {
  const max = Math.max(...categories.map(([, v]) => v), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {categories.map(([name, value]) => {
        const pct = value / max;
        return (
          <div
            key={name}
            style={{
              display: "grid",
              gridTemplateColumns: "180px 1fr 100px",
              gap: 10,
              alignItems: "center",
              padding: "4px 0",
              fontFamily: RK.mono,
              fontSize: 11,
            }}
          >
            <span style={{ color: RK.ink2 }}>{name}</span>
            <div style={{ height: 8, background: RK.rule2, position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  width: `${pct * 100}%`,
                  background: RK.accent,
                }}
              />
            </div>
            <span style={{ color: RK.ink, textAlign: "right" }}>
              {formatMYR(value.toFixed(2))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: done ? RK.ink : RK.ink3,
      }}
    >
      <span
        style={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          border: `1px solid ${done ? RK.ok : RK.rule}`,
          background: done ? RK.okSoft : "transparent",
          color: done ? RK.ok : RK.ink3,
          display: "grid",
          placeItems: "center",
          fontSize: 9,
          fontWeight: 600,
        }}
      >
        {done ? "✓" : ""}
      </span>
      {label}
    </li>
  );
}
