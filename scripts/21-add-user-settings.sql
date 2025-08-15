-- Add display_name and show_as_author fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS show_as_author BOOLEAN DEFAULT true;

-- Add show_author field to tools table for anonymity option
ALTER TABLE tools ADD COLUMN IF NOT EXISTS show_author BOOLEAN DEFAULT true;

-- Update existing users to have display names based on their full names
UPDATE users SET display_name = full_name WHERE display_name IS NULL AND full_name IS NOT NULL;
