import { Suspense } from "react";
import Link from "next/link";
import { OpportunityResults } from "@/components/opportunity-results";
import { OpportunitySearch } from "@/components/opportunity-search";
import { SectionHeading } from "@/components/section-heading";
import { getOpportunityDirectory } from "@/lib/opportunities";
import { createPageMetadata, opportunityPath } from "@/lib/seo";
import {
  breadcrumbSchema,
  itemListSchema,
  JsonLd,
} from "@/lib/structured-data";
import type { Opportunity } from "@/lib/types";

export const revalidate = 300;

export const metadata = createPageMetadata({
  title: "Find Care Jobs",
  description:
    "Search current care jobs in the UK by role, category, keyword and location. Browse live care assistant, senior carer, nursing and support worker vacancies.",
  path: "/find-opportunities",
});

const BREADCRUMBS = [
  { name: "Home", path: "/" },
  { name: "Find opportunities", path: "/find-opportunities" },
];

export default async function FindOpportunitiesPage() {
  let directory: Awaited<ReturnType<typeof getOpportunityDirectory>> = [];

  try {
    directory = await getOpportunityDirectory();
  } catch {
    // The search UI surfaces its own error state, so an unavailable sheet must
    // not take the page down with it.
    directory = [];
  }

  const slugByOpportunity = new Map<Opportunity, string>(
    directory.map((entry) => [entry.opportunity, entry.slug]),
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema(BREADCRUMBS)} />
      {directory.length > 0 && (
        <JsonLd
          data={itemListSchema(
            directory.map((entry) => entry.opportunity),
            "Care jobs in the UK",
            "/find-opportunities",
            (opportunity) => slugByOpportunity.get(opportunity) ?? "",
          )}
        />
      )}

      <section className="bg-[var(--color-surface-strong)] py-16 sm:py-20">
        <div className="site-container max-w-5xl">
          <SectionHeading
            eyebrow="Find opportunities"
            title="Find available care jobs"
            headingLevel="h1"
            description="Explore available care jobs for the 2026 recruitment period and find an opportunity that matches your experience."
          />
          {/* Both search and results read query params, so they need a
              Suspense boundary once the page itself is a server component. */}
          <Suspense fallback={<div className="mt-10" />}>
            <div className="mt-10 animate-fade-in-up">
              <OpportunitySearch />
            </div>
          </Suspense>
        </div>
      </section>

      {/*
        Server-rendered index of every live role. The interactive list below
        refines this by filter, but crawlers and visitors without JavaScript
        need these links in the initial HTML to reach a job page.
      */}
      {directory.length > 0 && (
        <section
          className="bg-[var(--color-background)] py-12 sm:py-16"
          aria-labelledby="all-opportunities-heading"
        >
          <div className="site-container">
            <p className="section-eyebrow">All roles</p>
            <h2
              id="all-opportunities-heading"
              className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[var(--color-foreground)] sm:text-4xl"
            >
              Current care job openings
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
              Browse every care opportunity currently listed across the UK. Open
              a role to read the full details before you apply.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {directory.map(({ opportunity, slug }) => (
                <li key={slug}>
                  <Link
                    href={opportunityPath(slug)}
                    className="card block h-full p-5 transition-colors hover:border-[var(--color-accent)]"
                  >
                    <span className="text-sm font-bold text-[var(--color-accent)]">
                      {opportunity.category}
                    </span>
                    <span className="mt-2 block text-lg font-bold leading-snug text-[var(--color-foreground)]">
                      {opportunity.title}
                    </span>
                    <span className="mt-2 block text-sm text-[var(--color-muted)]">
                      {opportunity.location} · {opportunity.employmentType}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <Suspense
        fallback={
          <div className="site-container max-w-5xl py-16 text-center text-[var(--color-muted)]">
            Loading opportunities…
          </div>
        }
      >
        <OpportunityResults />
      </Suspense>
    </>
  );
}