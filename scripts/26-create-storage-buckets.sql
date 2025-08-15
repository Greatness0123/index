-- Create storage buckets for tool images and screenshots
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('tool-images', 'tool-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('tool-screenshots', 'tool-screenshots', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- Create policies for tool-images bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'tool-images');

CREATE POLICY "Authenticated users can upload tool images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'tool-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own tool images" ON storage.objects 
FOR UPDATE USING (bucket_id = 'tool-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own tool images" ON storage.objects 
FOR DELETE USING (bucket_id = 'tool-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for tool-screenshots bucket
CREATE POLICY "Public Access Screenshots" ON storage.objects FOR SELECT USING (bucket_id = 'tool-screenshots');

CREATE POLICY "Authenticated users can upload screenshots" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'tool-screenshots' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own screenshots" ON storage.objects 
FOR UPDATE USING (bucket_id = 'tool-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own screenshots" ON storage.objects 
FOR DELETE USING (bucket_id = 'tool-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);
