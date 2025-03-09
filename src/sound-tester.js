// This script can be used to test sounds from the command line
import SoundManager from './lib/SoundManager';
import { initSoundStorage, listSounds, getSoundUrl } from './lib/supabaseStorage';

async function testSounds() {
  console.log('Initializing sound storage...');
  const initialized = await initSoundStorage();
  
  if (!initialized) {
    console.error('Failed to initialize sound storage');
    return;
  }
  
  console.log('Listing sounds in Supabase storage...');
  const sounds = await listSounds();
  
  if (sounds.length === 0) {
    console.log('No sounds found in Supabase storage');
    return;
  }
  
  console.log(`Found ${sounds.length} sounds:`);
  sounds.forEach((sound, index) => {
    const url = getSoundUrl(sound.name);
    console.log(`${index + 1}. ${sound.name}: ${url}`);
  });
  
  console.log('\nSound testing complete!');
}

testSounds().catch(error => {
  console.error('Error testing sounds:', error);
});
