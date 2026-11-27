window.MF_CARDS = {
  TACTIC_CARDS: {
    ...(window.MF_CARDS_PART1 || {}),
    ...(window.MF_CARDS_PART2 || {})
  },

  STARTER_OWNED_CARDS: {
    counter_stance: 1, aegis_wall: 1, shield_breaker: 1, shock_trap: 1,
    element_boost: 1, tactical_draw: 1, weak_scan: 1, repair_kit: 1,
    hydro_splash: 1, camp_ration: 1, ember_jab: 1, spark_jab: 1,
    frost_shard: 1, arc_bolt: 1
  },

  DEFAULT_TACTIC_DECK: [
    "counter_stance", "aegis_wall", "shield_breaker", "shock_trap",
    "element_boost", "tactical_draw", "repair_kit", "hydro_splash"
  ],

  MIN_TACTIC_SIZE: 8,
  MAX_TACTIC_SIZE: 28,
  MAX_COPIES: 3,
  MAX_DECK_SLOTS: 5,

  DEX_MILESTONES: [
    { count: 15,  gems: 320,  label: "15種収集ボーナス" },
    { count: 25,  gems: 480,  label: "25種収集ボーナス" },
    { count: 40,  gems: 640,  label: "40種収集ボーナス" },
    { count: 60,  gems: 960,  label: "60種収集ボーナス" },
    { count: 80,  gems: 1280, label: "80種収集ボーナス" },
    { count: 102, gems: 2400, label: "全102種コンプリート！" }
  ],

  ensureDeckSlots() {
    if (!Array.isArray(state.deckSlots) || state.deckSlots.length < this.MAX_DECK_SLOTS) {
      const firstCards = (Array.isArray(state.tacticDeck) && state.tacticDeck.length >= this.MIN_TACTIC_SIZE)
        ? [...state.tacticDeck] : [...this.DEFAULT_TACTIC_DECK];
      state.deckSlots = [
        { name: "バランス主力", cards: firstCards },
        { name: "対ボス攻略",   cards: [...this.DEFAULT_TACTIC_DECK] },
        { name: "元素コンボ",   cards: [...this.DEFAULT_TACTIC_DECK] },
        { name: "対人読み合い", cards: [...this.DEFAULT_TACTIC_DECK] },
        { name: "自由デッキ5",  cards: [...this.DEFAULT_TACTIC_DECK] }
      ];
      state.activeDeckIdx = 0;
    }
    if (typeof state.activeDeckIdx !== "number" || state.activeDeckIdx < 0 || state.activeDeckIdx >= this.MAX_DECK_SLOTS) {
      state.activeDeckIdx = 0;
    }
    // 常に state.tacticDeck と現在選択中スロットを完全同期
    state.tacticDeck = state.deckSlots[state.activeDeckIdx].cards;
    return state.deckSlots[state.activeDeckIdx];
  },

  getCardLevel(cardId) {
    state.ownedCards = state.ownedCards || { ...this.STARTER_OWNED_CARDS };
    return state.ownedCards[cardId] || 0;
  },

  getLeveledTacticCard(tid) {
    const base = this.TACTIC_CARDS[tid];
    if (!base) return null;
    const lv = Math.max(1, this.getCardLevel(tid));
    const mult = 1 + (lv - 1) * 0.12;
    return {
      ...base, cardLv: lv,
      power: base.power ? Number((base.power * mult).toFixed(2)) : undefined,
      shield: base.shield ? Number((base.shield * mult).toFixed(2)) : undefined,
      healRatio: base.healRatio ? Number((base.healRatio * mult).toFixed(2)) : undefined,
      counterMult: base.counterMult ? Number((base.counterMult * mult).toFixed(2)) : undefined,
      charId: state.party[0] || "protagonist",
      ownerName: `戦術札 Lv.${lv}`
    };
  },

  getCharCards(charId) {
    const ch = getCharProfile(charId);
    const el = ch.element;
    const sk = ch.skills || { normal: "通常攻撃", active: "固有戦技", ult: "必殺連携" };
    const treeLv = typeof getSkillTreeStage === "function" ? getSkillTreeStage(charId) : 0;
    const mult = 1 + treeLv * 0.08;
    const shortName = (txt, fb) => (txt ? txt.split("：")[0] : fb);
    const isHealer = ch.weapon === "staff" || charId === "fiona" || charId === "medibot";
    const isShielder = charId === "chloe" || charId === "ran" || charId === "guardko";

    return [
      { id: `${charId}_c1`, charId, ownerName: ch.name, rarity: ch.rarity, name: shortName(sk.normal, "通常連撃"), type: "attack", element: el, cost: 1, icon: "⚔️", power: Number((1.15 * mult).toFixed(2)), stagger: 14, exGain: 15, summary: `⚔️ ${Math.round(115 * mult)}% / 元素起点`, desc: `${ch.name}の基本攻撃。元素反応の1枚目として使いやすい。` },
      { id: `${charId}_c2`, charId, ownerName: ch.name, rarity: ch.rarity, name: shortName(sk.active, "固有戦技"), type: isShielder ? "guard" : (isHealer ? "heal" : "attack"), element: el, cost: 2, icon: isShielder ? "🛡️" : (isHealer ? "💚" : "🔥"), power: Number((2.25 * mult).toFixed(2)), stagger: 24, exGain: 24, healRatio: isHealer ? 0.24 : 0, shield: isShielder ? 0.9 : 0, summary: isShielder ? "🛡️大バリア＋攻撃" : (isHealer ? "💚24%回復＋攻撃" : `🔥大火力 ${Math.round(225 * mult)}%`), desc: sk.active },
      { id: `${charId}_c3`, charId, ownerName: ch.name, rarity: ch.rarity, name: `${ch.name}・体勢崩し`, type: "break", element: el, cost: 1, icon: "💥", power: Number((1.05 * mult).toFixed(2)), stagger: 34, guardBreakMult: 2.2, exGain: 18, summary: "💥崩し / 装甲・溜め破壊", desc: "敵の『装甲硬化』や『必殺チャージ』に当てると2.2倍ダメージ＆強制中断！" }
    ];
  },

  getUltCard(charId) {
    const ch = getCharProfile(charId);
    const sk = ch.skills || { ult: "必殺連携" };
    const treeLv = typeof getSkillTreeStage === "function" ? getSkillTreeStage(charId) : 0;
    const pwr = Number((3.6 + treeLv * 0.25).toFixed(2));
    return { id: `${charId}_ult`, charId, ownerName: ch.name, rarity: "SSR", name: `【EX】${(sk.ult || "必殺連携").split("：")[0]}`, type: "ult", element: ch.element, cost: 0, icon: "🌟", power: pwr, stagger: 45, guardBreakMult: 1.8, isUlt: true, summary: `🌟 0コスト超必殺 ${Math.round(pwr * 100)}%`, desc: sk.ult };
  },

  buildActiveDeck() {
    const slot = this.ensureDeckSlots();
    const charCards = [];
    (state.party || []).forEach(id => charCards.push(...this.getCharCards(id)));
    const valid = Array.isArray(slot.cards) && slot.cards.length >= this.MIN_TACTIC_SIZE;
    const tacticIds = (valid ? slot.cards : [...this.DEFAULT_TACTIC_DECK]).slice(0, this.MAX_TACTIC_SIZE);
    return [...charCards, ...tacticIds.map(tid => this.getLeveledTacticCard(tid)).filter(Boolean)];
  }
};

let deckElFilter = "ALL";
let dexRarityFilter = "ALL";
let dexElFilter = "ALL";

function switchDeckSlot(idx) {
  window.MF_CARDS.ensureDeckSlots();
  if (idx < 0 || idx >= window.MF_CARDS.MAX_DECK_SLOTS) return;
  state.activeDeckIdx = idx;
  state.tacticDeck = state.deckSlots[idx].cards;
  saveGame();
  playSfx("switch");
  renderDeckView();
  showToast(`🃏 デッキ『${state.deckSlots[idx].name}』に切り替えました`);
}

function renameCurrentDeck() {
  const slot = window.MF_CARDS.ensureDeckSlots();
  const next = prompt("このデッキの名前を入力してください（最大12文字）：", slot.name);
  if (!next || !next.trim()) return;
  slot.name = next.trim().slice(0, 12);
  saveGame();
  playSfx("tap");
  renderDeckView();
  showToast(`✏️ デッキ名を『${slot.name}』に変更しました`);
}

function openCardDetailModal(card) {
  if (!card) return;
  const el = window.MF_DATA.ELEMENTS[card.element] || window.MF_DATA.ELEMENTS.arc;
  const typeLabel = { attack: "⚔️ 攻撃", break: "💥 崩し", guard: "🛡️ 防御・反撃", buff: "✨ 戦術・支援", heal: "💚 回復", ult: "🌟 EX必殺" }[card.type] || "";
  const tipMap = {
    break: "💡 コツ：敵の予兆が『🛡️装甲硬化』か『⚡チャージ中』の時に出すと特効＋行動キャンセル！",
    guard: "💡 コツ：敵の予兆が『💢強攻撃』か『☄️大技』の時に出すと被ダメージ激減・反撃できます！",
    attack: `💡 コツ：他の属性カードの直後に出すと『元素反応』が炸裂します！（${el.icon}${el.name}属性）`,
    buff: "💡 コツ：3枚チェインの『1枚目』に置くと後続のカードを大幅に強化できます！",
    heal: "💡 コツ：ピンチの立て直しや長期戦のボス攻略で安定感が上がります！",
    ult: "💡 コツ：コスト0の切り札！元素反応やバフの後に3枚目として置くと超絶ダメージ！"
  };
  document.getElementById("cdm-title").textContent = `${card.icon} ${card.name}`;
  document.getElementById("cdm-meta").innerHTML = `
    <span class="tag">${card.rarity || "R"}</span><span class="tag">AP ${card.cost}</span>
    <span class="tag">${el.icon}${el.name}</span><span class="tag">${typeLabel}</span>
    ${card.cardLv ? `<span class="tag" style="background:#ffd13b;">Lv.${card.cardLv}</span>` : ""}
  `;
  document.getElementById("cdm-summary").textContent = card.summary || "";
  document.getElementById("cdm-desc").textContent = card.desc || "";
  document.getElementById("cdm-tip").textContent = tipMap[card.type] || "";
  document.getElementById("modal-card-detail").classList.add("active");
  playSfx("tap");
}
function closeCardDetailModal() { document.getElementById("modal-card-detail").classList.remove("active"); }
function openTacticCardDetail(tid) { openCardDetailModal(window.MF_CARDS.getLeveledTacticCard(tid) || window.MF_CARDS.TACTIC_CARDS[tid]); }

// ---------- 最大40枚・5スロット保存対応デッキ編成画面 ----------
function renderDeckView() {
  renderTopBar();
  state.ownedCards = state.ownedCards || { ...window.MF_CARDS.STARTER_OWNED_CARDS };
  const activeSlot = window.MF_CARDS.ensureDeckSlots();

  // 5つのデッキスロット切替タブ
  const slotBar = document.getElementById("deck-slot-tabs");
  if (slotBar) {
    slotBar.innerHTML = state.deckSlots.map((sl, i) => `
      <button class="btn-xs ${i === state.activeDeckIdx ? "btn-primary" : ""}" style="flex:1; min-width:58px;" onclick="switchDeckSlot(${i})">
        #${i + 1} ${escapeHtml(sl.name.slice(0, 5))}
      </button>
    `).join("");
  }
  const slotTitle = document.getElementById("deck-active-name");
  if (slotTitle) slotTitle.textContent = `選択中：#${state.activeDeckIdx + 1}『${activeSlot.name}』`;

  document.getElementById("deck-char-cards").innerHTML = state.party.map(id => {
    const ch = getCharProfile(id);
    const el = window.MF_DATA.ELEMENTS[ch.element];
    const cards = window.MF_CARDS.getCharCards(id);
    return `
      <div class="card" style="padding:8px; margin-bottom:6px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:5px;">
          ${window.MF_SPRITES.portraitHTML(ch, "icon")}
          <div><strong style="font-size:12px;">${escapeHtml(ch.name)}（${el.icon}${el.name}）</strong><div style="font-size:10px; color:var(--muted);">固有カード3枚（自動でデッキ入り）</div></div>
        </div>
        <div style="display:flex; gap:4px; flex-wrap:wrap;">${cards.map(c => `<span class="tag">${c.icon}${escapeHtml(c.name)} (AP${c.cost})</span>`).join("")}</div>
      </div>
    `;
  }).join("");

  const tLen = activeSlot.cards.length;
  const totalDeck = 12 + tLen;
  const validNote = tLen < 8 ? ` ⚠️あと${8 - tLen}枚必要` : " ✅出撃OK";
  document.getElementById("deck-tactic-count").textContent = `合計 ${totalDeck} / 40枚（戦術 ${tLen}/28枚）${validNote}`;

  const grouped = {};
  activeSlot.cards.forEach(tid => { grouped[tid] = (grouped[tid] || 0) + 1; });
  document.getElementById("deck-current-tactics").innerHTML = Object.entries(grouped).map(([tid, cnt]) => {
    const c = window.MF_CARDS.TACTIC_CARDS[tid];
    return c ? `<button class="btn-xs" style="background:var(--surface-sub);" onclick="removeTacticCardById('${tid}')">${c.icon}${escapeHtml(c.name)} ×${cnt} ✕</button>` : "";
  }).join("");

  const elButtons = [{ id: "ALL", label: "全属性" }, ...Object.values(window.MF_DATA.ELEMENTS).map(e => ({ id: e.id, label: `${e.icon}${e.name}` }))];
  document.getElementById("deck-el-filters").innerHTML = elButtons.map(b => `
    <button class="btn-xs ${deckElFilter === b.id ? "btn-primary" : ""}" onclick="deckElFilter='${b.id}'; playSfx('tap'); renderDeckView();">${b.label}</button>
  `).join("");

  const rarOrd = { SSR: 0, SR: 1, R: 2, N: 3 };
  const ownedList = Object.values(window.MF_CARDS.TACTIC_CARDS)
    .filter(c => window.MF_CARDS.getCardLevel(c.id) > 0 && (deckElFilter === "ALL" || c.element === deckElFilter))
    .sort((a, b) => (rarOrd[a.rarity] ?? 9) - (rarOrd[b.rarity] ?? 9));

  document.getElementById("deck-tactic-pool").innerHTML = ownedList.map(c => {
    const el = window.MF_DATA.ELEMENTS[c.element];
    const lv = window.MF_CARDS.getCardLevel(c.id);
    const inDeck = activeSlot.cards.filter(id => id === c.id).length;
    const canAdd = activeSlot.cards.length < window.MF_CARDS.MAX_TACTIC_SIZE && inDeck < window.MF_CARDS.MAX_COPIES;
    return `
      <div class="card" style="padding:8px; margin-bottom:6px;">
        <div class="top-row">
          <strong style="font-size:12px;" onclick="openTacticCardDetail('${c.id}')"><span class="rank-pill" style="font-size:9px;">${c.rarity}</span> ${c.icon} ${escapeHtml(c.name)} Lv.${lv}</strong>
          <div style="display:flex; gap:4px;">
            <button class="btn-xs" onclick="openTacticCardDetail('${c.id}')">？</button>
            <button class="btn-xs ${canAdd ? "btn-primary" : ""}" ${canAdd ? "" : "disabled"} onclick="addTacticCard('${c.id}')">${inDeck >= 3 ? "3/3" : `+追加(${inDeck}/3)`}</button>
          </div>
        </div>
        <div style="font-size:10px; color:var(--accent); font-weight:800; margin-top:3px;">${el.icon} AP${c.cost} ｜ ${escapeHtml(c.summary)}</div>
      </div>
    `;
  }).join("");
}

function addTacticCard(tid) {
  const slot = window.MF_CARDS.ensureDeckSlots();
  if (slot.cards.length >= window.MF_CARDS.MAX_TACTIC_SIZE) { showToast("戦術枠は最大28枚（合計40枚）までです"); return; }
  if (slot.cards.filter(id => id === tid).length >= window.MF_CARDS.MAX_COPIES) { showToast("同名カードは3枚までです"); return; }
  slot.cards.push(tid);
  state.tacticDeck = slot.cards;
  saveGame(); playSfx("tap"); renderDeckView();
}

function removeTacticCardById(tid) {
  const slot = window.MF_CARDS.ensureDeckSlots();
  const idx = slot.cards.lastIndexOf(tid);
  if (idx < 0) return;
  slot.cards.splice(idx, 1);
  state.tacticDeck = slot.cards;
  saveGame(); playSfx("tap"); renderDeckView();
}

function autoFillDeck40() {
  const slot = window.MF_CARDS.ensureDeckSlots();
  const rarScore = { SSR: 40, SR: 30, R: 20, N: 10 };
  const owned = Object.values(window.MF_CARDS.TACTIC_CARDS)
    .filter(c => window.MF_CARDS.getCardLevel(c.id) > 0)
    .sort((a, b) => (rarScore[b.rarity] + window.MF_CARDS.getCardLevel(b.id) * 2) - (rarScore[a.rarity] + window.MF_CARDS.getCardLevel(a.id) * 2));

  const next = [];
  for (let copy = 1; copy <= 3; copy++) {
    for (const c of owned) {
      if (next.length >= window.MF_CARDS.MAX_TACTIC_SIZE) break;
      if (next.filter(x => x === c.id).length < copy) next.push(c.id);
    }
    if (next.length >= window.MF_CARDS.MAX_TACTIC_SIZE) break;
  }
  slot.cards = next;
  state.tacticDeck = slot.cards;
  saveGame(); playSfx("gift"); renderDeckView();
  showToast(`✨『${slot.name}』を合計 ${12 + next.length}枚で自動編成しました！`);
}

function resetDeckTo20() {
  const slot = window.MF_CARDS.ensureDeckSlots();
  slot.cards = [...window.MF_CARDS.DEFAULT_TACTIC_DECK];
  state.tacticDeck = slot.cards;
  saveGame(); playSfx("switch"); renderDeckView();
  showToast(`⚖️『${slot.name}』を基本20枚に戻しました`);
}

// ---------- 全102種カード図鑑 ----------
function getOwnedCardCount() {
  return Object.keys(window.MF_CARDS.TACTIC_CARDS).filter(id => window.MF_CARDS.getCardLevel(id) > 0).length;
}
function getUnclaimedDexCount() {
  const owned = getOwnedCardCount();
  const claimed = state.claimedDexMilestones || [];
  return window.MF_CARDS.DEX_MILESTONES.filter(m => owned >= m.count && !claimed.includes(m.count)).length;
}

function renderCardDexView() {
  renderTopBar();
  const all = Object.values(window.MF_CARDS.TACTIC_CARDS);
  const ownedCnt = getOwnedCardCount();
  const claimed = state.claimedDexMilestones || [];
  const pct = Math.round((ownedCnt / all.length) * 100);

  document.getElementById("dex-progress-bar").innerHTML = `
    <div class="top-row" style="margin-bottom:4px;">
      <strong>📚 カード収集率：${ownedCnt} / ${all.length}種（${pct}%）</strong>
      <button class="btn-xs btn-accent2" onclick="activeBannerId='card_pack'; switchView('gacha');">🃏 カードを引く</button>
    </div>
    <div class="gauge-bar"><div style="background:var(--accent); width:${pct}%;"></div></div>
    <div style="display:flex; gap:5px; flex-wrap:wrap; margin-top:7px;">
      ${window.MF_CARDS.DEX_MILESTONES.map(m => {
        const done = claimed.includes(m.count);
        const ready = ownedCnt >= m.count && !done;
        if (done) return `<span class="tag" style="background:#18b88a; color:#fff;">✓ ${m.count}種済</span>`;
        if (ready) return `<button class="btn-xs btn-accent2" onclick="claimDexMilestone(${m.count})">🎁 ${m.count}種達成 💎+${m.gems}</button>`;
        return `<span class="tag" style="opacity:0.65;">${m.count}種で💎+${m.gems}</span>`;
      }).join("")}
    </div>
  `;

  document.getElementById("dex-filter-tabs").innerHTML = ["ALL", "SSR", "SR", "R", "N"].map(r => `
    <button class="btn-xs ${dexRarityFilter === r ? "btn-primary" : ""}" onclick="dexRarityFilter='${r}'; playSfx('tap'); renderCardDexView();">${r === "ALL" ? "全レア" : r}</button>
  `).join("");

  const elBtns = [{ id: "ALL", label: "全属性" }, ...Object.values(window.MF_DATA.ELEMENTS).map(e => ({ id: e.id, label: e.icon }))];
  document.getElementById("dex-el-tabs").innerHTML = elBtns.map(b => `
    <button class="btn-xs ${dexElFilter === b.id ? "btn-accent2" : ""}" onclick="dexElFilter='${b.id}'; playSfx('tap'); renderCardDexView();">${b.label}</button>
  `).join("");

  const rarOrd = { SSR: 0, SR: 1, R: 2, N: 3 };
  const filtered = all
    .filter(c => (dexRarityFilter === "ALL" || c.rarity === dexRarityFilter) && (dexElFilter === "ALL" || c.element === dexElFilter))
    .sort((a, b) => (rarOrd[a.rarity] ?? 9) - (rarOrd[b.rarity] ?? 9));

  document.getElementById("dex-card-grid").innerHTML = filtered.map(c => {
    const lv = window.MF_CARDS.getCardLevel(c.id);
    const owned = lv > 0;
    const el = window.MF_DATA.ELEMENTS[c.element];
    if (!owned) {
      return `
        <div class="dex-card locked" onclick="openTacticCardDetail('${c.id}')">
          <div class="hc-top"><span class="tag">${c.rarity}</span><span>${el.icon} AP${c.cost}</span></div>
          <div style="font-size:26px; filter:grayscale(1) opacity(0.5); margin:5px 0;">${c.icon}</div>
          <div style="font-size:11px; font-weight:900;">🔒 ${escapeHtml(c.name)}</div>
          <div style="font-size:9px; color:var(--muted);">タップで性能確認</div>
        </div>
      `;
    }
    return `
      <div class="dex-card el-pat-${c.element}" onclick="openTacticCardDetail('${c.id}')">
        <div class="hc-top"><span class="hc-cost">${c.cost}</span><span class="hc-type-pill">${c.rarity} Lv.${lv}</span></div>
        <div style="font-size:26px; margin:4px 0;">${c.icon}</div>
        <div class="hc-title">${escapeHtml(c.name)}</div>
        <div style="font-size:9.5px; color:#f2f4ff; margin-top:2px;">${escapeHtml(c.summary)}</div>
      </div>
    `;
  }).join("");
}

function claimDexMilestone(targetCount) {
  const m = window.MF_CARDS.DEX_MILESTONES.find(x => x.count === targetCount);
  if (!m || getOwnedCardCount() < m.count) return;
  state.claimedDexMilestones = state.claimedDexMilestones || [];
  if (state.claimedDexMilestones.includes(m.count)) return;
  state.claimedDexMilestones.push(m.count);
  state.gems += m.gems;
  saveGame(); playSfx("gift");
  if (typeof updateTabletBadge === "function") updateTabletBadge();
  renderCardDexView();
  showToast(`🎉 ${m.label}受取！💎結晶石+${m.gems}！`);
}
