import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { validateApplicationFormData } from "@/lib/application-validation";
import { getTermsVersion } from "@/lib/config";
import { SERVICE_PLANS } from "@/lib/service-plans";
import type { Application } from "@/lib/types";

export const dynamic = "force-dynamic";

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;
const APPS_SCRIPT_TIMEOUT_MS = 45000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 2000;

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchWithRetry(url: string, options: RequestInit, timeoutMs: number, maxRetries: number, retryDelayMs: number): Promise<Response> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, options, timeoutMs);
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (error instanceof Error && error.name === 'AbortError') {
        // Don't retry on timeout - fail fast
        throw error;
      }

      if (attempt < maxRetries) {
        console.log(`[applications] Attempt ${attempt + 1} failed, retrying in ${retryDelayMs}ms:`, lastError.message);
        await new Promise(resolve => setTimeout(resolve, retryDelayMs));
      }
    }
  }

  throw lastError;
}

export async function POST(request: NextRequest) {
  if (!APPS_SCRIPT_URL) {
    return NextResponse.json(
      { error: "Application service is not configured yet." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const result = validateApplicationFormData(body as Parameters<typeof validateApplicationFormData>[0]);

  if (Object.keys(result.errors).length) {
    return NextResponse.json(
      { error: "Check the highlighted fields.", fields: result.errors },
      { status: 400 },
    );
  }

  const plan = SERVICE_PLANS.find((p) => p.id === result.data?.selectedPlan)!;
  const termsVersion = getTermsVersion();
  const applicationId = randomUUID();
  const submittedAt = new Date().toISOString();

  const application: Application = {
    applicationId,
    submittedAt,
    fullName: result.data!.fullName,
    email: result.data!.email,
    phone: result.data!.phone,
    whatsapp: result.data!.whatsapp,
    country: result.data!.country,
    ukLocation: result.data!.ukLocation || undefined,
    role: result.data!.role,
    preferredLocation: result.data!.preferredLocation,
    workType: result.data!.workType,
    employmentPreference: result.data!.employmentPreference,
    availability: result.data!.availability,
    careExperience: result.data!.careExperience,
    yearsExperience: result.data!.yearsExperience,
    qualifications: result.data!.qualifications,
    employmentStatus: result.data!.employmentStatus,
    cvReference: "",
    certificateReferences: [],
    selectedPlan: result.data!.selectedPlan,
    initialPaymentPence: plan.initialPaymentPence,
    termsVersion,
    termsAccepted: true,
    termsAcceptedAt: submittedAt,
    status: "New",
  };

  try {
    console.log('[applications] Starting request to Apps Script');
    const startTime = Date.now();

    const response = await fetchWithRetry(APPS_SCRIPT_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(application),
    }, APPS_SCRIPT_TIMEOUT_MS, MAX_RETRIES, RETRY_DELAY_MS);

    console.log('[applications] Apps Script response received', {
      status: response.status,
      duration: Date.now() - startTime,
    });

    const data = await response.json();

    console.log('[applications] Apps Script response data:', data);

    if (!response.ok) {
      throw new Error(data.error || "Application submission failed");
    }

    return NextResponse.json(
      { message: "Application submitted successfully.", applicationId },
      { status: 201 },
    );
  } catch (error) {
    console.error('[applications] Error:', error);

    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: "Application submission timed out. Please try again." },
        { status: 504 },
      );
    }

    return NextResponse.json(
      { error: "Application submission failed. Please try again." },
      { status: 503 },
    );
  }
}