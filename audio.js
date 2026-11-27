window.MF_AUDIO = {
  ctx: null,
  currentTrack: null,
  schedulerId: null,
  nextNoteTime: 0,
  step: 0,
  enabled: true,
  unlocked: false,

  // 音階ヘルパー（すべて正確な4拍子・32ステップ＝4小節8分音符構成）
  TRACKS: {
    // 1. タイトル＆オープニング（壮大・神秘的）
    title: {
      bpm: 108, leadWave: "triangle", vol: 0.042, drums: "soft",
      melody: [523,0,659,784, 988,0,784,659, 698,0,880,1046, 880,0,698,0, 587,0,784,880, 988,0,880,784, 659,0,587,523, 587,0,0,0],
      arp:    [262,330,392,523, 262,330,392,523, 220,262,349,440, 220,262,349,440, 196,247,294,392, 196,247,294,392, 262,330,392,523, 196,247,294,392],
      bass:   [131,0,0,131, 131,0,165,0, 110,0,0,110, 110,0,131,0, 98,0,0,98, 98,0,123,0, 131,0,165,0, 147,0,98,0]
    },
    // 2. 前線キャンプ・拠点（爽やか・王道進行）
    home: {
      bpm: 118, leadWave: "triangle", vol: 0.042, drums: "pop",
      melody: [659,0,587,523, 587,0,659,784, 880,0,784,659, 587,0,0,0, 698,0,659,587, 659,0,523,440, 587,659,587,523, 523,0,0,0],
      arp:    [349,440,523,440, 392,494,587,494, 330,392,494,392, 220,330,440,330, 349,440,523,440, 392,494,587,494, 262,330,392,523, 262,330,392,330],
      bass:   [175,0,175,0, 196,0,196,0, 165,0,165,0, 110,0,110,0, 175,0,175,0, 196,0,196,0, 131,0,131,0, 131,0,196,0]
    },
    // 3. 物語・語らい・絆エピソード（優しいオルゴール風）
    story: {
      bpm: 96, leadWave: "sine", vol: 0.048, drums: "none",
      melody: [523,0,587,659, 784,0,659,587, 523,0,440,523, 494,0,0,0, 440,0,523,587, 659,0,587,523, 494,0,440,392, 523,0,0,0],
      arp:    [262,330,392,523, 247,294,392,494, 220,262,330,440, 196,247,294,392, 175,220,262,349, 196,247,294,392, 220,262,330,440, 262,330,392,523],
      bass:   [131,0,0,0, 123,0,0,0, 110,0,0,0, 98,0,0,0, 87,0,0,0, 98,0,0,0, 110,0,98,0, 131,0,0,0]
    },
    // 4. 緊迫・不穏・陰謀（脈打つサスペンス）
    tension: {
      bpm: 126, leadWave: "sawtooth", vol: 0.025, drums: "pulse",
      melody: [294,0,311,0, 294,0,262,0, 294,0,349,0, 311,294,262,0, 294,0,311,0, 392,0,349,0, 311,0,294,262, 220,0,0,0],
      arp:    [147,175,220,175, 156,196,233,196, 147,175,220,175, 131,165,196,165, 147,175,220,175, 156,196,233,196, 147,175,220,175, 110,139,165,139],
      bass:   [73,0,73,0, 78,0,78,0, 73,0,73,0, 65,0,65,0, 73,0,73,0, 78,0,78,0, 73,0,73,0, 55,0,55,0]
    },
    // 5. 通常討伐・育成戦（疾走感ある王道RPGバトル）
    battle: {
      bpm: 152, leadWave: "sawtooth", vol: 0.027, drums: "battle",
      melody: [440,0,523,587, 659,0,587,523, 587,0,523,494, 440,0,392,0, 523,0,587,659, 784,0,659,587, 659,587,523,494, 440,0,0,0],
      arp:    [220,262,330,440, 220,262,330,440, 175,220,262,349, 196,247,294,392, 175,220,262,349, 196,247,294,392, 165,208,247,330, 220,262,330,440],
      bass:   [110,110,131,110, 110,110,147,131, 87,87,110,87, 98,98,123,98, 87,87,110,87, 98,98,123,147, 82,82,104,123, 110,110,131,165]
    },
    // 6. エリア主霧獣決戦（重厚・迫力のボス戦）
    boss: {
      bpm: 162, leadWave: "square", vol: 0.024, drums: "heavy",
      melody: [294,311,349,0, 440,415,349,311, 294,0,466,440, 587,554,440,0, 587,0,622,587, 523,466,440,392, 466,0,440,349, 294,0,440,0],
      arp:    [147,220,294,220, 156,233,311,233, 147,220,294,220, 139,220,277,220, 175,233,349,233, 196,262,392,262, 156,233,311,233, 110,165,220,277],
      bass:   [73,73,87,73, 78,78,98,78, 73,73,87,98, 69,69,82,110, 87,87,104,87, 98,98,117,98, 78,78,98,110, 73,73,110,139]
    },
    // 7. 融光種＆極限レイド戦（神々しく激しい高速シンフォニック）
    radiant: {
      bpm: 174, leadWave: "sawtooth", vol: 0.026, drums: "heavy",
      melody: [659,0,784,880, 988,880,784,659, 740,0,880,988, 1175,0,988,880, 784,0,880,988, 1046,988,880,784, 740,784,880,988, 659,0,0,0],
      arp:    [330,392,494,659, 330,392,494,659, 294,370,440,587, 294,370,440,587, 262,330,392,523, 294,370,440,587, 247,311,370,494, 330,392,494,659],
      bass:   [82,82,98,82, 82,82,110,98, 73,73,92,73, 73,73,110,92, 65,65,82,65, 73,73,92,110, 62,62,78,92, 82,82,123,165]
    },
    // 8. 対人アリーナ（スタイリッシュ・エレクトロ対決）
    pvp: {
      bpm: 156, leadWave: "sawtooth", vol: 0.026, drums: "electro",
      melody: [523,0,587,622, 698,0,622,587, 523,466,523,0, 784,0,698,622, 698,0,784,831, 784,698,622,587, 622,0,587,466, 523,0,0,0],
      arp:    [262,311,392,523, 233,294,349,466, 208,262,311,415, 196,247,294,392, 262,311,392,523, 233,294,349,466, 208,262,311,415, 196,247,311,392],
      bass:   [131,0,156,131, 117,0,147,117, 104,0,131,104, 98,0,123,147, 131,0,156,131, 117,0,147,117, 104,0,131,117, 98,0,147,196]
    },
    // 9. 軌道スカウト・ガチャ（星屑アップリフティング）
    gacha: {
      bpm: 132, leadWave: "triangle", vol: 0.04, drums: "electro",
      melody: [784,0,880,1046, 988,0,880,784, 659,0,784,880, 784,0,0,0, 698,0,784,880, 1046,0,988,880, 784,880,988,1046, 1046,0,0,0],
      arp:    [262,392,523,659, 247,392,494,587, 220,330,440,523, 196,294,392,494, 175,262,349,440, 196,294,392,494, 262,392,523,659, 262,392,523,659],
      bass:   [131,0,131,0, 123,0,123,0, 110,0,110,0, 98,0,98,0, 87,0,87,0, 98,0,98,0, 131,0,131,0, 131,0,196,0]
    },
    // 10. 補給ショップ＆クラフト（オシャレ軽快ジャズポップ）
    shop: {
      bpm: 112, leadWave: "sine", vol: 0.045, drums: "pop",
      melody: [587,0,659,698, 880,0,784,659, 587,0,523,440, 523,0,0,0, 659,0,698,784, 880,0,784,698, 659,0,587,523, 587,0,0,0],
      arp:    [294,349,440,523, 196,294,349,494, 262,330,392,494, 220,262,330,392, 294,349,440,523, 196,294,349,494, 262,330,392,523, 220,262,330,440],
      bass:   [147,0,0,147, 98,0,0,98, 131,0,0,131, 110,0,131,0, 147,0,0,147, 98,0,0,98, 131,0,165,0, 110,0,147,0]
    },
    // 11. 期間限定イベント（華やかお祭りポップ）
    event: {
      bpm: 138, leadWave: "triangle", vol: 0.042, drums: "pop",
      melody: [523,659,784,0, 880,784,659,523, 587,698,880,0, 784,0,659,0, 523,659,784,0, 1046,988,880,784, 659,784,880,988, 1046,0,0,0],
      arp:    [262,330,392,523, 220,262,330,440, 175,220,262,349, 196,247,294,392, 262,330,392,523, 175,220,262,349, 196,247,294,392, 262,330,392,523],
      bass:   [131,0,196,0, 110,0,165,0, 87,0,131,0, 98,0,147,0, 131,0,196,0, 87,0,131,0, 98,0,147,0, 131,196,131,0]
    },
    // 12. 無限の瘴霧タワー（クール・ダンジョンテクノ）
    tower: {
      bpm: 134, leadWave: "square", vol: 0.022, drums: "electro",
      melody: [330,0,392,0, 494,0,440,392, 330,0,294,0, 330,0,0,0, 392,0,494,0, 587,0,494,440, 392,0,370,294, 330,0,0,0],
      arp:    [165,247,330,247, 165,247,330,247, 147,220,294,220, 165,247,330,247, 196,247,392,247, 147,220,294,220, 123,185,247,185, 165,247,330,247],
      bass:   [82,82,0,82, 82,0,98,0, 73,73,0,73, 82,0,98,0, 98,98,0,98, 73,73,0,73, 62,62,0,73, 82,0,82,0]
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
    if (this.enabled && this.currentTrack && !this.schedulerId) this.startScheduler();
  },

  setEnabled(flag) {
    this.enabled = !!flag;
    if (!this.enabled) this.stopLoop();
    else if (this.currentTrack && this.unlocked) { this.initCtx(); this.startScheduler(); }
  },

  playBgm(trackName) {
    // 融光種・極限レイド時は自動で専用曲「radiant」へ昇格
    if (trackName === "boss" && typeof btl !== "undefined" && btl && (btl.isRaid || btl.enemy?.isRadiant)) {
      trackName = "radiant";
    }
    if (!this.TRACKS[trackName]) trackName = "home";
    if (this.currentTrack === trackName && this.schedulerId) return;
    this.currentTrack = trackName;
    this.step = 0;
    this.stopLoop();
    if (this.enabled && this.unlocked) {
      this.initCtx();
      this.startScheduler();
    }
  },

  stopLoop() {
    if (this.schedulerId) {
      clearInterval(this.schedulerId);
      this.schedulerId = null;
    }
  },

  // ハードウェア時計を使った正確な先読みスケジューラー（リズムのヨレ・ズレ完全解消）
  startScheduler() {
    this.stopLoop();
    if (!this.ctx) return;
    this.nextNoteTime = this.ctx.currentTime + 0.05;

    this.schedulerId = setInterval(() => {
      if (!this.enabled || !this.ctx || this.ctx.state !== "running") return;
      const tr = this.TRACKS[this.currentTrack];
      if (!tr) return;

      // バックグラウンド復帰時などの時間飛びを自動補正
      if (this.nextNoteTime < this.ctx.currentTime - 0.25) {
        this.nextNoteTime = this.ctx.currentTime + 0.04;
      }

      const stepDur = (60 / tr.bpm) / 2; // 正確な8分音符の長さ
      while (this.nextNoteTime < this.ctx.currentTime + 0.14) {
        this.scheduleStep(tr, this.step, this.nextNoteTime, stepDur);
        this.nextNoteTime += stepDur;
        this.step = (this.step + 1) % tr.melody.length;
      }
    }, 25);
  },

  scheduleStep(tr, idx, time, dur) {
    if (tr.melody[idx] > 0) this.playTone(tr.melody[idx], time, dur * 1.12, tr.leadWave, tr.vol);
    if (tr.arp[idx] > 0)    this.playTone(tr.arp[idx],    time, dur * 0.72, "triangle", tr.vol * 0.5);
    if (tr.bass[idx] > 0)   this.playTone(tr.bass[idx],   time, dur * 0.92, "triangle", tr.vol * 0.95);

    const b = idx % 8; // 1小節＝8ステップ（8分音符×8）
    if (tr.drums === "soft") {
      if (b === 0) this.playKick(time, 0.05);
      if (b === 4) this.playHihat(time, 0.015);
    } else if (tr.drums === "pop") {
      if (b === 0 || b === 4) this.playKick(time, 0.065);
      if (b === 2 || b === 6) this.playSnare(time, 0.032);
      if (b % 2 === 1) this.playHihat(time, 0.016);
    } else if (tr.drums === "pulse") {
      if (b % 2 === 0) this.playKick(time, 0.065);
      if (b === 6) this.playSnare(time, 0.025);
    } else if (tr.drums === "electro") {
      if (b === 0 || b === 3 || b === 4) this.playKick(time, 0.08);
      if (b === 2 || b === 6) this.playSnare(time, 0.042);
      this.playHihat(time, b % 2 === 1 ? 0.022 : 0.012);
    } else if (tr.drums === "battle") {
      if (b === 0 || b === 4 || b === 7) this.playKick(time, 0.085);
      if (b === 2 || b === 6) this.playSnare(time, 0.048);
      this.playHihat(time, 0.018);
    } else if (tr.drums === "heavy") {
      if (b === 0 || b === 1 || b === 4 || b === 5) this.playKick(time, 0.095);
      if (b === 2 || b === 6) this.playSnare(time, 0.055);
      this.playHihat(time, 0.02);
    }
  },

  playTone(freq, startTime, dur, wave, vol) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(vol, startTime + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0006, startTime + dur);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(startTime); osc.stop(startTime + dur + 0.01);
    } catch (e) {}
  },

  playKick(startTime, vol) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(145, startTime);
      osc.frequency.exponentialRampToValueAtTime(42, startTime + 0.09);
      gain.gain.setValueAtTime(vol, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.11);
      osc.connect(gain); gain.connect(this.ctx.destination);
      osc.start(startTime); osc.stop(startTime + 0.12);
    } catch (e) {}
  },

  playSnare(startTime, vol) {
    this.playFilteredNoise(startTime, 0.085, vol, "bandpass", 1800);
  },

  playHihat(startTime, vol) {
    this.playFilteredNoise(startTime, 0.028, vol, "highpass", 7500);
  },

  playFilteredNoise(startTime, dur, vol, filterType, freq) {
    try {
      const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const filter = this.ctx.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.setValueAtTime(freq, startTime);
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(vol, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0008, startTime + dur);
      src.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination);
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
    if (type === "switch") { t(523, 0, 0.08); t(784, 0.055, 0.13); }
    if (type === "gift")   { t(523, 0, 0.1); t(659, 0.08, 0.1); t(784, 0.16, 0.12); t(1046, 0.25, 0.32); }
    if (type === "slash")  { this.playFilteredNoise(now, 0.11, 0.13, "bandpass", 2400); t(540, 0, 0.09, "sawtooth", 0.11); t(220, 0.05, 0.13, "sawtooth", 0.09); }
    if (type === "guard")  { t(392, 0, 0.11, "triangle", 0.15); t(784, 0.06, 0.2, "sine", 0.14); t(1174, 0.12, 0.22, "sine", 0.1); }
    if (type === "break")  { this.playKick(now, 0.25); this.playFilteredNoise(now, 0.22, 0.15, "bandpass", 1200); t(220, 0, 0.16, "square", 0.14); t(660, 0.1, 0.2, "sawtooth", 0.13); t(988, 0.2, 0.3, "triangle", 0.15); }
    if (type === "ult")    { this.playKick(now, 0.24); t(440, 0, 0.12, "sawtooth", 0.12); t(659, 0.1, 0.14, "sawtooth", 0.13); t(880, 0.2, 0.18, "sawtooth", 0.14); t(1318, 0.32, 0.45, "square", 0.13); this.playFilteredNoise(now + 0.3, 0.32, 0.14, "highpass", 1800); }
    if (type === "hit")    { this.playKick(now, 0.22); this.playFilteredNoise(now, 0.14, 0.14, "lowpass", 900); t(145, 0, 0.16, "sawtooth", 0.15); t(88, 0.06, 0.2, "square", 0.12); }
    if (type === "roar")   { this.playFilteredNoise(now, 0.55, 0.18, "lowpass", 650); t(130, 0, 0.35, "sawtooth", 0.16); t(98, 0.18, 0.42, "sawtooth", 0.16); t(73, 0.34, 0.35, "square", 0.14); }
    if (type === "alarm")  { t(880, 0, 0.16, "square", 0.09); t(622, 0.18, 0.16, "square", 0.09); t(880, 0.36, 0.2, "square", 0.09); }
    if (type === "boom")   { this.playKick(now, 0.28); this.playFilteredNoise(now, 0.42, 0.2, "lowpass", 550); t(92, 0, 0.38, "sawtooth", 0.16); }
    if (type === "comm")   { t(1046, 0, 0.06, "sine", 0.1); t(1318, 0.08, 0.08, "sine", 0.1); }
    if (type === "win")    { t(523, 0, 0.13); t(659, 0.13, 0.13); t(784, 0.26, 0.13); t(1046, 0.4, 0.55, "triangle", 0.18); }
    if (type === "lose")   { t(392, 0, 0.22, "sawtooth", 0.1); t(349, 0.24, 0.22, "sawtooth", 0.1); t(311, 0.48, 0.45, "sawtooth", 0.1); }
  }
};

window.addEventListener("pointerdown", () => window.MF_AUDIO.unlock(), { once: true });
