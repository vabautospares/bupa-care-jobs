import type { MetadataRoute } from "next";
import { getOpportunityDirectory } from "@/lib/opportunities";
import { absoluteUrl, opportunityPath } from "@/lib/seo";

export const revalidate = 300;

interface StaticRoute {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}

const STATIC_ROUTES: StaticRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/find-opportunities", changeFrequency: "daily", priority: 0.9 },
  { path: "/care-careers", changeFrequency: "monthly", priority: 0.8 },
  { path: "/recruitment-process", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about", changeFrequency: "monthly", priority: 0.6 },
  { path: "/faqs", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/accessibility", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let jobEntries: MetadataRoute.Sitemap = [];

  try {
    const directory = await getOpportunityDirectory();

    jobEntries = directory.map(({ opportunity, slug }) => ({
      url: absoluteUrl(opportunityPath(slug)),
      lastModified: opportunity.datePosted
        ? new Date(opportunity.datePosted)
        : now,
      changeFrequency: "daily",
      priority: 0.8,
    }));
  } catch (error) {
    // Never fail the sitemap over a sheet outage; the static routes still
    // need to reach Google.
    console.error("[sitemap] could not load opportunities:", error);
  }

  return [...staticEntries, ...jobEntries].sort(
    (a, b) => (b.priority ?? 0) - (a.priority ?? 0),
  );
}