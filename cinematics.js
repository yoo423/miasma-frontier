// =========================================================
// 🎬 ステップ3：レベルアップ・昇格・限界突破 専用カットイン演出
//    ＆ エンドフィールド風 インダストリアル重厚演出システム
// =========================================================
let cineAscendKeyCache = null;
let cineSnap = { lv: {}, asc: {}, power: {} };
let cineAutoCloseTimer = null;
let cinePlaying = false;
let cineAudioCtx = null;

function cineEsc(s) {
  if (typeof escapeHtml === "function") return escapeHtml(s);
  return String(s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  }[c]));
}

function detectAscendKey() {
  if (cineAscendKeyCache) return cineAscendKeyCache;
  const known = [
    "charAscensions", "charAscend", "charRanks", "charPromotions",
    "charRank", "charTier", "ascensions", "charPromote", "charStage"
  ];
  try {
    const names = Object.keys(window).filter(k =>
      /ascend|promot|rank|growth|char|power|detail/i.test(k) && typeof window[k] === "function"
    );
    const blob = names.map(n => { try { return window[n].toString(); } catch (_) { return ""; } }).join("\n");
    for (const k of known) {
      if (blob.includes(`state.${k}`) || blob.includes(`"${k}"`) || blob.includes(`'${k}'`)) {
        cineAscendKeyCache = k;
        return k;
      }
    }
  } catch (_) {}
  if (typeof state !== "undefined" && state) {
    for (const k of known) {
      if (state[k] && typeof state[k] === "object" && !Array.isArray(state[k])) {
        cineAscendKeyCache = k;
        return k;
      }
    }
  }
  cineAscendKeyCache = "charAscensions";
  return cineAscendKeyCache;
}

function getCineCharLv(id) {
  return Number(state?.charLevels?.[id] || 0);
}

function getCineCharAsc(id) {
  const k = detectAscendKey();
  return Number(state?.[k]?.[id] || 0);
}

function getCineCharPower(id) {
  if (typeof calcCharPower === "function") {
    try { return calcCharPower(id); } catch (_) {}
  }
  return 0;
}

function syncCineSnapshot() {
  if (typeof state === "undefined" || !state) return;
  const ids = new Set([
    "protagonist",
    ...(state.ownedChars || []),
    ...Object.keys(state.charLevels || {})
  ]);
  cineSnap = { lv: {}, asc: {}, power: {} };
  ids.forEach(id => {
    cineSnap.lv[id] = getCineCharLv(id);
    cineSnap.asc[id] = getCineCharAsc(id);
    cineSnap.power[id] = getCineCharPower(id);
  });
}

// ---------- 🔊 エンドフィールド風 重低音＋金属ロックSE ----------
function playIndustrialSfx(kind = "levelup") {
  if (typeof state !== "undefined" && state && state.soundOn === false) return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!cineAudioCtx) cineAudioCtx = new AC();
    if (cineAudioCtx.state === "suspended") cineAudioCtx.resume();
    const ctx = cineAudioCtx;
    const now = ctx.currentTime;

    // 1. 重低音サブベース・インパクト
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(kind === "limitbreak" ? 118 : 96, now);
    sub.frequency.exponentialRampToValueAtTime(34, now + (kind === "levelup" ? 0.32 : 0.62));
    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(kind === "levelup" ? 0.28 : 0.42, now + 0.02);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + (kind === "levelup" ? 0.36 : 0.68));
    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(now);
    sub.stop(now + 0.72);

    // 2. 金属ロック＆デジタルスキャン和音
    const freqs = kind === "limitbreak"
      ? [220, 330, 440, 659.25, 880]
      : (kind === "ascend" ? [261.6, 392, 523.25, 784] : [329.6, 493.88, 659.25]);

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t0 = now + idx * (kind === "levelup" ? 0.045 : 0.07);
      osc.type = idx % 2 === 0 ? "triangle" : "sawtooth";
      osc.frequency.setValueAtTime(f, t0);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.linearRampToValueAtTime(0.065, t0 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + (kind === "levelup" ? 0.22 : 0.44));

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2200, t0);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.48);
    });
  } catch (_) {}
}

// ---------- 🎬 専用フルスクリーン・カットイン描画 ----------
function ensureCinematicOverlay() {
  let ov = document.getElementById("ef-cine-overlay");
  if (!ov) {
    ov = document.createElement("div");
    ov.id = "ef-cine-overlay";
    ov.className = "ef-cine-overlay";
    ov.onclick = () => closeEnhancementCinematic();
    document.body.appendChild(ov);
  }
  return ov;
}

function closeEnhancementCinematic() {
  clearTimeout(cineAutoCloseTimer);
  cineAutoCloseTimer = null;
  cinePlaying = false;
  const ov = document.getElementById("ef-cine-overlay");
  if (!ov) return;
  ov.classList.remove("active");
}

function triggerEnhancementCinematic(cfg) {
  if (!cfg || !cfg.charId) return;
  clearTimeout(cineAutoCloseTimer);
  cinePlaying = true;

  const ch = typeof getCharProfile === "function"
    ? getCharProfile(cfg.charId)
    : (window.MF_DATA?.CHARACTERS?.[cfg.charId] || { id: cfg.charId, name: cfg.charId, rarity: "SR", element: "arc", emoji: "👤" });

  const elInfo = window.MF_DATA?.ELEMENTS?.[ch.element] || { icon: "✨", name: "煌", color: "#f3cf00" };
  const portraitHtml = window.MF_SPRITES?.portraitHTML
    ? window.MF_SPRITES.portraitHTML(ch, "contain")
    : `<div style="font-size:64px;">${ch.emoji || "👤"}</div>`;

  const mode = cfg.mode || "levelup"; // "levelup" | "ascend" | "limitbreak"
  const themeAccent = mode === "limitbreak" ? "#f3cf00" : (mode === "ascend" ? "#18e0a8" : (elInfo.color || "#f3cf00"));
  const protocolLabel = mode === "limitbreak"
    ? "PROTOCOL // POTENTIAL_RESONANCE"
    : (mode === "ascend" ? "PROTOCOL // CLASS_ASCENSION" : "PROTOCOL // TACTICAL_ENHANCE");
  const mainTitle = mode === "limitbreak"
    ? "LIMIT BREAK"
    : (mode === "ascend" ? "PROMOTION" : "LEVEL UP");
  const subTitleJa = mode === "limitbreak"
    ? "潜在能力 限界突破"
    : (mode === "ascend" ? "戦術ランク 昇格完了" : "戦闘データ 強化完了");

  const voice = (Array.isArray(ch.voiceLines) && ch.voiceLines.length)
    ? ch.voiceLines[Math.floor(Math.random() * ch.voiceLines.length)]
    : "出力安定。次の作戦へ移行します。";

  // 突破スロット（限界突破時）
  let slotsHtml = "";
  if (mode === "limitbreak") {
    const newVal = Math.min(5, Number(cfg.toVal || 1));
    slotsHtml = `
      <div class="ef-cine-nodes">
        ${[1, 2, 3, 4, 5].map(n => {
          const cls = n < newVal ? "lit" : (n === newVal ? "lit newly" : "");
          return `<span class="ef-node ${cls}">◆</span>`;
        }).join("")}
      </div>
    `;
  }

  const pwrDiff = Math.max(0, (cfg.toPower || 0) - (cfg.fromPower || 0));
  const statsHtml = `
    <div class="ef-cine-diff-row">
      <div class="ef-cine-diff-item">
        <span class="ef-lbl">${cineEsc(cfg.metricLabel || "LEVEL")}</span>
        <div class="ef-val-change">
          <span class="ef-from">${cineEsc(cfg.fromText)}</span>
          <span class="ef-arrow">▶</span>
          <span class="ef-to" style="color:${themeAccent};">${cineEsc(cfg.toText)}</span>
        </div>
      </div>
      ${cfg.toPower ? `
        <div class="ef-cine-diff-item">
          <span class="ef-lbl">COMBAT POWER</span>
          <div class="ef-val-change">
            <span class="ef-from">${Number(cfg.fromPower || 0).toLocaleString()}</span>
            <span class="ef-arrow">▶</span>
            <span class="ef-to" style="color:#ffffff;">${Number(cfg.toPower).toLocaleString()}${pwrDiff > 0 ? ` <small style="color:#18e0a8;">+${pwrDiff}</small>` : ""}</span>
          </div>
        </div>
      ` : ""}
    </div>
  `;

  const ov = ensureCinematicOverlay();
  ov.style.setProperty("--ef-accent", themeAccent);
  ov.className = `ef-cine-overlay mode-${mode}`;
  ov.innerHTML = `
    <div class="ef-cine-grid"></div>
    <div class="ef-cine-scan"></div>
    <div class="ef-cine-flash"></div>
    <div class="ef-cine-hazard top"></div>
    <div class="ef-cine-hazard bottom"></div>

    <div class="ef-cine-stage">
      <div class="ef-cine-hud-top">
        <span class="ef-code">${protocolLabel}</span>
        <span class="ef-code">OP-ID // ${cineEsc(String(ch.id || "UNIT").toUpperCase())}</span>
      </div>

      <div class="ef-cine-ring"></div>

      <div class="ef-cine-portrait-wrap">
        ${portraitHtml}
      </div>

      <div class="ef-cine-banner">
        <div class="ef-cine-sub">${elInfo.icon} ${cineEsc(ch.name)} ／ ${subTitleJa}</div>
        <div class="ef-cine-title">${mainTitle}</div>
        ${slotsHtml}
        ${statsHtml}
        ${mode !== "levelup" ? `<div class="ef-cine-voice">「${cineEsc(voice)}」</div>` : ""}
      </div>

      <div class="ef-cine-tap-hint">${mode === "levelup" ? "TAP TO CONTINUE // 自動進行" : "TAP SCREEN TO CONFIRM // タップして続行"}</div>
    </div>
  `;

  // アニメーション再発火
  void ov.offsetWidth;
  ov.classList.add("active");
  playIndustrialSfx(mode);

  // レベルアップだけは連打テンポを壊さないよう1.95秒で自動フェードアウト（昇格・限界突破はタップ確認）
  if (mode === "levelup") {
    cineAutoCloseTimer = setTimeout(() => closeEnhancementCinematic(), 1950);
  }
}

// セーブ時にレベル・昇格の増加を自動検出してカットイン発動
function inspectGrowthDeltas() {
  if (typeof state === "undefined" || !state) return;

  // 隊員詳細画面が開いているときだけ強化演出を発火（ロード直後・ガチャ新規取得では誤爆させない）
  const detailView = document.getElementById("cd-hero-box")?.closest(".view, section");
  const isDetailActive = detailView && detailView.classList.contains("active");

  let detected = null;
  const ids = new Set(["protagonist", ...(state.ownedChars || []), ...Object.keys(state.charLevels || {})]);

  ids.forEach(id => {
    const prevLv = cineSnap.lv[id] || 0;
    const curLv = getCineCharLv(id);
    const prevAsc = cineSnap.asc[id] || 0;
    const curAsc = getCineCharAsc(id);
    const prevPwr = cineSnap.power[id] || 0;
    const curPwr = getCineCharPower(id);

    if (isDetailActive) {
      if (curAsc > prevAsc) {
        detected = {
          mode: "ascend",
          charId: id,
          metricLabel: "ASCENSION RANK",
          fromText: `RANK ${prevAsc}`,
          toText: `RANK ${curAsc}`,
          fromPower: prevPwr,
          toPower: curPwr
        };
      } else if (prevLv >= 1 && curLv > prevLv && (!detected || detected.mode === "levelup")) {
        detected = {
          mode: "levelup",
          charId: id,
          metricLabel: "OPERATOR LEVEL",
          fromText: `Lv.${prevLv}`,
          toText: `Lv.${curLv}`,
          fromPower: prevPwr,
          toPower: curPwr
        };
      }
    }
  });

  syncCineSnapshot();

  if (detected) {
    triggerEnhancementCinematic(detected);
  }
}

// 画面切替時の超高速インダストリアル・シャッターフラッシュ（重厚感演出・操作は一切遅延しない）
function flashViewTransition() {
  let bar = document.getElementById("ef-view-wipe");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "ef-view-wipe";
    bar.className = "ef-view-wipe";
    document.body.appendChild(bar);
  }
  bar.classList.remove("run");
  void bar.offsetWidth;
  bar.classList.add("run");
}

window.triggerEnhancementCinematic = triggerEnhancementCinematic;
window.closeEnhancementCinematic = closeEnhancementCinematic;

// ---------- 安全フック（既存 growth.js / limit_break.js / main.js に自動接続） ----------
(function installCinematicHooks() {
  syncCineSnapshot();

  // 1. 手動限界突破フック（ステップ2の limit_break.js と直結）
  if (typeof window.executeManualLimitBreak === "function" && !window.executeManualLimitBreak._cineHooked) {
    const origLb = window.executeManualLimitBreak;
    window.executeManualLimitBreak = function(charId, source) {
      const prevDupe = window.MF_LIMIT_BREAK?.getDupeCount ? window.MF_LIMIT_BREAK.getDupeCount(charId) : 0;
      const prevPwr = getCineCharPower(charId);
      const res = origLb.apply(this, arguments);
      const nextDupe = window.MF_LIMIT_BREAK?.getDupeCount ? window.MF_LIMIT_BREAK.getDupeCount(charId) : prevDupe;
      const nextPwr = getCineCharPower(charId);
      syncCineSnapshot();
      if (nextDupe > prevDupe) {
        triggerEnhancementCinematic({
          mode: "limitbreak",
          charId,
          metricLabel: "POTENTIAL",
          fromText: `＋${prevDupe}`,
          toText: `＋${nextDupe}`,
          fromPower: prevPwr,
          toPower: nextPwr
        });
      }
      return res;
    };
    window.executeManualLimitBreak._cineHooked = true;
  }

  // 2. saveGame フック（レベルアップ＆昇格を自動検出）
  if (typeof window.saveGame === "function" && !window.saveGame._cineHooked) {
    const origSave = window.saveGame;
    window.saveGame = function() {
      const res = origSave.apply(this, arguments);
      inspectGrowthDeltas();
      return res;
    };
    window.saveGame._cineHooked = true;
  }

  // 3. switchView フック（軽快な戦術画面切替ワイプ＆スナップショット同期）
  if (typeof window.switchView === "function" && !window.switchView._cineHooked) {
    const origSwitch = window.switchView;
    window.switchView = function() {
      syncCineSnapshot();
      flashViewTransition();
      return origSwitch.apply(this, arguments);
    };
    window.switchView._cineHooked = true;
  }
})();
