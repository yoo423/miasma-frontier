let pvp = null;
let arenaModeTab = "rank"; // rank | local2p

const ARENA_RIVALS = [
  { name: "新人開拓・第9小隊", rankName: "ブロンズ", rating: 1000, power: 180, party: ["protagonist", "momo", "mint", "aoi"], deck: ["counter_stance", "shield_breaker", "hydro_splash", "flare_shot", "aegis_wall", "tactical_draw", "repair_kit", "spark_jab"] },
  { name: "紅蓮突撃・ルナリア隊", rankName: "シルバー", rating: 1180, power: 340, party: ["lunaria", "kaede", "koharu", "momo"], deck: ["crimson_flare", "shield_breaker", "element_boost", "counter_stance", "magma_crush", "ignition_charge", "camp_ration", "blaze_slash"] },
  { name: "氷華結界・ミコト隊", rankName: "ゴールド", rating: 1380, power: 540, party: ["mikoto", "valeria", "leila", "fiona"], deck: ["frost_seal", "mirror_aegis", "ice_pike", "tidal_surge", "sanctuary_bell", "hydro_splash", "aqua_barrier", "crystal_focus"] },
  { name: "紫電狙撃・セレスティア隊", rankName: "プラチナ", rating: 1620, power: 820, party: ["celestia", "sylphy", "chloe", "melissa"], deck: ["ssr_storm_break", "ssr_chrono_sync", "chain_spark", "sniper_lock", "tempest_dance", "prism_counter", "overclock_link", "plasma_lance"] }
];

function getArenaRankLabel(rating) {
  if (rating >= 1800) return "👑 マスター";
  if (rating >= 1550) return "💎 プラチナ";
  if (rating >= 1300) return "🥇 ゴールド";
  if (rating >= 1120) return "🥈 シルバー";
  return "🥉 ブロンズ";
}

function renderArenaView() {
  renderTopBar();
  const rating = state.arenaRating || 1000;
  const wins = state.arenaWins || 0;
  document.getElementById("arena-status-bar").innerHTML = `
    <div class="top-row">
      <strong>${getArenaRankLabel(rating)}（レート ${rating}）</strong>
      <span class="rank-pill">通算 ${wins}勝</span>
    </div>
    <div style="font-size:10.5px; color:var(--muted); margin-top:4px;">
      同時プロット3すくみ：<strong>⚔️攻撃 ＞ 💥崩し ＞ 🛡️防御 ＞ ⚔️攻撃</strong>（裏向き3枚セット→同時公開！）
    </div>
  `;

  document.getElementById("arena-lobby-panel").style.display = pvp ? "none" : "block";
  document.getElementById("arena-board-panel").style.display = pvp ? "block" : "none";
  if (pvp) { renderArenaBoard(); return; }

  document.getElementById("arena-rival-list").innerHTML = ARENA_RIVALS.map((rv, idx) => {
    const lead = window.MF_DATA.CHARACTERS[rv.party[0]] || window.MF_DATA.CHARACTERS.lunaria;
    return `
      <div class="card" style="padding:9px; margin-bottom:7px;">
        <div style="display:flex; align-items:center; gap:9px;">
          ${window.MF_SPRITES.portraitHTML(lead, "icon")}
          <div style="flex:1;">
            <strong style="font-size:12.5px;">${escapeHtml(rv.name)} <span class="tag">${rv.rankName}</span></strong>
            <div style="font-size:10px; color:var(--muted);">想定戦力 ${rv.power} ／ 報酬：🎟️パック券×2・💎+60</div>
          </div>
          <button class="btn-xs btn-accent2" onclick="startArenaMatch('rank', ${idx})">⚔️ 挑戦</button>
        </div>
      </div>
    `;
  }).join("");
}

function buildPvpSide(name, partyIds, tacticIds, powerOverride = null) {
  const safeParty = (partyIds && partyIds.length === 4) ? partyIds : ["protagonist", "momo", "mint", "aoi"];
  const totalPower = powerOverride || safeParty.reduce((s, id) => s + calcCharPower(id), 0);
  const atk = Math.round(totalPower * 0.42);
  const maxHp = Math.round(1400 + totalPower * 2.6);

  const charCards = [];
  safeParty.forEach(id => {
    const ch = window.MF_DATA.CHARACTERS[id] ? getCharProfile(id) : getCharProfile("protagonist");
    const el = ch.element;
    charCards.push(
      { id: `${id}_p1`, charId: ch.id, ownerName: ch.name, name: `${ch.name}・連撃`, type: "attack", element: el, cost: 1, icon: "⚔️", power: 1.15, summary: "⚔️攻撃115%" },
      { id: `${id}_p2`, charId: ch.id, ownerName: ch.name, name: `${ch.name}・崩し`, type: "break", element: el, cost: 1, icon: "💥", power: 1.05, summary: "💥崩し / 防御粉砕" },
      { id: `${id}_p3`, charId: ch.id, ownerName: ch.name, name: `${ch.name}・防壁`, type: "guard", element: el, cost: 1, icon: "🛡️", shield: 0.7, counterMult: 1.6, summary: "🛡️防御＆反撃" }
    );
  });

  const tList = (tacticIds && tacticIds.length >= 6 ? tacticIds : window.MF_CARDS.DEFAULT_TACTIC_DECK)
    .map(tid => window.MF_CARDS.TACTIC_CARDS[tid])
    .filter(Boolean)
    .map(c => ({ ...c, charId: safeParty[0], ownerName: "戦術札" }));

  const deck = shuffleCards([...charCards, ...tList].map(c => ({ ...c, uid: btlUidSeq++ })));
  return { name, party: safeParty, atk, hp: maxHp, maxHp, shield: 0, ap: 4, maxAp: 4, drawPile: deck, discardPile: [], hand: [], queue: [], attachedEl: null };
}

function drawPvpCards(side, count) {
  for (let i = 0; i < count; i++) {
    if (side.hand.length >= 6) break;
    if (side.drawPile.length === 0) {
      if (side.discardPile.length === 0) break;
      side.drawPile = shuffleCards(side.discardPile);
      side.discardPile = [];
    }
    side.hand.push(side.drawPile.pop());
  }
}

function startArenaMatch(mode, param) {
  const myParty = [...state.party];
  const myTactics = [...(state.tacticDeck || window.MF_CARDS.DEFAULT_TACTIC_DECK)];
  const p1 = buildPvpSide(`${state.playerName}小隊`, myParty, myTactics);

  let p2 = null;
  let rewardInfo = { gems: 60, tickets: 2, ratingGain: 24 };

  if (mode === "rank") {
    const rv = ARENA_RIVALS[param] || ARENA_RIVALS[0];
    p2 = buildPvpSide(rv.name, rv.party, rv.deck, rv.power);
    rewardInfo = { gems: 60 + param * 25, tickets: 2, ratingGain: 22 + param * 6 };
  } else if (mode === "friend" && param) {
    p2 = buildPvpSide(`${param.name}小隊`, param.party, param.deck, param.power);
    rewardInfo = { gems: 40, tickets: 1, ratingGain: 0 };
  } else {
    // 1台2人・ローカル読み合い対戦（P2も同じ戦力条件でフェアに対戦）
    const p1Power = myParty.reduce((s, id) => s + calcCharPower(id), 0);
    p2 = buildPvpSide("プレイヤー2小隊", ["lunaria", "mikoto", "celestia", "valeria"], window.MF_CARDS.DEFAULT_TACTIC_DECK, p1Power);
    rewardInfo = { gems: 0, tickets: 1, ratingGain: 0 };
  }

  drawPvpCards(p1, 5);
  drawPvpCards(p2, 5);

  pvp = {
    mode, rewardInfo, turn: 1,
    phase: "p1_select", // p1_select | handoff | p2_select | resolving | finished
    p1, p2,
    revealSlot: -1,
    log: [`🏆 ${p1.name} vs ${p2.name}！裏向きで最大3枚をセットし、同時オープンで読み合え！`]
  };

  if (window.MF_AUDIO) window.MF_AUDIO.playBgm("boss");
  playSfx("switch");
  switchView("arena");
}

function getActivePvpSide() {
  if (!pvp) return null;
  return pvp.phase === "p2_select" ? pvp.p2 : pvp.p1;
}

function selectPvpCard(uid) {
  const side = getActivePvpSide();
  if (!side || (pvp.phase !== "p1_select" && pvp.phase !== "p2_select")) return;
  if (side.queue.length >= 3) { showToast("セットできるのは最大3枚まで！"); return; }
  const idx = side.hand.findIndex(c => c.uid === uid);
  if (idx < 0) return;
  const c = side.hand[idx];
  if (side.ap < c.cost) { showToast(`AP不足（必要 AP${c.cost}）`); return; }
  side.ap -= c.cost;
  side.hand.splice(idx, 1);
  side.queue.push(c);
  playSfx("tap");
  renderArenaBoard();
}

function removePvpSlot(slotIdx) {
  const side = getActivePvpSide();
  if (!side || (pvp.phase !== "p1_select" && pvp.phase !== "p2_select")) return;
  const c = side.queue.splice(slotIdx, 1)[0];
  if (!c) return;
  side.ap += c.cost;
  side.hand.push(c);
  playSfx("tap");
  renderArenaBoard();
}

function confirmPvpPlot() {
  if (!pvp) return;
  if (pvp.phase === "p1_select") {
    if (pvp.mode === "local2p") {
      pvp.phase = "handoff";
      playSfx("switch");
      renderArenaBoard();
      return;
    }
    // AIが裏向きで最大3枚を思考セット
    autoPlotAiSide(pvp.p2);
    startSimultaneousResolve();
  } else if (pvp.phase === "p2_select") {
    startSimultaneousResolve();
  }
}

function proceedFromHandoff() {
  if (!pvp || pvp.phase !== "handoff") return;
  pvp.phase = "p2_select";
  playSfx("switch");
  renderArenaBoard();
}

function autoPlotAiSide(ai) {
  ai.queue = [];
  const pool = shuffleCards(ai.hand);
  for (const c of pool) {
    if (ai.queue.length >= 3) break;
    if (ai.ap >= c.cost) {
      ai.ap -= c.cost;
      ai.hand = ai.hand.filter(x => x.uid !== c.uid);
      ai.queue.push(c);
    }
  }
}

function getClashCategory(card) {
  if (!card) return "none";
  if (card.type === "break") return "break";
  if (card.type === "guard") return "guard";
  if (card.type === "attack" || card.type === "ult") return "attack";
  return "support";
}

function startSimultaneousResolve() {
  pvp.phase = "resolving";
  pvp.revealSlot = 0;
  pvp.log.unshift(`━━ TURN ${pvp.turn}：両者同時オープン！ ━━`);
  renderArenaBoard();

  let i = 0;
  const stepClash = () => {
    if (!pvp || pvp.phase === "finished") return;
    if (i >= 3) {
      setTimeout(() => endPvpTurn(), 900);
      return;
    }
    pvp.revealSlot = i;
    resolveClashSlot(i);
    renderArenaBoard();
    i += 1;
    if (pvp.phase !== "finished") setTimeout(stepClash, 1150);
  };
  setTimeout(stepClash, 450);
}

function resolveClashSlot(slotIdx) {
  const c1 = pvp.p1.queue[slotIdx] || null;
  const c2 = pvp.p2.queue[slotIdx] || null;
  if (!c1 && !c2) return;

  const k1 = getClashCategory(c1);
  const k2 = getClashCategory(c2);
  let mult1 = 1.0, mult2 = 1.0, cancel1 = false, cancel2 = false;
  let clashMsg = "";

  // 3すくみ読み合い判定（⚔️攻撃 ＞ 💥崩し ＞ 🛡️防御 ＞ ⚔️攻撃）
  if (k1 === "attack" && k2 === "break") { mult1 = 1.45; cancel2 = true; clashMsg = "⚔️ P1の攻撃がP2の崩しを先制潰し！"; playSfx("slash"); }
  else if (k2 === "attack" && k1 === "break") { mult2 = 1.45; cancel1 = true; clashMsg = "⚔️ 相手の攻撃がP1の崩しを潰した！"; playSfx("hit"); }
  else if (k1 === "break" && k2 === "guard") { mult1 = 1.85; cancel2 = true; pvp.p2.shield = 0; clashMsg = "💥 P1の崩しが相手の防御を完全粉砕！"; playSfx("break"); }
  else if (k2 === "break" && k1 === "guard") { mult2 = 1.85; cancel1 = true; pvp.p1.shield = 0; clashMsg = "💥 相手の崩しでP1の防御が割られた！"; playSfx("break"); }
  else if (k1 === "guard" && k2 === "attack") { mult2 = 0.3; clashMsg = "🛡️ P1の見切り防御！攻撃を弾いて反撃！"; playSfx("guard"); }
  else if (k2 === "guard" && k1 === "attack") { mult1 = 0.3; clashMsg = "🛡️ 相手の見切り防御！攻撃を弾かれた！"; playSfx("guard"); }
  else { clashMsg = `⚡ スロット${slotIdx + 1} 同時発動！`; playSfx("switch"); }

  pvp.log.unshift(`[${slotIdx + 1}枚目] ${clashMsg}`);
  if (c1 && !cancel1) applyPvpCardEffect(pvp.p1, pvp.p2, c1, mult1, k1 === "guard" && k2 === "attack");
  if (c2 && !cancel2) applyPvpCardEffect(pvp.p2, pvp.p1, c2, mult2, k2 === "guard" && k1 === "attack");
  if (pvp.log.length > 5) pvp.log.length = 5;

  if (pvp.p2.hp <= 0) finishArenaMatch(true);
  else if (pvp.p1.hp <= 0) finishArenaMatch(false);
}

function applyPvpCardEffect(actor, target, card, mult, counterHit) {
  if (card.healRatio) {
    const h = Math.round(actor.maxHp * card.healRatio * 0.7);
    actor.hp = Math.min(actor.maxHp, actor.hp + h);
  }
  if (card.shield) actor.shield += Math.round(actor.maxHp * card.shield * 0.22);
  if (card.draw) drawPvpCards(actor, card.draw);
  if (card.apGain) actor.ap = Math.min(6, actor.ap + card.apGain);

  let dmg = 0;
  if (card.power) {
    dmg = Math.round(actor.atk * card.power * mult);
    if (target.attachedEl && target.attachedEl !== card.element) {
      dmg = Math.round(dmg * 1.45);
      target.attachedEl = null;
      pvp.log.unshift(`✨ ${actor.name}の元素反応が炸裂！`);
    } else {
      target.attachedEl = card.element;
    }
  } else if (counterHit) {
    dmg = Math.round(actor.atk * (card.counterMult || 1.6) * 0.85);
  }

  if (dmg > 0) {
    if (target.shield > 0) {
      const ab = Math.min(target.shield, dmg);
      target.shield -= ab; dmg -= ab;
    }
    target.hp = Math.max(0, target.hp - dmg);
  }
}

function endPvpTurn() {
  if (!pvp || pvp.phase === "finished") return;
  [pvp.p1, pvp.p2].forEach(s => {
    s.discardPile.push(...s.queue);
    s.queue = [];
    s.ap = s.maxAp;
    s.shield = Math.floor(s.shield * 0.5);
    drawPvpCards(s, Math.max(2, 5 - s.hand.length));
  });
  pvp.turn += 1;
  pvp.revealSlot = -1;
  pvp.phase = "p1_select";
  renderArenaBoard();
}

function finishArenaMatch(p1Won) {
  pvp.phase = "finished";
  const rw = pvp.rewardInfo;
  if (p1Won) {
    playSfx("gift");
    state.arenaWins = (state.arenaWins || 0) + 1;
    state.arenaRating = (state.arenaRating || 1000) + (rw.ratingGain || 0);
    state.gems += (rw.gems || 0);
    state.cardTickets = (state.cardTickets || 0) + (rw.tickets || 0);
    if (typeof addMissionProgress === "function") addMissionProgress("battle", 1);
    saveGame();
    renderTopBar();
  }
  const title = pvp.mode === "local2p" ? (p1Won ? "🏆 プレイヤー1の勝利！" : "🏆 プレイヤー2の勝利！") : (p1Won ? "🏆 読み合い勝利！" : "💀 惜敗……");
  const rwHtml = p1Won && (rw.gems || rw.tickets || rw.ratingGain)
    ? `<div style="background:rgba(24,184,138,0.16); border:1.5px solid #18b88a; border-radius:10px; padding:8px; font-size:12px; font-weight:900; margin:10px 0;">報酬：${rw.ratingGain ? `レート+${rw.ratingGain} / ` : ""}${rw.gems ? `💎+${rw.gems} / ` : ""}🎟️パック券+${rw.tickets || 0}</div>`
    : "";

  document.getElementById("btl-result-modal-body").innerHTML = `
    <div style="font-size:48px;">${p1Won ? "🏆" : "💥"}</div>
    <h3 style="margin:4px 0;">${title}</h3>
    <div style="font-size:11px; color:var(--muted);">${pvp.p1.name} vs ${pvp.p2.name}（${pvp.turn}ターン）</div>
    ${rwHtml}
    <button class="btn-primary" style="width:100%; padding:12px;" onclick="exitArenaMatch()">アリーナロビーへ戻る</button>
  `;
  document.getElementById("modal-battle-result").classList.add("active");
}

function exitArenaMatch() {
  document.getElementById("modal-battle-result").classList.remove("active");
  pvp = null;
  if (window.MF_AUDIO) window.MF_AUDIO.playBgm("home");
  renderArenaView();
}

function renderArenaBoard() {
  if (!pvp) return;
  const handoffBox = document.getElementById("arena-handoff-box");
  const mainBox = document.getElementById("arena-main-box");

  if (pvp.phase === "handoff") {
    handoffBox.style.display = "block";
    mainBox.style.display = "none";
    return;
  }
  handoffBox.style.display = "none";
  mainBox.style.display = "block";

  const active = getActivePvpSide();
  const isRes = pvp.phase === "resolving" || pvp.phase === "finished";
  document.getElementById("arena-turn-label").textContent =
    `TURN ${pvp.turn} ｜ ${isRes ? "⚡ 同時オープン中！" : `${active.name} の伏せセット`}`;

  // 相手（P2）と自分（P1）のHP表示
  document.getElementById("arena-p2-label").textContent = `${pvp.p2.name} HP ${pvp.p2.hp}/${pvp.p2.maxHp}${pvp.p2.shield ? ` 🛡️+${pvp.p2.shield}` : ""}`;
  document.getElementById("arena-p2-fill").style.width = `${Math.round((pvp.p2.hp / pvp.p2.maxHp) * 100)}%`;
  document.getElementById("arena-p1-label").textContent = `${pvp.p1.name} HP ${pvp.p1.hp}/${pvp.p1.maxHp}${pvp.p1.shield ? ` 🛡️+${pvp.p1.shield}` : ""}`;
  document.getElementById("arena-p1-fill").style.width = `${Math.round((pvp.p1.hp / pvp.p1.maxHp) * 100)}%`;

  // 相手（上段）の3スロット（オープン前は裏向き）
  document.getElementById("arena-p2-slots").innerHTML = [0, 1, 2].map(i => {
    const c = pvp.p2.queue[i];
    const show = (pvp.phase === "p2_select") || (isRes && i <= pvp.revealSlot);
    if (!c) return `<div class="pm-slot empty"><span style="font-size:10px;">${i + 1}st</span></div>`;
    if (!show) return `<div class="pm-slot filled" style="background:#2d2444;"><span style="font-size:20px;">🎴</span><span style="font-size:9px; color:#ffd000;">SET済</span></div>`;
    return `<div class="pm-slot filled el-pat-${c.element}" ${pvp.phase === "p2_select" ? `onclick="removePvpSlot(${i})"` : ""}><div style="font-size:18px;">${c.icon}</div><div style="font-size:9px; color:#fff; font-weight:900;">${escapeHtml(c.name)}</div></div>`;
  }).join("");

  // 自分（下段）の3スロット
  document.getElementById("arena-p1-slots").innerHTML = [0, 1, 2].map(i => {
    const c = pvp.p1.queue[i];
    const show = (pvp.phase === "p1_select") || (isRes && i <= pvp.revealSlot);
    if (!c) return `<div class="pm-slot empty"><span style="font-size:10px;">${i + 1}st</span></div>`;
    if (!show) return `<div class="pm-slot filled" style="background:#243444;"><span style="font-size:20px;">🎴</span><span style="font-size:9px; color:#00e5ff;">SET済</span></div>`;
    return `<div class="pm-slot filled el-pat-${c.element}" ${pvp.phase === "p1_select" ? `onclick="removePvpSlot(${i})"` : ""}><div style="font-size:18px;">${c.icon}</div><div style="font-size:9px; color:#fff; font-weight:900;">${escapeHtml(c.name)}</div></div>`;
  }).join("");

  document.getElementById("arena-log").innerHTML = pvp.log.slice(0, 3).map(l => `<div>${escapeHtml(l)}</div>`).join("");
  document.getElementById("arena-ap-label").textContent = `⚡ ${active.name} 残りAP：${active.ap} / ${active.maxAp}`;
  document.getElementById("btn-arena-confirm").disabled = isRes;

  document.getElementById("arena-hand-tray").innerHTML = active.hand.map(c => {
    const el = window.MF_DATA.ELEMENTS[c.element];
    const can = !isRes && active.ap >= c.cost && active.queue.length < 3;
    const typeLabel = { attack: "⚔️攻撃", break: "💥崩し", guard: "🛡️防御", buff: "✨戦術", heal: "💚回復" }[c.type] || "";
    return `
      <div class="tcg-card el-pat-${c.element} ${can ? "" : "disabled-card"}" onclick="selectPvpCard(${c.uid})">
        <div class="tcg-head"><span class="tcg-name">${escapeHtml(c.name)}</span><span class="tcg-cost">${c.cost}</span></div>
        <div class="tcg-art-box tactic-art"><span class="tcg-big-icon">${c.icon}</span></div>
        <div class="tcg-meta"><span>${el.icon}${typeLabel}</span></div>
        <div class="tcg-foot"><span class="tcg-sum">${escapeHtml(c.summary || "")}</span></div>
      </div>
    `;
  }).join("");
}
