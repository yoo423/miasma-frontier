let currentEndgameTab = "tower"; // "tower" | "raid"

const TOWER_ENEMY_CYCLE = [
  "wolf_pack", "spore_slime", "forest_boar", "crystal_beetle", "moss_behemoth",
  "spark_raptor", "volt_scarab", "blizzard_hound", "frost_spider", "thunder_wyvern",
  "lava_golem", "neon_angler", "radiant_behemoth", "glacial_mammoth", "radiant_wyvern",
  "magma_salamander", "abyss_kraken", "spire_seraph", "radiant_mammoth", "radiant_zero"
];

const RAID_BOSSES = [
  { id: "radiant_behemoth", title: "【極限レイド】煌角のベヒーモス・EX", weakness: "炎・氷の融解コンボで巨角を砕け！" },
  { id: "radiant_wyvern",   title: "【極限レイド】天雷のオーバーワイバーン・EX", weakness: "凍結と防御DOWNを重ねて極大チェインを狙え！" },
  { id: "radiant_mammoth",  title: "【極限レイド】絶対零度の帝王マンモス・EX", weakness: "炎と雷の過負荷で氷装甲を粉砕せよ！" },
  { id: "radiant_zero",     title: "【極限レイド】原初の災厄・ゼロ・EX", weakness: "全6元素の総力戦で5ターンの限界火力へ挑め！" }
];

const RAID_TIERS = [
  { rank: "SS", min: 45000, gems: 300, tickets: 4, credits: 25000 },
  { rank: "S",  min: 25000, gems: 200, tickets: 3, credits: 16000 },
  { rank: "A",  min: 12000, gems: 120, tickets: 2, credits: 10000 },
  { rank: "B",  min: 5000,  gems: 80,  tickets: 1, credits: 6000  },
  { rank: "C",  min: 0,     gems: 40,  tickets: 1, credits: 3000  }
];

function ensureEndgameState() {
  const today = typeof getLoginTodayStr === "function" ? getLoginTodayStr() : new Date().toISOString().slice(0, 10);
  state.endgame = state.endgame || {
    towerClearedFloor: 0,
    towerDailyClaimDate: "",
    raidDateKey: today,
    raidTodayAttempts: 0,
    raidBestScore: 0,
    raidTodayBest: 0
  };
  if (state.endgame.raidDateKey !== today) {
    state.endgame.raidDateKey = today;
    state.endgame.raidTodayAttempts = 0;
    state.endgame.raidTodayBest = 0;
  }
  return state.endgame;
}

function getTodayRaidBoss() {
  const d = new Date();
  const idx = (d.getFullYear() + d.getMonth() + d.getDate()) % RAID_BOSSES.length;
  return RAID_BOSSES[idx];
}

function getTowerFloorSpec(floor) {
  const isBoss = floor % 5 === 0;
  const enemyId = TOWER_ENEMY_CYCLE[(floor - 1) % TOWER_ENEMY_CYCLE.length];
  const baseEn = (window.MF_DATA.ENEMIES || []).find(e => e.id === enemyId) || window.MF_DATA.ENEMIES[0];
  // 階層に応じた段階スケール（1Fは序盤でも挑め、高層ほど極限難度へ）
  const scale = Number((0.75 + floor * 0.14 + (isBoss ? 0.35 : 0)).toFixed(2));
  const recPower = Math.round(320 + floor * 115 + (isBoss ? 220 : 0));
  const reward = isBoss
    ? { gems: 200 + Math.min(200, floor * 4), tickets: 3, cores: 4 + Math.floor(floor / 5) }
    : { gems: 60 + Math.min(80, floor * 2), tickets: 1, books: 10 + floor };
  return { floor, isBoss, enemyId, baseEn, scale, recPower, reward };
}

function setEndgameTab(tab) {
  currentEndgameTab = tab;
  playSfx("tap");
  renderEndgameView();
}

function renderEndgameView() {
  renderTopBar();
  const eg = ensureEndgameState();
  document.getElementById("eg-tab-tower").className = `select-chip ${currentEndgameTab === "tower" ? "selected" : ""}`;
  document.getElementById("eg-tab-raid").className = `select-chip ${currentEndgameTab === "raid" ? "selected" : ""}`;

  document.getElementById("eg-tower-panel").style.display = currentEndgameTab === "tower" ? "block" : "none";
  document.getElementById("eg-raid-panel").style.display = currentEndgameTab === "raid" ? "block" : "none";

  if (currentEndgameTab === "tower") renderTowerPanel(eg);
  else renderRaidPanel(eg);
}

function renderTowerPanel(eg) {
  const cleared = eg.towerClearedFloor || 0;
  const nextFloor = cleared + 1;
  const spec = getTowerFloorSpec(nextFloor);
  const today = typeof getLoginTodayStr === "function" ? getLoginTodayStr() : new Date().toISOString().slice(0, 10);
  const claimedDaily = eg.towerDailyClaimDate === today;
  const teamPower = state.party.reduce((s, id) => s + calcCharPower(id), 0);

  const dailyGems = Math.min(240, 20 + cleared * 6);
  const dailyBooks = Math.min(80, 5 + cleared * 2);
  const dailyCredits = 2000 + cleared * 800;

  // 次の5F節目と現在の前後階層リスト表示
  const previewFloors = [nextFloor, nextFloor + 1, nextFloor + 2, nextFloor + 3, nextFloor + 4];
  const thumb = window.MF_SPRITES.enemyHTML ? window.MF_SPRITES.enemyHTML(spec.baseEn, "thumb") : "";

  document.getElementById("eg-tower-body").innerHTML = `
    <div class="card" style="background:linear-gradient(135deg, rgba(139,70,232,0.16), rgba(24,184,138,0.14)); margin-bottom:9px;">
      <div class="top-row">
        <strong style="font-size:14px;">🗼 現在の踏破記録：${cleared}F</strong>
        <span class="rank-pill">次：${nextFloor}F${spec.isBoss ? " BOSS" : ""}</span>
      </div>
      <div style="font-size:11px; color:var(--muted); margin:4px 0 8px;">
        到達階層が高いほど、毎日の掃討ボーナスが永続アップ！5Fごとに超豪華ボス報酬！
      </div>
      <button class="btn-primary" style="width:100%;" ${cleared === 0 || claimedDaily ? "disabled" : ""} onclick="claimTowerDailySweep()">
        ${cleared === 0
          ? "🔒 まずは1Fを踏破しよう"
          : (claimedDaily
              ? "✅ 本日のタワー掃討ボーナス受取済"
              : `🎁 毎日掃討ボーナス（💎+${dailyGems} / 📘+${dailyBooks} / 🪙${dailyCredits.toLocaleString()}）`)}
      </button>
    </div>

    <div class="card" style="border-color:${spec.isBoss ? "#ff4d79" : "var(--border)"}; margin-bottom:9px;">
      <div class="top-row" style="margin-bottom:6px;">
        <strong style="font-size:13.5px;">${spec.isBoss ? "👑 階層ボス挑戦" : "⚔️ 次の挑戦階層"}：${nextFloor}F</strong>
        <span class="tag">推奨戦力 ${spec.recPower}（${teamPower < spec.recPower ? "⚠️強敵" : "✅圏内"}）</span>
      </div>
      <div style="display:flex; gap:10px; align-items:center; margin-bottom:8px;">
        ${thumb}
        <div style="flex:1;">
          <strong style="font-size:13px;">${escapeHtml(spec.baseEn.name)}</strong>
          <div style="font-size:10.5px; color:var(--muted);">初回踏破：💎+${spec.reward.gems} / 🎟️券+${spec.reward.tickets}${spec.reward.cores ? ` / 💠コア+${spec.reward.cores}` : ` / 📘記録+${spec.reward.books}`}</div>
        </div>
      </div>
      <button class="btn-accent2" style="width:100%; padding:11px; font-size:14px;" onclick="startTowerBattle(${nextFloor})">
        🗼 ${nextFloor}F へ挑戦する（EN消費なし）
      </button>
    </div>

    <div class="card" style="padding:9px;">
      <strong style="font-size:12px; display:block; margin-bottom:6px;">📋 今後の階層スケジュール</strong>
      ${previewFloors.map(f => {
        const sp = getTowerFloorSpec(f);
        return `
          <div class="top-row" style="padding:5px 7px; border-radius:8px; background:var(--surface-sub); margin-bottom:4px; font-size:11px;">
            <span><strong>${f}F</strong> ${sp.isBoss ? "👑" : "⚔️"} ${escapeHtml(sp.baseEn.name)}</span>
            <span style="color:var(--accent); font-weight:900;">💎+${sp.reward.gems} / 🎟️+${sp.reward.tickets}</span>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function claimTowerDailySweep() {
  const eg = ensureEndgameState();
  const today = typeof getLoginTodayStr === "function" ? getLoginTodayStr() : new Date().toISOString().slice(0, 10);
  if (eg.towerClearedFloor <= 0 || eg.towerDailyClaimDate === today) return;

  const cleared = eg.towerClearedFloor;
  const gems = Math.min(240, 20 + cleared * 6);
  const books = Math.min(80, 5 + cleared * 2);
  const credits = 2000 + cleared * 800;

  eg.towerDailyClaimDate = today;
  state.gems += gems;
  state.expBooks = (state.expBooks || 0) + books;
  state.credits += credits;
  saveGame(); playSfx("gift");
  renderEndgameView();
  showToast(`🗼 タワー${cleared}F掃討完了！💎+${gems} / 📘+${books} / 🪙+${credits.toLocaleString()}`);
}

function startTowerBattle(floor) {
  const spec = getTowerFloorSpec(floor);
  const run = () => {
    switchView("battle");
    startBattle(spec.enemyId, {
      returnView: "endgame",
      hpMult: spec.scale,
      atkMult: Number((0.7 + floor * 0.1).toFixed(2)),
      questTitle: `無限タワー【${floor}F】`,
      onWin: () => {
        const eg = ensureEndgameState();
        if (floor > eg.towerClearedFloor) {
          eg.towerClearedFloor = floor;
          state.gems += spec.reward.gems;
          state.cardTickets = (state.cardTickets || 0) + spec.reward.tickets;
          if (spec.reward.cores) state.cores = (state.cores || 0) + spec.reward.cores;
          if (spec.reward.books) state.expBooks = (state.expBooks || 0) + spec.reward.books;
          saveGame();
          showToast(`🗼 無限タワー ${floor}F 初回踏破！💎+${spec.reward.gems} / 🎟️券+${spec.reward.tickets}！`);
        }
      }
    });
  };
  if (typeof showLoadingScreen === "function") showLoadingScreen(`無限の瘴霧タワー ${floor}F へ降下中……`, run, 620);
  else run();
}

// ---------- ☄️ 融光レイド・スコアアタック（5ターン総ダメージ勝負） ----------
function getRaidTierByScore(score) {
  return RAID_TIERS.find(t => score >= t.min) || RAID_TIERS[RAID_TIERS.length - 1];
}

function renderRaidPanel(eg) {
  const bossMeta = getTodayRaidBoss();
  const baseEn = (window.MF_DATA.ENEMIES || []).find(e => e.id === bossMeta.id) || window.MF_DATA.ENEMIES[5];
  const remain = Math.max(0, 3 - (eg.raidTodayAttempts || 0));
  const thumb = window.MF_SPRITES.enemyHTML ? window.MF_SPRITES.enemyHTML(baseEn, "thumb") : "";

  document.getElementById("eg-raid-body").innerHTML = `
    <div class="card" style="border-color:#ffd000; background:linear-gradient(135deg, rgba(255,208,0,0.16), rgba(157,78,221,0.18)); margin-bottom:9px;">
      <div class="top-row" style="margin-bottom:6px;">
        <strong style="font-size:13.5px;">☄️ 本日の極限レイドボス</strong>
        <span class="rank-pill">本日残り ${remain} / 3回</span>
      </div>
      <div style="display:flex; gap:10px; align-items:center; margin-bottom:8px;">
        ${thumb}
        <div style="flex:1;">
          <strong style="font-size:13px;">${escapeHtml(bossMeta.title)}</strong>
          <div style="font-size:10.5px; color:var(--muted); margin-top:2px;">💡 ${escapeHtml(bossMeta.weakness)}</div>
        </div>
      </div>
      <div class="stat-grid" style="grid-template-columns:repeat(2,1fr); margin-bottom:9px;">
        <div class="stat-cell"><span>歴代ハイスコア</span><strong>${(eg.raidBestScore || 0).toLocaleString()} DMG</strong></div>
        <div class="stat-cell"><span>本日ベスト</span><strong>${(eg.raidTodayBest || 0).toLocaleString()} DMG</strong></div>
      </div>
      <button class="btn-accent2" style="width:100%; padding:12px; font-size:14px;" ${remain <= 0 ? "disabled" : ""} onclick="startRaidBattle()">
        ${remain <= 0 ? "✅ 本日のレイド挑戦回数を消化済" : "☄️ 5ターン・レイド出撃！（EN消費なし）"}
      </button>
    </div>

    <div class="card" style="padding:9px;">
      <strong style="font-size:12px; display:block; margin-bottom:6px;">🏆 5ターン総ダメージ・評価ランク報酬</strong>
      ${RAID_TIERS.map(t => `
        <div class="top-row" style="padding:5px 7px; border-radius:8px; background:var(--surface-sub); margin-bottom:4px; font-size:11px;">
          <span><strong style="color:#ffd000;">Rank ${t.rank}</strong>（${t.min.toLocaleString()} DMG〜）</span>
          <span style="font-weight:900;">💎+${t.gems} / 🎟️+${t.tickets} / 🪙${t.credits.toLocaleString()}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function startRaidBattle() {
  const eg = ensureEndgameState();
  if (eg.raidTodayAttempts >= 3) { showToast("本日のレイド挑戦上限（3回）に達しています"); return; }
  const bossMeta = getTodayRaidBoss();

  const run = () => {
    switchView("battle");
    startBattle(bossMeta.id, {
      returnView: "endgame",
      isRaid: true,
      raidMaxTurns: 5,
      questTitle: "極限レイド【5T計測】",
      onRaidFinish: (totalDmg) => {
        const cur = ensureEndgameState();
        cur.raidTodayAttempts = (cur.raidTodayAttempts || 0) + 1;
        const isNewBest = totalDmg > (cur.raidBestScore || 0);
        if (isNewBest) cur.raidBestScore = totalDmg;
        if (totalDmg > (cur.raidTodayBest || 0)) cur.raidTodayBest = totalDmg;

        const tier = getRaidTierByScore(totalDmg);
        const bestBonus = isNewBest && totalDmg > 0 ? 120 : 0;
        state.gems += tier.gems + bestBonus;
        state.cardTickets = (state.cardTickets || 0) + tier.tickets;
        state.credits += tier.credits;
        if (typeof addMissionProgress === "function") addMissionProgress("battle", 1);
        saveGame();
        renderTopBar();
        return { tier, isNewBest, bestBonus };
      }
    });
  };
  if (typeof showLoadingScreen === "function") showLoadingScreen("極限レイド戦域へ転送中……", run, 650);
  else run();
}
