/*
  # Add clue images support

  1. Changes
    - Add clue_image column to library_clues table
    - Create storage bucket for clue images
    - Set up public access policy for clue images

  2. Security
    - Enable public read access to clue images
    - Maintain existing RLS policies
*/

-- Add clue_image column to library_clues
ALTER TABLE public.library_clues 
ADD COLUMN IF NOT EXISTS clue_image text;

-- Create storage bucket for clue images
INSERT INTO storage.buckets (id, name, public)
VALUES ('clues', 'clues', true);

-- Set up storage policy for public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'clues');

-- Update existing clues with image paths
UPDATE public.library_clues
SET clue_image = CASE
  WHEN book_title = 'Venomous Flora' THEN 'clues/venomous-flora-page.jpg'
  WHEN book_title = 'Mortiferous Mushrooms' THEN 'clues/mortiferous-mushrooms-page.jpg'
  WHEN book_title = 'Aconitum Anthology' THEN 'clues/aconitum-anthology-page.jpg'
  WHEN book_title = 'Dark Rituals' THEN 'clues/dark-rituals-page.jpg'
  ELSE NULL
END;
