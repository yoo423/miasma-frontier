let editingSlotIndex = null;

// 重厚な経験値カーブ（後半・マスター領域Lv.80〜100は非常に重い）
function getLevelUpCost(currentLv) {
  if (currentLv < 20) {
    return { books: 1 + Math.floor(currentLv / 5), credits: 150 * currentLv };
  }
  if (currentLv < 60) {
    return { books: 4 + Math.floor((currentLv - 20) / 3), credits: 450 * currentLv };
  }
  if (currentLv < 80) {
    return { books: 18 + (currentLv - 60), credits: 1200 * currentLv };
  }
  // Lv.80〜100 マスター領域
  return { books: 45 + (currentLv - 80) * 3, credits: 3500 * currentLv };
}

function getRankCap(rank) {
  return [20, 40, 60, 80, 100][rank] || 20;
}

function getAscensionCost(rank) {
  const table = [
    { cores: 3,  credits: 3000,  reqPower: 120, trialName: "第1試練：草原の結晶獣" },
    { cores: 8,  credits: 10000, reqPower: 320, trialName: "第2試練：峡谷の雷翼獣" },
    { cores: 18, credits: 30000, reqPower: 650, trialName: "第3試練：氷結の守護機" },
    { cores: 35, credits: 80000, reqPower: 1100, trialName: "最終試練：マスター領域覚醒" }
  ];
  return table[rank] || null;
}

function calcCharPower(charId) {
  const ch = getCharProfile(charId);
  const lv = state.charLevels[charId] || 1;
  const rank = state.charRanks[charId] || 0;
  const dupe = state.charDupes[charId] || 0;
  const rarityMult = ch.rarity === "SSR" ? 1.35 : (ch.rarity === "SR" ? 1.18 : (ch.rarity === "R" ? 1.05 : 1.0));
  return Math.round((80 + lv * 14 + rank * 45) * rarityMult * (1 + dupe * 0.08));
}

function renderPartyEditor() {
  const box = document.getElementById("sq-party-editor");
  box.innerHTML = state.party.map((id, idx) => {
    const m = getCharProfile(id);
    const el = window.MF_DATA.ELEMENTS[m.element];
    const lv = state.charLevels[id] || 1;
    const isEditing = editingSlotIndex === idx;
    return `
      <div class="party-slot ${isEditing ? "selected" : ""}"
           style="${isEditing ? "background:var(--accent); color:#121318;" : ""}"
           onclick="openSlotPicker(${idx})">
        <span class="slot-icon">${m.emoji}</span>
        <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(m.name)}</div>
        <div style="font-size:10px; opacity:0.85;">${el.icon} Lv.${lv}</div>
        <div style="font-size:9px; margin-top:2px; font-weight:900;">${idx === 0 ? "★リーダー" : "タップ変更"}</div>
      </div>
    `;
  }).join("");

  const picker = document.getElementById("sq-slot-picker");
  if (editingSlotIndex === null) {
    picker.style.display = "none";
    return;
  }
  picker.style.display = "block";
  const candidates = state.ownedChars.filter(
    id => !state.party.includes(id) || state.party[editingSlotIndex] === id
  );
  picker.innerHTML = `
    <div style="font-size:11px; font-weight:900; margin-bottom:6px;">
      枠${editingSlotIndex + 1}に編成する隊員を選択：
    </div>
    <div class="chip-grid">
      ${candidates.map(id => {
        const c = getCharProfile(id);
        const el = window.MF_DATA.ELEMENTS[c.element];
        return `
          <button class="select-chip ${state.party[editingSlotIndex] === id ? "selected" : ""}"
                  onclick="assignPartySlot(${editingSlotIndex}, '${id}')">
            ${c.emoji} <strong>${escapeHtml(c.name)}</strong> (${c.rarity})<br>
            <span style="font-size:10px;">${el.icon}${el.name} / Lv.${state.charLevels[id] || 1}</span>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function openSlotPicker(idx) {
  playSfx("tap");
  editingSlotIndex = editingSlotIndex === idx ? null : idx;
  renderPartyEditor();
}

function assignPartySlot(slotIdx, charId) {
  state.party[slotIdx] = charId;
  editingSlotIndex = null;
  saveGame();
  playSfx("switch");
  renderSquadView();
  showToast(`${getCharProfile(charId).name} を編成しました！`);
}

function levelUpCharacter(charId, steps) {
  const ch = getCharProfile(charId);
  let lv = state.charLevels[charId] || 1;
  const rank = state.charRanks[charId] || 0;
  const cap = getRankCap(rank);

  if (lv >= cap) {
    showToast(`上限Lv.${cap}に到達！下の「昇格試練」で上限を解放してください`);
    return;
  }

  let leveled = 0;
  for (let i = 0; i < steps; i++) {
    if (lv >= cap) break;
    const cost = getLevelUpCost(lv);
    if ((state.expBooks || 0) < cost.books || state.credits < cost.credits) {
      if (leveled === 0) {
        showToast(`素材不足（作戦記録 ${cost.books}冊 / 🪙${cost.credits.toLocaleString()} 必要）`);
        return;
      }
      break;
    }
    state.expBooks -= cost.books;
    state.credits -= cost.credits;
    lv += 1;
    leveled += 1;
  }

  state.charLevels[charId] = lv;
  saveGame();
  playSfx("switch");
  renderTopBar();
  renderSquadView();
  showToast(`${ch.name} が Lv.${lv} にアップ！（戦力 ${calcCharPower(charId)}）`);
}

function attemptAscensionTrial(charId) {
  const ch = getCharProfile(charId);
  const rank = state.charRanks[charId] || 0;
  const req = getAscensionCost(rank);
  if (!req) return;

  if ((state.cores || 0) < req.cores || state.credits < req.credits) {
    showToast(`試練素材不足（元素コア ${req.cores}個 / 🪙${req.credits.toLocaleString()} 必要）`);
    return;
  }

  const teamPower = state.party.reduce((sum, id) => sum + calcCharPower(id), 0);
  if (teamPower < req.reqPower) {
    showToast(`⚠️ 戦力不足！小隊総戦力 ${req.reqPower} 以上で挑めます（現在 ${teamPower}）`);
    return;
  }

  state.cores -= req.cores;
  state.credits -= req.credits;
  state.charRanks[charId] = rank + 1;

  // 主人公は昇格試練突破でレアリティ自体が R -> SR -> SSR に進化！
  if (ch.isProtagonist) {
    const nextRar = rank + 1 === 1 ? "SR" : (rank + 1 >= 2 ? "SSR" : "R");
    window.MF_DATA.CHARACTERS.protagonist.rarity = nextRar;
  }

  saveGame();
  playSfx("gift");
  renderTopBar();
  renderSquadView();
  showToast(`🏆 ${req.trialName} 突破！${ch.name}の上限が Lv.${getRankCap(rank + 1)} に解放！`);
}
