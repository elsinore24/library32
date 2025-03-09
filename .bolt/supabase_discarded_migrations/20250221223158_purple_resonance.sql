/*
  # Create Library Clues Table with Optimized Structure

  1. New Tables
    - `library_clues`
      - `id` (uuid, primary key)
      - `book_title` (text)
      - `page_content` (text)
      - `discovered` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Public read access policy
    - Public update access policy

  3. Initial Data
    - Single clue for "Venomous Flora"
*/

-- Create schema objects in a single transaction
BEGIN;

-- Create the table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'library_clues'
  ) THEN
    CREATE TABLE public.library_clues (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      book_title text NOT NULL,
      page_content text NOT NULL,
      discovered boolean DEFAULT false,
      created_at timestamptz DEFAULT now()
    );

    -- Enable RLS
    ALTER TABLE public.library_clues ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'library_clues' 
    AND policyname = 'Public read access'
  ) THEN
    CREATE POLICY "Public read access"
      ON public.library_clues
      FOR SELECT
      TO PUBLIC
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'library_clues' 
    AND policyname = 'Public update access'
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

COMMIT;
