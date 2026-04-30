import { FileText } from "lucide-react";
import { EmptyState } from "@/components/v2/empty-state";

export default function ReportsPage() {
  return (
    <EmptyState
      kicker="reports & sst-02"
      title="Period-end reports"
      description="Generate SST-02 drafts, expense summaries, and vendor breakdowns ready for your accountant or for filing through MySST. Lock a period and ship."
      ctaLabel="Generate SST-02 draft"
      icon={<FileText className="size-6" />}
    />
  );
}
