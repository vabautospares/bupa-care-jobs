import { SupportPlans } from "./support-plans";

export function PlansSection() {
  return (
    <section className="bg-[var(--color-surface)] py-16 sm:py-24">
      <div className="site-container">
        <SupportPlans
          eyebrow="Recruitment and Certificate of Sponsorship administration"
          title="Choose the support term for your recruitment journey"
          description="The company service fee covers recruitment coordination and administration of your Certificate of Sponsorship. UK government and third-party immigration costs are quoted separately before payment."
        />
      </div>
    </section>
  );
}
