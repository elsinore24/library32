/*
  # Update Library Clues Table

  1. Changes
    - Drop existing policies if they exist
    - Recreate table if not exists
    - Add new policies with proper error handling
    - Insert initial data if not exists

  2. Security
    - Maintain RLS on library_clues table
    - Ensure public read/write access
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public read access" ON public.library_clues;
  DROP POLICY IF EXISTS "Public update access" ON public.library_clues;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create the table if it doesn't exist
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
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'library_clues' AND policyname = 'Public read access'
  ) THEN
    CREATE POLICY "Public read access"
      ON public.library_clues
      FOR SELECT
      TO PUBLIC
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'library_clues' AND policyname = 'Public update access'
  ) THEN
    CREATE POLICY "Public update access"
      ON public.library_clues
      FOR UPDATE
      TO PUBLIC
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

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
