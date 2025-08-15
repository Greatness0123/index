-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tools table
CREATE TABLE IF NOT EXISTS tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  submitted_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  pricing TEXT, -- 'free', 'freemium', 'paid', 'subscription'
  rating DECIMAL(2,1) DEFAULT 0.0,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create junction table for tool tags (many-to-many relationship)
CREATE TABLE IF NOT EXISTS tool_tags (
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (tool_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tools_category_id ON tools(category_id);
CREATE INDEX IF NOT EXISTS idx_tools_is_approved ON tools(is_approved);
CREATE INDEX IF NOT EXISTS idx_tools_is_featured ON tools(is_featured);
CREATE INDEX IF NOT EXISTS idx_tools_created_at ON tools(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tool_tags_tool_id ON tool_tags(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_tags_tag_id ON tool_tags(tag_id);
