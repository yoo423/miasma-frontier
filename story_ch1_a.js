window.MF_STORY_CH1_A = [
  {
    id: "ch1_ep1", chapter: "第一話", title: "白き天蓋の黄昏", subtitle: "方舟都市リベルタ・第7小隊招集",
    battleEnemyId: null, reward: { gems: 160, credits: 2500, books: 6, cores: 1 },
    scenes: [
      { bg: "ark_night", bgm: "story", speaker: "narrator", text: "雲海の上、高度三千メートルに浮かぶ白亜の巨艦都市——方舟都市リベルタ。" },
      { bg: "ark_night", speaker: "narrator", text: "百年前のあの日、未知の結晶『アーク』が暴走し、大地は紫色の瘴霧『ミアズマ』に呑み込まれた。生き残った人類は空へ逃れ、以来一度も土を踏まずに生きている。" },
      { bg: "ark_night", sfx: "alarm", fx: "redflash", speaker: "narrator", text: "……だが、都市の底から響く低い振動音が、偽りの平穏の終わりを告げていた。" },
      { bg: "ark_night", speaker: "chloe", text: "……ふぁ。お疲れさまです、新任の隊長さん。中央司令室の記録官、クロエです。単刀直入に言いますね。" },
      { bg: "ark_night", speaker: "chloe", text: "この方舟都市を空に浮かべている中央アーク炉の寿命は、もう長くて数年です。交換用の高純度結晶は、地上にしか残っていません。" },
      { bg: "ark_night", speaker: "aoi", text: "だからこそ、私たち『クリアラー（霧祓い）』の出番なんです！地上へ降り、浄化ビーコンを広げて、人類が暮らせる大地を取り戻します！" },
      { bg: "ark_night", speaker: "valeria", text: "意気込みだけは立派ですわね。ですが忘れないでいただきたい。過去三度の降下作戦は、いずれも濃霧と巨大な霧獣に阻まれ撤退を強いられましたのよ。" },
      { bg: "ark_night", speaker: "aoi", text: "それは……存じております、ヴァレリア先輩。でも、私たちの小隊には新しい隊長がいます！" },
      { bg: "ark_night", speaker: "momo", text: "そうだよっ！難しい顔してても始まんないって！あたし、ずっと本物の森とか川とか見てみたかったんだー！" },
      { bg: "ark_night", speaker: "mint", text: "……モモ、声が反響してる。でも、わたしも同じ。空の上で朽ちるのを待つくらいなら、降りて確かめたい。" },
      { bg: "ark_night", speaker: "valeria", text: "ふふ……どうやら、面白い顔ぶれが揃ったようですわね。第7クリアラー小隊、その手並みを見せてもらいましょう。" },
      {
        bg: "ark_night", speaker: "protagonist", text: "司令室の窓越しに、見渡す限りの雲海が広がっている。いよいよ明朝、第7小隊の降下作戦が始まる。",
        choices: [
          { label: "「必ず全員で生きて、この手で大地を取り戻そう」", replySpeaker: "aoi", reply: "はいっ！隊長、その言葉を胸に、明日の降下に臨みます！", bondChar: "aoi" },
          { label: "「まずは一歩ずつだ。みんなの力を合わせれば越えられる」", replySpeaker: "mint", reply: "……うん。無理をしない指揮官なら、背中を預けられるよ。", bondChar: "mint" }
        ]
      },
      { bg: "ark_night", sfx: "comm", speaker: "chloe", text: "あ、最後にもうひとつだけ。……最近、地上を覆う紫の霧の奥で、奇妙な『黄金の光』が観測されています。くれぐれも、気をつけて。" }
    ]
  },
  {
    id: "ch1_ep2", chapter: "第二話", title: "雲海を越えて", subtitle: "第7降下ポッド・ヴェルデ平原着地",
    reqClear: "ch1_ep1", battleEnemyId: null, reward: { gems: 160, credits: 2500, books: 6, cores: 1 },
    scenes: [
      { bg: "pod", bgm: "tension", sfx: "alarm", speaker: "narrator", text: "翌朝、第7降下ドック。金属の隔壁が軋み、降下ポッドの固定ロックが次々と外れていく。" },
      { bg: "pod", speaker: "aoi", text: "降下ハッチ開放まで残り十五秒！各員、シートベルトと戦術リンク端末の装着を確認してください！" },
      { bg: "pod", speaker: "momo", text: "うわぁー、心臓バクバクしてきた！ねえミント、怖くないの！？" },
      { bg: "pod", speaker: "mint", text: "……少しだけ。でも、長い耳を塞げば風の音も気にならない。隊長、カウントを。" },
      { bg: "pod", sfx: "boom", fx: "shake", speaker: "narrator", text: "轟音とともに底が抜けるような無重力感。降下ポッドは真っ白な雲海を突き破り、百年間忘れられた大地へと落ちていく。" },
      { bg: "verde_morning", bgm: "story", sfx: "boom", fx: "flash", speaker: "narrator", text: "逆噴射の衝撃が収まり、ハッチがゆっくりと開いた。流れ込んできたのは、方舟の空調とはまるで違う、土と青葉の匂いだった。" },
      { bg: "verde_morning", speaker: "aoi", text: "外気成分チェック……異常なし！瘴霧濃度は規定値以下、マスクなしで呼吸できます！" },
      { bg: "verde_morning", speaker: "momo", text: "うわぁ……すごいっ！！見てよみんな、崩れたビルの壁じゅうにツタが巻きついて、真っ白な花が咲いてるよ！" },
      { bg: "verde_morning", speaker: "narrator", text: "かつて人間が暮らしていた街の跡地『ヴェルデ平原』。傾いた高層ビルの間から、朝日が霧の合間を縫って差し込んでいた。" },
      { bg: "verde_morning", speaker: "mint", text: "……きれい。写真データで見た昔の世界より、ずっと静かで……生きてる感じがする。" },
      { bg: "verde_morning", sfx: "comm", speaker: "chloe", text: "こちら方舟司令部。降下成功を確認しました。まずは周囲の安全を確保し、仮設キャンプ予定地まで前進してください。" },
      {
        bg: "verde_morning", speaker: "protagonist", text: "人類の新たな一歩となる大地。足元の草を踏みしめ、小隊に前進を命じる。",
        choices: [
          { label: "「歴史的な一歩だ。気を引き締めて進もう」", replySpeaker: "aoi", reply: "了解しました！私が周囲の視界を警戒します！", bondChar: "aoi" },
          { label: "「モモ、あんまり遠くへ駆け出すなよ」", replySpeaker: "momo", reply: "えへへ、バレた？ちゃんと隊長の見える範囲を走るよ！", bondChar: "momo" }
        ]
      },
      { bg: "forest_mist", bgm: "tension", speaker: "mint", text: "……待って。風が止んだ。草むらの奥から、いくつもの低い唸り声が近づいてる。" }
    ]
  },
  {
    id: "ch1_ep3", chapter: "第三話", title: "紫の牙、最初の試練", subtitle: "ヴェルデ大通り・ミアズマ・ウルフ迎撃",
    reqClear: "ch1_ep2", battleEnemyId: "wolf_pack", reward: { gems: 180, credits: 3200, books: 8, cores: 2 },
    scenes: [
      { bg: "forest_mist", bgm: "tension", speaker: "narrator", text: "崩れた高架橋の影から、四つ足の獣たちが音もなく姿を現した。背中の体毛には、毒々しい紫色のアーク結晶が突き出している。" },
      { bg: "forest_mist", sfx: "roar", fx: "shake", speaker: "aoi", text: "生体反応捕捉！瘴霧に適応し凶暴化した原生獣——『ミアズマ・ウルフ』の群れです！" },
      { bg: "forest_mist", speaker: "momo", text: "うわっ、目がギラギラしてる！でもあたし、負けないよ！双剣の切れ味、見せてやるんだから！" },
      { bg: "forest_mist", speaker: "mint", text: "モモ、突っ込まないで。あいつら、群れで囲んで一斉に飛びかかるつもり。動きの予兆をよく見ないと危ない。" },
      { bg: "forest_mist", sfx: "comm", speaker: "chloe", text: "隊長、各隊員の戦術リンクを同期しました！属性を重ねて『元素反応』を起こせば、結晶化した外皮も一気に貫けます！" },
      { bg: "forest_mist", speaker: "aoi", text: "敵が攻撃態勢に入りました！無理に攻め込むより、防御と反撃を織り交ぜながら確実に仕留めましょう！" },
      { bg: "forest_mist", speaker: "momo", text: "あたしの炎とミントの風を合わせたら、すごい勢いで燃え広がるよね！？" },
      { bg: "forest_mist", speaker: "mint", text: "……うん。隊長の合図に合わせて撃つよ。" },
      {
        bg: "forest_mist", speaker: "protagonist", text: "狼の群れが一斉に牙を剥く。第7クリアラー小隊、地上での初陣だ。",
        choices: [
          { label: "「炎と風の連携で一気に焼き払うぞ！」", replySpeaker: "momo", reply: "任せて隊長！先陣はあたしが切るよっ！", bondChar: "momo" },
          { label: "「敵の飛びかかりを見切って、確実にカウンターを叩き込め！」", replySpeaker: "mint", reply: "……冷静な指示。敵の重心移動はわたしが全部読んであげる。", bondChar: "mint" }
        ]
      },
      { bg: "danger", sfx: "roar", fx: "redflash", speaker: "protagonist", text: "全員、戦術リンク展開！ミアズマ・ウルフの群れを迎撃する！" }
    ]
  },
  {
    id: "ch1_ep4", chapter: "第四話", title: "前線キャンプと焚き火の夜", subtitle: "後続設営班合流・浄化ビーコン起動",
    reqClear: "ch1_ep3", battleEnemyId: null, reward: { gems: 180, credits: 3500, books: 10, cores: 2 },
    scenes: [
      { bg: "camp_dusk", bgm: "home", speaker: "narrator", text: "ウルフの群れを退け、開けた広場を確保した頃。夕焼けの空から二機の大型輸送ポッドが舞い降りた。" },
      { bg: "camp_dusk", sfx: "boom", fx: "shake", speaker: "koharu", text: "ガガガッ……よし、自動採掘リグのアンカー固定完了！お待たせ隊長、後続の設営班、到着したよーっ！" },
      { bg: "camp_dusk", speaker: "kaede", text: "はーい、移動厨房も展開オッケー！初陣お疲れさまのみんなに、特製のアーク香草グリルを焼いておいたよ！" },
      { bg: "camp_dusk", speaker: "momo", text: "わぁぁっ！いい匂い！！カエデさんのご飯、地上で食べると百倍おいしそうだよ！" },
      { bg: "camp_dusk", speaker: "koharu", text: "さあさあ、仕上げにこの『浄化ビーコン』を起動するね！スイッチ……オンっ！" },
      { bg: "camp_night", bgm: "story", sfx: "guard", fx: "flash", speaker: "narrator", text: "淡い翠の光が広場全体へ広がり、立ち込めていた紫の霧がすうっと押し戻されていく。頭上に現れたのは、方舟の天蓋では見られなかった本物の満天の星だった。" },
      { bg: "camp_night", speaker: "aoi", text: "……すごい。あんなにたくさんの星が、本当に空に浮かんでいたんですね……。" },
      { bg: "camp_night", speaker: "mint", text: "……暖かい。焚き火のパチパチいう音、ずっと聞いていたいかも。" },
      { bg: "camp_night", speaker: "kaede", text: "ほらほら、冷めないうちに食べて！地上で採れた香草を混ぜたら、びっくりするくらい香りが出たのよ。" },
      { bg: "camp_night", speaker: "momo", text: "もぐもぐ……っ！うまっ！！方舟の栄養ブロックと全然違うよ！これなら明日も百匹くらい倒せそう！" },
      { bg: "camp_night", speaker: "koharu", text: "あはは、頼もしいなぁ。あ、そうそう隊長。キャンプの自動生産ラインと鍛造設備も動かせるようになったから、いつでも使ってね！" },
      { bg: "camp_night", speaker: "narrator", text: "やがて夜が更け、隊員たちがテントへ戻った後も、焚き火のそばにはカエデとコハルが残っていた。" },
      {
        bg: "camp_night", speaker: "kaede", text: "隊長もまだ起きてたんだね。熱いお茶、淹れようか？……明日からはいよいよ平原の奥へ踏み込むけど、正直どう思ってる？",
        choices: [
          { label: "「いつかこの平原に、みんなが笑って暮らせる街を作りたい」", replySpeaker: "kaede", reply: "ふふっ、素敵な夢だね。じゃあ私、その街一番の食堂を開く準備をしておかなきゃ！", bondChar: "kaede" },
          { label: "「まだ見ぬ強敵に備えて、小隊の力をしっかり鍛え上げる」", replySpeaker: "koharu", reply: "うんっ！最強の武器と防具を鍛えられるように、あたしも工房をフル稼働させるよ！", bondChar: "koharu" }
        ]
      },
      { bg: "camp_night", speaker: "koharu", text: "それにしても……さっきから工房の計測器が、北の森と東の遺跡の方角から変な磁気ノイズを拾ってるんだよね。明日の朝、調べてみようか。" }
    ]
  },
  {
    id: "ch1_ep5", chapter: "第五話", title: "胞子の森の異変", subtitle: "北部林道の浄化調査・瘴霧胞子討伐",
    reqClear: "ch1_ep4", battleEnemyId: "spore_slime", reward: { gems: 200, credits: 3800, books: 10, cores: 2 },
    scenes: [
      { bg: "verde_morning", bgm: "story", speaker: "narrator", text: "地上二日目の朝。朝霧が晴れる前に、第7小隊はキャンプ北側の林道へ調査に出発した。" },
      { bg: "forest_mist", speaker: "aoi", text: "浄化ビーコンの有効範囲を広げるには、この林道に中継リレーを設置する必要があります。……あれ、空気が急に重くなってきました。" },
      { bg: "forest_mist", speaker: "mint", text: "……見て。木々の根元に、見たことのない大きなキノコみたいな塊がびっしり生えてる。しかも、脈打ってる。" },
      { bg: "forest_mist", speaker: "momo", text: "うわっ、ぷよぷよ光っててちょっと美味し……いや、絶対食べちゃダメな色してるね！？" },
      { bg: "forest_mist", sfx: "comm", speaker: "chloe", text: "映像を確認しました！それは瘴霧を濃縮して撒き散らす植物型霧獣『瘴霧胞子・マッシュ』です！" },
      { bg: "forest_mist", bgm: "tension", speaker: "chloe", text: "放置すると周囲の霧濃度が一気に跳ね上がります。頭部の『発光胞子笠』を破壊できれば、胞子散布を止められるはずです！" },
      { bg: "forest_mist", speaker: "aoi", text: "なるほど、部位破壊が鍵ですね！しかもさっきの狼より、ずっと耐久力が高そうです……。" },
      { bg: "forest_mist", speaker: "momo", text: "へっへーん、昨日の夜からちゃんと訓練してきたもんね！焦らずに弱点を狙っていこう！" },
      {
        bg: "forest_mist", speaker: "protagonist", text: "巨大な胞子塊が震え、紫の霧を吐き出そうとしている。狙いを定めて指示を出すぞ。",
        choices: [
          { label: "「発光胞子笠を集中攻撃して、部位破壊を狙う！」", replySpeaker: "mint", reply: "……了解。笠の付け根に照準を合わせる。一息に撃ち抜くよ。", bondChar: "mint" },
          { label: "「持久戦に備えて回復とバリアを切らさず戦おう」", replySpeaker: "aoi", reply: "堅実な判断です！守りを固めながら確実に削り切りましょう！", bondChar: "aoi" }
        ]
      },
      { bg: "danger", sfx: "roar", fx: "shake", speaker: "protagonist", text: "林道を浄化する！瘴霧胞子・マッシュ、討伐開始！" }
    ]
  },
  {
    id: "ch1_ep6", chapter: "第六話", title: "東遺跡からの救難信号", subtitle: "深夜の緊急信号弾・濃霧地帯への出撃",
    reqClear: "ch1_ep5", battleEnemyId: null, reward: { gems: 180, credits: 4200, books: 12, cores: 2 },
    scenes: [
      { bg: "camp_night", bgm: "story", speaker: "narrator", text: "北部林道の中継リレー設置を終え、キャンプへ戻ったその夜。静寂を切り裂く甲高い音が東の夜空に響いた。" },
      { bg: "camp_night", bgm: "tension", sfx: "alarm", fx: "redflash", speaker: "mint", text: "……隊長！みんな起きて！東の旧遺跡の方角に、赤い緊急信号弾が上がった！" },
      { bg: "camp_night", speaker: "aoi", text: "赤の信号弾……先遣調査に出ていた別働隊が孤立しています！すぐに救援へ向かわないと！" },
      { bg: "camp_night", speaker: "kaede", text: "大変！携帯用の回復食糧をすぐバッグに詰めるから持って行って！無理だけはダメだよ！" },
      { bg: "camp_night", sfx: "comm", speaker: "chloe", text: "緊急通信です！東遺跡で調査中だった前衛エースのルナリアさんと、氷華使いのミコトさんからの救難信号を確認しました！" },
      { bg: "camp_night", speaker: "momo", text: "あのルナリアさんが助けを呼ぶなんて、よっぽどヤバい霧獣が出たんだね……！急ごう隊長！" },
      { bg: "ruins_fog", speaker: "narrator", text: "濃霧の立ち込める旧市街の瓦礫を駆け抜け、第7小隊は東遺跡の崩落広場へと飛び込んだ。" },
      { bg: "ruins_fog", sfx: "slash", fx: "flash", speaker: "lunaria", text: "くっそぉ……っ！何回叩き込んでも弾かれるなんて、なんて硬い甲殻してんのよ、このデカ虫ぃ！！" },
      { bg: "ruins_fog", speaker: "mikoto", text: "ルナリア殿、感情任せに大剣を振るっては腕を痛めますわ。……あら、霧の向こうから清らかな気配。援軍のようですね。" },
      { bg: "ruins_fog", speaker: "lunaria", text: "あんたたちが新任の第7小隊！？いいところに来たわね！この結晶甲虫『重装種』、あたしたち二人じゃ完全に囲まれちゃってさ！" },
      { bg: "ruins_fog", speaker: "mikoto", text: "初めまして、第7小隊の隊長殿。私はミコトと申します。敵は甲殻を硬質化させ、通常の攻撃をことごとく半減してしまいますの。" },
      {
        bg: "ruins_fog", speaker: "lunaria", text: "さあ新人隊長、あんたの指揮を見せてもらおうじゃない！この鉄壁の化け物、どうやってブチ抜く気！？",
        choices: [
          { label: "「ミコトの氷とルナリアの炎で『融解』を起こし、装甲ごと焼き切る！」", replySpeaker: "lunaria", reply: "はっ、最高じゃない！あんた、あたしと気が合いそうね！", bondChar: "lunaria" },
          { label: "「殻を固めた瞬間に『崩し』戦技を叩き込み、体勢ごと粉砕する！」", replySpeaker: "mikoto", reply: "お見事な戦術眼ですこと。では、私の氷華で隙を作りましょう。", bondChar: "mikoto" }
        ]
      },
      { bg: "ruins_fog", sfx: "roar", fx: "shake", speaker: "narrator", text: "体長五メートルを超える巨大な甲虫が、結晶の殻を軋ませながらこちらへ向き直った。" }
    ]
  },
  {
    id: "ch1_ep7", chapter: "第七話", title: "紅蓮の刃、白銀の氷華", subtitle: "東遺跡共闘・結晶甲虫重装種討伐",
    reqClear: "ch1_ep6", battleEnemyId: "crystal_beetle", reward: { gems: 240, credits: 5200, books: 14, cores: 3 },
    scenes: [
      { bg: "ruins_fog", bgm: "tension", speaker: "narrator", text: "結晶甲虫・重装種。体表のアーク結晶が分厚い装甲を形成し、並のハンターでは傷ひとつ付けられない精鋭個体だ。" },
      { bg: "ruins_fog", speaker: "lunaria", text: "いい？こいつ、体力が半分を切ると急に凶暴化して手がつけられなくなるわ！油断したら一瞬でやられるからね！" },
      { bg: "ruins_fog", speaker: "mikoto", text: "ええ。攻撃の予兆を見逃さず、防御と反撃、そして『崩し』の連携で確実に体勢を奪うことが勝利の鍵となります。" },
      { bg: "ruins_fog", speaker: "aoi", text: "背中の『高純度結晶殻』を部位破壊できれば、敵の防御力も大きく落ちるはずです！" },
      { bg: "ruins_fog", speaker: "momo", text: "ルナリアさんとミコトさんと一緒に戦えるなんて心強いよ！絶対に勝とうね、隊長！" },
      { bg: "ruins_fog", speaker: "lunaria", text: "ふん、あたしに遅れずについてきなさいよ！……行くわよ、隊長！" },
      { bg: "danger", sfx: "roar", fx: "redflash", speaker: "protagonist", text: "第7小隊、ルナリア・ミコトと連携展開！結晶甲虫・重装種を打ち砕く！" }
    ]
  },
  {
    id: "ch1_ep8", chapter: "第八話", title: "地下データ室の禁書", subtitle: "百年前『アーク計画』の封印記録",
    reqClear: "ch1_ep7", battleEnemyId: null, reward: { gems: 220, credits: 5500, books: 16, cores: 3 },
    scenes: [
      { bg: "ruins_fog", bgm: "story", speaker: "narrator", text: "激闘の末、結晶甲虫が砕け散った。瓦礫の奥に口を開けていたのは、百年前の地下研究施設への階段だった。" },
      { bg: "ark_night", speaker: "valeria", text: "遅れて申し訳ありませんわ。方舟騎士団より追って参りましたヴァレリアです。……先ほどの連携、実に見事でしたわね。" },
      { bg: "ark_night", speaker: "lunaria", text: "お堅い騎士団のお嬢様まで来たの？まあいいや、クロエ、あんたが探してた記録端末ってこれのことでしょ？" },
      { bg: "ark_night", sfx: "comm", speaker: "chloe", text: "そうです！すぐ遠隔アクセスしますね……暗号化が何重にも掛かってる……よし、解除しました！" },
      { bg: "ark_night", bgm: "tension", sfx: "comm", speaker: "chloe", text: "……え？嘘……これ、司令部の公文書と全然違うことが書かれています……皆さん、静かに聞いてください。" },
      { bg: "ark_night", speaker: "narrator", text: "ノイズ混じりの古い音声ログが、薄暗い地下室に響き渡った。" },
      { bg: "ark_night", speaker: "chloe", text: "『……西暦最終記録。地殻深部より覚醒した巨大生体群——我々が“主霧獣”と呼ぶ災厄を、現代兵器では止められない』" },
      { bg: "ark_night", speaker: "chloe", text: "『人類滅亡を防ぐ最後の選択として、我々はアーク結晶を意図的に暴走させ、大地全体を瘴霧ミアズマで覆い、奴らを強制冬眠へ封じ込める——』" },
      { bg: "ark_night", sfx: "boom", fx: "shake", speaker: "lunaria", text: "はぁっ！？ちょっと待ってよ！ミアズマって事故じゃなかったの！？バケモノを眠らせるための『封印』だったってこと！？" },
      { bg: "ark_night", speaker: "valeria", text: "……つまり、私たちが浄化ビーコンで霧を晴らせば晴らすほど、百年間眠り続けていた主霧獣たちが目を覚ます、ということですわね。" },
      { bg: "ark_night", speaker: "aoi", text: "そんな……じゃあ、私たちがやっていたことは……！" },
      { bg: "ark_night", speaker: "mikoto", text: "落ち着いてくださいませ。方舟都市の中央炉が限界である以上、空に留まれば人類は滅びます。……退く道は、もう残されていないのです。" },
      { bg: "ark_night", speaker: "mikoto", text: "封印を解くことになっても、目覚めた主霧獣をこの手で討ち果たす。それしか、私たちが明日を掴む術はありません。" },
      {
        bg: "ark_night", speaker: "chloe", text: "隊長……残酷な真実を知ってしまった今、あなたはどう決断しますか？",
        choices: [
          { label: "「封印に頼る時代を終わらせる。俺たちの手で本当の地上を取り戻す」", replySpeaker: "valeria", reply: "……見事な覚悟ですわ。その言葉に免じて、このヴァレリアの槍をあなたに預けましょう。", bondChar: "valeria" },
          { label: "「クロエ、解析を続けてくれ。主霧獣を倒す手がかりを見つけよう」", replySpeaker: "chloe", reply: "……はいっ！隊長が諦めないなら、私も徹夜してでも弱点を見つけ出します！", bondChar: "chloe" }
        ]
      },
      { bg: "ark_night", speaker: "narrator", text: "重い真実を胸に刻み、第7小隊は地上への階段を駆け上がった。" }
    ]
  },
  {
    id: "ch1_ep9", chapter: "第九話", title: "揺れる信念と北の咆哮", subtitle: "キャンプ帰還・黄金の異変警報",
    reqClear: "ch1_ep8", battleEnemyId: null, reward: { gems: 200, credits: 5800, books: 16, cores: 3 },
    scenes: [
      { bg: "camp_dusk", bgm: "story", speaker: "narrator", text: "東遺跡からキャンプへ戻った夕暮れ。重苦しい沈黙が漂う中、カエデが人数分の温かいスープを配って回った。" },
      { bg: "camp_dusk", speaker: "kaede", text: "難しい話はよくわかんないけどさ。空の上で怖がりながら待つより、みんなとここで戦う方がずっとずっといいって、私は思うよ。" },
      { bg: "camp_dusk", speaker: "momo", text: "うんっ！どんなにデカい主霧獣が起きたって、ルナリアさんもミコトさんもヴァレリアさんも、みんな一緒だもんね！" },
      { bg: "camp_dusk", speaker: "lunaria", text: "べ、別にあたしは第7小隊の部下になったわけじゃないんだからね！……でもまあ、あんたの指揮なら背中を任せてあげてもいいわよ。" },
      { bg: "camp_dusk", speaker: "mikoto", text: "ふふ、ルナリア殿も素直になられましたね。……ですが隊長殿、ひとつ気掛かりなことがございます。" },
      { bg: "camp_dusk", speaker: "mikoto", text: "先ほどクロエ殿が仰っていた『黄金の霧』……あれは百年前の記録には一切記されていなかった異常現象なのです。" },
      { bg: "camp_dusk", bgm: "tension", sfx: "alarm", fx: "redflash", speaker: "koharu", text: "隊長っ！！大変だよ！！北部林道に置いた浄化ビーコンの出力が急低下してる！何か巨大な獣が体当たりしてるみたい！" },
      { bg: "camp_dusk", speaker: "mint", text: "……聞こえる。遠くから地面を抉るような激しい鼻息と、金属みたいな甲高い咆哮……！" },
      { bg: "camp_dusk", sfx: "comm", speaker: "chloe", text: "エネルギー反応が異常値です！通常の霧獣じゃない……体内に過剰なアーク光を溜め込んだ変異個体が接近しています！" },
      {
        bg: "camp_dusk", speaker: "protagonist", text: "キャンプを守る浄化ビーコンが破壊されれば、一帯が再び濃霧に呑まれてしまう。",
        choices: [
          { label: "「すぐに出撃してビーコンを守り抜くぞ！」", replySpeaker: "koharu", reply: "ありがとう隊長！あたしが組んだ大事なビーコン、絶対に壊させない！", bondChar: "koharu" },
          { label: "「変異個体の可能性がある。全員、防御と回復の準備を万全にしろ」", replySpeaker: "valeria", reply: "的確な指示ですわ。決して侮らず、万全の陣形で迎撃いたしましょう。", bondChar: "valeria" }
        ]
      },
      { bg: "forest_mist", sfx: "roar", fx: "shake", speaker: "narrator", text: "夕闇の迫る北部森林へ急行した小隊の前に、黄金色の火花を散らす巨大な牙が立ち塞がった。" }
    ]
  },
  {
    id: "ch1_ep10", chapter: "第十話", title: "黄金の牙、暴走の予兆", subtitle: "前編クライマックス・苔むした大猪ブル討伐",
    reqClear: "ch1_ep9", battleEnemyId: "forest_boar", reward: { gems: 320, credits: 7500, books: 22, cores: 4 },
    scenes: [
      { bg: "forest_mist", bgm: "tension", speaker: "narrator", text: "巨木をなぎ倒しながら突進してくる巨大な猪型霧獣——『苔むした大猪・ブル』。その鋭い牙の先端が、異様な黄金色に明滅していた。" },
      { bg: "forest_mist", sfx: "roar", fx: "shake", speaker: "momo", text: "うわぁっ、木が一撃で真っ二つになったよ！？あんなのに正面からぶつかったらひとたまりもないよ！" },
      { bg: "forest_mist", sfx: "comm", speaker: "chloe", text: "観測データと一致！アーク結晶の光を過剰摂取して暴走する現象……『融光化』の初期段階です！" },
      { bg: "forest_mist", speaker: "koharu", text: "あの『硬質の大牙』にエネルギーが集中してる！牙を部位破壊できれば、突進の威力をガクッと落とせるはずだよ！" },
      { bg: "forest_mist", speaker: "lunaria", text: "なるほど、牙を折っちまえばいいのね！それに、あんな大振りの突進、見切ってカウンターを合わせれば逆に大チャンスじゃない！" },
      { bg: "forest_mist", speaker: "aoi", text: "敵の攻撃力が尋常ではありません！隊員たちの育成と装備の力、すべてを出し切る時です！" },
      {
        bg: "forest_mist", speaker: "protagonist", text: "大猪が前脚で地面を掻き、猛烈な突進の構えに入った。この試練を越えるぞ！",
        choices: [
          { label: "「ターゲットは『硬質の大牙』！集中砲火で叩き折る！」", replySpeaker: "koharu", reply: "よっし！砕いた牙から最高の武器を鍛えてあげるから、気合入れていこう！", bondChar: "koharu" },
          { label: "「突進を防御とカウンターで受け止め、元素連携で逆転する！」", replySpeaker: "mikoto", reply: "見事な策ですわ。暴走する力ほど、受け流した時の反動は大きくなります。", bondChar: "mikoto" }
        ]
      },
      { bg: "danger", sfx: "roar", fx: "redflash", speaker: "protagonist", text: "浄化ビーコンを守り抜け！第7クリアラー小隊、総員迎撃開始！" }
    ],
    epilogue: [
      { bg: "camp_night", bgm: "story", speaker: "narrator", text: "黄金の火花が霧散し、巨大な大猪がついに大地へ崩れ落ちた。浄化ビーコンは辛うじて無傷だった。" },
      { bg: "camp_night", speaker: "koharu", text: "はぁ〜、助かったぁ……！でも見て隊長、大猪が倒れた地面の下から、すごく深い地鳴りが響いてこない？" },
      { bg: "camp_night", bgm: "tension", sfx: "boom", fx: "shake", speaker: "narrator", text: "ゴゴゴゴ……ッ！平原の中央地下から、まるで巨大な心臓が鼓動するような重い振動が足裏を突き上げた。" },
      { bg: "camp_night", sfx: "comm", speaker: "celestia", text: "……緊急割り込み通信。高台より狙撃観測中のセレスティアです。第7小隊、休んでいる時間はありません。平原の『主』が、目を覚まそうとしています。" }
    ]
  }
];
