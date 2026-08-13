import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="size-4" strokeWidth={1.75} />
            <span className="text-sm font-semibold tracking-[0.16em]">PHISHIELD</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Simple protection against suspicious links.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link to="/features" className="transition-colors hover:text-foreground">
            Features
          </Link>
          <Link to="/how-it-works" className="transition-colors hover:text-foreground">
            How It Works
          </Link>
          <Link to="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link to="/terms" className="transition-colors hover:text-foreground">
            Terms
          </Link>
          <Link to="/about" className="transition-colors hover:text-foreground">
            About
          </Link>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl border-t border-border px-5 py-5 sm:px-8">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} PHISHIELD. Demonstration results, not security advice.
        </p>
      </div>
    </footer>
  );
}
