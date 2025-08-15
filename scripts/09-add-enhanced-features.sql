-- Add tool collections/lists
CREATE TABLE IF NOT EXISTS tool_collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collection_tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID NOT NULL REFERENCES tool_collections(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collection_id, tool_id)
);

-- Add tool alternatives/similar tools
CREATE TABLE IF NOT EXISTS tool_alternatives (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  alternative_tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  similarity_score DECIMAL(3,2) DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tool_id, alternative_tool_id),
  CHECK (tool_id != alternative_tool_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_tool_collections_user_id ON tool_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_tool_collections_public ON tool_collections(is_public);
CREATE INDEX IF NOT EXISTS idx_collection_tools_collection_id ON collection_tools(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_tools_tool_id ON collection_tools(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_alternatives_tool_id ON tool_alternatives(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_alternatives_similarity ON tool_alternatives(similarity_score DESC);

-- Add triggers for updated_at
CREATE TRIGGER update_tool_collections_updated_at BEFORE UPDATE ON tool_collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
