/*
  # Add additional library books

  1. Changes
    - Add remaining books to the library_clues table:
      - Mortiferous Mushrooms
      - Aconitum Anthology
      - Dark Rituals
    
  2. Notes
    - Each book contains a unique clue that contributes to the mystery
    - Maintains existing Venomous Flora entry
*/

INSERT INTO public.library_clues (book_title, page_content, discovered) 
VALUES 
  (
    'Mortiferous Mushrooms',
    'An extensive catalog of deadly fungi, with particular emphasis on species that leave no trace...',
    false
  ),
  (
    'Aconitum Anthology',
    'A collection of poems about wolfsbane and its historical use in both medicine and murder...',
    false
  ),
  (
    'Dark Rituals',
    'A grimoire containing various dark ceremonies, with several pages dedicated to preservation techniques...',
    false
  );
