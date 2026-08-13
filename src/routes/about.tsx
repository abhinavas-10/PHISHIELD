import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About PHISHIELD — Monochrome Link Security" },
      {
        name: "description",
        content: "PHISHIELD is a focused URL security tool: paste a link, get a clear verdict, keep your data.",
      },
      { property: "og:title", content: "About PHISHIELD — Monochrome Link Security" },
      { property: "og:description", content: "Why PHISHIELD exists and how it treats your data." },
    ],
  }),
  component: AboutPage,
});

const PRINCIPLES = [
  {
    title: "One job, done well",
    copy: "PHISHIELD checks links. No dashboards you'll never open, no features that exist to fill a pricing table.",
  },
  {
    title: "Accountable verdicts",
    copy: "Every result shows the signals behind it, so you can disagree with the verdict and still learn something.",
  },
  {
    title: "Nothing to sign up for",
    copy: "Scanning works without an account. Submitted URLs are not stored beyond what a scan requires.",
  },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
      <PageHeader
        eyebrow="About"
        title="Security tooling without the theatre."
        description="Phishing works because links look ordinary. PHISHIELD gives an ordinary link a second opinion before you trust it."
      />

      <div className="mt-16 grid grid-cols-1 divide-y divide-border border-y border-border md:grid-cols-3 md:divide-x md:divide-y-0">
        {PRINCIPLES.map((item) => (
          <div key={item.title} className="py-10 md:px-8 md:first:pl-0 md:last:pr-0">
            <h2 className="text-base font-medium">{item.title}</h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">{item.copy}</p>
          </div>
        ))}
      </div>

      <p className="mt-12 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Results shown in this build come from a local heuristic engine using demonstration data. The scanning
        layer is isolated behind a single interface so a production analysis API can be connected without
        changing the interface.
      </p>
    </div>
  );
}
