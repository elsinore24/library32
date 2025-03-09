<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import BookPuzzle from './library/BookPuzzle.svelte';
  import FloatingBooks from './library/FloatingBooks.svelte';
  import SecretCompartment from './library/SecretCompartment.svelte';
  import VisualEffects from './library/VisualEffects.svelte';
  import Candle from './library/Candle.svelte';
  import { evidence } from '../lib/stores/evidence';
  import SoundManager from '../lib/SoundManager';

  let showPuzzle = false,
      puzzleSolved = false,
      pageLoaded = false;

  const LIBRARY_BG = 'https://kxmwcpeuiklblpehddkz.supabase.co/storage/v1/object/public/suspects//library.jpeg';

  const books = [
    { id: 1, title: "Mortiferous Mushrooms", color: "#8C0000" },
    { id: 2, title: "Aconitum Anthology", color: "#2A003C" },
    { id: 3, title: "Venomous Flora", color: "#39FF14" },
    { id: 4, title: "Dark Rituals", color: "#0A0004" }
  ];

  onMount(() => {
    SoundManager.playAmbient('library-ambience.mp3', {
      volume: 0.3,
      fade: true,
      fadeIn: 3000
    });
    setTimeout(() => (pageLoaded = true), 100);
  });

  onDestroy(() => {
    SoundManager.stopAmbient('library-ambience.mp3', {
      fade: true,
      fadeOut: 2000
    });
  });

  async function handlePuzzleSolved() {
    puzzleSolved = true;
    SoundManager.playEffect('puzzle-solve.mp3', { volume: 0.5 });
    
    evidence.update(items => [
      ...items,
      {
        id: 'book-puzzle',
        description: 'The arrangement reveals a hidden message about poisonous plants...',
        discovered_at: new Date().toISOString(),
        image: '/clue-images/poisoned-page.png'
      }
    ]);

    SoundManager.playEffect('secret-reveal.mp3', {
      volume: 0.4,
      fade: true,
      fadeIn: 1000
    });
  }

  function handleExamineBookshelf() {
    showPuzzle = true;
    SoundManager.playEffect('bookshelf-creak.mp3', { volume: 0.4 });
  }
</script>

<div 
  class="library-container min-h-screen overflow-hidden relative"
  style="background-image: url({LIBRARY_BG}); background-size: cover;"
>
  <div class="absolute inset-0 bg-black/50 z-0"></div>
  <VisualEffects intensity={puzzleSolved ? 0.18 : 0.12} flickerSpeed={0.15} />

  <div class="absolute bottom-8 left-8 z-50">
    <a 
      href="/"
      class="text-parchment hover:text-accent transition-colors duration-300 text-lg"
    >
      ← Return Home
    </a>
  </div>

  <Candle size="large" position={{ x: 50, y: 20 }} intensity={puzzleSolved ? 1.2 : 1} />
  <Candle size="medium" position={{ x: 15, y: 40 }} />
  <Candle size="medium" position={{ x: 85, y: 40 }} />

  <div class="absolute inset-0" style="pointer-events: none; z-index: 1;">
    {#if !showPuzzle}
      <FloatingBooks {books} />
    {/if}
  </div>

  {#if pageLoaded}
    <main
      class="relative z-10 max-w-6xl mx-auto px-4 py-4 md:py-12 min-h-screen flex items-center"
      in:fade={{ duration: 1000, delay: 300 }}
    >
      <div class="puzzle-container relative p-4 md:p-8 rounded-lg border-0 w-full {puzzleSolved ? 'solved' : ''}">
        {#if !showPuzzle}
          <div class="text-center" in:fade={{ duration: 500 }}>
            <button 
              class="px-6 py-3 md:px-8 md:py-4 bg-primary/80 hover:bg-accent/20 text-parchment rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-1 focus:ring-accent/30"
              on:click={handleExamineBookshelf}
            >
              <span class="text-lg md:text-xl font-burton">Examine the Bookshelf</span>
            </button>
          </div>
        {:else}
          <div class="puzzle-wrapper" in:fade={{ duration: 800 }}>
            <BookPuzzle 
              {books} 
              on:solve={handlePuzzleSolved}
              disabled={puzzleSolved}
            />
          </div>
        {/if}

        {#if puzzleSolved}
          <div class="mt-8" in:fly={{ y: 20, duration: 800 }}>
            <SecretCompartment revealed={true} />
          </div>
        {/if}
      </div>
    </main>
  {/if}
</div>

<style>
  .library-container {
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
  }

  :global(body) {
    overflow-x: hidden;
    background-color: #0A0004;
  }

  .puzzle-container {
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.0);
    transition: all 0.5s ease-in-out;
    background: transparent;
    backdrop-filter: blur(0px);
  }

  .puzzle-container.solved {
    box-shadow: 
      0 0 40px rgba(0, 0, 0, 0.3),
      0 0 2px rgba(57, 255, 20, 0.2);
  }

  .puzzle-wrapper {
    transition: transform 0.3s ease-out;
  }

  button {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  }

  @media (min-width: 768px) {
    .puzzle-container {
      margin-top: -15vh;
    }
  }

  @media (max-width: 767px) {
    .puzzle-container {
      margin-top: -20vh;
    }
  }
</style>
