import { CheckSquare } from "lucide-react";
import { EmptyState } from "@/components/v2/empty-state";

export default function ApprovalsPage() {
  return (
    <EmptyState
      kicker="approvals"
      title="Reviewer queue"
      description="Multi-eyes sign-off on receipts above an amount threshold or in sensitive categories. Assign reviewers, leave comments, and keep an audit trail for compliance."
      ctaLabel="Configure approval policy"
      icon={<CheckSquare className="size-6" />}
    />
  );
}
