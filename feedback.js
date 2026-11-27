// =========================================================
// 🔒 公式バックエンドURL（Google Apps ScriptのウェブアプリURLを貼るだけ）
// ※URLにメールアドレスは一切含まれないため、安全に非公開のまま運用できます
// =========================================================
window.MF_BACKEND_URL = "";

let currentFeedbackTab = "send";
let isSendingFeedback = false;

function ensureFeedbackState() {
  state.feedbackBox = state.feedbackBox || [];
  return state.feedbackBox;
}

function getUnreadFeedbackCount() { return 0; }
function updateFeedbackBadges() {
  const tbBadge = document.getElementById("tablet-feedback-badge");
  if (tbBadge) tbBadge.style.display = "none";
}

function renderFeedbackView() {
  renderTopBar();
  ensureFeedbackState();
  document.getElementById("fb-tab-send").className = `select-chip ${currentFeedbackTab === "send" ? "selected" : ""}`;
  document.getElementById("fb-tab-inbox").className = `select-chip ${currentFeedbackTab === "inbox" ? "selected" : ""}`;
  document.getElementById("fb-send-panel").style.display = currentFeedbackTab === "send" ? "block" : "none";
  document.getElementById("fb-inbox-panel").style.display = currentFeedbackTab === "inbox" ? "block" : "none";
  if (currentFeedbackTab === "inbox") renderFeedbackInbox();
}

async function submitOfficialFeedback() {
  if (isSendingFeedback) return;
  const catEl = document.getElementById("fb-cat-select");
  const msgEl = document.getElementById("fb-msg-input");
  const btnEl = document.getElementById("btn-fb-submit");
  const statusEl = document.getElementById("fb-send-status");

  const cat = catEl ? catEl.value : "ご意見・感想";
  const text = (msgEl?.value || "").trim();
  if (!text) {
    showToast("⚠️ 意見やメッセージを入力してください");
    return;
  }

  const endpoint = (window.MF_BACKEND_URL || "").trim();
  if (!endpoint) {
    showToast("⚠️ 公式窓口の接続設定がまだ完了していません");
    if (statusEl) statusEl.textContent = "※現在、公式窓口の回線を準備中です。";
    return;
  }

  isSendingFeedback = true;
  if (btnEl) { btnEl.disabled = true; btnEl.textContent = "📡 送信中…"; }
  if (statusEl) statusEl.textContent = "公式窓口へ送信しています…";

  const senderName = state.playerName || "隊長";
  const rank = state.playerRank || 1;
  const clearedCount = (state.clearedStories || []).length;
  const now = new Date();
  const stamp = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  let delivered = false;
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "feedback",
        category: cat,
        playerName: senderName,
        rank,
        clearedCount,
        message: text
      })
    });
    const data = await res.json().catch(() => ({ ok: res.ok }));
    if (res.ok && data.ok !== false) delivered = true;
  } catch (e) {
    delivered = false;
  }

  const box = ensureFeedbackState();
  box.unshift({
    id: `fb_${Date.now()}`,
    cat, stamp, text,
    status: delivered ? "✓ 運営窓口へ受付完了" : "⚠️ 送信失敗（時間をおいて再送してください）"
  });
  if (box.length > 30) box.length = 30;
  saveGame();

  isSendingFeedback = false;
  if (btnEl) { btnEl.disabled = false; btnEl.textContent = "📨 公式へ意見を送信する"; }

  if (delivered) {
    playSfx("gift");
    if (msgEl) msgEl.value = "";
    if (statusEl) statusEl.textContent = "✅ ご意見を受け付けました！開発の参考にさせていただきます。";
    showToast("📨 公式窓口へ送信しました！");
  } else {
    playSfx("tap");
    if (statusEl) statusEl.textContent = "⚠️ 通信に失敗しました。電波の良い場所で再度お試しください。";
    showToast("⚠️ 送信に失敗しました");
  }
}

function renderFeedbackInbox() {
  const box = ensureFeedbackState();
  const listEl = document.getElementById("fb-inbox-list");
  if (!listEl) return;

  if (box.length === 0) {
    listEl.innerHTML = `<div style="font-size:12px; color:var(--muted); text-align:center; padding:14px;">あなたが送信した意見の控えはまだありません。</div>`;
    return;
  }

  listEl.innerHTML = box.map(item => `
    <div class="card" style="padding:10px; margin-bottom:8px; background:var(--surface-sub); text-align:left;">
      <div class="top-row" style="margin-bottom:4px;">
        <span class="rank-pill" style="font-size:9.5px;">${escapeHtml(item.cat)}</span>
        <span style="font-size:10px; color:var(--muted);">${escapeHtml(item.stamp)}</span>
      </div>
      <div style="font-size:12.5px; line-height:1.55; font-weight:800; margin:4px 0;">${escapeHtml(item.text)}</div>
      <div style="font-size:10px; color:var(--accent); font-weight:900;">${escapeHtml(item.status)}</div>
    </div>
  `).join("");
}
