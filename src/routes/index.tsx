import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Gauge, Lock, ScanLine } from "lucide-react";
import { URLScanner } from "@/components/URLScanner";
import { ScanResultCard } from "@/components/ScanResult";
import { HeroVisual } from "@/components/HeroVisual";
import { StatsGrid } from "@/components/StatsGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { FeatureGrid } from "@/components/FeatureGrid";
import { LATEST_SCAN } from "@/lib/mock-history";
import type { ScanResult } from "@/lib/scan";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PHISHIELD — Check URLs. Stay Protected." },
      {
        name: "description",
        content:
          "Scan any link with PHISHIELD to detect phishing, suspicious and malicious URLs in seconds. No account required.",
      },
      { property: "og:title", content: "PHISHIELD — Check URLs. Stay Protected." },
      {
        property: "og:description",
        content: "Detect phishing links in seconds and protect yourself from malicious websites and scams.",
      },
    ],
  }),
  component: Home,
});

const PROTECTION_ROWS = [
  {
    icon: ScanLine,
    title: "Advanced URL Analysis",
    copy: "Analyze URL structure, domain information, and suspicious patterns.",
  },
  { icon: Gauge, title: "Instant Results", copy: "Get a clear security result within seconds." },
  { icon: Lock, title: "Privacy First", copy: "URLs are not unnecessarily stored or exposed." },
];

function Home() {
  const [result, setResult] = useState<ScanResult | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="grid-backdrop pointer-events-none absolute inset-0 opacity-60" />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div className="rise-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 label-eyebrow">
              AI Powered Security
            </span>
            <h1 className="mt-7 text-5xl font-semibold leading-[0.95] sm:text-6xl lg:text-7xl">
              Check URLs.
              <br />
              Stay Protected.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Detect phishing links in seconds and protect yourself from malicious websites, scams, and
              suspicious links.
            </p>

            <div className="mt-9 max-w-xl">
              <URLScanner onResult={setResult} />
            </div>
          </div>

          <div className="float-slow">
            <HeroVisual />
          </div>
        </div>

        {result && (
          <div className="relative mx-auto max-w-6xl px-5 pb-16 sm:px-8">
            <ScanResultCard result={result} title="Scan Result" />
          </div>
        )}
      </section>

      {/* Inverted protection panel */}
      <section className="px-3 pb-6 sm:px-5">
        <div className="rounded-3xl bg-invert text-invert-foreground">
          <div className="grid grid-cols-1 gap-12 px-6 py-14 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:px-14 lg:py-20">
            <div>
              <span className="text-[11px] uppercase tracking-[0.18em] text-invert-foreground/50">
                Smart Protection
              </span>
              <h2 className="mt-5 text-4xl font-semibold leading-[1.02] sm:text-5xl">
                Powerful. Fast.
                <br />
                Reliable.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-invert-foreground/65">
                PHISHIELD analyzes URLs through multiple security signals to identify suspicious links and
                potential phishing threats.
              </p>

              <div className="mt-10 space-y-7">
                {PROTECTION_ROWS.map((row) => (
                  <div key={row.title} className="flex gap-4">
                    <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-invert-foreground/15">
                      <row.icon className="size-4" strokeWidth={1.6} />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{row.title}</p>
                      <p className="mt-1 text-sm text-invert-foreground/60">{row.copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-foreground">
              <div className="dark">
                <div className="rounded-3xl border border-border bg-[oklch(0.05_0_0)] text-[oklch(1_0_0)] shadow-lift">
                  <ScanResultCard result={LATEST_SCAN} compact />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-invert-foreground/10 px-6 py-10 sm:px-10 lg:px-14">
            <StatsGrid tone="light" />
            <p className="mt-4 text-xs text-invert-foreground/45">
              Demonstration values. Replaced by live platform metrics once connected.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <h2 className="text-3xl font-semibold sm:text-4xl">How PHISHIELD Works</h2>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Three steps between a link you don't trust and a verdict you do.
        </p>
        <div className="mt-12">
          <HowItWorks />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="label-eyebrow">Capabilities</span>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">Every signal that matters</h2>
          </div>
          <a
            href="/features"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            All features
            <ArrowRight className="size-3.5" strokeWidth={2} />
          </a>
        </div>
        <div className="mt-10">
          <FeatureGrid />
        </div>
      </section>
    </>
  );
}
