import { Activity, Clock, Database, ShieldCheck } from "lucide-react";
import { PLATFORM_STATS } from "@/lib/mock-history";

const ICONS = [ShieldCheck, Activity, Clock, Database];

/** Demonstration values — wire to backend metrics when available. */
export function StatsGrid({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {PLATFORM_STATS.map((stat, index) => {
        const Icon = ICONS[index % ICONS.length]!;
        return (
          <div
            key={stat.label}
            className={
              tone === "light"
                ? "flex items-center gap-4 rounded-2xl border border-invert-foreground/12 px-5 py-5"
                : "flex items-center gap-4 rounded-2xl border border-border bg-card px-5 py-5"
            }
          >
            <span
              className={
                tone === "light"
                  ? "flex size-9 items-center justify-center rounded-lg border border-invert-foreground/15"
                  : "flex size-9 items-center justify-center rounded-lg border border-border bg-surface"
              }
            >
              <Icon className="size-4" strokeWidth={1.6} />
            </span>
            <div>
              <p className="text-xl font-semibold tracking-tight">{stat.value}</p>
              <p className={tone === "light" ? "text-xs text-invert-foreground/55" : "text-xs text-muted-foreground"}>
                {stat.label}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
