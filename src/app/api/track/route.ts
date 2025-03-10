import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { 
  createVisitor, 
  createVisit, 
  createPageview, 
  createEvent 
} from "@/lib/tracking";
import { v4 as uuidv4 } from "uuid";

// Helper function to parse browser info from user agent
function parseBrowserInfo(userAgent: string) {
  const ua = userAgent.toLowerCase();

  // Browser detection
  let browser = "Unknown";
  let browserVersion = "";

  if (ua.includes("firefox")) {
    browser = "Firefox";
    browserVersion = ua.match(/firefox\/(\d+(\.\d+)?)/)?.[1] || "";
  } else if (ua.includes("edg")) {
    browser = "Edge";
    browserVersion = ua.match(/edg\/(\d+(\.\d+)?)/)?.[1] || "";
  } else if (ua.includes("chrome")) {
    browser = "Chrome";
    browserVersion = ua.match(/chrome\/(\d+(\.\d+)?)/)?.[1] || "";
  } else if (ua.includes("safari") && !ua.includes("chrome")) {
    browser = "Safari";
    browserVersion = ua.match(/version\/(\d+(\.\d+)?)/)?.[1] || "";
  } else if (ua.includes("opr") || ua.includes("opera")) {
    browser = "Opera";
    browserVersion =
      ua.match(/opr\/(\d+(\.\d+)?)/)?.[1] ||
      ua.match(/version\/(\d+(\.\d+)?)/)?.[1] ||
      "";
  }

  // OS detection
  let os = "Unknown";
  let osVersion = "";

  if (ua.includes("windows")) {
    os = "Windows";
    osVersion = ua.includes("windows nt 10")
      ? "10"
      : ua.includes("windows nt 6.3")
        ? "8.1"
        : ua.includes("windows nt 6.2")
          ? "8"
          : ua.includes("windows nt 6.1")
            ? "7"
            : "";
  } else if (ua.includes("macintosh") || ua.includes("mac os")) {
    os = "macOS";
    osVersion = (ua.match(/mac os x (\d+(_\d+)+)/)?.[1] || "").replace(
      /_/g,
      ".",
    );
  } else if (ua.includes("android")) {
    os = "Android";
    osVersion = ua.match(/android (\d+(\.\d+)?)/)?.[1] || "";
  } else if (
    ua.includes("ios") ||
    ua.includes("iphone") ||
    ua.includes("ipad")
  ) {
    os = "iOS";
    osVersion = (ua.match(/os (\d+(_\d+)+)/)?.[1] || "").replace(/_/g, ".");
  } else if (ua.includes("linux")) {
    os = "Linux";
  }

  // Device type detection
  let deviceType = "Desktop";

  if (ua.includes("mobile")) {
    deviceType = "Mobile";
  } else if (ua.includes("tablet") || ua.includes("ipad")) {
    deviceType = "Tablet";
  }

  return {
    browser,
    browserVersion,
    os,
    osVersion,
    deviceType,
  };
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const payload = await request.json();

    // Check if this is just a ping to test availability
    if (payload.ping === true) {
      return NextResponse.json({
        success: true,
        message: "Tracking API is available",
      });
    }

    // Parse user agent to extract browser, OS, etc.
    const userAgent = payload.user_agent || request.headers.get("user-agent") || "";
    const browserInfo = parseBrowserInfo(userAgent);
    
    let visitorId = payload.visitor_id;
    let visitId: string | undefined;
    
    // Get website ID if tracking code is provided
    let websiteId: string | undefined;
    if (payload.tracking_code) {
      const result = await query(
        "SELECT id FROM websites WHERE tracking_code = $1",
        [payload.tracking_code]
      );
      
      websiteId = result.rows[0]?.id;
      
      // Increment visitor count for the website
      if (websiteId && !payload.visitor_id) {
        await query(
          "UPDATE websites SET visitor_count = visitor_count + 1, updated_at = $1 WHERE id = $2",
          [new Date().toISOString(), websiteId]
        );
      }
    }
    
    // If no visitor ID provided, create or find visitor
    if (!visitorId) {
      // Try to find existing visitor by IP and user agent
      const result = await query(
        "SELECT id FROM visitors WHERE ip_address = $1 AND user_agent = $2",
        [payload.ip_address, userAgent]
      );
      
      if (result.rows.length > 0) {
        visitorId = result.rows[0].id;
        
        // Update visitor's last visit time and increment visit count
        await query(
          "UPDATE visitors SET last_visit_at = $1, visit_count = visit_count + 1 WHERE id = $2",
          [new Date().toISOString(), visitorId]
        );
      } else {
        // Create new visitor
        const newVisitor = await createVisitor({
          ip_address: payload.ip_address,
          user_agent: userAgent,
          browser: browserInfo.browser,
          browser_version: browserInfo.browserVersion,
          os: browserInfo.os,
          os_version: browserInfo.osVersion,
          device_type: browserInfo.deviceType,
          screen_width: payload.screen_width,
          screen_height: payload.screen_height,
          language: payload.language,
          referrer: payload.referrer,
          website_id: websiteId
        });
        
        visitorId = newVisitor.id;
      }
    }
    
    // Find active visit or create new one
    const activeVisitResult = await query(
      "SELECT id FROM visits WHERE visitor_id = $1 AND is_active = true",
      [visitorId]
    );
    
    if (activeVisitResult.rows.length > 0) {
      visitId = activeVisitResult.rows[0].id;
    } else if (visitorId) {
      // Create new visit
      const newVisit = await createVisit(
        visitorId,
        payload.url || "",
        payload.referrer
      );
      
      visitId = newVisit.id;
    }
    
    // Record pageview
    if (payload.url && visitorId && visitId) {
      await createPageview(
        visitId,
        visitorId,
        payload.url,
        payload.page_title,
        payload.referrer,
        websiteId
      );
      
      // Increment pageview count for the website
      if (websiteId) {
        await query(
          "UPDATE websites SET pageview_count = pageview_count + 1, updated_at = $1 WHERE id = $2",
          [new Date().toISOString(), websiteId]
        );
      }
    }
    
    // Record event if provided
    if (payload.event_type && visitorId && visitId) {
      await createEvent(
        visitId,
        visitorId,
        payload.event_type,
        {
          category: payload.event_category,
          action: payload.event_action,
          label: payload.event_label,
          value: payload.event_value,
          pageUrl: payload.url,
          componentId: payload.component_id,
          metadata: payload.metadata,
          websiteId: websiteId
        }
      );
    }
    
    return NextResponse.json({
      success: true,
      visitor_id: visitorId,
      visit_id: visitId
    });
  } catch (error: any) {
    console.error("Error in track API route:", error);
    // Generate a fallback visitor ID if needed
    const fallbackId = uuidv4();
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        fallback: true,
        visitor_id: fallbackId
      }, 
      { status: 200 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
