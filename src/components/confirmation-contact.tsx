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

export function ConfirmationEmail({ contactEmail }: { contactEmail: string }) {
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