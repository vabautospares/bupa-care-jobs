"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Opportunity } from "@/lib/types";
import { jobCategories } from "@/data/homepage";
import { Alert } from "./alert";
import { Button } from "./button";

interface OpportunityResponse {
  opportunities?: Opportunity[];
  error?: string;
}

type ResultsState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; opportunities: Opportunity[] };

const categoryLabel = (category?: string) => {
  if (!category) {
    return undefined;
  }

  return (
    jobCategories.find((item) => item.href.includes(`category=${category}`))
      ?.title ?? category
  );
};

export function OpportunityResults() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const keyword = searchParams.get("keyword")?.trim() ?? "";
  const location = searchParams.get("location")?.trim() ?? "";
  const category = searchParams.get("category")?.trim() ?? "";
  const hasFilters = Boolean(keyword || location || category);
  const [state, setState] = useState<ResultsState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      if (!controller.signal.aborted) {
        setState({ status: "loading" });
      }
    }, 0);

    void fetch(`/api/opportunities${queryString ? `?${queryString}` : ""}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        const body = (await response.json()) as OpportunityResponse;
        if (!response.ok || body.error) {
          throw new Error(
            body.error || "Opportunity search is temporarily unavailable.",
          );
        }
        return body;
      })
      .then((body) => {
        setState({
          status: "success",
          opportunities: body.opportunities ?? [],
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Opportunity search is temporarily unavailable.",
        });
      });

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [queryString]);

  const handleClearFilters = () => {
    window.location.href = "/find-opportunities";
  };

  const handleRemoveCategory = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("category");
    window.location.href = `/find-opportunities?${params.toString()}`;
  };

  const hasActiveCategory = Boolean(category);
  const hasActiveKeyword = Boolean(keyword);
  const hasActiveLocation = Boolean(location);

  return (
    <section className="bg-[var(--color-background)] py-12 sm:py-16" aria-labelledby="opportunities-heading">
      <div className="site-container">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="animate-fade-in-up">
            <p className="section-eyebrow">
              Opportunities
            </p>
            <h2
              id="opportunities-heading"
              className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[var(--color-foreground)] sm:text-4xl"
            >
              {hasFilters ? "Search results" : "Available opportunities"}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
              {hasFilters
                ? "Review the roles that match your search. Change or clear the filters to broaden the results."
                : "Browse the current care roles and use the search above to find a closer match."}
            </p>
          </div>
        {hasFilters && (
          <>
            <Link
              href="/find-opportunities"
              className="btn btn-outline inline-flex items-center gap-2 px-4 py-2 text-sm font-bold"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
              Clear all filters
            </Link>

            {/* Active filters display */}
            <div className="flex flex-wrap gap-2" aria-label="Active filters">
              {hasActiveKeyword && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent-soft)] px-3 py-1.5 text-sm font-medium text-[var(--color-accent)] animate-fade-in">
                  <span>Keyword:</span>
                  <strong>{keyword}</strong>
                  <button
                    type="button"
                    onClick={() => {
                      const params = new URLSearchParams(window.location.search);
                      params.delete("keyword");
                      window.location.href = `/find-opportunities?${params.toString()}`;
                    }}
                    className="ml-1 rounded-full p-0.5 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-contrast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2"
                    aria-label="Remove keyword filter"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </span>
              )}
              {hasActiveLocation && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent-soft)] px-3 py-1.5 text-sm font-medium text-[var(--color-accent)] animate-fade-in delay-1">
                  <span>Location:</span>
                  <strong>{location}</strong>
                  <button
                    type="button"
                    onClick={() => {
                      const params = new URLSearchParams(window.location.search);
                      params.delete("location");
                      window.location.href = `/find-opportunities?${params.toString()}`;
                    }}
                    className="ml-1 rounded-full p-0.5 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-contrast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2"
                    aria-label="Remove location filter"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </span>
              )}
              {hasActiveCategory && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent-soft)] px-3 py-1.5 text-sm font-medium text-[var(--color-accent)] animate-fade-in delay-2">
                  <span>Category:</span>
                  <strong>{categoryLabel(category)}</strong>
                  <button
                    type="button"
                    onClick={handleRemoveCategory}
                    className="ml-1 rounded-full p-0.5 text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-contrast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2"
                    aria-label="Remove category filter"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          </>
        )}

        <div aria-live="polite" className="mt-8">
          {state.status === "loading" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
              {[0, 1, 2].map((item) => (
                <div key={item} className="h-64 animate-pulse rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]" />
              ))}
            </div>
          )}

          {state.status === "error" && (
            <Alert tone="error" title="We could not load opportunities" className="animate-fade-in">
              {state.message} Please check the connection and try again.
            </Alert>
          )}

          {state.status === "success" && state.opportunities.length === 0 && (
            <Alert tone="info" title="No opportunities match this search" className="animate-fade-in">
              <div className="flex flex-col gap-3">
                <p>Try a broader keyword, a nearby location or clear the search to see all available roles.</p>
                <Button variant="secondary" onClick={handleClearFilters} className="w-full sm:w-auto">
                  Clear all filters
                </Button>
              </div>
            </Alert>
          )}

          {state.status === "success" && state.opportunities.length > 0 && (
            <>
              <p className="mb-4 text-sm font-medium text-[var(--color-muted)] animate-fade-in-up">
                {state.opportunities.length} {state.opportunities.length === 1 ? "opportunity" : "opportunities"} found
              </p>
              <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {state.opportunities.map((opportunity, index) => (
                  <li key={opportunity.id} className="animate-fade-in-up" style={{ animationDelay: `${(index % 6) * 100}ms` }}>
                    <article className="card h-full flex flex-col p-6 hover-elevate group">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-[var(--color-accent)]">{opportunity.category}</p>
                          <h3 className="mt-2 text-xl font-bold leading-snug text-[var(--color-foreground)] group-hover:text-[var(--color-accent)] transition-colors">{opportunity.title}</h3>
                        </div>
                        <span className="badge whitespace-nowrap shrink-0">
                          {opportunity.employmentType}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-[var(--color-muted)]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{opportunity.location}</span>
                      </div>
                      <p className="mt-4 flex-1 leading-7 text-[var(--color-foreground)] line-clamp-3">{opportunity.description}</p>
                      <div className="mt-6 flex items-center justify-between gap-3 border-t border-[var(--color-border)] pt-4">
                        <div className="flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span>{opportunity.availability}</span>
                        </div>
                        <Link
                          href={`/apply?role=${encodeURIComponent(opportunity.title)}`}
                          className="btn btn-primary px-4 py-2 text-sm font-bold"
                        >
                          Apply now
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="ml-1 group-hover:translate-x-1 transition-transform">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
    </section>
  );
}