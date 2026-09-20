import Link from "next/link";
import type { ReactNode } from "react";

type SectionTone = "light" | "dark";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: SectionTone;
  children?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  children,
}: SectionHeadingProps) {
  const isDark = tone === "dark";

  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-3xl text-center"
          : "max-w-3xl"
      }
    >
      {eyebrow && (
        <p
          className={`flex items-center gap-3 text-sm font-bold uppercase tracking-[0.18em] ${
            isDark ? "text-[var(--color-teal-soft)]" : "text-[var(--color-accent)]"
          }`}
        >
          <span aria-hidden="true" className="h-2.5 w-2.5 bg-[var(--color-accent)]" />
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl ${
          isDark ? "text-white" : "text-[var(--color-foreground)]"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-lg leading-8 ${
            isDark ? "text-white/80" : "text-[var(--color-muted)]"
          }`}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  );
}

export function TextLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 font-bold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
    >
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}
