window.MF_CARDS = {
  // 自由に8枚組み込める戦術・防御・トラップカード（全12種）
  TACTIC_CARDS: {
    counter_stance: {
      id: "counter_stance", name: "見切りカウンター", type: "guard", element: "arc", cost: 1,
      icon: "🪞", shield: 0.45, counterMult: 2.2,
      desc: "敵の攻撃を軽減し、受けた瞬間に攻撃力220%で反撃する。"
    },
    aegis_wall: {
      id: "aegis_wall", name: "イージス防壁", type: "guard", element: "arc", cost: 1,
      icon: "🛡️", shield: 0.95,
      desc: "小隊全体に強固な防御バリアを展開。強攻撃の受けに最適。"
    },
    shield_breaker: {
      id: "shield_breaker", name: "アーマーブレイク", type: "break", element: "fire", cost: 1,
      icon: "🔨", power: 1.25, stagger: 36, guardBreakMult: 2.4,
      desc: "【崩し】敵が『装甲硬化』または『チャージ中』なら威力2.4倍＆強制中断！"
    },
    shock_trap: {
      id: "shock_trap", name: "電磁ショック罠", type: "break", element: "volt", cost: 2,
      icon: "⚡", power: 1.5, stagger: 48, guardBreakMult: 2.0,
      desc: "【崩し】雷属性を付着し、体勢値を大きく削りチャージを中断する。"
    },
    element_boost: {
      id: "element_boost", name: "元素オーバーロード", type: "buff", element: "fire", cost: 1,
      icon: "🔥", nextAtkMult: 1.65,
      desc: "このターン次に発動する攻撃カードのダメージを1.65倍にする。"
    },
    tactical_draw: {
      id: "tactical_draw", name: "戦術リロード", type: "buff", element: "wind", cost: 0,
      icon: "🃏", draw: 2, apGain: 1,
      desc: "コスト0。山札から2枚ドローし、APを+1回復する。"
    },
    weak_scan: {
      id: "weak_scan", name: "弱点部位スキャン", type: "buff", element: "wind", cost: 1,
      icon: "🎯", shredTurns: 2, partBonus: true,
      desc: "2ターン敵の防御を下げ、部位破壊ダメージを大幅に引き上げる。"
    },
    repair_kit: {
      id: "repair_kit", name: "救急ナノミスト", type: "heal", element: "water", cost: 1,
      icon: "💚", healRatio: 0.28,
      desc: "小隊HPを28%回復し、水属性の湿潤を敵に付着させる。"
    },
    frost_seal: {
      id: "frost_seal", name: "氷結トラップ", type: "attack", element: "ice", cost: 1,
      icon: "❄️", power: 1.15, stagger: 16,
      desc: "氷属性の罠攻撃。水属性の直後に出せば『凍結』で敵行動を封じる。"
    },
    hydro_splash: {
      id: "hydro_splash", name: "高圧ハイドロ弾", type: "attack", element: "water", cost: 1,
      icon: "💧", power: 1.15, stagger: 14,
      desc: "水属性の起点カード。炎や氷、雷コンボの1枚目に最適。"
    },
    chain_spark: {
      id: "chain_spark", name: "連鎖スパーク", type: "attack", element: "volt", cost: 1,
      icon: "⚡", power: 1.2, stagger: 18, exGain: 22,
      desc: "雷属性攻撃。EX必殺ゲージを大きく(+22%)溜める。"
    },
    camp_ration: {
      id: "camp_ration", name: "特製スタミナ飯", type: "heal", element: "fire", cost: 1,
      icon: "🍖", healRatio: 0.18, nextAtkMult: 1.35,
      desc: "小隊HPを18%回復し、次の攻撃カードの威力を1.35倍にする。"
    }
  },

  DEFAULT_TACTIC_DECK: [
    "counter_stance", "aegis_wall", "shield_breaker", "shock_trap",
    "element_boost", "tactical_draw", "repair_kit", "hydro_splash"
  ],

  // 編成キャラから固有カード3枚（攻撃・戦技・崩し）を動的生成
  getCharCards(charId) {
    const ch = getCharProfile(charId);
    const el = ch.element;
    const sk = ch.skills || { normal: "通常攻撃", active: "固有戦技", ult: "必殺連携" };
    const treeLv = typeof getSkillTreeStage === "function" ? getSkillTreeStage(charId) : 0;
    const treeMult = 1 + treeLv * 0.08;
    const shortName = (txt, fallback) => (txt ? txt.split("：")[0] : fallback);

    const isHealer = ch.weapon === "staff" || charId === "fiona" || charId === "medibot";
    const isShielder = charId === "chloe" || charId === "ran" || charId === "guardko";

    return [
      {
        id: `${charId}_c1`, charId, ownerName: ch.name, ownerEmoji: ch.emoji,
        name: shortName(sk.normal, "通常連撃"),
        type: "attack", element: el, cost: 1, icon: "⚔️",
        power: Number((1.15 * treeMult).toFixed(2)), stagger: 14, exGain: 15,
        desc: `${ch.name}の基本攻撃。属性付着の起点に使いやすい。`
      },
      {
        id: `${charId}_c2`, charId, ownerName: ch.name, ownerEmoji: ch.emoji,
        name: shortName(sk.active, "固有戦技"),
        type: isShielder ? "guard" : (isHealer ? "heal" : "attack"),
        element: el, cost: 2, icon: isShielder ? "🛡️" : (isHealer ? "💚" : "🔥"),
        power: Number((2.25 * treeMult).toFixed(2)), stagger: 24, exGain: 24,
        healRatio: isHealer ? 0.24 : 0,
        shield: isShielder ? 0.9 : 0,
        desc: sk.active
      },
      {
        id: `${charId}_c3`, charId, ownerName: ch.name, ownerEmoji: ch.emoji,
        name: `${ch.name}・体勢崩し`,
        type: "break", element: el, cost: 1, icon: "💥",
        power: Number((1.05 * treeMult).toFixed(2)), stagger: 34, guardBreakMult: 2.2, exGain: 18,
        desc: `【崩し】敵の装甲硬化やチャージを割り、体勢ゲージを大きく削る。`
      }
    ];
  },

  // EXゲージ100%で手札に降臨する0コスト必殺カード
  getUltCard(charId) {
    const ch = getCharProfile(charId);
    const sk = ch.skills || { ult: "必殺連携" };
    const treeLv = typeof getSkillTreeStage === "function" ? getSkillTreeStage(charId) : 0;
    return {
      id: `${charId}_ult`, charId, ownerName: ch.name, ownerEmoji: ch.emoji,
      name: `【EX必殺】${(sk.ult || "必殺連携").split("：")[0]}`,
      type: "ult", element: ch.element, cost: 0, icon: "🌟",
      power: Number((3.6 + treeLv * 0.25).toFixed(2)), stagger: 45, guardBreakMult: 1.8, isUlt: true,
      desc: sk.ult
    };
  },

  buildActiveDeck() {
    const charCards = [];
    (state.party || []).forEach(id => {
      charCards.push(...this.getCharCards(id));
    });
    const tacticIds = (state.tacticDeck && state.tacticDeck.length === 8)
      ? state.tacticDeck
      : [...this.DEFAULT_TACTIC_DECK];
    const tacticCards = tacticIds
      .map(tid => this.TACTIC_CARDS[tid])
      .filter(Boolean)
      .map(c => ({ ...c, charId: state.party[0] || "protagonist", ownerName: "戦術札" }));
    return [...charCards, ...tacticCards];
  }
};

// ---------- デッキ編成画面（20枚構成：固有12枚＋戦術8枚） ----------
function renderDeckView() {
  renderTopBar();
  if (!state.tacticDeck || state.tacticDeck.length !== 8) {
    state.tacticDeck = [...window.MF_CARDS.DEFAULT_TACTIC_DECK];
  }

  // 1. 編成4人から自動で入る固有12枚
  const fixedEl = document.getElementById("deck-char-cards");
  fixedEl.innerHTML = state.party.map(id => {
    const ch = getCharProfile(id);
    const el = window.MF_DATA.ELEMENTS[ch.element];
    const cards = window.MF_CARDS.getCharCards(id);
    return `
      <div class="card" style="padding:8px; margin-bottom:6px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
          ${window.MF_SPRITES.portraitHTML(ch, "icon")}
          <div>
            <strong style="font-size:12px;">${escapeHtml(ch.name)}（${el.icon}${el.name}）</strong>
            <div style="font-size:10px; color:var(--muted);">固有カード3枚が自動でデッキに入ります</div>
          </div>
        </div>
        <div style="display:flex; gap:4px; flex-wrap:wrap;">
          ${cards.map(c => `<span class="tag">${c.icon}${escapeHtml(c.name)} (AP${c.cost})</span>`).join("")}
        </div>
      </div>
    `;
  }).join("");

  // 2. 自由カスタマイズ枠（8枚）
  document.getElementById("deck-tactic-count").textContent = `戦術・罠カード（${state.tacticDeck.length} / 8枚）`;
  document.getElementById("deck-current-tactics").innerHTML = state.tacticDeck.map((tid, idx) => {
    const c = window.MF_CARDS.TACTIC_CARDS[tid];
    if (!c) return "";
    return `
      <button class="btn-xs" style="background:var(--surface-sub);" onclick="removeTacticCard(${idx})">
        ${c.icon} ${escapeHtml(c.name)} ✕
      </button>
    `;
  }).join("");

  // 3. 採用候補の戦術カード一覧（同名2枚まで）
  document.getElementById("deck-tactic-pool").innerHTML = Object.values(window.MF_CARDS.TACTIC_CARDS).map(c => {
    const el = window.MF_DATA.ELEMENTS[c.element];
    const inDeckCount = state.tacticDeck.filter(id => id === c.id).length;
    const full = state.tacticDeck.length >= 8 || inDeckCount >= 2;
    return `
      <div class="card" style="padding:8px; margin-bottom:6px;">
        <div class="top-row">
          <strong style="font-size:12px;">${c.icon} ${escapeHtml(c.name)} <span class="tag">${el.icon} AP${c.cost}</span></strong>
          <button class="btn-xs ${full ? "" : "btn-primary"}" ${full ? "disabled" : ""} onclick="addTacticCard('${c.id}')">
            ${inDeckCount >= 2 ? "上限(2)" : (state.tacticDeck.length >= 8 ? "枠満タン" : `+追加(${inDeckCount}/2)`)}
          </button>
        </div>
        <div style="font-size:10px; color:var(--muted); margin-top:3px;">${escapeHtml(c.desc)}</div>
      </div>
    `;
  }).join("");
}

function addTacticCard(tid) {
  if (state.tacticDeck.length >= 8) { showToast("戦術枠は8枚までです（上の枠をタップして外せます）"); return; }
  if (state.tacticDeck.filter(id => id === tid).length >= 2) { showToast("同名カードは2枚までです"); return; }
  state.tacticDeck.push(tid);
  saveGame();
  playSfx("tap");
  renderDeckView();
}

function removeTacticCard(idx) {
  state.tacticDeck.splice(idx, 1);
  saveGame();
  playSfx("tap");
  renderDeckView();
}
