// =========================================================
// 💞 絆システム完全拡張（所持限定・Lv.5上限・全キャラ4話・全キャラ専用称号）
// =========================================================
const BO_LEVEL_THRESHOLDS = [0, 0, 10, 30, 60, 100]; // idx = Lv (1〜5)

const BO_EP_REWARDS = {
  2: { gems: 120, tickets: 1, cores: 0, label: "💎+120 / 🎟️+1" },
  3: { gems: 200, tickets: 2, cores: 1, label: "💎+200 / 🎟️+2 / 💠+1 / 🏅専用称号" },
  4: { gems: 240, tickets: 2, cores: 2, label: "💎+240 / 🎟️+2 / 💠+2" },
  5: { gems: 360, tickets: 3, cores: 5, label: "💎+360 / 🎟️+3 / 💠+5 / 👑極・専用称号" }
};

// 全32キャラ固有データ（口調・モチーフ・Lv.3称号・Lv.5極称号・個別台詞）
const BO_CHAR_LORE = {
  aoi: {
    t3: "第7小隊の頼れる相棒", t5: "アオイと歩む蒼穹の副官記",
    hobby: "作戦日誌の整理と淹れたてのハーブティー",
    l2: "隊長、今日も一日お疲れさまです。……ふふ、たまには肩の力を抜いてくださいね？",
    l3: "最初に着任した時は正直不安でした。でも、隊長の背中を見て『この人となら大丈夫』って思えたんです。",
    l4: "二人だけで作戦図を広げるこの時間、実は私の一番の楽しみなんです。……秘密ですよ？",
    l5: "これから先どんな濃い瘴霧が立ちはだかっても、副官として、そして一人の仲間として、ずっと隣に居させてください。"
  },
  mikoto: {
    t3: "白狐に選ばれし者", t5: "極氷の白狐巫女と結ぶ契り",
    hobby: "静かな月夜に氷結晶で風鈴を作ること",
    l2: "……私の尻尾が気になりますか？ 隊長にだけ、少しなら触れても構いませんよ。",
    l3: "氷の力は本来、誰も近づけぬ孤独な力でした。けれど貴方の隣では、不思議と凍てつかずに済むのです。",
    l4: "冷えた手を温めてくださるのですか……？ ふふ、巫女として威厳が保てなくなってしまいますね。",
    l5: "千年先まで変わらぬ氷華のように、私の祈りと刃は永遠に貴方のために。……どうか、ずっと傍にいてください。"
  },
  celestia: {
    t3: "蒼雷の観測手", t5: "零式レールガンの絶対共鳴者",
    hobby: "高台からの精密望遠観測と光学レンズの手入れ",
    l2: "射線クリア、風速異常なし。……隊長、私の照準器を覗いてみますか？ 世界の輪郭がくっきり見えますよ。",
    l3: "狙撃手は本来ひとりきりで引き金を引くもの。でも、貴方が前線で標を作ってくれるから、迷わず撃ち抜けます。",
    l4: "今、心拍数が少し上がりましたね？ ……いいえ、私の方です。貴方と目が合うと、照準がぶれて困ります。",
    l5: "どんな絶望の果てでも、貴方の進む道だけは私が一撃で切り拓きます。私の全射程を、貴方に預けましょう。"
  },
  sylphy: {
    t3: "疾風を駆ける相棒", t5: "銀狼の双刃と誓う最速の風",
    hobby: "キャンプ周辺の早朝ランニングと肉料理の食べ歩き",
    l2: "おっ、隊長！ いい風吹いてるじゃん！ じっとしてないで外でひとっ走りしようぜ！",
    l3: "あたしのスピードについてこられる指揮官なんてあんたが初めてだよ。マジで背中預けられるって感じ！",
    l4: "えへへ、頭なでられるのって案外悪くないな……。あ、今の顔は他の奴らには内緒なっ！",
    l5: "あんたが『行け』って言うなら、世界の果てまで一番乗りで駆け抜けてやる。これからもずっと相棒だぜ、隊長！"
  },
  serina: {
    t3: "癒やしの旋律を聴く者", t5: "桜色の歌姫と奏でる希望の詩",
    hobby: "キャンプの焚き火のそばでの鼻歌と押し花づくり",
    l2: "ふふっ、お顔に少し疲れが出ていますよ？ 今夜は私の歌を聴きながら、ゆっくり休んでくださいね。",
    l3: "私の歌でみんなが立ち上がる姿を見ると、ここにいて良かったって心から思えるんです。隊長のおかげですね。",
    l4: "隊長のためだけに、新しい旋律を作ってみたんです。……恥ずかしいけど、一番に聴いてほしくて。",
    l5: "どんな暗い夜が訪れても、貴方の心が折れないように私が歌い続けます。二人の物語に、優しい未来が訪れますように。"
  },
  lily: {
    t3: "純白の聖壁に守られし者", t5: "白百合の騎士が捧ぐ永遠の盾",
    hobby: "盾の磨き上げと小鳥への餌やり",
    l2: "隊長、前へ出すぎです！ 私が必ずお守りしますから、どうか無理だけはなさらないでください。",
    l3: "誰かを守るための強さが欲しいと願っていました。貴方と出会えて、この盾を掲げる意味がはっきり見えました。",
    l4: "鎧を外した姿を見られるのは少し照れくさいですね……。でも、隊長の前では素直でいたいのです。",
    l5: "私の聖壁は、何よりも貴方の笑顔を守るためにあります。生涯を懸けて、貴方の盾となることをここに誓います。"
  },
  marina: {
    t3: "深海を共に行く航海士", t5: "蒼海の守護者と交わす潮騒の約束",
    hobby: "きれいな貝殻集めと水辺での昼寝",
    l2: "ねえ隊長、水の音って落ち着くよね。次の休日は一緒に綺麗な泉を探しに行かない？",
    l3: "霧に沈んだ大地でも、隊長がいればきっとまた澄んだ海が戻ってくるって信じられるんだ。",
    l4: "ほら、この青い結晶、光に透かすと綺麗でしょ？ お守り代わりに隊長にプレゼントするね！",
    l5: "どんな荒波や巨大な霧獣が来ても怖くないよ。隊長と手をつないでいれば、どこまでも潜っていけるから。"
  },
  iris: {
    t3: "紅蓮の薔薇に魅入られし者", t5: "緋炎の剣姫と燃やす不滅の情熱",
    hobby: "剣の素振りとスパイシーなキャンプ飯の試食",
    l2: "ふっ、いい目をしているな隊長。その熱い闘志、私の紅蓮の刃とよく響き合うぞ。",
    l3: "ただ強いだけでは頂には届かない。お前の的確な指揮があってこそ、私の炎は最高潮まで燃え上がる。",
    l4: "……薔薇には棘があると言うが、お前だけは臆せず手を伸ばしてくるな。まったく、敵わない相手だ。",
    l5: "この身が燃え尽きるその日まで、お前の覇道に付き合ってやろう。さあ、世界を照らす最高の一撃を共に！"
  },
  lunaria: {
    t3: "紅炎の星を継ぐ者", t5: "暁星のルナリアと歩む開拓路",
    hobby: "星空観測と古地図の解読",
    l2: "隊長、今夜の星は一段と綺麗ですよ。少しだけ、私と夜風に当たりませんか？",
    l3: "炎はすべてを焼き尽くす力……そう恐れていた時期もありました。でも今は、仲間を照らす灯火だと誇れます。",
    l4: "隣にいると、胸の奥がぽかぽかするんです。炎の属性のせい……だけじゃないかもしれませんね。",
    l5: "霧が晴れたその先に広がる新しい世界を、一番最初に貴方と並んで見たい。それが今の私の夢です。"
  },
  chloe: {
    t3: "鉄壁の戦術パートナー", t5: "蒼銀の守護者クロエの絶対信頼",
    hobby: "装備のメンテナンスとチェス",
    l2: "隊長、装備の点検は済んでいますか？ 細部の緩みが戦場では命取りになりますよ。",
    l3: "あなたの無茶な作戦には毎回ヒヤヒヤしますが……不思議と最後は必ず勝ってしまうんですよね。",
    l4: "チェスのお相手、感謝します。……次の一手は読まれていましたか。流石ですね、隊長。",
    l5: "私の背中はあなたに任せます。その代わり、あなたの命も私が最後まで預かりますから。"
  },
  ran: {
    t3: "嵐を呼び込む戦友", t5: "翠嵐のランと翔ける自由の空",
    hobby: "高所からの風読みと気ままな散歩",
    l2: "やっほー隊長！ 今日もいい風が吹いてるね。あたしと一緒に偵察に行っちゃおっか！",
    l3: "堅苦しい規則は苦手だけど、隊長の小隊は居心地がいいんだよね。みんな伸び伸びしてるし！",
    l4: "ふふっ、隊長って意外と真面目で優しいんだね。そういうとこ、あたし結構好きだよ。",
    l5: "どんな向かい風が吹いても、あたしが全部追い風に変えてあげる。一緒に一番高い空まで行こうね！"
  },
  koharu: {
    t3: "もふもふ重槌の相棒", t5: "陽だまりのコハルと築く笑顔の拠点",
    hobby: "ふわふわのパン焼きと重槌の装飾",
    l2: "隊長さんっ！ 焼きたてのパン、味見してほしいですっ！ えへへ、しっぽがパタパタしちゃいます！",
    l3: "大きなハンマーを振るうのは大変だけど、隊長さんが『ナイスブレイク！』って褒めてくれると元気100倍なんです！",
    l4: "あの……疲れたときは、コハルの隣で休んでいいですからね？ ずっと応援してますっ！",
    l5: "隊長さんとみんなが笑顔で帰ってこられる場所を、コハルが全力で守ります！ これからもずーっと一緒ですよ！"
  },
  kaede: {
    t3: "秋風の太刀筋を知る者", t5: "紅葉一閃・カエデの無二の理解者",
    hobby: "日本茶を淹れることと刀剣の手入れ",
    l2: "一服いかがですか、隊長。戦いの合間こそ、心を静めるひとときが大切です。",
    l3: "刃は迷いがあると鈍るもの。ですが貴方の号令は一点の曇りもなく、実に斬りやすい。",
    l4: "貴方とこうして静かにお茶を飲む時間が、何よりの安らぎになりました。",
    l5: "我が剣に二言はありません。この先いかなる強敵が現れようと、貴方の前で必ず斬り伏せてみせましょう。"
  },
  sakura: {
    t3: "桜吹雪の共鳴者", t5: "満開のサクラと見る春の地平",
    hobby: "花壇の世話と香り袋づくり",
    l2: "隊長、見てください！ キャンプの片隅に小さな芽が出ていましたよ。素敵ですね！",
    l3: "瘴霧で枯れた大地にも、私たちが進めばきっとまた花が咲く……隊長がそう教えてくれました。",
    l4: "隊長のジャケットに、桜色の香り袋を忍ばせておきました。戦闘中でも少しリラックスできますように。",
    l5: "いつかこの世界が満開の花で埋め尽くされたら、一番に隊長と散歩したいです。約束ですよ！"
  },
  haruto: {
    t3: "熱血の背中合わせ", t5: "不屈のハルトと誓う勝利の拳",
    hobby: "筋トレと新作キャンプ飯の開拓",
    l2: "よぉ隊長！ 今日の訓練もバッチリだな！ 俺も負けてらんねぇよ！",
    l3: "正直、最初は俺が一番強いって思ってたけどさ……あんたの指揮には本当に惚れ込んだぜ。",
    l4: "困ったことがあったらいつでも言えよな！ 俺が真っ先に突っ込んで道を切り開いてやるからさ！",
    l5: "あんたと組んでから、負ける気がしねぇんだ！ 最高の相棒として、最後まで突っ走ろうぜ！"
  },
  noah: {
    t3: "翠風の偵察パートナー", t5: "静謐なるノアの心許す指揮官",
    hobby: "地形スケッチと機械いじり",
    l2: "隊長、次のエリアの地形図をまとめました。……あ、無理して徹夜したわけじゃないですよ。",
    l3: "人付き合いはあまり得意じゃないんですが、隊長は静かに話を聞いてくれるから安心します。",
    l4: "スケッチブックの最後のページ、実は隊長を描いたんです。……まだ見せられませんけどね。",
    l5: "どんな複雑な迷宮でも、僕が必ず安全な道を見つけます。だから、これからも一緒に前へ進みましょう。"
  },
  melissa: {
    t3: "黄金錬成の共同研究者", t5: "天才メリッサの最愛の被験者",
    hobby: "アーク結晶の調合実験とカフェイン補給",
    l2: "あーっ隊長！ ちょうどいいところに！ 新開発のアーク増幅剤、ちょっとだけ試してみない？",
    l3: "普通の人は私の理論についてこれないのに、隊長は実践で完璧に活かしちゃうんだから本当に面白いよ！",
    l4: "徹夜明けに差し入れなんて気が利くね……。ふふ、隊長の笑顔はどんな結晶よりエネルギー効率がいいかも。",
    l5: "君となら、旧文明すら超える奇跡だって創れる気がするよ。これからも私の最高の相棒でいてね！"
  },
  valeria: {
    t3: "紫電の戦乙女に認められし者", t5: "雷帝ヴァレリアの永遠の盟友",
    hobby: "古戦術書の読破と高級紅茶",
    l2: "ほう、中々良い度胸をしているな隊長。私の雷に耐えうる指揮官か、見定めさせてもらうぞ。",
    l3: "見事だ。お前の采配は合理的でありながら、仲間への情を失っていない。高く評価しよう。",
    l4: "たまには肩肘張らずに語り合うのも悪くないな。……お前にだけは、弱音の一つも許してやろう。",
    l5: "我が雷鳴は、真の王者にのみ従う。お前こそがその器だ、隊長。共に伝説を刻もうではないか。"
  },
  mint: {
    t3: "精密スキャンの相棒", t5: "ミントと解き明かす弱点の真理",
    hobby: "データ解析とミントティー",
    l2: "隊長！ 新しい敵の弱点データ、整理できましたよ！ これで部位破壊もバッチリですっ！",
    l3: "私の解析を信じて一撃を決めてくれる瞬間、すっごくワクワクするんです！",
    l4: "データ上では説明できないんですけど……隊長の近くにいると、すごく心が落ち着くんですよね。",
    l5: "どんな未知の怪物が出てきても、私と隊長のタッグなら絶対攻略できます！ 100%保証しますっ！"
  },
  momo: {
    t3: "桃色パワーの応援団長", t5: "元気印モモのいちばん星",
    hobby: "スイーツ作りとデコレーション",
    l2: "隊長ーっ！ 今日も絶好調だねっ！ モモ特製エナジーキャンディ、ひとつどーぞ！",
    l3: "みんなが笑顔でいられるのは、隊長がいつも頑張ってくれてるからだよ！ モモ、ちゃんと見てるからね！",
    l4: "えへへ、隊長と一緒におやつ食べる時間がいちばん幸せ〜！ また明日も食べようね！",
    l5: "モモの元気は全部隊長にあげるっ！ どんなにピンチでも、二人で笑って乗り越えちゃおうね！"
  },
  fiona: {
    t3: "白銀の弓使いの理解者", t5: "氷霜のフィオナと守る静寂",
    hobby: "矢羽根の手入れと雪景色の観察",
    l2: "静かにして……獲物の気配が近いわ。隊長、合図は任せたわよ。",
    l3: "無駄な動きをしないあなたの指揮、嫌いじゃないわ。むしろ信頼している。",
    l4: "……寒いなら、もう少し近くに来てもいいのよ。別に、迷惑じゃないから。",
    l5: "私の矢が外れることは一度もない。あなたの未来を阻むものは、すべて私が射抜いてみせるわ。"
  },
  leila: {
    t3: "砂塵の踊り手の相棒", t5: "紅砂のレイラと舞う勝利の夜",
    hobby: "アクセサリ収集とリズムトレーニング",
    l2: "やあ隊長、今日も軽やかに行こうか！ 硬くなってるとリズムが狂っちゃうよ？",
    l3: "あんたの戦術、まるでダンスみたいに綺麗だね。合わせて踊るのが楽しくてしょうがないよ！",
    l4: "ほら、もっと肩の力抜いて。今夜くらいは任務を忘れて、あたしとゆっくり語らおうじゃないか。",
    l5: "どこまで行っても退屈しない最高の指揮官さ。これからもあんたの隣で、派手に舞い続けてやるよ！"
  },
  crow: {
    t3: "漆黒の翼を知る者", t5: "影の狩人クロウが認めた唯一",
    hobby: "屋根の上での見張りとブラックコーヒー",
    l2: "……背後は気をつけろよ、隊長。ま、俺が見張ってる限り奇襲はさせないがな。",
    l3: "群れるのは好きじゃなかったが、お前の小隊なら悪くない。妙に居心地がいいんだ。",
    l4: "ブラックコーヒー、淹れすぎた。……飲むだろ？ お前の好みくらい把握してる。",
    l5: "光の当たる場所はお前に任せる。俺は影から、お前を脅かす全てを黙って斬り捨ててやるよ。"
  },
  rikka: {
    t3: "六花結晶の観測者", t5: "雪華のリッカと紡ぐ永遠の冬",
    hobby: "雪の結晶スケッチと編み物",
    l2: "隊長、マフラー忘れていませんか？ 凍える戦場では体調管理も大事ですよ。",
    l3: "不器用な私でも、隊長の小隊ではちゃんと役に立てている気がして嬉しいです。",
    l4: "あの……これ、手編みの手袋です。隊長の手に合うといいのですが……。",
    l5: "冷たい雪も、誰かと一緒ならこんなにも美しいんですね。これからもずっと、貴方の傍にいさせてください。"
  },
  yuzu: {
    t3: "柑橘の閃光を追う者", t5: "陽光のユズと駆ける黄金の明日",
    hobby: "柑橘ドリンク作りとキャッチボール",
    l2: "おっす隊長！ 特製ユズソーダ作ったよ！ 飲めば疲れなんて一発で吹き飛ぶからねっ！",
    l3: "隊長が『よし、行こう！』って言うと、なんだか本当に何でもできる気がするんだよね！",
    l4: "ふふっ、隊長に褒められると照れちゃうな〜。でももっと頑張りたくなっちゃう！",
    l5: "これからもずっと、太陽みたいに明るい小隊にしようね！ あたしも全力で隊長を支えるよっ！"
  },
  belle: {
    t3: "鈴音に導かれし隊長", t5: "清廉のベルと響く祝福の鐘",
    hobby: "小さな鈴の収集と読書",
    l2: "チリン♪ 隊長さん、いいことがありそうな音がしますよ！ 今日も頑張りましょうね。",
    l3: "私が鳴らす鈴の音で、みんなの心が少しでも軽くなるなら本望です。隊長さんもいつでも呼んでくださいね。",
    l4: "隊長さんの優しい声、なんだか鈴の音みたいに心地よくて大好きなんです。",
    l5: "どんな嵐の日でも、私が希望の鐘を鳴らし続けます。隊長さんの歩む道に、たくさんの祝福がありますように！"
  },
  pochi: {
    t3: "忠犬ポチのいちばんのご主人", t5: "ポチと結ぶ絶対無二の絆",
    hobby: "お散歩パトロールと骨型アークビスケット",
    l2: "ワンッ！（隊長を見つけて嬉しそうに尻尾を全力で振っている！）",
    l3: "ワフッ！（どんな霧獣が来ても隊長の前には立たせないと胸を張っている！）",
    l4: "クゥン♪（隊長の足元に寄り添い、お腹を見せて完全に心を許している！）",
    l5: "アオォーン！（これからもずっと一番の相棒だと、力強い遠吠えで誓ってくれた！）"
  },
  tama: {
    t3: "気まぐれタマの特等席", t5: "タマに選ばれた至高の下僕（相棒）",
    hobby: "日向ぼっこと高い棚の上からの監視",
    l2: "ニャア♪（隊長の足元にすり寄って、顎をなでてほしそうにゴロゴロ喉を鳴らしている）",
    l3: "フニャッ！（戦闘中も的確に隙を突く機敏さで、隊長への信頼を静かに示している）",
    l4: "ミャオ…（隊長の膝の上に丸くなって、安心しきった寝息を立てはじめた）",
    l5: "ニャーン！（大切な宝物のように、お気に入りの輝くアーク石を隊長の掌へそっと乗せてくれた！）"
  },
  scanner: {
    t3: "精密観測ドローンの運用官", t5: "スキャナーと同期する完全視界",
    hobby: "360度パノラマ撮影とファームウェア最適化",
    l2: "ピピッ！【隊長ノ生体反応ヲ確認。本日ノ作戦成功率、良好デス！】",
    l3: "ピロリン♪【隊長ノ指揮データヲ学習完了。私ノ光学センサーハ貴方ノ目トナリマス！】",
    l4: "ウィーン……【統計上、隊長ト行動ヲ共ニスルトシステム温度ガ心地ヨク安定シマス】",
    l5: "ビビッ！【最高位プロトコル解放。コレカラモ永遠ニ、隊長ノ最前線ヲ照ラシ続ケマス！】"
  },
  driller: {
    t3: "重削岩ユニットの指揮官", t5: "ドリラーと貫く不屈の大地",
    hobby: "地下鉱脈の探査とドリル研磨",
    l2: "ガガガッ！【隊長！ 固イ装甲モ岩盤モ、コノ超振動ドリルニ任セテクダサイ！】",
    l3: "ギュイーン！【隊長ノ号令ニ合ワセテ叩キ込ム一撃ハ、出力120%デ最高デス！】",
    l4: "カシャン……【整備アリガトウゴザイマス隊長！ オイルノ乗リガ最高デス！】",
    l5: "ドゴォォン！【ドンナ厚イ壁モ、隊長ト一緒ナラ絶対ニ貫通シテミセマス！】"
  },
  guardko: {
    t3: "防衛ロボの信頼マスター", t5: "ガードコと築く難攻不落の砦",
    hobby: "キャンプ周辺の警備巡回と盾のワックス掛け",
    l2: "ピポッ！【異常ナシ！ 隊長ノ安全ハコノ装甲板ガ絶対ニ保証シマス！】",
    l3: "ガシャン！【ドンナ猛攻モ弾キ返シマス。私ノ背後カラ安心シテ指揮シテクダサイ！】",
    l4: "ピピ♪【隊長ニ頭ヲ撫デラレルト、防御フィールドノ出力ガ上昇スル現象ヲ確認！】",
    l5: "キラーン！【全防御プロトコル最終覚醒！ 隊長ヲ傷ツケル者ハ一人モ通シマセン！】"
  },
  medibot: {
    t3: "戦場救護ボットの専属隊長", t5: "メディボットと紡ぐ不滅の生命線",
    hobby: "ナノミスト調合と救急キットの整理",
    l2: "ピロリ♪【隊長ノ疲労度ヲ計測中……今スグ癒ヤシノナノミストヲ噴霧シマス！】",
    l3: "ピピッ！【皆サンガ笑顔デ帰還デキルノハ、隊長ノ的確ナ判断ノオカゲデス！】",
    l4: "ポワーン♪【隊長専用ノ特製ビタミンドリンクヲ調合シマシタ。オ飲ミクダサイ！】",
    l5: "ピロロローン！【最高位救護モード起動！ 隊長ト第7小隊ノ命ハ私ガ永遠ニ守リ抜キマス！】"
  }
};

let boPtsKeyCache = null;
let boGiftKeyCache = null;
let boTalkKeyCache = null;
let boTitlesKeyCache = null;
let boViewIdCache = null;
let boActiveStory = null;

function boEsc(s) {
  if (typeof escapeHtml === "function") return escapeHtml(s);
  return String(s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  }[c]));
}

function boTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function boDetectStateKey(candidates, fnRegex, fallback, isObject = true) {
  try {
    const fnNames = Object.keys(window).filter(k => fnRegex.test(k) && typeof window[k] === "function");
    const blob = fnNames.map(n => { try { return window[n].toString(); } catch (_) { return ""; } }).join("\n");
    for (const k of candidates) {
      if (blob.includes(`state.${k}`) || blob.includes(`"${k}"`) || blob.includes(`'${k}'`)) return k;
    }
  } catch (_) {}
  if (typeof state !== "undefined" && state) {
    for (const k of candidates) {
      if (isObject && state[k] && typeof state[k] === "object" && !Array.isArray(state[k])) return k;
      if (!isObject && typeof state[k] !== "undefined") return k;
    }
  }
  return fallback;
}

function boEnsureState() {
  if (typeof state === "undefined" || !state) return;
  if (!boPtsKeyCache) {
    boPtsKeyCache = boDetectStateKey(["bonds", "bondPoints", "charBonds", "affection", "bondPts"], /bond|affin|talk|gift/i, "bonds", true);
  }
  if (!boGiftKeyCache) {
    boGiftKeyCache = boDetectStateKey(["bondGifts", "bouquets", "gifts", "bondBouquets"], /bond|gift|shop|bouquet/i, "bondGifts", false);
  }
  if (!boTalkKeyCache) {
    boTalkKeyCache = boDetectStateKey(["bondTalkDate", "lastBondTalk", "bondDailyDate", "bondTalkToday"], /bond|talk/i, "bondTalkDate", false);
  }
  if (!boTitlesKeyCache) {
    boTitlesKeyCache = boDetectStateKey(["unlockedTitles", "titles", "ownedTitles"], /title|bond|profile/i, "unlockedTitles", false);
  }

  if (!state[boPtsKeyCache] || typeof state[boPtsKeyCache] !== "object") state[boPtsKeyCache] = {};
  if (typeof state[boGiftKeyCache] !== "number") state[boGiftKeyCache] = Number(state[boGiftKeyCache] || 0);
  if (!Array.isArray(state[boTitlesKeyCache])) {
    state[boTitlesKeyCache] = ["第7小隊・新任隊長"];
  }
  if (state.activeTitle && !state[boTitlesKeyCache].includes(state.activeTitle)) {
    state[boTitlesKeyCache].push(state.activeTitle);
  }
  if (!state.bondReadEps || typeof state.bondReadEps !== "object") state.bondReadEps = {};
}

function boGetPts(charId) {
  boEnsureState();
  return Math.max(0, Number(state?.[boPtsKeyCache]?.[charId] || 0));
}

function boAddPts(charId, delta) {
  boEnsureState();
  const prevLv = boGetLevel(charId);
  const cur = boGetPts(charId);
  const next = Math.min(100, cur + delta);
  state[boPtsKeyCache][charId] = next;
  const nextLv = boGetLevel(charId);
  return { prevPt: cur, nextPt: next, prevLv, nextLv, leveledUp: nextLv > prevLv };
}

function boGetLevel(charId) {
  const pt = boGetPts(charId);
  if (pt >= 100) return 5;
  if (pt >= 60) return 4;
  if (pt >= 30) return 3;
  if (pt >= 10) return 2;
  return 1;
}

function boGetLore(ch) {
  const preset = BO_CHAR_LORE[ch.id];
  if (preset) return preset;
  const el = window.MF_DATA?.ELEMENTS?.[ch.element]?.name || "煌";
  const v = (Array.isArray(ch.voiceLines) && ch.voiceLines[0]) ? ch.voiceLines[0] : "隊長、次の作戦も任せろ！";
  return {
    t3: `${ch.name}と響き合う戦友`,
    t5: `${el}の誓い・${ch.name}の無二の相棒`,
    hobby: "装備の調整と作戦後のひと休み",
    l2: `お疲れさま、隊長。${v}`,
    l3: `隊長と戦場を重ねていくうちに、どんな霧獣にも怯まない自信がついてきたよ。`,
    l4: `こうして二人だけでゆっくり話す時間も悪くないね。これからも頼りにしてるよ、隊長。`,
    l5: `どんな困難が待っていようと、${ch.name}は最後まで隊長の隣で戦い抜くよ。最高の相棒としてね！`
  };
}

function boGetTitlesForChar(ch) {
  const lore = boGetLore(ch);
  return { lv3: lore.t3, lv5: lore.t5 };
}

function boIsEpRead(charId, lv) {
  boEnsureState();
  return !!state.bondReadEps[`${charId}_${lv}`];
}

function boBuildEpisodeScript(ch, lv) {
  const lore = boGetLore(ch);
  const pName = state?.playerName || "隊長";
  const el = window.MF_DATA?.ELEMENTS?.[ch.element] || { icon: "✨", name: "煌" };

  if (lv === 2) {
    return {
      title: `EP.1「${ch.name}の素顔」`,
      place: "📍 前線キャンプ・休憩テント",
      lines: [
        { sp: "ナレーション", text: `作戦の合間、前線キャンプの片隅で${ch.name}が『${lore.hobby}』をしている姿を見かけた。` },
        { sp: ch.name, text: lore.l2 },
        { sp: pName, text: `「いつも頼りにしてるよ、${ch.name}。たまにはゆっくり休んでくれ。」` },
        { sp: ch.name, text: `「ふふ、${pName}にそう言われると力が湧いてくるな。次はもっと息を合わせていこう！」` }
      ]
    };
  }
  if (lv === 3) {
    return {
      title: `EP.2「戦場を越えた信頼」`,
      place: "📍 浄化ビーコン展望台・夕暮れ",
      lines: [
        { sp: "ナレーション", text: `激戦を終えた夕暮れ。紫の瘴霧が少しずつ晴れていく空を、${ch.name}と並んで眺めていた。` },
        { sp: ch.name, text: lore.l3 },
        { sp: pName, text: `「${el.icon}${el.name}の力、いつも本当に心強い。これからも背中を任せるよ。」` },
        { sp: ch.name, text: `「ああ、もちろんだ！ ……受け取ってくれ、${pName}。俺たち二人の絆の証さ。」` }
      ]
    };
  }
  if (lv === 4) {
    return {
      title: `EP.3「ふたりだけの作戦会議」`,
      place: "📍 司令テント・星降る夜",
      lines: [
        { sp: "ナレーション", text: `他の隊員たちが眠りについた深夜。灯りの残る司令テントへ、${ch.name}が静かに顔を出した。` },
        { sp: ch.name, text: lore.l4 },
        { sp: pName, text: `「${ch.name}が傍にいてくれるだけで、不思議と肩の荷が軽くなるんだ。」` },
        { sp: ch.name, text: `「……同じ気持ちだよ、${pName}。明日の出撃も、誰より近くで支えてみせるから。」` }
      ]
    };
  }
  return {
    title: `FINAL EP「誓いの共鳴」`,
    place: "📍 霧の晴れた高台・夜明け",
    lines: [
      { sp: "ナレーション", text: `夜明けの光が大地を照らし始める中、${ch.name}はまっすぐな瞳でこちらを見つめた。` },
      { sp: ch.name, text: lore.l5 },
      { sp: pName, text: `「ありがとう、${ch.name}。どんな未来が待っていても、必ず一緒に切り拓こう。」` },
      { sp: "ナレーション", text: `二人のアーク結晶がまばゆく共鳴した――${ch.name}との絆が最高潮（Lv.5）へ到達した！` }
    ]
  };
}

// 所持キャラのみ抽出（主人公除外・編成中優先→絆pt順→レア度順）
function boGetOwnedBondChars() {
  boEnsureState();
  const ownedSet = new Set(state?.ownedChars || []);
  const partySet = new Set(state?.party || []);
  const rarOrder = { SSR: 4, SR: 3, R: 2, N: 1 };

  const all = Object.values(window.MF_DATA?.CHARACTERS || {}).filter(
    c => c && !c.isProtagonist && c.id !== "protagonist" && ownedSet.has(c.id)
  );

  return all.sort((a, b) => {
    const pa = partySet.has(a.id) ? 1 : 0;
    const pb = partySet.has(b.id) ? 1 : 0;
    if (pb !== pa) return pb - pa;
    const pta = boGetPts(a.id), ptb = boGetPts(b.id);
    if (ptb !== pta) return ptb - pta;
    return (rarOrder[b.rarity] || 0) - (rarOrder[a.rarity] || 0);
  });
}

function boHasUnreadEp(charId) {
  const lv = boGetLevel(charId);
  for (let i = 2; i <= lv; i++) {
    if (!boIsEpRead(charId, i)) return true;
  }
  return false;
}

// ---------- 💬 語らう ＆ 💐 ブーケ贈呈 ----------
function boTalkWithChar(charId) {
  boEnsureState();
  const today = boTodayStr();
  if (state[boTalkKeyCache] === today) {
    showToast("本日の無料『語らう』は実施済みです（明日また話しかけられます）");
    return;
  }
  state[boTalkKeyCache] = today;
  const ch = typeof getCharProfile === "function" ? getCharProfile(charId) : (window.MF_DATA?.CHARACTERS?.[charId] || { id: charId, name: charId });
  const res = boAddPts(charId, 3);
  if (typeof saveGame === "function") saveGame();
  if (typeof playSfx === "function") playSfx(res.leveledUp ? "win" : "gift");
  if (typeof renderTopBar === "function") renderTopBar();
  renderBondsViewOverhaul();

  if (res.leveledUp) {
    showToast(`💞 ${ch.name} 絆Lv.${res.nextLv}にアップ！新エピソードが解放されました！`);
  } else {
    showToast(`💬 ${ch.name}と語らった！（絆 +3pt ／ 現在 ${res.nextPt}/100）`);
  }
}

function boGiftBouquet(charId, qty = 1) {
  boEnsureState();
  const stock = Number(state[boGiftKeyCache] || 0);
  if (stock < qty) {
    showToast(`💐 アーク花のブーケが足りません（所持：${stock}個／補給ショップやクレスト交換所で入手可）`);
    return;
  }
  if (boGetPts(charId) >= 100) {
    showToast("👑 すでに絆Lv.5（MAX）に到達しています！");
    return;
  }
  state[boGiftKeyCache] = stock - qty;
  const ch = typeof getCharProfile === "function" ? getCharProfile(charId) : (window.MF_DATA?.CHARACTERS?.[charId] || { id: charId, name: charId });
  const res = boAddPts(charId, qty * 10);
  if (typeof saveGame === "function") saveGame();
  if (typeof playSfx === "function") playSfx(res.leveledUp ? "win" : "gift");
  if (typeof renderTopBar === "function") renderTopBar();
  renderBondsViewOverhaul();

  if (res.leveledUp) {
    showToast(`🎉 ${ch.name} 絆Lv.${res.nextLv}達成！エピソードが解放されました！`);
  } else {
    showToast(`💐 ${ch.name}にブーケ×${qty}を贈った！（絆 +${qty * 10}pt）`);
  }
}

// ---------- 📖 個別エピソード・ノベルリーダー ----------
function boOpenEpisode(charId, lv) {
  boEnsureState();
  if (boGetLevel(charId) < lv) {
    showToast(`🔒 絆Lv.${lv}（${BO_LEVEL_THRESHOLDS[lv]}pt）で解放されます`);
    return;
  }
  const ch = typeof getCharProfile === "function" ? getCharProfile(charId) : window.MF_DATA?.CHARACTERS?.[charId];
  if (!ch) return;
  const script = boBuildEpisodeScript(ch, lv);
  boActiveStory = { charId, ch, lv, script, lineIdx: 0 };
  if (typeof playSfx === "function") playSfx("switch");
  boRenderEpisodeModal();
}

function boRenderEpisodeModal() {
  if (!boActiveStory) return;
  let modal = document.getElementById("modal-bo-episode");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-bo-episode";
    modal.className = "modal-overlay";
    modal.style.zIndex = "2400";
    document.body.appendChild(modal);
  }

  const { ch, lv, script, lineIdx } = boActiveStory;
  const cur = script.lines[lineIdx] || script.lines[script.lines.length - 1];
  const isLast = lineIdx >= script.lines.length - 1;
  const portrait = window.MF_SPRITES?.portraitHTML ? window.MF_SPRITES.portraitHTML(ch, "contain") : `<div style="font-size:56px;">${ch.emoji || "👤"}</div>`;
  const alreadyRead = boIsEpRead(ch.id, lv);
  const rw = BO_EP_REWARDS[lv];

  modal.innerHTML = `
    <div class="modal-box bo-ep-box" onclick="event.stopPropagation()">
      <div class="top-row" style="margin-bottom:6px;">
        <span class="rank-pill" style="background:#f3cf00; color:#111;">絆Lv.${lv} ${boEsc(script.title)}</span>
        <button class="btn-xs" onclick="boCloseEpisodeModal()">閉じる ✕</button>
      </div>
      <div style="font-size:10.5px; color:var(--muted); text-align:left; margin-bottom:6px;">${boEsc(script.place)}</div>

      <div class="bo-ep-stage">
        <div class="bo-ep-portrait">${portrait}</div>
        <div class="bo-ep-progress">${lineIdx + 1} / ${script.lines.length}</div>
      </div>

      <div class="bo-ep-dialog">
        <div class="bo-ep-speaker">${boEsc(cur.sp)}</div>
        <div class="bo-ep-text">${boEsc(cur.text)}</div>
      </div>

      ${isLast && !alreadyRead ? `
        <div class="bo-ep-reward-preview">
          🎁 初読了ボーナス：${boEsc(rw.label)}
        </div>
      ` : ""}

      <div style="display:grid; grid-template-columns:1fr 2fr; gap:7px; margin-top:9px;">
        <button class="btn-xs" style="padding:10px;" ${lineIdx === 0 ? "disabled" : ""} onclick="boStepEpisode(-1)">◀ 戻る</button>
        <button class="${isLast ? "btn-accent2" : "btn-primary"}" style="padding:10px;" onclick="${isLast ? "boFinishEpisode()" : "boStepEpisode(1)"}">
          ${isLast ? (alreadyRead ? "✅ 読み終える" : "🎁 読了して報酬＆称号を受け取る！") : "次へ進む ▶"}
        </button>
      </div>
    </div>
  `;
  modal.classList.add("active");
}

function boStepEpisode(delta) {
  if (!boActiveStory) return;
  const max = boActiveStory.script.lines.length - 1;
  boActiveStory.lineIdx = Math.max(0, Math.min(max, boActiveStory.lineIdx + delta));
  if (typeof playSfx === "function") playSfx("tap");
  boRenderEpisodeModal();
}

function boFinishEpisode() {
  if (!boActiveStory) return;
  boEnsureState();
  const { charId, ch, lv } = boActiveStory;
  const key = `${charId}_${lv}`;
  const isFirst = !state.bondReadEps[key];
  state.bondReadEps[key] = true;

  let unlockedTitle = "";
  if (isFirst) {
    const rw = BO_EP_REWARDS[lv] || { gems: 100, tickets: 1, cores: 0 };
    state.gems = (state.gems || 0) + rw.gems;
    state.cardTickets = (state.cardTickets || 0) + rw.tickets;
    state.cores = (state.cores || 0) + rw.cores;

    const titles = boGetTitlesForChar(ch);
    if (lv === 3) unlockedTitle = titles.lv3;
    if (lv === 5) unlockedTitle = titles.lv5;
    if (unlockedTitle && !state[boTitlesKeyCache].includes(unlockedTitle)) {
      state[boTitlesKeyCache].push(unlockedTitle);
    }

    if (typeof saveGame === "function") saveGame();
    if (typeof playSfx === "function") playSfx("win");
    if (typeof renderTopBar === "function") renderTopBar();
    showToast(
      unlockedTitle
        ? `🏅 新称号『${unlockedTitle}』＆ 💎+${rw.gems} / 🎟️+${rw.tickets} 獲得！`
        : `🎁 エピソード読了！💎+${rw.gems} / 🎟️+${rw.tickets}${rw.cores ? ` / 💠+${rw.cores}` : ""}`
    );
  }

  boCloseEpisodeModal();
  renderBondsViewOverhaul();
}

function boCloseEpisodeModal() {
  boActiveStory = null;
  const modal = document.getElementById("modal-bo-episode");
  if (modal) modal.classList.remove("active");
}

// ---------- 🏅 獲得済み称号一覧・装備モーダル ----------
function boEquipTitle(titleStr) {
  boEnsureState();
  state.activeTitle = titleStr;
  if (typeof saveGame === "function") saveGame();
  if (typeof playSfx === "function") playSfx("gift");
  if (typeof renderTopBar === "function") renderTopBar();
  boOpenTitleModal();
  showToast(`🏅 称号を『${titleStr}』に変更しました！`);
}

function boOpenTitleModal() {
  boEnsureState();
  let modal = document.getElementById("modal-bo-titles");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-bo-titles";
    modal.className = "modal-overlay";
    modal.style.zIndex = "2350";
    modal.onclick = () => modal.classList.remove("active");
    document.body.appendChild(modal);
  }

  // すでにLv.3 / Lv.5読了済みなのに配列未登録の称号があれば自動補完
  const ownedChars = boGetOwnedBondChars();
  ownedChars.forEach(ch => {
    const t = boGetTitlesForChar(ch);
    if (boIsEpRead(ch.id, 3) && !state[boTitlesKeyCache].includes(t.lv3)) state[boTitlesKeyCache].push(t.lv3);
    if (boIsEpRead(ch.id, 5) && !state[boTitlesKeyCache].includes(t.lv5)) state[boTitlesKeyCache].push(t.lv5);
  });

  const unlocked = state[boTitlesKeyCache] || ["第7小隊・新任隊長"];
  const active = state.activeTitle || "第7小隊・新任隊長";

  modal.innerHTML = `
    <div class="modal-box" onclick="event.stopPropagation()" style="max-height:84dvh; overflow-y:auto;">
      <div class="top-row" style="margin-bottom:8px;">
        <strong style="font-size:14.5px;">🏅 獲得済み称号（${unlocked.length}種）</strong>
        <button class="btn-xs" onclick="document.getElementById('modal-bo-titles').classList.remove('active')">閉じる ✕</button>
      </div>
      <div style="font-size:11px; background:var(--surface-sub); border-radius:9px; padding:7px; margin-bottom:8px;">
        現在装備中：<strong>🏅 ${boEsc(active)}</strong>
      </div>
      <div style="display:flex; flex-direction:column; gap:6px;">
        ${unlocked.map(t => {
          const isEq = t === active;
          return `
            <div class="bo-title-row ${isEq ? "equipped" : ""}">
              <span style="font-size:11.5px; font-weight:900; text-align:left;">🏅 ${boEsc(t)}</span>
              <button class="btn-xs ${isEq ? "" : "btn-primary"}" ${isEq ? "disabled" : ""} onclick="boEquipTitle('${boEsc(t).replace(/'/g, "\\'")}')">
                ${isEq ? "装備中" : "装備する"}
              </button>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
  modal.classList.add("active");
  if (typeof playSfx === "function") playSfx("tap");
}

// ---------- 💞 絆メイン画面レンダリング（未所持キャラ完全除外） ----------
function boFindViewEl() {
  if (boViewIdCache) {
    const cached = document.getElementById(boViewIdCache);
    if (cached) return cached;
  }
  const ids = ["view-bonds", "view-bond", "view-affinity", "view-kizuna"];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) { boViewIdCache = id; return el; }
  }
  return null;
}

function renderBondsViewOverhaul() {
  if (typeof renderTopBar === "function") renderTopBar();
  boEnsureState();
  const sec = boFindViewEl();
  if (!sec) return;

  const ownedChars = boGetOwnedBondChars();
  const gifts = Number(state[boGiftKeyCache] || 0);
  const talkedToday = state[boTalkKeyCache] === boTodayStr();
  const partySet = new Set(state?.party || []);
  const maxBondCount = ownedChars.filter(c => boGetLevel(c.id) >= 5).length;
  const totalTitles = (state[boTitlesKeyCache] || []).length;

  sec.innerHTML = `
    <div class="card">
      <div class="section-title">
        <span>💞 隊員との絆・個別エピソード</span>
        <div style="display:flex; gap:5px;">
          <button class="btn-xs btn-accent2" onclick="boOpenTitleModal()">🏅 称号(${totalTitles})</button>
          <button class="btn-xs" onclick="switchView('home')">← 拠点へ</button>
        </div>
      </div>

      <div class="bo-summary-bar">
        <span>👥 所持隊員：<strong>${ownedChars.length}名</strong>（Lv.5到達 ${maxBondCount}名）</span>
        <span>💐 ブーケ：<strong>${gifts}個</strong></span>
        <span>💬 無料語らう：<strong>${talkedToday ? "✓本日済" : "✨利用可"}</strong></span>
      </div>
      <div style="font-size:10px; color:var(--muted); margin-bottom:8px; line-height:1.4;">
        ※所持中の隊員のみ表示されます。バトル出撃(+2pt)・語らう(+3pt)・ブーケ(+10pt)で絆Lv.5まで成長し、全4話のエピソードと2種の専用称号が解放されます！
      </div>

      ${ownedChars.length === 0 ? `
        <div style="text-align:center; padding:22px 10px; background:var(--surface-sub); border-radius:12px;">
          <div style="font-size:36px; margin-bottom:6px;">🛰️</div>
          <strong style="font-size:13px;">まだ仲間の隊員がいません</strong>
          <p style="font-size:11px; color:var(--muted); margin:5px 0 10px;">物語や軌道スカウトで仲間を増やすと、ここで絆を深められます！</p>
          <button class="btn-primary" onclick="switchView('gacha')">🛰️ 軌道スカウトへ</button>
        </div>
      ` : ownedChars.map(ch => {
        const pt = boGetPts(ch.id);
        const lv = boGetLevel(ch.id);
        const nextNeed = lv < 5 ? BO_LEVEL_THRESHOLDS[lv + 1] : 100;
        const prevNeed = BO_LEVEL_THRESHOLDS[lv];
        const pct = lv >= 5 ? 100 : Math.min(100, Math.round(((pt - prevNeed) / Math.max(1, nextNeed - prevNeed)) * 100));
        const titles = boGetTitlesForChar(ch);
        const el = window.MF_DATA?.ELEMENTS?.[ch.element] || { icon: "✨" };
        const inParty = partySet.has(ch.id);
        const unread = boHasUnreadEp(ch.id);
        const thumb = window.MF_SPRITES?.portraitHTML ? window.MF_SPRITES.portraitHTML(ch, "icon-lg") : `<div style="font-size:32px;">${ch.emoji || "👤"}</div>`;

        return `
          <div class="bo-char-card ${lv >= 5 ? "is-max" : ""} ${unread ? "has-unread" : ""}">
            <div style="display:flex; gap:9px; align-items:center;">
              ${thumb}
              <div style="flex:1; min-width:0; text-align:left;">
                <div class="top-row" style="margin-bottom:2px;">
                  <strong style="font-size:13px;">${el.icon} ${boEsc(ch.name)} ${inParty ? "<span class='tag' style='background:#18b88a;color:#fff;font-size:9px;'>編成中</span>" : ""}</strong>
                  <span class="rank-pill" style="background:${lv >= 5 ? "#f3cf00" : "var(--surface)"}; color:${lv >= 5 ? "#111" : "var(--ink)"};">💞 絆Lv.${lv}${lv >= 5 ? " MAX" : ""}</span>
                </div>
                <div style="font-size:10px; color:var(--muted); margin-bottom:3px;">
                  ${lv >= 5 ? "✨ 絆ポイント MAX（100 / 100）" : `絆Pt：${pt} / ${nextNeed}（次Lvまであと ${nextNeed - pt}pt）`}
                </div>
                <div class="gauge-bar" style="height:6px;">
                  <div style="background:${lv >= 5 ? "linear-gradient(90deg,#f3cf00,#ff7b39)" : "linear-gradient(90deg,#ff6b9d,#f3cf00)"}; width:${pct}%;"></div>
                </div>
              </div>
            </div>

            <div class="bo-ep-grid">
              ${[2, 3, 4, 5].map(epLv => {
                const unlocked = lv >= epLv;
                const read = boIsEpRead(ch.id, epLv);
                const badge = !unlocked ? `🔒Lv.${epLv}` : (read ? `✓EP${epLv - 1}` : `✨EP${epLv - 1}`);
                const sub = epLv === 3 ? "🏅称号" : (epLv === 5 ? "👑極称号" : `💎+${BO_EP_REWARDS[epLv].gems}`);
                return `
                  <button class="bo-ep-btn ${unlocked ? (read ? "read" : "ready") : "locked"}" onclick="boOpenEpisode('${ch.id}', ${epLv})">
                    <strong>${badge}</strong>
                    <span>${sub}</span>
                  </button>
                `;
              }).join("")}
            </div>

            <div class="bo-title-preview">
              <span>Lv.3：${boIsEpRead(ch.id, 3) ? `🏅<b>${boEsc(titles.lv3)}</b>` : `🔒 ${boEsc(titles.lv3)}`}</span>
              <span>Lv.5：${boIsEpRead(ch.id, 5) ? `👑<b>${boEsc(titles.lv5)}</b>` : `🔒 ${boEsc(titles.lv5)}`}</span>
            </div>

            ${lv < 5 ? `
              <div style="display:grid; grid-template-columns:1fr 1fr 0.9fr; gap:5px; margin-top:7px;">
                <button class="btn-xs ${talkedToday ? "" : "btn-primary"}" style="padding:6px 2px;" ${talkedToday ? "disabled" : ""} onclick="boTalkWithChar('${ch.id}')">
                  💬 語らう(+3)
                </button>
                <button class="btn-xs ${gifts >= 1 ? "btn-accent2" : ""}" style="padding:6px 2px;" ${gifts >= 1 ? "" : "disabled"} onclick="boGiftBouquet('${ch.id}', 1)">
                  💐 贈る(+10)
                </button>
                <button class="btn-xs ${gifts >= 5 ? "btn-accent2" : ""}" style="padding:6px 2px;" ${gifts >= 5 ? "" : "disabled"} onclick="boGiftBouquet('${ch.id}', 5)">
                  💐×5(+50)
                </button>
              </div>
            ` : `
              <div style="font-size:10.5px; font-weight:900; color:#f3cf00; text-align:center; margin-top:6px;">
                👑 絆Lv.5 到達済み！全エピソード＆極・専用称号を解放！
              </div>
            `}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

// ---------- 既存 bonds.js / switchView / battle勝利 への安全フック ----------
(function installBondsOverhaulHooks() {
  ["renderBondsView", "renderBondView", "renderAffinityView"].forEach(fnName => {
    window[fnName] = renderBondsViewOverhaul;
  });

  if (typeof window.switchView === "function" && !window.switchView._boHooked) {
    const origSwitch = window.switchView;
    window.switchView = function(viewId) {
      const r = origSwitch.apply(this, arguments);
      if (/bond|affin|kizuna/i.test(String(viewId || ""))) {
        setTimeout(() => renderBondsViewOverhaul(), 0);
      }
      return r;
    };
    window.switchView._boHooked = true;
  }

  // バトル勝利時に編成中の所持隊員へ絆+2ptを自動加算
  if (typeof window.finishBattle === "function" && !window.finishBattle._boHooked) {
    const origFinish = window.finishBattle;
    window.finishBattle = function(isWin) {
      const wasFinished = typeof btl !== "undefined" && btl && btl.finished;
      const r = origFinish.apply(this, arguments);
      if (isWin && !wasFinished && typeof state !== "undefined" && state) {
        const owned = new Set(state.ownedChars || []);
        (state.party || []).forEach(id => {
          if (id !== "protagonist" && owned.has(id)) boAddPts(id, 2);
        });
        if (typeof saveGame === "function") saveGame();
      }
      return r;
    };
    window.finishBattle._boHooked = true;
  }
})();

window.boTalkWithChar = boTalkWithChar;
window.boGiftBouquet = boGiftBouquet;
window.boOpenEpisode = boOpenEpisode;
window.boStepEpisode = boStepEpisode;
window.boFinishEpisode = boFinishEpisode;
window.boCloseEpisodeModal = boCloseEpisodeModal;
window.boOpenTitleModal = boOpenTitleModal;
window.boEquipTitle = boEquipTitle;
window.renderBondsViewOverhaul = renderBondsViewOverhaul;
