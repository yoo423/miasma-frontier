let currentStoryTab = "chapters";
let activeChapterGroup = 1;
let activeStory = null;
let expRun = null;

// 文字送り速度設定（ゆっくり / ふつう / はやい / 一括）
const TEXT_SPEEDS = [
  { id: "slow",   label: "🐢 ゆっくり", ms: 72, autoWait: 2600 },
  { id: "normal", label: "🚶 ふつう",   ms: 38, autoWait: 1850 },
  { id: "fast",   label: "⚡ はやい",   ms: 16, autoWait: 1200 },
  { id: "instant",label: "⏭ 一括",     ms: 0,  autoWait: 1500 }
];

let typeTimer = null;
let autoStoryTimer = null;
let storyAutoOn = false;
let isTyping = false;
let currentFullText = "";

function getTextSpeedObj() {
  const id = state?.textSpeed || "slow";
  return TEXT_SPEEDS.find(s => s.id === id) || TEXT_SPEEDS[0];
}

function cycleTextSpeed() {
  const curId = state?.textSpeed || "slow";
  const idx = TEXT_SPEEDS.findIndex(s => s.id === curId);
  const next = TEXT_SPEEDS[(idx + 1) % TEXT_SPEEDS.length];
  state.textSpeed = next.id;
  saveGame();
  playSfx("tap");
  updateNovelControlButtons();
  showToast(`会話スピード：${next.label}`);
}

function toggleStoryAuto() {
  storyAutoOn = !storyAutoOn;
  clearTimeout(autoStoryTimer);
  playSfx("tap");
  updateNovelControlButtons();
  if (storyAutoOn && activeStory && !isTyping) scheduleAutoAdvance();
}

function updateNovelControlButtons() {
  const spdBtn = document.getElementById("btn-novel-speed");
  const autoBtn = document.getElementById("btn-novel-auto");
  if (spdBtn) spdBtn.textContent = getTextSpeedObj().label;
  if (autoBtn) {
    autoBtn.textContent = storyAutoOn ? "⏸ オート中" : "▶ オート";
    autoBtn.className = storyAutoOn ? "btn-xs btn-accent2" : "btn-xs";
  }
}

function stopNovelTimers() {
  clearInterval(typeTimer);
  clearTimeout(autoStoryTimer);
  typeTimer = null;
  autoStoryTimer = null;
  isTyping = false;
}

function getStoryCh1() {
  const a = window.MF_STORY_CH1_A || [];
  const b = window.MF_STORY_CH1_B || [];
  return a.length > 0 ? [...a, ...b] : (window.MF_STORY_CH1 || []);
}

function getStoryChapters() {
  return [...getStoryCh1(), ...(window.MF_STORY_CH2 || [])];
}

const RANDOM_EVENTS = [
  {
    title: "霧に埋もれた古代コンテナ",
    desc: "廃墟の陰に古い補給コンテナを見つけた。施錠装置がまだわずかに光っている。",
    choices: [
      { label: "🔧 慎重に解除する（安全に素材回収）", effect: "safe_loot" },
      { label: "💥 無理やりこじ開ける（大当たりか罠）", effect: "risk_loot" }
    ]
  },
  {
    title: "清らかなアーク湧き水",
    desc: "瘴霧の影響を受けていない澄んだ泉を発見した。隊員たちの疲れを癒せそうだ。",
    choices: [
      { label: "💧 全員で休息する（探索バフ＆作戦記録）", effect: "rest_buff" },
      { label: "⛏️ 泉の底の結晶を採取する（結晶石＆鉱石）", effect: "mine_gem" }
    ]
  },
  {
    title: "はぐれ行商ドローンとの遭遇",
    desc: "霧の中で迷子になっていた自律補給ドローンを発見。お礼に物資を分けてくれるようだ。",
    choices: [
      { label: "🔋 バッテリーを分けてあげる（結晶石＆記録）", effect: "mine_gem" },
      { label: "🗺️ 周囲の地図データをもらう（攻撃バフ+15%）", effect: "rest_buff" }
    ]
  }
];

function renderStoryView() {
  renderTopBar();
  document.getElementById("story-tab-chapters").className = `select-chip ${currentStoryTab === "chapters" ? "selected" : ""}`;
  document.getElementById("story-tab-map").className = `select-chip ${currentStoryTab === "map" ? "selected" : ""}`;

  document.getElementById("story-novel-panel").style.display = activeStory ? "block" : "none";
  document.getElementById("story-chapters-panel").style.display = !activeStory && currentStoryTab === "chapters" ? "block" : "none";
  document.getElementById("story-map-panel").style.display = !activeStory && currentStoryTab === "map" ? "block" : "none";

  if (activeStory) renderNovelScene();
  else if (currentStoryTab === "chapters") renderChapterList();
  else renderExpeditionPanel();
}

function setStoryTab(tab) { stopNovelTimers(); currentStoryTab = tab; activeStory = null; playSfx("tap"); renderStoryView(); }

function renderChapterList() {
  const cleared = state.clearedStories || [];
  const ch1 = getStoryCh1();
  const ch2 = window.MF_STORY_CH2 || [];
  const ch2Unlocked = cleared.includes("ch1_ep20") || cleared.includes("ch1_ep10") || cleared.includes("ch1_ep8");

  const list = activeChapterGroup === 2 ? ch2 : ch1;
  const clearCount = list.filter(c => cleared.includes(c.id)).length;
  const titleText = activeChapterGroup === 2
    ? "⚡ 第2章：雷鳴の峡谷『ヴォルト・キャニオン』"
    : "🌿 第1章：新緑の廃墟『ヴェルデ平原』";

  const tabsHtml = `
    <div class="chip-grid" style="margin-bottom:8px;">
      <button class="select-chip ${activeChapterGroup === 1 ? "selected" : ""}" onclick="activeChapterGroup=1; playSfx('tap'); renderChapterList();">🌿 第1章（${ch1.length}話）</button>
      <button class="select-chip ${activeChapterGroup === 2 ? "selected" : ""}" onclick="activeChapterGroup=2; playSfx('tap'); renderChapterList();">${ch2Unlocked ? "⚡" : "🔒"} 第2章（${ch2.length}話）</button>
    </div>
    <div class="card" style="padding:10px; margin-bottom:8px; background:var(--surface-sub);">
      <div class="top-row">
        <strong style="font-size:12.5px;">${titleText}</strong>
        <span class="rank-pill">${clearCount} / ${list.length}話</span>
      </div>
      <div style="font-size:10.5px; color:var(--muted); margin-top:3px;">
        ${activeChapterGroup === 1 ? "百年間霧に閉ざされた大地を歩み、第7小隊の物語を紡ごう。" : "雷雲渦巻く峡谷の奥で、黄金の異変の真相に迫る。"}
      </div>
    </div>
  `;

  document.getElementById("story-chapter-list").innerHTML = tabsHtml + list.map(ch => {
    const isCleared = cleared.includes(ch.id);
    const locked = ch.reqClear && !cleared.includes(ch.reqClear);
    const enemy = ch.battleEnemyId ? (window.MF_DATA.ENEMIES || []).find(e => e.id === ch.battleEnemyId) : null;
    const iconTag = enemy ? `⚔️ ${enemy.name}` : "💬 物語";
    return `
      <div class="card" style="padding:10px; margin-bottom:8px; opacity:${locked ? 0.55 : 1};">
        <div class="top-row">
          <strong style="font-size:12.5px;">${escapeHtml(ch.chapter)}：${escapeHtml(ch.title)}</strong>
          <span class="tag" style="${isCleared ? "background:#18b88a; color:#fff;" : ""}">${isCleared ? "踏破済" : (locked ? "🔒" : "NEW")}</span>
        </div>
        <div style="font-size:11px; color:var(--muted); margin:3px 0;">
          ${escapeHtml(ch.subtitle)} ｜ ${escapeHtml(iconTag)}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
          <span style="font-size:10px; font-weight:800;">報酬：💎+${ch.reward.gems} / 🎟️券+2 / 📘+${ch.reward.books}</span>
          <button class="btn-xs ${locked ? "" : "btn-primary"}" ${locked ? "disabled" : ""} onclick="startStoryChapter('${ch.id}')">
            ${isCleared ? "回想" : "開始 ▶"}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function startStoryChapter(chId, isEpilogue = false) {
  const ch = getStoryChapters().find(c => c.id === chId);
  if (!ch) return;
  const list = isEpilogue ? (ch.epilogue || []) : ch.scenes;
  if (!list.length) return;
  stopNovelTimers();
  storyAutoOn = false;
  activeStory = { chapter: ch, scenes: list, isEpilogue, index: 0, replyLine: null, history: [], lastLoc: "" };
  playSfx("switch");
  renderStoryView();
}

function triggerNovelFx(fx) {
  const stage = document.getElementById("novel-stage-wrap");
  if (!stage || !fx) return;
  stage.classList.remove("novel-shake", "novel-flash", "novel-redflash");
  void stage.offsetWidth;
  if (fx === "shake") stage.classList.add("novel-shake");
  if (fx === "flash") stage.classList.add("novel-flash");
  if (fx === "redflash") stage.classList.add("novel-redflash");
}

function renderNovelScene() {
  stopNovelTimers();
  updateNovelControlButtons();
  const { chapter, scenes, isEpilogue, index, replyLine } = activeStory;
  const scene = scenes[index];
  const speakerId = replyLine ? replyLine.speaker : scene.speaker;
  const text = replyLine ? replyLine.text : scene.text;
  const isNarrator = speakerId === "narrator";

  // BGM・SE・背景ムード・画面演出
  if (!replyLine) {
    if (scene.bgm && window.MF_AUDIO) window.MF_AUDIO.playBgm(scene.bgm);
    if (scene.sfx) playSfx(scene.sfx);
    if (scene.fx) triggerNovelFx(scene.fx);
  }

  const stageEl = document.getElementById("novel-stage-portrait");
  const bgCls = scene.bg ? `nbg-${scene.bg}` : "nbg-verde_morning";
  stageEl.className = `novel-stage ${bgCls}`;

  document.getElementById("novel-chapter-title").textContent = `${chapter.chapter}：${chapter.title}`;
  const locBar = document.getElementById("novel-location-bar");
  if (scene.loc) activeStory.lastLoc = scene.loc;
  locBar.textContent = `📍 ${activeStory.lastLoc || chapter.subtitle}`;

  const spkEl = document.getElementById("novel-speaker-name");
  if (isNarrator) {
    stageEl.innerHTML = `<div class="narrator-atmosphere">✦ ✦ ✦</div>`;
    spkEl.style.display = "none";
  } else {
    const ch = getCharProfile(speakerId);
    stageEl.innerHTML = window.MF_SPRITES.portraitHTML(ch, "contain");
    spkEl.style.display = "inline-block";
    spkEl.textContent = `${ch.name}`;
  }

  const logName = isNarrator ? "【情景】" : getCharProfile(speakerId).name;
  const lastLog = activeStory.history[activeStory.history.length - 1];
  if (!lastLog || lastLog.text !== text) activeStory.history.push({ name: logName, text });

  // 選択肢とボタンは文字送り完了後に表示
  document.getElementById("novel-choices").style.display = "none";
  const nextBtn = document.getElementById("btn-novel-next");
  nextBtn.style.display = "block";
  nextBtn.textContent = "……";

  startTypewriter(text);
}

function startTypewriter(fullText) {
  currentFullText = fullText;
  const textEl = document.getElementById("novel-dialogue-text");
  const spd = getTextSpeedObj();

  if (spd.ms === 0) {
    textEl.textContent = fullText;
    onTypewriterFinished();
    return;
  }

  isTyping = true;
  textEl.textContent = "";
  let pos = 0;
  typeTimer = setInterval(() => {
    pos += 1;
    textEl.textContent = fullText.slice(0, pos);
    if (pos >= fullText.length) {
      clearInterval(typeTimer);
      typeTimer = null;
      isTyping = false;
      onTypewriterFinished();
    }
  }, spd.ms);
}

function finishTypewriterImmediately() {
  if (!isTyping) return false;
  clearInterval(typeTimer);
  typeTimer = null;
  isTyping = false;
  document.getElementById("novel-dialogue-text").textContent = currentFullText;
  onTypewriterFinished();
  return true;
}

function onTypewriterFinished() {
  if (!activeStory) return;
  const { chapter, scenes, isEpilogue, index, replyLine } = activeStory;
  const scene = scenes[index];
  const isLast = index >= scenes.length - 1;
  const choicesBox = document.getElementById("novel-choices");
  const nextBtn = document.getElementById("btn-novel-next");

  if (!replyLine && scene.choices && scene.choices.length > 0) {
    nextBtn.style.display = "none";
    choicesBox.style.display = "flex";
    choicesBox.innerHTML = scene.choices.map((c, idx) => `
      <button class="btn-primary" style="text-align:left; font-size:12px;" onclick="pickStoryChoice(${idx})">${escapeHtml(c.label)}</button>
    `).join("");
    return;
  }

  choicesBox.style.display = "none";
  nextBtn.style.display = "block";
  if (!isLast) nextBtn.textContent = "次へ ▶";
  else if (!isEpilogue && chapter.battleEnemyId) nextBtn.textContent = "⚔️ 戦闘へ突入する！";
  else nextBtn.textContent = "✨ 物語を終える ▶";

  if (storyAutoOn && !isLast) scheduleAutoAdvance();
}

function scheduleAutoAdvance() {
  clearTimeout(autoStoryTimer);
  const wait = getTextSpeedObj().autoWait;
  autoStoryTimer = setTimeout(() => {
    if (storyAutoOn && activeStory && !isTyping) advanceNovelScene();
  }, wait);
}

function openStoryBacklog() {
  if (!activeStory) return;
  document.getElementById("story-log-body").innerHTML = activeStory.history.map(h => `
    <div style="text-align:left; background:var(--surface-sub); border-radius:9px; padding:7px 9px; margin-bottom:6px;">
      <strong style="font-size:11px; color:var(--accent);">${escapeHtml(h.name)}</strong>
      <div style="font-size:12px; line-height:1.45; margin-top:2px;">${escapeHtml(h.text)}</div>
    </div>
  `).join("");
  document.getElementById("modal-story-log").classList.add("active");
  playSfx("tap");
}
function closeStoryBacklog() { document.getElementById("modal-story-log").classList.remove("active"); }

function pickStoryChoice(choiceIdx) {
  stopNovelTimers();
  const scene = activeStory.scenes[activeStory.index];
  const picked = scene.choices[choiceIdx];
  if (!picked) return;
  activeStory.history.push({ name: state.playerName, text: picked.label });
  if (picked.bondChar) {
    state.bondPoints = state.bondPoints || {};
    state.bondPoints[picked.bondChar] = (state.bondPoints[picked.bondChar] || 0) + 1;
    saveGame();
    showToast(`💞 ${getCharProfile(picked.bondChar).name}との絆が深まった`);
  }
  activeStory.replyLine = { speaker: picked.replySpeaker, text: picked.reply };
  playSfx("switch");
  renderNovelScene();
}

function advanceNovelScene() {
  if (!activeStory) return;
  if (finishTypewriterImmediately()) return;

  stopNovelTimers();
  const { chapter, scenes, isEpilogue, index } = activeStory;
  if (activeStory.replyLine) { activeStory.replyLine = null; activeStory.index += 1; playSfx("tap"); renderNovelScene(); return; }
  if (index < scenes.length - 1) { activeStory.index += 1; playSfx("tap"); renderNovelScene(); return; }

  const chRef = chapter;
  activeStory = null;
  storyAutoOn = false;

  if (isEpilogue || !chRef.battleEnemyId) {
    completeStoryChapter(chRef);
    playSfx("gift");
    renderStoryView();
    return;
  }

  switchView("battle");
  startBattle(chRef.battleEnemyId, {
    returnView: "story",
    onWin: () => {
      completeStoryChapter(chRef);
      if (chRef.epilogue && chRef.epilogue.length > 0) setTimeout(() => startStoryChapter(chRef.id, true), 120);
    }
  });
}

function completeStoryChapter(ch) {
  state.clearedStories = state.clearedStories || [];
  if (!state.clearedStories.includes(ch.id)) {
    state.clearedStories.push(ch.id);
    state.gems += ch.reward.gems;
    state.credits += ch.reward.credits;
    state.cardTickets = (state.cardTickets || 0) + 2;
    state.expBooks = (state.expBooks || 0) + ch.reward.books;
    state.cores = (state.cores || 0) + ch.reward.cores;
    saveGame();
    let unlockMsg = "";
    if (ch.id === "ch1_ep3") unlockMsg = " ／ フレンド通信が利用可能に！";
    if (ch.id === "ch1_ep4") unlockMsg = " ／ キャンプ＆クラフト設備が稼働！";
    if (ch.id === "ch1_ep10" || ch.id === "ch1_ep20") unlockMsg = " ／ 対人アリーナが開放！";
    showToast(`📖 ${ch.chapter}踏破！💎+${ch.reward.gems} / 🎟️券+2${unlockMsg}`);
  }
}

function closeNovelStage() { stopNovelTimers(); storyAutoOn = false; activeStory = null; renderStoryView(); }

// ---------- 分岐ルート開拓マップ ----------
function renderExpeditionPanel() {
  const startBox = document.getElementById("exp-region-select");
  const runBox = document.getElementById("exp-run-board");

  if (!expRun) {
    startBox.style.display = "block"; runBox.style.display = "none";
    document.getElementById("exp-region-list").innerHTML = (window.MF_DATA.REGIONS || []).map(r => {
      const locked = state.playerRank < r.reqRank;
      return `
        <div class="card" style="padding:10px; margin-bottom:8px; opacity:${locked ? 0.55 : 1};">
          <div class="top-row"><strong style="font-size:12px;">🗺️ ${escapeHtml(r.name)}</strong><span class="tag">${locked ? `🔒開拓Lv.${r.reqRank}` : `希少：${r.rareDrop}`}</span></div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
            <span style="font-size:10px; color:var(--muted);">4区画分岐探索 → エリア主霧獣決戦</span>
            <button class="btn-xs ${locked ? "" : "btn-accent2"}" ${locked ? "disabled" : ""} onclick="startExpedition('${r.id}')">開拓開始 ▶</button>
          </div>
        </div>
      `;
    }).join("");
    return;
  }

  startBox.style.display = "none"; runBox.style.display = "block";
  const reg = expRun.region;
  document.getElementById("exp-run-title").textContent = `${reg.name.split("：")[1] || reg.name}（第${expRun.floor}区画 / 4）`;
  document.getElementById("exp-run-status").textContent = `🔥 探索攻撃バフ：+${expRun.atkBuff}% ｜ 獲得予定希少素材：${reg.rareDrop}`;

  const eventBox = document.getElementById("exp-event-box");
  const nodesBox = document.getElementById("exp-nodes-grid");

  if (expRun.activeEvent) {
    nodesBox.style.display = "none"; eventBox.style.display = "block";
    const ev = expRun.activeEvent;
    eventBox.innerHTML = `
      <div class="card" style="background:var(--surface-sub);">
        <strong style="font-size:14px;">❓ ${escapeHtml(ev.title)}</strong>
        <p style="font-size:12px; margin:6px 0 10px; line-height:1.45;">${escapeHtml(ev.desc)}</p>
        <div style="display:flex; flex-direction:column; gap:6px;">
          ${ev.choices.map((c, i) => `<button class="btn-primary" style="text-align:left; font-size:12px;" onclick="resolveExpeditionEvent(${i})">${escapeHtml(c.label)}</button>`).join("")}
        </div>
      </div>
    `;
    return;
  }

  eventBox.style.display = "none"; nodesBox.style.display = "grid";
  const floorNodes = expRun.floors[expRun.floor - 1] || [];
  nodesBox.innerHTML = floorNodes.map((n, idx) => `
    <div class="node-card node-${n.type}" onclick="enterExpeditionNode(${idx})">
      <div style="font-size:28px;">${n.icon}</div>
      <strong style="font-size:13px;">${escapeHtml(n.title)}</strong>
      <div style="font-size:10px; color:var(--muted); margin-top:4px;">${escapeHtml(n.desc)}</div>
    </div>
  `).join("");
}

function startExpedition(regionId) {
  const reg = (window.MF_DATA.REGIONS || []).find(r => r.id === regionId);
  if (!reg) return;
  expRun = {
    region: reg, floor: 1, atkBuff: 0, activeEvent: null,
    floors: [
      [{ type: "battle", icon: "⚔️", title: "霧獣の縄張り", desc: "通常霧獣と交戦。手堅く素材を稼ぐ", enemyId: reg.normalId }, { type: "event", icon: "❓", title: "霧の廃墟探索", desc: "選択肢で物資を獲得" }],
      [{ type: "radiant", icon: "🌟", title: "【融光種】強敵反応", desc: "危険な変異種に挑む！豪華レア報酬", enemyId: reg.radiantId || reg.eliteId }, { type: "camp", icon: "🏕️", title: "前線野営キャンプ", desc: "安全に休憩。攻撃力+20%＆作戦記録獲得" }],
      [{ type: "battle", icon: "🪲", title: "精鋭霧獣の待ち伏せ", desc: "精鋭個体とのバトル", enemyId: reg.eliteId }, { type: "event", icon: "🧰", title: "古代物資の隠し部屋", desc: "補給チャンス！" }],
      [{ type: "boss", icon: "👑", title: "エリア主霧獣・決戦！", desc: "踏破すると希少素材＆💎+160＆🎟️券+3！", enemyId: reg.bossId }]
    ]
  };
  playSfx("switch"); renderStoryView();
}

function enterExpeditionNode(nodeIdx) {
  if (!expRun) return;
  const node = expRun.floors[expRun.floor - 1][nodeIdx];
  if (!node) return;
  playSfx("tap");
  if (node.type === "camp") { expRun.atkBuff += 20; state.expBooks = (state.expBooks || 0) + 4; saveGame(); showToast("🏕️ 攻撃力+20% / 作戦記録+4"); advanceExpeditionFloor(); return; }
  if (node.type === "event") { expRun.activeEvent = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)]; renderExpeditionPanel(); return; }
  const isBoss = node.type === "boss";
  switchView("battle");
  startBattle(node.enemyId, { returnView: "story", extraAtkBuff: expRun.atkBuff, onWin: () => { if (isBoss) finishExpeditionRun(); else advanceExpeditionFloor(); } });
}

function resolveExpeditionEvent(choiceIdx) {
  if (!expRun || !expRun.activeEvent) return;
  const eff = expRun.activeEvent.choices[choiceIdx]?.effect;
  state.materials = state.materials || {};
  const rare = expRun.region.rareDrop;
  if (eff === "safe_loot") { state.materials[rare] = (state.materials[rare] || 0) + 2; state.credits += 2000; showToast(`🔧 解除成功！『${rare}』×2 と 🪙2,000！`); }
  else if (eff === "risk_loot") {
    if (Math.random() < 0.65) { state.gems += 120; state.cardTickets = (state.cardTickets || 0) + 2; state.materials[rare] = (state.materials[rare] || 0) + 3; showToast(`✨ 大当たり！💎+120 / 🎟️券+2 / 『${rare}』×3！`); }
    else { state.credits += 800; showToast("💥 警報作動！🪙800だけ回収して脱出！"); }
  } else if (eff === "rest_buff") { expRun.atkBuff += 15; state.expBooks = (state.expBooks || 0) + 6; showToast("💧 リフレッシュ！攻撃力+15% / 記録+6"); }
  else { state.gems += 90; state.cardTickets = (state.cardTickets || 0) + 1; state.materials["アーク結晶鉱"] = (state.materials["アーク結晶鉱"] || 0) + 2; showToast("⛏️ 結晶採取！💎+90 / 🎟️券+1 / 結晶鉱×2"); }
  expRun.activeEvent = null; saveGame(); playSfx("gift"); advanceExpeditionFloor();
}

function advanceExpeditionFloor() { if (!expRun) return; expRun.floor += 1; renderExpeditionPanel(); }
function finishExpeditionRun() {
  if (!expRun) return;
  const rare = expRun.region.rareDrop;
  state.gems += 160; state.cardTickets = (state.cardTickets || 0) + 3;
  state.materials = state.materials || {}; state.materials[rare] = (state.materials[rare] || 0) + 3;
  state.expBooks = (state.expBooks || 0) + 10; expRun = null; saveGame();
  showToast(`👑 開拓マップ完全踏破！💎+160 / 🎟️券+3 / 『${rare}』×3！`);
}
function abandonExpedition() { if (confirm("現在の開拓探索を中断しますか？")) { expRun = null; renderExpeditionPanel(); } }
