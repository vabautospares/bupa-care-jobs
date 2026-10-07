"use client";

import { useRouter, useSearchParams } from "next/navigation";

const APPLICANT_TYPES = [
  { id: "uk-citizen", label: "UK citizen", description: "Applying as a British/UK citizen." },
  { id: "uk-student-visa", label: "UK student with a visa", description: "Studying in the UK on a student visa." },
  { id: "overseas", label: "Applying from another country", description: "Any nationality, any country." },
] as const;

export function ApplicantTypePicker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  const handleSelect = (id: string) => {
    const params = new URLSearchParams();
    params.set("applicant", id);
    if (role) {
      params.set("role", role);
    }
    router.push(`/apply?${params.toString()}`);
  };

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {APPLICANT_TYPES.map((type) => (
        <button
          key={type.id}
          type="button"
          onClick={() => handleSelect(type.id)}
          className="card p-6 text-left hover-elevate transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2"
        >
          <h3 className="text-lg font-bold text-[var(--color-foreground)]">{type.label}</h3>
          <p className="mt-2 text-sm text-[var(--color-muted)]">{type.description}</p>
        </button>
      ))}
    </div>
  );
}
