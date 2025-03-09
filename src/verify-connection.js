// This script verifies that the application can access static files
// Run with: node src/verify-connection.js

import { readFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Verifying static file connections...');

// Check if static folder exists
const staticDir = join(__dirname, '../static');
if (!existsSync(staticDir)) {
  console.error('❌ Static directory not found!');
  console.log('Creating static directory...');
  mkdirSync(staticDir, { recursive: true });
  console.log('✅ Static directory created');
} else {
  console.log('✅ Static directory exists');
}

// Check if sounds folder exists
const soundsDir = join(staticDir, 'sounds');
if (!existsSync(soundsDir)) {
  console.error('❌ Sounds directory not found!');
  console.log('Creating sounds directory...');
  mkdirSync(soundsDir, { recursive: true });
  console.log('✅ Sounds directory created');
} else {
  console.log('✅ Sounds directory exists');
}

// List all files in the sounds directory
console.log('\nSound files in static/sounds:');
try {
  const files = readdirSync(soundsDir);
  if (files.length === 0) {
    console.log('No sound files found');
  } else {
    files.forEach(file => {
      const stats = statSync(join(soundsDir, file));
      console.log(`- ${file} (${stats.size} bytes)`);
    });
  }
} catch (error) {
  console.error('Error reading sounds directory:', error.message);
}

// Check vite.config.js for proper static file handling
const viteConfigPath = join(__dirname, '../vite.config.js');
if (existsSync(viteConfigPath)) {
  const viteConfig = readFileSync(viteConfigPath, 'utf8');
  console.log('\nChecking vite.config.js:');
  
  if (viteConfig.includes('publicDir') || viteConfig.includes('static')) {
    console.log('✅ Vite config appears to handle static files');
  } else {
    console.log('⚠️ Vite config might need publicDir setting');
  }
} else {
  console.log('❌ vite.config.js not found');
}

console.log('\nVerification complete!');
