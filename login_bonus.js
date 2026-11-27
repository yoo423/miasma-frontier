// 永続ループする通常ログインボーナス（7日周期でずっと続く）
const NORMAL_LOGIN_REWARDS = [
  { day: 1, label: "🎟️ パック券×2",        reward: { tickets: 2 } },
  { day: 2, label: "🪙 5,000クレジット",   reward: { credits: 5000 } },
  { day: 3, label: "📘 作戦記録×15",       reward: { books: 15 } },
  { day: 4, label: "💎 結晶石×160",        reward: { gems: 160 } },
  { day: 5, label: "💠 元素コア×5",        reward: { cores: 5 } },
  { day: 6, label: "🎟️ パック券×4",        reward: { tickets: 4 } },
  { day: 7, label: "💎 結晶石×320・🎟️×3",  reward: { gems: 320, tickets: 3 } }
];

// 開始から7日間限定：初心者応援ログインボーナス（期間中は毎日W受取）
const BEGINNER_LOGIN_REWARDS = [
  { day: 1, label: "💎 結晶石×320",          reward: { gems: 320 } },
  { day: 2, label: "🎟️ パック券×5",          reward: { tickets: 5 } },
  { day: 3, label: "📘 作戦記録×30・🪙8,000", reward: { books: 30, credits: 8000 } },
  { day: 4, label: "💎 結晶石×480",          reward: { gems: 480 } },
  { day: 5, label: "💠 元素コア×10・🎟️×4",    reward: { cores: 10, tickets: 4 } },
  { day: 6, label: "📘 作戦記録×50・🪙15,000", reward: { books: 50, credits: 15000 } },
  { day: 7, label: "👑 💎結晶石×1,600・🎟️×8", reward: { gems: 1600, tickets: 8 } }
];

// 30日間『フロンティア・マンスリーパス』仕様
const MONTHLY_PASS_DAILY = { gems: 120, tickets: 1, reserveEn: 40 };
const MONTHLY_PASS_IMMEDIATE = { gems: 320, tickets: 3 };
const MONTHLY_PASS_MILESTONES = [
  { day: 7,  label: "累計7日",  desc: "💎240 / 🎟️×3",     reward: { gems: 240, tickets: 3 } },
  { day: 15, label: "累計15日", desc: "💎480 / 💠コア×8", reward: { gems: 480, cores: 8 } },
  { day: 30, label: "累計30日", desc: "👑SSR確定＋💎640", reward: { gems: 640, guaranteedSsrCard: true } }
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

function ensureMonthlyPassState() {
  state.monthlyPass = state.monthlyPass || {
    remainDays: 0,
    lastClaimDate: "",
    cycleClaimedDays: 0,
    claimedMilestones: []
  };
  state.monthlyPass.claimedMilestones = state.monthlyPass.claimedMilestones || [];
  return state.monthlyPass;
}

function isBeginnerBonusActive() {
  const lb = ensureLoginBonusState();
  const elapsed = getDaysBetween(lb.firstLoginDate, getLoginTodayStr());
  return elapsed < 7 && lb.beginnerClaimedDays < 7;
}

function getLoginBonusStatus() {
  const lb = ensureLoginBonusState();
  const mp = ensureMonthlyPassState();
  const today = getLoginTodayStr();
  const elapsed = getDaysBetween(lb.firstLoginDate, today);
  const beginnerRemainDays = Math.max(0, 7 - elapsed);

  const canNormal = lb.lastNormalDate !== today;
  const canBeginner = isBeginnerBonusActive() && lb.lastBeginnerDate !== today;
  const canMonthly = mp.remainDays > 0 && mp.lastClaimDate !== today;
  const readyPassMilestones = MONTHLY_PASS_MILESTONES.filter(
    m => mp.cycleClaimedDays >= m.day && !mp.claimedMilestones.includes(m.day)
  ).length;

  return {
    lb, mp, today, beginnerRemainDays,
    beginnerActive: isBeginnerBonusActive(),
    canNormal, canBeginner, canMonthly, readyPassMilestones,
    unclaimedCount: (canNormal ? 1 : 0) + (canBeginner ? 1 : 0) + (canMonthly ? 1 : 0) + readyPassMilestones
  };
}

function grantGuaranteedSsrCard() {
  state.ownedCards = state.ownedCards || { ...window.MF_CARDS.STARTER_OWNED_CARDS };
  const ssrList = Object.values(window.MF_CARDS.TACTIC_CARDS || {}).filter(c => c.rarity === "SSR");
  if (!ssrList.length) return "";
  const unowned = ssrList.filter(c => (state.ownedCards[c.id] || 0) === 0);
  const pool = unowned.length > 0 ? unowned : ssrList;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  const prev = state.ownedCards[picked.id] || 0;
  state.ownedCards[picked.id] = Math.min(5, prev + 1);
  return `${picked.icon}${picked.name}(Lv.${state.ownedCards[picked.id]})`;
}

function applyLoginReward(rw) {
  if (rw.gems) state.gems += rw.gems;
  if (rw.credits) state.credits += rw.credits;
  if (rw.tickets) state.cardTickets = (state.cardTickets || 0) + rw.tickets;
  if (rw.books) state.expBooks = (state.expBooks || 0) + rw.books;
  if (rw.cores) state.cores = (state.cores || 0) + rw.cores;
  if (rw.reserveEn) state.reserveEn = Math.min(1000, (state.reserveEn || 0) + rw.reserveEn);
  if (rw.guaranteedSsrCard) return grantGuaranteedSsrCard();
  return "";
}

// マンスリーパス（30日）の有効化・延長（最大90日）
function activateMonthlyPass(payType) {
  const mp = ensureMonthlyPassState();
  if (mp.remainDays + 30 > 90) {
    showToast("🎫 マンスリーパスの残り日数は最大90日まで延長できます");
    return;
  }
  if (payType === "gems") {
    if (state.gems < 480) { showToast("💎 アーク結晶石が足りません（必要 480）"); return; }
    if (!confirm("💎 結晶石 480個で『フロンティア・マンスリーパス（30日間）』を有効化しますか？\n（即時 💎320＋🎟️×3 ／ 毎日 💎120＋🎟️×1＋予備EN+40）")) return;
    state.gems -= 480;
  } else {
    if (state.credits < 60000) { showToast("🪙 クレジットが足りません（必要 60,000）"); return; }
    if (!confirm("🪙 60,000クレジットで『フロンティア・マンスリーパス（30日間）』を有効化しますか？\n（即時 💎320＋🎟️×3 ／ 毎日 💎120＋🎟️×1＋予備EN+40）")) return;
    state.credits -= 60000;
  }

  mp.remainDays += 30;
  applyLoginReward(MONTHLY_PASS_IMMEDIATE);
  saveGame();
  playSfx("gift");
  renderTopBar();
  updateLoginBonusBadge();
  if (document.getElementById("modal-login-bonus")?.classList.contains("active")) renderLoginBonusModal();
  if (document.getElementById("view-shop")?.classList.contains("active") && typeof renderShopView === "function") renderShopView();
  showToast(`🎫 マンスリーパス有効化（残り${mp.remainDays}日）！即時特典 💎+320 / 🎟️+3 獲得！`);
}

function claimMonthlyPassMilestone(dayNum) {
  const mp = ensureMonthlyPassState();
  const ms = MONTHLY_PASS_MILESTONES.find(x => x.day === dayNum);
  if (!ms || mp.cycleClaimedDays < dayNum || mp.claimedMilestones.includes(dayNum)) return;

  mp.claimedMilestones.push(dayNum);
  const ssrGot = applyLoginReward(ms.reward);

  // 30日特典を受け取ったら次の30日累計サイクルへループ
  if (dayNum === 30) {
    mp.cycleClaimedDays = Math.max(0, mp.cycleClaimedDays - 30);
    mp.claimedMilestones = [];
  }

  saveGame();
  playSfx("gift");
  renderTopBar();
  updateLoginBonusBadge();
  renderLoginBonusModal();
  showToast(`👑 マンスリーパス${ms.label}特典受取！${ssrGot ? `SSR『${ssrGot}』＋💎640` : ms.desc}`);
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
  if (st.unclaimedCount > 0) setTimeout(() => openLoginBonusModal(), 350);
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
          <div style="${span2} background:${bg}; border:2px solid ${bd}; border-radius:10px; padding:5px 3px; text-align:center;">
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
  const { lb, mp, beginnerActive, beginnerRemainDays, canNormal, canBeginner, canMonthly } = st;
  const normalCycleDisplay = lb.normalDay >= 7 && canNormal ? lb.normalCycle + 1 : lb.normalCycle;
  const normalClaimedDisp = lb.normalDay >= 7 && canNormal ? 0 : lb.normalDay;

  // 1. 初心者応援（開始7日間）
  let beginnerHtml = "";
  if (beginnerActive || lb.beginnerClaimedDays >= 7) {
    const fin = lb.beginnerClaimedDays >= 7;
    beginnerHtml = `
      <div style="background:linear-gradient(135deg, rgba(255,208,0,0.16), rgba(255,123,57,0.16)); border:2px solid #ff7b39; border-radius:12px; padding:9px; margin-bottom:9px; text-align:left;">
        <div class="top-row">
          <strong style="font-size:12px;">🌟 初心者応援ログインボーナス</strong>
          <span class="tag" style="background:#ff7b39; color:#fff;">${fin ? "達成済" : `残り${beginnerRemainDays}日`}</span>
        </div>
        <div style="font-size:10px; color:var(--muted); margin-top:2px;">開始7日間限定！通常ログボと合わせて毎日W受取！</div>
        ${renderLoginBonusGrid(BEGINNER_LOGIN_REWARDS, lb.beginnerClaimedDays, canBeginner)}
      </div>
    `;
  }

  // 2. フロンティア・マンスリーパス（30日）
  const passActive = mp.remainDays > 0;
  const passMsHtml = MONTHLY_PASS_MILESTONES.map(ms => {
    const done = mp.claimedMilestones.includes(ms.day);
    const ready = mp.cycleClaimedDays >= ms.day && !done;
    return `
      <button class="btn-xs ${ready ? "btn-accent2" : ""}" style="padding:4px 3px; font-size:9.5px; opacity:${done ? 0.55 : 1};"
              ${ready ? `onclick="claimMonthlyPassMilestone(${ms.day})"` : "disabled"}>
        ${done ? "✓済" : (ready ? "🎁受取" : ms.label)}<br>${ms.desc}
      </button>
    `;
  }).join("");

  const passHtml = `
    <div style="background:linear-gradient(135deg, rgba(139,70,232,0.18), rgba(255,208,0,0.18)); border:2px solid #b565ff; border-radius:12px; padding:9px; margin-bottom:9px; text-align:left;">
      <div class="top-row">
        <strong style="font-size:12px;">🎫 フロンティア・マンスリーパス</strong>
        <span class="tag" style="background:${passActive ? "#18b88a; color:#fff;" : "var(--surface);"}">${passActive ? `残り${mp.remainDays}日` : "未加入"}</span>
      </div>
      <div style="font-size:10px; color:var(--muted); margin:3px 0 6px;">
        毎日 <strong>💎120＋🎟️券×1＋⚡予備EN+40</strong>（累計受取：${mp.cycleClaimedDays}/30日）
      </div>
      <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:4px; margin-bottom:6px;">${passMsHtml}</div>
      ${passActive
        ? `<div style="font-size:10px; font-weight:900; color:var(--accent);">${canMonthly ? "✨ 本日のパス日次補給が受け取れます！" : "✅ 本日のパス日次補給は受取済"}</div>`
        : `<div style="display:grid; grid-template-columns:1fr 1fr; gap:5px;">
             <button class="btn-xs btn-primary" onclick="activateMonthlyPass('gems')">💎480で30日加入</button>
             <button class="btn-xs" onclick="activateMonthlyPass('credits')">🪙60,000で加入</button>
           </div>`}
    </div>
  `;

  // 3. 通常7日間ログボ（永続ループ）
  const normalHtml = `
    <div style="background:var(--surface-sub); border:2px solid var(--border); border-radius:12px; padding:9px; margin-bottom:10px; text-align:left;">
      <div class="top-row">
        <strong style="font-size:12px;">📅 通常ログインボーナス（${normalCycleDisplay}周目）</strong>
        <span class="tag">${canNormal ? "受取可能" : "本日受取済"}</span>
      </div>
      ${renderLoginBonusGrid(NORMAL_LOGIN_REWARDS, normalClaimedDisp, canNormal)}
    </div>
  `;

  const dailyClaimCount = (canNormal ? 1 : 0) + (canBeginner ? 1 : 0) + (canMonthly ? 1 : 0);
  const btnHtml = dailyClaimCount > 0
    ? `<button class="btn-accent2" style="width:100%; padding:12px; font-size:14px;" onclick="claimAllLoginBonuses()">🎁 本日のログボを一括受取（${dailyClaimCount}件）</button>`
    : `<button class="btn-primary" style="width:100%; padding:11px;" onclick="closeLoginBonusModal()">確認OK（また明日！）</button>`;

  document.getElementById("login-bonus-body").innerHTML = beginnerHtml + passHtml + normalHtml + btnHtml;
}

function claimAllLoginBonuses() {
  const st = getLoginBonusStatus();
  const { lb, mp, today, canNormal, canBeginner, canMonthly } = st;
  if (!canNormal && !canBeginner && !canMonthly) { closeLoginBonusModal(); return; }

  const msgs = [];
  if (canNormal) {
    if (lb.normalDay >= 7) { lb.normalDay = 0; lb.normalCycle = (lb.normalCycle || 1) + 1; }
    const item = NORMAL_LOGIN_REWARDS[lb.normalDay];
    applyLoginReward(item.reward);
    lb.normalDay += 1;
    lb.lastNormalDate = today;
    msgs.push(`通常${lb.normalDay}日目`);
  }
  if (canBeginner) {
    const item = BEGINNER_LOGIN_REWARDS[lb.beginnerClaimedDays];
    if (item) {
      applyLoginReward(item.reward);
      lb.beginnerClaimedDays += 1;
      lb.lastBeginnerDate = today;
      msgs.push(`初心者${lb.beginnerClaimedDays}日目`);
    }
  }
  if (canMonthly) {
    applyLoginReward(MONTHLY_PASS_DAILY);
    mp.remainDays = Math.max(0, mp.remainDays - 1);
    mp.cycleClaimedDays = (mp.cycleClaimedDays || 0) + 1;
    mp.lastClaimDate = today;
    msgs.push("🎫マンスリーパス(💎120/🎟️1/⚡40)");
  }

  saveGame();
  playSfx("gift");
  renderTopBar();
  updateLoginBonusBadge();
  renderLoginBonusModal();
  showToast(`🎉 受取完了：${msgs.join(" ＋ ")}`);
}
