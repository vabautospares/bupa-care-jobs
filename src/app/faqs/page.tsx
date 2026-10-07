import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { faqs } from "@/data/faqs";
import { createPageMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqSchema, JsonLd } from "@/lib/structured-data";

export const metadata = createPageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers about care opportunities, applications, recruitment support and next steps through Bupa Care Jobs.",
  path: "/faqs",
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "FAQs", path: "/faqs" },
];

export default function FaqsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={faqSchema(faqs)} />

      <section className="bg-[var(--color-background)] py-12 sm:py-16">
        <div className="site-container max-w-3xl">
          <SectionHeading
            title="Frequently Asked Questions"
            headingLevel="h1"
            description="Find answers to common questions about finding care opportunities, applying and taking the next step."
            align="center"
          />

          <div className="mt-12 space-y-4" role="list">
            {faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="card p-6 group animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
                role="listitem"
              >
                <summary className="flex cursor-pointer items-center justify-between list-none text-base font-semibold text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 rounded-md">
                  {faq.question}
                  <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center transition-transform group-open:rotate-180 text-[var(--color-muted)]" aria-hidden="true">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-4 text-[var(--color-muted)] whitespace-pre-line leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>

          <p className="mt-10 text-center">
            <Link href="/contact" className="btn btn-outline px-8 py-3">
              Contact the team
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}