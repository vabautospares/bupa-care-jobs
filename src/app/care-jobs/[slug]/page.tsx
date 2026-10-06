import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/section-heading";
import { jobCategories, SALARY_GUIDANCE_NOTE } from "@/data/homepage";
import {
  getOpportunityDirectory,
  getPostingDates,
} from "@/lib/opportunities";
import { createPageMetadata, opportunityPath } from "@/lib/seo";
import {
  breadcrumbSchema,
  jobPostingSchema,
  JsonLd,
} from "@/lib/structured-data";
import type { Opportunity } from "@/lib/types";

export const revalidate = 300;
// `dynamicParams` lets a newly listed role appear before the next deploy.
export const dynamicParams = true;

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const categoryLabel = (category?: string) => {
  if (!category) {
    return undefined;
  }

  const key = slugify(category);

  return (
    jobCategories.find((item) => slugify(item.title) === key)?.title ?? category
  );
};

const categorySalary = (opportunity: Opportunity) => {
  if (opportunity.salary) {
    return opportunity.salary;
  }

  const key = slugify(opportunity.category);

  if (!key) {
    return undefined;
  }

  return jobCategories.find((item) => slugify(item.title) === key)?.salary;
};

const loadDirectory = async () => {
  try {
    return await getOpportunityDirectory();
  } catch {
    // A sheet outage should 404 the job page rather than surface a stack trace.
    return [];
  }
};

export async function generateStaticParams() {
  const directory = await loadDirectory();

  return directory.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const directory = await loadDirectory();
  const entry = directory.find((item) => item.slug === slug);

  if (!entry) {
    return {};
  }

  const { opportunity } = entry;
  const location = opportunity.location.toLowerCase();
  const title = `${opportunity.title} Jobs in ${opportunity.location} | Care Jobs UK`;
  const description = `${opportunity.title} opportunity in ${opportunity.location}. ${opportunity.employmentType} care role at ${opportunity.employmentType === "Full-time" ? "full" : "flexible"} hours. ${opportunity.description}`.slice(
    0,
    300,
  );

  return {
    ...createPageMetadata({
      title,
      description,
      path: opportunityPath(slug),
    }),
    keywords: [
      `${opportunity.title.toLowerCase()} jobs`,
      `${opportunity.title.toLowerCase()} jobs ${location}`,
      "care jobs UK",
      "care work UK",
    ],
  };
}

export default async function CareJobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const directory = await loadDirectory();
  const entry = directory.find((item) => item.slug === slug);

  if (!entry) {
    notFound();
  }

  const { opportunity } = entry;
  const salary = categorySalary(opportunity);
  const label = categoryLabel(opportunity.category);
  const applyHref = `/apply/eligibility?role=${encodeURIComponent(opportunity.title)}`;

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Find opportunities", path: "/find-opportunities" },
    { name: opportunity.title, path: opportunityPath(slug) },
  ];

  const related = directory
    .filter(
      (candidate) =>
        candidate.slug !== slug &&
        candidate.opportunity.category === opportunity.category,
    )
    .slice(0, 3);

  // getOpportunities() resolves both dates from the sheet's own modified time,
  // so they are stable between renders. The constant is only a guard for data
  // that predates the column.
  const FALLBACK_POSTING_DATE = "2026-01-01T00:00:00.000Z";
  const { datePosted, validThrough } = getPostingDates(
    opportunity,
    new Date(FALLBACK_POSTING_DATE),
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={jobPostingSchema(opportunity, { datePosted, validThrough })} />

      <article className="bg-[var(--color-background)] py-12 sm:py-16">
        <div className="site-container max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-muted)]">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.path} className="flex items-center gap-2">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-[var(--color-border)]">
                      /
                    </span>
                  )}
                  {index === breadcrumbs.length - 1 ? (
                    <span aria-current="page" className="font-semibold text-[var(--color-foreground)]">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link href={crumb.path} className="hover:text-[var(--color-accent)]">
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <SectionHeading
            eyebrow={label ?? "Care opportunity"}
            title={`${opportunity.title} in ${opportunity.location}`}
            headingLevel="h1"
          />

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="card p-5">
              <dt className="text-sm font-bold uppercase tracking-wide text-[var(--color-muted)]">
                Location
              </dt>
              <dd className="mt-1 text-lg font-semibold text-[var(--color-foreground)]">
                {opportunity.location}
              </dd>
            </div>
            <div className="card p-5">
              <dt className="text-sm font-bold uppercase tracking-wide text-[var(--color-muted)]">
                Employment type
              </dt>
              <dd className="mt-1 text-lg font-semibold text-[var(--color-foreground)]">
                {opportunity.employmentType}
              </dd>
            </div>
            <div className="card p-5">
              <dt className="text-sm font-bold uppercase tracking-wide text-[var(--color-muted)]">
                Availability
              </dt>
              <dd className="mt-1 text-lg font-semibold text-[var(--color-foreground)]">
                {opportunity.availability}
              </dd>
            </div>
            <div className="card p-5">
              <dt className="text-sm font-bold uppercase tracking-wide text-[var(--color-muted)]">
                Indicative pay
              </dt>
              <dd className="mt-1 text-lg font-semibold text-[var(--color-accent-hover)]">
                {salary ?? "Confirmed by the employer"}
              </dd>
            </div>
          </dl>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
              About this role
            </h2>
            <p className="mt-4 leading-8 text-[var(--color-muted)]">
              {opportunity.description}
            </p>
            <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">
              {SALARY_GUIDANCE_NOTE}
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href={applyHref} className="btn btn-primary px-8 py-3 text-base">
              Apply for this job
            </Link>
            <Link
              href="/find-opportunities"
              className="btn btn-outline px-8 py-3 text-base"
            >
              View all opportunities
            </Link>
          </div>

          {related.length > 0 && (
            <section className="mt-14" aria-labelledby="related-heading">
              <h2
                id="related-heading"
                className="text-2xl font-bold text-[var(--color-foreground)]"
              >
                Similar opportunities
              </h2>
              <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                {related.map(({ opportunity: item, slug: itemSlug }) => (
                  <li key={itemSlug}>
                    <Link
                      href={opportunityPath(itemSlug)}
                      className="card block h-full p-5 transition-colors hover:border-[var(--color-accent)]"
                    >
                      <span className="block text-base font-bold text-[var(--color-foreground)]">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-sm text-[var(--color-muted)]">
                        {item.location}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>
    </>
  );
}