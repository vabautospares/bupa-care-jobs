export type ServicePlanId = "three-year" | "five-year";

export interface ServicePlan {
  id: ServicePlanId;
  label: string;
  supportTerm: string;
  durationYears: 3 | 5;
  pricePence: 400000 | 600000;
  depositPence: 100000;
  balancePence: 300000 | 500000;
  inclusions: string[];
  externalCostsNote: string;
  noGuaranteeNote: string;
}

export interface Opportunity {
  id: string;
  title: string;
  location: string;
  description: string;
  category: string;
  employmentType: string;
  availability: string;
  active: boolean;
}

export interface Application {
  applicationId: string;
  submittedAt: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  country: string;
  ukLocation?: string;
  role: string;
  preferredLocation: string;
  workType: string;
  employmentPreference: string;
  availability: string;
  careExperience: boolean;
  yearsExperience?: number;
  qualifications: string;
  employmentStatus: string;
  cvReference: string;
  certificateReferences: string[];
  selectedPlan: ServicePlanId;
  initialPaymentPence: number;
  termsVersion: string;
  termsAccepted: true;
  termsAcceptedAt: string;
  status: string;
}

export interface StoredFileReference {
  provider: string;
  reference: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

export interface ContactConfig {
  whatsappNumber: string;
  whatsappUsername: string;
  email: string;
}
