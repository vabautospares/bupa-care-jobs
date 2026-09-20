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
          eyebrow="Service plans"
          title="Choose the support that fits your plans"
          description="The initial payment is shown clearly alongside each service plan. Final conditions will be confirmed in the approved Terms & Conditions."
          align="center"
        />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {SERVICE_PLANS.map((plan, index) => (
            <article key={plan.id} className={`rounded-sm border-t-4 p-8 ${index === 1 ? "border-[var(--color-accent)] bg-[var(--color-background)] shadow-lg" : "border-[var(--color-border)] bg-[var(--color-background)]"}`}>
              {index === 1 && <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">Popular option</p>}
              <h3 className="mt-3 text-2xl font-bold text-[var(--color-foreground)]">{plan.label}</h3>
              <p className="mt-6 text-4xl font-bold tracking-tight text-[var(--color-foreground)]">{formatPounds(plan.pricePence)}</p>
              <p className="mt-2 text-[var(--color-muted)]">Initial payment: <strong className="text-[var(--color-foreground)]">{formatPounds(plan.initialPaymentPence)}</strong></p>
              <p className="mt-6 leading-7 text-[var(--color-muted)]">A clear service plan for the next stage of your care-career journey.</p>
              <Link href="/apply" className="mt-8 inline-flex w-full items-center justify-center rounded-sm bg-[var(--color-accent)] px-5 py-3 font-bold text-[var(--color-accent-contrast)] hover:bg-[var(--color-accent-hover)]">
                Apply now
              </Link>
            </article>
          ))}
        </div>
        <p className="mt-6 text-center text-sm leading-6 text-[var(--color-muted)]">
          No payment is processed on this website in version 1.
        </p>
      </div>
    </section>
  );
}
