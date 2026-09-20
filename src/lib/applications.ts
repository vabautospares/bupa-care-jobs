import { google } from "googleapis";
import type { Application } from "@/lib/types";

export class ApplicationsNotConfiguredError extends Error {
  constructor() {
    super("Application service is not configured.");
    this.name = "ApplicationsNotConfiguredError";
  }
}

export class ApplicationsUnavailableError extends Error {
  constructor() {
    super("Application service is temporarily unavailable.");
    this.name = "ApplicationsUnavailableError";
  }
}

export async function saveApplication(application: Application): Promise<string> {
  const spreadsheetId = process.env.GOOGLE_APPLICATION_SPREADSHEET_ID?.trim();
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.trim();

  if (!spreadsheetId || !serviceAccountEmail || !privateKey) {
    throw new ApplicationsNotConfiguredError();
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccountEmail,
        private_key: privateKey.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const range = process.env.GOOGLE_APPLICATION_RANGE || "Applications!A1:W1";

    const values = [
      [
        application.applicationId,
        application.submittedAt,
        application.fullName,
        application.email,
        application.phone,
        application.whatsapp,
        application.country,
        application.ukLocation,
        application.role,
        application.preferredLocation,
        application.workType,
        application.employmentPreference,
        application.availability,
        application.careExperience ? "Yes" : "No",
        application.yearsExperience ?? "",
        application.qualifications,
        application.employmentStatus,
        application.cvReference,
        application.certificateReferences.join(", "),
        application.selectedPlan,
        application.initialPaymentPence.toString(),
        application.termsVersion,
        application.termsAccepted.toString(),
        application.termsAcceptedAt,
        "New",
      ],
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });

    return application.applicationId;
  } catch (error) {
    if (error instanceof ApplicationsNotConfiguredError) {
      throw error;
    }
    throw new ApplicationsUnavailableError();
  }
}