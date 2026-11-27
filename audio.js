window.MF_AUDIO = {
  ctx: null,
  currentTrack: null,
  timer: null,
  step: 0,
  enabled: true,
  unlocked: false,

  // 6シーン別・和音＆リズム付きループBGM
  TRACKS: {
    home: {
      tempo: 320, wave: "triangle", vol: 0.042, drums: false,
      melody: [392, 0, 440, 494, 587, 0, 523, 494, 440, 0, 392, 330, 392, 440, 494, 0],
      harmony:[247, 0, 294, 0,   330, 0, 294, 0,   262, 0, 247, 0,   247, 0,   294, 0],
      bass:   [196, 196, 220, 220, 247, 247, 196, 196, 175, 175, 165, 165, 196, 196, 147, 147]
    },
    story_calm: {
      tempo: 400, wave: "sine", vol: 0.048, drums: false,
      melody: [330, 392, 494, 0, 523, 494, 440, 0, 392, 330, 294, 0, 330, 0, 247, 0],
      harmony:[196, 0,   247, 0, 262, 0,   220, 0, 196, 0,   147, 0, 165, 0, 123, 0],
      bass:   [131, 0,   131, 0, 110, 0,   110, 0, 147, 0,   147, 0, 165, 0, 123, 0]
    },
    story_tense: {
      tempo: 260, wave: "triangle", vol: 0.04, drums: true,
      melody: [220, 0, 233, 0, 220, 0, 196, 208, 220, 0, 262, 247, 233, 0, 196, 0],
      harmony:[110, 0, 116, 0, 110, 0, 98,  0,   110, 0, 131, 0,   116, 0, 98,  0],
      bass:   [55,  55, 58, 55, 55,  55, 49,  52,  55,  55, 65,  62,  58,  55, 49, 49]
    },
    battle: {
      tempo: 175, wave: "sawtooth", vol: 0.028, drums: true,
      melody: [440, 0, 523, 494, 440, 392, 440, 0, 587, 0, 523, 494, 659, 0, 587, 523],
      harmony:[220, 262, 0, 247, 220, 0, 220, 262, 294, 0, 262, 247, 330, 0, 294, 262],
      bass:   [110, 110, 131, 110, 147, 147, 131, 123, 110, 110, 165, 147, 131, 131, 147, 165]
    },
    boss: {
      tempo: 155, wave: "square", vol: 0.024, drums: true,
      melody: [294, 311, 349, 0, 440, 415, 349, 311, 294, 0, 466, 440, 587, 554, 440, 0],
      harmony:[147, 0,   175, 0, 220, 0,   175, 155, 147, 0, 233, 220, 294, 0,   220, 175],
      bass:   [73,  73,  87,  73, 98,  98,  82,  78,  73,  73, 110, 104, 87,  87,  98,  110]
    },
    victory: {
      tempo: 260, wave: "triangle", vol: 0.045, drums: false,
      melody: [523, 659, 784, 0, 659, 784, 1046, 0, 880, 784, 659, 587, 523, 0, 0, 0],
      harmony:[262, 330, 392, 0, 330, 392, 523,  0, 440, 392, 330, 294, 262, 0, 0, 0],
      bass:   [131, 131, 196, 196, 175, 175, 196, 196, 220, 196, 165, 147, 131, 131, 131, 0]
    }
  },

  initCtx() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === "suspended") this.ctx.resume().catch(() => {});
  },

  unlock() {
    this.unlocked = true;
    this.initCtx();
    if (this.enabled && this.currentTrack && !this.timer) this.startLoop();
  },

  setEnabled(flag) {
    this.enabled = !!flag;
    if (!this.enabled) this.stopLoop();
    else if (this.currentTrack && this.unlocked) { this.initCtx(); this.startLoop(); }
  },

  playBgm(trackName) {
    if (trackName === "story") trackName = "story_calm";
    if (!this.TRACKS[trackName]) trackName = "home";
    if (this.currentTrack === trackName && this.timer) return;
    this.currentTrack = trackName;
    this.step = 0;
    this.stopLoop();
    if (this.enabled && this.unlocked) { this.initCtx(); this.startLoop(); }
  },

  stopLoop() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  },

  startLoop() {
    this.stopLoop();
    const tr = this.TRACKS[this.currentTrack];
    if (!tr || !this.ctx) return;

    this.timer = setInterval(() => {
      if (!this.enabled || !this.ctx || this.ctx.state !== "running") return;
      const now = this.ctx.currentTime;
      const idx = this.step % tr.melody.length;
      const dur = (tr.tempo / 1000) * 0.88;

      if (tr.melody[idx] > 0) this.playTone(tr.melody[idx], now, dur, tr.wave, tr.vol);
      if (tr.harmony && tr.harmony[idx] > 0) this.playTone(tr.harmony[idx], now, dur * 1.15, "sine", tr.vol * 0.72);
      if (tr.bass[idx] > 0) this.playTone(tr.bass[idx], now, dur, "triangle", tr.vol * 0.95);

      if (tr.drums) {
        if (idx % 4 === 0) this.playKick(now, 0.09);
        if (idx % 4 === 2) this.playNoise(now, 0.06, 0.032, 1400);
        else if (idx % 2 === 1) this.playNoise(now, 0.025, 0.014, 5200);
      }
      this.step += 1;
    }, tr.tempo);
  },

  playTone(freq, startTime, dur, wave, vol, endFreq = null) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, startTime);
      if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), startTime + dur);
      gain.gain.setValueAtTime(vol, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0008, startTime + dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + dur);
    } catch (e) {}
  },

  playKick(startTime, vol = 0.12) {
    this.playTone(135, startTime, 0.11, "sine", vol, 38);
  },

  playNoise(startTime, dur, vol = 0.08, cutoff = 1800) {
    try {
      const bufSize = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
      const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const flt = this.ctx.createBiquadFilter();
      flt.type = "bandpass";
      flt.frequency.setValueAtTime(cutoff, startTime);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(vol, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
      src.connect(flt); flt.connect(gain); gain.connect(this.ctx.destination);
      src.start(startTime); src.stop(startTime + dur);
    } catch (e) {}
  },

  playSfx(type) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const t = (f, o, d, w = "triangle", v = 0.13, ef = null) => this.playTone(f, now + o, d, w, v, ef);

    if (type === "tap")      { t(760, 0, 0.045, "sine", 0.08); }
    if (type === "switch")   { t(523, 0, 0.07); t(784, 0.055, 0.11); }
    if (type === "gift")     { t(659, 0, 0.1); t(880, 0.09, 0.1); t(1174, 0.18, 0.25); t(1318, 0.28, 0.3, "sine", 0.11); }
    if (type === "slash")    { this.playNoise(now, 0.11, 0.12, 2600); t(540, 0, 0.09, "sawtooth", 0.11, 140); }
    if (type === "fire")     { this.playNoise(now, 0.32, 0.16, 480); this.playKick(now, 0.18); t(180, 0.04, 0.28, "sawtooth", 0.12, 65); }
    if (type === "water")    { this.playNoise(now, 0.24, 0.1, 1200); t(360, 0, 0.16, "sine", 0.13, 720); t(520, 0.08, 0.18, "sine", 0.1, 280); }
    if (type === "volt")     { this.playNoise(now, 0.18, 0.15, 4200); t(1180, 0, 0.06, "square", 0.11, 320); t(880, 0.07, 0.12, "sawtooth", 0.11, 180); }
    if (type === "ice")      { t(1318, 0, 0.12, "sine", 0.12); t(1760, 0.05, 0.16, "triangle", 0.11); t(2093, 0.1, 0.24, "sine", 0.09); }
    if (type === "wind")     { this.playNoise(now, 0.28, 0.11, 2100); t(420, 0, 0.22, "triangle", 0.1, 880); }
    if (type === "arc")      { t(523, 0, 0.18, "sine", 0.12); t(784, 0.05, 0.22, "triangle", 0.12); t(1046, 0.1, 0.3, "sine", 0.11); }
    if (type === "guard")    { t(360, 0, 0.08, "triangle", 0.15); t(740, 0.04, 0.16, "sine", 0.13); }
    if (type === "break")    { this.playKick(now, 0.2); this.playNoise(now, 0.28, 0.18, 900); t(220, 0, 0.14, "square", 0.13, 80); t(660, 0.12, 0.25, "sawtooth", 0.12, 990); }
    if (type === "ult")      { this.playKick(now, 0.22); this.playNoise(now + 0.15, 0.45, 0.18, 700); t(330, 0, 0.14, "sawtooth", 0.12, 660); t(660, 0.12, 0.2, "sawtooth", 0.13, 1320); t(1320, 0.3, 0.42, "triangle", 0.14); }
    if (type === "hit")      { this.playKick(now, 0.2); this.playNoise(now, 0.14, 0.15, 650); t(130, 0, 0.16, "sawtooth", 0.15, 52); }
    if (type === "alarm")    { t(880, 0, 0.18, "square", 0.1); t(660, 0.2, 0.18, "square", 0.1); t(880, 0.4, 0.18, "square", 0.1); }
    if (type === "roar")     { this.playNoise(now, 0.55, 0.2, 360); t(150, 0, 0.52, "sawtooth", 0.17, 52); t(110, 0.06, 0.48, "square", 0.12, 42); }
    if (type === "quake")    { this.playNoise(now, 0.65, 0.22, 160); this.playKick(now, 0.22); this.playKick(now + 0.22, 0.18); }
    if (type === "comm")     { t(1100, 0, 0.06, "sine", 0.11); t(1480, 0.08, 0.09, "sine", 0.11); }
    if (type === "fanfare")  { t(523, 0, 0.14); t(659, 0.14, 0.14); t(784, 0.28, 0.14); t(1046, 0.44, 0.48, "triangle", 0.16); }
  }
};

window.addEventListener("pointerdown", () => window.MF_AUDIO.unlock(), { once: true });
