import { SectionHeading } from "@/components/section-heading";
import Link from "next/link";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About Bupa Care Jobs",
  description:
    "Learn how Bupa Care Jobs supports people exploring care opportunities and the application process.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <section className="bg-[var(--color-background)] py-12 sm:py-16">
      <div className="site-container max-w-3xl">
        <SectionHeading
          title="About Bupa Care Jobs"
          headingLevel="h1"
          description="Learn about our mission to support people exploring careers in UK care."
          align="center"
        />

        <div className="mt-10 animate-fade-in-up delay-1">
          <div className="prose text-[var(--color-foreground)] max-w-none space-y-6">
            <p className="text-lg text-[var(--color-muted)]">
              Bupa Care Jobs provides a platform for applicants to explore available care opportunities and take the next
              step towards a career in care.
            </p>
            <p className="text-[var(--color-muted)]">
              Our aim is to make it easier for applicants to discover available opportunities, understand the application
              process and receive guidance on the next steps.
            </p>
          </div>
        </div>

        <div id="what-we-do" className="mt-12 animate-fade-in-up delay-2">
          <SectionHeading title="What We Do" />
          <div className="mt-6 card p-6">
            <p className="text-[var(--color-muted)]">
              We provide access to available care opportunities across different roles and locations for the 2026
              recruitment period.
            </p>
            <p className="mt-4 font-semibold text-[var(--color-foreground)]">Applicants can:</p>
            <ul className="mt-4 space-y-3">
              {[
                "Explore available care jobs",
                "Search opportunities by role or location",
                "Review job information before applying",
                "Complete an application online",
                "Choose an available application plan",
                "Receive guidance on the next steps after submitting an application",
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
        </div>

        <div id="our-approach" className="mt-12 animate-fade-in-up delay-3">
          <SectionHeading title="Our Approach" />
          <div className="mt-6 card p-6">
            <p className="text-[var(--color-muted)]">
              We believe the process of finding a care opportunity should be clear and straightforward. We provide
              applicants with information about available opportunities and guide them through the application process.
            </p>
          </div>
        </div>

        <div id="who-can-apply" className="mt-12 animate-fade-in-up delay-4">
          <SectionHeading title="Who Can Apply?" />
          <div className="mt-6 card p-6">
            <p className="text-[var(--color-muted)]">
              Our platform is for people interested in available care opportunities, including applicants already in the UK
              and those exploring opportunities from overseas.
            </p>
            <p className="mt-4 text-[var(--color-muted)]">
              Applicants are responsible for providing accurate information and completing the application requirements for
              the opportunity they choose.
            </p>
          </div>
        </div>

        <div className="mt-12 animate-fade-in-up delay-5">
          <div className="card p-6 sm:p-8 text-center">
            <h3 className="text-lg font-bold text-[var(--color-foreground)]">Looking for a Care Opportunity?</h3>
            <p className="mt-2 text-[var(--color-muted)]">
              Explore the available opportunities and find a role that matches your experience and interests.
            </p>
            <div className="mt-6">
              <Link
                href="/find-opportunities"
                className="btn-primary px-8 py-3 text-base"
              >
                View available jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}