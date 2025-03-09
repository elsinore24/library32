<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import SoundManager from '$lib/SoundManager';
  
  export let showControls = true;
  
  let isMuted = false;
  
  onMount(() => {
    // Check if sound is already muted (in case it was set elsewhere)
    isMuted = SoundManager.isMuted();
    
    return () => {
      // Clean up when component is destroyed
    };
  });
  
  function toggleMute() {
    isMuted = SoundManager.toggleMute();
  }
</script>

{#if showControls}
<div 
  class="sound-controls fixed bottom-4 right-4 bg-gray-800 bg-opacity-70 p-3 rounded-full z-50 flex items-center justify-center"
  in:fade={{ duration: 200 }}
  out:fade={{ duration: 200 }}
>
  <button 
    class="text-white hover:text-amber-300 transition-colors" 
    on:click={toggleMute}
    aria-label={isMuted ? "Unmute sound" : "Mute sound"}
  >
    {#if isMuted}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      </svg>
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    {/if}
  </button>
</div>
{/if}
