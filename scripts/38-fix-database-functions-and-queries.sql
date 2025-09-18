-- Create the missing update_tool_statistics_safe function
CREATE OR REPLACE FUNCTION public.update_tool_statistics_safe(target_tool_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    comment_count_val INTEGER;
    favorite_count_val INTEGER;
    avg_rating DECIMAL(3,2);
    rating_count_val INTEGER;
BEGIN
    -- Get comment count
    SELECT COUNT(*) INTO comment_count_val
    FROM comments 
    WHERE tool_id = target_tool_id AND is_approved = true;
    
    -- Get favorite count
    SELECT COUNT(*) INTO favorite_count_val
    FROM user_favorites 
    WHERE tool_id = target_tool_id;
    
    -- Get rating statistics
    SELECT 
        AVG(rating)::DECIMAL(3,2),
        COUNT(rating)
    INTO avg_rating, rating_count_val
    FROM comments 
    WHERE tool_id = target_tool_id 
    AND is_approved = true 
    AND rating IS NOT NULL;
    
    -- Update or insert tool stats
    INSERT INTO tool_stats (tool_id, comment_count, favorite_count, updated_at)
    VALUES (target_tool_id, comment_count_val, favorite_count_val, NOW())
    ON CONFLICT (tool_id) 
    DO UPDATE SET 
        comment_count = comment_count_val,
        favorite_count = favorite_count_val,
        updated_at = NOW();
    
    -- Update tool rating
    UPDATE tools 
    SET 
        rating = COALESCE(avg_rating, 0),
        rating_count = COALESCE(rating_count_val, 0)
    WHERE id = target_tool_id;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail
        RAISE WARNING 'Error updating tool statistics for %: %', target_tool_id, SQLERRM;
END;
$$;

-- Create the track_tool_click_safe function if it doesn't exist
CREATE OR REPLACE FUNCTION public.track_tool_click_safe(
    p_tool_id UUID,
    p_user_id UUID DEFAULT NULL,
    p_ip_address TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert click record
    INSERT INTO tool_clicks (tool_id, user_id, ip_address, user_agent, created_at)
    VALUES (p_tool_id, p_user_id, p_ip_address, p_user_agent, NOW());
    
    -- Update tool stats
    PERFORM update_tool_statistics_safe(p_tool_id);
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail
        RAISE WARNING 'Error tracking tool click for %: %', p_tool_id, SQLERRM;
END;
$$;
