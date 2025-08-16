-- Comprehensive database fixes for authentication, RLS, and foreign key issues

-- 1. Create or update users table to sync with auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, display_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, users.full_name),
    display_name = COALESCE(EXCLUDED.display_name, users.display_name),
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to sync auth.users with public.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Create a system user for anonymous submissions
INSERT INTO public.users (
  id, 
  email, 
  full_name, 
  display_name, 
  created_at, 
  updated_at,
  is_verified
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'system@index.app',
  'System User',
  'System',
  NOW(),
  NOW(),
  true
) ON CONFLICT (id) DO NOTHING;

-- 3. Temporarily disable RLS for community tables to allow functionality
ALTER TABLE community_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_post_likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE community_comment_likes DISABLE ROW LEVEL SECURITY;

-- 4. Make foreign key constraints more permissive
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_user_id_fkey;
ALTER TABLE comments ADD CONSTRAINT comments_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE tools DROP CONSTRAINT IF EXISTS tools_submitted_by_fkey;
ALTER TABLE tools ADD CONSTRAINT tools_submitted_by_fkey 
  FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE SET NULL;

-- 5. Update existing records with null user references to use system user
UPDATE comments SET user_id = '00000000-0000-0000-0000-000000000000' WHERE user_id IS NULL;
UPDATE tools SET submitted_by = '00000000-0000-0000-0000-000000000000' WHERE submitted_by IS NULL;

-- 6. Create function to increment click count (fix ambiguous column reference)
CREATE OR REPLACE FUNCTION increment_click_count(tool_id_param UUID)
RETURNS VOID AS $$
BEGIN
  -- Update tool stats
  INSERT INTO tool_stats (tool_id, click_count, updated_at)
  VALUES (tool_id_param, 1, NOW())
  ON CONFLICT (tool_id) 
  DO UPDATE SET 
    click_count = tool_stats.click_count + 1,
    updated_at = NOW();
    
  -- Log the click for analytics
  INSERT INTO tool_views (tool_id, created_at)
  VALUES (tool_id_param, NOW());
END;
$$ LANGUAGE plpgsql;

-- 7. Ensure all existing users have proper records
INSERT INTO public.users (id, email, full_name, display_name, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.email),
  COALESCE(au.raw_user_meta_data->>'display_name', split_part(au.email, '@', 1)),
  au.created_at,
  NOW()
FROM auth.users au
WHERE NOT EXISTS (SELECT 1 FROM public.users pu WHERE pu.id = au.id);

-- 8. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_author_id ON community_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_tools_submitted_by ON tools(submitted_by);
