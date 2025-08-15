-- Add tool screenshots and images
CREATE TABLE IF NOT EXISTS tool_screenshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_tool_screenshots_tool_id ON tool_screenshots(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_screenshots_primary ON tool_screenshots(is_primary);
CREATE INDEX IF NOT EXISTS idx_tool_screenshots_order ON tool_screenshots(tool_id, display_order);

-- Add storage bucket for tool images (this will be handled by Supabase Storage)
-- We'll store the bucket URLs in the image_url field
