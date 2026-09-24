import type { ServicePlan } from "@/lib/types";

export const SERVICE_PLANS: ServicePlan[] = [
  {
    id: "three-year",
    label: "3-Year Recruitment & Sponsorship Support",
    supportTerm: "3-Year",
    durationYears: 3,
    pricePence: 400000,
    depositPence: 100000,
    balancePence: 300000,
    inclusions: [
      "Recruitment coordination",
      "Certificate of Sponsorship administration",
    ],
    externalCostsNote:
      "UK government and third-party immigration costs are quoted separately before payment.",
    noGuaranteeNote:
      "Deposit should be paid to process job offer letter, DBS check and COS",
  },
  {
    id: "five-year",
    label: "5-Year Recruitment & Sponsorship Support",
    supportTerm: "5-Year",
    durationYears: 5,
    pricePence: 600000,
    depositPence: 100000,
    balancePence: 500000,
    inclusions: [
      "Recruitment coordination",
      "Certificate of Sponsorship administration",
    ],
    externalCostsNote:
      "UK government and third-party immigration costs are quoted separately before payment.",
    noGuaranteeNote:
      "Deposit should be paid to process job offer letter, DBS check and COS",
  },
];

export const DEFAULT_TERMS_VERSION = "0.1-placeholder";
