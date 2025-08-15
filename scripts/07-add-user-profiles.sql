-- Extend users table with profile information
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_handle TEXT,
ADD COLUMN IF NOT EXISTS github_handle TEXT,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tools_submitted_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;

-- Add user favorites/bookmarks
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_tool_id ON user_favorites(tool_id);
