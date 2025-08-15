-- Add new columns to existing tools table
ALTER TABLE tools 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS favorite_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deprecated')),
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verification_notes TEXT;

-- Add new columns to categories table
ALTER TABLE categories 
ADD COLUMN IF NOT EXISTS tool_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Update tools table with better constraints
ALTER TABLE tools 
ADD CONSTRAINT IF NOT EXISTS tools_rating_check CHECK (rating >= 0 AND rating <= 5),
ADD CONSTRAINT IF NOT EXISTS tools_rating_count_check CHECK (rating_count >= 0);

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_tools_status ON tools(status);
CREATE INDEX IF NOT EXISTS idx_tools_verified ON tools(verified_at) WHERE verified_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tools_view_count ON tools(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_tools_favorite_count ON tools(favorite_count DESC);
CREATE INDEX IF NOT EXISTS idx_categories_featured ON categories(is_featured);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);
