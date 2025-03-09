/*
  # Add clue_image and clue_id columns to library_clues table

  1. Changes
    - Add clue_image column to store image paths
    - Add clue_id column as a string identifier for code reference
    - Update existing data with image paths and clue IDs
    - Add new clue for poisoned page

  2. Security
    - Maintains existing RLS policies
*/

-- Add clue_image column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'library_clues' AND column_name = 'clue_image'
  ) THEN
    ALTER TABLE public.library_clues ADD COLUMN clue_image text;
  END IF;
END $$;

-- Add clue_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'library_clues' AND column_name = 'clue_id'
  ) THEN
    ALTER TABLE public.library_clues ADD COLUMN clue_id text UNIQUE;
  END IF;
END $$;

-- Update existing data with image paths and clue IDs
UPDATE public.library_clues
SET clue_image = '/default-clue.png',
    clue_id = 'venomous-flora'
WHERE book_title = 'Venomous Flora' AND clue_id IS NULL;

-- Insert poisoned page clue if it doesn't exist
INSERT INTO public.library_clues (book_title, page_content, discovered, clue_image, clue_id) 
SELECT 
  'Mortiferous Mushrooms',
  'A page torn from ''Mortiferous Mushrooms'' with notes about a deadly poison recipe. The margins contain handwritten notes about dosage calculations.',
  false,
  '/images/clues/poisoned-page.png',
  'poisoned-page'
WHERE NOT EXISTS (
  SELECT 1 FROM public.library_clues
  WHERE clue_id = 'poisoned-page'
);
