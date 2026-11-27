const SAVE_KEY = "miasma_frontier_save_v1";
const MAX_EN = 160;
const MAX_RESERVE_EN = 1000;
const EN_REGEN_MS = 6 * 60 * 1000;

// ストーリー進行による機能解放ルール（RPGらしい段階解放）
const FEATURE_UNLOCK_RULES = {
  camp:    { reqStory: "ch1_ep3", label: "第1章・第3話『前線キャンプと焚き火の夜』クリア" },
  craft:   { reqStory: "ch1_ep3", label: "第1章・第3話『前線キャンプと焚き火の夜』クリア" },
  friends: { reqStory: "ch1_ep2", label: "第1章・第2話『新緑の廃墟と最初の霧獣』クリア" },
  arena:   { reqStory: "ch1_ep8", label: "第1章完結（第8話『モス・ベヒーモス』討伐）" }
};

let state = null;
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
    gems: 3200,
    credits: 8000,
    cardTickets: 10,
    expBooks: 30,
    cores: 6,
    activityPt: 0,
    en: 160,
    reserveEn: 0,
    lastEnTimestamp: Date.now(),
    uiTheme: "camp",
    soundOn: true,
    debugUnlockAll: false,
    pityCount: 0,
    pityGuaranteed: false,
    ownedChars: ["protagonist", "momo", "mint", "aoi"],
    party: ["protagonist", "momo", "mint", "aoi"],
    ownedCards: {
      counter_stance: 1, aegis_wall: 1, shield_breaker: 1, shock_trap: 1,
      element_boost: 1, tactical_draw: 1, weak_scan: 1, repair_kit: 1,
      hydro_splash: 1, camp_ration: 1, ember_jab: 1, spark_jab: 1,
      frost_shard: 1, arc_bolt: 1
    },
    claimedDexMilestones: [],
    tacticDeck: [
      "counter_stance", "aegis_wall", "shield_breaker", "shock_trap",
      "element_boost", "tactical_draw", "repair_kit", "hydro_splash"
    ],
    charLevels: { protagonist: 1, momo: 1, mint: 1, aoi: 1 },
    charRanks: { protagonist: 0, momo: 0, mint: 0, aoi: 0 },
    charDupes: { protagonist: 0, momo: 0, mint: 0, aoi: 0 },
    skillTrees: {},
    clearedStories: [],
    bondPoints: {},
    huntLog: {},
    missions: {},
    friends: [],
    materials: {},
    regionProgress: { verde: { exp: 15, mistLevel: 60, beacons: 1 } },
    mailbox: [],
    claimedMailIds: [],
    redeemedCodes: []
  };
}

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return createDefaultSave();
    const parsed = JSON.parse(raw);
    const base = createDefaultSave();
    const validDeck = Array.isArray(parsed.tacticDeck) && parsed.tacticDeck.length >= 8 && parsed.tacticDeck.length <= 28;
    return {
      ...base,
      ...parsed,
      cardTickets: typeof parsed.cardTickets === "number" ? parsed.cardTickets : base.cardTickets,
      ownedChars: parsed.ownedChars || base.ownedChars,
      party: parsed.party || base.party,
      ownedCards: { ...base.ownedCards, ...(parsed.ownedCards || {}) },
      claimedDexMilestones: parsed.claimedDexMilestones || [],
      tacticDeck: validDeck ? parsed.tacticDeck : base.tacticDeck,
      charLevels: { ...base.charLevels, ...(parsed.charLevels || {}) },
      charRanks: { ...base.charRanks, ...(parsed.charRanks || {}) },
      charDupes: { ...base.charDupes, ...(parsed.charDupes || {}) },
      skillTrees: parsed.skillTrees || {},
      clearedStories: parsed.clearedStories || [],
      bondPoints: parsed.bondPoints || {},
      huntLog: parsed.huntLog || {},
      missions: parsed.missions || {},
      friends: parsed.friends || [],
      materials: parsed.materials || {},
      regionProgress: { ...base.regionProgress, ...(parsed.regionProgress || {}) }
    };
  } catch (e) { return createDefaultSave(); }
}

function saveGame() { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }

function isFeatureUnlocked(featureId) {
  if (state?.debugUnlockAll) return true;
  const rule = FEATURE_UNLOCK_RULES[featureId];
  if (!rule) return true;
  return (state?.clearedStories || []).includes(rule.reqStory);
}

function toggleDebugUnlockAll() {
  state.debugUnlockAll = !state.debugUnlockAll;
  saveGame();
  playSfx("switch");
  renderTerminalView();
  showToast(state.debugUnlockAll ? "🔓 テスト用：すべての機能ロックを解除しました" : "🔒 ストーリー進行による機能解放モードに戻しました");
}

function updateStamina() {
  const now = Date.now();
  const elapsed = now - (state.lastEnTimestamp || now);
  if (elapsed < EN_REGEN_MS) return;
  const ticks = Math.floor(elapsed / EN_REGEN_MS);
  state.lastEnTimestamp += ticks * EN_REGEN_MS;
  for (let i = 0; i < ticks; i++) {
    if (state.en < MAX_EN) state.en += 1;
    else if (state.reserveEn < MAX_RESERVE_EN && i % 2 === 0) state.reserveEn += 1;
  }
  saveGame();
}

function playSfx(type) { if (window.MF_AUDIO) window.MF_AUDIO.playSfx(type); }

function toggleSound() {
  state.soundOn = !state.soundOn; saveGame();
  if (window.MF_AUDIO) window.MF_AUDIO.setEnabled(state.soundOn);
  if (state.soundOn) playSfx("switch");
  renderTopBar();
  showToast(state.soundOn ? "🔊 BGM・効果音 ON" : "🔇 BGM・効果音 OFF");
}

function applyTheme() { document.body.classList.toggle("theme-tactical", state.uiTheme === "tactical"); }

function toggleUiTheme() {
  state.uiTheme = state.uiTheme === "camp" ? "tactical" : "camp";
  saveGame(); applyTheme(); playSfx("switch"); renderTopBar();
  showToast(state.uiTheme === "camp" ? "🏕️ 拠点クリーンUIに切替" : "⚡ 作戦端末UIに切替");
}

function openTabletMenu() {
  playSfx("switch");
  if (typeof syncMissions === "function") syncMissions();
  if (typeof updateMailBadges === "function") updateMailBadges();
  if (typeof updateBestiaryBadge === "function") updateBestiaryBadge();
  updateTabletLocks();
  updateTabletBadge();
  document.getElementById("modal-tablet").classList.add("active");
}
function closeTabletMenu() { document.getElementById("modal-tablet").classList.remove("active"); }

function updateTabletLocks() {
  ["camp", "craft", "arena", "friends"].forEach(fid => {
    const el = document.getElementById(`tb-lock-${fid}`);
    if (el) el.style.display = isFeatureUnlocked(fid) ? "none" : "inline-block";
  });
}

function tabletGo(viewId) {
  if (!isFeatureUnlocked(viewId)) {
    const rule = FEATURE_UNLOCK_RULES[viewId];
    playSfx("tap");
    showToast(`🔒 ${rule?.label || "ストーリー進行"} で解放されます！`);
    return;
  }
  closeTabletMenu();
  if (viewId === "arena" || viewId === "friends") {
    showToast(`🚧『${viewId === "arena" ? "対人アリーナ" : "フレンド機能"}』は次回の Ver 2.8 で本実装します！`);
    return;
  }
  switchView(viewId);
}

function updateTabletBadge() {
  const mCnt = typeof getUnclaimedMailCount === "function" ? getUnclaimedMailCount() : 0;
  const bCnt = typeof getUnclaimedBestiaryCount === "function" ? getUnclaimedBestiaryCount() : 0;
  const dCnt = typeof getUnclaimedDexCount === "function" ? getUnclaimedDexCount() : 0;
  const msCnt = typeof getUnclaimedMissionCount === "function" ? getUnclaimedMissionCount() : 0;

  const dexBadge = document.getElementById("home-dex-badge");
  if (dexBadge) { dexBadge.style.display = dCnt > 0 ? "inline-block" : "none"; dexBadge.textContent = `${dCnt}件`; }
  const badge = document.getElementById("home-tablet-badge");
  if (badge) {
    const total = mCnt + bCnt + dCnt + msCnt;
    badge.style.display = total > 0 ? "inline-block" : "none";
    badge.textContent = total > 9 ? "9+" : String(total);
  }
}

function switchView(viewId) {
  if (!isFeatureUnlocked(viewId)) {
    const rule = FEATURE_UNLOCK_RULES[viewId];
    playSfx("tap");
    showToast(`🔒 ${rule?.label || "ストーリー進行"} で解放されます！`);
    return;
  }
  playSfx("tap");
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  const target = document.getElementById(`view-${viewId}`);
  if (target) target.classList.add("active");

  if (window.MF_AUDIO) {
    if (viewId === "story") window.MF_AUDIO.playBgm("story");
    else if (viewId !== "battle") window.MF_AUDIO.playBgm("home");
  }

  if (viewId === "home") renderHome();
  if (viewId === "story" && typeof renderStoryView === "function") renderStoryView();
  if (viewId === "battle" && typeof renderBattleView === "function") renderBattleView();
  if (viewId === "missions" && typeof renderMissionView === "function") renderMissionView();
  if (viewId === "bestiary" && typeof renderBestiaryView === "function") renderBestiaryView();
  if (viewId === "wiki" && typeof renderWikiView === "function") renderWikiView();
  if (viewId === "deck" && typeof renderDeckView === "function") renderDeckView();
  if (viewId === "card_dex" && typeof renderCardDexView === "function") renderCardDexView();
  if (viewId === "squad" && typeof renderSquadView === "function") renderSquadView();
  if (viewId === "char_detail" && typeof renderCharDetailView === "function") renderCharDetailView();
  if (viewId === "gacha" && typeof renderGachaView === "function") renderGachaView();
  if (viewId === "mail" && typeof renderMailView === "function") renderMailView();
  if (viewId === "bag" && typeof renderBagView === "function") renderBagView();
  if (viewId === "camp" && typeof renderCampView === "function") renderCampView();
  if (viewId === "craft" && typeof renderCraftView === "function") renderCraftView();
  if (viewId === "creator") renderCreatorView();
  if (viewId === "terminal") renderTerminalView();
}

function getCharProfile(charId) {
  const base = window.MF_DATA.CHARACTERS[charId] || window.MF_DATA.CHARACTERS.protagonist;
  if (base.isProtagonist) {
    const style = window.MF_DATA.PROTAGONIST_STYLES.find(s => s.id === state.styleId) || window.MF_DATA.PROTAGONIST_STYLES[0];
    const rank = state.charRanks?.protagonist || 0;
    const dynRarity = rank >= 2 ? "SSR" : (rank === 1 ? "SR" : "R");
    return {
      ...base, rarity: dynRarity, name: state.playerName, emoji: style.emoji,
      styleId: state.styleId, styleName: style.name,
      element: state.protagonistElement, weapon: state.protagonistWeapon
    };
  }
  return base;
}

function detectActiveReactions() {
  const els = state.party.map(id => getCharProfile(id).element);
  const found = [];
  window.MF_DATA.ELEMENT_REACTIONS.forEach(r => {
    if (r.pair[1] === "any") { if (els.includes(r.pair[0]) && els.some(e => e !== r.pair[0])) found.push(r.name); }
    else if (els.includes(r.pair[0]) && els.includes(r.pair[1])) found.push(r.name);
  });
  return [...new Set(found)];
}

function renderTopBar() {
  document.getElementById("tb-name").textContent = state.playerName;
  document.getElementById("tb-rank").textContent = `開拓Lv.${state.playerRank}`;
  document.getElementById("tb-en").textContent = `${state.en}/${MAX_EN}`;
  document.getElementById("tb-reserve").textContent = `予備+${state.reserveEn}`;
  document.getElementById("tb-credits").textContent = state.credits.toLocaleString();
  document.getElementById("tb-gems").textContent = state.gems.toLocaleString();
  const tkEl = document.getElementById("tb-tickets");
  if (tkEl) tkEl.textContent = String(state.cardTickets || 0);
  document.getElementById("btn-theme").textContent = state.uiTheme === "camp" ? "🏕️ 拠点UI" : "⚡ 端末UI";
  document.getElementById("btn-sound").textContent = state.soundOn ? "🔊" : "🔇";
}

function renderHome() {
  renderTopBar();
  if (typeof syncMissions === "function") syncMissions();
  if (typeof updateMailBadges === "function") updateMailBadges();
  if (typeof updateBestiaryBadge === "function") updateBestiaryBadge();
  updateTabletBadge();

  if (!state.ownedChars.includes(showcaseCharId)) showcaseCharId = "protagonist";
  const ch = getCharProfile(showcaseCharId);
  const elInfo = window.MF_DATA.ELEMENTS[ch.element];
  const wpInfo = window.MF_DATA.WEAPONS[ch.weapon];
  const lv = state.charLevels[ch.id] || 1;
  const dupe = state.charDupes[ch.id] || 0;

  const pBox = document.getElementById("home-portrait");
  pBox.innerHTML = window.MF_SPRITES.portraitHTML(ch, "hero");
  pBox.onclick = () => openPortraitZoom(ch.id, true);

  document.getElementById("home-char-name").textContent = `${ch.name}  Lv.${lv}`;
  const lines = ch.voiceLines;
  document.getElementById("home-speech").textContent = `「${lines[Math.floor(Math.random() * lines.length)]}」`;
  document.getElementById("home-tags").innerHTML = `
    <span class="tag">${ch.rarity}</span><span class="tag">${elInfo.icon}${elInfo.name}</span>
    <span class="tag">${wpInfo.icon}${wpInfo.name}</span><span class="tag">凸+${dupe}</span>
  `;

  document.getElementById("home-party-strip").innerHTML = state.party.map(id => {
    const m = getCharProfile(id);
    const mEl = window.MF_DATA.ELEMENTS[m.element];
    const active = id === showcaseCharId ? "border-color:var(--accent); background:rgba(24,184,138,0.16);" : "";
    return `
      <div class="party-slot" style="${active}" onclick="cycleShowcase('${id}')">
        ${window.MF_SPRITES.portraitHTML(m, "icon")}
        <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-size:10px;">${escapeHtml(m.name)}</div>
        <div style="font-size:9px; color:var(--muted);">${mEl.icon} Lv.${state.charLevels[id] || 1}</div>
      </div>
    `;
  }).join("");

  const reactions = detectActiveReactions();
  document.getElementById("home-reactions").textContent =
    reactions.length > 0 ? `✨ 発動可能な元素反応：${reactions.join(" / ")}` : "✨ 属性を組み合わせると元素反応が発生！";
}

function cycleShowcase(forceId) {
  playSfx("tap");
  showcaseCharId = forceId || state.ownedChars[(state.ownedChars.indexOf(showcaseCharId) + 1) % state.ownedChars.length];
  renderHome();
}

function renderSquadView() {
  renderTopBar();
  if (typeof renderPartyEditor === "function") renderPartyEditor();
  const totalPower = state.party.reduce((sum, id) => sum + (typeof calcCharPower === "function" ? calcCharPower(id) : 100), 0);
  document.getElementById("sq-materials-bar").innerHTML = `⚔️ 小隊総戦力：<strong>${totalPower}</strong> ｜ 📘 記録：<strong>${state.expBooks || 0}</strong> ｜ 💠 コア：<strong>${state.cores || 0}</strong>`;
  const ids = typeof getSortedOwnedIds === "function" ? getSortedOwnedIds() : state.ownedChars;
  document.getElementById("sq-roster-list").innerHTML = ids.map(id => {
    const ch = getCharProfile(id);
    const el = window.MF_DATA.ELEMENTS[ch.element];
    const wp = window.MF_DATA.WEAPONS[ch.weapon];
    const lv = state.charLevels[id] || 1;
    const cap = typeof getRankCap === "function" ? getRankCap(state.charRanks[id] || 0) : 20;
    return `
      <div class="roster-tile" onclick="openCharDetail('${id}')">
        <div style="display:flex; justify-content:space-between; font-size:10px;"><span class="rank-pill">${ch.rarity}</span><span>${state.party.includes(id) ? "🛡️編成中" : `凸+${state.charDupes[id] || 0}`}</span></div>
        ${window.MF_SPRITES.portraitHTML(ch, "icon-lg")}
        <div style="font-size:12px; font-weight:900;">${escapeHtml(ch.name)}</div>
        <div style="font-size:10px; color:var(--muted);">${el.icon}${el.name}・${wp.name}</div>
        <div style="font-size:11px; font-weight:900; color:var(--accent);">Lv.${lv}/${cap} ▶</div>
      </div>
    `;
  }).join("");
}

function setProtagonistElement(elId) { state.protagonistElement = elId; saveGame(); playSfx("switch"); if (typeof renderCharDetailView === "function") renderCharDetailView(); showToast(`共鳴属性を「${window.MF_DATA.ELEMENTS[elId].name}」に変更！`); }
function setProtagonistWeapon(wpId) { state.protagonistWeapon = wpId; saveGame(); playSfx("switch"); if (typeof renderCharDetailView === "function") renderCharDetailView(); showToast(`装備武器を「${window.MF_DATA.WEAPONS[wpId].name}」に変更！`); }

let tempStyleId = "m_cool", tempWeaponId = "sword", tempElementId = "arc";
function renderCreatorView() { tempStyleId = state.styleId; tempWeaponId = state.protagonistWeapon; tempElementId = state.protagonistElement; document.getElementById("cr-name-input").value = state.playerName; refreshCreatorSelections(); }
function refreshCreatorSelections() {
  document.getElementById("cr-style-grid").innerHTML = window.MF_DATA.PROTAGONIST_STYLES.map(s => {
    const thumb = window.MF_SPRITES.portraitHTML({ id: "protagonist", isProtagonist: true, styleId: s.id, name: s.name, emoji: s.emoji }, "icon");
    return `<button class="select-chip ${tempStyleId === s.id ? "selected" : ""}" style="text-align:center;" onclick="tempStyleId='${s.id}'; playSfx('tap'); refreshCreatorSelections();">${thumb}<strong>${s.name}</strong><br><span style="font-size:10px;">${s.tag}</span></button>`;
  }).join("");
  document.getElementById("cr-element-grid").innerHTML = Object.values(window.MF_DATA.ELEMENTS).map(el => `<button class="select-chip ${tempElementId === el.id ? "selected" : ""}" onclick="tempElementId='${el.id}'; playSfx('tap'); refreshCreatorSelections();">${el.icon} <strong>${el.name}</strong></button>`).join("");
  document.getElementById("cr-weapon-grid").innerHTML = Object.values(window.MF_DATA.WEAPONS).map(wp => `<button class="select-chip ${tempWeaponId === wp.id ? "selected" : ""}" onclick="tempWeaponId='${wp.id}'; playSfx('tap'); refreshCreatorSelections();">${wp.icon} <strong>${wp.name}</strong></button>`).join("");
}
function confirmProtagonist() {
  const rawName = document.getElementById("cr-name-input").value.trim();
  if (!rawName) { showToast("隊長の名前を入力してください！"); return; }
  state.initialized = true; state.playerName = rawName.slice(0, 12);
  state.styleId = tempStyleId; state.protagonistWeapon = tempWeaponId; state.protagonistElement = tempElementId;
  saveGame(); playSfx("gift"); switchView("home");
}

function renderTerminalView() {
  document.getElementById("term-version").textContent = "現在のバージョン：Ver 2.7.0（パック券ガチャ・任務・敵22種・段階解放）";
  const dbgBtn = document.getElementById("btn-debug-unlock");
  if (dbgBtn) dbgBtn.textContent = state.debugUnlockAll ? "🔒 テスト全解放中（通常ロックに戻す）" : "🔓 テスト用：全機能のストーリーロックを解除";
  const listEl = document.getElementById("term-history-list");
  if (listEl) {
    listEl.innerHTML = `<div class="history-item"><strong>Ver 2.7.0：カードパック券・デイリー＆ウィークリー任務・敵22種実装</strong><div style="font-size:11px; color:var(--muted);">カードガチャ専用チケット、毎日/毎週任務、全22種の霧獣＆報酬増量、ストーリー進行による機能解放を実装。</div></div>`;
  }
}

function redeemSerialCode() {
  const input = document.getElementById("term-code-input");
  const code = input.value.trim().toUpperCase();
  const reward = window.MF_DATA.SERIAL_CODES[code];
  if (!code || state.redeemedCodes.includes(code) || !reward) { showToast("無効または使用済みのコードです"); return; }
  state.redeemedCodes.push(code); state.gems += reward.gems; state.credits += reward.credits;
  state.en += reward.en; state.expBooks += (reward.books || 0); state.cores += (reward.cores || 0);
  saveGame(); playSfx("gift"); renderTopBar(); input.value = "";
  showToast(`🎁 ${reward.label}を受取ました！`);
}

async function checkAppUpdate() {
  const statusEl = document.getElementById("term-update-status");
  statusEl.textContent = "確認中...";
  try {
    const res = await fetch(`./version.json?t=${Date.now()}`, { cache: "no-store" });
    const info = await res.json();
    if (info.version !== window.MF_DATA.APP_VERSION && confirm(`最新 Ver ${info.version} に更新しますか？`)) location.reload(true);
    else statusEl.textContent = "✅ 最新ビルドで動作中です。";
  } catch (e) { statusEl.textContent = "確認完了"; }
}
function resetAllSaveData() { if (confirm("セーブデータを初期化しますか？")) { localStorage.removeItem(SAVE_KEY); location.reload(); } }
function showToast(msg) { const el = document.getElementById("toast"); el.textContent = msg; el.classList.add("show"); clearTimeout(el._timer); el._timer = setTimeout(() => el.classList.remove("show"), 2600); }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c])); }

window.addEventListener("DOMContentLoaded", () => {
  state = loadSave();
  updateStamina();
  applyTheme();
  if (window.MF_AUDIO) window.MF_AUDIO.setEnabled(state.soundOn);
  if (typeof syncMissions === "function") syncMissions();
  if (typeof syncAdminMail === "function") syncAdminMail();
  setInterval(() => { updateStamina(); renderTopBar(); }, 15000);
  switchView(state.initialized ? "home" : "creator");
});
