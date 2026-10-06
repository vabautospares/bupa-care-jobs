import Link from "next/link";

const footerGroups = [
  {
    title: "Explore",
    links: [
      { label: "Find opportunities", href: "/find-opportunities" },
      { label: "Recruitment process", href: "/recruitment-process" },
      { label: "Care careers", href: "/care-careers" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "About us", href: "/about" },
      { label: "FAQs", href: "/faqs" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
      { label: "Privacy Notice", href: "/privacy-notice" },
      { label: "Cookie Information", href: "/cookie-information" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
];

export function SiteFooter() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="site-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link href="/" aria-label="Bupa Care Jobs home" className="flex items-center gap-3">
            <span className="relative flex h-9 w-9 animate-logo-float animate-logo-glow" aria-hidden="true">
              <img
                src="/bupalogo.png"
                alt=""
                width={36}
                height={36}
                className="h-full w-full object-contain"
                decoding="async"
              />
            </span>
            <span className="text-lg font-bold text-[var(--color-foreground)]">Bupa Care Careers</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[var(--color-muted)]">
            Practical support for people exploring a career in UK care.
          </p>
        </div>

        {footerGroups.map((group) => (
          <nav key={group.title} aria-label={`${group.title} links`} className="space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[var(--color-foreground)]">
              <span aria-hidden="true" className="h-2 w-2 bg-[var(--color-accent)]" />
              {group.title}
            </h2>
            <ul className="space-y-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-semibold text-[var(--color-foreground)] hover:text-[var(--color-accent)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-[var(--color-border)]">
        <div className="site-container flex flex-col gap-3 py-6 text-sm text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Bupa Care Careers</p>
          <address className="not-italic">
            {contactEmail ? (
              <a
                href={`mailto:${contactEmail}`}
                className="font-semibold text-[var(--color-foreground)] hover:text-[var(--color-accent)]"
              >
                {contactEmail}
              </a>
            ) : (
              "Contact details will be added before launch"
            )}
          </address>
        </div>

        {typeof window !== "undefined" && window.location.hostname === "localhost" && (
            <div className="border-t border-[var(--color-border)] px-4 py-3 text-center sm:px-0">
              <Link
                href="/admin/offer-letter"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[var(--color-accent-contrast)] bg-[var(--color-accent)] rounded-sm hover:bg-[var(--color-accent-hover)] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Generate offer letter
              </Link>
            </div>
          )}
      </div>
    </footer>
  );
}
