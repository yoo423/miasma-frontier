// ---------- ⏳ 読み込み画面（Tips＆全画像アセット事前プリロード） ----------
const LOADING_TIPS = [
  "敵の『🛡️装甲硬化』や『⚡必殺チャージ』には【崩し】カードを合わせると大ダメージ＆行動キャンセル！",
  "『🔥炎×❄️氷＝融解(2.2倍)』『🔥炎×💧水＝蒸発(2.0倍)』『💧水×❄️氷＝凍結』で強敵を圧倒しよう。",
  "毎ターン手札から3枚すべて出し切ると、3枚目の威力が+30%＆EX必殺ゲージが大きく溜まります。",
  "同属性2名以上、または4属性バラバラ編成で『⚡元素共鳴』が発動！プリセット5枠で使い分けよう。",
  "スカウトで重なった隊員は『✨共鳴の記憶』になり、隊員詳細から手動で限界突破！完凸超過は『💠クレスト』へ自動変換されます。",
  "控えの隊員は『🚁前線派遣』へ送り出そう。時間経過で💎結晶石や🎟️パック券、💐ブーケを持ち帰ってくれます。",
  "ホームの『🪪IDカード』は共有リンクや掲示板コードで友達と見せ合えます。名刺帳にコレクションしよう！",
  "開拓マップは25%ごとに『🚨関門ガーディアン』が出現！突破すると上限解放＆豪華マイルストーン報酬がもらえます。",
  "討伐は『通常』〜『★★★★終焉』の5段階。各難易度ごとの初回撃破ボーナスで💎結晶石と🎟️パック券を大量獲得！",
  "『無限の瘴霧タワー』は登った階層が高いほど、毎日もらえる掃討ボーナスが豪華になります。"
];

window.MF_RESOLVED_IMG_SRC = window.MF_RESOLVED_IMG_SRC || {};
window.MF_PRELOADED_IMAGES = window.MF_PRELOADED_IMAGES || [];

let loadingTimer = null;
let preloadPromise = null;
let preloadState = { total: 0, done: 0, finished: false };

function collectAllImageBases() {
  const bases = [
    "assets/protagonist_m_cool",
    "assets/protagonist_m_genki",
    "assets/protagonist_f_cool",
    "assets/protagonist_f_genki"
  ];
  Object.values(window.MF_DATA?.CHARACTERS || {}).forEach(ch => {
    if (!ch.isProtagonist && ch.id) bases.push(`assets/${ch.id}`);
  });
  const bossIds = [
    "moss_behemoth", "radiant_behemoth", "thunder_wyvern", "radiant_wyvern",
    "glacial_mammoth", "radiant_mammoth", "magma_salamander", "radiant_salamander",
    "abyss_kraken", "radiant_kraken", "spire_seraph", "radiant_zero"
  ];
  bossIds.forEach(id => bases.push(`assets/${id}`));
  return [...new Set(bases)];
}

function preloadSingleBaseImage(base) {
  return new Promise(resolve => {
    if (window.MF_RESOLVED_IMG_SRC[base]) { resolve(true); return; }
    const v = window.MF_IMG_VER || "536";
    const exts = [".jpg", ".jpeg", ".png"];
    let idx = 0;

    const tryNext = () => {
      if (idx >= exts.length) { resolve(false); return; }
      const url = `${base}${exts[idx]}?v=${v}`;
      idx += 1;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        window.MF_RESOLVED_IMG_SRC[base] = url;
        window.MF_PRELOADED_IMAGES.push(img);
        if (typeof img.decode === "function") img.decode().catch(() => {}).finally(() => resolve(true));
        else resolve(true);
      };
      img.onerror = () => tryNext();
      img.src = url;
    };
    tryNext();
  });
}

function startAssetPreload() {
  if (preloadPromise) return preloadPromise;
  const bases = collectAllImageBases();
  preloadState = { total: bases.length, done: 0, finished: false };

  const tasks = bases.map(base =>
    preloadSingleBaseImage(base).finally(() => {
      preloadState.done += 1;
    })
  );

  // 最大6秒の安全タイムアウト付き（低速回線でもフリーズしない）
  preloadPromise = Promise.race([
    Promise.all(tasks),
    new Promise(res => setTimeout(res, 6000))
  ]).finally(() => {
    preloadState.done = preloadState.total;
    preloadState.finished = true;
  });

  return preloadPromise;
}

function showLoadingScreen(label = "作戦データを展開中……", onDone = null, durationMs = 720, waitAssets = false) {
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
  if (waitAssets) startAssetPreload();

  const start = Date.now();
  loadingTimer = setInterval(() => {
    const timePct = Math.min(100, Math.round(((Date.now() - start) / durationMs) * 100));
    let p = timePct;

    if (waitAssets) {
      const assetPct = preloadState.total > 0
        ? Math.min(100, Math.round((preloadState.done / preloadState.total) * 100))
        : 100;
      p = preloadState.finished ? timePct : Math.min(timePct, Math.max(8, assetPct));
      if (lblEl) {
        lblEl.textContent = preloadState.finished
          ? "前線キャンプへ接続中……"
          : `隊員・ボス画像を読み込み中… (${preloadState.done}/${preloadState.total})`;
      }
    }

    if (fillEl) fillEl.style.width = `${p}%`;
    if (pctEl) pctEl.textContent = `${p}%`;

    const readyToClose = waitAssets ? (preloadState.finished && timePct >= 100) : (p >= 100);
    if (readyToClose) {
      clearInterval(loadingTimer);
      loadingTimer = null;
      if (fillEl) fillEl.style.width = "100%";
      if (pctEl) pctEl.textContent = "100%";
      setTimeout(() => {
        ov.classList.remove("active");
        if (typeof onDone === "function") onDone();
      }, 120);
    }
  }, 40);
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
  startAssetPreload();
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

  showLoadingScreen("隊員・ボス画像を読み込み中……", () => {
    switchView(state.initialized ? "home" : "creator");
    if (state.initialized && typeof checkLoginBonusAutoOpen === "function") checkLoginBonusAutoOpen();
  }, 850, true);
}

// ---------- 📢 運営からのお知らせ（2026/11/29 0:00 JST 自動リリース切替対応） ----------
let currentNoticeCat = "all";
const OFFICIAL_RELEASE_AT = new Date("2026-11-29T00:00:00+09:00").getTime();

const ADMIN_NOTICES = [
  // ① 2026/11/29 0:00 JST になった瞬間から自動表示される正式リリース記念文
  {
    id: "n_2026_official_release",
    cat: "important",
    date: "2026/11/29",
    tag: "正式リリース",
    showFrom: OFFICIAL_RELEASE_AT,
    title: "🎉『ミアズマ・フロンティア』正式リリース記念のお知らせ！",
    body: "お待たせいたしました！\n本日 2026年11月29日 0:00 より、戦略カードバトルRPG『ミアズマ・フロンティア』を正式リリースいたしました！\n\n【正式リリース公開コンテンツ】\n・メインストーリー＆地域別『実戦・瘴霧浄化』全6エリア／開拓本部Lv.10\n・戦術カード全102種＆最大5枠の小隊プリセット・『⚡元素共鳴』システム\n・討伐5段階難易度（通常〜『👑★★★★終焉』）＆各初回撃破ボーナス\n・手動限界突破＆完凸超過『💠スター・クレスト交換所』\n・所持隊員との『💞絆Lv.5・全4話エピソード＆全キャラ専用称号』\n・ホーム『🎙️秘書官＆時間帯ボイス』・友達と共有できる『🪪指揮官IDカード』\n・やり込み報酬ハブ（🏆実績・🚁控え隊員の前線派遣・🎯週替わりチャレンジ）\n・安定通信版『🏆同時プロットオンライン対戦』＆『💬交流掲示板』\n\n【正式リリース記念キャンペーン】\n・開始から7日間『初心者応援ログボ』と通常ログボのW受取を開催！\n・タブレットの『⚙️端末設定』→支援コード欄に『FRONTIER2026』を入力で特別支援パックを贈呈！\n・12月1日からは初の月次大型イベント『聖夜の白銀キャンプ』が開幕予定です！\n\n第7クリアラー小隊の新たな開拓を、どうぞ存分にお楽しみください！"
  },

  // ② 2026/11/28 23:59:59 JST まで表示される正式リリース直前のお知らせ
  {
    id: "n_2026_pre_release",
    cat: "important",
    date: "2026/11/28",
    tag: "リリース直前",
    showUntil: OFFICIAL_RELEASE_AT,
    title: "⏳ 明日 11/29(日) 0:00 正式リリース！直前のご案内",
    body: "『ミアズマ・フロンティア』はいよいよ明日【2026年11月29日（日）0:00】に正式リリースを迎えます！\n\n正式リリースに向けて、以下の最終アップデートが完了しております。\n・ホーム画面『🎙️秘書官メインステージ』＆自由移動できる立ち絵拡大機能\n・パーティ属性で発動する『⚡元素共鳴』＆小隊プリセット5枠\n・友達や掲示板で見せ合える『🪪指揮官IDカード』\n・超難度『🩸災厄』『👑終焉』＆開拓本部Lv.10・全6エリア実戦浄化\n・控え隊員の『🚁前線派遣』『🏆実績』『🎯週替わりチャレンジ』\n\n【リリース前のご注意】\n・現在のセーブデータは正式リリース後もそのまま引き継がれます。\n・万一に備え、タブレット『⚙️端末設定』より引き継ぎコードの事前保管をおすすめします。\n\n明日 0:00 の正式リリース＆12月1日の初大型イベント開幕を、どうぞお楽しみに！"
  },

  // ③ 重要：データ引き継ぎコード保管
  {
    id: "n_2026_backup",
    cat: "important",
    date: "重要",
    tag: "データ保護",
    title: "🔑 データ引き継ぎコード保管のお願い",
    body: "本作のセーブデータはお使いの端末のブラウザ内に保存されます。\n\nブラウザの履歴・キャッシュ削除、シークレットモードでのプレイ、端末の機種変更などを行うとデータが消失する可能性があります。\n\n大切な育成記録を守るため、タブレットの『⚙️ 端末設定』にある『🔑 引き継ぎコード発行』から、定期的にコードをメモ帳等へ保存しておくことを強くおすすめいたします。"
  },

  // ④ 重要：定期更新＆イベントスケジュール
  {
    id: "n_2026_schedule",
    cat: "event",
    date: "案内",
    tag: "スケジュール",
    title: "🗓️ 定期リセット・月次イベント開催スケジュール",
    body: "本作では以下のサイクルでコンテンツや報酬が自動更新されます。\n\n【毎日 0:00 更新】\n・ログインボーナス／デイリー任務／補給ショップの品揃え\n・開拓本部の『📦毎日開拓配当』／絆の無料『💬語らう』／アリーナ勝利報酬枠（5回）\n\n【毎週月曜 0:00 更新】\n・『🎯週替わり戦術チャレンジ』（全5お題＋コンプリート報酬）\n\n【毎月の定期イベント＆スカウト】\n・毎月1日：新・月次イベント開幕＆限定ピックアップスカウト切替\n・毎月11日〜20日：中旬イベント追加＆過去限定SSR『🔄中旬復刻スカウト』出現\n・毎月21日：後半チャレンジ解放＆新規戦術カード追加"
  },

  // ⑤ 重要：プレイ環境・アップデート反映・掲示板＆意見箱
  {
    id: "n_2026_guidelines",
    cat: "important",
    date: "案内",
    tag: "ご利用案内",
    title: "⚙️ 最新版の反映方法・交流掲示板＆ご意見箱について",
    body: "【アップデートが反映されない場合】\n画面やボタンが古いままの場合は、ブラウザの再読み込み（リロード）をお試しください。セーブデータは消えずに最新版へ更新されます。\n\n【オンライン対戦＆交流掲示板について】\n・オンライン対戦はWi-Fi／4G・5G回線に対応しています。通信が不安定な場合は電波の良い場所で再度お試しください。\n・『💬交流掲示板』は全プレイヤー共有の場です。公序良俗に反する投稿や個人情報の書き込みはお控えください。\n・『🪪指揮官IDカード』の掲示板用コードを貼ると、他の隊長とワンタップで名刺交換ができます！\n\n【不具合報告・ご要望】\n気づいた点や「こんな機能がほしい！」などのご要望は、タブレットの『💌 意見箱』よりいつでもお送りください。"
  }
];

function getActiveNotices(nowMs = Date.now()) {
  return ADMIN_NOTICES.filter(n => {
    if (typeof n.showFrom === "number" && nowMs < n.showFrom) return false;
    if (typeof n.showUntil === "number" && nowMs >= n.showUntil) return false;
    return true;
  });
}

function getUnreadNoticeCount() {
  const read = state?.readNoticeIds || [];
  return getActiveNotices().filter(n => !read.includes(n.id)).length;
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
  const readSet = new Set(state.readNoticeIds || []);
  getActiveNotices().forEach(n => readSet.add(n.id));
  state.readNoticeIds = [...readSet];
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

  const list = getActiveNotices().filter(n => currentNoticeCat === "all" || n.cat === currentNoticeCat);
  document.getElementById("notice-list-body").innerHTML = list.length
    ? list.map(n => `
      <div class="card" style="padding:10px; margin-bottom:8px; text-align:left; background:var(--surface-sub);">
        <div class="top-row" style="margin-bottom:4px;">
          <span class="rank-pill" style="font-size:9.5px;">${n.tag}</span>
          <span style="font-size:10px; color:var(--muted); font-weight:800;">${n.date}</span>
        </div>
        <strong style="font-size:13px; display:block; margin-bottom:4px;">${escapeHtml(n.title)}</strong>
        <div style="font-size:11.5px; line-height:1.55; white-space:pre-line; color:var(--ink);">${escapeHtml(n.body)}</div>
      </div>
    `).join("")
    : `<div style="text-align:center; padding:18px; font-size:11.5px; color:var(--muted);">このカテゴリのお知らせはありません</div>`;
}

// 2026/11/29 0:00 JST をまたいでプレイ中でも自動でリリースお知らせ＆未読バッジを点灯
(function scheduleOfficialReleaseNotice() {
  const diff = OFFICIAL_RELEASE_AT - Date.now();
  if (diff > 0 && diff < 24 * 60 * 60 * 1000) {
    setTimeout(() => {
      updateNoticeBadge();
      if (document.getElementById("modal-notices")?.classList.contains("active")) renderNoticeList();
      if (typeof showToast === "function") showToast("🎉『ミアズマ・フロンティア』正式リリース！お知らせが届いています！");
    }, diff + 500);
  }
})();
