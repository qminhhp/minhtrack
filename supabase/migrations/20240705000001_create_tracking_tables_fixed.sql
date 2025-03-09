-- Create tracking tables in the correct order

-- First, create visits table without foreign key constraints
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  visit_count INTEGER DEFAULT 1,
  ip_address TEXT,
  user_agent TEXT,
  browser TEXT,
  browser_version TEXT,
  os TEXT,
  os_version TEXT,
  device_type TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  country TEXT,
  city TEXT,
  region TEXT,
  timezone TEXT,
  language TEXT,
  referrer TEXT,
  user_id UUID,
  website_id UUID REFERENCES websites(id) ON DELETE SET NULL
);

-- Create visits table
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  entry_page TEXT,
  exit_page TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT
);

-- Create pageviews table
CREATE TABLE IF NOT EXISTS pageviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  website_id UUID REFERENCES websites(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  page_title TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_on_page INTEGER,
  referrer TEXT,
  is_exit BOOLEAN DEFAULT FALSE,
  is_entrance BOOLEAN DEFAULT FALSE
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
  visitor_id UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
  website_id UUID REFERENCES websites(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_category TEXT,
  event_action TEXT,
  event_label TEXT,
  event_value TEXT,
  page_url TEXT,
  component_id TEXT,
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS visitors_website_id_idx ON visitors(website_id);
CREATE INDEX IF NOT EXISTS pageviews_website_id_idx ON pageviews(website_id);
CREATE INDEX IF NOT EXISTS events_website_id_idx ON events(website_id);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE visitors;
ALTER PUBLICATION supabase_realtime ADD TABLE visits;
ALTER PUBLICATION supabase_realtime ADD TABLE pageviews;
ALTER PUBLICATION supabase_realtime ADD TABLE events;
