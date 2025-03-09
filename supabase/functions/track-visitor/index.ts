// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.com/manual/examples/supabase-functions

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface TrackingPayload {
  ip_address?: string;
  user_agent?: string;
  url: string;
  page_title?: string;
  referrer?: string;
  screen_width?: number;
  screen_height?: number;
  language?: string;
  visitor_id?: string;
  tracking_code?: string;
  event_type?: string;
  event_category?: string;
  event_action?: string;
  event_label?: string;
  event_value?: string;
  component_id?: string;
  metadata?: Record<string, any>;
}

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
        "Access-Control-Max-Age": "86400",
      },
      status: 200,
    });
  }

  try {
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get("SUPABASE_URL") ?? "",
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      // Create client with Auth context of the user that called the function.
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    const payload: TrackingPayload = await req.json();

    // Parse user agent to extract browser, OS, etc.
    const userAgent = payload.user_agent || req.headers.get("user-agent") || "";
    const browserInfo = parseBrowserInfo(userAgent);

    let visitorId = payload.visitor_id;
    let visitId: string | undefined;

    // Get website ID if tracking code is provided
    let websiteId: string | undefined;
    if (payload.tracking_code) {
      const { data: website } = await supabaseClient
        .from("websites")
        .select("id")
        .eq("tracking_code", payload.tracking_code)
        .maybeSingle();

      websiteId = website?.id;

      // Increment visitor count for the website
      if (websiteId && !payload.visitor_id) {
        await supabaseClient
          .from("websites")
          .update({
            visitor_count: supabaseClient.rpc("increment", {
              row_id: websiteId,
              table_name: "websites",
              column_name: "visitor_count",
            }),
            updated_at: new Date().toISOString(),
          })
          .eq("id", websiteId);
      }
    }

    // If no visitor ID provided, create or find visitor
    if (!visitorId) {
      // Try to find existing visitor by IP and user agent
      const { data: existingVisitor } = await supabaseClient
        .from("visitors")
        .select("id")
        .eq("ip_address", payload.ip_address)
        .eq("user_agent", userAgent)
        .maybeSingle();

      if (existingVisitor) {
        visitorId = existingVisitor.id;

        // Update visitor's last visit time and increment visit count
        await supabaseClient
          .from("visitors")
          .update({
            last_visit_at: new Date().toISOString(),
            visit_count: supabaseClient.rpc("increment", {
              row_id: visitorId,
              table_name: "visitors",
              column_name: "visit_count",
            }),
          })
          .eq("id", visitorId);
      } else {
        // Create new visitor
        const { data: newVisitor, error } = await supabaseClient
          .from("visitors")
          .insert({
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
            website_id: websiteId,
          })
          .select("id")
          .single();

        if (error) throw error;
        visitorId = newVisitor.id;
      }
    }

    // Find active visit or create new one
    const { data: activeVisit } = await supabaseClient
      .from("visits")
      .select("id")
      .eq("visitor_id", visitorId)
      .eq("is_active", true)
      .maybeSingle();

    if (activeVisit) {
      visitId = activeVisit.id;
    } else {
      // Create new visit
      const { data: newVisit, error } = await supabaseClient
        .from("visits")
        .insert({
          visitor_id: visitorId,
          entry_page: payload.url,
          referrer: payload.referrer,
        })
        .select("id")
        .single();

      if (error) throw error;
      visitId = newVisit.id;
    }

    // Record pageview
    if (payload.url) {
      await supabaseClient.from("pageviews").insert({
        visit_id: visitId,
        visitor_id: visitorId,
        website_id: websiteId,
        url: payload.url,
        page_title: payload.page_title,
        referrer: payload.referrer,
        is_entrance: !activeVisit, // Mark as entrance if this is a new visit
      });

      // Increment pageview count for the website
      if (websiteId) {
        await supabaseClient
          .from("websites")
          .update({
            pageview_count: supabaseClient.rpc("increment", {
              row_id: websiteId,
              table_name: "websites",
              column_name: "pageview_count",
            }),
            updated_at: new Date().toISOString(),
          })
          .eq("id", websiteId);
      }
    }

    // Record event if provided
    if (payload.event_type) {
      await supabaseClient.from("events").insert({
        visit_id: visitId,
        visitor_id: visitorId,
        website_id: websiteId,
        event_type: payload.event_type,
        event_category: payload.event_category,
        event_action: payload.event_action,
        event_label: payload.event_label,
        event_value: payload.event_value,
        page_url: payload.url,
        component_id: payload.component_id,
        metadata: payload.metadata,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        visitor_id: visitorId,
        visit_id: visitId,
      }),
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers":
            "authorization, x-client-info, apikey, content-type",
          "Content-Type": "application/json",
        },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
        "Content-Type": "application/json",
      },
      status: 400,
    });
  }
});

function parseBrowserInfo(userAgent: string) {
  // This is a simplified version - in production you'd use a more robust library
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
