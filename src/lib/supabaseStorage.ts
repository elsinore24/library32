import { supabase } from './supabase';

const BUCKET_NAME = 'game-sounds';

/**
 * Checks if the Supabase storage bucket for sounds is accessible
 */
export async function initSoundStorage() {
  try {
    console.log(`Checking access to storage bucket: ${BUCKET_NAME}`);
    
    // List files to verify bucket access instead of checking bucket existence
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list();
    
    if (error) {
      console.error(`Error accessing bucket ${BUCKET_NAME}:`, error.message);
      console.error(`Error details:`, error);
      console.error(`Bucket URL: https://kxmwcpeuiklblpehddkz.supabase.co/storage/v1/object/public/${BUCKET_NAME}/`);
      console.log(`Will fall back to local sound files`);
      return false;
    }
    
    console.log(`Successfully accessed bucket ${BUCKET_NAME}. Found ${data?.length || 0} files.`);
    return true;
  } catch (err) {
    console.error(`Unexpected error accessing bucket ${BUCKET_NAME}:`, err);
    console.log(`Will fall back to local sound files`);
    return false;
  }
}

/**
 * Gets the public URL for a sound file in Supabase storage
 */
export function getSoundUrl(filename: string): string {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filename);
  console.log(`Generated public URL for ${filename}: ${data.publicUrl}`);
  return data.publicUrl;
}

/**
 * Lists all sound files in the storage bucket
 */
export async function listSounds() {
  try {
    console.log(`Listing files in bucket ${BUCKET_NAME}`);
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list();
    
    if (error) {
      console.error(`Error listing sounds in ${BUCKET_NAME}:`, error.message);
      return [];
    }
    
    console.log(`Found ${data?.length || 0} sound files in bucket`);
    return data || [];
  } catch (err) {
    console.error('Failed to list sounds:', err);
    return [];
  }
}

/**
 * Checks if a sound file exists in storage
 */
export async function soundExists(filename: string): Promise<boolean> {
  try {
    console.log(`Checking if ${filename} exists in bucket ${BUCKET_NAME}`);
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list();
    
    if (error) {
      console.error(`Error checking file existence for ${filename}:`, error.message);
      return false;
    }
    
    const exists = data?.some(file => file.name === filename) || false;
    console.log(`File ${filename} ${exists ? 'exists' : 'does not exist'} in bucket`);
    return exists;
  } catch (err) {
    console.error(`Error checking if ${filename} exists:`, err);
    return false;
  }
}

/**
 * Uploads a sound file to Supabase storage
 */
export async function uploadSound(file: File): Promise<string | null> {
  try {
    console.log(`Attempting to upload ${file.name} to bucket ${BUCKET_NAME}`);
    
    // Check bucket access first
    const bucketAccessible = await initSoundStorage();
    if (!bucketAccessible) {
      console.error(`Cannot upload ${file.name}: bucket ${BUCKET_NAME} is not accessible`);
      return null;
    }
    
    console.log(`Starting upload of ${file.name} (${file.size} bytes)`);
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(file.name, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error(`Error uploading ${file.name}:`, error.message);
      console.error(`Upload error details:`, error);
      return null;
    }
    
    console.log(`Successfully uploaded ${file.name}`, data);
    
    // Mark the sound as uploaded in the database
    await markSoundUploaded(file.name);
    
    // Return the public URL
    const url = getSoundUrl(file.name);
    console.log(`Generated public URL for uploaded file: ${url}`);
    return url;
  } catch (err) {
    console.error(`Unexpected error uploading ${file.name}:`, err);
    return null;
  }
}

/**
 * Marks a sound file as uploaded in the database
 */
export async function markSoundUploaded(filename: string): Promise<boolean> {
  try {
    console.log(`Marking ${filename} as uploaded in database`);
    const { data, error } = await supabase.rpc('mark_sound_uploaded', { 
      sound_filename: filename 
    });
    
    if (error) {
      console.error(`Error marking ${filename} as uploaded:`, error.message);
      return false;
    }
    
    console.log(`Successfully marked ${filename} as uploaded in database`);
    return data || false;
  } catch (err) {
    console.error(`Failed to mark ${filename} as uploaded:`, err);
    return false;
  }
}

/**
 * Gets the list of sounds that need to be uploaded
 */
export async function getSoundsToUpload() {
  try {
    console.log(`Fetching list of sounds that need to be uploaded`);
    const { data, error } = await supabase.from('sounds_to_upload').select('*');
    
    if (error) {
      console.error('Error getting sounds to upload:', error.message);
      return [];
    }
    
    console.log(`Found ${data?.length || 0} sounds that need uploading`);
    return data || [];
  } catch (err) {
    console.error('Failed to get sounds to upload:', err);
    return [];
  }
}
