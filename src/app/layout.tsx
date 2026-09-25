import type { Metadata } from "next";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import { Suspense } from "react";
import { GoogleAnalytics } from "@/components/google-analytics";
import { PageShell } from "@/components/page-shell";
import { siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Bupa Care Jobs | Care Careers & Opportunities in the UK",
    template: "%s | Bupa Care Jobs",
  },
  description:
    "Explore available care jobs in the UK including care assistant, senior carer, nursing and support worker roles. Find opportunities for the 2026 recruitment period and start your application.",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
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
    other: [{ url: "/site.webmanifest", type: "application/json" }],
  },
  openGraph: {
    title: "Bupa Care Jobs | Care Careers & Opportunities in the UK",
    description:
      "Explore available care jobs in the UK including care assistant, senior carer, nursing and support worker roles. Find opportunities for the 2026 recruitment period and start your application.",
    url: siteUrl,
    siteName: "Bupa Care Jobs",
    type: "website",
    locale: "en_GB",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        secureUrl: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Bupa Care Jobs - Explore care careers and job opportunities in the UK",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bupa Care Jobs | Care Careers & Opportunities in the UK",
    description:
      "Explore available care jobs in the UK including care assistant, senior carer, nursing and support worker roles. Find opportunities for the 2026 recruitment period and start your application.",
    images: [`${siteUrl}/og-image.png`],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Bupa Care Jobs",
              url: siteUrl,
              description:
                "Explore available care jobs in the UK including care assistant, senior carer, nursing and support worker roles. Find opportunities for the 2026 recruitment period and start your application.",
              inLanguage: "en-GB",
              publisher: {
                "@type": "Organization",
                name: "Bupa Care Jobs",
                url: siteUrl,
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Bupa Care Jobs",
              url: siteUrl,
              logo: `${siteUrl}/bupalogo.png`,
            }),
          }}
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
