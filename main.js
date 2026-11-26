const SAVE_KEY = "miasma_frontier_save_v1";
const MAX_EN = 160;
const MAX_RESERVE_EN = 1000;
const EN_REGEN_MS = 6 * 60 * 1000; // 6分で1回復

let state = null;
let audioCtx = null;
let bgmTimer = null;
let showcaseCharId = "protagonist";

function createDefaultSave() {
  return {
    initialized: false,
    playerName: "ユウ",
    styleId: "m_cool",
    protagonistWeapon: "sword",
    protagonistElement: "arc",
    playerRank: 1,
    playerExp: 0,
    gems: 1600,
    credits: 5000,
    en: 160,
    reserveEn: 0,
    lastEnTimestamp: Date.now(),
    uiTheme: "camp", // "camp" | "tactical"
    soundOn: true,
    party: ["protagonist", "momo", "mint", "aoi"],
    charLevels: {
      protagonist: 1,
      momo: 1,
      mint: 1,
      aoi: 1
    },
    redeemedCodes: []
  };
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return createDefaultSave();
    return { ...createDefaultSave(), ...JSON.parse(raw) };
  } catch (e) {
    return createDefaultSave();
  }
}

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

// ---------- スタミナ（EN）＋ 予備タンク自動計算 ----------
function updateStamina() {
  const now = Date.now();
  const elapsed = now - (state.lastEnTimestamp || now);
  if (elapsed < EN_REGEN_MS) return;

  const ticks = Math.floor(elapsed / EN_REGEN_MS);
  state.lastEnTimestamp += ticks * EN_REGEN_MS;

  for (let i = 0; i < ticks; i++) {
    if (state.en < MAX_EN) {
      state.en += 1;
    } else if (state.reserveEn < MAX_RESERVE_EN) {
      // 溢れた分は50%効率（2tickで1EN）で予備タンクへ貯蓄
      if (i % 2 === 0) state.reserveEn = Math.min(MAX_RESERVE_EN, state.reserveEn + 1);
    }
  }
  saveGame();
}

// ---------- サウンド基盤（Web Audio API） ----------
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

// ---------- UIテーマ切替（ハイブリッド式） ----------
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

// ---------- ビュー遷移 ----------
function switchView(viewId) {
  playSfx("tap");
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.getElementById(`view-${viewId}`).classList.add("active");

  if (viewId === "home") renderHome();
  if (viewId === "squad") renderSquadView();
  if (viewId === "creator") renderCreatorView();
  if (viewId === "terminal") renderTerminalView();
}

// ---------- キャラデータ取得ヘルパー ----------
function getCharProfile(charId) {
  const base = window.MF_DATA.CHARACTERS[charId];
  if (!base) return null;
  if (base.isProtagonist) {
    const style = window.MF_DATA.PROTAGONIST_STYLES.find(s => s.id === state.styleId) || window.MF_DATA.PROTAGONIST_STYLES[0];
    return {
      ...base,
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

// ---------- 描画関数群 ----------
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
  const ch = getCharProfile(showcaseCharId);
  const elInfo = window.MF_DATA.ELEMENTS[ch.element];
  const wpInfo = window.MF_DATA.WEAPONS[ch.weapon];
  const lv = state.charLevels[ch.id] || 1;

  const portraitBox = document.getElementById("home-portrait");
  portraitBox.innerHTML = `
    <img src="${ch.image}" alt="${escapeHtml(ch.name)}"
         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
    <div class="portrait-fallback" style="display:none;">
      <span style="font-size:46px;">${ch.emoji}</span>
      <span style="font-size:11px; font-weight:900;">${escapeHtml(ch.name)}</span>
    </div>
  `;

  document.getElementById("home-char-name").textContent = `${ch.name}（Lv.${lv}）`;
  const lines = ch.voiceLines;
  document.getElementById("home-speech").textContent = lines[Math.floor(Math.random() * lines.length)];
  document.getElementById("home-tags").innerHTML = `
    <span class="tag">${ch.rarity}ランク</span>
    <span class="tag">${elInfo.icon} ${elInfo.name}属性</span>
    <span class="tag">${wpInfo.icon} ${wpInfo.name}</span>
    <span class="tag">🐾 ${ch.kemonomimi}</span>
  `;

  // 4人パーティ表示
  const partyBox = document.getElementById("home-party-strip");
  partyBox.innerHTML = state.party.map(id => {
    const m = getCharProfile(id);
    const mEl = window.MF_DATA.ELEMENTS[m.element];
    return `
      <div class="party-slot" onclick="cycleShowcase('${id}')">
        <span class="slot-icon">${m.emoji}</span>
        <div>${escapeHtml(m.name)}</div>
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
    const ids = state.party;
    const nextIdx = (ids.indexOf(showcaseCharId) + 1) % ids.length;
    showcaseCharId = ids[nextIdx];
  }
  renderHome();
}

// ---------- 隊員・装備＆主人公自由切替画面 ----------
function renderSquadView() {
  const p = getCharProfile("protagonist");
  document.getElementById("sq-protag-summary").textContent =
    `${p.name}（${p.styleName}） / 現在：${window.MF_DATA.ELEMENTS[p.element].icon}${window.MF_DATA.ELEMENTS[p.element].name}・${window.MF_DATA.WEAPONS[p.weapon].icon}${window.MF_DATA.WEAPONS[p.weapon].name}`;

  // 属性切替チップ
  const elGrid = document.getElementById("sq-element-grid");
  elGrid.innerHTML = Object.values(window.MF_DATA.ELEMENTS).map(el => `
    <button class="select-chip ${state.protagonistElement === el.id ? "selected" : ""}"
            onclick="setProtagonistElement('${el.id}')">
      ${el.icon} <strong>${el.name}</strong><br>
      <span style="font-size:10px; opacity:0.85;">${el.desc}</span>
    </button>
  `).join("");

  // 武器種切替チップ
  const wpGrid = document.getElementById("sq-weapon-grid");
  wpGrid.innerHTML = Object.values(window.MF_DATA.WEAPONS).map(wp => `
    <button class="select-chip ${state.protagonistWeapon === wp.id ? "selected" : ""}"
            onclick="setProtagonistWeapon('${wp.id}')">
      ${wp.icon} <strong>${wp.name}</strong><br>
      <span style="font-size:10px; opacity:0.85;">${wp.role}</span>
    </button>
  `).join("");

  // 第7小隊メンバー一覧
  const rosterBox = document.getElementById("sq-roster-list");
  rosterBox.innerHTML = Object.keys(window.MF_DATA.CHARACTERS).map(id => {
    const ch = getCharProfile(id);
    const el = window.MF_DATA.ELEMENTS[ch.element];
    const wp = window.MF_DATA.WEAPONS[ch.weapon];
    return `
      <div class="card" style="padding:10px; margin-bottom:8px;">
        <div class="top-row">
          <strong>${ch.emoji} ${escapeHtml(ch.name)} <span class="rank-pill">${ch.rarity}</span></strong>
          <span style="font-size:12px; font-weight:900;">Lv.${state.charLevels[id] || 1} / 20</span>
        </div>
        <div style="font-size:11px; margin-top:4px;">
          ${el.icon} ${el.name}属性 ｜ ${wp.icon} ${wp.name} ｜ 🐾 ${ch.kemonomimi}
        </div>
        <div style="font-size:11px; color:var(--muted); margin-top:3px;">
          🏭 拠点特技：${ch.campSkill}
        </div>
      </div>
    `;
  }).join("");
}

function setProtagonistElement(elId) {
  state.protagonistElement = elId;
  saveGame();
  playSfx("switch");
  renderSquadView();
  showToast(`共鳴属性を「${window.MF_DATA.ELEMENTS[elId].name}」に変更しました！`);
}

function setProtagonistWeapon(wpId) {
  state.protagonistWeapon = wpId;
  saveGame();
  playSfx("switch");
  renderSquadView();
  showToast(`装備武器を「${window.MF_DATA.WEAPONS[wpId].name}」に変更しました！`);
}

// ---------- 主人公クリエイト画面 ----------
let tempStyleId = "m_cool";
let tempWeaponId = "sword";
let tempElementId = "arc";

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
  if (!rawName) {
    showToast("隊長の名前を入力してください！");
    return;
  }
  state.initialized = true;
  state.playerName = rawName.slice(0, 12);
  state.styleId = tempStyleId;
  state.protagonistWeapon = tempWeaponId;
  state.protagonistElement = tempElementId;
  saveGame();
  playSfx("gift");
  showToast(`ようこそ、${state.playerName}隊長！第7小隊を編成しました`);
  switchView("home");
}

// ---------- ハンター端末（コード入力・アプデ確認・初期化） ----------
function renderTerminalView() {
  document.getElementById("term-version").textContent = `現在のバージョン：Ver ${window.MF_DATA.APP_VERSION}`;
}

function redeemSerialCode() {
  const input = document.getElementById("term-code-input");
  const code = input.value.trim().toUpperCase();
  if (!code) return;

  if (state.redeemedCodes.includes(code)) {
    showToast("このシリアルコードは既に使用済みです");
    return;
  }
  const reward = window.MF_DATA.SERIAL_CODES[code];
  if (!reward) {
    showToast("無効なシリアルコードです");
    return;
  }
  state.redeemedCodes.push(code);
  state.gems += reward.gems;
  state.credits += reward.credits;
  state.en += reward.en;
  saveGame();
  playSfx("gift");
  renderTopBar();
  input.value = "";
  showToast(`🎁 ${reward.label}受取！（結晶石+${reward.gems} / EN+${reward.en}）`);
}

async function checkAppUpdate() {
  const statusEl = document.getElementById("term-update-status");
  statusEl.textContent = "最新バージョンを確認中...";
  try {
    const res = await fetch(`./version.json?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error("確認できませんでした");
    const info = await res.json();
    if (info.version !== window.MF_DATA.APP_VERSION) {
      statusEl.innerHTML = `🆕 <strong>Ver ${escapeHtml(info.version)}</strong> が配信されています！<br>${escapeHtml(info.notes || "")}`;
      if (confirm(`最新バージョン（Ver ${info.version}）が公開されています。セーブデータを保持したまま更新しますか？`)) {
        location.reload(true);
      }
    } else {
      statusEl.textContent = `✅ 最新バージョン（Ver ${info.version}）です。`;
    }
  } catch (e) {
    statusEl.textContent = "オフラインまたはローカル確認中です。";
  }
}

function resetAllSaveData() {
  if (confirm("本当にすべてのセーブデータを初期化して最初からやり直しますか？")) {
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

// ---------- 起動処理 ----------
window.addEventListener("DOMContentLoaded", () => {
  state = loadSave();
  updateStamina();
  applyTheme();
  setInterval(() => {
    updateStamina();
    renderTopBar();
  }, 15000);

  if (!state.initialized) {
    switchView("creator");
  } else {
    switchView("home");
  }
});
