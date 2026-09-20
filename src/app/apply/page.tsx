import { Suspense } from "react";
import { Metadata } from "next";
import { ApplicationForm } from "@/components/application-form";

export const metadata: Metadata = {
  title: "Apply",
  description: "Submit your application for a care job opportunity.",
};

export default function ApplyPage() {
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
            <ApplicationForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}