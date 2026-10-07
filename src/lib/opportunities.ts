import { opportunitySlug } from "@/lib/seo";
import type { Opportunity } from "@/lib/types";

export class OpportunitiesNotConfiguredError extends Error {
  constructor() {
    super("Opportunity search is not configured.");
    this.name = "OpportunitiesNotConfiguredError";
  }
}

export class OpportunitiesUnavailableError extends Error {
  constructor() {
    super("Opportunity search is temporarily unavailable.");
    this.name = "OpportunitiesUnavailableError";
  }
}

export interface OpportunityFilters {
  keyword?: string;
  location?: string;
  category?: string;
}

const normalizeValue = (value: string) => value.trim().toLowerCase();

const parseBoolean = (value?: string) => {
  if (!value) {
    return true;
  }

  return !["false", "no", "0", "inactive"].includes(value.trim().toLowerCase());
};

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const matchesFilter = (value: string, filter?: string) => {
  if (!filter) {
    return true;
  }

  return normalizeValue(value).includes(normalizeValue(filter));
};

const matchesCategory = (opportunity: Opportunity, category?: string) => {
  if (!category) {
    return true;
  }

  return (
    normalizeValue(opportunity.category) === normalizeValue(category) ||
    slugify(opportunity.category) === category.toLowerCase()
  );
};

type RawOpportunity = {
  id?: string;
  title?: string;
  location?: string;
  description?: string;
  category?: string;
  employmentType?: string;
  availability?: string;
  salary?: string;
  datePosted?: string;
  validThrough?: string;
  active?: boolean | string;
};

const normalizeOpportunity = (raw: RawOpportunity): Opportunity | null => {
  const title = (raw.title ?? "").trim();
  const location = (raw.location ?? "").trim();
  const description = (raw.description ?? "").trim();
  const category = (raw.category ?? "").trim();
  const employmentType = (raw.employmentType ?? "").trim();
  const availability = (raw.availability ?? "").trim();
  const salary = (raw.salary ?? "").trim();
  const datePosted = (raw.datePosted ?? "").trim();
  const validThrough = (raw.validThrough ?? "").trim();
  const id = (raw.id ?? "").trim() || slugify(title);
  const active =
    typeof raw.active === "boolean"
      ? raw.active
      : parseBoolean(typeof raw.active === "string" ? raw.active : "");

  if (!title || !location) {
    return null;
  }

  return {
    id,
    title,
    location,
    description: description || "Read the role details and continue to apply for support with the next steps.",
    category: category || "Care roles",
    employmentType: employmentType || "Not specified",
    availability: availability || "Not specified",
    ...(salary ? { salary } : {}),
    ...(datePosted ? { datePosted } : {}),
    ...(validThrough ? { validThrough } : {}),
    active,
  };
};

export async function getOpportunities(
  filters: OpportunityFilters = {},
): Promise<Opportunity[]> {
  const appsScriptUrl = process.env.APPS_SCRIPT_URL?.trim();

  if (!appsScriptUrl) {
    throw new OpportunitiesNotConfiguredError();
  }

  const query = new URLSearchParams();
  if (filters.keyword) query.set("keyword", filters.keyword);
  if (filters.location) query.set("location", filters.location);
  if (filters.category) query.set("category", filters.category);

  const url = `${appsScriptUrl}${query.toString() ? `?${query.toString()}` : ""}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    const body = await response.json();

    if (!response.ok || body?.ok === false || body?.error) {
      const message =
        typeof body?.error === "string"
          ? body.error
          : "Opportunity search is temporarily unavailable.";
      console.error("[getOpportunities] error:", message);
      throw new OpportunitiesUnavailableError();
    }

    const rawOpportunities: RawOpportunity[] = body?.opportunities ?? [];

    return rawOpportunities
      .map(normalizeOpportunity)
      .filter((opportunity): opportunity is Opportunity => Boolean(opportunity))
      .filter((opportunity) => opportunity.active)
      .filter(
        (opportunity) =>
          matchesFilter(opportunity.title, filters.keyword) ||
          matchesFilter(opportunity.description, filters.keyword) ||
          matchesFilter(opportunity.category, filters.keyword) ||
          matchesFilter(opportunity.employmentType, filters.keyword),
      )
      .filter((opportunity) =>
        matchesFilter(opportunity.location, filters.location),
      )
      .filter((opportunity) => matchesCategory(opportunity, filters.category))
      .sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    if (
      error instanceof OpportunitiesNotConfiguredError ||
      error instanceof OpportunitiesUnavailableError
    ) {
      throw error;
    }

    console.error("[getOpportunities] error:", error);
    throw new OpportunitiesUnavailableError();
  }
}

export interface OpportunityDirectoryEntry {
  opportunity: Opportunity;
  slug: string;
}

const POSTING_VALIDITY_DAYS = 60;

const addDays = (date: Date, days: number) =>
  new Date(date.getTime() + days * 24 * 60 * 60 * 1000);

const toIsoDate = (value?: string) => {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  const parsed = new Date(trimmed);

  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

/**
 * Google requires datePosted and validThrough on JobPosting. When the source
 * carries neither, fall back to a single timestamp for the whole batch rather
 * than `new Date()` per row, so a batch of jobs does not drift on every render.
 */
const resolvePostingDates = (
  opportunity: Opportunity,
  fallback: Date,
): Opportunity => {
  if (opportunity.datePosted && opportunity.validThrough) {
    return opportunity;
  }

  const posted = opportunity.datePosted
    ? new Date(opportunity.datePosted)
    : fallback;

  return {
    ...opportunity,
    datePosted: posted.toISOString(),
    validThrough: (
      opportunity.validThrough
        ? new Date(opportunity.validThrough)
        : addDays(posted, POSTING_VALIDITY_DAYS)
    ).toISOString(),
  };
}

export function getPostingDates(
  opportunity: Opportunity,
  fallback: Date,
): { datePosted: string; validThrough: string } {
  const resolved = resolvePostingDates(opportunity, fallback);

  return {
    datePosted: resolved.datePosted ?? fallback.toISOString(),
    validThrough: resolved.validThrough ?? fallback.toISOString(),
  };
}

/**
 * Single source of truth for job URLs. The job pages, the job index and the
 * sitemap all derive slugs from here, so a URL cannot exist in one place and
 * be missing from another.
 */
export async function getOpportunityDirectory(
  filters: OpportunityFilters = {},
): Promise<OpportunityDirectoryEntry[]> {
  const opportunities = await getOpportunities(filters);
  const used = new Map<string, number>();

  return opportunities.map((opportunity) => {
    const base = opportunitySlug(opportunity);
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);

    return {
      opportunity,
      slug: count === 0 ? base : `${base}-${count + 1}`,
    };
  });
}
