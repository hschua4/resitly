import { Sparkles } from "lucide-react";
import { EmptyState } from "@/components/v2/empty-state";

export default function BriefPage() {
  return (
    <EmptyState
      kicker="ai brief"
      title="Daily AI brief"
      description="A morning summary written by AI: what came in overnight, which receipts need your attention, and what's on track for this filing period."
      ctaLabel="Generate today's brief"
      icon={<Sparkles className="size-6" />}
    />
  );
}
