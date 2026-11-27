let boardCatFilter = "ALL";
let boardPostsCache = [];
let boardLoading = false;
let boardPosting = false;

const BOARD_DEFAULT_POSTS = [
  {
    id: "sys_welcome",
    category: "雑談",
    name: "第7小隊・公式広報",
    rank: 99,
    title: "運営",
    stamp: "公式案内",
    text: "『ミアズマ・フロンティア』交流掲示板へようこそ！\n攻略のコツやおすすめ40枚デッキ、フレンド募集、オンライン対戦の部屋番号共有などに自由にお使いください！"
  }
];

function getLocalBoardPosts() {
  try {
    const raw = localStorage.getItem("mf_local_board_v1");
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function saveLocalBoardPosts(list) {
  try { localStorage.setItem("mf_local_board_v1", JSON.stringify(list.slice(0, 40))); } catch (e) {}
}

function renderBoardView() {
  renderTopBar();
  renderBoardFilterTabs();
  refreshBoardPosts();
}

function renderBoardFilterTabs() {
  const cats = [
    { id: "ALL", label: "すべて" },
    { id: "雑談", label: "💬雑談" },
    { id: "攻略・デッキ", label: "🃏攻略" },
    { id: "フレンド募集", label: "🤝フレンド" },
    { id: "対人募集", label: "🏆対人" }
  ];
  const box = document.getElementById("board-filter-tabs");
  if (!box) return;
  box.innerHTML = cats.map(c => `
    <button class="btn-xs ${boardCatFilter === c.id ? "btn-primary" : ""}" onclick="boardCatFilter='${c.id}'; playSfx('tap'); renderBoardFilterTabs(); renderBoardList();">${c.label}</button>
  `).join("");
}

function appendFriendCodeToBoardInput() {
  const ta = document.getElementById("board-msg-input");
  if (!ta || typeof getMyFriendCode !== "function") return;
  const code = getMyFriendCode();
  const cur = ta.value.trim();
  ta.value = cur ? `${cur}\nフレンドコード：${code}` : `フレンド募集中です！よろしくお願いします！\n${code}`;
  const catSel = document.getElementById("board-cat-select");
  if (catSel) catSel.value = "フレンド募集";
  playSfx("tap");
  showToast("🤝 自分のフレンドコードを本文に貼り付けました！");
}

async function refreshBoardPosts() {
  const statusEl = document.getElementById("board-status-bar");
  const endpoint = (window.MF_BACKEND_URL || "").trim();

  if (!endpoint) {
    boardPostsCache = [...getLocalBoardPosts(), ...BOARD_DEFAULT_POSTS];
    if (statusEl) statusEl.textContent = "💬 掲示板（オンライン接続待機中：現在はこの端末内でのみ保存）";
    renderBoardList();
    return;
  }

  if (boardLoading) return;
  boardLoading = true;
  if (statusEl) statusEl.textContent = "📡 最新の書き込みを読み込み中…";

  try {
    const res = await fetch(`${endpoint}?action=board_list&t=${Date.now()}`);
    const data = await res.json();
    if (data && Array.isArray(data.posts)) {
      boardPostsCache = [...data.posts, ...BOARD_DEFAULT_POSTS];
      if (statusEl) statusEl.textContent = `🌐 オンライン交流掲示板（全${data.posts.length}件取得済）`;
    } else {
      throw new Error("bad_data");
    }
  } catch (e) {
    boardPostsCache = [...getLocalBoardPosts(), ...BOARD_DEFAULT_POSTS];
    if (statusEl) statusEl.textContent = "⚠️ 読み込みに失敗しました（更新ボタンで再試行）";
  }

  boardLoading = false;
  renderBoardList();
}

async function submitBoardPost() {
  if (boardPosting) return;
  const cat = document.getElementById("board-cat-select")?.value || "雑談";
  const input = document.getElementById("board-msg-input");
  const btn = document.getElementById("btn-board-post");
  const text = (input?.value || "").trim();

  if (!text) { showToast("⚠️ メッセージを入力してください"); return; }
  if (text.length > 300) { showToast("⚠️ 300文字以内で入力してください"); return; }

  // 連投防止（10秒クールダウン）
  const nowMs = Date.now();
  if (nowMs - (window._lastBoardPostAt || 0) < 10000) {
    showToast("⏳ 連続投稿は10秒あけてください");
    return;
  }

  const now = new Date();
  const stamp = `${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const payload = {
    action: "board_post",
    category: cat,
    name: state.playerName || "隊長",
    rank: state.playerRank || 1,
    title: state.activeTitle || "新任隊長",
    stamp,
    text
  };

  const endpoint = (window.MF_BACKEND_URL || "").trim();
  if (!endpoint) {
    const local = getLocalBoardPosts();
    local.unshift({ id: `loc_${nowMs}`, ...payload });
    saveLocalBoardPosts(local);
    window._lastBoardPostAt = nowMs;
    if (input) input.value = "";
    playSfx("gift");
    refreshBoardPosts();
    showToast("💬 掲示板に書き込みました！");
    return;
  }

  boardPosting = true;
  if (btn) { btn.disabled = true; btn.textContent = "📡 投稿中…"; }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({ ok: res.ok }));
    if (res.ok && data.ok !== false) {
      window._lastBoardPostAt = nowMs;
      if (input) input.value = "";
      playSfx("gift");
      showToast("🌐 掲示板に投稿しました！");
      boardPosting = false;
      if (btn) { btn.disabled = false; btn.textContent = "💬 掲示板に書き込む"; }
      refreshBoardPosts();
      return;
    }
    throw new Error("post_failed");
  } catch (e) {
    showToast("⚠️ 投稿に失敗しました。時間をおいて再度お試しください");
  }

  boardPosting = false;
  if (btn) { btn.disabled = false; btn.textContent = "💬 掲示板に書き込む"; }
}

function copyFriendCodeFromPost(code) {
  if (!code) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      playSfx("gift");
      showToast("📋 フレンドコードをコピーしました！フレンド画面で登録しよう！");
    }).catch(() => prompt("フレンドコード：", code));
  } else {
    prompt("フレンドコード：", code);
  }
}

function renderBoardList() {
  const listEl = document.getElementById("board-post-list");
  if (!listEl) return;
  const filtered = boardPostsCache.filter(p => boardCatFilter === "ALL" || p.category === boardCatFilter);

  if (filtered.length === 0) {
    listEl.innerHTML = `<div style="font-size:12px; color:var(--muted); text-align:center; padding:16px;">このカテゴリの書き込みはまだありません。最初の投稿をしてみよう！</div>`;
    return;
  }

  listEl.innerHTML = filtered.map(p => {
    // 本文内に MF- フレンドコードが含まれていればワンタップコピーボタンを自動表示
    const match = String(p.text || "").match(/MF-[A-Za-z0-9+/=]+/);
    const copyBtn = match
      ? `<div style="margin-top:6px;"><button class="btn-xs btn-primary" onclick="copyFriendCodeFromPost('${escapeHtml(match[0])}')">🤝 この人のフレンドコードをコピー</button></div>`
      : "";
    return `
      <div class="card" style="padding:10px; margin-bottom:8px; background:var(--surface-sub); text-align:left;">
        <div class="top-row" style="margin-bottom:3px; flex-wrap:wrap;">
          <span class="rank-pill" style="font-size:9.5px;">${escapeHtml(p.category || "雑談")}</span>
          <span style="font-size:10px; color:var(--muted);">${escapeHtml(p.stamp || "")}</span>
        </div>
        <div style="font-size:11px; font-weight:900; color:var(--accent); margin-bottom:4px;">
          ${escapeHtml(p.name || "隊長")}（開拓Lv.${Number(p.rank) || 1} ／ ${escapeHtml(p.title || "")}）
        </div>
        <div style="font-size:12.5px; line-height:1.55; white-space:pre-line; word-break:break-word;">${escapeHtml(p.text || "")}</div>
        ${copyBtn}
      </div>
    `;
  }).join("");
}
