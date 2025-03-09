<script lang="ts">
  export let size = 'medium'; // 'small', 'medium', 'large'
  export let position: { x: number; y: number } = { x: 50, y: 50 }; // percentage values
  export let intensity = 1.0;
</script>

<div 
  class="candle {size}"
  style="
    left: {position.x}%; 
    top: {position.y}%;
    --intensity: {intensity};
  "
>
  <div class="candle-body">
    <div class="wax"></div>
    <div class="wick"></div>
    <div class="flame">
      <div class="flame-core"></div>
      <div class="flame-outer"></div>
      <div class="glow"></div>
    </div>
  </div>
</div>

<style>
  .candle {
    position: absolute;
    transform: translate(-50%, -50%);
    z-index: 5;
  }

  .candle.small { --candle-scale: 0.5; }
  .candle.medium { --candle-scale: 0.7; }
  .candle.large { --candle-scale: 0.9; }

  .candle-body {
    position: relative;
    transform: scale(var(--candle-scale));
  }

  .wax {
    width: 30px;
    height: 100px;
    background: linear-gradient(
      to bottom,
      rgba(255, 245, 230, 0.9),
      rgba(255, 245, 230, 0.7)
    );
    border-radius: 4px;
    box-shadow: 
      0 0 10px rgba(255, 245, 230, 0.3),
      inset 0 0 15px rgba(0, 0, 0, 0.1);
  }

  .wick {
    position: absolute;
    top: -5px;
    left: 50%;
    width: 4px;
    height: 12px;
    background: #2a2a2a;
    transform: translateX(-50%);
  }

  .flame {
    position: absolute;
    top: -20px;
    left: 50%;
    transform-origin: center bottom;
    animation: flame-flicker 0.1s infinite alternate;
  }

  .flame-core {
    position: absolute;
    width: 12px;
    height: 25px;
    background: rgba(255, 230, 110, calc(0.9 * var(--intensity)));
    border-radius: 50% 50% 20% 20%;
    transform: translateX(-50%);
    animation: core-flicker 0.05s infinite alternate;
  }

  .flame-outer {
    position: absolute;
    width: 20px;
    height: 35px;
    background: rgba(255, 160, 20, calc(0.4 * var(--intensity)));
    border-radius: 50% 50% 20% 20%;
    transform: translateX(-50%);
    filter: blur(2px);
    animation: outer-flicker 0.07s infinite alternate;
  }

  .glow {
    position: absolute;
    width: 100px;
    height: 100px;
    background: radial-gradient(
      circle at center,
      rgba(255, 200, 100, calc(0.4 * var(--intensity))) 0%,
      rgba(255, 150, 50, calc(0.2 * var(--intensity))) 40%,
      transparent 70%
    );
    transform: translate(-50%, -50%);
    animation: glow-pulse 2s infinite alternate;
  }

  @keyframes flame-flicker {
    0%, 100% {
      transform: translateX(-50%) rotate(-2deg) scale(1);
    }
    50% {
      transform: translateX(-50%) rotate(2deg) scale(0.98);
    }
  }

  @keyframes core-flicker {
    0%, 100% {
      transform: translateX(-50%) scale(1);
      opacity: calc(0.9 * var(--intensity));
    }
    50% {
      transform: translateX(-50%) scale(0.95);
      opacity: calc(0.85 * var(--intensity));
    }
  }

  @keyframes outer-flicker {
    0%, 100% {
      transform: translateX(-50%) scale(1);
      opacity: calc(0.4 * var(--intensity));
    }
    50% {
      transform: translateX(-50%) scale(1.05);
      opacity: calc(0.3 * var(--intensity));
    }
  }

  @keyframes glow-pulse {
    0%, 100% {
      opacity: calc(0.4 * var(--intensity));
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: calc(0.3 * var(--intensity));
      transform: translate(-50%, -50%) scale(1.1);
    }
  }
</style>
