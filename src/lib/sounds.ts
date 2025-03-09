import SoundManager from './SoundManager';

    // Sound effect definitions with default options
    export const soundEffects = {
      creak: {
        play: (options = {}) => SoundManager.playEffect('creak', { volume: 0.6, ...options }),
        volume: 0.6
      },
      snap: {
        play: (options = {}) => SoundManager.playEffect('snap', { volume: 0.5, ...options }),
        volume: 0.5
      },
      success: {
        play: (options = {}) => SoundManager.playEffect('success', { volume: 0.7, ...options }),
        volume: 0.7
      },
      whisper: {
        play: (options = {}) => SoundManager.playEffect('whisper', { volume: 0.4, loop: true, ...options }),
        volume: 0.4,
        loop: true
      },
      bookDrag: {
        play: (options = {}) => SoundManager.playEffect('book-drag', { volume: 0.5, ...options }),
        volume: 0.5
      },
      bookPlace: {
        play: (options = {}) => SoundManager.playEffect('book-place', { volume: 0.6, ...options }),
        volume: 0.6
      },
      bookshelfCreak: {
        play: (options = {}) => SoundManager.playEffect('bookshelf-creak', { volume: 0.7, ...options }),
        volume: 0.7
      },
      puzzleSolve: {
        play: (options = {}) => SoundManager.playEffect('puzzle-solve', { volume: 0.8, ...options }),
        volume: 0.8
      },
      secretReveal: {
        play: (options = {}) => SoundManager.playEffect('secret-reveal', { volume: 0.9, ...options }),
        volume: 0.9
      }
    };

    // Ambient sound definitions
    export const ambientSounds = {
      libraryAmbience: {
        play: (options = {}) => SoundManager.playAmbient('library-ambience', { volume: 0.4, loop: true, ...options }),
        stop: (options = {}) => SoundManager.stopAmbient('library-ambience', options),
        volume: 0.4
      }
    };

    // Initialize sound system
    export function initSounds() {
      SoundManager.init();
    }
