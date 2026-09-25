import { Suspense } from "react";
import { OpportunityResults } from "@/components/opportunity-results";
import { OpportunitySearch } from "@/components/opportunity-search";
import { SectionHeading } from "@/components/section-heading";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Find Care Jobs",
  description:
    "Search current care opportunities by role, category, keyword and location on Bupa Care Jobs.",
  path: "/find-opportunities",
});

export default function FindOpportunitiesPage() {
  return (
    <Suspense
      fallback={
        <div className="site-container max-w-5xl py-16 text-center text-[var(--color-muted)]">
          Loading opportunities…
        </div>
      }
    >
      <section className="bg-[var(--color-surface-strong)] py-16 sm:py-20">
        <div className="site-container max-w-5xl">
          <SectionHeading
            eyebrow="Find opportunities"
            title="Find available care jobs"
            headingLevel="h1"
            description="Explore available care jobs for the 2026 recruitment period and find an opportunity that matches your experience."
          />
          <div className="mt-10 animate-fade-in-up">
            <OpportunitySearch />
          </div>
        </div>
      </section>
      <OpportunityResults />
    </Suspense>
  );
}