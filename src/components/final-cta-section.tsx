import Link from "next/link";
import { SectionHeading } from "./section-heading";

export function FinalCtaSection() {
  return (
    <section className="bg-[var(--color-accent)] py-16 text-[var(--color-accent-contrast)] sm:py-24">
      <div className="site-container flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
        <SectionHeading
          title="Ready to take the next step?"
          description="Explore available care jobs and start your application today."
          tone="dark"
        />
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/find-opportunities"
            className="inline-flex items-center justify-center rounded-sm bg-[var(--color-background)] px-7 py-4 text-lg font-bold text-[var(--color-foreground)] hover:bg-[var(--color-accent-soft)]"
          >
            View available jobs
          </Link>
        </div>
      </div>
    </section>
  );
}
