-- Create a function to increment a column value
CREATE OR REPLACE FUNCTION increment(row_id UUID, table_name TEXT, column_name TEXT)
RETURNS INTEGER AS $$
DECLARE
  current_value INTEGER;
  new_value INTEGER;
BEGIN
  EXECUTE format('SELECT %I FROM %I WHERE id = $1', column_name, table_name)
  INTO current_value
  USING row_id;
  
  new_value := current_value + 1;
  
  RETURN new_value;
END;
$$ LANGUAGE plpgsql;
