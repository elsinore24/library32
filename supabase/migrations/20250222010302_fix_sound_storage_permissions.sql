-- This migration fixes the RLS issue with the storage bucket

-- Remove existing policies on storage.objects
DROP POLICY IF EXISTS "Allow public read access to game-sounds bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users insert access to game-sounds bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users update access to game-sounds bucket" ON storage.objects;

-- Recreate the policies with a more specific filter on the name
CREATE POLICY "Allow public read access to game-sounds bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'game-sounds' AND name LIKE '%.mp3');

CREATE POLICY "Allow authenticated users insert access to game-sounds bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'game-sounds');

CREATE POLICY "Allow authenticated users update access to game-sounds bucket"
ON storage.objects FOR UPDATE
TO authenticated
WITH CHECK (bucket_id = 'game-sounds');
