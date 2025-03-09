-- Create a cron job to run the cleanup function daily
-- This will automatically delete unverified users after 1 day

-- First, enable the pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a function to invoke our edge function
CREATE OR REPLACE FUNCTION invoke_cleanup_unverified_users()
RETURNS void AS $$
DECLARE
  supabase_url text;
  service_role_key text;
  result json;
BEGIN
  -- Get the Supabase URL and service role key from your environment variables or configuration
  -- These would be set in your Supabase project settings
  SELECT current_setting('app.settings.supabase_url') INTO supabase_url;
  SELECT current_setting('app.settings.service_role_key') INTO service_role_key;
  
  -- Make an HTTP request to the edge function
  SELECT content INTO result FROM http_post(
    supabase_url || '/functions/v1/cleanup-unverified-users',
    '{}',
    'application/json',
    ARRAY[
      ('Authorization', 'Bearer ' || service_role_key)::http_header
    ]
  );
  
  -- Log the result
  RAISE NOTICE 'Cleanup unverified users result: %', result;
  
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Schedule the function to run daily at 3:00 AM UTC
SELECT cron.schedule(
  'cleanup-unverified-users',
  '0 3 * * *',
  $$SELECT invoke_cleanup_unverified_users()$$
);
