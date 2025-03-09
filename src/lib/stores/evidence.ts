import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';
import { supabase } from '../supabase';

export interface Evidence {
  id: string;
  description: string;
  discovered_at?: string;
  image?: string;
}

// Initialize with data from localStorage if available
const storedEvidence = browser ? 
  JSON.parse(localStorage.getItem('evidence') || '[]') : 
  [];

export const evidence = writable<Evidence[]>(storedEvidence);
export const isLoading = writable<boolean>(false);
export const hasError = writable<boolean>(false);

// Subscribe to changes and update localStorage
if (browser) {
  evidence.subscribe(value => {
    localStorage.setItem('evidence', JSON.stringify(value));
  });
}

export async function addEvidence(clue: Omit<Evidence, 'discovered_at'>) {
  try {
    // Update using clue_id instead of id
    const { data, error } = await supabase
      .from('library_clues')
      .update({ discovered: true })
      .eq('clue_id', clue.id)
      .select('id, page_content, clue_image, clue_id')
      .single();

    if (error) {
      console.error('Error updating clue:', error);
      hasError.set(true);
      return;
    }

    if (data) {
      const newEvidence = { 
        id: data.clue_id || data.id, 
        description: data.page_content,
        image: data.clue_image,
        discovered_at: new Date().toISOString() 
      };
      
      // Check if this evidence is already in the store to prevent duplicates
      const currentEvidence = get(evidence);
      const exists = currentEvidence.some(item => item.id === newEvidence.id);
      
      if (!exists) {
        evidence.update(items => [...items, newEvidence]);
      }
    }
  } catch (error) {
    console.error('Error adding evidence:', error);
    hasError.set(true);
  }
}

export async function loadEvidence() {
  try {
    isLoading.set(true);
    hasError.set(false);
    
    const { data, error } = await supabase
      .from('library_clues')
      .select('id, page_content, clue_image, clue_id, discovered')
      .eq('discovered', true);

    if (error) {
      console.error('Error loading evidence:', error);
      hasError.set(true);
      return;
    }

    if (data && data.length > 0) {
      const loadedEvidence = data.map(item => ({
        id: item.clue_id || item.id,
        description: item.page_content,
        image: item.clue_image,
        discovered_at: item.discovered_at || new Date().toISOString()
      }));
      
      evidence.set(loadedEvidence);
    } else {
      // If no data from Supabase but we have local data, keep using that
      const currentEvidence = get(evidence);
      if (currentEvidence.length === 0 || !browser) {
        evidence.set([]);
      }
    }
  } catch (error) {
    console.error('Error loading evidence:', error);
    hasError.set(true);
  } finally {
    isLoading.set(false);
  }
}
