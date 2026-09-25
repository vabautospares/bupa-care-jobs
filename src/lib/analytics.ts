const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const isConfigured = Boolean(measurementId);

type AnalyticsValue = string | number | boolean;

function sendEvent(event: string, params: Record<string, AnalyticsValue>): void {
  if (!isConfigured || typeof window === "undefined") {
    return;
  }

  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;

  if (typeof gtag !== "function") {
    return;
  }

  try {
    gtag("event", event, params);
  } catch {
    return;
  }
}

export function trackPageView(pagePath: string): void {
  if (!isConfigured || typeof window === "undefined") {
    return;
  }

  sendEvent("page_view", {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function trackViewJob(jobTitle: string, location: string): void {
  sendEvent("view_job", { job_title: jobTitle, job_location: location });
}

export function trackApplyClick(jobTitle: string, location: string): void {
  sendEvent("apply_click", { job_title: jobTitle, job_location: location });
}

export function trackApplicationStart(role?: string): void {
  sendEvent("application_start", role ? { job_title: role } : {});
}

export function trackApplicationSubmit(supportTerm: string): void {
  sendEvent("application_submit", { support_term: supportTerm });
}

export function trackWhatsAppClick(location: string): void {
  sendEvent("whatsapp_click", { location });
}

export function trackEmailClick(location: string): void {
  sendEvent("email_click", { location });
}