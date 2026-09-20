"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { Button } from "@/components/button";
import { TextField } from "@/components/text-field";
import { TextAreaField } from "@/components/text-area-field";
import { CheckboxField } from "@/components/checkbox-field";
import { Alert } from "@/components/alert";
import { SectionHeading } from "@/components/section-heading";
import { SERVICE_PLANS } from "@/lib/service-plans";
import { validateApplicationFormData, type ApplicationFormData, type ApplicationFieldErrors } from "@/lib/application-validation";
import Link from "next/link";

const employmentPreferenceOptions = ["Full-time", "Part-time", "Flexible"] as const;

const formatPounds = (pence: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(pence / 100);

const steps = [
  { label: "Your details", href: "#personal-details" },
  { label: "Choose a plan", href: "#service-plan" },
  { label: "Review terms", href: "#terms" },
  { label: "Submit", href: "#submit" },
] as const;

export function ApplicationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialRole = searchParams.get("role") ?? "";
  const [workTypeOptions, setWorkTypeOptions] = useState<string[]>([]);

  // Fetch work type options from the opportunities API
  useEffect(() => {
    fetch("/api/opportunities")
      .then((res) => res.json())
      .then((data: { opportunities?: Array<{ employmentType: string }> }) => {
        if (data.opportunities && Array.isArray(data.opportunities)) {
          const types = [...new Set(data.opportunities.map((o) => o.employmentType).filter(Boolean))];
          setWorkTypeOptions(types);
        }
      })
      .catch(() => {
        // Fallback to defaults if API fails
        setWorkTypeOptions(["Care home", "Home care", "Live-in care", "Hospital or clinical setting", "Not sure yet"]);
      });
  }, []);

  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: "",
    email: "",
    phone: "",
    whatsapp: "",
    country: "",
    ukLocation: "",
    role: initialRole,
    preferredLocation: "",
    workType: "",
    employmentPreference: "",
    availability: "",
    careExperience: false,
    yearsExperience: "",
    qualifications: "",
    employmentStatus: "",
    selectedPlan: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<ApplicationFieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string>("");

  const updateField = <K extends keyof ApplicationFormData>(name: K, value: ApplicationFormData[K]) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    if (type === "checkbox") {
      updateField(name as keyof ApplicationFormData, (event.target as HTMLInputElement).checked);
    } else {
      updateField(name as keyof ApplicationFormData, value);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validateApplicationFormData(formData);
    if (Object.keys(result.errors).length) {
      setErrors(result.errors);
      const firstError = Object.keys(result.errors)[0];
      const element = document.getElementById(firstError);
      element?.focus();
      return;
    }

    setStatus("submitting");
    setServerMessage("");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result.data,
          selectedPlan: formData.selectedPlan,
          termsAccepted: formData.termsAccepted,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        if (body.fields) {
          setErrors(body.fields);
          setStatus("error");
          setServerMessage(body.error || "Please check the highlighted fields.");
          const firstError = Object.keys(body.fields)[0];
          document.getElementById(firstError)?.focus();
          return;
        }
        throw new Error(body.error || "Application submission failed.");
      }

      // Redirect to confirmation page with application details
      const confirmationUrl = `/confirmation?ref=${body.applicationId}&plan=${formData.selectedPlan}&role=${encodeURIComponent(formData.role)}`;
      router.push(confirmationUrl);
      router.refresh();
    } catch (error) {
      setStatus("error");
      setServerMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10 animate-fade-in-up">
      {/* Progress indicator */}
      <nav aria-label="Application progress" className="mb-8">
        <ol className="flex items-center gap-2 sm:gap-4" role="list" aria-label="Application steps">
          {steps.map((step, index) => (
            <li key={step.label} className="flex items-center">
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  index === 0
                    ? "bg-[var(--color-accent)] text-[var(--color-accent-contrast)] shadow-md"
                    : "bg-[var(--color-surface)] text-[var(--color-muted)] border border-[var(--color-border)]"
                }`}
                aria-current={index === 0 ? "step" : undefined}
              >
                {index + 1}
              </span>
              {index < steps.length - 1 && (
                <span className="hidden sm:block w-12 h-0.5 bg-[var(--color-border)]" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-[var(--color-muted)] text-center sm:text-left">
          Step 1 of 4: Your details
        </p>
      </nav>

      <div id="personal-details">
        <SectionHeading
          eyebrow="Step 1 of 4"
          title="Start your application"
          description="Complete your application with your personal, experience and employment details."
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <TextField
            id="fullName"
            name="fullName"
            label="Full name"
            value={formData.fullName}
            onChange={handleInputChange}
            error={errors.fullName}
            required
            autoComplete="name"
          />
          <TextField
            id="email"
            name="email"
            label="Email address"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            required
            autoComplete="email"
          />
          <TextField
            id="phone"
            name="phone"
            label="Phone number"
            value={formData.phone}
            onChange={handleInputChange}
            error={errors.phone}
            required
            autoComplete="tel"
          />
          <TextField
            id="whatsapp"
            name="whatsapp"
            label="WhatsApp number"
            value={formData.whatsapp}
            onChange={handleInputChange}
            error={errors.whatsapp}
            required
            autoComplete="tel"
          />
          <TextField
            id="country"
            name="country"
            label="Country"
            value={formData.country}
            onChange={handleInputChange}
            error={errors.country}
            required
            autoComplete="country"
          />
          <TextField
            id="ukLocation"
            name="ukLocation"
            label="UK location"
            value={formData.ukLocation}
            onChange={handleInputChange}
            error={errors.ukLocation}
            autoComplete="address-level2"
          />
        </div>
      </div>

      <div id="job-preferences">
        <SectionHeading eyebrow="Step 2 of 4" title="Job preferences" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <TextField
            id="preferredLocation"
            name="preferredLocation"
            label="Preferred location"
            value={formData.preferredLocation}
            onChange={handleInputChange}
            error={errors.preferredLocation}
            required
            autoComplete="address-level2"
          />
          <div>
            <label htmlFor="workType" className="label">
              Work type <span aria-hidden="true" className="ml-1 text-[var(--color-danger)]">*</span>
            </label>
            <select
              id="workType"
              name="workType"
              value={formData.workType}
              onChange={handleInputChange}
              className={`input ${errors.workType ? "input-error" : ""}`}
              aria-invalid={Boolean(errors.workType)}
              aria-describedby={errors.workType ? "workType-error" : undefined}
              required
            >
              <option value="">Select work type</option>
              {workTypeOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {errors.workType && <p id="workType-error" role="alert" className="text-sm font-semibold text-[var(--color-danger)]">{errors.workType}</p>}
          </div>
          <div>
            <label htmlFor="employmentPreference" className="label">
              Employment preference <span aria-hidden="true" className="ml-1 text-[var(--color-danger)]">*</span>
            </label>
            <select
              id="employmentPreference"
              name="employmentPreference"
              value={formData.employmentPreference}
              onChange={handleInputChange}
              className={`input ${errors.employmentPreference ? "input-error" : ""}`}
              aria-invalid={Boolean(errors.employmentPreference)}
              aria-describedby={errors.employmentPreference ? "employmentPreference-error" : undefined}
              required
            >
              <option value="">Select preference</option>
              {employmentPreferenceOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {errors.employmentPreference && <p id="employmentPreference-error" role="alert" className="text-sm font-semibold text-[var(--color-danger)]">{errors.employmentPreference}</p>}
          </div>
          <TextField
            id="availability"
            name="availability"
            label="Availability"
            value={formData.availability}
            onChange={handleInputChange}
            error={errors.availability}
            required
            placeholder="e.g. Immediately, 2 weeks notice"
          />
        </div>
      </div>

      <div id="experience">
        <SectionHeading eyebrow="Step 3 of 4" title="Experience" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <CheckboxField
            id="careExperience"
            name="careExperience"
            label="I have previous care experience"
            checked={formData.careExperience}
            onChange={handleInputChange}
          />
          {formData.careExperience && (
            <TextField
              id="yearsExperience"
              name="yearsExperience"
              label="Years of experience"
              type="number"
              min="0"
              value={formData.yearsExperience}
              onChange={handleInputChange}
              error={errors.yearsExperience}
              placeholder="0"
              required
            />
          )}
          <TextAreaField
            id="qualifications"
            name="qualifications"
            label="Relevant qualifications"
            value={formData.qualifications}
            onChange={handleInputChange}
            error={errors.qualifications}
            required
            className="sm:col-span-2"
            rows={3}
          />
          <TextField
            id="employmentStatus"
            name="employmentStatus"
            label="Employment status"
            value={formData.employmentStatus}
            onChange={handleInputChange}
            error={errors.employmentStatus}
            required
            className="sm:col-span-2"
          />
        </div>
      </div>

      <div id="service-plan">
        <SectionHeading eyebrow="Step 3 of 4" title="Choose your support plan" description="Select the plan that best fits your care-career journey." />
        <div className="mt-8 grid gap-6 lg:grid-cols-2" role="radiogroup" aria-label="Select a service plan">
          {SERVICE_PLANS.map((plan) => {
            const isPopular = plan.id === "three-year";
            const isSelected = formData.selectedPlan === plan.id;
            const remainingPence = plan.pricePence - plan.initialPaymentPence;
            return (
              <label
                key={plan.id}
                className={`relative flex flex-col card p-6 cursor-pointer hover-elevate transition-all duration-200 ${
                  isSelected
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] ring-2 ring-[var(--color-accent)] shadow-lg"
                    : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-4 rounded-sm bg-[var(--color-accent)] px-3 py-0.5 text-xs font-bold text-[var(--color-accent-contrast)]">
                    Popular
                  </span>
                )}
                <input
                  type="radio"
                  id={`plan-${plan.id}`}
                  name="selectedPlan"
                  value={plan.id}
                  checked={isSelected}
                  onChange={handleInputChange}
                  className="sr-only"
                  aria-label={plan.label}
                />
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
                      isSelected
                        ? "border-[var(--color-accent)] bg-[var(--color-accent)]"
                        : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
                    }`}
                    aria-hidden="true"
                  >
                    {isSelected && (
                      <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent-contrast)]" />
                    )}
                  </span>
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-[var(--color-foreground)]">{plan.label}</h3>
                  <div className="mt-4 space-y-3 pt-4 border-t border-[var(--color-border)]">
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-muted)]">Initial payment</span>
                      <span className="font-semibold text-[var(--color-foreground)]">{formatPounds(plan.initialPaymentPence)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[var(--color-muted)]">Remaining</span>
                      <span className="font-semibold text-[var(--color-foreground)]">{formatPounds(remainingPence)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-[var(--color-border)]">
                      <span className="text-[var(--color-foreground)]">Total</span>
                      <span className="text-[var(--color-accent)]">{formatPounds(plan.pricePence)}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 leading-7 text-sm text-[var(--color-muted)]">A clear service plan for the next stage of your care-career journey.</p>
              </label>
            );
          })}
        </div>
        {errors.selectedPlan && (
          <p role="alert" className="mt-3 text-sm font-semibold text-[var(--color-danger)]">{errors.selectedPlan}</p>
        )}
      </div>

      <div id="terms">
        <SectionHeading eyebrow="Step 4 of 4" title="Review and accept terms" />
        <div className="mt-8">
          <div className="card p-6">
            <CheckboxField
              id="termsAccepted"
              name="termsAccepted"
              label={
                <>
                  I agree to the
                  <Link
                    href="/terms-and-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] underline font-bold"
                  >
                    Terms & Conditions
                  </Link>
                  and confirm that the information I have provided is accurate.
                </>
              }
              checked={formData.termsAccepted}
              onChange={handleInputChange}
              error={errors.termsAccepted}
              required
            />
          </div>
        </div>
      </div>

      <div id="submit">
        <SectionHeading eyebrow="Step 4 of 4" title="Submit your application" />
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto btn-primary justify-center gap-2">
            {status === "submitting" ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting…
              </>
            ) : (
              "Complete application"
            )}
          </Button>
          {status === "error" && (
            <Alert tone="error" title="Submission failed" className="flex-1">
              {serverMessage}
            </Alert>
          )}
          {status === "success" && (
            <Alert tone="success" title="Application submitted" className="flex-1">
              {serverMessage}
            </Alert>
          )}
        </div>
      </div>
    </form>
  );
}