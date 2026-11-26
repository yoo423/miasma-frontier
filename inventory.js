let currentBagTab = "all";

// 運営配布プレゼントの同期（重複受取防止つき）
function syncAdminMail() {
  state.claimedMailIds = state.claimedMailIds || [];
  state.mailbox = state.mailbox || [];

  const builtinMails = window.MF_DATA.BUILTIN_MAILS || [];
  builtinMails.forEach(m => {
    const alreadyInBox = state.mailbox.some(x => x.id === m.id);
    const alreadyClaimed = state.claimedMailIds.includes(m.id);
    if (!alreadyInBox && !alreadyClaimed) {
      state.mailbox.unshift({ ...m, claimed: false });
    }
  });
  updateMailBadges();
}

function getUnclaimedMailCount() {
  return (state.mailbox || []).filter(m => !m.claimed).length;
}

function updateMailBadges() {
  const count = getUnclaimedMailCount();
  const badge = document.getElementById("home-mail-badge");
  if (badge) {
    badge.style.display = count > 0 ? "inline-block" : "none";
    badge.textContent = count > 9 ? "9+" : String(count);
  }
}

function renderMailView() {
  renderTopBar();
  syncAdminMail();
  const listEl = document.getElementById("mail-list");
  const mails = state.mailbox || [];

  if (mails.length === 0) {
    listEl.innerHTML = `<div style="font-size:12px; color:var(--muted); text-align:center; padding:16px;">現在届いているプレゼントはありません。</div>`;
    return;
  }

  listEl.innerHTML = mails.map(m => {
    const rwText = formatRewardSummary(m.rewards);
    return `
      <div class="card" style="padding:10px; margin-bottom:8px; opacity:${m.claimed ? 0.6 : 1};">
        <div class="top-row">
          <strong style="font-size:13px;">🎁 ${escapeHtml(m.title)}</strong>
          <span style="font-size:10px; color:var(--muted);">${escapeHtml(m.date || "")}</span>
        </div>
        <div style="font-size:11px; color:var(--muted); margin:4px 0;">${escapeHtml(m.body || "")}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
          <span style="font-size:11px; font-weight:900; color:var(--accent);">${rwText}</span>
          ${m.claimed
            ? `<span class="tag">受取済</span>`
            : `<button class="btn-xs btn-accent2" onclick="claimSingleMail('${m.id}')">受け取る</button>`}
        </div>
      </div>
    `;
  }).join("");
}

function formatRewardSummary(rw) {
  if (!rw) return "";
  const parts = [];
  if (rw.gems) parts.push(`💎結晶石×${rw.gems}`);
  if (rw.credits) parts.push(`🪙×${rw.credits.toLocaleString()}`);
  if (rw.en) parts.push(`⚡EN+${rw.en}`);
  if (rw.books) parts.push(`📘作戦記録×${rw.books}`);
  if (rw.cores) parts.push(`💠元素コア×${rw.cores}`);
  if (rw.activityPt) parts.push(`🏅活躍Pt+${rw.activityPt}`);
  return parts.join(" / ");
}

function applyMailRewards(rw) {
  if (!rw) return;
  if (rw.gems) state.gems += rw.gems;
  if (rw.credits) state.credits += rw.credits;
  if (rw.en) state.en += rw.en;
  if (rw.books) state.expBooks = (state.expBooks || 0) + rw.books;
  if (rw.cores) state.cores = (state.cores || 0) + rw.cores;
  if (rw.activityPt) state.activityPt = (state.activityPt || 0) + rw.activityPt;
}

function claimSingleMail(mailId) {
  const mail = (state.mailbox || []).find(m => m.id === mailId);
  if (!mail || mail.claimed) return;
  mail.claimed = true;
  state.claimedMailIds.push(mail.id);
  applyMailRewards(mail.rewards);
  saveGame();
  playSfx("gift");
  updateMailBadges();
  renderMailView();
  showToast(`🎁「${mail.title}」を受け取りました！`);
}

function claimAllMails() {
  const targets = (state.mailbox || []).filter(m => !m.claimed);
  if (targets.length === 0) {
    showToast("未受取のプレゼントはありません");
    return;
  }
  targets.forEach(m => {
    m.claimed = true;
    state.claimedMailIds.push(m.id);
    applyMailRewards(m.rewards);
  });
  saveGame();
  playSfx("gift");
  updateMailBadges();
  renderMailView();
  showToast(`🎉 ${targets.length}件のプレゼントを一括受取しました！`);
}

// ---------- 持ち物倉庫（インベントリ） ----------
function renderBagView() {
  renderTopBar();
  const items = [];

  // 基本育成・通貨アイテム
  items.push({ cat: "growth", icon: "💎", name: "アーク結晶石", count: state.gems, desc: "軌道スカウト（ガチャ）やEN回復に使用する希少結晶。" });
  items.push({ cat: "growth", icon: "🪙", name: "開拓クレジット", count: state.credits, desc: "隊員のレベルアップ・昇格・キャンプ設備の強化資金。" });
  items.push({ cat: "growth", icon: "📘", name: "作戦記録", count: state.expBooks || 0, desc: "過去の戦闘データをまとめた教本。隊員の経験値を上昇させる。" });
  items.push({ cat: "growth", icon: "💠", name: "元素コア", count: state.cores || 0, desc: "精鋭霧獣から抽出される高純度エネルギー核。昇格試練に必須。" });
  items.push({ cat: "growth", icon: "🏅", name: "手動討伐・活躍Pt", count: state.activityPt || 0, desc: "手動操作で霧獣を討伐した証。今後交換所で限定装備と交換可能。" });

  // 部位破壊・フィールド採取素材
  const mats = state.materials || {};
  Object.entries(mats).forEach(([name, count]) => {
    if (count > 0) {
      items.push({
        cat: "boss",
        icon: "🦴",
        name,
        count,
        desc: "霧獣の部位破壊や開拓探索で獲得した希少素材。武器鍛造や上級強化に使用。"
      });
    }
  });

  const filtered = currentBagTab === "all" ? items : items.filter(i => i.cat === currentBagTab);
  const gridEl = document.getElementById("bag-item-grid");

  gridEl.innerHTML = filtered.map(it => `
    <div class="card" style="padding:10px; margin-bottom:6px;">
      <div class="top-row">
        <strong style="font-size:13px;">${it.icon} ${escapeHtml(it.name)}</strong>
        <span class="rank-pill">所持：${it.count.toLocaleString()}</span>
      </div>
      <div style="font-size:11px; color:var(--muted); margin-top:4px;">${escapeHtml(it.desc)}</div>
    </div>
  `).join("");
}
