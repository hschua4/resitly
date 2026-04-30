import { Building2 } from "lucide-react";
import { EmptyState } from "@/components/v2/empty-state";

export default function VendorsPage() {
  return (
    <EmptyState
      kicker="vendors"
      title="Vendor management"
      description="Track suppliers, link receipts, and manage payment terms. Every receipt automatically links to its vendor so you can see total spend, frequency, and SST exposure per supplier."
      ctaLabel="＋ add vendor"
      icon={<Building2 className="size-6" />}
    />
  );
}
