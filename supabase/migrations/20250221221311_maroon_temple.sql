/*
  # Create Library Clues Table

  1. New Tables
    - `library_clues`
      - `id` (uuid, primary key)
      - `book_title` (text)
      - `page_content` (text)
      - `discovered` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `library_clues` table
    - Add policy for authenticated users to read all clues
    - Add policy for authenticated users to update discovered status
*/

CREATE TABLE IF NOT EXISTS library_clues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_title text NOT NULL,
  page_content text NOT NULL,
  discovered boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE library_clues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read library clues"
  ON library_clues
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can update discovered status"
  ON library_clues
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Insert initial clue
INSERT INTO library_clues (book_title, page_content, discovered) 
VALUES (
  'Venomous Flora',
  'A detailed study of arsenic-laced ferns, with particular attention to their use in Victorian gardens...',
  false
);
