const OFFICIAL_FEEDBACK_EMAIL = "yotsu094@gmail.com";
let currentFeedbackTab = "send";
let isSendingFeedback = false;

function ensureFeedbackState() {
  state.feedbackBox = state.feedbackBox || [];
  return state.feedbackBox;
}

function getUnreadFeedbackCount() {
  return 0;
}

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

  isSendingFeedback = true;
  if (btnEl) { btnEl.disabled = true; btnEl.textContent = "📡 公式窓口へ送信中…"; }
  if (statusEl) statusEl.textContent = "通信中…";

  const senderName = state.playerName || "隊長";
  const rank = state.playerRank || 1;
  const clearedCount = (state.clearedStories || []).length;
  const now = new Date();
  const stamp = `${now.getFullYear()}/${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  let delivered = false;
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${OFFICIAL_FEEDBACK_EMAIL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        _subject: `【ミアズマ・フロンティア意見箱】${cat}（${senderName} / Lv.${rank}）`,
        _template: "table",
        _captcha: "false",
        カテゴリ: cat,
        プレイヤー名: `${senderName}（開拓Lv.${rank} / 物語踏破${clearedCount}話）`,
        送信日時: stamp,
        内容: text
      })
    });
    if (res.ok) delivered = true;
  } catch (e) {
    delivered = false;
  }

  const box = ensureFeedbackState();
  box.unshift({
    id: `fb_${Date.now()}`,
    cat,
    stamp,
    text,
    status: delivered ? "✓ 公式窓口へ送信完了" : "⚠️ 端末控えのみ（下のメール送信可）"
  });
  if (box.length > 30) box.length = 30;
  saveGame();

  isSendingFeedback = false;
  if (btnEl) { btnEl.disabled = false; btnEl.textContent = "📨 公式へ意見を送信する"; }

  if (delivered) {
    playSfx("gift");
    if (msgEl) msgEl.value = "";
    if (statusEl) statusEl.textContent = "✅ 公式開発者へ直接送信しました！ご意見ありがとうございます。";
    showToast("📨 公式へ意見を送信しました！");
  } else {
    playSfx("switch");
    if (statusEl) statusEl.textContent = "⚠️ 自動送信がブロックされました。下の『メールアプリで送る』から直接送信できます。";
    showToast("⚠️ 通信制限のため下のメール送信ボタンをご利用ください");
  }
}

function openFeedbackMailFallback() {
  const cat = document.getElementById("fb-cat-select")?.value || "ご意見・感想";
  const text = (document.getElementById("fb-msg-input")?.value || "").trim();
  const subj = encodeURIComponent(`【ミアズマ・フロンティア意見箱】${cat}`);
  const body = encodeURIComponent(`プレイヤー名：${state.playerName || "隊長"}（開拓Lv.${state.playerRank || 1}）\n\n${text}`);
  location.href = `mailto:${OFFICIAL_FEEDBACK_EMAIL}?subject=${subj}&body=${body}`;
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
