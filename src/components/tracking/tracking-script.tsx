"use client";

import { useEffect } from "react";
import { createClient } from "../../../supabase/client";

export default function TrackingScript() {
  useEffect(() => {
    // Skip tracking for admin users or in development
    if (
      process.env.NODE_ENV === "development" &&
      !process.env.NEXT_PUBLIC_ENABLE_DEV_TRACKING
    ) {
      return;
    }

    const supabase = createClient();
    let visitorId = localStorage.getItem("visitor_id");
    let lastPageUrl = "";
    let pageLoadTime = Date.now();

    // Track page view
    const trackPageView = async () => {
      const currentUrl = window.location.href;
      if (currentUrl === lastPageUrl) return;

      lastPageUrl = currentUrl;
      pageLoadTime = Date.now();

      try {
        // Use the API route instead of direct function invocation
        const response = await fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitor_id: visitorId,
            url: currentUrl,
            page_title: document.title,
            referrer: document.referrer,
            screen_width: window.screen.width,
            screen_height: window.screen.height,
            language: navigator.language,
          }),
        });

        if (!response.ok) {
          console.error(
            "Error tracking page view: API responded with status",
            response.status,
          );
          return;
        }

        const data = await response.json();

        if (data?.visitor_id && !visitorId) {
          visitorId = data.visitor_id;
          localStorage.setItem("visitor_id", visitorId as string);
        }
      } catch (err) {
        console.error("Failed to track page view:", err);
      }
    };

    // Track user interactions
    const trackEvent = async (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      // Only track clicks on interactive elements
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.getAttribute("role") === "button"
      ) {
        const element =
          target.tagName === "A" || target.tagName === "BUTTON"
            ? target
            : target.closest("a") || target.closest("button");

        if (!element) return;

        const linkUrl =
          element.tagName === "A" ? (element as HTMLAnchorElement).href : null;

        const elementText = element.textContent?.trim();
        const elementId = element.id || null;
        const elementClasses = element.className || null;

        try {
          // Use the API route instead of direct function invocation
          await fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              visitor_id: visitorId,
              url: window.location.href,
              event_type: "click",
              event_category: "interaction",
              event_action: "click",
              event_label: elementText || "unknown",
              component_id: elementId || elementClasses,
              metadata: {
                element_type: element.tagName.toLowerCase(),
                link_url: linkUrl,
                element_classes: elementClasses,
              },
            }),
          });
        } catch (err) {
          console.error("Failed to track event:", err);
        }
      }
    };

    // Track when user leaves the page
    const trackExit = async () => {
      if (!visitorId) return;

      const timeOnPage = Math.floor((Date.now() - pageLoadTime) / 1000);

      try {
        // Use sendBeacon for more reliable tracking on page exit
        const payload = {
          visitor_id: visitorId,
          url: lastPageUrl,
          event_type: "exit",
          event_category: "navigation",
          event_action: "exit",
          event_label: `Time on page: ${timeOnPage}s`,
          metadata: {
            time_on_page: timeOnPage,
            next_url:
              document.activeElement?.tagName === "A"
                ? (document.activeElement as HTMLAnchorElement).href
                : null,
          },
        };

        // Try to use navigator.sendBeacon with our API route
        const blob = new Blob([JSON.stringify(payload)], {
          type: "application/json",
        });
        const sent = navigator.sendBeacon("/api/track", blob);

        // Fall back to regular fetch if sendBeacon fails or isn't available
        if (!sent) {
          await fetch("/api/track", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            keepalive: true,
          });
        }
      } catch (err) {
        console.error("Failed to track exit:", err);
      }
    };

    // Initialize tracking
    trackPageView();

    // Set up event listeners
    window.addEventListener("click", trackEvent);
    window.addEventListener("beforeunload", trackExit);

    // Clean up event listeners
    return () => {
      window.removeEventListener("click", trackEvent);
      window.removeEventListener("beforeunload", trackExit);
    };
  }, []);

  return null;
}
