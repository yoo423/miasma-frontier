let currentRegionId = "verde";
let worldLoopId = null;
let worldState = null;

function getRegionSave(regionId) {
  state.regionProgress = state.regionProgress || {};
  if (!state.regionProgress[regionId]) {
    state.regionProgress[regionId] = { exp: 0, mistLevel: 70, beacons: 0 };
  }
  return state.regionProgress[regionId];
}

function renderWorldView() {
  renderTopBar();
  const tabsEl = document.getElementById("world-region-tabs");
  tabsEl.innerHTML = window.MF_DATA.REGIONS.map(r => {
    const locked = state.playerRank < r.reqRank;
    const short = r.name.split("：")[0];
    return `
      <button class="select-chip ${r.id === currentRegionId ? "selected" : ""}"
              style="opacity:${locked ? 0.55 : 1};"
              onclick="selectWorldRegion('${r.id}')">
        <strong>${short}</strong><br>
        <span style="font-size:9px;">${locked ? `🔒開拓Lv.${r.reqRank}` : r.rareDrop}</span>
      </button>
    `;
  }).join("");

  enterWorldRegion(currentRegionId);
}

function selectWorldRegion(regionId) {
  const reg = window.MF_DATA.REGIONS.find(r => r.id === regionId);
  if (!reg) return;
  if (state.playerRank < reg.reqRank) {
    showToast(`🔒 開拓Lv.${reg.reqRank} で解放されます（現在 Lv.${state.playerRank}）`);
    return;
  }
  currentRegionId = regionId;
  playSfx("switch");
  renderWorldView();
}

function enterWorldRegion(regionId) {
  const reg = window.MF_DATA.REGIONS.find(r => r.id === regionId) || window.MF_DATA.REGIONS[0];
  const prog = getRegionSave(regionId);

  document.getElementById("world-region-title").textContent = reg.name;
  updateWorldStatsUI();

  // フィールド上に採集ノード（鉱脈・薬草・宝箱）と徘徊霧獣を生成
  const nodes = [
    { id: "n1", type: "ore",   icon: "⛏️", name: reg.rareDrop, x: 75,  y: 62,  collected: false },
    { id: "n2", type: "herb",  icon: "🌿", name: "アーク薬草", x: 255, y: 58,  collected: false },
    { id: "n3", type: "chest", icon: "🧰", name: "古代物資箱", x: 275, y: 175, collected: false },
    { id: "n4", type: "ore",   icon: "💎", name: "結晶鉱脈",   x: 68,  y: 172, collected: false }
  ];

  const mobs = [
    { id: "m1", enemyId: reg.normalId, emoji: "🐺", label: "徘徊霧獣", x: 145, y: 68,  vx: 18,  isBoss: false },
    { id: "m2", enemyId: reg.eliteId,  emoji: "🪲", label: "精鋭個体", x: 215, y: 152, vx: -14, isBoss: false },
    { id: "m3", enemyId: reg.bossId,   emoji: "👑", label: "エリア主霧獣", x: 290, y: 112, vx: 0, isBoss: true }
  ];
  if (prog.mistLevel >= 60 && reg.radiantId) {
    mobs.push({ id: "m4", enemyId: reg.radiantId, emoji: "🌟", label: "【融光種】変異体", x: 185, y: 105, vx: 12, isBoss: true });
  }


  worldState = {
    region: reg,
    px: 120, py: 125,
    target: null,
    time: 0,
    nodes,
    mobs
  };

  bindWorldControls();
  cancelAnimationFrame(worldLoopId);
  worldLoopId = requestAnimationFrame(worldFrameLoop);
}

function updateWorldStatsUI() {
  const reg = window.MF_DATA.REGIONS.find(r => r.id === currentRegionId) || window.MF_DATA.REGIONS[0];
  const prog = getRegionSave(currentRegionId);
  const exploreLv = Math.min(10, 1 + Math.floor(prog.exp / 100));
  const modeNote = prog.mistLevel >= 60
    ? "🟣 濃霧状態（強敵＆希少素材ドロップ2倍！）"
    : "🟢 浄化安定状態（工場・安全探索向け）";

  document.getElementById("world-region-meta").innerHTML = `
    探索Lv.<strong>${exploreLv}</strong>（${prog.exp % 100}%） ｜ 霧濃度：<strong>${prog.mistLevel}%</strong><br>
    <span style="color:var(--accent);">${modeNote}</span>
  `;
}

function adjustRegionMist(delta) {
  const prog = getRegionSave(currentRegionId);
  prog.mistLevel = Math.max(0, Math.min(100, prog.mistLevel + delta));
  prog.exp += 10;
  saveGame();
  playSfx("switch");
  updateWorldStatsUI();
  showToast(delta < 0
    ? `🔆 浄化ビーコン出力UP！霧濃度 ${prog.mistLevel}%`
    : `🟣 霧誘導装置を起動！霧濃度 ${prog.mistLevel}%（レア採集効率UP）`);
}

function bindWorldControls() {
  const canvas = document.getElementById("world-canvas");
  if (!canvas || canvas._bound) return;
  canvas._bound = true;

  const moveTo = (cx, cy) => {
    if (!worldState) return;
    const rect = canvas.getBoundingClientRect();
    worldState.target = {
      x: Math.max(22, Math.min(canvas.width - 22, (cx - rect.left) * (canvas.width / rect.width))),
      y: Math.max(32, Math.min(canvas.height - 24, (cy - rect.top) * (canvas.height / rect.height)))
    };
  };
  canvas.addEventListener("pointerdown", e => moveTo(e.clientX, e.clientY));
  canvas.addEventListener("pointermove", e => { if (e.buttons > 0) moveTo(e.clientX, e.clientY); });
}

function worldFrameLoop() {
  const view = document.getElementById("view-world");
  if (!worldState || !view || !view.classList.contains("active")) return;

  worldState.time += 0.03;
  let moving = false;

  if (worldState.target) {
    const dx = worldState.target.x - worldState.px;
    const dy = worldState.target.y - worldState.py;
    const dist = Math.hypot(dx, dy);
    if (dist > 4) {
      worldState.px += (dx / dist) * 2.6;
      worldState.py += (dy / dist) * 2.6;
      moving = true;
    } else {
      worldState.target = null;
    }
  }

  // 採集ポイントとの接触判定
  worldState.nodes.forEach(n => {
    if (!n.collected && Math.hypot(worldState.px - n.x, worldState.py - n.y) < 26) {
      n.collected = true;
      worldState.target = null;
      collectWorldNode(n);
    }
  });

  // 徘徊する敵の移動＆接触エンカウント
  worldState.mobs.forEach(m => {
    if (m.vx !== 0) {
      m.x += m.vx * 0.02;
      if (m.x < 50 || m.x > 290) m.vx *= -1;
    }
    if (Math.hypot(worldState.px - m.x, worldState.py - m.y) < 28) {
      worldState.target = null;
      const eid = m.enemyId;
      switchView("battle");
      startBattle(eid);
    }
  });

  drawWorldCanvas(moving);
  worldLoopId = requestAnimationFrame(worldFrameLoop);
}

function collectWorldNode(node) {
  const prog = getRegionSave(currentRegionId);
  const mult = prog.mistLevel >= 60 ? 2 : 1;
  prog.exp += 15;
  state.materials = state.materials || {};

  if (node.type === "chest") {
    state.gems += 40 * mult;
    state.expBooks = (state.expBooks || 0) + 2 * mult;
    playSfx("gift");
    showToast(`🧰 古代物資箱を開封！💎結晶石+${40 * mult} / 📘記録+${2 * mult}`);
  } else {
    state.materials[node.name] = (state.materials[node.name] || 0) + mult;
    playSfx("switch");
    showToast(`${node.icon} ${node.name} ×${mult} を採集！（倉庫へ収納）`);
  }
  saveGame();
  renderTopBar();
  updateWorldStatsUI();
}

function drawWorldCanvas(moving) {
  const canvas = document.getElementById("world-canvas");
  if (!canvas || !worldState) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  const prog = getRegionSave(currentRegionId);

  ctx.fillStyle = worldState.region.bg;
  ctx.fillRect(0, 0, w, h);

  // 霧の濃さオーバーレイ
  ctx.fillStyle = `rgba(139, 70, 232, ${(prog.mistLevel / 100) * 0.32})`;
  ctx.fillRect(0, 0, w, h);

  // 採集ポイント描画
  ctx.font = "22px sans-serif";
  ctx.textAlign = "center";
  worldState.nodes.forEach(n => {
    if (n.collected) return;
    ctx.fillText(n.icon, n.x, n.y);
    ctx.font = "bold 9px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.fillText(n.name, n.x, n.y + 13);
    ctx.font = "22px sans-serif";
  });

  // 徘徊モンスター描画
  worldState.mobs.forEach(m => {
    window.MF_SPRITES.drawChibiUnit(ctx, {
      x: m.x, y: m.y, isEnemy: true, isBoss: m.isBoss,
      emoji: m.emoji, time: worldState.time, stateAnim: "move", facing: -1, label: m.label
    });
  });

  // 操作リーダーのSDキャラ描画
  const leaderId = state.party[0] || "protagonist";
  const leader = getCharProfile(leaderId);
  window.MF_SPRITES.drawChibiUnit(ctx, {
    x: worldState.px, y: worldState.py, charId: leaderId, element: leader.element,
    time: worldState.time, stateAnim: moving ? "move" : "idle", facing: 1,
    isEnemy: false, label: leader.name
  });
}
