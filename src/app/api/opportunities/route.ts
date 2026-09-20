import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const revalidate = 60;

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
        console.log(`[opportunities] Attempt ${attempt + 1} failed, retrying in ${retryDelayMs}ms:`, lastError.message);
        await new Promise(resolve => setTimeout(resolve, retryDelayMs));
      }
    }
  }

  throw lastError;
}

export async function GET(request: NextRequest) {
  if (!APPS_SCRIPT_URL) {
    return NextResponse.json(
      { error: "Opportunity search is not configured yet." },
      { status: 503 },
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const url = new URL(APPS_SCRIPT_URL);
  url.search = searchParams.toString();

  try {
    const response = await fetchWithRetry(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
    }, APPS_SCRIPT_TIMEOUT_MS, MAX_RETRIES, RETRY_DELAY_MS);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Opportunity search failed");
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: "Opportunity search timed out. Please try again." },
        { status: 504 },
      );
    }
    return NextResponse.json(
      { error: "Opportunity search is temporarily unavailable." },
      { status: 503 },
    );
  }
}