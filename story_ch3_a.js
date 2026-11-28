window.MF_STORY_CH3_A = [
  {
    id: "ch3_ep1", chapter: "第一話", title: "白銀の境界線", subtitle: "極寒雪原フロスト・ヘイヴン突入",
    reqClear: "ch2_ep20", battleEnemyId: null, reward: { gems: 260, credits: 12000, books: 26, cores: 5 },
    scenes: [
      { bg: "frost_field", bgm: "story", speaker: "narrator", text: "雷鳴の峡谷を抜け、北へそびえる山脈を越えた先——視界のすべてを真っ白な雪と蒼い氷柱が埋め尽くす極寒の大地が広がっていた。" },
      { bg: "frost_field", speaker: "narrator", text: "第三開拓領域『フロスト・ヘイヴン』。かつてアーク結晶の極低温制御を研究していた、巨大研究所群の跡地である。" },
      { bg: "frost_field", speaker: "momo", text: "ぶるるるっ……さ、さむーい！！息が真っ白だよ隊長！耳まで凍っちゃいそう！" },
      { bg: "frost_field", speaker: "fiona", text: "ほらモモちゃん、防寒保温ジェルを首元に塗っておきますね。低体温症になったら衛生兵の私の出番が増えちゃいますから♪" },
      { bg: "frost_field", speaker: "belle", text: "水晶玉が囁いています……この吹雪、自然の気象ではありません。北の巨大ドームから人工的な冷気波が流れ続けていますわ。" },
      { bg: "frost_field", speaker: "aoi", text: "峡谷の戦いの直後にクロエさんが逆探知した『謎の通信の発信源』も、ちょうどあの白銀のドームです！" },
      { bg: "frost_field", bgm: "tension", sfx: "slash", fx: "flash", speaker: "narrator", text: "シュンッ——！！ 吹雪を裂く鋭い銃声が響き、小隊の足元へ飛びかかろうとしていた白い影が氷の礫となって弾け飛んだ。" },
      { bg: "frost_field", speaker: "leila", text: "……動かないで。雪原で無防備に立ち止まるのは、霧獣に餌を差し出すようなものです。" },
      { bg: "frost_field", speaker: "rikka", text: "第7クリアラー小隊の皆様ですね。私は氷壁防衛オペレーターのリッカ、そしてこちらが極北スナイパーのレイラです。" },
      { bg: "frost_field", speaker: "leila", text: "あなたがヴェルデと峡谷の主霧獣を討った隊長ですか。……噂ほど頼りなくはなさそうですね。" },
      {
        bg: "frost_field", speaker: "rikka", text: "吹雪が強まってきました。私たちが確保している雪原前哨基地へご案内します。隊長、進軍ペースはどうなさいますか？",
        choices: [
          { label: "「レイラとリッカの案内を信じる。速やかに前哨基地へ入ろう」", replySpeaker: "leila", reply: "……賢明です。私の足跡の後ろを真っ直ぐついてきてください。", bondChar: "leila" },
          { label: "「フィオナとベルの体調管理を優先しつつ、確実に進もう」", replySpeaker: "fiona", reply: "優しいご判断です隊長♪ みなさんのコンディションは私にお任せください！", bondChar: "fiona" }
        ]
      },
      { bg: "frost_field", sfx: "roar", fx: "shake", speaker: "mint", text: "……待って。吹雪の風上から、冷たい獣の遠吠えがいくつも近づいてる……！" }
    ]
  },
  {
    id: "ch3_ep2", chapter: "第二話", title: "吹雪に潜む銀狼の群れ", subtitle: "雪原前哨道・氷狼ブリザードハウンド迎撃",
    reqClear: "ch3_ep1", battleEnemyId: "blizzard_hound", reward: { gems: 280, credits: 14500, books: 28, cores: 6 },
    scenes: [
      { bg: "frost_field", bgm: "tension", sfx: "roar", fx: "flash", speaker: "narrator", text: "真っ白な雪煙の中から、透き通る氷の毛並みを持つ狼型霧獣『氷狼・ブリザードハウンド』が飛び出した。" },
      { bg: "frost_field", speaker: "rikka", text: "雪原の原生霧獣です！こいつらは『氷結の尾房』を振り回して周囲を凍てつかせてきます！" },
      { bg: "frost_field", speaker: "lunaria", text: "氷の狼ですって！？あたしの炎で一気に『融解』させて焼き払うには最高の的じゃない！" },
      { bg: "frost_field", speaker: "leila", text: "侮らないでください。この極寒地帯の霧獣は、峡谷の個体よりさらに強靭です。防御を怠れば一瞬で凍傷に陥りますよ。" },
      { bg: "danger", sfx: "roar", fx: "redflash", speaker: "protagonist", text: "雪原初戦！氷狼ブリザードハウンドを迎え撃つ！" }
    ]
  },
  {
    id: "ch3_ep3", chapter: "第三話", title: "白銀の前哨基地と凍てつく記録", subtitle: "フロスト前哨到着・研究棟の異変報告",
    reqClear: "ch3_ep2", battleEnemyId: null, reward: { gems: 260, credits: 13500, books: 28, cores: 5 },
    scenes: [
      { bg: "frost_lab", bgm: "story", speaker: "narrator", text: "氷狼を撃退し、岩壁をくり抜いた前哨基地へ辿り着いた小隊。暖房機の暖かい風が凍えた体を溶かしていく。" },
      { bg: "frost_lab", speaker: "kaede", text: "よしよし、あったかいクリームシチューができたよ！雪原仕様でたっぷりバターと香草入り！" },
      { bg: "frost_lab", speaker: "belle", text: "はぁ〜、生き返りますわ……。それでリッカさん、中央研究棟の方では一体何が起きているんですの？" },
      { bg: "frost_lab", speaker: "rikka", text: "はい。一ヶ月ほど前から、百年間完全に停止していたはずの『中央冷却研究棟』の照明が点滅し始めたのです。" },
      { bg: "frost_lab", speaker: "leila", text: "しかも、研究棟の周辺を警備しているのは霧獣だけではありません。百年前の古代防衛ドローンが『ミアズマ結晶』と融合した異形の機械霧獣が徘徊しています。" },
      { bg: "frost_lab", sfx: "comm", speaker: "chloe", text: "通信入ります！方舟の機密アーカイブから古い職員名簿を照合しました。中央研究棟の元所長——『ドクター・ノクス』という人物の個人コードが、今も稼働中です！" },
      { bg: "frost_lab", speaker: "valeria", text: "百年前の研究者が、今も生きているというのですか……！？いえ、まさか意識データや自律AIとして残っている可能性が？" },
      {
        bg: "frost_lab", speaker: "mikoto", text: "いずれにせよ、融光種を操っていた黒幕の正体が、この研究棟の奥に潜んでいることは間違いありませんわね。隊長殿、潜入作戦はいかがいたしましょう。",
        choices: [
          { label: "「正面は固い。レイラの狙撃援護のもと、保守搬入口から潜入しよう」", replySpeaker: "leila", reply: "的確な判断です。搬入口の防衛網は私が事前に無力化しておきます。", bondChar: "leila" },
          { label: "「ミコトとベルの観測力で冷気源を特定し、一気に中枢を突く」", replySpeaker: "mikoto", reply: "承知いたしました。同じ氷を扱う者として、奴の冷気は私が読み解きましょう。", bondChar: "mikoto" }
        ]
      },
      { bg: "frost_lab", speaker: "fiona", text: "潜入の前に、みんなの装備と治療薬の確認をしっかり済ませておきましょうね。" }
    ]
  },
  {
    id: "ch3_ep4", chapter: "第四話", title: "凍りついた搬入口", subtitle: "中央研究棟外周・機巧蜘蛛アラクネ遭遇",
    reqClear: "ch3_ep3", battleEnemyId: "frost_spider", reward: { gems: 300, credits: 16500, books: 32, cores: 6 },
    scenes: [
      { bg: "frost_lab", bgm: "tension", speaker: "narrator", text: "研究棟の裏手、氷漬けになった搬入ゲートをコハルがこじ開けた瞬間、天井の暗がりから八本の金属脚が音もなく降りてきた。" },
      { bg: "frost_lab", sfx: "alarm", fx: "redflash", speaker: "koharu", text: "うわぁっ！？古代の警備ロボと氷の結晶が合体してる！！『氷晶の機巧蜘蛛・アラクネ』だ！" },
      { bg: "frost_lab", speaker: "leila", text: "口元の『冷凍噴射口』に超高圧の液体窒素を溜めています。あそこを部位破壊すれば、広範囲の凍結攻撃を止められるはずです。" },
      { bg: "frost_lab", speaker: "rikka", text: "前衛は私の氷槍で食い止めます！隊長、属性連携の指揮を！" },
      { bg: "danger", sfx: "roar", fx: "shake", speaker: "protagonist", text: "研究棟の防衛網を突破する！機巧蜘蛛アラクネ、撃破開始！" }
    ]
  },
  {
    id: "ch3_ep5", chapter: "第五話", title: "白銀の回廊、声なき監視者", subtitle: "研究棟内部潜入・ドクター・ノクスとの交信",
    reqClear: "ch3_ep4", battleEnemyId: null, reward: { gems: 260, credits: 15000, books: 30, cores: 6 },
    scenes: [
      { bg: "frost_lab", bgm: "tension", speaker: "narrator", text: "搬入ホールを抜け、青白い非常灯だけが灯る研究棟の回廊を進む小隊。突如、壁面のモニターすべてが一斉に点灯した。" },
      { bg: "frost_lab", sfx: "comm", fx: "flash", speaker: "narrator", text: "『……ようこそ、フロスト・ヘイヴンへ。私の可愛い実験体であるオーバーワイバーンを屠った第7小隊の諸君』" },
      { bg: "frost_lab", speaker: "lunaria", text: "出たわね、峡谷で割り込んできた不気味な声！あんたが『ドクター・ノクス』なのね！？" },
      { bg: "frost_lab", speaker: "narrator", text: "『いかにも。肉体は七十年前に朽ちたが、私の知性と使命は、このアーク中枢ネットワークの中で永遠に生き続けている』" },
      { bg: "frost_lab", speaker: "aoi", text: "使命ですって！？融光種を暴走させて地上を滅茶苦茶にして、何が使命なんですか！！" },
      { bg: "frost_lab", speaker: "narrator", text: "『愚かな質問だな。方舟都市リベルタの炉はもう保たない。脆弱なままの人類が地上に降りても、再びミアズマに滅ぼされるだけだ』" },
      { bg: "frost_lab", speaker: "narrator", text: "『だからこそ私は、アーク結晶の過飽和進化——“融光化”を極限まで高め、新たな生命の器を完成させているのだ。君たちの戦術データも、実に良い肥やしになる』" },
      { bg: "frost_lab", speaker: "valeria", text: "狂っていますわ……！そのためだけに、兄たち第2小隊を実験台にして命を奪ったというのですか！！" },
      { bg: "frost_lab", speaker: "narrator", text: "『感謝してくれたまえ、騎士殿。君たちの犠牲の先にこそ、完全なる新世界が待っている。……さあ、まずは極寒の試練を乗り越えてみたまえ』" },
      { bg: "frost_lab", sfx: "alarm", fx: "redflash", speaker: "chloe", text: "通信が切れました！しかも隔壁がロックされ、研究棟内の温度が急激に下がっています！このままじゃ閉じ込められます！" }
    ]
  },
  {
    id: "ch3_ep6", chapter: "第六話", title: "氷点下四十度の脱出劇", subtitle: "冷凍試験区画・氷狼群の襲撃",
    reqClear: "ch3_ep5", battleEnemyId: "blizzard_hound", reward: { gems: 280, credits: 16500, books: 32, cores: 6 },
    scenes: [
      { bg: "frost_field", bgm: "tension", speaker: "narrator", text: "非常ハッチから隣接する屋外冷凍試験区画へ飛び出した小隊。視界を奪う猛吹雪の中、制御を解かれた氷狼の群れが襲いかかってきた。" },
      { bg: "frost_field", speaker: "fiona", text: "気温が急低下しています！長期戦になると体力が奪われます、炎と雷の火力で一気に突破しましょう！" },
      { bg: "frost_field", speaker: "momo", text: "任せてフィオナさん！あたしの炎でみんなを温めながら突っ切るよっ！" },
      { bg: "danger", sfx: "roar", fx: "redflash", speaker: "protagonist", text: "冷凍試験区画を突破する！全員、全力で前へ！" }
    ]
  },
  {
    id: "ch3_ep7", chapter: "第七話", title: "極北の狙撃手と白狐の静寂", subtitle: "観測ドームでの休息・レイラとミコトの対話",
    reqClear: "ch3_ep6", battleEnemyId: null, reward: { gems: 260, credits: 16000, books: 32, cores: 6 },
    scenes: [
      { bg: "camp_night", bgm: "story", speaker: "narrator", text: "冷凍区画を抜け、小さな気象観測ドームへ避難した夜。窓の外ではオーロラのような蒼い光が揺らめいていた。" },
      { bg: "camp_night", speaker: "leila", text: "……ミコトさん。あなたも氷を操る使い手ですね。この雪原の異常な冷気、あなたにはどう感じられますか？" },
      { bg: "camp_night", speaker: "mikoto", text: "ええ……悲鳴のように聞こえますわ。本来、氷は万物を静かに守るもの。ですがノクスの暴走冷却炉は、大地ごと命を凍殺しようとしています。" },
      { bg: "camp_night", speaker: "leila", text: "……私はずっと一人で雪原を守ってきました。誰も助けに来ない場所で、ただ引き金を引き続けて。……けれど、第7小隊の戦いは温かいですね。" },
      { bg: "camp_night", speaker: "mikoto", text: "ふふ。それはきっと、隊長殿が誰も置いていかないと決めているからですよ。" },
      {
        bg: "camp_night", speaker: "leila", text: "隊長。研究棟の地下冷却炉を止めれば、ノクスのサーバー電源も落ちるはずです。明日は私の狙撃を、あなたの作戦の軸に組み込んでください。",
        choices: [
          { label: "「頼もしい言葉だ。レイラの精密狙撃で必ず活路を開こう」", replySpeaker: "leila", reply: "……ええ。極北の狙撃手として、一発の狂いもなく撃ち抜きます。", bondChar: "leila" },
          { label: "「もう一人じゃない。第7小隊みんなでこの雪原を解放しよう」", replySpeaker: "mikoto", reply: "はい。白狐の氷華も、すべて隊長殿の指揮に委ねますわ。", bondChar: "mikoto" }
        ]
      },
      { bg: "camp_night", speaker: "belle", text: "星々の巡りが告げています……明日、巨大な氷の王が目覚める予兆がありますわ。どうか、万全の準備を。" }
    ]
  },
  {
    id: "ch3_ep8", chapter: "第八話", title: "地下冷却炉の防衛網", subtitle: "冷却区画突入・機巧蜘蛛アラクネ迎撃戦",
    reqClear: "ch3_ep7", battleEnemyId: "frost_spider", reward: { gems: 320, credits: 18500, books: 35, cores: 7 },
    scenes: [
      { bg: "frost_lab", bgm: "tension", speaker: "narrator", text: "翌朝、地下冷却炉へ続く巨大なエレベーターシャフトを下りた小隊。その最下層で、複数の機巧蜘蛛がレーザー照準を向けていた。" },
      { bg: "frost_lab", sfx: "alarm", fx: "redflash", speaker: "chloe", text: "ノクスが防衛プログラムを最高警戒レベルに引き上げました！並の装甲じゃありません！" },
      { bg: "frost_lab", speaker: "celestia", text: "レイラ、右翼は任せてください。左の照準は私が潰します。" },
      { bg: "frost_lab", speaker: "leila", text: "了解しました、セレスティア先輩。……二人の狙撃手の力、お見せしましょう。" },
      { bg: "danger", sfx: "boom", fx: "shake", speaker: "protagonist", text: "地下冷却炉の防衛網を粉砕する！戦闘開始！" }
    ]
  },
  {
    id: "ch3_ep9", chapter: "第九話", title: "方舟都市の暗い秘密", subtitle: "中枢データ閲覧・リベルタ上層部の関与",
    reqClear: "ch3_ep8", battleEnemyId: null, reward: { gems: 280, credits: 18000, books: 34, cores: 7 },
    scenes: [
      { bg: "frost_lab", bgm: "tension", speaker: "narrator", text: "防衛網を突破し、冷却炉の制御コンソールへ辿り着いたクロエが、端末を繋いだまま息を呑んだ。" },
      { bg: "frost_lab", sfx: "comm", speaker: "chloe", text: "……嘘。隊長、見てください……ノクスのサーバーへ毎月、暗号化された資材輸送ログが送られています。送信元は……方舟都市リベルタの中央議会です！" },
      { bg: "frost_lab", speaker: "valeria", text: "なんですって！？方舟の中枢に、ノクスの非道な融光化計画に協力している者がいるというのですか！？" },
      { bg: "frost_lab", speaker: "aoi", text: "そんな……私たちは方舟のみんなを救うために地上で戦っているのに……！" },
      { bg: "frost_lab", speaker: "chloe", text: "おそらく議会の一部勢力が、炉の延命のためにノクスと裏取引をしていたんです。けれど、そのせいで地上の主霧獣が次々と融光化して暴走を始めてしまった……！" },
      { bg: "frost_lab", sfx: "boom", fx: "shake", speaker: "narrator", text: "ドォォォン……ッ！！ 制御室の分厚い強化ガラスの向こうで、凍結炉そのものを砕く凄まじい地響きが轟いた。" },
      { bg: "frost_lab", speaker: "rikka", text: "冷却炉の隔壁が内側から破られました！！炉心を丸ごと背中に融合させた超巨大なマンモス型霧獣が、外へ飛び出していきます！！" },
      { bg: "frost_lab", speaker: "narrator", text: "『ハハハハハ！ 素晴らしい！ この凍土の主霧獣『グレイシャル・マンモス』の覚醒だ！ 制御データごと氷の墓標へ沈むがいい！』" }
    ]
  },
  {
    id: "ch3_ep10", chapter: "第十話", title: "氷河の門番、絶対零度の序曲", subtitle: "研究棟脱出・冷却炉外周防衛戦",
    reqClear: "ch3_ep9", battleEnemyId: "frost_spider", reward: { gems: 380, credits: 22000, books: 40, cores: 9 },
    scenes: [
      { bg: "frost_lab", bgm: "tension", sfx: "alarm", fx: "redflash", speaker: "narrator", text: "主霧獣の覚醒と同時に暴走を始めた冷却炉の非常ゲート。脱出路を塞ぐ最強クラスの機巧蜘蛛部隊を突破しなければ、雪原へ出ることもできない。" },
      { bg: "frost_lab", speaker: "koharu", text: "非常シャッターが閉まるまであとわずかだよ！全力で押し通るしかない！" },
      { bg: "frost_lab", speaker: "lunaria", text: "上等よ！あたしたちを閉じ込めようなんて百年早いのよ！" },
      { bg: "danger", sfx: "roar", fx: "redflash", speaker: "protagonist", text: "非常ゲートをこじ開けろ！総力突破戦、開始！" }
    ],
    epilogue: [
      { bg: "frost_field", bgm: "tension", sfx: "roar", fx: "shake", speaker: "narrator", text: "崩れ落ちる研究棟から雪原へ飛び出した第7小隊の眼前で、山脈と見紛う巨影が猛吹雪を巻き上げて咆哮した。" },
      { bg: "frost_field", speaker: "leila", text: "……確認しました。背中に暴走冷却炉を背負う白銀の巨獣——主霧獣『グレイシャル・マンモス』。" },
      { bg: "frost_field", speaker: "mikoto", text: "これより先は、絶対零度との死闘になりますわ。隊長殿、さらなる鍛錬を積んで挑みましょう。" }
    ]
  }
];
