// ---------- ⏳ 読み込み画面（Tips＆プログレスバー） ----------
const LOADING_TIPS = [
  "敵の『🛡️装甲硬化』や『⚡必殺チャージ』には【崩し】カードを合わせると大ダメージ＆行動キャンセル！",
  "『🔥炎×❄️氷＝融解(2.2倍)』『🔥炎×💧水＝蒸発(2.0倍)』『💧水×❄️氷＝凍結』で強敵を圧倒しよう。",
  "毎ターン手札から3枚すべて出し切ると、3枚目の威力が+30%＆EX必殺ゲージが大きく溜まります。",
  "デッキは最大5枠まで名前付きで保存可能。対ボス用・対人用・レイド用で使い分けよう！",
  "中級・上級の育成クエストは基準Lv未満だと敵が『Lv差圧倒』を発動します。初級で育成してから挑もう。",
  "補給ショップの品揃えは毎日0時に自動更新。目玉SSRカードや絆ギフトのブーケを見逃すな！",
  "『無限の瘴霧タワー』は登った階層が高いほど、毎日もらえる掃討ボーナスが豪華になります。",
  "『融光レイド』では防御ダウン（超電導・スキャン）と攻撃バフを重ねた3連チェインがハイスコアの鍵！"
];

let loadingTimer = null;

function showLoadingScreen(label = "作戦データを展開中……", onDone = null, durationMs = 720) {
  const ov = document.getElementById("loading-overlay");
  if (!ov) { if (typeof onDone === "function") onDone(); return; }
  clearInterval(loadingTimer);

  const lblEl = document.getElementById("loading-label");
  const tipEl = document.getElementById("loading-tip");
  const fillEl = document.getElementById("loading-bar-fill");
  const pctEl = document.getElementById("loading-pct");

  if (lblEl) lblEl.textContent = label;
  if (tipEl) tipEl.textContent = LOADING_TIPS[Math.floor(Math.random() * LOADING_TIPS.length)];
  if (fillEl) fillEl.style.width = "0%";
  if (pctEl) pctEl.textContent = "0%";

  ov.classList.add("active");
  const start = Date.now();
  loadingTimer = setInterval(() => {
    const p = Math.min(100, Math.round(((Date.now() - start) / durationMs) * 100));
    if (fillEl) fillEl.style.width = `${p}%`;
    if (pctEl) pctEl.textContent = `${p}%`;
    if (p >= 100) {
      clearInterval(loadingTimer);
      loadingTimer = null;
      setTimeout(() => {
        ov.classList.remove("active");
        if (typeof onDone === "function") onDone();
      }, 120);
    }
  }, 32);
}

// ---------- 🎬 オープニング＆タイトル画面 ----------
const OPENING_SLIDES = [
  { tag: "PROLOGUE I",   title: "百年前、大地は紫の霧に呑まれた", desc: "未知の結晶『アーク』の暴走により、地上は瘴霧ミアズマと霧獣の領域へと変貌した。" },
  { tag: "PROLOGUE II",  title: "天空の避難所・方舟都市リベルタ", desc: "空へ逃れた人類。だが都市を支える中央アーク炉の寿命は、もう長くない。" },
  { tag: "PROLOGUE III", title: "霧を祓う者たち——第7クリアラー小隊", desc: "仲間との絆、6つの元素、そして戦術カードを手に、今ふたたび大地を取り戻す戦いが始まる。" }
];

let opSlideTimer = null;

function startOpeningSequence(forceCinematic = false) {
  const ov = document.getElementById("opening-overlay");
  if (!ov) return;
  ov.classList.add("active");
  const shouldPlayMovie = forceCinematic || !state?.seenOpening;
  if (shouldPlayMovie) runOpeningSlides(0);
  else showTitleScreen();
}

function runOpeningSlides(idx) {
  clearTimeout(opSlideTimer);
  const cinBox = document.getElementById("op-cinematic-box");
  const titleBox = document.getElementById("op-title-box");
  if (idx >= OPENING_SLIDES.length) {
    if (state) { state.seenOpening = true; saveGame(); }
    showTitleScreen();
    return;
  }

  cinBox.style.display = "flex";
  titleBox.style.display = "none";
  const sl = OPENING_SLIDES[idx];
  document.getElementById("op-cin-tag").textContent = sl.tag;
  document.getElementById("op-cin-title").textContent = sl.title;
  document.getElementById("op-cin-desc").textContent = sl.desc;
  cinBox.classList.remove("op-fade-in");
  void cinBox.offsetWidth;
  cinBox.classList.add("op-fade-in");

  opSlideTimer = setTimeout(() => runOpeningSlides(idx + 1), 2700);
}

function skipOpeningMovie() {
  clearTimeout(opSlideTimer);
  if (state) { state.seenOpening = true; saveGame(); }
  showTitleScreen();
}

function showTitleScreen() {
  clearTimeout(opSlideTimer);
  document.getElementById("op-cinematic-box").style.display = "none";
  const titleBox = document.getElementById("op-title-box");
  titleBox.style.display = "flex";
  const heroBox = document.getElementById("op-title-hero");
  if (heroBox && window.MF_SPRITES) {
    heroBox.innerHTML = window.MF_SPRITES.portraitHTML(window.MF_DATA.CHARACTERS.lunaria, "hero");
  }
}

function tapTitleToStart() {
  if (window.MF_AUDIO) {
    window.MF_AUDIO.unlock();
    window.MF_AUDIO.playSfx("gift");
    window.MF_AUDIO.playBgm("home");
  }
  const ov = document.getElementById("opening-overlay");
  if (ov) ov.classList.remove("active");

  showLoadingScreen("前線キャンプへ接続中……", () => {
    switchView(state.initialized ? "home" : "creator");
    if (state.initialized && typeof checkLoginBonusAutoOpen === "function") checkLoginBonusAutoOpen();
  }, 780);
}

// ---------- 📢 運営からのお知らせ ----------
let currentNoticeCat = "all";

const ADMIN_NOTICES = [
  {
    id: "n_2026_official_release",
    cat: "important",
    date: "2026/11/28",
    tag: "正式リリース",
    title: "🎉『ミアズマ・フロンティア』正式リリースのお知らせ！",
    body: "お待たせいたしました！戦略カードバトルRPG『ミアズマ・フロンティア』を正式リリースいたしました！\n\n【正式リリース時の公開コンテンツ】\n・メインストーリー第1章＆第2章（全40話・没入演出付き）\n・戦術カード全102種＋毎月追加＆最大5枠・40枚デッキ編成\n・オンライン通信対応『同時プロット対人アリーナ』\n・エンドコンテンツ『無限の瘴霧タワー』『融光レイド』\n・プレイヤー同士で交流できる『💬 交流掲示板』＆『🤝 フレンド』\n\n【リリース記念キャンペーン】\n・開始から7日間『初心者応援ログボ』と通常ログボのW受取開催！\n・端末設定の支援コード欄に『FRONTIER2026』を入力で特別支援パック贈呈！\n・12月1日からは初の月次大型イベント『聖夜の白銀キャンプ』が開幕予定です！\n\nご意見や不具合のご報告はタブレットの『💌 意見箱』よりお気軽にお寄せください。今後とも『ミアズマ・フロンティア』をよろしくお願いいたします！"
  },
  {
    id: "n_2026_board_open",
    cat: "update",
    date: "2026/11/28",
    tag: "新機能",
    title: "💬『プレイヤー交流掲示板』＆BGM12曲リズム刷新のお知らせ",
    body: "タブレット2ページ目に『💬 掲示板』を新設しました！雑談・攻略＆デッキ相談・フレンド募集（コードワンタップ添付可）・オンライン対戦募集にぜひご活用ください。\nあわせて全BGMのリズム精度を刷新し、画面や強敵ごとに全12曲へ拡張しました。"
  },
  {
    id: "n_2026_endgame",
    cat: "event",
    date: "2026/11/27",
    tag: "イベント",
    title: "エンドコンテンツ『極限作戦』＆12月イベント予告",
    body: "やり込みモード『🗼 無限の瘴霧タワー』および『☄️ 融光レイド・スコアアタック』を実装しました！\nまた、12月1日より月次イベント（1日・11日・21日の3回更新＆新カード追加）が順次開幕します。"
  },
  {
    id: "n_2026_backup",
    cat: "important",
    date: "2026/11/24",
    tag: "重要",
    title: "データ引き継ぎコード保管のお願い",
    body: "記録データはお使いのブラウザ内に保存されます。キャッシュ削除や機種変更に備え、タブレットの『⚙️ 端末設定』より『🔑 引き継ぎコード』を定期的に保管していただくことをおすすめします。"
  }
];

function getUnreadNoticeCount() {
  const read = state?.readNoticeIds || [];
  return ADMIN_NOTICES.filter(n => !read.includes(n.id)).length;
}

function updateNoticeBadge() {
  const cnt = getUnreadNoticeCount();
  [document.getElementById("home-notice-badge"), document.getElementById("tablet-notice-badge")].forEach(el => {
    if (!el) return;
    el.style.display = cnt > 0 ? "inline-block" : "none";
    el.textContent = cnt > 9 ? "9+" : `${cnt}`;
  });
  if (typeof updateTabletBadge === "function") updateTabletBadge();
}

function openNoticeModal() {
  playSfx("switch");
  state.readNoticeIds = ADMIN_NOTICES.map(n => n.id);
  saveGame();
  updateNoticeBadge();
  renderNoticeList();
  document.getElementById("modal-notices").classList.add("active");
}

function closeNoticeModal() {
  document.getElementById("modal-notices").classList.remove("active");
}

function setNoticeCat(cat) {
  currentNoticeCat = cat;
  playSfx("tap");
  renderNoticeList();
}

function renderNoticeList() {
  const cats = [
    { id: "all", label: "すべて" },
    { id: "important", label: "重要" },
    { id: "event", label: "イベント" },
    { id: "update", label: "アプデ" }
  ];
  document.getElementById("notice-cat-tabs").innerHTML = cats.map(c => `
    <button class="btn-xs ${currentNoticeCat === c.id ? "btn-primary" : ""}" onclick="setNoticeCat('${c.id}')">${c.label}</button>
  `).join("");

  const list = ADMIN_NOTICES.filter(n => currentNoticeCat === "all" || n.cat === currentNoticeCat);
  document.getElementById("notice-list-body").innerHTML = list.map(n => `
    <div class="card" style="padding:10px; margin-bottom:8px; text-align:left; background:var(--surface-sub);">
      <div class="top-row" style="margin-bottom:4px;">
        <span class="rank-pill" style="font-size:9.5px;">${n.tag}</span>
        <span style="font-size:10px; color:var(--muted); font-weight:800;">${n.date}</span>
      </div>
      <strong style="font-size:13px; display:block; margin-bottom:4px;">${escapeHtml(n.title)}</strong>
      <div style="font-size:11.5px; line-height:1.55; white-space:pre-line; color:var(--ink);">${escapeHtml(n.body)}</div>
    </div>
  `).join("");
}
