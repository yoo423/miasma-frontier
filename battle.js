let btl = null;
let battleAutoMode = false;
let battleSpeed = 1; // 1: じっくり(1150ms) / 2: 倍速(650ms)
let prevThemeBeforeBattle = "camp";
let btlUidSeq = 1;

function getStepDelay(baseMs) {
  return battleSpeed === 2 ? Math.round(baseMs * 0.56) : baseMs;
}

function toggleBattleSpeed() {
  battleSpeed = battleSpeed === 1 ? 2 : 1;
  playSfx("tap");
  const btn = document.getElementById("btn-btl-speed");
  if (btn) btn.textContent = battleSpeed === 1 ? "🐢 じっくり" : "⚡ 倍速";
  showToast(battleSpeed === 1 ? "🐢 演出をじっくり楽しむ速度にしました" : "⚡ 倍速モードにしました");
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

function toggleBattleAuto() {
  battleAutoMode = !battleAutoMode;
  playSfx("switch");
  if (btl) {
    if (battleAutoMode) btl.usedAuto = true;
    updateAutoButtonUI();
    showToast(battleAutoMode
      ? "🤖 自動討伐ON（※この戦闘の活躍報酬・部位ボーナスは無効）"
      : "🎮 手動読み合いモードに切り替えました");
    if (battleAutoMode && !btl.resolving && !btl.finished) {
      setTimeout(() => runAutoTurn(), getStepDelay(600));
    }
  }
}

function updateAutoButtonUI() {
  const btn = document.getElementById("btn-btl-auto");
  if (!btn) return;
  btn.textContent = battleAutoMode ? "🤖 AUTO中" : "🎮 手動";
  btn.className = battleAutoMode ? "btn-xs btn-accent2" : "btn-xs btn-primary";
}

function renderBattleView() {
  renderTopBar();
  const listEl = document.getElementById("btl-enemy-list");
  if (!listEl) return;
  const teamPower = state.party.reduce((sum, id) => sum + calcCharPower(id), 0);

  listEl.innerHTML = (window.MF_DATA.ENEMIES || []).map(en => {
    const log = typeof getHuntEntry === "function" ? getHuntEntry(en.id) : { kills: 0 };
    const firstBadge = log.kills === 0 ? `<span class="tag" style="background:#ffd13b;">🆕 初討伐報酬あり</span>` : `<span class="tag">討伐 ${log.kills}体</span>`;
    const partsLabel = en.parts.length ? `💥 破壊可能部位：${en.parts.map(p => p.name).join("・")}` : "一般・精鋭ターゲット";
    const warn = teamPower < en.recPower ? "⚠️ 強敵" : "✅ 推奨圏内";
    const radiantStyle = en.isRadiant ? "border-color:#ffd000;" : "";
    return `
      <div class="card" style="padding:10px; margin-bottom:8px; ${radiantStyle}">
        <div class="top-row">
          <strong>${en.emoji} ${escapeHtml(en.name)}</strong>
          <span class="rank-pill">${en.rank}</span>
        </div>
        <div style="display:flex; gap:5px; align-items:center; flex-wrap:wrap; margin:4px 0;">
          ${firstBadge}
          <span style="font-size:10px; font-weight:900;">推奨戦力 ${en.recPower}（${warn}）</span>
        </div>
        <div style="font-size:11px; color:var(--muted);">${partsLabel}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
          <span style="font-size:11px; font-weight:800;">手動報酬：🏅活躍+${en.rewards.activityPt || 10} / 💎+${en.rewards.gems}</span>
          <button class="btn-xs btn-accent2" onclick="startBattle('${en.id}')">🃏 戦闘開始</button>
        </div>
      </div>
    `;
  }).join("");
}

function shuffleCards(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickNextEnemyIntent(turn, prevType, enemy) {
  if (prevType === "charge") {
    return { type: "heavy", icon: "☄️", name: "ミアズマ大崩壊", dmg: Math.round(enemy.atk * 2.1), hint: "大技直前！防御・カウンターか凍結で防げ！" };
  }
  const r = Math.random();
  if (turn >= 2 && r < 0.25) return { type: "charge", icon: "⚡", name: "必殺チャージ中", dmg: 0, hint: "次ターン超大技！【崩し】カードで強制中断！" };
  if (r < 0.5) return { type: "guard", icon: "🛡️", name: "装甲硬化・反撃構え", dmg: Math.round(enemy.atk * 0.7), hint: "通常攻撃半減！【崩し】カードで装甲粉砕！" };
  if (r < 0.75) return { type: "heavy", icon: "💢", name: "強襲叩きつけ", dmg: Math.round(enemy.atk * 1.45), hint: "強攻撃！【防御】や【カウンター】で跳ね返せ！" };
  return { type: "attack", icon: "⚔️", name: "霧獣の連撃", dmg: enemy.atk, hint: "通常攻撃。元素チェインかカウンターを狙え！" };
}

function startBattle(enemyId, opts = null) {
  const template = (window.MF_DATA.ENEMIES || []).find(e => e.id === enemyId);
  if (!template) return;

  prevThemeBeforeBattle = state.uiTheme;
  document.body.classList.add("theme-tactical");
  battleAutoMode = false;

  const isBoss = template.isRadiant || template.parts.length >= 2;
  if (window.MF_AUDIO) window.MF_AUDIO.playBgm(isBoss ? "boss" : "battle");
  playSfx("switch");

  const atkMult = getCraftAtkMultiplier(opts?.extraAtkBuff || 0);
  const hasSpotter = state.party.some(id => id === "mint" || id === "scanner");
  const members = state.party.map(id => {
    const ch = getCharProfile(id);
    const power = calcCharPower(id);
    return { id, name: ch.name, emoji: ch.emoji, element: ch.element, atk: Math.round(power * 0.85 * atkMult), maxHp: Math.round(power * 3.8) };
  });

  const totalMaxHp = members.reduce((s, m) => s + m.maxHp, 0);
  const parts = template.parts.map(p => ({
    ...p, hp: Math.round(template.maxHp * p.hpRatio), maxHp: Math.round(template.maxHp * p.hpRatio),
    broken: false, spotted: hasSpotter
  }));

  const rawDeck = window.MF_CARDS.buildActiveDeck().map(c => ({ ...c, uid: btlUidSeq++ }));

  btl = {
    ctx: opts, enemy: template, isBoss,
    hp: template.maxHp, maxHp: template.maxHp,
    stagger: 0, maxStagger: template.maxStagger, stunned: false,
    attachedElement: null, shredTurns: 0, electroTurns: 0,
    parts, targetPartIdx: parts.length > 0 ? 0 : -1,
    members, teamHp: totalMaxHp, teamMaxHp: totalMaxHp,
    shield: 0, counterMult: 0, nextAtkMult: 1.0, exGauge: 0,
    ap: 4, maxAp: 4, turn: 1,
    drawPile: shuffleCards(rawDeck), discardPile: [], hand: [], queue: [],
    intent: pickNextEnemyIntent(1, null, template),
    log: [`⚔️ ${template.name} と遭遇！敵の予兆を読んでチェインを組もう！`],
    resolving: false, usedAuto: false, finished: false
  };

  drawCards(5);
  document.getElementById("btl-select-panel").style.display = "none";
  document.getElementById("btl-result-box").style.display = "none";
  document.getElementById("btl-arena-panel").style.display = "block";
  updateAutoButtonUI();
  renderBattleHUD();
}

function exitBattleArena(didWin = false) {
  const ctx = btl?.ctx || null;
  battleAutoMode = false;
  btl = null;
  document.body.classList.toggle("theme-tactical", prevThemeBeforeBattle === "tactical");
  document.getElementById("btl-arena-panel").style.display = "none";
  document.getElementById("btl-select-panel").style.display = "block";

  if (didWin && typeof ctx?.onWin === "function") ctx.onWin();
  if (ctx?.returnView) {
    switchView(ctx.returnView);
  } else {
    if (window.MF_AUDIO) window.MF_AUDIO.playBgm("home");
    renderBattleView();
  }
}

// ---------- カットイン・画面揺れ・ダメージフロート演出 ----------
function showBattleCutin(charId, titleText, subText, accentColor) {
  const box = document.getElementById("btl-cutin");
  if (!box) return;
  const ch = getCharProfile(charId || state.party[0]);
  document.getElementById("cutin-portrait").innerHTML = window.MF_SPRITES.portraitHTML(ch, "full");
  document.getElementById("cutin-title").textContent = titleText;
  document.getElementById("cutin-sub").textContent = subText || ch.voiceLines?.[0] || "";
  box.style.borderColor = accentColor || "#ffd000";
  box.classList.remove("show");
  void box.offsetWidth;
  box.classList.add("show");
  clearTimeout(box._t);
  box._t = setTimeout(() => box.classList.remove("show"), getStepDelay(1050));
}

function spawnBattleFloat(text, color = "#ffd000") {
  const layer = document.getElementById("btl-float-layer");
  if (!layer) return;
  const el = document.createElement("div");
  el.className = "dmg-float";
  el.style.color = color;
  el.style.left = `${35 + Math.random() * 30}%`;
  el.textContent = text;
  layer.appendChild(el);
  setTimeout(() => el.remove(), 1100);
}

function shakeBattleStage() {
  const stage = document.getElementById("btl-stage");
  if (!stage) return;
  stage.classList.remove("shake");
  void stage.offsetWidth;
  stage.classList.add("shake");
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
  if (btl.queue.length >= 3) { showToast("1ターンに出せるのは最大3枚までです！"); return; }
  const idx = btl.hand.findIndex(c => c.uid === uid);
  if (idx < 0) return;
  const card = btl.hand[idx];
  if (btl.ap < card.cost) { showToast(`AP不足（必要 AP${card.cost}）`); return; }

  btl.ap -= card.cost;
  btl.hand.splice(idx, 1);
  btl.queue.push(card);
  playSfx("tap");
  renderBattleHUD();
}

function removeQueueCard(qIdx) {
  if (!btl || btl.resolving || btl.finished) return;
  const card = btl.queue.splice(qIdx, 1)[0];
  if (!card) return;
  btl.ap += card.cost;
  btl.hand.push(card);
  playSfx("tap");
  renderBattleHUD();
}

function clearQueueCards() {
  if (!btl || btl.resolving || btl.finished) return;
  while (btl.queue.length > 0) removeQueueCard(0);
}

function buildQueuePreviewText() {
  if (!btl || btl.queue.length === 0) return "手札をタップして最大3枚のチェインを組んでください";
  const notes = [];
  let simEl = btl.attachedElement;
  btl.queue.forEach(c => {
    if ((c.type === "break" || c.type === "ult") && (btl.intent.type === "guard" || btl.intent.type === "charge")) notes.push("💥 装甲/チャージ破壊！");
    if (c.counterMult && (btl.intent.type === "attack" || btl.intent.type === "heavy")) notes.push("🪞 カウンター待機！");
    if (c.type === "attack" || c.type === "break" || c.type === "ult") {
      if (simEl && simEl !== c.element) { notes.push(`✨ 元素反応【${getReactionName(simEl, c.element)}】`); simEl = null; }
      else simEl = c.element;
    }
  });
  if (btl.queue.length === 3) notes.push("🔥 3連チェイン(+30%)");
  return [...new Set(notes)].join(" / ") || "発動準備OK！「決定して発動」をタップ";
}

function getReactionName(elA, elB) {
  const p = [elA, elB];
  if (p.includes("arc")) return "結晶化";
  if (p.includes("fire") && p.includes("water")) return "蒸発 2.0倍";
  if (p.includes("fire") && p.includes("ice")) return "融解 2.2倍";
  if (p.includes("fire") && p.includes("volt")) return "過負荷";
  if (p.includes("water") && p.includes("volt")) return "感電";
  if (p.includes("water") && p.includes("ice")) return "凍結";
  if (p.includes("volt") && p.includes("ice")) return "超電導";
  if (p.includes("wind")) return "元素拡散";
  return "元素共鳴";
}

function pushBattleLog(msg) {
  btl.log.unshift(msg);
  if (btl.log.length > 4) btl.log.pop();
}

function executeTurnQueue() {
  if (!btl || btl.resolving || btl.finished) return;
  if (btl.queue.length === 0 && !confirm("カードを1枚も出さずにターン終了しますか？")) return;

  btl.resolving = true;
  btl.counterMult = 0;
  btl.nextAtkMult = 1.0;

  const cardsToRun = [...btl.queue];
  btl.queue = [];
  const hasFullChain = cardsToRun.length === 3;
  renderBattleHUD();

  let step = 0;
  const runNext = () => {
    if (!btl || btl.finished) return;
    if (step >= cardsToRun.length) {
      setTimeout(() => resolveEnemyTurn(), getStepDelay(1100));
      return;
    }
    const card = cardsToRun[step];
    const isHeavyShow = card.isUlt || card.cost >= 2 || card.type === "break" || card.counterMult;
    resolveSingleCard(card, hasFullChain && step === 2);
    if (!card.isUlt) btl.discardPile.push(card);
    renderBattleHUD();

    step += 1;
    if (!btl.finished) {
      setTimeout(runNext, getStepDelay(isHeavyShow ? 1350 : 1050));
    }
  };
  setTimeout(runNext, getStepDelay(320));
}

function resolveSingleCard(card, isThirdChain) {
  const member = btl.members.find(m => m.id === card.charId) || btl.members[0];
  const elInfo = window.MF_DATA.ELEMENTS[card.element];

  // カットイン演出（EX必殺・コスト2戦技・崩し・カウンター時）
  if (card.isUlt || card.cost >= 2 || card.type === "break" || card.counterMult) {
    showBattleCutin(member.id, `${card.icon} ${card.name}`, `${member.name}「${elInfo.name}の力を解き放つ！」`, elInfo.color);
  }

  if (card.draw) drawCards(card.draw);
  if (card.apGain) btl.ap = Math.min(6, btl.ap + card.apGain);
  if (card.shredTurns) { btl.shredTurns = Math.max(btl.shredTurns, card.shredTurns); spawnBattleFloat("🎯 防御DOWN!", "#00e5ff"); pushBattleLog(`🎯 ${card.name}！敵防御DOWN！`); }
  if (card.healRatio) {
    const heal = Math.round(btl.teamMaxHp * card.healRatio);
    btl.teamHp = Math.min(btl.teamMaxHp, btl.teamHp + heal);
    playSfx("guard"); spawnBattleFloat(`💚 +${heal}`, "#18b88a");
    pushBattleLog(`💚 ${card.name}！小隊HP +${heal} 回復！`);
  }
  if (card.shield) {
    const sh = Math.round(btl.teamMaxHp * card.shield * 0.28);
    btl.shield += sh;
    playSfx("guard"); spawnBattleFloat(`🛡️ +${sh}`, "#00e5ff");
    pushBattleLog(`🛡️ ${card.name}！結晶バリア +${sh}！`);
  }
  if (card.counterMult) { btl.counterMult = Math.max(btl.counterMult, card.counterMult); playSfx("guard"); pushBattleLog(`🪞 ${card.name}構え！`); }
  if (card.nextAtkMult) { btl.nextAtkMult *= card.nextAtkMult; pushBattleLog(`🔥 ${card.name}！次撃威力UP！`); }

  if (card.power) {
    let dmg = Math.round(member.atk * card.power * btl.nextAtkMult * (isThirdChain ? 1.3 : 1.0));
    btl.nextAtkMult = 1.0;

    let stag = card.stagger || 12;
    if (btl.intent.type === "guard") {
      if (card.type === "break" || card.type === "ult") {
        dmg = Math.round(dmg * (card.guardBreakMult || 2.2));
        stag += 35; btl.stunned = true;
        playSfx("break"); spawnBattleFloat("💥 装甲粉砕!", "#ffd000");
        pushBattleLog(`💥 【装甲粉砕】${card.name}が防御を叩き割った！`);
      } else {
        dmg = Math.round(dmg * 0.55);
      }
    } else if (btl.intent.type === "charge" && (card.type === "break" || card.type === "ult")) {
      dmg = Math.round(dmg * 1.8); stag += 40; btl.stunned = true;
      playSfx("break"); spawnBattleFloat("⚡ チャージ中断!", "#ffd000");
      pushBattleLog(`⚡ 【チャージ中断】${card.name}で大技を阻止！`);
    }

    if (btl.shredTurns > 0) dmg = Math.round(dmg * 1.35);

    if (btl.attachedElement && btl.attachedElement !== card.element) {
      dmg = applyElementReaction(btl.attachedElement, card.element, dmg);
      btl.attachedElement = null;
    } else {
      btl.attachedElement = card.element;
    }

    btl.hp = Math.max(0, btl.hp - dmg);
    playSfx(card.isUlt ? "ult" : "slash");
    shakeBattleStage();
    spawnBattleFloat(`-${dmg.toLocaleString()}`, elInfo.color);
    pushBattleLog(`${elInfo.icon} ${card.name}！${dmg.toLocaleString()} DMG！`);

    if (btl.targetPartIdx >= 0 && btl.parts[btl.targetPartIdx] && !btl.parts[btl.targetPartIdx].broken) {
      const part = btl.parts[btl.targetPartIdx];
      const pMult = (part.spotted ? 1.25 : 1.0) * (btl.shredTurns > 0 ? 1.3 : 1.0);
      part.hp = Math.max(0, part.hp - Math.round(dmg * pMult));
      if (part.hp === 0) {
        part.broken = true; btl.stunned = true; playSfx("break");
        spawnBattleFloat(`💥 ${part.name}破壊!`, "#ffd000");
        pushBattleLog(`💥 部位破壊！【${part.name}】を粉砕！`);
        btl.targetPartIdx = btl.parts.findIndex(p => !p.broken);
      }
    }

    btl.stagger = Math.min(btl.maxStagger, btl.stagger + stag);
    if (btl.stagger >= btl.maxStagger) {
      btl.stagger = 0; btl.stunned = true; playSfx("break");
      spawnBattleFloat("💫 BREAK!", "#ffd000");
      pushBattleLog("💫 体勢ブレイク！敵はダウンして動けない！");
    }
  }

  if (!card.isUlt) {
    btl.exGauge = Math.min(100, btl.exGauge + (card.exGain || 14) + (isThirdChain ? 15 : 0));
    if (btl.exGauge >= 100) {
      btl.exGauge = 0;
      const ultCard = { ...window.MF_CARDS.getUltCard(state.party[0] || "protagonist"), uid: btlUidSeq++ };
      btl.hand.push(ultCard); playSfx("gift");
      pushBattleLog(`🌟 EX必殺札『${ultCard.name}』が手札に降臨！`);
    }
  }
  if (btl.hp <= 0) setTimeout(() => finishBattle(true), getStepDelay(550));
}

function applyElementReaction(elA, elB, dmg) {
  const p = [elA, elB];
  let out = dmg, txt = "";
  if (p.includes("arc")) { const sh = Math.round(btl.teamMaxHp * 0.2); btl.shield += sh; out = Math.round(dmg * 1.3); txt = "✨結晶化"; }
  else if (p.includes("fire") && p.includes("water")) { out = Math.round(dmg * 2.0); txt = "💧🔥蒸発 2.0倍!"; }
  else if (p.includes("fire") && p.includes("ice")) { out = Math.round(dmg * 2.2); txt = "❄️🔥融解 2.2倍!"; }
  else if (p.includes("fire") && p.includes("volt")) { out = Math.round(dmg * 1.65); btl.stagger += 30; txt = "⚡🔥過負荷!"; }
  else if (p.includes("water") && p.includes("ice")) { out = Math.round(dmg * 1.3); btl.stunned = true; txt = "💧❄️凍結!"; }
  else if (p.includes("volt") && p.includes("ice")) { out = Math.round(dmg * 1.45); btl.shredTurns = 2; txt = "⚡❄️超電導!"; }
  else if (p.includes("water") && p.includes("volt")) { out = Math.round(dmg * 1.5); btl.electroTurns = 2; txt = "💧⚡感電!"; }
  else if (p.includes("wind")) { out = Math.round(dmg * 1.55); txt = "🌪️元素拡散!"; }
  if (txt) { spawnBattleFloat(txt, "#ffffff"); pushBattleLog(`⚡ 元素反応：${txt}`); }
  return out;
}

function resolveEnemyTurn() {
  if (!btl || btl.finished) return;
  if (btl.electroTurns > 0) {
    btl.electroTurns -= 1;
    const dot = Math.round(btl.members[0].atk * 0.8);
    btl.hp = Math.max(0, btl.hp - dot);
    spawnBattleFloat(`⚡ -${dot}`, "#ffca3a");
    pushBattleLog(`⚡ 感電ダメージ ${dot}！`);
    if (btl.hp <= 0) { finishBattle(true); return; }
  }

  const intent = btl.intent;
  if (btl.stunned) {
    spawnBattleFloat("💫 行動不能", "#ffd000");
    pushBattleLog(`💫 ${btl.enemy.name}はダウン・凍結中で動けない！`);
    btl.stunned = false;
  } else if (intent.dmg > 0) {
    const brokenCnt = btl.parts.filter(p => p.broken).length;
    let dmg = Math.round(intent.dmg * Math.max(0.5, 1 - brokenCnt * 0.18));

    if (btl.counterMult > 0) {
      const counterDmg = Math.round(btl.members[0].atk * btl.counterMult);
      btl.hp = Math.max(0, btl.hp - counterDmg);
      dmg = Math.round(dmg * 0.3);
      playSfx("break");
      showBattleCutin(state.party[0], "🪞 見切りカウンター炸裂！", `敵の攻撃を受け流し ${counterDmg.toLocaleString()} の大反撃！`, "#00e5ff");
      spawnBattleFloat(`COUNTER -${counterDmg}`, "#00e5ff");
      pushBattleLog(`🪞 【カウンター】${counterDmg.toLocaleString()} の大反撃！`);
      if (btl.hp <= 0) { setTimeout(() => finishBattle(true), getStepDelay(600)); return; }
    }
    if (btl.shield > 0) { const ab = Math.min(btl.shield, dmg); btl.shield -= ab; dmg -= ab; }
    if (dmg > 0) {
      btl.teamHp = Math.max(0, btl.teamHp - dmg);
      playSfx("hit"); shakeBattleStage();
      pushBattleLog(`💥 敵の『${intent.name}』！小隊に -${dmg} HP！`);
    } else {
      playSfx("guard");
      pushBattleLog(`🛡️ 敵の『${intent.name}』をバリアで完全防御！`);
    }
  } else {
    pushBattleLog(`⚡ ${btl.enemy.name}は恐ろしい瘴気を溜め込んでいる……！`);
  }

  renderBattleHUD();
  if (btl.teamHp <= 0) { setTimeout(() => finishBattle(false), getStepDelay(500)); return; }

  setTimeout(() => {
    if (!btl || btl.finished) return;
    btl.turn += 1;
    if (btl.shredTurns > 0) btl.shredTurns -= 1;
    btl.ap = btl.maxAp;
    btl.shield = Math.floor(btl.shield * 0.5);
    btl.intent = pickNextEnemyIntent(btl.turn, intent.type, btl.enemy);
    drawCards(Math.max(2, 5 - btl.hand.length));
    btl.resolving = false;
    renderBattleHUD();
    if (battleAutoMode && !btl.finished) setTimeout(() => runAutoTurn(), getStepDelay(650));
  }, getStepDelay(900));
}

function runAutoTurn() {
  if (!btl || btl.resolving || btl.finished || !battleAutoMode) return;
  btl.usedAuto = true;
  clearQueueCards();
  const sorted = [...btl.hand].sort((a, b) => (b.isUlt ? 99 : 0) - (a.isUlt ? 99 : 0) || b.cost - a.cost);
  for (const card of sorted) {
    if (btl.queue.length >= 3) break;
    if (btl.ap >= card.cost) selectHandCard(card.uid);
  }
  executeTurnQueue();
}

function finishBattle(isWin) {
  if (!btl || btl.finished) return;
  btl.finished = true;
  btl.resolving = false;
  const resBox = document.getElementById("btl-result-box");
  resBox.style.display = "block";

  if (!isWin) {
    resBox.innerHTML = `<h3 style="margin:0 0 6px; color:#ff595e;">💀 作戦撤退……</h3><button class="btn-primary" style="width:100%;" onclick="exitBattleArena(false)">戻る</button>`;
    return;
  }

  playSfx("gift");
  if (state.camp?.activeBuff) state.camp.activeBuff = null;
  const rw = btl.enemy.rewards;
  const isManual = !btl.usedAuto;
  const brokenParts = btl.parts.filter(p => p.broken);
  const huntRes = typeof recordHuntVictory === "function" ? recordHuntVictory(btl.enemy, brokenParts.length) : { isFirstClear: false };

  state.credits += rw.credits;
  state.expBooks = (state.expBooks || 0) + rw.books;
  state.cores = (state.cores || 0) + rw.cores;
  state.playerExp = (state.playerExp || 0) + rw.rankExp;
  if (state.playerExp >= state.playerRank * 100) { state.playerExp -= state.playerRank * 100; state.playerRank += 1; }

  let bonusHtml = "";
  if (isManual) {
    const actPt = rw.activityPt || 10;
    state.gems += rw.gems;
    state.activityPt = (state.activityPt || 0) + actPt;
    state.materials = state.materials || {};
    brokenParts.forEach(p => { state.materials[p.drop] = (state.materials[p.drop] || 0) + 1; });
    bonusHtml = `<div style="font-size:11px; color:#18b88a; font-weight:900; margin-top:4px;">🎮 手動ボーナス：💎+${rw.gems} / 🏅活躍+${actPt}${brokenParts.length ? ` / 💥部位：${brokenParts.map(p => p.drop).join("・")}` : ""}</div>`;
  } else {
    bonusHtml = `<div style="font-size:11px; color:#ff9f1c; font-weight:800; margin-top:4px;">🤖 AUTOクリア（※活躍Pt・結晶石・部位報酬は手動限定）</div>`;
  }

  const firstHtml = huntRes.isFirstClear
    ? `<div style="font-size:11px; color:#ffd000; font-weight:900; margin-top:4px;">📓 初討伐達成！「調査ノート」で初討伐ボーナスを受け取れます！</div>`
    : "";

  saveGame();
  renderTopBar();
  const nextLabel = btl.ctx?.returnView === "story" ? "冒険・物語の続きへ進む ▶" : "戦利品を受け取って戻る";
  resBox.innerHTML = `
    <h3 style="margin:0 0 6px; color:#18b88a;">🏆 討伐完了！（${btl.turn}ターン）</h3>
    <div style="font-size:12px; font-weight:800;">基本報酬：🪙 +${rw.credits.toLocaleString()} ｜ 📘 記録+${rw.books} ｜ 💠 コア+${rw.cores}</div>
    ${bonusHtml}${firstHtml}
    <button class="btn-primary" style="width:100%; margin-top:10px;" onclick="exitBattleArena(true)">${nextLabel}</button>
  `;
}

function renderBattleHUD() {
  if (!btl) return;
  document.getElementById("btl-turn-badge").textContent = `TURN ${btl.turn}`;
  document.getElementById("btl-enemy-name").textContent = `${btl.enemy.name}`;

  const stage = document.getElementById("btl-stage");
  if (stage) {
    stage.className = `battle-stage ${btl.enemy.isRadiant ? "stage-radiant" : (btl.isBoss ? "stage-boss" : "stage-field")}`;
    document.getElementById("btl-stage-emoji").textContent = btl.enemy.emoji;
  }

  const elTag = btl.attachedElement ? `${window.MF_DATA.ELEMENTS[btl.attachedElement].icon}付着中` : "無付着";
  const debuffs = [elTag];
  if (btl.shredTurns > 0) debuffs.push(`🎯防御DOWN(${btl.shredTurns}T)`);
  if (btl.electroTurns > 0) debuffs.push(`⚡感電(${btl.electroTurns}T)`);
  document.getElementById("btl-enemy-status").textContent = debuffs.join(" / ");

  document.getElementById("btl-hp-fill").style.width = `${Math.round((btl.hp / btl.maxHp) * 100)}%`;
  document.getElementById("btl-hp-text").textContent = `HP ${btl.hp.toLocaleString()} / ${btl.maxHp.toLocaleString()}`;
  document.getElementById("btl-stagger-fill").style.width = `${Math.round((btl.stagger / btl.maxStagger) * 100)}%`;
  document.getElementById("btl-stagger-text").textContent = `体勢 ${btl.stagger}/${btl.maxStagger}`;

  const it = btl.intent;
  document.getElementById("btl-intent-box").innerHTML = `
    <div style="font-size:12px; font-weight:900;">${it.icon} 予兆：${escapeHtml(it.name)} ${it.dmg > 0 ? `（予定 ${it.dmg} DMG）` : ""}</div>
    <div style="font-size:10px; opacity:0.9; margin-top:2px;">💡 ${escapeHtml(it.hint)}</div>
  `;

  document.getElementById("btl-parts-row").innerHTML = btl.parts.map((p, i) => `
    <button class="btn-xs ${i === btl.targetPartIdx && !p.broken ? "btn-primary" : ""}" style="opacity:${p.broken ? 0.45 : 1};"
            onclick="btl.targetPartIdx=${i}; renderBattleHUD();" ${p.broken ? "disabled" : ""}>
      ${p.broken ? "💥破壊済" : "🎯"} ${p.name} ${p.broken ? "" : `${Math.ceil((p.hp / p.maxHp) * 100)}%`}
    </button>
  `).join("");

  document.getElementById("btl-chain-slots").innerHTML = [0, 1, 2].map(i => {
    const c = btl.queue[i];
    if (!c) return `<div class="chain-slot empty">${i + 1}枚目<br><span style="font-size:9px;">未選択</span></div>`;
    const el = window.MF_DATA.ELEMENTS[c.element];
    return `
      <div class="chain-slot filled" onclick="removeQueueCard(${i})">
        <div style="font-size:10px; font-weight:900;">${i + 1}番目 ${el.icon}</div>
        <div style="font-size:11px; font-weight:900; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${c.icon}${escapeHtml(c.name)}</div>
        <div style="font-size:9px; color:var(--muted);">戻す</div>
      </div>
    `;
  }).join("");

  document.getElementById("btl-preview").textContent = buildQueuePreviewText();
  document.getElementById("btl-log-box").innerHTML = btl.log.slice(0, 2).map(l => `<div>${escapeHtml(l)}</div>`).join("");

  document.getElementById("btl-team-hp-fill").style.width = `${Math.round((btl.teamHp / btl.teamMaxHp) * 100)}%`;
  document.getElementById("btl-team-hp-text").textContent = `小隊HP ${btl.teamHp}/${btl.teamMaxHp}`;
  document.getElementById("btl-shield-text").textContent = btl.shield > 0 ? `🛡️バリア+${btl.shield}` : "";
  document.getElementById("btl-ap-text").textContent = `AP ${btl.ap}/${btl.maxAp} ｜ 🌟EX ${btl.exGauge}%`;

  const execBtn = document.getElementById("btn-btl-exec");
  if (execBtn) execBtn.disabled = btl.resolving || btl.finished;

  // 模様＆属性フレーム＆キャラ顔付きのTCG風カード描画
  document.getElementById("btl-hand-grid").innerHTML = btl.hand.map(c => {
    const el = window.MF_DATA.ELEMENTS[c.element];
    const canPlay = !btl.resolving && btl.ap >= c.cost && btl.queue.length < 3;
    const typeLabel = { attack: "攻撃", break: "崩し", guard: "防御", buff: "戦術", heal: "回復", ult: "EX必殺" }[c.type] || "";
    const ch = c.ownerName !== "戦術札" ? getCharProfile(c.charId) : null;
    const artBadge = ch
      ? `<div class="hc-mini-face">${window.MF_SPRITES.portraitHTML(ch, "icon")}</div>`
      : `<div class="hc-mini-emblem">${c.icon}</div>`;

    return `
      <button class="hand-card el-pat-${c.element} type-${c.type} ${canPlay ? "" : "disabled-card"}" onclick="selectHandCard(${c.uid})">
        <div class="hc-corner-deco"></div>
        <div class="hc-top">
          <span class="hc-cost">${c.cost}</span>
          <span class="hc-type-pill">${el.icon} ${typeLabel}</span>
        </div>
        <div class="hc-mid">
          ${artBadge}
          <div style="flex:1; min-width:0;">
            <div class="hc-title">${escapeHtml(c.name)}</div>
            <div class="hc-owner">${escapeHtml(c.ownerName || "")}</div>
          </div>
        </div>
        <div class="hc-desc">${escapeHtml(c.desc)}</div>
      </button>
    `;
  }).join("");
}
