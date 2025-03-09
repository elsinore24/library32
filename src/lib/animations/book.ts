export interface BookStyle {
  angle: number;
  radiusX: number;
  radiusY: number;
  speed: number;
  scale: number;
  rotationSpeed: number;
}

export interface Book {
  id: number;
  title: string;
  color: string;
}

export function generateBookStyles(books: Book[]): BookStyle[] {
  return books.map(() => ({
    angle: Math.random() * 360, // Initial angle in degrees
    radiusX: Math.random() * 100 + 120, // Horizontal orbit radius
    radiusY: Math.random() * 80 + 100, // Vertical orbit radius
    speed: Math.random() * 0.5 + 0.3, // Speed of orbit
    scale: 0.5 + Math.random() * 0.2, // Size scaling
    rotationSpeed: Math.random() * 2 - 1, // Random rotation speed (-1 to 1 for direction)
  }));
}

export const bookAnimationCSS = `
  @keyframes orbit {
    0% {
      transform: translate(calc(var(--orbit-radius-x) * 1), calc(var(--orbit-radius-y) * 0)) scale(var(--book-scale));
    }
    25% {
      transform: translate(calc(var(--orbit-radius-x) * 0.7), calc(var(--orbit-radius-y) * 0.7)) scale(var(--book-scale));
    }
    50% {
      transform: translate(calc(var(--orbit-radius-x) * 0), calc(var(--orbit-radius-y) * 1)) scale(var(--book-scale));
    }
    75% {
      transform: translate(calc(var(--orbit-radius-x) * -0.7), calc(var(--orbit-radius-y) * 0.7)) scale(var(--book-scale));
    }
    100% {
      transform: translate(calc(var(--orbit-radius-x) * -1), calc(var(--orbit-radius-y) * 0)) scale(var(--book-scale));
    }
  }

  @keyframes self-rotate {
    from {
      transform: rotateY(0deg);
    }
    to {
      transform: rotateY(360deg);
    }
  }
`;
