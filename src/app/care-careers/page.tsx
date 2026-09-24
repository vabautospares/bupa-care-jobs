import { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import Link from "next/link";
import { jobCategories } from "@/data/homepage";

export const metadata: Metadata = {
  title: "Care Careers | Bupa Care Jobs",
  description: "Explore care career opportunities, roles, and how to apply for care jobs in the UK.",
};

export default function CareCareersPage() {
  return (
    <section className="bg-[var(--color-background)] py-12 sm:py-16">
      <div className="site-container max-w-3xl">
        <SectionHeading
          title="Care Careers"
          description="A career in care can be rewarding, meaningful and full of opportunities. Explore available roles and take the next step in your career."
          align="center"
        />

        <div id="why-care" className="mt-12 animate-fade-in-up delay-1">
          <SectionHeading eyebrow="Why work in care" title="Why work in care" />
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {[
              { title: "Make a difference", description: "Care work gives you the opportunity to support people and make a positive difference in their lives." },
              { title: "Develop your skills", description: "Working in care can help you develop valuable practical, communication and people skills." },
              { title: "Work with people", description: "Care roles involve working with people and supporting their wellbeing and everyday needs." },
              { title: "Explore different career opportunities", description: "The care sector includes a range of roles and working environments." },
            ].map((item, index) => (
              <div key={item.title} className="card p-6 animate-fade-in-up" style={{ animationDelay: `${200 + index * 100}ms` }}>
                <h3 className="text-lg font-bold text-[var(--color-foreground)]">{item.title}</h3>
                <p className="mt-2 text-[var(--color-muted)]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="care-roles" className="mt-12 animate-fade-in-up delay-2">
          <SectionHeading title="Types of care roles" />
          <p className="mt-4 text-[var(--color-muted)]">
            Care opportunities can include different roles depending on experience, qualifications and the requirements of each opportunity.
          </p>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {jobCategories.map((category) => (
              <li key={category.title} className="card p-4 flex items-center gap-3">
                <span aria-hidden="true" className="h-2.5 w-2.5 bg-[var(--color-accent)] rounded-full shrink-0" />
                <span className="font-semibold text-[var(--color-foreground)]">{category.title}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            Not every applicant is eligible for every role. Please review the details of each available job before applying.
          </p>
        </div>

        <div id="skills-experience" className="mt-12 animate-fade-in-up delay-3">
          <SectionHeading title="Skills and experience" />
          <div className="card p-6 mt-4">
            <p className="text-[var(--color-muted)]">
              Requirements can vary by opportunity. Applicants should review the details of each available job before applying.
            </p>
          </div>
        </div>

        <div id="finding-opportunities" className="mt-12 animate-fade-in-up delay-4">
          <SectionHeading title="Finding opportunities" />
          <p className="mt-4 text-[var(--color-muted)]">
            Explore available care jobs for the 2026 recruitment period and find an opportunity that matches your experience.
          </p>
          <div className="mt-6 text-center">
            <Link href="/find-opportunities" className="btn-primary px-8 py-3 text-base">
              View available jobs
            </Link>
          </div>
        </div>

        <div id="how-to-apply" className="mt-12 animate-fade-in-up delay-5">
          <SectionHeading title="How to apply" />
          <ol className="mt-6 space-y-3">
            {[
              "Find an available care job.",
              "Review the opportunity details.",
              "Start your application.",
              "Complete your personal, employment and experience details.",
              "Choose your recruitment support term.",
              "Review and accept the Terms & Conditions.",
              "Submit your application.",
              "Follow the guidance provided after submission.",
            ].map((step, index) => (
              <li key={index} className="card p-4 flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent-hover)] text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <span className="text-[var(--color-muted)] pt-1">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 card p-4 border-[var(--color-warning)]/30 bg-[var(--color-warning-soft)]">
            <p className="text-sm text-[var(--color-warning)]">
              A deposit of £1,000 is due before application review. The remaining balance is payable in agreed instalments after employment starts. Payment is not completed on the website. Our team will guide you through the next steps, including payment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}