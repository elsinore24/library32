/*
  # Library Room Setup

  1. New Tables
    - `library_clues`: Stores clues found in the library
      - `id` (uuid, primary key)
      - `book_title` (text)
      - `page_content` (text)
      - `discovered` (boolean)

  2. Security
    - Enable RLS on `library_clues` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS library_clues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_title text NOT NULL,
  page_content text NOT NULL,
  discovered boolean DEFAULT false
);

ALTER TABLE library_clues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read discovered clues"
  ON library_clues
  FOR SELECT
  TO authenticated
  USING (discovered = true);

INSERT INTO library_clues (book_title, page_content, discovered) 
VALUES (
  'Venomous Flora',
  'A detailed study of arsenic-laced ferns, with particular attention to their use in Victorian gardens...',
  false
);
