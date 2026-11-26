window.MF_AUDIO = {
  ctx: null,
  currentTrack: null,
  timer: null,
  step: 0,
  enabled: true,
  unlocked: false,

  // 4シーン別のループ楽曲データ（周波数Hz・0は休符）
  TRACKS: {
    home: {
      tempo: 360, wave: "triangle", vol: 0.045,
      melody: [392, 0, 440, 494, 587, 0, 523, 494, 440, 0, 392, 330, 392, 0, 0, 0],
      bass:   [196, 196, 220, 220, 247, 247, 196, 196, 175, 175, 165, 165, 196, 196, 147, 147]
    },
    story: {
      tempo: 420, wave: "sine", vol: 0.05,
      melody: [330, 392, 494, 0, 523, 494, 440, 0, 392, 330, 294, 0, 330, 0, 247, 0],
      bass:   [165, 0, 165, 0, 131, 0, 131, 0, 147, 0, 147, 0, 165, 0, 123, 0]
    },
    battle: {
      tempo: 185, wave: "sawtooth", vol: 0.032,
      melody: [440, 0, 523, 494, 440, 392, 440, 0, 587, 0, 523, 494, 659, 0, 587, 523],
      bass:   [110, 110, 131, 110, 147, 147, 131, 123, 110, 110, 165, 147, 131, 131, 147, 165]
    },
    boss: {
      tempo: 165, wave: "square", vol: 0.028,
      melody: [294, 311, 349, 0, 440, 415, 349, 311, 294, 0, 466, 440, 587, 554, 440, 0],
      bass:   [73, 73, 87, 73, 98, 98, 82, 78, 73, 73, 110, 104, 87, 87, 98, 110]
    }
  },

  initCtx() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  },

  unlock() {
    this.unlocked = true;
    this.initCtx();
    if (this.enabled && this.currentTrack && !this.timer) {
      this.startLoop();
    }
  },

  setEnabled(flag) {
    this.enabled = !!flag;
    if (!this.enabled) {
      this.stopLoop();
    } else if (this.currentTrack && this.unlocked) {
      this.initCtx();
      this.startLoop();
    }
  },

  playBgm(trackName) {
    if (!this.TRACKS[trackName]) trackName = "home";
    if (this.currentTrack === trackName && this.timer) return;
    this.currentTrack = trackName;
    this.step = 0;
    this.stopLoop();
    if (this.enabled && this.unlocked) {
      this.initCtx();
      this.startLoop();
    }
  },

  stopLoop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  startLoop() {
    this.stopLoop();
    const tr = this.TRACKS[this.currentTrack];
    if (!tr || !this.ctx) return;

    this.timer = setInterval(() => {
      if (!this.enabled || !this.ctx || this.ctx.state !== "running") return;
      const now = this.ctx.currentTime;
      const idx = this.step % tr.melody.length;
      const mf = tr.melody[idx];
      const bf = tr.bass[idx];
      const dur = (tr.tempo / 1000) * 0.85;

      if (mf > 0) this.playTone(mf, now, dur, tr.wave, tr.vol);
      if (bf > 0) this.playTone(bf, now, dur, "triangle", tr.vol * 0.9);
      this.step += 1;
    }, tr.tempo);
  },

  playTone(freq, startTime, dur, wave, vol) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(vol, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0008, startTime + dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + dur);
    } catch (e) {}
  },

  playSfx(type) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const t = (f, o, d, w = "triangle", v = 0.13) => this.playTone(f, now + o, d, w, v);

    if (type === "tap")    { t(760, 0, 0.05, "sine", 0.09); }
    if (type === "switch") { t(523, 0, 0.08); t(784, 0.06, 0.12); }
    if (type === "gift")   { t(659, 0, 0.1); t(880, 0.09, 0.1); t(1174, 0.18, 0.25); }
    if (type === "slash")  { t(420, 0, 0.07, "sawtooth", 0.1); t(220, 0.04, 0.1, "sawtooth", 0.08); }
    if (type === "guard")  { t(330, 0, 0.09, "triangle", 0.14); t(660, 0.05, 0.14, "sine", 0.12); }
    if (type === "break")  { t(180, 0, 0.12, "square", 0.12); t(520, 0.08, 0.16, "sawtooth", 0.12); t(880, 0.16, 0.24, "triangle", 0.14); }
    if (type === "ult")    { t(440, 0, 0.1); t(659, 0.08, 0.12); t(880, 0.16, 0.15); t(1318, 0.25, 0.35, "sawtooth", 0.12); }
    if (type === "hit")    { t(140, 0, 0.14, "sawtooth", 0.14); t(95, 0.05, 0.16, "square", 0.1); }
  }
};

window.addEventListener("pointerdown", () => window.MF_AUDIO.unlock(), { once: true });
