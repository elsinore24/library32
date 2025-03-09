<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { addEvidence, evidence } from '$lib/stores/evidence';
  import SoundManager from '$lib/SoundManager';
  import { base } from '$app/paths';

  export let visible = false;
  export let clueId = "poisoned-page";
  
  const dispatch = createEventDispatcher();
  let clueFound = false;
  // Update the image path to use the correct Supabase URL
  let clueImage = "https://kxmwcpeuiklblpehddkz.supabase.co/storage/v1/object/public/clues//library%20ancient%20manuscript.jpeg";
  
  // Fallback to static image if available
  function handleImageError() {
    clueImage = `${base}/images/clues/poisoned-page.png`;
  }

  // Check if this clue is already discovered
  onMount(() => {
    const unsubscribe = evidence.subscribe(items => {
      clueFound = items.some(item => item.id === clueId);
    });
    
    return unsubscribe;
  });

  function handleClueClick() {
    if (!clueFound) {
      clueFound = true;
      SoundManager.playEffect('discovery', { volume: 0.5 });
      
      // Add the evidence to the store
      addEvidence({
        id: clueId,
        description: "A page torn from 'Mortiferous Mushrooms' with notes about a deadly poison recipe. The margins contain handwritten notes about dosage calculations.",
        image: clueImage
      });
      
      dispatch('clueFound');
    }
  }
</script>

{#if visible}
  <div 
    class="secret-compartment"
    in:fly={{ y: 50, duration: 800 }}
    out:fade={{ duration: 300 }}
  >
    <div class="compartment-interior">
      {#if !clueFound}
        <div 
          class="clue-item"
          on:click={handleClueClick}
          on:keydown={(e) => e.key === 'Enter' && handleClueClick()}
          tabindex="0"
          role="button"
          aria-label="Examine mysterious page"
        >
          <img 
            src={clueImage} 
            alt="A torn page with poisonous mushroom illustrations" 
            class="clue-image"
            on:error={handleImageError}
          />
        </div>
      {:else}
        <div class="empty-compartment">
          <span class="text-sm text-gray-400">You collected the evidence</span>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .secret-compartment {
    position: absolute;
    bottom: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    max-width: 300px;
    height: 200px;
    background: linear-gradient(to bottom, #2a1a0a, #1a0a00);
    border: 2px solid #3a2a1a;
    border-radius: 5px;
    box-shadow: 
      inset 0 0 10px rgba(0, 0, 0, 0.8),
      0 0 20px rgba(0, 0, 0, 0.5);
    padding: 1rem;
    z-index: 20;
  }

  .compartment-interior {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 3px;
  }

  .clue-item {
    cursor: pointer;
    transition: transform 0.3s ease;
    max-width: 90%;
    max-height: 90%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .clue-item:hover {
    transform: scale(1.05);
  }

  .clue-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border: 1px solid #3a2a1a;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  .empty-compartment {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-style: italic;
  }
</style>
