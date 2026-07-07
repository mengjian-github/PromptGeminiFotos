type AnalyticsEvent =
  | 'page_view'
  | 'conversion_goal'
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
  | 'tool_start'
  | 'tool_result'
  | 'pricing_cta_click'
  | 'generator_prefill'
  | 'image_upload_start'
  | 'image_upload_success'
  | 'image_upload_error'
  | 'upgrade_cta_click'
  | 'engagement'
  | 'page_scroll_depth';

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

function isGtagAvailable(): boolean {
  return typeof window !== 'undefined' && typeof (window as any).gtag === 'function';
}

function isPlausibleAvailable(): boolean {
  return typeof window !== 'undefined' && typeof (window as any).plausible === 'function';
}

function dispatchAnalyticsEvent(event: AnalyticsEvent, params: EventParams): void {
  if (isGtagAvailable()) {
    try {
      (window as any).gtag('event', event, {
        ...params,
        event_category: params.category ? String(params.category) : 'prompt_workflow',
        event_label: event,
      });
    } catch {
      // silent fail
    }
  }

  if (isPlausibleAvailable()) {
    try {
      (window as any).plausible(event, { props: params });
    } catch {
      // silent fail
    }
  }
}

const EVENT_ALIASES: Partial<Record<AnalyticsEvent, AnalyticsEvent[]>> = {
  generator_start: ['tool_start'],
  generate_complete: ['tool_result'],
  prompt_copy: ['conversion_goal'],
  gemini_outbound_click: ['conversion_goal'],
};

/**
 * Fire analytics events to both GA4 and Plausible (self-hosted).
 * Safe to call from client components; no-ops if trackers unavailable.
 */
export function trackEvent(event: AnalyticsEvent, params?: EventParams): void {
  if (typeof window === 'undefined') return;

  const safeParams = params ?? {};
  const events: AnalyticsEvent[] = [event, ...(EVENT_ALIASES[event] ?? [])];

  events.forEach((eventName) => {
    dispatchAnalyticsEvent(eventName, {
      ...safeParams,
      original_event: eventName === event ? undefined : event,
    });
  });
}

/**
 * Track page engagement milestones (e.g. scroll depth, time on page).
 * Called automatically by layout if needed; exposed for manual use.
 */
export function trackEngagement(milestone: string): void {
  trackEvent('engagement' as AnalyticsEvent, { milestone });
}
