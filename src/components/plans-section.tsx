import Link from "next/link";
import { SERVICE_PLANS } from "@/lib/service-plans";
import { SectionHeading } from "./section-heading";

const formatPounds = (pence: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(pence / 100);

export function PlansSection() {
  return (
    <section className="bg-[var(--color-surface)] py-16 sm:py-24">
      <div className="site-container">
        <SectionHeading
          eyebrow="Recruitment and Certificate of Sponsorship administration"
          title="Choose the support term for your recruitment journey"
          description="The company service fee covers recruitment coordination and administration of your Certificate of Sponsorship. UK government and third-party immigration costs are quoted separately before payment."
          align="center"
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {SERVICE_PLANS.map((plan, index) => (
            <article
              key={plan.id}
              className={`rounded-sm border-t-4 p-8 ${index === 1 ? "border-[var(--color-accent)] bg-[var(--color-background)] shadow-lg" : "border-[var(--color-border)] bg-[var(--color-background)]"}`}
            >
              <h3 className="text-2xl font-bold text-[var(--color-foreground)]">{plan.label}</h3>
              <p className="mt-6 text-4xl font-bold tracking-tight text-[var(--color-foreground)]">{formatPounds(plan.pricePence)}</p>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[var(--color-muted)]">Deposit (due before issuance of COS and work permit)</dt>
                  <dd className="font-semibold text-[var(--color-foreground)]">{formatPounds(plan.depositPence)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-muted)]">Remaining balance (after getting COS for visa approval and app)</dt>
                  <dd className="font-semibold text-[var(--color-foreground)]">{formatPounds(plan.balancePence)}</dd>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-[var(--color-border)]">
                  <dt className="text-[var(--color-foreground)]">Total company service fee probation</dt>
                  <dd className="text-[var(--color-accent)]">{formatPounds(plan.pricePence)}</dd>
                </div>
              </dl>
              <ul className="mt-6 space-y-2 text-sm text-[var(--color-muted)]" role="list">
                {plan.inclusions.map((inclusion, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span aria-hidden="true" className="flex-shrink-0 h-1.5 w-1.5 mt-2 rounded-full bg-[var(--color-accent)]" />
                    {inclusion}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-[var(--color-muted)]">{plan.externalCostsNote}</p>
              <p className="mt-2 text-xs text-[var(--color-danger)] font-medium">{plan.noGuaranteeNote}</p>
              <Link href="/apply" className="mt-8 inline-flex w-full items-center justify-center rounded-sm bg-[var(--color-accent)] px-5 py-3 font-bold text-[var(--color-accent-contrast)] hover:bg-[var(--color-accent-hover)]">
                Start application
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
