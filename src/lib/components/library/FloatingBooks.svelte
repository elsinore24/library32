<script lang="ts">
  interface Book {
    id: number;
    title: string;
    color: string;
  }

  export let books: Book[] = [];

  // Generate simpler, more reliable movement patterns
  const bookStyles = books.map(() => {
    // Generate a random position somewhere in the viewport
    const startX = Math.random() * 100; // 0-100% of viewport width
    const startY = Math.random() * 100; // 0-100% of viewport height
    
    // Ensure books have different destinations far from their starting points
    let endX = Math.random() * 100;
    let endY = Math.random() * 100;
    
    // Make sure end point is far enough from start point (at least 50% away)
    while (Math.abs(endX - startX) < 50 && Math.abs(endY - startY) < 50) {
      endX = Math.random() * 100;
      endY = Math.random() * 100;
    }
    
    return {
      // Start and end positions as percentages of viewport
      startX,
      startY,
      endX,
      endY,
      // Z positions for depth (percentage of viewport depth)
      startZ: -50 + Math.random() * 100,
      endZ: -50 + Math.random() * 100,
      
      // Basic book properties
      scale: 0.4 + Math.random() * 0.3,
      rotationSpeed: 15 + Math.random() * 25,  // seconds for one rotation
      
      // Movement timing
      duration: 15 + Math.random() * 30,       // seconds for full path
      delay: Math.random() * 10,               // stagger start times
      
      // Appearance
      rotationX: Math.random() * 20 - 10,
      rotationZ: Math.random() * 20 - 10,
      pageColor: `hsl(${30 + Math.random() * 20}, ${70 + Math.random() * 20}%, ${80 + Math.random() * 15}%)`,
    };
  });
</script>

<div class="book-space" aria-hidden="true">
  <!-- Ambient dust particles -->
  <div class="dust-particles"></div>
  
  {#each books as book, i (book.id)}
    <div
      class="flying-book"
      style="
        --start-x: {bookStyles[i].startX}vw;
        --start-y: {bookStyles[i].startY}vh;
        --start-z: {bookStyles[i].startZ}px;
        --end-x: {bookStyles[i].endX}vw;
        --end-y: {bookStyles[i].endY}vh;
        --end-z: {bookStyles[i].endZ}px;
        --book-scale: {bookStyles[i].scale};
        --rotation-speed: {bookStyles[i].rotationSpeed}s;
        --motion-duration: {bookStyles[i].duration}s;
        --motion-delay: {bookStyles[i].delay}s;
        --rotation-x: {bookStyles[i].rotationX}deg;
        --rotation-z: {bookStyles[i].rotationZ}deg;
        --page-color: {bookStyles[i].pageColor};
        animation-duration: var(--motion-duration);
        animation-delay: var(--motion-delay);
      "
    >
      <div class="book-model">
        <!-- Book pages -->
        <div class="book-pages"></div>
        
        <!-- Book spine -->
        <div class="book-spine" style="background-color: {book.color}">
          <div class="spine-detail"></div>
        </div>
        
        <!-- Front cover -->
        <div class="book-cover front" style="background-color: {book.color}">
          <span class="book-title">{book.title}</span>
        </div>
        
        <!-- Back cover -->
        <div class="book-cover back" style="background-color: {book.color}"></div>
        
        <!-- Side edge -->
        <div class="book-edge"></div>
      </div>
    </div>
  {/each}
</div>

<style>
  .book-space {
    position: fixed;
    inset: 0;
    perspective: 1200px;
    overflow: hidden;
    pointer-events: none;
    z-index: 10;
  }

  /* Dust particles effect */
  .dust-particles {
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(circle at center, rgba(255,255,255,0.01) 0%, transparent 1%, transparent 100%),
      radial-gradient(circle at 20% 80%, rgba(255,255,255,0.01) 0%, transparent 0.5%, transparent 100%),
      radial-gradient(circle at 80% 30%, rgba(255,255,255,0.01) 0%, transparent 0.5%, transparent 100%);
    background-size: 
      3px 3px,
      4px 4px,
      2px 2px;
    animation: dust-movement 30s linear infinite;
    opacity: 0.7;
    filter: blur(0.4px);
  }

  /* The flying book container */
  .flying-book {
    position: absolute;
    width: 80px;
    height: 120px;
    transform-style: preserve-3d;
    /* Start at the beginning position */
    left: var(--start-x);
    top: var(--start-y);
    transform: 
      translateZ(var(--start-z)) 
      scale(var(--book-scale));
    /* Direct linear movement from start to end positions */
    animation-name: fly-across-room;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.4));
    will-change: transform, left, top;
  }

  /* The book model itself - rotates independently */
  .book-model {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    animation: spin var(--rotation-speed) infinite linear;
    transform: rotateX(var(--rotation-x)) rotateZ(var(--rotation-z));
  }

  .book-spine {
    position: absolute;
    width: 20px;
    height: 100%;
    left: -10px;
    transform: rotateY(-90deg);
    transform-origin: right;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
  }

  .spine-detail {
    height: 80%;
    width: 2px;
    background: linear-gradient(
      to bottom,
      transparent 10%,
      rgba(255, 255, 255, 0.2) 15%,
      rgba(255, 255, 255, 0.2) 85%,
      transparent 90%
    );
    margin: 0 auto;
    position: relative;
  }

  .spine-detail::before, .spine-detail::after {
    content: '';
    position: absolute;
    width: 4px;
    height: 4px;
    background-color: rgba(255, 255, 255, 0.3);
    left: -1px;
    border-radius: 50%;
  }

  .spine-detail::before {
    top: 10%;
  }

  .spine-detail::after {
    bottom: 10%;
  }

  .book-pages {
    position: absolute;
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    left: 2px;
    top: 2px;
    background-color: var(--page-color);
    transform: translateZ(-1px);
    border-radius: 1px 3px 3px 1px;
    background-image: 
      linear-gradient(to bottom, 
        rgba(0,0,0,0.02) 0%, 
        transparent 10%,
        rgba(0,0,0,0.01) 90%, 
        rgba(0,0,0,0.03) 100%);
  }

  .book-pages::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: linear-gradient(
      to right,
      transparent 0%,
      rgba(0, 0, 0, 0.1) 100%
    );
  }

  .book-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 3px;
    box-shadow: 
      0 4px 8px rgba(0, 0, 0, 0.2),
      0 1px 3px rgba(0, 0, 0, 0.15),
      inset 0 0 15px rgba(0, 0, 0, 0.2);
    background-image: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0) 40%,
      rgba(0, 0, 0, 0.15) 100%
    );
    border: 1px solid rgba(0, 0, 0, 0.3);
  }

  .book-cover.front {
    transform: translateZ(10px);
  }

  .book-cover.back {
    transform: translateZ(-10px) rotateY(180deg);
    filter: brightness(0.8);
  }

  .book-edge {
    position: absolute;
    height: 100%;
    width: 20px;
    right: -10px;
    background-color: var(--page-color);
    transform: rotateY(90deg);
    transform-origin: left;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
  }

  .book-title {
    font-size: 0.65rem;
    color: white;
    text-align: center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    font-family: var(--font-burton, serif);
    transform: translateZ(1px);
    font-weight: bold;
    line-height: 1.2;
    letter-spacing: 0.5px;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Simplified direct movement animation */
  @keyframes fly-across-room {
    0% {
      left: var(--start-x);
      top: var(--start-y);
      transform: translateZ(var(--start-z)) scale(var(--book-scale));
    }
    25% {
      left: calc((var(--start-x) * 0.75) + (var(--end-x) * 0.25));
      top: calc((var(--start-y) * 0.25) + (var(--end-y) * 0.75));
      transform: translateZ(calc((var(--start-z) * 0.5) + (var(--end-z) * 0.5))) scale(calc(var(--book-scale) * 1.1));
    }
    50% {
      left: calc((var(--start-x) * 0.5) + (var(--end-x) * 0.5));
      top: calc((var(--start-y) * 0.5) + (var(--end-y) * 0.5));
      transform: translateZ(calc((var(--start-z) * 0.25) + (var(--end-z) * 0.75))) scale(var(--book-scale));
    }
    75% {
      left: calc((var(--start-x) * 0.25) + (var(--end-x) * 0.75));
      top: calc((var(--start-y) * 0.75) + (var(--end-y) * 0.25));
      transform: translateZ(calc((var(--start-z) * 0.75) + (var(--end-z) * 0.25))) scale(calc(var(--book-scale) * 0.9));
    }
    100% {
      left: var(--end-x);
      top: var(--end-y);
      transform: translateZ(var(--end-z)) scale(var(--book-scale));
    }
  }

  /* Separate rotation animation */
  @keyframes spin {
    from { transform: rotateY(0deg) rotateX(var(--rotation-x)) rotateZ(var(--rotation-z)); }
    to { transform: rotateY(360deg) rotateX(var(--rotation-x)) rotateZ(var(--rotation-z)); }
  }

  @keyframes dust-movement {
    0% { background-position: 0 0, 0 0, 0 0; }
    100% { background-position: 100px 100px, -100px 50px, 50px -50px; }
  }

  @media (max-width: 768px) {
    .flying-book {
      width: 65px;
      height: 100px;
    }

    .book-title {
      font-size: 0.55rem;
    }
  }
</style>
