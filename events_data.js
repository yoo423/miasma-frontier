// 動作テストで別の日付を確認したい時だけ "2026-12-15" などを入力（通常は "" のまま）
window.MF_EVENT_DATE_OVERRIDE = "";

window.MF_EVENTS_DATA = {
  // 月替わり限定PU（1人制）＆ 毎月11〜20日の復刻PUスケジュール
  GACHA_SCHEDULES: [
    // 11月プレ期間（12月開幕まで最初の1人PUを先行開催）
    { id: "pu_202611_mikoto", start: "2026-11-01", end: "2026-11-30", shortName: "❄️ ミコトPU", tag: "限定ピックアップ", title: "白狐の絶対零度・先行特別招集", featuredSsr: "mikoto", isLimitedBanner: true, desc: "限定SSR『ミコト』単独ピックアップ！限定隊員は本招集または復刻招集でのみ出現します。" },

    // 2026年12月：限定PU（ミコト）＋ 中旬特別PU（ヴァレリア）
    { id: "pu_202612_mikoto",  start: "2026-12-01", end: "2026-12-31", shortName: "❄️ ミコトPU",   tag: "12月限定PU", title: "白銀聖夜の白狐・限定招集", featuredSsr: "mikoto",  isLimitedBanner: true, desc: "12月限定SSR『ミコト』ピックアップ！終了後は復刻招集でのみ再登場します。" },
    { id: "rep_202612_valeria",start: "2026-12-11", end: "2026-12-20", shortName: "👑 特別復刻",   tag: "中旬特別PU", title: "蒼銀の騎士・中旬特別ピックアップ", featuredSsr: "valeria", isRerun: true, desc: "12月中旬限定！名門騎士『ヴァレリア』の出現率が大幅UP。" },

    // 2027年1月：限定PU（セレスティア）＋ 中旬復刻PU（ミコト）
    { id: "pu_202701_celestia",start: "2027-01-01", end: "2027-01-31", shortName: "⚡ セレスティアPU", tag: "1月限定PU", title: "新春の紫電狙撃・限定招集", featuredSsr: "celestia", isLimitedBanner: true, desc: "1月限定SSR『セレスティア』ピックアップ！終了後は復刻招集でのみ再登場します。" },
    { id: "rep_202701_mikoto", start: "2027-01-11", end: "2027-01-20", shortName: "❄️ ミコト復刻",    tag: "中旬復刻PU", title: "【復刻】白狐の絶対零度・特別招集", featuredSsr: "mikoto",   isLimitedBanner: true, isRerun: true, desc: "12月限定SSR『ミコト』が1月中旬限定で復刻登場！" },

    // 2027年2月：限定PU（シルフィ）＋ 中旬復刻PU（セレスティア）
    { id: "pu_202702_sylphy",  start: "2027-02-01", end: "2027-02-28", shortName: "🐺 シルフィPU",    tag: "2月限定PU", title: "嵐を駆ける孤狼・限定招集", featuredSsr: "sylphy",   isLimitedBanner: true, desc: "2月限定SSR『シルフィ』ピックアップ！終了後は復刻招集でのみ再登場します。" },
    { id: "rep_202702_celestia",start:"2027-02-11", end: "2027-02-20", shortName: "⚡ セレス復刻",    tag: "中旬復刻PU", title: "【復刻】紫電の精密狙撃・特別招集", featuredSsr: "celestia", isLimitedBanner: true, isRerun: true, desc: "1月限定SSR『セレスティア』が2月中旬限定で復刻登場！" }
  ],

  // 各月の3回更新（1日・11日・21日）ごとに自動解放される新戦術カード（全18枚）
  SEASONAL_CARDS: [
    // --- 2026年12月（聖夜・白銀） ---
    { releaseDate: "2026-12-01", id: "ev_12_1", rarity: "R",   name: "星降るスノーギフト",     type: "heal",   element: "ice",  cost: 0, icon: "🎁", healRatio: 0.16, draw: 1, summary: "💚0コス16%回復＋1ドロー", desc: "聖夜の贈り物。コスト0でHPを癒やしながら手札を1枚補充する。" },
    { releaseDate: "2026-12-01", id: "ev_12_2", rarity: "SR",  name: "暖炉の聖夜シチュー",     type: "heal",   element: "fire", cost: 1, icon: "🍲", healRatio: 0.30, nextAtkMult: 1.5, summary: "💚30%回復＋次撃1.5倍", desc: "カエデ特製の冬シチュー。小隊を温めて次の攻撃を1.5倍にする。" },
    { releaseDate: "2026-12-11", id: "ev_12_3", rarity: "SR",  name: "白銀ツリー・バリア",     type: "guard",  element: "ice",  cost: 1, icon: "🎄", shield: 1.15, counterMult: 2.35, summary: "🛡️大防壁＋🪞235%反撃", desc: "輝く聖樹の結界を展開し、攻撃してきた敵を氷の反撃で迎え撃つ。" },
    { releaseDate: "2026-12-11", id: "ev_12_4", rarity: "SR",  name: "イルミネーション放電",   type: "attack", element: "volt", cost: 2, icon: "✨", power: 2.35, exGain: 32, stagger: 26, summary: "⚡雷235% / EX+32%", desc: "聖夜を彩る高圧光放電。大ダメージとEX必殺加速を同時に狙える。" },
    { releaseDate: "2026-12-21", id: "ev_12_5", rarity: "SSR", name: "【聖夜】星降る絶対零度", type: "attack", element: "ice",  cost: 2, icon: "🌟", power: 3.15, shredTurns: 3, shield: 0.7, stagger: 40, summary: "👑氷315%＋防御DOWN＋🛡️", desc: "聖夜の星空から降り注ぐ極氷の奇跡。大火力・弱体・防壁の三拍子。" },
    { releaseDate: "2026-12-21", id: "ev_12_6", rarity: "SSR", name: "【聖夜】聖樹の祝福アーク",type:"buff",   element: "arc",  cost: 1, icon: "🔔", draw: 2, apGain: 2, healRatio: 0.3, summary: "👑AP+2 / 2ドロー / 30%回復", desc: "使った以上のAPを還元しながら2ドロー＆大回復する聖夜の切り札。" },

    // --- 2027年1月（新春・開運） ---
    { releaseDate: "2027-01-01", id: "ev_01_1", rarity: "R",   name: "初風・羽子板返し",       type: "guard",  element: "wind", cost: 1, icon: "🏸", shield: 0.65, counterMult: 2.3, draw: 1, summary: "🛡️防壁＋230%反撃＋1ドロー", desc: "敵の攻撃を鮮やかに打ち返し、手札も1枚引き込む新春の技巧札。" },
    { releaseDate: "2027-01-01", id: "ev_01_2", rarity: "SR",  name: "新春おせち大宴会",       type: "heal",   element: "fire", cost: 1, icon: "🍱", healRatio: 0.35, exGain: 26, summary: "💚35%回復＋EX+26%", desc: "豪華なおせち料理で小隊のHPとEXゲージを一気に回復する。" },
    { releaseDate: "2027-01-11", id: "ev_01_3", rarity: "SR",  name: "破魔の雷矢",             type: "break",  element: "volt", cost: 1, icon: "🏹", power: 1.5, stagger: 46, guardBreakMult: 2.55, shredTurns: 2, summary: "💥雷崩し2.55倍＋防御DOWN", desc: "厄を祓う雷の破魔矢。装甲とチャージを粉砕し防御力も下げる。" },
    { releaseDate: "2027-01-11", id: "ev_01_4", rarity: "SR",  name: "若水の清め陣",           type: "attack", element: "water",cost: 1, icon: "🎍", power: 1.55, healRatio: 0.18, apGain: 1, summary: "💧実質0コス155%＋18%回復", desc: "APを還元しつつ攻撃と回復を同時にこなす新春の万能水札。" },
    { releaseDate: "2027-01-21", id: "ev_01_5", rarity: "SSR", name: "【新春】初日の出レールガン",type:"attack",element: "volt", cost: 2, icon: "🌅", power: 3.3, stagger: 44, guardBreakMult: 2.4, exGain: 30, summary: "👑雷330% / 装甲貫通 / EX30", desc: "初日の出のごとき閃光狙撃。防御構えの上からでも敵を撃ち抜く。" },
    { releaseDate: "2027-01-21", id: "ev_01_6", rarity: "SSR", name: "【新春】大吉・紅蓮獅子舞", type:"attack",element: "fire", cost: 2, icon: "🦁", power: 3.15, nextAtkMult: 1.7, draw: 1, summary: "👑炎315%＋次撃1.7倍＋1ドロー", desc: "豪快な獅子舞の連撃で敵を焼き、後続のカード威力まで1.7倍にする。" },

    // --- 2027年2月（ショコラ・絆） ---
    { releaseDate: "2027-02-01", id: "ev_02_1", rarity: "R",   name: "ホットショコラ補給",     type: "buff",   element: "fire", cost: 0, icon: "☕", apGain: 1, healRatio: 0.14, exGain: 16, summary: "🔥0コスAP+1 / 14%回復 / EX16", desc: "甘い香りで疲れを癒やし、APとEXゲージを補給する軽快な支援札。" },
    { releaseDate: "2027-02-01", id: "ev_02_2", rarity: "SR",  name: "スイート・デリバリー",   type: "buff",   element: "wind", cost: 0, icon: "🎀", draw: 2, shield: 0.65, summary: "🃏0コス2ドロー＋🛡️防壁", desc: "疾風の速さで手札を2枚届け、同時に小隊へ風の防壁を張る。" },
    { releaseDate: "2027-02-11", id: "ev_02_3", rarity: "SR",  name: "メルティ・フォンデュ",   type: "attack", element: "water",cost: 2, icon: "🫕", power: 2.4, nextAtkMult: 1.55, stagger: 24, summary: "💧水240%＋次撃1.55倍", desc: "とろけるような激流で包み込み、次の炎攻撃で極大蒸発を狙える。" },
    { releaseDate: "2027-02-11", id: "ev_02_4", rarity: "SR",  name: "ハートフル・イージス",   type: "guard",  element: "arc",  cost: 1, icon: "💝", shield: 1.25, healRatio: 0.22, summary: "🛡️大防壁＋💚22%回復", desc: "仲間の想いを結晶化させた厚い防壁。強敵の猛攻を優雅に凌ぐ。" },
    { releaseDate: "2027-02-21", id: "ev_02_5", rarity: "SSR", name: "【甘美】疾風ショコラ連撃",type:"attack",element: "wind", cost: 1, icon: "🍫", power: 2.45, draw: 2, apGain: 1, exGain: 24, summary: "👑実質0コス風245%＋2ドロー", desc: "目にも留まらぬ高速連撃。AP還元と2ドローでチェインが止まらない。" },
    { releaseDate: "2027-02-21", id: "ev_02_6", rarity: "SSR", name: "【甘美】絆のグランドケーキ",type:"heal", element: "arc",  cost: 1, icon: "🎂", healRatio: 0.52, shield: 1.2, nextAtkMult: 1.75, summary: "👑52%回復＋大防壁＋1.75倍", desc: "第7小隊全員で作った特製ケーキ。戦況を根底から覆す究極の支援札。" }
  ],

  // 12月・1月・2月の月次イベント本体（各月3フェーズ更新）
  EVENTS: [
    {
      id: "ev_2026_12",
      monthLabel: "2026年12月イベント",
      icon: "🎄",
      title: "聖夜の白銀キャンプと星降る奇蹟",
      subtitle: "冬の前線に灯る光と、星屑を纏う霧獣たち",
      start: "2026-12-01",
      end: "2026-12-31",
      currencyName: "星屑オーナメント",
      currencyIcon: "🎄",
      bannerBg: "linear-gradient(135deg, #1b365d, #3b2a6e, #186a5b)",
      phases: [
        { num: 1, unlockDate: "2026-12-01", label: "第1弾（12/1〜）", newCards: ["ev_12_1", "ev_12_2"] },
        { num: 2, unlockDate: "2026-12-11", label: "第2弾（12/11〜）", newCards: ["ev_12_3", "ev_12_4"] },
        { num: 3, unlockDate: "2026-12-21", label: "第3弾（12/21〜）", newCards: ["ev_12_5", "ev_12_6"] }
      ],
      stories: [
        { id: "e12_s1", phase: 1, title: "第一話：雪降るキャンプの飾り付け", rewardMedals: 40, rewardGems: 100, scenes: [
          { bg: "camp_night", speaker: "kaede", text: "みてみて隊長！ヴェルデ平原にも初雪が降ってきたよ！せっかくの12月だし、前線キャンプで『聖夜祭』を開こうよ！" },
          { bg: "camp_night", speaker: "momo", text: "わぁーっ、賛成！！方舟都市にいた頃は写真でしか見たことなかったけど、本物のモミの木に飾り付けしたいな！" },
          { bg: "camp_night", speaker: "mikoto", text: "ふふ、賑やかでよろしいですね。ですが……北の森から、星屑のように光る結晶を咥えた霧獣が近づいている気配がございます。" },
          { bg: "camp_night", speaker: "protagonist", text: "せっかくの聖夜祭だ。まずはキャンプ周辺の安全を確保しつつ、飾りに使える『星屑オーナメント』を集めよう！" }
        ]},
        { id: "e12_s2", phase: 1, title: "第二話：白狐と雪の贈り物", rewardMedals: 40, rewardGems: 100, scenes: [
          { bg: "frost_field", speaker: "mikoto", text: "隊長殿、お寒くはありませんか？白狐の冷気は自在に抑えられますので、よろしければ私の隣へ。" },
          { bg: "frost_field", speaker: "aoi", text: "雪狼たちがオーナメント結晶を巣へ運び込んでいます！取り返してキャンプのツリーを完成させましょう！" }
        ]},
        { id: "e12_s3", phase: 2, title: "第三話：輝くイルミネーション作戦", rewardMedals: 60, rewardGems: 120, scenes: [
          { bg: "camp_night", speaker: "koharu", text: "じゃじゃーん！発電タービンを繋いで、キャンプ全体を照らす巨大ツリーライトを作っちゃったよ！" },
          { bg: "camp_night", speaker: "valeria", text: "まあ、なんと美しい光でしょう……。しかしこの強い光に引き寄せられたのか、重装の結晶甲虫が接近中ですわ！" }
        ]},
        { id: "e12_s4", phase: 2, title: "第四話：聖夜の騎士と白銀の誓い", rewardMedals: 60, rewardGems: 120, scenes: [
          { bg: "ruins_fog", speaker: "valeria", text: "方舟都市の名門騎士として、皆の笑顔が集う聖夜を霧獣に踏みにじらせるわけには参りませんわ！" },
          { bg: "ruins_fog", speaker: "lunaria", text: "お嬢様、いい気合じゃない！あたしも一緒に行って一気に片付けてやるわよ！" }
        ]},
        { id: "e12_s5", phase: 3, title: "第五話：星降る夜の巨獣現る", rewardMedals: 80, rewardGems: 160, scenes: [
          { bg: "frost_field", speaker: "chloe", text: "緊急通信です！聖夜の磁気嵐に反応して、巨大な『聖夜の蒼氷マンモス』がキャンプへ向かっています！" },
          { bg: "frost_field", speaker: "mikoto", text: "なるほど、聖夜の締めくくりに相応しい大物ですね。隊長殿、今年最後の総力戦と参りましょう。" }
        ]},
        { id: "e12_s6", phase: 3, title: "最終話：満天の星と第7小隊の聖夜", rewardMedals: 100, rewardGems: 200, scenes: [
          { bg: "camp_night", speaker: "momo", text: "やったぁーっ！巨大ツリーが無事に点灯したよ！！隊長、メリークリスマスっ！" },
          { bg: "camp_night", speaker: "kaede", text: "特製ローストとケーキも焼き上がったよ！今夜はみんなで朝までお祝いしようね！" },
          { bg: "camp_night", speaker: "mikoto", text: "……素敵な聖夜をありがとうございます、隊長殿。来年もまた、この星空の下で共に歩みましょう。" }
        ]}
      ],
      quests: [
        { id: "e12_q1", phase: 1, title: "【初級】聖夜の雪狼掃討",       enCost: 15, enemyId: "wolf_pack",       hpMult: 1.0, atkMult: 1.0, recPower: 380,  medals: 35 },
        { id: "e12_q2", phase: 2, title: "【上級】星屑の重装甲虫迎撃",   enCost: 25, enemyId: "crystal_beetle",  hpMult: 1.4, atkMult: 1.3, recPower: 880,  medals: 75 },
        { id: "e12_q3", phase: 3, title: "【極限】聖夜の蒼氷マンモス戦", enCost: 30, enemyId: "glacial_mammoth", hpMult: 1.1, atkMult: 1.0, recPower: 1850, medals: 150 }
      ],
      shop: [
        { id: "e12_sh1", phase: 1, kind: "card",    cardId: "ev_12_2", name: "【SR】暖炉の聖夜シチュー",   price: 120, stock: 2 },
        { id: "e12_sh2", phase: 1, kind: "tickets", qty: 5,            name: "🎟️ 戦術パック券 ×5",       price: 100, stock: 3 },
        { id: "e12_sh3", phase: 2, kind: "card",    cardId: "ev_12_3", name: "【SR】白銀ツリー・バリア",   price: 140, stock: 2 },
        { id: "e12_sh4", phase: 2, kind: "books",   qty: 40,           name: "📘 作戦記録 ×40",           price: 90,  stock: 3 },
        { id: "e12_sh5", phase: 3, kind: "card",    cardId: "ev_12_5", name: "【SSR】星降る絶対零度",     price: 260, stock: 2 },
        { id: "e12_sh6", phase: 3, kind: "title",   titleName: "聖夜の星守り", name: "🏅 限定称号『聖夜の星守り』", price: 150, stock: 1 }
      ]
    },

    {
      id: "ev_2027_01",
      monthLabel: "2027年1月イベント",
      icon: "🎍",
      title: "新春！方舟初詣と黄金の獅子舞",
      subtitle: "新しい年の開運を懸けた、第7小隊の初狩り大会",
      start: "2027-01-01",
      end: "2027-01-31",
      currencyName: "開運おみくじ札",
      currencyIcon: "🎍",
      bannerBg: "linear-gradient(135deg, #7d1924, #b5451b, #a87b16)",
      phases: [
        { num: 1, unlockDate: "2027-01-01", label: "第1弾（1/1〜）", newCards: ["ev_01_1", "ev_01_2"] },
        { num: 2, unlockDate: "2027-01-11", label: "第2弾（1/11〜）", newCards: ["ev_01_3", "ev_01_4"] },
        { num: 3, unlockDate: "2027-01-21", label: "第3弾（1/21〜）", newCards: ["ev_01_5", "ev_01_6"] }
      ],
      stories: [
        { id: "e01_s1", phase: 1, title: "第一話：あけましておめでとう、第7小隊！", rewardMedals: 40, rewardGems: 100, scenes: [
          { bg: "verde_morning", speaker: "aoi", text: "隊長、新年あけましておめでとうございます！今年は地上開拓がさらに大きく前進する一年にしましょう！" },
          { bg: "verde_morning", speaker: "celestia", text: "新年早々、おみくじを引いたら『大吉』でした。……今年も私の照準は外れそうにありませんね。" },
          { bg: "verde_morning", speaker: "momo", text: "わーい、お餅つきしようよ！……ってあれ！？餅つき用の臼をイノシシ型の霧獣が転がして逃げたよ！？" }
        ]},
        { id: "e01_s2", phase: 1, title: "第二話：初狩り競争スタート", rewardMedals: 40, rewardGems: 100, scenes: [
          { bg: "forest_mist", speaker: "lunaria", text: "新年一発目の獲物が大猪なんて縁起がいいじゃない！誰が一番多く『開運おみくじ札』を集められるか勝負よ！" }
        ]},
        { id: "e01_s3", phase: 2, title: "第三話：黄金に輝く獅子舞巨獣", rewardMedals: 60, rewardGems: 120, scenes: [
          { bg: "gold_storm", speaker: "chloe", text: "大変です！お正月の祝砲に驚いたのか、黄金の角を持つ『煌角のベヒーモス』が獅子舞みたいに暴れ始めました！" },
          { bg: "gold_storm", speaker: "celestia", text: "派手な新年行事になりましたね。隊長、破魔の雷撃で一気におとなしくさせましょう。" }
        ]},
        { id: "e01_s4", phase: 2, title: "第四話：白狐と狙撃手の初夢", rewardMedals: 60, rewardGems: 120, scenes: [
          { bg: "camp_dusk", speaker: "mikoto", text: "セレスティア殿、少し表情が柔らかくなられましたね。これも第7小隊で迎える新年のご利益でしょうか。" },
          { bg: "camp_dusk", speaker: "celestia", text: "……ふふ、そうかもしれませんね。" }
        ]},
        { id: "e01_s5", phase: 3, title: "第五話：祝祭の空へ昇る雷竜", rewardMedals: 80, rewardGems: 160, scenes: [
          { bg: "canyon_storm", speaker: "sylphy", text: "おい隊長！初日の出の空にサンダー・ワイバーンが飛び出してきたぜ！新年の厄払い、ド派手にブチかまそうや！" }
        ]},
        { id: "e01_s6", phase: 3, title: "最終話：大吉の空の下で", rewardMedals: 100, rewardGems: 200, scenes: [
          { bg: "verde_morning", speaker: "celestia", text: "見事な初陣でした、隊長。今年もあなたの指揮のもと、すべての標的を撃ち抜いてみせます。" },
          { bg: "verde_morning", speaker: "kaede", text: "さあさあ、お雑煮とおせちが待ってるよ！今年も第7小隊、元気にいこう！" }
        ]}
      ],
      quests: [
        { id: "e01_q1", phase: 1, title: "【初級】初春の暴れ大猪討伐",   enCost: 15, enemyId: "forest_boar",      hpMult: 1.0, atkMult: 1.0, recPower: 520,  medals: 40 },
        { id: "e01_q2", phase: 2, title: "【上級】黄金の獅子ベヒーモス", enCost: 25, enemyId: "radiant_behemoth", hpMult: 1.0, atkMult: 0.95,recPower: 1250, medals: 85 },
        { id: "e01_q3", phase: 3, title: "【極限】祝祭の天雷ワイバーン", enCost: 30, enemyId: "thunder_wyvern",   hpMult: 1.15,atkMult: 1.05,recPower: 1850, medals: 160 }
      ],
      shop: [
        { id: "e01_sh1", phase: 1, kind: "card",    cardId: "ev_01_2", name: "【SR】新春おせち大宴会",     price: 120, stock: 2 },
        { id: "e01_sh2", phase: 1, kind: "tickets", qty: 5,            name: "🎟️ 戦術パック券 ×5",         price: 100, stock: 3 },
        { id: "e01_sh3", phase: 2, kind: "card",    cardId: "ev_01_3", name: "【SR】破魔の雷矢",           price: 140, stock: 2 },
        { id: "e01_sh4", phase: 2, kind: "cores",   qty: 12,           name: "💠 元素コア ×12",            price: 110, stock: 3 },
        { id: "e01_sh5", phase: 3, kind: "card",    cardId: "ev_01_5", name: "【SSR】初日の出レールガン",  price: 260, stock: 2 },
        { id: "e01_sh6", phase: 3, kind: "title",   titleName: "新春の開運隊長", name: "🏅 限定称号『新春の開運隊長』", price: 150, stock: 1 }
      ]
    },

    {
      id: "ev_2027_02",
      monthLabel: "2027年2月イベント",
      icon: "🍫",
      title: "ショコラ・フロンティア〜甘く危険な調理作戦〜",
      subtitle: "幻のカカオ結晶を巡る、第7小隊のスイーツ大作戦！",
      start: "2027-02-01",
      end: "2027-02-28",
      currencyName: "特製カカオ結晶",
      currencyIcon: "🍫",
      bannerBg: "linear-gradient(135deg, #5e2236, #9e3154, #6b3e26)",
      phases: [
        { num: 1, unlockDate: "2027-02-01", label: "第1弾（2/1〜）", newCards: ["ev_02_1", "ev_02_2"] },
        { num: 2, unlockDate: "2027-02-11", label: "第2弾（2/11〜）", newCards: ["ev_02_3", "ev_02_4"] },
        { num: 3, unlockDate: "2027-02-21", label: "第3弾（2/21〜）", newCards: ["ev_02_5", "ev_02_6"] }
      ],
      stories: [
        { id: "e02_s1", phase: 1, title: "第一話：幻のカカオ結晶を探せ！", rewardMedals: 40, rewardGems: 100, scenes: [
          { bg: "camp_dusk", speaker: "kaede", text: "たいへーん！2月の感謝祭に向けて特製チョコを作ろうとしたら、一番大事な『アーク・カカオ』が森の霧獣に食べられちゃった！" },
          { bg: "camp_dusk", speaker: "lunaria", text: "なっ……！あたしが隊長のためにこっそり練習してたレシピのカカオまで！？絶対に許さないわよ！" },
          { bg: "camp_dusk", speaker: "sylphy", text: "ハハッ、随分と甘い騒動だな！俺の鼻ならカカオの香りなんて一発で嗅ぎ当てられるぜ！" }
        ]},
        { id: "e02_s2", phase: 1, title: "第二話：甘い香りの胞子森", rewardMedals: 40, rewardGems: 100, scenes: [
          { bg: "forest_mist", speaker: "mint", text: "……ほんとに森じゅうがチョコレートの匂い。胞子マッシュたちがカカオを吸い込んでふわふわしてるよ。" }
        ]},
        { id: "e02_s3", phase: 2, title: "第三話：ビターな甲虫と秘密のラッピング", rewardMedals: 60, rewardGems: 120, scenes: [
          { bg: "canyon_storm", speaker: "sakura", text: "見てください隊長！峡谷のスカラベが、最高級のビターカカオをハサミで大事そうに抱え込んでます！" },
          { bg: "canyon_storm", speaker: "sylphy", text: "よっしゃ、あのハサミから華麗に奪い返してやろうぜ！" }
        ]},
        { id: "e02_s4", phase: 2, title: "第四話：それぞれの想いを込めて", rewardMedals: 60, rewardGems: 120, scenes: [
          { bg: "camp_night", speaker: "aoi", text: "みんな、それぞれの気持ちを込めてチョコレートを仕上げていますね。隊長、楽しみにしていてください！" }
        ]},
        { id: "e02_s5", phase: 3, title: "第五話：焦がし厳禁！溶岩オーブン対決", rewardMedals: 80, rewardGems: 160, scenes: [
          { bg: "caldera", speaker: "koharu", text: "巨大なグランドケーキを焼くための熱源に近づいたら、マグマ・サラマンダーがケーキを狙って飛び出してきたよ！" },
          { bg: "caldera", speaker: "kaede", text: "焼き加減を邪魔する霧獣は許しません！隊長、一気に片付けて最高のケーキを完成させよう！" }
        ]},
        { id: "e02_s6", phase: 3, title: "最終話：第7小隊からの甘い感謝祭", rewardMedals: 100, rewardGems: 200, scenes: [
          { bg: "camp_dusk", speaker: "lunaria", text: "ほ、ほら隊長！あたし特製のショコラよ！文句言わずに全部食べなさいよねっ！" },
          { bg: "camp_dusk", speaker: "sylphy", text: "俺からも感謝の印だ、受け取れよ相棒。これからも最高の小隊でいようぜ！" },
          { bg: "camp_dusk", speaker: "kaede", text: "さあみんな、絆のグランドケーキを切り分けるよーっ！" }
        ]}
      ],
      quests: [
        { id: "e02_q1", phase: 1, title: "【初級】甘党胞子マッシュ採取",   enCost: 15, enemyId: "spore_slime",      hpMult: 1.0, atkMult: 1.0, recPower: 460,  medals: 40 },
        { id: "e02_q2", phase: 2, title: "【上級】ビター・スカラベ迎撃",   enCost: 25, enemyId: "volt_scarab",      hpMult: 1.05,atkMult: 1.0, recPower: 1250, medals: 85 },
        { id: "e02_q3", phase: 3, title: "【極限】焦がしサラマンダー戦",   enCost: 30, enemyId: "magma_salamander", hpMult: 0.75,atkMult: 0.85,recPower: 2100, medals: 170 }
      ],
      shop: [
        { id: "e02_sh1", phase: 1, kind: "card",    cardId: "ev_02_2", name: "【SR】スイート・デリバリー",  price: 120, stock: 2 },
        { id: "e02_sh2", phase: 1, kind: "gift",    qty: 4,            name: "💐 アーク花のブーケ ×4",     price: 100, stock: 3 },
        { id: "e02_sh3", phase: 2, kind: "card",    cardId: "ev_02_4", name: "【SR】ハートフル・イージス",  price: 140, stock: 2 },
        { id: "e02_sh4", phase: 2, kind: "tickets", qty: 6,            name: "🎟️ 戦術パック券 ×6",         price: 120, stock: 3 },
        { id: "e02_sh5", phase: 3, kind: "card",    cardId: "ev_02_5", name: "【SSR】疾風ショコラ連撃",    price: 260, stock: 2 },
        { id: "e02_sh6", phase: 3, kind: "title",   titleName: "甘美なる指揮官", name: "🏅 限定称号『甘美なる指揮官』", price: 150, stock: 1 }
      ]
    }
  ]
};
