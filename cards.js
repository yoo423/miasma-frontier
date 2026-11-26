window.MF_CARDS = {
  // 全36種の戦術・防御・トラップ・伝説カード（N:8 / R:10 / SR:10 / SSR:8）
  TACTIC_CARDS: {
    // --- N（8種：基本・初期所持中心） ---
    tactical_draw:   { id: "tactical_draw",   rarity: "N", name: "戦術リロード",       type: "buff",   element: "wind",  cost: 0, icon: "🃏", draw: 2, apGain: 1, summary: "🃏2枚ドロー / AP+1", desc: "コスト0で山札から2枚引き、APも+1回復する万能の潤滑油カード。" },
    weak_scan:       { id: "weak_scan",       rarity: "N", name: "弱点部位スキャン",   type: "buff",   element: "wind",  cost: 1, icon: "🎯", shredTurns: 2, summary: "🎯2T防御DOWN", desc: "2ターン敵の防御力を下げ、破壊可能部位へのダメージを大幅に伸ばす。" },
    repair_kit:      { id: "repair_kit",      rarity: "N", name: "救急ナノミスト",     type: "heal",   element: "water", cost: 1, icon: "💚", healRatio: 0.28, summary: "💚HP28%回復", desc: "小隊HPを28%回復する携帯ナノマシン。長期戦の要。" },
    hydro_splash:    { id: "hydro_splash",    rarity: "N", name: "高圧ハイドロ弾",     type: "attack", element: "water", cost: 1, icon: "💧", power: 1.15, stagger: 14, summary: "💧水115% / 反応起点", desc: "水属性を付着させる起点札。炎なら蒸発、氷なら凍結へ繋げられる。" },
    camp_ration:     { id: "camp_ration",     rarity: "N", name: "特製スタミナ飯",     type: "heal",   element: "fire",  cost: 1, icon: "🍖", healRatio: 0.18, nextAtkMult: 1.35, summary: "💚18%回復＋次撃1.35倍", desc: "HPを回復しつつ次の攻撃威力も上げる一石二鳥のキャンプ飯カード。" },
    spark_jab:       { id: "spark_jab",       rarity: "N", name: "スタン・スパーク",   type: "attack", element: "volt",  cost: 0, icon: "⚡", power: 0.75, stagger: 12, exGain: 16, summary: "⚡0コス雷 / EX+16%", desc: "コスト0で出せる雷の牽制札。3連チェインの数合わせやEX稼ぎに便利。" },
    frost_shard:     { id: "frost_shard",     rarity: "N", name: "氷晶スロー",         type: "attack", element: "ice",   cost: 0, icon: "❄️", power: 0.75, stagger: 10, summary: "❄️0コス氷 / 凍結・融解起点", desc: "コスト0で氷属性を付着できる軽快な攻撃札。水や炎のコンボパーツ。" },
    flare_shot:      { id: "flare_shot",      rarity: "N", name: "信号フレア弾",       type: "attack", element: "fire",  cost: 1, icon: "🔥", power: 1.15, stagger: 16, draw: 1, summary: "🔥炎115%＋1ドロー", desc: "炎ダメージを与えながら手札を1枚補充する安定の攻撃カード。" },

    // --- R（10種：読み合い・属性コンボの主力） ---
    counter_stance:  { id: "counter_stance",  rarity: "R", name: "見切りカウンター",   type: "guard",  element: "arc",   cost: 1, icon: "🪞", shield: 0.45, counterMult: 2.2, summary: "🛡️軽減＋🪞220%反撃", desc: "敵の攻撃を受け流し、受けた瞬間に攻撃力220%でカウンター反撃する。" },
    aegis_wall:      { id: "aegis_wall",      rarity: "R", name: "イージス防壁",       type: "guard",  element: "arc",   cost: 1, icon: "🛡️", shield: 0.95, summary: "🛡️強固バリア展開", desc: "小隊全体に厚い結晶バリアを張る。ボスの大技を耐える基本防御札。" },
    shield_breaker:  { id: "shield_breaker",  rarity: "R", name: "アーマーブレイク",   type: "break",  element: "fire",  cost: 1, icon: "🔨", power: 1.25, stagger: 36, guardBreakMult: 2.4, summary: "💥崩し / 装甲2.4倍", desc: "敵の『装甲硬化』や『必殺チャージ』に当てると威力2.4倍＆強制中断！" },
    shock_trap:      { id: "shock_trap",      rarity: "R", name: "電磁ショック罠",     type: "break",  element: "volt",  cost: 2, icon: "⚡", power: 1.55, stagger: 48, guardBreakMult: 2.1, summary: "💥雷崩し / 大体勢削り", desc: "高圧電撃で体勢ゲージを大きく削る。水属性の直後なら感電も発動。" },
    element_boost:   { id: "element_boost",   rarity: "R", name: "元素オーバーロード", type: "buff",   element: "fire",  cost: 1, icon: "🔥", nextAtkMult: 1.65, summary: "🔥次撃 1.65倍", desc: "このターン次に発動する攻撃カードの威力を1.65倍に増幅する。" },
    aqua_barrier:    { id: "aqua_barrier",    rarity: "R", name: "水鏡の守護膜",       type: "guard",  element: "water", cost: 1, icon: "🫧", shield: 0.75, healRatio: 0.14, summary: "🛡️バリア＋💚14%回復", desc: "バリア展開と同時にHPも少し回復する堅実な水属性の防御札。" },
    wind_chaser:     { id: "wind_chaser",     rarity: "R", name: "追風サイクロン",     type: "attack", element: "wind",  cost: 1, icon: "🌪️", power: 1.3, stagger: 16, draw: 1, summary: "🌪️風拡散＋1ドロー", desc: "付着している元素を拡散させつつ1枚ドローする手札回転アタッカー。" },
    volt_battery:    { id: "volt_battery",    rarity: "R", name: "高圧バッテリー",     type: "buff",   element: "volt",  cost: 0, icon: "🔋", apGain: 2, exGain: 15, summary: "⚡AP+2 / EX+15%", desc: "コスト0でAPを+2補給し、EXゲージも上げる高コスト連打用の加速札。" },
    ice_pike:        { id: "ice_pike",        rarity: "R", name: "グレイシャル・パイク", type: "break", element: "ice",  cost: 1, icon: "🧊", power: 1.2, stagger: 32, guardBreakMult: 2.1, summary: "💥氷崩し / 凍結コンボ", desc: "敵の装甲を砕きながら氷を付着。水起点からの凍結＋崩しに大活躍。" },
    arc_resonance:   { id: "arc_resonance",   rarity: "R", name: "アーク共鳴結晶",     type: "attack", element: "arc",   cost: 1, icon: "✨", power: 1.25, shield: 0.4, stagger: 20, summary: "✨攻撃＋🛡️小バリア", desc: "攻撃と同時にバリアも生成し、他元素と組めば結晶化でさらに鉄壁に。" },

    // --- SR（10種：戦術の核となる上級カード） ---
    frost_seal:      { id: "frost_seal",      rarity: "SR", name: "絶対零度トラップ",  type: "attack", element: "ice",   cost: 1, icon: "❄️", power: 1.4, stagger: 22, summary: "❄️氷140% / 凍結狙い", desc: "高威力の氷罠。水付着の敵に当てれば即座に『凍結』で行動を封殺。" },
    chain_spark:     { id: "chain_spark",     rarity: "SR", name: "連鎖ライトニング",  type: "attack", element: "volt",  cost: 1, icon: "⚡", power: 1.35, stagger: 20, exGain: 30, summary: "⚡雷135% / EX+30%", desc: "EX必殺ゲージを一気に30%加速させる雷連撃カード。" },
    gale_step:       { id: "gale_step",       rarity: "SR", name: "疾風ステップ",      type: "buff",   element: "wind",  cost: 0, icon: "🌪️", draw: 1, shield: 0.5, summary: "🃏1ドロー＋🛡️バリア", desc: "コスト0で手札を1枚補充しながらバリアも張る攻防一体の名札。" },
    crimson_flare:   { id: "crimson_flare",   rarity: "SR", name: "紅蓮フレア弾",      type: "attack", element: "fire",  cost: 2, icon: "☄️", power: 2.4, stagger: 24, summary: "🔥炎240% / 蒸発・融解〆", desc: "水や氷の直後に3枚目として置くと凄まじい反応ダメージを叩き出す。" },
    mirror_aegis:    { id: "mirror_aegis",    rarity: "SR", name: "鏡面リフレクター",  type: "guard",  element: "ice",   cost: 2, icon: "💠", shield: 1.25, counterMult: 2.55, summary: "🛡️大バリア＋🪞255%反撃", desc: "鉄壁のバリアと255%反撃を同時に構える上位カウンターカード。" },
    impact_hammer:   { id: "impact_hammer",   rarity: "SR", name: "重圧インパクト",    type: "break",  element: "arc",   cost: 2, icon: "⚒️", power: 1.75, stagger: 58, guardBreakMult: 2.6, summary: "💥超大崩し / 2.6倍", desc: "装甲硬化したボスを1発でブレイク寸前まで追い込む重撃カード。" },
    tidal_surge:     { id: "tidal_surge",     rarity: "SR", name: "タイダル・サージ",  type: "attack", element: "water", cost: 2, icon: "🌊", power: 2.15, healRatio: 0.16, stagger: 22, summary: "💧水215%＋💚16%回復", desc: "大波で敵を洗い流しつつ小隊HPも回復する万能の水属性フィニッシャー。" },
    sniper_lock:     { id: "sniper_lock",     rarity: "SR", name: "精密ウィークロック", type: "buff",   element: "volt",  cost: 1, icon: "🔭", shredTurns: 3, nextAtkMult: 1.45, summary: "🎯3T防御DOWN＋1.45倍", desc: "敵の弱点部位を3ターン露呈させ、次の攻撃威力も1.45倍にする狙撃支援。" },
    sanctuary_bell:  { id: "sanctuary_bell",  rarity: "SR", name: "白狐の癒し鈴",      type: "heal",   element: "ice",   cost: 2, icon: "🔔", healRatio: 0.42, shield: 0.55, summary: "💚HP42%大回復＋🛡️防壁", desc: "ピンチの小隊を一気に立て直す大回復＆氷結バリアカード。" },
    tempest_dance:   { id: "tempest_dance",   rarity: "SR", name: "烈風ツインエッジ",  type: "attack", element: "wind",  cost: 1, icon: "🍃", power: 1.55, apGain: 1, exGain: 18, summary: "🌪️風155%＋AP+1還元", desc: "実質コスト0で放てる風属性の強襲攻撃。チェインの繋ぎに最強クラス。" },

    // --- SSR（8種：伝説級の切り札カード） ---
    ssr_chrono_sync: { id: "ssr_chrono_sync", rarity: "SSR", name: "【伝説】クロノ・シンクロ", type: "buff",   element: "arc",   cost: 0, icon: "⏳", draw: 3, apGain: 2, nextAtkMult: 1.45, summary: "👑AP+2 / 3ドロー / 1.45倍", desc: "コスト0でAP+2・3枚ドロー・次撃1.45倍を同時に行う最強の展開カード。" },
    ssr_radiant_nova:{ id: "ssr_radiant_nova",rarity: "SSR", name: "【伝説】融光ノヴァ",       type: "attack", element: "fire",  cost: 2, icon: "🌟", power: 3.2, stagger: 38, exGain: 30, summary: "👑炎320% / EX+30%", desc: "融光種の過飽和エネルギーを解放する極大火力攻撃札。" },
    ssr_zero_domain: { id: "ssr_zero_domain", rarity: "SSR", name: "【伝説】零度結界・アーク", type: "guard",  element: "ice",   cost: 1, icon: "❄️", shield: 1.45, healRatio: 0.25, counterMult: 2.65, summary: "👑大防壁＋回復＋265%反撃", desc: "コスト1で大バリア・HP25%回復・265%反撃を同時展開する鉄壁の切り札。" },
    ssr_storm_break: { id: "ssr_storm_break", rarity: "SSR", name: "【伝説】天雷ブレイカー",   type: "break",  element: "volt",  cost: 1, icon: "🌩️", power: 1.95, stagger: 64, guardBreakMult: 3.0, shredTurns: 2, summary: "👑崩し3倍＋防御DOWN", desc: "コスト1で敵の装甲とチャージを3倍威力で粉砕し、防御力まで下げる最強の崩し札。" },
    ssr_leviathan:   { id: "ssr_leviathan",   rarity: "SSR", name: "【伝説】深淵リヴァイアサン", type: "attack", element: "water", cost: 2, icon: "🐉", power: 2.95, healRatio: 0.28, stagger: 35, summary: "👑水295%＋💚28%回復", desc: "深海の激流で敵を呑み込みながら小隊を大きく癒やす攻防一体の伝説札。" },
    ssr_gale_emperor:{ id: "ssr_gale_emperor",rarity: "SSR", name: "【伝説】嵐帝の陣風",       type: "attack", element: "wind",  cost: 1, icon: "🦅", power: 2.25, draw: 2, apGain: 1, exGain: 25, summary: "👑風225% / 2ドロー / AP+1", desc: "実質コスト0で大ダメージ・2ドロー・EX+25%を叩き出す高速コンボの王。" },
    ssr_ark_judgment:{ id: "ssr_ark_judgment",rarity: "SSR", name: "【伝説】方舟の審判砲",     type: "attack", element: "arc",   cost: 3, icon: "🛰️", power: 4.1, stagger: 55, guardBreakMult: 2.2, summary: "👑極大410% / 装甲貫通", desc: "軌道上のリベルタから放たれる決戦砲撃。防御もチャージも纏めて吹き飛ばす。" },
    ssr_miracle_feast:{ id: "ssr_miracle_feast",rarity: "SSR", name: "【伝説】黄金の祝宴",     type: "heal",   element: "fire",  cost: 1, icon: "👑", healRatio: 0.55, nextAtkMult: 1.8, exGain: 25, summary: "👑HP55%回復＋次撃1.8倍", desc: "戦況を根底から覆す奇跡の回復＆超攻撃バフカード。" }
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

  DEX_MILESTONES: [
    { count: 15, gems: 320, label: "15種収集ボーナス" },
    { count: 25, gems: 640, label: "25種収集ボーナス" },
    { count: 36, gems: 1600, label: "全36種コンプリート！" }
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
      
