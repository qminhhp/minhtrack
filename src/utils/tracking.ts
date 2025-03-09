/**
 * Generates a unique tracking code for a website
 * @param userId The user ID to include in the tracking code
 * @returns A unique tracking code string
 */
export function generateTrackingCode(userId: string): string {
  // Create a unique ID based on timestamp and random values
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);

  // Use first 8 chars of userId to make it shorter but still unique per user
  const shortUserId = userId.replace(/-/g, "").substring(0, 8);

  return `${timestamp}${randomStr}${shortUserId}`;
}

/**
 * Generates the tracking script HTML to be embedded in websites
 * @param trackingCode The unique tracking code for the website
 * @param apiUrl The API URL for the tracking endpoint
 * @returns HTML script tag with tracking code
 */
export function generateTrackingScript(
  trackingCode: string,
  apiUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || "",
): string {
  // Use the local API route instead of direct Supabase function call
  // This avoids CORS issues by proxying the request through our Next.js API
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const trackingEndpoint = `${origin}/api/track`;

  return `<script>
  (function() {
    // TrackMaster tracking script
    const trackingCode = "${trackingCode}";
    const apiUrl = "${trackingEndpoint}";
    
    // Store visitor data
    let visitorId = localStorage.getItem("tm_visitor_id");
    let sessionStartTime = Date.now();
    let lastActivityTime = sessionStartTime;
    let currentPage = window.location.href;
    
    // Track page view
    function trackPageView() {
      const data = {
        tracking_code: trackingCode,
        visitor_id: visitorId,
        url: window.location.href,
        page_title: document.title,
        referrer: document.referrer,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        language: navigator.language,
        event_type: "pageview"
      };
      
      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        keepalive: true
      })
      .then(response => response.json())
      .then(result => {
        if (result.visitor_id && !visitorId) {
          visitorId = result.visitor_id;
          localStorage.setItem("tm_visitor_id", visitorId);
        }
      })
      .catch(error => console.error("Tracking error:", error));
    }
    
    // Track user interactions
    function trackEvent(event) {
      const target = event.target;
      
      // Only track clicks on interactive elements
      if (target.tagName === "A" || target.tagName === "BUTTON" || 
          target.closest("a") || target.closest("button") || 
          target.getAttribute("role") === "button") {
        
        const element = target.tagName === "A" || target.tagName === "BUTTON" ? 
                        target : target.closest("a") || target.closest("button");
        
        if (!element) return;
        
        const linkUrl = element.tagName === "A" ? element.href : null;
        const elementText = element.textContent?.trim();
        const elementId = element.id || null;
        
        const data = {
          tracking_code: trackingCode,
          visitor_id: visitorId,
          url: window.location.href,
          event_type: "click",
          event_category: "interaction",
          event_action: "click",
          event_label: elementText || "unknown",
          component_id: elementId,
          metadata: {
            element_type: element.tagName.toLowerCase(),
            link_url: linkUrl,
            element_classes: element.className
          }
        };
        
        fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          keepalive: true
        }).catch(error => console.error("Tracking error:", error));
      }
      
      // Update last activity time
      lastActivityTime = Date.now();
    }
    
    // Track when user leaves the page
    function trackExit() {
      if (!visitorId) return;
      
      const timeOnPage = Math.floor((Date.now() - sessionStartTime) / 1000);
      
      const data = {
        tracking_code: trackingCode,
        visitor_id: visitorId,
        url: currentPage,
        event_type: "exit",
        event_category: "navigation",
        event_action: "exit",
        event_label: "Time on page: " + timeOnPage + "s",
        metadata: {
          time_on_page: timeOnPage,
          next_url: document.activeElement?.tagName === "A" ? 
                   document.activeElement.href : null
        }
      };
      
      // Use sendBeacon for more reliable exit tracking
      if (navigator.sendBeacon) {
        navigator.sendBeacon(apiUrl, JSON.stringify(data));
      } else {
        fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          keepalive: true
        }).catch(() => {});
      }
    }
    
    // Initialize tracking
    trackPageView();
    
    // Set up event listeners
    window.addEventListener("click", trackEvent);
    window.addEventListener("beforeunload", trackExit);
    
    // Handle history changes for SPAs
    let lastUrl = window.location.href;
    const handleUrlChange = () => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        currentPage = currentUrl;
        sessionStartTime = Date.now();
        trackPageView();
      }
    };
    
    // Check for URL changes
    window.addEventListener("popstate", handleUrlChange);
    const originalPushState = history.pushState;
    history.pushState = function() {
      originalPushState.apply(this, arguments);
      handleUrlChange();
    };
    
    // Heartbeat to track session duration
    setInterval(() => {
      if (Date.now() - lastActivityTime > 30 * 60 * 1000) { // 30 minutes of inactivity
        trackExit();
      }
    }, 60 * 1000); // Check every minute
  })();
</script>`;
}
