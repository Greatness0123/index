-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS increment_click_count(UUID);

-- Create the increment_click_count function with proper column qualification
CREATE OR REPLACE FUNCTION increment_click_count(p_tool_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Added proper table alias to avoid ambiguous column reference
  -- Update the click count in tool_stats table
  INSERT INTO tool_stats (tool_id, click_count, updated_at)
  VALUES (p_tool_id, 1, NOW())
  ON CONFLICT (tool_id)
  DO UPDATE SET 
    click_count = tool_stats.click_count + 1,
    updated_at = NOW();
    
  -- Also insert a click tracking record
  INSERT INTO tool_clicks (tool_id, clicked_at)
  VALUES (p_tool_id, NOW());
END;
$$;

-- Create tool_clicks table if it doesn't exist
CREATE TABLE IF NOT EXISTS tool_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_tool_clicks_tool_id ON tool_clicks(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_clicks_clicked_at ON tool_clicks(clicked_at);
