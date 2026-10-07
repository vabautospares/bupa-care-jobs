import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // These pages carry a noindex meta tag on purpose. Leaving them
        // crawlable lets Google see the noindex; disallowing them here as well
        // makes it report "Indexed, though blocked by robots.txt".
        disallow: ["/api/"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}