-- Function to increment click count for tools
CREATE OR REPLACE FUNCTION increment_click_count(tool_id UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO tool_stats (tool_id, click_count, updated_at)
    VALUES (tool_id, 1, NOW())
    ON CONFLICT (tool_id) 
    DO UPDATE SET 
        click_count = tool_stats.click_count + 1,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to update tool rating when comments are added/updated
CREATE OR REPLACE FUNCTION update_tool_rating(tool_id UUID)
RETURNS void AS $$
DECLARE
    avg_rating DECIMAL(3,2);
    rating_count INTEGER;
BEGIN
    -- Calculate average rating from approved comments
    SELECT 
        COALESCE(AVG(rating), 0),
        COUNT(*)
    INTO avg_rating, rating_count
    FROM comments 
    WHERE tool_id = update_tool_rating.tool_id 
    AND is_approved = true 
    AND rating IS NOT NULL;

    -- Update the tools table
    UPDATE tools 
    SET 
        rating = COALESCE(avg_rating, 0),
        rating_count = COALESCE(rating_count, 0),
        updated_at = NOW()
    WHERE id = update_tool_rating.tool_id;

    -- Update tool stats
    UPDATE tool_stats 
    SET 
        comment_count = (
            SELECT COUNT(*) 
            FROM comments 
            WHERE tool_id = update_tool_rating.tool_id 
            AND is_approved = true
        ),
        updated_at = NOW()
    WHERE tool_id = update_tool_rating.tool_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update ratings when comments are inserted/updated
CREATE OR REPLACE FUNCTION trigger_update_tool_rating()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM update_tool_rating(NEW.tool_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS update_rating_on_comment_insert ON comments;
CREATE TRIGGER update_rating_on_comment_insert
    AFTER INSERT ON comments
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_tool_rating();

DROP TRIGGER IF EXISTS update_rating_on_comment_update ON comments;
CREATE TRIGGER update_rating_on_comment_update
    AFTER UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_tool_rating();
