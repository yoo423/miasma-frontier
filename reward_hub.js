// =========================================================
// 🏅 戦術報酬ハブ（2.実績・アチーブメント / 3.前線派遣 / 5.週替わり戦術チャレンジ）
// =========================================================
let rhActiveTab = "ach"; // "ach" | "dispatch" | "weekly"
let rhAchFilter = "all"; // "all" | "battle" | "growth" | "collect" | "endgame"
let rhDispatchDraft = { slotIdx: -1, missionId: "", selectedChars: [] };
let rhTicker = null;

function rhEsc(s) {
  if (typeof escapeHtml === "function") return escapeHtml(s);
  return String(s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  }[c]));
}

// ISO週キー（毎週月曜0時に自動切替）
function rhGetWeekKey() {
  const d = new Date();
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
  return `${tmp.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

function rhGetWeekSeed(wk) {
  let h = 0;
  for (let i = 0; i < wk.length; i++) h = (h * 31 + wk.charCodeAt(i)) >>> 0;
  return h;
}

function rhEnsureState() {
  if (typeof state === "undefined" || !state) return;
  if (!state.achStats) {
    state.achStats = { reactions: 0, chains3: 0, partBreaks: 0, hunts: 0, tier2Clears: 0, tier3Clears: 0, tier4Clears: 0, dispatchesDone: 0 };
  }
  if (!Array.isArray(state.claimedAchievements)) state.claimedAchievements = [];
  if (!Array.isArray(state.dispatches)) state.dispatches = [null, null, null];
  while (state.dispatches.length < 3) state.dispatches.push(null);

  const curWk = rhGetWeekKey();
  if (!state.weeklyChallenges || state.weeklyChallenges.weekKey !== curWk) {
    state.weeklyChallenges = { weekKey: curWk, progress: {}, claimed: [], compClaimed: false };
  }
}

// ---------- 🏆 2. 実績・アチーブメント定義（序盤〜終焉まで全36項目） ----------
function rhCountCharsWithLv(minLv) {
  return Object.values(state?.charLevels || {}).filter(v => Number(v || 0) >= minLv).length;
}
function rhCountTotalDupes() {
  const owned = state?.ownedChars || [];
  if (window.MF_LIMIT_BREAK?.getDupeCount) {
    return owned.reduce((s, id) => s + window.MF_LIMIT_BREAK.getDupeCount(id), 0);
  }
  return Object.values(state?.charDupes || {}).reduce((s, v) => s + Number(v || 0), 0);
}
function rhCountBondsAt(minPt) {
  const map = state?.bonds || state?.bondPoints || state?.charBonds || {};
  return Object.values(map).filter(v => Number(v || 0) >= minPt).length;
}
function rhCountOwnedCards() {
  return Object.values(state?.ownedCards || {}).filter(v => Number(v || 0) > 0).length;
}

const RH_ACHIEVEMENTS = [
  // バトル戦術
  { id: "react_15",   cat: "battle",  title: "元素共鳴の入門者",    desc: "元素反応を累計15回発動",      target: 15,   get: () => state.achStats.reactions, gems: 160, tk: 2, cr: 0, rb: 0 },
  { id: "react_80",   cat: "battle",  title: "元素反応マスター",    desc: "元素反応を累計80回発動",      target: 80,   get: () => state.achStats.reactions, gems: 320, tk: 3, cr: 0, rb: 0 },
  { id: "react_250",  cat: "battle",  title: "元素を統べる指揮官",  desc: "元素反応を累計250回発動",     target: 250,  get: () => state.achStats.reactions, gems: 480, tk: 5, cr: 10, rb: 0 },
  { id: "react_600",  cat: "battle",  title: "六元素の極致",        desc: "元素反応を累計600回発動",     target: 600,  get: () => state.achStats.reactions, gems: 800, tk: 8, cr: 20, rb: 0 },
  { id: "chain_15",   cat: "battle",  title: "三連撃の呼吸",        desc: "3連チェインを累計15回発動",   target: 15,   get: () => state.achStats.chains3,   gems: 160, tk: 2, cr: 0, rb: 0 },
  { id: "chain_100",  cat: "battle",  title: "途切れぬ連撃陣",      desc: "3連チェインを累計100回発動",  target: 100,  get: () => state.achStats.chains3,   gems: 360, tk: 4, cr: 0, rb: 0 },
  { id: "chain_300",  cat: "battle",  title: "神速タクティシャン",  desc: "3連チェインを累計300回発動",  target: 300,  get: () => state.achStats.chains3,   gems: 640, tk: 6, cr: 15, rb: 0 },
  { id: "part_5",     cat: "battle",  title: "弱点粉砕ハンター",    desc: "ボスの部位破壊を累計5回達成", target: 5,    get: () => state.achStats.partBreaks, gems: 200, tk: 2, cr: 0, rb: 0 },
  { id: "part_30",    cat: "battle",  title: "解体スペシャリスト",  desc: "ボスの部位破壊を累計30回達成",target: 30,   get: () => state.achStats.partBreaks, gems: 420, tk: 4, cr: 10, rb: 0 },
  { id: "part_100",   cat: "battle",  title: "完全粉砕の狩人",      desc: "ボスの部位破壊を累計100回達成",target: 100, get: () => state.achStats.partBreaks, gems: 800, tk: 8, cr: 25, rb: 0 },
  { id: "hunt_15",    cat: "battle",  title: "霧獣掃討・初段",      desc: "討伐バトルに累計15勝",        target: 15,   get: () => state.achStats.hunts,     gems: 160, tk: 2, cr: 0, rb: 0 },
  { id: "hunt_80",    cat: "battle",  title: "歴戦の討伐隊長",      desc: "討伐バトルに累計80勝",        target: 80,   get: () => state.achStats.hunts,     gems: 400, tk: 4, cr: 10, rb: 0 },
  { id: "hunt_250",   cat: "battle",  title: "不敗の開拓英雄",      desc: "討伐バトルに累計250勝",       target: 250,  get: () => state.achStats.hunts,     gems: 800, tk: 8, cr: 25, rb: 0 },

  // 育成・開拓
  { id: "lv40_1",     cat: "growth",  title: "精鋭への第一歩",      desc: "Lv.40以上の隊員を1名育成",    target: 1,    get: () => rhCountCharsWithLv(40),   gems: 160, tk: 2, cr: 0, rb: 0 },
  { id: "lv40_4",     cat: "growth",  title: "主力小隊・確立",      desc: "Lv.40以上の隊員を4名育成",    target: 4,    get: () => rhCountCharsWithLv(40),   gems: 320, tk: 3, cr: 0, rb: 0 },
  { id: "lv60_1",     cat: "growth",  title: "熟練オペレーター",    desc: "Lv.60以上の隊員を1名育成",    target: 1,    get: () => rhCountCharsWithLv(60),   gems: 240, tk: 3, cr: 0, rb: 0 },
  { id: "lv60_4",     cat: "growth",  title: "最前線の精鋭部隊",    desc: "Lv.60以上の隊員を4名育成",    target: 4,    get: () => rhCountCharsWithLv(60),   gems: 480, tk: 5, cr: 10, rb: 0 },
  { id: "lv80_1",     cat: "growth",  title: "極みに達した一振",    desc: "Lv.80到達の隊員を1名育成",    target: 1,    get: () => rhCountCharsWithLv(80),   gems: 480, tk: 5, cr: 15, rb: 0 },
  { id: "lv80_4",     cat: "growth",  title: "最強小隊・完成",      desc: "Lv.80到達の隊員を4名育成",    target: 4,    get: () => rhCountCharsWithLv(80),   gems: 960, tk: 10, cr: 30, rb: 1 },
  { id: "lv80_8",     cat: "growth",  title: "伝説の大隊指揮官",    desc: "Lv.80到達の隊員を8名育成",    target: 8,    get: () => rhCountCharsWithLv(80),   gems: 1600, tk: 15, cr: 50, rb: 1 },
  { id: "dupe_5",     cat: "growth",  title: "共鳴の開花",          desc: "隊員の限界突破を累計5回達成", target: 5,    get: () => rhCountTotalDupes(),      gems: 320, tk: 3, cr: 0, rb: 0 },
  { id: "dupe_20",    cat: "growth",  title: "覚醒の指揮官",        desc: "隊員の限界突破を累計20回達成",target: 20,   get: () => rhCountTotalDupes(),      gems: 640, tk: 6, cr: 20, rb: 0 },
  { id: "pio_10",     cat: "growth",  title: "前線基地の拡大",      desc: "開拓Lv.10に到達",             target: 10,   get: () => Number(state.playerRank || 1), gems: 320, tk: 3, cr: 0, rb: 0 },
  { id: "pio_16",     cat: "growth",  title: "極限開拓領域の主",    desc: "開拓Lv.16に到達",             target: 16,   get: () => Number(state.playerRank || 1), gems: 640, tk: 6, cr: 15, rb: 0 },
  { id: "pio_25",     cat: "growth",  title: "新世界の開拓王",      desc: "開拓Lv.25に到達",             target: 25,   get: () => Number(state.playerRank || 1), gems: 1200, tk: 10, cr: 30, rb: 1 },

  // 収集・絆・派遣
  { id: "card_30",    cat: "collect", title: "戦術書コレクター",    desc: "戦術カードを30種収集",        target: 30,   get: () => rhCountOwnedCards(),      gems: 200, tk: 3, cr: 0, rb: 0 },
  { id: "card_65",    cat: "collect", title: "戦術アーカイブ司書",  desc: "戦術カードを65種収集",        target: 65,   get: () => rhCountOwnedCards(),      gems: 480, tk: 5, cr: 10, rb: 0 },
  { id: "card_95",    cat: "collect", title: "全戦術の究明者",      desc: "戦術カードを95種収集",        target: 95,   get: () => rhCountOwnedCards(),      gems: 960, tk: 10, cr: 25, rb: 0 },
  { id: "bond5_1",    cat: "collect", title: "揺るがぬ誓い",        desc: "絆Lv.5の隊員を1名達成",       target: 1,    get: () => rhCountBondsAt(100),      gems: 320, tk: 3, cr: 0, rb: 0 },
  { id: "bond5_5",    cat: "collect", title: "小隊の絶対的絆",      desc: "絆Lv.5の隊員を5名達成",       target: 5,    get: () => rhCountBondsAt(100),      gems: 800, tk: 8, cr: 20, rb: 0 },
  { id: "disp_5",     cat: "collect", title: "遠征ロジスティクス",  desc: "前線派遣を累計5回完了",       target: 5,    get: () => state.achStats.dispatchesDone, gems: 160, tk: 2, cr: 0, rb: 0 },
  { id: "disp_30",    cat: "collect", title: "広域補給網の司令塔",  desc: "前線派遣を累計30回完了",      target: 30,   get: () => state.achStats.dispatchesDone, gems: 480, tk: 5, cr: 15, rb: 0 },

  // 超難度エンドコンテンツ（極限・災厄・終焉）
  { id: "t2_3",       cat: "endgame", title: "極限を歩む者",        desc: "★★極限を累計3回撃破",         target: 3,    get: () => state.achStats.tier2Clears, gems: 400, tk: 4, cr: 10, rb: 0 },
  { id: "t3_1",       cat: "endgame", title: "災厄を退けし刃",      desc: "★★★災厄を初めて撃破",         target: 1,    get: () => state.achStats.tier3Clears, gems: 640, tk: 6, cr: 15, rb: 0 },
  { id: "t3_10",      cat: "endgame", title: "災厄殲滅プロトコル",  desc: "★★★災厄を累計10回撃破",       target: 10,   get: () => state.achStats.tier3Clears, gems: 1200, tk: 10, cr: 30, rb: 1 },
  { id: "t4_1",       cat: "endgame", title: "終焉を越えし開拓者",  desc: "★★★★終焉を初めて撃破",        target: 1,    get: () => state.achStats.tier4Clears, gems: 1600, tk: 12, cr: 40, rb: 1 },
  { id: "t4_5",       cat: "endgame", title: "神域のタクティカル王",desc: "★★★★終焉を累計5回撃破",       target: 5,    get: () => state.achStats.tier4Clears, gems: 3200, tk: 20, cr: 80, rb: 2 }
];

// ---------- 🚁 3. 控え隊員の前線派遣コース（序盤〜最終盤Lv.70まで6種） ----------
const RH_DISPATCH_COURSES = [
  { id: "ore_shallow", icon: "💎", name: "結晶鉱脈・浅層採掘",     hours: 2,  recLv: 1,  gems: 55,  tk: 0, credits: 3000,  books: 5,  cores: 0, gifts: 0, crests: 0 },
  { id: "archive_old", icon: "🎟️", name: "旧文明アーカイブ回収",   hours: 3,  recLv: 10, gems: 30,  tk: 2, credits: 4500,  books: 10, cores: 1, gifts: 0, crests: 0 },
  { id: "flower_hill", icon: "💐", name: "アーク花畑の巡回探索",   hours: 4,  recLv: 15, gems: 70,  tk: 1, credits: 5000,  books: 8,  cores: 0, gifts: 3, crests: 0 },
  { id: "ore_abyss",   icon: "💎", name: "深淵結晶坑道・強行採掘", hours: 8,  recLv: 35, gems: 160, tk: 2, credits: 12000, books: 18, cores: 4, gifts: 0, crests: 0 },
  { id: "vault_taboo", icon: "🎟️", name: "禁忌データ保管庫の解読", hours: 10, recLv: 52, gems: 140, tk: 5, credits: 18000, books: 25, cores: 6, gifts: 2, crests: 5 },
  { id: "end_sector",  icon: "👑", name: "終焉領域・極限物資回収", hours: 12, recLv: 70, gems: 280, tk: 5, credits: 32000, books: 40, cores: 10,gifts: 3, crests: 12 }
];

const RH_DISPATCH_SLOT_REQ = [1, 5, 10]; // 枠1:Lv1 / 枠2:開拓Lv5 / 枠3:開拓Lv10

// ---------- 🎯 5. 週替わり戦術チャレンジ（毎週月曜自動切替・初級〜終焉） ----------
function rhGetWeeklyChallengeList() {
  const wk = rhGetWeekKey();
  const seed = rhGetWeekSeed(wk);
  const banPool = [
    { el: "fire",  icon: "🔥", name: "炎属性" },
    { el: "ice",   icon: "❄️", name: "氷属性" },
    { el: "water", icon: "💧", name: "水属性" },
    { el: "volt",  icon: "⚡", name: "雷属性" }
  ];
  const ban = banPool[seed % banPool.length];
  const needPartTier = (seed % 2 === 0) ? 1 : 2;

  return [
    {
      id: "wk_react", rank: "初級", title: "元素連携テスト",
      desc: "1回の手動バトル中に元素反応を3回以上発動して勝利",
      target: 1, gems: 160, tk: 2, cr: 0,
      check: (b) => b.isManual && b.reactions >= 3
    },
    {
      id: "wk_ban", rank: "中級", title: `${ban.icon}${ban.name}封印戦`,
      desc: `${ban.name}の隊員・カードを使わずに手動で2回勝利`,
      target: 2, gems: 240, tk: 3, cr: 0,
      check: (b) => b.isManual && !b.partyElements.includes(ban.el) && !b.usedElements.includes(ban.el)
    },
    {
      id: "wk_part", rank: "上級", title: "精密部位解体",
      desc: `${needPartTier === 2 ? "★★極限" : "★強敵"}以上の討伐で部位破壊を成功させ手動勝利`,
      target: 1, gems: 360, tk: 4, cr: 5,
      check: (b) => b.isManual && b.tierId >= needPartTier && b.partBreaks >= 1
    },
    {
      id: "wk_speed", rank: "極限", title: "極限スピード討伐",
      desc: "★★極限以上の討伐を手動・12ターン以内で撃破",
      target: 1, gems: 520, tk: 5, cr: 10,
      check: (b) => b.isManual && b.tierId >= 2 && b.turns <= 12
    },
    {
      id: "wk_end", rank: "災厄/終焉", title: "極限領域の突破",
      desc: "★★★災厄 または ★★★★終焉 の霧獣を手動で1体撃破",
      target: 1, gems: 880, tk: 8, cr: 20,
      check: (b) => b.isManual && b.tierId >= 3
    }
  ];
}

// ---------- 🔔 未受取・帰還完了カウント ----------
function rhCountBadges() {
  rhEnsureState();
  if (typeof state === "undefined" || !state) return { ach: 0, disp: 0, weekly: 0, total: 0 };

  let ach = 0;
  RH_ACHIEVEMENTS.forEach(a => {
    if (!state.claimedAchievements.includes(a.id) && a.get() >= a.target) ach += 1;
  });

  const now = Date.now();
  let disp = 0;
  (state.dispatches || []).forEach(d => {
    if (d && now >= d.endAt) disp += 1;
  });

  let weekly = 0;
  const list = rhGetWeeklyChallengeList();
  let allDone = true;
  list.forEach(c => {
    const cur = Number(state.weeklyChallenges.progress[c.id] || 0);
    if (cur < c.target) allDone = false;
    if (cur >= c.target && !state.weeklyChallenges.claimed.includes(c.id)) weekly += 1;
  });
  if (allDone && !state.weeklyChallenges.compClaimed) weekly += 1;

  return { ach, disp, weekly, total: ach + disp + weekly };
}

// ---------- 🏆 実績受取 ----------
function rhClaimAchievement(id, silent = false) {
  rhEnsureState();
  const a = RH_ACHIEVEMENTS.find(x => x.id === id);
  if (!a || state.claimedAchievements.includes(id) || a.get() < a.target) return false;
  state.claimedAchievements.push(id);
  state.gems = (state.gems || 0) + a.gems;
  state.cardTickets = (state.cardTickets || 0) + a.tk;
  if (a.cr) state.arcCrests = (state.arcCrests || 0) + a.cr;
  if (a.rb) state.rainbowCores = (state.rainbowCores || 0) + a.rb;

  if (!silent) {
    if (typeof saveGame === "function") saveGame();
    if (typeof playSfx === "function") playSfx("gift");
    if (typeof renderTopBar === "function") renderTopBar();
    rhRenderModal();
    rhRenderEntryBanners();
    showToast(`🏆 実績『${a.title}』受取！💎+${a.gems} / 🎟️+${a.tk}${a.rb ? ` / 🌈虹コア+${a.rb}` : ""}`);
  }
  return true;
}

function rhClaimAllAchievements() {
  rhEnsureState();
  let cnt = 0, gems = 0, tk = 0, cr = 0, rb = 0;
  RH_ACHIEVEMENTS.forEach(a => {
    if (!state.claimedAchievements.includes(a.id) && a.get() >= a.target) {
      if (rhClaimAchievement(a.id, true)) {
        cnt += 1; gems += a.gems; tk += a.tk; cr += a.cr; rb += a.rb;
      }
    }
  });
  if (cnt === 0) { showToast("受取可能な実績はまだありません"); return; }
  if (typeof saveGame === "function") saveGame();
  if (typeof playSfx === "function") playSfx("win");
  if (typeof renderTopBar === "function") renderTopBar();
  rhRenderModal();
  rhRenderEntryBanners();
  showToast(`🏆 実績${cnt}件を一括受取！💎+${gems.toLocaleString()} / 🎟️+${tk}${cr ? ` / 💠+${cr}` : ""}${rb ? ` / 🌈+${rb}` : ""}`);
}

// ---------- 🚁 控え隊員の前線派遣アクション ----------
function rhGetBusyCharSet() {
  const s = new Set(state?.party || []);
  s.add("protagonist");
  (state?.dispatches || []).forEach(d => {
    if (d && Array.isArray(d.charIds)) d.charIds.forEach(id => s.add(id));
  });
  return s;
}

function rhGetAvailableBenchChars() {
  const busy = rhGetBusyCharSet();
  return (state?.ownedChars || [])
    .filter(id => !busy.has(id) && window.MF_DATA?.CHARACTERS?.[id])
    .map(id => ({ id, ch: window.MF_DATA.CHARACTERS[id], lv: Number(state?.charLevels?.[id] || 1) }))
    .sort((a, b) => b.lv - a.lv);
}

function rhOpenDispatchSetup(slotIdx) {
  rhEnsureState();
  const reqRank = RH_DISPATCH_SLOT_REQ[slotIdx] || 1;
  if ((state.playerRank || 1) < reqRank) {
    showToast(`🔒 派遣枠${slotIdx + 1}は開拓Lv.${reqRank}で解放されます`);
    return;
  }
  const bench = rhGetAvailableBenchChars();
  if (bench.length === 0) {
    showToast("派遣できる控え隊員がいません（スカウトで仲間を増やすか、他部隊の帰還を待ってください）");
    return;
  }
  rhDispatchDraft = {
    slotIdx,
    missionId: RH_DISPATCH_COURSES[0].id,
    selectedChars: bench.slice(0, Math.min(3, bench.length)).map(x => x.id)
  };
  if (typeof playSfx === "function") playSfx("tap");
  rhRenderModal();
}

function rhToggleDispatchChar(charId) {
  const arr = rhDispatchDraft.selectedChars;
  const idx = arr.indexOf(charId);
  if (idx >= 0) arr.splice(idx, 1);
  else if (arr.length < 3) arr.push(charId);
  else { showToast("1部隊につき最大3名まで派遣できます"); return; }
  if (typeof playSfx === "function") playSfx("tap");
  rhRenderModal();
}

function rhCalcDispatchGreatRate(course, charIds) {
  if (!charIds.length) return 0;
  const avgLv = charIds.reduce((s, id) => s + Number(state?.charLevels?.[id] || 1), 0) / charIds.length;
  const lvRatio = Math.min(1.5, avgLv / Math.max(1, course.recLv));
  return Math.min(85, Math.round(charIds.length * 14 + lvRatio * 24));
}

function rhStartDispatch() {
  rhEnsureState();
  const { slotIdx, missionId, selectedChars } = rhDispatchDraft;
  const course = RH_DISPATCH_COURSES.find(c => c.id === missionId);
  if (slotIdx < 0 || !course) return;
  if (selectedChars.length === 0) { showToast("派遣する控え隊員を1名以上選んでください"); return; }

  const now = Date.now();
  state.dispatches[slotIdx] = {
    missionId: course.id,
    charIds: [...selectedChars],
    startAt: now,
    endAt: now + course.hours * 3600 * 1000
  };
  rhDispatchDraft = { slotIdx: -1, missionId: "", selectedChars: [] };
  if (typeof saveGame === "function") saveGame();
  if (typeof playSfx === "function") playSfx("switch");
  rhRenderModal();
  rhRenderEntryBanners();
  showToast(`🚁 『${course.name}』へ部隊を派遣しました！（${course.hours}時間後に帰還）`);
}

function rhBoostDispatch(slotIdx) {
  rhEnsureState();
  const d = state.dispatches[slotIdx];
  if (!d) return;
  const curEn = (state.en || 0) + (state.reserveEn || 0);
  if (curEn < 30) { showToast("⚡ EN不足（緊急帰還にはEN30が必要）"); return; }
  if (state.en >= 30) state.en -= 30;
  else { const lack = 30 - state.en; state.en = 0; state.reserveEn = Math.max(0, (state.reserveEn || 0) - lack); }

  d.endAt -= 2 * 3600 * 1000; // 2時間短縮
  if (typeof saveGame === "function") saveGame();
  if (typeof playSfx === "function") playSfx("switch");
  if (typeof renderTopBar === "function") renderTopBar();
  rhRenderModal();
  rhRenderEntryBanners();
  showToast("⚡ 緊急帰還プロトコル実行！残り時間を2時間短縮しました！");
}

function rhClaimDispatch(slotIdx) {
  rhEnsureState();
  const d = state.dispatches[slotIdx];
  if (!d) return;
  if (Date.now() < d.endAt) { showToast("まだ遠征中です"); return; }
  const course = RH_DISPATCH_COURSES.find(c => c.id === d.missionId) || RH_DISPATCH_COURSES[0];

  const greatChance = rhCalcDispatchGreatRate(course, d.charIds || []);
  const isGreat = Math.random() * 100 < greatChance;
  const mult = isGreat ? 1.5 : 1.0;

  const gGems = Math.round(course.gems * mult);
  const gTk = Math.round(course.tk * mult);
  const gCr = Math.round(course.credits * mult);
  const gBk = Math.round(course.books * mult);
  const gCores = Math.round(course.cores * mult);
  const gGifts = Math.round(course.gifts * mult);
  const gCrests = Math.round(course.crests * mult);

  state.gems = (state.gems || 0) + gGems;
  state.cardTickets = (state.cardTickets || 0) + gTk;
  state.credits = (state.credits || 0) + gCr;
  state.expBooks = (state.expBooks || 0) + gBk;
  state.cores = (state.cores || 0) + gCores;
  state.bondGifts = (state.bondGifts || 0) + gGifts;
  state.arcCrests = (state.arcCrests || 0) + gCrests;
  state.achStats.dispatchesDone = (state.achStats.dispatchesDone || 0) + 1;
  state.dispatches[slotIdx] = null;

  if (typeof saveGame === "function") saveGame();
  if (typeof playSfx === "function") playSfx(isGreat ? "win" : "gift");
  if (typeof renderTopBar === "function") renderTopBar();
  rhRenderModal();
  rhRenderEntryBanners();

  const parts = [];
  if (gGems) parts.push(`💎+${gGems}`);
  if (gTk) parts.push(`🎟️+${gTk}`);
  if (gGifts) parts.push(`💐+${gGifts}`);
  if (gCrests) parts.push(`💠クレスト+${gCrests}`);
  if (gCr) parts.push(`🪙+${gCr.toLocaleString()}`);
  showToast(`${isGreat ? "🌟 大成功(1.5倍)!! " : "🚁 派遣帰還！"} ${parts.join(" / ")}`);
}

// ---------- 🎯 5. 週替わり戦術チャレンジ受取 ----------
function rhClaimWeekly(chId) {
  rhEnsureState();
  const list = rhGetWeeklyChallengeList();
  const ch = list.find(x => x.id === chId);
  if (!ch) return;
  const cur = Number(state.weeklyChallenges.progress[chId] || 0);
  if (cur < ch.target || state.weeklyChallenges.claimed.includes(chId)) return;

  state.weeklyChallenges.claimed.push(chId);
  state.gems = (state.gems || 0) + ch.gems;
  state.cardTickets = (state.cardTickets || 0) + ch.tk;
  if (ch.cr) state.arcCrests = (state.arcCrests || 0) + ch.cr;

  if (typeof saveGame === "function") saveGame();
  if (typeof playSfx === "function") playSfx("gift");
  if (typeof renderTopBar === "function") renderTopBar();
  rhRenderModal();
  rhRenderEntryBanners();
  showToast(`🎯 『${ch.title}』達成報酬！💎+${ch.gems} / 🎟️+${ch.tk}${ch.cr ? ` / 💠+${ch.cr}` : ""}`);
}

function rhClaimWeeklyComplete() {
  rhEnsureState();
  const list = rhGetWeeklyChallengeList();
  const allDone = list.every(c => Number(state.weeklyChallenges.progress[c.id] || 0) >= c.target);
  if (!allDone || state.weeklyChallenges.compClaimed) return;
  state.weeklyChallenges.compClaimed = true;
  state.gems = (state.gems || 0) + 500;
  state.cardTickets = (state.cardTickets || 0) + 5;
  state.arcCrests = (state.arcCrests || 0) + 15;
  if (typeof saveGame === "function") saveGame();
  if (typeof playSfx === "function") playSfx("win");
  if (typeof renderTopBar === "function") renderTopBar();
  rhRenderModal();
  rhRenderEntryBanners();
  showToast("👑 今週の戦術チャレンジ完全制覇！💎+500 / 🎟️+5 / 💠クレスト+15！");
}

// ---------- ⚔️ バトル勝利フック（battle.js から自動呼び出し） ----------
function rhOnBattleWin(info) {
  rhEnsureState();
  if (!state) return { unlockedLabels: [] };

  const st = state.achStats;
  st.reactions = (st.reactions || 0) + (info.reactions || 0);
  st.chains3 = (st.chains3 || 0) + (info.chains3 || 0);
  st.partBreaks = (st.partBreaks || 0) + (info.partBreaks || 0);
  if (info.isHunt) {
    st.hunts = (st.hunts || 0) + 1;
    if (info.tierId >= 2) st.tier2Clears = (st.tier2Clears || 0) + 1;
    if (info.tierId >= 3) st.tier3Clears = (st.tier3Clears || 0) + 1;
    if (info.tierId >= 4) st.tier4Clears = (st.tier4Clears || 0) + 1;
  }

  const unlockedLabels = [];
  const wkList = rhGetWeeklyChallengeList();
  wkList.forEach(c => {
    const prev = Number(state.weeklyChallenges.progress[c.id] || 0);
    if (prev < c.target && c.check(info)) {
      const next = prev + 1;
      state.weeklyChallenges.progress[c.id] = next;
      if (next >= c.target) unlockedLabels.push(`週次『${c.title}』`);
    }
  });

  setTimeout(() => rhRenderEntryBanners(), 80);
  return { unlockedLabels };
}

// ---------- 🖥️ 戦術報酬ハブモーダル描画 ----------
function rhFormatRemain(ms) {
  if (ms <= 0) return "帰還完了！";
  const sec = Math.ceil(ms / 1000);
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function rhOpenHubModal(tab = "ach") {
  rhEnsureState();
  rhActiveTab = tab;
  rhDispatchDraft = { slotIdx: -1, missionId: "", selectedChars: [] };
  let modal = document.getElementById("modal-reward-hub");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-reward-hub";
    modal.className = "modal-overlay";
    modal.style.zIndex = "1400";
    modal.onclick = () => rhCloseHubModal();
    document.body.appendChild(modal);
  }
  rhRenderModal();
  modal.classList.add("active");
  if (typeof playSfx === "function") playSfx("switch");

  clearInterval(rhTicker);
  rhTicker = setInterval(() => {
    const m = document.getElementById("modal-reward-hub");
    if (!m || !m.classList.contains("active")) { clearInterval(rhTicker); return; }
    if (rhActiveTab === "dispatch" && rhDispatchDraft.slotIdx < 0) rhRenderModal();
  }, 1000);
}

function rhCloseHubModal() {
  clearInterval(rhTicker);
  const m = document.getElementById("modal-reward-hub");
  if (m) m.classList.remove("active");
  rhRenderEntryBanners();
}

function rhRenderModal() {
  const modal = document.getElementById("modal-reward-hub");
  if (!modal) return;
  rhEnsureState();
  const badges = rhCountBadges();

  let contentHtml = "";

  // ===== TAB 1: 実績・アチーブメント =====
  if (rhActiveTab === "ach") {
    const cats = [
      { id: "all",     label: "すべて" },
      { id: "battle",  label: "⚔️戦術" },
      { id: "growth",  label: "📈育成" },
      { id: "collect", label: "🃏収集" },
      { id: "endgame", label: "👑終焉" }
    ];
    const items = RH_ACHIEVEMENTS
      .filter(a => rhAchFilter === "all" || a.cat === rhAchFilter)
      .sort((a, b) => {
        const sa = state.claimedAchievements.includes(a.id) ? 2 : (a.get() >= a.target ? 0 : 1);
        const sb = state.claimedAchievements.includes(b.id) ? 2 : (b.get() >= b.target ? 0 : 1);
        return sa - sb;
      });

    contentHtml = `
      <div style="display:flex; justify-content:space-between; align-items:center; gap:5px; margin-bottom:7px;">
        <div style="display:flex; gap:3px; flex-wrap:wrap;">
          ${cats.map(c => `<button class="btn-xs ${rhAchFilter === c.id ? "btn-primary" : ""}" style="font-size:9.5px; padding:4px 6px;" onclick="rhAchFilter='${c.id}'; playSfx('tap'); rhRenderModal();">${c.label}</button>`).join("")}
        </div>
        <button class="btn-xs ${badges.ach > 0 ? "btn-accent2" : ""}" ${badges.ach > 0 ? "" : "disabled"} onclick="rhClaimAllAchievements()">🎁 一括(${badges.ach})</button>
      </div>
      <div class="rh-scroll-list">
        ${items.map(a => {
          const cur = Math.min(a.target, a.get());
          const done = state.claimedAchievements.includes(a.id);
          const ready = !done && cur >= a.target;
          const pct = Math.min(100, Math.round((cur / a.target) * 100));
          return `
            <div class="rh-item-card ${ready ? "ready" : ""} ${done ? "done" : ""}">
              <div style="flex:1; min-width:0; text-align:left;">
                <div class="top-row" style="margin-bottom:2px;">
                  <strong style="font-size:11.5px;">${rhEsc(a.title)}</strong>
                  <span style="font-size:10px; font-weight:900;">${cur} / ${a.target}</span>
                </div>
                <div style="font-size:10px; color:var(--muted);">${rhEsc(a.desc)}</div>
                <div class="gauge-bar" style="height:5px; margin:4px 0;"><div style="background:${ready ? "#f3cf00" : "#18b88a"}; width:${pct}%;"></div></div>
                <div style="font-size:10px; font-weight:900; color:var(--accent);">
                  💎+${a.gems} ｜ 🎟️+${a.tk}${a.cr ? ` ｜ 💠クレスト+${a.cr}` : ""}${a.rb ? ` ｜ 🌈虹コア+${a.rb}` : ""}
                </div>
              </div>
              <button class="btn-xs ${ready ? "btn-accent2" : ""}" style="flex-shrink:0; padding:7px 8px;" ${ready ? "" : "disabled"} onclick="rhClaimAchievement('${a.id}')">
                ${done ? "✓済" : (ready ? "🎁受取" : "進行中")}
              </button>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  // ===== TAB 2: 控え隊員の前線派遣 =====
  else if (rhActiveTab === "dispatch") {
    if (rhDispatchDraft.slotIdx >= 0) {
      const bench = rhGetAvailableBenchChars();
      const selCourse = RH_DISPATCH_COURSES.find(c => c.id === rhDispatchDraft.missionId) || RH_DISPATCH_COURSES[0];
      const greatRate = rhCalcDispatchGreatRate(selCourse, rhDispatchDraft.selectedChars);
      contentHtml = `
        <div style="text-align:left;">
          <div class="top-row" style="margin-bottom:6px;">
            <strong style="font-size:12px;">🚁 派遣枠${rhDispatchDraft.slotIdx + 1}：行き先＆隊員選択</strong>
            <button class="btn-xs" onclick="rhDispatchDraft.slotIdx=-1; rhRenderModal();">← 戻る</button>
          </div>
          <div class="rh-scroll-list" style="max-height:200px; margin-bottom:8px;">
            ${RH_DISPATCH_COURSES.map(c => {
              const active = c.id === selCourse.id;
              return `
                <div class="rh-item-card ${active ? "ready" : ""}" style="cursor:pointer; margin-bottom:5px;" onclick="rhDispatchDraft.missionId='${c.id}'; playSfx('tap'); rhRenderModal();">
                  <div style="flex:1; min-width:0;">
                    <div class="top-row"><strong style="font-size:11.5px;">${c.icon} ${rhEsc(c.name)}</strong><span class="tag">${c.hours}時間 / 推奨Lv.${c.recLv}</span></div>
                    <div style="font-size:10px; color:var(--accent); font-weight:900; margin-top:2px;">
                      ${c.gems ? `💎+${c.gems} ` : ""}${c.tk ? `🎟️+${c.tk} ` : ""}${c.gifts ? `💐+${c.gifts} ` : ""}${c.crests ? `💠クレスト+${c.crests} ` : ""}🪙+${c.credits.toLocaleString()}
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>

          <div style="font-size:11px; font-weight:900; margin-bottom:5px;">
            控え隊員を選択（${rhDispatchDraft.selectedChars.length}/3名）｜ 🌟大成功(1.5倍)率：<strong>${greatRate}%</strong>
          </div>
          <div class="rh-bench-grid">
            ${bench.map(b => {
              const sel = rhDispatchDraft.selectedChars.includes(b.id);
              return `
                <button class="btn-xs ${sel ? "btn-primary" : ""}" style="padding:5px 4px; font-size:10px;" onclick="rhToggleDispatchChar('${b.id}')">
                  ${sel ? "✓" : ""}${rhEsc(b.ch.name)} <small>Lv.${b.lv}</small>
                </button>
              `;
            }).join("")}
          </div>
          <button class="btn-accent2" style="width:100%; padding:10px; margin-top:9px;" onclick="rhStartDispatch()">
            🚁 ${selCourse.hours}時間の前線派遣を開始！
          </button>
        </div>
      `;
    } else {
      const now = Date.now();
      const benchCnt = rhGetAvailableBenchChars().length;
      contentHtml = `
        <div style="font-size:10.5px; color:var(--muted); text-align:left; margin-bottom:7px; line-height:1.45;">
          パーティ編成外の控え隊員を遠征へ送り出し、時間経過で💎結晶石・🎟️パック券・💐ブーケ・💠クレストを回収します（派遣可能控え：<strong>${benchCnt}名</strong>）。
        </div>
        ${[0, 1, 2].map(idx => {
          const reqRank = RH_DISPATCH_SLOT_REQ[idx];
          const unlocked = (state.playerRank || 1) >= reqRank;
          const d = state.dispatches[idx];
          if (!unlocked) {
            return `
              <div class="rh-item-card done" style="justify-content:center; padding:12px;">
                <span style="font-size:11.5px; font-weight:900;">🔒 派遣部隊 ${idx + 1}（開拓Lv.${reqRank}で解放）</span>
              </div>
            `;
          }
          if (!d) {
            return `
              <div class="rh-item-card">
                <div style="text-align:left;">
                  <strong style="font-size:12px;">🚁 派遣部隊 ${idx + 1}（待機中）</strong>
                  <div style="font-size:10px; color:var(--muted);">控え隊員を1〜3名選んで出撃させよう</div>
                </div>
                <button class="btn-xs btn-primary" style="padding:7px 10px;" onclick="rhOpenDispatchSetup(${idx})">出発準備 ▶</button>
              </div>
            `;
          }
          const course = RH_DISPATCH_COURSES.find(c => c.id === d.missionId) || RH_DISPATCH_COURSES[0];
          const remain = d.endAt - now;
          const finished = remain <= 0;
          const names = (d.charIds || []).map(id => window.MF_DATA?.CHARACTERS?.[id]?.name || id).join("・");
          return `
            <div class="rh-item-card ${finished ? "ready" : ""}">
              <div style="flex:1; min-width:0; text-align:left;">
                <div class="top-row">
                  <strong style="font-size:11.5px;">${course.icon} ${rhEsc(course.name)}</strong>
                  <span class="tag" style="${finished ? "background:#f3cf00;color:#111;" : ""}">${rhFormatRemain(remain)}</span>
                </div>
                <div style="font-size:10px; color:var(--muted); margin:2px 0;">隊員：${rhEsc(names)}</div>
                <div style="font-size:10px; font-weight:900; color:var(--accent);">
                  ${course.gems ? `💎+${course.gems} ` : ""}${course.tk ? `🎟️+${course.tk} ` : ""}${course.gifts ? `💐+${course.gifts} ` : ""}${course.crests ? `💠+${course.crests}` : ""}
                </div>
              </div>
              ${finished
                ? `<button class="btn-xs btn-accent2" style="padding:8px 9px;" onclick="rhClaimDispatch(${idx})">🎁 帰還受取</button>`
                : `<button class="btn-xs" style="padding:6px 7px;" onclick="rhBoostDispatch(${idx})">⚡-2h<br><small>(EN30)</small></button>`}
            </div>
          `;
        }).join("")}
      `;
    }
  }

  // ===== TAB 3: 週替わり戦術チャレンジ =====
  else {
    const list = rhGetWeeklyChallengeList();
    const wk = state.weeklyChallenges;
    const doneCnt = list.filter(c => Number(wk.progress[c.id] || 0) >= c.target).length;
    const compReady = doneCnt >= list.length && !wk.compClaimed;

    contentHtml = `
      <div style="background:var(--surface-sub); border:1.5px solid #f3cf00; border-radius:10px; padding:8px; margin-bottom:8px; text-align:left;">
        <div class="top-row" style="margin-bottom:4px;">
          <strong style="font-size:11.5px;">👑 週間コンプリート報酬（${doneCnt} / ${list.length}）</strong>
          <span class="tag">${wk.weekKey}</span>
        </div>
        <div style="font-size:10.5px; font-weight:900; color:var(--accent); margin-bottom:5px;">
          全5お題達成：💎+500 ／ 🎟️パック券+5 ／ 💠クレスト+15
        </div>
        <button class="${compReady ? "btn-accent2" : "btn-xs"}" style="width:100%; padding:7px;" ${compReady ? "" : "disabled"} onclick="rhClaimWeeklyComplete()">
          ${wk.compClaimed ? "✓ 今週のコンプリート報酬を受取済" : (compReady ? "🎁 コンプリート報酬を受け取る！" : "※毎週月曜0時に新しいお題へ更新")}
        </button>
      </div>

      <div class="rh-scroll-list">
        ${list.map(c => {
          const cur = Math.min(c.target, Number(wk.progress[c.id] || 0));
          const claimed = wk.claimed.includes(c.id);
          const ready = !claimed && cur >= c.target;
          return `
            <div class="rh-item-card ${ready ? "ready" : ""} ${claimed ? "done" : ""}">
              <div style="flex:1; min-width:0; text-align:left;">
                <div class="top-row" style="margin-bottom:2px;">
                  <strong style="font-size:11.5px;"><span class="tag" style="font-size:9px;">${c.rank}</span> ${rhEsc(c.title)}</strong>
                  <span style="font-size:10px; font-weight:900;">${cur}/${c.target}</span>
                </div>
                <div style="font-size:10px; color:var(--muted); line-height:1.35;">${rhEsc(c.desc)}</div>
                <div style="font-size:10px; font-weight:900; color:var(--accent); margin-top:3px;">
                  💎+${c.gems} ｜ 🎟️+${c.tk}${c.cr ? ` ｜ 💠クレスト+${c.cr}` : ""}
                </div>
              </div>
              <button class="btn-xs ${ready ? "btn-accent2" : ""}" style="flex-shrink:0; padding:7px 8px;" ${ready ? "" : "disabled"} onclick="rhClaimWeekly('${c.id}')">
                ${claimed ? "✓済" : (ready ? "🎁受取" : "未達成")}
              </button>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  modal.innerHTML = `
    <div class="modal-box" onclick="event.stopPropagation()" style="max-height:86dvh; display:flex; flex-direction:column;">
      <div class="top-row" style="margin-bottom:7px;">
        <strong style="font-size:14.5px;">🏅 戦術報酬ハブ</strong>
        <button class="btn-xs" onclick="rhCloseHubModal()">閉じる ✕</button>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:4px; margin-bottom:8px;">
        <button class="btn-xs ${rhActiveTab === "ach" ? "btn-primary" : ""}" style="padding:7px 2px; font-size:10px;" onclick="rhActiveTab='ach'; playSfx('tap'); rhRenderModal();">
          🏆 実績${badges.ach ? ` (${badges.ach})` : ""}
        </button>
        <button class="btn-xs ${rhActiveTab === "dispatch" ? "btn-primary" : ""}" style="padding:7px 2px; font-size:10px;" onclick="rhActiveTab='dispatch'; rhDispatchDraft.slotIdx=-1; playSfx('tap'); rhRenderModal();">
          🚁 派遣${badges.disp ? ` (${badges.disp})` : ""}
        </button>
        <button class="btn-xs ${rhActiveTab === "weekly" ? "btn-primary" : ""}" style="padding:7px 2px; font-size:10px;" onclick="rhActiveTab='weekly'; playSfx('tap'); rhRenderModal();">
          🎯 週次${badges.weekly ? ` (${badges.weekly})` : ""}
        </button>
      </div>
      <div style="flex:1; min-height:0; overflow-y:auto;">${contentHtml}</div>
    </div>
  `;
}

// ホーム画面・討伐画面・任務画面に1タップ入口バーを自動配置
function rhRenderEntryBanners() {
  if (typeof state === "undefined" || !state) return;
  rhEnsureState();
  const b = rhCountBadges();
  const targets = [
    { viewId: "view-home",     barId: "rh-entry-home" },
    { viewId: "view-battle",   barId: "rh-entry-battle" },
    { viewId: "view-missions", barId: "rh-entry-missions" }
  ];

  targets.forEach(({ viewId, barId }) => {
    const view = document.getElementById(viewId);
    if (!view) return;
    let bar = document.getElementById(barId);
    if (!bar) {
      bar = document.createElement("div");
      bar.id = barId;
      bar.className = "rh-entry-bar";
      if (viewId === "view-battle") {
        const sel = document.getElementById("btl-select-panel");
        if (sel) sel.prepend(bar);
        else view.prepend(bar);
      } else {
        const firstCard = view.querySelector(".card");
        if (firstCard && firstCard.parentNode === view) view.insertBefore(bar, firstCard);
        else view.prepend(bar);
      }
    }
    bar.innerHTML = `
      <button class="rh-entry-btn ${b.ach ? "hot" : ""}" onclick="rhOpenHubModal('ach')">
        🏆 実績${b.ach ? `<span class="rh-dot">${b.ach}</span>` : ""}
      </button>
      <button class="rh-entry-btn ${b.disp ? "hot" : ""}" onclick="rhOpenHubModal('dispatch')">
        🚁 派遣${b.disp ? `<span class="rh-dot">${b.disp}</span>` : ""}
      </button>
      <button class="rh-entry-btn ${b.weekly ? "hot" : ""}" onclick="rhOpenHubModal('weekly')">
        🎯 週次挑戦${b.weekly ? `<span class="rh-dot">${b.weekly}</span>` : ""}
      </button>
    `;
  });
}

window.MF_REWARD_HUB = {
  onBattleWin: rhOnBattleWin,
  openHub: rhOpenHubModal,
  renderEntryBanners: rhRenderEntryBanners
};
window.rhOpenHubModal = rhOpenHubModal;
window.rhCloseHubModal = rhCloseHubModal;
window.rhClaimAchievement = rhClaimAchievement;
window.rhClaimAllAchievements = rhClaimAllAchievements;
window.rhOpenDispatchSetup = rhOpenDispatchSetup;
window.rhToggleDispatchChar = rhToggleDispatchChar;
window.rhStartDispatch = rhStartDispatch;
window.rhBoostDispatch = rhBoostDispatch;
window.rhClaimDispatch = rhClaimDispatch;
window.rhClaimWeekly = rhClaimWeekly;
window.rhClaimWeeklyComplete = rhClaimWeeklyComplete;
window.rhRenderModal = rhRenderModal;

(function installRewardHubHooks() {
  if (typeof window.switchView === "function" && !window.switchView._rhHooked) {
    const orig = window.switchView;
    window.switchView = function() {
      const r = orig.apply(this, arguments);
      setTimeout(() => rhRenderEntryBanners(), 40);
      return r;
    };
    window.switchView._rhHooked = true;
  }
  const boot = () => setTimeout(() => rhRenderEntryBanners(), 200);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
