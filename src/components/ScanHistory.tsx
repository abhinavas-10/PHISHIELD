import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatWhen, VERDICT_LABEL, type ScanResult, type Verdict } from "@/lib/scan";
import { ScanResultCard } from "./ScanResult";

const FILTERS: Array<{ key: Verdict | "all"; label: string }> = [
  { key: "all", label: "All" },
  { key: "safe", label: "Safe" },
  { key: "suspicious", label: "Suspicious" },
  { key: "malicious", label: "Malicious" },
];

const ACTION: Record<Verdict, string> = {
  safe: "Safe",
  suspicious: "Review",
  malicious: "Blocked",
};

export function ScanHistory({ entries }: { entries: ScanResult[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Verdict | "all">("all");
  const [selected, setSelected] = useState<ScanResult | null>(null);

  const rows = useMemo(
    () =>
      entries.filter(
        (entry) =>
          (filter === "all" || entry.verdict === filter) &&
          entry.url.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [entries, filter, query],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex h-10 items-center gap-2.5 rounded-xl border border-border bg-surface/60 px-3 sm:w-72">
          <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value.slice(0, 200))}
            placeholder="Search history"
            aria-label="Search scan history"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs transition-colors",
                filter === item.key
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border">
        <div className="hidden grid-cols-[1fr_140px_120px_120px] gap-4 border-b border-border bg-surface/50 px-5 py-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground sm:grid">
          <span>URL</span>
          <span>Result</span>
          <span>Date</span>
          <span>Status</span>
        </div>

        {rows.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">No scans match this filter.</p>
        )}

        {rows.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setSelected(entry)}
            className="grid w-full grid-cols-1 gap-2 border-b border-border px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-surface/60 sm:grid-cols-[1fr_140px_120px_120px] sm:items-center sm:gap-4"
          >
            <span className="truncate font-mono text-sm">{entry.host}</span>
            <span className="text-sm text-muted-foreground">{VERDICT_LABEL[entry.verdict]}</span>
            <span className="text-sm text-muted-foreground">{formatWhen(entry.scannedAt)}</span>
            <span
              className={cn(
                "w-fit rounded-md border px-2 py-0.5 text-xs",
                entry.verdict === "safe"
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border-strong text-foreground",
              )}
            >
              {ACTION[entry.verdict]}
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <ScanResultCard
          result={selected}
          title={`Scan details — ${selected.host}`}
          showHistoryLink={false}
        />
      )}
    </div>
  );
}
