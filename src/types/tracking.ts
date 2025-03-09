export interface Visitor {
  id: string;
  first_visit_at: string;
  last_visit_at: string;
  visit_count: number;
  ip_address?: string;
  user_agent?: string;
  browser?: string;
  browser_version?: string;
  os?: string;
  os_version?: string;
  device_type?: string;
  screen_width?: number;
  screen_height?: number;
  country?: string;
  city?: string;
  region?: string;
  timezone?: string;
  language?: string;
  referrer?: string;
  user_id?: string;
}

export interface Visit {
  id: string;
  visitor_id: string;
  started_at: string;
  ended_at?: string;
  duration?: number;
  is_active: boolean;
  entry_page?: string;
  exit_page?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface Pageview {
  id: string;
  visit_id: string;
  visitor_id: string;
  url: string;
  page_title?: string;
  viewed_at: string;
  time_on_page?: number;
  referrer?: string;
  is_exit: boolean;
  is_entrance: boolean;
}

export interface Event {
  id: string;
  visit_id: string;
  visitor_id: string;
  event_type: string;
  event_category?: string;
  event_action?: string;
  event_label?: string;
  event_value?: string;
  page_url?: string;
  component_id?: string;
  occurred_at: string;
  metadata?: Record<string, any>;
}

export interface VisitorWithDetails extends Visitor {
  visits?: Visit[];
  pageviews?: Pageview[];
  events?: Event[];
}

export interface FilterOptions {
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  country?: string;
  browser?: string;
  os?: string;
  device?: string;
  eventType?: string;
  searchTerm?: string;
}
