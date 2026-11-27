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
  { tag: "PROLOGUE I",  title: "百年前、大地は紫の霧に呑まれた", desc: "未知の結晶『アーク』の暴走により、地上は瘴霧ミアズマと霧獣の領域へと変貌した。" },
  { tag: "PROLOGUE II", title: "天空の避難所・方舟都市リベルタ", desc: "空へ逃れた人類。だが都市を支える中央アーク炉の寿命は、もう長くない。" },
  { tag: "PROLOGUE III",title: "霧を祓う者たち——第7クリアラー小隊", desc: "仲間との絆、6つの元素、そして戦術カードを手に、今ふたたび大地を取り戻す戦いが始まる。" }
];

let opSlideTimer = null;

function startOpeningSequence(forceCinematic = false) {
  const ov = document.getElementById("opening-overlay");
  if (!ov) return;
  ov.classList.add("active");

  const shouldPlayMovie = forceCinematic || !state?.seenOpening;
  if (shouldPlayMovie) {
    runOpeningSlides(0);
  } else {
    showTitleScreen();
  }
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
    const ch = window.MF_DATA.CHARACTERS.lunaria;
    heroBox.innerHTML = window.MF_SPRITES.portraitHTML(ch, "hero");
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
    if (state.initialized && typeof checkLoginBonusAutoOpen === "function") {
      checkLoginBonusAutoOpen();
    }
  }, 780);
}

// ---------- 📢 運営からのお知らせ ----------
let currentNoticeCat = "all";

const ADMIN_NOTICES = [
  {
    id: "n_2026_endgame",
    cat: "event",
    date: "2026/11/27",
    tag: "イベント",
    title: "新エンドコンテンツ『極限作戦』実装！",
    body: "やり込みモード『🗼 無限の瘴霧タワー』および『☄️ 融光レイド・スコアアタック』を実装しました！\nタワーは登るほど毎日の掃討ボーナスが豪華になり、レイドでは5ターンの総ダメージで豪華報酬が獲得できます。タブレットの『🗼 極限作戦』から挑戦しましょう！"
  },
  {
    id: "n_2026_pass",
    cat: "update",
    date: "2026/11/26",
    tag: "アプデ",
    title: "『フロンティア・マンスリーパス』＆複数日ウィークリー任務が登場",
    body: "30日間毎日💎結晶石120・🎟️パック券1・⚡予備EN40が届く『フロンティア・マンスリーパス』を追加しました。累計30日受取で未所持優先SSR戦術カードが確定入手できます！また、ウィークリー任務も達成個数ボーナス付きへ刷新しました。"
  },
  {
    id: "n_2026_ch2",
    cat: "update",
    date: "2026/11/25",
    tag: "アプデ",
    title: "第1章・第2章 全40話の長編ストーリー＆立ち絵拡充",
    body: "『第1章：新緑の廃墟編（全20話）』および『第2章：雷鳴の峡谷編（全20話）』が公開中です！会話スピード切替・オート進行・BGM＆画面演出とあわせて、濃密な冒険をお楽しみください。"
  },
  {
    id: "n_2026_backup",
    cat: "important",
    date: "2026/11/24",
    tag: "重要",
    title: "データ引き継ぎコードの保管のお願い",
    body: "端末の機種変更やブラウザのデータ消去に備え、タブレットの『⚙️ 端末設定』より『🔑 引き継ぎコード』を書き出して大切に保管していただくことをおすすめします。"
  }
];

function getUnreadNoticeCount() {
  const read = state?.readNoticeIds || [];
  return ADMIN_NOTICES.filter(n => !read.includes(n.id)).length;
}

function updateNoticeBadge() {
  const cnt = getUnreadNoticeCount();
  const b1 = document.getElementById("home-notice-badge");
  const b2 = document.getElementById("tablet-notice-badge");
  [b1, b2].forEach(el => {
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
