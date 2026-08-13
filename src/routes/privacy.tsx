import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — PHISHIELD" },
      {
        name: "description",
        content: "How PHISHIELD handles submitted URLs: no accounts, no tracking profiles, minimal retention.",
      },
      { property: "og:title", content: "Privacy — PHISHIELD" },
      { property: "og:description", content: "PHISHIELD's approach to URL data, retention and tracking." },
    ],
  }),
  component: PrivacyPage,
});

const SECTIONS = [
  {
    title: "What we process",
    copy: "Only the URL you submit and technical metadata required to analyze it. Scans do not require an account.",
  },
  {
    title: "Retention",
    copy: "Scan history in this build lives in your browser session. Nothing is written to a permanent store.",
  },
  {
    title: "Tracking",
    copy: "No advertising trackers, no cross-site profiles, no third-party analytics embedded in the scanner.",
  },
];

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
      <PageHeader eyebrow="Privacy" title="Minimal by default." />
      <div className="mt-12 space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="text-base font-medium">{section.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{section.copy}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
