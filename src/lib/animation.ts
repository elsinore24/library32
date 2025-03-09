import { animate, spring } from 'motion';

export interface AnimationOptions {
  duration?: number;
  easing?: string;
  delay?: number;
}

export function floatAnimation(
  element: HTMLElement, 
  options: AnimationOptions = {}
) {
  return animate(
    element,
    {
      y: [0, -20, 0],
      rotate: [0, 2, -2, 0],
    },
    {
      duration: options.duration || 3000,
      easing: options.easing || 'ease-in-out',
      repeat: Infinity,
    }
  );
}

export function revealAnimation(
  element: HTMLElement,
  options: AnimationOptions = {}
) {
  return animate(
    element,
    {
      opacity: [0, 1],
      scale: [0.9, 1],
      y: [20, 0],
    },
    {
      duration: options.duration || 800,
      easing: 'ease-out',
      delay: options.delay || 0,
    }
  );
}

export function bookSpinAnimation(
  element: HTMLElement,
  options: AnimationOptions = {}
) {
  return animate(
    element,
    { 
      rotateY: [0, 180],
      scale: [1, 1.1, 1],
    },
    {
      duration: options.duration || 1000,
      easing: spring({ stiffness: 100, damping: 10 }),
    }
  );
}
