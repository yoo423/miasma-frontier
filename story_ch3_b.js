window.MF_STORY_CH3_B = [
  {
    id: "ch3_ep11", chapter: "第十一話", title: "暴走冷却炉と凍てつく大地", subtitle: "白銀平原・マンモス追撃作戦開始",
    reqClear: "ch3_ep10", battleEnemyId: null, reward: { gems: 280, credits: 18500, books: 36, cores: 7 },
    scenes: [
      { bg: "frost_field", bgm: "tension", speaker: "narrator", text: "研究棟の冷却炉を背負ったまま雪原へ解き放たれた主霧獣『グレイシャル・マンモス』。その巨体が歩むたびに、周囲の大気ごと氷結していく。" },
      { bg: "frost_field", speaker: "belle", text: "大変ですわ！このまま冷却炉が暴走し続ければ、あと半日で冷気波が南の峡谷やヴェルデ平原まで到達してしまいます！" },
      { bg: "frost_field", speaker: "rikka", text: "私たちが育てた前線キャンプまで凍りついてしまう……！絶対にこの雪原で食い止めなければなりません！" },
      { bg: "frost_field", speaker: "chloe", text: "解析完了しました！マンモスの弱点は『氷結の双牙』と『背中の冷却炉殻』です。特に背中の炉殻を破壊できれば、暴走冷気を大きく弱められます！" },
      { bg: "frost_field", speaker: "sylphy", text: "よっしゃ、やることはハッキリしたな！足跡を辿ってデカブツの背中へ飛び乗ってやろうぜ！" },
      {
        bg: "frost_field", speaker: "protagonist", text: "吹雪の向こうに巨大な足跡が続いている。追撃部隊の陣形を整えるぞ。",
        choices: [
          { label: "「炎属性を軸にした『融解』火力隊で氷装甲を溶かし切る！」", replySpeaker: "lunaria", reply: "待ってました！氷の塊だろうが何だろうが、あたしの炎でドロドロにしてやるわ！", bondChar: "lunaria" },
          { label: "「フィオナとリッカの耐久支援で吹雪を耐え抜き、着実に追い詰める」", replySpeaker: "fiona", reply: "お任せください隊長♪ 誰一人凍えさせずに支え切ってみせます！" }
        ]
      },
      { bg: "frost_field", sfx: "roar", fx: "shake", speaker: "mint", text: "……マンモスが残した氷柱の陰から、氷狼の群れが追撃を邪魔しに出てきたよ！" }
    ]
  },
  {
    id: "ch3_ep12", chapter: "第十二話", title: "氷柱迷宮の待ち伏せ", subtitle: "凍結渓谷・氷狼ブリザードハウンド戦",
    reqClear: "ch3_ep11", battleEnemyId: "blizzard_hound", reward: { gems: 300, credits: 19500, books: 38, cores: 7 },
    scenes: [
      { bg: "frost_field", bgm: "tension", speaker: "narrator", text: "マンモスが通り過ぎた後に生まれた無数の氷柱。その死角から、冷気を帯びた銀狼たちが次々と飛びかかる。" },
      { bg: "frost_field", speaker: "leila", text: "周囲の氷柱で視界が悪いですね。ですが私の熱源スコープなら逃しません。" },
      { bg: "frost_field", speaker: "momo", text: "炎の双剣で氷柱ごと切り払っちゃうよ！みんな、あたしに続いてーっ！" },
      { bg: "danger", sfx: "roar", fx: "redflash", speaker: "protagonist", text: "氷柱迷宮を突破する！ブリザードハウンド群、掃討開始！" }
    ]
  },
  {
    id: "ch3_ep13", chapter: "第十三話", title: "氷壁の守り手、リッカの誇り", subtitle: "極寒の陣地構築・防衛オペレーターの覚悟",
    reqClear: "ch3_ep12", battleEnemyId: null, reward: { gems: 280, credits: 20000, books: 38, cores: 7 },
    scenes: [
      { bg: "camp_night", bgm: "story", speaker: "narrator", text: "マンモスを氷河盆地へ追い込むため、退路を塞ぐ氷壁バリケードを築く第7小隊。リッカが槍で的確に氷脈を導いている。" },
      { bg: "camp_night", speaker: "rikka", text: "……よし、防衛ラインの強度、計算通りです。これなら主霧獣の突進でも一度は確実に受け止められます。" },
      { bg: "camp_night", speaker: "aoi", text: "すごい技術ですねリッカさん！氷を武器ではなく、仲間を守る盾として自在に操れるなんて。" },
      { bg: "camp_night", speaker: "rikka", text: "私は攻撃の才能はありませんから。……でも、大切な仲間が後ろから安心して反撃できるよう、最前線で壁になり続けることなら誰にも負けません。" },
      { bg: "camp_night", speaker: "valeria", text: "素晴らしい騎士道精神ですわね。私も槍を振るう者として、あなたと肩を並べられることを誇りに思いますわ。" },
      {
        bg: "camp_night", speaker: "rikka", text: "隊長。明日の決戦では、敵の猛攻を私と防衛カードで必ず受け切ってみせます。",
        choices: [
          { label: "「頼りにしてるぞリッカ。お前の守りが俺たちの反撃の起点だ」", replySpeaker: "rikka", reply: "……はいっ！そのお言葉だけで、どんな冷気も跳ね返せそうです！" },
          { label: "「無理はするな。フィオナの回復と全員の連携で支え合おう」", replySpeaker: "fiona", reply: "そうですよリッカさん♪ 傷ついたらすぐ私が治してあげますからね！" }
        ]
      },
      { bg: "frost_lab", bgm: "tension", sfx: "alarm", fx: "redflash", speaker: "chloe", text: "警告！ドクター・ノクスが研究棟の残存機巧蜘蛛をすべて盆地へ差し向けてきました！防衛ラインを守り抜いてください！" }
    ]
  },
  {
    id: "ch3_ep14", chapter: "第十四話", title: "氷壁防衛ラインの死闘", subtitle: "盆地陣地防衛・機巧蜘蛛アラクネ迎撃",
    reqClear: "ch3_ep13", battleEnemyId: "frost_spider", reward: { gems: 320, credits: 22000, books: 42, cores: 8 },
    scenes: [
      { bg: "frost_field", bgm: "tension", speaker: "narrator", text: "完成したばかりの防衛ラインへ、ノクスが遠隔操作する機巧蜘蛛の大群が迫る。バリケードを壊されれば包囲作戦が瓦解してしまう。" },
      { bg: "frost_field", speaker: "rikka", text: "氷の防壁、最大展開！ここを一歩も通させません！" },
      { bg: "frost_field", speaker: "koharu", text: "あたしの重槌で機械の脚を全部叩き折ってあげるっ！" },
      { bg: "danger", sfx: "boom", fx: "redflash", speaker: "protagonist", text: "防衛ラインを死守せよ！機巧蜘蛛部隊を迎撃する！" }
    ]
  },
  {
    id: "ch3_ep15", chapter: "第十五話", title: "氷河盆地の対峙", subtitle: "主霧獣包囲完了・最終決戦ブリーフィング",
    reqClear: "ch3_ep14", battleEnemyId: null, reward: { gems: 300, credits: 22000, books: 42, cores: 8 },
    scenes: [
      { bg: "frost_field", bgm: "tension", speaker: "narrator", text: "ついに氷河盆地の中央で、背中に冷却炉を背負う巨獣『グレイシャル・マンモス』を包囲した第7小隊。" },
      { bg: "frost_field", sfx: "roar", fx: "shake", speaker: "narrator", text: "二本の巨大な氷牙が蒼白く輝き、大地を踏み鳴らすたびに足元から氷の棘が突き上げる。" },
      { bg: "frost_field", speaker: "celestia", text: "標的確認。背中の冷却炉殻は極めて頑丈ですが、破壊できれば敵の装甲と火力は劇的に低下します。" },
      { bg: "frost_field", speaker: "leila", text: "氷結の双牙への照準も完了。……隊長、いつでも撃てます。" },
      { bg: "frost_field", speaker: "lunaria", text: "よし、炎の大剣がうずいてるわ！氷の巨獣、一気に焼き払うわよ！" },
      { bg: "frost_field", speaker: "protagonist", text: "第7小隊、包囲陣形完了！主霧獣『グレイシャル・マンモス』討伐作戦を開始する！" }
    ]
  },
  {
    id: "ch3_ep16", chapter: "第十六話", title: "氷河の巨神『グレイシャル・マンモス』", subtitle: "第3エリア主霧獣との極寒決戦",
    reqClear: "ch3_ep15", battleEnemyId: "glacial_mammoth", reward: { gems: 480, credits: 28000, books: 52, cores: 12 },
    scenes: [
      { bg: "frost_field", bgm: "boss", sfx: "roar", fx: "shake", speaker: "narrator", text: "絶対零度の吹雪を纏い、グレイシャル・マンモスが巨大な鼻を高々と掲げた。" },
      { bg: "frost_field", speaker: "mikoto", text: "敵の必殺チャージを許せば小隊ごと凍りつきますわ。『崩し』と防御の呼吸を絶対に乱さぬように！" },
      { bg: "danger", sfx: "boom", fx: "redflash", speaker: "protagonist", text: "総員全力展開！！主霧獣『グレイシャル・マンモス』を討伐する！！" }
    ]
  },
  {
    id: "ch3_ep17", chapter: "第十七話", title: "炉心臨界・絶対零度の帝王", subtitle: "ノクスの切り札・黄金の融光帝王覚醒",
    reqClear: "ch3_ep16", battleEnemyId: null, reward: { gems: 320, credits: 25000, books: 46, cores: 9 },
    scenes: [
      { bg: "frost_field", bgm: "story", speaker: "narrator", text: "氷牙が砕け、巨大なマンモスが雪原へ膝をついた。だがその瞬間、背中の冷却炉から耳を裂く臨界警報が鳴り響いた。" },
      { bg: "gold_storm", bgm: "tension", sfx: "alarm", fx: "redflash", speaker: "narrator", text: "『……見事だ第7小隊。ならば最後の実験データを頂戴しよう。冷却炉の全エネルギーを逆流——融光臨界モード、起動！』" },
      { bg: "gold_storm", sfx: "boom", fx: "flash", speaker: "chloe", text: "冷却炉が黄金色の光を放って過飽和しています！！マンモスの傷が一瞬で黄金の氷晶に覆われていく……！" },
      { bg: "gold_storm", sfx: "roar", fx: "shake", speaker: "leila", text: "【融光種】絶対零度の帝王マンモス……。極北に伝わる氷の悪夢そのものです。" },
      { bg: "gold_storm", speaker: "mikoto", text: "ノクスめ、自分の研究棟ごとこの雪原を滅ぼす気ですか……！許せませんわ！" },
      { bg: "gold_storm", speaker: "aoi", text: "隊長！ノクスのメインサーバーは今、あのマンモスの背中の冷却炉と直結しています！あれを倒せば、雪原の暴走を完全に止められます！" }
    ]
  },
  {
    id: "ch3_ep18", chapter: "第十八話", title: "凍てつく嵐の突破口", subtitle: "臨界吹雪の中の最終前哨戦",
    reqClear: "ch3_ep17", battleEnemyId: "blizzard_hound", reward: { gems: 340, credits: 26000, books: 48, cores: 9 },
    scenes: [
      { bg: "gold_storm", bgm: "tension", speaker: "narrator", text: "黄金の冷気嵐が盆地を飲み込み、周囲の氷狼たちまで黄金の光を浴びて襲いかかってきた。" },
      { bg: "gold_storm", speaker: "sylphy", text: "邪魔だ邪魔だぁ！帝王マンモスの前に、こいつらを一瞬で蹴散らすぜ！" },
      { bg: "gold_storm", speaker: "fiona", text: "回復とバリアを厚く維持しながら進みましょう！" },
      { bg: "danger", sfx: "roar", fx: "redflash", speaker: "protagonist", text: "帝王マンモスへの道を開く！総員突撃！" }
    ]
  },
  {
    id: "ch3_ep19", chapter: "第十九話", title: "白銀を照らす絆の炎", subtitle: "第3章最終決戦直前・全員の決意",
    reqClear: "ch3_ep18", battleEnemyId: null, reward: { gems: 360, credits: 28000, books: 50, cores: 10 },
    scenes: [
      { bg: "gold_storm", bgm: "tension", sfx: "roar", fx: "shake", speaker: "narrator", text: "黄金の氷柱を背負い、絶対零度の威圧感を放つ『帝王マンモス』がついに小隊の正面へ立ち塞がった。" },
      { bg: "gold_storm", speaker: "narrator", text: "『さあ、人間ごときの絆とやらで、完全なる融光進化に抗ってみせるがいい！』" },
      { bg: "gold_storm", speaker: "lunaria", text: "人間ごときですって！？あんたみたいな独りよがりの幽霊に、あたしたちの絆がわかってたまるもんですか！" },
      { bg: "gold_storm", speaker: "mikoto", text: "ええ。氷の美しさも、炎の温かさも、すべては誰かを守るためにあるのです。" },
      {
        bg: "gold_storm", speaker: "leila", text: "融光氷牙、零度結晶炉——二箇所とも完全に射線へ捉えました。隊長、第3章を終わらせる号令を。",
        choices: [
          { label: "「ノクスの歪んだ実験はここで終わらせる！総力で帝王マンモスを討つ！」", replySpeaker: "leila", reply: "了解しました。……極北の空へ、勝利の一撃を放ちます。" },
          { label: "「全員の元素と絆を一つに！凍てつく大地に春の光を呼び戻すぞ！」", replySpeaker: "mikoto", reply: "はいっ！白狐の極氷葬、全力で撃ち込みましょう！", bondChar: "mikoto" }
        ]
      },
      { bg: "gold_storm", sfx: "boom", fx: "flash", speaker: "narrator", text: "白銀の雪原に、第7小隊の戦術光が眩しく燃え上がった。" }
    ]
  },
  {
    id: "ch3_ep20", chapter: "第二十話", title: "絶対零度の帝王を超えて", subtitle: "第3章完結・【融光種】絶対零度の帝王マンモス決戦",
    reqClear: "ch3_ep19", battleEnemyId: "radiant_mammoth", reward: { gems: 960, credits: 38000, books: 70, cores: 18 },
    scenes: [
      { bg: "gold_storm", bgm: "boss", sfx: "roar", fx: "shake", speaker: "narrator", text: "大地を凍らせる黄金の吹雪。これまでで最も苛烈な、融光帝王との最終決戦。" },
      { bg: "gold_storm", speaker: "aoi", text: "私たちが歩んできた第1章・第2章、そしてこの雪原でのすべての経験を力に変える時です！" },
      { bg: "gold_storm", speaker: "protagonist", text: "第7クリアラー小隊、最終決戦！！【融光種】絶対零度の帝王マンモスを撃破する！！" }
    ],
    epilogue: [
      { bg: "verde_morning", bgm: "home", sfx: "gift", fx: "flash", speaker: "narrator", text: "零度結晶炉が眩い光を放って砕け散り、帝王マンモスは静かに雪原へ横たわった。同時に、暴走していた人工吹雪が嘘のように止み、雲の切れ間から柔らかな陽光が差し込んだ。" },
      { bg: "frost_field", speaker: "narrator", text: "『……バカな……私の完全なる進化理論が……だが覚えておけ。すでにコアデータの転送は完了した……灼熱の溶鉱炉“イグニス・カルデラ”にて、真の覚醒が待っている……』" },
      { bg: "frost_field", sfx: "comm", speaker: "chloe", text: "ノクスのメインサーバー、完全沈黙しました！……ですが、最後の言葉通り、意識データが南の灼熱地帯『イグニス・カルデラ』へ転送された痕跡があります！" },
      { bg: "frost_field", speaker: "leila", text: "……それでも、この雪原を覆っていた呪縛は完全に解けました。ありがとう、第7小隊。これからは私もあなた方に同行します。" },
      { bg: "frost_field", speaker: "rikka", text: "私もです！ノクスと方舟の裏切り者たちの企みを止めるまで、この氷槍で皆さんを守り抜きます！" },
      { bg: "frost_field", bgm: "story", speaker: "valeria", text: "新緑の平原、雷鳴の峡谷、そして白銀の研究所……私たちの道は着実に真実へ近づいていますわ。次は灼熱の溶鉱炉『第4章：イグニス・カルデラ』へ参りましょう！" }
    ]
  }
];
