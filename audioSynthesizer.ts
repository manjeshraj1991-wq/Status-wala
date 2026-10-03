/**
 * Offline Web Audio API Synthesizer
 * Generates rich, relaxing soundscapes offline with zero external network audio files.
 */

type SoundscapeType = 'singing-bowl' | 'rain' | 'solfeggio-528' | 'forest-stream' | 'binaural-alpha';

class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: { stop: () => void }[] = [];
  private isPlaying = false;
  private currentType: SoundscapeType | null = null;
  private intervalId: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, volume));
      this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
    }
  }

  public play(type: SoundscapeType) {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    this.currentType = type;

    switch (type) {
      case 'singing-bowl':
        this.startSingingBowl();
        break;
      case 'rain':
        this.startRainSound();
        break;
      case 'solfeggio-528':
        this.startSolfeggio528();
        break;
      case 'forest-stream':
        this.startForestStream();
        break;
      case 'binaural-alpha':
        this.startBinauralAlpha();
        break;
    }
  }

  public stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.activeNodes.forEach((node) => {
      try {
        node.stop();
      } catch {
        // Already stopped
      }
    });
    this.activeNodes = [];
    this.isPlaying = false;
    this.currentType = null;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentType(): SoundscapeType | null {
    return this.currentType;
  }

  /**
   * Strike a gentle Tibetan Singing Bowl chime
   */
  public strikeBowl(fundamental = 216) {
    if (!this.ctx || !this.masterGain) this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const ctx = this.ctx;
    const now = ctx.currentTime;
    const strikeGain = ctx.createGain();
    strikeGain.gain.setValueAtTime(0.4, now);
    strikeGain.gain.exponentialRampToValueAtTime(0.0001, now + 7.5);
    strikeGain.connect(this.masterGain);

    // Overtones for authentic bell/bowl resonance
    const partials = [1, 2.76, 5.4, 8.1];
    const amplitudes = [0.8, 0.4, 0.2, 0.08];

    partials.forEach((mult, index) => {
      const osc = ctx.createOscillator();
      const pGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * mult, now);

      pGain.gain.setValueAtTime(amplitudes[index], now);
      pGain.gain.exponentialRampToValueAtTime(0.0001, now + 7.5);

      osc.connect(pGain);
      pGain.connect(strikeGain);
      osc.start(now);
      osc.stop(now + 8);
    });
  }

  private startSingingBowl() {
    if (!this.ctx || !this.masterGain) return;
    // Initial strike immediately
    this.strikeBowl(216);

    // Resonant drone underneath
    const ctx = this.ctx;
    const droneOsc = ctx.createOscillator();
    const droneGain = ctx.createGain();
    droneOsc.type = 'sine';
    droneOsc.frequency.setValueAtTime(108, ctx.currentTime);
    droneGain.gain.setValueAtTime(0.08, ctx.currentTime);

    // LFO modulation for breathing shimmer
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
    lfoGain.gain.setValueAtTime(0.03, ctx.currentTime);
    lfo.connect(droneGain.gain);

    droneOsc.connect(droneGain);
    droneGain.connect(this.masterGain);

    lfo.start();
    droneOsc.start();

    this.activeNodes.push({
      stop: () => {
        droneOsc.stop();
        lfo.stop();
      },
    });

    // Gentle strikes every 8 seconds
    this.intervalId = window.setInterval(() => {
      if (this.isPlaying && this.currentType === 'singing-bowl') {
        this.strikeBowl(Math.random() > 0.5 ? 216 : 288);
      }
    }, 8500);
  }

  private startRainSound() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Generate Pink Noise
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter for gentle rain tone
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);

    // Filter LFO to simulate rain gusts
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
    lfoGain.gain.setValueAtTime(300, ctx.currentTime);
    lfo.connect(filter.frequency);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0.35, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);

    whiteNoise.start();
    lfo.start();

    this.activeNodes.push({
      stop: () => {
        whiteNoise.stop();
        lfo.stop();
      },
    });
  }

  private startSolfeggio528() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // 528 Hz - The "Transformation & Miracles" Solfeggio frequency
    const oscMain = ctx.createOscillator();
    oscMain.type = 'sine';
    oscMain.frequency.setValueAtTime(528, now);

    // Warm sub-harmonics
    const oscSub = ctx.createOscillator();
    oscSub.type = 'sine';
    oscSub.frequency.setValueAtTime(264, now); // Octave down

    const oscUpper = ctx.createOscillator();
    oscUpper.type = 'sine';
    oscUpper.frequency.setValueAtTime(792, now); // Harmonic fifth

    const gainMain = ctx.createGain();
    gainMain.gain.setValueAtTime(0.18, now);

    const gainSub = ctx.createGain();
    gainSub.gain.setValueAtTime(0.12, now);

    const gainUpper = ctx.createGain();
    gainUpper.gain.setValueAtTime(0.04, now);

    // Gentle slow tremolo
    const tremolo = ctx.createOscillator();
    const tremoloGain = ctx.createGain();
    tremolo.frequency.setValueAtTime(0.08, now);
    tremoloGain.gain.setValueAtTime(0.04, now);
    tremolo.connect(gainMain.gain);

    oscMain.connect(gainMain);
    oscSub.connect(gainSub);
    oscUpper.connect(gainUpper);

    gainMain.connect(this.masterGain);
    gainSub.connect(this.masterGain);
    gainUpper.connect(this.masterGain);

    oscMain.start();
    oscSub.start();
    oscUpper.start();
    tremolo.start();

    this.activeNodes.push({
      stop: () => {
        oscMain.stop();
        oscSub.stop();
        oscUpper.stop();
        tremolo.stop();
      },
    });
  }

  private startForestStream() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.25;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(800, ctx.currentTime);
    bandpass.Q.setValueAtTime(1.5, ctx.currentTime);

    // Modulate stream babble
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.4, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(350, ctx.currentTime);
    lfo.connect(bandpass.frequency);

    const streamGain = ctx.createGain();
    streamGain.gain.setValueAtTime(0.3, ctx.currentTime);

    noiseSource.connect(bandpass);
    bandpass.connect(streamGain);
    streamGain.connect(this.masterGain);

    noiseSource.start();
    lfo.start();

    this.activeNodes.push({
      stop: () => {
        noiseSource.stop();
        lfo.stop();
      },
    });
  }

  private startBinauralAlpha() {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Carrier 200 Hz
    // Left ear: 200 Hz, Right ear: 210 Hz => 10 Hz difference (Alpha wave for calm flow state)
    const merger = ctx.createChannelMerger(2);

    const oscLeft = ctx.createOscillator();
    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(200, now);

    const oscRight = ctx.createOscillator();
    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(210, now);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.2, now);

    oscLeft.connect(merger, 0, 0); // left channel
    oscRight.connect(merger, 0, 1); // right channel

    merger.connect(gainNode);
    gainNode.connect(this.masterGain);

    oscLeft.start();
    oscRight.start();

    this.activeNodes.push({
      stop: () => {
        oscLeft.stop();
        oscRight.stop();
      },
    });
  }

  /**
   * Play cinematic soundscape snippet for movie video statuses
   */
  public playCinematicSnippet(
    type:
      | 'mass-bgm'
      | 'romantic-flute'
      | 'sad-sitar'
      | 'bhangra-dhol'
      | 'festive-shehnai'
      | 'acoustic-guitar'
      | 'temple-bells'
      | 'om-chant'
  ) {
    this.stop();
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    if (type === 'temple-bells') {
      // Sacred Mandir Temple Bells & Bronze Chimes
      const ringBell = (freq: number, delayMs: number) => {
        const timeout = window.setTimeout(() => {
          if (!this.isPlaying || !this.ctx || !this.masterGain) return;
          const t = this.ctx.currentTime;
          const partials = [1, 2.01, 3.02, 4.2];
          partials.forEach((p, idx) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq * p, t);

            const vol = 0.25 / (idx + 1);
            gain.gain.setValueAtTime(vol, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.5);

            osc.connect(gain);
            gain.connect(this.masterGain!);
            osc.start(t);
            osc.stop(t + 3.6);
          });
        }, delayMs);
        this.activeNodes.push({ stop: () => clearTimeout(timeout) });
      };

      ringBell(528, 0);
      ringBell(660, 600);
      ringBell(792, 1200);

      const bellInterval = window.setInterval(() => {
        if (!this.isPlaying) return;
        ringBell(528, 0);
        ringBell(792, 400);
        ringBell(660, 900);
      }, 2400);

      this.intervalId = bellInterval;
      this.activeNodes.push({ stop: () => clearInterval(bellInterval) });
    } else if (type === 'om-chant') {
      // Sacred Om 108Hz cosmic drone
      const freqs = [108, 216, 324, 432];
      freqs.forEach((f) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0.12, now);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now);

        this.activeNodes.push({
          stop: () => {
            try {
              gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
              osc.stop(ctx.currentTime + 0.35);
            } catch {
              // stopped
            }
          },
        });
      });
    } else if (type === 'mass-bgm') {
      // Powerful cinematic bass + brass stab
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.type = 'sawtooth';
      bass.frequency.setValueAtTime(55, now);
      bass.frequency.exponentialRampToValueAtTime(45, now + 1.5);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, now);
      filter.Q.setValueAtTime(4, now);

      bassGain.gain.setValueAtTime(0.4, now);

      bass.connect(filter);
      filter.connect(bassGain);
      bassGain.connect(this.masterGain);

      bass.start(now);

      // Pulse rhythm
      const kickInterval = window.setInterval(() => {
        if (!this.isPlaying) return;
        const t = ctx.currentTime;
        const kick = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kick.frequency.setValueAtTime(130, t);
        kick.frequency.exponentialRampToValueAtTime(30, t + 0.3);
        kickGain.gain.setValueAtTime(0.5, t);
        kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        kick.connect(kickGain);
        kickGain.connect(this.masterGain!);
        kick.start(t);
        kick.stop(t + 0.35);
      }, 600);

      this.intervalId = kickInterval;
      this.activeNodes.push({
        stop: () => {
          bass.stop();
          clearInterval(kickInterval);
        },
      });
    } else if (type === 'romantic-flute') {
      // Soft bansuri flute melody in Raag Yaman
      const notes = [330, 370, 415, 494, 554, 660];
      let step = 0;
      const melodyInterval = window.setInterval(() => {
        if (!this.isPlaying) return;
        const t = ctx.currentTime;
        const freq = notes[step % notes.length];
        step++;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        // Flute vibrato
        const vibrato = ctx.createOscillator();
        const vGain = ctx.createGain();
        vibrato.frequency.setValueAtTime(5.5, t);
        vGain.gain.setValueAtTime(4, t);
        vibrato.connect(osc.frequency);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.25, t + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        vibrato.start(t);
        osc.start(t);
        osc.stop(t + 1.3);
        vibrato.stop(t + 1.3);
      }, 700);

      this.intervalId = melodyInterval;
      this.activeNodes.push({
        stop: () => clearInterval(melodyInterval),
      });
    } else if (type === 'bhangra-dhol') {
      // Punjabi Dhol rhythm (Dha-Ge-Na-Ti)
      let count = 0;
      const dholInterval = window.setInterval(() => {
        if (!this.isPlaying) return;
        const t = ctx.currentTime;
        count++;
        const isBassBeat = count % 2 === 1;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = isBassBeat ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(isBassBeat ? 75 : 180, t);
        osc.frequency.exponentialRampToValueAtTime(35, t + 0.25);

        gain.gain.setValueAtTime(isBassBeat ? 0.5 : 0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(t);
        osc.stop(t + 0.3);
      }, 280);

      this.intervalId = dholInterval;
      this.activeNodes.push({
        stop: () => clearInterval(dholInterval),
      });
    } else {
      // Sitar / Acoustic melody
      const notes = [220, 261, 330, 392, 440];
      let step = 0;
      const sitarInterval = window.setInterval(() => {
        if (!this.isPlaying) return;
        const t = ctx.currentTime;
        const freq = notes[step % notes.length];
        step++;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq * 1.5, t);
        filter.Q.setValueAtTime(3, t);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(t);
        osc.stop(t + 1.6);
      }, 800);

      this.intervalId = sitarInterval;
      this.activeNodes.push({
        stop: () => clearInterval(sitarInterval),
      });
    }
  }
}

export const audioEngine = new AmbientAudioEngine();
