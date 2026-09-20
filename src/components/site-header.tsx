import Link from "next/link";
import { MainNavigation } from "./main-navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-sm shadow-sm">
      <div className="site-container flex min-h-16 items-center justify-between gap-4 py-3">
        <Link
          href="/"
          aria-label="Bupa Care Jobs home"
          className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2"
        >
          <span className="relative flex h-10 w-10 animate-logo-float animate-logo-glow" aria-hidden="true">
            <img
              src="/bupalogo.png"
              alt=""
              width={40}
              height={40}
              className="h-full w-full object-contain"
              decoding="async"
            />
          </span>
          <span className="hidden sm:block text-lg font-bold tracking-tight text-[var(--color-foreground)]">
            Bupa Care Careers
          </span>
        </Link>
        <MainNavigation />
      </div>
    </header>
  );
}