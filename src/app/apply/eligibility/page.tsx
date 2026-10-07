import { Suspense } from "react";
import { ApplicantTypePicker } from "@/components/applicant-type-picker";
import { createPageMetadata } from "@/lib/seo";
import { SectionHeading } from "@/components/section-heading";

export const metadata = createPageMetadata({
  title: "Start your application",
  description:
    "Choose your applicant type to begin your Bupa Care Jobs application.",
  path: "/apply/eligibility",
  noIndex: true,
});

export default function EligibilityPage() {
  return (
    <section className="bg-[var(--color-background)] py-12 sm:py-16 animate-fade-in">
      <div className="site-container max-w-3xl">
        <div className="card p-6 sm:p-8 lg:p-10">
          <SectionHeading
            headingLevel="h1"
            align="center"
            title="Start your application"
            description="Choose the option that best describes your situation. Applicants from all countries are welcome."
          />

          <div className="mt-10 animate-fade-in-up">
            <p className="text-center text-lg text-[var(--color-muted)] mb-8">
              Bupa Care Jobs supports people exploring care opportunities across the UK and internationally.
              Tell us about your status so we can tailor your application.
            </p>

            <Suspense fallback={<div className="grid gap-4 sm:grid-cols-3">{[1,2,3].map(i=><div key={i} className="h-32 animate-pulse rounded-sm bg-[var(--color-surface)]" />)}</div>}>
              <ApplicantTypePicker />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
