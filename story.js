let currentStoryTab = "chapters";
let activeStory = null;
let expRun = null;

function getStoryChapters() {
  return window.MF_STORY_CH1 || [];
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

function setStoryTab(tab) { currentStoryTab = tab; activeStory = null; playSfx("tap"); renderStoryView(); }

function renderChapterList() {
  const cleared = state.clearedStories || [];
  const chapters = getStoryChapters();
  const clearCount = chapters.filter(c => cleared.includes(c.id)).length;

  const headerHtml = `
    <div class="card" style="padding:10px; margin-bottom:8px; background:var(--surface-sub);">
      <div class="top-row">
        <strong style="font-size:13px;">🌿 第1章：新緑の廃墟『ヴェルデ平原』編</strong>
        <span class="rank-pill">${clearCount} / ${chapters.length}話</span>
      </div>
      <div style="font-size:11px; color:var(--muted); margin-top:3px;">
        全8話の長編ストーリー。会話の選択肢で仲間との絆が深まり、物語が進行します。
      </div>
    </div>
  `;

  document.getElementById("story-chapter-list").innerHTML = headerHtml + chapters.map(ch => {
    const isCleared = cleared.includes(ch.id);
    const locked = ch.reqClear && !cleared.includes(ch.reqClear);
    const enemy = ch.battleEnemyId ? (window.MF_DATA.ENEMIES || []).find(e => e.id === ch.battleEnemyId) : null;
    return `
      <div class="card" style="padding:10px; margin-bottom:8px; opacity:${locked ? 0.55 : 1};">
        <div class="top-row">
          <strong style="font-size:12.5px;">${escapeHtml(ch.chapter)}：${escapeHtml(ch.title)}</strong>
          <span class="tag" style="${isCleared ? "background:#18b88a; color:#fff;" : ""}">${isCleared ? "クリア済" : (locked ? "🔒未解放" : "NEW")}</span>
        </div>
        <div style="font-size:11px; color:var(--muted); margin:3px 0;">
          ${escapeHtml(ch.subtitle)}${enemy ? ` ／ 戦闘：${enemy.emoji}${enemy.name}` : ""}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
          <span style="font-size:10px; font-weight:800;">初回報酬：💎+${ch.reward.gems} / 📘+${ch.reward.books} / 💠+${ch.reward.cores}</span>
          <button class="btn-xs ${locked ? "" : "btn-primary"}" ${locked ? "disabled" : ""} onclick="startStoryChapter('${ch.id}')">
            ${isCleared ? "読み直す" : "開始 ▶"}
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
  activeStory = { chapter: ch, scenes: list, isEpilogue, index: 0, replyLine: null, history: [] };
  playSfx("switch");
  renderStoryView();
}

function renderNovelScene() {
  const { chapter, scenes, isEpilogue, index, replyLine } = activeStory;
  const scene = scenes[index];
  const isLast = index >= scenes.length - 1;
  const speakerId = replyLine ? replyLine.speaker : scene.speaker;
  const text = replyLine ? replyLine.text : scene.text;
  const ch = getCharProfile(speakerId);

  document.getElementById("novel-chapter-title").textContent =
    `${chapter.chapter}${isEpilogue ? "（エピローグ）" : ""}（${index + 1}/${scenes.length}）`;
  document.getElementById("novel-location-bar").textContent = `📍 ${scene.loc || "ヴェルデ平原"}`;
  document.getElementById("novel-stage-portrait").innerHTML = window.MF_SPRITES.portraitHTML(ch, "contain");
  document.getElementById("novel-speaker-name").textContent = `${ch.name}（${ch.trait || "第7小隊"}）`;
  document.getElementById("novel-dialogue-text").textContent = text;

  // 会話ログ記録（重複防止）
  const lastLog = activeStory.history[activeStory.history.length - 1];
  if (!lastLog || lastLog.text !== text) {
    activeStory.history.push({ name: ch.name, text });
  }

  const choicesBox = document.getElementById("novel-choices");
  const nextBtn = document.getElementById("btn-novel-next");

  if (!replyLine && scene.choices && scene.choices.length > 0) {
    nextBtn.style.display = "none";
    choicesBox.style.display = "flex";
    choicesBox.innerHTML = scene.choices.map((c, idx) => `
      <button class="btn-primary" style="text-align:left; font-size:12px;" onclick="pickStoryChoice(${idx})">${escapeHtml(c.label)}</button>
    `).join("");
  } else {
    choicesBox.style.display = "none";
    nextBtn.style.display = "block";
    if (!isLast) nextBtn.textContent = "次へ ▶";
    else if (!isEpilogue && chapter.battleEnemyId) nextBtn.textContent = "⚔️ ストーリー戦闘へ突入！";
    else nextBtn.textContent = "✨ エピソード完了！次へ ▶";
  }
}

function openStoryBacklog() {
  if (!activeStory) return;
  const body = document.getElementById("story-log-body");
  body.innerHTML = activeStory.history.map(h => `
    <div style="text-align:left; background:var(--surface-sub); border-radius:9px; padding:7px 9px; margin-bottom:6px;">
      <strong style="font-size:11px; color:var(--accent);">${escapeHtml(h.name)}</strong>
      <div style="font-size:12px; line-height:1.45; margin-top:2px;">${escapeHtml(h.text)}</div>
    </div>
  `).join("");
  document.getElementById("modal-story-log").classList.add("active");
  playSfx("tap");
}

function closeStoryBacklog() {
  document.getElementById("modal-story-log").classList.remove("active");
}

function pickStoryChoice(choiceIdx) {
  const scene = activeStory.scenes[activeStory.index];
  const picked = scene.choices[choiceIdx];
  if (!picked) return;
  activeStory.history.push({ name: state.playerName, text: picked.label });
  if (picked.bondChar) {
    state.bondPoints = state.bondPoints || {};
    state.bondPoints[picked.bondChar] = (state.bondPoints[picked.bondChar] || 0) + 1;
    saveGame();
    showToast(`💞 ${getCharProfile(picked.bondChar).name}との絆が深まった！`);
  }
  activeStory.replyLine = { speaker: picked.replySpeaker, text: picked.reply };
  playSfx("switch");
  renderNovelScene();
}

function advanceNovelScene() {
  if (!activeStory) return;
  const { chapter, scenes, isEpilogue, index } = activeStory;
  if (activeStory.replyLine) {
    activeStory.replyLine = null; activeStory.index += 1; playSfx("tap"); renderNovelScene(); return;
  }
  if (index < scenes.length - 1) {
    activeStory.index += 1; playSfx("tap"); renderNovelScene(); return;
  }

  const chRef = chapter;
  activeStory = null;

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
      if (chRef.epilogue && chRef.epilogue.length > 0) {
        setTimeout(() => startStoryChapter(chRef.id, true), 120);
      }
    }
  });
}

function completeStoryChapter(ch) {
  state.clearedStories = state.clearedStories || [];
  if (!state.clearedStories.includes(ch.id)) {
    state.clearedStories.push(ch.id);
    state.gems += ch.reward.gems;
    state.credits += ch.reward.credits;
    state.expBooks = (state.expBooks || 0) + ch.reward.books;
    state.cores = (state.cores || 0) + ch.reward.cores;
    saveGame();
    showToast(`📖 ${ch.chapter} 初回クリア！💎+${ch.reward.gems} 獲得！`);
  }
}

function closeNovelStage() { activeStory = null; renderStoryView(); }

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
            <span style="font-size:10px; color:var(--muted);">全4フロア分岐探索 → エリア主霧獣決戦</span>
            <button class="btn-xs ${locked ? "" : "btn-accent2"}" ${locked ? "disabled" : ""} onclick="startExpedition('${r.id}')">開拓開始 ▶</button>
          </div>
        </div>
      `;
    }).join("");
    return;
  }

  startBox.style.display = "none"; runBox.style.display = "block";
  const reg = expRun.region;
  document.getElementById("exp-run-title").textContent = `${reg.name.split("：")[1] || reg.name}（FLOOR ${expRun.floor} / 4）`;
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
      [{ type: "battle", icon: "⚔️", title: "霧獣の縄張り", desc: "通常霧獣と交戦。手堅く素材を稼ぐ", enemyId: reg.normalId }, { type: "event", icon: "❓", title: "霧の廃墟探索", desc: "ランダムイベント発生！選択肢で報酬獲得" }],
      [{ type: "radiant", icon: "🌟", title: "【融光種】強敵反応", desc: "危険な変異種に挑む！豪華レア報酬", enemyId: reg.radiantId || reg.eliteId }, { type: "camp", icon: "🏕️", title: "前線野営キャンプ", desc: "安全に休憩。攻撃力+20%＆作戦記録獲得" }],
      [{ type: "battle", icon: "🪲", title: "精鋭霧獣の待ち伏せ", desc: "精鋭個体とのバトル。ボス前の腕試し", enemyId: reg.eliteId }, { type: "event", icon: "🧰", title: "古代物資の隠し部屋", desc: "補給チャンス！運が良ければ結晶石も" }],
      [{ type: "boss", icon: "👑", title: "エリア主霧獣・決戦！", desc: "踏破するとエリア希少素材＆結晶石+160！", enemyId: reg.bossId }]
    ]
  };
  playSfx("switch"); renderStoryView();
}

function enterExpeditionNode(nodeIdx) {
  if (!expRun) return;
  const node = expRun.floors[expRun.floor - 1][nodeIdx];
  if (!node) return;
  playSfx("tap");
  if (node.type === "camp") {
    expRun.atkBuff += 20; state.expBooks = (state.expBooks || 0) + 4; saveGame();
    showToast("🏕️ 野営キャンプで英気を養った！攻撃力+20% / 作戦記録+4");
    advanceExpeditionFloor(); return;
  }
  if (node.type === "event") {
    expRun.activeEvent = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
    renderExpeditionPanel(); return;
  }
  const isBoss = node.type === "boss";
  switchView("battle");
  startBattle(node.enemyId, { returnView: "story", extraAtkBuff: expRun.atkBuff, onWin: () => { if (isBoss) finishExpeditionRun(); else advanceExpeditionFloor(); } });
}

function resolveExpeditionEvent(choiceIdx) {
  if (!expRun || !expRun.activeEvent) return;
  const eff = expRun.activeEvent.choices[choiceIdx]?.effect;
  state.materials = state.materials || {};
  const rare = expRun.region.rareDrop;
  if (eff === "safe_loot") { state.materials[rare] = (state.materials[rare] || 0) + 2; state.credits += 1500; showToast(`🔧 解除成功！『${rare}』×2 と 🪙1,500！`); }
  else if (eff === "risk_loot") {
    if (Math.random() < 0.65) { state.gems += 120; state.materials[rare] = (state.materials[rare] || 0) + 3; showToast(`✨ 大当たり！💎+120 / 『${rare}』×3！`); }
    else { state.credits += 600; showToast("💥 警報作動！🪙600だけ回収して脱出！"); }
  } else if (eff === "rest_buff") { expRun.atkBuff += 15; state.expBooks = (state.expBooks || 0) + 5; showToast("💧 リフレッシュ！攻撃力+15% / 記録+5"); }
  else { state.gems += 80; state.materials["アーク結晶鉱"] = (state.materials["アーク結晶鉱"] || 0) + 2; showToast("⛏️ 結晶採取！💎+80 / 結晶鉱×2"); }
  expRun.activeEvent = null; saveGame(); playSfx("gift"); advanceExpeditionFloor();
}

function advanceExpeditionFloor() { if (!expRun) return; expRun.floor += 1; renderExpeditionPanel(); }
function finishExpeditionRun() {
  if (!expRun) return;
  const rare = expRun.region.rareDrop;
  state.gems += 160; state.materials = state.materials || {};
  state.materials[rare] = (state.materials[rare] || 0) + 3;
  state.expBooks = (state.expBooks || 0) + 8; expRun = null; saveGame();
  showToast(`👑 開拓マップ完全踏破！💎+160 / 『${rare}』×3 獲得！`);
}
function abandonExpedition() { if (confirm("現在の開拓探索を中断しますか？")) { expRun = null; renderExpeditionPanel(); } }
