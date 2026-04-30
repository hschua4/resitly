"use client";

import { useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import { useCategories } from "@/hooks/use-api";
import { buildQueryString } from "@/lib/utils";
import { Bracket, H, Pill, RK } from "@/components/v2/kit";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CONNECTORS: {
  id: string;
  label: string;
  description: string;
  status: "active" | "soon";
}[] = [
  {
    id: "csv",
    label: "CSV",
    description: "Universal — works with Excel, Google Sheets, accountants.",
    status: "active",
  },
  {
    id: "sqlaccount",
    label: "SQL Account",
    description: "Direct push to SQL Accounting (XML/COM).",
    status: "soon",
  },
  {
    id: "autocount",
    label: "AutoCount",
    description: "AutoCount Cloud sync.",
    status: "soon",
  },
  {
    id: "xero",
    label: "Xero",
    description: "OAuth2 connection to Xero Malaysia.",
    status: "soon",
  },
  {
    id: "quickbooks",
    label: "QuickBooks",
    description: "Intuit QuickBooks Online.",
    status: "soon",
  },
  {
    id: "myinvois",
    label: "MyInvois (LHDN)",
    description: "E-invoicing submission to LHDN MyInvois.",
    status: "soon",
  },
];

export default function ExportPage() {
  const [activeConnector, setActiveConnector] = useState<string>("csv");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [status, setStatus] = useState("all");
  const [categoryId, setCategoryId] = useState("all");

  const { data: categories = [] } = useCategories();

  const downloadCsv = () => {
    const params: Record<string, string> = {};
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    if (status !== "all") params.status = status;
    if (categoryId !== "all") params.categoryId = categoryId;
    window.location.href = `/v1/export${buildQueryString(params)}`;
  };

  return (
    <div style={{ background: RK.paper, color: RK.ink, minHeight: "calc(100dvh - 48px)" }}>
      <H
        kicker="export"
        title="Send your receipts to accounting"
        right={
          <span style={{ fontFamily: RK.mono, fontSize: 10, color: RK.ink3 }}>
            {CONNECTORS.filter((c) => c.status === "active").length} of{" "}
            {CONNECTORS.length} connectors active
          </span>
        }
      />

      <div
        style={{
          padding: "0 18px 24px",
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: 14,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {CONNECTORS.map((c) => {
            const active = activeConnector === c.id;
            const disabled = c.status !== "active";
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => !disabled && setActiveConnector(c.id)}
                disabled={disabled}
                title={disabled ? "Coming soon" : undefined}
                style={{
                  textAlign: "left",
                  padding: 12,
                  background: active ? RK.accentSoft : RK.surface,
                  border: `1px solid ${active ? RK.accent : RK.rule}`,
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.55 : 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  fontFamily: RK.sans,
                  color: RK.ink,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontWeight: 500, fontSize: 13 }}>{c.label}</span>
                  {c.status === "active" ? (
                    <Pill tone="ok">active</Pill>
                  ) : (
                    <Pill tone="ink">soon</Pill>
                  )}
                </div>
                <div style={{ fontSize: 11, color: RK.ink2, lineHeight: 1.4 }}>
                  {c.description}
                </div>
              </button>
            );
          })}
        </div>

        <div
          style={{
            border: `1px solid ${RK.rule}`,
            background: RK.surface,
            padding: 18,
          }}
        >
          {activeConnector === "csv" ? (
            <CsvForm
              dateFrom={dateFrom}
              setDateFrom={setDateFrom}
              dateTo={dateTo}
              setDateTo={setDateTo}
              status={status}
              setStatus={setStatus}
              categoryId={categoryId}
              setCategoryId={setCategoryId}
              onDownload={downloadCsv}
              categories={categories}
            />
          ) : (
            <ConnectorComingSoon
              label={
                CONNECTORS.find((c) => c.id === activeConnector)?.label ?? ""
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

function CsvForm({
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  status,
  setStatus,
  categoryId,
  setCategoryId,
  onDownload,
  categories,
}: {
  dateFrom: string;
  setDateFrom: (v: string) => void;
  dateTo: string;
  setDateTo: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  categoryId: string;
  setCategoryId: (v: string) => void;
  onDownload: () => void;
  categories: { id: string; name: string }[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: RK.mono,
          fontSize: 11,
          color: RK.ink3,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        <FileSpreadsheet size={14} />
        CSV export
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="From">
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </Field>
        <Field label="To">
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </Field>
      </div>
      <Field label="Invoice status">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="review">Needs review</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="exported">Previously exported</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="Category">
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Bracket accent block onClick={onDownload}>
        <Download size={11} style={{ display: "inline" }} /> download CSV
      </Bracket>

      <div
        style={{
          marginTop: 6,
          padding: 12,
          background: RK.paper2,
          border: `1px dashed ${RK.rule}`,
          fontFamily: RK.mono,
          fontSize: 10.5,
          color: RK.ink2,
          lineHeight: 1.5,
        }}
      >
        One row per line item. Includes vendor, date, invoice number, category,
        quantity, unit price, amount, tax fields, and total. Compatible with SQL
        Accounting, AutoCount, QuickBooks, and Excel.
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label
        style={{
          fontFamily: RK.mono,
          fontSize: 9.5,
          color: RK.ink3,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function ConnectorComingSoon({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        minHeight: 280,
        textAlign: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          fontFamily: RK.mono,
          fontSize: 10,
          color: RK.ink3,
          textTransform: "uppercase",
          letterSpacing: 0.6,
        }}
      >
        {label} integration
      </div>
      <div
        style={{
          fontFamily: RK.sans,
          fontSize: 18,
          fontWeight: 500,
          color: RK.ink,
        }}
      >
        Coming soon
      </div>
      <div
        style={{
          fontFamily: RK.sans,
          fontSize: 13,
          color: RK.ink2,
          maxWidth: 360,
          lineHeight: 1.5,
        }}
      >
        Direct push to {label} is on the roadmap. For now, use the CSV export —
        every accounting tool can import it.
      </div>
      <Bracket disabled accent>
        Connect {label}
      </Bracket>
    </div>
  );
}
