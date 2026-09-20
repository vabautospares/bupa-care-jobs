import type { ServicePlan } from "@/lib/types";

export const SERVICE_PLANS: ServicePlan[] = [
  {
    id: "three-year",
    label: "3-year service plan",
    durationYears: 3,
    pricePence: 400000,
    initialPaymentPence: 100000,
  },
  {
    id: "five-year",
    label: "5-year service plan",
    durationYears: 5,
    pricePence: 600000,
    initialPaymentPence: 100000,
  },
];

export const DEFAULT_TERMS_VERSION = "0.1-placeholder";
