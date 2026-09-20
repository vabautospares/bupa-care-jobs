import Image from "next/image";
import Link from "next/link";
import { adviceArticles } from "@/data/homepage";
import { SectionHeading } from "./section-heading";

export function AdviceSection() {
  return (
    <section className="bg-[var(--color-background)] py-16 sm:py-24">
      <div className="site-container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Care career advice"
            title="Practical guidance for your next step"
            description="Useful information to help you understand care work and prepare with confidence."
          />
          <Link
            href="/care-careers"
            className="inline-flex items-center gap-2 rounded-sm font-bold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
          >
            Explore care careers <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {adviceArticles.map((article) => (
            <Link
              key={article.title}
              href={article.href}
              className="group block rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]"
            >
              <figure className="relative aspect-[16/9] overflow-hidden rounded-sm bg-[var(--color-surface-strong)]">
                <Image
                  src={article.image}
                  alt={article.imageAlt}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <span aria-hidden="true" className="absolute left-0 top-0 h-2 w-12 bg-[var(--color-accent)]" />
              </figure>
              <figcaption className="pt-3 text-xs font-semibold text-[var(--color-muted)]">
                Photo: {article.imageCredit}
              </figcaption>
              <h3 className="mt-4 text-xl font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-accent-hover)]">
                {article.title}
              </h3>
              <p className="mt-3 leading-7 text-[var(--color-muted)]">{article.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-accent)]">
                Read article <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
