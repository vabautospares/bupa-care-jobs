import { Suspense } from "react";
import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { jobCategories, SALARY_GUIDANCE_NOTE } from "@/data/homepage";
import { createPageMetadata } from "@/lib/seo";
import { breadcrumbSchema, JsonLd } from "@/lib/structured-data";
import { getOpportunityDirectory } from "@/lib/opportunities";

export const metadata = createPageMetadata({
  title: "Care Careers & Jobs in the UK | Bupa Care Jobs",
  description:
    "Explore UK care career opportunities including Care Assistant, Healthcare Assistant, Support Worker, Senior Care Assistant, Registered Nurse and more. Find roles across the UK and learn how to apply.",
  path: "/care-careers",
});

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Care Careers", path: "/care-careers" },
];

async function LocationsSection() {
  let directory: Awaited<ReturnType<typeof getOpportunityDirectory>> = [];

  try {
    directory = await getOpportunityDirectory();
  } catch {
    directory = [];
  }

  const locations = Array.from(
    new Set(directory.map((entry) => entry.opportunity.location.trim()))
  )
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b))
    .slice(0, 12);

  if (locations.length === 0) {
    return null;
  }

  return (
    <div id="uk-locations" className="mt-12 animate-fade-in-up">
      <SectionHeading title="Care jobs across the UK" />
      <p className="mt-4 text-[var(--color-muted)]">
        Bupa care homes operate across the UK. Explore opportunities in these locations:
      </p>
      <ul className="mt-6 grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" role="list">
        {locations.map((location) => (
          <li key={location}>
            <Link
              href={`/find-opportunities?location=${encodeURIComponent(location)}`}
              className="card flex items-center gap-3 p-4 hover:border-[var(--color-accent)] transition-colors"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="shrink-0 text-[var(--color-accent)]"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="font-medium text-[var(--color-foreground)] truncate">{location}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-[var(--color-muted)]">
        <Link
          href="/find-opportunities"
          className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline underline-offset-2"
        >
          View all locations
        </Link>
        {locations.length > 12 && " — showing a selection of active locations"}
      </p>
    </div>
  );
}

export default async function CareCareersPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema(BREADCRUMBS)} />
      <section className="bg-[var(--color-background)] py-12 sm:py-16">
        <div className="site-container max-w-3xl">
          <SectionHeading
            title="Care Careers"
            headingLevel="h1"
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
              {jobCategories.map((category) => {
                const categorySlug = category.href.split("=")[1] ?? category.title.toLowerCase().replace(/\s+/g, "-");
                const isValidCategory = Boolean(categorySlug && categorySlug !== "other-care-roles");
                const href = isValidCategory ? `/find-opportunities?category=${categorySlug}` : undefined;

                return (
                  <li key={category.title} className="card flex items-start gap-3 p-4">
                    <span aria-hidden="true" className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--color-accent)]" />
                    {href ? (
                      <Link href={href} className="flex flex-1 flex-col gap-1">
                        <span className="font-semibold text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors">{category.title}</span>
                        <span className="mt-1 block text-sm font-bold text-[var(--color-accent-hover)]">{category.salary}</span>
                      </Link>
                    ) : (
                      <span className="flex-1">
                        <span className="font-semibold text-[var(--color-foreground)]">{category.title}</span>
                        <span className="mt-1 block text-sm font-bold text-[var(--color-accent-hover)]">{category.salary}</span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mt-4 text-sm text-[var(--color-muted)]">
              {SALARY_GUIDANCE_NOTE}
            </p>
            <p className="mt-4 text-sm text-[var(--color-muted)]">
              Not every applicant is eligible for every role. Please review the details of each available job before applying.
            </p>
          </div>

          <Suspense fallback={<div className="mt-12 animate-fade-in-up delay-3 h-32 animate-pulse" />}>
            <LocationsSection />
          </Suspense>

          <div id="skills-experience" className="mt-12 animate-fade-in-up delay-3">
            <SectionHeading title="Skills and experience" />
            <div className="card p-6 mt-4">
              <p className="text-[var(--color-muted)]">
                Requirements can vary by opportunity. Applicants should review the details of each available job before applying.
              </p>
            </div>
          </div>

          <div id="sponsorship" className="mt-12 animate-fade-in-up delay-4">
            <SectionHeading title="Visa sponsorship and recruitment support" />
            <div className="mt-4 card p-6 border-[var(--color-accent)]/20 bg-[var(--color-accent-soft)]">
              <p className="text-[var(--color-muted)]">
                Some care roles may offer Certificate of Sponsorship (CoS) support for eligible candidates. Bupa Care Jobs provides
                recruitment coordination and sponsorship administration through structured support terms.
              </p>
              <p className="mt-4 text-[var(--color-muted)]">
                The company service fee covers recruitment coordination and Certificate of Sponsorship administration. UK government
                and third-party immigration costs are quoted separately. A Certificate of Sponsorship does not guarantee employment
                or visa approval.
              </p>
              <div className="mt-6">
                <Link href="/recruitment-process" className="btn btn-primary px-6 py-3">
                  Learn about recruitment support
                </Link>
              </div>
            </div>
          </div>

          <div id="finding-opportunities" className="mt-12 animate-fade-in-up delay-5">
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

          <div id="how-to-apply" className="mt-12 animate-fade-in-up delay-6">
            <SectionHeading title="How to apply" />
            <p className="mt-4 text-[var(--color-muted)]">
              Search the available opportunities, open the role that suits you, complete your application, choose your recruitment
              support term, accept the Terms & Conditions and submit. Our recruitment process page walks through each of these
              steps in detail, including what to gather before you start and what happens after you submit.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <Link href="/recruitment-process" className="btn btn-outline px-8 py-3 text-base">
                See our recruitment process
              </Link>
              <Link href="/faqs" className="btn btn-outline px-8 py-3 text-base">
                Frequently asked questions
              </Link>
            </div>
            <div className="mt-6 card p-4 border-[var(--color-warning)]/30 bg-[var(--color-warning-soft)]">
              <p className="text-sm text-[var(--color-warning)]">
                Our team will guide you through the application review and next steps after you apply.
              </p>
            </div>
          </div>

          <div className="mt-12 animate-fade-in-up delay-7">
            <SectionHeading title="Need help?" />
            <p className="mt-4 text-center text-[var(--color-muted)]">
              Can&rsquo;t find what you&rsquo;re looking for? Contact the resourcing team for support with your application.
            </p>
            <div className="mt-6 text-center">
              <Link href="/contact" className="btn btn-primary px-8 py-3 text-base">
                Contact the team
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}