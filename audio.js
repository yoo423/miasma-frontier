window.MF_AUDIO = {
  ctx: null,
  currentTrack: null,
  timer: null,
  step: 0,
  enabled: true,
  unlocked: false,

  // 和音・アルペジオ・ドラム付き本格6曲ループ
  TRACKS: {
    home: {
      tempo: 250, leadWave: "triangle", vol: 0.042, drums: "soft",
      melody: [523,0,587,659, 784,0,659,587, 523,0,440,523, 587,0,0,0, 659,0,784,880, 784,0,659,523, 587,659,523,440, 392,0,0,0],
      arp:    [262,330,392,523, 294,370,440,587, 220,262,330,440, 196,247,294,392, 262,330,392,523, 175,220,262,349, 196,247,294,392, 262,330,392,523],
      bass:   [131,0,131,0, 147,0,147,0, 110,0,110,0, 98,0,98,0, 131,0,131,0, 87,0,87,0, 98,0,98,0, 131,0,98,0]
    },
    story: {
      tempo: 310, leadWave: "sine", vol: 0.048, drums: "none",
      melody: [440,0,494,523, 659,0,587,523, 494,0,440,392, 330,0,0,0, 349,0,440,523, 587,0,523,494, 440,0,392,330, 440,0,0,0],
      arp:    [220,262,330,440, 196,247,294,392, 175,220,262,349, 165,196,247,330, 175,220,262,349, 196,247,294,392, 220,262,330,440, 220,262,330,440],
      bass:   [110,0,0,0, 98,0,0,0, 87,0,0,0, 82,0,0,0, 87,0,0,0, 98,0,0,0, 110,0,0,0, 110,0,82,0]
    },
    tension: {
      tempo: 210, leadWave: "sawtooth", vol: 0.028, drums: "pulse",
      melody: [294,0,311,0, 294,0,262,0, 294,0,349,0, 311,294,262,0, 294,0,311,0, 392,0,349,0, 311,0,294,0, 220,0,0,0],
      arp:    [147,175,220,175, 156,196,233,196, 147,175,220,175, 131,165,196,165, 147,175,220,175, 156,196,233,196, 147,175,220,175, 110,139,165,139],
      bass:   [73,73,0,73, 78,78,0,78, 73,73,0,73, 65,65,0,65, 73,73,0,73, 78,78,0,78, 73,73,0,73, 55,0,55,0]
    },
    battle: {
      tempo: 150, leadWave: "sawtooth", vol: 0.030, drums: "battle",
      melody: [440,0,523,494, 440,392,440,0, 587,0,523,494, 659,0,587,523, 659,0,784,659, 587,523,494,440, 523,0,494,392, 440,0,0,0],
      arp:    [220,262,330,440, 220,262,330,440, 294,349,440,587, 262,330,392,523, 175,220,262,349, 196,247,294,392, 165,208,247,330, 220,262,330,440],
      bass:   [110,110,110,131, 110,110,147,131, 147,147,147,165, 131,131,147,165, 87,87,87,110, 98,98,98,123, 82,82,98,104, 110,110,131,165]
    },
    boss: {
      tempo: 138, leadWave: "square", vol: 0.028, drums: "heavy",
      melody: [294,311,349,0, 440,415,349,311, 294,0,466,440, 587,554,440,0, 587,0,622,587, 523,466,440,392, 466,0,440,349, 294,0,440,0],
      arp:    [147,220,294,220, 156,233,311,233, 147,220,294,220, 139,220,277,220, 175,233,349,233, 196,262,392,262, 156,233,311,233, 110,165,220,277],
      bass:   [73,73,87,73, 78,78,98,78, 73,73,87,98, 69,69,82,110, 87,87,104,87, 98,98,117,98, 78,78,98,110, 73,73,110,139]
    },
    pvp: {
      tempo: 142, leadWave: "sawtooth", vol: 0.030, drums: "heavy",
      melody: [523,0,587,622, 698,0,622,587, 523,466,523,0, 784,0,698,622, 698,0,784,831, 784,698,622,587, 622,0,587,466, 523,0,0,0],
      arp:    [262,311,392,523, 233,294,349,466, 208,262,311,415, 196,247,294,392, 262,311,392,523, 233,294,349,466, 208,262,311,415, 196,247,311,392],
      bass:   [131,131,156,131, 117,117,147,117, 104,104,131,104, 98,98,123,147, 131,131,156,131, 117,117,147,117, 104,104,131,117, 98,98,147,196]
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
    if (!this.TRACKS[trackName]) trackName = "home";
    if (this.currentTrack === trackName && this.timer) return;
    this.currentTrack = trackName;
    this.step = 0;
    this.stopLoop();
    if (this.enabled && this.unlocked) { this.initCtx(); this.startLoop(); }
  },

  stopLoop() { if (this.timer) { clearInterval(this.timer); this.timer = null; } },

  startLoop() {
    this.stopLoop();
    const tr = this.TRACKS[this.currentTrack];
    if (!tr || !this.ctx) return;

    this.timer = setInterval(() => {
      if (!this.enabled || !this.ctx || this.ctx.state !== "running") return;
      const now = this.ctx.currentTime;
      const idx = this.step % tr.melody.length;
      const dur = (tr.tempo / 1000) * 0.88;

      if (tr.melody[idx] > 0) this.playTone(tr.melody[idx], now, dur * 1.1, tr.leadWave, tr.vol);
      if (tr.arp[idx] > 0) this.playTone(tr.arp[idx], now, dur * 0.7, "triangle", tr.vol * 0.55);
      if (tr.bass[idx] > 0) this.playTone(tr.bass[idx], now, dur * 0.95, "triangle", tr.vol * 0.95);

      // ドラムパターン合成
      if (tr.drums === "soft" && idx % 4 === 0) this.playKick(now, 0.045);
      if (tr.drums === "pulse" && idx % 2 === 0) this.playKick(now, 0.06);
      if (tr.drums === "battle" || tr.drums === "heavy") {
        if (idx % 4 === 0 || (tr.drums === "heavy" && idx % 8 === 6)) this.playKick(now, 0.085);
        if (idx % 4 === 2) this.playNoise(now, 0.065, 0.045);
        if (idx % 2 === 1) this.playNoise(now, 0.02, 0.02);
      }
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
      gain.gain.exponentialRampToValueAtTime(0.0007, startTime + dur);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(startTime); osc.stop(startTime + dur);
    } catch (e) {}
  },

  playKick(startTime, vol) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(140, startTime);
      osc.frequency.exponentialRampToValueAtTime(38, startTime + 0.11);
      gain.gain.setValueAtTime(vol, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(startTime); osc.stop(startTime + 0.12);
    } catch (e) {}
  },

  playNoise(startTime, dur, vol) {
    try {
      const len = Math.floor(this.ctx.sampleRate * dur);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(vol, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + dur);
      src.connect(gain); gain.connect(this.ctx.destination);
      src.start(startTime);
    } catch (e) {}
  },

  playSfx(type) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const t = (f, o, d, w = "triangle", v = 0.14) => this.playTone(f, now + o, d, w, v);

    if (type === "tap")    { t(780, 0, 0.05, "sine", 0.09); }
    if (type === "switch") { t(523, 0, 0.09); t(784, 0.06, 0.14); }
    if (type === "gift")   { t(523, 0, 0.1); t(659, 0.08, 0.1); t(784, 0.16, 0.12); t(1046, 0.25, 0.32); }
    if (type === "slash")  { this.playNoise(now, 0.11, 0.12); t(540, 0, 0.09, "sawtooth", 0.12); t(220, 0.05, 0.13, "sawtooth", 0.1); }
    if (type === "guard")  { t(392, 0, 0.11, "triangle", 0.15); t(784, 0.06, 0.2, "sine", 0.14); t(1174, 0.12, 0.22, "sine", 0.1); }
    if (type === "break")  { this.playKick(now, 0.25); this.playNoise(now, 0.24, 0.16); t(220, 0, 0.16, "square", 0.14); t(660, 0.1, 0.2, "sawtooth", 0.13); t(988, 0.2, 0.3, "triangle", 0.15); }
    if (type === "ult")    { this.playKick(now, 0.24); t(440, 0, 0.12, "sawtooth", 0.12); t(659, 0.1, 0.14, "sawtooth", 0.13); t(880, 0.2, 0.18, "sawtooth", 0.14); t(1318, 0.32, 0.45, "square", 0.13); this.playNoise(now + 0.3, 0.35, 0.14); }
    if (type === "hit")    { this.playKick(now, 0.22); this.playNoise(now, 0.15, 0.13); t(145, 0, 0.16, "sawtooth", 0.15); t(88, 0.06, 0.2, "square", 0.12); }
    if (type === "roar")   { this.playNoise(now, 0.55, 0.18); t(130, 0, 0.35, "sawtooth", 0.16); t(98, 0.18, 0.42, "sawtooth", 0.16); t(73, 0.34, 0.35, "square", 0.14); }
    if (type === "alarm")  { t(880, 0, 0.18, "square", 0.1); t(622, 0.2, 0.18, "square", 0.1); t(880, 0.4, 0.22, "square", 0.1); }
    if (type === "boom")   { this.playKick(now, 0.28); this.playNoise(now, 0.45, 0.2); t(92, 0, 0.38, "sawtooth", 0.16); }
    if (type === "comm")   { t(1046, 0, 0.06, "sine", 0.1); t(1318, 0.08, 0.08, "sine", 0.1); }
    if (type === "win")    { t(523, 0, 0.14); t(659, 0.14, 0.14); t(784, 0.28, 0.14); t(1046, 0.44, 0.55, "triangle", 0.18); }
    if (type === "lose")   { t(392, 0, 0.22, "sawtooth", 0.1); t(349, 0.24, 0.22, "sawtooth", 0.1); t(311, 0.48, 0.45, "sawtooth", 0.1); }
  }
};

window.addEventListener("pointerdown", () => window.MF_AUDIO.unlock(), { once: true });
