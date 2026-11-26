let editingSlotIndex = null;
let selectedDetailCharId = "protagonist";

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

function getCharStats(charId) {
  const power = calcCharPower(charId);
  return {
    power,
    hp: Math.round(power * 3.2),
    atk: Math.round(power * 0.42),
    def: Math.round(power * 0.24)
  };
}

function getSortedOwnedIds() {
  const rarityOrder = { SSR: 0, SR: 1, R: 2, N: 3 };
  return [...state.ownedChars].sort((a, b) => {
    if (a === "protagonist") return -1;
    if (b === "protagonist") return 1;
    const ca = getCharProfile(a), cb = getCharProfile(b);
    return (rarityOrder[ca.rarity] ?? 9) - (rarityOrder[cb.rarity] ?? 9);
  });
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

// ---------- 1人1画面・キャラクター詳細＆育成ビュー ----------
function openCharDetail(charId) {
  selectedDetailCharId = charId;
  switchView("char_detail");
}

function cycleDetailChar(delta) {
  const list = getSortedOwnedIds();
  const idx = list.indexOf(selectedDetailCharId);
  const next = (idx + delta + list.length) % list.length;
  selectedDetailCharId = list[next];
  playSfx("tap");
  renderCharDetailView();
}

function renderCharDetailView() {
  renderTopBar();
  if (!state.ownedChars.includes(selectedDetailCharId)) {
    selectedDetailCharId = "protagonist";
  }

  const id = selectedDetailCharId;
  const ch = getCharProfile(id);
  const el = window.MF_DATA.ELEMENTS[ch.element];
  const wp = window.MF_DATA.WEAPONS[ch.weapon];
  const lv = state.charLevels[id] || 1;
  const rank = state.charRanks[id] || 0;
  const dupe = state.charDupes[id] || 0;
  const cap = getRankCap(rank);
  const stats = getCharStats(id);
  const nextCost = getLevelUpCost(lv);
  const ascReq = getAscensionCost(rank);
  const list = getSortedOwnedIds();
  const posText = `${list.indexOf(id) + 1} / ${list.length}`;

  document.getElementById("cd-header-title").textContent = `${ch.name}（${posText}）`;

  // 大きな立ち絵＆セリフ
  const line = ch.voiceLines?.[Math.floor(Math.random() * ch.voiceLines.length)] || "作戦準備完了です！";
  document.getElementById("cd-hero-box").innerHTML = `
    <div style="display:grid; grid-template-columns:138px 1fr; gap:10px; align-items:center;">
      <div class="portrait-frame" style="width:138px; height:180px;">
        <img src="${ch.image}" alt="${escapeHtml(ch.name)}"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <div class="portrait-fallback" style="display:none;">
          <span style="font-size:54px;">${ch.emoji}</span>
          <span style="font-size:11px; font-weight:900;">${escapeHtml(ch.name)}</span>
        </div>
      </div>
      <div>
        <div style="display:flex; gap:5px; align-items:center; flex-wrap:wrap; margin-bottom:5px;">
          <span class="rank-pill" style="font-size:12px;">${ch.rarity} RANK</span>
          <span class="tag" style="background:#ffd13b;">凸 +${dupe} / 5</span>
        </div>
        <h3 style="margin:0 0 4px; font-size:18px;">${escapeHtml(ch.name)}</h3>
        <div style="font-size:11px; font-weight:900; margin-bottom:6px;">
          ${el.icon} ${el.name}属性 ｜ ${wp.icon} ${wp.name}<br>
          🐾 ${ch.kemonomimi}
        </div>
        <div class="speech-bubble" style="font-size:11px;" onclick="playSfx('switch'); renderCharDetailView();">
          💬「${escapeHtml(line)}」
        </div>
      </div>
    </div>
  `;

  // ステータス＆限界突破ゲージ
  const stars = Array.from({ length: 5 }, (_, i) => (i < dupe ? "★" : "☆")).join("");
  document.getElementById("cd-stats-box").innerHTML = `
    <div class="stat-grid">
      <div class="stat-cell"><span>戦力</span><strong>⚔️ ${stats.power}</strong></div>
      <div class="stat-cell"><span>HP</span><strong>💚 ${stats.hp}</strong></div>
      <div class="stat-cell"><span>攻撃力</span><strong>🔥 ${stats.atk}</strong></div>
      <div class="stat-cell"><span>防御力</span><strong>🛡️ ${stats.def}</strong></div>
    </div>
    <div style="font-size:11px; margin-top:8px; background:var(--surface-sub); padding:7px 9px; border-radius:10px;">
      <div><strong>限界突破：</strong><span style="color:#ff9f1c; font-size:13px;">${stars}</span>（全ステータス +${dupe * 8}%）</div>
      <div style="margin-top:3px;"><strong>🏭 拠点特技：</strong>${ch.campSkill}</div>
    </div>
  `;

  // レベルアップ・昇格操作エリア
  const pct = Math.min(100, Math.round((lv / cap) * 100));
  let growthControls = "";
  if (lv >= cap && ascReq) {
    growthControls = `
      <div style="font-size:11px; color:var(--accent-2); font-weight:900; margin-bottom:6px;">
        ⚠️ 現在のレベル上限（Lv.${cap}）に到達しています！
      </div>
      <button class="btn-accent2" style="width:100%; padding:11px;" onclick="attemptAscensionTrial('${id}')">
        🏆 ${ascReq.trialName} に挑む<br>
        <span style="font-size:10px;">必要：💠元素コア ${ascReq.cores}個 / 🪙${ascReq.credits.toLocaleString()} / 推奨戦力 ${ascReq.reqPower}</span>
      </button>
    `;
  } else if (lv < 100) {
    growthControls = `
      <div style="font-size:11px; color:var(--muted); margin-bottom:6px;">
        所持素材：📘 作戦記録 <strong>${state.expBooks || 0}冊</strong> ｜ 🪙 <strong>${state.credits.toLocaleString()}</strong>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
        <button class="btn-primary" onclick="levelUpCharacter('${id}', 1)">
          +1 レベル強化<br><span style="font-size:10px;">記録${nextCost.books} / 🪙${nextCost.credits.toLocaleString()}</span>
        </button>
        <button onclick="levelUpCharacter('${id}', 5)">
          +5 まとめて強化<br><span style="font-size:10px;">上限Lv.${cap}まで</span>
        </button>
      </div>
    `;
  } else {
    growthControls = `<div class="tag" style="background:#ffd13b; font-size:13px;">👑 マスター領域 MAX Lv.100 達成！</div>`;
  }

  document.getElementById("cd-growth-box").innerHTML = `
    <div class="top-row" style="margin-bottom:4px;">
      <strong style="font-size:14px;">Lv.${lv} / ${cap}</strong>
      <span style="font-size:11px; color:var(--muted);">昇格ランク ${rank} / 4</span>
    </div>
    <div class="gauge-bar" style="margin-bottom:10px;">
      <div style="background:var(--accent); width:${pct}%;"></div>
    </div>
    ${growthControls}
  `;

  // 主人公専用：その場で武器・属性切替
  const protagBox = document.getElementById("cd-protag-box");
  if (ch.isProtagonist) {
    protagBox.style.display = "block";
    document.getElementById("cd-element-grid").innerHTML = Object.values(window.MF_DATA.ELEMENTS).map(e => `
      <button class="select-chip ${state.protagonistElement === e.id ? "selected" : ""}"
              onclick="setProtagonistElement('${e.id}')">
        ${e.icon} <strong>${e.name}</strong>
      </button>
    `).join("");
    document.getElementById("cd-weapon-grid").innerHTML = Object.values(window.MF_DATA.WEAPONS).map(w => `
      <button class="select-chip ${state.protagonistWeapon === w.id ? "selected" : ""}"
              onclick="setProtagonistWeapon('${w.id}')">
        ${w.icon} <strong>${w.name}</strong>
      </button>
    `).join("");
  } else {
    protagBox.style.display = "none";
  }
}

function levelUpCharacter(charId, steps) {
  const ch = getCharProfile(charId);
  let lv = state.charLevels[charId] || 1;
  const rank = state.charRanks[charId] || 0;
  const cap = getRankCap(rank);

  if (lv >= cap) {
    showToast(`上限Lv.${cap}に到達！「昇格試練」で上限を解放してください`);
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
  renderCharDetailView();
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

  if (ch.isProtagonist) {
    const nextRar = rank + 1 === 1 ? "SR" : (rank + 1 >= 2 ? "SSR" : "R");
    window.MF_DATA.CHARACTERS.protagonist.rarity = nextRar;
  }

  saveGame();
  playSfx("gift");
  renderTopBar();
  renderCharDetailView();
  showToast(`🏆 ${req.trialName} 突破！上限が Lv.${getRankCap(rank + 1)} に解放！`);
}
