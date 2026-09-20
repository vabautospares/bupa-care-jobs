import type { ReactNode } from "react";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex min-h-[calc(100vh-4rem)] flex-col">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
