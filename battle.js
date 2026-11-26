let btl = null;
let btlLoopId = null;
let lastFrameTime = 0;
let prevThemeBeforeBattle = "camp";
let battleAutoMode = false;

function toggleBattleAuto() {
  battleAutoMode = !battleAutoMode;
  playSfx("switch");
  if (btl) {
    if (battleAutoMode) btl.usedAuto = true;
    updateAutoButtonUI();
    showToast(battleAutoMode
      ? "🤖 自動討伐ON（※この戦闘の活躍報酬・部位ボーナスは無効になります）"
      : "🎮 手動操作モードに切り替えました");
  }
}

function updateAutoButtonUI() {
  const btn = document.getElementById("btn-btl-auto");
  if (!btn) return;
  btn.textContent = battleAutoMode ? "🤖 AUTO中" : "🎮 手動操作";
  btn.className = battleAutoMode ? "btn-xs btn-accent2" : "btn-xs btn-primary";
}

function renderBattleView() {
  renderTopBar();
  const listEl = document.getElementById("btl-enemy-list");
  const teamPower = state.party.reduce((sum, id) => sum + calcCharPower(id), 0);

  listEl.innerHTML = window.MF_DATA.ENEMIES.map(en => {
    const partsLabel = en.parts.length
      ? `💥 部位破壊：${en.parts.map(p => p.name).join("・")}`
      : "一般・精鋭ターゲット";
    const warn = teamPower < en.recPower ? "⚠️ 強敵" : "✅ 推奨圏内";
    return `
      <div class="card" style="padding:10px; margin-bottom:8px;">
        <div class="top-row">
          <strong>${en.emoji} ${escapeHtml(en.name)} <span class="rank-pill">${en.rank}</span></strong>
          <span style="font-size:11px; font-weight:900;">推奨 ${en.recPower}（${warn}）</span>
        </div>
        <div style="font-size:11px; color:var(--muted); margin:4px 0;">${partsLabel}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
          <span style="font-size:11px; font-weight:800;">
            手動報酬：🏅活躍+${en.rewards.activityPt || 10} / 💎+${en.rewards.gems}
          </span>
          <button class="btn-xs btn-accent2" onclick="startBattle('${en.id}')">⚔️ 出撃</button>
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
  battleAutoMode = false;
  playSfx("switch");

  const hasWeakSpotter = state.party.some(id => id === "mint" || id === "scanner");
  const members = state.party.map((id, idx) => {
    const ch = getCharProfile(id);
    const power = calcCharPower(id);
    return {
      id, name: ch.name, emoji: ch.emoji, element: ch.element, weapon: ch.weapon,
      power, atk: Math.round(power * 0.45), maxHp: Math.round(power * 3.4),
      x: 75 + idx * 14, y: 110 + (idx % 2 === 0 ? -24 : 24),
      anim: "idle", animTimer: 0, chainReady: false, swapCd: 0
    };
  });

  const totalMaxHp = members.reduce((s, m) => s + m.maxHp, 0);
  const parts = template.parts.map(p => ({
    ...p, hp: Math.round(template.maxHp * p.hpRatio), maxHp: Math.round(template.maxHp * p.hpRatio),
    broken: false, spotted: hasWeakSpotter
  }));

  btl = {
    enemy: template,
    ex: 245, ey: 105,
    eAnim: "idle", eAnimTimer: 0,
    hp: template.maxHp, maxHp: template.maxHp,
    stagger: 0, maxStagger: template.maxStagger,
    brokenTimer: 0, charge: 0,
    telegraph: null, // { x, y, r } 敵の赤範囲攻撃予兆
    attachedElement: null,
    burnTimer: 0, electroTimer: 0, frozenTimer: 0, shredTimer: 0,
    parts, targetPartIdx: parts.length > 0 ? 0 : -1,
    members, activeIdx: 0,
    teamHp: totalMaxHp, teamMaxHp: totalMaxHp,
    shield: 0, sp: 55, maxSp: 100,
    moveTarget: null, joyVec: { x: 0, y: 0 },
    dodgeWindow: 0, dodgeCd: 0,
    atkCd: 0, allyTick: 0, time: 0,
    usedAuto: false, finished: false
  };

  document.getElementById("btl-select-panel").style.display = "none";
  document.getElementById("btl-result-box").style.display = "none";
  document.getElementById("btl-arena-panel").style.display = "block";
  updateAutoButtonUI();
  setBattlePopup("🎮 画面タップ/ドラッグで移動！赤い範囲を避けて戦おう！");
  bindArenaControls();

  cancelAnimationFrame(btlLoopId);
  lastFrameTime = performance.now();
  btlLoopId = requestAnimationFrame(battleFrameLoop);
}

function exitBattleArena() {
  cancelAnimationFrame(btlLoopId);
  btl = null;
  document.body.classList.toggle("theme-tactical", prevThemeBeforeBattle === "tactical");
  document.getElementById("btl-arena-panel").style.display = "none";
  document.getElementById("btl-select-panel").style.display = "block";
  renderBattleView();
}

function bindArenaControls() {
  const canvas = document.getElementById("btl-canvas");
  if (!canvas || canvas._bound) return;
  canvas._bound = true;

  const setPoint = (clientX, clientY) => {
    if (!btl || btl.finished) return;
    if (battleAutoMode) {
      battleAutoMode = false;
      updateAutoButtonUI();
    }
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    btl.moveTarget = {
      x: Math.max(24, Math.min(canvas.width - 24, (clientX - rect.left) * scaleX)),
      y: Math.max(34, Math.min(canvas.height - 28, (clientY - rect.top) * scaleY))
    };
  };

  canvas.addEventListener("pointerdown", e => {
    setPoint(e.clientX, e.clientY);
  });
  canvas.addEventListener("pointermove", e => {
    if (e.buttons > 0) setPoint(e.clientX, e.clientY);
  });
}

function battleFrameLoop(now) {
  if (!btl || btl.finished) return;
  const dt = Math.min(0.05, (now - lastFrameTime) / 1000);
  lastFrameTime = now;
  updateBattleStep(dt);
  drawBattleCanvas();
  renderBattleHUD();
  btlLoopId = requestAnimationFrame(battleFrameLoop);
}

function updateBattleStep(dt) {
  btl.time += dt;
  const leader = btl.members[btl.activeIdx];

  if (btl.dodgeWindow > 0) btl.dodgeWindow = Math.max(0, btl.dodgeWindow - dt);
  if (btl.dodgeCd > 0) btl.dodgeCd = Math.max(0, btl.dodgeCd - dt);
  if (btl.shredTimer > 0) btl.shredTimer = Math.max(0, btl.shredTimer - dt);
  if (btl.atkCd > 0) btl.atkCd = Math.max(0, btl.atkCd - dt);
  btl.members.forEach(m => {
    if (m.swapCd > 0) m.swapCd = Math.max(0, m.swapCd - dt);
    if (m.animTimer > 0) {
      m.animTimer = Math.max(0, m.animTimer - dt);
      if (m.animTimer === 0) m.anim = "idle";
    }
  });

  // 継続元素ダメージ
  if (btl.burnTimer > 0) {
    btl.burnTimer = Math.max(0, btl.burnTimer - dt);
    applyDamageToEnemy(Math.round(leader.atk * 0.9 * dt), null, false, 0);
  }
  if (btl.electroTimer > 0) {
    btl.electroTimer = Math.max(0, btl.electroTimer - dt);
    applyDamageToEnemy(Math.round(leader.atk * 1.1 * dt), null, false, 0);
  }

  // 自動討伐AI or 手動移動
  const isRanged = ["sniper", "assault", "staff"].includes(leader.weapon);
  const idealRange = isRanged ? 115 : 44;

  if (battleAutoMode) {
    btl.usedAuto = true;
    const dx = btl.ex - leader.x;
    const dy = btl.ey - leader.y;
    const dist = Math.hypot(dx, dy);
    if (btl.telegraph && Math.hypot(leader.x - btl.telegraph.x, leader.y - btl.telegraph.y) < btl.telegraph.r + 12) {
      // 赤範囲から自動で離脱
      leader.x = Math.max(24, Math.min(316, leader.x - (dx / (dist || 1)) * 130 * dt));
      leader.y = Math.max(36, Math.min(184, leader.y + (leader.y < 110 ? 110 : -110) * dt));
      leader.anim = "move";
    } else if (dist > idealRange) {
      leader.x += (dx / dist) * 105 * dt;
      leader.y += (dy / dist) * 105 * dt;
      leader.anim = "move";
    }
    if (btl.sp >= 35 && dist <= idealRange + 16) useActiveSkill();
  } else if (btl.moveTarget) {
    const dx = btl.moveTarget.x - leader.x;
    const dy = btl.moveTarget.y - leader.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 4) {
      leader.x += (dx / dist) * 135 * dt;
      leader.y += (dy / dist) * 135 * dt;
      if (leader.anim !== "attack") leader.anim = "move";
    } else {
      btl.moveTarget = null;
      if (leader.anim === "move") leader.anim = "idle";
    }
  }

  // リーダーの自動近接・射撃攻撃（射程内）
  const distToEnemy = Math.hypot(btl.ex - leader.x, btl.ey - leader.y);
  if (distToEnemy <= idealRange + 14 && btl.atkCd <= 0) {
    btl.atkCd = leader.weapon === "dual" ? 0.55 : 0.8;
    leader.anim = "attack";
    leader.animTimer = 0.25;
    const dmg = Math.round(leader.atk * 0.72);
    const stag = leader.weapon === "hammer" || leader.weapon === "spear" ? 8 : 5;
    btl.sp = Math.min(btl.maxSp, btl.sp + (leader.element === "volt" ? 8 : 5));
    applyDamageToEnemy(dmg, null, false, stag);
  }

  // 仲間3人の追従＆援護攻撃
  btl.allyTick += dt;
  btl.members.forEach((m, idx) => {
    if (idx === btl.activeIdx) return;
    const angle = (idx * 2.1) + btl.time * 0.8;
    const tx = Math.max(24, Math.min(316, leader.x - 28 + Math.cos(angle) * 24));
    const ty = Math.max(36, Math.min(184, leader.y + Math.sin(angle) * 28));
    m.x += (tx - m.x) * 3.5 * dt;
    m.y += (ty - m.y) * 3.5 * dt;
  });
  if (btl.allyTick >= 1.5) {
    btl.allyTick = 0;
    const allyDmg = btl.members.reduce((s, m, i) => i === btl.activeIdx ? s : s + Math.round(m.atk * 0.28), 0);
    applyDamageToEnemy(allyDmg, null, false, 3);
  }

  // 敵の移動＆赤い範囲攻撃予兆
  if (btl.brokenTimer > 0) {
    btl.brokenTimer = Math.max(0, btl.brokenTimer - dt);
    btl.telegraph = null;
    if (btl.brokenTimer === 0) {
      btl.stagger = 0;
      btl.members.forEach(m => { m.chainReady = false; });
    }
  } else if (btl.frozenTimer > 0) {
    btl.frozenTimer = Math.max(0, btl.frozenTimer - dt);
    btl.telegraph = null;
  } else {
    // 敵がゆっくり追尾
    const edx = leader.x - btl.ex;
    const edy = leader.y - btl.ey;
    const edist = Math.hypot(edx, edy);
    if (edist > 48) {
      btl.ex += (edx / edist) * 32 * dt;
      btl.ey += (edy / edist) * 32 * dt;
    }

    const rate = btl.attachedElement === "water" || btl.attachedElement === "ice" ? 20 : 28;
    btl.charge = Math.min(100, btl.charge + rate * dt);

    // チャージ60%で赤い危険エリア出現
    if (btl.charge >= 60 && !btl.telegraph) {
      btl.telegraph = { x: leader.x, y: leader.y, r: 46 };
      setBattlePopup("⚠️ 赤い攻撃範囲から移動か[回避]で離れろ！");
    }
    if (btl.charge >= 100) {
      executeEnemyAttack();
    }
  }
}

function executeEnemyAttack() {
  const leader = btl.members[btl.activeIdx];
  const area = btl.telegraph || { x: btl.ex, y: btl.ey, r: 48 };
  btl.charge = 0;
  btl.telegraph = null;

  const insideZone = Math.hypot(leader.x - area.x, leader.y - area.y) <= area.r;
  if (!insideZone) {
    setBattlePopup("✨ 範囲外へ移動回避成功！");
    return;
  }

  if (btl.dodgeWindow > 0) {
    btl.dodgeWindow = 0;
    btl.sp = Math.min(btl.maxSp, btl.sp + 28);
    btl.stagger = Math.min(btl.maxStagger, btl.stagger + 24);
    playSfx("switch");
    setBattlePopup("⚡ ジャスト回避成功！SP+28 / 体勢大削り！");
    checkStaggerBreak();
    return;
  }

  const brokenCount = btl.parts.filter(p => p.broken).length;
  let rawDmg = Math.round(btl.enemy.atk * Math.max(0.45, 1 - brokenCount * 0.2));
  if (btl.shield > 0) {
    const ab = Math.min(btl.shield, rawDmg);
    btl.shield -= ab;
    rawDmg -= ab;
  }
  if (rawDmg > 0) {
    btl.teamHp = Math.max(0, btl.teamHp - rawDmg);
    playSfx("tap");
    setBattlePopup(`💥 被弾 -${rawDmg} HP！`);
  }
  if (btl.teamHp <= 0) finishBattle(false);
}

function drawBattleCanvas() {
  const canvas = document.getElementById("btl-canvas");
  if (!canvas || !btl) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;

  // フィールド背景（開拓グリッド）
  ctx.fillStyle = "#171a24";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(255, 208, 0, 0.08)";
  ctx.lineWidth = 1;
  for (let gx = 0; gx < w; gx += 28) {
    ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
  }
  for (let gy = 0; gy < h; gy += 28) {
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
  }

  // 移動ターゲットマーカー
  if (btl.moveTarget) {
    ctx.strokeStyle = "#00e5ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(btl.moveTarget.x, btl.moveTarget.y, 8, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 敵の赤い攻撃予兆エリア
  if (btl.telegraph) {
    const fillRatio = Math.max(0, (btl.charge - 60) / 40);
    ctx.fillStyle = "rgba(255, 77, 121, 0.22)";
    ctx.strokeStyle = "#ff4d79";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(btl.telegraph.x, btl.telegraph.y, btl.telegraph.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 77, 121, 0.35)";
    ctx.beginPath();
    ctx.arc(btl.telegraph.x, btl.telegraph.y, btl.telegraph.r * fillRatio, 0, Math.PI * 2);
    ctx.fill();
  }

  // 仲間＆敵ユニット描画（Y座標順ソート）
  const units = [];
  btl.members.forEach((m, idx) => {
    units.push({
      y: m.y,
      draw: () => window.MF_SPRITES.drawChibiUnit(ctx, {
        x: m.x, y: m.y, charId: m.id, element: m.element,
        time: btl.time, stateAnim: m.anim, facing: m.x <= btl.ex ? 1 : -1,
        isEnemy: false, label: idx === btl.activeIdx ? `★${m.name}` : m.name
      })
    });
  });
  units.push({
    y: btl.ey,
    draw: () => window.MF_SPRITES.drawChibiUnit(ctx, {
      x: btl.ex, y: btl.ey, isEnemy: true, isBoss: btl.parts.length > 0,
      emoji: btl.enemy.emoji, time: btl.time, stateAnim: "idle",
      facing: btl.ex >= btl.members[btl.activeIdx].x ? -1 : 1,
      label: btl.enemy.name, hpRatio: btl.hp / btl.maxHp
    })
  });
  units.sort((a, b) => a.y - b.y).forEach(u => u.draw());
}

function manualHeavyStrike() {
  if (!btl || btl.finished) return;
  const leader = btl.members[btl.activeIdx];
  leader.anim = "attack";
  leader.animTimer = 0.3;
  // 敵方向へステップ接近
  const dx = btl.ex - leader.x, dy = btl.ey - leader.y, dist = Math.hypot(dx, dy);
  if (dist > 42) {
    leader.x += (dx / dist) * 26;
    leader.y += (dy / dist) * 26;
  }
  btl.sp = Math.min(btl.maxSp, btl.sp + 10);
  playSfx("tap");
  applyDamageToEnemy(Math.round(leader.atk * 1.25), leader.element, false, 8);
}

function useActiveSkill() {
  if (!btl || btl.finished || btl.sp < 35) return;
  btl.sp -= 35;
  const leader = btl.members[btl.activeIdx];
  leader.anim = "attack";
  leader.animTimer = 0.4;
  if (leader.weapon === "staff") {
    btl.teamHp = Math.min(btl.teamMaxHp, btl.teamHp + Math.round(btl.teamMaxHp * 0.22));
  }
  playSfx("switch");
  applyDamageToEnemy(Math.round(leader.atk * 2.8), leader.element, true, 20);
}

function triggerDodge() {
  if (!btl || btl.finished || btl.dodgeCd > 0) return;
  const leader = btl.members[btl.activeIdx];
  btl.dodgeCd = 1.6;
  btl.dodgeWindow = 1.1;
  leader.anim = "dodge";
  leader.animTimer = 0.45;
  // 敵から離れる方向へ素早くダッシュ回避
  const dx = leader.x - btl.ex, dy = leader.y - btl.ey, dist = Math.hypot(dx, dy) || 1;
  leader.x = Math.max(24, Math.min(316, leader.x + (dx / dist) * 44));
  leader.y = Math.max(36, Math.min(184, leader.y + (dy / dist) * 44));
  playSfx("tap");
  setBattlePopup("💨 ダッシュ回避！（無敵判定発生）");
}

function switchBattleLeader(idx) {
  if (!btl || btl.finished || idx === btl.activeIdx) return;
  const prev = btl.members[btl.activeIdx];
  const next = btl.members[idx];
  if (next.swapCd > 0) return;

  next.x = prev.x;
  next.y = prev.y;
  next.anim = "attack";
  next.animTimer = 0.35;
  btl.activeIdx = idx;
  next.swapCd = 1.8;
  playSfx("switch");

  if (btl.brokenTimer > 0 && next.chainReady) {
    next.chainReady = false;
    const dmg = Math.round(next.atk * 3.8);
    setBattlePopup(`⚡ 連携コンボ！【${next.name}】${dmg} DMG！`);
    applyDamageToEnemy(dmg, next.element, true, 0);
  } else {
    applyDamageToEnemy(Math.round(next.atk * 1.65), next.element, true, 12);
  }
}

function applyDamageToEnemy(baseDmg, elementId, strongApply, staggerGain) {
  if (!btl || btl.finished) return;
  let dmg = baseDmg;
  if (btl.brokenTimer > 0) dmg = Math.round(dmg * 1.6);
  if (btl.shredTimer > 0) dmg = Math.round(dmg * 1.35);

  if (elementId) {
    if (!btl.attachedElement) {
      if (strongApply || Math.random() < 0.45) btl.attachedElement = elementId;
    } else if (btl.attachedElement !== elementId) {
      dmg = resolveElementReaction(btl.attachedElement, elementId, dmg);
      btl.attachedElement = null;
    }
  }

  btl.hp = Math.max(0, btl.hp - dmg);

  if (btl.targetPartIdx >= 0 && btl.parts[btl.targetPartIdx] && !btl.parts[btl.targetPartIdx].broken) {
    const part = btl.parts[btl.targetPartIdx];
    const leader = btl.members[btl.activeIdx];
    const mult = (leader.weapon === "greatsword" || leader.weapon === "sniper" ? 1.45 : 1.0) * (part.spotted ? 1.2 : 1.0);
    part.hp = Math.max(0, part.hp - Math.round(dmg * mult));
    if (part.hp === 0) {
      part.broken = true;
      btl.stagger = Math.min(btl.maxStagger, btl.stagger + 35);
      playSfx("gift");
      setBattlePopup(`💥 部位破壊！【${part.name}】を粉砕！`);
      const nextIdx = btl.parts.findIndex(p => !p.broken);
      btl.targetPartIdx = nextIdx;
    }
  }

  if (staggerGain > 0 && btl.brokenTimer <= 0) {
    btl.stagger = Math.min(btl.maxStagger, btl.stagger + staggerGain);
    checkStaggerBreak();
  }
  if (btl.hp <= 0) finishBattle(true);
}

function resolveElementReaction(elA, elB, dmg) {
  const pair = [elA, elB];
  let label = "元素反応", out = dmg;
  if (pair.includes("arc")) { label = "✨ 結晶化（バリア生成）"; btl.shield += Math.round(btl.teamMaxHp * 0.25); out = Math.round(dmg * 1.3); }
  else if (pair.includes("fire") && pair.includes("water")) { label = "💧🔥 蒸発（2.0倍）"; out = Math.round(dmg * 2.0); }
  else if (pair.includes("fire") && pair.includes("ice")) { label = "❄️🔥 融解（2.2倍）"; out = Math.round(dmg * 2.2); }
  else if (pair.includes("fire") && pair.includes("volt")) { label = "⚡🔥 過負荷（爆発＆体勢削り）"; out = Math.round(dmg * 1.6); btl.stagger = Math.min(btl.maxStagger, btl.stagger + 25); }
  else if (pair.includes("water") && pair.includes("volt")) { label = "💧⚡ 感電（継続ダメージ）"; btl.electroTimer = 5.0; out = Math.round(dmg * 1.45); }
  else if (pair.includes("water") && pair.includes("ice")) { label = "💧❄️ 凍結（完全拘束）"; btl.frozenTimer = 4.0; out = Math.round(dmg * 1.3); }
  else if (pair.includes("volt") && pair.includes("ice")) { label = "⚡❄️ 超電導（防御DOWN）"; btl.shredTimer = 6.0; out = Math.round(dmg * 1.4); }
  else if (pair.includes("wind")) { label = "🌪️ 元素拡散"; out = Math.round(dmg * 1.55); }
  if (elB === "fire" || elA === "fire") btl.burnTimer = 4.0;
  setBattlePopup(label);
  return out;
}

function checkStaggerBreak() {
  if (btl.stagger >= btl.maxStagger && btl.brokenTimer <= 0) {
    btl.brokenTimer = 6.0;
    btl.charge = 0;
    btl.telegraph = null;
    btl.members.forEach((m, i) => { m.chainReady = i !== btl.activeIdx; });
    playSfx("gift");
    setBattlePopup("💥 体勢ブレイク！待機仲間をタップで連携コンボ！");
  }
}

function finishBattle(isWin) {
  btl.finished = true;
  cancelAnimationFrame(btlLoopId);
  const resBox = document.getElementById("btl-result-box");
  resBox.style.display = "block";

  if (!isWin) {
    resBox.innerHTML = `
      <h3 style="margin:0 0 6px; color:#ff595e;">💀 作戦撤退……</h3>
      <button class="btn-primary" style="width:100%;" onclick="exitBattleArena()">戻る</button>
    `;
    return;
  }

  playSfx("gift");
  const rw = btl.enemy.rewards;
  const isManual = !btl.usedAuto;
  const brokenParts = btl.parts.filter(p => p.broken);

  state.credits += rw.credits;
  state.expBooks = (state.expBooks || 0) + rw.books;
  state.cores = (state.cores || 0) + rw.cores;
  state.playerExp = (state.playerExp || 0) + rw.rankExp;
  if (state.playerExp >= state.playerRank * 100) {
    state.playerExp -= state.playerRank * 100;
    state.playerRank += 1;
  }

  // 手動操作時のみ「活躍報酬（結晶石・活躍Pt・部位破壊素材）」を獲得
  let bonusHtml = "";
  if (isManual) {
    const actPt = rw.activityPt || 10;
    state.gems += rw.gems;
    state.activityPt = (state.activityPt || 0) + actPt;
    state.materials = state.materials || {};
    brokenParts.forEach(p => { state.materials[p.drop] = (state.materials[p.drop] || 0) + 1; });
    bonusHtml = `
      <div style="font-size:11px; color:#18b88a; font-weight:900; margin-top:4px;">
        🎮 手動討伐ボーナス：💎+${rw.gems} / 🏅活躍Pt+${actPt}
        ${brokenParts.length ? ` / 💥部位：${brokenParts.map(p => p.drop).join("・")}` : ""}
      </div>
    `;
  } else {
    bonusHtml = `
      <div style="font-size:11px; color:#ff9f1c; font-weight:800; margin-top:4px;">
        🤖 自動討伐クリア（※AUTO使用のため活躍Pt・結晶石・部位報酬は対象外）
      </div>
    `;
  }

  saveGame();
  renderTopBar();
  
