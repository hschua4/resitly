import { cn } from "@/lib/utils";
import type { InvoiceStatus } from "@resitly/types";

const statusConfig: Record<
  InvoiceStatus,
  { label: string; style: React.CSSProperties }
> = {
  pending: {
    label: "Pending",
    style: {
      background: "rgba(98,102,109,0.12)",
      color: "#8a8f98",
      border: "1px solid rgba(98,102,109,0.2)",
    },
  },
  extracting: {
    label: "Extracting",
    style: {
      background: "rgba(94,106,210,0.12)",
      color: "#828fff",
      border: "1px solid rgba(94,106,210,0.25)",
    },
  },
  review: {
    label: "Review",
    style: {
      background: "rgba(245,158,11,0.12)",
      color: "#f59e0b",
      border: "1px solid rgba(245,158,11,0.2)",
    },
  },
  reviewed: {
    label: "Reviewed",
    style: {
      background: "rgba(39,166,68,0.12)",
      color: "#27a644",
      border: "1px solid rgba(39,166,68,0.2)",
    },
  },
  exported: {
    label: "Exported",
    style: {
      background: "rgba(113,112,255,0.12)",
      color: "#7170ff",
      border: "1px solid rgba(113,112,255,0.2)",
    },
  },
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const { label, style } = statusConfig[status] ?? statusConfig.pending;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px]"
      )}
      style={{ fontWeight: 510, ...style }}
    >
      {label}
    </span>
  );
}
