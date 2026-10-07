import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

export const revalidate = 60;

export async function GET(request: NextRequest) {
  if (!APPS_SCRIPT_URL) {
    return NextResponse.json(
      { error: "Opportunity search is not configured yet." },
      { status: 503 },
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const keyword = searchParams.get("keyword")?.trim();
  const location = searchParams.get("location")?.trim();
  const category = searchParams.get("category")?.trim();

  const query = new URLSearchParams();
  if (keyword) query.set("keyword", keyword);
  if (location) query.set("location", location);
  if (category) query.set("category", category);

  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?${query.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    const body = await response.json();

    if (!response.ok || body?.ok === false || body?.error) {
      const message =
        typeof body?.error === "string" ? body.error : "Opportunity search is temporarily unavailable.";
      return NextResponse.json({ error: message }, { status: 502 });
    }

    return NextResponse.json(
      { opportunities: body.opportunities ?? [] },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=30",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Opportunity search is temporarily unavailable." },
      { status: 503 },
    );
  }
}
