import type { Metadata } from "next";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import { Suspense } from "react";
import { GoogleAnalytics } from "@/components/google-analytics";
import { PageShell } from "@/components/page-shell";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { getContactConfig } from "@/lib/config";
import { siteName, siteUrl, socialImageUrl } from "@/lib/seo";
import {
  organizationSchema,
  websiteSchema,
  JsonLd,
} from "@/lib/structured-data";
import "./globals.css";

const SITE_DESCRIPTION =
  "Explore available care jobs in the UK including care assistant, senior carer, nursing and support worker roles. Find opportunities for the 2026 recruitment period and start your application.";

export const metadata: Metadata = {
  title: {
    default: "Bupa Care Jobs | Care Careers & Opportunities in the UK",
    template: "%s | Bupa Care Jobs",
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(siteUrl),
  // No canonical here on purpose. A root-level canonical is inherited by every
  // page that does not set its own, which silently points new pages at the
  // homepage and gets them deindexed. Each page declares its own instead.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    "other": [{ url: "/site.webmanifest", type: "application/json" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Bupa Care Jobs | Care Careers & Opportunities in the UK",
    description: SITE_DESCRIPTION,
    url: siteUrl,
    siteName,
    type: "website",
    locale: "en_GB",
    images: [
      {
        url: socialImageUrl,
        secureUrl: socialImageUrl,
        width: 1200,
        height: 630,
        alt: "Bupa Care Jobs - Explore care careers and job opportunities in the UK",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bupa Care Jobs | Care Careers & Opportunities in the UK",
    description: SITE_DESCRIPTION,
    images: [socialImageUrl],
  },
  other: {
    "format-detection": "telephone=no",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const measurementId = (
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID as string | undefined
  )?.trim();

  return (
    <html lang="en-GB">
      <head>
        {measurementId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${measurementId}', { send_page_view: false });`,
              }}
            />
          </>
        )}
        <JsonLd data={websiteSchema()} />
        <JsonLd data={organizationSchema()} />
      </head>
      <body>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <PageShell>{children}</PageShell>
        <FloatingWhatsApp />
      </body>
    </html>
  );
}

function FloatingWhatsApp() {
  const { whatsappUsername } = getContactConfig();
  if (!whatsappUsername) return null;

  const href = `https://wa.me/${whatsappUsername}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <WhatsAppButton href={href} label="Need help?" location="floating" />
    </div>
  );
}
