-- Drop existing RLS policies for community posts
DROP POLICY IF EXISTS "Community posts are viewable by everyone" ON community_posts;
DROP POLICY IF EXISTS "Users can insert their own community posts" ON community_posts;
DROP POLICY IF EXISTS "Users can update their own community posts" ON community_posts;
DROP POLICY IF EXISTS "Users can delete their own community posts" ON community_posts;

-- Create new RLS policies that work better with server actions
CREATE POLICY "Community posts are viewable by everyone" ON community_posts
  FOR SELECT USING (is_approved = true);

-- Allow authenticated users to insert posts (server actions handle author_id validation)
CREATE POLICY "Users can insert community posts" ON community_posts
  FOR INSERT TO authenticated WITH CHECK (true);

-- Allow users to update their own posts with proper author_id check
CREATE POLICY "Users can update their own community posts" ON community_posts
  FOR UPDATE TO authenticated USING (author_id = auth.uid());

-- Allow users to delete their own posts with proper author_id check
CREATE POLICY "Users can delete their own community posts" ON community_posts
  FOR DELETE TO authenticated USING (author_id = auth.uid());

-- Also fix community comments policies
DROP POLICY IF EXISTS "Users can insert their own community comments" ON community_comments;
DROP POLICY IF EXISTS "Users can update their own community comments" ON community_comments;
DROP POLICY IF EXISTS "Users can delete their own community comments" ON community_comments;

-- Allow authenticated users to insert comments (server actions handle validation)
CREATE POLICY "Users can insert community comments" ON community_comments
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update their own community comments" ON community_comments
  FOR UPDATE TO authenticated USING (author_id = auth.uid());

CREATE POLICY "Users can delete their own community comments" ON community_comments
  FOR DELETE TO authenticated USING (author_id = auth.uid());

-- Fix community likes policies to work with server actions
DROP POLICY IF EXISTS "Users can manage their own post likes" ON community_post_likes;
DROP POLICY IF EXISTS "Users can manage their own comment likes" ON community_comment_likes;

-- Allow authenticated users to manage likes (server actions handle user_id validation)
CREATE POLICY "Users can manage post likes" ON community_post_likes
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Users can manage comment likes" ON community_comment_likes
  FOR ALL TO authenticated USING (true);
