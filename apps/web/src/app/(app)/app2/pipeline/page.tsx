"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useInvoices } from "@/hooks/use-api";
import { apiClient } from "@/lib/api-client";
import { Bracket, H, Pill, RK, type Tone } from "@/components/v2/kit";
import { formatMYR } from "@/lib/utils";
import type { Invoice, InvoiceStatus } from "@resitly/types";

type ColumnId = "captured" | "extracted" | "review" | "approved";

const COLUMNS: { id: ColumnId; label: string; tone: Tone; statuses: InvoiceStatus[] }[] = [
  { id: "captured",  label: "Captured",     tone: "ink",    statuses: ["pending"] },
  { id: "extracted", label: "Extracted",    tone: "accent", statuses: ["extracting"] },
  { id: "review",    label: "Needs review", tone: "warn",   statuses: ["review"] },
  { id: "approved",  label: "Approved",     tone: "ok",     statuses: ["reviewed", "exported"] },
];

const ALLOWED_TRANSITIONS: Record<ColumnId, ColumnId[]> = {
  captured:  ["extracted"],
  extracted: ["approved"],
  review:    ["approved"],
  approved:  [],
};

function columnIdForStatus(status: InvoiceStatus): ColumnId {
  for (const c of COLUMNS) if (c.statuses.includes(status)) return c.id;
  return "captured";
}

export default function PipelinePage() {
  const router = useRouter();
  const qc = useQueryClient();

  const { data, isLoading, isFetching } = useInvoices({ page: 1, limit: 100 });
  const invoices = useMemo(() => data?.data ?? [], [data]);

  const grouped = useMemo(() => {
    const g: Record<ColumnId, Invoice[]> = {
      captured: [],
      extracted: [],
      review: [],
      approved: [],
    };
    for (const inv of invoices) {
      g[columnIdForStatus(inv.status)].push(inv);
    }
    return g;
  }, [invoices]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const [busy, setBusy] = useState(false);

  const handleDragEnd = async (event: DragEndEvent) => {
    const invoiceId = String(event.active.id);
    const targetCol = event.over?.id as ColumnId | undefined;
    if (!targetCol) return;

    const invoice = invoices.find((i) => i.id === invoiceId);
    if (!invoice) return;

    const sourceCol = columnIdForStatus(invoice.status);
    if (sourceCol === targetCol) return;

    if (!ALLOWED_TRANSITIONS[sourceCol].includes(targetCol)) {
      const target = COLUMNS.find((c) => c.id === targetCol)?.label ?? targetCol;
      const source = COLUMNS.find((c) => c.id === sourceCol)?.label ?? sourceCol;
      toast.error(`Can't move from "${source}" to "${target}"`);
      return;
    }

    setBusy(true);
    try {
      if (sourceCol === "captured" && targetCol === "extracted") {
        await apiClient(`/v1/invoices/${invoiceId}/extract`, { method: "POST" });
        toast.success("Re-extracting…");
      } else if (
        (sourceCol === "extracted" || sourceCol === "review") &&
        targetCol === "approved"
      ) {
        await apiClient(`/v1/invoices/${invoiceId}/confirm`, { method: "PATCH" });
        toast.success("Approved");
      }
      await qc.invalidateQueries({ queryKey: ["invoices"] });
      await qc.invalidateQueries({ queryKey: ["dashboard"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ background: RK.paper, color: RK.ink, minHeight: "calc(100dvh - 48px)" }}>
      <H
        kicker="pipeline"
        title="Receipts moving through review"
        right={
          <Bracket onClick={() => router.push("/app2/capture")} accent>
            ＋ upload
          </Bracket>
        }
      />

      {isLoading ? (
        <div style={{ padding: 32, fontFamily: RK.mono, color: RK.ink3 }}>Loading…</div>
      ) : (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div
            style={{
              padding: "0 18px 24px",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
              opacity: busy || isFetching ? 0.7 : 1,
              minHeight: "calc(100dvh - 180px)",
            }}
          >
            {COLUMNS.map((col) => (
              <Column
                key={col.id}
                id={col.id}
                label={col.label}
                tone={col.tone}
                items={grouped[col.id]}
              />
            ))}
          </div>
        </DndContext>
      )}
    </div>
  );
}

function Column({
  id,
  label,
  tone,
  items,
}: {
  id: ColumnId;
  label: string;
  tone: Tone;
  items: Invoice[];
}) {
  const { isOver, setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        background: isOver ? RK.accentSoft : RK.paper2,
        border: `1px solid ${isOver ? RK.accent : RK.rule}`,
        display: "flex",
        flexDirection: "column",
        transition: "background 80ms, border-color 80ms",
      }}
    >
      <div
        style={{
          padding: "8px 10px",
          borderBottom: `1px solid ${RK.rule}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: RK.mono,
          fontSize: 10,
          color: RK.ink2,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        <span>{label}</span>
        <Pill tone={tone}>{items.length}</Pill>
      </div>
      <div
        style={{
          padding: 8,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          flex: 1,
          overflowY: "auto",
        }}
      >
        {items.length === 0 ? (
          <div
            style={{
              fontFamily: RK.mono,
              fontSize: 10,
              color: RK.ink3,
              textAlign: "center",
              padding: 12,
            }}
          >
            empty
          </div>
        ) : (
          items.map((inv) => <Card key={inv.id} invoice={inv} />)
        )}
      </div>
    </div>
  );
}

function Card({ invoice }: { invoice: Invoice }) {
  const router = useRouter();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: invoice.id,
  });
  const style: React.CSSProperties = {
    background: RK.surface,
    border: `1px solid ${RK.rule}`,
    padding: "8px 10px",
    fontFamily: RK.mono,
    fontSize: 10.5,
    cursor: isDragging ? "grabbing" : "grab",
    opacity: isDragging ? 0.6 : 1,
    transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
    color: RK.ink,
  };
  const sst = invoice.taxRate ? `${parseFloat(invoice.taxRate).toFixed(0)}%` : "—";

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
        <span
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/app2/invoices/${invoice.id}`);
          }}
          style={{
            color: RK.ink,
            cursor: "pointer",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
            textDecoration: "underline",
            textDecorationColor: RK.rule,
          }}
        >
          {invoice.vendor ?? invoice.originalName}
        </span>
        <span style={{ color: RK.ink2 }}>{formatMYR(invoice.total)}</span>
      </div>
      <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
        <Pill tone={sst === "—" || sst === "0%" ? "ink" : "accent"}>SST {sst}</Pill>
      </div>
    </div>
  );
}
