<script lang="ts">
  import SoundUploader from '$lib/components/SoundUploader.svelte';
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">Sound Management</h1>
  
  <div class="bg-gray-900 p-6 rounded-lg shadow-lg">
    <SoundUploader />
  </div>
  
  <div class="mt-8">
    <h2 class="text-xl font-semibold mb-4">Instructions</h2>
    <div class="prose prose-invert">
      <p>
        This page allows you to upload sound files to Supabase storage for use in the game.
        The uploaded sounds will be available to the SoundManager component.
      </p>
      <ol class="list-decimal pl-5">
        <li>Select multiple audio files using the file input</li>
        <li>Wait for the upload to complete</li>
        <li>The files will be stored in Supabase and available to the game</li>
      </ol>
      <p class="mt-4 text-amber-400">
        Note: Make sure the filenames match those expected by the SoundManager.
      </p>
    </div>
  </div>
</div>
