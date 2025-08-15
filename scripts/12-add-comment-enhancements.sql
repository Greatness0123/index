-- Add helpful votes for comments
CREATE TABLE IF NOT EXISTS comment_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Add helpful count to comments table
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_votes INTEGER DEFAULT 0;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_comment_votes_comment_id ON comment_votes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_votes_user_id ON comment_votes(user_id);

-- Function to update comment helpful counts
CREATE OR REPLACE FUNCTION update_comment_helpful_count(comment_id UUID)
RETURNS void AS $$
DECLARE
    helpful_count INTEGER;
    total_votes INTEGER;
BEGIN
    SELECT 
        COUNT(*) FILTER (WHERE is_helpful = true),
        COUNT(*)
    INTO helpful_count, total_votes
    FROM comment_votes 
    WHERE comment_id = update_comment_helpful_count.comment_id;

    UPDATE comments 
    SET 
        helpful_count = COALESCE(helpful_count, 0),
        total_votes = COALESCE(total_votes, 0),
        updated_at = NOW()
    WHERE id = update_comment_helpful_count.comment_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger for comment votes
CREATE OR REPLACE FUNCTION trigger_update_comment_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        PERFORM update_comment_helpful_count(OLD.comment_id);
        RETURN OLD;
    ELSE
        PERFORM update_comment_helpful_count(NEW.comment_id);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_helpful_count_on_vote ON comment_votes;
CREATE TRIGGER update_helpful_count_on_vote
    AFTER INSERT OR UPDATE OR DELETE ON comment_votes
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_comment_helpful_count();
