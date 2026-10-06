"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";
import { SERVICE_PLANS } from "@/lib/service-plans";
import type { ServicePlan } from "@/lib/types";

interface PdfApplicationData {
  ref: string;
  plan: string;
  role: string;
  applicantType: string;
  submittedAt: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  country: string;
  ukLocation: string;
  preferredLocation: string;
  workType: string;
  employmentPreference: string;
  availability: string;
  careExperience: boolean;
  yearsExperience?: number;
  qualifications: string;
  employmentStatus: string;
}

interface ApplicationPdfButtonProps {
  reference?: string;
  planId?: string;
  role?: string;
  contactEmail: string;
}

function fallbackLabel(value: string | undefined): string {
  return value ? value : "—";
}

export function ApplicationPdfButton({ reference, planId, role, contactEmail }: ApplicationPdfButtonProps) {
  const [sessionData] = useState<PdfApplicationData | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem("bupa-application-confirmation");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const plan: ServicePlan | undefined = sessionData
    ? SERVICE_PLANS.find((p) => p.id === sessionData.plan)
    : planId
      ? SERVICE_PLANS.find((p) => p.id === planId)
      : undefined;

  const applicationRef = sessionData?.ref ?? reference ?? "";
  const applicationRole = sessionData?.role ?? role ?? "";

  const downloadPdf = async () => {
    setLoading(true);
    try {
      const doc = new jsPDF();

      let logoDataUrl: string | null = null;
      try {
        const logoResponse = await fetch("/bupalogo.png");
        const logoBlob = await logoResponse.blob();
        logoDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(logoBlob);
        });
      } catch {
        // proceed without logo if fetch fails
      }

      if (logoDataUrl) {
        doc.addImage(logoDataUrl, "PNG", 15, 10, 40, 40);
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(33, 37, 41);
      doc.text("Bupa Care Jobs — Application Summary", 70, 25);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Reference: ${applicationRef}`, 15, 58);
      const submittedDate = sessionData?.submittedAt ? new Date(sessionData.submittedAt).toLocaleString("en-GB") : new Date().toLocaleString("en-GB");
      doc.text(`Submitted: ${submittedDate}`, 15, 64);

      doc.setDrawColor(200);
      doc.line(15, 70, 195, 70);

      let y = 80;

      const applicantLabel = sessionData?.applicantType
        ? sessionData.applicantType
          .replace(/^uk-citizen$/i, "UK citizen")
          .replace(/^uk-student-visa$/i, "UK student with a visa")
          .replace(/^overseas$/i, "Overseas applicant (all countries welcome)")
        : "";

      if (applicantLabel) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(33, 37, 41);
        doc.text("You're applying as:", 15, y);
        doc.setFont("helvetica", "normal");
        doc.text(applicantLabel, 70, y);
        y += 10;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Applicant details", 15, y);
      y += 8;

      const fields: { label: string; value: string }[] = [
        { label: "Full name", value: fallbackLabel(sessionData?.fullName) },
        { label: "Email", value: fallbackLabel(sessionData?.email) },
        { label: "Phone", value: fallbackLabel(sessionData?.phone) },
        { label: "WhatsApp", value: fallbackLabel(sessionData?.whatsapp) },
        { label: "Country applying from", value: fallbackLabel(sessionData?.country) },
        { label: "UK location / country", value: fallbackLabel(sessionData?.ukLocation) },
        { label: "Role applied for", value: fallbackLabel(applicationRole) },
        { label: "Preferred location", value: fallbackLabel(sessionData?.preferredLocation) },
        { label: "Work type", value: fallbackLabel(sessionData?.workType) },
        { label: "Employment preference", value: fallbackLabel(sessionData?.employmentPreference) },
        { label: "Availability", value: fallbackLabel(sessionData?.availability) },
        { label: "Care experience", value: sessionData?.careExperience ? "Yes" : "No" },
        { label: "Years of experience", value: sessionData?.yearsExperience != null ? String(sessionData.yearsExperience) : "—" },
        { label: "Qualifications", value: fallbackLabel(sessionData?.qualifications) },
        { label: "Employment status", value: fallbackLabel(sessionData?.employmentStatus) },
      ];

      if (plan) {
        fields.push({ label: "Selected plan", value: plan.label });
        fields.push({ label: "Remaining balance", value: `£${(plan.balancePence / 100).toFixed(0)}` });
        fields.push({ label: "Total company service fee", value: `£${(plan.pricePence / 100).toFixed(0)}` });
      }

      doc.setFontSize(10);
      fields.forEach((field) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.setFont("helvetica", "bold");
        doc.setTextColor(80);
        doc.text(field.label, 15, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(33, 37, 41);
        doc.text(String(field.value), 80, y);
        y += 7;
      });

      y += 10;
      doc.setDrawColor(200);
      doc.line(15, y, 195, y);
      y += 10;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(33, 37, 41);
      doc.text("Note", 15, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      const note = "Application review takes up to 24 working hours. If you would like to follow up on your application, please contact us by email or WhatsApp.";
      const noteLines = doc.splitTextToSize(note, 180);
      doc.text(noteLines, 15, y);
      y += noteLines.length * 5 + 10;

      doc.setFont("helvetica", "bold");
      doc.text("Bupa Care Jobs", 15, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.text(`Email: ${contactEmail}`, 15, y);
      y += 5;
      doc.text("Website: https://www.bupacareers.site", 15, y);

      const filename = applicationRef ? `Bupa-Application-${applicationRef}.pdf` : "Bupa-Application.pdf";
      doc.save(filename);
    } catch (error) {
      console.error("Failed to generate PDF", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={downloadPdf}
      disabled={loading}
      className="btn btn-primary w-full sm:w-auto justify-center gap-2"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Generating PDF…
        </>
      ) : (
        "Download application as PDF"
      )}
    </button>
  );
}
