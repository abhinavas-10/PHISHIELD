import { createFileRoute } from "@tanstack/react-router";
import { FeatureGrid } from "@/components/FeatureGrid";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — PHISHIELD URL Security Analysis" },
      {
        name: "description",
        content:
          "URL intelligence, domain analysis, SSL verification, blacklist detection and phishing heuristics inside PHISHIELD.",
      },
      { property: "og:title", content: "Features — PHISHIELD URL Security Analysis" },
      {
        property: "og:description",
        content: "The security signals PHISHIELD uses to classify links as safe, suspicious or malicious.",
      },
    ],
  }),
  component: FeaturesPage,
});

function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
      <PageHeader
        eyebrow="Capabilities"
        title="Built from security signals, not guesswork."
        description="Each scan combines independent checks. No single indicator decides the verdict on its own."
      />
      <div className="mt-14">
        <FeatureGrid />
      </div>
    </div>
  );
}
