import { Metadata } from "next";
import { AdviceSection } from "@/components/advice-section";
import { CategoryGrid } from "@/components/category-grid";
import { FinalCtaSection } from "@/components/final-cta-section";
import { Hero } from "@/components/hero";
import { IntroSection } from "@/components/intro-section";
import { PlansSection } from "@/components/plans-section";
import { ServiceInfoSection } from "@/components/service-info-section";
import { StepsSection } from "@/components/steps-section";

export const metadata: Metadata = {
  title: "Bupa Care Jobs | Care Careers & Opportunities in the UK",
  description:
    "Explore available care jobs in the UK including care assistant, senior carer, nursing and support worker roles. Find opportunities for the 2026 recruitment period and start your application.",
  alternates: {
    canonical: "https://www.bupacareers.site/",
  },
  openGraph: {
    title: "Bupa Care Jobs | Care Careers & Opportunities in the UK",
    description:
      "Explore available care jobs in the UK including care assistant, senior carer, nursing and support worker roles. Find opportunities for the 2026 recruitment period and start your application.",
    url: "https://www.bupacareers.site/",
    siteName: "Bupa Care Jobs",
    type: "website",
    locale: "en_GB",
    images: [
      {
        url: "https://www.bupacareers.site/og-image.png",
        secureUrl: "https://www.bupacareers.site/og-image.png",
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
    images: ["https://www.bupacareers.site/og-image.png"],
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <IntroSection />
      <StepsSection />
      <CategoryGrid />
      <ServiceInfoSection />
      <PlansSection />
      <AdviceSection />
      <FinalCtaSection />
    </>
  );
}
