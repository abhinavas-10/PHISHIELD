import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { ScanHistory } from "@/components/ScanHistory";
import { MOCK_HISTORY } from "@/lib/mock-history";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Scan History — PHISHIELD" },
      {
        name: "description",
        content: "Search, filter and review previous PHISHIELD URL scans with their verdicts and security signals.",
      },
      { property: "og:title", content: "Scan History — PHISHIELD" },
      { property: "og:description", content: "Review previous URL scans and their detailed security signals." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
      <PageHeader
        eyebrow="Activity"
        title="Scan History"
        description="Recent scans from this session. Select a row to inspect the full signal breakdown."
      />
      <div className="mt-12">
        <ScanHistory entries={MOCK_HISTORY} />
      </div>
    </div>
  );
}
