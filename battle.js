let btl = null;
let btlInterval = null;
let prevThemeBeforeBattle = "camp";

function renderBattleView() {
  renderTopBar();
  const listEl = document.getElementById("btl-enemy-list");
  const teamPower = state.party.reduce((sum, id) => sum + calcCharPower(id), 0);

  listEl.innerHTML = window.MF_DATA.ENEMIES.map(en => {
    const partsLabel = en.parts.length
      ? `💥 破壊可能部位：${en.parts.map(p => p.name).join("・")}`
      : "一般・精鋭討伐ターゲット";
    const warn = teamPower < en.recPower ? "⚠️ 強敵" : "✅ 推奨圏内";
    return `
      <div class="card" style="padding:10px; margin-bottom:8px;">
        <div class="top-row">
          <strong>${en.emoji} ${escapeHtml(en.name)} <span class="rank-pill">${en.rank}</span></strong>
          <span style="font-size:11px; font-weight:900;">推奨戦力 ${en.recPower}（${warn}）</span>
        </div>
        <div style="font-size:11px; color:var(--muted); margin:4px 0;">${partsLabel}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
          <span style="font-size:11px; font-weight:800;">
            報酬：📘記録+${en.rewards.books} / 💠コア+${en.rewards.cores}
          </span>
          <button class="btn-xs btn-accent2" onclick="startBattle('${en.id}')">⚔️ 討伐開始</button>
        </div>
      </div>
    `;
  }).join("");
}

function startBattle(enemyId) {
  const template = window.MF_DATA.ENEMIES.find(e => e.id === enemyId);
  if (!template) return;

  prevThemeBeforeBattle = state.uiTheme;
  document.body.classList.add("theme-tactical");
  playSfx("switch");

  const hasWeakSpotter = state.party.some(id => id === "mint" || id === "scanner");

  const members = state.party.map(id => {
    const ch = getCharProfile(id);
    const power = calcCharPower(id);
    return {
      id,
      name: ch.name,
      emoji: ch.emoji,
      element: ch.element,
      weapon: ch.weapon,
      power,
      atk: Math.round(power * 0.42),
      maxHp: Math.round(power * 3.2),
      chainReady: false,
      swapCd: 0
    };
  });

  const totalMaxHp = members.reduce((s, m) => s + m.maxHp, 0);
  const parts = template.parts.map(p => ({
    ...p,
    hp: Math.round(template.maxHp * p.hpRatio),
    maxHp: Math.round(template.maxHp * p.hpRatio),
    broken: false,
    spotted: hasWeakSpotter
  }));

  btl = {
    enemy: template,
    hp: template.maxHp,
    maxHp: template.maxHp,
    stagger: 0,
    maxStagger: template.maxStagger,
    brokenTimer: 0,
    charge: 0,
    attachedElement: null,
    burnTimer: 0,
    electroTimer: 0,
    frozenTimer: 0,
    shredTimer: 0,
    parts,
    targetPartIdx: parts.length > 0 ? 0 : -1,
    members,
    activeIdx: 0,
    teamHp: totalMaxHp,
    teamMaxHp: totalMaxHp,
    shield: 0,
    sp: 50,
    maxSp: 100,
    dodgeWindow: 0,
    dodgeCd: 0,
    aiTick: 0,
    finished: false
  };

  document.getElementById("btl-select-panel").style.display = "none";
  document.getElementById("btl-result-box").style.display = "none";
  document.getElementById("btl-arena-panel").style.display = "block";
  setBattlePopup(`⚔️ ${template.name} と交戦開始！`);
  logBattle(hasWeakSpotter
    ? "🎯 観測隊員の能力でボスの破壊可能部位がマーキングされた！"
    : "💡 異なる属性のスキルや交代攻撃を当てて「元素反応」を狙おう！");

  renderBattleHUD();
  clearInterval(btlInterval);
  btlInterval = setInterval(tickBattle, 200);
}

function exitBattleArena() {
  clearInterval(btlInterval);
  btl = null;
  document.body.classList.toggle("theme-tactical", prevThemeBeforeBattle === "tactical");
  document.getElementById("btl-arena-panel").style.display = "none";
  document.getElementById("btl-select-panel").style.display = "block";
  renderBattleView();
}

function tickBattle() {
  if (!btl || btl.finished) return;

  // クールタイム・状態異常カウント減算
  if (btl.dodgeWindow > 0) btl.dodgeWindow = Math.max(0, btl.dodgeWindow - 0.2);
  if (btl.dodgeCd > 0) btl.dodgeCd = Math.max(0, btl.dodgeCd - 0.2);
  if (btl.shredTimer > 0) btl.shredTimer = Math.max(0, btl.shredTimer - 0.2);
  btl.members.forEach(m => { if (m.swapCd > 0) m.swapCd = Math.max(0, m.swapCd - 0.2); });

  // 継続元素ダメージ（燃焼・感電）
  const leader = btl.members[btl.activeIdx];
  if (btl.burnTimer > 0) {
    btl.burnTimer = Math.max(0, btl.burnTimer - 0.2);
    applyDamageToEnemy(Math.round(leader.atk * 0.22), null, false, true);
  }
  if (btl.electroTimer > 0) {
    btl.electroTimer = Math.max(0, btl.electroTimer - 0.2);
    applyDamageToEnemy(Math.round(leader.atk * 0.25), null, false, true);
  }

  // 操作リーダーの自動基本攻撃（1.0秒ごと）
  btl.aiTick += 1;
  if (btl.aiTick % 5 === 0) {
    const speedMult = leader.weapon === "dual" ? 1.3 : 1.0;
    const dmg = Math.round(leader.atk * 0.75 * speedMult);
    const stag = leader.weapon === "hammer" || leader.weapon === "spear" ? 9 : 5;
    applyDamageToEnemy(dmg, null, false, false, stag);
    btl.sp = Math.min(btl.maxSp, btl.sp + (leader.element === "volt" || leader.weapon === "dual" ? 9 : 6));
  }

  // 待機AI仲間3人の援護攻撃（1.6秒ごと）
  if (btl.aiTick % 8 === 0) {
    const allyDmg = btl.members.reduce((sum, m, idx) => idx === btl.activeIdx ? sum : sum + Math.round(m.atk * 0.28), 0);
    applyDamageToEnemy(allyDmg, null, false, true, 3);
  }

  // ボスのブレイク状態 / 凍結状態 / 行動チャージ
  if (btl.brokenTimer > 0) {
    btl.brokenTimer = Math.max(0, btl.brokenTimer - 0.2);
    if (btl.brokenTimer === 0) {
      btl.stagger = 0;
      btl.members.forEach(m => { m.chainReady = false; });
      logBattle("🔄 敵が体勢を立て直した！");
    }
  } else if (btl.frozenTimer > 0) {
    btl.frozenTimer = Math.max(0, btl.frozenTimer - 0.2);
  } else {
    const chargeRate = btl.attachedElement === "water" || btl.attachedElement === "ice" ? 4.2 : 5.8;
    btl.charge = Math.min(100, btl.charge + chargeRate);
    if (btl.charge >= 100) {
      executeEnemyAttack();
    }
  }

  renderBattleHUD();
}

function executeEnemyAttack() {
  btl.charge = 0;
  const brokenCount = btl.parts.filter(p => p.broken).length;
  const weakenedMult = Math.max(0.45, 1 - brokenCount * 0.2);
  let rawDmg = Math.round(btl.enemy.atk * weakenedMult);

  if (btl.dodgeWindow > 0) {
    btl.dodgeWindow = 0;
    btl.sp = Math.min(btl.maxSp, btl.sp + 28);
    btl.stagger = Math.min(btl.maxStagger, btl.stagger + 22);
    playSfx("switch");
    setBattlePopup("⚡ ジャスト回避＆反撃！SP+28 / 体勢削り！");
    logBattle("⚡ ジャスト回避成功！敵の攻撃を無効化し体勢を崩した！");
    checkStaggerBreak();
    return;
  }

  if (btl.shield > 0) {
    const absorbed = Math.min(btl.shield, rawDmg);
    btl.shield -= absorbed;
    rawDmg -= absorbed;
    logBattle(`✨ 結晶バリアが ${absorbed} ダメージを吸収！`);
  }

  if (rawDmg > 0) {
    btl.teamHp = Math.max(0, btl.teamHp - rawDmg);
    playSfx("tap");
    setBattlePopup(`💥 被弾 -${rawDmg} HP！`);
    logBattle(`💥 ${btl.enemy.name}の攻撃！小隊に ${rawDmg} ダメージ`);
  }

  if (btl.teamHp <= 0) {
    finishBattle(false);
  }
}

function manualHeavyStrike() {
  if (!btl || btl.finished) return;
  const leader = btl.members[btl.activeIdx];
  const dmg = Math.round(leader.atk * 1.15);
  const stag = leader.weapon === "hammer" || leader.weapon === "spear" ? 12 : 7;
  btl.sp = Math.min(btl.maxSp, btl.sp + 10);
  playSfx("tap");
  applyDamageToEnemy(dmg, leader.element, false, false, stag);
  renderBattleHUD();
}

function useActiveSkill() {
  if (!btl || btl.finished || btl.sp < 35) return;
  btl.sp -= 35;
  const leader = btl.members[btl.activeIdx];
  const elInfo = window.MF_DATA.ELEMENTS[leader.element];
  let mult = 2.7;
  if (leader.weapon === "sniper" && btl.targetPartIdx >= 0) mult = 3.3;

  // 戦術杖キャラはスキル発動時に小隊HPも回復
  if (leader.weapon === "staff") {
    const heal = Math.round(btl.teamMaxHp * 0.22);
    btl.teamHp = Math.min(btl.teamMaxHp, btl.teamHp + heal);
    logBattle(`💚 ${leader.name}の支援波動で小隊HPが ${heal} 回復！`);
  }

  playSfx("switch");
  const dmg = Math.round(leader.atk * mult);
  const stag = leader.weapon === "hammer" || leader.weapon === "spear" ? 28 : 18;
  logBattle(`${elInfo.icon} ${leader.name}の戦技発動！（${dmg}ダメージ）`);
  applyDamageToEnemy(dmg, leader.element, true, false, stag);
  renderBattleHUD();
}

function triggerDodge() {
  if (!btl || btl.finished || btl.dodgeCd > 0) return;
  btl.dodgeCd = 1.8;
  btl.dodgeWindow = 1.2;
  playSfx("tap");

  // 危険攻撃予兆（65%以上）に合わせて押すと即座にカウンター成立
  if (btl.charge >= 65 && btl.brokenTimer <= 0 && btl.frozenTimer <= 0) {
    executeEnemyAttack();
  } else {
    setBattlePopup("🛡️ 回避態勢！（1.2秒間ジャスト回避受付）");
  }
  renderBattleHUD();
}

function switchBattleLeader(idx) {
  if (!btl || btl.finished || idx === btl.activeIdx) return;
  const target = btl.members[idx];
  if (target.swapCd > 0) return;

  btl.activeIdx = idx;
  target.swapCd = 2.0;
  const elInfo = window.MF_DATA.ELEMENTS[target.element];
  playSfx("switch");

  // ブレイク中の「連携コンボ（チェイン）」発動
  if (btl.brokenTimer > 0 && target.chainReady) {
    target.chainReady = false;
    const chainDmg = Math.round(target.atk * 3.8);
    setBattlePopup(`⚡ 連携コンボ！【${target.name}】${chainDmg} DMG！`);
    logBattle(`🔥 【連携チェイン】${target.name}が追撃を叩き込んだ！（${chainDmg}ダメージ）`);
    applyDamageToEnemy(chainDmg, target.element, true, false, 0);
  } else {
    // 通常のクイック交代出場スキル
    const switchDmg = Math.round(target.atk * 1.65);
    logBattle(`🔄 ${target.name}に交代！出場攻撃（${elInfo.icon}${elInfo.name}付着）`);
    applyDamageToEnemy(switchDmg, target.element, true, false, 12);
  }
  renderBattleHUD();
}

function cycleTargetPart() {
  if (!btl || btl.parts.length === 0) return;
  const intactIndices = btl.parts.map((p, i) => (!p.broken ? i : -1)).filter(i => i >= 0);
  if (intactIndices.length === 0) {
    btl.targetPartIdx = -1;
    return;
  }
  const curPos = intactIndices.indexOf(btl.targetPartIdx);
  btl.targetPartIdx = intactIndices[(curPos + 1) % intactIndices.length];
  playSfx("tap");
  renderBattleHUD();
}

function applyDamageToEnemy(baseDmg, elementId, strongApply, silent, staggerGain = 0) {
  if (!btl || btl.finished) return;
  let dmg = baseDmg;
  if (btl.brokenTimer > 0) dmg = Math.round(dmg * 1.6);
  if (btl.shredTimer > 0) dmg = Math.round(dmg * 1.35);

  // 元素付着＆6元素反応判定
  if (elementId) {
    if (!btl.attachedElement) {
      if (strongApply || Math.random() < 0.45) btl.attachedElement = elementId;
    } else if (btl.attachedElement !== elementId) {
      dmg = resolveElementReaction(btl.attachedElement, elementId, dmg);
      btl.attachedElement = null;
    }
  }

  btl.hp = Math.max(0, btl.hp - dmg);

  // 破壊可能部位へのダメージ処理
  if (btl.targetPartIdx >= 0 && btl.parts[btl.targetPartIdx] && !btl.parts[btl.targetPartIdx].broken) {
    const part = btl.parts[btl.targetPartIdx];
    const leader = btl.members[btl.activeIdx];
    const partMult = (leader.weapon === "greatsword" || leader.weapon === "sniper" ? 1.45 : 1.0) * (part.spotted ? 1.2 : 1.0);
    part.hp = Math.max(0, part.hp - Math.round(dmg * partMult));
    if (part.hp === 0) {
      part.broken = true;
      btl.stagger = Math.min(btl.maxStagger, btl.stagger + 35);
      playSfx("gift");
      setBattlePopup(`💥 部位破壊！【${part.name}】を粉砕！`);
      logBattle(`💥 部位破壊成功！『${part.name}』を破壊しレア素材ドロップ確定！`);
      cycleTargetPart();
    }
  }

  if (staggerGain > 0 && btl.brokenTimer <= 0) {
    btl.stagger = Math.min(btl.maxStagger, btl.stagger + staggerGain);
    checkStaggerBreak();
  }

  if (btl.hp <= 0) {
    finishBattle(true);
  }
}

function resolveElementReaction(elA, elB, dmg) {
  const pair = [elA, elB];
  const leader = btl.members[btl.activeIdx];
  let label = "元素反応";
  let outDmg = dmg;

  if (pair.includes("arc")) {
    label = "✨ 結晶化（味方バリア生成！）";
    btl.shield += Math.round(btl.teamMaxHp * 0.25);
    outDmg = Math.round(dmg * 1.3);
  } else if (pair.includes("fire") && pair.includes("water")) {
    label = "💧🔥 蒸発（ダメージ2.0倍！）";
    outDmg = Math.round(dmg * 2.0);
  } else if (pair.includes("fire") && pair.includes("ice")) {
    label = "❄️🔥 融解（超火力2.2倍！）";
    outDmg = Math.round(dmg * 2.2);
  } else if (pair.includes("fire") && pair.includes("volt")) {
    label = "⚡🔥 過負荷（大爆発＋体勢削り！）";
    outDmg = Math.round(dmg * 1.6);
    btl.stagger = Math.min(btl.maxStagger, btl.stagger + 25);
  } else if (pair.includes("water") && pair.includes("volt")) {
    label = "💧⚡ 感電（継続雷ダメージ！）";
    btl.electroTimer = 5.0;
    outDmg = Math.round(dmg * 1.45);
  } else if (pair.includes("water") && pair.includes("ice")) {
    label = "💧❄️ 凍結（敵を4秒間完全拘束！）";
    btl.frozenTimer = 4.0;
    outDmg = Math.round(dmg * 1.3);
  } else if (pair.includes("volt") && pair.includes("ice")) {
    label = "⚡❄️ 超電導（防御50%DOWN！）";
    btl.shredTimer = 6.0;
    outDmg = Math.round(dmg * 1.4);
  } else if (pair.includes("wind")) {
    label = "🌪️ 元素拡散（広範囲追撃！）";
    outDmg = Math.round(dmg * 1.55);
  }

  if (elB === "fire" || elA === "fire") btl.burnTimer = 4.0;
  setBattlePopup(label);
  logBattle(`✨ 元素反応発動：${label}`);
  return outDmg;
}

function checkStaggerBreak() {
  if (btl.stagger >= btl.maxStagger && btl.brokenTimer <= 0) {
    btl.brokenTimer = 6.0;
    btl.charge = 0;
    btl.members.forEach((m, idx) => { m.chainReady = idx !== btl.activeIdx; });
    playSfx("gift");
    setBattlePopup("💥 体勢ブレイク！待機仲間をタップで連携コンボ！");
    logBattle("💥 敵が体勢を崩してダウン！待機仲間の連携技が発動可能！");
  }
}

function finishBattle(isWin) {
  btl.finished = true;
  clearInterval(btlInterval);
  const resBox = document.getElementById("btl-result-box");
  resBox.style.display = "block";

  if (!isWin) {
    resBox.innerHTML = `
      <h3 style="margin:0 0 6px; color:#ff595e;">💀 作戦撤退……</h3>
      <p style="font-size:12px; margin:0 0 10px;">隊員のレベルアップや属性相性を見直して再挑戦しよう！</p>
      <button class="btn-primary" style="width:100%;" onclick="exitBattleArena()">ターゲット選択へ戻る</button>
    `;
    return;
  }

  playSfx("gift");
  const rw = btl.enemy.rewards;
  const brokenParts = btl.parts.filter(p => p.broken);
  state.credits += rw.credits;
  state.expBooks = (state.expBooks || 0) + rw.books;
  state.cores = (state.cores || 0) + rw.cores;
  state.gems += rw.gems;
  state.playerExp = (state.playerExp || 0) + rw.rankExp;
  if (state.playerExp >= state.playerRank * 100) {
    state.playerExp -= state.playerRank * 100;
    state.playerRank += 1;
  }

  state.materials = state.materials || {};
  brokenParts.forEach(p => {
    state.materials[p.drop] = (state.materials[p.drop] || 0) + 1;
  });
  saveGame();
  renderTopBar();

  const partLootHtml = brokenParts.length
    ? `<div style="font-size:11px; color:#ffd000; font-weight:900; margin-top:4px;">💥 部位破壊報酬：${brokenParts.map(p => `${p.drop}×1`).join(" / ")}</div>`
    : `<div style="font-size:11px; color:var(--muted); margin-top:4px;">（部位を破壊して討伐すると希少素材がドロップ！）</div>`;

  resBox.innerHTML = `
    <h3 style="margin:0 0 6px; color:#18b88a;">🏆 討伐完了！！</h3>
    <div style="font-size:12px; font-weight:800;">
      🪙 +${rw.credits.toLocaleString()} ｜ 📘 記録+${rw.books} ｜ 💠 コア+${rw.cores} ｜ 💎 +${rw.gems}
    </div>
    ${partLootHtml}
    <button class="btn-primary" style="width:100%; margin-top:10px;" onclick="exitBattleArena()">戦利品を受け取って戻る</button>
  `;
}

function setBattlePopup(text) {
  const el = document.getElementById("btl-popup");
  if (el) el.textContent = text;
}

function logBattle(msg) {
  const el = document.getElementById("btl-log");
  if (el) el.textContent = msg;
}

function renderBattleHUD() {
  if (!btl) return;
  document.getElementById("btl-enemy-name").textContent = `${btl.enemy.emoji} ${btl.enemy.name}`;
  document.getElementById("btl-enemy-badge").textContent = btl.enemy.rank;

  const statusTags = [];
  if (btl.attachedElement) {
    const el = window.MF_DATA.ELEMENTS[btl.attachedElement];
    statusTags.push(`${el.icon}${el.name}付着中`);
  }
  if (btl.brokenTimer > 0) statusTags.push(`💥ブレイクダウン(${btl.brokenTimer.toFixed(1)}s)`);
  if (btl.frozenTimer > 0) statusTags.push(`❄️凍結拘束(${btl.frozenTimer.toFixed(1)}s)`);
  if (btl.shredTimer > 0) statusTags.push(`⚡防御DOWN`);
  if (btl.burnTimer > 0) statusTags.push(`🔥燃焼`);
  document.getElementById("btl-enemy-status").textContent = statusTags.join(" / ") || "通常状態";

  document.getElementById("btl-hp-fill").style.width = `${Math.round((btl.hp / btl.maxHp) * 100)}%`;
  document.getElementById("btl-hp-text").textContent = `HP ${btl.hp.toLocaleString()} / ${btl.maxHp.toLocaleString()}`;

  document.getElementById("btl-stagger-fill").style.width = `${Math.round((btl.stagger / btl.maxStagger) * 100)}%`;
  document.getElementById("btl-stagger-text").textContent = `体勢値 ${Math.round(btl.stagger)}/${btl.maxStagger}`;

  const chargeFill = document.getElementById("btl-charge-fill");
  chargeFill.style.width = `${Math.round(btl.charge)}%`;
  chargeFill.style.background = btl.charge >= 65 ? "#ff4d79" : "#b565ff";
  document.getElementById("btl-charge-text").textContent =
    btl.charge >= 65 ? "⚠️ 危険攻撃予兆！今すぐ[回避]！" : `敵行動ゲージ ${Math.round(btl.charge)}%`;

  // 破壊可能部位パネル
  const partsRow = document.getElementById("btl-parts-row");
  if (btl.parts.length === 0) {
    partsRow.innerHTML = "";
  } else {
    partsRow.innerHTML = btl.parts.map((p, i) => {
      const isTarget = i === btl.targetPartIdx && !p.broken;
      return `
        <button class="btn-xs ${isTarget ? "btn-primary" : ""}" style="opacity:${p.broken ? 0.45 : 1};"
                onclick="btl.targetPartIdx=${i}; renderBattleHUD();" ${p.broken ? "disabled" : ""}>
          ${p.broken ? "💥破壊済" : (isTarget ? "🎯" : "📍")} ${p.name}
          ${p.broken ? "" : `(${Math.ceil((p.hp / p.maxHp) * 100)}%)`}
        </button>
      `;
    }).join("");
  }

  document.getElementById("btl-team-hp-fill").style.width = `${Math.round((btl.teamHp / btl.teamMaxHp) * 100)}%`;
  document.getElementById("btl-team-hp-text").textContent = `小隊HP ${btl.teamHp}/${btl.teamMaxHp}`;
  document.getElementById("btl-shield-text").textContent = btl.shield > 0 ? `✨バリア +${btl.shield}` : "";

  document.getElementById("btl-sp-fill").style.width = `${Math.round((btl.sp / btl.maxSp) * 100)}%`;
  document.getElementById("btl-sp-text").textContent = `SP ${Math.floor(btl.sp)}/100`;

  const skillBtn = document.getElementById("btn-btl-skill");
  skillBtn.disabled = btl.sp < 35 || btl.finished;
  const dodgeBtn = document.getElementById("btn-btl-dodge");
  dodgeBtn.disabled = btl.dodgeCd > 0 || btl.finished;
  dodgeBtn.textContent = btl.dodgeCd > 0 ? `🛡️ 回避(${btl.dodgeCd.toFixed(1)}s)` : "🛡️ ジャスト回避";

  // 下部4人スワップ＆連携コンボバー
  document.getElementById("btl-party-bar").innerHTML = btl.members.map((m, idx) => {
    const el = window.MF_DATA.ELEMENTS[m.element];
    const isActive = idx === btl.activeIdx;
    const isChain = m.chainReady && btl.brokenTimer > 0;
    const cls = isChain ? "chain-glow" : (isActive ? "active-leader" : "");
    return `
      <div class="party-slot ${cls}" onclick="switchBattleLeader(${idx})">
        <span class="slot-icon">${m.emoji}</span>
        <div style="font-size:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(m.name)}</div>
        <div style="font-size:9px; font-weight:900;">
          ${isChain ? "⚡連携OK!" : (isActive ? `★操作中 ${el.icon}` : `${el.icon} 交代`)}
        </div>
      </div>
    `;
  }).join("");
}
