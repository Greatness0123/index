-- Fix the ambiguous column reference in update_tool_statistics function
-- by properly qualifying all column references with table names

-- Drop the existing function first
DROP FUNCTION IF EXISTS update_tool_statistics(uuid);

-- Create a new function with properly qualified column references
CREATE OR REPLACE FUNCTION update_tool_statistics(target_tool_id uuid)
RETURNS void AS $$
BEGIN
  -- Update tool_stats table with properly qualified column references
  INSERT INTO tool_stats (tool_id, comment_count, favorite_count, view_count, click_count, updated_at)
  VALUES (
    target_tool_id,
    (SELECT COUNT(*) FROM comments WHERE comments.tool_id = target_tool_id AND comments.is_approved = true),
    (SELECT COUNT(*) FROM user_favorites WHERE user_favorites.tool_id = target_tool_id),
    (SELECT COUNT(*) FROM tool_views WHERE tool_views.tool_id = target_tool_id),
    (SELECT COALESCE(SUM(click_count), 0) FROM tool_stats WHERE tool_stats.tool_id = target_tool_id),
    NOW()
  )
  ON CONFLICT (tool_id) 
  DO UPDATE SET
    comment_count = (SELECT COUNT(*) FROM comments WHERE comments.tool_id = target_tool_id AND comments.is_approved = true),
    favorite_count = (SELECT COUNT(*) FROM user_favorites WHERE user_favorites.tool_id = target_tool_id),
    view_count = (SELECT COUNT(*) FROM tool_views WHERE tool_views.tool_id = target_tool_id),
    updated_at = NOW();

  -- Update average rating in tools table with properly qualified column references
  UPDATE tools 
  SET 
    rating = COALESCE((
      SELECT ROUND(AVG(comments.rating)::numeric, 1) 
      FROM comments 
      WHERE comments.tool_id = target_tool_id 
        AND comments.is_approved = true 
        AND comments.rating IS NOT NULL
    ), 0),
    rating_count = COALESCE((
      SELECT COUNT(*) 
      FROM comments 
      WHERE comments.tool_id = target_tool_id 
        AND comments.is_approved = true 
        AND comments.rating IS NOT NULL
    ), 0)
  WHERE tools.id = target_tool_id;
END;
$$ LANGUAGE plpgsql;

-- Also fix the increment_click_count function if it exists
DROP FUNCTION IF EXISTS increment_click_count(uuid);

CREATE OR REPLACE FUNCTION increment_click_count(target_tool_id uuid)
RETURNS void AS $$
BEGIN
  -- Insert or update click count with properly qualified column references
  INSERT INTO tool_stats (tool_id, click_count, updated_at)
  VALUES (target_tool_id, 1, NOW())
  ON CONFLICT (tool_id)
  DO UPDATE SET
    click_count = tool_stats.click_count + 1,
    updated_at = NOW();
    
  -- Also insert into tool_clicks for tracking
  INSERT INTO tool_clicks (tool_id, clicked_at)
  VALUES (target_tool_id, NOW());
END;
$$ LANGUAGE plpgsql;
