"use client";

import { trackWhatsAppClick, trackEmailClick } from "@/lib/analytics";

interface ContactActionsProps {
  whatsappLink: string;
  contactEmail: string;
}

export function ContactActions({ whatsappLink, contactEmail }: ContactActionsProps) {
  return (
    <div className="mt-10 space-y-6">
      <div className="card p-6 sm:p-8 animate-fade-in-up delay-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold text-[var(--color-foreground)]">WhatsApp</h3>
            <p className="mt-2 text-[var(--color-muted)]">
              Chat with our team on WhatsApp for help with your application and next steps.
            </p>
          </div>
          <div className="w-full sm:w-auto">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full sm:w-auto flex-1"
              onClick={() => trackWhatsAppClick("contact_page")}
            >
              Chat with us on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="card p-6 animate-fade-in-up delay-2">
        <h4 className="text-lg font-bold text-[var(--color-foreground)]">Application Support</h4>
        <p className="mt-2 text-[var(--color-muted)]">
          We can help you with questions about:
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            "Available care opportunities",
            "The application process",
            "Your application",
            "Plan information",
            "Next steps after submitting an application",
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-5 h-5 mt-0.5 text-[var(--color-accent)]" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
              <span className="text-[var(--color-muted)]">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-6 border-[var(--color-warning)]/30 bg-[var(--color-warning-soft)] animate-fade-in-up delay-3">
        <h4 className="text-lg font-bold text-[var(--color-foreground)]">Before You Contact Us</h4>
        <p className="mt-2 text-[var(--color-muted)]">
          If you have already submitted an application, please have your application ID available when contacting
          our team. This will help us assist you more efficiently.
        </p>
        <p className="mt-4 text-[var(--color-muted)]">We look forward to helping you with your application.</p>
      </div>

      <div className="card p-6 animate-fade-in-up delay-4">
        <h4 className="text-lg font-bold text-[var(--color-foreground)]">Email</h4>
        <p className="mt-2 text-[var(--color-muted)]">
          Alternatively, you can email us at
          <a href={`mailto:${contactEmail}`} className="text-[var(--color-accent)] hover:underline font-medium ml-1" onClick={() => trackEmailClick("contact_page")}>
            {contactEmail}
          </a>
          .
        </p>
      </div>
    </div>
  );
}