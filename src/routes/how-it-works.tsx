import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HowItWorks } from "@/components/HowItWorks";
import { PageHeader } from "@/components/PageHeader";
import { URLScanner } from "@/components/URLScanner";
import { ScanResultCard } from "@/components/ScanResult";
import type { ScanResult } from "@/lib/scan";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — PHISHIELD URL Scanning" },
      {
        name: "description",
        content: "Enter a URL, let PHISHIELD analyze domain and URL security signals, and read a clear verdict.",
      },
      { property: "og:title", content: "How It Works — PHISHIELD URL Scanning" },
      {
        property: "og:description",
        content: "Three steps: enter a URL, analyze security signals, get a safe, suspicious or malicious result.",
      },
    ],
  }),
  component: HowItWorksPage,
});

function HowItWorksPage() {
  const [result, setResult] = useState<ScanResult | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
      <PageHeader
        eyebrow="Process"
        title="How PHISHIELD Works"
        description="A scan is deliberately simple on the surface and layered underneath."
      />
      <div className="mt-14">
        <HowItWorks />
      </div>

      <div className="mt-16 max-w-2xl">
        <h2 className="text-lg font-medium">Try it now</h2>
        <p className="mt-2 text-sm text-muted-foreground">No account, no setup.</p>
        <div className="mt-6">
          <URLScanner onResult={setResult} />
        </div>
      </div>

      {result && (
        <div className="mt-10">
          <ScanResultCard result={result} title="Scan Result" />
        </div>
      )}
    </div>
  );
}
