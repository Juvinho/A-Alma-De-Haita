/**
 * Häita Audio Engine — Procedural Web Audio API synthesizer.
 * No external audio files. All sound is generated at runtime.
 */

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

// ─── Ambient Layer ────────────────────────────────────────────────────────────

class AmbientLayer {
  private oscs: OscillatorNode[] = [];
  private gain: GainNode;
  private filter: BiquadFilterNode;
  private lfo: OscillatorNode;
  private lfoGain: GainNode;
  private corruptionOsc: OscillatorNode | null = null;
  private corruptionGain: GainNode | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private running = false;

  constructor(private ctx: AudioContext, private master: GainNode) {
    this.gain = ctx.createGain();
    this.gain.gain.value = 0;

    this.filter = ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 200;
    this.filter.Q.value = 0.7;

    this.lfo = ctx.createOscillator();
    this.lfo.frequency.value = 0.09;
    this.lfoGain = ctx.createGain();
    this.lfoGain.gain.value = 0.015;

    this.gain.connect(this.filter);
    this.filter.connect(master);
    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.gain.gain);
  }

  start() {
    if (this.running) return;
    this.running = true;

    const freqs = [55, 82.4, 110];
    const types: OscillatorType[] = ['sine', 'sine', 'triangle'];
    const gains = [0.04, 0.025, 0.02];

    freqs.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = types[i];
      osc.frequency.value = freq;
      g.gain.value = gains[i];
      osc.connect(g);
      g.connect(this.gain);
      osc.start();
      this.oscs.push(osc);
    });

    this.lfo.start();

    // Fade in over 4s
    this.gain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.gain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.gain.gain.linearRampToValueAtTime(1, this.ctx.currentTime + 4);
  }

  setCorruption(level: number) {
    if (!this.running) return;
    const t = this.ctx.currentTime;

    if (level > 30 && !this.corruptionOsc) {
      // Add dissonant tritone oscillator
      this.corruptionOsc = this.ctx.createOscillator();
      this.corruptionGain = this.ctx.createGain();
      this.corruptionOsc.type = 'sawtooth';
      this.corruptionOsc.frequency.value = 77.8; // tritone of A1
      this.corruptionGain.gain.value = 0;
      this.corruptionOsc.connect(this.corruptionGain);
      this.corruptionGain.connect(this.filter);
      this.corruptionOsc.start();
    }

    if (this.corruptionGain && level > 30) {
      const intensity = clamp((level - 30) / 50, 0, 1);
      this.corruptionGain.gain.setTargetAtTime(intensity * 0.025, t, 2);
    }

    if (level > 60 && !this.noiseSource) {
      this._startNoise();
    }

    if (this.noiseGain && level > 60) {
      const noiseIntensity = clamp((level - 60) / 40, 0, 1);
      this.noiseGain.gain.setTargetAtTime(noiseIntensity * 0.008, t, 1);
    }

    // Destabilize oscillators at high corruption
    if (level > 80) {
      this.oscs.forEach((osc, i) => {
        const base = [55, 82.4, 110][i];
        const detune = (Math.random() - 0.5) * level * 0.4;
        osc.detune.setTargetAtTime(detune, t, 0.5);
      });
    } else {
      this.oscs.forEach((osc) => {
        osc.detune.setTargetAtTime(0, t, 1);
      });
    }

    // Increase filter cutoff with corruption (sounds rawer)
    this.filter.frequency.setTargetAtTime(200 + level * 3, t, 2);
  }

  setParousia() {
    if (!this.running) return;
    const t = this.ctx.currentTime;

    // Remove dissonance
    if (this.corruptionGain) {
      this.corruptionGain.gain.setTargetAtTime(0, t, 2);
    }
    if (this.noiseGain) {
      this.noiseGain.gain.setTargetAtTime(0, t, 2);
    }

    // Shift to warmer, higher frequencies
    const warmFreqs = [110, 164.8, 220];
    this.oscs.forEach((osc, i) => {
      osc.frequency.setTargetAtTime(warmFreqs[i] || 110, t, 3);
      osc.detune.setTargetAtTime(0, t, 1);
    });

    this.filter.frequency.setTargetAtTime(600, t, 3);
    this.lfo.frequency.setValueAtTime(0.05, t);
  }

  stop() {
    if (!this.running) return;
    const t = this.ctx.currentTime;
    this.gain.gain.linearRampToValueAtTime(0, t + 2);
    setTimeout(() => {
      this.oscs.forEach((o) => { try { o.stop(); } catch {} });
      try { this.lfo.stop(); } catch {}
      if (this.corruptionOsc) try { this.corruptionOsc.stop(); } catch {}
      if (this.noiseSource) try { this.noiseSource.stop(); } catch {}
      this.running = false;
    }, 2500);
  }

  private _startNoise() {
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    this.noiseSource = this.ctx.createBufferSource();
    this.noiseSource.buffer = buffer;
    this.noiseSource.loop = true;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 80;
    noiseFilter.Q.value = 0.3;

    this.noiseGain = this.ctx.createGain();
    this.noiseGain.gain.value = 0;

    this.noiseSource.connect(noiseFilter);
    noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.master);
    this.noiseSource.start();
  }
}

// ─── Effects Layer ────────────────────────────────────────────────────────────

class EffectsLayer {
  constructor(private ctx: AudioContext, private master: GainNode) {}

  private _noise(duration: number, gainVal: number, filterFreq: number, filterQ = 1) {
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buf = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

    const src = this.ctx.createBufferSource();
    src.buffer = buf;

    const filt = this.ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = filterFreq;
    filt.Q.value = filterQ;

    const g = this.ctx.createGain();
    g.gain.value = gainVal;
    const t = this.ctx.currentTime;
    g.gain.setValueAtTime(gainVal, t);
    g.gain.linearRampToValueAtTime(0, t + duration);

    src.connect(filt);
    filt.connect(g);
    g.connect(this.master);
    src.start();
    src.stop(t + duration + 0.01);
  }

  private _tone(freq: number, dur: number, gainVal: number, type: OscillatorType = 'sine', delay = 0) {
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = 0;
    osc.connect(g);
    g.connect(this.master);

    const t = this.ctx.currentTime + delay;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gainVal, t + 0.01);
    g.gain.setValueAtTime(gainVal, t + dur - 0.05);
    g.gain.linearRampToValueAtTime(0, t + dur);
    osc.start(t);
    osc.stop(t + dur + 0.01);
  }

  private _reverb(wet: number): ConvolverNode {
    const conv = this.ctx.createConvolver();
    const rate = this.ctx.sampleRate;
    const len = rate * 1.5;
    const impulse = this.ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const data = impulse.getChannelData(c);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
      }
    }
    conv.buffer = impulse;
    const dryGain = this.ctx.createGain();
    dryGain.gain.value = 1 - wet;
    const wetGain = this.ctx.createGain();
    wetGain.gain.value = wet;
    return conv;
  }

  playCorrect() {
    // Ascending fifth chord: C4→G4 triangle, with reverb
    const conv = this._reverb(0.4);
    conv.connect(this.master);
    const tones = [
      { freq: 261.63, delay: 0, dur: 0.5 },
      { freq: 392.0, delay: 0.12, dur: 0.6 },
    ];
    tones.forEach(({ freq, delay, dur }) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      g.gain.value = 0;
      osc.connect(g);
      g.connect(conv);
      g.connect(this.master);
      const t = this.ctx.currentTime + delay;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.07, t + 0.02);
      g.gain.setValueAtTime(0.07, t + dur - 0.08);
      g.gain.linearRampToValueAtTime(0, t + dur);
      osc.start(t);
      osc.stop(t + dur + 0.01);
    });
  }

  playWrong() {
    // Impact: low A1 sine + noise burst
    this._tone(55, 0.3, 0.09, 'sine');
    this._noise(0.3, 0.04, 120, 0.5);
  }

  playHover() {
    this._noise(0.03, 0.015, 2200, 8);
  }

  playClick() {
    this._noise(0.05, 0.025, 1800, 6);
  }

  playVeilOpen() {
    // Sweep 800→200Hz over 400ms
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const conv = this._reverb(0.5);
    osc.type = 'sine';
    osc.connect(g);
    g.connect(conv);
    conv.connect(this.master);
    g.connect(this.master);
    const t = this.ctx.currentTime;
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.linearRampToValueAtTime(200, t + 0.4);
    g.gain.setValueAtTime(0.06, t);
    g.gain.linearRampToValueAtTime(0, t + 0.4);
    osc.start(t);
    osc.stop(t + 0.45);
  }

  playMercy() {
    // Amplitude-modulated noise burst, eerie
    const bufSize = Math.floor(this.ctx.sampleRate * 0.6);
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      const env = i / bufSize;
      data[i] = (Math.random() * 2 - 1) * env * 0.06;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 400;
    src.connect(filt);
    filt.connect(this.master);
    src.start();
    src.stop(this.ctx.currentTime + 0.65);
  }

  playUnlock() {
    // 3 ascending bell tones: C-E-G
    [
      { freq: 523.25, delay: 0 },
      { freq: 659.25, delay: 0.25 },
      { freq: 783.99, delay: 0.5 },
    ].forEach(({ freq, delay }) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      osc.connect(g);
      g.connect(this.master);
      const t = this.ctx.currentTime + delay;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.06, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
      osc.start(t);
      osc.stop(t + 0.75);
    });
  }

  playTransition() {
    // Filtered noise swoosh
    this._noise(0.35, 0.05, 300, 0.4);
  }

  playKonami() {
    // Single grave tone with long reverb
    const conv = this._reverb(0.7);
    conv.connect(this.master);
    this._tone(55, 1.2, 0.08, 'sine');
  }

  playWhisper(pan: number) {
    // Noise filtered to sound like breathing past ear
    const rate = this.ctx.sampleRate;
    const dur = 1.5;
    const buf = this.ctx.createBuffer(1, Math.floor(rate * dur), rate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const env = Math.sin((i / data.length) * Math.PI);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;

    const filt = this.ctx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = 3500;
    filt.Q.value = 2;

    const panner = this.ctx.createStereoPanner();
    panner.pan.value = clamp(pan, -1, 1);

    const g = this.ctx.createGain();
    g.gain.value = 0.04;

    src.connect(filt);
    filt.connect(panner);
    panner.connect(g);
    g.connect(this.master);
    src.start();
    src.stop(this.ctx.currentTime + dur + 0.05);
  }

  playCreak() {
    // Metallic click
    this._noise(0.05, 0.03, 1200, 10);
  }

  playThud() {
    // Low knock × 2-3
    const knock = (delay: number) => this._tone(40, 0.2, 0.07, 'sine', delay);
    knock(0);
    knock(0.8);
    if (Math.random() > 0.4) knock(1.6);
  }

  playBreath() {
    // Inhale (1s) + exhale (1.5s)
    const rate = this.ctx.sampleRate;
    const duration = 2.5;
    const buf = this.ctx.createBuffer(1, Math.floor(rate * duration), rate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / data.length;
      // Inhale: 0-0.4, Exhale: 0.5-1.0
      let env = 0;
      if (t < 0.4) env = Math.sin((t / 0.4) * Math.PI);
      else if (t > 0.5) env = Math.sin(((t - 0.5) / 0.5) * Math.PI) * 0.7;
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const filt = this.ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.value = 600;
    const g = this.ctx.createGain();
    g.gain.value = 0.035;
    src.connect(filt);
    filt.connect(g);
    g.connect(this.master);
    src.start();
    src.stop(this.ctx.currentTime + duration + 0.05);
  }

  playDrone() {
    // Deep sub-bass tone
    this._tone(30, 2, 0.05, 'square');
  }
}

// ─── Heartbeat Layer ──────────────────────────────────────────────────────────

class HeartbeatLayer {
  private interval: ReturnType<typeof setInterval> | null = null;
  private currentBpm = 0;

  constructor(private ctx: AudioContext, private master: GainNode) {}

  private _beat(gainVal: number) {
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 62;
    osc.connect(g);
    g.connect(this.master);
    const t = this.ctx.currentTime;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gainVal, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  setCorruption(level: number) {
    let bpm = 0;
    if (level > 40 && level <= 60) bpm = 50;
    else if (level > 60 && level <= 80) bpm = 72;
    else if (level > 80) bpm = 100 + Math.floor((level - 80) * 1.5);

    if (bpm === this.currentBpm) return;
    this.currentBpm = bpm;

    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    if (bpm === 0) return;

    const msPerBeat = (60 / bpm) * 1000;
    let phase = 0;
    this.interval = setInterval(() => {
      // tum-TUM pattern
      if (phase % 2 === 0) {
        this._beat(0.04);
      } else {
        setTimeout(() => this._beat(0.07), 150);
      }
      phase++;
    }, msPerBeat);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
    this.currentBpm = 0;
  }
}

// ─── Whisper Layer ────────────────────────────────────────────────────────────

class WhisperLayer {
  private timer: ReturnType<typeof setInterval> | null = null;
  private effects: EffectsLayer;

  constructor(effects: EffectsLayer) {
    this.effects = effects;
  }

  start(corruptionLevel: number) {
    this.stop();
    const minSec = corruptionLevel > 60 ? 10 : corruptionLevel > 30 ? 25 : 45;
    const maxSec = corruptionLevel > 60 ? 25 : corruptionLevel > 30 ? 45 : 90;

    const schedule = () => {
      const delay = (minSec + Math.random() * (maxSec - minSec)) * 1000;
      this.timer = setTimeout(() => {
        this._play();
        schedule();
      }, delay) as unknown as ReturnType<typeof setInterval>;
    };
    schedule();
  }

  updateCorruption(level: number) {
    this.start(level);
  }

  stop() {
    if (this.timer) clearTimeout(this.timer as unknown as ReturnType<typeof setTimeout>);
    this.timer = null;
  }

  private _play() {
    const choice = Math.floor(Math.random() * 5);
    switch (choice) {
      case 0: this.effects.playWhisper(Math.random() * 2 - 1); break;
      case 1: this.effects.playCreak(); break;
      case 2: this.effects.playThud(); break;
      case 3: this.effects.playBreath(); break;
      case 4: this.effects.playDrone(); break;
    }
  }
}

// ─── Main Engine ──────────────────────────────────────────────────────────────

export class AudioEngine {
  ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private _enabled = false;
  private _muted = false;
  private _volume = 0.65;

  ambient: AmbientLayer | null = null;
  effects: EffectsLayer | null = null;
  whispers: WhisperLayer | null = null;
  heartbeat: HeartbeatLayer | null = null;

  async init(): Promise<boolean> {
    if (this._enabled) return true;
    try {
      this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.master = this.ctx.createGain();
      this.master.gain.value = this._volume;
      this.master.connect(this.ctx.destination);

      this.ambient = new AmbientLayer(this.ctx, this.master);
      this.effects = new EffectsLayer(this.ctx, this.master);
      this.heartbeat = new HeartbeatLayer(this.ctx, this.master);
      this.whispers = new WhisperLayer(this.effects);

      this.ambient.start();
      this._enabled = true;

      if (this.ctx.state === 'suspended') {
        await this.ctx.resume();
      }
      return true;
    } catch {
      return false;
    }
  }

  setMasterVolume(v: number) {
    this._volume = clamp(v, 0, 1);
    if (this.master && !this._muted) {
      this.master.gain.setTargetAtTime(this._volume, this.ctx!.currentTime, 0.1);
    }
  }

  mute() {
    this._muted = true;
    if (this.master) this.master.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.1);
  }

  unmute() {
    this._muted = false;
    if (this.master) this.master.gain.setTargetAtTime(this._volume, this.ctx!.currentTime, 0.1);
  }

  isEnabled() {
    return this._enabled && !this._muted;
  }

  setCorruption(level: number) {
    this.ambient?.setCorruption(level);
    this.heartbeat?.setCorruption(level);
    this.whispers?.updateCorruption(level);
  }

  setParousia() {
    this.ambient?.setParousia();
    this.heartbeat?.stop();
  }

  startWhispers(level: number) {
    this.whispers?.start(level);
  }

  stopWhispers() {
    this.whispers?.stop();
  }

  destroy() {
    this.ambient?.stop();
    this.heartbeat?.stop();
    this.whispers?.stop();
    if (this.ctx) {
      try { this.ctx.close(); } catch {}
    }
    this._enabled = false;
  }
}
