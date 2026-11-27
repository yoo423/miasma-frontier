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
    { count: 102, gems: 2400, label: "102種達成ボーナス！" }
  ],

  // 👑 限定ピックアップSSR 7名の完全専用カード（通常キャラとは別格の固有性能）
  LIMITED_CHAR_CARDS: {
    mikoto: [
      { id: "mikoto_c1", name: "氷符・白狐連弾", type: "attack", element: "ice", cost: 0, icon: "❄️", power: 1.45, stagger: 20, exGain: 22, draw: 1, summary: "👑0コス氷145%＋1ドロー", desc: "コスト0で高火力の氷結晶を放ちながら手札を1枚補充。凍結・融解の最強起点。" },
      { id: "mikoto_c2", name: "絶対零度・氷華陣", type: "guard", element: "ice", cost: 2, icon: "🦊", power: 2.85, shield: 1.15, healRatio: 0.28, counterMult: 2.4, stagger: 36, exGain: 30, summary: "👑氷285%＋大防壁＋28%回復＋反撃", desc: "極大の氷華で敵を貫きつつ、特大バリア・小隊28%回復・240%反撃を同時に展開する規格外戦技。" },
      { id: "mikoto_c3", name: "白狐の氷柱砕き", type: "break", element: "ice", cost: 1, icon: "💥", power: 1.75, stagger: 56, guardBreakMult: 2.9, shredTurns: 2, exGain: 24, summary: "👑氷崩し2.9倍＋2T防御DOWN", desc: "敵の装甲と必殺チャージを2.9倍威力で粉砕し、さらに2ターン防御力を大幅に下げる。" }
    ],
    celestia: [
      { id: "celestia_c1", name: "零式レールショット", type: "attack", element: "volt", cost: 1, icon: "⚡", power: 1.95, stagger: 24, shredTurns: 2, exGain: 28, summary: "👑雷195%＋2T防御DOWN＋EX28", desc: "超音速の雷撃弾で敵の弱点を撃ち抜き、2ターン防御DOWNとEX+28%を同時に得る。" },
      { id: "celestia_c2", name: "オーバークロック狙撃", type: "attack", element: "volt", cost: 2, icon: "🎯", power: 3.45, stagger: 38, guardBreakMult: 2.3, exGain: 35, summary: "👑雷345%＋装甲貫通＋EX35", desc: "破壊可能部位を自動ロックする超高火力狙撃。装甲硬化も貫通しEXゲージを爆速回収。" },
      { id: "celestia_c3", name: "電磁ロックブレイカー", type: "break", element: "volt", cost: 1, icon: "💥", power: 1.85, stagger: 62, guardBreakMult: 3.1, nextAtkMult: 1.45, exGain: 24, summary: "👑雷崩し3.1倍＋次撃1.45倍", desc: "敵の防御・チャージを3.1倍で完全粉砕しつつ、次の攻撃カード威力を1.45倍へ増幅する。" }
    ],
    sylphy: [
      { id: "sylphy_c1", name: "ゲイル・ファング", type: "attack", element: "wind", cost: 0, icon: "🐺", power: 1.5, stagger: 20, apGain: 1, draw: 1, exGain: 20, summary: "👑0コス風150%＋AP+1＋1ドロー", desc: "コスト0で風拡散を叩き込み、さらにAP+1と1ドローをもたらす最速のコンボエンジン。" },
      { id: "sylphy_c2", name: "テンペスト・ラッシュ", type: "attack", element: "wind", cost: 1, icon: "🌪️", power: 2.75, stagger: 30, apGain: 1, shield: 0.7, exGain: 30, summary: "👑実質0コス風275%＋🛡️防壁", desc: "APを1還元しながら275%の嵐乱舞を叩き込み、回避バリアまで張る無法の強襲札。" },
      { id: "sylphy_c3", name: "蒼狼の牙砕き", type: "break", element: "wind", cost: 1, icon: "💥", power: 1.8, stagger: 58, guardBreakMult: 2.85, draw: 1, exGain: 25, summary: "👑風崩し2.85倍＋1ドロー", desc: "暴風の連撃で敵の体勢とチャージを吹き飛ばし、手札を1枚引き込む。" }
    ],
    serina: [
      { id: "serina_c1", name: "ブルーム・ノート", type: "buff", element: "wind", cost: 0, icon: "🌸", power: 1.25, healRatio: 0.16, draw: 2, apGain: 1, exGain: 20, summary: "👑0コス風125%＋回復＋2ドロー＋AP+1", desc: "春風の歌声で攻撃・16%回復・2枚ドロー・AP+1を同時に行う最強クラスのサポート札。" },
      { id: "serina_c2", name: "桜風シンフォニー", type: "heal", element: "wind", cost: 2, icon: "🎵", power: 2.35, healRatio: 0.48, nextAtkMult: 1.75, exGain: 30, summary: "👑風235%＋48%大回復＋次撃1.75倍", desc: "小隊HPをほぼ半減から立て直しつつ、次の攻撃威力を1.75倍へ跳ね上げる奇跡の歌。" },
      { id: "serina_c3", name: "共鳴ソナタ・ブレイク", type: "break", element: "wind", cost: 1, icon: "💥", power: 1.65, stagger: 54, guardBreakMult: 2.8, healRatio: 0.18, exGain: 22, summary: "👑風崩し2.8倍＋18%回復", desc: "音波の衝撃で装甲とチャージを割りながら小隊HPも18%回復する。" }
    ],
    lily: [
      { id: "lily_c1", name: "プリズム・バースト", type: "attack", element: "arc", cost: 1, icon: "🤍", power: 1.85, shield: 0.85, stagger: 24, exGain: 24, summary: "👑煌185%＋🛡️厚バリア＋EX24", desc: "3連結晶弾で攻撃しながら厚い結晶バリアを張る。結晶化反応と合わせればまさに鉄壁。" },
      { id: "lily_c2", name: "ホーリー・クリスタル", type: "guard", element: "arc", cost: 1, icon: "🛡️", power: 2.25, shield: 1.65, healRatio: 0.28, counterMult: 2.75, stagger: 32, summary: "👑極大防壁＋28%回復＋275%反撃", desc: "コスト1で極大バリア・28%回復・275%反撃・225%攻撃を同時発動する無敵の守護姫戦技。" },
      { id: "lily_c3", name: "聖晶パニッシュブレイク", type: "break", element: "arc", cost: 1, icon: "💥", power: 1.9, stagger: 64, guardBreakMult: 3.1, shield: 0.65, exGain: 24, summary: "👑煌崩し3.1倍＋🛡️防壁", desc: "聖なる結晶衝撃でボスの装甲とチャージを3.1倍威力で粉砕し、さらにバリアを展開する。" }
    ],
    marina: [
      { id: "marina_c1", name: "スプラッシュ・スナイプ", type: "attack", element: "water", cost: 0, icon: "🐚", power: 1.55, stagger: 22, shredTurns: 2, exGain: 22, summary: "👑0コス水155%＋2T防御DOWN", desc: "コスト0で水付着と2ターン防御DOWNを同時に付与。蒸発・凍結コンボの最強起点。" },
      { id: "marina_c2", name: "タイダル・ロックオン", type: "attack", element: "water", cost: 2, icon: "🌊", power: 3.35, healRatio: 0.24, nextAtkMult: 1.5, stagger: 34, exGain: 32, summary: "👑水335%＋24%回復＋次撃1.5倍", desc: "高圧水流の精密狙撃。大火力・小隊回復・次撃1.5倍バフを1枚でこなすエース戦技。" },
      { id: "marina_c3", name: "深海ピアース・ブレイク", type: "break", element: "water", cost: 1, icon: "💥", power: 1.85, stagger: 60, guardBreakMult: 3.0, healRatio: 0.14, exGain: 24, summary: "👑水崩し3.0倍＋14%回復", desc: "水圧貫通弾で装甲とチャージを3.0倍威力で撃ち抜き、小隊を14%回復する。" }
    ],
    iris: [
      { id: "iris_c1", name: "クリムゾン・ワルツ", type: "attack", element: "fire", cost: 0, icon: "🌹", power: 1.65, stagger: 22, exGain: 30, draw: 1, summary: "👑0コス炎165%＋EX30＋1ドロー", desc: "コスト0で驚異の165%炎連撃＆EX+30%＆1ドロー。毎ターン必殺札へ繋ぐ真紅の舞。" },
      { id: "iris_c2", name: "スカーレット・ダンス", type: "attack", element: "fire", cost: 2, icon: "🔥", power: 3.65, stagger: 36, apGain: 1, nextAtkMult: 1.55, exGain: 36, summary: "👑炎365%＋AP+1＋次撃1.55倍", desc: "圧巻の365%紅蓮乱舞に加えAP還元と次撃1.55倍まで付く最強クラスの炎フィニッシャー。" },
      { id: "iris_c3", name: "紅蓮ローズ・ブレイク", type: "break", element: "fire", cost: 1, icon: "💥", power: 1.95, stagger: 60, guardBreakMult: 3.0, shredTurns: 2, exGain: 28, summary: "👑炎崩し3.0倍＋2T防御DOWN", desc: "紅蓮の双刃で敵の装甲とチャージを3.0倍威力で切り裂き、2ターン防御を下げる。" }
    ]
  },

  LIMITED_ULT_BONUS: {
    mikoto:   { power: 4.9, healRatio: 0.35, shield: 1.2,  shredTurns: 3, extraSummary: "＋35%回復＋大防壁＋3T防御DOWN" },
    celestia: { power: 5.5, shredTurns: 3,   guardBreakMult: 3.2, nextAtkMult: 1.6, extraSummary: "＋3T防御DOWN＋装甲3.2倍＋次撃1.6倍" },
    sylphy:   { power: 4.8, apGain: 3,       draw: 3,      shield: 0.9, extraSummary: "＋AP+3＋3ドロー＋防壁" },
    serina:   { power: 4.5, healRatio: 0.65, nextAtkMult: 2.0, draw: 2, extraSummary: "＋65%超回復＋次撃2.0倍＋2ドロー" },
    lily:     { power: 4.9, shield: 2.0,     healRatio: 0.4, counterMult: 3.0, extraSummary: "＋極大聖壁＋40%回復＋300%反撃" },
    marina:   { power: 5.3, healRatio: 0.32, shredTurns: 3, guardBreakMult: 3.0, extraSummary: "＋32%回復＋3T防御DOWN＋装甲3倍" },
    iris:     { power: 5.8, apGain: 2,       nextAtkMult: 1.8, draw: 2, extraSummary: "＋極大580%＋AP+2＋次撃1.8倍" }
  },

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
    state.tacticDeck = state.deckSlots[state.activeDeckIdx].cards;
    return state.deckSlots[state.activeDeckIdx];
  },

  getCardLevel(cardId) {
    state.ownedCards = state.ownedCards || { ...this.STARTER_OWNED_CARDS };
    return state.ownedCards[cardId] || 0;
  },

  // 既存の戦術カードもレアリティごとに強化＆成長幅で差別化
  getLeveledTacticCard(tid) {
    const base = this.TACTIC_CARDS[tid];
    if (!base) return null;
    const lv = Math.max(1, this.getCardLevel(tid));
    const baseBoost = { N: 1.0, R: 1.04, SR: 1.12, SSR: 1.24 }[base.rarity] || 1.0;
    const lvStep = { N: 0.12, R: 0.15, SR: 0.18, SSR: 0.22 }[base.rarity] || 0.12;
    const mult = baseBoost * (1 + (lv - 1) * lvStep);
    return {
      ...base, cardLv: lv,
      power: base.power ? Number((base.power * mult).toFixed(2)) : undefined,
      shield: base.shield ? Number((base.shield * mult).toFixed(2)) : undefined,
      healRatio: base.healRatio ? Number(Math.min(0.85, base.healRatio * mult).toFixed(2)) : undefined,
      counterMult: base.counterMult ? Number((base.counterMult * mult).toFixed(2)) : undefined,
      charId: state.party[0] || "protagonist",
      ownerName: `戦術札 Lv.${lv}`
    };
  },

  // 隊員ごとの固有カード3枚（限定SSR専用 ＋ 全キャラの武器種＆レアリティ差別化）
  getCharCards(charId) {
    const ch = getCharProfile(charId);
    const treeLv = typeof getSkillTreeStage === "function" ? getSkillTreeStage(charId) : 0;
    const treeMult = 1 + treeLv * 0.1;

    // 👑 限定ピックアップSSRは完全専用の超強力カードセットを返す
    if (ch.limited && this.LIMITED_CHAR_CARDS[charId]) {
      return this.LIMITED_CHAR_CARDS[charId].map(c => ({
        ...c,
        charId,
        ownerName: `👑${ch.name}`,
        rarity: "SSR",
        isLimitedCard: true,
        power: c.power ? Number((c.power * treeMult).toFixed(2)) : undefined,
        shield: c.shield ? Number((c.shield * treeMult).toFixed(2)) : undefined,
        healRatio: c.healRatio ? Number(Math.min(0.85, c.healRatio * (1 + treeLv * 0.06)).toFixed(2)) : undefined,
        counterMult: c.counterMult ? Number((c.counterMult * treeMult).toFixed(2)) : undefined
      }));
    }

    // 恒常SSR・SR・R・Nは「レアリティ差 × 8武器種の個性」でしっかり差別化
    const el = ch.element;
    const wp = ch.weapon || "sword";
    const sk = ch.skills || { normal: "通常攻撃", active: "固有戦技", ult: "必殺連携" };
    const rarMult = { N: 1.0, R: 1.1, SR: 1.22, SSR: 1.38 }[ch.rarity] || 1.0;
    const mult = rarMult * treeMult;
    const shortName = (txt, fb) => (txt ? txt.split("：")[0] : fb);

    const isHealer = wp === "staff" || charId === "fiona" || charId === "medibot";
    const isShielder = charId === "chloe" || charId === "ran" || charId === "guardko" || charId === "rikka";

    // 武器種別の追加特性（同じレア度でも武器ごとに明確な役割を持たせる）
    const c1Power = Number(((wp === "greatsword" ? 1.42 : wp === "dual" ? 1.05 : 1.2) * mult).toFixed(2));
    const c1Cost = wp === "dual" ? 0 : 1;
    const c1Draw = (wp === "assault" || wp === "staff") ? 1 : 0;
    const c1Shred = wp === "sniper" ? 2 : 0;
    const c1Shield = (wp === "spear" || isShielder) ? Number((0.45 * rarMult).toFixed(2)) : 0;
    const c1Ex = wp === "dual" ? 22 : (wp === "sword" ? 20 : 16);
    const c1Extra = c1Draw ? "＋1ドロー" : (c1Shred ? "＋2T防御DOWN" : (c1Shield ? "＋🛡️防壁" : (wp === "dual" ? " / 0コス速攻" : "")));

    const c2Power = Number(((wp === "greatsword" ? 2.65 : wp === "sniper" ? 2.45 : 2.3) * mult).toFixed(2));
    const c2Heal = isHealer ? Number(Math.min(0.5, 0.26 * rarMult).toFixed(2)) : 0;
    const c2Shield = isShielder ? Number((0.98 * rarMult).toFixed(2)) : 0;
    const c2Counter = (isShielder || wp === "spear") ? Number((2.05 * rarMult).toFixed(2)) : 0;
    const c2Ap = wp === "dual" ? 1 : 0;
    const c2Summary = isShielder
      ? `🛡️大防壁＋${Math.round(c2Power * 100)}%＋🪞反撃`
      : (isHealer
          ? `💚${Math.round(c2Heal * 100)}%回復＋${Math.round(c2Power * 100)}%`
          : `🔥${Math.round(c2Power * 100)}%${c2Ap ? "＋AP+1" : (wp === "greatsword" ? " / 重撃" : "")}`);

    const c3Power = Number(((wp === "hammer" ? 1.45 : 1.15) * mult).toFixed(2));
    const c3Stag = wp === "hammer" ? 50 : (wp === "greatsword" ? 42 : 36);
    const c3BreakMult = wp === "hammer" ? 2.8 : (ch.rarity === "SSR" ? 2.55 : 2.3);

    return [
      { id: `${charId}_c1`, charId, ownerName: ch.name, rarity: ch.rarity, name: shortName(sk.normal, "通常連撃"), type: "attack", element: el, cost: c1Cost, icon: "⚔️", power: c1Power, stagger: wp === "hammer" ? 24 : 16, exGain: c1Ex, draw: c1Draw || undefined, shredTurns: c1Shred || undefined, shield: c1Shield || undefined, summary: `⚔️${Math.round(c1Power * 100)}%${c1Extra}`, desc: `${ch.name}の基本攻撃。武器特性を活かした元素反応の起点。` },
      { id: `${charId}_c2`, charId, ownerName: ch.name, rarity: ch.rarity, name: shortName(sk.active, "固有戦技"), type: isShielder ? "guard" : (isHealer ? "heal" : "attack"), element: el, cost: 2, icon: isShielder ? "🛡️" : (isHealer ? "💚" : "🔥"), power: c2Power, stagger: wp === "hammer" ? 36 : 26, exGain: 26, healRatio: c2Heal || undefined, shield: c2Shield || undefined, counterMult: c2Counter || undefined, apGain: c2Ap || undefined, summary: c2Summary, desc: sk.active },
      { id: `${charId}_c3`, charId, ownerName: ch.name, rarity: ch.rarity, name: `${ch.name}・体勢崩し`, type: "break", element: el, cost: 1, icon: "💥", power: c3Power, stagger: c3Stag, guardBreakMult: c3BreakMult, shredTurns: wp === "sniper" ? 2 : undefined, exGain: 20, summary: `💥崩し${c3BreakMult}倍 / 体勢-${c3Stag}`, desc: `敵の『装甲硬化』や『必殺チャージ』に当てると${c3BreakMult}倍ダメージ＆強制中断！` }
    ];
  },

  getUltCard(charId) {
    const ch = getCharProfile(charId);
    const sk = ch.skills || { ult: "必殺連携" };
    const treeLv = typeof getSkillTreeStage === "function" ? getSkillTreeStage(charId) : 0;

    // 👑 限定SSRの超絶EX必殺札
    if (ch.limited && this.LIMITED_ULT_BONUS[charId]) {
      const b = this.LIMITED_ULT_BONUS[charId];
      const pwr = Number((b.power + treeLv * 0.35).toFixed(2));
      return {
        id: `${charId}_ult`, charId, ownerName: `👑${ch.name}`, rarity: "SSR",
        name: `【限定EX】${(sk.ult || "必殺連携").split("：")[0]}`,
        type: "ult", element: ch.element, cost: 0, icon: "👑",
        power: pwr, stagger: 68, guardBreakMult: b.guardBreakMult || 2.5,
        healRatio: b.healRatio, shield: b.shield, shredTurns: b.shredTurns,
        nextAtkMult: b.nextAtkMult, apGain: b.apGain, draw: b.draw, counterMult: b.counterMult,
        isUlt: true, isLimitedCard: true,
        summary: `👑0コス超必殺${Math.round(pwr * 100)}%${b.extraSummary}`,
        desc: sk.ult
      };
    }

    const rarBase = { N: 3.4, R: 3.65, SR: 3.95, SSR: 4.35 }[ch.rarity] || 3.6;
    const pwr = Number((rarBase + treeLv * 0.28).toFixed(2));
    return {
      id: `${charId}_ult`, charId, ownerName: ch.name, rarity: "SSR",
      name: `【EX】${(sk.ult || "必殺連携").split("：")[0]}`,
      type: "ult", element: ch.element, cost: 0, icon: "🌟",
      power: pwr, stagger: 48, guardBreakMult: 2.0, isUlt: true,
      summary: `🌟 0コスト超必殺 ${Math.round(pwr * 100)}%`,
      desc: sk.ult
    };
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
  saveGame(); playSfx("switch"); renderDeckView();
  showToast(`🃏 デッキ『${state.deckSlots[idx].name}』に切り替えました`);
}

function renameCurrentDeck() {
  const slot = window.MF_CARDS.ensureDeckSlots();
  const next = prompt("このデッキの名前を入力してください（最大12文字）：", slot.name);
  if (!next || !next.trim()) return;
  slot.name = next.trim().slice(0, 12);
  saveGame(); playSfx("tap"); renderDeckView();
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
    <span class="tag">${card.isLimitedCard ? "👑限定SSR" : (card.rarity || "R")}</span>
    <span class="tag">AP ${card.cost}</span>
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
function openCharCardDetail(charId, cardIdx) {
  const list = window.MF_CARDS.getCharCards(charId);
  if (list[cardIdx]) openCardDetailModal(list[cardIdx]);
}

function renderDeckView() {
  renderTopBar();
  state.ownedCards = state.ownedCards || { ...window.MF_CARDS.STARTER_OWNED_CARDS };
  const activeSlot = window.MF_CARDS.ensureDeckSlots();

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
    const limBadge = ch.limited ? `<span class="tag" style="background:#ffd13b; color:#121318;">👑限定SSR</span>` : "";
    const borderCol = ch.limited ? "border-color:#ffd000;" : "";
    return `
      <div class="card" style="padding:8px; margin-bottom:6px; ${borderCol}">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:5px;">
          ${window.MF_SPRITES.portraitHTML(ch, "icon")}
          <div>
            <strong style="font-size:12px;">${escapeHtml(ch.name)}（${el.icon}${el.name}）${limBadge}</strong>
            <div style="font-size:10px; color:var(--muted);">固有カード3枚（タップで詳細確認）</div>
          </div>
        </div>
        <div style="display:flex; gap:4px; flex-wrap:wrap;">
          ${cards.map((c, idx) => `<button class="btn-xs" style="font-size:10px; padding:3px 6px;" onclick="openCharCardDetail('${id}', ${idx})">${c.icon}${escapeHtml(c.name)}(AP${c.cost})</button>`).join("")}
        </div>
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
  slot.cards.push(tid); state.tacticDeck = slot.cards;
  saveGame(); playSfx("tap"); renderDeckView();
}

function removeTacticCardById(tid) {
  const slot = window.MF_CARDS.ensureDeckSlots();
  const idx = slot.cards.lastIndexOf(tid);
  if (idx < 0) return;
  slot.cards.splice(idx, 1); state.tacticDeck = slot.cards;
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
  slot.cards = next; state.tacticDeck = slot.cards;
  saveGame(); playSfx("gift"); renderDeckView();
  showToast(`✨『${slot.name}』を合計 ${12 + next.length}枚で自動編成しました！`);
}

function resetDeckTo20() {
  const slot = window.MF_CARDS.ensureDeckSlots();
  slot.cards = [...window.MF_CARDS.DEFAULT_TACTIC_DECK]; state.tacticDeck = slot.cards;
  saveGame(); playSfx("switch"); renderDeckView();
  showToast(`⚖️『${slot.name}』を基本20枚に戻しました`);
}

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
