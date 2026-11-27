window.MF_STORY_CH2_B = [
  {
    id: "ch2_ep11", chapter: "第十一話", title: "雷竜の咆哮、裂ける蒼穹", subtitle: "発電所屋上・サンダー・ワイバーンとの対峙",
    reqClear: "ch2_ep10", battleEnemyId: null, reward: { gems: 260, credits: 10500, books: 24, cores: 5 },
    scenes: [
      { bg: "canyon_storm", bgm: "tension", sfx: "roar", fx: "shake", speaker: "narrator", text: "旧アーク発電所の屋上へ駆け上がった第7小隊の頭上を、巨大な蒼雷の影が轟音とともに横切った。" },
      { bg: "canyon_storm", speaker: "aoi", text: "上空通過確認！翼長四十メートル超……第2エリアの主霧獣『サンダー・ワイバーン』、完全に目覚めています！" },
      { bg: "canyon_storm", speaker: "sylphy", text: "ちっ、発電所を止めたせいで餌を絶たれてブチギレてやがるな！見ろ、最深部の『雷竜の頂』へ向かって旋回してるぜ。" },
      { bg: "canyon_storm", speaker: "melissa", text: "しかもマズいわよ、あれ。翼の放電器官から漏れてる光……普通の紫電じゃなくて、黄金色が混じり始めてる！" },
      { bg: "canyon_storm", sfx: "comm", speaker: "chloe", text: "通信入ります！衛星観測で最深部の断崖に異常な送電ケーブルを確認しました。発電所の本線とは別に、まだ地下の別系統が生きている可能性があります！" },
      { bg: "canyon_storm", speaker: "valeria", text: "このまま放置すれば、サンダー・ワイバーンが完全な『融光種』へと変貌してしまいますわね。一刻も早く頂へ急ぎましょう。" },
      { bg: "canyon_storm", speaker: "celestia", text: "頂へ続く道は二本あります。断崖沿いの『雷鳴の回廊』は最短ですが、暴走した霧獣が密集しているはずです。" },
      {
        bg: "canyon_storm", speaker: "protagonist", text: "嵐は刻一刻と激しさを増している。最深部『雷竜の頂』へ向けた進撃方針を決めるぞ。",
        choices: [
          { label: "「最短ルートの雷鳴の回廊を強行突破する。時間を与えるな」", replySpeaker: "lunaria", reply: "それでこそ第7小隊ね！邪魔な霧獣は全部あたしが焼き払って道を作るわ！", bondChar: "lunaria" },
          { label: "「ノアとミントの索敵を軸に、伏兵を確実に潰しながら登ろう」", replySpeaker: "mint", reply: "……うん。嵐の音の中でも、敵の足音だけは絶対に聞き逃さないよ。", bondChar: "mint" }
        ]
      },
      { bg: "canyon_storm", sfx: "boom", fx: "flash", speaker: "narrator", text: "稲妻が断崖を白く焦がす中、小隊は天空の決戦地へと足を踏み出した。" }
    ]
  },
  {
    id: "ch2_ep12", chapter: "第十二話", title: "雷鳴の回廊、疾風の挟撃", subtitle: "断崖道突破・暴走ラプトル群迎撃",
    reqClear: "ch2_ep11", battleEnemyId: "spark_raptor", reward: { gems: 260, credits: 11200, books: 25, cores: 5 },
    scenes: [
      { bg: "canyon_storm", bgm: "tension", speaker: "narrator", text: "左右を絶壁に挟まれた『雷鳴の回廊』。吹き荒れる横風を切り裂くように、複数の青い電光が前方と後方から同時に迫った。" },
      { bg: "canyon_storm", speaker: "noah", text: "わわっ、挟み撃ちだよ！ラプトルたちが主霧獣の咆哮に呼ばれて、回廊を塞いでる！" },
      { bg: "canyon_storm", speaker: "sylphy", text: "逃げ場がねぇなら真っ正面からブチ抜くだけだ！俺の風拡散でまとめて吹き飛ばしてやるぜ！" },
      { bg: "canyon_storm", speaker: "mikoto", text: "雷の速度に惑わされてはなりません。防御と凍結で足を止め、確実に仕留めましょう。" },
      { bg: "danger", sfx: "roar", fx: "redflash", speaker: "protagonist", text: "雷鳴の回廊を切り開く！全員、迎撃態勢！" }
    ]
  },
  {
    id: "ch2_ep13", chapter: "第十三話", title: "断崖の古戦場と残された弾薬箱", subtitle: "第2小隊の最終防衛線・セレスティアの誓い",
    reqClear: "ch2_ep12", battleEnemyId: null, reward: { gems: 240, credits: 11500, books: 26, cores: 5 },
    scenes: [
      { bg: "canyon_storm", bgm: "story", speaker: "narrator", text: "回廊を抜けた中腹の岩棚。そこには焦げ跡の残る防護壁と、風雨に晒された古い弾薬箱が並んでいた。" },
      { bg: "canyon_storm", speaker: "celestia", text: "……ここが、三年前に私たちが最後の防衛線を張った場所です。" },
      { bg: "canyon_storm", speaker: "valeria", text: "兄上が最後まで踏みとどまった地……。壁に残った無数の雷撃痕が、どれほど壮絶な戦いだったかを物語っていますわ。" },
      { bg: "canyon_storm", speaker: "celestia", text: "あの時、私たちの装備も戦術も、黄金に変異した雷竜の速度には全く追いつきませんでした。けれど——今の第7小隊には、あの頃になかったものがあります。" },
      { bg: "canyon_storm", speaker: "momo", text: "なあに、セレスティアさん？" },
      { bg: "canyon_storm", speaker: "celestia", text: "六つの元素を重ねて敵を封じる戦術連携と……どんな絶境でも全員を導く指揮官の存在です。" },
      { bg: "canyon_storm", speaker: "koharu", text: "あ、見て隊長！弾薬箱の中に、まだ使える高純度の絶縁コアがいくつか残ってたよ！武器の調整に使えそう！" },
      {
        bg: "canyon_storm", speaker: "celestia", text: "過去を悔やむのは今日で終わりにします。隊長、頂へ向かう前に一言いただけますか。",
        choices: [
          { label: "「この場所を『勝利への通過点』に書き換えよう」", replySpeaker: "celestia", reply: "……ええ。それが、先人たちへの何よりの手向けになりますね。", bondChar: "celestia" },
          { label: "「ヴァレリアもセレスティアも、全員で必ず生きて帰るぞ」", replySpeaker: "valeria", reply: "もちろんですわ！もう二度と、誰も失いはいたしません！", bondChar: "valeria" }
        ]
      },
      { bg: "powerplant", bgm: "tension", sfx: "alarm", fx: "redflash", speaker: "melissa", text: "ちょっとみんな！岩棚の奥に隠し送電ゲートがあるわよ！あそこから頂へ向かって莫大な電力が流れてる！" }
    ]
  },
  {
    id: "ch2_ep14", chapter: "第十四話", title: "隠し送電線の番人", subtitle: "地下中継ゲート・蓄電スカラベ重装戦",
    reqClear: "ch2_ep13", battleEnemyId: "volt_scarab", reward: { gems: 300, credits: 13000, books: 28, cores: 6 },
    scenes: [
      { bg: "powerplant", bgm: "tension", speaker: "narrator", text: "岩棚の奥に隠されていた秘密の送電中継ゲート。その主幹ケーブルを抱え込むように、ひときわ巨大な蓄電甲虫が待ち構えていた。" },
      { bg: "powerplant", sfx: "roar", fx: "shake", speaker: "koharu", text: "やっぱりいたーっ！『蓄電巨甲虫・スカラベ』が中継ゲートを守ってるよ！" },
      { bg: "powerplant", speaker: "melissa", text: "こいつを倒して主幹ケーブルを断ち切れば、頂の雷竜への電力供給を半分以上カットできるわ！" },
      { bg: "powerplant", speaker: "lunaria", text: "上等じゃない！硬い殻も高圧電流も、まとめてぶっ壊してやるわよ！" },
      { bg: "danger", sfx: "boom", fx: "redflash", speaker: "protagonist", text: "隠し送電ゲートを破壊する！総員、突撃開始！" }
    ]
  },
  {
    id: "ch2_ep15", chapter: "第十五話", title: "頂前の仮設陣地、嵐の前の静けさ", subtitle: "決戦直前のブリーフィングと仲間の絆",
    reqClear: "ch2_ep14", battleEnemyId: null, reward: { gems: 260, credits: 12500, books: 28, cores: 5 },
    scenes: [
      { bg: "camp_dusk", bgm: "story", speaker: "narrator", text: "隠し送電ケーブルを遮断したことで、頂を覆う紫電の嵐がわずかに弱まった。小隊は頂の直下にある洞窟で最後の休息を取っていた。" },
      { bg: "camp_dusk", speaker: "kaede", text: "はーい、最終決戦前の特製スタミナ弁当だよ！これを食べたら絶対に力が出るからね！" },
      { bg: "camp_dusk", speaker: "sylphy", text: "へっ、悪くねぇ味だな料理長。……なあ隊長、上にいる『サンダー・ワイバーン』は、ヴェルデの巨獣とは比べ物にならねぇスピードと火力だぞ。" },
      { bg: "camp_dusk", speaker: "mikoto", text: "はい。特に『右雷翼』と『蓄電の尾針』の二箇所を破壊できるかどうかで、戦局は大きく変わりますわ。" },
      { bg: "camp_dusk", speaker: "aoi", text: "さらに気掛かりなのは、主霧獣が倒れたあと……隠し送電の残余エネルギーが暴走しないかどうかです。" },
      { bg: "camp_dusk", sfx: "comm", speaker: "chloe", text: "通信良好です。万が一に備えて、方舟からいつでも軌道支援データを送れるように待機しています。……皆さん、絶対に無事で戻ってきてくださいね。" },
      {
        bg: "camp_dusk", speaker: "momo", text: "よしっ、お腹もいっぱいになったよ！隊長、頂へ登る前に気合のひとことお願いっ！",
        choices: [
          { label: "「ここまで積み上げてきた絆と戦術を信じろ。勝利を掴むぞ！」", replySpeaker: "momo", reply: "おおーっ！！第7小隊、絶対負けないもんねーっ！", bondChar: "momo" },
          { label: "「シルフィ、先陣を頼む。俺たちが必ずフォローする！」", replySpeaker: "sylphy", reply: "任せとけ隊長！空飛ぶトカゲの鼻っ柱、一撃でへし折ってやるぜ！", bondChar: "sylphy" }
        ]
      },
      { bg: "canyon_storm", bgm: "tension", sfx: "roar", fx: "flash", speaker: "narrator", text: "洞窟を抜けた先、雲を突き抜ける巨大な円形岩盤『雷竜の頂』に、蒼き稲妻が降り注いでいた。" }
    ]
  },
  {
    id: "ch2_ep16", chapter: "第十六話", title: "天空決戦！蒼穹の雷竜", subtitle: "主霧獣『サンダー・ワイバーン』討伐戦",
    reqClear: "ch2_ep15", battleEnemyId: "thunder_wyvern", reward: { gems: 420, credits: 16000, books: 35, cores: 8 },
    scenes: [
      { bg: "canyon_storm", bgm: "boss", sfx: "roar", fx: "shake", speaker: "narrator", text: "耳を劈く咆哮とともに、蒼い翼を広げた巨竜『サンダー・ワイバーン』が岩盤へ舞い降りた。" },
      { bg: "canyon_storm", speaker: "celestia", text: "標的『サンダー・ワイバーン』完全捕捉。右雷翼および蓄電尾針へマーキングを送信しました。" },
      { bg: "canyon_storm", speaker: "valeria", text: "空からの落雷チャージは極めて危険ですわ。必ず『崩し』と『防御・カウンター』を合わせて迎え撃ちましょう！" },
      { bg: "danger", sfx: "boom", fx: "redflash", speaker: "protagonist", text: "第7クリアラー小隊、総員全力展開！蒼穹の雷竜を撃ち落とす！" }
    ]
  },
  {
    id: "ch2_ep17", chapter: "第十七話", title: "禁断の遠隔送電、黄金の覚醒", subtitle: "倒れた雷竜に起きる異変・黒幕の通信",
    reqClear: "ch2_ep16", battleEnemyId: null, reward: { gems: 280, credits: 14000, books: 30, cores: 6 },
    scenes: [
      { bg: "canyon_storm", bgm: "story", speaker: "narrator", text: "激しい死闘の末、サンダー・ワイバーンが岩盤へ崩れ落ちた。しかし安堵の息をつく間もなく、小隊の端末が一斉に耳障りな警告音を鳴らした。" },
      { bg: "gold_storm", bgm: "tension", sfx: "alarm", fx: "redflash", speaker: "chloe", text: "だ、ダメです！！誰かが遥か北の極寒地帯から、暗号化衛星回線を使って地下深層炉を強制起動しました！！" },
      { bg: "gold_storm", sfx: "comm", speaker: "narrator", text: "その時、小隊の通信回線に、冷たく機械的に加工された謎の音声が割り込んだ。" },
      { bg: "gold_storm", speaker: "narrator", text: "『……興味深い。方舟の小さな第7小隊が、ここまで辿り着くとはね。ならば見せてあげよう。人類の進化を促す“過飽和の光”——完全なる融光種の威容を』" },
      { bg: "gold_storm", sfx: "boom", fx: "flash", speaker: "lunaria", text: "なっ……誰なのよあんた！？卑怯な真似してんじゃないわよ！" },
      { bg: "gold_storm", sfx: "roar", fx: "shake", speaker: "mikoto", text: "……っ！お気をつけください！倒れたはずのワイバーンの体へ、黄金色の雷が奔流となって注ぎ込まれていますわ！" },
      { bg: "gold_storm", speaker: "celestia", text: "計測不能のエネルギー出力……【融光種】天雷のオーバーワイバーン。三年前、第2小隊を呑み込んだ『黄金の災厄』そのものです！" },
      { bg: "gold_storm", speaker: "sylphy", text: "チッ、とんでもねぇ化け物が起きちまったな！だが、ここで引いたら峡谷もヴェルデ平原も丸焼きだぜ！" },
      { bg: "gold_storm", speaker: "aoi", text: "隊長……敵の威圧感がさっきまでとは別次元です。でも、私たちの足は震えていません！" }
    ]
  },
  {
    id: "ch2_ep18", chapter: "第十八話", title: "黄金の嵐を割る閃光", subtitle: "暴走する雷嵐の中での防衛戦",
    reqClear: "ch2_ep17", battleEnemyId: "spark_raptor", reward: { gems: 300, credits: 14500, books: 32, cores: 6 },
    scenes: [
      { bg: "gold_storm", bgm: "tension", sfx: "boom", fx: "flash", speaker: "narrator", text: "黄金の雷竜が天へ昇り、極限出力の雷嵐を呼び起こす。その余波に引き寄せられたラプトルの群れが、撤退路を塞ぐように襲いかかってきた。" },
      { bg: "gold_storm", speaker: "valeria", text: "オーバーワイバーンが降りてくる前に、足元の取り巻きを一掃しなければ挟み撃ちにされますわ！" },
      { bg: "gold_storm", speaker: "koharu", text: "あたしの重槌で一気に道を空けるよ！みんな、体力を温存しつつ素早く片付けよう！" },
      { bg: "danger", sfx: "roar", fx: "redflash", speaker: "protagonist", text: "黄金の嵐に呑まれるな！まずは前衛の霧獣を掃討する！" }
    ]
  },
  {
    id: "ch2_ep19", chapter: "第十九話", title: "託された銀翼、決戦の号令", subtitle: "最終決戦直前・全員の想いを一つに",
    reqClear: "ch2_ep18", battleEnemyId: null, reward: { gems: 320, credits: 15000, books: 34, cores: 7 },
    scenes: [
      { bg: "gold_storm", bgm: "tension", sfx: "roar", fx: "shake", speaker: "narrator", text: "空を覆い尽くす黄金の雷雲が渦を巻き、ついに完全体となった『天雷のオーバーワイバーン』が岩盤へ降り立った。" },
      { bg: "gold_storm", speaker: "chloe", text: "解析完了！奴の弱点は『融光雷翼』と胸部の『暴走プラズマ核』の二箇所です！部位を破壊すれば、過飽和エネルギーが霧散して一気に隙が生まれます！" },
      { bg: "gold_storm", speaker: "melissa", text: "あたしの特製絶縁コイル、出力最大にしておいたわ！もう出し惜しみはナシよ！" },
      { bg: "gold_storm", speaker: "celestia", text: "……兄上、第2小隊の皆さん。三年越しの決着を、今ここでつけます。" },
      { bg: "gold_storm", speaker: "valeria", text: "私の槍も、ルナリア殿の大剣も、ミコト殿の氷華も……すべては今日この瞬間のために磨いてきましたわ！" },
      {
        bg: "gold_storm", speaker: "sylphy", text: "ハハッ、最高にヒリつくじゃねぇか！さあ隊長、伝説の『融光種』をブッ倒す最後の号令を頼むぜ！！",
        choices: [
          { label: "「全員の力を重ね、黄金の天雷を超えてみせる！行くぞ第7小隊！」", replySpeaker: "sylphy", reply: "おうっ！！歴史に残る大勝利を掴み取ってやろうぜ！！", bondChar: "sylphy" },
          { label: "「誰一人欠けるな。冷静に読み勝ち、最高の連携で討ち果たす！」", replySpeaker: "celestia", reply: "了解しました、隊長。……全弾、確実に撃ち抜きます。", bondChar: "celestia" }
        ]
      },
      { bg: "gold_storm", sfx: "boom", fx: "flash", speaker: "narrator", text: "黄金の稲妻と第7小隊の戦術光が激突する。第2章、最終決戦の幕が上がった。" }
    ]
  },
  {
    id: "ch2_ep20", chapter: "第二十話", title: "黄金の天雷を超えて", subtitle: "第2章完結・【融光種】天雷のオーバーワイバーン最終決戦",
    reqClear: "ch2_ep19", battleEnemyId: "radiant_wyvern", reward: { gems: 800, credits: 25000, books: 55, cores: 14 },
    scenes: [
      { bg: "gold_storm", bgm: "boss", sfx: "roar", fx: "shake", speaker: "narrator", text: "黄金の雷翼が天地を焼き払う。並の戦力では一撃すら耐えられぬ、真の『融光種』の猛威。" },
      { bg: "gold_storm", speaker: "lunaria", text: "育て上げた力も、選び抜いたカードも、全部ここで叩き込むわよ！行くわよ隊長っ！" },
      { bg: "gold_storm", speaker: "protagonist", text: "第7クリアラー小隊、最終決戦！！【融光種】天雷のオーバーワイバーンを撃破する！！" }
    ],
    epilogue: [
      { bg: "verde_morning", bgm: "home", sfx: "gift", fx: "flash", speaker: "narrator", text: "セレスティアの貫通弾と小隊の総力連携が暴走プラズマ核を打ち砕いた瞬間、黄金の嵐は眩い光の粒子となって空へ溶けていった。" },
      { bg: "verde_morning", speaker: "aoi", text: "……やりました！！融光種オーバーワイバーン、完全沈黙を確認！峡谷を覆っていた雷雲が嘘みたいに晴れていきます！" },
      { bg: "verde_morning", speaker: "valeria", text: "……やり遂げましたわね、隊長。兄上も、第2小隊の皆さんも……きっと空の上で笑ってくれているはずですわ。" },
      { bg: "verde_morning", speaker: "celestia", text: "……ありがとう、隊長。あなたのおかげで、ようやく前を向くことができました。" },
      { bg: "verde_morning", speaker: "momo", text: "わぁ〜っ、峡谷の向こうに真っ白な雪山が見えるよ！すごい綺麗！" },
      { bg: "ark_night", bgm: "tension", sfx: "comm", speaker: "chloe", text: "皆さん、大勝利のあとに緊急速報です！先ほど割り込んできた謎の通信の発信源を、ついに完全逆探知しました！" },
      { bg: "ark_night", speaker: "chloe", text: "座標は北の極寒地帯——第3エリア『白銀の研究所・フロストヘイヴン』。百年前に閉鎖されたはずの中央研究棟から、今も誰かが融光種を操っています！" },
      { bg: "verde_morning", bgm: "story", speaker: "mikoto", text: "白銀の研究所……凍てつく雪原の奥に、すべての黒幕が潜んでいるのですね。隊長殿、次なる舞台へ向けて、小隊をさらに鍛え上げましょう。" }
    ]
  }
];
