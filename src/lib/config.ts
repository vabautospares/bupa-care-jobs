import type { ContactConfig } from "@/lib/types";

export function getContactConfig(): ContactConfig {
  const whatsappNumber = process.env.WHATSAPP_NUMBER?.trim();
  const whatsappUsername = process.env.WHATSAPP_USERNAME?.trim() || "bupacareers";
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

  if (!email) {
    throw new Error("Contact configuration is incomplete.");
  }

  return {
    whatsappNumber: whatsappNumber || "",
    whatsappUsername,
    email,
  };
}

export function getTermsVersion(): string {
  return process.env.TERMS_VERSION?.trim() || "0.1-placeholder";
}
