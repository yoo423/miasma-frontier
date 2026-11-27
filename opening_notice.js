// 運営からのお知らせデータ（新しいお知らせは先頭に追加するだけで自動反映）
window.MF_NOTICES = [
  {
    id: "nt_endgame_open",
    cat: "important",
    date: "2026/11/27",
    title: "極限領域『無限の瘴霧タワー』＆『融光襲来レイド』解禁！",
    body: "第1章・第二十話を踏破した熟練の隊長に向けた新たな極限作戦が開放されました。\n\n・【無限の瘴霧タワー】全50階層の踏破を目指し、毎日1回の掃討報酬や限定称号を獲得しましょう。\n・【融光襲来レイド】週替わりの超巨大融光種へ挑み、与えたダメージと部位破壊で最高ランク『SSS』を狙いましょう！"
  },
  {
    id: "nt_monthly_pass",
    cat: "event",
    date: "2026/11/25",
    title: "『フロンティア・マンスリーパス』＆Wログインボーナス開催中",
    body: "補給ショップおよびログインボーナス画面より、30日間毎日『💎結晶石×120・🎟️戦術パック券×1・⚡予備EN+40』が届くマンスリーパスをご利用いただけます。\nさらに累計30日受取で未所持優先のSSR戦術カードが確定入手できます！"
  },
  {
    id: "nt_ch2_release",
    cat: "update",
    date: "2026/11/22",
    title: "メインストーリー第2章『雷鳴の峡谷』全20話完全公開",
    body: "第1章完結に続き、第2エリア『ヴォルト・キャニオン』を舞台にした全20話の超長編ストーリーを公開いたしました。\n第2小隊の記録、人為的融光化の謎、そして黄金の天雷との決戦をお楽しみください。"
  },
  {
    id: "nt_pvp_online",
    cat: "update",
    date: "2026/11/18",
    title: "同時プロット読み合い『オンライン通信対戦』実装",
    body: "対人アリーナにて、4桁の部屋番号を共有するだけで離れた隊長同士でリアルタイム対戦が可能になりました。\n『⚔️攻撃 ＞ 💥崩し ＞ 🛡️防御 ＞ ⚔️攻撃』の3すくみと5枠のマイデッキを駆使して勝利を掴みましょう！"
  }
];

const LOADING_TIPS = [
  "敵が『🛡️装甲硬化』や『⚡必殺チャージ』を構えたら、【崩し】カードで行動を強制中断できる！",
  "水属性の直後に炎属性を出すと『蒸発（2.0倍）』、氷の直後に炎なら『融解（2.2倍）』が炸裂する！",
  "水属性と氷属性を重ねた『凍結』は、ボスの怒り大技を丸ごと封じ込める最強の切り札だ。",
  "1ターンにカードを3枚出し切ると『3連チェイン』が発生し、3枚目の威力が+30%＆EXゲージ大幅UP！",
  "育成クエストの中級・上級は基準Lv未満だと敵が『Lv差圧倒オーラ』を発動。まずは初級で育てよう。",
  "デッキは最大5枠まで名前付きで保存可能。対ボス用・対人読み合い用など使い分けよう。",
  "カードガチャ専用の『🎟️ 戦術パック券』は、討伐戦・任務・調査ノート・ショップで毎日集められる。",
  "毎日0時に更新される『🏪 補給ショップ』では、余ったクレジットで目玉SSRカードや絆ギフトが買える。",
  "隊員との絆をLv.3（30pt）まで深めると、2人きりの個別『絆エピソード』と限定称号が解放される。",
  "精鋭や主霧獣はHP50%以下で『💢怒り覚醒』を発動。後半ほど防御・回復・凍結の温存が重要になる。",
  "対人アリーナは裏向き同時オープン！『⚔️攻撃 ＞ 💥崩し ＞ 🛡️防御 ＞ ⚔️攻撃』の3すくみを読め！",
  "端末設定から『🔑 引き継ぎコード』を書き出して保管しておくと、機種変更しても記録を復元できる。"
];

// ---------- ⏳ 読み込み画面（Tips＆進行バー付き） ----------
let loadTimer = null;

function showLoadingScreen(label = "作戦データを展開中…", durationMs = 680, onDone = null) {
  const el = document.getElementById("loading-screen");
  const bar = document.getElementById("loading-bar-fill");
  const lbl = document.getElementById("loading-label");
  const tip = document.getElementById("loading-tip");
  if (!el || !bar) {
    if (typeof onDone === "function") onDone();
    return;
  }

  clearInterval(loadTimer);
  lbl.textContent = label;
  tip.textContent = `💡 TIPS：${LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)]}`;
  bar.style.width = "6%";
  el.classList.add("active");

  const start = Date.now();
  loadTimer = setInterval(() => {
    const ratio = Math.min(1, (Date.now() - start) / Math.max(200, durationMs));
    const eased = Math.round((1 - Math.pow(1 - ratio, 2)) * 100);
    bar.style.width = `${eased}\%`; if (ratio >= 1) { clearInterval(loadTimer); loadTimer = null; setTimeout(() => { el.classList.remove("active"); if (typeof onDone === "function") onDone(); }, 120); } }, 35); }  // ---------- 🎬 オープニング演出＆タイトル画面 ---------- const OPENING_SLIDES = [ { bg: "op-bg-1", tag: "PROLOGUE I",  title: "百年前、大地は紫の霧に呑まれた", text: "未知のエネルギー結晶『アーク』の暴走により発生した瘴霧『ミアズマ』。生き残った人類は空に浮かぶ方舟都市リベルタへ逃れた。" }, { bg: "op-bg-2", tag: "PROLOGUE II", title: "迫り来る、方舟の限界",           text: "百年を支え続けた都市の中央炉は、すでに寿命を迎えつつある。人類に残された道はただひとつ——再び地上へ降りること。" }, { bg: "op-bg-3", tag: "PROLOGUE III",title: "霧を祓う者たち『クリアラー』",   text: "六つの元素と戦術カードを操り、巨大なる『主霧獣』と黄金の『融光種』に立ち向かう精鋭部隊。" }, { bg: "op-bg-4", tag: "CHAPTER 0",   title: "第7クリアラー小隊、降下開始",     text: "これは、仲間たちと絆を結び、百年ぶりの青空をこの手に取り戻す物語——。" } ];  let opSlideIdx = 0; let opAutoTimer = null; let opReplayMode = false;  function startBootSequence() { showLoadingScreen("方舟都市リベルタへ接続中…", 900, () => { if (!state.seenOpening) { openOpeningSequence(false); } else { showTitleScreen(); } }); }  function openOpeningSequence(isReplay = true) { opReplayMode = isReplay; opSlideIdx = 0; const screen = document.getElementById("opening-screen"); if (!screen) return; document.getElementById("op-movie-layer").style.display = "flex"; document.getElementById("op-title-layer").style.display = "none"; screen.classList.add("active"); if (window.MF_AUDIO && window.MF_AUDIO.unlocked) window.MF_AUDIO.playBgm("story"); renderOpeningSlide(); }  function renderOpeningSlide() { clearTimeout(opAutoTimer); const sl = OPENING_SLIDES[opSlideIdx]; if (!sl) { finishOpeningMovie(); return; } const layer = document.getElementById("op-movie-layer"); layer.className = `op-movie-layer ${sl.bg}`;
  document.getElementById("op-slide-tag").textContent = sl.tag;
  document.getElementById("op-slide-title").textContent = sl.title;
  document.getElementById("op-slide-text").textContent = sl.text;
  document.getElementById("op-slide-dots").innerHTML = OPENING_SLIDES.map((_, i) =>
    `<span class="op-dot ${i === opSlideIdx ? "on" : ""}"></span>`
  ).join("");

  opAutoTimer = setTimeout(() => nextOpeningSlide(), 4200);
}

function nextOpeningSlide() {
  clearTimeout(opAutoTimer);
  if (window.MF_AUDIO) { window.MF_AUDIO.unlock(); window.MF_AUDIO.playBgm("story"); }
  playSfx("tap");
  opSlideIdx += 1;
  if (opSlideIdx >= OPENING_SLIDES.length) finishOpeningMovie();
  else renderOpeningSlide();
}

function skipOpeningMovie() {
  clearTimeout(opAutoTimer);
  if (window.MF_AUDIO) window.MF_AUDIO.unlock();
  playSfx("switch");
  finishOpeningMovie();
}

function finishOpeningMovie() {
  clearTimeout(opAutoTimer);
  state.seenOpening = true;
  saveGame();
  if (opReplayMode) {
    document.getElementById("opening-screen").classList.remove("active");
    if (window.MF_AUDIO) window.MF_AUDIO.playBgm("home");
    return;
  }
  showTitleScreen();
}

function showTitleScreen() {
  const screen = document.getElementById("opening-screen");
  if (!screen) return;
  document.getElementById("op-movie-layer").style.display = "none";
  document.getElementById("op-title-layer").style.display = "flex";
  screen.classList.add("active");

  const lead = getCharProfile(state.initialized ? (state.party[0] || "protagonist") : "lunaria");
  const artEl = document.getElementById("op-title-art");
  if (artEl) artEl.innerHTML = window.MF_SPRITES.portraitHTML(lead, "hero");

  const unread = getUnreadNoticeCount();
  const nb = document.getElementById("title-notice-badge");
  if (nb) { nb.style.display = unread > 0 ? "inline-block" : "none"; nb.textContent = String(unread); }
}

function tapTitleToStart() {
  if (window.MF_AUDIO) {
    window.MF_AUDIO.unlock();
    window.MF_AUDIO.playSfx("gift");
    window.MF_AUDIO.playBgm("home");
  }
  document.getElementById("opening-screen").classList.remove("active");
  showLoadingScreen("第7前線キャンプへ降下中…", 650, () => {
    switchView(state.initialized ? "home" : "creator");
    if (state.initialized && typeof checkLoginBonusAutoOpen === "function") checkLoginBonusAutoOpen();
  });
}

// ---------- 📢 運営からのお知らせ ----------
let currentNoticeCat = "all";

function getUnreadNoticeCount() {
  const read = state?.readNoticeIds || [];
  return (window.MF_NOTICES || []).filter(n => !read.includes(n.id)).length;
}

function updateNoticeBadges() {
  const cnt = getUnreadNoticeCount();
  ["home-notice-badge", "tablet-notice-badge", "title-notice-badge"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = cnt > 0 ? "inline-block" : "none";
    el.textContent = cnt > 9 ? "9+" : String(cnt);
  });
  if (typeof updateTabletBadge === "function") updateTabletBadge();
}

function openNoticeModal() {
  playSfx("switch");
  renderNoticeModal();
  document.getElementById("modal-notices").classList.add("active");
}

function closeNoticeModal() {
  document.getElementById("modal-notices").classList.remove("active");
}

function markAllNoticesRead() {
  state.readNoticeIds = (window.MF_NOTICES || []).map(n => n.id);
  saveGame();
  playSfx("tap");
  updateNoticeBadges();
  renderNoticeModal();
}

function renderNoticeModal() {
  const cats = [
    { id: "all", label: "すべて" },
    { id: "important", label: "重要" },
    { id: "event", label: "イベント" },
    { id: "update", label: "更新" }
  ];
  document.getElementById("notice-cat-tabs").innerHTML = cats.map(c => `
    <button class="btn-xs ${currentNoticeCat === c.id ? "btn-primary" : ""}"
            onclick="currentNoticeCat='${c.id}'; playSfx('tap'); renderNoticeModal();">${c.label}</button>
  `).join("");

  const read = state.readNoticeIds || [];
  const catNames = { important: "🔴重要", event: "🟡イベント", update: "🟢更新" };
  const list = (window.MF_NOTICES || []).filter(n => currentNoticeCat === "all" || n.cat === currentNoticeCat);

  document.getElementById("notice-list-body").innerHTML = list.map(n => {
    const isNew = !read.includes(n.id);
    return `
      <div class="card" style="padding:10px; margin-bottom:8px; text-align:left; background:var(--surface-sub);" onclick="markSingleNoticeRead('${n.id}')">
        <div class="top-row" style="margin-bottom:4px;">
          <span class="tag">${catNames[n.cat] || "お知らせ"}</span>
          <span style="font-size:10px; color:var(--muted);">${n.date} ${isNew ? "<strong style='color:#ff4d5a;'>NEW</strong>" : ""}</span>
        </div>
        <strong style="font-size:12.5px; display:block; margin-bottom:5px;">${escapeHtml(n.title)}</strong>
        <div style="font-size:11.5px; line-height:1.55; white-space:pre-line; color:var(--ink);">${escapeHtml(n.body)}</div>
      </div>
    `;
  }).join("");
}

function markSingleNoticeRead(id) {
  state.readNoticeIds = state.readNoticeIds || [];
  if (!state.readNoticeIds.includes(id)) {
    state.readNoticeIds.push(id);
    saveGame();
    updateNoticeBadges();
    renderNoticeModal();
  }
}
