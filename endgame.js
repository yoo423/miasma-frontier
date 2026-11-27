let currentEndgameTab = "tower"; // "tower" | "raid"

const TOWER_MAX_FLOOR = 50;
const TOWER_ENEMY_CYCLE = [
  "wolf_pack", "spore_slime", "forest_boar", "crystal_beetle", "moss_behemoth",
  "spark_raptor", "volt_scarab", "blizzard_hound", "frost_spider", "thunder_wyvern",
  "lava_golem", "neon_angler", "spire_seraph", "radiant_behemoth", "radiant_wyvern"
];

const RAID_BOSS_ROTATION = [
  { id: "radiant_behemoth",  name: "【極・融光襲来】煌角のベヒーモス",       hpMult: 4.5, atkMult: 1.35, minReqLv: 22 },
  { id: "radiant_wyvern",    name: "【極・融光襲来】天雷のオーバーワイバーン", hpMult: 4.2, atkMult: 1.35, minReqLv: 28 },
  { id: "radiant_mammoth",   name: "【極・融光襲来】絶対零度の帝王マンモス",   hpMult: 4.0, atkMult: 1.35, minReqLv: 32 },
  { id: "radiant_salamander",name: "【極・融光襲来】紅蓮業火の炎帝竜",         hpMult: 3.8, atkMult: 1.35, minReqLv: 36 },
  { id: "radiant_kraken",    name: "【極・融光襲来】深淵ネオン・リヴァイアサン",hpMult: 3.6, atkMult: 1.35, minReqLv: 40 },
  { id: "radiant_zero",      name: "【極・融光襲来】原初の災厄・ゼロ",         hpMult: 3.5, atkMult: 1.35, minReqLv: 45 }
];

const RAID_SCORE_TIERS = [
  { rank: "C",   score: 8000,   reward: { credits: 8000,  tickets: 1 } },
  { rank: "B",   score: 20000,  reward: { gems: 100,      tickets: 2 } },
  { rank: "A",   score: 45000,  reward: { gems: 160,      cores: 5 } },
  { rank: "S",   score: 80000,  reward: { gems: 240,      tickets: 3 } },
  { rank: "SS",  score: 130000, reward: { gems: 360,      cores: 10 } },
  { rank: "SSS", score: 200000, reward: { gems: 640,      tickets: 6 } }
];

function ensureEndgameState() {
  state.towerFloor = state.towerFloor || 0; // 踏破済み最高階層
  state.towerSweepDate = state.towerSweepDate || "";
  const week = typeof getWeekKey === "function" ? getWeekKey() : "2026-W01";
  const today = typeof getTodayKey === "function" ? getTodayKey() : new Date().toISOString().slice(0, 10);

  if (!state.raidState || state.raidState.weekKey !== week) {
    state.raidState = { weekKey: week, bestScore: 0, claimedRanks: [], attemptDate: today, attemptsUsed: 0 };
  }
  if (state.raidState.attemptDate !== today) {
    state.raidState.attemptDate = today;
    state.raidState.attemptsUsed = 0;
  }
  return state.raidState;
}

function getTowerFloorConfig(floor) {
  const isBoss = floor % 5 === 0;
  let enemyId = TOWER_ENEMY_CYCLE[(floor - 1) % TOWER_ENEMY_CYCLE.length];
  if (floor === 5)  enemyId = "moss_behemoth";
  if (floor === 10) enemyId = "radiant_behemoth";
  if (floor === 15) enemyId = "thunder_wyvern";
  if (floor === 20) enemyId = "radiant_wyvern";
  if (floor === 25) enemyId = "glacial_mammoth";
  if (floor === 30) enemyId = "radiant_mammoth";
  if (floor === 35) enemyId = "magma_salamander";
  if (floor === 40) enemyId = "radiant_salamander";
  if (floor === 45) enemyId = "abyss_kraken";
  if (floor === 50) enemyId = "radiant_zero";

  const hpMult = Number((1.15 + floor * 0.08 + (isBoss ? 0.35 : 0)).toFixed(2));
  const atkMult = Number((1.05 + floor * 0.045 + (isBoss ? 0.2 : 0)).toFixed(2));
  const minReqLv = Math.min(60, 12 + Math.floor(floor * 0.85));
  const reward = {
    gems: isBoss ? 240 + floor * 4 : 80 + Math.floor(floor * 2),
    tickets: isBoss ? 3 : 1,
    cores: isBoss ? 6 : 2,
    credits: 4000 + floor * 600
  };
  return { floor, isBoss, enemyId, hpMult, atkMult, minReqLv, reward };
}

function getCurrentRaidBoss() {
  const weekStr = typeof getWeekKey === "function" ? getWeekKey() : "2026-W01";
  const num = Number(weekStr.replace(/\D/g, "")) || 1;
  return RAID_BOSS_ROTATION[num % RAID_BOSS_ROTATION.length];
}

function getRaidRankLabel(score) {
  let cur = "ー";
  RAID_SCORE_TIERS.forEach(t => { if (score >= t.score) cur = t.rank; });
  return cur;
}

function getUnclaimedEndgameCount() {
  if (!isFeatureUnlocked("endgame")) return 0;
  const rs = ensureEndgameState();
  const today = typeof getTodayKey === "function" ? getTodayKey() : new Date().toISOString().slice(0, 10);
  let cnt = 0;
  if (state.towerFloor > 0 && state.towerSweepDate !== today) cnt += 1;
  RAID_SCORE_TIERS.forEach(t => {
    if (rs.bestScore >= t.score && !rs.claimedRanks.includes(t.rank)) cnt += 1;
  });
  return cnt;
}

function renderEndgameView() {
  renderTopBar();
  ensureEndgameState();
  document.getElementById("eg-tab-tower").className = `select-chip ${currentEndgameTab === "tower" ? "selected" : ""}`;
  document.getElementById("eg-tab-raid").className = `select-chip ${currentEndgameTab === "raid" ? "selected" : ""}`;
  document.getElementById("eg-tower-panel").style.display = currentEndgameTab === "tower" ? "block" : "none";
  document.getElementById("eg-raid-panel").style.display = currentEndgameTab === "raid" ? "block" : "none";

  if (currentEndgameTab === "tower") renderTowerPanel();
  else renderRaidPanel();
}

function renderTowerPanel() {
  const cleared = state.towerFloor || 0;
  const nextFloor = Math.min(TOWER_MAX_FLOOR, cleared + 1);
  const cfg = getTowerFloorConfig(nextFloor);
  const en = (window.MF_DATA.ENEMIES || []).find(e => e.id === cfg.enemyId) || window.MF_DATA.ENEMIES[0];
  const today = typeof getTodayKey === "function" ? getTodayKey() : new Date().toISOString().slice(0, 10);
  const canSweep = cleared > 0 && state.towerSweepDate !== today;
  const avgLv = typeof getPartyAvgLevel === "function" ? getPartyAvgLevel() : 1;

  document.getElementById("eg-tower-summary").innerHTML = `
    <div class="top-row" style="margin-bottom:5px;">
      <strong style="font-size:13px;">🗼 到達階層：${cleared} / ${TOWER_MAX_FLOOR}階</strong>
      <span class="rank-pill">小隊平均Lv.${avgLv}</span>
    </div>
    <div class="gauge-bar" style="height:8px; margin-bottom:8px;">
      <div style="background:linear-gradient(90deg, #b565ff, #ffd000); width:${Math.round((cleared / TOWER_MAX_FLOOR) * 100)}%;"></div>
    </div>
    <button class="btn-primary" style="width:100%;" ${canSweep ? "" : "disabled"} onclick="claimTowerDailySweep()">
      ${cleared === 0 ? "1階クリアで毎日掃討が解放" : (canSweep ? `✨ 本日のタワー掃討受取（💎+${30 + cleared * 4} / 📘+${cleared * 2}）` : "✅ 本日のタワー掃討は受取済")}
    </button>
  `;

  if (cleared >= TOWER_MAX_FLOOR) {
    document.getElementById("eg-tower-next").innerHTML = `
      <div style="text-align:center; padding:16px;">
        <div style="font-size:44px;">👑</div>
        <strong style="font-size:15px; color:#ffd000;">無限の瘴霧タワー・全50階層完全制覇！</strong>
        <p style="font-size:11.5px; color:var(--muted);">毎日掃討で報酬を受け取りつつ、50階の再挑戦も可能です。</p>
        <button class="btn-accent2" style="width:100%;" onclick="startTowerFloor(50)">⚔️ 最上階(50F)へ再挑戦</button>
      </div>
    `;
    return;
  }

  const thumb = window.MF_SPRITES.enemyHTML ? window.MF_SPRITES.enemyHTML(en, "thumb") : "";
  document.getElementById("eg-tower-next").innerHTML = `
    <div class="top-row" style="margin-bottom:6px;">
      <strong style="font-size:14px; color:${cfg.isBoss ? "#ffd000" : "var(--ink)"};">${cfg.isBoss ? "👑 BOSS階" : "⚔️"} 第${nextFloor}階層</strong>
      <span class="tag">基準平均Lv.${cfg.minReqLv}</span>
    </div>
    <div style="display:flex; gap:10px; align-items:center; margin-bottom:8px;">
      ${thumb}
      <div style="flex:1; text-align:left;">
        <strong style="font-size:13px;">${escapeHtml(en.name)}</strong>
        <div style="font-size:10.5px; color:var(--muted);">HP ×${cfg.hpMult} ／ ATK ×${cfg.atkMult}</div>
        <div style="font-size:10.5px; font-weight:900; color:var(--accent); margin-top:2px;">
          初回報酬：💎+${cfg.reward.gems} / 🎟️券+${cfg.reward.tickets} / 💠+${cfg.reward.cores}
        </div>
      </div>
    </div>
    <button class="btn-accent2" style="width:100%; padding:11px;" onclick="startTowerFloor(${nextFloor})">🗼 第${nextFloor}階層へ挑戦する！</button>
  `;
}

function startTowerFloor(floor) {
  const cfg = getTowerFloorConfig(floor);
  switchView("battle");
  startBattle(cfg.enemyId, {
    returnView: "endgame",
    hpMult: cfg.hpMult,
    atkMult: cfg.atkMult,
    minReqLv: cfg.minReqLv,
    questTitle: `【瘴霧タワー ${floor}F】`,
    onWin: () => {
      if (floor > (state.towerFloor || 0)) {
        state.towerFloor = floor;
        state.gems += cfg.reward.gems;
        state.cardTickets = (state.cardTickets || 0) + cfg.reward.tickets;
        state.cores = (state.cores || 0) + cfg.reward.cores;
        state.credits += cfg.reward.credits;
        state.unlockedTitles = state.unlockedTitles || ["第7小隊・新任隊長"];
        if (floor >= 10 && !state.unlockedTitles.includes("瘴霧の踏破者")) state.unlockedTitles.push("瘴霧の踏破者");
        if (floor >= 30 && !state.unlockedTitles.includes("深淵を征く者")) state.unlockedTitles.push("深淵を征く者");
        if (floor >= 50 && !state.unlockedTitles.includes("天蓋を貫く覇者")) state.unlockedTitles.push("天蓋を貫く覇者");
        saveGame();
        showToast(`🗼 タワー第${floor}階層 初回踏破！💎+${cfg.reward.gems} / 🎟️券+${cfg.reward.tickets}！`);
      } else {
        showToast(`🗼 タワー第${floor}階層をクリアしました！`);
      }
    }
  });
}

function claimTowerDailySweep() {
  const cleared = state.towerFloor || 0;
  if (cleared <= 0) return;
  const today = typeof getTodayKey === "function" ? getTodayKey() : new Date().toISOString().slice(0, 10);
  if (state.towerSweepDate === today) { showToast("本日の掃討報酬は受取済みです"); return; }
  const gems = 30 + cleared * 4;
  const books = cleared * 2;
  const credits = cleared * 400;
  state.towerSweepDate = today;
  state.gems += gems;
  state.expBooks = (state.expBooks || 0) + books;
  state.credits += credits;
  saveGame(); playSfx("gift");
  renderTopBar();
  renderTowerPanel();
  if (typeof updateTabletBadge === "function") updateTabletBadge();
  showToast(`✨ タワー掃討完了！💎+${gems} / 📘+${books} / 🪙+${credits.toLocaleString()}`);
}

// ---------- ☄️ 融光襲来レイド（スコアアタック） ----------
function renderRaidPanel() {
  const rs = ensureEndgameState();
  const bossCfg = getCurrentRaidBoss();
  const en = (window.MF_DATA.ENEMIES || []).find(e => e.id === bossCfg.id) || window.MF_DATA.ENEMIES[5];
  const remain = Math.max(0, 3 - (rs.attemptsUsed || 0));
  const curRank = getRaidRankLabel(rs.bestScore);
  const thumb = window.MF_SPRITES.enemyHTML ? window.MF_SPRITES.enemyHTML(en, "thumb") : "";

  document.getElementById("eg-raid-boss-card").innerHTML = `
    <div class="top-row" style="margin-bottom:6px;">
      <strong style="font-size:13px; color:#ffd000;">☄️ 今週の融光襲来（${rs.weekKey}）</strong>
      <span class="rank-pill">残り ${remain}/3回</span>
    </div>
    <div style="display:flex; gap:10px; align-items:center; margin-bottom:8px;">
      ${thumb}
      <div style="flex:1; text-align:left;">
        <strong style="font-size:13px;">${escapeHtml(bossCfg.name)}</strong>
        <div style="font-size:10.5px; color:var(--muted);">全滅しても与えた総ダメージ＆部位破壊数がスコアになります！</div>
        <div style="font-size:12px; font-weight:900; color:var(--accent); margin-top:3px;">
          最高スコア：${rs.bestScore.toLocaleString()} pt（ランク ${curRank}）
        </div>
      </div>
    </div>
    <button class="btn-accent2" style="width:100%; padding:11px;" ${remain <= 0 ? "disabled" : ""} onclick="startRaidBattle()">
      ${remain > 0 ? "☄️ 融光襲来レイドへ出撃！" : "本日の挑戦回数を使い切りました（明日0時回復）"}
    </button>
  `;

  document.getElementById("eg-raid-rewards").innerHTML = RAID_SCORE_TIERS.map(t => {
    const done = rs.claimedRanks.includes(t.rank);
    const ready = rs.bestScore >= t.score && !done;
    const rwTxt = formatMissionReward(t.reward);
    return `
      <div class="card" style="padding:8px 10px; margin-bottom:6px; opacity:${done ? 0.58 : 1};">
        <div class="top-row">
          <strong style="font-size:12px;">ランク ${t.rank}（${t.score.toLocaleString()} pt）</strong>
          ${done
            ? `<span class="tag" style="background:#18b88a; color:#fff;">受取済</span>`
            : (ready
                ? `<button class="btn-xs btn-accent2" onclick="claimRaidTierReward('${t.rank}')">🎁 受取</button>`
                : `<span class="tag" style="opacity:0.65;">未達成</span>`)}
        </div>
        <div style="font-size:10.5px; font-weight:900; color:var(--accent); margin-top:2px;">報酬：${rwTxt}</div>
      </div>
    `;
  }).join("");
}

function startRaidBattle() {
  const rs = ensureEndgameState();
  if ((rs.attemptsUsed || 0) >= 3) { showToast("本日のレイド挑戦回数は終了しました"); return; }
  const bossCfg = getCurrentRaidBoss();
  rs.attemptsUsed += 1;
  saveGame();

  switchView("battle");
  startBattle(bossCfg.id, {
    returnView: "endgame",
    isRaid: true,
    hpMult: bossCfg.hpMult,
    atkMult: bossCfg.atkMult,
    minReqLv: bossCfg.minReqLv,
    questTitle: "【融光襲来レイド】",
    onEnd: (didWin, stats) => {
      const dmgScore = stats?.damageDealt || 0;
      const partScore = (stats?.brokenParts || 0) * 18000;
      const winBonus = didWin ? 60000 : 0;
      const totalScore = dmgScore + partScore + winBonus;
      const isBest = totalScore > (rs.bestScore || 0);
      if (isBest) rs.bestScore = totalScore;
      saveGame();
      if (typeof updateTabletBadge === "function") updateTabletBadge();
      showToast(`☄️ レイド記録：${totalScore.toLocaleString()} pt${isBest ? "（✨自己ベスト更新！）" : ""}`);
    }
  });
}

function claimRaidTierReward(rank) {
  const rs = ensureEndgameState();
  const t = RAID_SCORE_TIERS.find(x => x.rank === rank);
  if (!t || rs.bestScore < t.score || rs.claimedRanks.includes(rank)) return;
  rs.claimedRanks.push(rank);
  if (typeof applyMissionReward === "function") applyMissionReward(t.reward);
  saveGame(); playSfx("gift");
  renderTopBar();
  renderRaidPanel();
  if (typeof updateTabletBadge === "function") updateTabletBadge();
  showToast(`☄️ レイドランク『${rank}』報酬を獲得！`);
}
