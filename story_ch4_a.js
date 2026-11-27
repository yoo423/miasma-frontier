window.MF_STORY_CH4_A = [
  {
    id: "ch4_ep1", chapter: "第一話", title: "赤熱のカルデラへ", subtitle: "第四開拓領域・イグニス・カルデラ降下",
    reqClear: "ch3_ep20", battleEnemyId: null, reward: { gems: 300, credits: 20000, books: 38, cores: 8 },
    scenes: [
      { bg: "caldera", bgm: "story", speaker: "narrator", text: "極寒の白銀世界から一転。南方の火山帯に築かれた旧文明の巨大精錬地帯——『イグニス・カルデラ』は、今もなお赤熱の溶岩が脈打つ灼熱の大地だった。" },
      { bg: "caldera", speaker: "momo", text: "あ、あつーいっ！！さっきまで凍えそうだったのに、今度はこんがり焼けちゃいそうだよ隊長！" },
      { bg: "caldera", speaker: "sakura", text: "ふふ、モモちゃん大丈夫？耐熱性のアーク薬草を煎じた冷茶を持ってきたから、こまめに飲んでね。" },
      { bg: "caldera", speaker: "haruto", text: "おっ、第7小隊ご一行のお出ましだな！待ってたぜ隊長。オレはフィールド整備士のハルトだ。ここの溶鉱炉跡、まだとんでもねぇ熱量を吐き出してるぞ。" },
      { bg: "caldera", speaker: "ran", text: "方舟都市警備隊のランです。ノクスの意識データがこちらへ転送されたとの報を受け、先遣防衛のため合流いたしました。" },
      { bg: "caldera", speaker: "valeria", text: "ラン殿まで駆けつけてくださったのですか。方舟の警備隊長が前線に立つとは、心強い限りですわ。" },
      { bg: "caldera", speaker: "aoi", text: "周囲の耐熱計が警戒ラインに近づいています。クロエさん、ノクスのデータ反応はどのあたりですか？" },
      { bg: "caldera", bgm: "tension", sfx: "comm", speaker: "chloe", text: "カルデラの最奥にある『旧第一溶鉱炉・中央炉心』から強力な同期信号が出ています。……それと、途中の廃坑道で妙な人影が動いているみたいです。" },
      { bg: "caldera", speaker: "crow", text: "フッ……妙な人影とは心外だな、研究員殿。闇に眠る古代の秘宝を嗅ぎつけて先回りしていただけさ。" },
      { bg: "caldera", speaker: "yuzu", text: "ふわぁ……クロウくん、また格好つけてる……。あたしはユズ。溶岩地帯だけど、地下に温泉みたいな地下水脈があって涼しい場所を見つけたよぉ。" },
      {
        bg: "caldera", speaker: "ran", text: "個性豊かな面々が揃いましたね。隊長、まずはカルデラ外周のどこから調査を進めましょうか？",
        choices: [
          { label: "「ハルトとランの案内で、溶鉱炉の冷却水路を先に確保しよう」", replySpeaker: "haruto", reply: "ナイス判断だ隊長！水路さえ動かせば、このクソ暑い前線も一気に戦いやすくなるぜ！" },
          { label: "「クロウが見つけた廃坑道の近道を使い、ノクスに先手を打つ」", replySpeaker: "crow", reply: "ほう、俺の眼力を買うとは見どころがあるな隊長。さあ、俺の漆黒のマントに遅れずについて来い！" }
        ]
      },
      { bg: "caldera", sfx: "boom", fx: "shake", speaker: "narrator", text: "ゴゴゴゴ……ッ！ 溶岩の河から、赤く焼けた巨岩のような腕がゆっくりと這い上がってきた。" }
    ]
  },
  {
    id: "ch4_ep2", chapter: "第二話", title: "溶鉱炉の巨兵", subtitle: "第一搬入路・溶鉱炉ゴーレム迎撃",
    reqClear: "ch4_ep1", battleEnemyId: "lava_golem", reward: { gems: 320, credits: 24000, books: 42, cores: 9 },
    scenes: [
      { bg: "caldera", bgm: "tension", sfx: "roar", fx: "shake", speaker: "narrator", text: "溶けた鉄塊と古代の炉壁がミアズマ結晶で組み上がった巨兵——『溶鉱炉の巨兵・ゴーレム』が道を塞いだ。" },
      { bg: "caldera", speaker: "haruto", text: "おいおい、旧文明の精錬炉ごと霧獣化しやがったか！胸の『灼熱炉心』をぶっ壊さないと、何度でも装甲を再生しやがるぞ！" },
      { bg: "caldera", speaker: "yuzu", text: "炎の塊なら、あたしの水圧ハンマーでじゅわーっと『蒸発 2.0倍』にして冷やしちゃえばいいよねぇ♪" },
      { bg: "caldera", speaker: "ran", text: "一撃が極めて重い相手です。私の槍と防御札でしっかり受け止め、隙を突いて炉心を砕きましょう！" },
      { bg: "danger", sfx: "boom", fx: "redflash", speaker: "protagonist", text: "灼熱地帯の初戦！溶鉱炉の巨兵・ゴーレムを迎え撃つ！" }
    ]
  },
  {
    id: "ch4_ep3", chapter: "第三話", title: "地下温泉と耐熱キャンプ設営", subtitle: "ユズの隠れ水脈・灼熱拠点の構築",
    reqClear: "ch4_ep2", battleEnemyId: null, reward: { gems: 280, credits: 22000, books: 40, cores: 8 },
    scenes: [
      { bg: "camp_dusk", bgm: "home", speaker: "narrator", text: "ゴーレムを退けた小隊は、ユズが見つけた地下水脈の洞窟へ前線キャンプを設営した。岩間から湧く清冽な水が、灼熱の空気を心地よく冷ましている。" },
      { bg: "camp_dusk", speaker: "yuzu", text: "ほらね、ここなら涼しくて最高でしょぉ？あ、しかもこの水脈、珍しいアーク結晶魚が泳いでるんだよ。あとで釣り糸垂らそっと。" },
      { bg: "camp_dusk", speaker: "kaede", text: "おっ、新鮮なお魚が釣れるなら今夜はカルデラ特製・冷やし魚介スープにしようかな！" },
      { bg: "camp_dusk", speaker: "sakura", text: "この洞窟の壁に生えている赤花、すごい耐熱効能を持ってるんです。みんなの装備に塗り込む耐熱軟膏を作っておきますね。" },
      { bg: "camp_dusk", speaker: "haruto", text: "サンキューなサクラ！よし、オレとコハルで地下水脈から溶鉱炉へ通じる旧冷却ポンプを直しちまおうぜ。" },
      { bg: "camp_dusk", speaker: "koharu", text: "わーい、ハルトと共同作業だ！二人で組めば一晩で動くようになるよ！" },
      { bg: "camp_dusk", bgm: "tension", speaker: "ran", text: "……ですが隊長、一つだけ気掛かりな報告があります。私が方舟都市を発つ直前、中央議会が『第7小隊の行動凍結』を密かに議論していたのです。" },
      { bg: "camp_dusk", speaker: "aoi", text: "行動凍結……！？私たちが真実に近づきすぎたから、議会の中にいるノクスの協力者が動き出したんでしょうか……！" },
      {
        bg: "camp_dusk", speaker: "ran", text: "私は警備隊長として、権力ではなく『方舟の市民の命』を守る道を選びました。隊長、あなたが真実を暴く限り、私は最後までお味方します。",
        choices: [
          { label: "「ありがとうラン。方舟の誰が敵でも、俺たちは市民を守る」", replySpeaker: "ran", reply: "その言葉が聞けて安心しました。背中は私が守り抜きます。" },
          { label: "「まずはノクスの意識データを完全に叩き潰して証拠を掴もう」", replySpeaker: "valeria", reply: "ええ、動かぬ証拠さえ持ち帰れば、議会の裏切り者も言い逃れはできませんわ。", bondChar: "valeria" }
        ]
      },
      { bg: "camp_dusk", speaker: "crow", text: "フッ、熱い展開になってきたな。……おい、廃坑道の奥から鉄を叩くような重い足音が近づいてくるぜ。" }
    ]
  },
  {
    id: "ch4_ep4", chapter: "第四話", title: "廃坑道の宝物庫と鉄の番人", subtitle: "旧精錬坑道・ゴーレム強襲戦",
    reqClear: "ch4_ep3", battleEnemyId: "lava_golem", reward: { gems: 320, credits: 25000, books: 44, cores: 9 },
    scenes: [
      { bg: "caldera", bgm: "tension", speaker: "narrator", text: "クロウの案内で踏み込んだ旧精錬坑道。壁面には最高純度のアーク精錬鉄が眠っていたが、同時に巨大な溶岩ゴーレムが起動した。" },
      { bg: "caldera", speaker: "crow", text: "チッ、古代のセキュリティが反応したか！だがこいつを倒せば、旧文明の精錬データごと手に入るぞ！" },
      { bg: "caldera", speaker: "sakura", text: "私がみんなの体力をしっかり支えます！無理せず着実に炉心を狙いましょう！" },
      { bg: "danger", sfx: "boom", fx: "redflash", speaker: "protagonist", text: "坑道の番人を打ち砕け！溶鉱炉ゴーレム、迎撃開始！" }
    ]
  },
  {
    id: "ch4_ep5", chapter: "第五話", title: "溶岩の海に響くノクスの嘲笑", subtitle: "旧精錬制御室・計画『ゼロ』の断片",
    reqClear: "ch4_ep4", battleEnemyId: null, reward: { gems: 300, credits: 24000, books: 44, cores: 9 },
    scenes: [
      { bg: "powerplant", bgm: "tension", speaker: "narrator", text: "坑道の最奥にある精錬制御室。クロエが端末を接続した瞬間、モニターに燃え盛る炎のノイズとともにノクスの声が響いた。" },
      { bg: "powerplant", sfx: "comm", fx: "flash", speaker: "narrator", text: "『……懲りない連中だ、第7小隊。雪原の冷却炉を止めた程度で、私の歩みを止められると本気で思っていたのか？』" },
      { bg: "powerplant", speaker: "chloe", text: "ノクス！！あなた、方舟の中央議会の一部と裏取引して、地上の主霧獣を兵器みたいに融光化させているんでしょう！" },
      { bg: "powerplant", speaker: "narrator", text: "『兵器？ 矮小な見方をするな。彼ら議会の老いぼれどもは、方舟の寿命を数年延ばすだけの“高純度結晶”が欲しいだけだ』" },
      { bg: "powerplant", speaker: "narrator", text: "『だが私の目的は違う。六大領域すべての融光エネルギーを天蓋の塔“アーク・スパイア”へ集約し、原初の災厄『ゼロ』を完全覚醒させることだ！』" },
      { bg: "powerplant", sfx: "boom", fx: "shake", speaker: "mikoto", text: "原初の災厄『ゼロ』……百年前、人類を地上から追い出した全ての元凶を呼び覚ますつもりなのですか！？" },
      { bg: "powerplant", speaker: "narrator", text: "『そうだ！ すでにこのカルデラの溶鉱炉は臨界に達している。議会の裏切り者どもも、君たちも、等しく紅蓮の炎で精錬されるがいい！』" },
      { bg: "powerplant", speaker: "lunaria", text: "ふざけんじゃないわよ！！あんたの狂った実験のために、どれだけの人が苦しんできたと思ってるの！" },
      { bg: "powerplant", speaker: "haruto", text: "くそっ、制御室から溶鉱炉への主バルブが遠隔ロックされちまった！直接、第二精錬塔へ乗り込んで手動で叩き折るしかねぇ！" }
    ]
  },
  {
    id: "ch4_ep6", chapter: "第六話", title: "第二精錬塔の焦熱行軍", subtitle: "溶岩架橋突破・精鋭防衛戦",
    reqClear: "ch4_ep5", battleEnemyId: "lava_golem", reward: { gems: 340, credits: 27000, books: 46, cores: 10 },
    scenes: [
      { bg: "caldera", bgm: "tension", speaker: "narrator", text: "煮えたぎる溶岩湖の上を跨ぐ巨大な鉄骨の架橋。その中央で、赤熱の蒸気を吹き上げる強化ゴーレムが立ち塞がる。" },
      { bg: "caldera", speaker: "ran", text: "足場が狭い橋の上です！敵の重撃で吹き飛ばされないよう、結晶バリアを厚く保ってください！" },
      { bg: "caldera", speaker: "yuzu", text: "あたしとヴァレリアさんの水属性で一気に冷やし固めちゃおっか！" },
      { bg: "danger", sfx: "roar", fx: "redflash", speaker: "protagonist", text: "溶岩架橋を突破する！総員、前へ！" }
    ]
  },
  {
    id: "ch4_ep7", chapter: "第七話", title: "整備士のプライドと薬草の優しさ", subtitle: "第二精錬塔・小休止とハルト・サクラの対話",
    reqClear: "ch4_ep6", battleEnemyId: null, reward: { gems: 300, credits: 25000, books: 45, cores: 9 },
    scenes: [
      { bg: "camp_night", bgm: "story", speaker: "narrator", text: "第二精錬塔の遮熱室で息を整える小隊。ハルトが熱で歪んだ防具の関節を器用に叩き直し、サクラが隊員たちの火傷を手当てしている。" },
      { bg: "camp_night", speaker: "haruto", text: "よしっ、これで駆動フレームの歪みはバッチリだ！……なあ隊長、正直ここまでの敵、めちゃくちゃ手強くなってきたよな。" },
      { bg: "camp_night", speaker: "sakura", text: "でも、不思議と怖くはないんです。私みたいに前線に不慣れな研究員でも、みんなと一緒なら役に立てるって思えるから。" },
      { bg: "camp_night", speaker: "haruto", text: "ああ、全くだ！オレも機械いじりしか能がねぇと思ってたけど、第7小隊の装備を完璧に仕上げるって仕事に誇りを持ててるぜ。" },
      {
        bg: "camp_night", speaker: "sakura", text: "隊長も少しお疲れじゃないですか？特製のリラックス薬草茶を淹れたので、次の作戦の前にひと息ついてくださいね。",
        choices: [
          { label: "「ありがとうサクラ。お前の薬草と優しさが小隊の命綱だ」", replySpeaker: "sakura", reply: "えへへ、そんな風に言ってもらえると照れちゃいます……でもすごく嬉しいです！" },
          { label: "「ハルトも整備助かる。最高の装備で溶鉱炉の主を倒そう」", replySpeaker: "haruto", reply: "任せな隊長！絶対に壊れない最高のコンディションに磨き上げとくぜ！" }
        ]
      },
      { bg: "caldera", bgm: "tension", sfx: "roar", fx: "shake", speaker: "crow", text: "……のんびりお茶してる時間は終わりだぜ。第二精錬塔の炉底から、とんでもなくデカいトカゲが這い上がってくる！" }
    ]
  },
  {
    id: "ch4_ep8", chapter: "第八話", title: "溶鉱炉の守護巨兵、最終防衛", subtitle: "精錬塔主バルブ前・ゴーレム決戦",
    reqClear: "ch4_ep7", battleEnemyId: "lava_golem", reward: { gems: 360, credits: 29000, books: 48, cores: 10 },
    scenes: [
      { bg: "caldera", bgm: "tension", speaker: "narrator", text: "手動遮断バルブの目の前。炉心の熱を直接吸収して赤白く輝く大型ゴーレムが、最後の壁として立ち塞がった。" },
      { bg: "caldera", speaker: "haruto", text: "あれさえどかせば、第二精錬塔のバルブを閉じられる！一気に行くぜ隊長！" },
      { bg: "caldera", speaker: "crow", text: "俺が死角から切り込む！隊長、元素コンボの号令を！" },
      { bg: "danger", sfx: "boom", fx: "redflash", speaker: "protagonist", text: "バルブを解放せよ！大型ゴーレムを撃破する！" }
    ]
  },
  {
    id: "ch4_ep9", chapter: "第九話", title: "紅蓮の溶岩顎、目覚める主霧獣", subtitle: "中央カルデラ火口・マグマ・サラマンダー出現",
    reqClear: "ch4_ep8", battleEnemyId: null, reward: { gems: 320, credits: 28000, books: 48, cores: 10 },
    scenes: [
      { bg: "caldera", bgm: "tension", sfx: "boom", fx: "shake", speaker: "narrator", text: "第二精錬塔のバルブを閉じた瞬間、行き場を失った地下の溶岩圧が中央火口から噴き上がった。紅蓮の飛沫の中から現れたのは、巨大な炎の巨竜トカゲだった。" },
      { bg: "caldera", sfx: "roar", fx: "redflash", speaker: "aoi", text: "超高熱生体反応を確認！！第4エリアの主霧獣『マグマ・サラマンダー』です！！" },
      { bg: "caldera", speaker: "chloe", text: "体表温度八百度超！弱点部位は『灼熱の溶岩顎』と『業火の尾先』です！水属性の『蒸発』や氷属性の『融解』で一気に冷却ダメージを狙いましょう！" },
      { bg: "caldera", speaker: "valeria", text: "私とユズ殿、そしてミコト殿・レイラ殿の水氷連携の見せ場ですわね！" },
      { bg: "caldera", speaker: "yuzu", text: "ふふっ、大物を一本釣りする気分でドカンと冷やしちゃおうかぁ！" },
      { bg: "caldera", speaker: "protagonist", text: "第4章前編の関門を越えるぞ！全員、火口外縁へ展開！" }
    ]
  },
  {
    id: "ch4_ep10", chapter: "第十話", title: "焦熱火口の前哨戦", subtitle: "前編クライマックス・溶岩防衛線突破",
    reqClear: "ch4_ep9", battleEnemyId: "lava_golem", reward: { gems: 420, credits: 33000, books: 55, cores: 12 },
    scenes: [
      { bg: "caldera", bgm: "tension", sfx: "roar", fx: "shake", speaker: "narrator", text: "マグマ・サラマンダーの咆哮に呼応し、火口縁の溶岩塊が一斉にゴーレムとなって小隊へ襲いかかる。" },
      { bg: "caldera", speaker: "ran", text: "ここを押し切らねば火口の中心へ近づけません！全員、盾と刃を揃えよ！" },
      { bg: "danger", sfx: "boom", fx: "redflash", speaker: "protagonist", text: "火口防衛線を突破し、主霧獣の懐へ飛び込む！" }
    ],
    epilogue: [
      { bg: "caldera", bgm: "tension", sfx: "roar", fx: "flash", speaker: "narrator", text: "火口の外縁を制圧した第7小隊の眼前で、マグマ・サラマンダーが巨大な溶岩顎を大きく開いて威嚇した。" },
      { bg: "caldera", speaker: "lunaria", text: "……すごい熱気ね。でも、あたしの炎とどっちが熱いか勝負してやろうじゃない！" },
      { bg: "caldera", speaker: "aoi", text: "これより先は第4章・後編、灼熱の主霧獣および黄金の炎帝竜との決戦です！隊員の育成とデッキを整えて挑みましょう！" }
    ]
  }
];
