<script lang="ts">
  export let intensity = 0.15; // Grain intensity
  export let flickerSpeed = 0.2; // Flicker animation speed in seconds
</script>

<div class="visual-effects">
  <div 
    class="grain-overlay" 
    style="--grain-intensity: {intensity}; --flicker-speed: {flickerSpeed}s;"
  ></div>
  
  <div class="lighting-effects">
    <div class="candle-light"></div>
    <div class="ambient-glow"></div>
  </div>
</div>

<style>
  .visual-effects {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 100;
  }

  .grain-overlay {
    position: absolute;
    inset: 0;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANxM8mAAAACHRSTlMzMzMzMzMzM85JBgUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAAwSURBVDjLY2AYBaNg4IGgIAAkGYVAJDMTiGRhAZEMDECSkREqzsDABCWBgNGMGQUAQy0GrqRUePYAAAAASUVORK5CYII=');
    background-repeat: repeat;
    mix-blend-mode: overlay;
    opacity: var(--grain-intensity);
    animation: grain var(--flicker-speed) infinite steps(1);
  }

  .lighting-effects {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .candle-light {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 200vmax;
    height: 200vmax;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      circle at center,
      rgba(255, 200, 100, 0.03) 0%,
      rgba(255, 150, 50, 0.02) 40%,
      transparent 70%
    );
    animation: flicker 2s infinite alternate;
  }

  .ambient-glow {
    position: fixed;
    inset: 0;
    background: radial-gradient(
      circle at center,
      rgba(57, 255, 20, 0.03) 0%,
      rgba(42, 0, 60, 0.02) 50%,
      transparent 70%
    );
    animation: pulse 4s ease-in-out infinite;
  }

  @keyframes grain {
    0%, 100% {
      transform: translate(0, 0);
    }
    10% {
      transform: translate(-1%, -1%);
    }
    20% {
      transform: translate(1%, 1%);
    }
    30% {
      transform: translate(-2%, 2%);
    }
    40% {
      transform: translate(2%, -2%);
    }
    50% {
      transform: translate(-1%, 2%);
    }
    60% {
      transform: translate(2%, 1%);
    }
    70% {
      transform: translate(-2%, -1%);
    }
    80% {
      transform: translate(1%, -2%);
    }
    90% {
      transform: translate(-1%, 1%);
    }
  }

  @keyframes flicker {
    0%, 100% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    25% {
      opacity: 0.95;
      transform: translate(-50%, -50%) scale(0.98);
    }
    50% {
      opacity: 0.98;
      transform: translate(-50%, -50%) scale(1.02);
    }
    75% {
      opacity: 0.93;
      transform: translate(-50%, -50%) scale(0.99);
    }
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
  }
</style>
