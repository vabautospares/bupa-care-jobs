import { SectionHeading } from "./section-heading";

export const steps = [
  { number: "01", title: "Find a job", description: "Search available care opportunities by role or location." },
  { number: "02", title: "Apply", description: "Complete your application for the opportunity you choose." },
  { number: "03", title: "Confirmation", description: "Follow the guidance provided after your application." },
] as const;

export function StepsSection() {
  return (
    <section className="bg-[var(--color-surface)] py-16 sm:py-24">
      <div className="site-container">
        <SectionHeading
          eyebrow="How it works"
          title="A clear path from first search to next steps"
          description="The process is designed to be easy to follow, with support available when you need it."
          align="center"
        />
        <ol className="mt-12 grid gap-5 sm:grid-cols-3">
          {steps.map((step) => (
            <li key={step.number} className="rounded-sm border-t-4 border-[var(--color-accent)] bg-[var(--color-background)] p-7 shadow-sm">
              <p className="flex h-10 w-10 items-center justify-center rounded-sm bg-[var(--color-accent)] text-sm font-bold text-[var(--color-accent-contrast)]">
                {step.number}
              </p>
              <h3 className="mt-5 text-xl font-bold text-[var(--color-foreground)]">{step.title}</h3>
              <p className="mt-3 text-base leading-7 text-[var(--color-muted)]">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
