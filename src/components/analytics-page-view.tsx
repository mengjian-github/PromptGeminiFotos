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

  return null;
}
