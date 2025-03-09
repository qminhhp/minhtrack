-- Create visitors table to store unique visitor information
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
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create visits table to track individual sessions
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE,
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

-- Create pageviews table to track individual page visits
CREATE TABLE IF NOT EXISTS pageviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  page_title TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  time_on_page INTEGER,
  referrer TEXT,
  is_exit BOOLEAN DEFAULT FALSE,
  is_entrance BOOLEAN DEFAULT FALSE
);

-- Create events table to track user interactions
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
  visitor_id UUID REFERENCES visitors(id) ON DELETE CASCADE,
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

-- Enable RLS but with permissive policies for now
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE pageviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to view all data
DROP POLICY IF EXISTS "Authenticated users can view all visitors" ON visitors;
CREATE POLICY "Authenticated users can view all visitors"
  ON visitors FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can view all visits" ON visits;
CREATE POLICY "Authenticated users can view all visits"
  ON visits FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can view all pageviews" ON pageviews;
CREATE POLICY "Authenticated users can view all pageviews"
  ON pageviews FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can view all events" ON events;
CREATE POLICY "Authenticated users can view all events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for service role to insert data
DROP POLICY IF EXISTS "Service role can insert visitors" ON visitors;
CREATE POLICY "Service role can insert visitors"
  ON visitors FOR INSERT
  TO service_role
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can insert visits" ON visits;
CREATE POLICY "Service role can insert visits"
  ON visits FOR INSERT
  TO service_role
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can insert pageviews" ON pageviews;
CREATE POLICY "Service role can insert pageviews"
  ON pageviews FOR INSERT
  TO service_role
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can insert events" ON events;
CREATE POLICY "Service role can insert events"
  ON events FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Enable realtime for all tables
alter publication supabase_realtime add table visitors;
alter publication supabase_realtime add table visits;
alter publication supabase_realtime add table pageviews;
alter publication supabase_realtime add table events;