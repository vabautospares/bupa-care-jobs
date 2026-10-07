import { AdviceSection } from "@/components/advice-section";
import { CategoryGrid } from "@/components/category-grid";
import { FinalCtaSection } from "@/components/final-cta-section";
import { Hero } from "@/components/hero";
import { IntroSection } from "@/components/intro-section";
import { MissionSection } from "@/components/mission-section";
import { PlansSection } from "@/components/plans-section";
import { ServiceInfoSection } from "@/components/service-info-section";
import { StepsSection } from "@/components/steps-section";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Bupa Care Jobs | Care Careers & Opportunities in the UK",
  description:
    "Explore available care jobs in the UK including care assistant, senior carer, nursing and support worker roles. Find opportunities for the 2026 recruitment period and start your application.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <MissionSection />
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
