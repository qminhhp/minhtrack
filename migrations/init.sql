-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE,
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  reset_password_token VARCHAR(255),
  reset_password_expires TIMESTAMP WITH TIME ZONE
);

-- Websites table
CREATE TABLE IF NOT EXISTS websites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  url VARCHAR(255) NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE,
  tracking_code VARCHAR(255),
  visitor_count INTEGER DEFAULT 0,
  pageview_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- Visitors table
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_visit_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_visit_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  visit_count INTEGER DEFAULT 1,
  ip_address VARCHAR(45),
  user_agent TEXT,
  browser VARCHAR(100),
  browser_version VARCHAR(50),
  os VARCHAR(100),
  os_version VARCHAR(50),
  device_type VARCHAR(50),
  screen_width INTEGER,
  screen_height INTEGER,
  country VARCHAR(100),
  city VARCHAR(100),
  region VARCHAR(100),
  timezone VARCHAR(100),
  language VARCHAR(50),
  referrer TEXT,
  user_id UUID,
  website_id UUID REFERENCES websites(id) ON DELETE CASCADE
);

-- Visits table
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  entry_page TEXT,
  exit_page TEXT,
  referrer TEXT,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_term VARCHAR(255),
  utm_content VARCHAR(255)
);

-- Pageviews table
CREATE TABLE IF NOT EXISTS pageviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  page_title TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  time_on_page INTEGER,
  referrer TEXT,
  is_entrance BOOLEAN DEFAULT FALSE,
  is_exit BOOLEAN DEFAULT FALSE
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  website_id UUID REFERENCES websites(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  event_category VARCHAR(100),
  event_action VARCHAR(100),
  event_label VARCHAR(255),
  event_value VARCHAR(255),
  page_url TEXT,
  component_id VARCHAR(255),
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB
);

-- Indexes for better performance
CREATE INDEX idx_visitors_website_id ON visitors(website_id);
CREATE INDEX idx_visits_visitor_id ON visits(visitor_id);
CREATE INDEX idx_pageviews_visit_id ON pageviews(visit_id);
CREATE INDEX idx_pageviews_visitor_id ON pageviews(visitor_id);
CREATE INDEX idx_events_visit_id ON events(visit_id);
CREATE INDEX idx_events_visitor_id ON events(visitor_id);
CREATE INDEX idx_events_event_type ON events(event_type);
