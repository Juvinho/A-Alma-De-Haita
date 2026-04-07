function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export type TravessiaSfx = 'distantRumble' | 'voices' | 'metalCreak' | 'windGust' | 'arrival';

export class TravessiaAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private drone: OscillatorNode[] = [];
  private droneGain: GainNode | null = null;
  private pulseLfo: OscillatorNode | null = null;
  private pulseGain: GainNode | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private heartbeatBpm = 40;
  private enabled = false;

  async init(): Promise<boolean> {
    if (this.enabled) return true;

    try {
      const ACtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!ACtx) return false;

      this.ctx = new ACtx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.18;
      this.master.connect(this.ctx.destination);

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.value = 0.16;
      this.droneGain.connect(this.master);

      const freqs = [40, 80.5, 119.7];
      const types: OscillatorType[] = ['sine', 'triangle', 'sine'];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = types[idx] ?? 'sine';
        osc.frequency.value = freq;
        osc.detune.value = idx === 1 ? -3 : idx === 2 ? 5 : 0;
        g.gain.value = idx === 0 ? 0.08 : 0.04;
        osc.connect(g);
        g.connect(this.droneGain!);
        osc.start();
        this.drone.push(osc);
      });

      this.pulseLfo = this.ctx.createOscillator();
      this.pulseGain = this.ctx.createGain();
      this.pulseLfo.type = 'sine';
      this.pulseLfo.frequency.value = 0.32;
      this.pulseGain.gain.value = 0.02;
      this.pulseLfo.connect(this.pulseGain);
      this.pulseGain.connect(this.droneGain.gain);
      this.pulseLfo.start();

      this.setHeartbeat(40);
      this.enabled = true;
      return true;
    } catch {
      return false;
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setMasterGain(value: number): void {
    if (!this.master || !this.ctx) return;
    this.master.gain.setTargetAtTime(clamp(value, 0, 0.35), this.ctx.currentTime, 0.25);
  }

  setPulseIntensity(intensity: number): void {
    if (!this.pulseGain || !this.ctx) return;
    const amount = clamp(intensity, 0, 1) * 0.05;
    this.pulseGain.gain.setTargetAtTime(amount, this.ctx.currentTime, 0.2);
  }

  setHeartbeat(bpm: number): void {
    this.heartbeatBpm = clamp(bpm, 20, 140);
    if (!this.enabled || !this.ctx || !this.master) return;

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    const period = (60_000 / this.heartbeatBpm);
    this.heartbeatTimer = setInterval(() => {
      this.pulseHeart();
    }, period);
  }

  private pulseHeart(): void {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.value = 35;

    filter.type = 'lowpass';
    filter.frequency.value = 80;

    const now = this.ctx.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.18, now + 0.018);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(filter);
    filter.connect(g);
    g.connect(this.master);

    osc.start(now);
    osc.stop(now + 0.22);

    if (this.droneGain) {
      this.droneGain.gain.setTargetAtTime(0.2, now, 0.02);
      this.droneGain.gain.setTargetAtTime(0.16, now + 0.12, 0.08);
    }
  }

  playSfx(type: TravessiaSfx): void {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;

    if (type === 'distantRumble') {
      const noise = this.createNoise(2.8);
      const lp = this.ctx.createBiquadFilter();
      const g = this.ctx.createGain();
      lp.type = 'lowpass';
      lp.frequency.value = 120;
      g.gain.setValueAtTime(0.001, now);
      g.gain.exponentialRampToValueAtTime(0.12, now + 0.4);
      g.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
      noise.connect(lp);
      lp.connect(g);
      g.connect(this.master);
      noise.start(now);
      noise.stop(now + 2.9);
      return;
    }

    if (type === 'voices') {
      const formants = [300, 850, 2400];
      formants.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const am = this.ctx!.createOscillator();
        const amGain = this.ctx!.createGain();
        const g = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;
        am.type = 'sine';
        am.frequency.value = 4 + idx;
        amGain.gain.value = 14;
        g.gain.value = 0.01;

        am.connect(amGain);
        amGain.connect(osc.frequency);
        osc.connect(g);
        g.connect(this.master!);

        g.gain.setValueAtTime(0.001, now);
        g.gain.exponentialRampToValueAtTime(0.04, now + 0.5);
        g.gain.exponentialRampToValueAtTime(0.001, now + 5);

        osc.start(now);
        am.start(now);
        osc.stop(now + 5.1);
        am.stop(now + 5.1);
      });
      return;
    }

    if (type === 'metalCreak') {
      const noise = this.createNoise(1.2);
      const bp = this.ctx.createBiquadFilter();
      const g = this.ctx.createGain();
      bp.type = 'bandpass';
      bp.frequency.value = 3000;
      bp.Q.value = 3;
      g.gain.setValueAtTime(0.001, now);
      g.gain.exponentialRampToValueAtTime(0.08, now + 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      noise.connect(bp);
      bp.connect(g);
      g.connect(this.master);
      noise.start(now);
      noise.stop(now + 1.3);
      return;
    }

    if (type === 'windGust') {
      const noise = this.createNoise(2);
      const lp = this.ctx.createBiquadFilter();
      const g = this.ctx.createGain();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(8000, now);
      lp.frequency.exponentialRampToValueAtTime(500, now + 2);
      g.gain.setValueAtTime(0.001, now);
      g.gain.exponentialRampToValueAtTime(0.06, now + 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, now + 2);
      noise.connect(lp);
      lp.connect(g);
      g.connect(this.master);
      noise.start(now);
      noise.stop(now + 2.1);
      return;
    }

    if (type === 'arrival') {
      if (this.droneGain) {
        this.droneGain.gain.setTargetAtTime(0.02, now, 0.8);
      }
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 528;
      g.gain.setValueAtTime(0.001, now);
      g.gain.exponentialRampToValueAtTime(0.12, now + 1.2);
      g.gain.exponentialRampToValueAtTime(0.001, now + 4.5);
      osc.connect(g);
      g.connect(this.master);
      osc.start(now);
      osc.stop(now + 4.6);
    }
  }

  private createNoise(duration: number): AudioBufferSourceNode {
    const bufferSize = Math.floor((this.ctx?.sampleRate ?? 44100) * duration);
    const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    const src = this.ctx!.createBufferSource();
    src.buffer = buffer;
    return src;
  }

  async resume(): Promise<void> {
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
  }

  destroy(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    this.drone.forEach((osc) => {
      try {
        osc.stop();
      } catch {
        // ignore
      }
    });
    this.drone = [];

    try {
      this.pulseLfo?.stop();
    } catch {
      // ignore
    }

    if (this.ctx) {
      this.ctx.close();
    }

    this.ctx = null;
    this.master = null;
    this.droneGain = null;
    this.pulseLfo = null;
    this.pulseGain = null;
    this.enabled = false;
  }
}
