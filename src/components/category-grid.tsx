import type { ReactNode } from "react";
import Link from "next/link";
import { jobCategories } from "@/data/homepage";
import { SectionHeading } from "./section-heading";

const iconPaths: Record<string, ReactNode> = {
  care: <><path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 11c0 5.5-7 10-7 10Z" /></>,
  lead: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" /></>,
  support: <><path d="M12 3v18M5 8l7-5 7 5" /><path d="M5 21h14" /></>,
  health: <><path d="M12 4v16M4 12h16" /></>,
  nurse: <><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z" /><path d="M12 8v8M8 12h8" /></>,
  senior: <><circle cx="12" cy="9" r="5" /><path d="M4 20c1-4 4-6 8-6s7 2 8 6" /></>,
  home: <><path d="M4 11 12 4l8 7" /><path d="M6 10v10h12V10" /></>,
  visit: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" /></>,
  dementia: <><circle cx="12" cy="12" r="9" /><path d="M8 12h8M12 8v8" /></>,
  other: <><circle cx="12" cy="12" r="9" /><path d="M8 12h8" /></>,
};

export function CategoryGrid() {
  return (
    <section className="bg-[var(--color-background)] py-16 sm:py-24">
      <div className="site-container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Explore roles"
            title="Find a care role that fits"
            description="Start with a role that sounds interesting. You can refine your search later."
          />
          <Link href="/find-opportunities" className="inline-flex items-center gap-2 rounded-sm font-bold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]">
            View all opportunities <span aria-hidden="true">→</span>
          </Link>
        </div>
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jobCategories.map((category) => (
            <li key={category.title}>
              <Link href={category.href} className="group block h-full rounded-sm border-t-4 border-[var(--color-accent)] bg-[var(--color-surface)] p-7 transition-colors hover:border-[var(--color-teal)] hover:bg-[var(--color-accent-soft)]">
                <span className="flex h-14 w-14 items-center justify-center rounded-sm bg-[var(--color-background)] text-[var(--color-accent)] shadow-sm group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-accent-contrast)]">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7">
                    {iconPaths[category.icon]}
                  </svg>
                </span>
                <h3 className="mt-6 text-xl font-bold text-[var(--color-foreground)]">{category.title}</h3>
                <p className="mt-3 leading-7 text-[var(--color-muted)]">{category.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-accent)]">Explore role <span aria-hidden="true">→</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
