import { cn } from "@/lib/utils";
import type { SecuritySignal } from "@/lib/scan";
import { Check, Minus, TriangleAlert } from "lucide-react";

const ICONS = {
  good: Check,
  neutral: Minus,
  warn: TriangleAlert,
} as const;

interface Props {
  signal: SecuritySignal;
  tone?: "dark" | "light";
  className?: string | undefined;
}

export function SecurityMetric({ signal, tone = "dark", className }: Props) {
  const Icon = ICONS[signal.state];
  return (
    <div className={cn("py-4", className)}>
      <div
        className={cn(
          "flex items-center gap-2 text-[11px] uppercase tracking-[0.14em]",
          tone === "dark" ? "text-muted-foreground" : "text-invert-foreground/55",
        )}
      >
        <Icon className={cn("size-3", signal.state === "warn" && "opacity-100")} strokeWidth={2} />
        {signal.label}
      </div>
      <p className="mt-2 text-sm font-medium">{signal.value}</p>
      {signal.detail && (
        <p
          className={cn(
            "mt-1 text-xs",
            tone === "dark" ? "text-muted-foreground/80" : "text-invert-foreground/50",
          )}
        >
          {signal.detail}
        </p>
      )}
    </div>
  );
}
