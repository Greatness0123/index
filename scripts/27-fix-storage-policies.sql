-- Fix storage bucket policies to allow authenticated users to upload
-- and ensure proper user record creation

-- First, let's fix the storage policies
DROP POLICY IF EXISTS "Users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload screenshots" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;

-- Create more permissive policies for authenticated users
CREATE POLICY "Authenticated users can upload to tool-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tool-images');

CREATE POLICY "Authenticated users can upload to tool-screenshots"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'tool-screenshots');

CREATE POLICY "Authenticated users can update their uploads"
ON storage.objects FOR UPDATE
TO authenticated
USING (auth.uid()::text = owner);

CREATE POLICY "Authenticated users can delete their uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (auth.uid()::text = owner);

CREATE POLICY "Anyone can view uploaded images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id IN ('tool-images', 'tool-screenshots'));

-- Create a function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user records
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also handle existing users who might not have records
INSERT INTO public.users (id, email, display_name, created_at, updated_at)
SELECT 
  id,
  email,
  COALESCE(raw_user_meta_data->>'display_name', email),
  created_at,
  updated_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;
