// 👑 限定ピックアップSSRの戦力補正
(function hookLimitedPowerBoost() {
  if (typeof window.calcCharPower === "function" && !window.calcCharPower._mfBoosted) {
    const origCalc = window.calcCharPower;
    const wrapped = function(charId) {
      const base = origCalc(charId);
      const ch = window.MF_DATA?.CHARACTERS?.[charId];
      if (!ch) return base;
      if (ch.limited) return Math.round(base * 1.38) + 50;
      if (ch.rarity === "SSR") return Math.round(base * 1.12) + 15;
      if (ch.rarity === "SR") return Math.round(base * 1.05);
      return base;
    };
    wrapped._mfBoosted = true;
    window.calcCharPower = wrapped;
  }
})();

let btl = null;
let battleAutoMode = false;
let battleSpeed = 1;
let prevThemeBeforeBattle = "camp";
let btlUidSeq = 1;
let currentHuntTier = 0;

// 5段階難易度（通常 → 強敵 → 極限 → 災厄 → 終焉）
const HUNT_TIERS = [
  { id: 0, label: "⚔️ 通常",        short: "通常", lvAdd: 0,  lvCap: 50, lvFloor: 0,  hpMult: 1.0,  atkMult: 1.0,  rwMult: 1.0, extraTk: 0, firstGems: 120,  firstTk: 1,  firstCrest: 0  },
  { id: 1, label: "🔥 ★強敵",       short: "強敵", lvAdd: 15, lvCap: 62, lvFloor: 0,  hpMult: 1.38, atkMult: 1.22, rwMult: 2.2, extraTk: 1, firstGems: 240,  firstTk: 2,  firstCrest: 0  },
  { id: 2, label: "💀 ★★極限",      short: "極限", lvAdd: 28, lvCap: 72, lvFloor: 0,  hpMult: 1.88, atkMult: 1.45, rwMult: 3.6, extraTk: 2, firstGems: 400,  firstTk: 4,  firstCrest: 0  },
  { id: 3, label: "🩸 ★★★災厄",     short: "災厄", lvAdd: 42, lvCap: 78, lvFloor: 58, hpMult: 2.65, atkMult: 1.76, rwMult: 5.5, extraTk: 3, firstGems: 640,  firstTk: 6,  firstCrest: 10 },
  { id: 4, label: "👑 ★★★★終焉",    short: "終焉", lvAdd: 54, lvCap: 82, lvFloor: 76, hpMult: 3.75, atkMult: 2.12, rwMult: 8.0, extraTk: 5, firstGems: 1000, firstTk: 10, firstCrest: 25 }
];

function getStepDelay(baseMs) { return battleSpeed === 2 ? Math.round(baseMs * 0.5) : baseMs; }

function toggleBattleSpeed() {
  battleSpeed = battleSpeed === 1 ? 2 : 1;
  playSfx("tap");
  const btn = document.getElementById("btn-btl-speed");
  if (btn) btn.textContent = battleSpeed === 1 ? "🐢 じっくり" : "⚡ 倍速";
  showToast(battleSpeed === 1 ? "🐢 演出をじっくり見る速度にしました" : "⚡ 倍速モードにしました");
}

function getCraftAtkMultiplier(extraPct = 0) {
  let bonus = extraPct || 0;
  const wp = state.craftedWeapons || [];
  if (wp.includes("wp_behemoth")) bonus += 12;
  if (wp.includes("wp_wyvern")) bonus += 18;
  if (wp.includes("wp_radiant")) bonus += 28;
  if (state.camp?.activeBuff?.atkBonus) bonus += state.camp.activeBuff.atkBonus;
  return 1 + bonus / 100;
}

function getEnemyBaseLevel(en) {
  if (!en) return 5;
  const list = window.MF_DATA?.ENEMIES || [];
  const idx = list.findIndex(x => x.id === en.id);
  if (idx === 0) return 3;
  if (idx === 1) return 7;
  if (en.isRadiant) return Math.max(42, Math.round((en.recPower || 2100) / 48));
  if ((en.parts || []).length >= 2) return Math.max(22, Math.round((en.recPower || 1200) / 50));
  return Math.max(10, Math.round((en.recPower || 550) / 52));
}

function getTierReqLevel(en, tier) {
  const base = getEnemyBaseLevel(en);
  const raw = Math.max(tier.lvFloor || 0, base + (tier.lvAdd || 0));
  return Math.min(tier.lvCap || 82, raw);
}

function getCurrentPartyAvgLv() {
  if (typeof getPartyAvgLevel === "function") return getPartyAvgLevel();
  const ids = state?.party || [];
  if (!ids.length) return 1;
  return Math.round(ids.reduce((s, id) => s + (state.charLevels?.[id] || 1), 0) / ids.length);
}

function getBattleClearKey(enemyId, opts) {
  if (opts?.questTitle) return `${enemyId}::${opts.questTitle}`;
  if (opts?.huntTier > 0) return `${enemyId}::tier_${opts.huntTier}`;
  return `${enemyId}::base`;
}

function isBattleAutoUnlocked(enemyId, opts) {
  if (opts?.isRaid) return false;
  if (opts?.questTitle && opts.questTitle.includes("模擬戦")) return false;
  const key = getBattleClearKey(enemyId, opts);
  const clearedKeys = state?.clearedBattleKeys || [];
  if (clearedKeys.includes(key)) return true;
  if (!opts?.questTitle && !(opts?.huntTier > 0)) {
    const kills = typeof getHuntEntry === "function" ? (getHuntEntry(enemyId)?.kills || 0) : 0;
    if (kills > 0) return true;
  }
  return false;
}

function markBattleClearedForAuto(enemyId, opts) {
  if (!state) return;
  state.clearedBattleKeys = state.clearedBattleKeys || [];
  const key = getBattleClearKey(enemyId, opts);
  if (!state.clearedBattleKeys.includes(key)) state.clearedBattleKeys.push(key);
}

function isTierFirstCleared(enemyId, tierId) {
  return !!(state?.huntFirstClears?.[`${enemyId}_t${tierId}`]);
}

function setHuntTier(tierId) {
  currentHuntTier = tierId;
  playSfx("tap");
  renderBattleView();
}

function startTieredHunt(enemyId) {
  const tier = HUNT_TIERS[currentHuntTier] || HUNT_TIERS[0];
  startBattle(enemyId, {
    isTieredHunt: true,
    huntTier: tier.id,
    hpMult: tier.hpMult,
    atkMult: tier.atkMult,
    rwMult: tier.rwMult,
    extraTickets: tier.extraTk,
    lvAdd: tier.lvAdd,
    lvCap: tier.lvCap,
    lvFloor: tier.lvFloor,
    questTitle: tier.id > 0 ? `【${tier.label}】` : ""
  });
}

function toggleBattleAuto() {
  if (!btl) return;
  if (!btl.canAuto) {
    playSfx("tap");
    showToast("🔒 AUTOはこの敵・難易度を1度手動で撃破すると解放されます");
    return;
  }
  battleAutoMode = !battleAutoMode;
  playSfx("switch");
  if (battleAutoMode) btl.usedAuto = true;
  updateAutoButtonUI();
  showToast(battleAutoMode ? "🤖 AUTO ON（※一部ボーナス・チャレンジ対象外）" : "🎮 手動モード");
  if (battleAutoMode && !btl.resolving && !btl.finished) setTimeout(() => runAutoTurn(), getStepDelay(700));
}

function updateAutoButtonUI() {
  const btn = document.getElementById("btn-btl-auto");
  if (!btn) return;
  if (btl && !btl.canAuto) {
    btn.textContent = "🔒 AUTO";
    btn.className = "btn-xs";
    btn.style.opacity = "0.55";
    return;
  }
  btn.style.opacity = "1";
  btn.textContent = battleAutoMode ? "🤖 AUTO中" : "🎮 手動";
  btn.className = battleAutoMode ? "btn-xs btn-accent2" : "btn-xs btn-primary";
}

function renderBattleView() {
  renderTopBar();
  const listEl = document.getElementById("btl-enemy-list");
  if (!listEl) return;
  const avgLv = getCurrentPartyAvgLv();
  const allEnemies = window.MF_DATA.ENEMIES || [];
  const unlocked = allEnemies.filter(en => (typeof getHuntEntry === "function" ? getHuntEntry(en.id).kills : 0) > 0);

  if (unlocked.length === 0) {
    listEl.innerHTML = `
      <div class="card" style="text-align:center; padding:22px 12px; background:var(--surface-sub);">
        <div style="font-size:44px; margin-bottom:6px;">📖</div>
        <strong style="font-size:14px;">まだ調査済みの霧獣がいません</strong>
        <p style="font-size:11.5px; color:var(--muted); margin:6px 0 12px; line-height:1.5;">
          物語や開拓マップで倒した霧獣だけが、ここに討伐ターゲットとして追加されます！<br>まずは上の「📘 育成クエスト」や「📖 物語」へ出撃しよう！
        </p>
        <button class="btn-accent2" style="width:100%;" onclick="switchView('story')">📖 物語を進めて霧獣に挑む ▶</button>
      </div>
    `;
    return;
  }

  const tier = HUNT_TIERS[currentHuntTier] || HUNT_TIERS[0];
  const pioneer = window.MF_PIONEER?.getBattleBonuses ? window.MF_PIONEER.getBattleBonuses() : { statBonusPct: 0, creditMult: 1 };
  const remainFirstCnt = unlocked.filter(en => !isTierFirstCleared(en.id, tier.id)).length;

  const tierBar = `
    <div class="btl-tier-grid-top">
      ${HUNT_TIERS.slice(0, 3).map(t => `
        <button class="btn-xs ${t.id === currentHuntTier ? "btn-accent2" : ""}" style="font-size:10px; padding:6px 2px;" onclick="setHuntTier(${t.id})">${t.label}</button>
      `).join("")}
    </div>
    <div class="btl-tier-grid-end">
      ${HUNT_TIERS.slice(3).map(t => `
        <button class="btn-xs btl-tier-endbtn ${t.id === currentHuntTier ? "selected" : ""}" onclick="setHuntTier(${t.id})">
          ${t.label} <span style="font-size:9px; opacity:0.9;">(初回💎+${t.firstGems})</span>
        </button>
      `).join("")}
    </div>
    <div style="font-size:10.5px; font-weight:900; color:var(--muted); margin:6px 0 8px;">
      小隊平均Lv.<strong>${avgLv}</strong> ｜ ${tier.label} 未制覇：<strong>${remainFirstCnt}/${unlocked.length}体</strong> ｜ 開拓バフ <strong>+${pioneer.statBonusPct}%</strong>
    </div>
  `;

  listEl.innerHTML = tierBar + unlocked.map(en => {
    const log = typeof getHuntEntry === "function" ? getHuntEntry(en.id) : { kills: 0 };
    const reqLv = getTierReqLevel(en, tier);
    const diff = reqLv - avgLv;
    const warn = diff >= 5
      ? `<span style="color:#ff4d5a;">☠️ 危険（適正Lv.${reqLv}）</span>`
      : (diff > 0 ? `<span style="color:#ff9f1c;">⚠️ 強敵（適正Lv.${reqLv}）</span>` : `<span style="color:#18b88a;">✅ 適正Lv.${reqLv}</span>`);
    const partsLabel = en.parts.length ? `💥 部位：${en.parts.map(p => p.name).join("・")}` : "通常・精鋭ターゲット";
    const clearedFirst = isTierFirstCleared(en.id, tier.id);
    const firstBadge = clearedFirst
      ? `<span class="tag" style="background:#18b88a; color:#fff; font-size:9px;">✓${tier.short}制覇</span>`
      : `<span class="tag" style="background:#f3cf00; color:#111; font-size:9px;">🎁初回 💎+${tier.firstGems} / 🎟️+${tier.firstTk}${tier.firstCrest ? ` / 💠+${tier.firstCrest}` : ""}</span>`;
    const borderCls = tier.id === 4 ? "border-color:#ff4d5a;" : (tier.id === 3 || en.isRadiant ? "border-color:#f3cf00;" : "");
    const thumb = window.MF_SPRITES.enemyHTML ? window.MF_SPRITES.enemyHTML(en, "thumb") : "";
    const estCredits = Math.round((en.rewards.credits || 1000) * tier.rwMult * pioneer.creditMult);
    const estTk = (en.rewards.tickets || 1) + tier.extraTk;

    return `
      <div class="card" style="padding:10px; margin-bottom:8px; ${borderCls}">
        <div style="display:flex; gap:9px; align-items:center;">
          ${thumb}
          <div style="flex:1; min-width:0;">
            <div class="top-row"><strong style="font-size:12.5px;">${escapeHtml(en.name)}</strong><span class="rank-pill">${en.rank}</span></div>
            <div style="display:flex; gap:4px; align-items:center; flex-wrap:wrap; margin:3px 0;">
              <span class="tag">討伐 ${log.kills}</span>
              <span style="font-size:10px; font-weight:900;">${warn}</span>
            </div>
            <div style="margin:2px 0;">${firstBadge}</div>
            <div style="font-size:10px; color:var(--muted);">${partsLabel}</div>
          </div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
          <span style="font-size:10px; font-weight:800;">通常枠：🪙+${estCredits.toLocaleString()} / 🎟️+${estTk} / 💎+${Math.round(en.rewards.gems * (1 + tier.id * 0.45))}</span>
          <button class="btn-xs btn-accent2" onclick="startTieredHunt('${en.id}')">🃏 出撃</button>
        </div>
      </div>
    `;
  }).join("");

  if (window.MF_REWARD_HUB?.renderEntryBanners) window.MF_REWARD_HUB.renderEntryBanners();
}

function shuffleCards(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function pickNextEnemyIntent(turn, prevType, enemy, enraged, tierId = 0) {
  const mult = (enraged ? 1.38 : 1.0) * (tierId >= 4 ? 1.12 : 1.0);
  if (prevType === "charge") {
    return {
      type: "heavy", icon: "☄️", threat: "極大脅威",
      name: tierId >= 4 ? "【終焉】絶滅ミアズマ崩壊" : (enraged ? "【怒り】極・ミアズマ崩壊" : "ミアズマ大崩壊"),
      dmg: Math.round(enemy.atk * (tierId >= 3 ? 2.55 : 2.35) * mult),
      hint: "壊滅的な一撃が迫る！防壁・カウンター・凍結で備えろ！"
    };
  }
  const r = Math.random();
  const chargeRate = tierId >= 3 ? (enraged ? 0.42 : 0.34) : (enraged ? 0.36 : 0.26);
  if (turn >= 2 && r < chargeRate) {
    return {
      type: "charge", icon: "⚡", threat: "エネルギー収束",
      name: "必殺チャージ中", dmg: 0,
      hint: "凄まじい瘴気が集中している……【崩し】で阻止しろ！"
    };
  }
  if (r < 0.58) {
    return {
      type: "guard", icon: "🛡️", threat: "堅牢態勢",
      name: "装甲硬化・反撃構え", dmg: Math.round(enemy.atk * 0.95 * mult),
      hint: "外殻が硬化している！【崩し】カードで装甲を砕け！"
    };
  }
  if (r < 0.85) {
    return {
      type: "heavy", icon: "💢", threat: "強襲警戒",
      name: "猛襲叩きつけ", dmg: Math.round(enemy.atk * 1.65 * mult),
      hint: "重い一撃の気配！【防御】や【カウンター】で迎え撃て！"
    };
  }
  return {
    type: "attack", icon: "⚔️", threat: "攻撃予兆",
    name: "霧獣の連撃", dmg: Math.round(enemy.atk * mult),
    hint: "敵が前線へ踏み込んでくる。元素連携で押し切れ！"
  };
}

function applyLimitedAndPioneerOpeningPassives() {
  if (!btl) return;
  const p = state.party || [];
  const logs = [];
  const pb = btl.pioneer || {};

  if (pb.statBonusPct > 0) {
    if (pb.startEx > 0) btl.exGauge = Math.min(95, btl.exGauge + pb.startEx);
    if (pb.startShieldRatio > 0) btl.shield += Math.round(btl.teamMaxHp * pb.startShieldRatio);
    if (pb.startApBonus > 0) btl.ap = Math.min(8, btl.ap + pb.startApBonus);
    logs.push("🗺️ 開拓本部の前線支援が展開された！");
  }

  if (p.includes("mikoto")) { btl.shield += Math.round(btl.teamMaxHp * 0.22); btl.attachedElement = "ice"; logs.push("👑 ミコトの氷華が戦場を包み込む！"); }
  if (p.includes("celestia")) { btl.shredTurns = Math.max(btl.shredTurns, 3); btl.exGauge = Math.min(95, btl.exGauge + 25); logs.push("👑 セレスティアが敵の急所をロックオン！"); }
  if (p.includes("sylphy")) { btl.ap = Math.min(8, btl.ap + 2); drawCards(1); logs.push("👑 シルフィが疾風のように先手を取る！"); }
  if (p.includes("lily")) { btl.shield += Math.round(btl.teamMaxHp * 0.32); logs.push("👑 リリィの純白の聖壁が展開された！"); }
  if (p.includes("marina")) { if (!btl.attachedElement) btl.attachedElement = "water"; logs.push("👑 マリナが水流弾で敵を捕捉した！"); }
  if (p.includes("iris")) { btl.nextAtkMult = Math.max(btl.nextAtkMult, 1.35); logs.push("👑 イリスが紅蓮の闘気を纏う！"); }
  if (p.includes("serina")) { btl.exGauge = Math.min(95, btl.exGauge + 12); logs.push("👑 セリーナの旋律が小隊を鼓舞する！"); }
  if (logs.length > 0) {
    logs.reverse().forEach(l => pushBattleLog(l));
    setTimeout(() => spawnBattleFloat("✨ 先制陣形展開", "#ffd000"), 250);
  }
}

function startBattle(enemyId, opts = null) {
  const baseTemplate = (window.MF_DATA.ENEMIES || []).find(e => e.id === enemyId);
  if (!baseTemplate) return;

  const isRaid = !!opts?.isRaid;
  const isTutorialSim = !!(opts?.questTitle && opts.questTitle.includes("模擬戦"));
  const tierId = Number(opts?.huntTier || 0);
  const hpMult = opts?.hpMult || 1.0;
  const atkMultEn = opts?.atkMult || 1.0;
  const isBoss = isRaid || baseTemplate.isRadiant || baseTemplate.parts.length >= 2 || hpMult >= 1.8 || tierId >= 3;

  const avgLv = getCurrentPartyAvgLv();
  const strictMinLv = opts?.minReqLv || 0;
  let enemyTargetLv = 1;
  if (!isTutorialSim) {
    if (strictMinLv > 0) enemyTargetLv = strictMinLv;
    else {
      const rawLv = Math.max(opts?.lvFloor || 0, getEnemyBaseLevel(baseTemplate) + (opts?.lvAdd || 0));
      enemyTargetLv = Math.min(opts?.lvCap || 82, rawLv);
    }
  }
  const lvGap = strictMinLv > 0 ? Math.max(0, strictMinLv - avgLv) : 0;
  const softLvDiff = isTutorialSim || isRaid ? 0 : (enemyTargetLv - avgLv);

  const L = enemyTargetLv;
  const roleHpMult = baseTemplate.isRadiant ? 2.35 : (isBoss ? 1.85 : 1.0);
  const roleAtkMult = baseTemplate.isRadiant ? 1.55 : (isBoss ? 1.32 : 1.0);
  const calcMaxHp = isTutorialSim
    ? 950
    : Math.max(
        Math.round(baseTemplate.maxHp * 2.6 * hpMult),
        Math.round((1350 + L * 560 + L * L * 9) * roleHpMult * hpMult)
      );
  const calcAtk = isTutorialSim
    ? 140
    : Math.max(
        Math.round(baseTemplate.atk * 2.0 * atkMultEn),
        Math.round((290 + L * 66 + L * L * 0.72) * roleAtkMult * atkMultEn)
      );

  const stagScale = tierId >= 4 ? 3.1 : (tierId >= 3 ? 2.65 : (isBoss ? 2.2 : 1.65));
  const scaledMaxStagger = Math.round(baseTemplate.maxStagger * stagScale * Math.sqrt(Math.min(2.5, hpMult)));

  const template = {
    ...baseTemplate,
    name: opts?.questTitle ? `${baseTemplate.name}${opts.questTitle.startsWith("【") ? opts.questTitle : `（${opts.questTitle.replace(/.*【/, "【")}）`}` : baseTemplate.name,
    maxHp: isRaid ? 999999 : calcMaxHp,
    atk: isRaid ? Math.round(calcAtk * 0.78) : calcAtk,
    maxStagger: scaledMaxStagger
  };

  prevThemeBeforeBattle = state.uiTheme;
  document.body.classList.add("theme-tactical");
  battleAutoMode = false;

  if (window.MF_AUDIO) window.MF_AUDIO.playBgm(isBoss ? "boss" : "battle");
  playSfx(isBoss ? "roar" : "switch");

  const pioneer = window.MF_PIONEER?.getBattleBonuses
    ? window.MF_PIONEER.getBattleBonuses()
    : { statBonusPct: 0, statMult: 1, creditMult: 1, startEx: 0, startShieldRatio: 0, startApBonus: 0, partDmgMult: 1 };

  const atkMult = getCraftAtkMultiplier(opts?.extraAtkBuff || 0) * pioneer.statMult;
  const hasSpotter = state.party.some(id => id === "mint" || id === "scanner" || id === "marina");

  const members = state.party.map(id => {
    const ch = getCharProfile(id);
    const power = calcCharPower(id);
    const lv = state.charLevels?.[id] || 1;
    const def = Math.round((power * 0.22 + lv * 2.2) * pioneer.statMult);
    return {
      id, name: ch.name, emoji: ch.emoji, element: ch.element, limited: !!ch.limited,
      atk: Math.round(power * 0.82 * atkMult),
      maxHp: Math.round(power * 3.4 * pioneer.statMult),
      def
    };
  });

  const totalMaxHp = members.reduce((s, m) => s + m.maxHp, 0);
  const teamDef = Math.round(members.reduce((s, m) => s + m.def, 0) / Math.max(1, members.length));
  const parts = isRaid ? [] : template.parts.map(p => ({
    ...p, hp: Math.round(template.maxHp * p.hpRatio), maxHp: Math.round(template.maxHp * p.hpRatio), broken: false, spotted: hasSpotter
  }));

  const rawDeck = window.MF_CARDS.buildActiveDeck().map(c => ({ ...c, uid: btlUidSeq++ }));
  const canAuto = isBattleAutoUnlocked(baseTemplate.id, opts);

  let introMsg = `⚔️ ${template.name} が立ちはだかった！`;
  if (isRaid) introMsg = "☄️ 極限レイド開始！5ターン以内に全力でダメージを刻め！";
  else if (tierId >= 4) introMsg = "👑 【終焉領域】圧倒的絶望が眼前に顕現した……全戦力を解放せよ！";
  else if (tierId >= 3) introMsg = "🩸 【災厄級】凄まじい瘴気が空間を歪めている！";
  else if (lvGap > 0 || softLvDiff >= 5) introMsg = "☠️ 圧倒的な瘴気を感じる……適正レベルに届いていない！";

  btl = {
    ctx: opts, enemy: template, rawEnemy: baseTemplate, isBoss, isRaid, canAuto, tierId,
    pioneer,
    raidMaxTurns: opts?.raidMaxTurns || 5,
    totalDamageDealt: 0,
    enraged: false, avgLv, minReqLv: strictMinLv, enemyTargetLv, lvGap, softLvDiff,
    hp: template.maxHp, maxHp: template.maxHp,
    stagger: 0, maxStagger: template.maxStagger, baseMaxStagger: template.maxStagger, breakCount: 0,
    stunned: false,
    attachedElement: null, shredTurns: 0, electroTurns: 0,
    parts, targetPartIdx: parts.length > 0 ? 0 : -1,
    members, teamHp: totalMaxHp, teamMaxHp: totalMaxHp, teamDef,
    shield: 0, counterMult: 0, nextAtkMult: 1.0, exGauge: 0,
    ap: 4, maxAp: 4, turn: 1,
    drawPile: shuffleCards(rawDeck), discardPile: [], hand: [], queue: [],
    intent: pickNextEnemyIntent(1, null, template, false, tierId),
    log: [introMsg],
    // 実績・週替わりチャレンジ用トラッキング
    stats: { reactions: 0, chains3: 0, partBreaks: 0, usedElements: [] },
    resolving: false, usedAuto: false, finished: false
  };

  const stageVisual = document.getElementById("btl-stage-emoji");
  if (stageVisual) {
    stageVisual.className = "stage-enemy-wrap";
    stageVisual.innerHTML = window.MF_SPRITES.enemyHTML ? window.MF_SPRITES.enemyHTML(baseTemplate, "stage") : baseTemplate.emoji;
  }

  drawCards(5);
  applyLimitedAndPioneerOpeningPassives();

  document.getElementById("modal-battle-result").classList.remove("active");
  document.getElementById("btl-select-panel").style.display = "none";
  document.getElementById("btl-arena-panel").style.display = "block";
  updateAutoButtonUI();
  renderBattleHUD();
}

function exitBattleArena(didWin = false) {
  const ctx = btl?.ctx || null;
  battleAutoMode = false;
  btl = null;
  document.getElementById("modal-battle-result").classList.remove("active");
  document.body.classList.toggle("theme-tactical", prevThemeBeforeBattle === "tactical");
  document.getElementById("btl-arena-panel").style.display = "none";
  document.getElementById("btl-select-panel").style.display = "block";

  if (didWin && typeof ctx?.onWin === "function") ctx.onWin();
  if (ctx?.returnView === "battle") {
    if (window.MF_AUDIO) window.MF_AUDIO.playBgm("home");
    if (typeof setBattleSubTab === "function") setBattleSubTab(currentBattleSubTab || "hunt");
  } else if (ctx?.returnView) {
    switchView(ctx.returnView);
  } else {
    if (window.MF_AUDIO) window.MF_AUDIO.playBgm("home");
    renderBattleView();
  }
}

function openBattleCardDetail(uid) {
  if (!btl) return;
  const card = btl.hand.find(c => c.uid === uid) || btl.queue.find(c => c.uid === uid);
  if (card) openCardDetailModal(card);
}

function triggerBattleFx(color = "#ffd000", icon = "💥") {
  const layer = document.getElementById("btl-fx-layer");
  if (!layer) return;
  const flash = document.createElement("div");
  flash.className = "fx-flash";
  flash.style.background = `radial-gradient(circle, ${color}88 0%, transparent 72%)`;
  const ring = document.createElement("div");
  ring.className = "fx-ring"; ring.style.borderColor = color; ring.textContent = icon;
  layer.appendChild(flash); layer.appendChild(ring);
  setTimeout(() => { flash.remove(); ring.remove(); }, 850);
}

function showBattleCutin(charId, titleText, subText, accentColor) {
  const box = document.getElementById("btl-cutin");
  if (!box) return;
  const ch = getCharProfile(charId || state.party[0]);
  document.getElementById("cutin-portrait").innerHTML = window.MF_SPRITES.portraitHTML(ch, "cutin");
  document.getElementById("cutin-title").textContent = titleText;
  document.getElementById("cutin-sub").textContent = subText || ch.voiceLines?.[0] || "";
  box.style.borderColor = accentColor || "#ffd000";
  box.style.boxShadow = `0 0 36px ${accentColor || "#ffd000"}aa, 0 12px 32px rgba(0,0,0,0.85)`;
  box.classList.remove("show"); void box.offsetWidth; box.classList.add("show");
  clearTimeout(box._t);
  box._t = setTimeout(() => box.classList.remove("show"), getStepDelay(1500));
}

function spawnBattleFloat(text, color = "#ffd000") {
  const layer = document.getElementById("btl-float-layer");
  if (!layer) return;
  const el = document.createElement("div");
  el.className = "dmg-float"; el.style.color = color;
  el.style.left = `${30 + Math.random() * 40}%`;
  el.textContent = text; layer.appendChild(el);
  setTimeout(() => el.remove(), 1350);
}

function shakeBattleStage() {
  const stage = document.getElementById("btl-stage");
  if (!stage) return;
  stage.classList.remove("shake"); void stage.offsetWidth; stage.classList.add("shake");
}

function drawCards(count) {
  for (let i = 0; i < count; i++) {
    if (btl.hand.length >= 7) break;
    if (btl.drawPile.length === 0) {
      if (btl.discardPile.length === 0) break;
      btl.drawPile = shuffleCards(btl.discardPile);
      btl.discardPile = [];
    }
    btl.hand.push(btl.drawPile.pop());
  }
}

function selectHandCard(uid) {
  if (!btl || btl.resolving || btl.finished) return;
  if (btl.queue.length >= 3) { showToast("プレイマットに出せるのは最大3枚までです！"); return; }
  const idx = btl.hand.findIndex(c => c.uid === uid);
  if (idx < 0) return;
  const card = btl.hand[idx];
  if (btl.ap < card.cost) { showToast(`AP不足（必要 AP${card.cost}）`); return; }
  btl.ap -= card.cost; btl.hand.splice(idx, 1); btl.queue.push(card);
  playSfx("switch"); renderBattleHUD();
}

function removeQueueCard(qIdx) {
  if (!btl || btl.resolving || btl.finished) return;
  const card = btl.queue.splice(qIdx, 1)[0];
  if (!card) return;
  btl.ap += card.cost; btl.hand.push(card);
  playSfx("tap"); renderBattleHUD();
}

function clearQueueCards() {
  if (!btl || btl.resolving || btl.finished) return;
  while (btl.queue.length > 0) removeQueueCard(0);
}

function buildQueuePreviewText() {
  if (!btl || btl.queue.length === 0) return "👆 手札を上にスワイプ または タップで配置";
  const notes = [];
  let simEl = btl.attachedElement;
  btl.queue.forEach(c => {
    if ((c.type === "break" || c.type === "ult") && (btl.intent.type === "guard" || btl.intent.type === "charge")) notes.push("💥 装甲・チャージ破壊");
    if (c.counterMult && (btl.intent.type === "attack" || btl.intent.type === "heavy")) notes.push("🪞 カウンター待機");
    if (c.type === "attack" || c.type === "break" || c.type === "ult") {
      if (simEl && simEl !== c.element) { notes.push(`✨ ${getReactionName(simEl, c.element)}`); simEl = null; }
      else simEl = c.element;
    }
  });
  if (btl.queue.length === 3) notes.push("🔥 3連チェイン");
  return [...new Set(notes)].join(" / ") || "準備完了！「チェイン発動」をタップ";
}

function getReactionName(elA, elB) {
  const p = [elA, elB];
  if (p.includes("arc")) return "結晶化";
  if (p.includes("fire") && p.includes("water")) return "蒸発";
  if (p.includes("fire") && p.includes("ice")) return "融解";
  if (p.includes("fire") && p.includes("volt")) return "過負荷";
  if (p.includes("water") && p.includes("volt")) return "感電";
  if (p.includes("water") && p.includes("ice")) return "凍結";
  if (p.includes("volt") && p.includes("ice")) return "超電導";
  if (p.includes("wind")) return "元素拡散";
  return "元素共鳴";
}

function pushBattleLog(msg) { btl.log.unshift(msg); if (btl.log.length > 4) btl.log.pop(); }

function executeTurnQueue() {
  if (!btl || btl.resolving || btl.finished) return;
  if (btl.queue.length === 0 && !confirm("カードを1枚も出さずにターン終了しますか？")) return;

  btl.resolving = true; btl.counterMult = 0;
  const cardsToRun = [...btl.queue];
  btl.queue = [];
  const hasFullChain = cardsToRun.length === 3;
  if (hasFullChain && btl.stats) btl.stats.chains3 += 1;
  renderBattleHUD();

  let step = 0;
  const runNext = () => {
    if (!btl || btl.finished) return;
    if (step >= cardsToRun.length) { setTimeout(() => resolveEnemyTurn(), getStepDelay(1450)); return; }
    const card = cardsToRun[step];
    const isHeavy = card.isUlt || card.isLimitedCard || card.cost >= 2 || card.type === "break" || card.counterMult || card.rarity === "SSR";
    resolveSingleCard(card, hasFullChain && step === 2);
    if (!card.isUlt) btl.discardPile.push(card);
    renderBattleHUD();
    step += 1;
    if (!btl.finished) setTimeout(runNext, getStepDelay(isHeavy ? 1950 : 1500));
  };
  setTimeout(runNext, getStepDelay(450));
}

function getLvGapOutMult() {
  if (!btl) return 1.0;
  if (btl.lvGap > 0) return Math.max(0.05, Math.pow(0.84, btl.lvGap));
  if (btl.softLvDiff > 0) return Math.max(0.10, Math.pow(0.88, btl.softLvDiff));
  if (btl.softLvDiff < 0) return Math.min(1.25, 1 + Math.abs(btl.softLvDiff) * 0.018);
  return 1.0;
}

function getLvGapInMult() {
  if (!btl) return 1.0;
  const defReduct = Math.min(0.45, (btl.teamDef || 0) / ((btl.teamDef || 0) + 320));
  const defMult = 1 - defReduct;
  if (btl.lvGap > 0) return (1 + btl.lvGap * 0.28) * defMult;
  if (btl.softLvDiff > 0) return Math.min(2.8, 1 + btl.softLvDiff * 0.14) * defMult;
  if (btl.softLvDiff < 0) return Math.max(0.75, 1 - Math.abs(btl.softLvDiff) * 0.015) * defMult;
  return defMult;
}

function dealDamageToEnemy(dmg) {
  btl.totalDamageDealt = (btl.totalDamageDealt || 0) + dmg;
  if (!btl.isRaid) btl.hp = Math.max(0, btl.hp - dmg);
}

function resolveSingleCard(card, isThirdChain) {
  const member = btl.members.find(m => m.id === card.charId) || btl.members[0];
  const elInfo = window.MF_DATA.ELEMENTS[card.element];
  if (btl.stats && card.element && !btl.stats.usedElements.includes(card.element)) {
    btl.stats.usedElements.push(card.element);
  }

  if (card.isUlt || card.isLimitedCard || card.cost >= 2 || card.type === "break" || card.counterMult || card.rarity === "SSR") {
    showBattleCutin(member.id, `${card.icon} ${card.name}`, `${member.name}「いくぞ！${elInfo.name}の力！」`, elInfo.color);
  }
  if (card.draw) drawCards(card.draw);
  if (card.apGain) btl.ap = Math.min(8, btl.ap + card.apGain);
  if (card.shredTurns) { btl.shredTurns = Math.max(btl.shredTurns, card.shredTurns); triggerBattleFx("#00e5ff", "🎯"); spawnBattleFloat("🎯 装甲脆弱", "#00e5ff"); pushBattleLog(`🎯 ${card.name}！敵の装甲が脆くなった！`); }
  if (card.healRatio) {
    const heal = Math.round(btl.teamMaxHp * card.healRatio);
    btl.teamHp = Math.min(btl.teamMaxHp, btl.teamHp + heal);
    playSfx("guard"); triggerBattleFx("#18b88a", "💚"); spawnBattleFloat(`+${heal}`, "#18b88a"); pushBattleLog(`💚 ${card.name}！小隊HP回復`);
  }
  if (card.shield) {
    const sh = Math.round(btl.teamMaxHp * card.shield * 0.26);
    btl.shield += sh; playSfx("guard"); triggerBattleFx("#00e5ff", "🛡️"); spawnBattleFloat("🛡️ 防壁展開", "#00e5ff"); pushBattleLog(`🛡️ ${card.name}！結晶防壁を展開`);
  }
  if (card.counterMult) { btl.counterMult = Math.max(btl.counterMult, card.counterMult); playSfx("guard"); pushBattleLog(`🪞 ${card.name}！反撃の構え`); }

  if (card.power) {
    const chainMult = isThirdChain ? ((state.party || []).includes("iris") ? 1.55 : 1.3) : 1.0;
    let dmg = Math.round(member.atk * card.power * btl.nextAtkMult * chainMult);
    btl.nextAtkMult = 1.0;

    const isBreakCard = card.type === "break" || card.type === "ult" || !!card.guardBreakMult;
    let stag = Math.round((card.stagger || 12) * (isBreakCard ? 0.85 : 0.52));

    if (btl.intent.type === "guard") {
      if (isBreakCard) {
        dmg = Math.round(dmg * (card.guardBreakMult || 2.2));
        stag += 24;
        playSfx("break"); triggerBattleFx("#ffd000", "💥"); spawnBattleFloat("💥 装甲粉砕!", "#ffd000"); pushBattleLog(`💥 ${card.name}が敵の硬化装甲を砕いた！`);
      } else { dmg = Math.round(dmg * 0.45); }
    } else if (btl.intent.type === "charge" && isBreakCard) {
      dmg = Math.round(dmg * 1.8); stag += 20;
      if (btl.lvGap < 5 && btl.softLvDiff < 8) btl.stunned = true;
      playSfx("break"); triggerBattleFx("#ffd000", "⚡"); spawnBattleFloat("⚡ チャージ阻止!", "#ffd000"); pushBattleLog("⚡ 敵の必殺チャージを中断させた！");
    }

    if (btl.shredTurns > 0) dmg = Math.round(dmg * 1.35);
    if (btl.stunned) dmg = Math.round(dmg * 1.25);
    if (btl.attachedElement && btl.attachedElement !== card.element) {
      dmg = applyElementReaction(btl.attachedElement, card.element, dmg); btl.attachedElement = null;
    } else { btl.attachedElement = card.element; }

    dmg = Math.max(1, Math.round(dmg * getLvGapOutMult()));
    if (btl.lvGap >= 5 || btl.softLvDiff >= 8) stag = Math.max(2, Math.round(stag * 0.3));

    dealDamageToEnemy(dmg);
    playSfx(card.isUlt ? "ult" : "slash");
    triggerBattleFx(elInfo.color, card.icon);
    shakeBattleStage();
    const isResisted = btl.lvGap > 0 || btl.softLvDiff >= 5;
    spawnBattleFloat(`-${dmg.toLocaleString()}`, isResisted ? "#b4bacf" : elInfo.color);
    pushBattleLog(`${elInfo.icon} ${card.name}！${dmg.toLocaleString()} のダメージ！`);

    if (btl.targetPartIdx >= 0 && btl.parts[btl.targetPartIdx] && !btl.parts[btl.targetPartIdx].broken) {
      const part = btl.parts[btl.targetPartIdx];
      const marinaBonus = (state.party || []).includes("marina") ? 1.45 : 1.0;
      const pioneerPartMult = btl.pioneer?.partDmgMult || 1.0;
      const pMult = (part.spotted ? 1.25 : 1.0) * (btl.shredTurns > 0 ? 1.3 : 1.0) * marinaBonus * pioneerPartMult;
      part.hp = Math.max(0, part.hp - Math.round(dmg * pMult));
      if (part.hp === 0) {
        part.broken = true; btl.stunned = true;
        if (btl.stats) btl.stats.partBreaks += 1;
        playSfx("break");
        triggerBattleFx("#ffd000", "💥"); spawnBattleFloat(`💥 ${part.name}破壊!`, "#ffd000");
        pushBattleLog(`💥 部位破壊！【${part.name}】を粉砕した！`);
        btl.targetPartIdx = btl.parts.findIndex(p => !p.broken);
      }
    }

    if (!btl.stunned) {
      btl.stagger = Math.min(btl.maxStagger, btl.stagger + stag);
      if (btl.stagger >= btl.maxStagger) {
        btl.stagger = 0;
        btl.stunned = true;
        btl.breakCount = (btl.breakCount || 0) + 1;
        btl.maxStagger = Math.round(btl.baseMaxStagger * (1 + btl.breakCount * (btl.tierId >= 3 ? 0.48 : 0.38)));
        playSfx("break");
        spawnBattleFloat("💫 BREAK!", "#ffd000");
        pushBattleLog("💫 体勢ブレイク！敵が大きく怯んだ！");
      }
    }

    const enrageRatio = btl.tierId >= 4 ? 0.65 : (btl.tierId >= 3 ? 0.58 : 0.5);
    if (!btl.isRaid && !btl.enraged && btl.hp > 0 && btl.hp <= btl.maxHp * enrageRatio && (btl.isBoss || btl.parts.length > 0)) {
      btl.enraged = true; playSfx("roar"); triggerBattleFx("#ff2e4c", "💢"); shakeBattleStage();
      spawnBattleFloat("💢 怒り覚醒!!", "#ff2e4c");
      pushBattleLog(`💢 ${btl.enemy.name}が猛り狂い、瘴気が激増した！`);
    }
  }

  if (card.nextAtkMult) {
    btl.nextAtkMult *= card.nextAtkMult;
    triggerBattleFx("#ff7b39", "🔥");
    pushBattleLog(`🔥 ${card.name}！次撃へ力を収束！`);
  }

  if (!card.isUlt) {
    btl.exGauge = Math.min(100, btl.exGauge + (card.exGain || 14) + (isThirdChain ? 15 : 0));
    if (btl.exGauge >= 100) {
      btl.exGauge = 0;
      const ultOwner = (state.party || []).find(id => window.MF_DATA.CHARACTERS[id]?.limited) || state.party[0] || "protagonist";
      const ultCard = { ...window.MF_CARDS.getUltCard(ultOwner), uid: btlUidSeq++ };
      btl.hand.push(ultCard); playSfx("gift");
      pushBattleLog(`🌟 EX必殺札『${ultCard.name}』が手札に降臨！`);
    }
  }
  if (!btl.isRaid && btl.hp <= 0) setTimeout(() => finishBattle(true), getStepDelay(800));
}

function applyElementReaction(elA, elB, dmg) {
  const p = [elA, elB]; let out = dmg, txt = "";
  if (p.includes("arc")) { btl.shield += Math.round(btl.teamMaxHp * 0.18); out = Math.round(dmg * 1.3); txt = "✨ 結晶化"; }
  else if (p.includes("fire") && p.includes("water")) { out = Math.round(dmg * 2.0); txt = "💧🔥 蒸発!"; }
  else if (p.includes("fire") && p.includes("ice")) { out = Math.round(dmg * 2.2); txt = "❄️🔥 融解!"; }
  else if (p.includes("fire") && p.includes("volt")) { out = Math.round(dmg * 1.65); if (!btl.stunned) btl.stagger += 18; txt = "⚡🔥 過負荷!"; }
  else if (p.includes("water") && p.includes("ice")) { out = Math.round(dmg * 1.3); if (btl.lvGap < 5 && btl.softLvDiff < 8 && btl.tierId < 4) btl.stunned = true; txt = "💧❄️ 凍結!"; }
  else if (p.includes("volt") && p.includes("ice")) { out = Math.round(dmg * 1.45); btl.shredTurns = 2; txt = "⚡❄️ 超電導!"; }
  else if (p.includes("water") && p.includes("volt")) { out = Math.round(dmg * 1.5); btl.electroTurns = 2; txt = "💧⚡ 感電!"; }
  else if (p.includes("wind")) { out = Math.round(dmg * 1.55); txt = "🌪️ 元素拡散!"; }
  if (txt) {
    if (btl.stats) btl.stats.reactions += 1;
    spawnBattleFloat(txt, "#ffffff"); pushBattleLog(`⚡ 元素反応【${txt}】発動！`);
  }
  return out;
}

function resolveEnemyTurn() {
  if (!btl || btl.finished) return;
  if (btl.electroTurns > 0) {
    btl.electroTurns -= 1;
    const dot = Math.max(1, Math.round(btl.members[0].atk * 0.8 * getLvGapOutMult()));
    dealDamageToEnemy(dot);
    spawnBattleFloat(`⚡ -${dot}`, "#ffca3a");
    if (!btl.isRaid && btl.hp <= 0) { finishBattle(true); return; }
  }

  const intent = btl.intent;
  if (btl.stunned) {
    spawnBattleFloat("💫 行動不能", "#ffd000"); pushBattleLog(`💫 ${btl.enemy.name}は体勢を崩している！`); btl.stunned = false;
  } else if (intent.dmg > 0) {
    const brokenCnt = btl.parts.filter(p => p.broken).length;
    let dmg = Math.max(1, Math.round(intent.dmg * Math.max(0.58, 1 - brokenCnt * 0.14) * getLvGapInMult()));
    if (btl.counterMult > 0) {
      const cDmg = Math.max(1, Math.round(btl.members[0].atk * btl.counterMult * getLvGapOutMult()));
      dealDamageToEnemy(cDmg);
      dmg = Math.round(dmg * (btl.lvGap >= 5 || btl.softLvDiff >= 8 ? 0.72 : 0.32));
      playSfx("break");
      showBattleCutin(state.party[0], "🪞 カウンター炸裂！", "敵の斬撃を受け流した！", "#00e5ff");
      triggerBattleFx("#00e5ff", "🪞"); spawnBattleFloat(`-${cDmg.toLocaleString()}`, "#00e5ff");
      pushBattleLog(`🪞 カウンター反撃！${cDmg.toLocaleString()} のダメージ！`);
      if (!btl.isRaid && btl.hp <= 0) { setTimeout(() => finishBattle(true), getStepDelay(800)); return; }
    }
    if (btl.shield > 0) { const ab = Math.min(btl.shield, dmg); btl.shield -= ab; dmg -= ab; }
    if (dmg > 0) {
      btl.teamHp = Math.max(0, btl.teamHp - dmg);
      playSfx("hit"); triggerBattleFx("#ff2e4c", "💥"); shakeBattleStage();
      pushBattleLog(`💥 敵の『${intent.name}』！小隊が ${dmg.toLocaleString()} のダメージを受けた！`);
    } else { playSfx("guard"); triggerBattleFx("#00e5ff", "🛡️"); pushBattleLog("🛡️ 防壁で敵の一撃を完全に防ぎきった！"); }
  } else { playSfx("alarm"); pushBattleLog(`⚡ ${btl.enemy.name}の周囲に凄まじい瘴気が渦巻いている……！`); }

  renderBattleHUD();

  if (btl.isRaid && (btl.teamHp <= 0 || btl.turn >= btl.raidMaxTurns)) {
    setTimeout(() => finishRaidBattle(), getStepDelay(800));
    return;
  }
  if (btl.teamHp <= 0) { setTimeout(() => finishBattle(false), getStepDelay(800)); return; }

  setTimeout(() => {
    if (!btl || btl.finished) return;
    btl.turn += 1; if (btl.shredTurns > 0) btl.shredTurns -= 1;
    btl.ap = btl.maxAp;
    const keepRatio = (state.party || []).includes("lily") ? 0.75 : 0.5;
    btl.shield = Math.floor(btl.shield * keepRatio);
    if ((state.party || []).includes("serina")) {
      const h = Math.round(btl.teamMaxHp * 0.1);
      btl.teamHp = Math.min(btl.teamMaxHp, btl.teamHp + h);
      btl.exGauge = Math.min(99, btl.exGauge + 12);
      pushBattleLog("🌸 セリーナの旋律が傷を癒やした！");
    }
    btl.intent = pickNextEnemyIntent(btl.turn, intent.type, btl.enemy, btl.enraged, btl.tierId);
    drawCards(Math.max(2, 5 - btl.hand.length));
    btl.resolving = false; renderBattleHUD();
    if (battleAutoMode && !btl.finished) setTimeout(() => runAutoTurn(), getStepDelay(750));
  }, getStepDelay(1200));
}

function runAutoTurn() {
  if (!btl || btl.resolving || btl.finished || !battleAutoMode || !btl.canAuto) return;
  btl.usedAuto = true; clearQueueCards();
  const sorted = [...btl.hand].sort((a, b) => (b.isUlt ? 99 : 0) - (a.isUlt ? 99 : 0) || (b.isLimitedCard ? 50 : 0) - (a.isLimitedCard ? 50 : 0) || b.cost - a.cost);
  for (const card of sorted) { if (btl.queue.length >= 3) break; if (btl.ap >= card.cost) selectHandCard(card.uid); }
  executeTurnQueue();
}

function finishRaidBattle() {
  if (!btl || btl.finished) return;
  btl.finished = true; btl.resolving = false;
  playSfx("win");

  const totalDmg = btl.totalDamageDealt || 0;
  const res = typeof btl.ctx?.onRaidFinish === "function"
    ? btl.ctx.onRaidFinish(totalDmg)
    : { tier: { rank: "B", gems: 80, tickets: 1, credits: 6000 }, isNewBest: false, bestBonus: 0 };

  const modal = document.getElementById("modal-battle-result");
  const body = document.getElementById("btl-result-modal-body");
  body.innerHTML = `
    <div style="font-size:46px; margin-bottom:2px;">☄️</div>
    <h3 style="margin:0 0 4px; color:#ffd000; font-size:20px;">レイド計測終了！ Rank ${res.tier.rank}</h3>
    <div style="font-size:22px; font-weight:900; color:var(--accent); margin:6px 0;">
      ${totalDmg.toLocaleString()} DMG ${res.isNewBest ? "🎉NEW!" : ""}
    </div>
    <div style="background:var(--surface-sub); border-radius:10px; padding:9px; font-size:12px; font-weight:900;">
      評価報酬：💎+${res.tier.gems} ｜ 🎟️パック券+${res.tier.tickets} ｜ 🪙+${res.tier.credits.toLocaleString()}
      ${res.bestBonus ? `<div style="color:#ff7b39; margin-top:4px;">👑 ハイスコア更新ボーナス：💎+${res.bestBonus}</div>` : ""}
    </div>
    <button class="btn-primary" style="width:100%; padding:13px; font-size:15px; margin-top:14px;" onclick="exitBattleArena(false)">極限作戦へ戻る</button>
  `;
  modal.classList.add("active");
}

function finishBattle(isWin) {
  if (!btl || btl.finished) return;
  btl.finished = true; btl.resolving = false;

  const modal = document.getElementById("modal-battle-result");
  const body = document.getElementById("btl-result-modal-body");

  if (!isWin) {
    playSfx("lose");
    const lvAdvice = (btl.lvGap > 0 || btl.softLvDiff > 0)
      ? `小隊のレベルが不足しています（現在平均Lv.${btl.avgLv} ／ 適正Lv.${btl.enemyTargetLv}）。育成クエストや開拓本部で戦力を整えて再挑戦しよう！`
      : `強敵に押し切られた……！防御・回復カードや元素反応、キャンプ飯、限界突破を見直して再挑戦しよう！`;
    body.innerHTML = `
      <div style="font-size:48px; margin-bottom:4px;">💀</div>
      <h3 style="margin:0 0 6px; color:#ff595e; font-size:20px;">作戦撤退……</h3>
      <p style="font-size:12px; color:var(--muted); margin:0 0 14px; line-height:1.5;">${lvAdvice}</p>
      <button class="btn-primary" style="width:100%; padding:12px; font-size:15px;" onclick="exitBattleArena(false)">拠点・マップへ戻る</button>
    `;
    modal.classList.add("active");
    return;
  }

  playSfx("win");
  const rawId = (btl.rawEnemy || btl.enemy).id;
  markBattleClearedForAuto(rawId, btl.ctx);
  if (state.camp?.activeBuff) state.camp.activeBuff = null;

  const tier = HUNT_TIERS[btl.tierId || 0] || HUNT_TIERS[0];
  const rw = btl.enemy.rewards;
  const rwMult = btl.ctx?.rwMult || 1.0;
  const creditMult = (btl.pioneer?.creditMult || 1.0) * rwMult;
  const isManual = !btl.usedAuto;
  const brokenParts = btl.parts.filter(p => p.broken);
  const huntRes = typeof recordHuntVictory === "function" ? recordHuntVictory(btl.rawEnemy || btl.enemy, brokenParts.length) : { isFirstClear: false, dropTickets: 1 };

  const gainCredits = Math.round((rw.credits || 1000) * creditMult);
  const gainBooks = Math.round((rw.books || 2) * rwMult);
  const gainCores = Math.max(rw.cores || 0, Math.round((rw.cores || 1) * rwMult));
  const gainGems = Math.round((rw.gems || 20) * (1 + (btl.tierId || 0) * 0.45));
  const extraTk = btl.ctx?.extraTickets || 0;

  state.credits += gainCredits;
  state.expBooks = (state.expBooks || 0) + gainBooks;
  state.cores = (state.cores || 0) + gainCores;
  if (extraTk > 0) state.cardTickets = (state.cardTickets || 0) + extraTk;
  state.playerExp = (state.playerExp || 0) + Math.round((rw.rankExp || 15) * rwMult);
  while (state.playerExp >= state.playerRank * 100) { state.playerExp -= state.playerRank * 100; state.playerRank += 1; }

  // 討伐ティア初回撃破ボーナス（通常〜終焉まで各霧獣ごと）
  let tierFirstHtml = "";
  const isHuntBattle = !!(btl.ctx?.isTieredHunt || !btl.ctx);
  if (isHuntBattle && !isTierFirstCleared(rawId, tier.id)) {
    state.huntFirstClears = state.huntFirstClears || {};
    state.huntFirstClears[`${rawId}_t${tier.id}`] = true;
    state.gems += tier.firstGems;
    state.cardTickets = (state.cardTickets || 0) + tier.firstTk;
    if (tier.firstCrest > 0) state.arcCrests = (state.arcCrests || 0) + tier.firstCrest;
    tierFirstHtml = `
      <div style="background:rgba(243,207,0,0.18); border:2px solid #f3cf00; border-radius:10px; padding:7px; font-size:11.5px; color:#f3cf00; font-weight:900; margin-top:8px;">
        👑 【${tier.label}】初回撃破ボーナス！<br>
        💎+${tier.firstGems.toLocaleString()} ／ 🎟️パック券+${tier.firstTk}${tier.firstCrest ? ` ／ 💠クレスト+${tier.firstCrest}` : ""}
      </div>
    `;
  }

  let bonusHtml = "";
  if (isManual) {
    const actPt = rw.activityPt || 10;
    state.gems += gainGems; state.activityPt = (state.activityPt || 0) + actPt;
    state.materials = state.materials || {};
    brokenParts.forEach(p => { state.materials[p.drop] = (state.materials[p.drop] || 0) + 1; });
    bonusHtml = `<div style="background:rgba(24,184,138,0.16); border:1.5px solid #18b88a; border-radius:10px; padding:7px; font-size:11px; color:#18b88a; font-weight:900; margin-top:8px;">🎮 手動撃破報酬：💎+${gainGems} / 🎟️パック券+${(huntRes.dropTickets || 1) + extraTk}${brokenParts.length ? `<br>💥部位破壊：${brokenParts.map(p => p.drop).join("・")}` : ""}</div>`;
  } else {
    bonusHtml = `<div style="font-size:11px; color:#ff9f1c; font-weight:800; margin-top:8px;">🤖 AUTO周回クリア</div>`;
  }

  // 実績・週替わり戦術チャレンジへ勝利データを送信
  let hubNoteHtml = "";
  if (window.MF_REWARD_HUB?.onBattleWin) {
    const hubRes = window.MF_REWARD_HUB.onBattleWin({
      enemyId: rawId,
      tierId: btl.tierId || 0,
      isHunt: isHuntBattle,
      turns: btl.turn,
      isManual,
      reactions: btl.stats?.reactions || 0,
      chains3: btl.stats?.chains3 || 0,
      partBreaks: btl.stats?.partBreaks || 0,
      usedElements: btl.stats?.usedElements || [],
      partyElements: (btl.members || []).map(m => m.element)
    });
    if (hubRes?.unlockedLabels?.length) {
      hubNoteHtml = `<div style="background:rgba(56,163,255,0.18); border:1.5px solid #38a3ff; border-radius:10px; padding:6px 8px; font-size:11px; font-weight:900; margin-top:7px;">🏅 達成：${hubRes.unlockedLabels.map(x => escapeHtml(x)).join(" / ")}</div>`;
    }
  }

  const firstHtml = huntRes.isFirstClear
    ? `<div style="font-size:11px; color:#ffd000; font-weight:900; margin-top:6px;">📓 初討伐達成！調査ノート報酬＆AUTO周回が解放されました！</div>` : "";

  saveGame(); renderTopBar();
  const nextLabel = btl.ctx?.returnView === "story" ? "▶ 次の物語・探索へ進む" : "✅ 戦利品を受け取って次へ";
  body.innerHTML = `
    <div style="font-size:48px; margin-bottom:2px;">🏆</div>
    <h3 style="margin:0 0 4px; color:#18b88a; font-size:20px;">討伐完了！</h3>
    <div style="font-size:11px; color:var(--muted); margin-bottom:8px;">${escapeHtml(btl.enemy.name)}（${btl.turn}ターン撃破）</div>
    <div style="background:var(--surface-sub); border-radius:10px; padding:8px; font-size:12px; font-weight:900;">🪙 +${gainCredits.toLocaleString()} ｜ 📘 記録+${gainBooks} ｜ 💠 コア+${gainCores}</div>
    ${tierFirstHtml}${bonusHtml}${hubNoteHtml}${firstHtml}
    <button class="btn-primary" style="width:100%; padding:13px; font-size:15px; margin-top:14px;" onclick="exitBattleArena(true)">${nextLabel}</button>
  `;
  modal.classList.add("active");
}

function attachHandSwipeHandlers() {
  const cards = document.querySelectorAll("#btl-hand-tray .tcg-card");
  cards.forEach(el => {
    const uid = Number(el.dataset.uid);
    let sx = 0, sy = 0, lifting = false;
    const setDropHighlight = (on) => { const s = document.querySelector("#btl-chain-slots .pm-slot.empty"); if (s) s.classList.toggle("drop-ready", on); };
    el.addEventListener("touchstart", e => { if (e.target.closest(".tcg-q-btn")) return; sx = e.touches[0].clientX; sy = e.touches[0].clientY; lifting = false; }, { passive: true });
    el.addEventListener("touchmove", e => {
      if (e.target.closest(".tcg-q-btn") || !btl || btl.resolving) return;
      const dx = e.touches[0].clientX - sx, dy = e.touches[0].clientY - sy;
      if (!lifting && dy < -15 && Math.abs(dy) > Math.abs(dx) * 1.15) { lifting = true; el.classList.add("is-lifting"); setDropHighlight(true); }
      if (lifting) { e.preventDefault(); el.style.transform = `translateY(${Math.max(-92, Math.min(0, dy))}px) scale(1.07)`; }
    }, { passive: false });
    el.addEventListener("touchend", e => {
      if (!lifting) return;
      const dy = (e.changedTouches[0]?.clientY || sy) - sy;
      el.classList.remove("is-lifting"); el.style.transform = ""; setDropHighlight(false); lifting = false;
      if (dy < -40) { el.dataset.swipedAt = String(Date.now()); selectHandCard(uid); }
    });
    el.addEventListener("click", e => { if (e.target.closest(".tcg-q-btn") || Date.now() - Number(el.dataset.swipedAt || 0) < 420) return; selectHandCard(uid); });
  });
}

function renderBattleHUD() {
  if (!btl) return;
  document.getElementById("btl-turn-badge").textContent = btl.isRaid ? `TURN ${btl.turn}/${btl.raidMaxTurns}` : `TURN ${btl.turn}`;
  document.getElementById("btl-enemy-name").textContent = `${btl.enraged ? "💢" : ""}${btl.enemy.name}`;

  const stage = document.getElementById("btl-stage");
  if (stage) {
    const baseCls = btl.enemy.isRadiant || btl.tierId >= 4 ? "stage-radiant" : (btl.isBoss ? "stage-boss" : "stage-field");
    stage.className = `battle-stage ${baseCls} ${btl.enraged || btl.lvGap > 0 || btl.softLvDiff >= 5 ? "stage-enraged" : ""}`;
  }

  const elTag = btl.attachedElement ? `${window.MF_DATA.ELEMENTS[btl.attachedElement].icon}付着` : "無付着";
  const debuffs = [elTag];
  if (btl.isRaid) debuffs.push(`☄️累計 ${btl.totalDamageDealt.toLocaleString()}`);
  if (btl.stunned) debuffs.push("💫体勢崩壊");
  if (btl.lvGap > 0 || btl.softLvDiff >= 5) debuffs.push("☠️強大な瘴気");
  if (btl.enraged) debuffs.push("💢怒り覚醒");
  if (btl.shredTurns > 0) debuffs.push("🎯装甲脆弱");
  if (btl.electroTurns > 0) debuffs.push("⚡帯電");
  document.getElementById("btl-enemy-status").textContent = debuffs.join(" / ");

  document.getElementById("btl-hp-fill").style.width = btl.isRaid ? "100%" : `${Math.round((btl.hp / btl.maxHp) * 100)}%`;
  document.getElementById("btl-hp-text").textContent = btl.isRaid
    ? `☄️ 総ダメージ：${btl.totalDamageDealt.toLocaleString()}`
    : `HP ${btl.hp.toLocaleString()} / ${btl.maxHp.toLocaleString()}`;
  document.getElementById("btl-stagger-fill").style.width = btl.stunned ? "100%" : `${Math.round((btl.stagger / btl.maxStagger) * 100)}%`;
  document.getElementById("btl-stagger-text").textContent = btl.stunned ? "💫 BREAK" : "体勢ゲージ";

  const it = btl.intent;
  document.getElementById("btl-intent-box").innerHTML = `
    <div style="font-size:11.5px; font-weight:900;">${it.icon} ${escapeHtml(it.name)} <span style="opacity:0.85; font-size:10px;">【${escapeHtml(it.threat || "警戒")}】</span></div>
    <div style="font-size:10px; opacity:0.9;">${escapeHtml(it.hint)}</div>
  `;

  document.getElementById("btl-parts-row").innerHTML = btl.parts.map((p, i) => `<button class="btn-xs ${i === btl.targetPartIdx && !p.broken ? "btn-primary" : ""}" style="opacity:${p.broken ? 0.45 : 1};" onclick="btl.targetPartIdx=${i}; renderBattleHUD();" ${p.broken ? "disabled" : ""}>${p.broken ? "💥破壊済" : "🎯"} ${p.name}</button>`).join("");

  document.getElementById("btl-deck-count").textContent = btl.drawPile.length;
  document.getElementById("btl-discard-count").textContent = btl.discardPile.length;
  document.getElementById("btl-chain-slots").innerHTML = [0, 1, 2].map(i => {
    const c = btl.queue[i];
    if (!c) return `<div class="pm-slot empty"><span class="pm-slot-num">${i + 1}st</span><span style="font-size:9px; opacity:0.7;">空き枠</span></div>`;
    const el = window.MF_DATA.ELEMENTS[c.element];
    return `<div class="pm-slot filled el-pat-${c.element}" onclick="removeQueueCard(${i})"><div style="font-size:9px; font-weight:900; color:#ffd000;">${i + 1}番目 ${el.icon}</div><div style="font-size:20px; line-height:1.1;">${c.icon}</div><div style="font-size:9.5px; font-weight:900; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; width:100%;">${escapeHtml(c.name)}</div><div style="font-size:8px; color:#ccc;">戻す</div></div>`;
  }).join("");

  document.getElementById("btl-preview").textContent = buildQueuePreviewText();
  document.getElementById("btl-log-box").innerHTML = btl.log.slice(0, 2).map(l => `<div>${escapeHtml(l)}</div>`).join("");
  document.getElementById("btl-team-hp-fill").style.width = `${Math.round((btl.teamHp / btl.teamMaxHp) * 100)}%`;
  document.getElementById("btl-team-hp-text").textContent = `小隊HP ${btl.teamHp.toLocaleString()} / ${btl.teamMaxHp.toLocaleString()}`;
  document.getElementById("btl-shield-text").textContent = btl.shield > 0 ? "🛡️防壁展開中" : "";

  const orbs = Array.from({ length: Math.max(btl.maxAp, btl.ap) }, (_, i) => `<span class="ap-orb ${i < btl.ap ? "lit" : ""}"></span>`).join("");
  document.getElementById("btl-ap-orbs").innerHTML = `AP ${orbs} <strong>${btl.ap}/${btl.maxAp}</strong>`;
  document.getElementById("btl-ex-text").textContent = `🌟EX ${btl.exGauge}%`;
  document.getElementById("btl-ex-fill").style.width = `${btl.exGauge}%`;
  const execBtn = document.getElementById("btn-btl-exec");
  if (execBtn) execBtn.disabled = btl.resolving || btl.finished;

  document.getElementById("btl-hand-tray").innerHTML = btl.hand.map(c => {
    const el = window.MF_DATA.ELEMENTS[c.element];
    const canPlay = !btl.resolving && btl.ap >= c.cost && btl.queue.length < 3;
    const typeLabel = { attack: "攻撃", break: "崩し", guard: "防御", buff: "戦術", heal: "回復", ult: "EX必殺" }[c.type] || "";
    const ch = !String(c.ownerName || "").startsWith("戦術札") ? getCharProfile(c.charId) : null;
    const holoCls = (c.rarity === "SSR" || c.isUlt || c.isLimitedCard) ? "holo-card" : "";
    const artWindow = ch
      ? `<div class="tcg-art-box">${window.MF_SPRITES.portraitHTML(ch, "cutin")}<span class="tcg-art-badge">${c.icon}</span></div>`
      : `<div class="tcg-art-box tactic-art"><span class="tcg-big-icon">${c.icon}</span><span class="tcg-rar-badge">${c.rarity || "R"}</span></div>`;
    return `
      <div class="tcg-card el-pat-${c.element} type-${c.type} ${holoCls} ${canPlay ? "" : "disabled-card"}" data-uid="${c.uid}">
        <div class="tcg-head"><span class="tcg-name">${escapeHtml(c.name)}</span><span class="tcg-cost">${c.cost}</span></div>
        ${artWindow}
        <div class="tcg-meta"><span>${el.icon}${typeLabel}</span><span style="color:#ffd000;">${escapeHtml(c.ownerName || "")}</span></div>
        <div class="tcg-foot"><span class="tcg-sum">${escapeHtml(c.summary || "")}</span><button class="tcg-q-btn" onclick="event.stopPropagation(); openBattleCardDetail(${c.uid});" ontouchstart="event.stopPropagation();">？</button></div>
      </div>
    `;
  }).join("");

  attachHandSwipeHandlers();
}
