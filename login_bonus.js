// 永続ループする通常ログインボーナス（7日周期でずっと続く）
const NORMAL_LOGIN_REWARDS = [
  { day: 1, label: "🎟️ パック券×2",       reward: { tickets: 2 } },
  { day: 2, label: "🪙 5,000クレジット",  reward: { credits: 5000 } },
  { day: 3, label: "📘 作戦記録×15",      reward: { books: 15 } },
  { day: 4, label: "💎 結晶石×160",       reward: { gems: 160 } },
  { day: 5, label: "💠 元素コア×5",       reward: { cores: 5 } },
  { day: 6, label: "🎟️ パック券×4",       reward: { tickets: 4 } },
  { day: 7, label: "💎 結晶石×320・🎟️×3", reward: { gems: 320, tickets: 3 } }
];

// 開始から7日間限定：初心者応援ログインボーナス（期間中は毎日W受取！）
const BEGINNER_LOGIN_REWARDS = [
  { day: 1, label: "💎 結晶石×320",         reward: { gems: 320 } },
  { day: 2, label: "🎟️ パック券×5",         reward: { tickets: 5 } },
  { day: 3, label: "📘 作戦記録×30・🪙8,000", reward: { books: 30, credits: 8000 } },
  { day: 4, label: "💎 結晶石×480",         reward: { gems: 480 } },
  { day: 5, label: "💠 元素コア×10・🎟️×4",   reward: { cores: 10, tickets: 4 } },
  { day: 6, label: "📘 作戦記録×50・🪙15,000", reward: { books: 50, credits: 15000 } },
  { day: 7, label: "👑 💎結晶石×1,600・🎟️×8", reward: { gems: 1600, tickets: 8 } }
];

function getLoginTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getDaysBetween(startStr, endStr) {
  const s = new Date(`${startStr}T00:00:00`);
  const e = new Date(`${endStr}T00:00:00`);
  return Math.max(0, Math.floor((e - s) / 86400000));
}

function ensureLoginBonusState() {
  const today = getLoginTodayStr();
  state.loginBonus = state.loginBonus || {
    firstLoginDate: today,
    normalDay: 0,
    normalCycle: 1,
    lastNormalDate: "",
    beginnerClaimedDays: 0,
    lastBeginnerDate: ""
  };
  if (!state.loginBonus.firstLoginDate) state.loginBonus.firstLoginDate = today;
  return state.loginBonus;
}

function isBeginnerBonusActive() {
  const lb = ensureLoginBonusState();
  const elapsed = getDaysBetween(lb.firstLoginDate, getLoginTodayStr());
  return elapsed < 7 && lb.beginnerClaimedDays < 7;
}

function getLoginBonusStatus() {
  const lb = ensureLoginBonusState();
  const today = getLoginTodayStr();
  const elapsed = getDaysBetween(lb.firstLoginDate, today);
  const beginnerRemainDays = Math.max(0, 7 - elapsed);

  const canNormal = lb.lastNormalDate !== today;
  const canBeginner = isBeginnerBonusActive() && lb.lastBeginnerDate !== today;

  return {
    lb, today, beginnerRemainDays,
    beginnerActive: isBeginnerBonusActive(),
    canNormal, canBeginner,
    unclaimedCount: (canNormal ? 1 : 0) + (canBeginner ? 1 : 0)
  };
}

function applyLoginReward(rw) {
  if (rw.gems) state.gems += rw.gems;
  if (rw.credits) state.credits += rw.credits;
  if (rw.tickets) state.cardTickets = (state.cardTickets || 0) + rw.tickets;
  if (rw.books) state.expBooks = (state.expBooks || 0) + rw.books;
  if (rw.cores) state.cores = (state.cores || 0) + rw.cores;
}

function openLoginBonusModal() {
  renderLoginBonusModal();
  document.getElementById("modal-login-bonus").classList.add("active");
}

function closeLoginBonusModal() {
  document.getElementById("modal-login-bonus").classList.remove("active");
}

function checkLoginBonusAutoOpen() {
  if (!state?.initialized) return;
  const st = getLoginBonusStatus();
  updateLoginBonusBadge();
  if (st.unclaimedCount > 0) {
    setTimeout(() => openLoginBonusModal(), 350);
  }
}

function updateLoginBonusBadge() {
  const st = getLoginBonusStatus();
  const b = document.getElementById("home-login-badge");
  if (b) {
    b.style.display = st.unclaimedCount > 0 ? "inline-block" : "none";
    b.textContent = `${st.unclaimedCount}件`;
  }
  if (typeof updateTabletBadge === "function") updateTabletBadge();
}

function renderLoginBonusGrid(list, claimedCount, canClaimToday) {
  return `
    <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:5px; margin-top:6px;">
      ${list.map((item, idx) => {
        const done = idx < claimedCount;
        const isToday = idx === claimedCount && canClaimToday;
        const bg = done ? "rgba(24,184,138,0.22)" : (isToday ? "rgba(255,208,0,0.28)" : "var(--surface-sub)");
        const bd = isToday ? "#ff7b39" : (done ? "#18b88a" : "var(--border)");
        const span2 = idx === 6 ? "grid-column:span 2;" : "";
        return `
          <div style="${span2} background:${bg}; border:2px solid${bd}; border-radius:10px; padding:5px 3px; text-align:center;">
            <div style="font-size:9px; font-weight:900; color:${isToday ? "#ff7b39" : "var(--muted)"};">
              ${done ? "✓済" : (isToday ? "★本日" : `${item.day}日目`)}
            </div>
            <div style="font-size:10px; font-weight:900; margin-top:2px; line-height:1.25;">${item.label}</div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderLoginBonusModal() {
  const st = getLoginBonusStatus();
  const { lb, beginnerActive, beginnerRemainDays, canNormal, canBeginner } = st;

  const normalCycleDisplay = lb.normalDay >= 7 && canNormal ? lb.normalCycle + 1 : lb.normalCycle;
  const normalClaimedDisp = lb.normalDay >= 7 && canNormal ? 0 : lb.normalDay;

  let beginnerHtml = "";
  if (beginnerActive || lb.beginnerClaimedDays >= 7) {
    const fin = lb.beginnerClaimedDays >= 7;
    beginnerHtml = `
      <div style="background:linear-gradient(135deg, rgba(255,208,0,0.16), rgba(255,123,57,0.16)); border:2px solid #ff7b39; border-radius:12px; padding:9px; margin-bottom:10px; text-align:left;">
        <div class="top-row">
          <strong style="font-size:12.5px;">🌟 初心者応援ログインボーナス</strong>
          <span class="tag" style="background:#ff7b39; color:#fff;">${fin ? "達成済" : `残り${beginnerRemainDays}日`}</span>
        </div>
        <div style="font-size:10px; color:var(--muted); margin-top:2px;">開始から7日間限定！通常ログボと合わせて毎日2個もらえます！</div>
        ${renderLoginBonusGrid(BEGINNER_LOGIN_REWARDS, lb.beginnerClaimedDays, canBeginner)}
      </div>
    `;
  }

  const normalHtml = `
    <div style="background:var(--surface-sub); border:2px solid var(--border); border-radius:12px; padding:9px; margin-bottom:10px; text-align:left;">
      <div class="top-row">
        <strong style="font-size:12.5px;">📅 通常ログインボーナス（${normalCycleDisplay}周目）</strong>
        <span class="tag">${canNormal ? "受取可能" : "本日受取済"}</span>
      </div>
      <div style="font-size:10px; color:var(--muted); margin-top:2px;">7日ごとにずっとループする毎日の継続ログイン報酬です。</div>
      ${renderLoginBonusGrid(NORMAL_LOGIN_REWARDS, normalClaimedDisp, canNormal)}
    </div>
  `;

  const btnHtml = st.unclaimedCount > 0
    ? `<button class="btn-accent2" style="width:100%; padding:12px; font-size:14px;" onclick="claimAllLoginBonuses()">🎁 本日のログインボーナスを受け取る（${st.unclaimedCount}件）</button>`
    : `<button class="btn-primary" style="width:100%; padding:11px;" onclick="closeLoginBonusModal()">確認OK（また明日！）</button>`;

  document.getElementById("login-bonus-body").innerHTML = beginnerHtml + normalHtml + btnHtml;
}

function claimAllLoginBonuses() {
  const st = getLoginBonusStatus();
  const { lb, today, canNormal, canBeginner } = st;
  if (!canNormal && !canBeginner) { closeLoginBonusModal(); return; }

  const msgs = [];
  if (canNormal) {
    if (lb.normalDay >= 7) { lb.normalDay = 0; lb.normalCycle = (lb.normalCycle || 1) + 1; }
    const item = NORMAL_LOGIN_REWARDS[lb.normalDay];
    applyLoginReward(item.reward);
    lb.normalDay += 1;
    lb.lastNormalDate = today;
    msgs.push(`通常${lb.normalDay}日目(${item.label})`);
  }

  if (canBeginner) {
    const item = BEGINNER_LOGIN_REWARDS[lb.beginnerClaimedDays];
    if (item) {
      applyLoginReward(item.reward);
      lb.beginnerClaimedDays += 1;
      lb.lastBeginnerDate = today;
      msgs.push(`初心者${lb.beginnerClaimedDays}日目(${item.label})`);
    }
  }

  saveGame();
  playSfx("gift");
  renderTopBar();
  updateLoginBonusBadge();
  renderLoginBonusModal();
  showToast(`🎉 ログボ受取：${msgs.join(" ＋ ")}`);
}
