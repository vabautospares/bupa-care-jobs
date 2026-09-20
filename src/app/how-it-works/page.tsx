import { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "How it works",
  description: "Understand the step-by-step process to find your next care job opportunity.",
};

const steps = [
  {
    number: 1,
    title: "Search for an opportunity",
    description: "Explore available care jobs by role or location.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    number: 2,
    title: "Review the opportunity",
    description: "Read the job details, requirements and available information.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    number: 3,
    title: "Complete your application",
    description: "Provide your personal, employment and experience details.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    number: 4,
    title: "Choose your plan",
    description: "Select the plan that suits your application and review the Terms & Conditions.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    number: 5,
    title: "Submit and take the next step",
    description: "Submit your application and follow the guidance provided by our team.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    ),
  },
];

export default function HowItWorksPage() {
  return (
    <section className="bg-[var(--color-background)] py-16 sm:py-24">
      <div className="site-container max-w-4xl">
        <SectionHeading
          eyebrow="How it works"
          title="How it works"
          description="Finding a care opportunity and starting your application is simple. Explore available jobs, choose an opportunity that suits you, complete your application and follow the guidance provided after submission."
          align="center"
        />

        <ol className="mt-16 space-y-8" role="list" aria-label="Application steps">
          {steps.map((step, index) => (
            <li key={step.number} className="card relative overflow-hidden group animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-accent-soft)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex gap-6 p-6 sm:p-8">
                <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-accent-contrast)] transition-colors duration-300">
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-[var(--color-accent)] font-montserrat">{step.number}</span>
                    <h3 className="text-xl font-bold text-[var(--color-foreground)]">{step.title}</h3>
                  </div>
                  <p className="mt-3 text-[var(--color-muted)] leading-7">{step.description}</p>
                </div>
                <div className="flex-shrink-0 hidden sm:block w-px h-16 bg-[var(--color-border)] self-center" />
                <div className="flex-shrink-0 sm:hidden w-full h-px bg-[var(--color-border)] my-4" />
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <article className="card p-6 animate-fade-in-up delay-5 hover-elevate">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-warning-soft)] text-[var(--color-warning)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[var(--color-foreground)]">Payment</h3>
            </div>
            <p className="text-[var(--color-muted)]">
              An initial payment of £1,000 applies to the selected plan. Payment is not completed on the website. Our team will provide guidance on the next steps after your application is submitted.
            </p>
          </article>

          <article className="card p-6 animate-fade-in-up delay-6 hover-elevate">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-teal-soft)] text-[var(--color-teal)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[var(--color-foreground)]">Need help?</h3>
            </div>
            <p className="text-[var(--color-muted)]">
              If you need help with your application or the next steps, you can contact our team through WhatsApp or the contact details provided on the website.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}