import { Tag } from "lucide-react";
import { EmptyState } from "@/components/v2/empty-state";

export default function SstRulesPage() {
  return (
    <EmptyState
      kicker="sst rules"
      title="SST categorization rules"
      description="Teach Resitly how to classify your receipts. Define rules by vendor, keyword, or amount range so SST rate and category get applied automatically on every upload."
      ctaLabel="＋ new rule"
      icon={<Tag className="size-6" />}
    />
  );
}
