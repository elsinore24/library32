import { initSoundStorage } from '$lib/supabaseStorage';
import SoundManager from '$lib/SoundManager';
import { initSounds } from '$lib/sounds';

export const prerender = true;
export const ssr = false;

export async function load() {
  // Initialize sound storage in Supabase
  const storageInitialized = await initSoundStorage();
  
  // Initialize sound system
  SoundManager.useSupabaseStorage(storageInitialized);
  initSounds();
  
  return {
    soundsFromSupabase: storageInitialized
  };
}
