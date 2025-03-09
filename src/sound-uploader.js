import { initSoundStorage, uploadSound } from './lib/supabaseStorage';

// List of sound files to upload
const soundFiles = [
  'bookDrag.mp3',
  'bookPlace.mp3',
  'bookshelfCreak.mp3',
  'creak.mp3',
  'library-ambience.mp3',
  'puzzleSolve.mp3',
  'secretReveal.mp3',
  'snap.mp3',
  'success.mp3',
  'whisper.mp3'
];

async function uploadSounds() {
  console.log('Initializing Supabase storage...');
  const initialized = await initSoundStorage();
  
  if (!initialized) {
    console.error('Failed to initialize storage. Aborting upload.');
    return;
  }
  
  console.log('Storage initialized. Starting upload...');
  
  for (const filename of soundFiles) {
    try {
      // In a browser environment, you would use fetch to get the file
      // Here we're simulating this process
      console.log(`Uploading ${filename}...`);
      
      // This is a placeholder for the actual file upload
      // In a real implementation, you would:
      // 1. Fetch the file from your local static folder
      // 2. Create a File object
      // 3. Upload it to Supabase
      
      // const response = await fetch(`/sounds/${filename}`);
      // const blob = await response.blob();
      // const file = new File([blob], filename, { type: 'audio/mpeg' });
      // const url = await uploadSound(file);
      
      // For now, we'll just log what would happen
      console.log(`Would upload ${filename} to Supabase`);
      
    } catch (error) {
      console.error(`Error uploading ${filename}:`, error);
    }
  }
  
  console.log('Upload process completed.');
}

// Run the upload process
uploadSounds().catch(console.error);
