/*
  # Add clue_image column to library_clues table

  1. Changes
    - Add clue_image column to store image paths for clues
    - Update existing records with image paths
    
  2. Notes
    - This allows us to associate specific images with each clue
    - Images will be stored in Supabase storage
*/

-- Add the clue_image column
ALTER TABLE public.library_clues 
ADD COLUMN clue_image text;

-- Update existing records with image paths
UPDATE public.library_clues
SET clue_image = 'https://kxmwcpeuiklblpehddkz.supabase.co/storage/v1/object/public/suspects/poisoned-page.png'
WHERE book_title = 'Mortiferous Mushrooms';
