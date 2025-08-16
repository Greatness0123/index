-- Fix storage bucket policies and configuration

-- Ensure storage buckets exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('tool-images', 'tool-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('tool-screenshots', 'tool-screenshots', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access for tool images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload tool images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own tool images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own tool images" ON storage.objects;

-- Create permissive storage policies
CREATE POLICY "Public read access for tool images" ON storage.objects
  FOR SELECT USING (bucket_id IN ('tool-images', 'tool-screenshots'));

CREATE POLICY "Anyone can upload tool images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id IN ('tool-images', 'tool-screenshots'));

CREATE POLICY "Anyone can update tool images" ON storage.objects
  FOR UPDATE USING (bucket_id IN ('tool-images', 'tool-screenshots'));

CREATE POLICY "Anyone can delete tool images" ON storage.objects
  FOR DELETE USING (bucket_id IN ('tool-images', 'tool-screenshots'));

-- Ensure storage is enabled
UPDATE storage.buckets 
SET public = true 
WHERE id IN ('tool-images', 'tool-screenshots');
