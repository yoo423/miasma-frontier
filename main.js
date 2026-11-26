const SAVE_KEY = "miasma_frontier_save_v1";
const MAX_EN = 160;
const MAX_RESERVE_EN = 1000;
const EN_REGEN_MS = 6 * 60 * 1000;

let state = null;
let audioCtx = null;
let showcaseCharId = "protagonist";

function createDefaultSave() {
  return {
    activityPt: 0, mailbox: [], claimedMailIds: [],
    initialized: false,
    playerName: "名無し",
    styleId: "m_cool",
    protagonistWeapon: "sword",
    protagonistElement: "arc",
    playerRank: 1,
    playerExp: 0,
    gems: 3200, // 最初から20連分お試し可能
    credits: 8000,
    expBooks: 30,
    cores: 6,
    en: 160,
    reserveEn: 0,
    lastEnTimestamp: Date.now(),
    uiTheme: "camp",
    soundOn: true,
    pityCount: 0,
    pityGuaranteed: false,
    ownedChars: ["protagonist", "momo", "mint", "aoi"],
    party: ["protagonist", "momo", "mint", "aoi"],
    charLevels: { protagonist: 1, momo: 1, mint: 1, aoi: 1 },
    charRanks: { protagonist: 0, momo: 0, mint: 0, aoi: 0 },
    charDupes: { protagonist: 0, momo: 0, mint: 0, aoi: 0 },
    materials: {},
    redeemedCodes: []
  };
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return createDefaultSave();
    const parsed = JSON.parse(raw);
    const base = createDefaultSave();
    return {
      ...base,
      ...parsed,
      ownedChars: parsed.ownedChars || base.ownedChars,
      charRanks: { ...base.charRanks, ...(parsed.charRanks || {}) },
      charDupes: { ...base.charDupes, ...(parsed.charDupes || {}) }
    };
  } catch (e) {
    return createDefaultSave();
  }
}

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function updateStamina() {
  const now = Date.now();
  const elapsed = now - (state.lastEnTimestamp || now);
  if (elapsed < EN_REGEN_MS) return;

  const ticks = Math.floor(elapsed / EN_REGEN_MS);
  state.lastEnTimestamp += ticks * EN_REGEN_MS;

  for (let i = 0; i < ticks; i++) {
    if (state.en < MAX_EN) {
      state.en += 1;
    } else if (state.reserveEn < MAX_RESERVE_EN && i % 2 === 0) {
      state.reserveEn = Math.min(MAX_RESERVE_EN, state.reserveEn + 1);
    }
  }
  saveGame();
}

function playSfx(type) {
  if (!state.soundOn) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const now = audioCtx.currentTime;
    const tone = (f, t, d, w = "triangle", v = 0.14) => {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = w;
      osc.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(v, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + d);
      osc.connect(g);
      g.connect(audioCtx.destination);
      osc.start(t);
      osc.stop(t + d);
    };
    if (type === "tap") tone(740, now, 0.06, "sine", 0.1);
    if (type === "switch") { tone(523, now, 0.08); tone(784, now + 0.06, 0.12); }
    if (type === "gift") { tone(659, now, 0.1); tone(880, now + 0.09, 0.1); tone(1174, now + 0.18, 0.25); }
  } catch (e) {}
}

function toggleSound() {
  state.soundOn = !state.soundOn;
  saveGame();
  if (state.soundOn) playSfx("switch");
  renderTopBar();
  showToast(state.soundOn ? "🔊 サウンド ON" : "🔇 サウンド OFF");
}

function applyTheme() {
  document.body.classList.toggle("theme-tactical", state.uiTheme === "tactical");
}

function toggleUiTheme() {
  state.uiTheme = state.uiTheme === "camp" ? "tactical" : "camp";
  saveGame();
  applyTheme();
  playSfx("switch");
  renderTopBar();
  showToast(state.uiTheme === "camp" ? "🏕️ 拠点クリーンUIに切替" : "⚡ 作戦端末UIに切替");
}

function switchView(viewId) {
  playSfx("tap");
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(`view-${viewId}`).classList.add("active");

  if (viewId === "mail") renderMailView();
  if (viewId === "bag") renderBagView();
  if (viewId === "home") renderHome();
  if (viewId === "squad") renderSquadView();
  if (viewId === "char_detail") renderCharDetailView();
  if (viewId === "battle") renderBattleView();
  if (viewId === "gacha") renderGachaView();
  if (viewId === "creator") renderCreatorView();
  if (viewId === "terminal") renderTerminalView();
}

function getCharProfile(charId) {
  const base = window.MF_DATA.CHARACTERS[charId];
  if (!base) return null;
  if (base.isProtagonist) {
    const style = window.MF_DATA.PROTAGONIST_STYLES.find(s => s.id === state.styleId) || window.MF_DATA.PROTAGONIST_STYLES[0];
    const rank = state.charRanks?.protagonist || 0;
    const dynRarity = rank >= 2 ? "SSR" : (rank === 1 ? "SR" : "R");
    return {
      ...base,
      rarity: dynRarity,
      name: state.playerName,
      emoji: style.emoji,
      styleName: style.name,
      element: state.protagonistElement,
      weapon: state.protagonistWeapon
    };
  }
  return base;
}

function detectActiveReactions() {
  const els = state.party.map(id => getCharProfile(id).element);
  const found = [];
  window.MF_DATA.ELEMENT_REACTIONS.forEach(r => {
    if (r.pair[1] === "any") {
      if (els.includes(r.pair[0]) && els.some(e => e !== r.pair[0])) found.push(r.name);
    } else if (els.includes(r.pair[0]) && els.includes(r.pair[1])) {
      found.push(r.name);
    }
  });
  return [...new Set(found)];
}

function renderTopBar() {
  document.getElementById("tb-name").textContent = state.playerName;
  document.getElementById("tb-rank").textContent = `開拓Lv.${state.playerRank}`;
  document.getElementById("tb-en").textContent = `${state.en}/${MAX_EN}`;
  document.getElementById("tb-reserve").textContent = `予備 +${state.reserveEn}`;
  document.getElementById("tb-credits").textContent = state.credits.toLocaleString();
  document.getElementById("tb-gems").textContent = state.gems.toLocaleString();
  document.getElementById("btn-theme").textContent = state.uiTheme === "camp" ? "🏕️ 拠点UI" : "⚡ 端末UI";
  document.getElementById("btn-sound").textContent = state.soundOn ? "🔊" : "🔇";
}

function renderHome() {
  renderTopBar();
  if (!state.ownedChars.includes(showcaseCharId)) showcaseCharId = "protagonist";
  const ch = getCharProfile(showcaseCharId);
  const elInfo = window.MF_DATA.ELEMENTS[ch.element];
  const wpInfo = window.MF_DATA.WEAPONS[ch.weapon];
  const lv = state.charLevels[ch.id] || 1;
  const dupe = state.charDupes[ch.id] || 0;

  document.getElementById("home-portrait").innerHTML = `
    <img src="${ch.image}" alt="${escapeHtml(ch.name)}"
         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
    <div class="portrait-fallback" style="display:none;">
      <span style="font-size:46px;">${ch.emoji}</span>
      <span style="font-size:11px; font-weight:900;">${escapeHtml(ch.name)}</span>
    </div>
  `;

  document.getElementById("home-char-name").textContent = `${ch.name}（Lv.${lv} / 凸${dupe}）`;
  const lines = ch.voiceLines;
  document.getElementById("home-speech").textContent = lines[Math.floor(Math.random() * lines.length)];
  document.getElementById("home-tags").innerHTML = `
    <span class="tag">${ch.rarity}</span>
    <span class="tag">${elInfo.icon}${elInfo.name}</span>
    <span class="tag">${wpInfo.icon}${wpInfo.name}</span>
    <span class="tag">🐾${ch.kemonomimi}</span>
  `;

  document.getElementById("home-party-strip").innerHTML = state.party.map(id => {
    const m = getCharProfile(id);
    const mEl = window.MF_DATA.ELEMENTS[m.element];
    return `
      <div class="party-slot" onclick="cycleShowcase('${id}')">
        <span class="slot-icon">${m.emoji}</span>
        <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(m.name)}</div>
        <div style="font-size:10px; color:var(--muted);">${mEl.icon} Lv.${state.charLevels[id] || 1}</div>
      </div>
    `;
  }).join("");

  const reactions = detectActiveReactions();
  document.getElementById("home-reactions").textContent =
    reactions.length > 0
      ? `✨ 発動可能な元素反応：${reactions.join(" / ")}`
      : "✨ 主人公の属性を切り替えると元素反応が発生します！";
}

function cycleShowcase(forceId) {
  playSfx("tap");
  if (forceId) {
    showcaseCharId = forceId;
  } else {
    const ids = state.ownedChars;
    showcaseCharId = ids[(ids.indexOf(showcaseCharId) + 1) % ids.length];
  }
  renderHome();
}

function renderSquadView() {
  renderTopBar();
  renderPartyEditor();

  const totalPower = state.party.reduce((sum, id) => sum + calcCharPower(id), 0);
  document.getElementById("sq-materials-bar").innerHTML = `
    ⚔️ 小隊総戦力：<strong>${totalPower}</strong> ｜ 📘 記録：<strong>${state.expBooks || 0}</strong> ｜ 💠 コア：<strong>${state.cores || 0}</strong>
  `;

  const sortedOwned = getSortedOwnedIds();
  document.getElementById("sq-roster-list").innerHTML = sortedOwned.map(id => {
    const ch = getCharProfile(id);
    const el = window.MF_DATA.ELEMENTS[ch.element];
    const wp = window.MF_DATA.WEAPONS[ch.weapon];
    const lv = state.charLevels[id] || 1;
    const cap = getRankCap(state.charRanks[id] || 0);
    const dupe = state.charDupes[id] || 0;
    const inParty = state.party.includes(id);

    return `
      <div class="roster-tile" onclick="openCharDetail('${id}')">
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px;">
          <span class="rank-pill">${ch.rarity}</span>
          <span>${inParty ? "🛡️編成中" : `凸+${dupe}`}</span>
        </div>
        <div style="font-size:32px; margin:4px 0;">${ch.emoji}</div>
        <div style="font-size:12px; font-weight:900; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
          ${escapeHtml(ch.name)}
        </div>
        <div style="font-size:10px; color:var(--muted); margin-top:2px;">
          ${el.icon}${el.name}・${wp.name}
        </div>
        <div style="font-size:11px; font-weight:900; margin-top:3px; color:var(--accent);">
          Lv.${lv}/${cap} ▶
        </div>
      </div>
    `;
  }).join("");
}


  document.getElementById("sq-weapon-grid").innerHTML = Object.values(window.MF_DATA.WEAPONS).map(wp => `
    <button class="select-chip ${state.protagonistWeapon === wp.id ? "selected" : ""}"
            onclick="setProtagonistWeapon('${wp.id}')">
      ${wp.icon} <strong>${wp.name}</strong>
    </button>
  `).join("");

  const totalPower = state.party.reduce((sum, id) => sum + calcCharPower(id), 0);
  document.getElementById("sq-materials-bar").innerHTML = `
    📘 作戦記録：<strong>${state.expBooks || 0}冊</strong> ｜ 💠 元素コア：<strong>${state.cores || 0}個</strong> ｜ ⚔️ 小隊総戦力：<strong>${totalPower}</strong>
  `;

  const rarityOrder = { SSR: 0, SR: 1, R: 2, N: 3 };
  const sortedOwned = [...state.ownedChars].sort((a, b) => {
    const ca = getCharProfile(a), cb = getCharProfile(b);
    return (rarityOrder[ca.rarity] ?? 9) - (rarityOrder[cb.rarity] ?? 9);
  });

  document.getElementById("sq-roster-list").innerHTML = sortedOwned.map(id => {
    const ch = getCharProfile(id);
    const el = window.MF_DATA.ELEMENTS[ch.element];
    const wp = window.MF_DATA.WEAPONS[ch.weapon];
    const lv = state.charLevels[id] || 1;
    const rank = state.charRanks[id] || 0;
    const dupe = state.charDupes[id] || 0;
    const cap = getRankCap(rank);
    const power = calcCharPower(id);
    const nextCost = getLevelUpCost(lv);
    const ascReq = getAscensionCost(rank);

    let actionBtn = "";
    if (lv >= cap && ascReq) {
      actionBtn = `
        <button class="btn-xs btn-accent2" onclick="attemptAscensionTrial('${id}')">
          🏆 昇格試練（コア${ascReq.cores}・🪙${ascReq.credits.toLocaleString()} / 推奨戦力${ascReq.reqPower}）
        </button>
      `;
    } else if (lv < 100) {
      actionBtn = `
        <button class="btn-xs btn-primary" onclick="levelUpCharacter('${id}', 1)">
          +1 Lv（記録${nextCost.books} / 🪙${nextCost.credits.toLocaleString()}）
        </button>
        <button class="btn-xs" onclick="levelUpCharacter('${id}', 5)">+5 Lv</button>
      `;
    } else {
      actionBtn = `<span class="tag" style="background:#ffd13b;">👑 MAX Lv.100</span>`;
    }

    return `
      <div class="card" style="padding:10px; margin-bottom:8px;">
        <div class="top-row">
          <strong>${ch.emoji} ${escapeHtml(ch.name)} <span class="rank-pill">${ch.rarity}</span> <span class="tag">凸+${dupe}</span></strong>
          <span style="font-size:12px; font-weight:900;">Lv.${lv}/${cap}（戦力${power}）</span>
        </div>
        <div style="font-size:11px; margin-top:4px;">
          ${el.icon}${el.name} ｜ ${wp.icon}${wp.name} ｜ 🐾${ch.kemonomimi}
        </div>
        <div style="font-size:10px; color:var(--muted); margin:3px 0 6px;">🏭 ${ch.campSkill}</div>
        <div style="display:flex; gap:6px; flex-wrap:wrap;">${actionBtn}</div>
      </div>
    `;
  }).join("");
}

function setProtagonistElement(elId) {
  state.protagonistElement = elId;
  saveGame();
  playSfx("switch");
  renderSquadView();
  renderCharDetailView();
  showToast(`共鳴属性を「${window.MF_DATA.ELEMENTS[elId].name}」に変更！`);
}

function setProtagonistWeapon(wpId) {
  state.protagonistWeapon = wpId;
  saveGame();
  playSfx("switch");
  renderSquadView();
  renderCharDetailView();
  showToast(`装備武器を「${window.MF_DATA.WEAPONS[wpId].name}」に変更！`);
}

let tempStyleId = "m_cool", tempWeaponId = "sword", tempElementId = "arc";

function renderCreatorView() {
  tempStyleId = state.styleId;
  tempWeaponId = state.protagonistWeapon;
  tempElementId = state.protagonistElement;
  document.getElementById("cr-name-input").value = state.playerName;
  refreshCreatorSelections();
}

function refreshCreatorSelections() {
  document.getElementById("cr-style-grid").innerHTML = window.MF_DATA.PROTAGONIST_STYLES.map(s => `
    <button class="select-chip ${tempStyleId === s.id ? "selected" : ""}"
            onclick="tempStyleId='${s.id}'; playSfx('tap'); refreshCreatorSelections();">
      <span style="font-size:18px;">${s.emoji}</span> <strong>${s.name}</strong><br>
      <span style="font-size:10px;">${s.tag}</span>
    </button>
  `).join("");

  document.getElementById("cr-element-grid").innerHTML = Object.values(window.MF_DATA.ELEMENTS).map(el => `
    <button class="select-chip ${tempElementId === el.id ? "selected" : ""}"
            onclick="tempElementId='${el.id}'; playSfx('tap'); refreshCreatorSelections();">
      ${el.icon} <strong>${el.name}</strong>
    </button>
  `).join("");

  document.getElementById("cr-weapon-grid").innerHTML = Object.values(window.MF_DATA.WEAPONS).map(wp => `
    <button class="select-chip ${tempWeaponId === wp.id ? "selected" : ""}"
            onclick="tempWeaponId='${wp.id}'; playSfx('tap'); refreshCreatorSelections();">
      ${wp.icon} <strong>${wp.name}</strong>
    </button>
  `).join("");
}

function confirmProtagonist() {
  const rawName = document.getElementById("cr-name-input").value.trim();
  if (!rawName) { showToast("隊長の名前を入力してください！"); return; }
  state.initialized = true;
  state.playerName = rawName.slice(0, 12);
  state.styleId = tempStyleId;
  state.protagonistWeapon = tempWeaponId;
  state.protagonistElement = tempElementId;
  saveGame();
  playSfx("gift");
  showToast(`ようこそ、${state.playerName}隊長！`);
  switchView("home");
}

const BUILTIN_HISTORY = [
  {
    version: "1.2.0",
    date: "2026-11-26",
    title: "Step 3：リアルタイム元素連携バトル＆部位破壊",
    detail: "4人クイック交代、6元素反応、体勢ブレイク連携コンボ、主霧獣の部位破壊ドロップ、アプリ内更新履歴を追加。"
  },
  {
    version: "1.1.0",
    date: "2026-11-26",
    title: "Step 2：軌道スカウト（ガチャ）＆重厚育成システム",
    detail: "限定ピックアップ＆恒常ガチャ（昇格演出・80連天井）、全28キャラ、Lv.1〜100育成＆昇格試練、パーティ編成を実装。"
  },
  {
    version: "1.0.0",
    date: "2026-11-26",
    title: "Step 1：基盤・主人公クリエイト・ハイブリッドUI",
    detail: "隊長登録、武器8種・属性6種の自由切替、拠点クリーンUI＆作戦端末UI切替、セーブ＆アップデート検知を実装。"
  }
];

function renderHistoryList(items) {
  const listEl = document.getElementById("term-history-list");
  if (!listEl) return;
  listEl.innerHTML = (items || BUILTIN_HISTORY).map(h => `
    <div class="history-item">
      <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:900;">
        <span>Ver ${escapeHtml(h.version)}：${escapeHtml(h.title)}</span>
        <span style="color:var(--muted);">${escapeHtml(h.date || "")}</span>
      </div>
      <div style="font-size:11px; color:var(--muted); margin-top:3px; line-height:1.4;">
        ${escapeHtml(h.detail)}
      </div>
    </div>
  `).join("");
}

function renderTerminalView() {
  document.getElementById("term-version").textContent = `現在のバージョン：Ver ${window.MF_DATA.APP_VERSION}`;
  renderHistoryList(BUILTIN_HISTORY);
  fetch(`./version.json?t=${Date.now()}`, { cache: "no-store" })
    .then(r => r.ok ? r.json() : null)
    .then(info => { if (info?.history) renderHistoryList(info.history); })
    .catch(() => {});
}

async function checkAppUpdate() {
  const statusEl = document.getElementById("term-update-status");
  statusEl.textContent = "最新バージョンを確認中...";
  try {
    const res = await fetch(`./version.json?t=${Date.now()}`, { cache: "no-store" });
    const info = await res.json();
    if (info?.history) renderHistoryList(info.history);
    if (info.version !== window.MF_DATA.APP_VERSION) {
      statusEl.innerHTML = `🆕 <strong>Ver ${escapeHtml(info.version)}</strong> が配信中！<br>${escapeHtml(info.notes || "")}`;
      if (confirm(`最新バージョン（Ver ${info.version}）へ更新しますか？※セーブデータは保持されます`)) {
        location.reload(true);
      }
    } else {
      statusEl.textContent = `✅ 最新バージョン（Ver ${info.version}）です。`;
    }
  } catch (e) {
    statusEl.textContent = "オフラインまたは確認中です。";
  }
}


function redeemSerialCode() {
  const input = document.getElementById("term-code-input");
  const code = input.value.trim().toUpperCase();
  if (!code) return;
  if (state.redeemedCodes.includes(code)) { showToast("このコードは既に使用済みです"); return; }
  const reward = window.MF_DATA.SERIAL_CODES[code];
  if (!reward) { showToast("無効なシリアルコードです"); return; }

  state.redeemedCodes.push(code);
  state.gems += reward.gems;
  state.credits += reward.credits;
  state.en += reward.en;
  state.expBooks = (state.expBooks || 0) + (reward.books || 0);
  state.cores = (state.cores || 0) + (reward.cores || 0);
  saveGame();
  playSfx("gift");
  renderTopBar();
  input.value = "";
  showToast(`🎁 ${reward.label}受取！（結晶石+${reward.gems} / 記録+${reward.books}）`);
}



function resetAllSaveData() {
  if (confirm("本当にすべてのセーブデータを初期化しますか？")) {
    localStorage.removeItem(SAVE_KEY);
    state = createDefaultSave();
    saveGame();
    switchView("creator");
    showToast("データを初期化しました");
  }
}

function notifyUpcoming(featureName, stepLabel) {
  playSfx("tap");
  showToast(`🚧「${featureName}」は ${stepLabel} で実装予定です！`);
}

function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove("show"), 2600);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  }[c]));
}

window.addEventListener("DOMContentLoaded", () => {
  state = loadSave();
  updateStamina();
  applyTheme();
  setInterval(() => { updateStamina(); renderTopBar(); }, 15000);
  syncAdminMail();
  switchView(state.initialized ? "home" : "creator");
});
