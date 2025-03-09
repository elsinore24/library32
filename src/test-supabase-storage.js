import { supabase } from './lib/supabase';
import { listSounds, getSoundUrl } from './lib/supabaseStorage';

const BUCKET_NAME = 'game-sounds';

async function testSupabaseStorage() {
  console.log('Testing Supabase storage connection...');
  
  // Test direct Supabase storage API
  try {
    console.log(`Directly listing files in bucket: ${BUCKET_NAME}`);
    const { data: directFiles, error } = await supabase.storage.from(BUCKET_NAME).list();
    
    if (error) {
      console.error('Error directly listing files:', error);
    } else {
      console.log(`Direct API found ${directFiles?.length || 0} files:`);
      directFiles?.forEach(file => {
        console.log(`- ${file.name} (${file.id})`);
        const url = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name).data.publicUrl;
        console.log(`  URL: ${url}`);
      });
    }
  } catch (err) {
    console.error('Exception in direct storage access:', err);
  }
  
  // Test through our helper functions
  try {
    console.log('\nListing sounds through helper function:');
    const sounds = await listSounds();
    console.log(`Helper function found ${sounds.length} sounds:`);
    
    sounds.forEach(sound => {
      console.log(`- ${sound.name}`);
      const url = getSoundUrl(sound.name);
      console.log(`  URL: ${url}`);
    });
    
    // Try to access a specific file we know exists
    const bookDragUrl = getSoundUrl('bookDrag.mp3');
    console.log(`\nSpecific file URL for bookDrag.mp3: ${bookDragUrl}`);
    
    // Test if we can fetch the file
    console.log('\nTesting fetch of the sound file...');
    const response = await fetch(bookDragUrl);
    if (response.ok) {
      console.log(`Successfully fetched file: ${response.status} ${response.statusText}`);
      console.log(`Content-Type: ${response.headers.get('content-type')}`);
      console.log(`Content-Length: ${response.headers.get('content-length')} bytes`);
    } else {
      console.error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }
  } catch (err) {
    console.error('Exception in helper functions:', err);
  }
}

testSupabaseStorage().catch(err => {
  console.error('Unhandled error in test:', err);
});
