// This script helps generate placeholder sound files for testing
// Run with: node src/sound-generator.js

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the sound files we need based on our SoundManager.ts
const soundEffects = [
  'book-drag.mp3',
  'book-place.mp3',
  'bookshelf-creak.mp3',
  'puzzle-solve.mp3',
  'secret-reveal.mp3',
  'creak.mp3',
  'snap.mp3',
  'success.mp3',
  'whisper.mp3',
  'library-ambience.mp3'
];

// Ensure the sounds directory exists
const soundsDir = join(__dirname, '../static/sounds');
if (!existsSync(soundsDir)) {
  mkdirSync(soundsDir, { recursive: true });
  console.log('Created sounds directory');
}

// Create empty placeholder files for each sound
soundEffects.forEach(sound => {
  const filePath = join(soundsDir, sound);
  
  // Only create if it doesn't exist
  if (!existsSync(filePath)) {
    // Create an empty file
    writeFileSync(filePath, '');
    console.log(`Created placeholder for ${sound}`);
  } else {
    console.log(`${sound} already exists`);
  }
});

console.log('Sound placeholders created successfully!');
console.log('Replace these with real sound files for production use.');
