// =========================================================
// 🗺️ 開拓本部システム（超難度6エリア・実戦浄化・関門ガーディアン・本部Lv10）
// =========================================================
const PIONEER_REGIONS = [
  {
    id: "verde", icon: "🌿", name: "新緑の平原",
    reqRank: 1, prevId: "", prevReqExp: 0,
    enCost: 20, stepExp: 5, baseLv: 10, baseCredits: 2600, rankExp: 26,
    enemies: ["moss_behemoth"],
    bosses:  ["moss_behemoth", "radiant_behemoth"]
  },
  {
    id: "volt", icon: "⚡", name: "雷鳴の遺跡群",
    reqRank: 6, prevId: "verde", prevReqExp: 50,
    enCost: 25, stepExp: 4, baseLv: 26, baseCredits: 4200, rankExp: 32,
    enemies: ["thunder_wyvern"],
    bosses:  ["thunder_wyvern", "radiant_wyvern"]
  },
  {
    id: "frost", icon: "❄️", name: "白銀の凍結渓谷",
    reqRank: 12, prevId: "volt", prevReqExp: 50,
    enCost: 30, stepExp: 4, baseLv: 44, baseCredits: 6400, rankExp: 38,
    enemies: ["glacial_mammoth"],
    bosses:  ["glacial_mammoth", "radiant_mammoth"]
  },
  {
    id: "magma", icon: "🔥", name: "紅蓮の溶岩火口",
    reqRank: 18, prevId: "frost", prevReqExp: 50,
    enCost: 35, stepExp: 3, baseLv: 58, baseCredits: 9200, rankExp: 44,
    enemies: ["magma_salamander"],
    bosses:  ["magma_salamander", "radiant_salamander"]
  },
  {
    id: "abyss", icon: "🌊", name: "深淵の結晶海溝",
    reqRank: 25, prevId: "magma", prevReqExp: 50,
    enCost: 40, stepExp: 3, baseLv: 70, baseCredits: 13500, rankExp: 50,
    enemies: ["abyss_kraken"],
    bosses:  ["abyss_kraken", "radiant_kraken"]
  },
  {
    id: "zero", icon: "👑", name: "終焉の零点領域",
    reqRank: 32, prevId: "abyss", prevReqExp: 75,
    enCost: 50, stepExp: 2, baseLv: 80, baseCredits: 20000, rankExp: 58,
    enemies: ["spire_seraph", "radiant_zero"],
    bosses:  ["radiant_zero", "spire_seraph"]
  }
];

const PIONEER_GATES = [
  { pct: 25,  label: "第1防衛関門", lvAdd: 2,  tierId: 1, hpMult: 1.35, atkMult: 1.18, gems: 180,  credits: 6000,  tickets: 2, cores: 2,  crests: 0  },
  { pct: 50,  label: "第2防衛関門", lvAdd: 5,  tierId: 2, hpMult: 1.85, atkMult: 1.38, gems: 280,  credits: 12000, tickets: 3, cores: 4,  crests: 5  },
  { pct: 75,  label: "第3深層関門", lvAdd: 8,  tierId: 3, hpMult: 2.55, atkMult: 1.65, gems: 420,  credits: 22000, tickets: 4, cores: 7,  crests: 12 },
  { pct: 100, label: "最終浄化決戦", lvAdd: 11, tierId: 4, hpMult: 3.55, atkMult: 1.98, gems: 800,  credits: 45000, tickets: 8, cores: 14, crests: 25 }
];

// 開拓Lv特典（最終盤 Lv.45 まで拡張）
const PIONEER_LV_PERKS = [
  { lv: 4,  icon: "🪙", name: "補給路開通",     desc: "討伐クレジット +15%" },
  { lv: 8,  icon: "🌟", name: "先制共鳴",       desc: "開幕EXゲージ +15%" },
  { lv: 12, icon: "🛡️", name: "浄化防壁",       desc: "開幕バリア +12%" },
  { lv: 16, icon: "🔵", name: "前線指揮網",     desc: "開幕AP +1（初手5）" },
  { lv: 22, icon: "💥", name: "部位解体支援",   desc: "部位破壊+25%＆全ステ+10%" },
  { lv: 28, icon: "💎", name: "軌道採掘網",     desc: "毎日配当に💎追加＆全ステ+15%" },
  { lv: 35, icon: "⚡", name: "零点共鳴炉",     desc: "開幕EX+25%＆討伐🪙さらに+20%" },
  { lv: 45, icon: "👑", name: "新世界の開拓王", desc: "全ステさらに+20%＆開幕バリア+20%" }
];

// 開拓本部 施設強化テーブル（Lv.1 → Lv.10）
const PIONEER_HQ_LEVELS = [
  null,
  { lv: 1,  name: "仮設前線テント",     reqRank: 1,  reqPct: 0,   credits: 0,      cores: 0,   statPct: 0,  gemDiv: 0,   bonusGems: 0,    bonusRb: 0 },
  { lv: 2,  name: "木造観測所",         reqRank: 4,  reqPct: 30,  credits: 12000,  cores: 5,   statPct: 4,  gemDiv: 20,  bonusGems: 160,  bonusRb: 0 },
  { lv: 3,  name: "装甲通信基地",       reqRank: 8,  reqPct: 75,  credits: 28000,  cores: 12,  statPct: 8,  gemDiv: 35,  bonusGems: 240,  bonusRb: 0 },
  { lv: 4,  name: "浄化ビーコン管制塔", reqRank: 13, reqPct: 140, credits: 55000,  cores: 22,  statPct: 12, gemDiv: 50,  bonusGems: 320,  bonusRb: 0 },
  { lv: 5,  name: "第7小隊・要塞司令部",reqRank: 18, reqPct: 210, credits: 95000,  cores: 36,  statPct: 17, gemDiv: 75,  bonusGems: 500,  bonusRb: 1 },
  { lv: 6,  name: "広域アーク中継網",   reqRank: 23, reqPct: 290, credits: 150000, cores: 55,  statPct: 22, gemDiv: 100, bonusGems: 640,  bonusRb: 0 },
  { lv: 7,  name: "軌道降下ドック",     reqRank: 28, reqPct: 370, credits: 230000, cores: 80,  statPct: 28, gemDiv: 130, bonusGems: 800,  bonusRb: 0 },
  { lv: 8,  name: "極限開拓シティ",     reqRank: 34, reqPct: 450, credits: 340000, cores: 110, statPct: 35, gemDiv: 160, bonusGems: 1000, bonusRb: 1 },
  { lv: 9,  name: "零点解析センター",   reqRank: 40, reqPct: 525, credits: 480000, cores: 150, statPct: 42, gemDiv: 200, bonusGems: 1280, bonusRb: 0 },
  { lv: 10, name: "新世界・中央開拓本部",reqRank: 46, reqPct: 580, credits: 700000, cores: 200, statPct: 50, gemDiv: 260, bonusGems: 2000, bonusRb: 2 }
];

function pioEsc(s) {
  if (typeof escapeHtml === "function") return escapeHtml(s);
  return String(s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  }[c]));
}

function getPioneerTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function ensurePioneerState() {
  if (typeof state === "undefined" || !state) return null;
  state.regionProgress = state.regionProgress || {};
  PIONEER_REGIONS.forEach((r, idx) => {
    if (!state.regionProgress[r.id]) {
      state.regionProgress[r.id] = { exp: idx === 0 ? 10 : 0, mistLevel: idx === 0 ? 90 : 100, beacons: idx === 0 ? 1 : 0, clearedGates: [] };
    } else {
      const p = state.regionProgress[r.id];
      if (!Array.isArray(p.clearedGates)) {
        // 既存セーブ互換：すでに到達済みの関門を自動引き継ぎ
        p.clearedGates = PIONEER_GATES.filter(g => (p.exp || 0) >= g.pct).map(g => g.pct);
      }
    }
  });
  if (!Array.isArray(state.pioneerClaimedMilestones)) state.pioneerClaimedMilestones = [];
  if (typeof state.pioneerDividendDate !== "string") state.pioneerDividendDate = "";
  if (typeof state.pioneerHqLevel !== "number" || state.pioneerHqLevel < 1) state.pioneerHqLevel = 1;
  return state.regionProgress;
}

function pioPickEnemyId(preferIds, regionIdx) {
  const all = window.MF_DATA?.ENEMIES || [];
  for (const id of (preferIds || [])) {
    if (all.some(e => e.id === id)) return id;
  }
  if (!all.length) return "";
  return all[Math.min(all.length - 1, regionIdx)]?.id || all[0].id;
}

function pioGetRegionUnlockStatus(r) {
  const rank = Number(state?.playerRank || 1);
  if (rank < r.reqRank) {
    return { ok: false, reason: `要 開拓Lv.${r.reqRank}` };
  }
  if (r.prevId) {
    const prevExp = Number(state?.regionProgress?.[r.prevId]?.exp || 0);
    if (prevExp < r.prevReqExp) {
      const prevName = PIONEER_REGIONS.find(x => x.id === r.prevId)?.name || "前エリア";
      return { ok: false, reason: `要 ${prevName} ${r.prevReqExp}%` };
    }
  }
  return { ok: true, reason: "" };
}

function pioGetNextGate(r) {
  const prog = state?.regionProgress?.[r.id] || { exp: 0, clearedGates: [] };
  const cleared = prog.clearedGates || [];
  return PIONEER_GATES.find(g => !cleared.includes(g.pct)) || null;
}

// 関門の手前（25/50/75/100の直前）に到達しているか判定
function pioGetPendingGate(r) {
  const prog = state?.regionProgress?.[r.id] || { exp: 0, clearedGates: [] };
  const exp = Math.min(100, Number(prog.exp || 0));
  const cleared = prog.clearedGates || [];
  for (const g of PIONEER_GATES) {
    const lockAt = g.pct - 1; // 例：24%で第1関門ロック、99%で最終決戦ロック
    if (!cleared.includes(g.pct) && exp >= lockAt) return g;
  }
  return null;
}

function pioConsumeEn(cost) {
  const curEn = (state.en || 0) + (state.reserveEn || 0);
  if (curEn < cost) return false;
  if (state.en >= cost) {
    state.en -= cost;
  } else {
    const lack = cost - state.en;
    state.en = 0;
    state.reserveEn = Math.max(0, (state.reserveEn || 0) - lack);
  }
  return true;
}

window.MF_PIONEER = {
  getTotalExplorationPct() {
    const rp = ensurePioneerState();
    if (!rp) return 0;
    return PIONEER_REGIONS.reduce((sum, r) => sum + Math.min(100, Number(rp[r.id]?.exp || 0)), 0);
  },

  getBattleBonuses() {
    ensurePioneerState();
    const rank = Number(state?.playerRank || 1);
    const totalPct = this.getTotalExplorationPct(); // 最大 600
    const hqLv = Math.min(10, Math.max(1, Number(state?.pioneerHqLevel || 1)));
    const hqCfg = PIONEER_HQ_LEVELS[hqLv] || PIONEER_HQ_LEVELS[1];

    const statBonusPct = Math.round(
      Math.floor(rank * 1.5) +
      Math.floor(totalPct / 12) +
      hqCfg.statPct +
      (rank >= 22 ? 10 : 0) +
      (rank >= 28 ? 15 : 0) +
      (rank >= 45 ? 20 : 0)
    );
    const creditBonusPct = Math.round(
      (rank >= 4 ? 15 : 0) +
      (rank >= 35 ? 20 : 0) +
      Math.floor(totalPct / 10) +
      (hqLv - 1) * 5
    );
    return {
      rank,
      hqLv,
      totalPct,
      statBonusPct,
      statMult: 1 + statBonusPct / 100,
      creditBonusPct,
      creditMult: 1 + creditBonusPct / 100,
      startEx: rank >= 35 ? 25 : (rank >= 8 ? 15 : 0),
      startShieldRatio: rank >= 45 ? 0.20 : (rank >= 12 ? 0.12 : 0),
      startApBonus: rank >= 16 ? 1 : 0,
      partDmgMult: rank >= 22 ? 1.25 : 1.0
    };
  },

  getDailyDividend() {
    const b = this.getBattleBonuses();
    const hqCfg = PIONEER_HQ_LEVELS[b.hqLv] || PIONEER_HQ_LEVELS[1];
    return {
      credits: 3500 + b.rank * 750 + b.totalPct * 42 + b.hqLv * 1800,
      books: 6 + Math.floor(b.rank * 0.6) + Math.floor(b.totalPct / 25) + b.hqLv * 2,
      cores: 1 + Math.floor(b.rank / 5) + Math.floor(b.totalPct / 90) + Math.floor(b.hqLv / 2),
      tickets: 1 + Math.floor(b.totalPct / 150) + (b.hqLv >= 7 ? 1 : 0),
      gems: hqCfg.gemDiv + (b.rank >= 28 ? 40 : 0)
    };
  }
};

function claimPioneerDailyDividend() {
  ensurePioneerState();
  const today = getPioneerTodayStr();
  if (state.pioneerDividendDate === today) {
    showToast("本日の開拓配当はすでに受取済みです");
    return;
  }
  const div = window.MF_PIONEER.getDailyDividend();
  state.pioneerDividendDate = today;
  state.credits += div.credits;
  state.expBooks = (state.expBooks || 0) + div.books;
  state.cores = (state.cores || 0) + div.cores;
  state.cardTickets = (state.cardTickets || 0) + div.tickets;
  if (div.gems > 0) state.gems = (state.gems || 0) + div.gems;
  saveGame();
  playSfx("gift");
  renderTopBar();
  renderPioneerBoard();
  showToast(`📦 開拓配当を受取！${div.gems ? `💎+${div.gems} / ` : ""}🪙+${div.credits.toLocaleString()} / 📘+${div.books} / 💠+${div.cores} / 🎟️+${div.tickets}`);
}

function upgradePioneerHq() {
  ensurePioneerState();
  const curLv = Math.min(10, Math.max(1, Number(state.pioneerHqLevel || 1)));
  if (curLv >= 10) {
    showToast("👑 開拓本部はすでに最大レベル（Lv.10）です！");
    return;
  }
  const next = PIONEER_HQ_LEVELS[curLv + 1];
  const totalPct = window.MF_PIONEER.getTotalExplorationPct();
  const rank = Number(state.playerRank || 1);

  if (rank < next.reqRank) { showToast(`🔒 開拓Lv.${next.reqRank} が必要です`); return; }
  if (totalPct < next.reqPct) { showToast(`🔒 累計開拓度 ${next.reqPct}% が必要です（現在 ${totalPct}%）`); return; }
  if ((state.credits || 0) < next.credits) { showToast(`🪙 クレジット不足（必要：${next.credits.toLocaleString()}）`); return; }
  if ((state.cores || 0) < next.cores) { showToast(`💠 元素コア不足（必要：${next.cores}個）`); return; }

  state.credits -= next.credits;
  state.cores -= next.cores;
  state.pioneerHqLevel = next.lv;
  if (next.bonusGems) state.gems = (state.gems || 0) + next.bonusGems;
  if (next.bonusRb) state.rainbowCores = (state.rainbowCores || 0) + next.bonusRb;

  saveGame();
  playSfx("win");
  renderTopBar();
  renderPioneerBoard();
  showToast(
    `🏛️ 開拓本部 Lv.${next.lv}『${next.name}』へ拡張！` +
    (next.bonusGems ? ` 🎁💎+${next.bonusGems}` : "") +
    (next.bonusRb ? ` / 🌈虹コア+${next.bonusRb}` : "")
  );
}

// ⚔️ 実戦バトル式の瘴霧浄化作戦（＆ 25/50/75/100% 関門ガーディアン決戦）
function runPioneerPurify(regionId) {
  ensurePioneerState();
  const rIdx = PIONEER_REGIONS.findIndex(x => x.id === regionId);
  const r = PIONEER_REGIONS[rIdx];
  if (!r) return;

  const lock = pioGetRegionUnlockStatus(r);
  if (!lock.ok) {
    showToast(`🔒 解放条件未達：${lock.reason}`);
    return;
  }

  const prog = state.regionProgress[r.id];
  const pendingGate = pioGetPendingGate(r);
  const isAlreadyMax = (prog.exp || 0) >= 100 && !pendingGate;
  const cost = pendingGate ? r.enCost + 10 : r.enCost;

  if ((state.en || 0) + (state.reserveEn || 0) < cost) {
    showToast(`⚡ EN不足（必要：${cost}）`);
    return;
  }

  // バトル起動関数がない環境への安全フォールバック
  if (typeof startBattle !== "function") {
    showToast("バトルシステムを初期化できませんでした");
    return;
  }

  if (!pioConsumeEn(cost)) return;
  saveGame();
  renderTopBar();

  // ===== 🚨 25/50/75/100% 関門ガーディアン決戦（厳格な適正Lvあり！） =====
  if (pendingGate) {
    const bossId = pioPickEnemyId(r.bosses, rIdx);
    const reqLv = Math.min(82, r.baseLv + pendingGate.lvAdd);
    if (typeof switchView === "function") switchView("battle");
    startBattle(bossId, {
      questTitle: `🚨 【${r.name}・${pendingGate.label}】`,
      minReqLv: reqLv,
      huntTier: pendingGate.tierId,
      hpMult: pendingGate.hpMult,
      atkMult: pendingGate.atkMult,
      rwMult: 2.2 + pendingGate.tierId * 0.8,
      returnView: "story",
      onWin: () => {
        ensurePioneerState();
        const p = state.regionProgress[r.id];
        if (!p.clearedGates.includes(pendingGate.pct)) p.clearedGates.push(pendingGate.pct);
        p.exp = Math.max(p.exp || 0, pendingGate.pct);
        p.mistLevel = Math.max(0, 100 - p.exp);
        p.beacons = (p.beacons || 0) + 1;
        state.playerExp = (state.playerExp || 0) + r.rankExp + 35;
        while (state.playerExp >= state.playerRank * 100) { state.playerExp -= state.playerRank * 100; state.playerRank += 1; }
        saveGame();
        renderTopBar();
        setTimeout(() => {
          renderPioneerBoard();
          showToast(`👑 【${r.name}・${pendingGate.label}】突破！開拓度 ${p.exp}% 到達＆関門報酬が解放されました！`);
        }, 120);
      }
    });
    return;
  }

  // ===== ⚔️ 通常浄化パトロール（勝利で +2%〜+5% 前進・100%後も高難度周回可） =====
  const enemyId = pioPickEnemyId(isAlreadyMax ? r.bosses : r.enemies, rIdx);
  const progressFactor = Math.floor((prog.exp || 0) / 25); // 区域が進むほど敵も強化
  const targetLv = Math.min(82, r.baseLv + progressFactor * 2 + (isAlreadyMax ? 6 : 0));

  if (typeof switchView === "function") switchView("battle");
  startBattle(enemyId, {
    questTitle: isAlreadyMax ? `🔥 【${r.name}・極限巡回】` : `📡 【${r.name}・瘴霧浄化作戦】`,
    lvFloor: targetLv,
    lvCap: 82,
    huntTier: isAlreadyMax ? 3 : Math.min(2, Math.floor(rIdx / 2) + (progressFactor >= 2 ? 1 : 0)),
    hpMult: 1.05 + progressFactor * 0.22 + (isAlreadyMax ? 0.9 : 0),
    atkMult: 1.05 + progressFactor * 0.14 + (isAlreadyMax ? 0.45 : 0),
    rwMult: 1.3 + rIdx * 0.45 + (isAlreadyMax ? 1.2 : 0),
    returnView: "story",
    onWin: () => {
      ensurePioneerState();
      const p = state.regionProgress[r.id];
      const nextGate = pioGetNextGate(r);
      const cap = nextGate ? (nextGate.pct - 1) : 100;

      if (!isAlreadyMax) {
        p.exp = Math.min(cap, (p.exp || 0) + r.stepExp);
        p.mistLevel = Math.max(0, 100 - p.exp);
        p.beacons = (p.beacons || 0) + 1;
      }

      const b = window.MF_PIONEER.getBattleBonuses();
      const bonusCr = Math.round(r.baseCredits * b.creditMult);
      state.credits += bonusCr;
      state.playerExp = (state.playerExp || 0) + r.rankExp;
      let lvUp = false;
      while (state.playerExp >= state.playerRank * 100) {
        state.playerExp -= state.playerRank * 100;
        state.playerRank += 1;
        lvUp = true;
      }
      saveGame();
      renderTopBar();
      setTimeout(() => {
        renderPioneerBoard();
        const hitGate = pioGetPendingGate(r);
        if (hitGate) {
          showToast(`🚨 ${r.name} 開拓度${p.exp}%！『${hitGate.label}』のガーディアンが出現しました！`);
        } else if (lvUp) {
          showToast(`🎉 開拓Lv.${state.playerRank}へ昇格！${r.name} 開拓度 ${p.exp}%（🪙+${bonusCr.toLocaleString()}）`);
        } else {
          showToast(`📡 ${r.name} 浄化完了！開拓度 ${p.exp}%（🪙+${bonusCr.toLocaleString()}）`);
        }
      }, 120);
    }
  });
}

function claimPioneerMilestone(regionId, pct) {
  ensurePioneerState();
  const key = `${regionId}_${pct}`;
  if (state.pioneerClaimedMilestones.includes(key)) return;
  const prog = state.regionProgress[regionId];
  if (!prog || (prog.exp || 0) < pct) return;
  const g = PIONEER_GATES.find(x => x.pct === pct);
  const rIdx = Math.max(0, PIONEER_REGIONS.findIndex(x => x.id === regionId));
  if (!g) return;

  // 後半エリアほどマイルストーン報酬も豪華に！
  const areaMult = 1 + rIdx * 0.25;
  const rGems = Math.round(g.gems * areaMult);
  const rCred = Math.round(g.credits * areaMult);
  const rTk = g.tickets + (rIdx >= 4 && pct >= 75 ? 2 : 0);
  const rCores = Math.round(g.cores * areaMult);
  const rCrests = Math.round(g.crests * areaMult);

  state.pioneerClaimedMilestones.push(key);
  state.gems += rGems;
  state.credits += rCred;
  state.cardTickets = (state.cardTickets || 0) + rTk;
  state.cores = (state.cores || 0) + rCores;
  if (rCrests > 0) state.arcCrests = (state.arcCrests || 0) + rCrests;

  saveGame();
  playSfx("gift");
  renderTopBar();
  renderPioneerBoard();
  showToast(`🎁 開拓${pct}%制覇報酬！💎+${rGems} / 🎟️+${rTk} / 💠コア+${rCores}${rCrests ? ` / 💠クレスト+${rCrests}` : ""}`);
}

function renderPioneerBoard() {
  const mapPanel = document.getElementById("story-map-panel");
  if (!mapPanel) return;
  ensurePioneerState();

  let box = document.getElementById("pioneer-hq-board");
  if (!box) {
    box = document.createElement("div");
    box.id = "pioneer-hq-board";
    mapPanel.prepend(box);
  }

  const b = window.MF_PIONEER.getBattleBonuses();
  const div = window.MF_PIONEER.getDailyDividend();
  const claimedToday = state.pioneerDividendDate === getPioneerTodayStr();
  const needExp = (state.playerRank || 1) * 100;
  const rankPct = Math.min(100, Math.round(((state.playerExp || 0) / needExp) * 100));
  const curHq = PIONEER_HQ_LEVELS[b.hqLv] || PIONEER_HQ_LEVELS[1];
  const nextHq = b.hqLv < 10 ? PIONEER_HQ_LEVELS[b.hqLv + 1] : null;
  const canUpgradeHq = nextHq
    && b.rank >= nextHq.reqRank
    && b.totalPct >= nextHq.reqPct
    && (state.credits || 0) >= nextHq.credits
    && (state.cores || 0) >= nextHq.cores;

  box.innerHTML = `
    <div class="card" style="margin-bottom:9px; border-color:#f3cf00;">
      <div class="top-row" style="margin-bottom:4px;">
        <strong style="font-size:13.5px;">🏛️ 開拓本部：Lv.${b.hqLv}『${pioEsc(curHq.name)}』</strong>
        <span class="rank-pill" style="background:#f3cf00; color:#111;">開拓Lv.${b.rank}</span>
      </div>
      <div style="font-size:10.5px; color:var(--muted); margin-bottom:4px;">
        次Lvまで：${state.playerExp || 0} / ${needExp} ｜ 累計開拓度 <strong>${b.totalPct}% / 600%</strong>
      </div>
      <div class="gauge-bar" style="height:6px; margin-bottom:7px;">
        <div style="background:linear-gradient(90deg,#18b88a,#f3cf00); width:${rankPct}%;"></div>
      </div>

      <div style="background:rgba(24,184,138,0.14); border:1.5px solid #18b88a; border-radius:10px; padding:7px 9px; font-size:11px; font-weight:900; margin-bottom:7px;">
        ✨ 発動中の開拓永続効果：全隊員HP/ATK/DEF <span style="color:#18b88a;">+${b.statBonusPct}%</span> ｜ 討伐🪙 <span style="color:#ff9f1c;">+${b.creditBonusPct}%</span>
      </div>

      ${nextHq ? `
        <div class="pio-hq-upgrade">
          <div class="top-row" style="margin-bottom:3px;">
            <strong style="font-size:11.5px;">⬆️ 施設拡張：Lv.${nextHq.lv}『${pioEsc(nextHq.name)}』</strong>
            <span class="tag">全ステ +${nextHq.statPct}%</span>
          </div>
          <div style="font-size:10px; color:var(--muted); line-height:1.45; margin-bottom:6px;">
            条件：開拓Lv.${nextHq.reqRank} ／ 累計開拓${nextHq.reqPct}% ／ 🪙${nextHq.credits.toLocaleString()} ／ 💠コア${nextHq.cores}<br>
            拡張特典：毎日配当に💎+${nextHq.gemDiv} ／ 完了🎁💎+${nextHq.bonusGems}${nextHq.bonusRb ? ` ＆ 🌈虹コア+${nextHq.bonusRb}` : ""}
          </div>
          <button class="${canUpgradeHq ? "btn-accent2" : "btn-xs"}" style="width:100%; padding:8px;" ${canUpgradeHq ? "" : "disabled"} onclick="upgradePioneerHq()">
            ${canUpgradeHq ? `🏛️ 開拓本部を Lv.${nextHq.lv} へ拡張する！` : "条件・素材を集めて本部を拡張しよう"}
          </button>
        </div>
      ` : `
        <div style="background:rgba(243,207,0,0.16); border:1.5px solid #f3cf00; border-radius:9px; padding:7px; font-size:11px; font-weight:900; margin-bottom:7px;">
          👑 開拓本部 Lv.10『新世界・中央開拓本部』完成済み！
        </div>
      `}

      <div class="pioneer-perk-grid">
        ${PIONEER_LV_PERKS.map(p => {
          const ok = b.rank >= p.lv;
          return `
            <div class="pioneer-perk ${ok ? "unlocked" : "locked"}">
              <strong>${ok ? "✅" : "🔒"} Lv.${p.lv} ${p.icon}${p.name}</strong><br>
              <span>${p.desc}</span>
            </div>
          `;
        }).join("")}
      </div>

      <div style="background:var(--surface-sub); border-radius:10px; padding:8px; margin-top:6px;">
        <div class="top-row" style="margin-bottom:4px;">
          <strong style="font-size:11.5px;">📦 浄化エリアの毎日開拓配当</strong>
          <span style="font-size:10px; color:var(--muted);">本部Lv＆開拓度で増額！</span>
        </div>
        <div style="font-size:11px; font-weight:800; margin-bottom:6px;">
          ${div.gems ? `💎+${div.gems} ｜ ` : ""}🪙+${div.credits.toLocaleString()} ｜ 📘+${div.books} ｜ 💠+${div.cores} ｜ 🎟️+${div.tickets}
        </div>
        <button class="${claimedToday ? "" : "btn-accent2"}" style="width:100%; padding:8px;" ${claimedToday ? "disabled" : ""} onclick="claimPioneerDailyDividend()">
          ${claimedToday ? "✓ 本日の開拓配当を受取済" : "📦 本日の開拓配当を受け取る！"}
        </button>
      </div>
    </div>

    <div class="card" style="margin-bottom:9px;">
      <div class="section-title">
        <span>⚔️ 地域別・瘴霧浄化作戦 ＆ 関門制覇報酬</span>
      </div>
      <div style="font-size:10px; color:var(--muted); margin-bottom:8px; line-height:1.45;">
        ※各地域の浄化は<strong>実戦バトル勝利</strong>で進行します。25% / 50% / 75% / 100% の節目では<strong>🚨 関門ガーディアン</strong>を撃破することで上限解放＆報酬獲得！
      </div>

      ${PIONEER_REGIONS.map((r, rIdx) => {
        const prog = state.regionProgress[r.id] || { exp: 0, clearedGates: [] };
        const pct = Math.min(100, prog.exp || 0);
        const lock = pioGetRegionUnlockStatus(r);
        const pendingGate = pioGetPendingGate(r);
        const isMax = pct >= 100 && !pendingGate;
        const gateReqLv = pendingGate ? Math.min(82, r.baseLv + pendingGate.lvAdd) : r.baseLv;
        const actionCost = pendingGate ? r.enCost + 10 : r.enCost;
        const areaMult = 1 + rIdx * 0.25;

        let btnLabel = "";
        let btnCls = "btn-primary";
        if (!lock.ok) {
          btnLabel = `🔒 ${lock.reason}`;
          btnCls = "";
        } else if (pendingGate) {
          btnLabel = `🚨 ${pendingGate.label}(⚡${actionCost})`;
          btnCls = "pio-gate-btn";
        } else if (isMax) {
          btnLabel = `🔥 極限巡回(⚡${actionCost})`;
          btnCls = "btn-accent2";
        } else {
          btnLabel = `⚔️ 浄化 +${r.stepExp}%(⚡${actionCost})`;
        }

        return `
          <div class="pio-region-card ${pendingGate ? "gate-alert" : ""} ${isMax ? "is-max" : ""}">
            <div class="top-row" style="margin-bottom:3px; gap:6px;">
              <strong style="font-size:12px;">${lock.ok ? r.icon : "🔒"} ${r.name}（${pct}%）</strong>
              <button class="btn-xs ${btnCls}" ${lock.ok ? "" : "disabled"} onclick="runPioneerPurify('${r.id}')">
                ${btnLabel}
              </button>
            </div>
            <div style="font-size:10px; color:${pendingGate ? "#ff595e" : "var(--muted)"}; font-weight:${pendingGate ? "900" : "700"}; margin-bottom:4px;">
              ${!lock.ok
                ? `解放条件：${lock.reason}（目安小隊Lv.${r.baseLv}〜）`
                : (pendingGate
                    ? `⚠️ ${pendingGate.label}ボス出現中！突破で上限解放（適正Lv.${gateReqLv}）`
                    : (isMax ? `👑 完全浄化済み！極限巡回で大量🪙＆開拓EXP獲得可` : `目安小隊Lv.${r.baseLv}〜 ｜ 1勝ごとに開拓度 +${r.stepExp}%`))}
            </div>
            <div class="gauge-bar" style="height:6px; margin-bottom:6px;">
              <div style="background:${pendingGate ? "#ff4d5a" : (isMax ? "#f3cf00" : "var(--accent)")}; width:${pct}%;"></div>
            </div>
            <div style="display:flex; gap:4px; flex-wrap:wrap;">
              ${PIONEER_GATES.map(g => {
                const key = `${r.id}_${g.pct}`;
                const done = state.pioneerClaimedMilestones.includes(key);
                const ready = pct >= g.pct && !done;
                const estGems = Math.round(g.gems * areaMult);
                if (done) return `<span class="tag" style="background:#18b88a; color:#fff;">✓${g.pct}%</span>`;
                if (ready) return `<button class="btn-xs btn-accent2" onclick="claimPioneerMilestone('${r.id}', ${g.pct})">🎁${g.pct}%受取(💎${estGems})</button>`;
                return `<span class="tag" style="opacity:0.65;">${g.pct}%:💎${estGems}</span>`;
              }).join("")}
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

window.upgradePioneerHq = upgradePioneerHq;
window.runPioneerPurify = runPioneerPurify;
window.claimPioneerMilestone = claimPioneerMilestone;
window.claimPioneerDailyDividend = claimPioneerDailyDividend;
window.renderPioneerBoard = renderPioneerBoard;

// 既存の物語・開拓画面切替へ安全に自動フック
(function installPioneerHooks() {
  ["renderStoryView", "setStoryTab"].forEach(fnName => {
    if (typeof window[fnName] === "function" && !window[fnName]._pioneerHooked) {
      const orig = window[fnName];
      window[fnName] = function() {
        const res = orig.apply(this, arguments);
        setTimeout(() => renderPioneerBoard(), 0);
        return res;
      };
      window[fnName]._pioneerHooked = true;
    }
  });
  if (typeof window.switchView === "function" && !window.switchView._pioneerHooked) {
    const origSw = window.switchView;
    window.switchView = function(vid) {
      const r = origSw.apply(this, arguments);
      if (vid === "story") setTimeout(() => renderPioneerBoard(), 30);
      return r;
    };
    window.switchView._pioneerHooked = true;
  }
})();
