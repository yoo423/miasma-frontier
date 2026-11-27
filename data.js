window.MF_DATA = {
  APP_VERSION: "3.0.0",

  ELEMENTS: {
    fire:  { id: "fire",  name: "炎", icon: "🔥", color: "#ff595e", desc: "高火力・燃焼スリップ" },
    water: { id: "water", name: "水", icon: "💧", color: "#1982c4", desc: "湿潤付与・速度低下" },
    volt:  { id: "volt",  name: "雷", icon: "⚡", color: "#ffca3a", desc: "SP回収UP・感電連鎖" },
    ice:   { id: "ice",   name: "氷", icon: "❄️", color: "#4cc9f0", desc: "行動鈍化・会心率UP" },
    wind:  { id: "wind",  name: "風", icon: "🌪️", color: "#2ec4b6", desc: "速度UP・元素拡散" },
    arc:   { id: "arc",   name: "煌", icon: "✨", color: "#b565ff", desc: "ブレイク＆結晶バリア" }
  },

  ELEMENT_REACTIONS: [
    { pair: ["fire", "water"], name: "蒸発", effect: "単発ダメージ 2.0倍" },
    { pair: ["fire", "ice"],   name: "融解", effect: "防御無視の超ダメージ" },
    { pair: ["fire", "volt"],  name: "過負荷", effect: "爆発＋体勢ゲージ大削り" },
    { pair: ["water", "volt"], name: "感電", effect: "周囲の敵へ雷ダメージ連鎖" },
    { pair: ["water", "ice"],  name: "凍結", effect: "敵を数秒間完全拘束" },
    { pair: ["volt", "ice"],   name: "超電導", effect: "部位・物理防御 50%DOWN" },
    { pair: ["wind", "fire"],  name: "炎拡散", effect: "燃焼を広範囲に拡散" },
    { pair: ["wind", "water"], name: "水拡散", effect: "湿潤を広範囲に拡散" },
    { pair: ["wind", "volt"],  name: "雷拡散", effect: "感電を広範囲に拡散" },
    { pair: ["wind", "ice"],   name: "氷嵐拡散", effect: "周囲の敵ごと氷結" },
    { pair: ["arc", "any"],    name: "結晶化", effect: "味方全員に属性バリア生成" }
  ],

  WEAPONS: {
    greatsword: { id: "greatsword", name: "大剣", icon: "🗡️", role: "部位破壊特化・一撃重火力" },
    sword:      { id: "sword",      name: "片手剣", icon: "⚔️", role: "隙が少なく扱いやすい万能型" },
    dual:       { id: "dual",       name: "双剣", icon: "🔪", role: "超高速連撃・SP＆元素回収" },
    spear:      { id: "spear",      name: "戦術槍", icon: "🔱", role: "中距離突き・ブレイク削り" },
    hammer:     { id: "hammer",     name: "重槌", icon: "🔨", role: "装甲粉砕・ダウン延長" },
    assault:    { id: "assault",    name: "アサルト銃", icon: "🔫", role: "移動射撃・安定中距離火力" },
    sniper:     { id: "sniper",     name: "狙撃銃", icon: "🎯", role: "弱点部位ピンポイント狙撃" },
    staff:      { id: "staff",      name: "戦術杖", icon: "🪄", role: "広範囲元素攻撃・回復支援" }
  },

  PROTAGONIST_STYLES: [
    { id: "m_cool", name: "クール系男子", emoji: "🧑‍✈️", tag: "冷静沈着な若き指揮官" },
    { id: "m_genki", name: "元気系男子", emoji: "👦", tag: "行動力抜群の熱血ハンター" },
    { id: "f_cool", name: "クール系女子", emoji: "👩‍✈️", tag: "的確な指示を出す凛々しい隊長" },
    { id: "f_genki", name: "元気系女子", emoji: "👧", tag: "笑顔で小隊を引っ張るムードメーカー" }
  ],

  BANNERS: [
    { id: "pickup_mikoto", shortName: "❄️ 白狐PU", tag: "限定ピックアップ", title: "白狐の絶対零度・特別招集", featuredSsr: "mikoto", featuredSr: ["leila", "belle"], desc: "限定SSR『ミコト』出現率UP！固有スキル『絶対零度』でボスを完全凍結。" },
    { id: "pickup_celestia", shortName: "⚡ 紫電PU", tag: "限定ピックアップ", title: "紫電の精密狙撃・特別招集", featuredSsr: "celestia", featuredSr: ["melissa", "noah"], desc: "限定SSR『セレスティア』出現率UP！精密狙撃で破壊可能部位を一撃粉砕。" },
    { id: "standard_all", shortName: "🌠 恒常招集", tag: "スタンダード", title: "方舟都市・開拓隊員スカウト", featuredSsr: "lunaria", featuredSr: ["koharu", "fiona"], desc: "看板娘『ルナリア』をはじめとする恒常SSR・SR隊員がラインナップ。" }
  ],

  SKILL_TREE_NODES: [
    { step: 1, name: "基礎戦闘訓練 I", desc: "基礎攻撃力・HP +6%", books: 5, cores: 1, credits: 1000, powerBonus: 25 },
    { step: 2, name: "戦技出力解放", desc: "戦技（アクティブスキル）威力 +18%", books: 10, cores: 2, credits: 2500, powerBonus: 40 },
    { step: 3, name: "元素共鳴回路", desc: "元素反応ダメージ＆SP回収効率 +15%", books: 18, cores: 4, credits: 5000, powerBonus: 60 },
    { step: 4, name: "部位破壊特化", desc: "ボスの破壊可能部位へのダメージ +25%", books: 28, cores: 6, credits: 9000, powerBonus: 85 },
    { step: 5, name: "必殺連携・極", desc: "ブレイク連携コンボ威力 +30%", books: 42, cores: 10, credits: 16000, powerBonus: 115 },
    { step: 6, name: "クリアラー極限覚醒", desc: "全ステータス +15%＆固有パッシブ最大強化", books: 65, cores: 16, credits: 30000, powerBonus: 160 }
  ],

  CHARACTERS: {
    protagonist: { id: "protagonist", name: "隊長（主人公）", rarity: "R", isProtagonist: true, trait: "第7小隊・指揮官", element: "arc", weapon: "sword", image: "assets/protagonist.jpg", emoji: "🧑‍✈️", campSkill: "全ライン効率 +10%（武器・属性自由切替）", skills: { normal: "タクティカル連撃：装備武器に応じた連続攻撃", active: "アーク・コマンド：共鳴属性で広範囲斬撃＆元素付着", ult: "ユニゾン・ストライク：味方全員の連携を加速する指揮一閃" }, voiceLines: ["第7クリアラー小隊、調査を開始する！", "みんなの元素連携があれば、どんな主霧獣でも倒せる！"] },
    lunaria: { id: "lunaria", name: "ルナリア", rarity: "SSR", limited: false, trait: "前衛突撃隊・エース", element: "fire", weapon: "greatsword", image: "assets/lunaria.jpg", emoji: "🎀", campSkill: "精錬炉の加工速度 +30%", skills: { normal: "ブレイズ・スラッシュ：大剣による炎属性薙ぎ払い", active: "クリムゾン・スマッシュ：部位へ280%の炎叩きつけ（部位破壊特効）", ult: "インフェルノ・メテオ：ダウン中の敵に超火力の炎爆砕を叩き込む" }, voiceLines: ["燃やし尽くせば霧なんて残らないでしょ！", "大きいリボンは気合の証！さあ突撃だよ隊長！"] },
    mikoto: { id: "mikoto", name: "ミコト", rarity: "SSR", limited: true, trait: "白狐の巫女・氷華使い", element: "ice", weapon: "staff", image: "assets/mikoto.jpg", emoji: "🦊", campSkill: "レア素材ドロップ率 +20%", skills: { normal: "氷符・連弾：追尾する氷結晶の弾丸を放つ", active: "絶対零度・氷華陣：周囲を凍結させ味方全体のHPを小回復", ult: "白狐神楽・極氷葬：大型ボスすら数秒間完全に凍りつかせる" }, voiceLines: ["白狐の氷華が、すべての瘴霧を封じ込めます。", "……しっぽに触りたいのですか？ 今だけ特別ですよ。"] },
    celestia: { id: "celestia", name: "セレスティア", rarity: "SSR", limited: true, trait: "元エリート狙撃手", element: "volt", weapon: "sniper", image: "assets/celestia.jpg", emoji: "⚡", campSkill: "拠点の発電効率 +30%", skills: { normal: "レールショット：高速の雷撃弾で遠距離から狙撃", active: "オーバークロック狙撃：破壊可能部位を自動ロックし確定会心", ult: "天雷パニッシャー：戦場全体に感電連鎖を起こす超長距離砲撃" }, voiceLines: ["ターゲット捕捉。風速計算完了……撃ち抜きます。"] },
    valeria: { id: "valeria", name: "ヴァレリア", rarity: "SSR", limited: false, trait: "方舟都市・名門騎士", element: "water", weapon: "spear", image: "assets/valeria.jpg", emoji: "👑", campSkill: "レア鉱石の産出率 +25%", skills: { normal: "タイダル・スラスト：水纏う戦術槍の高速3連突き", active: "アクア・ファランクス：広範囲に湿潤を付与し体勢値を大削り", ult: "ノーブル・ストリーム：激流の竜巻で敵の行動を遅延させる" }, voiceLines: ["方舟都市の名門に懸けて、作戦を成功させますわ！"] },
    chloe: { id: "chloe", name: "クロエ", rarity: "SSR", limited: false, trait: "古代遺跡・首席研究員", element: "arc", weapon: "sword", image: "assets/chloe.jpg", emoji: "👓", campSkill: "設計図の研究コスト -25%", skills: { normal: "アークパルス斬り：結晶エネルギーを纏った剣撃", active: "イージス・フィールド：味方全体に高耐久の結晶バリアを展開", ult: "エンシェント・デコード：敵の防御ギミックを解除し大ダメージ" }, voiceLines: ["ふぁ〜……この古代遺跡のデータ、すっごく面白いです！"] },
    sylphy: { id: "sylphy", name: "シルフィ", rarity: "SSR", limited: true, trait: "嵐の峡谷・孤狼の狩人", element: "wind", weapon: "dual", image: "assets/sylphy.jpg", emoji: "🐺", campSkill: "採掘スピード +35%", skills: { normal: "ゲイル・ファング：目にも留まらぬ双剣の高速連撃", active: "テンペスト・ラッシュ：攻撃をすり抜けながら風拡散を発生", ult: "ウルフ・ハウルストーム：超高速乱舞でSPと元素を大量回収" }, voiceLines: ["風の匂いが変わった！デカい獲物が近くに潜んでるぞ！"] },
    koharu: { id: "koharu", name: "コハル", rarity: "SR", trait: "重機メカニック", element: "arc", weapon: "hammer", image: "assets/koharu.jpg", emoji: "🔧", campSkill: "建築・タレット作成コスト -20%", skills: { normal: "ヘビー・スイング：重槌による重量打撃", active: "ショックトラップ投下：敵の装甲を砕き体勢ブレイクを加速", ult: "ギガトン・クラッシャー：ダウン時間を延長させるフルスイング" }, voiceLines: ["どんな頑丈な装甲も、特製ハンマーで一撃だよ！"] },
    fiona: { id: "fiona", name: "フィオナ", rarity: "SR", trait: "第7小隊・衛生兵", element: "water", weapon: "assault", image: "assets/fiona.jpg", emoji: "💉", campSkill: "回復ポーション生産数 +40%", skills: { normal: "ハイドロ・バースト：水属性弾の3点バースト射撃", active: "ヒーリング・ミスト：味方全体のHPを回復し敵に湿潤を付与", ult: "サンクチュアリ・レイン：継続回復エリアを展開し小隊を立て直す" }, voiceLines: ["無理は禁物ですよ隊長。回復弾はたっぷりありますから♪"] },
    noah: { id: "noah", name: "ノア", rarity: "SR", trait: "夜行性の黒猫斥候", element: "wind", weapon: "sword", image: "assets/noah.jpg", emoji: "🐈‍⬛", campSkill: "探索派遣の報酬量 +20%", skills: { normal: "シャドウ・ステップ：素早い踏み込み斬り", active: "ウィンド・スライス：風の刃を飛ばし付着元素を拡散させる", ult: "ナイト・アサルト：背後からの奇襲連撃でSPを大幅回復" }, voiceLines: ["ニャハッ！一番乗りはボクのものだよー！"] },
    leila: { id: "leila", name: "レイラ", rarity: "SR", trait: "極北雪原のスナイパー", element: "ice", weapon: "sniper", image: "assets/leila.jpg", emoji: "❄️", campSkill: "冷却装置の稼働効率 +25%", skills: { normal: "フロスト・バレット：冷気を帯びた精密射撃", active: "スノウ・ピアサー：部位への会心ダメージを高める氷結狙撃", ult: "ブリザード・スナイプ：極低温の貫通弾で敵を氷結させる" }, voiceLines: ["……雪原では静かに。一発で仕留めます。"] },
    kaede: { id: "kaede", name: "カエデ", rarity: "SR", trait: "移動厨房・料理長", element: "fire", weapon: "sword", image: "assets/kaede.jpg", emoji: "🍳", campSkill: "バフ料理の効果時間 2倍", skills: { normal: "フレイム・カット：炎を纏わせた軽快な剣技", active: "ファイヤー・エンチャント：小隊の攻撃力を高め燃焼を付与", ult: "満腹バーニング乱舞：味方を鼓舞しながら炎の連続斬撃を放つ" }, voiceLines: ["腹が減っては狩りはできません！特製お弁当どうぞ！"] },
    melissa: { id: "melissa", name: "メリッサ", rarity: "SR", trait: "雷撃兵器・開発主任", element: "volt", weapon: "staff", image: "assets/melissa.jpg", emoji: "🧪", campSkill: "電池・エネルギーコア生産 +25%", skills: { normal: "スパーク・ボルト：高電圧の雷撃球を放つ", active: "テスラ・コイル設置：感電ダメージを倍増させる電撃フィールド展開", ult: "オーバーロード放電：周囲の敵すべてに連鎖雷撃を落とす" }, voiceLines: ["ヒヒッ、この新型コイルで感電ダメージを倍増させてあげる！"] },
    belle: { id: "belle", name: "ベル", rarity: "SR", trait: "星詠みの気象観測士", element: "water", weapon: "staff", image: "assets/belle.jpg", emoji: "🔮", campSkill: "浄化ビーコンの有効範囲 +20%", skills: { normal: "アクア・オーブ：水の魔力弾で攻撃", active: "ミスト・シールド：被ダメージを軽減する水の守護膜を展開", ult: "フォーチュン・ウェーブ：味方の弱体を解除し水属性の大波を放つ" }, voiceLines: ["水晶玉が告げています……今日はレア鉱石が見つかる吉日です♪"] },
    ran: { id: "ran", name: "ラン", rarity: "SR", trait: "方舟都市・警備隊長", element: "arc", weapon: "spear", image: "assets/ran.jpg", emoji: "🛡️", campSkill: "防衛タレットの攻撃力 +25%", skills: { normal: "ガード・スラスト：堅実な槍の突き攻撃", active: "カウンター・スピア：敵の攻撃を受け流し体勢値を大きく削る", ult: "ガーディアン・ランサー：味方全体に結晶シールドを付与する突撃" }, voiceLines: ["背中は私が守ります。隊長は前線に集中してください！"] },
    momo: { id: "momo", name: "モモ", rarity: "R", trait: "犬族の切り込み隊員", element: "fire", weapon: "dual", image: "assets/momo.jpg", emoji: "🐶", campSkill: "バフ料理の満腹度＆効果 +20%", skills: { normal: "ハウンド・クロウ：双剣による素早い連続引っ掻き", active: "ファイア・スピン：炎を纏って回転斬りし燃焼を付与", ult: "全力ワンワンラッシュ：怒涛の連撃でSPを素早く回収する" }, voiceLines: ["ワンッ！隊長、今日のキャンプ飯は特製お肉シチューだよ！"] },
    mint: { id: "mint", name: "ミント", rarity: "R", trait: "白兎族の精密観測手", element: "wind", weapon: "sniper", image: "assets/mint.jpg", emoji: "🐰", campSkill: "ボスの破壊可能部位を自動マーキング", skills: { normal: "ウインド・ショット：風を纏った安定した狙撃", active: "ウィーク・スポット照準：ボスの部位破壊ダメージをUPさせる狙撃", ult: "サイレント・ゲイル：風の渦を起こし元素拡散を発生させる" }, voiceLines: ["……ふぁ。長い耳は伊達じゃないです。遠くの足音も聞こえますよ。"] },
    aoi: { id: "aoi", name: "アオイ", rarity: "R", trait: "第7小隊・正規隊員", element: "arc", weapon: "assault", image: "assets/aoi.jpg", emoji: "🎖️", campSkill: "作戦記録の獲得量 +10%", skills: { normal: "ラピッド・ファイア：安定感抜群のアサルト連射", active: "タクティカル・グレネード：結晶手榴弾で体勢ゲージを削る", ult: "オールラウンド支援射撃：味方の攻撃を援護する集中弾幕" }, voiceLines: ["隊長！本日の物資点検と弾薬の補充、完了しております！"] },
    haruto: { id: "haruto", name: "ハルト", rarity: "R", trait: "若手フィールド整備士", element: "volt", weapon: "sword", image: "assets/haruto.jpg", emoji: "🧰", campSkill: "工場ラインの増設コスト -15%", skills: { normal: "スパナ＆ブレード：工具を活かした巧みな剣撃", active: "ボルト・チャージ：雷属性を付与し味方のSP回収を支援", ult: "フルメンテナンス・ラッシュ：電撃を纏った連続突き" }, voiceLines: ["コンベアの調子が悪いのか？オレの工具箱に任せな！"] },
    yuzu: { id: "yuzu", name: "ユズ", rarity: "R", trait: "のんびり水辺の釣り師", element: "water", weapon: "hammer", image: "assets/yuzu.jpg", emoji: "🎣", campSkill: "釣りの大物ヒット率 +25%", skills: { normal: "スプラッシュ・ブロウ：水圧ハンマーによる重打撃", active: "タイダル・ウェーブ：敵を吹き飛ばし湿潤状態にする", ult: "一本釣り・大波叩き：巨大な水柱を発生させる豪快な一撃" }, voiceLines: ["ふわぁ……釣り糸垂らしてのんびり待つの、最高……。"] },
    crow: { id: "crow", name: "クロウ", rarity: "R", trait: "漆黒マントのトレジャーハンター", element: "wind", weapon: "dual", image: "assets/crow.jpg", emoji: "🦅", campSkill: "フィールドの隠し宝箱を探知", skills: { normal: "レイヴン・エッジ：風を切る二刀流の連撃", active: "ダーク・フェザー：風の刃を放ち付着元素を周囲へ拡散", ult: "黒翼の疾風乱舞：高速移動しながら敵を切り刻む" }, voiceLines: ["フッ……闇に隠されし古代の宝箱、この漆黒の瞳にはお見通しだ。"] },
    sakura: { id: "sakura", name: "サクラ", rarity: "R", trait: "薬草学の研究生", element: "fire", weapon: "staff", image: "assets/sakura.jpg", emoji: "🌿", campSkill: "薬草・花の採取数が 2倍", skills: { normal: "エンバー・リーフ：炎の魔力弾を放つ", active: "アロマ・ヒーリング：小隊HPを少し回復し炎元素を付着", ult: "陽だまりの篝火：味方の継続回復と燃焼ダメージを強化" }, voiceLines: ["この地域の薬草はとっても元気ですね。大切に採取しましょう。"] },
    rikka: { id: "rikka", name: "リッカ", rarity: "R", trait: "氷壁の防衛オペレーター", element: "ice", weapon: "spear", image: "assets/rikka.jpg", emoji: "🧊", campSkill: "氷結ギミックの持続時間延長", skills: { normal: "アイス・ランス：冷気を纏った槍撃", active: "フロスト・ウォール：敵の動きを鈍らせる氷の防壁を展開", ult: "グレイシャル・ピアス：凍結中の敵に大ダメージを与える突き" }, voiceLines: ["氷の防壁を展開。敵の突進はここで食い止めます。"] },
    pochi: { id: "pochi", name: "ポチ", rarity: "N", trait: "自律サポートドローン", element: "arc", weapon: "staff", image: "assets/pochi.jpg", emoji: "🤖", campSkill: "キャンプ内の資材自動回収", skills: { normal: "マイクロビーム：小型レーザーによる援護射撃", active: "スキャンパルス：結晶エネルギー弾で体勢値を削る", ult: "フルバースト・ピポッ！：全エネルギーを解放する連続ビーム" }, voiceLines: ["ピポッ！巡回ルート異常ナシ！"] },
    guardko: { id: "guardko", name: "ガード子", rarity: "N", trait: "量産型警備アンドロイド", element: "arc", weapon: "hammer", image: "assets/guardko.jpg", emoji: "🦾", campSkill: "拠点防衛時の壁耐久 +20%", skills: { normal: "シールドバッシュ：重装甲盾による打撃", active: "プロテクト・バリア：味方に結晶バリアを付与する", ult: "アイアン・フォートレス：体勢値を大きく削る重撃" }, voiceLines: ["警備モード起動。隊長ノ安全ヲ確保シマス。"] },
    tama: { id: "tama", name: "タマ", rarity: "N", trait: "三毛猫型パトロールロボ", element: "fire", weapon: "dual", image: "assets/tama.jpg", emoji: "🐱", campSkill: "害獣追い払い＆ドロップ拾い", skills: { normal: "ヒートクロウ：加熱ブレードによる連続引っ掻き", active: "ファイア・ダッシュ：炎を纏った突進攻撃", ult: "ニャンコ・オーバーヒート：連続燃焼攻撃を叩き込む" }, voiceLines: ["ニャー！（電子音）"] },
    driller: { id: "driller", name: "ドリラーMk-II", rarity: "N", trait: "重掘削作業アンドロイド", element: "arc", weapon: "spear", image: "assets/driller.jpg", emoji: "⛏️", campSkill: "鉱脈を一撃で粉砕採掘", skills: { normal: "ドリルスピン：先端ドリルによる連続突き", active: "アーマーブレイカー：敵の硬い部位・装甲を大きく削る", ult: "ギガドリル・インパクト：体勢値を一気に削り切る突撃" }, voiceLines: ["ガガガッ！高純度アーク鉱脈ヲ発見！"] },
    medibot: { id: "medibot", name: "メディボット", rarity: "N", trait: "自律救急ドローン", element: "water", weapon: "staff", image: "assets/medibot.jpg", emoji: "➕", campSkill: "戦闘中の自動回復パック投下", skills: { normal: "ウォータースプレー：水属性の散水攻撃", active: "リペアパック投下：小隊全体のHPを回復し湿潤を付与", ult: "エマージェンシー・ヒール：戦場全体に回復霧を散布" }, voiceLines: ["ピピッ、救急パックヲ投下シマス！"] },
    scanner: { id: "scanner", name: "スキャナーくん", rarity: "N", trait: "高高度観測バルーンロボ", element: "wind", weapon: "sniper", image: "assets/scanner.jpg", emoji: "🎈", campSkill: "周囲の霧マップ索敵範囲拡大", skills: { normal: "エアショット：圧縮空気弾による遠距離攻撃", active: "ターゲットロック：ボスの部位を照らし拡散を発生", ult: "ストーム・ビーコン：上空から風圧の衝撃波を落とす" }, voiceLines: ["プシューッ！上空カラ敵ノ位置ヲマーキング完了！"] }
  },

  // ひりつく高難易度・育成前提バランス（全22種）
  ENEMIES: [
    // 第1エリア：ヴェルデ平原（6種）
    { id: "wolf_pack", name: "ミアズマ・ウルフ群", rank: "平原・通常", emoji: "🐺", recPower: 380, maxHp: 2100, maxStagger: 80, atk: 145, parts: [], rewards: { credits: 2200, books: 8, cores: 1, gems: 60, tickets: 1, rankExp: 45, activityPt: 14 } },
    { id: "spore_slime", name: "瘴霧胞子・マッシュ", rank: "平原・通常", emoji: "🍄", recPower: 460, maxHp: 3100, maxStagger: 90, atk: 185, parts: [{ name: "発光胞子笠", hpRatio: 0.42, drop: "発光胞子エキス" }], rewards: { credits: 2800, books: 10, cores: 2, gems: 80, tickets: 1, rankExp: 55, activityPt: 18 } },
    { id: "forest_boar", name: "苔むした大猪・ブル", rank: "平原・通常", emoji: "🐗", recPower: 560, maxHp: 4600, maxStagger: 105, atk: 245, parts: [{ name: "硬質の大牙", hpRatio: 0.4, drop: "大猪の鋭牙" }], rewards: { credits: 3600, books: 12, cores: 2, gems: 100, tickets: 2, rankExp: 70, activityPt: 22 } },
    { id: "crystal_beetle", name: "結晶甲虫・重装種", rank: "平原・精鋭", emoji: "🪲", recPower: 720, maxHp: 7200, maxStagger: 125, atk: 325, parts: [{ name: "高純度結晶殻", hpRatio: 0.45, drop: "純度結晶殻" }], rewards: { credits: 5200, books: 18, cores: 4, gems: 140, tickets: 2, rankExp: 95, activityPt: 30 } },
    { id: "moss_behemoth", name: "主霧獣『モス・ベヒーモス』", rank: "第1エリア主", emoji: "🦏", recPower: 980, maxHp: 13800, maxStagger: 160, atk: 460, parts: [{ name: "結晶の巨角", hpRatio: 0.35, drop: "ベヒーモスの結晶角" }, { name: "背中の苔殻", hpRatio: 0.40, drop: "古代樹の重甲殻" }], rewards: { credits: 9500, books: 28, cores: 6, gems: 260, tickets: 3, rankExp: 170, activityPt: 50 } },
    { id: "radiant_behemoth", name: "【融光種】煌角のベヒーモス", rank: "変異・融光種", emoji: "🌟", isRadiant: true, recPower: 1350, maxHp: 22500, maxStagger: 195, atk: 620, parts: [{ name: "融光結晶角", hpRatio: 0.35, drop: "融光の煌角" }, { name: "過飽和の核殻", hpRatio: 0.35, drop: "融光アーク結晶" }], rewards: { credits: 16000, books: 42, cores: 10, gems: 360, tickets: 4, rankExp: 250, activityPt: 75 } },

    // 第2エリア：ヴォルト・キャニオン（4種）
    { id: "spark_raptor", name: "紫電の疾走竜・ラプトル", rank: "峡谷・通常", emoji: "🦖", recPower: 1120, maxHp: 14800, maxStagger: 150, atk: 495, parts: [{ name: "帯電トサカ", hpRatio: 0.4, drop: "紫電のトサカ" }], rewards: { credits: 11000, books: 30, cores: 6, gems: 170, tickets: 2, rankExp: 180, activityPt: 45 } },
    { id: "volt_scarab", name: "蓄電巨甲虫・スカラベ", rank: "峡谷・精鋭", emoji: "🦂", recPower: 1320, maxHp: 19500, maxStagger: 175, atk: 590, parts: [{ name: "高圧蓄電鋏", hpRatio: 0.42, drop: "蓄電スカラベ鋏" }], rewards: { credits: 14000, books: 38, cores: 8, gems: 220, tickets: 2, rankExp: 220, activityPt: 55 } },
    { id: "thunder_wyvern", name: "主霧獣『サンダー・ワイバーン』", rank: "第2エリア主", emoji: "🐉", recPower: 1650, maxHp: 28500, maxStagger: 210, atk: 740, parts: [{ name: "右雷翼", hpRatio: 0.32, drop: "紫電の飛竜翼" }, { name: "蓄電の尾針", hpRatio: 0.28, drop: "高圧雷撃コア" }], rewards: { credits: 19500, books: 52, cores: 12, gems: 360, tickets: 4, rankExp: 290, activityPt: 75 } },
    { id: "radiant_wyvern", name: "【融光種】天雷のオーバーワイバーン", rank: "変異・融光種", emoji: "⚡", isRadiant: true, recPower: 2050, maxHp: 42000, maxStagger: 250, atk: 930, parts: [{ name: "融光雷翼", hpRatio: 0.32, drop: "融光の天雷翼" }, { name: "暴走プラズマ核", hpRatio: 0.30, drop: "融光アーク結晶" }], rewards: { credits: 28000, books: 68, cores: 16, gems: 480, tickets: 5, rankExp: 390, activityPt: 100 } },

    // 第3エリア：フロスト・ヘイヴン（4種）
    { id: "blizzard_hound", name: "氷狼・ブリザードハウンド", rank: "雪原・通常", emoji: "🦊", recPower: 1850, maxHp: 29000, maxStagger: 195, atk: 780, parts: [{ name: "氷結の尾房", hpRatio: 0.4, drop: "極寒の銀毛" }], rewards: { credits: 20000, books: 50, cores: 11, gems: 240, tickets: 2, rankExp: 300, activityPt: 65 } },
    { id: "frost_spider", name: "氷晶の機巧蜘蛛・アラクネ", rank: "雪原・精鋭", emoji: "🕷️", recPower: 2100, maxHp: 35000, maxStagger: 220, atk: 880, parts: [{ name: "冷凍噴射口", hpRatio: 0.38, drop: "極低温ノズル" }], rewards: { credits: 24000, books: 60, cores: 14, gems: 290, tickets: 3, rankExp: 350, activityPt: 80 } },
    { id: "glacial_mammoth", name: "主霧獣『グレイシャル・マンモス』", rank: "第3エリア主", emoji: "🦣", recPower: 2500, maxHp: 49000, maxStagger: 260, atk: 1060, parts: [{ name: "氷結の双牙", hpRatio: 0.35, drop: "永久凍土の巨牙" }, { name: "背中の冷却炉殻", hpRatio: 0.40, drop: "暴走冷却炉パーツ" }], rewards: { credits: 32000, books: 78, cores: 18, gems: 460, tickets: 4, rankExp: 450, activityPt: 110 } },
    { id: "radiant_mammoth", name: "【融光種】絶対零度の帝王マンモス", rank: "変異・融光種", emoji: "❄️", isRadiant: true, recPower: 2950, maxHp: 65000, maxStagger: 295, atk: 1260, parts: [{ name: "融光氷牙", hpRatio: 0.33, drop: "融光の極氷牙" }, { name: "零度結晶炉", hpRatio: 0.35, drop: "融光アーク結晶" }], rewards: { credits: 42000, books: 98, cores: 24, gems: 580, tickets: 5, rankExp: 550, activityPt: 135 } },

    // 第4エリア：イグニス・カルデラ（3種）
    { id: "lava_golem", name: "溶鉱炉の巨兵・ゴーレム", rank: "溶岩・精鋭", emoji: "🗿", recPower: 2850, maxHp: 58000, maxStagger: 270, atk: 1180, parts: [{ name: "灼熱炉心", hpRatio: 0.4, drop: "赤熱ゴーレム核" }], rewards: { credits: 36000, books: 88, cores: 20, gems: 380, tickets: 3, rankExp: 500, activityPt: 110 } },
    { id: "magma_salamander", name: "主霧獣『マグマ・サラマンダー』", rank: "第4エリア主", emoji: "🦎", recPower: 3300, maxHp: 74000, maxStagger: 300, atk: 1380, parts: [{ name: "灼熱の溶岩顎", hpRatio: 0.35, drop: "紅蓮の溶岩顎" }, { name: "業火の尾先", hpRatio: 0.35, drop: "マグマ結晶核" }], rewards: { credits: 46000, books: 105, cores: 26, gems: 580, tickets: 4, rankExp: 620, activityPt: 140 } },
    { id: "radiant_salamander", name: "【融光種】紅蓮業火の炎帝竜", rank: "変異・融光種", emoji: "🔥", isRadiant: true, recPower: 3800, maxHp: 94000, maxStagger: 340, atk: 1620, parts: [{ name: "融光炎顎", hpRatio: 0.32, drop: "融光の業火顎" }, { name: "太陽核結晶", hpRatio: 0.34, drop: "融光アーク結晶" }], rewards: { credits: 58000, books: 130, cores: 32, gems: 720, tickets: 5, rankExp: 740, activityPt: 170 } },

    // 第5エリア：アクア・メトロポリス（3種）
    { id: "neon_angler", name: "水没街の提灯魚・アングラー", rank: "水没・精鋭", emoji: "🐡", recPower: 3750, maxHp: 88000, maxStagger: 320, atk: 1550, parts: [{ name: "ネオン発光提灯", hpRatio: 0.4, drop: "深海ネオン球" }], rewards: { credits: 52000, books: 115, cores: 28, gems: 480, tickets: 3, rankExp: 680, activityPt: 150 } },
    { id: "abyss_kraken", name: "主霧獣『アビス・クラーケン』", rank: "第5エリア主", emoji: "🦑", recPower: 4300, maxHp: 108000, maxStagger: 350, atk: 1820, parts: [{ name: "深海の大触手", hpRatio: 0.35, drop: "深淵の触手繊維" }, { name: "頭部の発光核",hpRatio: 0.35, drop: "ネオン深海核" }], rewards: { credits: 66000, books: 140, cores: 34, gems: 720, tickets: 4, rankExp: 840, activityPt: 185 } },
    { id: "radiant_kraken", name: "【融光種】深淵ネオン・リヴァイアサン", rank: "変異・融光種", emoji: "🐙", isRadiant: true, recPower: 4900, maxHp: 132000, maxStagger: 390, atk: 2100, parts: [{ name: "融光深海冠", hpRatio: 0.32, drop: "融光の深淵冠" }, { name: "過飽和ネオン核", hpRatio: 0.34, drop: "融光アーク結晶" }], rewards: { credits: 82000, books: 170, cores: 42, gems: 880, tickets: 5, rankExp: 1000, activityPt: 220 } },

    // 第6エリア：アーク・スパイア（2種）
    { id: "spire_seraph", name: "天蓋の古代守護機・セラフ", rank: "天蓋・精鋭", emoji: "👼", recPower: 5100, maxHp: 138000, maxStagger: 400, atk: 2180, parts: [{ name: "アーク光翼", hpRatio: 0.36, drop: "古代セラフ光翼" }], rewards: { credits: 85000, books: 175, cores: 44, gems: 760, tickets: 4, rankExp: 1050, activityPt: 230 } },
    { id: "radiant_zero", name: "【融光種】原初の災厄・ゼロ", rank: "最終・融光主", emoji: "👁️", isRadiant: true, recPower: 5800, maxHp: 175000, maxStagger: 460, atk: 2550, parts: [{ name: "天蓋の制御輪", hpRatio: 0.30, drop: "天蓋の制御リング" }, { name: "原初のミアズマ核", hpRatio: 0.35, drop: "原初の融光神核" }], rewards: { credits: 110000, books: 220, cores: 55, gems: 1200, tickets: 6, rankExp: 1400, activityPt: 320 } }
  ],

  REGIONS: [
    { id: "verde", name: "第1エリア：新緑の廃墟『ヴェルデ平原』", bg: "#213829", reqRank: 1, normalId: "wolf_pack", eliteId: "crystal_beetle", bossId: "moss_behemoth", radiantId: "radiant_behemoth", rareDrop: "アーク結晶鉱" },
    { id: "volt", name: "第2エリア：雷鳴の峡谷『ヴォルト・キャニオン』", bg: "#2b2538", reqRank: 3, normalId: "spark_raptor", eliteId: "volt_scarab", bossId: "thunder_wyvern", radiantId: "radiant_wyvern", rareDrop: "雷撃結晶" },
    { id: "frost", name: "第3エリア：白銀の研究所『フロスト・ヘイヴン』", bg: "#1f303d", reqRank: 6, normalId: "blizzard_hound", eliteId: "frost_spider", bossId: "glacial_mammoth", radiantId: "radiant_mammoth", rareDrop: "永久氷晶" },
    { id: "ignis", name: "第4エリア：灼熱の溶鉱炉跡『イグニス・カルデラ』", bg: "#38211f", reqRank: 10, normalId: "lava_golem", eliteId: "lava_golem", bossId: "magma_salamander", radiantId: "radiant_salamander", rareDrop: "溶岩精錬鉄" },
    { id: "aqua", name: "第5エリア：水没ネオン街『アクア・メトロポリス』", bg: "#192d38", reqRank: 15, normalId: "neon_angler", eliteId: "neon_angler", bossId: "abyss_kraken", radiantId: "radiant_kraken", rareDrop: "深海発光コア" },
    { id: "spire", name: "第6エリア：天蓋の塔『アーク・スパイア』", bg: "#291b36", reqRank: 20, normalId: "spire_seraph", eliteId: "spire_seraph", bossId: "radiant_zero", radiantId: "radiant_zero", rareDrop: "原初の天蓋結晶" }
  ],

  BUILTIN_MAILS: [],

  CRAFT_RECIPES: [
    { id: "wp_behemoth", cat: "weapon", icon: "🗡️", name: "結晶角の大剣・改", req: { "ベヒーモスの結晶角": 1, "アーク結晶鉱": 2 }, credits: 2500, desc: "装備すると小隊全体の攻撃力 +12%（永続パッシブ）" },
    { id: "wp_wyvern", cat: "weapon", icon: "🎯", name: "紫電の竜翼ライフル", req: { "紫電の飛竜翼": 1, "雷撃結晶": 2 }, credits: 5000, desc: "装備すると小隊全体の会心・スキル威力 +18%（永続パッシブ）" },
    { id: "wp_radiant", cat: "weapon", icon: "👑", name: "融光神核・オーバーブレード", req: { "融光アーク結晶": 2, "純度結晶殻": 2 }, credits: 9000, desc: "融光種の力を宿す決戦兵器。小隊全体の攻撃力 +28%（永続パッシブ）" },
    { id: "item_trap", cat: "gadget", icon: "⚡", name: "大型ショック拘束罠", req: { "アーク結晶鉱": 2, "純度結晶殻": 1 }, credits: 1200, desc: "ボス戦で使うと敵を即座に大ダウンさせ、部位破壊しやすくなる。" },
    { id: "item_potion", cat: "gadget", icon: "🧪", name: "高濃度リペアポーション", req: { "アーク薬草": 2 }, credits: 600, desc: "戦闘中に小隊のHPを60%即時回復する携帯薬。" }
  ],

  SERIAL_CODES: {
    "FRONTIER2026": { label: "開発テストパック", gems: 1600, credits: 10000, en: 60, books: 25, cores: 5 }
  }
};
