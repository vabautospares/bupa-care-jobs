import { getContactConfig } from "@/lib/config";
import { absoluteUrl, siteName, siteUrl } from "@/lib/seo";
import type { Opportunity } from "@/lib/types";

export interface BreadcrumbEntry {
  name: string;
  path: string;
}

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Serialises JSON-LD safely. `<` is escaped so a stray angle bracket in job
 * copy can never terminate the script tag early and break the page.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

const SCHEMA_CONTEXT = "https://schema.org";

const contactPoint = () => {
  try {
    const { email, whatsappNumber } = getContactConfig();

    return {
      "@type": "ContactPoint",
      contactType: "customer support",
      email,
      ...(whatsappNumber
        ? {
            telephone: `+${whatsappNumber.replace(/\D/g, "")}`,
            contactOption: "TollFree",
            areaServed: "GB",
            availableLanguage: "English",
          }
        : {}),
    };
  } catch {
    return undefined;
  }
};

export function organizationSchema() {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: siteName,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/bupalogo.png"),
    },
    image: absoluteUrl("/og-image.png"),
    description:
      "A UK platform for exploring care job opportunities, including care assistant, senior carer, nursing and support worker roles.",
    areaServed: {
      "@type": "Country",
      name: "United Kingdom",
    },
    ...(contactPoint() ? { contactPoint: contactPoint() } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteName,
    url: siteUrl,
    inLanguage: "en-GB",
    publisher: { "@id": `${siteUrl}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/find-opportunities?keyword={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(entries: BreadcrumbEntry[]) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: absoluteUrl(entry.path),
    })),
  };
}

export function faqSchema(
  faqs: ReadonlyArray<{ question: string; answer: string }>,
) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        // Answers are authored with light markdown for on-page rendering; schema
        // needs plain text or the rich result is rejected.
        text: faq.answer
          .replace(/\*\*/g, "")
          .replace(/\*/g, "")
          .replace(/\n{2,}/g, "\n")
          .trim(),
      },
    })),
  };
}

const EMPLOYMENT_TYPE_MAP: Record<string, string> = {
  "full-time": "FULL_TIME",
  "full time": "FULL_TIME",
  fulltime: "FULL_TIME",
  "part-time": "PART_TIME",
  "part time": "PART_TIME",
  parttime: "PART_TIME",
  contract: "CONTRACTOR",
  temporary: "TEMPORARY",
  apprenticeship: "APPRENTICESHIP",
  internship: "INTERN",
};

const toEmploymentType = (value: string) => {
  const key = value.trim().toLowerCase();

  if (EMPLOYMENT_TYPE_MAP[key]) {
    return EMPLOYMENT_TYPE_MAP[key];
  }

  if (key.includes("full")) {
    return "FULL_TIME";
  }

  if (key.includes("part")) {
    return "PART_TIME";
  }

  // Google requires one of its enum values, so fall back rather than emit
  // free text that would fail validation.
  return "OTHER";
};

const REMOTE_LOCATION_PATTERN = /nationwide|remote|uk[- ]?wide|anywhere/i;

const jobLocation = (location: string) => {
  if (REMOTE_LOCATION_PATTERN.test(location)) {
    return {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "GB",
      },
    };
  }

  return {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: location,
      addressCountry: "GB",
    },
  };
};

export function jobPostingSchema(
  opportunity: Opportunity,
  { datePosted, validThrough }: { datePosted: string; validThrough?: string },
) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "JobPosting",
    title: opportunity.title,
    description: opportunity.description,
    datePosted,
    ...(validThrough ? { validThrough } : {}),
    employmentType: toEmploymentType(opportunity.employmentType),
    hiringOrganization: { "@id": `${siteUrl}/#organization` },
    jobLocation: jobLocation(opportunity.location),
    ...(opportunity.category
      ? { occupationalCategory: opportunity.category }
      : {}),
  };
}

export function itemListSchema(
  opportunities: Opportunity[],
  name: string,
  path: string,
  slugFor: (opportunity: Opportunity) => string,
) {
  return {
    "@context": SCHEMA_CONTEXT,
    "@type": "ItemList",
    name,
    url: absoluteUrl(path),
    numberOfItems: opportunities.length,
    itemListElement: opportunities.map((opportunity, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/care-jobs/${slugFor(opportunity)}`),
      name: opportunity.title,
    })),
  };
}
