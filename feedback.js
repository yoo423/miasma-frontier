let currentFeedbackTab = "send"; // "send" | "inbox"

function ensureFeedbackState() {
  state.feedbackBox = state.feedbackBox || [];
  state.unreadFeedbackCount = typeof state.unreadFeedbackCount === "number" ? state.unreadFeedbackCount : 0;
  return state.feedbackBox;
}

function getUnreadFeedbackCount() {
  return state?.unreadFeedbackCount || 0;
}

function updateFeedbackBadges() {
  const cnt = getUnreadFeedbackCount();
  const tbBadge = document.getElementById("tablet-feedback-badge");
  if (tbBadge) {
    tbBadge.style.display = cnt > 0 ? "inline-block" : "none";
    tbBadge.textContent = cnt > 9 ? "9+" : `${cnt}`;
  }
  const inBadge = document.getElementById("fb-inbox-badge");
  if (inBadge) inBadge.textContent = cnt > 0 ? ` (${cnt}件通知)` : "";
  if (typeof updateTabletBadge === "function") updateTabletBadge();
}

function triggerSystemNotification(title, body) {
  showToast(`🔔 ${title}：${body}`);
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    try {
      new Notification(title, { body, icon: "assets/lunaria.jpg" });
    } catch (e) {}
  }
}

function requestBrowserNotificationPerm() {
  if (typeof Notification === "undefined") {
    showToast("この端末では画面内通知でお知らせします");
    return;
  }
  Notification.requestPermission().then(perm => {
    showToast(perm === "granted" ? "🔔 端末通知を許可しました！" : "🔕 端末通知はオフのままです（画面内通知は有効）");
  });
}

function renderFeedbackView() {
  renderTopBar();
  ensureFeedbackState();
  updateFeedbackBadges();

  document.getElementById("fb-tab-send").className = `select-chip ${currentFeedbackTab === "send" ? "selected" : ""}`;
  document.getElementById("fb-tab-inbox").className = `select-chip ${currentFeedbackTab === "inbox" ? "selected" : ""}`;

  document.getElementById("fb-send-panel").style.display = currentFeedbackTab === "send" ? "block" : "none";
  document.getElementById("fb-inbox-panel").style.display = currentFeedbackTab === "inbox" ? "block" : "none";

  if (currentFeedbackTab === "inbox") {
    state.unreadFeedbackCount = 0;
    saveGame();
    updateFeedbackBadges();
    renderFeedbackInbox();
  }
}

function submitOfficialFeedback() {
  const catEl = document.getElementById("fb-cat-select");
  const msgEl = document.getElementById("fb-msg-input");
  const cat = catEl ? catEl.value : "ご意見・感想";
  const text = (msgEl?.value || "").trim();

  if (!text) {
    showToast("⚠️ 意見やメッセージを入力してください");
    return;
  }

  const box = ensureFeedbackState();
  const now = new Date();
  const stamp = `${now.getMonth() + 1}/${now.getDate()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  const entry = {
    id: `fb_${Date.now()}`,
    cat,
    sender: state.playerName || "隊長",
    rank: state.playerRank || 1,
    stamp,
    text,
    status: "運営受付完了（通知送信済）"
  };

  box.unshift(entry);
  state.unreadFeedbackCount = (state.unreadFeedbackCount || 0) + 1;
  saveGame();
  playSfx("gift");

  if (msgEl) msgEl.value = "";
  updateFeedbackBadges();
  triggerSystemNotification("公式意見箱・受信通知", `【${cat}】ご意見を正式に受け付けました！`);
  currentFeedbackTab = "inbox";
  state.unreadFeedbackCount = 0;
  saveGame();
  updateFeedbackBadges();
  renderFeedbackView();
}

function renderFeedbackInbox() {
  const box = ensureFeedbackState();
  const listEl = document.getElementById("fb-inbox-list");
  if (!listEl) return;

  if (box.length === 0) {
    listEl.innerHTML = `<div style="font-size:12px; color:var(--muted); text-align:center; padding:14px;">まだ送信された意見はありません。</div>`;
    return;
  }

  listEl.innerHTML = box.map(item => `
    <div class="card" style="padding:10px; margin-bottom:8px; background:var(--surface-sub); text-align:left;">
      <div class="top-row" style="margin-bottom:4px;">
        <span class="rank-pill" style="font-size:9.5px;">${escapeHtml(item.cat)}</span>
        <span style="font-size:10px; color:var(--muted);">${escapeHtml(item.stamp)}</span>
      </div>
      <div style="font-size:12.5px; line-height:1.55; font-weight:800; margin:4px 0;">${escapeHtml(item.text)}</div>
      <div style="font-size:10px; color:var(--accent); font-weight:900;">
        ✓ 送信者：${escapeHtml(item.sender)}（Lv.${item.rank}） ／ ${escapeHtml(item.status)}
      </div>
    </div>
  `).join("");
}
