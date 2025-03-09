<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import BookPuzzle from '$lib/components/library/BookPuzzle.svelte';
  import FloatingBooks from '$lib/components/library/FloatingBooks.svelte';
  import SecretCompartment from '$lib/components/library/SecretCompartment.svelte';
  import VisualEffects from '$lib/components/library/VisualEffects.svelte';
  import Candle from '$lib/components/library/Candle.svelte';
  import { evidence } from '$lib/stores/evidence';
  import SoundManager from '$lib/SoundManager';
  import { base } from '$app/paths';

  let showPuzzle = false,
      puzzleSolved = false,
      pageLoaded = false,
      candleFlicker = false,
      discoveredPoints = new Set(),
      patternProgress = 0;

  const LIBRARY_BG = 'https://kxmwcpeuiklblpehddkz.supabase.co/storage/v1/object/public/suspects//library.jpeg';

  const books = [
    { id: 1, title: "Mortiferous Mushrooms", color: "#8C0000" },
    { id: 2, title: "Aconitum Anthology", color: "#2A003C" },
    { id: 3, title: "Venomous Flora", color: "#39FF14" },
    { id: 4, title: "Dark Rituals", color: "#0A0004" }
  ];

  // Determine if we're on a mobile device
  const isMobileDevice = typeof window !== 'undefined' ? 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) : 
    false;

  // Define the candles that need to be activated
  const candles = [
    { 
      id: 'candle1', 
      position: { x: 50, y: 20 },
      size: 'large',
      activated: false,
      baseIntensity: isMobileDevice ? 0.8 : 0.7,
      activeIntensity: isMobileDevice ? 1.6 : 1.4, 
      radius: isMobileDevice ? 10 : 7
    },
    { 
      id: 'candle2', 
      position: { x: 15, y: 40 },
      size: 'medium',
      activated: false,
      baseIntensity: isMobileDevice ? 0.7 : 0.6,
      activeIntensity: isMobileDevice ? 1.5 : 1.3,
      radius: isMobileDevice ? 8 : 6
    },
    { 
      id: 'candle3', 
      position: { x: 85, y: 40 },
      size: 'medium',
      activated: false,
      baseIntensity: isMobileDevice ? 0.7 : 0.6,
      activeIntensity: isMobileDevice ? 1.5 : 1.3,
      radius: isMobileDevice ? 8 : 6
    }
  ];

  let container: HTMLElement;
  let mousePosition = { x: 0, y: 0 };
  let lastInteractionTime = 0;
  let candleIntensityInterval: ReturnType<typeof setInterval>;
  
  // Number of activated candles
  let activatedCandles = 0;

  onMount(() => {
    SoundManager.playAmbient('library-ambience', {
      volume: 0.3,
      fade: true,
      fadeIn: 3000
    });
    setTimeout(() => (pageLoaded = true), 100);
    
    // Setup mouse tracking
    document.addEventListener('mousemove', handleMouseMove);
    
    // Setup touch tracking
    container?.addEventListener('touchmove', handleTouchMove);
    container?.addEventListener('click', handleClick);
    
    // Start subtle candle flicker effect
    startCandleFlickerEffect();
    
    // Prevent scrolling on mobile
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  });

  onDestroy(() => {
    SoundManager.stopAmbient('library-ambience', {
      fade: true,
      fadeOut: 2000
    });
    
    document.removeEventListener('mousemove', handleMouseMove);
    container?.removeEventListener('touchmove', handleTouchMove);
    container?.removeEventListener('click', handleClick);
    
    if (candleIntensityInterval) {
      clearInterval(candleIntensityInterval);
    }
    
    // Restore scrolling when leaving the page
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  });

  function startCandleFlickerEffect() {
    // Subtle candle flicker effect
    candleIntensityInterval = setInterval(() => {
      candleFlicker = !candleFlicker;
    }, 3000);
  }

  function handleMouseMove(e: MouseEvent) {
    if (showPuzzle) return;
    
    if (container) {
      const rect = container.getBoundingClientRect();
      mousePosition = {
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100
      };
      
      // Check if mouse is over a candle
      checkCandleHover();
    }
  }

  function handleTouchMove(e: TouchEvent) {
    if (showPuzzle) return;
    
    if (container) {
      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();
      mousePosition = {
        x: ((touch.clientX - rect.left) / rect.width) * 100,
        y: ((touch.clientY - rect.top) / rect.height) * 100
      };
      
      // Check if touch is over a candle
      checkCandleHover();
    }
  }
  
  function handleClick(e: MouseEvent | TouchEvent) {
    if (showPuzzle) return;
    
    // Check if we're clicking on a candle
    for (let i = 0; i < candles.length; i++) {
      const candle = candles[i];
      if (!candle.activated) {
        const distance = calculateDistance(
          mousePosition.x,
          mousePosition.y,
          candle.position.x,
          candle.position.y
        );
        
        if (distance < candle.radius) {
          activateCandle(i);
          break;
        }
      }
    }
  }
  
  function checkCandleHover() {
    let isHovering = false;
    
    for (const candle of candles) {
      const distance = calculateDistance(
        mousePosition.x,
        mousePosition.y,
        candle.position.x,
        candle.position.y
      );
      
      if (distance < candle.radius && !candle.activated) {
        isHovering = true;
        document.body.style.cursor = 'pointer';
        break;
      }
    }
    
    if (!isHovering) {
      document.body.style.cursor = 'default';
    }
  }
  
  function activateCandle(index: number) {
    if (candles[index].activated) return;
    
    // Activate the candle
    candles[index].activated = true;
    activatedCandles++;
    
    // Play sound
    SoundManager.playEffect('snap', { volume: 0.2 });
    
    // If all candles are activated, show puzzle after a short delay
    if (activatedCandles === candles.length) {
      setTimeout(() => {
        // Show puzzle
        showPuzzle = true;
        SoundManager.playEffect('bookshelf-creak', { volume: 0.4 });
      }, 1500);
    }
  }

  function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  async function handlePuzzleSolved() {
    puzzleSolved = true;
    SoundManager.playEffect('puzzle-solve', { volume: 0.5 });
    
    evidence.update(items => [
      ...items,
      {
        id: 'book-puzzle',
        description: 'The arrangement reveals a hidden message about poisonous plants...',
        discovered_at: new Date().toISOString(),
        image: '/images/clues/poisoned-page.png'
      }
    ]);

    SoundManager.playEffect('secret-reveal', {
      volume: 0.4,
      fade: true,
      fadeIn: 1000
    });
  }
</script>

<div 
  class="library-container fixed inset-0 overflow-hidden"
  style="background-image: url({LIBRARY_BG}); background-size: cover; background-position: center;"
  bind:this={container}
>
  <div class="absolute inset-0 bg-black/50 z-0"></div>
  <VisualEffects intensity={puzzleSolved ? 0.18 : 0.12} flickerSpeed={0.15} />

  <div class="absolute bottom-8 left-8 z-50">
    <a 
      href="{base}/"
      class="text-parchment hover:text-accent transition-colors duration-300 text-lg"
    >
      ← Return Home
    </a>
  </div>

  <!-- Interactive candles -->
  {#each candles as candle, i}
    <div 
      class="candle-interactive {candle.activated ? 'activated' : ''}"
      style="left: {candle.position.x}%; top: {candle.position.y}%;"
    >
      <Candle 
        size={candle.size} 
        position={candle.position} 
        intensity={candle.activated ? candle.activeIntensity : (candleFlicker ? candle.baseIntensity + 0.1 : candle.baseIntensity)} 
      />
      <!-- Interactive area around candle -->
      <div 
        class="candle-hotspot {isMobileDevice ? 'mobile' : ''} {candle.activated ? 'activated' : ''}"
      ></div>
    </div>
  {/each}

  <div class="absolute inset-0 z-10">
    {#if !showPuzzle}
      <FloatingBooks {books} />
    {/if}
  </div>

  {#if pageLoaded}
    <main
      class="relative z-20 w-full h-full flex items-center justify-center px-4"
      in:fade={{ duration: 1000, delay: 300 }}
    >
      <div class="puzzle-container relative p-4 md:p-8 rounded-lg border-0 w-full max-w-2xl {puzzleSolved ? 'solved' : ''}">
        {#if !showPuzzle}
          <div 
            class="bookshelf-interactive"
            in:fade={{ duration: 500 }}
          >
            <div class="bookshelf-area">
              <!-- Empty div for interaction area -->
            </div>
          </div>
        {:else}
          <div class="puzzle-wrapper" in:fade={{ duration: 800 }}>
            <!-- Book puzzle hint poem -->
            {#if !puzzleSolved}
              <div class="puzzle-hint" in:fade={{ duration: 800, delay: 500 }}>
                <p>
                  "From glow to shadow, arrange with care,<br>
                  Bright poison first, then dark despair.<br>
                  The deadly garden blooms by light,<br>
                  To reveal secrets lost in night."
                </p>
              </div>
            {/if}
            
            <BookPuzzle 
              {books} 
              on:solve={handlePuzzleSolved}
              disabled={puzzleSolved}
            />
          </div>
        {/if}

        {#if puzzleSolved}
          <div class="mt-8" in:fly={{ y: 20, duration: 800 }}>
            <SecretCompartment visible={true} />
          </div>
        {/if}
      </div>
    </main>
  {/if}
  
  <!-- First-time user guide - only initial hint about candles -->
  {#if pageLoaded && !showPuzzle && activatedCandles === 0}
    <div class="initial-hint {isMobileDevice ? 'mobile' : ''}" in:fade={{ duration: 800, delay: 1500 }} out:fade={{ duration: 500, delay: 6000 }}>
      <div class="hint-content">
        <span>The candles seem to respond to your presence...</span>
      </div>
    </div>
  {/if}
</div>

<style>
  .library-container {
    background-repeat: no-repeat;
    background-attachment: fixed;
    cursor: default;
    height: 100vh; /* Ensure it's exactly viewport height */
    width: 100vw; /* Ensure it's exactly viewport width */
    position: fixed; /* Keep it fixed in place */
    top: 0;
    left: 0;
  }

  :global(body) {
    overflow: hidden; /* Prevent scrolling on body */
    background-color: #0A0004;
    margin: 0;
    padding: 0;
    position: fixed;
    width: 100%;
    height: 100%;
  }

  :global(html) {
    overflow: hidden; /* Prevent scrolling on html */
  }

  .puzzle-container {
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.0);
    transition: all 0.5s ease-in-out;
    background: transparent;
    -webkit-backdrop-filter: blur(0px);
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

  /* Bookshelf interactive styles */
  .bookshelf-interactive {
    width: 100%;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .bookshelf-area {
    position: relative;
    width: 80%;
    height: 100%;
    border-radius: 8px;
  }

  /* Interactive candle elements */
  .candle-interactive {
    position: absolute;
    z-index: 15;
    transition: all 0.5s ease;
  }

  .candle-interactive.activated {
    filter: brightness(1.5);
  }

  .candle-hotspot {
    position: absolute;
    width: 40px;
    height: 40px;
    margin-left: -20px;
    margin-top: -20px;
    border-radius: 50%;
    background: radial-gradient(
      circle at center,
      rgba(255, 200, 100, 0.05) 0%,
      rgba(255, 200, 100, 0.02) 40%,
      transparent 70%
    );
    pointer-events: all;
    cursor: pointer;
    z-index: 16;
    transition: all 0.3s ease;
  }

  .candle-hotspot.mobile {
    width: 60px;
    height: 60px;
    margin-left: -30px;
    margin-top: -30px;
  }

  .candle-hotspot:hover {
    background: radial-gradient(
      circle at center,
      rgba(255, 200, 100, 0.1) 0%,
      rgba(255, 200, 100, 0.05) 40%,
      transparent 70%
    );
  }

  .candle-hotspot.activated {
    background: radial-gradient(
      circle at center,
      rgba(255, 220, 150, 0.2) 0%,
      rgba(255, 220, 150, 0.1) 40%,
      transparent 70%
    );
    animation: glow 2s infinite alternate;
  }

  /* Initial hint */
  .initial-hint {
    position: fixed;
    bottom: 20%;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    pointer-events: none;
    z-index: 40;
  }

  .initial-hint.mobile {
    bottom: 25%;
  }

  .hint-content {
    background: rgba(0, 0, 0, 0.6);
    color: #f0e6d2;
    padding: 12px 20px;
    border-radius: 30px;
    font-family: var(--font-burton, serif);
    font-size: 1rem;
    text-align: center;
  }

  /* Puzzle hint poem */
  .puzzle-hint {
    margin: 0 auto 20px auto;
    padding: 12px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 8px;
    max-width: 80%;
    text-align: center;
  }
  
  .puzzle-hint p {
    font-family: var(--font-burton, serif);
    color: #d3c7a8;
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0;
    font-style: italic;
    text-shadow: 0 2px 3px rgba(0, 0, 0, 0.5);
  }

  @keyframes glow {
    0% { opacity: 0.6; transform: scale(0.95); }
    100% { opacity: 1; transform: scale(1.05); }
  }

  @media (max-width: 768px) {
    .bookshelf-interactive {
      height: 250px;
    }
  }
</style>
