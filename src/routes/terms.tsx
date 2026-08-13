import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — PHISHIELD" },
      {
        name: "description",
        content: "Terms of use for the PHISHIELD URL scanner, including limits of the security verdicts provided.",
      },
      { property: "og:title", content: "Terms — PHISHIELD" },
      { property: "og:description", content: "Acceptable use and the limits of PHISHIELD scan results." },
    ],
  }),
  component: TermsPage,
});

const SECTIONS = [
  {
    title: "Use of the scanner",
    copy: "PHISHIELD is provided for checking links you are considering opening. Do not use it to test or attack systems you don't own.",
  },
  {
    title: "No guarantee",
    copy: "Verdicts are informational. A safe result is not a warranty, and a malicious result is not a legal determination.",
  },
  {
    title: "Changes",
    copy: "These terms may change as the product develops. Continued use means you accept the current version.",
  },
];

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
      <PageHeader eyebrow="Terms" title="Plain terms of use." />
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
