import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { OpportunitySearch } from "./opportunity-search";

export function Hero() {
  return (
    <section className="overflow-hidden bg-[var(--color-surface-strong)]">
      <div className="site-container grid gap-10 pt-16 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-24 lg:pb-32">
        <div className="max-w-3xl">
          <p className="section-eyebrow animate-fade-in-up">
            Care careers
          </p>
          <h1 className="mt-4 section-title animate-fade-in-up delay-1">
            Find opportunities to work in care
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-muted)] animate-fade-in-up delay-2">
            Explore available care jobs for the 2026 recruitment period and take the next step towards your career in care.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row animate-fade-in-up delay-3">
            <Link
              href="/find-opportunities"
              className="btn btn-primary px-8 py-4 text-lg shadow-md hover:shadow-lg"
            >
              View available jobs
            </Link>
            <Link
              href="/how-it-works"
              className="btn btn-outline px-8 py-4 text-lg"
            >
              How it works
            </Link>
          </div>
        </div>

        <figure className="relative mx-auto w-full max-w-xl lg:mx-0 animate-fade-in delay-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[var(--color-navy)] shadow-xl">
            <Image
              src="/images/caregiver-walk.jpg"
              alt="Care worker supporting an older woman during a walk"
              fill
              priority
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
            <span aria-hidden="true" className="absolute left-0 top-0 h-14 w-14 bg-[var(--color-accent)]" />
            <span aria-hidden="true" className="absolute bottom-0 right-0 h-20 w-20 bg-[var(--color-teal)]" />
          </div>
          <figcaption className="mt-3 text-xs font-semibold text-[var(--color-muted)]">
            Photo: Sofía Marquet / Pexels
          </figcaption>
          <div className="absolute -bottom-6 -left-6 rounded-lg bg-[var(--color-navy)] px-5 py-4 text-white shadow-xl sm:-left-10">
            <p className="text-sm font-bold">Person-centred support</p>
            <p className="text-sm text-white/80">Start with the person, not the paperwork.</p>
          </div>
        </figure>
      </div>

      <div className="site-container pb-24 lg:-mt-16 lg:pb-32">
        <Suspense fallback={<div className="h-24 animate-pulse-soft" />}>
          <OpportunitySearch />
        </Suspense>
      </div>
    </section>
  );
}