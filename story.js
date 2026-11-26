let currentStoryTab = "chapters";
let activeStory = null;
let expRun = null;

const STORY_CHAPTERS = [
  {
    id: "ch0",
    title: "序章：方舟都市リベルタの誓い",
    subtitle: "プロローグ（会話劇のみ・初回報酬あり）",
    battleEnemyId: null,
    reward: { gems: 160, credits: 2000, books: 5, cores: 1 },
    scenes: [
      { speaker: "chloe", text: "……百年前、未知のエネルギー結晶『アーク』の暴走によって、大地は紫色の瘴霧『ミアズマ』に覆われました。" },
      { speaker: "chloe", text: "人類は空に浮かぶ『方舟都市リベルタ』へ逃れましたが……都市のエネルギー炉も、あと数年で限界を迎えます。" },
      { speaker: "aoi", text: "だからこそ、私たち『クリアラー（霧祓い）』が地上へ降り、霧を晴らして人類の新しい故郷を取り戻すんです！" },
      { speaker: "momo", text: "へへっ！難しいことはクロエさんに任せて、あたしは隊長と一緒に美味しいもの見つけて霧獣をぶっ飛ばすよ！" },
      { speaker: "mint", text: "……モモ、降下ポッドの中で跳ねないで。酔う……。でも、隊長が指揮なら、わたしはついていくよ。" },
      {
        speaker: "protagonist",
        text: "降下ハッチ開放まで残り10秒。第7クリアラー小隊、地上への第一歩を踏み出す前に一言伝えるぞ。",
        choices: [
          { label: "「全員生きて、この手で地上を取り戻そう！」", replySpeaker: "aoi", reply: "はいっ！隊長、どこまでもお供します！第7クリアラー小隊、降下開始！", bondChar: "aoi" },
          { label: "「まずは安全第一。美味しいキャンプ飯を作る余裕を残そうな」", replySpeaker: "momo", reply: "やったぁ！隊長わかってるぅ！降りたらすぐ特製シチュー作るね！", bondChar: "momo" }
        ]
      },
      { speaker: "chloe", text: "通信は繋いだままにしておきますね。……気をつけて。地上のミアズマは、最近奇妙な『光』を帯び始めているようです。" }
    ]
  },
  {
    id: "ch1",
    title: "第1章：新緑の廃墟と瘴霧の狼群",
    subtitle: "ヴェルデ平原・前線キャンプ設営作戦",
    reqClear: "ch0",
    battleEnemyId: "wolf_pack",
    reward: { gems: 160, credits: 2500, books: 6, cores: 1 },
    scenes: [
      { speaker: "aoi", text: "降下ポッド、着地成功！ここがかつての地上都市の跡地……新緑の廃墟『ヴェルデ平原』です。" },
      { speaker: "mint", text: "……風は涼しいけど、霧の向こうに鋭い気配が複数。目が光ってる……ミアズマ・ウルフの群れ。" },
      { speaker: "momo", text: "おおっ、初仕事だね！あたしの炎の双剣で一気に突っ込んでいい！？" },
      { speaker: "aoi", text: "待ってモモ！敵の攻撃を闇雲に受けるより、隊長のカードチェインで属性連携を組むのが基本よ！" },
      {
        speaker: "protagonist",
        text: "ウルフの群れが包囲してきた。第7小隊、初陣の戦術を決めるぞ。",
        choices: [
          { label: "「モモの炎とミントの風で『拡散』コンボを叩き込む！」", replySpeaker: "momo", reply: "よっしゃあ！燃え上がれーっ！ミント、風でドーンと広げてね！", bondChar: "momo" },
          { label: "「敵の攻撃予兆を見極めて、防御とカウンターで確実に仕留める」", replySpeaker: "mint", reply: "……冷静な指示。うん、相手の隙はわたしが全部見抜いてあげる。", bondChar: "mint" }
        ]
      },
      { speaker: "aoi", text: "前線キャンプ予定地を確保します！全員、カード展開！戦闘開始！" }
    ]
  },
  {
    id: "ch2",
    title: "第2章：紅蓮の大剣と白狐の巫女",
    subtitle: "濃霧の遺跡・先遣エース隊との合流",
    reqClear: "ch1",
    battleEnemyId: "crystal_beetle",
    reward: { gems: 240, credits: 4000, books: 10, cores: 2 },
    scenes: [
      { speaker: "kaede", text: "はーい、キャンプ設営おつかれさま！って、あれ？東の遺跡からすごい爆音が聞こえたよ！？" },
      { speaker: "lunaria", text: "くっ……この甲虫、殻が硬すぎるわね！あたしの炎の大剣を弾くなんて生意気じゃない！" },
      { speaker: "mikoto", text: "ルナリア殿、力任せに振るっては体力を消耗するだけです。……あら、あちらに新任の第7小隊の皆様が。" },
      { speaker: "aoi", text: "前衛エースのルナリアさんに、極氷の巫女ミコトさん！？すぐ援護に入ります！" },
      { speaker: "lunaria", text: "あんたが噂の新人隊長ね！ちょうどいい、この結晶甲虫『重装種』の硬い殻を一緒に叩き割るわよ！" },
      { speaker: "mikoto", text: "敵は防御を固める『装甲硬化』を使ってきます。通常の攻撃は半減されますので、『崩し』札で殻を砕くのが定石ですよ。" },
      {
        speaker: "lunaria",
        text: "さあ隊長、あんたの指揮を見せてもらおうじゃない！あたしとミコト、どっちを軸に攻める？",
        choices: [
          { label: "「ミコトの氷からルナリアの炎へ繋ぐ『融解 2.2倍』で焼き切る！」", replySpeaker: "lunaria", reply: "最高じゃない！あんた、あたしと気が合いそうね！一撃で終わらせてやるわ！", bondChar: "lunaria" },
          { label: "「ミコトの凍結と崩しカードで敵の動きを完封してから畳み掛ける」", replySpeaker: "mikoto", reply: "お見事な戦術眼です。では、私の氷華で敵を縛り上げましょう。", bondChar: "mikoto" }
        ]
      },
      { speaker: "mikoto", text: "甲虫が殻を硬化させました。隊長殿、見事なカード采配を期待しておりますよ。" }
    ]
  },
  {
    id: "ch3",
    title: "第3章：地鳴りの巨獣と封印の真実",
    subtitle: "決戦！ヴェルデ平原の主『モス・ベヒーモス』",
    reqClear: "ch2",
    battleEnemyId: "moss_behemoth",
    reward: { gems: 320, credits: 6500, books: 16, cores: 4 },
    scenes: [
      { speaker: "chloe", text: "大変です隊長！先ほどの遺跡から古い記録ディスクを解読したんですが……とんでもないことが書かれてました！" },
      { speaker: "valeria", text: "方舟都市の名門として確認しておきますわ。その記録に何が記されていたのですか？" },
      { speaker: "chloe", text: "ミアズマは自然災害じゃありません……百年前の研究機関が、地上の『主霧獣』を封じるために霧で覆った可能性が高いんです！" },
      { speaker: "celestia", text: "緊急割り込み通信。高台より狙撃観測中のセレスティアです。……議論は後回しにしてください。地面が割れました。" },
      { speaker: "mint", text: "すごい地響き……！古代樹と結晶を背負った巨大な影……ヴェルデ平原の主霧獣『モス・ベヒーモス』が起きた……！" },
      { speaker: "lunaria", text: "あんなバケモノが眠ってたなんてね！でも、ここで退いたらキャンプのみんなが危ない！" },
      { speaker: "celestia", text: "頭部の『結晶の巨角』に膨大なエネルギーが集中しています。あそこを部位破壊できれば、敵の火力は大きく落ちます。" },
      {
        speaker: "protagonist",
        text: "主霧獣モス・ベヒーモスがこちらを睨みつけている。小隊全員へ最終作戦を伝える！",
        choices: [
          { label: "「狙うは巨角の部位破壊！セレスティア、援護を頼む！」", replySpeaker: "celestia", reply: "了解しました隊長。標的ロック完了……いつでも撃ち抜きます。", bondChar: "celestia" },
          { label: "「大技チャージを『崩し』と『カウンター』で凌ぎ切って逆転する！」", replySpeaker: "valeria", reply: "見事な覚悟ですわ！このヴァレリアの槍が、必ず活路を切り開きます！", bondChar: "valeria" }
        ]
      },
      { speaker: "protagonist", text: "第7クリアラー小隊、全力出撃！ヴェルデ平原の主霧獣を討伐する！" }
    ]
  },
  {
    id: "ch4",
    title: "第4章：雷鳴の峡谷と黄金の変異",
    subtitle: "ヴォルト・キャニオン〜『融光種』の目覚め",
    reqClear: "ch3",
    battleEnemyId: "thunder_wyvern",
    reward: { gems: 480, credits: 10000, books: 24, cores: 6 },
    scenes: [
      { speaker: "sylphy", text: "おいおい、ヴェルデの主を本当に倒しちまったのか？新入り隊長の噂はここまで届いてるぜ！" },
      { speaker: "koharu", text: "わーい、第7小隊のみんなだ！ここは第2エリア『ヴォルト・キャニオン』。雷がバチバチ降ってくる危険地帯だよ！" },
      { speaker: "chloe", text: "通信越しでもわかります……この峡谷のアーク結晶濃度、異常値です。霧獣が過剰エネルギーを吸って黄金に変異する『融光種』の兆候が……！" },
      { speaker: "sylphy", text: "ふん、俺の鼻がさっきから焦げ臭い雷の匂いを拾ってる。空を見ろ、雷雲を引き連れたデカブツのお出ましだ！" },
      { speaker: "celestia", text: "確認しました。第2エリアの主霧獣『サンダー・ワイバーン』……翼の放電器官が、すでに黄金の光を帯び始めています。" },
      { speaker: "koharu", text: "あれが完全に『融光種』へ変異する前に止めないと、峡谷の工場ラインが丸焼けになっちゃうよ！" },
      {
        speaker: "sylphy",
        text: "へっ、燃えてきたぜ！隊長、空を飛ぶ雷竜相手にどう料理する気だ？",
        choices: [
          { label: "「シルフィのスピードで風拡散を連発し、一気に体勢を崩す！」", replySpeaker: "sylphy", reply: "気に入ったぜ隊長！俺の双剣で雷雲ごと切り裂いてやるよ！", bondChar: "sylphy" },
          { label: "「コハルの重槌と崩し札で翼を砕き、地上に叩き落とす！」", replySpeaker: "koharu", reply: "任せて！特製ショックハンマーで一発お見舞いしてあげるっ！", bondChar: "koharu" }
        ]
      },
      { speaker: "protagonist", text: "雷鳴を突き抜けろ！第7クリアラー小隊、サンダー・ワイバーン迎撃戦、開始！" }
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
  document.getElementById("story-chapter-list").innerHTML = STORY_CHAPTERS.map(ch => {
    const isCleared = cleared.includes(ch.id);
    const locked = ch.reqClear && !cleared.includes(ch.reqClear);
    const enemy = ch.battleEnemyId ? (window.MF_DATA.ENEMIES || []).find(e => e.id === ch.battleEnemyId) : null;
    return `
      <div class="card" style="padding:10px; margin-bottom:8px; opacity:${locked ? 0.55 : 1};">
        <div class="top-row">
          <strong style="font-size:13px;">📖 ${escapeHtml(ch.title)}</strong>
          <span class="tag" style="${isCleared ? "background:#18b88a; color:#fff;" : ""}">${isCleared ? "クリア済" : (locked ? "🔒未解放" : "NEW")}</span>
        </div>
        <div style="font-size:11px; color:var(--muted); margin:3px 0;">
          ${escapeHtml(ch.subtitle)}${enemy ? ` ／ 目標：${enemy.emoji}${enemy.name}` : ""}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
          <span style="font-size:10px; font-weight:800;">初回報酬：💎+${ch.reward.gems} / 📘+${ch.reward.books} / 💠+${ch.reward.cores}</span>
          <button class="btn-xs ${locked ? "" : "btn-primary"}" ${locked ? "disabled" : ""} onclick="startStoryChapter('${ch.id}')">
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

  document.getElementById("novel-chapter-title").textContent = `${chapter.title}（${index + 1}/${chapter.scenes.length}）`;
  document.getElementById("novel-stage-portrait").innerHTML = window.MF_SPRITES.portraitHTML(ch, "contain");
  document.getElementById("novel-speaker-name").textContent = `${ch.name}（${ch.trait || "第7小隊"}）`;
  document.getElementById("novel-dialogue-text").textContent = text;

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
    nextBtn.textContent = isLast ? (chapter.battleEnemyId ? "⚔️ ストーリー戦闘へ突入！" : "✨ 序章を完了して次へ ▶") : "次へ ▶";
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
    activeStory.replyLine = null; activeStory.index += 1; playSfx("tap"); renderNovelScene(); return;
  }
  if (index < chapter.scenes.length - 1) {
    activeStory.index += 1; playSfx("tap"); renderNovelScene(); return;
  }

  const chRef = chapter;
  activeStory = null;
  if (!chRef.battleEnemyId) {
    completeStoryChapter(chRef);
    playSfx("gift");
    renderStoryView();
    return;
  }
  switchView("battle");
  startBattle(chRef.battleEnemyId, { returnView: "story", onWin: () => completeStoryChapter(chRef) });
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
