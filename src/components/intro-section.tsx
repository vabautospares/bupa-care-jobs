import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "./section-heading";

export function IntroSection() {
  return (
    <section className="bg-[var(--color-background)] py-16 sm:py-24">
      <div className="site-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <figure className="relative overflow-hidden rounded-sm bg-[var(--color-navy)]">
          <div className="relative aspect-[4/3]">
            <Image
              src="/images/caregiver-home.jpg"
              alt="Caregiver spending time with an older woman at home"
              fill
              sizes="(max-width: 1023px) 100vw, 45vw"
              className="object-cover"
            />
            <span aria-hidden="true" className="absolute left-0 top-0 h-14 w-14 bg-[var(--color-accent)]" />
          </div>
          <figcaption className="px-5 py-3 text-xs font-semibold text-[var(--color-muted)]">
            Photo: Jsme MILA / Pexels
          </figcaption>
        </figure>

        <div>
          <SectionHeading
            eyebrow="Where do I start?"
            title="A clear first step into care work"
            description="Care work is practical, human and different every day. It can mean helping someone feel comfortable, supporting a daily routine, listening carefully or helping a person stay connected to the things they enjoy."
          />
          <p className="mt-6 text-lg leading-8 text-[var(--color-foreground)]">
            Explore care opportunities across a range of roles and locations. Find an opportunity that matches your experience and take the next step in your career.
          </p>
          <div className="mt-8">
            <Link href="/care-careers" className="inline-flex items-center gap-2 rounded-sm font-bold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">
              Learn about care careers <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
