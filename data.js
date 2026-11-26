window.MF_DATA = {
  APP_VERSION: "1.1.0",

  ELEMENTS: {
    fire:  { id: "fire",  name: "炎", icon: "🔥", desc: "高火力・燃焼スリップ" },
    water: { id: "water", name: "水", icon: "💧", desc: "湿潤付与・速度低下" },
    volt:  { id: "volt",  name: "雷", icon: "⚡", desc: "SP回収UP・感電連鎖" },
    ice:   { id: "ice",   name: "氷", icon: "❄️", desc: "行動鈍化・会心率UP" },
    wind:  { id: "wind",  name: "風", icon: "🌪️", desc: "速度UP・元素拡散" },
    arc:   { id: "arc",   name: "煌", icon: "✨", desc: "ブレイク＆結晶バリア" }
  },

  ELEMENT_REACTIONS: [
    { pair: ["fire", "water"], name: "蒸発", effect: "単発ダメージ 2.0倍" },
    { pair: ["fire", "ice"],   name: "融解", effect: "防御無視の超ダメージ" },
    { pair: ["fire", "volt"],  name: "過負荷", effect: "爆発＋体勢ゲージ大削り" },
    { pair: ["water", "volt"], name: "感電", effect: "周囲の敵へ雷ダメージ連鎖" },
    { pair: ["water", "ice"],  name: "凍結", effect: "敵を数秒間完全拘束" },
    { pair: ["volt", "ice"],   name: "超電導", effect: "部位・物理防御 50%DOWN" },
    { pair: ["wind", "fire"],  name: "炎拡散", effect: "燃焼を広範囲に拡散" },
    { pair: ["wind", "water"], name: "水拡散", effect: "湿潤を広範囲に拡散" },
    { pair: ["wind", "volt"],  name: "雷拡散", effect: "感電を広範囲に拡散" },
    { pair: ["wind", "ice"],   name: "氷嵐拡散", effect: "周囲の敵ごと氷結" },
    { pair: ["arc", "any"],    name: "結晶化", effect: "味方全員に属性バリア生成" }
  ],

  WEAPONS: {
    greatsword: { id: "greatsword", name: "大剣", icon: "🗡️", role: "部位破壊特化・一撃重火力" },
    sword:      { id: "sword",      name: "片手剣", icon: "⚔️", role: "隙が少なく扱いやすい万能型" },
    dual:       { id: "dual",       name: "双剣", icon: "🔪", role: "超高速連撃・SP＆元素回収" },
    spear:      { id: "spear",      name: "戦術槍", icon: "🔱", role: "中距離突き・ブレイク削り" },
    hammer:     { id: "hammer",     name: "重槌", icon: "🔨", role: "装甲粉砕・ダウン延長" },
    assault:    { id: "assault",    name: "アサルト銃", icon: "🔫", role: "移動射撃・安定中距離火力" },
    sniper:     { id: "sniper",     name: "狙撃銃", icon: "🎯", role: "弱点部位ピンポイント狙撃" },
    staff:      { id: "staff",      name: "戦術杖", icon: "🪄", role: "広範囲元素攻撃・回復支援" }
  },

  PROTAGONIST_STYLES: [
    { id: "m_cool", name: "クール系男子", emoji: "🧑‍✈️", tag: "冷静沈着な若き指揮官" },
    { id: "m_genki", name: "元気系男子", emoji: "👦", tag: "行動力抜群の熱血ハンター" },
    { id: "f_cool", name: "クール系女子", emoji: "👩‍✈️", tag: "的確な指示を出す凛々しい隊長" },
    { id: "f_genki", name: "元気系女子", emoji: "👧", tag: "笑顔で小隊を引っ張るムードメーカー" }
  ],

  BANNERS: [
    {
      id: "pickup_mikoto",
      shortName: "❄️ 白狐PU",
      tag: "限定ピックアップ",
      title: "白狐の絶対零度・特別招集",
      featuredSsr: "mikoto",
      featuredSr: ["leila", "belle"],
      desc: "限定SSR『ミコト（白狐ケモミミ）』出現率UP！固有ゲージでボスを完全凍結。"
    },
    {
      id: "pickup_celestia",
      shortName: "⚡ 紫電PU",
      tag: "限定ピックアップ",
      title: "紫電の精密狙撃・特別招集",
      featuredSsr: "celestia",
      featuredSr: ["melissa", "noah"],
      desc: "限定SSR『セレスティア』出現率UP！スロー狙撃で破壊可能部位を一撃粉砕。"
    },
    {
      id: "standard_all",
      shortName: "🌠 恒常招集",
      tag: "スタンダード",
      title: "方舟都市・開拓隊員スカウト",
      featuredSsr: "lunaria",
      featuredSr: ["koharu", "fiona"],
      desc: "看板娘『ルナリア』をはじめとする恒常SSR・SR隊員がラインナップ。"
    }
  ],

  CHARACTERS: {
    protagonist: {
      id: "protagonist", name: "隊長（主人公）", rarity: "R", isProtagonist: true,
      kemonomimi: "人間", element: "arc", weapon: "sword", image: "assets/protagonist.jpg", emoji: "🧑‍✈️",
      campSkill: "全ライン効率 +10%（武器・属性自由切替／昇格でSSR進化）",
      voiceLines: ["第7クリアラー小隊、調査を開始する！", "みんなの元素連携があれば、どんな主霧獣でも倒せる！"]
    },
    // --- SSR ---
    lunaria: {
      id: "lunaria", name: "ルナリア", rarity: "SSR", limited: false,
      kemonomimi: "人間", element: "fire", weapon: "greatsword", image: "assets/lunaria.jpg", emoji: "🎀",
      campSkill: "精錬炉の加工速度 +30%（部位破壊特化アタッカー）",
      voiceLines: ["燃やし尽くせば霧なんて残らないでしょ！", "大きいリボンは気合の証！さあ突撃だよ隊長！"]
    },
    mikoto: {
      id: "mikoto", name: "ミコト", rarity: "SSR", limited: true,
      kemonomimi: "白狐ケモミミ", element: "ice", weapon: "staff", image: "assets/mikoto.jpg", emoji: "🦊",
      campSkill: "レア素材ドロップ率 +20%（絶対零度・ボス凍結）",
      voiceLines: ["白狐の氷華が、すべての瘴霧を封じ込めます。", "……しっぽに触りたいのですか？ 今だけ特別ですよ。"]
    },
    celestia: {
      id: "celestia", name: "セレスティア", rarity: "SSR", limited: true,
      kemonomimi: "人間", element: "volt", weapon: "sniper", image: "assets/celestia.jpg", emoji: "⚡",
      campSkill: "拠点の発電効率 +30%（スロー精密部位狙撃）",
      voiceLines: ["ターゲット捕捉。風速計算完了……撃ち抜きます。", "作戦が終わったら、例の限定プリンを一緒に食べましょう。"]
    },
    valeria: {
      id: "valeria", name: "ヴァレリア", rarity: "SSR", limited: false,
      kemonomimi: "人間", element: "water", weapon: "spear", image: "assets/valeria.jpg", emoji: "👑",
      campSkill: "レア鉱石の産出率 +25%（広範囲湿潤＆連続突き）",
      voiceLines: ["方舟都市の名門に懸けて、この開拓作戦を成功させますわ！"]
    },
    chloe: {
      id: "chloe", name: "クロエ", rarity: "SSR", limited: false,
      kemonomimi: "人間", element: "arc", weapon: "sword", image: "assets/chloe.jpg", emoji: "👓",
      campSkill: "設計図の研究コスト -25%（結晶バリア＆ギミック解除）",
      voiceLines: ["ふぁ〜……あ、この古代遺跡のデータ、すっごく面白いです！"]
    },
    sylphy: {
      id: "sylphy", name: "シルフィ", rarity: "SSR", limited: true,
      kemonomimi: "オオカミ耳ケモミミ", element: "wind", weapon: "dual", image: "assets/sylphy.jpg", emoji: "🐺",
      campSkill: "採掘スピード +35%（滑空距離2倍＆超高速連撃）",
      voiceLines: ["風の匂いが変わった！デカい獲物が近くに潜んでるぞ！"]
    },
    // --- SR ---
    koharu: {
      id: "koharu", name: "コハル", rarity: "SR", kemonomimi: "キツネ耳ケモミミ", element: "arc", weapon: "hammer",
      image: "assets/koharu.jpg", emoji: "🔧", campSkill: "建築・タレット作成コスト -20%",
      voiceLines: ["どんな頑丈な霧獣の装甲も、特製ハンマーで一撃だよ！"]
    },
    fiona: {
      id: "fiona", name: "フィオナ", rarity: "SR", kemonomimi: "人間", element: "water", weapon: "assault",
      image: "assets/fiona.jpg", emoji: "💉", campSkill: "回復ポーション生産数 +40%",
      voiceLines: ["無理は禁物ですよ隊長。回復弾はたっぷり用意してありますから♪"]
    },
    noah: {
      id: "noah", name: "ノア", rarity: "SR", kemonomimi: "黒猫耳ケモミミ", element: "wind", weapon: "sword",
      image: "assets/noah.jpg", emoji: "🐈‍⬛", campSkill: "探索派遣の報酬量 +20%",
      voiceLines: ["ニャハッ！一番乗りはボクのものだよー！"]
    },
    leila: {
      id: "leila", name: "レイラ", rarity: "SR", kemonomimi: "人間", element: "ice", weapon: "sniper",
      image: "assets/leila.jpg", emoji: "❄️", campSkill: "冷却装置の稼働効率 +25%",
      voiceLines: ["……雪原では静かに。一発で仕留めます。"]
    },
    kaede: {
      id: "kaede", name: "カエデ", rarity: "SR", kemonomimi: "人間", element: "fire", weapon: "sword",
      image: "assets/kaede.jpg", emoji: "🍳", campSkill: "バフ料理の効果時間 2倍",
      voiceLines: ["腹が減っては狩りはできません！特製お弁当どうぞ！"]
    },
    melissa: {
      id: "melissa", name: "メリッサ", rarity: "SR", kemonomimi: "人間", element: "volt", weapon: "staff",
      image: "assets/melissa.jpg", emoji: "🧪", campSkill: "電池・エネルギーコア生産 +25%",
      voiceLines: ["ヒヒッ、この新型コイルで感電ダメージを倍増させてあげる！"]
    },
    belle: {
      id: "belle", name: "ベル", rarity: "SR", kemonomimi: "うさ耳ケモミミ", element: "water", weapon: "staff",
      image: "assets/belle.jpg", emoji: "🔮", campSkill: "浄化ビーコンの有効範囲 +20%",
      voiceLines: ["水晶玉が告げています……今日はレア鉱石が見つかる吉日です♪"]
    },
    ran: {
      id: "ran", name: "ラン", rarity: "SR", kemonomimi: "人間", element: "arc", weapon: "spear",
      image: "assets/ran.jpg", emoji: "🛡️", campSkill: "防衛タレットの攻撃力 +25%",
      voiceLines: ["背中は私が守ります。隊長は前線に集中してください！"]
    },
    // --- R ---
    momo: {
      id: "momo", name: "モモ", rarity: "R", kemonomimi: "犬耳ケモミミ", element: "fire", weapon: "dual",
      image: "assets/momo.jpg", emoji: "🐶", campSkill: "バフ料理の満腹度＆効果 +20%",
      voiceLines: ["ワンッ！隊長、今日のキャンプ飯は特製お肉シチューだよ！"]
    },
    mint: {
      id: "mint", name: "ミント", rarity: "R", kemonomimi: "うさ耳ケモミミ", element: "wind", weapon: "sniper",
      image: "assets/mint.jpg", emoji: "🐰", campSkill: "ボスの破壊可能部位を自動マーキング",
      voiceLines: ["……ふぁ。うさ耳は伊達じゃないです。遠くの足音も聞こえますよ。"]
    },
    aoi: {
      id: "aoi", name: "アオイ", rarity: "R", kemonomimi: "人間", element: "arc", weapon: "assault",
      image: "assets/aoi.jpg", emoji: "🎖️", campSkill: "作戦記録の獲得量 +10%",
      voiceLines: ["隊長！本日の物資点検と弾薬の補充、完了しております！"]
    },
    haruto: {
      id: "haruto", name: "ハルト", rarity: "R", kemonomimi: "人間", element: "volt", weapon: "sword",
      image: "assets/haruto.jpg", emoji: "🧰", campSkill: "工場ラインの増設コスト -15%",
      voiceLines: ["コンベアの調子が悪いのか？オレの工具箱に任せな！"]
    },
    yuzu: {
      id: "yuzu", name: "ユズ", rarity: "R", kemonomimi: "人間", element: "water", weapon: "hammer",
      image: "assets/yuzu.jpg", emoji: "🎣", campSkill: "釣りの大物ヒット率 +25%",
      voiceLines: ["ふわぁ……釣り糸垂らしてのんびり待つの、最高……。"]
    },
    crow: {
      id: "crow", name: "クロウ", rarity: "R", kemonomimi: "人間", element: "wind", weapon: "dual",
      image: "assets/crow.jpg", emoji: "🦅", campSkill: "フィールドの隠し宝箱を探知",
      voiceLines: ["フッ……闇に隠されし古代の宝箱、この漆黒の瞳にはお見通しだ。"]
    },
    sakura: {
      id: "sakura", name: "サクラ", rarity: "R", kemonomimi: "人間", element: "fire", weapon: "staff",
      image: "assets/sakura.jpg", emoji: "🌿", campSkill: "薬草・花の採取数が 2倍",
      voiceLines: ["この地域の薬草はとっても元気ですね。大切に採取しましょう。"]
    },
    rikka: {
      id: "rikka", name: "リッカ", rarity: "R", kemonomimi: "人間", element: "ice", weapon: "spear",
      image: "assets/rikka.jpg", emoji: "🧊", campSkill: "氷結ギミックの持続時間延長",
      voiceLines: ["氷の防壁を展開。敵の突進はここで食い止めます。"]
    },
    // --- N ---
    pochi: {
      id: "pochi", name: "ポチ", rarity: "N", kemonomimi: "自律ドローン", element: "arc", weapon: "staff",
      image: "assets/pochi.jpg", emoji: "🤖", campSkill: "キャンプ内の資材自動回収",
      voiceLines: ["ピポッ！巡回ルート異常ナシ！"]
    },
    guardko: {
      id: "guardko", name: "ガード子", rarity: "N", kemonomimi: "警備ロボ", element: "arc", weapon: "hammer",
      image: "assets/guardko.jpg", emoji: "🦾", campSkill: "拠点防衛時の壁耐久 +20%",
      voiceLines: ["警備モード起動。隊長ノ安全ヲ最優先デ確保シマス。"]
    },
    tama: {
      id: "tama", name: "タマ", rarity: "N", kemonomimi: "三毛猫ロボ", element: "fire", weapon: "dual",
      image: "assets/tama.jpg", emoji: "🐱", campSkill: "害獣追い払い＆ドロップ拾い",
      voiceLines: ["ニャー！（電子音）"]
    },
    driller: {
      id: "driller", name: "ドリラーMk-II", rarity: "N", kemonomimi: "掘削ロボ", element: "arc", weapon: "spear",
      image: "assets/driller.jpg", emoji: "⛏️", campSkill: "鉱脈を一撃で粉砕採掘",
      voiceLines: ["ガガガッ！高純度アーク鉱脈ヲ発見！"]
    },
    medibot: {
      id: "medibot", name: "メディボット", rarity: "N", kemonomimi: "救急ロボ", element: "water", weapon: "staff",
      image: "assets/medibot.jpg", emoji: "➕", campSkill: "戦闘中の自動回復パック投下",
      voiceLines: ["ピピッ、救急パックヲ投下シマス！"]
    },
    scanner: {
      id: "scanner", name: "スキャナーくん", rarity: "N", kemonomimi: "観測気球ロボ", element: "wind", weapon: "sniper",
      image: "assets/scanner.jpg", emoji: "🎈", campSkill: "周囲の霧マップ索敵範囲拡大",
      voiceLines: ["プシューッ！上空カラ敵ノ位置ヲマーキング完了！"]
    }
  },

  SERIAL_CODES: {
    "FRONTIER2026": { label: "リリース記念パック", gems: 1600, credits: 10000, en: 60, books: 25, cores: 5 },
    "MIASMA777":    { label: "第7小隊応援ギフト", gems: 1600, credits: 5000,  en: 40, books: 15, cores: 3 }
  }
    ,
  ENEMIES: [
    {
      id: "wolf_pack",
      name: "ミアズマ・ウルフ群",
      rank: "通常霧獣",
      emoji: "🐺",
      recPower: 100,
      maxHp: 900,
      maxStagger: 60,
      atk: 65,
      parts: [],
      rewards: { credits: 1200, books: 4, cores: 1, gems: 40, rankExp: 35 }
    },
    {
      id: "crystal_beetle",
      name: "結晶甲虫・重装種",
      rank: "精鋭霧獣",
      emoji: "🪲",
      recPower: 220,
      maxHp: 2100,
      maxStagger: 90,
      atk: 115,
      parts: [
        { name: "高純度結晶殻", hpRatio: 0.45, drop: "純度結晶殻" }
      ],
      rewards: { credits: 2600, books: 8, cores: 2, gems: 80, rankExp: 65 }
    },
    {
      id: "moss_behemoth",
      name: "主霧獣『モス・ベヒーモス』",
      rank: "第1エリア主霧獣",
      emoji: "🦏",
      recPower: 360,
      maxHp: 4200,
      maxStagger: 120,
      atk: 175,
      parts: [
        { name: "結晶の巨角", hpRatio: 0.35, drop: "ベヒーモスの結晶角" },
        { name: "背中の苔殻", hpRatio: 0.40, drop: "古代樹の重甲殻" },
        { name: "強靭な巨尾", hpRatio: 0.30, drop: "巨獣の剛尾" }
      ],
      rewards: { credits: 5200, books: 15, cores: 4, gems: 160, rankExp: 120 }
    },
    {
      id: "thunder_wyvern",
      name: "主霧獣『サンダー・ワイバーン』",
      rank: "第2エリア主霧獣",
      emoji: "🐉",
      recPower: 680,
      maxHp: 8500,
      maxStagger: 150,
      atk: 290,
      parts: [
        { name: "右雷翼", hpRatio: 0.32, drop: "紫電の飛竜翼" },
        { name: "左雷翼", hpRatio: 0.32, drop: "紫電の飛竜翼" },
        { name: "蓄電の尾針", hpRatio: 0.28, drop: "高圧雷撃コア" }
      ],
      rewards: { credits: 9500, books: 28, cores: 7, gems: 240, rankExp: 200 }
    },
    {
      id: "glacial_mammoth",
      name: "主霧獣『グレイシャル・マンモス』",
      rank: "第3エリア主霧獣",
      emoji: "🦣",
      recPower: 1100,
      maxHp: 15000,
      maxStagger: 180,
      atk: 430,
      parts: [
        { name: "氷結の双牙", hpRatio: 0.35, drop: "永久凍土の巨牙" },
        { name: "背中の冷却炉殻", hpRatio: 0.40, drop: "暴走冷却炉パーツ" }
      ],
      rewards: { credits: 16000, books: 45, cores: 12, gems: 320, rankExp: 320 }
    }
  ]

};
