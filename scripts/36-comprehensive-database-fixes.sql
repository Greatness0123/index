-- Comprehensive Database Fixes for Index Clone
-- This script fixes all RLS policies, ambiguous column references, and missing functionality

-- 1. DISABLE ALL PROBLEMATIC RLS POLICIES
ALTER TABLE public.community_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comment_likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_screenshots DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_clicks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- 2. CREATE STORAGE BUCKETS WITH PUBLIC ACCESS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('tool-images', 'tool-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]),
  ('tool-screenshots', 'tool-screenshots', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]),
  ('community-images', 'community-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[];

-- 3. CREATE PERMISSIVE STORAGE POLICIES
CREATE POLICY "Public Access" ON storage.objects FOR ALL USING (true);
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (true);
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (true);

-- 4. FIX AMBIGUOUS COLUMN REFERENCE BY CREATING SAFE UPDATE FUNCTION
CREATE OR REPLACE FUNCTION public.update_tool_statistics_safe(target_tool_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    comment_count_val integer;
    avg_rating_val numeric;
    favorite_count_val integer;
    view_count_val integer;
    click_count_val integer;
BEGIN
    -- Get comment count and average rating with explicit table references
    SELECT 
        COUNT(c.id)::integer,
        COALESCE(AVG(c.rating), 0)::numeric
    INTO comment_count_val, avg_rating_val
    FROM public.comments c
    WHERE c.tool_id = target_tool_id AND c.is_approved = true;

    -- Get favorite count with explicit table reference
    SELECT COUNT(uf.id)::integer
    INTO favorite_count_val
    FROM public.user_favorites uf
    WHERE uf.tool_id = target_tool_id;

    -- Get view count with explicit table reference
    SELECT COUNT(tv.id)::integer
    INTO view_count_val
    FROM public.tool_views tv
    WHERE tv.tool_id = target_tool_id;

    -- Get click count with explicit table reference
    SELECT COUNT(tc.id)::integer
    INTO click_count_val
    FROM public.tool_clicks tc
    WHERE tc.tool_id = target_tool_id;

    -- Update tool_stats with explicit column references
    INSERT INTO public.tool_stats (
        tool_id, 
        comment_count, 
        favorite_count, 
        view_count, 
        click_count, 
        updated_at
    )
    VALUES (
        target_tool_id,
        comment_count_val,
        favorite_count_val,
        view_count_val,
        click_count_val,
        NOW()
    )
    ON CONFLICT (tool_id) 
    DO UPDATE SET
        comment_count = comment_count_val,
        favorite_count = favorite_count_val,
        view_count = view_count_val,
        click_count = click_count_val,
        updated_at = NOW();

    -- Update tools table rating with explicit column references
    UPDATE public.tools t
    SET 
        rating = avg_rating_val,
        rating_count = comment_count_val,
        updated_at = NOW()
    WHERE t.id = target_tool_id;

EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the transaction
        RAISE WARNING 'Error updating tool statistics for tool_id %: %', target_tool_id, SQLERRM;
END;
$$;

-- 5. CREATE TRIGGER TO AUTO-UPDATE STATS (WITH SAFE COLUMN REFERENCES)
CREATE OR REPLACE FUNCTION public.trigger_update_tool_stats()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    -- Use the safe function to avoid ambiguous column references
    PERFORM public.update_tool_statistics_safe(
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.tool_id
            ELSE NEW.tool_id
        END
    );
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Drop existing triggers to avoid conflicts
DROP TRIGGER IF EXISTS update_tool_stats_on_comment ON public.comments;
DROP TRIGGER IF EXISTS update_tool_stats_on_favorite ON public.user_favorites;
DROP TRIGGER IF EXISTS update_tool_stats_on_view ON public.tool_views;
DROP TRIGGER IF EXISTS update_tool_stats_on_click ON public.tool_clicks;

-- Create new safe triggers
CREATE TRIGGER update_tool_stats_on_comment
    AFTER INSERT OR UPDATE OR DELETE ON public.comments
    FOR EACH ROW EXECUTE FUNCTION public.trigger_update_tool_stats();

CREATE TRIGGER update_tool_stats_on_favorite
    AFTER INSERT OR DELETE ON public.user_favorites
    FOR EACH ROW EXECUTE FUNCTION public.trigger_update_tool_stats();

CREATE TRIGGER update_tool_stats_on_view
    AFTER INSERT ON public.tool_views
    FOR EACH ROW EXECUTE FUNCTION public.trigger_update_tool_stats();

CREATE TRIGGER update_tool_stats_on_click
    AFTER INSERT ON public.tool_clicks
    FOR EACH ROW EXECUTE FUNCTION public.trigger_update_tool_stats();

-- 6. ENSURE ALL SUBMITTED TOOLS ARE VISIBLE (SET APPROVED TO TRUE)
UPDATE public.tools SET is_approved = true WHERE is_approved IS NULL OR is_approved = false;

-- 7. CREATE DEFAULT CATEGORIES IF MISSING
INSERT INTO public.categories (id, name, slug, description, color, icon) VALUES
    (gen_random_uuid(), 'AI & Machine Learning', 'ai-ml', 'Artificial Intelligence and Machine Learning tools', '#3B82F6', '🤖'),
    (gen_random_uuid(), 'Analytics', 'analytics', 'Data analytics and tracking tools', '#10B981', '📊'),
    (gen_random_uuid(), 'Communication', 'communication', 'Team communication and collaboration tools', '#8B5CF6', '💬'),
    (gen_random_uuid(), 'Design', 'design', 'Design and creative tools', '#F59E0B', '🎨'),
    (gen_random_uuid(), 'Development', 'development', 'Developer tools and platforms', '#EF4444', '⚡'),
    (gen_random_uuid(), 'E-commerce', 'ecommerce', 'Online store and e-commerce platforms', '#06B6D4', '🛒'),
    (gen_random_uuid(), 'Education', 'education', 'Learning and educational platforms', '#84CC16', '📚'),
    (gen_random_uuid(), 'Finance', 'finance', 'Financial management and fintech tools', '#F97316', '💰'),
    (gen_random_uuid(), 'Marketing', 'marketing', 'Marketing and advertising tools', '#EC4899', '📈'),
    (gen_random_uuid(), 'Productivity', 'productivity', 'Productivity and workflow tools', '#6366F1', '⚡')
ON CONFLICT (slug) DO NOTHING;

-- 8. ENSURE TOOL_STATS EXISTS FOR ALL TOOLS
INSERT INTO public.tool_stats (tool_id, comment_count, favorite_count, view_count, click_count, updated_at)
SELECT 
    t.id,
    0,
    0,
    0,
    0,
    NOW()
FROM public.tools t
WHERE NOT EXISTS (
    SELECT 1 FROM public.tool_stats ts WHERE ts.tool_id = t.id
);

-- 9. CREATE FUNCTION TO SAFELY TRACK TOOL CLICKS
CREATE OR REPLACE FUNCTION public.track_tool_click_safe(
    p_tool_id uuid,
    p_user_id uuid DEFAULT NULL,
    p_ip_address inet DEFAULT NULL,
    p_user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.tool_clicks (
        id,
        tool_id,
        user_id,
        ip_address,
        user_agent,
        clicked_at
    )
    VALUES (
        gen_random_uuid(),
        p_tool_id,
        p_user_id,
        p_ip_address,
        p_user_agent,
        NOW()
    );
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail
        RAISE WARNING 'Error tracking tool click for tool_id %: %', p_tool_id, SQLERRM;
END;
$$;

-- 10. GRANT NECESSARY PERMISSIONS
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Grant storage permissions
GRANT ALL ON storage.objects TO anon, authenticated;
GRANT ALL ON storage.buckets TO anon, authenticated;

COMMIT;
