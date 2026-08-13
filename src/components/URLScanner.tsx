import { useEffect, useRef, useState } from "react";
import { ArrowRight, Link2, Loader2, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { isProbablyUrl, scanUrl, type ScanResult } from "@/lib/scan";

const EXAMPLES = ["google.com", "paypal.com", "bit.ly/example"];

interface Props {
  onResult?: (result: ScanResult) => void;
  autoFocus?: boolean;
}

export function URLScanner({ onResult, autoFocus }: Props) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"idle" | "scanning" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const requestRef = useRef(0);

  useEffect(() => () => void (requestRef.current += 1), []);

  async function submit(raw: string) {
    const input = raw.trim();
    if (!isProbablyUrl(input)) {
      setStatus("error");
      setError("Enter a valid URL, for example example.com");
      return;
    }
    setError(null);
    setNotice(null);
    setStatus("scanning");
    const token = ++requestRef.current;
    const { result, warning } = await scanUrl(input);
    if (token !== requestRef.current) return;
    setStatus("idle");
    setNotice(warning ?? null);
    onResult?.(result);
  }


  const scanning = status === "scanning";

  return (
    <div className="w-full">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit(value);
        }}
        className={cn(
          "flex flex-col gap-2 rounded-2xl border bg-surface/60 p-2 transition-colors sm:flex-row sm:items-center",
          error ? "border-border-strong" : "border-border focus-within:border-border-strong",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
          <Link2 className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
          <input
            value={value}
            autoFocus={autoFocus}
            onChange={(event) => {
              setValue(event.target.value.slice(0, 500));
              if (error) setError(null);
            }}
            inputMode="url"
            spellCheck={false}
            placeholder="Enter URL to scan..."
            aria-label="URL to scan"
            className="h-11 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="submit"
          disabled={scanning}
          className="group inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-transparent bg-primary px-5 text-sm font-medium text-primary-foreground transition-all hover:border-border-strong hover:bg-background hover:text-foreground disabled:opacity-70"
        >
          {scanning ? (
            <>
              <Loader2 className="size-4 animate-spin" strokeWidth={2} />
              Analyzing URL...
            </>
          ) : (
            <>
              Scan URL
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </>
          )}
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Try examples:</span>
        {EXAMPLES.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => {
              setValue(example);
              void submit(example);
            }}
            className="rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
          >
            {example}
          </button>
        ))}
      </div>

      {error && <p className="mt-3 text-xs text-muted-foreground">{error}</p>}
      {!error && notice && (
        <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
          <TriangleAlert className="mt-0.5 size-3 shrink-0" strokeWidth={2} />
          {notice}
        </p>
      )}

    </div>
  );
}
