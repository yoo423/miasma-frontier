// =========================================================
// 🛰️ ステップ4：ガチャ確率本格調整 ＆ エンドフィールド風・軌道降下スカウト
// =========================================================
let goCurrentTab = "pickup"; // "pickup" | "rerun" | "standard" | "card_pack"
let goIsPulling = false;
let goDropTimers = [];
let goAudioCtx = null;
let goActiveSeq = null;

// 本格調整後の排出確率（合計 100%）
const GO_CHAR_RATES = {
  SSR: 0.016,        // 1.6%（60連〜段階UP・80連天井）
  SR:  0.084,        // 8.4%（10連でSR以上1枠確定）
  R:   0.500,        // 50.0%
  N:   0.400,        // 40.0%
  SOFT_PITY_START: 60,
  HARD_PITY: 80
};

const GO_CARD_RATES = {
  SSR: 0.012,        // 1.2%（50パック天井）
  SR:  0.078,        // 7.8%（10連でSR以上1枠確定）
  R:   0.460,        // 46.0%
  N:   0.450,        // 45.0%
  SOFT_PITY_START: 38,
  HARD_PITY: 50
};

const GO_LIMITED_ORDER = ["mikoto", "celestia", "sylphy", "serina", "lily", "marina", "iris"];
const GO_CARD_OVERFLOW_CRESTS = { SSR: 30, SR: 10, R: 3, N: 1 };
const GO_CHAR_OVERFLOW_CRESTS = { LIMITED_SSR: 80, SSR: 50, SR: 15, R: 5, N: 2 };

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

  // 中旬復刻（毎月11日〜20日）：今月PU以外の限定SSRを復刻対象に
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
    // 60連目から1連ごとに約+4.5%ずつ上昇し80連で100%
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

// 1回分のキャラ抽選（ステップ2の手動記憶＆完凸クレスト変換へ直結）
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

  // 獲得処理（新規 / 専用記憶 / 完凸クレスト変換）
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

// 1回分の戦術カード抽選（最大Lv.5超過時はクレストへ自動変換）
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

// ---------- 🔊 重厚・軌道降下＆着弾インパクトSE ----------
function goPlayDropSfx(phase, rarity = "R") {
  if (typeof state !== "undefined" && state && state.soundOn === false) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!goAudioCtx) goAudioCtx = new AC();
    if (goAudioCtx.state === "suspended") goAudioCtx.resume();
    const ctx = goAudioCtx;
    const now = ctx.currentTime;

    if (phase === "descend") {
      // 軌道降下のタービン唸り＆低音下降音
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(52, now + 0.95);
      const flt = ctx.createBiquadFilter();
      flt.type = "lowpass";
      flt.frequency.setValueAtTime(520, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.14, now + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.98);
      osc.connect(flt); flt.connect(gain); gain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 1.0);
    } else if (phase === "override") {
      // 昇格オーバーライド警報音
      [520, 780, 1040].forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "square";
        o.frequency.setValueAtTime(f, now + i * 0.08);
        g.gain.setValueAtTime(0.08, now + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.14);
        o.connect(g); g.connect(ctx.destination);
        o.start(now + i * 0.08); o.stop(now + i * 0.08 + 0.15);
      });
    } else if (phase === "impact") {
      // 着弾重低音＋レア度別和音
      const sub = ctx.createOscillator();
      const sg = ctx.createGain();
      sub.type = "sine";
      sub.frequency.setValueAtTime(rarity === "SSR" ? 135 : 98, now);
      sub.frequency.exponentialRampToValueAtTime(28, now + (rarity === "SSR" ? 0.78 : 0.42));
      sg.gain.setValueAtTime(0.45, now);
      sg.gain.exponentialRampToValueAtTime(0.001, now + (rarity === "SSR" ? 0.82 : 0.46));
      sub.connect(sg); sg.connect(ctx.destination);
      sub.start(now); sub.stop(now + 0.85);

      const chord = rarity === "SSR"
        ? [293.66, 440, 587.33, 880, 1174.66]
        : (rarity === "SR" ? [261.63, 392, 523.25] : [220, 329.63]);
      chord.forEach((f, idx) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        const t0 = now + idx * 0.055;
        o.type = rarity === "SSR" ? "triangle" : "sine";
        o.frequency.setValueAtTime(f, t0);
        g.gain.setValueAtTime(0.001, t0);
        g.gain.linearRampToValueAtTime(rarity === "SSR" ? 0.095 : 0.06, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0005, t0 + (rarity === "SSR" ? 0.65 : 0.3));
        o.connect(g); g.connect(ctx.destination);
        o.start(t0); o.stop(t0 + 0.7);
      });
    }
  } catch (_) {}
}

// ---------- 🛰️ 軌道ポッド降下シネマティック演出 ----------
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
  const doOverride = hasSSR && Math.random() < 0.38; // 38%で紫→金の昇格演出！

  const ssrQueue = results.filter(r => r.rarity === "SSR");
  goActiveSeq = { results, protocolName, topRarity, ssrQueue, ssrIdx: 0, phase: "drop" };

  const initColor = doOverride ? "#b565ff" : (topRarity === "SSR" ? "#f3cf00" : (topRarity === "SR" ? "#b565ff" : "#38a3ff"));
  const ov = goEnsureDropOverlay();
  ov.style.setProperty("--go-sig", initColor);
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
        <span id="go-alt-readout">ALT 4,200m</span>
      </div>

      <div class="go-rail">
        <div class="go-beam"></div>
        <div id="go-pod" class="go-pod">
          <div class="go-pod-core">◆</div>
        </div>
        <div id="go-shockwave" class="go-shockwave"></div>
      </div>

      <div id="go-signal-plate" class="go-signal-plate">
        <div id="go-sig-code" class="go-sig-code">SIGNAL LOCKING...</div>
        <div id="go-sig-main" class="go-sig-main">ORBITAL DESCENT</div>
      </div>
    </div>
  `;

  goPlayDropSfx("descend", topRarity);

  // 高度カウントダウン演出
  let alt = 4200;
  const altEl = document.getElementById("go-alt-readout");
  for (let i = 1; i <= 6; i++) {
    goDropTimers.push(setTimeout(() => {
      alt = Math.max(0, 4200 - i * 700);
      if (altEl) altEl.textContent = alt === 0 ? "IMPACT // 0m" : `ALT ${alt.toLocaleString()}m`;
    }, i * 140));
  }

  // 着弾フェーズ
  const impactDelay = 950;
  goDropTimers.push(setTimeout(() => {
    const stage = document.getElementById("go-drop-stage");
    const wave = document.getElementById("go-shockwave");
    const sigCode = document.getElementById("go-sig-code");
    const sigMain = document.getElementById("go-sig-main");
    if (stage) stage.classList.add("impact-shake");
    if (wave) wave.classList.add("boom");

    if (doOverride) {
      goPlayDropSfx("impact", "SR");
      if (sigCode) sigCode.textContent = "SIGNAL CLASS // SR";
      if (sigMain) sigMain.textContent = "POD TOUCHDOWN";

      // 0.55秒後にノイズ→黄金SSRへ昇格オーバーライド！
      goDropTimers.push(setTimeout(() => {
        ov.style.setProperty("--go-sig", "#f3cf00");
        ov.classList.add("ssr-override");
        goPlayDropSfx("override", "SSR");
        if (sigCode) sigCode.textContent = "⚠ SIGNAL OVERRIDE // HIGH OUTPUT";
        if (sigMain) sigMain.textContent = "CLASS SSR DETECTED!!";

        goDropTimers.push(setTimeout(() => {
          goPlayDropSfx("impact", "SSR");
          goAdvanceAfterDrop();
        }, 900));
      }, 550));
    } else {
      goPlayDropSfx("impact", topRarity);
      if (sigCode) {
        sigCode.textContent = topRarity === "SSR"
          ? "⚠ HIGH-OUTPUT ARC SIGNATURE"
          : (topRarity === "SR" ? "SIGNAL CLASS // SR" : "SIGNAL CLASS // STANDARD");
      }
      if (sigMain) {
        sigMain.textContent = topRarity === "SSR" ? "CLASS SSR DETECTED" : "POD TOUCHDOWN";
      }
      goDropTimers.push(setTimeout(() => goAdvanceAfterDrop(), topRarity === "SSR" ? 950 : 650));
    }
  }, impactDelay));
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
      <div class="ef-cine-hud-top" style="margin-bottom:8px;">
        <span class="ef-code">// DEPLOYMENT REPORT (${results.length} UNITS)</span>
        <span class="ef-code">SSR:${ssrCnt} / SR:${srCnt}</span>
      </div>

      <div class="go-result-grid ${results.length === 1 ? "single" : ""}">
        ${results.map((r, i) => {
          const it = r.item;
          const el = window.MF_DATA?.ELEMENTS?.[it.element] || { icon: "✨" };
          const media = r.kind === "char"
            ? (window.MF_SPRITES?.portraitHTML ? window.MF_SPRITES.portraitHTML(it, "icon-lg") : `<div style="font-size:32px;">${it.emoji || "👤"}</div>`)
            : `<div class="go-res-card-ico el-pat-${it.element}">${it.icon || "🃏"}</div>`;
          return `
            <div class="go-res-tile rar-${r.rarity}" style="animation-delay:${i * 45}ms;">
              <div class="go-res-top">
                <span class="go-res-rar">${r.rarity}</span>
                <span>${el.icon}</span>
              </div>
              <div class="go-res-media">${media}</div>
              <div class="go-res-name">${goEsc(it.name)}</div>
              <div class="go-res-tag kind-${r.statusKind}">${goEsc(r.statusTag)}</div>
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

function goCloseDropOverlay() {
  goClearDropTimers();
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

// ---------- 🛰️ スカウト画面（インダストリアル端末UI） ----------
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

  // cards.js 等からの外部遷移（activeBannerId='card_pack'）を自動反映
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
          ? (sched.rerunActive ? "毎月11日〜20日限定開催！過去限定SSRを招集可能" : "🔒 毎月11日〜20日に開放される中旬復刻スカウトです")
          : "恒常SSR・SR・R・N隊員を招集（※限定SSRは含まれません）");
    const lockRerun = isRerun && !sched.rerunActive;

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
        <button class="btn-primary" style="padding:11px 6px;" ${lockRerun ? "disabled" : ""} onclick="goExecCharScout('${goCurrentTab}', 1)">
          🛰️ 1回招集<br><span style="font-size:10px; opacity:0.9;">💎 160</span>
        </button>
        <button class="btn-accent2" style="padding:11px 6px;" ${lockRerun ? "disabled" : ""} onclick="goExecCharScout('${goCurrentTab}', 10)">
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

// グローバル公開＆既存 renderGachaView の安全な置き換え
window.renderGachaView = renderGachaView;
window.goSelectTab = goSelectTab;
window.goExecCharScout = goExecCharScout;
window.goExecCardScout = goExecCardScout;
window.goBuyCardTickets = goBuyCardTickets;
window.goOpenRatesModal = goOpenRatesModal;
window.goShowSsrSpotlight = goShowSsrSpotlight;
window.goSkipToResults = goSkipToResults;
window.goCloseDropOverlay = goCloseDropOverlay;
