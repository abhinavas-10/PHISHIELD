const STEPS = [
  { number: "01", title: "Enter URL", copy: "Paste any website URL into the scanner." },
  { number: "02", title: "Analyze", copy: "PHISHIELD analyzes multiple URL and domain security signals." },
  { number: "03", title: "Get Result", copy: "Receive a simple Safe, Suspicious, or Malicious result." },
];

export function HowItWorks() {
  return (
    <div className="grid grid-cols-1 divide-y divide-border border-y border-border md:grid-cols-3 md:divide-x md:divide-y-0">
      {STEPS.map((step) => (
        <div key={step.number} className="px-0 py-10 md:px-8 md:first:pl-0 md:last:pr-0">
          <span className="font-mono text-4xl font-medium text-muted-foreground/40">{step.number}</span>
          <h3 className="mt-6 text-lg font-medium">{step.title}</h3>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">{step.copy}</p>
        </div>
      ))}
    </div>
  );
}
