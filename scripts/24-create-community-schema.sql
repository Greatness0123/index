-- Create community posts table
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  post_type VARCHAR(50) DEFAULT 'discussion' CHECK (post_type IN ('discussion', 'showcase', 'question', 'announcement', 'advertisement')),
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name VARCHAR(255),
  show_author BOOLEAN DEFAULT true,
  image_url TEXT,
  external_url TEXT,
  tags TEXT[] DEFAULT '{}',
  is_pinned BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create community comments table
CREATE TABLE IF NOT EXISTS community_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name VARCHAR(255),
  show_author BOOLEAN DEFAULT true,
  like_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create community post likes table
CREATE TABLE IF NOT EXISTS community_post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create community comment likes table
CREATE TABLE IF NOT EXISTS community_comment_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES community_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_community_posts_author ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_type ON community_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_pinned ON community_posts(is_pinned, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_comments_post ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_parent ON community_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_author ON community_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_created ON community_comments(created_at);

CREATE INDEX IF NOT EXISTS idx_community_post_likes_post ON community_post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_community_post_likes_user ON community_post_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_community_comment_likes_comment ON community_comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_community_comment_likes_user ON community_comment_likes(user_id);

-- Create triggers to update counts
CREATE OR REPLACE FUNCTION update_community_post_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF TG_TABLE_NAME = 'community_comments' THEN
      UPDATE community_posts 
      SET comment_count = comment_count + 1,
          updated_at = NOW()
      WHERE id = NEW.post_id;
    ELSIF TG_TABLE_NAME = 'community_post_likes' THEN
      UPDATE community_posts 
      SET like_count = like_count + 1,
          updated_at = NOW()
      WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF TG_TABLE_NAME = 'community_comments' THEN
      UPDATE community_posts 
      SET comment_count = comment_count - 1,
          updated_at = NOW()
      WHERE id = OLD.post_id;
    ELSIF TG_TABLE_NAME = 'community_post_likes' THEN
      UPDATE community_posts 
      SET like_count = like_count - 1,
          updated_at = NOW()
      WHERE id = OLD.post_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for comment and like counts
CREATE TRIGGER trigger_update_post_comment_count
  AFTER INSERT OR DELETE ON community_comments
  FOR EACH ROW EXECUTE FUNCTION update_community_post_counts();

CREATE TRIGGER trigger_update_post_like_count
  AFTER INSERT OR DELETE ON community_post_likes
  FOR EACH ROW EXECUTE FUNCTION update_community_post_counts();

-- Create trigger to update comment like counts
CREATE OR REPLACE FUNCTION update_community_comment_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE community_comments 
    SET like_count = like_count + 1
    WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE community_comments 
    SET like_count = like_count - 1
    WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comment_like_count
  AFTER INSERT OR DELETE ON community_comment_likes
  FOR EACH ROW EXECUTE FUNCTION update_community_comment_counts();

-- Enable Row Level Security
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comment_likes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for community posts
CREATE POLICY "Community posts are viewable by everyone" ON community_posts
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can insert their own community posts" ON community_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own community posts" ON community_posts
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own community posts" ON community_posts
  FOR DELETE USING (auth.uid() = author_id);

-- Create RLS policies for community comments
CREATE POLICY "Community comments are viewable by everyone" ON community_comments
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can insert their own community comments" ON community_comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own community comments" ON community_comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own community comments" ON community_comments
  FOR DELETE USING (auth.uid() = author_id);

-- Create RLS policies for likes
CREATE POLICY "Post likes are viewable by everyone" ON community_post_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own post likes" ON community_post_likes
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Comment likes are viewable by everyone" ON community_comment_likes
  FOR SELECT USING (true);

CREATE POLICY "Users can manage their own comment likes" ON community_comment_likes
  FOR ALL USING (auth.uid() = user_id);
