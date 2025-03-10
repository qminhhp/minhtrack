import { query } from "./db";
import { Visitor } from "@/types/tracking";
import { v4 as uuidv4 } from "uuid";

export async function getVisitors(limit: number = 12) {
  const result = await query(
    "SELECT * FROM visitors ORDER BY last_visit_at DESC LIMIT $1",
    [limit]
  );
  
  return result.rows.map((visitor) => ({
    id: visitor.id,
    first_visit_at: visitor.first_visit_at,
    last_visit_at: visitor.last_visit_at,
    visit_count: visitor.visit_count || 0,
    ip_address: visitor.ip_address || "",
    user_agent: visitor.user_agent || "",
    browser: visitor.browser || "",
    browser_version: visitor.browser_version || "",
    os: visitor.os || "",
    os_version: visitor.os_version || "",
    device_type: visitor.device_type || "",
    screen_width: visitor.screen_width || 0,
    screen_height: visitor.screen_height || 0,
    country: visitor.country || "",
    city: visitor.city || "",
    region: visitor.region || "",
    timezone: visitor.timezone || "",
    language: visitor.language || "",
    referrer: visitor.referrer || "",
    user_id: visitor.user_id || "",
  }));
}

export async function getActiveVisits(limit: number = 5) {
  const result = await query(
    `SELECT 
      v.id as visit_id, 
      v.visitor_id, 
      v.started_at, 
      v.is_active, 
      v.entry_page,
      vis.id as visitor_id,
      vis.first_visit_at,
      vis.last_visit_at,
      vis.visit_count,
      vis.ip_address,
      vis.browser,
      vis.os,
      vis.device_type,
      vis.country,
      vis.city
    FROM visits v
    JOIN visitors vis ON v.visitor_id = vis.id
    WHERE v.is_active = true
    LIMIT $1`,
    [limit]
  );
  
  return result.rows.map((row) => {
    return {
      visitor: {
        id: row.visitor_id,
        first_visit_at: row.first_visit_at,
        last_visit_at: row.last_visit_at,
        visit_count: row.visit_count,
        ip_address: row.ip_address,
        browser: row.browser,
        os: row.os,
        device_type: row.device_type,
        country: row.country,
        city: row.city,
      },
      visit: {
        id: row.visit_id,
        visitor_id: row.visitor_id,
        started_at: row.started_at,
        is_active: row.is_active,
        entry_page: row.entry_page,
      },
      currentPage: row.entry_page,
    };
  });
}

export async function createVisitor(visitorData: Partial<Visitor>) {
  const visitorId = uuidv4();
  
  const result = await query(
    `INSERT INTO visitors (
      id, first_visit_at, last_visit_at, visit_count, ip_address, 
      user_agent, browser, browser_version, os, os_version, 
      device_type, screen_width, screen_height, country, city, 
      region, timezone, language, referrer, user_id, website_id
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 
      $14, $15, $16, $17, $18, $19, $20, $21
    ) RETURNING *`,
    [
      visitorId,
      visitorData.first_visit_at || new Date().toISOString(),
      visitorData.last_visit_at || new Date().toISOString(),
      visitorData.visit_count || 1,
      visitorData.ip_address || null,
      visitorData.user_agent || null,
      visitorData.browser || null,
      visitorData.browser_version || null,
      visitorData.os || null,
      visitorData.os_version || null,
      visitorData.device_type || null,
      visitorData.screen_width || null,
      visitorData.screen_height || null,
      visitorData.country || null,
      visitorData.city || null,
      visitorData.region || null,
      visitorData.timezone || null,
      visitorData.language || null,
      visitorData.referrer || null,
      visitorData.user_id || null,
      visitorData.website_id || null
    ]
  );
  
  return result.rows[0];
}

export async function createVisit(
  visitorId: string, 
  entryPage: string, 
  referrer?: string
) {
  const visitId = uuidv4();
  
  const result = await query(
    `INSERT INTO visits (
      id, visitor_id, started_at, is_active, entry_page, referrer
    ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      visitId,
      visitorId,
      new Date().toISOString(),
      true,
      entryPage,
      referrer || null
    ]
  );
  
  return result.rows[0];
}

export async function createPageview(
  visitId: string,
  visitorId: string,
  url: string,
  pageTitle?: string,
  referrer?: string,
  websiteId?: string
) {
  const pageviewId = uuidv4();
  
  const result = await query(
    `INSERT INTO pageviews (
      id, visit_id, visitor_id, website_id, url, page_title, 
      viewed_at, referrer, is_entrance
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [
      pageviewId,
      visitId,
      visitorId,
      websiteId || null,
      url,
      pageTitle || null,
      new Date().toISOString(),
      referrer || null,
      true
    ]
  );
  
  return result.rows[0];
}

export async function createEvent(
  visitId: string,
  visitorId: string,
  eventType: string,
  eventData: {
    category?: string;
    action?: string;
    label?: string;
    value?: string;
    pageUrl?: string;
    componentId?: string;
    metadata?: any;
    websiteId?: string;
  }
) {
  const eventId = uuidv4();
  
  const result = await query(
    `INSERT INTO events (
      id, visit_id, visitor_id, website_id, event_type, 
      event_category, event_action, event_label, event_value, 
      page_url, component_id, occurred_at, metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
    [
      eventId,
      visitId,
      visitorId,
      eventData.websiteId || null,
      eventType,
      eventData.category || null,
      eventData.action || null,
      eventData.label || null,
      eventData.value || null,
      eventData.pageUrl || null,
      eventData.componentId || null,
      new Date().toISOString(),
      eventData.metadata ? JSON.stringify(eventData.metadata) : null
    ]
  );
  
  return result.rows[0];
}

export async function getVisitorById(id: string) {
  const result = await query("SELECT * FROM visitors WHERE id = $1", [id]);
  return result.rows[0] || null;
}

export async function getVisitsByVisitorId(visitorId: string) {
  const result = await query(
    "SELECT * FROM visits WHERE visitor_id = $1 ORDER BY started_at DESC",
    [visitorId]
  );
  return result.rows;
}

export async function getPageviewsByVisitId(visitId: string) {
  const result = await query(
    "SELECT * FROM pageviews WHERE visit_id = $1 ORDER BY viewed_at ASC",
    [visitId]
  );
  return result.rows;
}

export async function getEventsByVisitId(visitId: string) {
  const result = await query(
    "SELECT * FROM events WHERE visit_id = $1 ORDER BY occurred_at ASC",
    [visitId]
  );
  return result.rows;
}

export async function getVisitorStats() {
  const totalVisitorsResult = await query("SELECT COUNT(*) FROM visitors");
  const totalVisitors = parseInt(totalVisitorsResult.rows[0].count) || 0;
  
  const activeVisitorsResult = await query("SELECT COUNT(*) FROM visits WHERE is_active = true");
  const activeVisitors = parseInt(activeVisitorsResult.rows[0].count) || 0;
  
  const totalPageviewsResult = await query("SELECT COUNT(*) FROM pageviews");
  const totalPageviews = parseInt(totalPageviewsResult.rows[0].count) || 0;
  
  const totalEventsResult = await query("SELECT COUNT(*) FROM events");
  const totalEvents = parseInt(totalEventsResult.rows[0].count) || 0;
  
  // Calculate average time on site (in seconds)
  const avgTimeResult = await query(
    "SELECT AVG(duration) FROM visits WHERE duration IS NOT NULL"
  );
  const avgTimeOnSite = Math.round(parseFloat(avgTimeResult.rows[0]?.avg || "0")) || 0;
  
  return {
    totalVisitors,
    activeVisitors,
    totalPageviews,
    totalEvents,
    avgTimeOnSite,
  };
}
