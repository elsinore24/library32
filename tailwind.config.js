/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#2A003C",
        accent: "#39FF14", 
        obsidian: "#0A0004",
        parchment: "#FFF5E6"
      },
      fontFamily: {
        burton: ['IM Fell English SC', 'Georgia', 'Times New Roman', 'serif']
      },
      animation: {
        'fade-in': 'fade-in 1s ease-out',
        'flicker': 'flicker 2s infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        }
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      }
    }
  },
  plugins: []
}
