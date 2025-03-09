import { uploadSound, initSoundStorage, listSounds } from './lib/supabaseStorage';
import fs from 'fs';

async function uploadTestSound() {
  console.log('Initializing sound storage...');
  const initialized = await initSoundStorage();
  
  if (!initialized) {
    console.error('Failed to initialize sound storage bucket');
    return;
  }
  
  console.log('Checking for existing sounds...');
  const existingSounds = await listSounds();
  console.log(`Found ${existingSounds.length} existing sounds`);
  
  // Check if we have a local sound file to upload
  const localSoundPath = './static/sounds/library-ambience.mp3';
  
  if (!fs.existsSync(localSoundPath)) {
    console.error(`Local sound file not found: ${localSoundPath}`);
    return;
  }
  
  console.log(`Found local sound file: ${localSoundPath}`);
  
  // Create a File object from the local file
  const fileBuffer = fs.readFileSync(localSoundPath);
  const fileName = 'library-ambience.mp3';
  
  // Create a File-like object that works with the uploadSound function
  const fileObj = {
    name: fileName,
    type: 'audio/mpeg',
    size: fileBuffer.length,
    arrayBuffer: async () => fileBuffer,
    slice: () => {},
    stream: () => {},
    text: async () => '',
  };
  
  console.log(`Uploading sound: ${fileName}`);
  const url = await uploadSound(fileObj);
  
  if (url) {
    console.log(`Successfully uploaded sound to: ${url}`);
  } else {
    console.error('Failed to upload sound');
  }
  
  // List sounds again to verify
  const updatedSounds = await listSounds();
  console.log(`Now there are ${updatedSounds.length} sounds in storage`);
  updatedSounds.forEach(sound => {
    console.log(`- ${sound.name}`);
  });
}

uploadTestSound().catch(error => {
  console.error('Error in upload test:', error);
});
