type AnalyticsEvent =
  | 'page_view'
  | 'generator_start'
  | 'generate_complete'
  | 'generate_error'
  | 'prompt_copy'
  | 'download_click'
  | 'template_open'
  | 'gemini_outbound_click'
  | 'template_select'
  | 'hero_cta_click'
  | 'secondary_cta_click'
  | 'image_upload_start'
  | 'image_upload_success'
  | 'image_upload_error'
  | 'upgrade_cta_click'
  | 'engagement';

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

function isGtagAvailable(): boolean {
  return typeof window !== 'undefined' && typeof (window as any).gtag === 'function';
}

function isPlausibleAvailable(): boolean {
  return typeof window !== 'undefined' && typeof (window as any).plausible === 'function';
}

/**
 * Fire analytics events to both GA4 and Plausible (self-hosted).
 * Safe to call from client components; no-ops if trackers unavailable.
 */
export function trackEvent(event: AnalyticsEvent, params?: EventParams): void {
  if (typeof window === 'undefined') return;

  const safeParams = params ?? {};

  // GA4 via gtag
  if (isGtagAvailable()) {
    try {
      (window as any).gtag('event', event, {
        ...safeParams,
        event_category: safeParams.category ? String(safeParams.category) : 'prompt_workflow',
        event_label: event,
      });
    } catch {
      // silent fail
    }
  }

  // Plausible
  if (isPlausibleAvailable()) {
    try {
      (window as any).plausible(event, { props: safeParams });
    } catch {
      // silent fail
    }
  }
}

/**
 * Track page engagement milestones (e.g. scroll depth, time on page).
 * Called automatically by layout if needed; exposed for manual use.
 */
export function trackEngagement(milestone: string): void {
  trackEvent('engagement' as AnalyticsEvent, { milestone });
}
