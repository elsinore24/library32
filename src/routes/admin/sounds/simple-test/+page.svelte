<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  
  let files = [];
  let isLoading = true;
  let error = '';
  const BUCKET_NAME = 'game-sounds';
  
  onMount(async () => {
    try {
      isLoading = true;
      
      // Simple direct test of Supabase storage
      const { data, error: listError } = await supabase.storage.from(BUCKET_NAME).list();
      
      if (listError) {
        console.error('Error listing files:', listError);
        error = `Storage error: ${listError.message}`;
      } else {
        files = data || [];
        console.log('Files found:', files);
      }
    } catch (err) {
      console.error('Test error:', err);
      error = `Test error: ${err.message}`;
    } finally {
      isLoading = false;
    }
  });
  
  function getPublicUrl(filename) {
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filename);
    return data.publicUrl;
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">Simple Supabase Storage Test</h1>
  
  {#if isLoading}
    <p>Loading...</p>
  {:else if error}
    <div class="bg-red-900 text-white p-4 rounded-lg mb-6">
      <h2 class="font-bold">Error</h2>
      <p>{error}</p>
    </div>
  {:else}
    <div class="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 class="text-xl font-semibold mb-4">Files in Storage</h2>
      {#if files.length === 0}
        <p class="text-amber-400">No files found in storage</p>
      {:else}
        <p class="mb-2">Found {files.length} files:</p>
        <ul class="space-y-2">
          {#each files as file}
            <li class="border border-gray-700 p-3 rounded">
              <div>
                <span class="font-medium">{file.name}</span>
              </div>
              <div class="text-xs text-gray-400 mt-1">
                ID: {file.id}
              </div>
              <div class="text-xs text-gray-400">
                URL: <a href={getPublicUrl(file.name)} target="_blank" class="text-blue-400 hover:underline">{getPublicUrl(file.name)}</a>
              </div>
            </li>
          {/each}
        </ul>
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
