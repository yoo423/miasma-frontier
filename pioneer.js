// =========================================================
// 🗺️ 開拓本部システム（永続バフ・開拓Lv特典・毎日配当・エリア報酬）
// =========================================================
const PIONEER_REGIONS = [
  { id: "verde",  name: "新緑の平原",   reqRank: 1, enCost: 15, expGain: 15, baseCredits: 2200 },
  { id: "volt",   name: "雷鳴の遺跡群", reqRank: 4, enCost: 20, expGain: 15, baseCredits: 3200 },
  { id: "frost",  name: "白銀の凍結渓谷", reqRank: 7, enCost: 25, expGain: 15, baseCredits: 4400 },
  { id: "magma",  name: "紅蓮の溶岩火口", reqRank: 10, enCost: 30, expGain: 15, baseCredits: 5800 }
];

const PIONEER_LV_PERKS = [
  { lv: 3,  icon: "🪙", name: "補給路開通",   desc: "討伐クレジット +20%" },
  { lv: 5,  icon: "🌟", name: "先制共鳴",     desc: "開幕EXゲージ +15%" },
  { lv: 8,  icon: "🛡️", name: "浄化防壁",     desc: "開幕バリア +12%" },
  { lv: 12, icon: "🔵", name: "前線指揮網",   desc: "開幕AP +1（初手5）" },
  { lv: 16, icon: "💥", name: "極限開拓領域", desc: "部位破壊+25%＆全ステ+15%" }
];

const PIONEER_MILESTONES = [
  { pct: 25,  gems: 160, credits: 5000,  tickets: 1, cores: 2 },
  { pct: 50,  gems: 240, credits: 10000, tickets: 2, cores: 4 },
  { pct: 75,  gems: 320, credits: 16000, tickets: 2, cores: 6 },
  { pct: 100, gems: 640, credits: 30000, tickets: 5, cores: 12 }
];

function getPioneerTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function ensurePioneerState() {
  if (typeof state === "undefined" || !state) return null;
  state.regionProgress = state.regionProgress || {};
  PIONEER_REGIONS.forEach((r, idx) => {
    if (!state.regionProgress[r.id]) {
      state.regionProgress[r.id] = { exp: idx === 0 ? 15 : 0, mistLevel: idx === 0 ? 60 : 100, beacons: idx === 0 ? 1 : 0 };
    }
  });
  state.pioneerClaimedMilestones = state.pioneerClaimedMilestones || [];
  state.pioneerDividendDate = state.pioneerDividendDate || "";
  return state.regionProgress;
}

window.MF_PIONEER = {
  getTotalExplorationPct() {
    const rp = ensurePioneerState();
    if (!rp) return 0;
    return PIONEER_REGIONS.reduce((sum, r) => sum + Math.min(100, Number(rp[r.id]?.exp || 0)), 0);
  },

  getBattleBonuses() {
    const rank = Number(state?.playerRank || 1);
    const totalPct = this.getTotalExplorationPct(); // 最大 400
    // 開拓Lv×2% ＋ 累計開拓度(10%ごとに+1%) ＋ Lv16特典(+15%)
    const statBonusPct = Math.round(rank * 2 + Math.floor(totalPct / 10) + (rank >= 16 ? 15 : 0));
    const creditBonusPct = Math.round((rank >= 3 ? 20 : 0) + Math.floor(totalPct / 8));
    return {
      rank,
      totalPct,
      statBonusPct,
      statMult: 1 + statBonusPct / 100,
      creditBonusPct,
      creditMult: 1 + creditBonusPct / 100,
      startEx: rank >= 5 ? 15 : 0,
      startShieldRatio: rank >= 8 ? 0.12 : 0,
      startApBonus: rank >= 12 ? 1 : 0,
      partDmgMult: rank >= 16 ? 1.25 : 1.0
    };
  },

  getDailyDividend() {
    const b = this.getBattleBonuses();
    return {
      credits: 3500 + b.rank * 900 + b.totalPct * 45,
      books: 6 + Math.floor(b.rank * 0.8) + Math.floor(b.totalPct / 20),
      cores: 1 + Math.floor(b.rank / 4) + Math.floor(b.totalPct / 80),
      tickets: b.totalPct >= 100 ? 2 : 1
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
  saveGame();
  playSfx("gift");
  renderTopBar();
  renderPioneerBoard();
  showToast(`📦 開拓配当を受取！🪙+${div.credits.toLocaleString()} / 📘+${div.books} / 💠+${div.cores} / 🎟️+${div.tickets}`);
}

function runPioneerPurify(regionId) {
  ensurePioneerState();
  const r = PIONEER_REGIONS.find(x => x.id === regionId);
  if (!r) return;
  if ((state.playerRank || 1) < r.reqRank) {
    showToast(`🔒 開拓Lv.${r.reqRank} で解放されます`);
    return;
  }
  const curEn = (state.en || 0) + (state.reserveEn || 0);
  if (curEn < r.enCost) {
    showToast(`⚡ EN不足（必要：${r.enCost}）`);
    return;
  }
  // EN消費（不足分は予備ENから自動充当）
  if (state.en >= r.enCost) {
    state.en -= r.enCost;
  } else {
    const lack = r.enCost - state.en;
    state.en = 0;
    state.reserveEn = Math.max(0, (state.reserveEn || 0) - lack);
  }

  const prog = state.regionProgress[r.id];
  const prevExp = Math.min(100, prog.exp || 0);
  prog.exp = Math.min(100, prevExp + r.expGain);
  prog.mistLevel = Math.max(0, 100 - prog.exp);
  prog.beacons = (prog.beacons || 0) + 1;

  // 開拓Lv経験値＆大量クレジット・育成素材獲得
  const b = window.MF_PIONEER.getBattleBonuses();
  const gainCr = Math.round(r.baseCredits * b.creditMult);
  const gainBooks = 4 + Math.floor(r.reqRank / 2);
  const gainRankExp = 45 + r.reqRank * 6;

  state.credits += gainCr;
  state.expBooks = (state.expBooks || 0) + gainBooks;
  state.playerExp = (state.playerExp || 0) + gainRankExp;
  let leveledUp = false;
  while (state.playerExp >= state.playerRank * 100) {
    state.playerExp -= state.playerRank * 100;
    state.playerRank += 1;
    leveledUp = true;
  }

  saveGame();
  playSfx(leveledUp ? "win" : "gift");
  renderTopBar();
  renderPioneerBoard();
  showToast(
    leveledUp
      ? `🎉 開拓Lv.${state.playerRank}に上昇！${r.name} 開拓度${prog.exp}%（🪙+${gainCr.toLocaleString()}）`
      : `📡 ${r.name}を浄化！開拓度 ${prog.exp}%（🪙+${gainCr.toLocaleString()} / 📘+${gainBooks}）`
  );
}

function claimPioneerMilestone(regionId, pct) {
  ensurePioneerState();
  const key = `${regionId}_${pct}`;
  if (state.pioneerClaimedMilestones.includes(key)) return;
  const prog = state.regionProgress[regionId];
  if (!prog || (prog.exp || 0) < pct) return;
  const m = PIONEER_MILESTONES.find(x => x.pct === pct);
  if (!m) return;

  state.pioneerClaimedMilestones.push(key);
  state.gems += m.gems;
  state.credits += m.credits;
  state.cardTickets = (state.cardTickets || 0) + m.tickets;
  state.cores = (state.cores || 0) + m.cores;
  saveGame();
  playSfx("gift");
  renderTopBar();
  renderPioneerBoard();
  showToast(`🎁 開拓${pct}%達成報酬！💎+${m.gems} / 🪙+${m.credits.toLocaleString()} / 🎟️+${m.tickets} / 💠+${m.cores}`);
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

  box.innerHTML = `
    <div class="card" style="margin-bottom:9px; border-color:var(--accent);">
      <div class="top-row" style="margin-bottom:4px;">
        <strong style="font-size:13.5px;">🗺️ 開拓本部 ＆ 永続バフ</strong>
        <span class="rank-pill" style="background:#ffd13b;">開拓Lv.${b.rank}</span>
      </div>
      <div style="font-size:10.5px; color:var(--muted); margin-bottom:4px;">
        次の開拓Lvまで：${state.playerExp || 0} / ${needExp}（累計開拓度 ${b.totalPct}% / 400%）
      </div>
      <div class="gauge-bar" style="height:6px; margin-bottom:7px;">
        <div style="background:linear-gradient(90deg,#18b88a,#ffd000); width:${rankPct}%;"></div>
      </div>

      <div style="background:rgba(24,184,138,0.14); border:1.5px solid #18b88a; border-radius:10px; padding:7px 9px; font-size:11px; font-weight:900; margin-bottom:7px;">
        ✨ 発動中の開拓永続効果：全隊員HP/ATK/DEF <span style="color:#18b88a;">+${b.statBonusPct}%</span> ｜ 討伐🪙 <span style="color:#ff9f1c;">+${b.creditBonusPct}%</span>
      </div>

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
          <span style="font-size:10px; color:var(--muted);">開拓が進むほど増額！</span>
        </div>
        <div style="font-size:11px; font-weight:800; margin-bottom:6px;">
          🪙+${div.credits.toLocaleString()} ｜ 📘記録+${div.books} ｜ 💠コア+${div.cores} ｜ 🎟️券+${div.tickets}
        </div>
        <button class="${claimedToday ? "" : "btn-accent2"}" style="width:100%; padding:8px;" ${claimedToday ? "disabled" : ""} onclick="claimPioneerDailyDividend()">
          ${claimedToday ? "✓ 本日の開拓配当を受取済" : "📦 本日の開拓配当を受け取る！"}
        </button>
      </div>
    </div>

    <div class="card" style="margin-bottom:9px;">
      <div class="section-title"><span>📡 地域別・瘴霧浄化 ＆ 開拓報酬</span></div>
      ${PIONEER_REGIONS.map(r => {
        const prog = state.regionProgress[r.id] || { exp: 0, beacons: 0 };
        const pct = Math.min(100, prog.exp || 0);
        const unlocked = b.rank >= r.reqRank;
        return `
          <div style="background:var(--surface-sub); border:1.5px solid var(--border); border-radius:10px; padding:8px; margin-bottom:7px;">
            <div class="top-row" style="margin-bottom:4px;">
              <strong style="font-size:12px;">${unlocked ? "🌿" : "🔒"} ${r.name}（開拓 ${pct}%）</strong>
              <button class="btn-xs ${unlocked ? "btn-primary" : ""}" ${unlocked ? "" : "disabled"} onclick="runPioneerPurify('${r.id}')">
                ${unlocked ? `📡 浄化(⚡${r.enCost})` : `要Lv.${r.reqRank}`}
              </button>
            </div>
            <div class="gauge-bar" style="height:6px; margin-bottom:6px;">
              <div style="background:var(--accent); width:${pct}%;"></div>
            </div>
            <div style="display:flex; gap:4px; flex-wrap:wrap;">
              ${PIONEER_MILESTONES.map(m => {
                const key = `${r.id}_${m.pct}`;
                const done = state.pioneerClaimedMilestones.includes(key);
                const ready = pct >= m.pct && !done;
                if (done) return `<span class="tag" style="background:#18b88a; color:#fff;">✓${m.pct}%</span>`;
                if (ready) return `<button class="btn-xs btn-accent2" onclick="claimPioneerMilestone('${r.id}', ${m.pct})">🎁${m.pct}%受取</button>`;
                return `<span class="tag" style="opacity:0.6;">${m.pct}%:💎${m.gems}</span>`;
              }).join("")}
            </div>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

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
})();
