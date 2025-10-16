// Game sound effects manager
class SoundManager {
  constructor() {
    this.sounds = {};
    this.enabled = localStorage.getItem('soundEnabled') !== 'false';
    this.volume = parseFloat(localStorage.getItem('soundVolume') || '0.5');
    
    // Preload sounds
    this.loadSounds();
  }

  loadSounds() {
    const soundFiles = {
      move: '/sounds/move.mp3',
      capture: '/sounds/capture.mp3',
      check: '/sounds/check.mp3',
      castle: '/sounds/castle.mp3',
      victory: '/sounds/victory.mp3',
      defeat: '/sounds/defeat.mp3',
      draw: '/sounds/draw.mp3',
      notification: '/sounds/notification.mp3',
      error: '/sounds/error.mp3'
    };

    Object.entries(soundFiles).forEach(([name, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.volume = this.volume;
      this.sounds[name] = audio;
    });
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    localStorage.setItem('soundEnabled', enabled);
  }

  setVolume(volume) {
    this.volume = volume;
    localStorage.setItem('soundVolume', volume);
    Object.values(this.sounds).forEach(sound => {
      sound.volume = volume;
    });
  }

  play(soundName) {
    if (!this.enabled) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      // Create a new instance for overlapping sounds
      const clone = sound.cloneNode();
      clone.volume = this.volume;
      clone.play().catch(e => console.error('Sound play failed:', e));
    }
  }

  playMove(moveType) {
    switch (moveType) {
      case 'capture':
        this.play('capture');
        break;
      case 'castle':
        this.play('castle');
        break;
      case 'check':
        this.play('check');
        break;
      default:
        this.play('move');
    }
  }
}

export const soundManager = new SoundManager();