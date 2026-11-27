let currentBondsTab = "members"; // "members" | "profile"
let activeBondStory = null;
let bondTypeTimer = null;
let bondIsTyping = false;
let bondFullText = "";

const BOND_EPISODES = {
  lunaria: {
    title: "紅蓮のリボンと本当の強さ",
    rewardTitle: "紅蓮の相棒",
    scenes: [
      { bg: "camp_dusk", speaker: "lunaria", text: "あ、隊長。こんな夕暮れにどうしたの？あたしは大剣の刃を研いでたところ。" },
      { bg: "camp_dusk", speaker: "lunaria", text: "……ねえ、この赤いリボン、なんで戦闘中でも外さないか知ってる？昔、方舟で初めて訓練に受かった日に、姉貴が結んでくれたんだ。" },
      { bg: "camp_dusk", speaker: "lunaria", text: "『どんなに強い敵と向き合っても、自分の誇りだけは折るな』ってね。……でも地上に降りて、あたし一人で突っ走るだけじゃ守れないものがあるってわかったよ。" },
      { bg: "camp_dusk", speaker: "lunaria", text: "あんたが後ろで冷静にカードと戦術を組んでくれるから、あたしは迷わず大剣を振り抜ける。……ほら、あんまりニヤニヤしないでよ！" },
      { bg: "camp_dusk", speaker: "lunaria", text: "これからもあたしの隣で指揮を執りなさいよね、隊長。……約束だからね！" }
    ]
  },
  mikoto: {
    title: "月夜の白狐、二人きりの茶会",
    rewardTitle: "白狐の契り",
    scenes: [
      { bg: "camp_night", speaker: "mikoto", text: "あら、隊長殿。夜風に当たっていらしたのですか？よろしければ、淹れたての氷花茶をどうぞ。" },
      { bg: "camp_night", speaker: "mikoto", text: "……ふふ、先ほどから私の尻尾を気にしておられますね。少しだけなら、触れてもよろしいですよ。隊長殿だけの特別ですわ。" },
      { bg: "camp_night", speaker: "mikoto", text: "古来より白狐の巫女は、災厄を封じるために独りで冷気を背負うものとされてきました。けれど、第7小隊の焚き火はこんなにも温かいのですね。" },
      { bg: "camp_night", speaker: "mikoto", text: "どれほど厳しい戦いが待っていようとも、私の氷華は常に隊長殿の傍らに咲かせましょう。どうか、ご無理だけはなさらずに。" }
    ]
  },
  celestia: {
    title: "スコープ越しの信頼",
    rewardTitle: "狙撃手の背中",
    scenes: [
      { bg: "camp_night", speaker: "celestia", text: "高台まで上がってこられるとは珍しいですね、隊長。ここからはキャンプ全体と平原の霧が一望できます。" },
      { bg: "camp_night", speaker: "celestia", text: "狙撃手という役割は常に孤独です。引き金を引く瞬間、頼れるのは自分の計算だけ……そう思い込んでいました。" },
      { bg: "camp_night", speaker: "celestia", text: "けれど今は違います。あなたが前線で敵の体勢を崩してくれると信じているから、私は迷わず照準を合わせられる。" },
      { bg: "camp_night", speaker: "celestia", text: "……少し照れくさいですね。今後とも、私の背中と狙撃をあなたにお預けします、隊長。" }
    ]
  },
  valeria: {
    title: "銀槍に誓う騎士道",
    rewardTitle: "蒼銀の誓約者",
    scenes: [
      { bg: "verde_morning", speaker: "valeria", text: "ごきげんよう、隊長。朝の鍛錬を終えたところですわ。よろしければ、少し歩きましょうか。" },
      { bg: "verde_morning", speaker: "valeria", text: "正直に告白いたしますと、最初は新任のあなたに方舟の未来を託せるのか、不安がなかったと言えば嘘になります。" },
      { bg: "verde_morning", speaker: "valeria", text: "ですが数々の死線を共に越え、迷いのない指揮を間近で見続けて、その疑念は確信へと変わりましたわ。" },
      { bg: "verde_morning", speaker: "valeria", text: "名門騎士の誇りに懸けて誓いましょう。このヴァレリアの槍は、あなたが目指す青空のために振るいますわ！" }
    ]
  },
  chloe: {
    title: "深夜の研究室と秘密のコーヒー",
    rewardTitle: "真理の共同研究者",
    scenes: [
      { bg: "ark_night", speaker: "chloe", text: "ふぁ……あっ、隊長！ちょうど良かった、徹夜明けの甘いコーヒーを二人分淹れたところなんです。" },
      { bg: "ark_night", speaker: "chloe", text: "私、ずっとデータと古代端末ばかり見て生きてきたから、誰かと一緒に行動するのってちょっと苦手だったんです。" },
      { bg: "ark_night", speaker: "chloe", text: "でも隊長は、私のマニアックな解析報告もいつも真剣に聞いてくれて……それがすっごく嬉しいんですよ。" },
      { bg: "ark_night", speaker: "chloe", text: "この世界の謎、絶対に二人で全部解き明かしましょうね！……あ、まず十分だけ仮眠してから！" }
    ]
  },
  sylphy: {
    title: "嵐を駆ける孤狼の牙",
    rewardTitle: "疾風の好敵手",
    scenes: [
      { bg: "forest_mist", speaker: "sylphy", text: "よぉ隊長！こんな風の強い日に見回りとは熱心だな。ほら、隣に座れよ。" },
      { bg: "forest_mist", speaker: "sylphy", text: "俺はずっと一匹狼でやってきた。群れると動きが鈍ると思ってたからな。……けど、あんたの戦術は別だ。" },
      { bg: "forest_mist", speaker: "sylphy", text: "俺のスピードに合わせて元素反応を繋いでくる指揮官なんて初めてだぜ。おかげで狩りが百倍楽しくなった。" },
      { bg: "forest_mist", speaker: "sylphy", text: "これからもデカい獲物を見つけたら真っ先に声をかけろよ！一番乗りでブッ飛ばしてやるからさ！" }
    ]
  },
  kaede: {
    title: "隊長だけの特製レシピ",
    rewardTitle: "前線食堂の常連",
    scenes: [
      { bg: "camp_dusk", speaker: "kaede", text: "あ、隊長！ちょうど新作のキャンプ飯を試作してたんだ。一番に味見してくれる？" },
      { bg: "camp_dusk", speaker: "kaede", text: "……おいしい？よかったぁ！実はね、隊長が疲れてる時でも元気が出るように、スパイスの配合をずっと研究してたんだよ。" },
      { bg: "camp_dusk", speaker: "kaede", text: "戦場に出るのは怖い時もあるけど、みんなが『美味しい』って笑ってくれる顔を見るために、私は今日も鍋を振るの。" },
      { bg: "camp_dusk", speaker: "kaede", text: "いつか霧が全部晴れたら、一番景色のいい場所に食堂を開こうね。隊長はずっと特等席だから！" }
    ]
  },
  koharu: {
    title: "油まみれの設計図と夢の街",
    rewardTitle: "頼れる相棒メカニック",
    scenes: [
      { bg: "camp_dusk", speaker: "koharu", text: "うーん、ここの歯車をもう少し締めれば……あっ、隊長！ほっぺに油ついてる？えへへ、気にしない気にしない！" },
      { bg: "camp_dusk", speaker: "koharu", text: "見て見て、これね、あたしがこっそり描いてる『未来の地上都市』の設計図なんだ！" },
      { bg: "camp_dusk", speaker: "koharu", text: "隊長の小隊が霧を晴らしてくれた場所に、風車と工房と、みんなが安心して眠れる家をいっぱい建てるのがあたしの夢なの。" },
      { bg: "camp_dusk", speaker: "koharu", text: "その日まで、隊長の装備はあたしがずっと最高の状態に整備してあげるからねっ！" }
    ]
  },
  momo: {
    title: "一番星と約束のハイタッチ",
    rewardTitle: "第7小隊のムードメーカー",
    scenes: [
      { bg: "camp_night", speaker: "momo", text: "わっ、隊長みーっけ！ねえねえ、今夜の空すっごく綺麗だから一緒に見上げようよ！" },
      { bg: "camp_night", speaker: "momo", text: "あたしね、最初は地上に降りるのちょっとだけ怖かったんだ。でも隊長がいつも先頭で笑ってくれるから、全部楽しくなっちゃった！" },
      { bg: "camp_night", speaker: "momo", text: "これからもあたしが一番に切り込んで道を空けるから、隊長は安心してついてきてね！せーの、ハイタッチ！" }
    ]
  },
  mint: {
    title: "静かな森と長い耳の秘密",
    rewardTitle: "静寂の観測パートナー",
    scenes: [
      { bg: "verde_morning", speaker: "mint", text: "……あ、隊長。足音ですぐわかったよ。隊長の歩き方は落ち着いてて、聞いてると安心するから。" },
      { bg: "verde_morning", speaker: "mint", text: "人混みや大きな音は昔から苦手だったけど……第7小隊のみんなの声と、隊長の指示だけは心地いいんだ。" },
      { bg: "verde_morning", speaker: "mint", text: "これからもどんな遠くの敵でも先に見つけてあげる。……ずっと、隊長の隣で観測手としていさせてね。" }
    ]
  },
  aoi: {
    title: "作戦日誌に記された感謝",
    rewardTitle: "第7小隊の誇り",
    scenes: [
      { bg: "camp_night", speaker: "aoi", text: "隊長、本日の物資点検と日誌の記録が完了いたしました。……あ、まだ少しお時間よろしいでしょうか。" },
      { bg: "camp_night", speaker: "aoi", text: "第7小隊が結成された日、私は正直、自分に副官の役目が務まるか毎日不安でいっぱいでした。" },
      { bg: "camp_night", speaker: "aoi", text: "けれど隊長がどんな時も私たちを信じて任せてくれたおかげで、今はこの小隊が私の何よりの誇りです。" },
      { bg: "camp_night", speaker: "aoi", text: "この先どれほど険しい開拓が待っていようと、私は永遠に隊長の右腕として歩み続けます！" }
    ]
  }
};

const MASTER_TITLES = [
  { id: "t_rookie",    name: "第7小隊・新任隊長",   cond: "初期獲得", check: () => true },
  { id: "t_ch1_clear", name: "新緑の解放者",        cond: "第1章・第二十話踏破", check: () => (state.clearedStories || []).includes("ch1_ep20") },
  { id: "t_ch2_clear", name: "天雷を越えし者",      cond: "第2章完結", check: () => (state.clearedStories || []).includes("ch2_ep8") || (state.clearedStories || []).includes("ch2_ep20") },
  { id: "t_dex30",     name: "戦術の探究者",        cond: "戦術カード30種収集", check: () => typeof getOwnedCardCount === "function" && getOwnedCardCount() >= 30 },
  { id: "t_dex60",     name: "伝説のカードマスター", cond: "戦術カード60種収集", check: () => typeof getOwnedCardCount === "function" && getOwnedCardCount() >= 60 },
  { id: "t_hunt20",    name: "歴戦の霧祓い",        cond: "霧獣累計20体討伐", check: () => Object.values(state.huntLog || {}).reduce((s, h) => s + (h.kills || 0), 0) >= 20 },
  { id: "t_arena5",    name: "読み合いの覇者",      cond: "対人アリーナ通算5勝", check: () => (state.arenaWins || 0) >= 5 }
];

// じっくり時間をかけて育てる長期・絆ポイント設計
const BOND_THRESHOLDS = [0, 10, 30, 65, 120]; // Lv.1:0 / Lv.2:10 / Lv.3(個別話):30 / Lv.4:65 / Lv.5(MAX):120

function getBondPoint(charId) {
  return (state.bondPoints && state.bondPoints[charId]) || 0;
}

function getBondLevel(charId) {
  const pt = getBondPoint(charId);
  if (pt >= 120) return 5;
  if (pt >= 65) return 4;
  if (pt >= 30) return 3;
  if (pt >= 10) return 2;
  return 1;
}

function getNextBondNeed(lv) {
  return BOND_THRESHOLDS[Math.min(lv, 4)] || 120;
}

function syncUnlockedTitles() {
  state.unlockedTitles = state.unlockedTitles || ["第7小隊・新任隊長"];
  MASTER_TITLES.forEach(t => {
    if (t.check() && !state.unlockedTitles.includes(t.name)) state.unlockedTitles.push(t.name);
  });
}

function getBondEpisodeFor(charId) {
  if (BOND_EPISODES[charId]) return BOND_EPISODES[charId];
  const ch = getCharProfile(charId);
  return {
    title: `${ch.name}との穏やかな休息`,
    rewardTitle: `${ch.name}の信頼`, scenes: [ { bg: "camp_dusk", speaker: charId, text: "あ、隊長！ちょうどいいところに来てくれましたね。少しだけ息抜きしませんか？" }, { bg: "camp_dusk", speaker: charId, text: "第7小隊に配属されてから、本当に毎日が充実しています。隊長の指揮のもとで戦えてよかったです。" }, { bg: "camp_dusk", speaker: charId, text: `これからも${ch.trait || "隊員"}として、全力で隊長を支えますから、いつでも頼ってくださいね！` }
    ]
  };
}

function renderBondsView() {
  renderTopBar();
  syncUnlockedTitles();
  document.getElementById("bd-tab-members").className = `select-chip ${currentBondsTab === "members" ? "selected" : ""}`; document.getElementById("bd-tab-profile").className = `select-chip ${currentBondsTab === "profile" ? "selected" : ""}`;

  document.getElementById("bd-story-panel").style.display = activeBondStory ? "block" : "none";
  document.getElementById("bd-members-panel").style.display = !activeBondStory && currentBondsTab === "members" ? "block" : "none";
  document.getElementById("bd-profile-panel").style.display = !activeBondStory && currentBondsTab === "profile" ? "block" : "none";

  if (activeBondStory) { renderBondNovelScene(); return; }
  if (currentBondsTab === "profile") { renderProfilePanel(); return; }

  const today = typeof getLoginTodayStr === "function" ? getLoginTodayStr() : new Date().toISOString().slice(0, 10);
  const talkedToday = state.bondTalkDate === today;
  const gifts = state.bondGifts || 0;

  document.getElementById("bd-info-bar").innerHTML = `
    💐 所持『アーク花のブーケ』：<strong>${gifts}個</strong>（補給ショップで購入可）<br>
    <span style="font-size:10px; color:var(--muted);">日々の語らい・贈り物・物語の選択肢で少しずつ絆が深まります。絆Lv.3（30pt）で個別エピソード解放！</span>
  `;

  const members = (state.ownedChars || []).filter(id => id !== "protagonist");
  const clearedEp = state.clearedBondStories || [];

  document.getElementById("bd-member-list").innerHTML = members.map(id => {
    const ch = getCharProfile(id);
    const pt = getBondPoint(id);
    const lv = getBondLevel(id);
    const prevBase = BOND_THRESHOLDS[lv - 1] || 0;
    const nextNeed = getNextBondNeed(lv);
    const pct = lv >= 5 ? 100 : Math.min(100, Math.round(((pt - prevBase) / Math.max(1, nextNeed - prevBase)) * 100));
    const unlocked = lv >= 3;
    const epDone = clearedEp.includes(id);

    return `
      <div class="card" style="padding:10px; margin-bottom:8px;">
        <div style="display:flex; gap:9px; align-items:center;">
          ${window.MF_SPRITES.portraitHTML(ch, "icon-lg")}
          <div style="flex:1; min-width:0;">
            <div class="top-row">
              <strong style="font-size:13px;">${escapeHtml(ch.name)}</strong>
              <span class="rank-pill">💞 絆Lv.${lv}</span>
            </div>
            <div style="font-size:10px; color:var(--muted); margin:2px 0;">絆ポイント：${pt}${lv < 5 ? ` / 次Lvまで ${nextNeed}pt` : "（MAX）"}</div>
            <div class="gauge-bar" style="height:6px; margin-bottom:6px;"><div style="background:#ff4d79; width:${pct}%;"></div></div>
            <div style="display:flex; gap:4px; flex-wrap:wrap;">
              <button class="btn-xs" ${talkedToday ? "disabled" : ""} onclick="talkToMemberForBond('${id}')">${talkedToday ? "本日語らい済" : "💬 語らう(+1)"}</button>
              <button class="btn-xs btn-primary" ${gifts <= 0 ? "disabled" : ""} onclick="giveGiftToMember('${id}')">💐 贈る(+2)</button>
              <button class="btn-xs ${unlocked ? "btn-accent2" : ""}" ${unlocked ? "" : "disabled"} onclick="openBondStory('${id}')">
                ${epDone ? "📖 回想" : (unlocked ? "✨ 絆話を読む" : "🔒 Lv.3(30pt)")}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function talkToMemberForBond(charId) {
  const today = typeof getLoginTodayStr === "function" ? getLoginTodayStr() : new Date().toISOString().slice(0, 10);
  if (state.bondTalkDate === today) { showToast("本日はすでに隊員と語らいました"); return; }
  state.bondTalkDate = today;
  state.bondPoints = state.bondPoints || {};
  state.bondPoints[charId] = (state.bondPoints[charId] || 0) + 1;
  saveGame(); playSfx("switch");
  renderBondsView();
  showToast(`💬 ${getCharProfile(charId).name}とゆっくり語らった（絆+1）`); }  function giveGiftToMember(charId) { if ((state.bondGifts \vert{}\vert{} 0) <= 0) { showToast("💐 ブーケがありません（補給ショップで購入できます）"); return; } state.bondGifts -= 1; state.bondPoints = state.bondPoints \vert{}\vert{} {}; state.bondPoints[charId] = (state.bondPoints[charId] \vert{}\vert{} 0) + 2; saveGame(); playSfx("gift"); renderBondsView(); showToast(`💐 ${getCharProfile(charId).name}にブーケを贈った！（絆+2）`);
}

function openBondStory(charId) {
  if (getBondLevel(charId) < 3) { showToast("🔒 絆Lv.3（30pt）で解放されます"); return; }
  const ep = getBondEpisodeFor(charId);
  activeBondStory = { charId, ep, index: 0 };
  if (window.MF_AUDIO) window.MF_AUDIO.playBgm("story");
  playSfx("switch");
  renderBondsView();
}

function renderBondNovelScene() {
  clearInterval(bondTypeTimer);
  const { charId, ep, index } = activeBondStory;
  const scene = ep.scenes[index];
  const ch = getCharProfile(scene.speaker || charId);

  document.getElementById("bd-story-title").textContent = `💞 ${ch.name} 絆エピソード『${ep.title}』（${index + 1}/${ep.scenes.length}）`;
  const stage = document.getElementById("bd-story-stage");
  stage.className = `novel-stage nbg-${scene.bg \vert{}\vert{} "camp_dusk"}`; stage.innerHTML = window.MF_SPRITES.portraitHTML(ch, "contain"); document.getElementById("bd-story-speaker").textContent = ch.name;  const textEl = document.getElementById("bd-story-text"); const spd = typeof getTextSpeedObj === "function" ? getTextSpeedObj() : { ms: 40 }; bondFullText = scene.text;  if (spd.ms === 0) { textEl.textContent = bondFullText; bondIsTyping = false; return; } bondIsTyping = true; textEl.textContent = ""; let pos = 0; bondTypeTimer = setInterval(() => { pos += 1; textEl.textContent = bondFullText.slice(0, pos); if (pos >= bondFullText.length) { clearInterval(bondTypeTimer); bondIsTyping = false; } }, spd.ms); }  function advanceBondStory() { if (!activeBondStory) return; if (bondIsTyping) { clearInterval(bondTypeTimer); bondIsTyping = false; document.getElementById("bd-story-text").textContent = bondFullText; return; } if (activeBondStory.index < activeBondStory.ep.scenes.length - 1) { activeBondStory.index += 1; playSfx("tap"); renderBondNovelScene(); return; }  const { charId, ep } = activeBondStory; activeBondStory = null; state.clearedBondStories = state.clearedBondStories \vert{}\vert{} []; state.unlockedTitles = state.unlockedTitles \vert{}\vert{} ["第7小隊・新任隊長"]; if (!state.clearedBondStories.includes(charId)) { state.clearedBondStories.push(charId); state.gems += 240; state.cardTickets = (state.cardTickets \vert{}\vert{} 0) + 3; if (!state.unlockedTitles.includes(ep.rewardTitle)) state.unlockedTitles.push(ep.rewardTitle); saveGame(); playSfx("gift"); showToast(`💞 絆エピソード読了！💎+240 / 🎟️券+3 / 称号『${ep.rewardTitle}』獲得！`);
  }
  if (window.MF_AUDIO) window.MF_AUDIO.playBgm("home");
  renderBondsView();
}

function closeBondStory() {
  clearInterval(bondTypeTimer);
  activeBondStory = null;
  if (window.MF_AUDIO) window.MF_AUDIO.playBgm("home");
  renderBondsView();
}

function renderProfilePanel() {
  syncUnlockedTitles();
  const protag = getCharProfile("protagonist");
  const totalPower = state.party.reduce((s, id) => s + calcCharPower(id), 0);
  const totalKills = Object.values(state.huntLog || {}).reduce((s, h) => s + (h.kills || 0), 0);
  const ownedCards = typeof getOwnedCardCount === "function" ? getOwnedCardCount() : 14;
  const curTitle = state.activeTitle || "第7小隊・新任隊長";

  document.getElementById("bd-profile-card").innerHTML = `
    <div style="display:flex; gap:12px; align-items:center; margin-bottom:10px;">
      ${window.MF_SPRITES.portraitHTML(protag, "icon-lg")}
      <div style="text-align:left; flex:1;">
        <span class="rank-pill" style="background:#ffd13b;">🏅 ${escapeHtml(curTitle)}</span>
        <h3 style="margin:4px 0 2px; font-size:16px;">${escapeHtml(state.playerName)}（開拓Lv.${state.playerRank}）</h3>
        <div style="font-size:11px; color:var(--muted);">小隊総戦力：<strong>${totalPower}</strong></div>
      </div>
    </div>
    <div class="stat-grid">
      <div class="stat-cell"><span>累計討伐</span><strong>${totalKills}体</strong></div>
      <div class="stat-cell"><span>カード図鑑</span><strong>${ownedCards}/102</strong></div>
      <div class="stat-cell"><span>所属隊員</span><strong>${(state.ownedChars || []).length}人</strong></div>
      <div class="stat-cell"><span>対人勝利</span><strong>${state.arenaWins || 0}勝</strong></div>
    </div>
  `;

  document.getElementById("bd-titles-list").innerHTML = (state.unlockedTitles || []).map(tName => {
    const active = tName === curTitle;
    return `
      <button class="select-chip ${active ? "selected" : ""}" onclick="equipPlayerTitle('${escapeHtml(tName)}')">
        ${active ? "✅ " : "🏅 "}<strong>${escapeHtml(tName)}</strong>
      </button>
    `;
  }).join("");
}

function equipPlayerTitle(titleName) {
  state.activeTitle = titleName;
  saveGame(); playSfx("switch");
  renderTopBar();
  renderProfilePanel();
  showToast(`🏅 称号を『${titleName}』に設定しました！`);
}
