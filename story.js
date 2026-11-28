// =========================================================
// 🚀 運営アップデート公開スイッチ（ここを書き換えるだけで新章解禁！）
// 例：2＝第2章まで公開中（第3章は「近日公開」として隠れる）
//     3＝第3章を公開！ / 6＝第6章完結まで全公開！
// =========================================================
const PUBLISHED_MAX_CHAPTER = 2;

const STORY_CHAPTER_META = [
  { num: 1, icon: "🌿", title: "第1章：新緑の廃墟『ヴェルデ平原』",         reqPrev: null,       endId: "ch1_ep20", desc: "百年間霧に閉ざされた大地を歩み、第7小隊の物語を紡ごう。" },
  { num: 2, icon: "⚡", title: "第2章：雷鳴の峡谷『ヴォルト・キャニオン』",   reqPrev: "ch1_ep20", endId: "ch2_ep20", desc: "雷雲渦巻く峡谷の奥で、黄金の融光種と第2小隊の真実に迫る。" },
  { num: 3, icon: "❄️", title: "第3章：白銀の研究所『フロスト・ヘイヴン』",   reqPrev: "ch2_ep20", endId: "ch3_ep20", desc: "極寒の雪原と古代研究棟。融光種を操る黒幕の正体がついに明かされる。" },
  { num: 4, icon: "🔥", title: "第4章：灼熱の溶鉱炉『イグニス・カルデラ』",   reqPrev: "ch3_ep20", endId: "ch4_ep20", desc: "溶岩渦巻く巨大精錬炉跡。逃亡した黒幕と炎帝竜を追う激闘編。" },
  { num: 5, icon: "🌊", title: "第5章：水没ネオン街『アクア・メトロポリス』", reqPrev: "ch4_ep20", endId: "ch5_ep20", desc: "深海に沈んだ旧文明の首都。方舟都市リベルタ誕生の秘密へ迫る。" },
  { num: 6, icon: "👑", title: "第6章：天蓋の塔『アーク・スパイア』",         reqPrev: "ch5_ep20", endId: "ch6_ep20", desc: "第1部完結。原初の災厄・ゼロとの最終決戦、そして人類の未来へ。" }
];

let currentStoryTab = "chapters";
let activeChapterGroup = 1;
let activeStory = null;
let expRun = null;

const TEXT_SPEEDS = [
  { id: "slow",    label: "🐢 ゆっくり", ms: 72, autoWait: 2600 },
  { id: "normal",  label: "🚶 ふつう",   ms: 38, autoWait: 1850 },
  { id: "fast",    label: "⚡ はやい",   ms: 16, autoWait: 1200 },
  { id: "instant", label: "⏭ 一括",     ms: 0,  autoWait: 1500 }
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
  saveGame(); playSfx("tap"); updateNovelControlButtons();
  showToast(`会話スピード：${next.label}`);
}

function toggleStoryAuto() {
  storyAutoOn = !storyAutoOn;
  clearTimeout(autoStoryTimer); playSfx("tap"); updateNovelControlButtons();
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
  clearInterval(typeTimer); clearTimeout(autoStoryTimer);
  typeTimer = null; autoStoryTimer = null; isTyping = false;
}

function getChapterEpisodes(num) {
  const a = window[`MF_STORY_CH${num}_A`] || [];
  const b = window[`MF_STORY_CH${num}_B`] || [];
  if (a.length > 0 || b.length > 0) return [...a, ...b];
  return window[`MF_STORY_CH${num}`] || [];
}

function getStoryChapters() {
  const all = [];
  STORY_CHAPTER_META.forEach(m => {
    if (m.num <= PUBLISHED_MAX_CHAPTER) all.push(...getChapterEpisodes(m.num));
  });
  return all;
}

function isChapterUnlockedForPlayer(meta) {
  if (meta.num > PUBLISHED_MAX_CHAPTER) return false;
  if (!meta.reqPrev) return true;
  return (state?.clearedStories || []).includes(meta.reqPrev);
}

function selectChapterGroup(num) {
  const meta = STORY_CHAPTER_META.find(m => m.num === num);
  if (!meta) return;
  if (num > PUBLISHED_MAX_CHAPTER) {
    playSfx("tap");
    showToast(`🔜 ${meta.title} は今後の大型アップデートで解放予定です！`);
    return;
  }
  if (!isChapterUnlockedForPlayer(meta)) {
    playSfx("tap");
    showToast(`🔒 第${num - 1}章・第二十話を踏破すると解放されます`);
    return;
  }
  activeChapterGroup = num;
  playSfx("tap");
  renderChapterList();
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
  if (activeChapterGroup > PUBLISHED_MAX_CHAPTER) activeChapterGroup = 1;
  const curMeta = STORY_CHAPTER_META.find(m => m.num === activeChapterGroup) || STORY_CHAPTER_META[0];
  if (!isChapterUnlockedForPlayer(curMeta)) activeChapterGroup = 1;

  const activeMeta = STORY_CHAPTER_META.find(m => m.num === activeChapterGroup) || STORY_CHAPTER_META[0];
  const list = getChapterEpisodes(activeMeta.num);
  const clearCount = list.filter(c => cleared.includes(c.id)).length;

  // 公開済みの章 ＋ 次の1章だけ「🔜 近日公開」としてタブ表示（運営型RPG仕様）
  const visibleMetas = STORY_CHAPTER_META.filter(m => m.num <= Math.min(STORY_CHAPTER_META.length, PUBLISHED_MAX_CHAPTER + 1));

  const tabsHtml = `
    <div class="chip-grid cols-3" style="margin-bottom:8px;">
      ${visibleMetas.map(m => {
        const coming = m.num > PUBLISHED_MAX_CHAPTER;
        const unlocked = isChapterUnlockedForPlayer(m);
        const sel = m.num === activeMeta.num;
        return `
          <button class="select-chip ${sel ? "selected" : ""}" style="${coming || !unlocked ? "opacity:0.6;" : ""}" onclick="selectChapterGroup(${m.num})">
            ${coming ? "🔜" : (unlocked ? m.icon : "🔒")} 第${m.num}章${coming ? "<br><span style='font-size:9px;'>近日公開</span>" : ""}
          </button>
        `;
      }).join("")}
    </div>
    <div class="card" style="padding:10px; margin-bottom:8px; background:var(--surface-sub);">
      <div class="top-row">
        <strong style="font-size:12.5px;">${activeMeta.icon} ${activeMeta.title}</strong>
        <span class="rank-pill">${clearCount} / ${list.length}話</span>
      </div>
      <div style="font-size:10.5px; color:var(--muted); margin-top:3px;">${activeMeta.desc}</div>
    </div>
  `;

  document.getElementById("story-chapter-list").innerHTML = tabsHtml + list.map(ch => {
    const isCleared = cleared.includes(ch.id);
    const req = ch.reqClear;
    const locked = !!(req && !cleared.includes(req));
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
  if (!isEpilogue && ch.reqClear && !(state.clearedStories || []).includes(ch.reqClear)) {
    showToast("🔒 前のエピソードを踏破すると解放されます");
    return;
  }
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
  const { chapter, scenes, index, replyLine } = activeStory;
  const scene = scenes[index];
  const speakerId = replyLine ? replyLine.speaker : scene.speaker;
  const text = replyLine ? replyLine.text : scene.text;
  const isNarrator = speakerId === "narrator";

  if (!replyLine) {
    if (scene.bgm && window.MF_AUDIO) window.MF_AUDIO.playBgm(scene.bgm);
    if (scene.sfx) playSfx(scene.sfx);
    if (scene.fx) triggerNovelFx(scene.fx);
  }

  const stageEl = document.getElementById("novel-stage-portrait");
  stageEl.className = `novel-stage ${scene.bg ? `nbg-${scene.bg}` : "nbg-verde_morning"}`;
  document.getElementById("novel-chapter-title").textContent = `${chapter.chapter}：${chapter.title}`;
  if (scene.loc) activeStory.lastLoc = scene.loc;
  document.getElementById("novel-location-bar").textContent = `📍 ${activeStory.lastLoc || chapter.subtitle}`;

  const spkEl = document.getElementById("novel-speaker-name");
  if (isNarrator) {
    stageEl.innerHTML = `<div class="narrator-atmosphere">✦ ✦ ✦</div>`;
    spkEl.style.display = "none";
  } else {
    const ch = getCharProfile(speakerId);
    stageEl.innerHTML = window.MF_SPRITES.portraitHTML(ch, "contain");
    spkEl.style.display = "inline-block";
    spkEl.textContent = ch.name;
  }

  const logName = isNarrator ? "【情景】" : getCharProfile(speakerId).name;
  const lastLog = activeStory.history[activeStory.history.length - 1];
  if (!lastLog || lastLog.text !== text) activeStory.history.push({ name: logName, text });

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
  if (spd.ms === 0) { textEl.textContent = fullText; onTypewriterFinished(); return; }

  isTyping = true;
  textEl.textContent = "";
  let pos = 0;
  typeTimer = setInterval(() => {
    pos += 1;
    textEl.textContent = fullText.slice(0, pos);
    if (pos >= fullText.length) { clearInterval(typeTimer); typeTimer = null; isTyping = false; onTypewriterFinished(); }
  }, spd.ms);
}

function finishTypewriterImmediately() {
  if (!isTyping) return false;
  clearInterval(typeTimer); typeTimer = null; isTyping = false;
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
  autoStoryTimer = setTimeout(() => { if (storyAutoOn && activeStory && !isTyping) advanceNovelScene(); }, getTextSpeedObj().autoWait);
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

function getChapterEndIdSafe(num) {
  if (typeof getChapterEpisodes === "function") {
    const eps = getChapterEpisodes(num);
    if (eps.length > 0) return eps[eps.length - 1].id;
  }
  const meta = (typeof STORY_CHAPTER_META !== "undefined" ? STORY_CHAPTER_META : []).find(m => m.num === num);
  return meta ? meta.endId : `ch${num}_ep20`;
}

function getNextStoryEpisode(currentId) {
  const all = typeof getStoryChapters === "function" ? getStoryChapters() : [];
  const idx = all.findIndex(c => c.id === currentId);
  if (idx < 0 || idx >= all.length - 1) return null;
  return all[idx + 1];
}

function closeStoryClearOverlay() {
  const modal = document.getElementById("modal-story-next");
  if (modal) modal.classList.remove("active");
}

function proceedToNextStoryEpisode(nextId) {
  closeStoryClearOverlay();
  const m = String(nextId || "").match(/^ch(\d+)_/);
  if (m) activeChapterGroup = Number(m[1]);
  startStoryChapter(nextId, false);
}

function showStoryClearOverlay(ch, isFirstClear) {
  const nextEp = getNextStoryEpisode(ch.id);
  let modal = document.getElementById("modal-story-next");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-story-next";
    modal.className = "modal-overlay";
    modal.style.zIndex = "1600";
    document.body.appendChild(modal);
  }

  const rw = ch.reward || {};
  const rewardHtml = isFirstClear
    ? `<div style="background:var(--surface-sub); border:1.5px solid #f3cf00; border-radius:10px; padding:8px; font-size:11.5px; font-weight:900; margin:8px 0;">
         🎁 初踏破報酬：💎+${Number(rw.gems || 0)} ／ 🎟️券+2 ／ 📘+${Number(rw.books || 0)} ／ 💠+${Number(rw.cores || 0)}
       </div>`
    : `<div style="font-size:11px; color:var(--muted); margin:6px 0;">回想エピソードを読み終えました</div>`;

  const nextBtnHtml = nextEp
    ? `<button class="btn-accent2" style="width:100%; padding:12px; font-size:13.5px; margin-bottom:7px;" onclick="proceedToNextStoryEpisode('${nextEp.id}')">
         ▶ 次の話へ進む（${escapeHtml(nextEp.chapter)}：${escapeHtml(nextEp.title)}）
       </button>`
    : `<div style="font-size:11px; color:var(--accent); font-weight:900; margin-bottom:8px;">✨ 現在公開中のエピソードをすべて踏破しました！</div>`;

  modal.innerHTML = `
    <div class="modal-box" onclick="event.stopPropagation()">
      <div style="font-size:36px; margin-bottom:2px;">📖</div>
      <strong style="font-size:15px; display:block;">${escapeHtml(ch.chapter)} 完了！</strong>
      <div style="font-size:11.5px; color:var(--muted); margin-top:2px;">${escapeHtml(ch.title)}</div>
      ${rewardHtml}
      ${nextBtnHtml}
      <button class="btn-xs" style="width:100%; padding:9px;" onclick="closeStoryClearOverlay(); renderStoryView();">
        📋 エピソード一覧へ戻る
      </button>
    </div>
  `;
  modal.classList.add("active");
}

function advanceNovelScene() {
  if (!activeStory) return;
  if (finishTypewriterImmediately()) return;
  stopNovelTimers();
  const { chapter, scenes, isEpilogue, index } = activeStory;

  // 選択肢の返信表示後：次のシーンがあれば進め、最終シーンならそのまま完了処理へ
  if (activeStory.replyLine) {
    activeStory.replyLine = null;
    if (index < scenes.length - 1) {
      activeStory.index += 1;
      playSfx("tap");
      renderNovelScene();
      return;
    }
  } else if (index < scenes.length - 1) {
    activeStory.index += 1;
    playSfx("tap");
    renderNovelScene();
    return;
  }

  const chRef = chapter;
  const epWasFirst = !!activeStory.wasFirstClear;
  activeStory = null;
  storyAutoOn = false;

  if (isEpilogue || !chRef.battleEnemyId) {
    const isFirst = epWasFirst || completeStoryChapter(chRef);
    try { playSfx("gift"); } catch (_) {}
    renderStoryView();
    showStoryClearOverlay(chRef, isFirst);
    return;
  }

  switchView("battle");
  startBattle(chRef.battleEnemyId, {
    returnView: "story",
    onWin: () => {
      const isFirst = completeStoryChapter(chRef);
      if (chRef.epilogue && chRef.epilogue.length > 0) {
        setTimeout(() => {
          startStoryChapter(chRef.id, true);
          if (activeStory) activeStory.wasFirstClear = isFirst;
        }, 120);
      } else {
        setTimeout(() => showStoryClearOverlay(chRef, isFirst), 180);
      }
    }
  });
}

function completeStoryChapter(ch) {
  if (!ch || !state) return false;
  state.clearedStories = state.clearedStories || [];
  if (!state.clearedStories.includes(ch.id)) {
    const rw = ch.reward || {};
    state.clearedStories.push(ch.id);
    state.gems = Number(state.gems || 0) + Number(rw.gems || 0);
    state.credits = Number(state.credits || 0) + Number(rw.credits || 0);
    state.cardTickets = Number(state.cardTickets || 0) + 2;
    state.expBooks = Number(state.expBooks || 0) + Number(rw.books || 0);
    state.cores = Number(state.cores || 0) + Number(rw.cores || 0);
    try { saveGame(); } catch (_) {}
    try { renderTopBar(); } catch (_) {}
    let unlockMsg = "";
    if (ch.id === "ch1_ep3") unlockMsg = " ／ フレンド通信が利用可能に！";
    if (ch.id === "ch1_ep4") unlockMsg = " ／ キャンプ＆クラフト設備が稼働！";
    if (ch.id === getChapterEndIdSafe(1)) unlockMsg = " ／ 『🏆対人アリーナ』＆『⚡第2章』解放！";
    if (ch.id === getChapterEndIdSafe(2) && PUBLISHED_MAX_CHAPTER >= 3) unlockMsg = " ／ 『❄️第3章』解放！";
    if (ch.id === getChapterEndIdSafe(3) && PUBLISHED_MAX_CHAPTER >= 4) unlockMsg = " ／ 『🔥第4章』解放！";
    try { showToast(`📖 ${ch.chapter}踏破！💎+${Number(rw.gems || 0)} / 🎟️券+2${unlockMsg}`); } catch (_) {}
    return true;
  }
  return false;
}

function closeNovelStage() { stopNovelTimers(); storyAutoOn = false; activeStory = null; closeStoryClearOverlay(); renderStoryView(); }

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
