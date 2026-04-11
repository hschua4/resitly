import { cn } from "@/lib/utils";
import type { InvoiceStatus } from "@resitly/types";
import {
  Circle,
  CircleCheck,
  CircleDashed,
  CircleX,
  Loader,
} from "lucide-react";

const statusConfig: Record<
  InvoiceStatus,
  { label: string; color: string; Icon: React.ElementType }
> = {
  pending: { label: "Pending", color: "#8a8f98", Icon: CircleDashed },
  extracting: { label: "Extracting", color: "#828fff", Icon: Loader },
  review: { label: "Review", color: "#f59e0b", Icon: Circle },
  reviewed: { label: "Reviewed", color: "#27a644", Icon: CircleCheck },
  exported: { label: "Exported", color: "#7170ff", Icon: CircleX },
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const { label, color, Icon } = statusConfig[status] ?? statusConfig.pending;
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 text-[11px]")}
      style={{ color, fontWeight: 510 }}
    >
      <Icon size={12} strokeWidth={2} style={{ color }} />
      {label}
    </span>
  );
}
