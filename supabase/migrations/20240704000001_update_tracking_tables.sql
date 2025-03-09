-- Add website_id to visitors table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'visitors' AND column_name = 'website_id') THEN
    ALTER TABLE visitors ADD COLUMN website_id UUID REFERENCES websites(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add website_id to pageviews table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'pageviews' AND column_name = 'website_id') THEN
    ALTER TABLE pageviews ADD COLUMN website_id UUID REFERENCES websites(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add website_id to events table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'events' AND column_name = 'website_id') THEN
    ALTER TABLE events ADD COLUMN website_id UUID REFERENCES websites(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create index on website_id for faster queries
CREATE INDEX IF NOT EXISTS visitors_website_id_idx ON visitors(website_id);
CREATE INDEX IF NOT EXISTS pageviews_website_id_idx ON pageviews(website_id);
CREATE INDEX IF NOT EXISTS events_website_id_idx ON events(website_id);

-- Add tracking_code to websites table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'websites' AND column_name = 'tracking_code') THEN
    ALTER TABLE websites ADD COLUMN tracking_code TEXT;
  END IF;
END $$;

-- Create index on tracking_code for faster lookups
CREATE INDEX IF NOT EXISTS websites_tracking_code_idx ON websites(tracking_code);
