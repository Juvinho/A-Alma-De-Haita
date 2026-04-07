type SoundId =
  | 'typewriter-tick'
  | 'choice-hover'
  | 'choice-select'
  | 'transition-whoosh'
  | 'save-confirm'
  | 'shake-rumble'
  | 'flash-impact'
  | 'heartbeat-single'
  | 'wind-gust'
  | 'ambient-drone';

export class VNAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneOscillators: OscillatorNode[] = [];
  private isDroneActive = false;
  private isMuted = false;

  /**
   * Inicializar o contexto de áudio.
   * DEVE ser chamado após interação do usuário (clique, tecla).
   */
  async init(): Promise<void> {
    if (this.ctx) return;
    try {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.5;
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn('AudioContext initialization failed:', e);
    }
  }

  private ensureContext(): { ctx: AudioContext; master: GainNode } {
    if (!this.ctx || !this.masterGain) {
      throw new Error('AudioEngine not initialized. Call init() first.');
    }
    return { ctx: this.ctx, master: this.masterGain };
  }

  setVolume(v: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, v));
    }
  }

  mute(): void {
    this.isMuted = true;
    if (this.masterGain) this.masterGain.gain.value = 0;
  }

  unmute(volume = 0.5): void {
    this.isMuted = false;
    if (this.masterGain) this.masterGain.gain.value = volume;
  }

  // ═══════════════════════════════════════
  // SONS INDIVIDUAIS
  // ═══════════════════════════════════════

  /**
   * Typewriter tick — burst de noise ultra-curto
   */
  private playTick(): void {
    try {
      const { ctx, master } = this.ensureContext();
      const duration = 0.015;
      const now = ctx.currentTime;

      const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 3000;

      source.connect(filter).connect(gain).connect(master);
      source.start(now);
      source.stop(now + duration);
    } catch {
      /* silently fail */
    }
  }

  /**
   * Choice hover — tom agudo suave
   */
  private playHover(): void {
    try {
      const { ctx, master } = this.ensureContext();
      const now = ctx.currentTime;
      const duration = 0.05;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 800;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain).connect(master);
      osc.start(now);
      osc.stop(now + duration);
    } catch {
      /* silently fail */
    }
  }

  /**
   * Choice select — acorde ascendente rápido
   */
  private playSelect(): void {
    try {
      const { ctx, master } = this.ensureContext();
      const now = ctx.currentTime;
      const notes = [261.6, 329.6]; // C4, E4

      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = freq;

        const gain = ctx.createGain();
        const start = now + i * 0.08;
        gain.gain.setValueAtTime(0.03, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);

        osc.connect(gain).connect(master);
        osc.start(start);
        osc.stop(start + 0.2);
      });
    } catch {
      /* silently fail */
    }
  }

  /**
   * Transition whoosh — noise com envelope
   */
  private playWhoosh(): void {
    try {
      const { ctx, master } = this.ensureContext();
      const duration = 0.3;
      const now = ctx.currentTime;

      const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.025, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, now);
      filter.frequency.linearRampToValueAtTime(300, now + duration);
      filter.Q.value = 0.5;

      source.connect(filter).connect(gain).connect(master);
      source.start(now);
      source.stop(now + duration);
    } catch {
      /* silently fail */
    }
  }

  /**
   * Save confirm — tom descendente suave
   */
  private playSave(): void {
    try {
      const { ctx, master } = this.ensureContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(392, now); // G4
      osc.frequency.linearRampToValueAtTime(261.6, now + 0.4); // → C4

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain).connect(master);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      /* silently fail */
    }
  }

  /**
   * Shake rumble — tom grave
   */
  private playShake(): void {
    try {
      const { ctx, master } = this.ensureContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = 50;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain).connect(master);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      /* silently fail */
    }
  }

  /**
   * Flash impact — noise burst grave
   */
  private playFlash(): void {
    try {
      const { ctx, master } = this.ensureContext();
      const duration = 0.2;
      const now = ctx.currentTime;

      const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.8;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 200;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      source.connect(filter).connect(gain).connect(master);
      source.start(now);
      source.stop(now + duration);
    } catch {
      /* silently fail */
    }
  }

  /**
   * Heartbeat — duplo tom percussivo
   */
  private playHeartbeat(): void {
    try {
      const { ctx, master } = this.ensureContext();
      const now = ctx.currentTime;

      // "tum" (suave)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 55;
      const g1 = ctx.createGain();
      g1.gain.setValueAtTime(0.02, now);
      g1.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc1.connect(g1).connect(master);
      osc1.start(now);
      osc1.stop(now + 0.15);

      // "TUM" (forte)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 55;
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.035, now + 0.2);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc2.connect(g2).connect(master);
      osc2.start(now + 0.2);
      osc2.stop(now + 0.4);
    } catch {
      /* silently fail */
    }
  }

  /**
   * Wind gust — noise com sweep descendente
   */
  private playWind(): void {
    try {
      const { ctx, master } = this.ensureContext();
      const duration = 2;
      const now = ctx.currentTime;

      const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.6;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(8000, now);
      filter.frequency.exponentialRampToValueAtTime(500, now + duration);
      filter.Q.value = 1;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      source.connect(filter).connect(gain).connect(master);
      source.start(now);
      source.stop(now + duration);
    } catch {
      /* silently fail */
    }
  }

  // ═══════════════════════════════════════
  // AMBIENT DRONE
  // ═══════════════════════════════════════

  /**
   * Inicia um drone ambiente contínuo com "respiração".
   * Usa acordes de A1 e E2 (quinta) com modulação LFO suave.
   */
  startDrone(): void {
    if (this.isDroneActive) return;
    try {
      const { ctx, master } = this.ensureContext();
      const now = ctx.currentTime;

      // Oscilador base: A1 (55Hz)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 55;

      // Quinta: E2 (82Hz)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.value = 82;

      // LFO para "respiração"
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.1; // 0.1 Hz = 10 segundos por ciclo

      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.003; // Profundidade da modulação

      const droneGain = ctx.createGain();
      droneGain.gain.value = 0.008;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 200;

      lfo.connect(lfoGain).connect(droneGain.gain);
      osc1.connect(droneGain);
      osc2.connect(droneGain);
      droneGain.connect(filter).connect(master);

      osc1.start(now);
      osc2.start(now);
      lfo.start(now);

      this.droneOscillators = [osc1, osc2, lfo];
      this.isDroneActive = true;
    } catch {
      /* silently fail */
    }
  }

  /**
   * Para o drone ambiente.
   */
  stopDrone(): void {
    for (const osc of this.droneOscillators) {
      try {
        osc.stop();
      } catch {
        /* already stopped */
      }
    }
    this.droneOscillators = [];
    this.isDroneActive = false;
  }

  // ═══════════════════════════════════════
  // CONVENIENCE API
  // ═══════════════════════════════════════

  /**
   * Toca um som pelo ID.
   */
  play(sound: SoundId): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.isMuted || !this.ctx) { resolve(); return; }
      switch (sound) {
        case 'typewriter-tick':   this.playTick();      break;
        case 'choice-hover':      this.playHover();     break;
        case 'choice-select':     this.playSelect();    break;
        case 'transition-whoosh': this.playWhoosh();    break;
        case 'save-confirm':      this.playSave();      break;
        case 'shake-rumble':      this.playShake();     break;
        case 'flash-impact':      this.playFlash();     break;
        case 'heartbeat-single':  this.playHeartbeat(); break;
        case 'wind-gust':         this.playWind();      break;
        case 'ambient-drone':     this.startDrone();    break;
      }
      resolve();
    });
  }

  /**
   * Limpa recursos de áudio.
   */
  destroy(): void {
    this.stopDrone();
    if (this.ctx && this.ctx.state !== 'closed') {
      try {
        this.ctx.close();
      } catch {
        /* already closed */
      }
    }
    this.ctx = null;
    this.masterGain = null;
  }
}

// Singleton global
export const audioEngine = new VNAudioEngine();
