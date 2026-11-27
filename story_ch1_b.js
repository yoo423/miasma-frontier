window.MF_STORY_CH1_B = [
  {
    id: "ch1_ep11", chapter: "第十一話", title: "高台の狙撃手、セレスティア", subtitle: "見張り高台での合流・地下反応の解析",
    reqClear: "ch1_ep10", battleEnemyId: null, reward: { gems: 200, credits: 6000, books: 16, cores: 3 },
    scenes: [
      { bg: "camp_night", bgm: "tension", speaker: "narrator", text: "大猪ブルを退けた直後の重い地鳴り。通信の主を追って見張り高台へ駆け上がった小隊を待っていたのは、黒と白のコートを翻す長髪の狙撃手だった。" },
      { bg: "camp_night", speaker: "celestia", text: "……遅れましたね、第7小隊。長距離狙撃担当のセレスティアです。先ほどの迎撃戦、スコープ越しに拝見していました。" },
      { bg: "camp_night", speaker: "mint", text: "……セレスティアさん。方舟都市で一番の狙撃手って聞いたことがある。どうしてヴェルデ平原に？" },
      { bg: "camp_night", speaker: "celestia", text: "三日前から、この平原の中央地下で不規則な振動を観測していたからです。……ほら、スコープの映像を端末へ送ります。" },
      { bg: "camp_night", sfx: "comm", speaker: "aoi", text: "これは……平原の中央にある巨大な陥没地帯！地下の岩盤の隙間から、紫と黄金が混ざった霧が噴き出しています！" },
      { bg: "camp_night", speaker: "celestia", text: "ええ。先ほどあなた方が倒した大猪が変異していたのも、地下から漏れ出した過飽和アーク光を浴びたためでしょう。" },
      { bg: "camp_night", speaker: "lunaria", text: "つまり、その大穴の底に『モス・ベヒーモス』とかいう主霧獣が眠ってるってことね。目覚める前に先手を打てないの？" },
      { bg: "camp_night", speaker: "celestia", text: "残念ながら、すでに覚醒は最終段階です。外周の霧が濃くなり、周囲の原生獣たちまで狂暴化し始めています。" },
      {
        bg: "camp_night", speaker: "celestia", text: "ここからは私の狙撃支援も小隊に加えます。隊長、まずは中央大穴へ続く外周ルートのどこから切り開きますか？",
        choices: [
          { label: "「西の旧街道から切り込む。セレスティア、高所の監視を頼む」", replySpeaker: "celestia", reply: "了解しました。高台から周囲二キロ圏内の動きをすべて押さえます。", bondChar: "celestia" },
          { label: "「焦らず周囲の霧獣を掃討しながら、確実に前進しよう」", replySpeaker: "aoi", reply: "堅実な方針です！背後を突かれないよう、一つずつ安全地帯を広げましょう。", bondChar: "aoi" }
        ]
      },
      { bg: "forest_mist", sfx: "roar", fx: "shake", speaker: "mint", text: "……話している間に、西の街道から狼の遠吠え。いつもよりずっと気が立ってる……！" }
    ]
  },
  {
    id: "ch1_ep12", chapter: "第十二話", title: "狂乱の街道、霧に呑まれし群れ", subtitle: "西街道突破・狂暴化したウルフ群迎撃",
    reqClear: "ch1_ep11", battleEnemyId: "wolf_pack", reward: { gems: 200, credits: 6400, books: 18, cores: 3 },
    scenes: [
      { bg: "forest_mist", bgm: "tension", speaker: "narrator", text: "翌朝、西の旧街道へ踏み込んだ第7小隊を覆ったのは、視界十メートル先すら霞む濃い紫の霧だった。" },
      { bg: "forest_mist", speaker: "momo", text: "ううっ、昨日より霧が濃いよ！鼻がツンとする……あ、前方に赤い目がいくつも光ってる！" },
      { bg: "forest_mist", speaker: "celestia", text: "高台より確認。ミアズマ・ウルフの群れですが、主霧獣の咆哮に当てられて完全に狂乱状態に陥っています。" },
      { bg: "forest_mist", speaker: "valeria", text: "初陣の相手だからと侮ってはなりませんわ。油断すれば一瞬で囲まれます。陣形を整えて迎え撃ちましょう。" },
      { bg: "forest_mist", speaker: "lunaria", text: "上等よ！ウォーミングアップにはちょうどいい相手じゃない！" },
      { bg: "danger", sfx: "roar", fx: "redflash", speaker: "protagonist", text: "西街道を突破する！全員、戦術リンク展開！" }
    ]
  },
  {
    id: "ch1_ep13", chapter: "第十三話", title: "名門騎士の誇りと、消えた先遣隊", subtitle: "街道の廃墟で発見した古い認識票",
    reqClear: "ch1_ep12", battleEnemyId: null, reward: { gems: 200, credits: 6600, books: 18, cores: 3 },
    scenes: [
      { bg: "ruins_fog", bgm: "story", speaker: "narrator", text: "狼群を退けた街道の脇。苔むした防壁の陰で、ヴァレリアが足を止め、銀色の小さなプレートを拾い上げた。" },
      { bg: "ruins_fog", speaker: "valeria", text: "……これは。三年前の第二次降下作戦で消息を絶った『第2クリアラー小隊』の認識票ですわ……。" },
      { bg: "ruins_fog", speaker: "aoi", text: "第2小隊……たしか、方舟都市でも最強と謳われた精鋭部隊でしたよね。どうしてこんな場所に？" },
      { bg: "ruins_fog", speaker: "valeria", text: "……私の兄が、その小隊の副隊長を務めておりましたの。ヴェルデ平原を突破し、北の峡谷へ向かったまま戻らなかった……。" },
      { bg: "ruins_fog", speaker: "celestia", text: "…………。" },
      { bg: "ruins_fog", speaker: "mint", text: "……セレスティアさん、なんだか手が震えてる。大丈夫？" },
      { bg: "ruins_fog", speaker: "celestia", text: "……いえ、何でもありません。ただ、過去の失敗を繰り返すわけにはいかないと思い直しただけです。" },
      { bg: "ruins_fog", sfx: "comm", speaker: "chloe", text: "ヴァレリアさん、その認識票の記録チップ、まだ読めるかもしれません。……あっ、短いメモが残ってます！『平原の主は、頭部の巨角に霧を集める。角を砕け』" },
      { bg: "ruins_fog", speaker: "valeria", text: "……兄上が、あとに続く私たちのために残してくれた戦術記録ですわね。無駄にはいたしません。" },
      {
        bg: "ruins_fog", speaker: "valeria", text: "隊長。この先には必ず、兄たちが挑んだ以上の脅威が待っています。それでも、共に歩んでくださいますか？",
        choices: [
          { label: "「もちろんだ。先人たちの想いを背負って、必ず霧を晴らそう」", replySpeaker: "valeria", reply: "……ええ。あなたとなら、必ず成し遂げられると信じていますわ。", bondChar: "valeria" },
          { label: "「そのメモは最高の武器だ。巨角を砕く作戦を必ず成功させる」", replySpeaker: "celestia", reply: "……感謝します、隊長。その言葉で、私も迷いが消えました。", bondChar: "celestia" }
        ]
      },
      { bg: "ruins_fog", speaker: "narrator", text: "ヴァレリアは認識票を胸元へしまい、真っ直ぐに中央大穴の方角を見据えた。" }
    ]
  },
  {
    id: "ch1_ep14", chapter: "第十四話", title: "深緑の瘴気壁", subtitle: "中央盆地入口・濃密胞子帯の浄化戦",
    reqClear: "ch1_ep13", battleEnemyId: "spore_slime", reward: { gems: 220, credits: 7000, books: 20, cores: 3 },
    scenes: [
      { bg: "forest_mist", bgm: "tension", speaker: "narrator", text: "中央大穴を取り囲む外輪森。そこには巨大な胞子霧獣が群生し、天然の瘴気壁を作り上げていた。" },
      { bg: "forest_mist", speaker: "koharu", text: "うわぁ、これじゃ進めないよ！『瘴霧胞子・マッシュ』が道いっぱいに根を張っちゃってる！" },
      { bg: "forest_mist", speaker: "mikoto", text: "無理に突っ切れば瘴気に当てられますわ。炎と風で胞子を焼き払い、道を切り開くしかありませんね。" },
      { bg: "forest_mist", speaker: "kaede", text: "みんな、特製のアーク香草キャンディを配るから口に含んで！少しは霧の息苦しさがマシになるはず！" },
      { bg: "forest_mist", speaker: "momo", text: "おっ、スースーして美味しい！元気百倍だよ、一気に突破しよう隊長！" },
      { bg: "danger", sfx: "roar", fx: "shake", speaker: "protagonist", text: "瘴気壁を焼き払え！瘴霧胞子・マッシュ、掃討開始！" }
    ]
  },
  {
    id: "ch1_ep15", chapter: "第十五話", title: "紅蓮と氷華、背中合わせの誓い", subtitle: "前線前進拠点での小休止・ルナリアとミコト",
    reqClear: "ch1_ep14", battleEnemyId: null, reward: { gems: 220, credits: 7200, books: 20, cores: 4 },
    scenes: [
      { bg: "camp_dusk", bgm: "story", speaker: "narrator", text: "胞子帯を突破し、中央大穴を望む丘に仮設の前進拠点を設けた夕暮れ。大剣を手入れするルナリアの隣に、ミコトが静かに腰を下ろした。" },
      { bg: "camp_dusk", speaker: "lunaria", text: "……ねえミコト。正直、あんた最初にあたしが第7小隊と組むって言ったとき、どう思った？" },
      { bg: "camp_dusk", speaker: "mikoto", text: "ふふ、意外でしたわ。いつも単独で突っ走っていたルナリア殿が、あんなに素直に指揮に従うなんて。" },
      { bg: "camp_dusk", speaker: "lunaria", text: "うっさいわね！……でもさ、あいつが指揮すると、あたしの炎もあんたの氷も、一人じゃ絶対出せない威力に跳ね上がるんだよ。ちょっと悔しいくらいにさ。" },
      { bg: "camp_dusk", speaker: "mikoto", text: "ええ、私も同じことを感じておりました。……あら、噂をすればご本人がいらっしゃいましたよ。" },
      {
        bg: "camp_dusk", speaker: "lunaria", text: "なっ、いつからそこにいたのよ隊長！？べ、別に褒めてたわけじゃないんだからねっ！",
        choices: [
          { label: "「二人の炎と氷の連携は、小隊最強の切り札だと思ってるよ」", replySpeaker: "lunaria", reply: "……っ！急に真面目な顔で言うんじゃないわよ！でも、期待には全力で応えてあげる！", bondChar: "lunaria" },
          { label: "「明日も頼りにしてる。ミコトの冷静な支えがみんなを救ってる」", replySpeaker: "mikoto", reply: "過分なお言葉ですわ。隊長殿のためなら、この氷華を何度でも咲かせましょう。", bondChar: "mikoto" }
        ]
      },
      { bg: "camp_dusk", speaker: "narrator", text: "茜色の空の下、小隊の絆は決戦へ向けて確かな形を結びつつあった。" }
    ]
  },
  {
    id: "ch1_ep16", chapter: "第十六話", title: "地割れを越える猛進", subtitle: "外輪谷・暴走大猪の待ち伏せ",
    reqClear: "ch1_ep15", battleEnemyId: "forest_boar", reward: { gems: 240, credits: 7800, books: 22, cores: 4 },
    scenes: [
      { bg: "forest_mist", bgm: "tension", speaker: "narrator", text: "中央大穴の縁まであと数百メートル。しかし切り立った岩場から、再び黄金の火花を纏う巨影が飛び出してきた。" },
      { bg: "forest_mist", sfx: "roar", fx: "shake", speaker: "koharu", text: "うわぁっ、また『苔むした大猪・ブル』だ！主霧獣の縄張りを守ってるみたいに、何頭も集まってきてるよ！" },
      { bg: "forest_mist", speaker: "celestia", text: "狙撃準備完了。以前戦った個体よりさらに瘴気濃度が上がっています。防御を疎かにすれば一撃で吹き飛ばされますよ。" },
      { bg: "forest_mist", speaker: "aoi", text: "小隊の総力、育成の成果を試される一戦です！牙を破壊して突進を止めましょう！" },
      { bg: "danger", sfx: "roar", fx: "redflash", speaker: "protagonist", text: "縄張りの防衛線を突破する！総員、戦闘開始！" }
    ]
  },
  {
    id: "ch1_ep17", chapter: "第十七話", title: "決戦前夜、星明かりの晩餐", subtitle: "総力戦に向けた最後の夜と隊員たちの覚悟",
    reqClear: "ch1_ep16", battleEnemyId: null, reward: { gems: 240, credits: 8200, books: 24, cores: 4 },
    scenes: [
      { bg: "camp_night", bgm: "home", speaker: "narrator", text: "主霧獣の巣を目前に控えた最後の夜。前進拠点の焚き火には、これまでにないほど豪華な大鍋が掛けられていた。" },
      { bg: "camp_night", speaker: "kaede", text: "さあみんな、明日はいよいよ本番だよ！秘蔵のスパイスを全部使った特製シチュー、お腹いっぱい食べて英気を養って！" },
      { bg: "camp_night", speaker: "momo", text: "わぁ〜っ！お肉がゴロゴロ入ってる！隊長もほら、一番大きいお肉をあげるね！" },
      { bg: "camp_night", speaker: "koharu", text: "武器のメンテナンスもバッチリ終わったよ！明日はどんな硬い殻でも叩き割れるはず！" },
      { bg: "camp_night", speaker: "mint", text: "……ねえ隊長。もし明日、本当にヴェルデ平原の霧が全部晴れたら……一番最初に何がしたい？" },
      {
        bg: "camp_night", speaker: "aoi", text: "私も聞いてみたいです！この長い戦いが一段落したら、隊長は何をしたいですか？",
        choices: [
          { label: "「雲ひとつない青空の下で、全員そろって盛大な祝勝会をやろう」", replySpeaker: "kaede", reply: "決定だね！じゃあ明日は絶対に勝って、最高のパーティーを開くよ！", bondChar: "kaede" },
          { label: "「まだ霧に覆われた他の地域へ、みんなと一緒に開拓を広げていく」", replySpeaker: "aoi", reply: "はいっ！ここがゴールではなく、人類の新しい始まりですからね！", bondChar: "aoi" }
        ]
      },
      { bg: "camp_night", sfx: "comm", speaker: "chloe", text: "……みんな、いい雰囲気ですね。方舟の管制室からも全力でバックアップします。明日の朝、いよいよ突入です！" }
    ]
  },
  {
    id: "ch1_ep18", chapter: "第十八話", title: "巨岩の門番、鉄壁の甲殻", subtitle: "大穴入口の最終関門・結晶甲虫重装種",
    reqClear: "ch1_ep17", battleEnemyId: "crystal_beetle", reward: { gems: 280, credits: 9000, books: 25, cores: 5 },
    scenes: [
      { bg: "ruins_fog", bgm: "tension", speaker: "narrator", text: "夜明け。中央大穴の底へ降りる巨大な石橋の前で、ひときわ巨大な結晶甲虫が門番のように立ち塞がっていた。" },
      { bg: "ruins_fog", sfx: "roar", fx: "shake", speaker: "valeria", text: "主霧獣の巣へ通じる最後の関門ですわね。甲殻の結晶密度が東遺跡の個体よりさらに高まっています！" },
      { bg: "ruins_fog", speaker: "lunaria", text: "ちょうどいいじゃない、ここで弾かれるようじゃこの先のボスには勝てないわ！あたしたちの本気を見せてやる！" },
      { bg: "ruins_fog", speaker: "mikoto", text: "『崩し』と元素反応を正確に重ね、体力を温存したまま突破いたしましょう。" },
      { bg: "danger", sfx: "roar", fx: "redflash", speaker: "protagonist", text: "門番を打ち破り、主霧獣の待つ大穴へ突入する！" }
    ]
  },
  {
    id: "ch1_ep19", chapter: "第十九話", title: "古代樹の巨岩跡、主の覚醒", subtitle: "ヴェルデ平原最深部・モス・ベヒーモス降臨",
    reqClear: "ch1_ep18", battleEnemyId: null, reward: { gems: 260, credits: 9500, books: 26, cores: 5 },
    scenes: [
      { bg: "ruins_fog", bgm: "tension", speaker: "narrator", text: "石橋を渡り終えた先に広がっていたのは、巨大な古代樹の根が絡み合う円形の巨岩跡だった。周囲の紫霧がすべて中心へ向かって渦を巻いている。" },
      { bg: "danger", sfx: "boom", fx: "shake", speaker: "narrator", text: "ズゥゥゥン……ッ！！ 岩山だと見紛うほど巨大な塊が、ゆっくりと四本の脚で立ち上がった。" },
      { bg: "danger", sfx: "roar", fx: "redflash", speaker: "aoi", text: "巨大生体反応、計測限界を突破！！体長三十メートル超……背中に古代の苔と結晶林を背負った巨獣、『モス・ベヒーモス』が完全覚醒しました！！" },
      { bg: "danger", speaker: "momo", text: "うわぁっ、見上げるだけで首が痛くなるくらいデカいよ！！でも、足が震えても絶対に逃げないっ！" },
      { bg: "danger", speaker: "celestia", text: "確認しました。頭部の『結晶の巨角』、そして背中の『苔殻』——この二箇所に膨大なエネルギーが集中しています。部位破壊できれば敵の猛攻を和らげられます。" },
      { bg: "danger", speaker: "mikoto", text: "さらに体力が半分を切ると、怒りのオーバードライブへ移行するはずです。大技のチャージには必ず『崩し』か『凍結』を合わせねばなりません。" },
      { bg: "danger", speaker: "valeria", text: "百年もの間、この大地を霧に閉ざし続けた元凶ですわ。……兄上、見ていてくださいまし。" },
      {
        bg: "danger", speaker: "lunaria", text: "さあ隊長！長い旅路の集大成よ！あたしたち第7小隊に、最後の号令をちょうだい！！",
        choices: [
          { label: "「狙うは巨角と背殻の部位破壊！全戦力でヴェルデの主を討つ！」", replySpeaker: "celestia", reply: "照準完全ロック。……第7小隊、勝利を掴み取りましょう。", bondChar: "celestia" },
          { label: "「誰一人欠けず、この平原に百年ぶりの青空を取り戻すぞ！」", replySpeaker: "lunaria", reply: "了解っ！！あたしの炎で霧ごと全部焼き払ってやるわ！！", bondChar: "lunaria" }
        ]
      },
      { bg: "danger", sfx: "roar", fx: "shake", speaker: "narrator", text: "天地を揺るがす咆哮が響き渡る。第1章、最後の決戦が幕を開けた。" }
    ]
  },
  {
    id: "ch1_ep20", chapter: "第二十話", title: "決戦！新緑の主『モス・ベヒーモス』", subtitle: "第1章完結・ヴェルデ平原解放決戦",
    reqClear: "ch1_ep19", battleEnemyId: "moss_behemoth", reward: { gems: 640, credits: 16000, books: 40, cores: 10 },
    scenes: [
      { bg: "danger", bgm: "boss", sfx: "roar", fx: "shake", speaker: "narrator", text: "巨角から放たれる紫の雷光が大地を焦がす。これまでのどの敵とも格が違う、圧倒的な威圧感。" },
      { bg: "danger", speaker: "aoi", text: "各員、育成した力と積み上げたデッキのすべてを解き放つ時です！" },
      { bg: "danger", speaker: "protagonist", text: "第7クリアラー小隊、総員全力展開！！主霧獣『モス・ベヒーモス』を討伐する！！" }
    ],
    epilogue: [
      { bg: "verde_morning", bgm: "home", sfx: "flash", fx: "flash", speaker: "narrator", text: "最後の一撃が結晶の巨角を貫いた瞬間、巨大な咆哮は光の粒子となって砕け散った。" },
      { bg: "verde_morning", speaker: "narrator", text: "重く垂れ込めていた紫の瘴霧が潮が引くように消え去り、百年ぶりに真っ青な空と眩しい太陽がヴェルデ平原を照らし出した。" },
      { bg: "verde_morning", speaker: "aoi", text: "……やりました！モス・ベヒーモス完全沈黙！平原全域のミアズマ濃度がゼロへ低下していきます！" },
      { bg: "verde_morning", speaker: "momo", text: "やったぁぁっ！！青空だよ、本物の太陽だよ隊長！！みんなでお祝いしようよっ！" },
      { bg: "verde_morning", speaker: "lunaria", text: "はぁ〜っ、さすがに骨が折れたわね！……でも、この景色を見たら疲れなんて全部吹っ飛んだわ。" },
      { bg: "verde_morning", speaker: "valeria", text: "お見事でしたわ、隊長。方舟都市の歴史に刻まれる大勝利です。" },
      { bg: "verde_morning", speaker: "mikoto", text: "ですが……喜びも束の間、北の空に不穏な雷雲が立ち上っておりますね。" },
      { bg: "camp_dusk", bgm: "tension", sfx: "comm", speaker: "sylphy", text: "おう、派手にやってくれたじゃねぇか新人隊長！嵐の峡谷の狩人、シルフィだ。……悪いが、祝勝会は手短に済ませてくれ。" },
      { bg: "camp_dusk", speaker: "sylphy", text: "北の『ヴォルト・キャニオン』で、黄金の雷を纏ったとんでもねぇ竜が暴れ始めた。……あんたらの力が必要だぜ。" },
      { bg: "verde_morning", bgm: "story", speaker: "chloe", text: "これにて第1章『新緑の廃墟』完全踏破です！……そして物語は、雷鳴轟く第2章『ヴォルト・キャニオン』へと続きます！" }
    ]
  }
];
