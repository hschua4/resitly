import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { InvoiceStatus } from "@resitly/types";

const statusConfig: Record<
  InvoiceStatus,
  { label: string; className: string }
> = {
  pending:    { label: "Pending",    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300" },
  extracting: { label: "Extracting", className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  review:     { label: "Review",     className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" },
  reviewed:   { label: "Reviewed",   className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  exported:   { label: "Exported",   className: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const { label, className } = statusConfig[status] ?? statusConfig.pending;
  return (
    <Badge variant="secondary" className={cn("font-medium text-xs", className)}>
      {label}
    </Badge>
  );
}
