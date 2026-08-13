import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/** Monochrome theme switch. The site is black-first; light mode inverts the scale. */
export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("light", light);
  }, [light]);

  return (
    <button
      type="button"
      aria-label={light ? "Switch to dark appearance" : "Switch to light appearance"}
      onClick={() => setLight((v) => !v)}
      className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
    >
      {light ? <Moon className="size-4" strokeWidth={1.75} /> : <Sun className="size-4" strokeWidth={1.75} />}
    </button>
  );
}
