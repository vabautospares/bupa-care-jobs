import { AdviceSection } from "@/components/advice-section";
import { CategoryGrid } from "@/components/category-grid";
import { FinalCtaSection } from "@/components/final-cta-section";
import { Hero } from "@/components/hero";
import { IntroSection } from "@/components/intro-section";
import { PlansSection } from "@/components/plans-section";
import { ServiceInfoSection } from "@/components/service-info-section";
import { StepsSection } from "@/components/steps-section";

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
