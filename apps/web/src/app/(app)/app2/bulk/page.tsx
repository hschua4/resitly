"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCategories, useInvoices } from "@/hooks/use-api";
import { apiClient } from "@/lib/api-client";
import { Bracket, H, Pill, RK, type Tone } from "@/components/v2/kit";
import { formatMYR } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Invoice, InvoiceStatus } from "@resitly/types";

type Bucket = "all" | "high" | "low" | "extracting";

const BUCKETS: { value: Bucket; label: string }[] = [
  { value: "all",        label: "all in-flight" },
  { value: "high",       label: "high confidence (≥85%)" },
  { value: "low",        label: "low confidence (<60%)" },
  { value: "extracting", label: "still extracting" },
];

const statusToPill: Record<InvoiceStatus, { tone: Tone; label: string }> = {
  pending:    { tone: "ink",    label: "pending" },
  extracting: { tone: "accent", label: "extracting" },
  review:     { tone: "warn",   label: "review" },
  reviewed:   { tone: "ok",     label: "approved" },
  exported:   { tone: "ok",     label: "exported" },
};

export default function BulkTriagePage() {
  const router = useRouter();
  const qc = useQueryClient();
  const [bucket, setBucket] = useState<Bucket>("all");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [batchCategory, setBatchCategory] = useState<string>("");

  const { data: extractingData, isLoading: l1 } = useInvoices({
    status: "extracting",
    page: 1,
    limit: 200,
  });
  const { data: reviewData, isLoading: l2 } = useInvoices({
    status: "review",
    page: 1,
    limit: 200,
  });
  const { data: categories = [] } = useCategories();

  const isLoading = l1 || l2;

  const allInFlight = useMemo<Invoice[]>(
    () => [...(extractingData?.data ?? []), ...(reviewData?.data ?? [])],
    [extractingData, reviewData],
  );

  const filtered = useMemo(() => {
    return allInFlight.filter((inv) => {
      const conf = inv.aiConfidence ? parseFloat(inv.aiConfidence) : null;
      if (bucket === "extracting") return inv.status === "extracting";
      if (bucket === "high") return conf !== null && conf >= 0.85;
      if (bucket === "low") return conf !== null && conf < 0.6;
      return true;
    });
  }, [allInFlight, bucket]);

  const selectedIds = useMemo(
    () => Object.keys(selected).filter((id) => selected[id]),
    [selected],
  );
  const allChecked = filtered.length > 0 && filtered.every((r) => selected[r.id]);

  const toggleAll = () => {
    if (allChecked) {
      const next = { ...selected };
      for (const r of filtered) delete next[r.id];
      setSelected(next);
    } else {
      const next = { ...selected };
      for (const r of filtered) next[r.id] = true;
      setSelected(next);
    }
  };

  const invalidate = async () => {
    await qc.invalidateQueries({ queryKey: ["invoices"] });
    await qc.invalidateQueries({ queryKey: ["dashboard"] });
  };

  const bulkApprove = async () => {
    const reviewable = filtered
      .filter((r) => selected[r.id] && r.status === "review")
      .map((r) => r.id);
    if (reviewable.length === 0) {
      toast.error("No reviewable receipts in selection");
      return;
    }
    setBusy(true);
    try {
      await Promise.all(
        reviewable.map((id) =>
          apiClient(`/v1/invoices/${id}/confirm`, { method: "PATCH" }),
        ),
      );
      await invalidate();
      toast.success(`Approved ${reviewable.length}`);
      setSelected({});
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bulk approve failed");
    } finally {
      setBusy(false);
    }
  };

  const bulkReExtract = async () => {
    if (selectedIds.length === 0) return;
    setBusy(true);
    try {
      await Promise.all(
        selectedIds.map((id) =>
          apiClient(`/v1/invoices/${id}/extract`, { method: "POST" }).catch(() => null),
        ),
      );
      await invalidate();
      toast.success(`Re-extracting ${selectedIds.length}`);
      setSelected({});
    } finally {
      setBusy(false);
    }
  };

  const bulkAssignCategory = async () => {
    if (!batchCategory || selectedIds.length === 0) {
      toast.error("Pick a category and select receipts first");
      return;
    }
    setBusy(true);
    try {
      let updated = 0;
      for (const id of selectedIds) {
        const inv = allInFlight.find((i) => i.id === id);
        if (!inv) continue;
        const lineItems = (inv.lineItems ?? []).map((li, idx) => ({
          id:          li.id,
          categoryId:  batchCategory,
          description: li.description,
          quantity:    li.quantity ?? "1",
          unitPrice:   li.unitPrice ?? null,
          amount:      li.amount,
          sortOrder:   li.sortOrder ?? String(idx),
        }));
        if (lineItems.length === 0) continue;
        await apiClient(`/v1/invoices/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ lineItems }),
        });
        updated++;
      }
      await invalidate();
      toast.success(`Categorized ${updated}`);
      setSelected({});
      setBatchCategory("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Categorize failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ background: RK.paper, color: RK.ink, minHeight: "calc(100dvh - 48px)" }}>
      <H
        kicker={`bulk · ${allInFlight.length} in flight`}
        title="Triage receipts"
        right={
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {BUCKETS.map((b) => (
              <button
                key={b.value}
                type="button"
                onClick={() => setBucket(b.value)}
                style={{
                  fontFamily: RK.mono,
                  fontSize: 10.5,
                  padding: "4px 10px",
                  border: `1px solid ${bucket === b.value ? RK.accent : RK.rule}`,
                  background: bucket === b.value ? RK.accentSoft : "transparent",
                  color: bucket === b.value ? RK.accent : RK.ink2,
                  borderRadius: 3,
                  cursor: "pointer",
                  letterSpacing: 0.3,
                }}
              >
                {b.label}
              </button>
            ))}
          </div>
        }
      />

      {selectedIds.length > 0 && (
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
            gap: 10,
            fontFamily: RK.mono,
            fontSize: 11,
            flexWrap: "wrap",
          }}
        >
          <span style={{ color: RK.accent }}>{selectedIds.length} selected</span>
          <span style={{ flex: 1 }} />
          <Bracket disabled={busy} accent onClick={bulkApprove}>
            approve reviewable
          </Bracket>
          <Bracket disabled={busy} onClick={bulkReExtract}>
            re-extract
          </Bracket>
          <Select value={batchCategory} onValueChange={setBatchCategory}>
            <SelectTrigger className="h-7 text-xs w-44">
              <SelectValue placeholder="set category…" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Bracket
            disabled={busy || !batchCategory}
            onClick={bulkAssignCategory}
          >
            apply category
          </Bracket>
          <Bracket onClick={() => setSelected({})}>clear</Bracket>
        </div>
      )}

      <div style={{ padding: "0 18px 24px" }}>
        <div style={{ border: `1px solid ${RK.rule}`, background: RK.surface }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "32px 1.4fr 0.7fr 0.7fr 1fr 0.7fr 0.8fr",
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
            <span>AI conf</span>
            <span>Status</span>
          </div>

          {isLoading && (
            <div style={{ padding: 32, fontFamily: RK.mono, fontSize: 11, color: RK.ink3 }}>
              Loading…
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div
              style={{
                padding: 48,
                fontFamily: RK.mono,
                fontSize: 11,
                color: RK.ink3,
                textAlign: "center",
              }}
            >
              Nothing here. All caught up in this bucket.
            </div>
          )}

          {!isLoading &&
            filtered.map((inv, i) => {
              const conf = inv.aiConfidence ? parseFloat(inv.aiConfidence) : null;
              const confColor =
                conf === null
                  ? RK.ink3
                  : conf >= 0.85
                    ? RK.ok
                    : conf >= 0.6
                      ? RK.warn
                      : RK.err;
              const sst = inv.taxRate ? `${parseFloat(inv.taxRate).toFixed(0)}%` : "—";
              const category = inv.lineItems?.[0]?.category?.name ?? "—";
              const status = statusToPill[inv.status];
              const checked = !!selected[inv.id];
              return (
                <div
                  key={inv.id}
                  onClick={() => router.push(`/app2/invoices/${inv.id}`)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "32px 1.4fr 0.7fr 0.7fr 1fr 0.7fr 0.8fr",
                    padding: "10px 14px",
                    borderBottom: i < filtered.length - 1 ? `1px solid ${RK.rule2}` : "none",
                    alignItems: "center",
                    fontFamily: RK.mono,
                    fontSize: 11.5,
                    cursor: "pointer",
                    background: checked ? RK.hi : "transparent",
                  }}
                >
                  <span onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setSelected((s) => ({ ...s, [inv.id]: !s[inv.id] }))
                      }
                    />
                  </span>
                  <span style={{ color: RK.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {inv.vendor ?? inv.originalName}
                  </span>
                  <span style={{ color: RK.ink2 }}>{formatMYR(inv.total)}</span>
                  <span>
                    <Pill tone={sst === "—" || sst === "0%" ? "ink" : "accent"}>
                      {sst}
                    </Pill>
                  </span>
                  <span style={{ color: RK.ink2 }}>{category}</span>
                  <span style={{ color: confColor, fontWeight: 500 }}>
                    {conf === null ? "—" : `${(conf * 100).toFixed(0)}%`}
                  </span>
                  <span>
                    <Pill tone={status.tone}>{status.label}</Pill>
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
