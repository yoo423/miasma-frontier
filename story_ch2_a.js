window.MF_STORY_CH2_A = [
  {
    id: "ch2_ep1", chapter: "第一話", title: "雷雲の連絡橋", subtitle: "ヴェルデ北門・シルフィ＆メリッサとの合流",
    reqClear: "ch1_ep20", battleEnemyId: null, reward: { gems: 220, credits: 6500, books: 16, cores: 3 },
    scenes: [
      { bg: "verde_morning", bgm: "story", speaker: "narrator", text: "モス・ベヒーモスを討伐し、百年ぶりの青空を取り戻したヴェルデ平原。その北端にかかる巨大な吊り橋の先には、厚く黒い雷雲が渦巻いていた。" },
      { bg: "canyon_storm", sfx: "boom", fx: "flash", speaker: "narrator", text: "閃光が峡谷の岩肌を照らし、数秒遅れて腹の底へ響く雷鳴が轟く。そこが第二開拓領域——『ヴォルト・キャニオン』だった。" },
      { bg: "canyon_storm", speaker: "sylphy", text: "おう、やっと来やがったな第7小隊！ヴェルデの主をブッ倒したって噂の英雄さんのお出ましだ。" },
      { bg: "canyon_storm", speaker: "koharu", text: "おつかれさま隊長！ここから先が雷鳴の峡谷だよ。ほら、地面に刺さってる巨大な結晶、全部天然の避雷針みたいになってるの！" },
      { bg: "canyon_storm", speaker: "aoi", text: "すごい放電量です……端末の磁気コンパスが少し狂っています。防護スーツの絶縁出力を上げておきましょう。" },
      { bg: "canyon_storm", speaker: "melissa", text: "ヒヒッ、ようこそ雷の実験場へ！あたしは雷撃兵器の開発主任、メリッサよ。ここの自然放電は、方舟都市の炉を何十年も回せるくらいの宝庫なんだから！" },
      { bg: "canyon_storm", speaker: "momo", text: "わわっ、髪の毛が静電気でふわっふわになってきたよ！？ミントの長い耳までピーンって立ってる！" },
      { bg: "canyon_storm", speaker: "mint", text: "……モモ、触らないで。バチッてなる。それより、谷の奥からずっと焦げた金属の匂いが流れてきてる。" },
      { bg: "canyon_storm", bgm: "tension", sfx: "comm", speaker: "chloe", text: "こちら方舟司令部、クロエです。メリッサさん、浮かれてる場合じゃありません。峡谷中央のエネルギー計測値が、ヴェルデの時の三倍を突破しました。" },
      { bg: "canyon_storm", speaker: "sylphy", text: "チッ、やっぱりな。ここ数日、谷の霧獣どもが異常に苛立ってるんだ。まるで、誰かに電気を無理やり流し込まれて暴走してるみたいにな。" },
      {
        bg: "canyon_storm", speaker: "sylphy", text: "さて隊長、この雷地獄をどう切り開く？あんたの指揮方針を聞かせてくれよ。",
        choices: [
          { label: "「シルフィの先導で速攻を仕掛ける。敵に主導権を渡すな」", replySpeaker: "sylphy", reply: "へっ、気が合うじゃねぇか！俺の風と双剣で、一番に道を切り開いてやるよ！", bondChar: "sylphy" },
          { label: "「メリッサの解析を活かし、属性反応で確実に制圧しよう」", replySpeaker: "melissa", reply: "ヒヒッ、わかってるじゃない隊長！あたしの特製コイルの威力、たっぷり見せてあげる！" }
        ]
      },
      { bg: "canyon_storm", speaker: "celestia", text: "先行して崖上の見張り位置を確保します。……全員、頭上に注意。素早い気配が岩壁を駆け下りてきます。" }
    ]
  },
  {
    id: "ch2_ep2", chapter: "第二話", title: "紫電の谷、最初の落雷", subtitle: "峡谷道への踏査・帯電生態の脅威",
    reqClear: "ch2_ep1", battleEnemyId: null, reward: { gems: 220, credits: 7000, books: 16, cores: 3 },
    scenes: [
      { bg: "canyon_storm", bgm: "tension", speaker: "narrator", text: "切り立った赤褐色の渓谷道。足元には放電でガラス化した砂が軋み、空気は濃いオゾンの匂いに満ちている。" },
      { bg: "canyon_storm", sfx: "boom", fx: "flash", speaker: "momo", text: "うひゃあっ！？今、すぐ横の岩に雷が落ちたよ！？びっくりしたぁ！" },
      { bg: "canyon_storm", speaker: "melissa", text: "大丈夫、あたしが配った絶縁バッジがある限り直撃は避けられるわ。……ただし、生きた避雷針が飛びかかってきたら別だけどね！" },
      { bg: "canyon_storm", speaker: "valeria", text: "生きた避雷針……？この峡谷の霧獣は、落雷のエネルギーを体内に蓄えて戦うというのですか？" },
      { bg: "canyon_storm", speaker: "sylphy", text: "その通りだお嬢様。特に厄介なのが『紫電の疾走竜・ラプトル』だ。頭のトサカに電気を溜めて、音速みてぇな飛びかかりを連発してきやがる。" },
      { bg: "canyon_storm", speaker: "lunaria", text: "へぇ、面白そうじゃない！速いだけのトカゲなんて、あたしの大剣で正面から叩き斬ってやるわよ！" },
      { bg: "canyon_storm", speaker: "mikoto", text: "ルナリア殿、力押しは禁物ですわ。雷を纏う霧獣には、炎を重ねる『過負荷』や、氷を重ねる『超電導』の元素反応が極めて有効ですの。" },
      { bg: "canyon_storm", speaker: "aoi", text: "それに、ヴェルデ平原の霧獣とは桁違いの攻撃力のはずです。育成とデッキの防御札、しっかり整えて挑まないと危険ですね。" },
      { bg: "canyon_storm", sfx: "roar", fx: "shake", speaker: "mint", text: "……来るっ！左の岩棚の上から三体、トサカをバチバチ光らせてる！" },
      { bg: "canyon_storm", speaker: "celestia", text: "高所より捕捉しました。回避不能の距離です。隊長、迎撃の指示を。" }
    ]
  },
  {
    id: "ch2_ep3", chapter: "第三話", title: "疾走する紫電の牙", subtitle: "雷光の細道・スパーク・ラプトル迎撃戦",
    reqClear: "ch2_ep2", battleEnemyId: "spark_raptor", reward: { gems: 260, credits: 8500, books: 20, cores: 4 },
    scenes: [
      { bg: "canyon_storm", bgm: "tension", sfx: "roar", fx: "flash", speaker: "narrator", text: "青い電光を尾のように引きながら、細身の竜型霧獣が崖から飛び降りた。『紫電の疾走竜・ラプトル』——峡谷最速の狩人だ。" },
      { bg: "canyon_storm", speaker: "sylphy", text: "ちっ、目が血走ってやがる！こいつ、頭の『帯電トサカ』を部位破壊すれば電撃の出力を落とせるぞ！" },
      { bg: "canyon_storm", speaker: "melissa", text: "それと、体力を半分まで削ると一気に怒り覚醒して大技を撃ってくるはず！防御と回復は絶対にケチっちゃダメよ！" },
      {
        bg: "canyon_storm", speaker: "protagonist", text: "ラプトルが低く身を沈め、稲妻を纏って跳躍の構えを取った。峡谷初戦、戦術を示すぞ。",
        choices: [
          { label: "「帯電トサカを集中狙い！部位破壊で放電を封じ込めろ！」", replySpeaker: "mint", reply: "……了解。速いけど、トサカの光が最高の目印になるよ。", bondChar: "mint" },
          { label: "「炎と氷の元素反応を重ね、一気に体勢を崩し切る！」", replySpeaker: "lunaria", reply: "それよそれ！ド派手に吹き飛ばしてやるわ！", bondChar: "lunaria" }
        ]
      },
      { bg: "danger", sfx: "roar", fx: "redflash", speaker: "protagonist", text: "全員、戦術リンク展開！紫電の疾走竜・ラプトルを撃破する！" }
    ]
  },
  {
    id: "ch2_ep4", chapter: "第四話", title: "黒猫の斥候と旧発電所の影", subtitle: "ノア合流・百年前のアーク発電施設発見",
    reqClear: "ch2_ep3", battleEnemyId: null, reward: { gems: 220, credits: 8000, books: 18, cores: 3 },
    scenes: [
      { bg: "canyon_storm", bgm: "story", speaker: "narrator", text: "ラプトルを退け、峡谷の奥へ進んだ第7小隊。切り立った崖の裂け目から、ひょっこりと黒猫耳の少年が飛び出してきた。" },
      { bg: "canyon_storm", speaker: "noah", text: "ニャハッ！おそいよみんなー！ボクが先にすごいもの見つけちゃったよ！" },
      { bg: "canyon_storm", speaker: "momo", text: "わっ、ノアだ！いつの間に先行してたの！？" },
      { bg: "canyon_storm", speaker: "noah", text: "風の匂いを辿ってたらね、この崖の奥に巨大な鉄の扉を見つけたんだ。しかも見て、扉のロックが最近だれかに開けられた跡があるんだよ！" },
      { bg: "powerplant", bgm: "tension", speaker: "narrator", text: "ノアの案内で岩の裂け目を抜けた先に現れたのは、峡谷の壁面に埋め込まれた巨大な古代施設——『旧アーク発電所』だった。" },
      { bg: "powerplant", speaker: "koharu", text: "うわぁっ、すごい！！百年前の超高圧タービンが、まだ半分くらい唸りを上げて動いてるよ！？誰かが修理したみたい……！" },
      { bg: "powerplant", speaker: "melissa", text: "ちょっと待って。おかしいわよ、これ。発電した電力を方舟へ送るんじゃなくて……峡谷の『外』へ垂れ流す回路に組み替えられてる！" },
      { bg: "powerplant", speaker: "aoi", text: "外へ垂れ流す……！？そんなことをしたら、周囲の霧獣が過剰なアーク光を浴びて『融光化』してしまいます！" },
      { bg: "powerplant", speaker: "valeria", text: "……待ってくださいまし。あそこの制御盤の脇に、見覚えのある紋章の入った戦術端末が落ちていますわ。" },
      {
        bg: "powerplant", speaker: "protagonist", text: "埃をかぶった制御室の床に、割れた戦術端末が転がっている。中を確認するべきだ。",
        choices: [
          { label: "「クロエに繋いで中身を復元しよう。何が起きたか知る必要がある」", replySpeaker: "chloe", reply: "通信でデータを受信しました……すぐ復号します！少し待ってください！", bondChar: "chloe" },
          { label: "「ノア、よく見つけてくれた。周囲の警戒を頼む」", replySpeaker: "noah", reply: "へへっ、任せといて！変な気配がしたら一番に教えるからね！" }
        ]
      },
      { bg: "powerplant", sfx: "comm", speaker: "chloe", text: "……復号完了しました。これは、三年前に行方不明になった『第2クリアラー小隊』の最後の音声記録です……。" }
    ]
  },
  {
    id: "ch2_ep5", chapter: "第五話", title: "第2小隊の残響と黒幕の影", subtitle: "明かされる人為的『融光化』の真相",
    reqClear: "ch2_ep4", battleEnemyId: null, reward: { gems: 240, credits: 8500, books: 20, cores: 4 },
    scenes: [
      { bg: "powerplant", bgm: "story", speaker: "narrator", text: "薄暗い制御室に、激しい雷鳴とノイズが混じった三年前の音声ログが流れ始めた。" },
      { bg: "powerplant", bgm: "tension", sfx: "comm", speaker: "chloe", text: "『……こちら第2クリアラー小隊、副隊長。誰かこの記録を拾ったら、直ちに方舟司令部へ——いや、司令部の中にも信用できない者がいる』" },
      { bg: "powerplant", speaker: "valeria", text: "……っ！兄上の声ですわ……！！" },
      { bg: "powerplant", speaker: "chloe", text: "『峡谷の主霧獣が黄金に変異したのは偶然ではない。何者かがこの発電所を遠隔操作し、意図的に過飽和エネルギーを注いで“融光種”を育てている』" },
      { bg: "powerplant", sfx: "boom", fx: "shake", speaker: "chloe", text: "『くそっ、黄金の雷竜が降りてきた！セレスティア、君だけでも高台へ退避しろ！この記録を未来のクリアラーへ——』……記録はここで途絶えています。" },
      { bg: "powerplant", speaker: "narrator", text: "重い沈黙が制御室を包んだ。ヴァレリアが震える手で端末を握りしめ、セレスティアは静かに目を伏せた。" },
      { bg: "powerplant", speaker: "celestia", text: "……申し訳ありません、ヴァレリア。私はあの日、兄上の命令で高台へ下がり……最後まで狙撃を間に合わせることができませんでした。" },
      { bg: "powerplant", speaker: "valeria", text: "顔を上げてくださいまし、セレスティア。兄上はあなたを責めてなどいませんわ。こうして私たちが真相に辿り着けたのも、あなたが生き延びてくれたからですもの。" },
      { bg: "powerplant", speaker: "lunaria", text: "ムカついてきたわね……！人類が必死に地上を取り戻そうとしてる裏で、わざとバケモノを育ててる奴がいるなんて許せない！" },
      { bg: "powerplant", speaker: "mikoto", text: "まずはこの発電所の暴走送電を止めることが先決ですわね。さもなくば、峡谷の主霧獣が完全な融光種へと目覚めてしまいます。" },
      {
        bg: "powerplant", speaker: "valeria", text: "隊長。兄たちが命懸けで遺した手がかりです。この発電所の深層炉を止め、必ず黒幕の企みを挫きましょう。",
        choices: [
          { label: "「ああ、約束する。第2小隊の想いは俺たちが必ず受け継ぐ」", replySpeaker: "valeria", reply: "……感謝いたします、隊長。この銀槍、あなたのために振るいますわ。", bondChar: "valeria" },
          { label: "「セレスティアも顔を上げてくれ。今度こそ全員で勝ち切るぞ」", replySpeaker: "celestia", reply: "……はい。この照準は、二度と揺らぎません。", bondChar: "celestia" }
        ]
      },
      { bg: "powerplant", sfx: "alarm", fx: "redflash", speaker: "koharu", text: "うわっ、外周センサーが真っ赤になった！発電所の外にラプトルの群れが集まってきてるよ！" }
    ]
  },
  {
    id: "ch2_ep6", chapter: "第六話", title: "変電渓谷の包囲網", subtitle: "旧発電所外周・ラプトル強襲防衛戦",
    reqClear: "ch2_ep5", battleEnemyId: "spark_raptor", reward: { gems: 260, credits: 9200, books: 22, cores: 4 },
    scenes: [
      { bg: "canyon_storm", bgm: "tension", speaker: "narrator", text: "発電所の正門前。垂れ流された電力に引き寄せられたのか、帯電したラプトルの群れが鉄柵を取り囲んでいた。" },
      { bg: "canyon_storm", speaker: "koharu", text: "あたしが地下タービンの隔壁ロックを解除するまで、外で食い止めててくれる！？少しだけ時間がかかるの！" },
      { bg: "canyon_storm", speaker: "sylphy", text: "上等だ！狭い入口なら数で押されても怖くねぇ。隊長、一匹も中へ通すなよ！" },
      { bg: "canyon_storm", speaker: "aoi", text: "防衛陣形を展開します！敵の連撃をカウンターで弾き返して押し切りましょう！" },
      { bg: "danger", sfx: "roar", fx: "redflash", speaker: "protagonist", text: "コハルの作業を守り抜け！変電渓谷の包囲網を打ち破る！" }
    ]
  },
  {
    id: "ch2_ep7", chapter: "第七話", title: "地下タービンと遠隔妨害", subtitle: "深層変電室への突入・仕組まれた罠",
    reqClear: "ch2_ep6", battleEnemyId: null, reward: { gems: 240, credits: 9500, books: 22, cores: 4 },
    scenes: [
      { bg: "powerplant", bgm: "tension", speaker: "narrator", text: "外周の群れを退け、コハルが開いた重厚な隔壁をくぐると、耳を劈くような高圧電流の唸りが小隊を襲った。" },
      { bg: "powerplant", speaker: "koharu", text: "見てっ、あの中央の青い柱が『アーク主変圧器』だよ！あそこの遮断レバーを落とせば、外への暴走送電は止まるはず！" },
      { bg: "powerplant", speaker: "melissa", text: "よしよし、あたしに任せなさい！配線図をちょちょいっと……ん？" },
      { bg: "powerplant", sfx: "alarm", fx: "redflash", speaker: "chloe", text: "待ってください！通信回線に外部から強制割り込み！！誰かが遠隔で変電所の電圧を最大まで引き上げています！！" },
      { bg: "powerplant", sfx: "boom", fx: "shake", speaker: "narrator", text: "激しい火花とともに退路のシャッターが閉鎖され、変電ホールの奥で巨大な甲殻が擦れる音が響いた。" },
      { bg: "powerplant", speaker: "noah", text: "わわっ！？変圧器の裏に、とんでもなくデカいハサミを持った虫が張り付いて電気を吸ってたよ！！" },
      { bg: "powerplant", speaker: "melissa", text: "『蓄電巨甲虫・スカラベ』よ！しかも変圧器の電力を丸呑みしてるせいで、装甲がバチバチに帯電してる！" },
      { bg: "powerplant", speaker: "mikoto", text: "遠隔操作の主は、私たちがここへ辿り着くことを見越して番人を仕込んでいたのですね……！" },
      {
        bg: "powerplant", speaker: "koharu", text: "遮断レバーまであと少しなのに！隊長、この鉄壁の蓄電甲虫、どう攻略する！？",
        choices: [
          { label: "「『高圧蓄電鋏』を部位破壊して、溜め込んだ電力を奪い取る！」", replySpeaker: "melissa", reply: "大正解！ハサミを砕けば放電の威力がガクッと落ちるわよ！", bondChar: "koharu" },
          { label: "「装甲硬化には『崩し』、大放電には『バリアと凍結』で完全対応する！」", replySpeaker: "mikoto", reply: "的確な采配ですわ。冷静に読み勝てば必ず突破できます。", bondChar: "mikoto" }
        ]
      },
      { bg: "powerplant", sfx: "roar", fx: "flash", speaker: "narrator", text: "変電ホールの照明が明滅する中、巨大な蓄電甲虫が二本の雷鋏を打ち鳴らした。" }
    ]
  },
  {
    id: "ch2_ep8", chapter: "第八話", title: "鉄壁の蓄電甲虫・スカラベ", subtitle: "地下変電ホール防衛・スカラベ戦",
    reqClear: "ch2_ep7", battleEnemyId: "volt_scarab", reward: { gems: 280, credits: 11000, books: 26, cores: 5 },
    scenes: [
      { bg: "powerplant", bgm: "tension", sfx: "roar", fx: "shake", speaker: "narrator", text: "蓄電巨甲虫・スカラベ。高圧電流を帯びた絶縁装甲は、中途半端な攻撃をすべて弾き返す強敵だ。" },
      { bg: "powerplant", speaker: "lunaria", text: "ヴェルデの結晶甲虫よりさらに硬そうね！でも、今のあたしたちならブチ割れるわよ！" },
      { bg: "powerplant", speaker: "aoi", text: "敵のチャージ予兆を見逃さないでください！崩しカードをしっかり手札に温存して戦いましょう！" },
      { bg: "danger", sfx: "boom", fx: "redflash", speaker: "protagonist", text: "遮断レバーへの道を切り開く！蓄電巨甲虫・スカラベ、撃破開始！" }
    ]
  },
  {
    id: "ch2_ep9", chapter: "第九話", title: "雷雨の野営、明かされる過去", subtitle: "暴風雨の峡谷キャンプ・セレスティアの決意",
    reqClear: "ch2_ep8", battleEnemyId: null, reward: { gems: 240, credits: 10000, books: 24, cores: 4 },
    scenes: [
      { bg: "camp_night", bgm: "story", speaker: "narrator", text: "スカラベを退け、主変圧器の遮断を完了した夜。峡谷には激しい雷雨が降り注ぎ、小隊は岩陰の野営地で雨宿りをしていた。" },
      { bg: "camp_night", speaker: "kaede", text: "ふぅ〜、すごい雷雨だね！冷えた体に染みるように、ピリ辛のアーク生姜スープを作ったよ。ほら、みんな温まって！" },
      { bg: "camp_night", speaker: "momo", text: "はふはふっ……あったまるぅ！ねえセレスティアさん、さっきからずっと雨の外を見てるけど、スープ冷めちゃうよ？" },
      { bg: "camp_night", speaker: "celestia", text: "……ありがとう、モモ。少し考え事をしていただけです。" },
      { bg: "camp_night", speaker: "sylphy", text: "おいおい、三年前のことだろ。一人で全部背負い込むなよ狙撃手さん。今のあんたには、背中を預けられる第7小隊がいるじゃねぇか。" },
      { bg: "camp_night", speaker: "celestia", text: "……ええ、わかっています。あの日、黄金の雷竜に仲間を奪われた瞬間から、私は『二度と誰も失わない』と心に誓いました。" },
      { bg: "camp_night", speaker: "celestia", text: "だからこそ、これまでは誰とも深く関わらず、ただ冷徹に引き金を引くことだけを選んできた。……けれど、隊長と出会って変わりました。" },
      {
        bg: "camp_night", speaker: "celestia", text: "明日はいよいよ峡谷最深部へ向かいます。隊長……私の照準と覚悟、信じていただけますか？",
        choices: [
          { label: "「もちろんだ。セレスティアの狙撃は、第7小隊の最強の切り札だ」", replySpeaker: "celestia", reply: "……ふふ。感謝します、隊長。明日は一発たりとも外しませんよ。", bondChar: "celestia" },
          { label: "「一人じゃない。みんなで連携して、今度こそ全員で笑って帰ろう」", replySpeaker: "kaede", reply: "そうそう！帰ったら祝勝会に山盛りステーキを焼くからね、約束だよ！", bondChar: "kaede" }
        ]
      },
      { bg: "powerplant", bgm: "tension", sfx: "alarm", fx: "redflash", speaker: "koharu", text: "隊長っ！！変電所の予備電源が勝手に再起動した！！まだ残っていた大型のスカラベが、最後の予備炉を壊そうとしてる！" }
    ]
  },
  {
    id: "ch2_ep10", chapter: "第十話", title: "高圧変電室の死闘", subtitle: "前編クライマックス・暴走スカラベ決戦",
    reqClear: "ch2_ep9", battleEnemyId: "volt_scarab", reward: { gems: 360, credits: 14000, books: 30, cores: 6 },
    scenes: [
      { bg: "powerplant", bgm: "tension", sfx: "boom", fx: "flash", speaker: "narrator", text: "予備発電室に飛び込んだ小隊の目に映ったのは、青白い稲妻を全身に纏い、予備炉へ巨大なハサミを突き立てるスカラベの姿だった。" },
      { bg: "powerplant", speaker: "melissa", text: "このまま予備炉が破壊されたら、蓄積されていた超高圧エネルギーが一気に空へ噴き上がっちゃうわ！絶対に止めないと！" },
      { bg: "powerplant", speaker: "sylphy", text: "上等だ！こいつを片付けて、峡谷の半分は俺たちの手で完全に押さえてやろうぜ！" },
      { bg: "powerplant", speaker: "valeria", text: "第2章前編の正念場ですわね。一糸乱れぬ連携で仕留めましょう！" },
      { bg: "danger", sfx: "roar", fx: "redflash", speaker: "protagonist", text: "予備炉を守り抜け！暴走スカラベ、完全討伐開始！" }
    ],
    epilogue: [
      { bg: "canyon_storm", bgm: "tension", sfx: "boom", fx: "flash", speaker: "narrator", text: "スカラベが砕け散り、発電所の暴走回路は完全に沈黙した。……だがその直後、峡谷の空そのものが真っ二つに裂けるほどの轟音が響いた。" },
      { bg: "gold_storm", sfx: "roar", fx: "shake", speaker: "narrator", text: "紫電の雲を突き破って舞い降りたのは、翼長四十メートルを超える蒼雷の巨竜——第2エリアの主霧獣『サンダー・ワイバーン』だった。" },
      { bg: "gold_storm", speaker: "celestia", text: "……来ましたね。しかも翼の先端が、すでにうっすらと黄金色に染まり始めています。" },
      { bg: "gold_storm", speaker: "chloe", text: "発電所を止めたことで、奴は怒り狂って最深部の巣『雷竜の頂』へ移動しました！第7小隊、いよいよ第2章・後編——天空決戦の準備を！" }
    ]
  }
];
