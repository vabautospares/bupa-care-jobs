import type { Metadata } from "next";

const PRODUCTION_SITE_URL = "https://www.bupacareers.site";

const normaliseSiteUrl = (value?: string) => {
  const candidate = value?.trim();

  if (!candidate) {
    return undefined;
  }

  try {
    const parsed = new URL(candidate);

    // A dev/preview host must never leak into canonicals, sitemaps or JSON-LD,
    // otherwise Google indexes whatever environment happened to render the page.
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
      return undefined;
    }

    return parsed.origin;
  } catch {
    return undefined;
  }
};

export const siteUrl =
  normaliseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ?? PRODUCTION_SITE_URL;
export const socialImageUrl = `${siteUrl}/og-image.png`;
export const siteName = "Bupa Care Jobs";

export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/**
 * Job URLs read better with the location in them, which also stops two
 * same-titled roles in different cities collapsing onto one URL.
 */
export function opportunitySlug(opportunity: {
  title: string;
  location: string;
}): string {
  const title = slugify(opportunity.title);
  const location = slugify(opportunity.location);

  return location ? `${title}-${location}` : title;
}

export const opportunityPath = (slug: string) => `/care-jobs/${slug}`;

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const canonicalUrl = absoluteUrl(path);
  const imageAlt = `${title} | ${siteName}`;

  // Always emit robots. Returning `undefined` here dropped the layout's
  // googleBot directives, so no indexable page was publishing
  // max-image-preview / max-snippet at all.
  const robots = {
    index: !noIndex,
    follow: true,
    googleBot: {
      index: !noIndex,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  } as const;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName,
      type: "website",
      locale: "en_GB",
      images: [
        {
          url: socialImageUrl,
          secureUrl: socialImageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImageUrl],
    },
  };
}