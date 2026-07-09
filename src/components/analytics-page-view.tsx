"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

export function AnalyticsPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    trackEvent("page_view", {
      path: pathname,
      query: window.location.search || undefined,
      locale: document.documentElement.lang || undefined,
    });
  }, [pathname]);

  useEffect(() => {
    if (!pathname) return;

    const reached = new Set<number>();
    const thresholds = [50, 90];

    const onScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const depth = Math.round((window.scrollY / scrollable) * 100);
      thresholds.forEach((threshold) => {
        if (depth >= threshold && !reached.has(threshold)) {
          reached.add(threshold);
          trackEvent("page_scroll_depth", {
            path: pathname,
            depth: threshold,
            locale: document.documentElement.lang || undefined,
          });
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    if (!pathname || typeof window === 'undefined') return;

    const reached = new Set<number>();
    const thresholds = [10, 30, 60, 120, 180, 300];
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      thresholds.forEach((threshold) => {
        if (elapsed >= threshold && !reached.has(threshold)) {
          reached.add(threshold);
          trackEvent('engagement_time', {
            path: pathname,
            seconds: threshold,
            locale: document.documentElement.lang || undefined,
          });
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [pathname]);

  return null;
}
