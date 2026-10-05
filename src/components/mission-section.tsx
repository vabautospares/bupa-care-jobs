import Link from "next/link";
import { SectionHeading } from "./section-heading";

const commitments = [
  "We are here for people who want to build a career that makes a real difference to someone's day.",
  "We help you find the right care role, prepare a clear application and get through each step without guesswork.",
  "You can search and apply online at any time, and our team keeps you updated by phone and email as your application moves forward.",
  "Care work here is not one size fits all. You will find roles in care homes, in people's own homes and out in the community, right across the UK.",
] as const;

export function MissionSection() {
  return (
    <section className="bg-[var(--color-navy)] py-16 text-white sm:py-24">
      <div className="site-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Why we do this"
            title="We make health happen"
            tone="dark"
          />
          <div className="mt-8">
            <Link
              href="/recruitment-process"
              className="inline-flex items-center gap-2 font-bold text-[var(--color-teal-soft)] hover:text-white"
            >
              See our recruitment process
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {commitments.map((commitment) => (
            <p
              key={commitment}
              className="rounded-sm border-l-4 border-[var(--color-teal)] bg-white/10 p-7 leading-7 text-white/80"
            >
              {commitment}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
