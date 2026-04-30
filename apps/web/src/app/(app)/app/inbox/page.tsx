"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useDeleteInvoice } from "@/hooks/use-mutations";
import { apiClient } from "@/lib/api-client";
import { Bracket, H, Pill, RK, type Tone } from "@/components/v2/kit";
import {
  useInboxFeed,
  type InboxFilter,
} from "@/components/v2/use-inbox-feed";
import { formatMYR } from "@/lib/utils";
import type { Invoice, InvoiceStatus } from "@resitly/types";

const FILTERS: { value: InboxFilter; label: string }[] = [
  { value: "all",          label: "all" },
  { value: "extracting",   label: "extracting" },
  { value: "needs-review", label: "needs review" },
  { value: "approved",     label: "approved" },
  { value: "exported",     label: "exported" },
];

const statusToPill: Record<InvoiceStatus, { tone: Tone; label: string }> = {
  pending:    { tone: "ink",    label: "Pending" },
  extracting: { tone: "accent", label: "Extracting" },
  review:     { tone: "warn",   label: "Needs review" },
  reviewed:   { tone: "ok",     label: "Approved" },
  exported:   { tone: "ok",     label: "Exported" },
};

export default function InboxPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useInboxFeed({
    search,
    filter,
    page,
    pageSize,
  });

  const rows = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const selectedIds = useMemo(
    () => Object.keys(selected).filter((id) => selected[id]),
    [selected],
  );
  const allChecked = rows.length > 0 && rows.every((r) => selected[r.id]);

  const toggleAll = () => {
    if (allChecked) {
      const next = { ...selected };
      for (const r of rows) delete next[r.id];
      setSelected(next);
    } else {
      const next = { ...selected };
      for (const r of rows) next[r.id] = true;
      setSelected(next);
    }
  };

  return (
    <div style={{ background: RK.paper, color: RK.ink, minHeight: "calc(100dvh - 48px)" }}>
      <H
        kicker={`inbox · ${total} receipt${total === 1 ? "" : "s"}`}
        title="Receipts to process"
        right={
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <Search
                style={{
                  position: "absolute",
                  left: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 12,
                  height: 12,
                  color: RK.ink3,
                }}
              />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="search vendor"
                style={{
                  fontFamily: RK.mono,
                  fontSize: 11,
                  padding: "4px 8px 4px 24px",
                  border: `1px solid ${RK.rule}`,
                  background: RK.surface,
                  color: RK.ink,
                  borderRadius: 3,
                  outline: "none",
                  width: 180,
                }}
              />
            </div>
            <Bracket onClick={() => router.push("/app/capture")} accent>
              ＋ upload
            </Bracket>
          </div>
        }
      />

      <FilterBar filter={filter} onChange={(f) => { setFilter(f); setPage(1); }} />

      {selectedIds.length > 0 && (
        <BulkBar
          ids={selectedIds}
          rows={rows}
          onClear={() => setSelected({})}
        />
      )}

      <div style={{ padding: "0 18px" }}>
        <div
          style={{
            border: `1px solid ${RK.rule}`,
            background: RK.surface,
            opacity: isFetching && !isLoading ? 0.6 : 1,
            transition: "opacity 150ms",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "32px 1.6fr 0.8fr 0.6fr 1fr 0.9fr",
              padding: "8px 14px",
              borderBottom: `1px solid ${RK.rule}`,
              fontFamily: RK.mono,
              fontSize: 9.5,
              color: RK.ink3,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            <span>
              <input
                type="checkbox"
                checked={allChecked}
                onChange={toggleAll}
                aria-label="select all"
              />
            </span>
            <span>Vendor</span>
            <span>Total</span>
            <span>SST</span>
            <span>Category</span>
            <span>Status</span>
          </div>

          {isLoading && (
            <div
              style={{
                padding: "32px 18px",
                fontFamily: RK.mono,
                fontSize: 11,
                color: RK.ink3,
              }}
            >
              Loading…
            </div>
          )}

          {!isLoading && rows.length === 0 && (
            <div
              style={{
                padding: "48px 18px",
                fontFamily: RK.mono,
                fontSize: 11,
                color: RK.ink3,
                textAlign: "center",
              }}
            >
              No receipts here yet.{" "}
              <Link href="/app/capture" style={{ color: RK.accent }}>
                Upload your first one →
              </Link>
            </div>
          )}

          {!isLoading &&
            rows.map((r, i) => (
              <InboxRow
                key={r.id}
                invoice={r}
                checked={!!selected[r.id]}
                onToggle={() =>
                  setSelected((s) => ({ ...s, [r.id]: !s[r.id] }))
                }
                isLast={i === rows.length - 1}
                onOpen={() => router.push(`/app/invoices/${r.id}`)}
              />
            ))}
        </div>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
      />
    </div>
  );
}

function FilterBar({
  filter,
  onChange,
}: {
  filter: InboxFilter;
  onChange: (f: InboxFilter) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        padding: "0 18px 12px",
        flexWrap: "wrap",
      }}
    >
      {FILTERS.map((f) => (
        <button
          key={f.value}
          type="button"
          onClick={() => onChange(f.value)}
          style={{
            fontFamily: RK.mono,
            fontSize: 10.5,
            padding: "4px 10px",
            border: `1px solid ${filter === f.value ? RK.accent : RK.rule}`,
            background: filter === f.value ? RK.accentSoft : "transparent",
            color: filter === f.value ? RK.accent : RK.ink2,
            borderRadius: 3,
            cursor: "pointer",
            letterSpacing: 0.3,
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

function InboxRow({
  invoice,
  checked,
  onToggle,
  onOpen,
  isLast,
}: {
  invoice: Invoice;
  checked: boolean;
  onToggle: () => void;
  onOpen: () => void;
  isLast: boolean;
}) {
  const status = statusToPill[invoice.status];
  const sst = invoice.taxRate
    ? `${parseFloat(invoice.taxRate).toFixed(0)}%`
    : "—";
  const sstTone: Tone = sst === "—" || sst === "0%" ? "ink" : "accent";
  const category = invoice.lineItems?.[0]?.category?.name ?? "—";
  const vendor = invoice.vendor ?? invoice.originalName ?? "Unknown";

  return (
    <div
      onClick={onOpen}
      style={{
        display: "grid",
        gridTemplateColumns: "32px 1.6fr 0.8fr 0.6fr 1fr 0.9fr",
        padding: "10px 14px",
        borderBottom: isLast ? "none" : `1px solid ${RK.rule2}`,
        alignItems: "center",
        fontFamily: RK.mono,
        fontSize: 11.5,
        cursor: "pointer",
        background: checked ? RK.hi : "transparent",
        transition: "background 80ms",
      }}
      onMouseEnter={(e) => {
        if (!checked) (e.currentTarget as HTMLDivElement).style.background = RK.paper2;
      }}
      onMouseLeave={(e) => {
        if (!checked) (e.currentTarget as HTMLDivElement).style.background = "transparent";
      }}
    >
      <span onClick={(e) => e.stopPropagation()}>
        <input type="checkbox" checked={checked} onChange={onToggle} />
      </span>
      <span style={{ color: RK.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {vendor}
      </span>
      <span style={{ color: RK.ink2 }}>{formatMYR(invoice.total)}</span>
      <span>
        <Pill tone={sstTone}>{sst}</Pill>
      </span>
      <span style={{ color: RK.ink2 }}>{category}</span>
      <span>
        <Pill tone={status.tone}>{status.label}</Pill>
      </span>
    </div>
  );
}

function BulkBar({
  ids,
  rows,
  onClear,
}: {
  ids: string[];
  rows: Invoice[];
  onClear: () => void;
}) {
  const selectedRows = rows.filter((r) => ids.includes(r.id));
  const reviewable = selectedRows.filter((r) => r.status === "review");
  const deletable = selectedRows;

  return (
    <div
      style={{
        position: "sticky",
        top: 48,
        zIndex: 5,
        margin: "0 18px 12px",
        padding: "8px 12px",
        background: RK.accentSoft,
        border: `1px solid ${RK.accent}`,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: RK.mono,
        fontSize: 11,
        color: RK.ink,
      }}
    >
      <span style={{ color: RK.accent }}>
        {ids.length} selected
      </span>
      <span style={{ flex: 1 }} />
      {reviewable.length > 0 && (
        <BulkApproveButton ids={reviewable.map((r) => r.id)} onDone={onClear} />
      )}
      <BulkDeleteButton ids={deletable.map((r) => r.id)} onDone={onClear} />
      <Bracket onClick={onClear}>clear</Bracket>
    </div>
  );
}

function BulkApproveButton({ ids, onDone }: { ids: string[]; onDone: () => void }) {
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  return (
    <Bracket
      disabled={busy}
      accent
      onClick={async () => {
        setBusy(true);
        try {
          await Promise.all(
            ids.map((id) =>
              apiClient(`/v1/invoices/${id}/confirm`, { method: "PATCH" }),
            ),
          );
          await qc.invalidateQueries({ queryKey: ["invoices"] });
          await qc.invalidateQueries({ queryKey: ["dashboard"] });
          toast.success(`Approved ${ids.length} receipt${ids.length === 1 ? "" : "s"}`);
          onDone();
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Bulk approve failed");
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? "approving…" : `approve ${ids.length}`}
    </Bracket>
  );
}

function BulkDeleteButton({ ids, onDone }: { ids: string[]; onDone: () => void }) {
  const del = useDeleteInvoice();
  const [busy, setBusy] = useState(false);
  return (
    <Bracket
      disabled={busy}
      onClick={async () => {
        if (!window.confirm(`Delete ${ids.length} receipt(s)?`)) return;
        setBusy(true);
        try {
          for (const id of ids) {
            await del.mutateAsync(id);
          }
          onDone();
        } finally {
          setBusy(false);
        }
      }}
    >
      {busy ? "deleting…" : `delete ${ids.length}`}
    </Bracket>
  );
}

function Pagination({
  page,
  totalPages,
  total,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div
      style={{
        padding: "12px 18px 24px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: RK.mono,
        fontSize: 11,
        color: RK.ink3,
      }}
    >
      <span>{total} total</span>
      <span style={{ flex: 1 }} />
      <Bracket disabled={page <= 1} onClick={onPrev}>
        <ChevronLeft style={{ width: 12, height: 12, display: "inline" }} /> prev
      </Bracket>
      <span style={{ color: RK.ink2 }}>
        {page} / {totalPages}
      </span>
      <Bracket disabled={page >= totalPages} onClick={onNext}>
        next <ChevronRight style={{ width: 12, height: 12, display: "inline" }} />
      </Bracket>
    </div>
  );
}

