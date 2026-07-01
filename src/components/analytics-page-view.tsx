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

  return null;
}
