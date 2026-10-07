"use client";

import { trackWhatsAppClick, trackEmailClick } from "@/lib/analytics";

interface ConfirmationContactProps {
  whatsAppLink: string | null;
}

export function ConfirmationContact({ whatsAppLink }: ConfirmationContactProps) {
  if (whatsAppLink) {
    return (
      <>
        <a
          href={whatsAppLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick("confirmation_page")}
          className="btn btn-primary w-full sm:w-auto flex-1 px-6 py-4 text-lg"
        >
          Follow up on WhatsApp
        </a>
      </>
    );
  }

  return (
    <>
      <a
        href="/contact"
        className="text-[var(--color-accent)] hover:underline"
      >
        contact us
      </a>
      {" for next steps, or check back later."}
    </>
  );
}

export function ConfirmationEmail({ contactEmail, asButton = false }: { contactEmail: string; asButton?: boolean }) {
  if (asButton) {
    return (
      <a
        href={`mailto:${contactEmail}`}
        onClick={() => trackEmailClick("confirmation_page")}
        className="inline-flex items-center justify-center gap-2 px-5 py-3 font-bold text-base text-white bg-[var(--color-accent)] rounded-sm shadow-md hover:bg-[var(--color-accent-hover)] hover:shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2"
      >
        <EmailIcon className="w-5 h-5" />
        Email us
      </a>
    );
  }

  return (
    <a
      href={`mailto:${contactEmail}`}
      className="text-[var(--color-accent)] hover:underline font-medium"
      onClick={() => trackEmailClick("confirmation_page")}
    >
      {contactEmail}
    </a>
  );
}

function EmailIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13 2 4" />
    </svg>
  );
}