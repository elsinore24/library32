import { supabase } from './lib/supabase';
import { initSoundStorage, listSounds } from './lib/supabaseStorage';

// Verify Supabase connection and storage setup
async function verifyConnection() {
  console.log('Verifying Supabase connection...');
  
  try {
    // Test database connection
    const { data, error } = await supabase.from('library_clues').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Failed to connect to Supabase database:', error.message);
    } else {
      console.log('✅ Successfully connected to Supabase database');
    }
    
    // Test storage connection
    console.log('Checking sound storage...');
    const storageInitialized = await initSoundStorage();
    
    if (storageInitialized) {
      console.log('✅ Sound storage bucket exists');
      
      // List sounds in the bucket
      const sounds = await listSounds();
      console.log(`Found ${sounds.length} sound files in storage:`);
      
      if (sounds.length > 0) {
        sounds.forEach(sound => {
          console.log(`  - ${sound.name}`);
        });
      } else {
        console.log('❗ No sound files found. Please upload the required sound files to the game-sounds bucket.');
      }
    } else {
      console.error('❌ Sound storage bucket not found or not accessible');
      console.log('Please run the migrations to create the storage bucket.');
    }
    
  } catch (err) {
    console.error('❌ Unexpected error during verification:', err);
  }
}

// Run the verification
verifyConnection().catch(console.error);
