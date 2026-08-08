export class SoundManager {
  private ctx: AudioContext | null = null;
  private isMutedSFX: boolean = false;
  private isMutedMusic: boolean = false;
  private sfxVol: number = 0.9;
  private musicVol: number = 0.7;
  private vibrationEnabled: boolean = true;

  private windGain: GainNode | null = null;
  private windOsc: OscillatorNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private isWindPlaying: boolean = false;

  constructor() {
    // AudioContext lazily initialized on user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolumes(sfx: number, music: number, vibration: boolean) {
    this.sfxVol = sfx;
    this.musicVol = music;
    this.vibrationEnabled = vibration;
    this.isMutedSFX = sfx <= 0.01;
    this.isMutedMusic = music <= 0.01;

    if (this.windGain) {
      this.windGain.gain.setValueAtTime(this.isMutedMusic ? 0 : 0.15 * this.musicVol, this.ctx?.currentTime || 0);
    }
  }

  public vibrate(pattern: number | number[]) {
    if (!this.vibrationEnabled) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // ignore
      }
    }
  }

  public playClick() {
    this.initCtx();
    if (!this.ctx || this.isMutedSFX) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.1 * this.sfxVol, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  public playStart() {
    this.initCtx();
    if (!this.ctx || this.isMutedSFX) return;

    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2 * this.sfxVol, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.25);
    });

    this.vibrate([30, 40, 60]);
  }

  public playAbsorb(tier: number) {
    this.initCtx();
    if (!this.ctx || this.isMutedSFX) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Pitch & duration varies by tier
    const baseFreq = Math.max(80, 400 - tier * 50);
    osc.type = tier >= 4 ? 'sawtooth' : 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.12);

    const vol = Math.min(0.4, 0.12 + tier * 0.05) * this.sfxVol;
    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);

    // Haptics based on size
    if (tier >= 5) {
      this.vibrate([50, 30, 80]);
    } else if (tier >= 3) {
      this.vibrate(35);
    } else {
      this.vibrate(15);
    }
  }

  public playGrowth() {
    this.initCtx();
    if (!this.ctx || this.isMutedSFX) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.35);

    gain.gain.setValueAtTime(0.25 * this.sfxVol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.38);

    this.vibrate([40, 50, 100]);
  }

  public playDestruction() {
    this.initCtx();
    if (!this.ctx || this.isMutedSFX) return;

    const now = this.ctx.currentTime;

    // Noise buffer for deep crunch
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.linearRampToValueAtTime(100, now + 0.3);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35 * this.sfxVol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.3);

    this.vibrate([60, 40, 120]);
  }

  public playCoin() {
    this.initCtx();
    if (!this.ctx || this.isMutedSFX) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.15 * this.sfxVol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  public playGameOver() {
    this.initCtx();
    if (!this.ctx || this.isMutedSFX) return;

    const now = this.ctx.currentTime;
    const notes = [400, 350, 300, 220];
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.2 * this.sfxVol, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.3);
    });

    this.vibrate([80, 100, 150]);
  }

  public startWindLoop(tornadoScale: number) {
    this.initCtx();
    if (!this.ctx || this.isWindPlaying) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      this.windFilter = this.ctx.createBiquadFilter();
      this.windFilter.type = 'bandpass';
      this.windFilter.frequency.setValueAtTime(200 + tornadoScale * 50, this.ctx.currentTime);
      this.windFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      this.windGain = this.ctx.createGain();
      const targetGain = this.isMutedMusic ? 0 : Math.min(0.2, 0.05 + tornadoScale * 0.02) * this.musicVol;
      this.windGain.gain.setValueAtTime(targetGain, this.ctx.currentTime);

      noise.connect(this.windFilter);
      this.windFilter.connect(this.windGain);
      this.windGain.connect(this.ctx.destination);

      noise.start();
      this.isWindPlaying = true;
    } catch (e) {
      console.warn('Wind audio init failed:', e);
    }
  }

  public updateWindPitch(tornadoScale: number) {
    if (this.ctx && this.windFilter && this.windGain && this.isWindPlaying) {
      const freq = Math.min(800, 180 + tornadoScale * 70);
      this.windFilter.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.1);
      const targetGain = this.isMutedMusic ? 0 : Math.min(0.25, 0.05 + tornadoScale * 0.02) * this.musicVol;
      this.windGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.1);
    }
  }

  public stopWindLoop() {
    if (this.windGain && this.ctx) {
      try {
        this.windGain.gain.setValueAtTime(0, this.ctx.currentTime);
      } catch (e) {
        // ignore
      }
    }
    this.isWindPlaying = false;
  }
}

export const soundManager = new SoundManager();
