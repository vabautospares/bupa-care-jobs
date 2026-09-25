import type { Metadata } from "next";

export const siteUrl = "https://www.bupacareers.site";
export const socialImageUrl = `${siteUrl}/og-image.png`;

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
  const canonicalUrl = path === "/" ? siteUrl : `${siteUrl}${path}`;
  const imageAlt = `${title} | Bupa Care Jobs`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots: noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Bupa Care Jobs",
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