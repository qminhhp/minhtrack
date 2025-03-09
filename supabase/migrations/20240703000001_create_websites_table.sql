-- Create websites table
CREATE TABLE IF NOT EXISTS websites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  tracking_code TEXT,
  visitor_count INTEGER DEFAULT 0,
  pageview_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS websites_user_id_idx ON websites(user_id);

-- Enable RLS
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Users can view their own websites" ON websites;
CREATE POLICY "Users can view their own websites"
  ON websites FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own websites" ON websites;
CREATE POLICY "Users can insert their own websites"
  ON websites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own websites" ON websites;
CREATE POLICY "Users can update their own websites"
  ON websites FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own websites" ON websites;
CREATE POLICY "Users can delete their own websites"
  ON websites FOR DELETE
  USING (auth.uid() = user_id);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE websites;
