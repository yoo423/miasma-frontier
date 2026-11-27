let currentMissionTab = "daily";

const DAILY_MISSIONS = [
  { id: "d_login",  title: "前線キャンプへログイン",      type: "login",  target: 1, reward: { tickets: 2, gems: 80 } },
  { id: "d_btl1",   title: "霧獣を1体討伐する",           type: "battle", target: 1, reward: { tickets: 2, credits: 3000 } },
  { id: "d_btl3",   title: "霧獣を3体討伐する",           type: "battle", target: 3, reward: { gems: 120, books: 8 } },
  { id: "d_part1",  title: "部位破壊を1回達成する",       type: "part",   target: 1, reward: { tickets: 2, cores: 2 } },
  { id: "d_scout1", title: "スカウトを1回引く",           type: "scout",  target: 1, reward: { tickets: 2, gems: 60 } },
  { id: "d_camp1",  title: "キャンプ回収か料理を1回行う", type: "camp",   target: 1, reward: { credits: 3500, books: 6 } }
];

const WEEKLY_MISSIONS = [
  { id: "w_btl10",   title: "霧獣を累計10体討伐する",      type: "battle", target: 10, reward: { gems: 320, tickets: 5 } },
  { id: "w_btl20",   title: "霧獣を累計20体討伐する",      type: "battle", target: 20, reward: { gems: 480, tickets: 8 } },
  { id: "w_part5",   title: "部位破壊を累計5回達成する",   type: "part",   target: 5,  reward: { cores: 10, tickets: 5 } },
  { id: "w_scout10", title: "スカウトを累計10回引く",      type: "scout",  target: 10, reward: { gems: 320, books: 25 } },
  { id: "w_camp5",   title: "キャンプ回収か料理を5回行う", type: "camp",   target: 5,  reward: { credits: 18000, tickets: 4 } }
];

// 達成個数マイルストーン（アーク結晶石がザクザク手に入る！）
const DAILY_MILESTONES = [
  { count: 2, reward: { gems: 100 },            label: "2個達成" },
  { count: 4, reward: { gems: 160 },            label: "4個達成" },
  { count: 6, reward: { gems: 320, tickets: 2 }, label: "全6個達成" }
];

const WEEKLY_MILESTONES = [
  { count: 2, reward: { gems: 240 },            label: "2個達成" },
  { count: 4, reward: { gems: 480 },            label: "4個達成" },
  { count: 5, reward: { gems: 800, tickets: 5 }, label: "全5個達成" }
];

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getWeekKey() {
  const d = new Date();
  const oneJan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil((((d - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

function syncMissions() {
  state.missions = state.missions || {};
  const today = getTodayKey();
  const week = getWeekKey();

  if (state.missions.dailyKey !== today) {
    state.missions.dailyKey = today;
    state.missions.dailyProg = { login: 1, battle: 0, part: 0, scout: 0, camp: 0 };
    state.missions.dailyClaimed = [];
    state.missions.dailyMsClaimed = [];
  }
  if (state.missions.weeklyKey !== week) {
    state.missions.weeklyKey = week;
    state.missions.weeklyProg = { battle: 0, part: 0, scout: 0, camp: 0 };
    state.missions.weeklyClaimed = [];
    state.missions.weeklyMsClaimed = [];
  }
  state.missions.dailyMsClaimed = state.missions.dailyMsClaimed || [];
  state.missions.weeklyMsClaimed = state.missions.weeklyMsClaimed || [];
  updateMissionBadges();
}

function addMissionProgress(type, amount = 1) {
  if (!state || amount <= 0) return;
  syncMissions();
  state.missions.dailyProg[type] = (state.missions.dailyProg[type] || 0) + amount;
  state.missions.weeklyProg[type] = (state.missions.weeklyProg[type] || 0) + amount;
  saveGame();
  updateMissionBadges();
}

function countCompletedMissions(isDaily) {
  const list = isDaily ? DAILY_MISSIONS : WEEKLY_MISSIONS;
  const prog = isDaily ? (state.missions?.dailyProg || {}) : (state.missions?.weeklyProg || {});
  return list.filter(m => (prog[m.type] || 0) >= m.target).length;
}

function getUnclaimedMissionCount() {
  if (!state?.missions) return 0;
  let cnt = 0;
  DAILY_MISSIONS.forEach(m => {
    if ((state.missions.dailyProg?.[m.type] || 0) >= m.target && !(state.missions.dailyClaimed || []).includes(m.id)) cnt += 1;
  });
  WEEKLY_MISSIONS.forEach(m => {
    if ((state.missions.weeklyProg?.[m.type] || 0) >= m.target && !(state.missions.weeklyClaimed || []).includes(m.id)) cnt += 1;
  });
  const dComp = countCompletedMissions(true);
  const wComp = countCompletedMissions(false);
  DAILY_MILESTONES.forEach(ms => { if (dComp >= ms.count && !(state.missions.dailyMsClaimed || []).includes(ms.count)) cnt += 1; });
  WEEKLY_MILESTONES.forEach(ms => { if (wComp >= ms.count && !(state.missions.weeklyMsClaimed || []).includes(ms.count)) cnt += 1; });
  return cnt;
}

function updateMissionBadges() {
  const cnt = getUnclaimedMissionCount();
  const badge = document.getElementById("home-mission-badge");
  if (badge) {
    badge.style.display = cnt > 0 ? "inline-block" : "none";
    badge.textContent = cnt > 9 ? "9+" : `${cnt}件`;
  }
  if (typeof updateTabletBadge === "function") updateTabletBadge();
}

function formatMissionReward(rw) {
  const p = [];
  if (rw.gems) p.push(`💎${rw.gems}`);
  if (rw.tickets) p.push(`🎟️パック券×${rw.tickets}`);
  if (rw.credits) p.push(`🪙${rw.credits.toLocaleString()}`);
  if (rw.books) p.push(`📘記録×${rw.books}`);
  if (rw.cores) p.push(`💠コア×${rw.cores}`);
  return p.join(" / ");
}

function applyMissionReward(rw) {
  if (rw.tickets) state.cardTickets = (state.cardTickets || 0) + rw.tickets;
  if (rw.gems) state.gems += rw.gems;
  if (rw.credits) state.credits += rw.credits;
  if (rw.books) state.expBooks = (state.expBooks || 0) + rw.books;
  if (rw.cores) state.cores = (state.cores || 0) + rw.cores;
}

function renderMissionView() {
  renderTopBar();
  syncMissions();

  document.getElementById("ms-tab-daily").className = `select-chip ${currentMissionTab === "daily" ? "selected" : ""}`;
  document.getElementById("ms-tab-weekly").className = `select-chip ${currentMissionTab === "weekly" ? "selected" : ""}`;

  const isDaily = currentMissionTab === "daily";
  const list = isDaily ? DAILY_MISSIONS : WEEKLY_MISSIONS;
  const prog = isDaily ? state.missions.dailyProg : state.missions.weeklyProg;
  const claimed = isDaily ? state.missions.dailyClaimed : state.missions.weeklyClaimed;
  const msList = isDaily ? DAILY_MILESTONES : WEEKLY_MILESTONES;
  const msClaimed = isDaily ? state.missions.dailyMsClaimed : state.missions.weeklyMsClaimed;
  const compCnt = countCompletedMissions(isDaily);
  const pctTotal = Math.round((compCnt / list.length) * 100);

  document.getElementById("ms-reset-note").textContent = isDaily
    ? `📅 デイリー任務（毎日0時更新：${state.missions.dailyKey}）`
    : `🗓️ ウィークリー任務（毎週更新：${state.missions.weeklyKey}）`;

  // 達成個数マイルストーン（アーク結晶石ボーナスボックス）
  const milestoneHtml = `
    <div class="card" style="padding:10px; margin-bottom:10px; background:linear-gradient(135deg, rgba(255,208,0,0.14), rgba(139,70,232,0.12)); border-color:#ffd000;">
      <div class="top-row" style="margin-bottom:4px;">
        <strong style="font-size:12px;">💎 任務達成数ボーナス（${compCnt} / ${list.length}個 達成）</strong>
      </div>
      <div class="gauge-bar" style="height:8px; margin-bottom:8px;">
        <div style="background:linear-gradient(90deg, #18b88a, #ffd000); width:${pctTotal}%;"></div>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:6px;">
        ${msList.map(ms => {
          const done = msClaimed.includes(ms.count);
          const ready = compCnt >= ms.count && !done;
          return `
            <button class="btn-xs ${ready ? "btn-accent2" : ""}" style="padding:6px 4px; display:flex; flex-direction:column; align-items:center; gap:2px; opacity:${done ? 0.55 : 1};"
                    ${ready ? `onclick="claimMissionMilestone(${ms.count}, ${isDaily})"` : "disabled"}>
              <span style="font-size:9.5px;">${done ? "✓受取済" : (ready ? "🎁タップ受取" : ms.label)}</span>
              <strong style="font-size:10px;">${formatMissionReward(ms.reward)}</strong>
            </button>
          `;
        }).join("")}
      </div>
    </div>
  `;

  const listHtml = list.map(m => {
    const cur = Math.min(m.target, prog[m.type] || 0);
    const done = claimed.includes(m.id);
    const ready = cur >= m.target && !done;
    const pct = Math.round((cur / m.target) * 100);
    return `
      <div class="card" style="padding:10px; margin-bottom:7px; opacity:${done ? 0.6 : 1};">
        <div class="top-row">
          <strong style="font-size:12.5px;">${escapeHtml(m.title)}</strong>
          <span style="font-size:11px; font-weight:900;">${cur} / ${m.target}</span>
        </div>
        <div class="gauge-bar" style="height:6px; margin:5px 0;"><div style="background:${ready ? "#ff7b39" : "var(--accent)"}; width:${pct}%;"></div></div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:5px;">
          <span style="font-size:10.5px; font-weight:900; color:var(--accent);">${formatMissionReward(m.reward)}</span>
          ${done
            ? `<span class="tag" style="background:#18b88a; color:#fff;">受取済</span>`
            : (ready
                ? `<button class="btn-xs btn-accent2" onclick="claimSingleMission('${m.id}', ${isDaily})">受け取る</button>`
                : `<span class="tag" style="opacity:0.65;">進行中</span>`)}
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("ms-list").innerHTML = milestoneHtml + listHtml;
}

function claimMissionMilestone(targetCount, isDaily) {
  syncMissions();
  const msList = isDaily ? DAILY_MILESTONES : WEEKLY_MILESTONES;
  const msClaimed = isDaily ? state.missions.dailyMsClaimed : state.missions.weeklyMsClaimed;
  const ms = msList.find(x => x.count === targetCount);
  if (!ms || msClaimed.includes(targetCount) || countCompletedMissions(isDaily) < targetCount) return;

  msClaimed.push(targetCount);
  applyMissionReward(ms.reward);
  saveGame(); playSfx("gift");
  updateMissionBadges();
  renderMissionView();
  showToast(`💎 ${ms.label}ボーナス受取！${formatMissionReward(ms.reward)}`);
}

function claimSingleMission(id, isDaily) {
  syncMissions();
  const list = isDaily ? DAILY_MISSIONS : WEEKLY_MISSIONS;
  const prog = isDaily ? state.missions.dailyProg : state.missions.weeklyProg;
  const claimed = isDaily ? state.missions.dailyClaimed : state.missions.weeklyClaimed;
  const m = list.find(x => x.id === id);
  if (!m || claimed.includes(id) || (prog[m.type] || 0) < m.target) return;

  claimed.push(id);
  applyMissionReward(m.reward);
  saveGame(); playSfx("gift");
  updateMissionBadges();
  renderMissionView();
  showToast(`📋 任務達成！${formatMissionReward(m.reward)}`);
}

function claimAllMissions() {
  syncMissions();
  let count = 0;
  [
    { list: DAILY_MISSIONS, prog: state.missions.dailyProg, claimed: state.missions.dailyClaimed, msList: DAILY_MILESTONES, msClaimed: state.missions.dailyMsClaimed, isDaily: true },
    { list: WEEKLY_MISSIONS, prog: state.missions.weeklyProg, claimed: state.missions.weeklyClaimed, msList: WEEKLY_MILESTONES, msClaimed: state.missions.weeklyMsClaimed, isDaily: false }
  ].forEach(g => {
    g.list.forEach(m => {
      if ((g.prog[m.type] || 0) >= m.target && !g.claimed.includes(m.id)) {
        g.claimed.push(m.id); applyMissionReward(m.reward); count += 1;
      }
    });
    const comp = countCompletedMissions(g.isDaily);
    g.msList.forEach(ms => {
      if (comp >= ms.count && !g.msClaimed.includes(ms.count)) {
        g.msClaimed.push(ms.count); applyMissionReward(ms.reward); count += 1;
      }
    });
  });

  if (count === 0) { showToast("受け取れる達成済み報酬はありません"); return; }
  saveGame(); playSfx("gift");
  updateMissionBadges();
  renderMissionView();
  showToast(`🎉 任務＆達成数ボーナス計 ${count}件を一括受取しました！`);
}

window.addEventListener("load", () => {
  if (typeof window.collectCampOutput === "function") {
    const origCollect = window.collectCampOutput;
    window.collectCampOutput = function() {
      const before = state?.camp?.lastCollectTime;
      origCollect.apply(this, arguments);
      if (state?.camp?.lastCollectTime !== before) addMissionProgress("camp", 1);
    };
  }
  if (typeof window.stopCookingGame === "function") {
    const origCook = window.stopCookingGame;
    window.stopCookingGame = function() {
      origCook.apply(this, arguments);
      addMissionProgress("camp", 1);
    };
  }
});
