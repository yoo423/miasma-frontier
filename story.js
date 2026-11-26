let currentStoryTab = "chapters";
let activeStory = null;
let expRun = null;

const STORY_CHAPTERS = [
  {
    id: "ch1",
    title: "第1章：地上降下と第7クリアラー小隊",
    subtitle: "ヴェルデ平原・前線キャンプ設営",
    battleEnemyId: "wolf_pack",
    reward: { gems: 160, credits: 2500, books: 6, cores: 1 },
    scenes: [
      { speaker: "aoi", text: "隊長、地上降下シークエンス完了しました！ここが新緑の廃墟『ヴェルデ平原』です。" },
      { speaker: "momo", text: "わぁ〜っ！方舟都市から見てたよりずっと広いね！なんだか美味しそうな匂いもするよっ！" },
      { speaker: "mint", text: "……モモ、それたぶん霧獣の匂い。耳を澄ますと、すぐそこの茂みから足音が聞こえる……。" },
      {
        speaker: "protagonist",
        text: "前方にミアズマ反応あり。第7クリアラー小隊、最初の指示を出すぞ。",
        choices: [
          { label: "「まずはモモと俺で前に出る！ミントは援護を！」", replySpeaker: "momo", reply: "任せて隊長！双剣の連続斬りで一気に決めちゃうよ！", bondChar: "momo" },
          { label: "「ミントの索敵を信じる。弱点を見極めてから仕掛けよう」", replySpeaker: "mint", reply: "……うん。隊長がそう言ってくれるなら、外さないから。", bondChar: "mint" }
        ]
      },
      { speaker: "aoi", text: "ミアズマ・ウルフの群れが接近！隊長、カードチェインの指揮をお願いします！" }
    ]
  },
  {
    id: "ch2",
    title: "第2章：紅蓮の大剣と白狐の巫女",
    subtitle: "濃霧の遺跡・救援シグナル",
    reqClear: "ch1",
    battleEnemyId: "crystal_beetle",
    reward: { gems: 240, credits: 4000, books: 10, cores: 2 },
    scenes: [
      { speaker: "lunaria", text: "はっ！そんな硬い甲殻、あたしの大剣と炎でまとめて焼き払ってあげるわよ！" },
      { speaker: "mikoto", text: "ルナリア殿、力押しだけでは霧が濃くなります。……あら、そちらは第7小隊の隊長殿ですね。" },
      { speaker: "aoi", text: "前衛エースのルナリアさんに、氷華使いのミコトさん！？お二人も調査中でしたか！" },
      {
        speaker: "lunaria",
        text: "ちょうど結晶甲虫の装甲が硬くて手こずってたところ！隊長、どっちの作戦でいく？",
        choices: [
          { label: "「ルナリアの炎とミコトの氷で『融解』コンボを狙おう！」", replySpeaker: "lunaria", reply: "いいじゃない！あんた、なかなか戦術わかってるわね！", bondChar: "lunaria" },
          { label: "「ミコトの凍結で動きを止めて、安全に装甲を割ろう」", replySpeaker: "mikoto", reply: "堅実なご判断です。では私の氷華に続けてくださいませ。", bondChar: "mikoto" }
        ]
      },
      { speaker: "mikoto", text: "敵が装甲を硬化させました。『崩し』カードで殻を砕き、一気に決着をつけましょう。" }
    ]
  },
  {
    id: "ch3",
    title: "第3章：ヴェルデ平原の主霧獣",
    subtitle: "決戦！モス・ベヒーモス討伐作戦",
    reqClear: "ch2",
    battleEnemyId: "moss_behemoth",
    reward: { gems: 320, credits: 6500, books: 16, cores: 4 },
    scenes: [
      { speaker: "celestia", text: "通信接続。こちらセレスティア。高台から観測中……前方、極めて巨大な生体反応を確認しました。" },
      { speaker: "mint", text: "地面が揺れてる……！あれがヴェルデ平原の主霧獣、『モス・ベヒーモス』……！" },
      { speaker: "momo", text: "うわっ、すごくデカい角！でもあの角を壊したら、すごく強い武器が作れそうじゃない！？" },
      {
        speaker: "celestia",
        text: "狙撃の照準は合わせました。隊長、主霧獣への突入合図をどうぞ。",
        choices: [
          { label: "「全員、部位破壊を狙う！角を折って弱体化させるぞ！」", replySpeaker: "celestia", reply: "了解。結晶角へマーキングを送信します。撃ち抜きますよ。", bondChar: "celestia" },
          { label: "「相手のチャージを見極めて、カウンターと崩しで迎え撃つ！」", replySpeaker: "aoi", reply: "さすが隊長！冷静な指揮があれば、主霧獣にも負けません！", bondChar: "aoi" }
        ]
      },
      { speaker: "protagonist", text: "第7クリアラー小隊、総員戦闘配置！主霧獣『モス・ベヒーモス』を討伐する！" }
    ]
  }
];

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
  }
];

function renderStoryView() {
  renderTopBar();
  document.getElementById("story-tab-chapters").className =
    `select-chip ${currentStoryTab === "chapters" ? "selected" : ""}`;
  document.getElementById("story-tab-map").className =
    `select-chip ${currentStoryTab === "map" ? "selected" : ""}`;

  document.getElementById("story-novel-panel").style.display = activeStory ? "block" : "none";
  document.getElementById("story-chapters-panel").style.display =
    !activeStory && currentStoryTab === "chapters" ? "block" : "none";
  document.getElementById("story-map-panel").style.display =
    !activeStory && currentStoryTab === "map" ? "block" : "none";

  if (activeStory) {
    renderNovelScene();
  } else if (currentStoryTab === "chapters") {
    renderChapterList();
  } else {
    renderExpeditionPanel();
  }
}

function setStoryTab(tab) {
  currentStoryTab = tab;
  activeStory = null;
  playSfx("tap");
  renderStoryView();
}

function renderChapterList() {
  const cleared = state.clearedStories || [];
  document.getElementById("story-chapter-list").innerHTML = STORY_CHAPTERS.map(ch => {
    const isCleared = cleared.includes(ch.id);
    const locked = ch.reqClear && !cleared.includes(ch.reqClear);
    const enemy = (window.MF_DATA.ENEMIES || []).find(e => e.id === ch.battleEnemyId);
    return `
      <div class="card" style="padding:10px; margin-bottom:8px; opacity:${locked ? 0.55 : 1};">
        <div class="top-row">
          <strong style="font-size:13px;">📖 ${escapeHtml(ch.title)}</strong>
          <span class="tag" style="${isCleared ? "background:#18b88a; color:#fff;" : ""}">
            ${isCleared ? "クリア済" : (locked ? "🔒未解放" : "NEW")}
          </span>
        </div>
        <div style="font-size:11px; color:var(--muted); margin:3px 0;">
          ${escapeHtml(ch.subtitle)} ／ 目標：${enemy ? `${enemy.emoji}${enemy.name}` : "調査"}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
          <span style="font-size:10px; font-weight:800;">
            初回報酬：💎+${ch.reward.gems} / 📘+${ch.reward.books} / 💠+${ch.reward.cores}
          </span>
          <button class="btn-xs ${locked ? "" : "btn-primary"}" ${locked ? "disabled" : ""}
                  onclick="startStoryChapter('${ch.id}')">
            ${isCleared ? "もう一度読む" : "物語を開始 ▶"}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function startStoryChapter(chId) {
  const ch = STORY_CHAPTERS.find(c => c.id === chId);
  if (!ch) return;
  activeStory = { chapter: ch, index: 0, replyLine: null };
  playSfx("switch");
  renderStoryView();
}

function renderNovelScene() {
  const { chapter, index, replyLine } = activeStory;
  const scene = chapter.scenes[index];
  const isLast = index >= chapter.scenes.length - 1;

  const speakerId = replyLine ? replyLine.speaker : scene.speaker;
  const text = replyLine ? replyLine.text : scene.text;
  const ch = getCharProfile(speakerId);

  document.getElementById("novel-chapter-title").textContent =
    `${chapter.title}（${index + 1}/${chapter.scenes.length}）`;
  document.getElementById("novel-stage-portrait").innerHTML =
    window.MF_SPRITES.portraitHTML(ch, "contain");
  document.getElementById("novel-speaker-name").textContent =
    `${ch.name}（${ch.trait || "第7小隊"}）`;
  document.getElementById("novel-dialogue-text").textContent = text;

  const choicesBox = document.getElementById("novel-choices");
  const nextBtn = document.getElementById("btn-novel-next");

  if (!replyLine && scene.choices && scene.choices.length > 0) {
    nextBtn.style.display = "none";
    choicesBox.style.display = "flex";
    choicesBox.innerHTML = scene.choices.map((c, idx) => `
      <button class="btn-primary" style="text-align:left; font-size:12px;"
              onclick="pickStoryChoice(${idx})">${escapeHtml(c.label)}</button>
    `).join("");
  } else {
    choicesBox.style.display = "none";
    nextBtn.style.display = "block";
    nextBtn.textContent = isLast ? "⚔️ ストーリー戦闘へ突入！" : "次へ ▶";
  }
}

function pickStoryChoice(choiceIdx) {
  const scene = activeStory.chapter.scenes[activeStory.index];
  const picked = scene.choices[choiceIdx];
  if (!picked) return;
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
  const { chapter, index } = activeStory;
  if (activeStory.replyLine) {
    activeStory.replyLine = null;
    activeStory.index += 1;
    playSfx("tap");
    renderNovelScene();
    return;
  }
  if (index < chapter.scenes.length - 1) {
    activeStory.index += 1;
    playSfx("tap");
    renderNovelScene();
    return;
  }

  // 会話完了 → ストーリー戦闘を起動
  const chRef = chapter;
  activeStory = null;
  switchView("battle");
  startBattle(chRef.battleEnemyId, {
    returnView: "story",
    onWin: () => completeStoryChapter(chRef)
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
    showToast(`📖 ${ch.title} 初回クリア！💎+${ch.reward.gems} 獲得！`);
  } else {
    showToast(`📖 ${ch.title} をクリアしました！`);
  }
}

function closeNovelStage() {
  activeStory = null;
  renderStoryView();
}

// ---------- 分岐ルート開拓マップ（ローグライク風4フロア冒険） ----------
function renderExpeditionPanel() {
  const startBox = document.getElementById("exp-region-select");
  const runBox = document.getElementById("exp-run-board");

  if (!expRun) {
    startBox.style.display = "block";
    runBox.style.display = "none";
    document.getElementById("exp-region-list").innerHTML = (window.MF_DATA.REGIONS || []).map(r => {
      const locked = state.playerRank < r.reqRank;
      return `
        <div class="card" style="padding:10px; margin-bottom:8px; opacity:${locked ? 0.55 : 1};">
          <div class="top-row">
            <strong style="font-size:12px;">🗺️ ${escapeHtml(r.name)}</strong>
            <span class="tag">${locked ? `🔒開拓Lv.${r.reqRank}` : `希少：${r.rareDrop}`}</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
            <span style="font-size:10px; color:var(--muted);">全4フロア分岐探索 → エリア主霧獣決戦</span>
            <button class="btn-xs ${locked ? "" : "btn-accent2"}" ${locked ? "disabled" : ""}
                    onclick="startExpedition('${r.id}')">開拓開始 ▶</button>
          </div>
        </div>
      `;
    }).join("");
    return;
  }

  startBox.style.display = "none";
  runBox.style.display = "block";
  const reg = expRun.region;
  document.getElementById("exp-run-title").textContent =
    `${reg.name.split("：")[1] || reg.name}（FLOOR ${expRun.floor} / 4）`;
  document.getElementById("exp-run-status").textContent =
    `🔥 探索攻撃バフ：+${expRun.atkBuff}% ｜ 獲得予定希少素材：${reg.rareDrop}`;

  const eventBox = document.getElementById("exp-event-box");
  const nodesBox = document.getElementById("exp-nodes-grid");

  if (expRun.activeEvent) {
    nodesBox.style.display = "none";
    eventBox.style.display = "block";
    const ev = expRun.activeEvent;
    eventBox.innerHTML = `
      <div class="card" style="background:var(--surface-sub);">
        <strong style="font-size:14px;">❓ ${escapeHtml(ev.title)}</strong>
        <p style="font-size:12px; margin:6px 0 10px; line-height:1.45;">${escapeHtml(ev.desc)}</p>
        <div style="display:flex; flex-direction:column; gap:6px;">
          ${ev.choices.map((c, i) => `
            <button class="btn-primary" style="text-align:left; font-size:12px;"
                    onclick="resolveExpeditionEvent(${i})">${escapeHtml(c.label)}</button>
          `).join("")}
        </div>
      </div>
    `;
    return;
  }

  eventBox.style.display = "none";
  nodesBox.style.display = "grid";
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
    region: reg,
    floor: 1,
    atkBuff: 0,
    activeEvent: null,
    floors: [
      [
        { type: "battle", icon: "⚔️", title: "霧獣の縄張り", desc: "通常霧獣と交戦。手堅く素材を稼ぐ", enemyId: reg.normalId },
        { type: "event",  icon: "❓", title: "霧の廃墟探索", desc: "ランダムイベント発生！選択肢で報酬獲得" }
      ],
      [
        { type: "radiant", icon: "🌟", title: "【融光種】強敵反応", desc: "危険な変異種に挑む！豪華レア報酬", enemyId: reg.radiantId || reg.eliteId },
        { type: "camp",    icon: "🏕️", title: "前線野営キャンプ", desc: "安全に休憩。この探索中の攻撃力+20%＆記録獲得" }
      ],
      [
        { type: "battle", icon: "🪲", title: "精鋭霧獣の待ち伏せ", desc: "精鋭個体とのバトル。ボス前の腕試し", enemyId: reg.eliteId },
        { type: "event",  icon: "🧰", title: "古代物資の隠し部屋", desc: "補給チャンス！運が良ければ結晶石も" }
      ],
      [
        { type: "boss",   icon: "👑", title: "エリア主霧獣・決戦！", desc: "踏破するとエリア希少素材＆結晶石+160！", enemyId: reg.bossId }
      ]
    ]
  };
  playSfx("switch");
  renderStoryView();
}

function enterExpeditionNode(nodeIdx) {
  if (!expRun) return;
  const node = expRun.floors[expRun.floor - 1][nodeIdx];
  if (!node) return;
  playSfx("tap");

  if (node.type === "camp") {
    expRun.atkBuff += 20;
    state.expBooks = (state.expBooks || 0) + 4;
    saveGame();
    showToast("🏕️ 野営キャンプで英気を養った！探索攻撃力+20% / 作戦記録+4");
    advanceExpeditionFloor();
    return;
  }

  if (node.type === "event") {
    expRun.activeEvent = RANDOM_EVENTS[Math.floor(Math.random() * RANDOM_EVENTS.length)];
    renderExpeditionPanel();
    return;
  }

  // バトル・融光種・エリアボス戦へ
  const isBoss = node.type === "boss";
  switchView("battle");
  startBattle(node.enemyId, {
    returnView: "story",
    extraAtkBuff: expRun.atkBuff,
    onWin: () => {
      if (isBoss) finishExpeditionRun();
      else advanceExpeditionFloor();
    }
  });
}

function resolveExpeditionEvent(choiceIdx) {
  if (!expRun || !expRun.activeEvent) return;
  const eff = expRun.activeEvent.choices[choiceIdx]?.effect;
  state.materials = state.materials || {};
  const rare = expRun.region.rareDrop;

  if (eff === "safe_loot") {
    state.materials[rare] = (state.materials[rare] || 0) + 2;
    state.credits += 1500;
    showToast(`🔧 解除成功！『${rare}』×2 と 🪙1,500 を入手！`);
  } else if (eff === "risk_loot") {
    if (Math.random() < 0.65) {
      state.gems += 120;
      state.materials[rare] = (state.materials[rare] || 0) + 3;
      showToast(`✨ 大当たり！💎結晶石+120 / 『${rare}』×3 を獲得！`);
    } else {
      state.credits += 600;
      showToast("💥 警報が作動！わずかなクレジット(🪙600)だけ回収して脱出！");
    }
  } else if (eff === "rest_buff") {
    expRun.atkBuff += 15;
    state.expBooks = (state.expBooks || 0) + 5;
    showToast("💧 湧き水でリフレッシュ！攻撃力+15% / 作戦記録+5");
  } else {
    state.gems += 80;
    state.materials["アーク結晶鉱"] = (state.materials["アーク結晶鉱"] || 0) + 2;
    showToast("⛏️ 結晶を採取！💎+80 / アーク結晶鉱×2");
  }

  expRun.activeEvent = null;
  saveGame();
  playSfx("gift");
  advanceExpeditionFloor();
}

function advanceExpeditionFloor() {
  if (!expRun) return;
  expRun.floor += 1;
  renderExpeditionPanel();
}

function finishExpeditionRun() {
  if (!expRun) return;
  const rare = expRun.region.rareDrop;
  state.gems += 160;
  state.materials = state.materials || {};
  state.materials[rare] = (state.materials[rare] || 0) + 3;
  state.expBooks = (state.expBooks || 0) + 8;
  expRun = null;
  saveGame();
  showToast(`👑 開拓マップ完全踏破！💎+160 / 『${rare}』×3 を獲得！`);
}

function abandonExpedition() {
  if (confirm("現在の開拓探索を中断してエリア選択に戻りますか？")) {
    expRun = null;
    renderExpeditionPanel();
  }
}
