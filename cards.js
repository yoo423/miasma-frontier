window.MF_CARDS = {
  // 全20種の戦術・防御・トラップ・伝説カード（ガチャ＆クラフト＆初期所持）
  TACTIC_CARDS: {
    // --- N / R 基本戦術カード（初期から所持） ---
    counter_stance: { id: "counter_stance", rarity: "R", name: "見切りカウンター", type: "guard", element: "arc", cost: 1, icon: "🪞", shield: 0.45, counterMult: 2.2, summary: "🛡️軽減＋🪞220%反撃", desc: "敵の攻撃を受け流し、受けた瞬間に攻撃力220%でカウンター反撃する。強攻撃の予兆に合わせると絶大。" },
    aegis_wall:     { id: "aegis_wall",     rarity: "R", name: "イージス防壁",     type: "guard", element: "arc", cost: 1, icon: "🛡️", shield: 0.95, summary: "🛡️強固バリア展開", desc: "小隊全体に厚い結晶バリアを張る。ボスの『ミアズマ大崩壊』など大技を耐える基本札。" },
    shield_breaker: { id: "shield_breaker", rarity: "R", name: "アーマーブレイク", type: "break", element: "fire", cost: 1, icon: "🔨", power: 1.25, stagger: 36, guardBreakMult: 2.4, summary: "💥崩し / 装甲2.4倍", desc: "敵が『装甲硬化』または『必殺チャージ』の時に出すと威力2.4倍＆行動を強制中断させる。" },
    shock_trap:     { id: "shock_trap",     rarity: "R", name: "電磁ショック罠",   type: "break", element: "volt", cost: 2, icon: "⚡", power: 1.55, stagger: 48, guardBreakMult: 2.1, summary: "💥雷崩し / 大体勢削り", desc: "高圧電撃で体勢ゲージを大きく削る。水属性の直後なら感電も狙える。" },
    element_boost:  { id: "element_boost",  rarity: "R", name: "元素オーバーロード", type: "buff", element: "fire", cost: 1, icon: "🔥", nextAtkMult: 1.65, summary: "🔥次撃 1.65倍", desc: "このターン次に発動する攻撃カードの威力を1.65倍に増幅する。EX必殺や2コスト技の前に置こう。" },
    tactical_draw:  { id: "tactical_draw",  rarity: "N", name: "戦術リロード",     type: "buff", element: "wind", cost: 0, icon: "🃏", draw: 2, apGain: 1, summary: "🃏2枚ドロー / AP+1", desc: "コスト0で山札から2枚引き、APも+1回復する万能潤滑油カード。" },
    weak_scan:      { id: "weak_scan",      rarity: "N", name: "弱点部位スキャン", type: "buff", element: "wind", cost: 1, icon: "🎯", shredTurns: 2, summary: "🎯2T防御DOWN", desc: "2ターン敵の防御力を下げ、破壊可能部位へのダメージを大幅に伸ばす。" },
    repair_kit:     { id: "repair_kit",     rarity: "N", name: "救急ナノミスト",   type: "heal", element: "water", cost: 1, icon: "💚", healRatio: 0.28, summary: "💚HP28%回復", desc: "小隊HPを28%回復する携帯ナノマシン。長期戦の要。" },
    hydro_splash:   { id: "hydro_splash",   rarity: "N", name: "高圧ハイドロ弾",   type: "attack", element: "water", cost: 1, icon: "💧", power: 1.15, stagger: 14, summary: "💧水115% / コンボ起点", desc: "水属性を付着させる起点札。次に炎を出せば蒸発、氷を出せば凍結が発動！" },
    camp_ration:    { id: "camp_ration",    rarity: "N", name: "特製スタミナ飯",   type: "heal", element: "fire", cost: 1, icon: "🍖", healRatio: 0.18, nextAtkMult: 1.35, summary: "💚18%回復＋次撃1.35倍", desc: "HPを回復しつつ次の攻撃威力も上げる美味しい一石二鳥カード。" },

    // --- SR 上級戦術カード（カードガチャで獲得） ---
    frost_seal:     { id: "frost_seal",     rarity: "SR", name: "絶対零度トラップ", type: "attack", element: "ice", cost: 1, icon: "❄️", power: 1.35, stagger: 20, summary: "❄️氷135% / 凍結狙い", desc: "高威力の氷罠。水付着の敵に当てれば即座に『凍結』で行動を封殺できる。" },
    chain_spark:    { id: "chain_spark",    rarity: "SR", name: "連鎖ライトニング", type: "attack", element: "volt", cost: 1, icon: "⚡", power: 1.3, stagger: 20, exGain: 28, summary: "⚡雷130% / EX+28%", desc: "EX必殺ゲージを一気に28%加速させる雷連撃カード。" },
    gale_step:      { id: "gale_step",      rarity: "SR", name: "疾風ステップ",     type: "buff", element: "wind", cost: 0, icon: "🌪️", draw: 1, shield: 0.45, summary: "🃏1ドロー＋🛡️バリア", desc: "コスト0で手札を1枚補充しながら小バリアを張る攻防一体の名札。" },
    crimson_flare:  { id: "crimson_flare",  rarity: "SR", name: "紅蓮フレア弾",     type: "attack", element: "fire", cost: 2, icon: "☄️", power: 2.35, stagger: 24, summary: "🔥炎235% / 蒸発・融解〆", desc: "水や氷の直後に3枚目として置くと凄まじい反応ダメージを叩き出すフィニッシャー。" },
    mirror_aegis:   { id: "mirror_aegis",   rarity: "SR", name: "鏡面リフレクター", type: "guard", element: "ice", cost: 2, icon: "💠", shield: 1.25, counterMult: 2.5, summary: "🛡️大バリア＋🪞250%反撃", desc: "鉄壁のバリアと250%反撃を同時に構える上位カウンターカード。" },
    impact_hammer:  { id: "impact_hammer",  rarity: "SR", name: "重圧インパクト",   type: "break", element: "arc", cost: 2, icon: "⚒️", power: 1.7, stagger: 56, guardBreakMult: 2.6, summary: "💥超大崩し / 2.6倍", desc: "装甲硬化したボスを1発でブレイク寸前まで追い込む重撃カード。" },

    // --- SSR 伝説級・切り札カード（カードガチャの目玉） ---
    ssr_chrono_sync:{ id: "ssr_chrono_sync", rarity: "SSR", name: "【伝説】クロノ・シンクロ", type: "buff", element: "arc", cost: 0, icon: "⏳", draw: 3, apGain: 2, nextAtkMult: 1.4, summary: "👑AP+2 / 3ドロー / 1.4倍", desc: "コスト0でAP+2・3枚ドロー・次撃1.4倍を同時に行う最強の展開カード。" },
    ssr_radiant_nova:{ id: "ssr_radiant_nova", rarity: "SSR", name: "【伝説】融光ノヴァ", type: "attack", element: "fire", cost: 2, icon: "🌟", power: 3.1, stagger: 38, exGain: 30, summary: "👑炎310% / EX+30%", desc: "融光種の過飽和エネルギーを解放する極大火力攻撃札。" },
    ssr_zero_domain:{ id: "ssr_zero_domain", rarity: "SSR", name: "【伝説】零度結界・アーク", type: "guard", element: "ice", cost: 1, icon: "❄️", shield: 1.4, healRatio: 0.25, counterMult: 2.6, summary: "👑大防壁＋回復＋260%反撃", desc: "コスト1で大バリア・HP25%回復・260%反撃を同時展開する鉄壁の切り札。" },
    ssr_storm_break:{ id: "ssr_storm_break", rarity: "SSR", name: "【伝説】天雷ブレイカー", type: "break", element: "volt", cost: 1, icon: "🌩️", power: 1.9, stagger: 62, guardBreakMult: 3.0, shredTurns: 2, summary: "👑崩し3倍＋防御DOWN", desc: "コスト1で敵の装甲とチャージを3倍威力で粉砕し、防御力まで下げる最強の崩し札。" }
  },

  STARTER_OWNED_CARDS: {
    counter_stance: 1, aegis_wall: 1, shield_breaker: 1, shock_trap: 1,
    element_boost: 1, tactical_draw: 1, weak_scan: 1, repair_kit: 1,
    hydro_splash: 1, camp_ration: 1
  },

  DEFAULT_TACTIC_DECK: [
    "counter_stance", "aegis_wall", "shield_breaker", "shock_trap",
    "element_boost", "tactical_draw", "repair_kit", "hydro_splash"
  ],

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
      ...base,
      cardLv: lv,
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
      {
        id: `${charId}_c1`, charId, ownerName: ch.name, ownerEmoji: ch.emoji, rarity: ch.rarity,
        name: shortName(sk.normal, "通常連撃"), type: "attack", element: el, cost: 1, icon: "⚔️",
        power: Number((1.15 * mult).toFixed(2)), stagger: 14, exGain: 15,
        summary: `⚔️ ${Math.round(115 * mult)}% / 元素起点`,
        desc: `${ch.name}の基本攻撃。元素反応の1枚目として使いやすい。`
      },
      {
        id: `${charId}_c2`, charId, ownerName: ch.name, ownerEmoji: ch.emoji, rarity: ch.rarity,
        name: shortName(sk.active, "固有戦技"),
        type: isShielder ? "guard" : (isHealer ? "heal" : "attack"),
        element: el, cost: 2, icon: isShielder ? "🛡️" : (isHealer ? "💚" : "🔥"),
        power: Number((2.25 * mult).toFixed(2)), stagger: 24, exGain: 24,
        healRatio: isHealer ? 0.24 : 0, shield: isShielder ? 0.9 : 0,
        summary: isShielder ? "🛡️大バリア＋攻撃" : (isHealer ? "💚24%回復＋攻撃" : `🔥大火力 ${Math.round(225 * mult)}%`),
        desc: sk.active
      },
      {
        id: `${charId}_c3`, charId, ownerName: ch.name, ownerEmoji: ch.emoji, rarity: ch.rarity,
        name: `${ch.name}・体勢崩し`, type: "break", element: el, cost: 1, icon: "💥",
        power: Number((1.05 * mult).toFixed(2)), stagger: 34, guardBreakMult: 2.2, exGain: 18,
        summary: "💥崩し / 装甲・溜め破壊",
        desc: "敵の『装甲硬化』や『必殺チャージ』に当てると2.2倍ダメージ＆強制中断！"
      }
    ];
  },

  getUltCard(charId) {
    const ch = getCharProfile(charId);
    const sk = ch.skills || { ult: "必殺連携" };
    const treeLv = typeof getSkillTreeStage === "function" ? getSkillTreeStage(charId) : 0;
    const pwr = Number((3.6 + treeLv * 0.25).toFixed(2));
    return {
      id: `${charId}_ult`, charId, ownerName: ch.name, ownerEmoji: ch.emoji, rarity: "SSR",
      name: `【EX】${(sk.ult || "必殺連携").split("：")[0]}`,
      type: "ult", element: ch.element, cost: 0, icon: "🌟",
      power: pwr, stagger: 45, guardBreakMult: 1.8, isUlt: true,
      summary: `🌟 0コスト超必殺 ${Math.round(pwr * 100)}%`,
      desc: sk.ult
    };
  },

  buildActiveDeck() {
    const charCards = [];
    (state.party || []).forEach(id => charCards.push(...this.getCharCards(id)));
    const tacticIds = (state.tacticDeck && state.tacticDeck.length === 8)
      ? state.tacticDeck : [...this.DEFAULT_TACTIC_DECK];
    const tacticCards = tacticIds.map(tid => this.getLeveledTacticCard(tid)).filter(Boolean);
    return [...charCards, ...tacticCards];
  }
};

// ---------- 分かりやすいカード詳細モーダル ----------
function openCardDetailModal(card) {
  if (!card) return;
  const el = window.MF_DATA.ELEMENTS[card.element] || window.MF_DATA.ELEMENTS.arc;
  const typeLabel = { attack: "⚔️ 攻撃カード", break: "💥 崩しカード", guard: "🛡️ 防御・反撃", buff: "✨ 戦術・支援", heal: "💚 回復カード", ult: "🌟 EX必殺札" }[card.type] || "";
  const tipMap = {
    break: "💡 コツ：敵の予兆が『🛡️装甲硬化』か『⚡チャージ中』の時に出すと特効＋行動キャンセル！",
    guard: "💡 コツ：敵の予兆が『💢強攻撃』か『☄️大技』の時に出すと被ダメージを激減・反撃できます！",
    attack: `💡 コツ：他の属性カードの直後に出すと『元素反応』が炸裂します！（現在：${el.icon}${el.name}属性）`,
    buff: "💡 コツ：3枚チェインの『1枚目』に置くと、後続の攻撃カードすべてを強化できます！",
    heal: "💡 コツ：ピンチの立て直しや、長期戦のボス攻略で安定感がグッと上がります！",
    ult: "💡 コツ：コスト0の切り札！元素反応や攻撃バフの後に3枚目として置くと超絶ダメージ！"
  };

  document.getElementById("cdm-title").textContent = `${card.icon} ${card.name}`;
  document.getElementById("cdm-meta").innerHTML = `
    <span class="tag">${card.rarity || "R"}</span>
    <span class="tag">AP ${card.cost}</span>
    <span class="tag">${el.icon}${el.name}</span>
    <span class="tag">${typeLabel}</span>
    ${card.cardLv ? `<span class="tag" style="background:#ffd13b;">Lv.${card.cardLv}</span>` : ""}
  `;
  document.getElementById("cdm-summary").textContent = card.summary || "";
  document.getElementById("cdm-desc").textContent = card.desc || "";
  document.getElementById("cdm-tip").textContent = tipMap[card.type] || "";
  document.getElementById("modal-card-detail").classList.add("active");
  playSfx("tap");
}

function closeCardDetailModal() {
  document.getElementById("modal-card-detail").classList.remove("active");
}

function openTacticCardDetail(tid) {
  openCardDetailModal(window.MF_CARDS.getLeveledTacticCard(tid) || window.MF_CARDS.TACTIC_CARDS[tid]);
}

// ---------- デッキ編成画面 ----------
function renderDeckView() {
  renderTopBar();
  state.ownedCards = state.ownedCards || { ...window.MF_CARDS.STARTER_OWNED_CARDS };
  if (!state.tacticDeck || state.tacticDeck.length !== 8) {
    state.tacticDeck = [...window.MF_CARDS.DEFAULT_TACTIC_DECK];
  }

  document.getElementById("deck-char-cards").innerHTML = state.party.map(id => {
    const ch = getCharProfile(id);
    const el = window.MF_DATA.ELEMENTS[ch.element];
    const cards = window.MF_CARDS.getCharCards(id);
    return `
      <div class="card" style="padding:8px; margin-bottom:6px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:5px;">
          ${window.MF_SPRITES.portraitHTML(ch, "icon")}
          <div>
            <strong style="font-size:12px;">${escapeHtml(ch.name)}（${el.icon}${el.name}）</strong>
            <div style="font-size:10px; color:var(--muted);">固有カード3枚（自動でデッキ入り）</div>
          </div>
        </div>
        <div style="display:flex; gap:4px; flex-wrap:wrap;">
          ${cards.map(c => `<span class="tag">${c.icon}${escapeHtml(c.name)} (AP${c.cost})</span>`).join("")}
        </div>
      </div>
    `;
  }).join("");

  document.getElementById("deck-tactic-count").textContent = `採用中の戦術カード（${state.tacticDeck.length} / 8枚）`;
  document.getElementById("deck-current-tactics").innerHTML = state.tacticDeck.map((tid, idx) => {
    const c = window.MF_CARDS.TACTIC_CARDS[tid];
    if (!c) return "";
    return `<button class="btn-xs" style="background:var(--surface-sub);" onclick="removeTacticCard(${idx})">${c.icon}${escapeHtml(c.name)} ✕</button>`;
  }).join("");

  const rarOrd = { SSR: 0, SR: 1, R: 2, N: 3 };
  const allCards = Object.values(window.MF_CARDS.TACTIC_CARDS)
    .sort((a, b) => (rarOrd[a.rarity] ?? 9) - (rarOrd[b.rarity] ?? 9));

  document.getElementById("deck-tactic-pool").innerHTML = allCards.map(c => {
    const el = window.MF_DATA.ELEMENTS[c.element];
    const lv = window.MF_CARDS.getCardLevel(c.id);
    const owned = lv > 0;
    const inDeck = state.tacticDeck.filter(id => id === c.id).length;
    const canAdd = owned && state.tacticDeck.length < 8 && inDeck < 2;
    return `
      <div class="card" style="padding:8px; margin-bottom:6px; opacity:${owned ? 1 : 0.55};">
        <div class="top-row">
          <strong style="font-size:12px;" onclick="openTacticCardDetail('${c.id}')">
            <span class="rank-pill" style="font-size:9px;">${c.rarity}</span> ${c.icon} ${escapeHtml(c.name)} ${owned ? `Lv.${lv}` : "🔒未所持"}
          </strong>
          <div style="display:flex; gap:4px;">
            <button class="btn-xs" onclick="openTacticCardDetail('${c.id}')">？</button>
            ${owned
              ? `<button class="btn-xs ${canAdd ? "btn-primary" : ""}" ${canAdd ? "" : "disabled"} onclick="addTacticCard('${c.id}')">${inDeck >= 2 ? "2/2" : `+追加(${inDeck}/2)`}</button>`
              : `<button class="btn-xs" onclick="switchView('gacha')">ガチャ</button>`}
          </div>
        </div>
        <div style="font-size:10px; color:var(--accent); font-weight:800; margin-top:3px;">${el.icon} AP${c.cost} ｜ ${escapeHtml(c.summary)}</div>
      </div>
    `;
  }).join("");
}

function addTacticCard(tid) {
  if (state.tacticDeck.length >= 8) { showToast("戦術枠は8枚まで（上の札をタップで外せます）"); return; }
  if (state.tacticDeck.filter(id => id === tid).length >= 2) { showToast("同名カードは2枚までです"); return; }
  state.tacticDeck.push(tid); saveGame(); playSfx("tap"); renderDeckView();
}

function removeTacticCard(idx) {
  state.tacticDeck.splice(idx, 1); saveGame(); playSfx("tap"); renderDeckView();
}
