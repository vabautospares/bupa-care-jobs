import { SectionHeading } from "@/components/section-heading";
import { Alert } from "@/components/alert";
import Link from "next/link";
import { getContactConfig } from "@/lib/config";
import { SERVICE_PLANS } from "@/lib/service-plans";
import { ConfirmationContact, ConfirmationEmail } from "@/components/confirmation-contact";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Application Submitted",
  description: "Your application confirmation page.",
  path: "/confirmation",
  noIndex: true,
});

function SuccessIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function ConfirmationContent({
  applicationId,
  plan,
  role,
  whatsAppLink,
  contactEmail,
}: {
  applicationId: string | undefined;
  plan: (typeof SERVICE_PLANS)[0] | undefined;
  role: string;
  whatsAppLink: string | null;
  contactEmail: string;
}) {
  return (
    <section className="bg-[var(--color-background)] py-12 sm:py-16">
      <div className="site-container max-w-3xl">
        <SectionHeading
          eyebrow="Confirmation"
          title="Your application has been submitted"
          headingLevel="h1"
          description="Thank you for your application. Your details have been received and our team will guide you through the next steps."
          align="center"
        />

        <div
          className="mt-10 card p-8 sm:p-10 text-center animate-fade-in"
          style={{ animationDelay: "100ms" }}
          role="status"
          aria-live="polite"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] mb-6">
            <SuccessIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-foreground)]">
            Application received
          </h2>
          <p className="mt-2 text-[var(--color-muted)]">
            Your application has been saved and is being reviewed by our team.
          </p>
          {applicationId && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="text-sm font-medium text-[var(--color-muted)]">Reference</span>
              <code className="font-mono text-base bg-[var(--color-surface)] px-3 py-1.5 rounded border border-[var(--color-border)] text-[var(--color-foreground)] select-all">
                {applicationId}
              </code>
            </div>
          )}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {role && (
            <div className="card p-6">
              <h3 className="text-sm font-bold text-[var(--color-muted)] uppercase tracking-wide">Role applied for</h3>
              <p className="mt-2 text-lg font-semibold text-[var(--color-foreground)]">{role}</p>
            </div>
          )}
          {plan && (
            <div className="card p-6">
              <h3 className="text-sm font-bold text-[var(--color-muted)] uppercase tracking-wide">Selected plan</h3>
              <p className="mt-2 text-lg font-semibold text-[var(--color-foreground)]">{plan.label}</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[var(--color-muted)]">Deposit (due before application review)</dt>
                  <dd className="font-semibold text-[var(--color-foreground)]">£{plan.depositPence / 100}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-muted)]">Remaining balance (instalments after employment starts)</dt>
                  <dd className="font-semibold text-[var(--color-foreground)]">£{plan.balancePence / 100}</dd>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-[var(--color-border)]">
                  <dt className="text-[var(--color-foreground)]">Total company service fee</dt>
                  <dd className="text-[var(--color-accent)]">£{plan.pricePence / 100}</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs text-[var(--color-muted)]">{plan.externalCostsNote}</p>
              <p className="mt-2 text-xs text-[var(--color-danger)] font-medium">{plan.noGuaranteeNote}</p>
            </div>
          )}
        </div>

        <div className="mt-10 card p-6 border-[var(--color-border)]">
          <h3 className="text-lg font-bold text-[var(--color-foreground)] mb-3">
            Payment clarification
          </h3>
          <p className="text-[var(--color-muted)]">
            Payment has not been completed on the website. Our team will guide you
            through the next steps, including payment.
          </p>
        </div>

        <div id="whatsapp-followup" className="mt-10 card p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[var(--color-foreground)]">
                Follow up on your application
              </h3>
              <p className="mt-2 text-[var(--color-muted)]">
                Contact our team on WhatsApp to follow up on your application and receive guidance on the next steps.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {whatsAppLink && (
                <ConfirmationContact whatsAppLink={whatsAppLink} />
              )}
              {!whatsAppLink && (
                <Alert tone="warning" title="WhatsApp not configured" className="w-full">
                  <ConfirmationContact whatsAppLink={null} />
                </Alert>
              )}
            </div>
          </div>
          <p className="mt-6 text-sm text-[var(--color-muted)] text-center sm:text-left">
            Alternatively, you can email us at{" "}
            <ConfirmationEmail contactEmail={contactEmail} />
            .
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/find-opportunities"
            className="btn-primary w-full sm:w-auto"
          >
            View available jobs
          </Link>
          <Link
            href="/"
            className="btn-secondary w-full sm:w-auto"
          >
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; plan?: string; role?: string }>;
}) {
  const params = await searchParams;
  const applicationId = params.ref;
  const planId = params.plan;
  const role = params.role ? decodeURIComponent(params.role) : "";

  const plan = SERVICE_PLANS.find((p) => p.id === planId);

  const { whatsappUsername, email: contactEmail } = getContactConfig();
  const whatsappConfigured = whatsappUsername && whatsappUsername.length > 0;
  const whatsappMessage = applicationId
    ? `Hello, I have completed an application (Ref: ${applicationId}) and would like help with the next steps.`
    : "Hello, I have completed an application and would like help with the next steps.";
  const whatsAppLink = whatsappConfigured
    ? `https://wa.me/${whatsappUsername}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  return (
    <section className="bg-[var(--color-background)] py-12 sm:py-16">
      <div className="site-container max-w-3xl">
        <ConfirmationContent
          applicationId={applicationId}
          plan={plan}
          role={role}
          whatsAppLink={whatsAppLink}
          contactEmail={contactEmail}
        />
      </div>
    </section>
  );
}