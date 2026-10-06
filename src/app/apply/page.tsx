import { Suspense } from "react";
import { ApplicationForm } from "@/components/application-form";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Apply for a Care Job",
  description:
    "Start an application for a care opportunity through Bupa Care Jobs.",
  path: "/apply",
  noIndex: true,
});

const APPLICANT_LABELS: Record<string, string> = {
  "uk-citizen": "UK citizen",
  "uk-student-visa": "UK student with a visa",
  overseas: "Overseas applicant (all countries welcome)",
};

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ applicant?: string }>;
}) {
  const params = await searchParams;
  const applicantLabel = params.applicant ? APPLICANT_LABELS[params.applicant] : undefined;

  return (
    <section className="bg-[var(--color-background)] py-12 sm:py-16 animate-fade-in">
      <div className="site-container max-w-3xl">
        <div className="card p-6 sm:p-8 lg:p-10">
          <Suspense
            fallback={
              <div className="space-y-6" aria-busy="true">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-sm bg-[var(--color-surface)]" />
                ))}
              </div>
            }
          >
            <h1 className="sr-only">Apply for a care opportunity</h1>
            <ApplicationForm applicantTypeLabel={applicantLabel} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}