// =========================================================
// 🛰️ ステップ4改：重厚ロング軌道降下演出 ＆ 結果画面からの詳細確認機能
// =========================================================
let goCurrentTab = "pickup"; // "pickup" | "rerun" | "standard" | "card_pack"
let goIsPulling = false;
let goDropTimers = [];
let goAudioCtx = null;
let goActiveSeq = null;

// 排出確率（合計 100%）
const GO_CHAR_RATES = {
  SSR: 0.016,
  SR:  0.084,
  R:   0.500,
  N:   0.400,
  SOFT_PITY_START: 60,
  HARD_PITY: 80
};

const GO_CARD_RATES = {
  SSR: 0.012,
  SR:  0.078,
  R:   0.460,
  N:   0.450,
  SOFT_PITY_START: 38,
  HARD_PITY: 50
};

const GO_LIMITED_ORDER = ["mikoto", "celestia", "sylphy", "serina", "lily", "marina", "iris"];
const GO_CARD_OVERFLOW_CRESTS = { SSR: 30, SR: 10, R: 3, N: 1 };
const GO_CHAR_OVERFLOW_CRESTS = { LIMITED_SSR: 80, SSR: 50, SR: 15, R: 5, N: 2 };

const GO_WEAPON_LABELS = {
  sword: "⚔️ 片手剣", greatsword: "🗡️ 大剣", dual: "⚔️ 双剣", sniper: "🎯 狙撃銃",
  hammer: "🔨 重槌", spear: "🔱 戦術槍", staff: "🪄 戦術杖", assault: "🔫 アサルト"
};

const GO_LIMITED_PASSIVES = {
  mikoto:   "開幕に氷結防壁を展開＆敵へ氷属性を付着",
  celestia: "開幕に3ターン防御DOWN付与＆EXゲージ+25%",
  sylphy:   "開幕にAP+2＆追加1ドローで最速展開",
  serina:   "毎ターン小隊HP10%回復＆EXゲージ+12%",
  lily:     "開幕に特大聖壁展開＆ターン経過時の防壁維持率UP",
  marina:   "開幕に水属性付着＆ボス部位破壊ダメージ大幅UP",
  iris:     "開幕次撃強化＆3連チェイン3枚目の火力を極大強化"
};

function goEsc(s) {
  if (typeof escapeHtml === "function") return escapeHtml(s);
  return String(s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  }[c]));
}

function goTodayInfo() {
  const raw = typeof getEventTodayStr === "function"
    ? getEventTodayStr()
    : new Date().toISOString().slice(0, 10);
  const m = String(raw).match(/^(\d{4})-(\d{2})-(\d{2})/);
  const month = m ? Number(m[2]) : (new Date().getMonth() + 1);
  const day = m ? Number(m[3]) : new Date().getDate();
  return { str: raw, month, day };
}

function goGetScheduleInfo() {
  const { month, day } = goTodayInfo();
  const monthMap = {
    11: "mikoto", 12: "mikoto",
    1: "celestia", 2: "sylphy", 3: "serina",
    4: "lily", 5: "marina", 6: "iris"
  };
  let puId = monthMap[month] || GO_LIMITED_ORDER[(month + 5) % GO_LIMITED_ORDER.length];
  const chars = window.MF_DATA?.CHARACTERS || {};
  if (!chars[puId]) {
    const anyLim = Object.values(chars).find(c => c.limited && c.rarity === "SSR");
    puId = anyLim ? anyLim.id : "lunaria";
  }

  const rerunActive = day >= 11 && day <= 20;
  const rerunPool = GO_LIMITED_ORDER.filter(id => id !== puId && chars[id]);
  const rerunId = rerunPool[(month - 1) % Math.max(1, rerunPool.length)] || puId;
  return { month, day, puId, rerunActive, rerunId };
}

function goEnsureState() {
  if (typeof state === "undefined" || !state) return;
  if (typeof state.gachaPity !== "number") state.gachaPity = 0;
  if (typeof state.gachaGuaranteed !== "boolean") state.gachaGuaranteed = false;
  if (typeof state.cardPity !== "number") state.cardPity = 0;
  if (!Array.isArray(state.ownedChars)) state.ownedChars = ["protagonist"];
  if (!state.charLevels) state.charLevels = { protagonist: 1 };
  if (!state.charMemories) state.charMemories = {};
  if (typeof state.arcCrests !== "number") state.arcCrests = 0;
  if (typeof state.cardTickets !== "number") state.cardTickets = 0;
  if (!state.ownedCards && window.MF_CARDS?.STARTER_OWNED_CARDS) {
    state.ownedCards = { ...window.MF_CARDS.STARTER_OWNED_CARDS };
  }
}

function goGetCharPool(mode, puId) {
  const all = Object.values(window.MF_DATA?.CHARACTERS || {}).filter(
    c => c && !c.isProtagonist && c.id !== "protagonist"
  );
  const stdSSR = all.filter(c => c.rarity === "SSR" && !c.limited);
  const puChar = all.find(c => c.id === puId) || stdSSR[0] || all[0];
  return {
    puChar,
    stdSSR: stdSSR.length ? stdSSR : all.filter(c => c.rarity === "SSR"),
    SR: all.filter(c => c.rarity === "SR"),
    R:  all.filter(c => c.rarity === "R"),
    N:  all.filter(c => c.rarity === "N"),
    all
  };
}

function goPickRandom(arr, fallback) {
  if (Array.isArray(arr) && arr.length > 0) return arr[Math.floor(Math.random() * arr.length)];
  return fallback;
}

function goGetCharSsrProb(nextPity) {
  if (nextPity >= GO_CHAR_RATES.HARD_PITY) return 1.0;
  if (nextPity >= GO_CHAR_RATES.SOFT_PITY_START) {
    return Math.min(0.95, GO_CHAR_RATES.SSR + (nextPity - GO_CHAR_RATES.SOFT_PITY_START + 1) * 0.045);
  }
  return GO_CHAR_RATES.SSR;
}

function goGetCardSsrProb(nextPity) {
  if (nextPity >= GO_CARD_RATES.HARD_PITY) return 1.0;
  if (nextPity >= GO_CARD_RATES.SOFT_PITY_START) {
    return Math.min(0.92, GO_CARD_RATES.SSR + (nextPity - GO_CARD_RATES.SOFT_PITY_START + 1) * 0.075);
  }
  return GO_CARD_RATES.SSR;
}

function goRollOneChar(mode, puId, forceSrPlus = false) {
  goEnsureState();
  const pool = goGetCharPool(mode, puId);
  const nextPity = state.gachaPity + 1;
  const ssrProb = goGetCharSsrProb(nextPity);
  const r = Math.random();

  let rarity = "N";
  if (r < ssrProb) rarity = "SSR";
  else if (forceSrPlus || r < ssrProb + GO_CHAR_RATES.SR) rarity = "SR";
  else if (r < ssrProb + GO_CHAR_RATES.SR + GO_CHAR_RATES.R) rarity = "R";
  else rarity = "N";

  let ch = null;
  let isPickupHit = false;
  if (rarity === "SSR") {
    state.gachaPity = 0;
    if (mode === "pickup" || mode === "rerun") {
      if (state.gachaGuaranteed || Math.random() < 0.5) {
        ch = pool.puChar;
        state.gachaGuaranteed = false;
        isPickupHit = true;
      } else {
        ch = goPickRandom(pool.stdSSR, pool.puChar);
        state.gachaGuaranteed = true;
      }
    } else {
      ch = goPickRandom(pool.stdSSR, pool.all[0]);
    }
  } else {
    state.gachaPity = nextPity;
    if (rarity === "SR") ch = goPickRandom(pool.SR, pool.all[0]);
    else if (rarity === "R") ch = goPickRandom(pool.R, pool.all[0]);
    else ch = goPickRandom(pool.N, pool.R[0] || pool.all[0]);
  }

  let statusTag = "";
  let statusKind = "new";
  if (!state.ownedChars.includes(ch.id)) {
    state.ownedChars.push(ch.id);
    state.charLevels[ch.id] = state.charLevels[ch.id] || 1;
    statusTag = "NEW!";
    statusKind = "new";
  } else {
    const curDupe = window.MF_LIMIT_BREAK?.getDupeCount ? window.MF_LIMIT_BREAK.getDupeCount(ch.id) : 0;
    const curMem = Number(state.charMemories[ch.id] || 0);
    if (curDupe + curMem < 5) {
      state.charMemories[ch.id] = curMem + 1;
      statusTag = "✨ 記憶+1";
      statusKind = "memory";
    } else {
      const crestVal = (ch.limited && ch.rarity === "SSR")
        ? GO_CHAR_OVERFLOW_CRESTS.LIMITED_SSR
        : (GO_CHAR_OVERFLOW_CRESTS[ch.rarity] || 5);
      state.arcCrests += crestVal;
      statusTag = `💠 クレスト+${crestVal}`;
      statusKind = "crest";
    }
  }

  return { kind: "char", rarity: ch.rarity, item: ch, isPickupHit, statusTag, statusKind };
}

function goRollOneCard(forceSrPlus = false) {
  goEnsureState();
  const poolObj = window.MF_CARDS?.ensurePool ? window.MF_CARDS.ensurePool() : (window.MF_CARDS?.TACTIC_CARDS || {});
  const all = Object.values(poolObj);
  const byRar = {
    SSR: all.filter(c => c.rarity === "SSR"),
    SR:  all.filter(c => c.rarity === "SR"),
    R:   all.filter(c => c.rarity === "R"),
    N:   all.filter(c => c.rarity === "N")
  };

  const nextPity = state.cardPity + 1;
  const ssrProb = goGetCardSsrProb(nextPity);
  const r = Math.random();

  let rarity = "N";
  if (r < ssrProb) rarity = "SSR";
  else if (forceSrPlus || r < ssrProb + GO_CARD_RATES.SR) rarity = "SR";
  else if (r < ssrProb + GO_CARD_RATES.SR + GO_CARD_RATES.R) rarity = "R";
  else rarity = "N";

  if (rarity === "SSR") state.cardPity = 0;
  else state.cardPity = nextPity;

  const card = goPickRandom(byRar[rarity], byRar.R[0] || all[0]);
  state.ownedCards = state.ownedCards || {};
  const prevLv = Number(state.ownedCards[card.id] || 0);

  let statusTag = "";
  let statusKind = "new";
  if (prevLv === 0) {
    state.ownedCards[card.id] = 1;
    statusTag = "NEW! Lv.1";
    statusKind = "new";
  } else if (prevLv < 5) {
    state.ownedCards[card.id] = prevLv + 1;
    statusTag = `Lv.${prevLv} ▶ Lv.${prevLv + 1}`;
    statusKind = "levelup";
  } else {
    const cr = GO_CARD_OVERFLOW_CRESTS[card.rarity] || 2;
    state.arcCrests += cr;
    statusTag = `MAX変換 💠+${cr}`;
    statusKind = "crest";
  }

  return { kind: "card", rarity: card.rarity, item: card, isPickupHit: false, statusTag, statusKind };
}

function goExecCharScout(mode, count) {
  if (goIsPulling) return;
  goEnsureState();
  const sched = goGetScheduleInfo();
  if (mode === "rerun" && !sched.rerunActive) {
    showToast("🔒 中旬復刻スカウトは毎月11日〜20日に開催されます");
    return;
  }

  const cost = count === 10 ? 1600 : 160;
  if ((state.gems || 0) < cost) {
    showToast(`💎 結晶石が不足しています（必要：${cost.toLocaleString()}）`);
    return;
  }

  state.gems -= cost;
  state.totalGachaPulls = (state.totalGachaPulls || 0) + count;
  const puId = mode === "rerun" ? sched.rerunId : sched.puId;

  const results = [];
  let hasSrPlus = false;
  for (let i = 0; i < count; i++) {
    const force = count === 10 && i === 9 && !hasSrPlus;
    const res = goRollOneChar(mode, puId, force);
    if (res.rarity === "SSR" || res.rarity === "SR") hasSrPlus = true;
    results.push(res);
  }

  if (typeof saveGame === "function") saveGame();
  if (typeof renderTopBar === "function") renderTopBar();
  if (typeof updateTabletBadge === "function") updateTabletBadge();
  renderGachaView();
  goPlayOrbitalDropSequence(results, mode === "standard" ? "STANDARD RECRUIT" : "LIMITED ORBITAL DROP");
}

function goExecCardScout(count) {
  if (goIsPulling) return;
  goEnsureState();
  const cost = count === 10 ? 8 : 1;
  if ((state.cardTickets || 0) < cost) {
    showToast(`🎟️ 戦術パック券が不足しています（必要：${cost}枚）`);
    return;
  }

  state.cardTickets -= cost;
  state.totalCardPulls = (state.totalCardPulls || 0) + count;

  const results = [];
  let hasSrPlus = false;
  for (let i = 0; i < count; i++) {
    const force = count === 10 && i === 9 && !hasSrPlus;
    const res = goRollOneCard(force);
    if (res.rarity === "SSR" || res.rarity === "SR") hasSrPlus = true;
    results.push(res);
  }

  if (typeof saveGame === "function") saveGame();
  if (typeof renderTopBar === "function") renderTopBar();
  if (typeof updateTabletBadge === "function") updateTabletBadge();
  renderGachaView();
  goPlayOrbitalDropSequence(results, "TACTICAL DATA ARCHIVE");
}

function goBuyCardTickets(qty) {
  goEnsureState();
  const cost = qty * 2000;
  if ((state.credits || 0) < cost) {
    showToast(`🪙 クレジットが不足しています（必要：${cost.toLocaleString()}）`);
    return;
  }
  state.credits -= cost;
  state.cardTickets += qty;
  if (typeof saveGame === "function") saveGame();
  if (typeof playSfx === "function") playSfx("gift");
  if (typeof renderTopBar === "function") renderTopBar();
  renderGachaView();
  showToast(`🎟️ 戦術パック券を ${qty}枚 購入しました！`);
}

// ---------- 🔊 重厚・4段階 軌道降下＆波形解析SE ----------
function goPlayDropSfx(phase, rarity = "R") {
  if (typeof state !== "undefined" && state && state.soundOn === false) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!goAudioCtx) goAudioCtx = new AC();
    if (goAudioCtx.state === "suspended") goAudioCtx.resume();
    const ctx = goAudioCtx;
    const now = ctx.currentTime;

    if (phase === "prepare") {
      // 照準ロック＆軌道端末起動ビープ＋低音チャージ
      [440, 587.3, 880].forEach((f, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        const t = now + idx * 0.22;
        o.type = "triangle";
        o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.001, t);
        g.gain.linearRampToValueAtTime(0.06, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        o.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + 0.2);
      });
      const hum = ctx.createOscillator();
      const hg = ctx.createGain();
      hum.type = "sine";
      hum.frequency.setValueAtTime(55, now);
      hum.frequency.linearRampToValueAtTime(110, now + 1.05);
      hg.gain.setValueAtTime(0.001, now);
      hg.gain.linearRampToValueAtTime(0.16, now + 0.8);
      hg.gain.exponentialRampToValueAtTime(0.001, now + 1.15);
      hum.connect(hg); hg.connect(ctx.destination);
      hum.start(now); hum.stop(now + 1.18);
    } else if (phase === "descend") {
      // 大気圏突入・重厚タービン降下音（1.75秒）
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 1.75);
      const flt = ctx.createBiquadFilter();
      flt.type = "lowpass";
      flt.frequency.setValueAtTime(720, now);
      flt.frequency.exponentialRampToValueAtTime(180, now + 1.75);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 0.35);
      gain.gain.linearRampToValueAtTime(0.22, now + 1.45);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      osc.connect(flt); flt.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 1.85);
    } else if (phase === "scan") {
      // 着弾後の波形解析スキャン電子音
      [330, 392, 494, 587, 659].forEach((f, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        const t = now + idx * 0.12;
        o.type = "sine";
        o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.055, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
        o.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + 0.12);
      });
    } else if (phase === "override") {
      // 昇格オーバーライド緊急警報音
      [520, 780, 520, 1040, 1320].forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        const t = now + i * 0.095;
        o.type = "square";
        o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0.085, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        o.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + 0.15);
      });
    } else if (phase === "impact") {
      // 重低音着弾＆レア度和音
      const sub = ctx.createOscillator();
      const sg = ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(rarity === "SSR" ? 145 : 102, now);
      sub.frequency.exponentialRampToValueAtTime(26, now + (rarity === "SSR" ? 0.92 : 0.48));
      sg.gain.setValueAtTime(0.48, now);
      sg.gain.exponentialRampToValueAtTime(0.001, now + (rarity === "SSR" ? 0.96 : 0.52));
      sub.connect(sg); sg.connect(ctx.destination);
      sub.start(now); sub.stop(now + 1.0);

      const chord = rarity === "SSR"
        ? [293.66, 440, 587.33, 880, 1174.66]
        : (rarity === "SR" ? [261.63, 392, 523.25, 659.25] : [220, 329.63]);
      chord.forEach((f, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        const t0 = now + idx * 0.065;
        o.type = rarity === "SSR" ? "triangle" : "sine";
        o.frequency.setValueAtTime(f, t0);
        g.gain.setValueAtTime(0.001, t0);
        g.gain.linearRampToValueAtTime(rarity === "SSR" ? 0.1 : 0.065, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0005, t0 + (rarity === "SSR" ? 0.78 : 0.36));
        o.connect(g); g.connect(ctx.destination);
        o.start(t0); o.stop(t0 + 0.82);
      });
    }
  } catch (_) {}
}

// ---------- 🛰️ ロング軌道ポッド降下シネマティック（4段階・約4.6〜5.8秒） ----------
function goClearDropTimers() {
  goDropTimers.forEach(t => clearTimeout(t));
  goDropTimers = [];
}

function goEnsureDropOverlay() {
  let ov = document.getElementById("go-drop-overlay");
  if (!ov) {
    ov = document.createElement("div");
    ov.id = "go-drop-overlay";
    ov.className = "go-drop-overlay";
    document.body.appendChild(ov);
  }
  return ov;
}

function goPlayOrbitalDropSequence(results, protocolName) {
  goClearDropTimers();
  goIsPulling = true;

  const hasSSR = results.some(r => r.rarity === "SSR");
  const hasSR = results.some(r => r.rarity === "SR");
  const topRarity = hasSSR ? "SSR" : (hasSR ? "SR" : "R");
  const doOverride = hasSSR && Math.random() < 0.42; // 42%で紫→金の昇格演出

  const ssrQueue = results.filter(r => r.rarity === "SSR");
  goActiveSeq = { results, protocolName, topRarity, ssrQueue, ssrIdx: 0, phase: "drop" };

  const revealColor = doOverride ? "#b565ff" : (topRarity === "SSR" ? "#f3cf00" : (topRarity === "SR" ? "#b565ff" : "#38a3ff"));
  const ov = goEnsureDropOverlay();
  // Phase 1 はニュートラルな戦術シアンで照準ロック（着弾まで色が読めないドキドキ感）
  ov.style.setProperty("--go-sig", "#18e0a8");
  ov.className = "go-drop-overlay active";

  ov.innerHTML = `
    <div class="ef-cine-grid"></div>
    <div class="ef-cine-scan"></div>
    <div class="ef-cine-hazard top"></div>
    <div class="ef-cine-hazard bottom"></div>
    <button class="go-skip-btn" onclick="goSkipToResults()">SKIP ⏭</button>

    <div id="go-drop-stage" class="go-drop-stage">
      <div class="go-tele-top">
        <span>// ${goEsc(protocolName)}</span>
        <span id="go-alt-readout">ALT 12,000m</span>
      </div>

      <div class="go-rail">
        <div id="go-reticle" class="go-reticle"></div>
        <div id="go-beam" class="go-beam"></div>
        <div id="go-pod" class="go-pod waiting">
          <div class="go-pod-core">◆</div>
        </div>
        <div id="go-shockwave" class="go-shockwave"></div>
        <div id="go-shockwave-2" class="go-shockwave second"></div>
      </div>

      <div id="go-signal-plate" class="go-signal-plate">
        <div id="go-sig-code" class="go-sig-code">PHASE 01 // ORBITAL CALIBRATION</div>
        <div id="go-sig-main" class="go-sig-main">TARGET LOCKING...</div>
        <div class="go-scan-bar"><div id="go-scan-fill" class="go-scan-fill"></div></div>
      </div>
    </div>
  `;

  // Phase 1（0.0s〜1.1s）：照準ロック＆軌道端末起動
  goPlayDropSfx("prepare", topRarity);
  goDropTimers.push(setTimeout(() => {
    const fill = document.getElementById("go-scan-fill");
    if (fill) fill.style.width = "32%";
  }, 100));

  // Phase 2（1.1s〜2.9s）：大気圏突入＆ポッド高速降下（1.8秒）
  goDropTimers.push(setTimeout(() => {
    const pod = document.getElementById("go-pod");
    const beam = document.getElementById("go-beam");
    const sigCode = document.getElementById("go-sig-code");
    const sigMain = document.getElementById("go-sig-main");
    const fill = document.getElementById("go-scan-fill");
    if (pod) { pod.classList.remove("waiting"); pod.classList.add("descending"); }
    if (beam) beam.classList.add("ignited");
    if (sigCode) sigCode.textContent = "PHASE 02 // ATMOSPHERIC RE-ENTRY";
    if (sigMain) sigMain.textContent = "ORBITAL DESCENT";
    if (fill) fill.style.width = "68%";
    goPlayDropSfx("descend", topRarity);

    const altEl = document.getElementById("go-alt-readout");
    for (let i = 1; i <= 10; i++) {
      goDropTimers.push(setTimeout(() => {
        const alt = Math.max(0, 12000 - i * 1200);
        if (altEl) altEl.textContent = alt === 0 ? "IMPACT // 0m" : `ALT ${alt.toLocaleString()}m`;
      }, i * 175));
    }
  }, 1100));

  // Phase 3（2.9s〜4.1s）：着弾衝撃波 ＆ アーク波形スキャン（ここで初めて色が出現）
  goDropTimers.push(setTimeout(() => {
    const stage = document.getElementById("go-drop-stage");
    const wave1 = document.getElementById("go-shockwave");
    const wave2 = document.getElementById("go-shockwave-2");
    const sigCode = document.getElementById("go-sig-code");
    const sigMain = document.getElementById("go-sig-main");
    const fill = document.getElementById("go-scan-fill");

    ov.style.setProperty("--go-sig", revealColor);
    if (stage) stage.classList.add("impact-shake");
    if (wave1) wave1.classList.add("boom");
    if (wave2) wave2.classList.add("boom");
    if (fill) fill.style.width = "100%";

    goPlayDropSfx("impact", doOverride ? "SR" : topRarity);

    if (doOverride) {
      if (sigCode) sigCode.textContent = "PHASE 03 // ANALYZING SIGNATURE...";
      if (sigMain) sigMain.textContent = "SIGNAL CLASS // SR";
      goDropTimers.push(setTimeout(() => goPlayDropSfx("scan", "SR"), 420));

      // Phase 4（4.1s〜5.6s）：SR信号から黄金SSRへ強制オーバーライド昇格！
      goDropTimers.push(setTimeout(() => {
        ov.style.setProperty("--go-sig", "#f3cf00");
        ov.classList.add("ssr-override");
        if (stage) {
          stage.classList.remove("impact-shake");
          void stage.offsetWidth;
          stage.classList.add("impact-shake");
        }
        goPlayDropSfx("override", "SSR");
        if (sigCode) sigCode.textContent = "⚠ SIGNAL OVERRIDE // LIMIT EXCEEDED";
        if (sigMain) sigMain.textContent = "CLASS SSR DETECTED!!";

        goDropTimers.push(setTimeout(() => {
          goPlayDropSfx("impact", "SSR");
          goAdvanceAfterDrop();
        }, 1400));
      }, 1200));
    } else {
      if (sigCode) {
        sigCode.textContent = topRarity === "SSR"
          ? "⚠ PHASE 03 // EXTREME ARC OUTPUT"
          : (topRarity === "SR" ? "PHASE 03 // HIGH-GRADE SIGNATURE" : "PHASE 03 // STANDARD SIGNATURE");
      }
      if (sigMain) {
        sigMain.textContent = topRarity === "SSR"
          ? "CLASS SSR DETECTED!!"
          : (topRarity === "SR" ? "CLASS SR CONFIRMED" : "POD TOUCHDOWN");
      }
      goDropTimers.push(setTimeout(() => goPlayDropSfx("scan", topRarity), 480));

      // Phase 4：ハッチ解放＆展開（SSRは長めに余韻を残す）
      goDropTimers.push(setTimeout(() => {
        if (sigCode) sigCode.textContent = "PHASE 04 // CONTAINMENT HATCH OPEN";
        if (sigMain) sigMain.textContent = "DEPLOYING DATA...";
      }, 950));

      goDropTimers.push(setTimeout(() => {
        goAdvanceAfterDrop();
      }, topRarity === "SSR" ? 1850 : 1550));
    }
  }, 2900));
}

function goAdvanceAfterDrop() {
  if (!goActiveSeq) return;
  if (goActiveSeq.ssrQueue.length > 0) {
    goActiveSeq.phase = "ssr_reveal";
    goShowSsrSpotlight(0);
  } else {
    goShowResultBoard();
  }
}

function goShowSsrSpotlight(idx) {
  if (!goActiveSeq) return;
  if (idx >= goActiveSeq.ssrQueue.length) {
    goShowResultBoard();
    return;
  }
  goActiveSeq.ssrIdx = idx;
  const entry = goActiveSeq.ssrQueue[idx];
  const ov = goEnsureDropOverlay();
  ov.style.setProperty("--go-sig", "#f3cf00");

  const isChar = entry.kind === "char";
  const it = entry.item;
  const el = window.MF_DATA?.ELEMENTS?.[it.element] || { icon: "✨", name: "煌", color: "#f3cf00" };
  const visual = isChar
    ? (window.MF_SPRITES?.portraitHTML ? window.MF_SPRITES.portraitHTML(it, "contain") : `<div style="font-size:74px;">${it.emoji || "👤"}</div>`)
    : `<div class="go-ssr-card-visual el-pat-${it.element}">
         <div style="font-size:58px;">${it.icon || "🃏"}</div>
         <div style="font-size:13px; font-weight:900; margin-top:6px;">${goEsc(it.name)}</div>
         <div style="font-size:11px; margin-top:4px; opacity:0.92;">${goEsc(it.summary || "")}</div>
       </div>`;

  const voice = isChar && Array.isArray(it.voiceLines) && it.voiceLines.length
    ? `「${goEsc(it.voiceLines[0])}」`
    : (isChar ? "「第7小隊へ合流します。指揮をお任せください。」" : goEsc(it.desc || ""));

  ov.innerHTML = `
    <div class="ef-cine-grid"></div>
    <div class="ef-cine-scan"></div>
    <div class="ef-cine-flash"></div>
    <div class="ef-cine-hazard top"></div>
    <div class="ef-cine-hazard bottom"></div>
    <button class="go-skip-btn" onclick="goSkipToResults()">SKIP ⏭</button>

    <div class="ef-cine-stage" onclick="goShowSsrSpotlight(${idx + 1})" style="cursor:pointer;">
      <div class="ef-cine-hud-top">
        <span class="ef-code">${isChar ? "OPERATOR DEPLOYED // SSR" : "ARCHIVE UNLOCKED // SSR"}</span>
        <span class="ef-code">${idx + 1} / ${goActiveSeq.ssrQueue.length}</span>
      </div>

      <div class="ef-cine-ring" style="opacity:0.65;"></div>

      <div class="ef-cine-portrait-wrap">
        ${visual}
      </div>

      <div class="ef-cine-banner">
        <div class="ef-cine-sub">${el.icon} ${el.name}属性 ${entry.isPickupHit ? "／ 👑 PICKUP" : ""}</div>
        <div class="ef-cine-title" style="font-size:24px;">${goEsc(it.name)}</div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:6px;">
          <span class="rank-pill" style="background:#f3cf00; color:#111;">★ SSR</span>
          <span class="rank-pill" style="background:#18e0a8; color:#111;">${goEsc(entry.statusTag)}</span>
        </div>
        <div class="ef-cine-voice">${voice}</div>
      </div>

      <div class="ef-cine-tap-hint">TAP TO CONTINUE // タップで次へ</div>
    </div>
  `;
  goPlayDropSfx("impact", "SSR");
}

function goSkipToResults() {
  goClearDropTimers();
  goShowResultBoard();
}

function goShowResultBoard() {
  goClearDropTimers();
  if (!goActiveSeq) { goCloseDropOverlay(); return; }
  goActiveSeq.phase = "results";

  const results = goActiveSeq.results;
  const ov = goEnsureDropOverlay();
  const ssrCnt = results.filter(r => r.rarity === "SSR").length;
  const srCnt = results.filter(r => r.rarity === "SR").length;

  ov.style.setProperty("--go-sig", ssrCnt > 0 ? "#f3cf00" : (srCnt > 0 ? "#b565ff" : "#38a3ff"));
  ov.className = "go-drop-overlay active";

  ov.innerHTML = `
    <div class="ef-cine-grid"></div>
    <div class="ef-cine-hazard top"></div>
    <div class="ef-cine-hazard bottom"></div>

    <div class="go-result-shell">
      <div class="ef-cine-hud-top" style="margin-bottom:4px;">
        <span class="ef-code">// DEPLOYMENT REPORT (${results.length} UNITS)</span>
        <span class="ef-code">SSR:${ssrCnt} / SR:${srCnt}</span>
      </div>
      <div style="font-size:10.5px; color:#c8d4ee; text-align:center; margin-bottom:7px; font-weight:800;">
        🔍 各キャラ・カードをタップすると性能やスキル詳細を確認できます
      </div>

      <div class="go-result-grid ${results.length === 1 ? "single" : ""}">
        ${results.map((r, i) => {
          const it = r.item;
          const el = window.MF_DATA?.ELEMENTS?.[it.element] || { icon: "✨" };
          const media = r.kind === "char"
            ? (window.MF_SPRITES?.portraitHTML ? window.MF_SPRITES.portraitHTML(it, "icon-lg") : `<div style="font-size:32px;">${it.emoji || "👤"}</div>`)
            : `<div class="go-res-card-ico el-pat-${it.element}">${it.icon || "🃏"}</div>`;
          return `
            <div class="go-res-tile rar-${r.rarity}" style="animation-delay:${i * 45}ms; cursor:pointer;" onclick="goOpenResultDetail(${i})">
              <div class="go-res-top">
                <span class="go-res-rar">${r.rarity}</span>
                <span>${el.icon}</span>
              </div>
              <div class="go-res-media">${media}</div>
              <div class="go-res-name">${goEsc(it.name)}</div>
              <div class="go-res-tag kind-${r.statusKind}">${goEsc(r.statusTag)}</div>
              <div class="go-res-detail-hint">詳細を見る ▸</div>
            </div>
          `;
        }).join("")}
      </div>

      <div class="go-result-footer">
        <button class="btn-primary" style="width:100%; padding:12px; font-size:14px;" onclick="goCloseDropOverlay()">
          ✅ 確認してスカウト画面へ戻る
        </button>
      </div>
    </div>
  `;
}

// ---------- 🔍 結果画面から開けるキャラ・カード詳細モーダル（最前面 z-index:2500） ----------
function goCloseResultDetail() {
  const m = document.getElementById("modal-go-detail");
  if (m) m.classList.remove("active");
}

function goOpenResultDetail(idx) {
  if (!goActiveSeq || !goActiveSeq.results[idx]) return;
  const entry = goActiveSeq.results[idx];
  const it = entry.item;
  const el = window.MF_DATA?.ELEMENTS?.[it.element] || { icon: "✨", name: "煌", color: "#f3cf00" };

  let modal = document.getElementById("modal-go-detail");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-go-detail";
    modal.className = "modal-overlay";
    modal.style.zIndex = "2500";
    modal.onclick = () => goCloseResultDetail();
    document.body.appendChild(modal);
  }

  let bodyHtml = "";

  if (entry.kind === "char") {
    const ch = typeof getCharProfile === "function" ? getCharProfile(it.id) : it;
    const lv = Number(state?.charLevels?.[ch.id] || 1);
    const dupe = window.MF_LIMIT_BREAK?.getDupeCount ? window.MF_LIMIT_BREAK.getDupeCount(ch.id) : 0;
    const mem = Number(state?.charMemories?.[ch.id] || 0);
    const pwr = typeof calcCharPower === "function" ? calcCharPower(ch.id) : 0;
    const wpLabel = GO_WEAPON_LABELS[ch.weapon] || "⚔️ 戦術武装";
    const sk = ch.skills || {};
    const limPassive = ch.limited && GO_LIMITED_PASSIVES[ch.id] ? GO_LIMITED_PASSIVES[ch.id] : "";
    const charCards = window.MF_CARDS?.getCharCards ? window.MF_CARDS.getCharCards(ch.id) : [];
    const voice = (Array.isArray(ch.voiceLines) && ch.voiceLines[0]) ? `「${ch.voiceLines[0]}」` : "";
    const portrait = window.MF_SPRITES?.portraitHTML
      ? window.MF_SPRITES.portraitHTML(ch, "contain")
      : `<div style="font-size:52px;">${ch.emoji || "👤"}</div>`;

    bodyHtml = `
      <div class="go-det-char-head">
        <div class="go-det-portrait">${portrait}</div>
        <div style="flex:1; min-width:0; text-align:left;">
          <div style="display:flex; gap:4px; flex-wrap:wrap; margin-bottom:4px;">
            <span class="rank-pill" style="background:${ch.rarity === "SSR" ? "#f3cf00" : "#18e0a8"}; color:#111;">${ch.limited ? "👑限定" : ""}${ch.rarity}</span>
            <span class="tag">${el.icon}${el.name}</span>
            <span class="tag">${wpLabel}</span>
          </div>
          <strong style="font-size:16px; display:block;">${goEsc(ch.name)}</strong>
          ${ch.role ? `<div style="font-size:10.5px; color:var(--muted); margin-top:2px;">${goEsc(ch.role)}</div>` : ""}
          <div style="margin-top:5px;">
            <span class="go-res-tag kind-${entry.statusKind}" style="display:inline-block;">${goEsc(entry.statusTag)}</span>
          </div>
          <div style="font-size:10.5px; font-weight:900; margin-top:5px;">
            Lv.${lv} ｜ 戦力 ${pwr.toLocaleString()} ｜ 凸＋${dupe}/5（記憶:${mem}）
          </div>
        </div>
      </div>

      ${voice ? `<div class="go-det-voice">${goEsc(voice)}</div>` : ""}

      ${limPassive ? `
        <div class="go-det-sec" style="border-color:#f3cf00; background:rgba(243,207,0,0.12);">
          <strong style="color:#f3cf00;">👑 限定固有パッシブ</strong>
          <div>${goEsc(limPassive)}</div>
        </div>
      ` : ""}

      <div class="go-det-sec">
        <strong>⚡ 固有スキル</strong>
        ${sk.normal ? `<div>・通常：${goEsc(sk.normal)}</div>` : ""}
        ${sk.active ? `<div>・戦技：${goEsc(sk.active)}</div>` : ""}
        ${sk.ult    ? `<div>・必殺：${goEsc(sk.ult)}</div>` : ""}
      </div>

      ${charCards.length ? `
        <div class="go-det-sec">
          <strong>🃏 バトル専用カード（3種）</strong>
          ${charCards.map(c => `
            <div class="go-det-mini-card">
              <span>${c.icon} <strong>${goEsc(c.name)}</strong>（AP${c.cost}）</span>
              <span style="color:var(--accent); font-weight:800;">${goEsc(c.summary)}</span>
            </div>
          `).join("")}
        </div>
      ` : ""}
    `;
  } else {
    const lv = window.MF_CARDS?.getCardLevel ? window.MF_CARDS.getCardLevel(it.id) : 1;
    const leveled = (window.MF_CARDS?.getLeveledTacticCard ? window.MF_CARDS.getLeveledTacticCard(it.id) : null) || it;
    const typeLabel = { attack: "⚔️ 攻撃", break: "💥 崩し", guard: "🛡️ 防御・反撃", buff: "✨ 戦術・支援", heal: "💚 回復", ult: "🌟 EX必殺" }[it.type] || "";
    const tipMap = {
      break: "💡 敵の『装甲硬化』や『必殺チャージ』に合わせると特効＆行動中断！",
      guard: "💡 敵の強襲や大技に合わせて展開すると被ダメージ激減・反撃できます！",
      attack: `💡 他の属性カードの直後に出すと『元素反応』が炸裂します！（${el.icon}${el.name}属性）`,
      buff: "💡 3連チェインの『1枚目』に置くと後続カードの威力を大きく伸ばせます！",
      heal: "💡 長期戦のボス攻略や高難度討伐での立て直しに活躍します！"
    };

    bodyHtml = `
      <div class="go-det-card-hero el-pat-${it.element}">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="rank-pill" style="background:#f3cf00; color:#111;">${it.rarity} Lv.${lv}</span>
          <span class="tcg-cost">${it.cost ?? 1}</span>
        </div>
        <div style="font-size:48px; margin:6px 0 4px;">${it.icon || "🃏"}</div>
        <strong style="font-size:16px; display:block; color:#fff;">${goEsc(it.name)}</strong>
        <div style="font-size:11px; color:#dfe8ff; margin-top:3px;">${el.icon}${el.name}属性 ／ ${typeLabel}</div>
        <div style="margin-top:6px;">
          <span class="go-res-tag kind-${entry.statusKind}" style="display:inline-block;">${goEsc(entry.statusTag)}</span>
        </div>
      </div>

      <div class="go-det-sec">
        <strong>✨ 効果サマリー</strong>
        <div style="font-weight:900; color:var(--accent); font-size:12.5px;">${goEsc(leveled.summary || it.summary || "")}</div>
      </div>

      <div class="go-det-sec">
        <strong>📖 カード詳細</strong>
        <div>${goEsc(it.desc || "")}</div>
      </div>

      ${tipMap[it.type] ? `<div class="go-det-sec" style="border-color:#18e0a8;"><div>${tipMap[it.type]}</div></div>` : ""}
    `;
  }

  modal.innerHTML = `
    <div class="modal-box" onclick="event.stopPropagation()" style="max-height:84dvh; overflow-y:auto;">
      <div class="top-row" style="margin-bottom:8px;">
        <strong style="font-size:13.5px;">🔍 ${entry.kind === "char" ? "隊員詳細データ" : "戦術カード詳細"}</strong>
        <button class="btn-xs" onclick="goCloseResultDetail()">閉じる ✕</button>
      </div>
      ${bodyHtml}
      <button class="btn-primary" style="width:100%; margin-top:10px; padding:10px;" onclick="goCloseResultDetail()">結果一覧へ戻る</button>
    </div>
  `;
  modal.classList.add("active");
  if (typeof playSfx === "function") playSfx("tap");
}

function goCloseDropOverlay() {
  goClearDropTimers();
  goCloseResultDetail();
  goIsPulling = false;
  goActiveSeq = null;
  const ov = document.getElementById("go-drop-overlay");
  if (ov) ov.classList.remove("active");
  renderGachaView();
  if (window.MF_LIMIT_BREAK?.renderCrestBanners) window.MF_LIMIT_BREAK.renderCrestBanners();
}

// ---------- 📊 提供割合モーダル ----------
function goOpenRatesModal() {
  let modal = document.getElementById("modal-go-rates");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-go-rates";
    modal.className = "modal-overlay";
    modal.style.zIndex = "1300";
    modal.onclick = () => modal.classList.remove("active");
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="modal-box" onclick="event.stopPropagation()" style="text-align:left;">
      <div class="top-row" style="margin-bottom:8px;">
        <strong style="font-size:14px;">📊 スカウト提供割合 ＆ 天井仕様</strong>
        <button class="btn-xs" onclick="document.getElementById('modal-go-rates').classList.remove('active')">✕</button>
      </div>
      <div class="wk-step">
        <strong>🛰️ 隊員スカウト（限定PU／復刻／恒常）</strong><br>
        ・SSR：<strong>1.6%</strong>（60連目から確率上昇・80連でSSR確定）<br>
        ・SR：<strong>8.4%</strong>（10連ごとにSR以上1枠確定）<br>
        ・R：50.0% ／ N：40.0%<br>
        ・限定PUでSSR当選時50%でピックアップ対象（すり抜け時は次回SSR100%PU確定）
      </div>
      <div class="wk-step">
        <strong>🃏 戦術カードパック</strong><br>
        ・SSR：<strong>1.2%</strong>（38パックから確率上昇・50パックでSSR確定）<br>
        ・SR：<strong>7.8%</strong>（10連ごとにSR以上1枠確定）<br>
        ・R：46.0% ／ N：45.0%
      </div>
      <div class="wk-step">
        <strong>✨ 重複・完凸変換ルール</strong><br>
        ・所持済み隊員は自動で<strong>専用記憶+1</strong>（隊員詳細で手動限界突破）<br>
        ・完凸（＋5）超過時は<strong>💠スター・クレスト</strong>へ自動変換（限定SSR:+80 / SSR:+50 / SR:+15 / R:+5 / N:+2）<br>
        ・Lv.5到達済みカードもクレストへ自動変換（SSR:+30 / SR:+10 / R:+3 / N:+1）
      </div>
    </div>
  `;
  modal.classList.add("active");
  if (typeof playSfx === "function") playSfx("tap");
}

// ---------- 🛰️ スカウト画面（中旬復刻は11〜20日のみ表示） ----------
function goSelectTab(tabId) {
  goCurrentTab = tabId;
  try {
    if (typeof activeBannerId !== "undefined") activeBannerId = tabId;
  } catch (_) {}
  if (typeof playSfx === "function") playSfx("tap");
  renderGachaView();
}

function renderGachaView() {
  if (typeof renderTopBar === "function") renderTopBar();
  goEnsureState();

  try {
    if (typeof activeBannerId !== "undefined" && activeBannerId === "card_pack") {
      goCurrentTab = "card_pack";
      activeBannerId = "";
    }
  } catch (_) {}

  const sec = document.getElementById("view-gacha");
  if (!sec) return;

  const sched = goGetScheduleInfo();
  if (goCurrentTab === "rerun" && !sched.rerunActive) goCurrentTab = "pickup";
  const chars = window.MF_DATA?.CHARACTERS || {};
  const puChar = chars[sched.puId] || Object.values(chars).find(c => c.rarity === "SSR" && !c.isProtagonist) || { id: "lunaria", name: "ルナリア", rarity: "SSR", element: "fire", emoji: "🔥" };
  const rerunChar = chars[sched.rerunId] || puChar;
  const crests = state.arcCrests || 0;
  const rainbow = state.rainbowCores || 0;

  const tabs = [
    { id: "pickup",    label: "👑 限定PU" },
    ...(sched.rerunActive ? [{ id: "rerun", label: "🔄 中旬復刻" }] : []),
    { id: "standard",  label: "🛰️ 恒常招集" },
    { id: "card_pack", label: "🃏 カード" }
  ];

  let bodyHtml = "";

  if (goCurrentTab === "card_pack") {
    const remainCardPity = Math.max(1, GO_CARD_RATES.HARD_PITY - (state.cardPity || 0));
    const cardTotal = Object.keys(window.MF_CARDS?.ensurePool ? window.MF_CARDS.ensurePool() : {}).length || 102;
    bodyHtml = `
      <div class="go-banner-hero card-mode">
        <div class="go-banner-head">
          <span class="ef-code">// TACTICAL ARCHIVE</span>
          <span class="rank-pill" style="background:#f3cf00; color:#111;">全${cardTotal}種収録</span>
        </div>
        <div style="font-size:48px; margin:8px 0 4px;">🃏✨</div>
        <h3 style="margin:0; font-size:18px; color:#fff;">戦術データパック招集</h3>
        <div style="font-size:11px; color:#c8d4ee; margin-top:4px;">
          SSR 1.2% ／ SR 7.8% ｜ 10連は券8枚＆SR以上確定！<br>
          SSRカード確定天井まで：あと <strong style="color:#f3cf00;">${remainCardPity}パック</strong>
        </div>
      </div>

      <div class="go-wallet-strip">
        <span>🎟️ 所持パック券：<strong>${state.cardTickets || 0}枚</strong></span>
        <span>🪙 所持クレジット：<strong>${(state.credits || 0).toLocaleString()}</strong></span>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1.25fr; gap:8px; margin-bottom:9px;">
        <button class="btn-primary" style="padding:11px 6px;" onclick="goExecCardScout(1)">
          🎟️ 1パック開封<br><span style="font-size:10px; opacity:0.9;">券 ×1</span>
        </button>
        <button class="btn-accent2" style="padding:11px 6px;" onclick="goExecCardScout(10)">
          ⚡ 10連一括開封<br><span style="font-size:10px; opacity:0.9;">券 ×8（2枚お得！）</span>
        </button>
      </div>

      <div style="background:var(--surface-sub); border:1.5px solid var(--border); border-radius:10px; padding:8px;">
        <div style="font-size:11px; font-weight:900; margin-bottom:6px;">🏪 クレジットでパック券を補充</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
          <button class="btn-xs" style="padding:7px;" onclick="goBuyCardTickets(1)">🎟️×1 購入（🪙2,000）</button>
          <button class="btn-xs btn-primary" style="padding:7px;" onclick="goBuyCardTickets(8)">🎟️×8 購入（🪙16,000）</button>
        </div>
      </div>
    `;
  } else {
    const isPickup = goCurrentTab === "pickup";
    const isRerun = goCurrentTab === "rerun";
    const targetChar = isRerun ? rerunChar : (isPickup ? puChar : (chars.lunaria || puChar));
    const elInfo = window.MF_DATA?.ELEMENTS?.[targetChar.element] || { icon: "✨", name: "煌" };
    const remainPity = Math.max(1, GO_CHAR_RATES.HARD_PITY - (state.gachaPity || 0));
    const guarBadge = (isPickup || isRerun) && state.gachaGuaranteed
      ? `<span class="rank-pill" style="background:#18e0a8; color:#111;">✅ 次回SSRはPU100%確定</span>`
      : `<span class="rank-pill" style="background:rgba(255,255,255,0.14); color:#fff;">SSR確定まで あと${remainPity}連</span>`;
    const heroArt = window.MF_SPRITES?.portraitHTML ? window.MF_SPRITES.portraitHTML(targetChar, "contain") : "";
    const bannerTitle = isPickup
      ? `👑 限定軌道招集『${targetChar.name}』`
      : (isRerun ? `🔄 中旬限定復刻『${targetChar.name}』` : "🛰️ 恒常クリアラー隊員招集");
    const subNote = isPickup
      ? `${elInfo.icon}${elInfo.name}属性・限定SSRピックアップ（専用札3種＋固有パッシブ）`
      : (isRerun
          ? "毎月11日〜20日限定開催！過去限定SSRを招集可能"
          : "恒常SSR・SR・R・N隊員を招集（※限定SSRは含まれません）");

    bodyHtml = `
      <div class="go-banner-hero">
        <div class="go-banner-head">
          <span class="ef-code">// ORBITAL RECRUIT TERMINAL</span>
          ${guarBadge}
        </div>
        <div class="go-banner-visual">
          <div class="go-banner-art">${heroArt}</div>
          <div class="go-banner-info">
            <span class="rank-pill" style="background:#f3cf00; color:#111;">${isPickup || isRerun ? "👑 LIMITED SSR" : "★ STANDARD"}</span>
            <h3 style="margin:5px 0 3px; font-size:16px; color:#fff;">${goEsc(bannerTitle)}</h3>
            <div style="font-size:10.5px; color:#cfd9f0; line-height:1.45;">${goEsc(subNote)}</div>
            <div style="font-size:10px; color:#f3cf00; font-weight:900; margin-top:6px;">
              SSR 1.6%（60連〜UP / 80連天井）｜ SR 8.4%
            </div>
          </div>
        </div>
      </div>

      <div class="go-wallet-strip">
        <span>💎 所持結晶石：<strong>${(state.gems || 0).toLocaleString()}</strong></span>
        <span>累計カウント：<strong>${state.gachaPity || 0} / ${GO_CHAR_RATES.HARD_PITY}</strong></span>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1.25fr; gap:8px;">
        <button class="btn-primary" style="padding:11px 6px;" onclick="goExecCharScout('${goCurrentTab}', 1)">
          🛰️ 1回招集<br><span style="font-size:10px; opacity:0.9;">💎 160</span>
        </button>
        <button class="btn-accent2" style="padding:11px 6px;" onclick="goExecCharScout('${goCurrentTab}', 10)">
          🔥 10連軌道投下<br><span style="font-size:10px; opacity:0.9;">💎 1,600（SR以上1枠確定）</span>
        </button>
      </div>
    `;
  }

  sec.innerHTML = `
    <div class="card">
      <div class="section-title">
        <span>🛰️ 軌道スカウト端末</span>
        <div style="display:flex; gap:5px;">
          <button class="btn-xs" onclick="goOpenRatesModal()">📊 確率</button>
          <button class="btn-xs" onclick="switchView('home')">← 拠点へ</button>
        </div>
      </div>

      <div id="lb-crest-bar-gacha" class="lb-crest-shortcut">
        <div style="font-size:11px; font-weight:900;">
          💠 クレスト：<strong>${crests}</strong> ｜ 🌈 虹コア：<strong>${rainbow}</strong>
        </div>
        <button class="btn-xs btn-accent2" onclick="openCrestShopModal()">💠 交換所</button>
      </div>

      <div style="display:grid; grid-template-columns:repeat(${tabs.length},1fr); gap:4px; margin-bottom:9px;">
        ${tabs.map(t => `
          <button class="btn-xs ${goCurrentTab === t.id ? "btn-primary" : ""}" style="padding:6px 2px; font-size:10px;" onclick="goSelectTab('${t.id}')">${t.label}</button>
        `).join("")}
      </div>

      ${bodyHtml}
    </div>
  `;
}

window.renderGachaView = renderGachaView;
window.goSelectTab = goSelectTab;
window.goExecCharScout = goExecCharScout;
window.goExecCardScout = goExecCardScout;
window.goBuyCardTickets = goBuyCardTickets;
window.goOpenRatesModal = goOpenRatesModal;
window.goShowSsrSpotlight = goShowSsrSpotlight;
window.goSkipToResults = goSkipToResults;
window.goCloseDropOverlay = goCloseDropOverlay;
window.goOpenResultDetail = goOpenResultDetail;
window.goCloseResultDetail = goCloseResultDetail;

// =========================================================
// 🔇 スカウト中（スカウト画面＆軌道降下演出中）はBGMを停止
// =========================================================
let goBgmStopped = false;

function goStopBgmForScout() {
  if (!window.MF_AUDIO) return;
  try {
    if (typeof window.MF_AUDIO.stopLoop === "function") window.MF_AUDIO.stopLoop();
    if (typeof window.MF_AUDIO.stopBgm === "function") window.MF_AUDIO.stopBgm();
    goBgmStopped = true;
  } catch (_) {}
}

function goResumeBgmAfterScout() {
  if (!goBgmStopped || !window.MF_AUDIO) return;
  goBgmStopped = false;
  try {
    if (typeof window.MF_AUDIO.playBgm === "function") {
      window.MF_AUDIO.playBgm("home");
    }
  } catch (_) {}
}

(function installGachaBgmHooks() {
  if (typeof window.renderGachaView === "function" && !window.renderGachaView._bgmHooked) {
    const origRender = window.renderGachaView;
    window.renderGachaView = function() {
      const r = origRender.apply(this, arguments);
      if (document.getElementById("view-gacha")?.classList.contains("active")) {
        goStopBgmForScout();
      }
      return r;
    };
    window.renderGachaView._bgmHooked = true;
  }

  if (typeof goPlayOrbitalDropSequence === "function" && !goPlayOrbitalDropSequence._bgmHooked) {
    const origDrop = goPlayOrbitalDropSequence;
    goPlayOrbitalDropSequence = function() {
      goStopBgmForScout();
      return origDrop.apply(this, arguments);
    };
    goPlayOrbitalDropSequence._bgmHooked = true;
  }

  if (typeof window.switchView === "function" && !window.switchView._goBgmHooked) {
    const origSwitch = window.switchView;
    window.switchView = function(viewId) {
      const r = origSwitch.apply(this, arguments);
      if (viewId === "gacha") {
        goStopBgmForScout();
      } else if (goBgmStopped) {
        goResumeBgmAfterScout();
      }
      return r;
    };
    window.switchView._goBgmHooked = true;
  }
})();
