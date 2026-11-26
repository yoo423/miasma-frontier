window.MF_DATA = {
  APP_VERSION: "1.0.0",

  ELEMENTS: {
    fire:  { id: "fire",  name: "炎", icon: "🔥", color: "#ff595e", desc: "高火力・燃焼スリップ" },
    water: { id: "water", name: "水", icon: "💧", color: "#1982c4", desc: "湿潤付与・敵速度低下" },
    volt:  { id: "volt",  name: "雷", icon: "⚡", color: "#ffca3a", desc: "SP回収効率UP・感電連鎖" },
    ice:   { id: "ice",   name: "氷", icon: "❄️", color: "#4cc9f0", desc: "行動鈍化・会心率上昇" },
    wind:  { id: "wind",  name: "風", icon: "🌪️", color: "#2ec4b6", desc: "移動＆攻撃速度UP・拡散" },
    arc:   { id: "arc",   name: "煌", icon: "✨", color: "#b565ff", desc: "体勢ブレイク＆結晶バリア" }
  },

  ELEMENT_REACTIONS: [
    { pair: ["fire", "water"], name: "蒸発", effect: "単発ダメージ 2.0倍" },
    { pair: ["fire", "ice"],   name: "融解", effect: "防御無視の超ダメージ" },
    { pair: ["fire", "volt"],  name: "過負荷", effect: "大爆発＋体勢ゲージ大削り" },
    { pair: ["water", "volt"], name: "感電", effect: "周囲の敵へ雷ダメージ連鎖" },
    { pair: ["water", "ice"],  name: "凍結", effect: "敵を数秒間完全拘束" },
    { pair: ["volt", "ice"],   name: "超電導", effect: "部位・物理防御 50%DOWN" },
    { pair: ["wind", "fire"],  name: "炎拡散", effect: "広範囲に燃焼をばら撒く" },
    { pair: ["wind", "water"], name: "水拡散", effect: "広範囲に湿潤をばら撒く" },
    { pair: ["wind", "volt"],  name: "雷拡散", effect: "広範囲に感電をばら撒く" },
    { pair: ["wind", "ice"],   name: "氷嵐拡散", effect: "周囲の敵ごと氷結させる" },
    { pair: ["arc", "any"],    name: "結晶化", effect: "味方全員に属性バリア生成" }
  ],

  WEAPONS: {
    greatsword: { id: "greatsword", name: "大剣", icon: "🗡️", role: "部位破壊特化・一撃重火力" },
    sword:      { id: "sword",      name: "片手剣", icon: "⚔️", role: "隙が少なく扱いやすい万能型" },
    dual:       { id: "dual",       name: "双剣", icon: "🔪", role: "超高速連撃・SP＆元素回収" },
    spear:      { id: "spear",      name: "戦術槍", icon: "🔱", role: "中距離突き・体勢ブレイク削り" },
    hammer:     { id: "hammer",     name: "重槌", icon: "🔨", role: "装甲粉砕・ダウン時間延長" },
    assault:    { id: "assault",    name: "アサルト銃", icon: "🔫", role: "移動射撃・安定中距離ダメージ" },
    sniper:     { id: "sniper",     name: "狙撃銃", icon: "🎯", role: "弱点部位ピンポイント狙撃" },
    staff:      { id: "staff",      name: "戦術杖", icon: "🪄", role: "広範囲元素攻撃・回復＆支援" }
  },

  PROTAGONIST_STYLES: [
    { id: "m_cool", name: "クール系男子", emoji: "🧑‍✈️", tag: "冷静沈着な若き指揮官" },
    { id: "m_genki", name: "元気系男子", emoji: "👦", tag: "行動力抜群の熱血ハンター" },
    { id: "f_cool", name: "クール系女子", emoji: "👩‍✈️", tag: "的確な指示を出す凛々しい隊長" },
    { id: "f_genki", name: "元気系女子", emoji: "👧", tag: "笑顔で小隊を引っ張るムードメーカー" }
  ],

  CHARACTERS: {
    protagonist: {
      id: "protagonist",
      name: "隊長（主人公）",
      rarity: "R",
      isProtagonist: true,
      kemonomimi: "人間",
      element: "arc",
      weapon: "sword",
      image: "assets/protagonist.jpg",
      emoji: "🧑‍✈️",
      campSkill: "全ライン効率 +10%（武器・属性を自由切替可能）",
      voiceLines: [
        "第7クリアラー小隊、調査を開始する！",
        "浄化ビーコンの反応は良好だ。次のエリアへ進もう。",
        "みんなの元素連携があれば、どんな主霧獣でも倒せる！"
      ]
    },
    momo: {
      id: "momo",
      name: "モモ",
      rarity: "R",
      kemonomimi: "犬耳ケモミミ",
      element: "fire",
      weapon: "dual",
      image: "assets/momo.jpg",
      emoji: "🐶",
      campSkill: "バフ料理の満腹度＆効果時間 +20%",
      voiceLines: [
        "ワンッ！隊長、今日のキャンプ飯は特製お肉シチューだよ！",
        "任せて！双剣の連続斬りで霧獣のシッポを狙うね！",
        "しっぽが勝手に揺れちゃう〜！早く冒険に出ようよ！"
      ]
    },
    mint: {
      id: "mint",
      name: "ミント",
      rarity: "R",
      kemonomimi: "うさ耳ケモミミ",
      element: "wind",
      weapon: "sniper",
      image: "assets/mint.jpg",
      emoji: "🐰",
      campSkill: "ボスの破壊可能部位を自動マーキング",
      voiceLines: [
        "……ふぁ。あ、隊長。風向き、バッチリ観測できてます……。",
        "うさ耳は伊達じゃないです。遠くの霧獣の足音も聞こえますよ。",
        "狙撃準備完了……右の角、いつでも撃ち抜けます。"
      ]
    },
    aoi: {
      id: "aoi",
      name: "アオイ",
      rarity: "R",
      kemonomimi: "人間",
      element: "arc",
      weapon: "assault",
      image: "assets/aoi.jpg",
      emoji: "🎖️",
      campSkill: "作戦記録（経験値）の獲得量 +10%",
      voiceLines: [
        "隊長！本日の物資点検と弾薬の補充、完了しております！",
        "モモとミントのサポートは私にお任せください！",
        "方舟都市リベルタの期待に応えられるよう、全力で戦います！"
      ]
    }
  },

  SERIAL_CODES: {
    "FRONTIER2026": { label: "リリース記念パック", gems: 1600, credits: 10000, en: 60 },
    "MIASMA777":    { label: "第7小隊応援ギフト", gems: 800,  credits: 5000,  en: 40 }
  }
};
