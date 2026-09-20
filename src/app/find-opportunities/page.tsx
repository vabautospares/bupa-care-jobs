import { Suspense } from "react";
import type { Metadata } from "next";
import { OpportunityResults } from "@/components/opportunity-results";
import { OpportunitySearch } from "@/components/opportunity-search";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Find opportunities",
  description: "Search care roles by keyword, category and location.",
};

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