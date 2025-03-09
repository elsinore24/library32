/*
  # Create Library Tables

  1. New Tables
    - `library_clues`
      - `id` (uuid, primary key)
      - `book_title` (text)
      - `page_content` (text)
      - `discovered` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `library_clues` table
    - Add policy for public read access
    - Add policy for public update access (for demo purposes)
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Anyone can read library clues" ON library_clues;
  DROP POLICY IF EXISTS "Authenticated users can update discovered status" ON library_clues;
EXCEPTION
  WHEN undefined_table THEN
    NULL;
END $$;

-- Create the table
CREATE TABLE IF NOT EXISTS public.library_clues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_title text NOT NULL,
  page_content text NOT NULL,
  discovered boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.library_clues ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access"
  ON public.library_clues
  FOR SELECT
  TO PUBLIC
  USING (true);

CREATE POLICY "Public update access"
  ON public.library_clues
  FOR UPDATE
  TO PUBLIC
  USING (true)
  WITH CHECK (true);

-- Insert initial data if not exists
INSERT INTO public.library_clues (book_title, page_content, discovered) 
SELECT 
  'Venomous Flora',
  'A detailed study of arsenic-laced ferns, with particular attention to their use in Victorian gardens...',
  false
WHERE NOT EXISTS (
  SELECT 1 FROM public.library_clues
  WHERE book_title = 'Venomous Flora'
);
