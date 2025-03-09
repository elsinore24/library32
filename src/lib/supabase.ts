import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Verify connection silently in the background
supabase.from('library_clues').select('count', { count: 'exact', head: true })
  .then(({ error }) => {
    if (error) {
      console.error('Failed to connect to Supabase:', error.message);
    } else {
      console.log('Successfully connected to Supabase');
    }
  })
  .catch(err => {
    console.error('Unexpected error connecting to Supabase:', err);
  });
