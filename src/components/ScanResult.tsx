import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertTriangle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SecurityMetric } from "./SecurityMetric";
import { VERDICT_LABEL, type ScanResult } from "@/lib/scan";

const ICONS = {
  safe: ShieldCheck,
  suspicious: ShieldAlert,
  malicious: ShieldX,
} as const;

interface Props {
  result: ScanResult;
  /** "light" renders inside the inverted light panel. */
  tone?: "dark" | "light";
  title?: string;
  showHistoryLink?: boolean;
  compact?: boolean;
}

export function ScanResultCard({
  result,
  tone = "dark",
  title = "Latest Scan Result",
  showHistoryLink = true,
  compact = false,
}: Props) {
  const Icon = ICONS[result.verdict];

  const signals = compact
    ? result.signals.slice(0, 4)
    : result.signals;

  // Show the warning automatically for malicious URLs
  const [showHighRiskPopup, setShowHighRiskPopup] = useState(
    result.verdict === "malicious",
  );

  const closePopupAndViewResults = () => {
    setShowHighRiskPopup(false);

    setTimeout(() => {
      document
        .getElementById("detailed-results")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
  };

  return (
    <>
      {/* =====================================================
          HIGH RISK POPUP
          ===================================================== */}

      {showHighRiskPopup && result.verdict === "malicious" && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">

          <div className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0c] text-white shadow-2xl">

            {/* Background glow */}
            <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-red-500/20 blur-3xl" />

            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowHighRiskPopup(false)}
              className="absolute right-5 top-5 z-20 flex size-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Close warning"
            >
              <X className="size-4" />
            </button>

            <div className="relative px-6 pb-7 pt-8 sm:px-8">

              {/* Warning icon */}
              <div className="flex justify-center">
                <div className="relative flex size-24 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">

                  <div className="absolute inset-2 rounded-full border border-red-500/20" />

                  <div className="flex size-14 items-center justify-center rounded-full bg-red-500/15">
                    <AlertTriangle
                      className="size-7 text-red-400"
                      strokeWidth={2}
                    />
                  </div>

                </div>
              </div>

              {/* Heading */}
              <div className="mt-6 text-center">

                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1">

                  <span className="size-1.5 rounded-full bg-red-400" />

                  <span className="text-[11px] font-semibold tracking-[0.18em] text-red-300">
                    HIGH RISK DETECTED
                  </span>

                </div>

                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Potential phishing threat
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/50">
                  PHISHIELD detected suspicious characteristics
                  commonly associated with phishing URLs.
                </p>

              </div>

              {/* Scanned URL */}
              <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.04] p-4">

                <div className="flex items-center justify-between gap-3">

                  <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
                    Scanned URL
                  </span>

                  <span className="rounded-md bg-red-500/10 px-2 py-1 text-[10px] font-semibold text-red-300">
                    PHISHING
                  </span>

                </div>

                <p className="mt-3 break-all font-mono text-sm leading-6 text-white/80">
                  {result.url}
                </p>

              </div>

              {/* Confidence + Risk */}
              <div className="mt-4 grid grid-cols-2 gap-3">

                {/* Confidence */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">

                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
                    Confidence
                  </p>

                  <div className="mt-2 flex items-end gap-1">

                    <span className="text-2xl font-semibold">
                      {result.score}
                    </span>

                    <span className="mb-1 text-sm text-white/40">
                      %
                    </span>

                  </div>

                </div>

                {/* Risk level */}
                <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4">

                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/35">
                    Risk Level
                  </p>

                  <div className="mt-2 flex items-center gap-2">

                    <span className="size-2 rounded-full bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.7)]" />

                    <span className="text-lg font-semibold text-red-300">
                      HIGH
                    </span>

                  </div>

                </div>

              </div>

              {/* Security warning */}
              <div className="mt-4 rounded-2xl border border-red-500/15 bg-red-500/[0.06] p-4">

                <div className="flex gap-3">

                  <ShieldX className="mt-0.5 size-5 shrink-0 text-red-400" />

                  <div>

                    <p className="text-sm font-medium text-red-200">
                      Don't interact with this URL
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/45">
                      Avoid opening this link or entering passwords,
                      payment details, OTPs, or other personal information.
                    </p>

                  </div>

                </div>

              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                {/* WORKING BUTTON */}
                <button
                  type="button"
                  onClick={closePopupAndViewResults}
                  className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  View Detailed Results
                </button>

                <button
                  type="button"
                  onClick={() => setShowHighRiskPopup(false)}
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Dismiss
                </button>

              </div>

              {/* Footer */}
              <p className="mt-5 text-center text-[10px] text-white/25">
                Analysis performed by PHISHIELD AI · Random Forest
              </p>

            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          DETAILED RESULT CARD
          ===================================================== */}

      <section
        id="detailed-results"
        className={cn(
          "rise-in scroll-mt-8 overflow-hidden rounded-3xl border",
          tone === "dark"
            ? "border-border bg-card shadow-panel"
            : "border-border-strong bg-background shadow-lift",
        )}
      >

        {/* Header */}
        <header className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">

          <h3 className="text-sm font-medium">
            {title}
          </h3>

          {showHistoryLink && (
            <Link
              to="/history"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              View history

              <ArrowRight
                className="size-3.5"
                strokeWidth={2}
              />
            </Link>
          )}

        </header>

        {/* Main result */}
        <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center">

          <div className="relative flex size-20 shrink-0 items-center justify-center rounded-full border border-border">

            <div
              className={cn(
                "flex size-14 items-center justify-center rounded-full border",
                result.verdict === "safe"
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border-strong bg-surface text-foreground",
              )}
            >
              <Icon
                className="size-6"
                strokeWidth={1.75}
              />
            </div>

          </div>

          <div className="min-w-0">

            <div className="flex flex-wrap items-center gap-3">

              <p className="truncate font-mono text-sm">
                {result.url}
              </p>

              <span
                className={cn(
                  "rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-[0.12em]",
                  result.verdict === "safe"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border-strong text-foreground",
                )}
              >
                {VERDICT_LABEL[result.verdict]}
              </span>

            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              {result.message}
            </p>

            <p className="mt-1 text-xs text-muted-foreground/70">
              Confidence {result.score}% ·{" "}
              {new Date(result.scannedAt).toLocaleString(
                "en-US",
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                },
              )}
            </p>

          </div>

        </div>

        {/* Warning message */}
        {result.verdict !== "safe" && (
          <div className="mx-6 mb-6 rounded-xl border border-border-strong bg-surface px-4 py-3 text-sm">

            <span className="font-medium">
              {result.headline}
            </span>{" "}

            <span className="text-muted-foreground">

              {result.verdict === "malicious"
                ? "Avoid opening this link and never submit personal data."
                : "Review the signals below before continuing."}

            </span>

          </div>
        )}

        {/* Security signals */}
        <div className="grid grid-cols-1 gap-x-8 border-t border-border px-6 py-2 sm:grid-cols-2 lg:grid-cols-3">

          {signals.map((signal, index) => (
            <SecurityMetric
              key={signal.label}
              signal={signal}
              className={
                index > 0
                  ? "border-t border-border sm:border-t-0"
                  : undefined
              }
            />
          ))}

        </div>

      </section>
    </>
  );
}