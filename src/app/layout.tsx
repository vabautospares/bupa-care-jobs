import type { Metadata } from "next";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import { PageShell } from "@/components/page-shell";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const ogImageUrl = `${siteUrl.replace("http:", "https:")}/bupalogo.png`;

export const metadata: Metadata = {
  title: {
    default: "Bupa Care Jobs",
    template: "%s | Bupa Care Jobs",
  },
  description: "Find care jobs and start your application with Bupa Care Jobs.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Bupa Care Jobs",
    description: "Find care jobs and start your application with Bupa Care Jobs.",
    url: siteUrl,
    siteName: "Bupa Care Jobs",
    type: "website",
    locale: "en_GB",
    images: [
      {
        url: ogImageUrl,
        secureUrl: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Bupa Care Jobs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bupa Care Jobs",
    description: "Find care jobs and start your application with Bupa Care Jobs.",
    images: [ogImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PageShell>{children}</PageShell>
      </body>
    </html>
  );
}
