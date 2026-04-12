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
  { label: string; className: string; Icon: React.ElementType }
> = {
  pending: { label: "Pending", className: "text-status-pending", Icon: CircleDashed },
  extracting: { label: "Extracting", className: "text-status-extracting", Icon: Loader },
  review: { label: "Review", className: "text-status-review", Icon: Circle },
  reviewed: { label: "Reviewed", className: "text-status-reviewed", Icon: CircleCheck },
  exported: { label: "Exported", className: "text-status-exported", Icon: CircleX },
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const { label, className, Icon } = statusConfig[status] ?? statusConfig.pending;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-medium", className)}>
      <Icon size={12} strokeWidth={2} />
      {label}
    </span>
  );
}
