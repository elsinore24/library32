/*
  # Sound Storage Setup Migration
  
  1. Creates a storage bucket for game sounds
  2. Sets up public access for the sounds
  3. Configures appropriate size limits and MIME type restrictions
*/

-- Create the game-sounds bucket if it doesn't exist
DO $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'game-sounds'
  ) INTO bucket_exists;
  
  IF NOT bucket_exists THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'game-sounds',
      'game-sounds',
      TRUE,
      5242880, -- 5MB limit
      ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']::text[]
    );
  END IF;
END $$;

-- Remove the problematic storage.policies check and insert
-- Instead, we'll use the Supabase API to handle public access

-- Add a record of sound files that should be uploaded
CREATE TABLE IF NOT EXISTS public.sound_files (
  id SERIAL PRIMARY KEY,
  filename TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT,
  uploaded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the required sound files
INSERT INTO public.sound_files (filename, description, category, uploaded)
VALUES
  ('bookDrag.mp3', 'Sound of book being dragged', 'effect', FALSE),
  ('bookPlace.mp3', 'Sound of book being placed', 'effect', FALSE),
  ('bookshelfCreak.mp3', 'Creaking bookshelf sound', 'effect', FALSE),
  ('creak.mp3', 'Generic creaking sound', 'effect', FALSE),
  ('library-ambience.mp3', 'Library ambient background', 'ambient', FALSE),
  ('puzzleSolve.mp3', 'Puzzle solving success sound', 'effect', FALSE),
  ('secretReveal.mp3', 'Secret compartment reveal sound', 'effect', FALSE),
  ('snap.mp3', 'Snapping sound', 'effect', FALSE),
  ('success.mp3', 'Success indicator sound', 'effect', FALSE),
  ('whisper.mp3', 'Whispering sound', 'effect', FALSE)
ON CONFLICT (filename) DO NOTHING;

-- Create a function to mark sounds as uploaded
CREATE OR REPLACE FUNCTION public.mark_sound_uploaded(sound_filename TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.sound_files
  SET uploaded = TRUE
  WHERE filename = sound_filename;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view to easily see which sounds need to be uploaded
CREATE OR REPLACE VIEW public.sounds_to_upload AS
SELECT filename, description, category
FROM public.sound_files
WHERE uploaded = FALSE;

-- Grant appropriate permissions
ALTER TABLE public.sound_files ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view sound files
CREATE POLICY "Allow authenticated users to view sound files"
ON public.sound_files FOR SELECT
TO authenticated
USING (true);

-- Create policy for authenticated users to mark sounds as uploaded
CREATE POLICY "Allow authenticated users to update sound files"
ON public.sound_files FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policies for storage bucket access
CREATE POLICY "Allow public read access to game-sounds bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'game-sounds');

CREATE POLICY "Allow authenticated users insert access to game-sounds bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'game-sounds');

CREATE POLICY "Allow authenticated users update access to game-sounds bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'game-sounds');
