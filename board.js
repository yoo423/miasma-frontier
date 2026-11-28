// =========================================================
// 💬 CboxのURL（または埋め込みHTML）を下の "" の中に貼るだけ
// =========================================================
window.MF_CBOX_URL = "<script>
window['CboxReady'] = function (Cbox) {
	Cbox('button', '3-3562495-Vjcvvr');
}
</script>
<script src="https://static.cbox.ws/embed/2.js" async></script>
	";

function extractCboxUrl(raw) {
  let s = String(raw || "").trim();
  if (!s) return "";
  const m = s.match(/src=["']([^"']+)["']/i);
  if (m) s = m[1];
  return s;
}

function copyFriendCodeForBoard() {
  if (typeof copyMyFriendCode === "function") {
    copyMyFriendCode();
    showToast("📋 フレンドコードをコピーしました！そのまま掲示板に貼り付けられます");
  } else {
    showToast("⚠️ フレンド機能解放後にコードをコピーできます");
  }
}

function renderBoardView() {
  renderTopBar();
  const box = document.getElementById("board-embed-container");
  if (!box) return;

  const url = extractCboxUrl(window.MF_CBOX_URL);
  if (!url) {
    box.innerHTML = `
      <div style="text-align:center; padding:26px 12px; color:var(--muted); font-size:12px; line-height:1.6;">
        💬 プレイヤー交流掲示板を準備中です。<br>
        <span style="font-size:10.5px;">（管理用：<code>board.js</code> にCboxのURLを設定すると開通します）</span>
      </div>
    `;
    return;
  }

  box.innerHTML = `
    <div style="border:2px solid var(--border); border-radius:12px; overflow:hidden; background:#fff;">
      <iframe id="cbox-frame" src="${escapeHtml(url)}" width="100%" height="480" allowtransparency="yes" allow="autoplay" frameborder="0" marginheight="0" marginwidth="0" scrolling="auto" style="display:block; height:62dvh; min-height:420px;"></iframe>
    </div>
  `;
}

function reloadBoardFrame() {
  playSfx("tap");
  renderBoardView();
  showToast("🔄 掲示板を再読み込みしました");
}
