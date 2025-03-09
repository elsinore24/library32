<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { listSounds, getSoundUrl } from '$lib/supabaseStorage';
  
  let directFiles: any[] = [];
  let helperFiles: any[] = [];
  let bookDragUrl = '';
  let fetchResult = '';
  let isLoading = true;
  let error = '';
  
  onMount(async () => {
    try {
      isLoading = true;
      error = '';
      
      // Test 1: Direct Supabase storage API
      console.log('Testing direct Supabase storage API...');
      const { data, error: listError } = await supabase.storage.from('game-sounds').list();
      
      if (listError) {
        console.error('Error listing files directly:', listError);
        error = `Direct API error: ${listError.message}`;
      } else {
        directFiles = data || [];
        console.log('Direct API results:', directFiles);
      }
      
      // Test 2: Helper function
      console.log('Testing helper function...');
      const sounds = await listSounds();
      helperFiles = sounds;
      console.log('Helper function results:', helperFiles);
      
      // Test 3: Specific file
      if (directFiles.some(file => file.name === 'bookDrag.mp3')) {
        bookDragUrl = getSoundUrl('bookDrag.mp3');
        
        // Test 4: Fetch the file
        try {
          const response = await fetch(bookDragUrl);
          if (response.ok) {
            fetchResult = `Success: ${response.status} ${response.statusText}, Content-Type: ${response.headers.get('content-type')}, Size: ${response.headers.get('content-length')} bytes`;
          } else {
            fetchResult = `Failed: ${response.status} ${response.statusText}`;
          }
        } catch (fetchErr) {
          fetchResult = `Fetch error: ${fetchErr.message}`;
        }
      }
    } catch (err) {
      console.error('Test error:', err);
      error = `Test error: ${err.message}`;
    } finally {
      isLoading = false;
    }
  });
  
  function playSound(url: string) {
    const audio = new Audio(url);
    audio.onerror = (e) => console.error('Audio error:', e);
    audio.oncanplaythrough = () => console.log('Audio can play through');
    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch(e => console.error('Play error:', e));
    }
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">Supabase Storage Test</h1>
  
  {#if isLoading}
    <div class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  {:else if error}
    <div class="bg-red-900 text-white p-4 rounded-lg mb-6">
      <h2 class="font-bold">Error</h2>
      <p>{error}</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Test 1: Direct API -->
      <div class="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-semibold mb-4">Direct Supabase API</h2>
        {#if directFiles.length === 0}
          <p class="text-amber-400">No files found using direct API</p>
        {:else}
          <p class="mb-2">Found {directFiles.length} files:</p>
          <ul class="space-y-2">
            {#each directFiles as file}
              <li class="border border-gray-700 p-3 rounded">
                <div class="flex justify-between items-center">
                  <span>{file.name}</span>
                  <button 
                    class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    on:click={() => playSound(getSoundUrl(file.name))}
                  >
                    Play
                  </button>
                </div>
                <div class="text-xs text-gray-400 mt-1">
                  ID: {file.id}, Size: {Math.round(file.metadata?.size / 1024)} KB
                </div>
                <div class="text-xs text-gray-400">
                  URL: <a href={getSoundUrl(file.name)} target="_blank" class="text-blue-400 hover:underline">{getSoundUrl(file.name)}</a>
                </div>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
      
      <!-- Test 2: Helper Function -->
      <div class="bg-gray-900 p-6 rounded-lg shadow-lg">
        <h2 class="text-xl font-semibold mb-4">Helper Function</h2>
        {#if helperFiles.length === 0}
          <p class="text-amber-400">No files found using helper function</p>
        {:else}
          <p class="mb-2">Found {helperFiles.length} files:</p>
          <ul class="space-y-2">
            {#each helperFiles as file}
              <li class="border border-gray-700 p-3 rounded">
                <div class="flex justify-between items-center">
                  <span>{file.name}</span>
                  <button 
                    class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    on:click={() => playSound(getSoundUrl(file.name))}
                  >
                    Play
                  </button>
                </div>
                <div class="text-xs text-gray-400 mt-1">
                  ID: {file.id}, Size: {Math.round(file.metadata?.size / 1024)} KB
                </div>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
    
    <!-- Test 3 & 4: Specific File and Fetch -->
    <div class="bg-gray-900 p-6 rounded-lg shadow-lg mt-6">
      <h2 class="text-xl font-semibold mb-4">Specific File Test: bookDrag.mp3</h2>
      {#if !bookDragUrl}
        <p class="text-amber-400">bookDrag.mp3 not found in storage</p>
      {:else}
        <div class="mb-4">
          <p class="mb-2">File URL:</p>
          <div class="bg-gray-800 p-3 rounded font-mono text-sm break-all">
            {bookDragUrl}
          </div>
        </div>
        
        <div class="mb-4">
          <p class="mb-2">Fetch Result:</p>
          <div class="bg-gray-800 p-3 rounded font-mono text-sm">
            {fetchResult}
          </div>
        </div>
        
        <button 
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          on:click={() => playSound(bookDragUrl)}
        >
          Play bookDrag.mp3
        </button>
      {/if}
    </div>
  {/if}
</div>

<style>
  :global(body) {
    background-color: #1a1a1a;
    color: #f0f0f0;
  }
</style>
