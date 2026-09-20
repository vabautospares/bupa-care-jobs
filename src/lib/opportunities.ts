import { google } from "googleapis";
import type { Opportunity } from "@/lib/types";

export class OpportunitiesNotConfiguredError extends Error {
  constructor() {
    super("Opportunity search is not configured.");
    this.name = "OpportunitiesNotConfiguredError";
  }
}

export class OpportunitiesUnavailableError extends Error {
  constructor() {
    super("Opportunity search is temporarily unavailable.");
    this.name = "OpportunitiesUnavailableError";
  }
}

export interface OpportunityFilters {
  keyword?: string;
  location?: string;
  category?: string;
}

const normalizeHeader = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

const normalizeValue = (value: string) => value.trim().toLowerCase();

const parseBoolean = (value?: string) => {
  if (!value) {
    return true;
  }

  return !["false", "no", "0", "inactive"].includes(value.trim().toLowerCase());
};

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getCellValue = (
  row: string[],
  headers: string[],
  names: string[],
) => {
  const index = headers.findIndex((header) => names.includes(normalizeHeader(header)));
  return index >= 0 ? (row[index]?.trim() ?? "") : "";
};

const toOpportunity = (row: string[], headers: string[]): Opportunity | null => {
  const title = getCellValue(row, headers, ["title", "role", "jobtitle"]);
  const location = getCellValue(row, headers, ["location"]);
  const description = getCellValue(row, headers, ["description", "summary"]);
  const category = getCellValue(row, headers, ["category", "rolecategory"]);
  const employmentType = getCellValue(row, headers, [
    "employmenttype",
    "worktype",
  ]);
  const availability = getCellValue(row, headers, ["availability", "schedule"]);
  const id =
    getCellValue(row, headers, ["id", "opportunityid"]) || slugify(title);

  if (!title || !location) {
    return null;
  }

  return {
    id,
    title,
    location,
    description: description || "Read the role details and continue to apply for support with the next steps.",
    category: category || "Care roles",
    employmentType: employmentType || "Not specified",
    availability: availability || "Not specified",
    active: parseBoolean(getCellValue(row, headers, ["active", "status"])),
  };
};

const matchesFilter = (value: string, filter?: string) => {
  if (!filter) {
    return true;
  }

  return normalizeValue(value).includes(normalizeValue(filter));
};

const matchesCategory = (opportunity: Opportunity, category?: string) => {
  if (!category) {
    return true;
  }

  return (
    normalizeValue(opportunity.category) === normalizeValue(category) ||
    slugify(opportunity.category) === category.toLowerCase()
  );
};

export async function getOpportunities(
  filters: OpportunityFilters = {},
): Promise<Opportunity[]> {
  const spreadsheetId = process.env.GOOGLE_OPPORTUNITIES_SPREADSHEET_ID?.trim();
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.trim();

  if (!spreadsheetId || !serviceAccountEmail || !privateKey) {
    throw new OpportunitiesNotConfiguredError();
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: serviceAccountEmail,
        private_key: privateKey.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const range =
      process.env.GOOGLE_OPPORTUNITIES_RANGE || "Opportunities!A1:H1";
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values ?? [];
    const [headerRow, ...dataRows] = rows;
    const headers = (headerRow ?? []).map(String);

    return dataRows
      .map((row) => toOpportunity(row.map(String), headers))
      .filter((opportunity): opportunity is Opportunity => Boolean(opportunity))
      .filter((opportunity) => opportunity.active)
      .filter(
        (opportunity) =>
          matchesFilter(opportunity.title, filters.keyword) ||
          matchesFilter(opportunity.description, filters.keyword) ||
          matchesFilter(opportunity.category, filters.keyword) ||
          matchesFilter(opportunity.employmentType, filters.keyword),
      )
      .filter((opportunity) =>
        matchesFilter(opportunity.location, filters.location),
      )
      .filter((opportunity) => matchesCategory(opportunity, filters.category))
      .sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    if (error instanceof OpportunitiesNotConfiguredError) {
      throw error;
    }

    console.error("[getOpportunities] error:", error);
    throw new OpportunitiesUnavailableError();
  }
}
