// =========================================================
// 💌 GoogleフォームのURL（または埋め込みHTML）を下の "" の中に貼るだけ
// =========================================================
window.MF_FEEDBACK_FORM_URL = "";

function extractGoogleFormEmbedUrl(raw) {
  let s = String(raw || "").trim();
  if (!s) return "";
  const m = s.match(/src=["']([^"']+)["']/i);
  if (m) s = m[1];
  if (s.includes("docs.google.com/forms") && !s.includes("embedded=true")) {
    s += (s.includes("?") ? "&" : "?") + "embedded=true";
  }
  return s;
}

function getUnreadFeedbackCount() { return 0; }
function updateFeedbackBadges() {
  const el = document.getElementById("tablet-feedback-badge");
  if (el) el.style.display = "none";
}

function renderFeedbackView() {
  renderTopBar();
  const box = document.getElementById("fb-embed-container");
  if (!box) return;

  const url = extractGoogleFormEmbedUrl(window.MF_FEEDBACK_FORM_URL);
  if (!url) {
    box.innerHTML = `
      <div style="text-align:center; padding:26px 12px; color:var(--muted); font-size:12px; line-height:1.6;">
        💌 公式意見箱を準備中です。<br>
        <span style="font-size:10.5px;">（管理用：<code>feedback.js</code> にGoogleフォームのURLを設定すると表示されます）</span>
      </div>
    `;
    return;
  }

  const openUrl = url.replace(/[?&]embedded=true/g, "");
  box.innerHTML = `
    <div style="font-size:11px; color:var(--muted); margin-bottom:8px; line-height:1.45;">
      いただいたご意見・不具合報告は開発者のみに届きます。
    </div>
    <div style="border:2px solid var(--border); border-radius:12px; overflow:hidden; background:#fff;">
      <iframe src="${escapeHtml(url)}" width="100%" height="520" frameborder="0" marginheight="0" marginwidth="0" style="display:block;">読み込んでいます…</iframe>
    </div>
    <div style="text-align:right; margin-top:6px;">
      <a href="${escapeHtml(openUrl)}" target="_blank" rel="noopener" style="font-size:11px; font-weight:900; color:var(--accent);">うまく入力できない場合は別タブで開く ↗</a>
    </div>
  `;
}
