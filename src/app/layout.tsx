import type { Metadata } from "next";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import { PageShell } from "@/components/page-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Bupa Care Jobs",
    template: "%s | Bupa Care Jobs",
  },
  description: "Find care jobs and start your application with Bupa Care Jobs.",
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
