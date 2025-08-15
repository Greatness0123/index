-- Add tool analytics and views
CREATE TABLE IF NOT EXISTS tool_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add tool statistics
CREATE TABLE IF NOT EXISTS tool_stats (
  tool_id UUID PRIMARY KEY REFERENCES tools(id) ON DELETE CASCADE,
  view_count INTEGER DEFAULT 0,
  favorite_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for analytics
CREATE INDEX IF NOT EXISTS idx_tool_views_tool_id ON tool_views(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_views_created_at ON tool_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tool_views_user_id ON tool_views(user_id) WHERE user_id IS NOT NULL;

-- Add trigger to update tool stats when views are added
CREATE OR REPLACE FUNCTION update_tool_stats_on_view()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO tool_stats (tool_id, view_count, last_viewed_at, updated_at)
    VALUES (NEW.tool_id, 1, NEW.created_at, NOW())
    ON CONFLICT (tool_id) 
    DO UPDATE SET 
        view_count = tool_stats.view_count + 1,
        last_viewed_at = NEW.created_at,
        updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tool_stats_on_view_trigger 
    AFTER INSERT ON tool_views
    FOR EACH ROW EXECUTE FUNCTION update_tool_stats_on_view();
