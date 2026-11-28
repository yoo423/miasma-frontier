window.MF_STORY_CH4_B = [
  {
    id: "ch4_ep11", chapter: "第十一話", title: "冷却ポンプ起動作戦", subtitle: "中央火口包囲・ハルト＆コハルの決死修理",
    reqClear: "ch4_ep10", battleEnemyId: null, reward: { gems: 320, credits: 28000, books: 48, cores: 10 },
    scenes: [
      { bg: "caldera", bgm: "tension", speaker: "narrator", text: "中央火口の溶岩湖を泳ぐ主霧獣『マグマ・サラマンダー』。このまま溶岩の中に居座られては、近接攻撃が届かない。" },
      { bg: "caldera", speaker: "haruto", text: "よし、出番だぜコハル！昨日直した地下水脈の大型冷却ポンプを全開にして、火口の表面を一気に冷やし固める！" },
      { bg: "caldera", speaker: "koharu", text: "そうすれば溶岩の上に足場ができて、マグマ・サラマンダーを陸へ引きずり出せるねっ！" },
      { bg: "caldera", speaker: "yuzu", text: "水脈の圧力はあたしがハンマーで調整してあげるよぉ。……よいしょっと！" },
      { bg: "caldera", sfx: "boom", fx: "flash", speaker: "narrator", text: "轟音とともに奔流が火口へ注ぎ込まれ、凄まじい水蒸気の壁が立ち昇った。赤熱の溶岩が瞬く間に黒く硬い足場へと変わっていく！" },
      {
        bg: "caldera", speaker: "ran", text: "足場が固まりました！今が主霧獣を討つ絶好の機会です。隊長、突入部隊の先鋒を誰に任せますか？",
        choices: [
          { label: "「ヴァレリアとユズの水属性連携で、一気に蒸発反応を叩き込む！」", replySpeaker: "valeria", reply: "心得ましたわ！紅蓮の炎など、蒼き激流で消し飛ばして差し上げます！", bondChar: "valeria" },
          { label: "「ミコトとレイラの氷属性で、動きごと完全に凍てつかせる！」", replySpeaker: "mikoto", reply: "ええ、どれほど熱い業火でも、絶対零度の前には沈黙するのみですわ。", bondChar: "mikoto" }
        ]
      },
      { bg: "caldera", sfx: "roar", fx: "shake", speaker: "narrator", text: "足場を奪われたマグマ・サラマンダーが激怒し、火口の中央へと躍り出た！" }
    ]
  },
  {
    id: "ch4_ep12", chapter: "第十二話", title: "黒曜の足場、灼熱の奇襲", subtitle: "火口内周・溶岩ゴーレム迎撃",
    reqClear: "ch4_ep11", battleEnemyId: "lava_golem", reward: { gems: 340, credits: 30000, books: 50, cores: 10 },
    scenes: [
      { bg: "caldera", bgm: "tension", speaker: "narrator", text: "冷え固まった黒曜石の足場を進む小隊の脇から、熱を保ったゴーレムが冷却パイプを破壊しようと飛びかかってきた。" },
      { bg: "caldera", speaker: "haruto", text: "おいおい、せっかく繋いだ冷却パイプを壊させるかよ！隊長、ここで食い止めるぜ！" },
      { bg: "caldera", speaker: "sakura", text: "みんなの耐熱防護を最大にします！押し切りましょう！" },
      { bg: "danger", sfx: "boom", fx: "redflash", speaker: "protagonist", text: "冷却パイプを守り抜け！戦闘開始！" }
    ]
  },
  {
    id: "ch4_ep13", chapter: "第十三話", title: "闇を翔ける黒翼、クロウの真意", subtitle: "火口前線・旧文明の真実を記したデータコア",
    reqClear: "ch4_ep12", battleEnemyId: null, reward: { gems: 320, credits: 30000, books: 50, cores: 10 },
    scenes: [
      { bg: "camp_dusk", bgm: "story", speaker: "narrator", text: "パイプ防衛を終えた直後、クロウが懐から蒼白く光る小さな八面体データコアを取り出し、隊長の手のひらへ放り投げた。" },
      { bg: "camp_dusk", speaker: "crow", text: "ほらよ、さっき廃坑道の奥からくすねてきた『とびきりの宝』だ。研究員殿に見せてみな。" },
      { bg: "camp_dusk", sfx: "comm", speaker: "chloe", text: "こ、これ……百年前の『方舟都市リベルタ建造計画書』の原本じゃないですか！？クロウさん、どこで見つけたんですか！" },
      { bg: "camp_dusk", speaker: "crow", text: "フッ、俺はただのトレジャーハンターじゃねぇ。実は方舟の下層街で、議会が隠した歴史をずっと追ってたのさ。" },
      { bg: "camp_dusk", bgm: "tension", speaker: "chloe", text: "……読んでみますね。えっ！？『方舟都市リベルタは避難船であると同時に、天蓋の塔“アーク・スパイア”から切り離された上部制御モジュールである』……！？" },
      { bg: "camp_dusk", speaker: "aoi", text: "私たちが住んでいた方舟そのものが、もともと地上の塔の一部だったんですか……！？" },
      { bg: "camp_dusk", speaker: "chloe", text: "しかも、第五開拓領域『水没都市・アクア・メトロポリス』に、方舟と塔を再接続するための起動キーが沈んでいると記されています！" },
      {
        bg: "camp_dusk", speaker: "crow", text: "面白くなってきただろ隊長？まずは目の前の溶岩トカゲを片付けて、沈んだ首都へ宝探しに行こうぜ。",
        choices: [
          { label: "「最高の情報だクロウ。お前の眼力が世界を救う鍵になった」", replySpeaker: "crow", reply: "フッ……悪くない気分だ。この黒翼、あんたの切り札として貸してやろう。", bondChar: "crow" },
          { label: "「方舟の秘密も、ノクスの野望も、必ず俺たちが解き明かす」", replySpeaker: "chloe", reply: "はいっ！すべてのパズルが繋がり始めています！", bondChar: "chloe" }
        ]
      }
    ]
  },
  {
    id: "ch4_ep14", chapter: "第十四話", title: "溶岩の王座への最終階段", subtitle: "火口中央段丘・強襲ゴーレム戦",
    reqClear: "ch4_ep13", battleEnemyId: "lava_golem", reward: { gems: 360, credits: 32000, books: 54, cores: 11 },
    scenes: [
      { bg: "caldera", bgm: "tension", speaker: "narrator", text: "主霧獣マグマ・サラマンダーの待つ中央段丘まであと一歩。炎の嵐を潜り抜け、最後の防衛巨兵を打ち破る。" },
      { bg: "caldera", speaker: "ran", text: "ここを抜ければいよいよ主霧獣です！体力を高く保ったまま突破しましょう！" },
      { bg: "danger", sfx: "boom", fx: "redflash", speaker: "protagonist", text: "中央段丘へ突入する！総員、全力攻撃！" }
    ]
  },
  {
    id: "ch4_ep15", chapter: "第十五話", title: "灼熱の対峙、炎を制する者", subtitle: "中央火口・マグマ・サラマンダー決戦前",
    reqClear: "ch4_ep14", battleEnemyId: null, reward: { gems: 340, credits: 32000, books: 54, cores: 11 },
    scenes: [
      { bg: "caldera", bgm: "tension", sfx: "roar", fx: "shake", speaker: "narrator", text: "火口の中央でとぐろを巻く超巨大な紅蓮の巨獣——主霧獣『マグマ・サラマンダー』。一呼吸ごとに溶岩の雨が降り注ぐ。" },
      { bg: "caldera", speaker: "celestia", text: "『灼熱の溶岩顎』および『業火の尾先』、二箇所の破壊可能部位へ照準を固定しました。" },
      { bg: "caldera", speaker: "lunaria", text: "いいわね、燃えてきたわ！炎の主だろうが、あたしたちの絆の熱さには勝てないわよ！" },
      { bg: "caldera", speaker: "protagonist", text: "第7小隊、最終陣形完了！主霧獣『マグマ・サラマンダー』討伐戦を開始する！" }
    ]
  },
  {
    id: "ch4_ep16", chapter: "第十六話", title: "灼熱の主『マグマ・サラマンダー』", subtitle: "第四領域の主霧獣との火口決戦",
    reqClear: "ch4_ep15", battleEnemyId: "magma_salamander", reward: { gems: 540, credits: 38000, books: 64, cores: 15 },
    scenes: [
      { bg: "caldera", bgm: "boss", sfx: "roar", fx: "shake", speaker: "narrator", text: "大地を溶かす業火のブレスが迫る。生半可な戦力では一瞬で焼き尽くされる、この灼熱領域の支配者。" },
      { bg: "caldera", speaker: "ran", text: "大技の予兆を見逃さず、防御と崩し、そして水・氷反応で一気に押し切りましょう！" },
      { bg: "danger", sfx: "boom", fx: "redflash", speaker: "protagonist", text: "総員全力展開！！主霧獣『マグマ・サラマンダー』を討伐する！！" }
    ]
  },
  {
    id: "ch4_ep17", chapter: "第十七話", title: "太陽核の暴走、紅蓮業火の炎帝竜", subtitle: "ノクスの最終溶鉱炉プロトコル起動",
    reqClear: "ch4_ep16", battleEnemyId: null, reward: { gems: 360, credits: 35000, books: 58, cores: 12 },
    scenes: [
      { bg: "caldera", bgm: "story", speaker: "narrator", text: "マグマ・サラマンダーが黒曜の岩盤へ崩れ落ちた。だがその瞬間、第一溶鉱炉の底に沈んでいた巨大な『太陽核結晶』が眩く輝いた。" },
      { bg: "gold_storm", bgm: "tension", sfx: "alarm", fx: "redflash", speaker: "narrator", text: "『……素晴らしいデータだ。ならばこの精錬炉の全エネルギーを注ぎ込み、最強の“炎帝”を誕生させよう。焼き尽くせ、第7小隊を！』" },
      { bg: "gold_storm", sfx: "roar", fx: "shake", speaker: "chloe", text: "太陽核とサラマンダーが完全融合しました！！【融光種】紅蓮業火の炎帝竜——過去最大の熱量反応です！！" },
      { bg: "gold_storm", speaker: "haruto", text: "ヤバいぜ、さっきの冷却ポンプが熱で吹き飛びそうだ！あいつを止めねぇとカルデラ全体が大噴火しちまう！" },
      { bg: "gold_storm", speaker: "valeria", text: "逃げる選択肢などありませんわ。ここで炎帝竜を討ち、ノクスの企みを完全に粉砕いたします！" }
    ]
  },
  {
    id: "ch4_ep18", chapter: "第十八話", title: "業火の壁を貫け", subtitle: "大噴火直前・最終前哨防衛戦",
    reqClear: "ch4_ep17", battleEnemyId: "lava_golem", reward: { gems: 380, credits: 36000, books: 60, cores: 12 },
    scenes: [
      { bg: "gold_storm", bgm: "tension", speaker: "narrator", text: "噴き上がる黄金の火柱の中、炎帝竜を守るように赤熱ゴーレムが立ち塞がる。" },
      { bg: "gold_storm", speaker: "crow", text: "雑魚に構ってる暇はねぇ！一瞬でブッ飛ばして炎帝竜の懐へ飛び込むぞ！" },
      { bg: "danger", sfx: "boom", fx: "redflash", speaker: "protagonist", text: "炎帝竜への道を切り開く！突破戦開始！" }
    ]
  },
  {
    id: "ch4_ep19", chapter: "第十九話", title: "溶鉱炉の果て、未来を鍛える絆", subtitle: "灼熱最終決戦直前・全員の総力結集",
    reqClear: "ch4_ep18", battleEnemyId: null, reward: { gems: 400, credits: 38000, books: 62, cores: 13 },
    scenes: [
      { bg: "gold_storm", bgm: "tension", sfx: "roar", fx: "shake", speaker: "narrator", text: "黄金の翼と太陽のような核を宿した『紅蓮業火の炎帝竜』が、噴煙の空から第7小隊を見下ろしている。" },
      { bg: "gold_storm", speaker: "sakura", text: "みんな、最後の耐熱薬草と回復準備は完璧です！絶対に誰一人倒れさせません！" },
      { bg: "gold_storm", speaker: "ran", text: "方舟都市の未来を歪める悪意、この槍と皆様の力で断ち切りましょう！" },
      { bg: "gold_storm", speaker: "yuzu", text: "さぁて、あたしも本気出しちゃおっかな。大物中の大物、一気に決めよっか隊長！" },
      {
        bg: "gold_storm", speaker: "lunaria", text: "この灼熱の大地も、いよいよ決着ね！隊長、第7小隊の最強の一撃、号令を頼むわ！！",
        choices: [
          { label: "「太陽核を打ち砕き、ノクスの狂気をこの火口で終わらせる！」", replySpeaker: "lunaria", reply: "了解っ！！あたしたちの炎と絆で、黄金の竜ごと塗り替えてやるわ！！", bondChar: "lunaria" },
          { label: "「水・氷・雷・風・煌・炎——全6元素の総力戦で必ず勝ち切る！」", replySpeaker: "aoi", reply: "はいっ！第7クリアラー小隊、すべての力を解放します！", bondChar: "aoi" }
        ]
      },
      { bg: "gold_storm", sfx: "boom", fx: "flash", speaker: "narrator", text: "灼熱のカルデラに、人類の希望を乗せた最終決戦の火蓋が切られた。" }
    ]
  },
  {
    id: "ch4_ep20", chapter: "第二十話", title: "紅蓮業火の炎帝竜を超えて", subtitle: "【融光種】紅蓮業火の炎帝竜最終決戦",
    reqClear: "ch4_ep19", battleEnemyId: "radiant_salamander", reward: { gems: 1200, credits: 50000, books: 85, cores: 22 },
    scenes: [
      { bg: "gold_storm", bgm: "boss", sfx: "roar", fx: "shake", speaker: "narrator", text: "天を焦がす黄金の業火。四つの大地を歩み続けてきた第7小隊の、これまでのすべてが試される最終決戦。" },
      { bg: "gold_storm", speaker: "haruto", text: "装備も戦術も全力全開だ！行くぜ隊長！！" },
      { bg: "gold_storm", speaker: "protagonist", text: "第7クリアラー小隊、総員全力解放！！【融光種】紅蓮業火の炎帝竜を撃破する！！" }
    ],
    epilogue: [
      { bg: "verde_morning", bgm: "home", sfx: "gift", fx: "flash", speaker: "narrator", text: "太陽核結晶が貫かれた瞬間、荒れ狂っていたカルデラの噴煙が静まり、黄金の火の粉が夜明けの空へ舞い上がった。" },
      { bg: "caldera", speaker: "aoi", text: "……やりました！！融光種・炎帝竜、完全沈黙！カルデラの地殻圧力も安全値まで低下していきます！" },
      { bg: "caldera", speaker: "ran", text: "見事な勝利でした、隊長。そして炉心から、方舟中央議会の裏切り者たちとノクスを結ぶ決定的な通信証拠も確保いたしました。" },
      { bg: "caldera", speaker: "crow", text: "フッ、これでいよいよ次は大詰めだな。残るは水没した旧首都『アクア・メトロポリス』と……天蓋の塔『アーク・スパイア』のみ。" },
      { bg: "aqua_city", bgm: "story", sfx: "comm", speaker: "chloe", text: "皆さん、方舟都市から緊急警報です！中央議会の強硬派が、方舟を強制降下させて天蓋の塔へ直結しようと動き出しました！" },
      { bg: "aqua_city", speaker: "valeria", text: "……ついに、すべての真実へ踏み込む時が来ましたわね。水没した旧首都『アクア・メトロポリス』、そして天蓋の塔『アーク・スパイア』——人類の運命を決める最終決戦へ、いざ参りましょう！" }
    ]
  }
];
