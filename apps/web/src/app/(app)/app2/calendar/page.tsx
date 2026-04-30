"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useInvoices } from "@/hooks/use-api";
import { Bracket, H, Pill, RK, type Tone } from "@/components/v2/kit";
import { formatMYR } from "@/lib/utils";
import type { Invoice, InvoiceStatus } from "@resitly/types";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const statusToTone: Record<InvoiceStatus, Tone> = {
  pending:    "ink",
  extracting: "accent",
  review:     "warn",
  reviewed:   "ok",
  exported:   "ok",
};

function ymd(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function startOfMonth(year: number, month: number) {
  return new Date(year, month, 1);
}

function endOfMonth(year: number, month: number) {
  return new Date(year, month + 1, 0);
}

function buildGrid(year: number, month: number) {
  const first = startOfMonth(year, month);
  const last = endOfMonth(year, month);
  const startDow = (first.getDay() + 6) % 7;
  const days: (Date | null)[] = [];
  for (let i = 0; i < startDow; i++) days.push(null);
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  while (days.length % 7 !== 0) days.push(null);
  return days;
}

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(todayMonth(today));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  function todayMonth(d: Date) {
    return d.getMonth();
  }

  const dateFrom = ymd(startOfMonth(year, month));
  const dateTo = ymd(endOfMonth(year, month));

  const { data, isLoading } = useInvoices({
    page: 1,
    limit: 200,
    dateFrom,
    dateTo,
  });

  const invoicesByDay = useMemo(() => {
    const map: Record<string, Invoice[]> = {};
    for (const inv of data?.data ?? []) {
      if (!inv.invoiceDate) continue;
      const key = inv.invoiceDate.slice(0, 10);
      (map[key] ||= []).push(inv);
    }
    return map;
  }, [data]);

  const grid = useMemo(() => buildGrid(year, month), [year, month]);

  const goPrev = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
    setSelectedDay(null);
  };
  const goNext = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
    setSelectedDay(null);
  };
  const goToday = () => {
    const t = new Date();
    setYear(t.getFullYear());
    setMonth(t.getMonth());
    setSelectedDay(null);
  };

  const todayKey = ymd(today);
  const selectedInvoices = selectedDay ? invoicesByDay[selectedDay] ?? [] : [];

  return (
    <div style={{ background: RK.paper, color: RK.ink, minHeight: "calc(100dvh - 48px)" }}>
      <H
        kicker="calendar"
        title={`${MONTH_NAMES[month]} ${year}`}
        right={
          <div style={{ display: "flex", gap: 6 }}>
            <Bracket onClick={goPrev}>
              <ChevronLeft size={11} style={{ display: "inline" }} /> prev
            </Bracket>
            <Bracket onClick={goToday}>today</Bracket>
            <Bracket onClick={goNext}>
              next <ChevronRight size={11} style={{ display: "inline" }} />
            </Bracket>
          </div>
        }
      />
      {isLoading ? (
        <div style={{ padding: 32, fontFamily: RK.mono, color: RK.ink3 }}>Loading…</div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 14,
            padding: "0 18px 24px",
          }}
        >
          <div
            style={{
              border: `1px solid ${RK.rule}`,
              background: RK.surface,
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gridAutoRows: "minmax(96px, 1fr)",
            }}
          >
            {DOW.map((d) => (
              <div
                key={d}
                style={{
                  padding: "8px 10px",
                  borderRight: `1px solid ${RK.rule2}`,
                  borderBottom: `1px solid ${RK.rule}`,
                  fontFamily: RK.mono,
                  fontSize: 9.5,
                  color: RK.ink3,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  background: RK.paper2,
                }}
              >
                {d}
              </div>
            ))}
            {grid.map((day, i) => {
              if (!day) {
                return (
                  <div
                    key={`pad-${i}`}
                    style={{
                      borderRight: `1px solid ${RK.rule2}`,
                      borderBottom: `1px solid ${RK.rule2}`,
                      background: RK.paper2,
                    }}
                  />
                );
              }
              const key = ymd(day);
              const dayInvoices = invoicesByDay[key] ?? [];
              const isToday = key === todayKey;
              const isSelected = key === selectedDay;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedDay(key)}
                  style={{
                    textAlign: "left",
                    padding: 6,
                    borderRight: `1px solid ${RK.rule2}`,
                    borderBottom: `1px solid ${RK.rule2}`,
                    background: isSelected ? RK.accentSoft : "transparent",
                    cursor: "pointer",
                    fontFamily: RK.mono,
                    color: RK.ink,
                    overflow: "hidden",
                    minHeight: 96,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: isToday ? 600 : 400,
                        color: isToday ? RK.accent : RK.ink,
                        background: isToday ? RK.accentSoft : "transparent",
                        padding: isToday ? "1px 5px" : "1px 0",
                        borderRadius: 3,
                      }}
                    >
                      {day.getDate()}
                    </span>
                    {dayInvoices.length > 0 && (
                      <span style={{ fontSize: 9, color: RK.ink3 }}>
                        {dayInvoices.length}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {dayInvoices.slice(0, 3).map((inv) => (
                      <div
                        key={inv.id}
                        style={{
                          fontSize: 9.5,
                          color: RK.ink2,
                          background: RK.paper2,
                          padding: "1px 4px",
                          borderLeft: `2px solid ${
                            statusToTone[inv.status] === "ok"
                              ? RK.ok
                              : statusToTone[inv.status] === "warn"
                                ? RK.warn
                                : statusToTone[inv.status] === "accent"
                                  ? RK.accent
                                  : RK.rule
                          }`,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {inv.vendor ?? "—"}
                      </div>
                    ))}
                    {dayInvoices.length > 3 && (
                      <div style={{ fontSize: 9, color: RK.ink3, paddingLeft: 4 }}>
                        +{dayInvoices.length - 3} more
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <DayPanel
            day={selectedDay}
            invoices={selectedInvoices}
            onClose={() => setSelectedDay(null)}
          />
        </div>
      )}
    </div>
  );
}

function DayPanel({
  day,
  invoices,
  onClose,
}: {
  day: string | null;
  invoices: Invoice[];
  onClose: () => void;
}) {
  if (!day) {
    return (
      <div
        style={{
          border: `1px dashed ${RK.rule}`,
          background: RK.paper2,
          padding: 24,
          fontFamily: RK.mono,
          fontSize: 11,
          color: RK.ink3,
          textAlign: "center",
        }}
      >
        Click a day to see receipts
      </div>
    );
  }
  const dateLabel = new Date(day).toLocaleDateString("en-MY", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return (
    <div
      style={{
        border: `1px solid ${RK.rule}`,
        background: RK.surface,
        display: "flex",
        flexDirection: "column",
        alignSelf: "start",
        position: "sticky",
        top: 60,
      }}
    >
      <div
        style={{
          padding: "10px 12px",
          borderBottom: `1px solid ${RK.rule}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            fontFamily: RK.mono,
            fontSize: 10,
            color: RK.ink3,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            flex: 1,
          }}
        >
          {dateLabel} · {invoices.length} receipt{invoices.length === 1 ? "" : "s"}
        </div>
        <button
          onClick={onClose}
          aria-label="close"
          style={{
            background: "transparent",
            border: `1px solid ${RK.rule}`,
            padding: 4,
            cursor: "pointer",
            color: RK.ink3,
          }}
        >
          <X size={12} />
        </button>
      </div>
      <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
        {invoices.length === 0 ? (
          <div
            style={{
              padding: 16,
              fontFamily: RK.mono,
              fontSize: 11,
              color: RK.ink3,
              textAlign: "center",
            }}
          >
            No receipts on this day
          </div>
        ) : (
          invoices.map((inv) => (
            <Link
              key={inv.id}
              href={`/app2/invoices/${inv.id}`}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: "8px 10px",
                background: RK.paper,
                border: `1px solid ${RK.rule2}`,
                fontFamily: RK.mono,
                fontSize: 11,
                color: RK.ink,
                textDecoration: "none",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {inv.vendor ?? inv.originalName}
                </span>
                <span style={{ color: RK.ink2 }}>{formatMYR(inv.total)}</span>
              </div>
              <div>
                <Pill tone={statusToTone[inv.status]}>{inv.status}</Pill>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
