import { SectionHeading } from "@/components/section-heading";
import { ContactActions } from "@/components/contact-actions";
import { getContactConfig } from "@/lib/config";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Contact Us",
  description:
    "Contact Bupa Care Jobs through WhatsApp or email for help with care opportunities and the application process.",
  path: "/contact",
});

export default function ContactPage() {
  const { whatsappUsername, email: contactEmail } = getContactConfig();
  const whatsappLink = `https://wa.me/${whatsappUsername}?text=${encodeURIComponent("Hello, I have completed an application and would like help with the next steps.")}`;

  return (
    <section className="bg-[var(--color-background)] py-12 sm:py-16">
      <div className="site-container max-w-3xl">
        <SectionHeading
          title="Contact Us"
          headingLevel="h1"
          description="Need help with your application or have a question about an available care opportunity? Our team is here to support you."
          align="center"
        />

        <ContactActions whatsappLink={whatsappLink} contactEmail={contactEmail} />
      </div>
    </section>
  );
}