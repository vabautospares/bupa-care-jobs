import { SectionHeading } from "./section-heading";

const features = [
  { title: "Explore with clarity", description: "Search opportunities by the role and location that matter to you." },
  { title: "Understand the journey", description: "See the steps before you apply, including plan selection and Terms acceptance." },
  { title: "Get human support", description: "Continue to WhatsApp when you want help with the next part of the process." },
];

export function ServiceInfoSection() {
  return (
    <section className="bg-[var(--color-navy)] py-16 text-white sm:py-24">
      <div className="site-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <SectionHeading
          eyebrow="How we can help"
          title="Support that stays simple"
          description="You can move at your own pace, with clear information and a human route to further help."
          tone="dark"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-sm border-l-4 border-[var(--color-teal)] bg-white/10 p-7">
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="mt-3 leading-7 text-white/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
