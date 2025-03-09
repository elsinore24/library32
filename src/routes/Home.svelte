<script lang="ts">
  import { onMount } from 'svelte';
  import { evidence, loadEvidence } from '../lib/stores/evidence';

  let pageLoaded = false;

  onMount(() => {
    loadEvidence();
    setTimeout(() => (pageLoaded = true), 100);
  });
</script>

<div class="p-8 pt-16 animate-fade-in font-burton text-parchment flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-black via-obsidian to-gray-900 relative">
  <div class="mist"></div>
  
  <div class="max-w-xl w-full mx-auto text-center z-10">
    <!-- Page Title -->
    <h1 class="text-3xl md:text-4xl lg:text-5xl mb-12 text-parchment animate-fade-in transform scale-95 hover:scale-100 transition-all duration-500 tracking-wide glow-title dripping-title">
      The Haunted Library
      <span class="drip"></span>
    </h1>
    
    <!-- Room Links -->
    <div class="mb-12">
      <a 
        href="/library" 
        class="w-40 h-40 mx-auto p-4 border border-accent rounded-full hover:bg-accent/10 transition-all duration-300 transform hover:scale-110 hover:rotate-3 shadow-[0_0_15px_#00ff00] text-parchment flex items-center justify-center text-center"
      >
        <p class="text-sm md:text-base leading-snug">
          Uncover secrets hidden among ancient tomes...
        </p>
      </a>
    </div>

    <!-- Evidence Board -->
    <div class="w-full">
      <h3 class="text-2xl md:text-3xl mb-6 text-parchment">Evidence Board</h3>
      {#if $evidence.length === 0}
        <p class="text-accent animate-flicker text-xl shadow-[0_0_20px_#ff0000]">No evidence collected yet...</p>
      {:else}
        <ul class="space-y-4">
          {#each $evidence as item}
            <li class="evidence-card p-4 border border-accent/50 rounded bg-parchment text-black shadow-lg hover:shadow-[0_0_25px_#ff0000] transform hover:-rotate-1 transition-all duration-300">
              <p class="mb-2">{item.description}</p>
              
              {#if item.image}
                <img 
                  src={item.image} 
                  alt="Evidence photo" 
                  class="w-full max-w-md mx-auto rounded-lg border border-primary/30 mt-4"
                  loading="lazy"
                  on:error={(e) => e.currentTarget.src = '/default-clue.png'}
                />
              {/if}
              
              <div class="text-sm text-accent/60 mt-2">
                {new Date(item.discovered_at || '').toLocaleString()}
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  </div>
</div>

<style>
  .mist {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: float 6s ease-in-out infinite;
    pointer-events: none;
    opacity: 0.6;
  }

  @keyframes float {
    0% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0); }
  }

  /* Title Glow Effect */
  .glow-title {
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #ff0000, 0 0 30px #ff0000;
    animation: flicker 2.5s infinite;
  }

  @keyframes flicker {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
    70% {
      opacity: 0.9;
    }
    90% {
      opacity: 0.85;
    }
  }

  /* Dripping Blood Effect */
  .dripping-title {
    position: relative;
    color: #ff0000;
    overflow: visible;
  }

  .dripping-title::before,
  .dripping-title::after,
  .dripping-title .drip {
    content: '';
    position: absolute;
    background: #ff0000;
    border-radius: 50%;
  }

  .dripping-title::before {
    width: 5px;
    height: 5px;
    top: 100%;
    left: 20%;
    animation: drip 4s infinite ease-in-out;
  }

  .dripping-title::after {
    width: 7px;
    height: 7px;
    top: 100%;
    left: 60%;
    animation: drip 5s infinite ease-in-out;
    animation-delay: 1s;
  }

  .dripping-title .drip {
    width: 6px;
    height: 6px;
    top: 100%;
    left: 40%;
    animation: drip 6s infinite ease-in-out;
    animation-delay: 2s;
  }

  @keyframes drip {
    0% {
      transform: translateY(0) scaleX(0.8);
      opacity: 1;
    }
    25% {
      transform: translateY(20px) scaleX(1);
    }
    50% {
      transform: translateY(50px) scaleX(1.1);
      opacity: 0.8;
    }
    75% {
      transform: translateY(70px) scaleX(1.2);
      opacity: 0.5;
    }
    100% {
      transform: translateY(90px) scaleX(1.3);
      opacity: 0;
    }
  }
</style>
