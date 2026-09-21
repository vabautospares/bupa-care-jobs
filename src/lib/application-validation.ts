import type { ServicePlanId } from "@/lib/types";
import { SERVICE_PLANS } from "@/lib/service-plans";

export interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  country: string;
  ukLocation: string;
  role: string;
  preferredLocation: string;
  workType: string;
  employmentPreference: string;
  availability: string;
  careExperience: boolean;
  yearsExperience: string;
  qualifications: string;
  employmentStatus: string;
  selectedPlan: ServicePlanId | "";
  termsAccepted: boolean;
}

export type ApplicationFieldErrors = Partial<Record<keyof ApplicationFormData, string>>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const digitsOnly = (value: string) => value.replace(/\D/g, "");
const phoneValid = (value: string) => {
  const digits = digitsOnly(value);
  return digits.length >= 7 && digits.length <= 15;
};

const stringFields: (keyof ApplicationFormData)[] = [
  "fullName",
  "email",
  "phone",
  "whatsapp",
  "country",
  "preferredLocation",
  "workType",
  "employmentPreference",
  "availability",
  "qualifications",
  "employmentStatus",
];

export function validateApplicationFormData(data: ApplicationFormData): { data?: Omit<ApplicationFormData, "termsAccepted" | "selectedPlan" | "yearsExperience"> & { selectedPlan: ServicePlanId; yearsExperience?: number }; errors: ApplicationFieldErrors } {
  const errors: ApplicationFieldErrors = {};

  for (const field of stringFields) {
    const value = data[field] as string;
    if (!value?.trim()) {
      errors[field] = "This field is required.";
    }
  }

  if (!data.role?.trim()) {
    errors.role = "Select a role.";
  }

  if (data.email && !emailRegex.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (data.phone && !phoneValid(data.phone)) {
    errors.phone = "Enter a valid phone number.";
  }

  if (data.whatsapp && !phoneValid(data.whatsapp)) {
    errors.whatsapp = "Enter a valid WhatsApp number.";
  }

  if (data.careExperience) {
    const yearsStr = String(data.yearsExperience).trim();
    const years = Number(yearsStr);
    if (!yearsStr || Number.isNaN(years) || years < 0) {
      errors.yearsExperience = "Enter your years of experience.";
    }
  }

  if (!data.selectedPlan) {
    errors.selectedPlan = "Select a service plan.";
  } else if (!SERVICE_PLANS.some((p) => p.id === data.selectedPlan)) {
    errors.selectedPlan = "Invalid service plan.";
  }

  if (!data.termsAccepted) {
    errors.termsAccepted = "You must accept the Terms & Conditions.";
  }

  if (Object.keys(errors).length) {
    return { errors };
  }

  const yearsExperience = data.careExperience ? Number(data.yearsExperience) : undefined;

  return {
    data: {
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      whatsapp: data.whatsapp.trim(),
      country: data.country.trim(),
      ukLocation: data.ukLocation.trim(),
      role: data.role.trim(),
      preferredLocation: data.preferredLocation.trim(),
      workType: data.workType.trim(),
      employmentPreference: data.employmentPreference.trim(),
      availability: data.availability.trim(),
      careExperience: data.careExperience,
      yearsExperience,
      qualifications: data.qualifications.trim(),
      employmentStatus: data.employmentStatus.trim(),
      selectedPlan: data.selectedPlan as ServicePlanId,
    },
    errors: {},
  };
}