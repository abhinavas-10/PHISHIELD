import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
}

export function FeatureCard({ icon: Icon, title, description }: Props) {
  return (
    <article className="group relative rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-border-strong">
      <span className="flex size-9 items-center justify-center rounded-lg border border-border bg-surface transition-colors group-hover:border-border-strong">
        <Icon className="size-4" strokeWidth={1.6} />
      </span>
      <h3 className="mt-5 text-base font-medium">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </article>
  );
}
