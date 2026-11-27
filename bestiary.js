function getHuntEntry(enemyId) {
  state.huntLog = state.huntLog || {};
  if (!state.huntLog[enemyId]) {
    state.huntLog[enemyId] = { kills: 0, partsBroken: 0, claimedFirst: false, claimedMaster: false };
  }
  return state.huntLog[enemyId];
}

function recordHuntVictory(enemy, brokenCount) {
  if (!enemy) return { isFirstClear: false };
  const log = getHuntEntry(enemy.id);
  const isFirstClear = log.kills === 0;
  log.kills += 1;
  log.partsBroken += (brokenCount || 0);

  // 討伐勝利ごとに「🎟️ 戦術パック券」をドロップ（カードガチャ専用通貨）
  const dropTickets = enemy.rewards?.tickets || (enemy.isRadiant ? 4 : (enemy.parts.length >= 2 ? 3 : 1));
  state.cardTickets = (state.cardTickets || 0) + dropTickets;

  // デイリー＆ウィークリー任務へ自動カウント
  if (typeof addMissionProgress === "function") {
    addMissionProgress("battle", 1);
    if (brokenCount > 0) addMissionProgress("part", brokenCount);
  }

  saveGame();
  updateBestiaryBadge();
  showToast(`🎟️ 戦術パック券 ×${dropTickets} をドロップ獲得！`);
  return { isFirstClear, dropTickets };
}

function getUnclaimedBestiaryCount() {
  let count = 0;
  (window.MF_DATA.ENEMIES || []).forEach(en => {
    const log = getHuntEntry(en.id);
    if (log.kills >= 1 && !log.claimedFirst) count += 1;
    if (log.kills >= 3 && !log.claimedMaster) count += 1;
  });
  return count;
}

function updateBestiaryBadge() {
  const badge = document.getElementById("home-bestiary-badge");
  if (!badge) return;
  const cnt = getUnclaimedBestiaryCount();
  badge.style.display = cnt > 0 ? "inline-block" : "none";
  badge.textContent = cnt > 9 ? "9+" : `${cnt}件`;
}

function renderBestiaryView() {
  renderTopBar();
  const enemies = window.MF_DATA.ENEMIES || [];
  const discovered = enemies.filter(e => getHuntEntry(e.id).kills > 0).length;
  const totalKills = enemies.reduce((s, e) => s + getHuntEntry(e.id).kills, 0);

  document.getElementById("bestiary-summary").innerHTML = `
    📓 調査進捗：<strong>${discovered} / ${enemies.length}種</strong> 発見済 ｜ 累計討伐数：<strong>${totalKills}体</strong>
  `;

  document.getElementById("bestiary-list").innerHTML = enemies.map(en => {
    const log = getHuntEntry(en.id);
    const firstGems = en.isRadiant ? 240 : (en.parts.length >= 2 ? 180 : 100);
    const masterGems = Math.round(firstGems * 0.75);
    const partsTxt = en.parts.length ? en.parts.map(p => `${p.name}（${p.drop}）`).join(" / ") : "破壊可能部位なし";

    let firstBtn = `<span class="tag" style="opacity:0.6;">未討伐</span>`;
    if (log.kills >= 1 && !log.claimedFirst) {
      firstBtn = `<button class="btn-xs btn-accent2" onclick="claimBestiaryReward('${en.id}', 'first')">🏆 初討伐 💎+${firstGems} / 🎟️+2</button>`;
    } else if (log.claimedFirst) {
      firstBtn = `<span class="tag" style="background:#18b88a; color:#fff;">✓ 初討伐済</span>`;
    }

    let masterBtn = `<span class="tag" style="opacity:0.6;">熟練(${Math.min(3, log.kills)}/3)</span>`;
    if (log.kills >= 3 && !log.claimedMaster) {
      masterBtn = `<button class="btn-xs btn-primary" onclick="claimBestiaryReward('${en.id}', 'master')">⭐ 調査MAX 💎+${masterGems} / 🎟️+3</button>`;
    } else if (log.claimedMaster) {
      masterBtn = `<span class="tag" style="background:#ffd13b;">👑 調査MAX</span>`;
    }

    const radiantStyle = en.isRadiant ? "border-color:#ffd000;" : "";
    return `
      <div class="card" style="padding:10px; margin-bottom:8px; ${radiantStyle}">
        <div class="top-row">
          <strong style="font-size:13px;">${en.emoji} ${escapeHtml(en.name)}</strong>
          <span class="rank-pill">${en.rank}</span>
        </div>
        <div style="font-size:11px; color:var(--muted); margin:4px 0;">
          討伐：<strong>${log.kills}体</strong> ｜ 部位破壊：<strong>${log.partsBroken}回</strong> ｜ 🎟️券+${en.rewards?.tickets || 1}
        </div>
        <div style="font-size:10px; color:var(--muted); margin-bottom:6px;">💥 部位：${escapeHtml(partsTxt)}</div>
        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">${firstBtn}${masterBtn}</div>
      </div>
    `;
  }).join("");
}

function claimBestiaryReward(enemyId, tier) {
  const en = (window.MF_DATA.ENEMIES || []).find(e => e.id === enemyId);
  if (!en) return;
  const log = getHuntEntry(enemyId);
  const firstGems = en.isRadiant ? 240 : (en.parts.length >= 2 ? 180 : 100);

  if (tier === "first" && log.kills >= 1 && !log.claimedFirst) {
    log.claimedFirst = true;
    state.gems += firstGems;
    state.cardTickets = (state.cardTickets || 0) + 2;
    state.expBooks = (state.expBooks || 0) + 6;
    playSfx("gift");
    showToast(`🏆 初討伐報酬！💎+${firstGems} / 🎟️券+2 / 📘記録+6`);
  } else if (tier === "master" && log.kills >= 3 && !log.claimedMaster) {
    const mg = Math.round(firstGems * 0.75);
    log.claimedMaster = true;
    state.gems += mg;
    state.cardTickets = (state.cardTickets || 0) + 3;
    state.cores = (state.cores || 0) + 3;
    playSfx("gift");
    showToast(`👑 生態調査MAX！💎+${mg} / 🎟️券+3 / 💠コア+3`);
  }
  saveGame();
  updateBestiaryBadge();
  renderBestiaryView();
}
