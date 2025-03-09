import { Howl, Howler } from 'howler';
    import { getSoundUrl, soundExists } from './supabaseStorage';

    interface SoundOptions {
      volume?: number;
      loop?: boolean;
      rate?: number;
      onend?: () => void;
      onfade?: () => void;
      fade?: boolean;
      fadeIn?: number;
    }

    class SoundManager {
      private static sounds: Record<string, Howl> = {};
      private static ambientSounds: Record<string, Howl> = {};
      private static masterVolume: number = 1.0;
      private static effectsVolume: number = 1.0;
      private static ambientVolume: number = 0.7;
      private static muted: boolean = false;
      private static useSupabase: boolean = true;

      static init() {
        // Set global Howler settings
        Howler.autoUnlock = true;
        Howler.volume(this.masterVolume);
        
        // Preload common sounds
        this.preloadSounds();

        // Log current volume settings
        console.log('Master Volume:', this.masterVolume);
        console.log('Effects Volume:', this.effectsVolume);
        console.log('Ambient Volume:', this.ambientVolume);
        console.log('Muted:', this.muted);
      }

      static preloadSounds() {
        // Preload ambient sounds
        this.loadAmbient('library-ambience', 'library-ambience.mp3');
        
        // Preload effect sounds
        this.loadEffect('book-drag', 'bookDrag.mp3');
        this.loadEffect('book-place', 'bookPlace.mp3');
        this.loadEffect('bookshelf-creak', 'bookshelfCreak.mp3');
        this.loadEffect('puzzle-solve', 'puzzleSolve.mp3');
        this.loadEffect('secret-reveal', 'secretReveal.mp3');
        this.loadEffect('creak', 'creak.mp3');
        this.loadEffect('snap', 'snap.mp3');
        this.loadEffect('success', 'success.mp3');
        this.loadEffect('whisper', 'whisper.mp3');
      }

      static async loadEffect(name: string, filename: string) {
        let url = filename;
        
        if (this.useSupabase) {
          // Check if sound exists in Supabase
          const exists = await soundExists(filename);
          if (exists) {
            url = await getSoundUrl(filename);
          } else {
            // Fallback to local file if not in Supabase
            console.warn(`Sound ${filename} not found in Supabase, using local fallback`);
            url = `sounds/${filename}`;
            this.useSupabase = false;
          }
        } else {
          url = `sounds/${filename}`;
        }
        
        this.sounds[name] = new Howl({
          src: [url],
          volume: this.effectsVolume,
          preload: true,
          html5: false
        });
        
        return this.sounds[name];
      }

      static async loadAmbient(name: string, filename: string) {
        let url = filename;
        
        if (this.useSupabase) {
          // Check if sound exists in Supabase
          const exists = await soundExists(filename);
          if (exists) {
            url = await getSoundUrl(filename);
          } else {
            // Fallback to local file if not in Supabase
            console.warn(`Sound ${filename} not found in Supabase, using local fallback`);
            url = `sounds/${filename}`;
            this.useSupabase = false;
          }
        } else {
          url = `sounds/${filename}`;
        }
        
        this.ambientSounds[name] = new Howl({
          src: [url],
          volume: this.ambientVolume,
          loop: true,
          preload: true,
          html5: true // Better for longer sounds
        });
        
        return this.ambientSounds[name];
      }

      static playAmbient(name: string, options: SoundOptions = {}) {
        if (this.muted) return;
        
        // If the ambient sound isn't loaded yet, load it
        if (!this.ambientSounds[name]) {
          console.warn(`Ambient sound "${name}" not preloaded. Loading now...`);
          this.loadAmbient(name, `${name}.mp3`);
        }
        
        const sound = this.ambientSounds[name];
        if (sound) {
          // Set options
          if (options.volume !== undefined) sound.volume(options.volume * this.ambientVolume);
          if (options.loop !== undefined) sound.loop(options.loop);
          if (options.rate !== undefined) sound.rate(options.rate);
          
          // Play the sound
          sound.play();
          
          console.log('Ambient sound played:', name);
          return sound;
        } else {
          console.error(`Ambient sound "${name}" not found`);
          return null;
        }
      }

      static stopAmbient(name: string, options: { fade?: number } = {}) {
        const sound = this.ambientSounds[name];
        if (sound) {
          if (options.fade) {
            sound.fade(sound.volume(), 0, options.fade);
            setTimeout(() => sound.stop(), options.fade);
          } else {
            sound.stop();
          }
          console.log('Ambient sound stopped:', name);
        } else {
          console.error(`Ambient sound "${name}" not found`);
        }
      }

      static playEffect(name: string, options: SoundOptions = {}) {
        if (this.muted) return;
        
        // If the effect isn't loaded yet, load it
        if (!this.sounds[name]) {
          console.warn(`Sound effect "${name}" not preloaded. Loading now...`);
          this.loadEffect(name, `${name}.mp3`);
        }
        
        const sound = this.sounds[name];
        if (sound) {
          // Set options
          if (options.volume !== undefined) sound.volume(options.volume * this.effectsVolume);
          if (options.loop !== undefined) sound.loop(options.loop);
          if (options.rate !== undefined) sound.rate(options.rate);
          if (options.onend) sound.once('end', options.onend);
          if (options.onfade) sound.once('fade', options.onfade);
          
          // Play the sound
          const id = sound.play();
          
          console.log('Sound effect played:', name);
          return id;
        } else {
          console.error(`Sound effect "${name}" not found`);
          return null;
        }
      }

      static setMasterVolume(volume: number) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        Howler.volume(this.masterVolume);
        console.log('Master volume set to:', volume);
      }

      static setEffectsVolume(volume: number) {
        this.effectsVolume = Math.max(0, Math.min(1, volume));
        // Update all loaded sound effects
        Object.values(this.sounds).forEach(sound => {
          sound.volume(this.effectsVolume);
        });
        console.log('Effects volume set to:', volume);
      }

      static setAmbientVolume(volume: number) {
        this.ambientVolume = Math.max(0, Math.min(1, volume));
        // Update all loaded ambient sounds
        Object.values(this.ambientSounds).forEach(sound => {
          sound.volume(this.ambientVolume);
        });
        console.log('Ambient volume set to:', volume);
      }

      static setVolume(name: string, volume: number) {
        const sound = this.sounds[name] || this.ambientSounds[name];
        if (sound) {
          sound.volume(volume);
          console.log('Volume set for:', name, volume);
        } else {
          console.error(`Sound "${name}" not found`);
        }
      }

      static stopAll() {
        Howler.stop();
        console.log('All sounds stopped');
      }

      static mute() {
        this.muted = true;
        Howler.mute(true);
        console.log('All sounds muted');
      }

      static unmute() {
        this.muted = false;
        Howler.mute(false);
        console.log('All sounds unmuted');
      }

      static toggleMute() {
        this.muted = !this.muted;
        Howler.mute(this.muted);
        console.log('Mute toggled:', this.muted);
        return this.muted;
      }
      
      static isMuted() {
        return this.muted;
      }
      
      static useSupabaseStorage(value: boolean) {
        this.useSupabase = value;
      }
    }

    export default SoundManager;
