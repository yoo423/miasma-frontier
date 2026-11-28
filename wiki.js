let currentWikiTab = "beginner";
let wikiSearchQuery = "";

const WIKI_TABS = [
  { id: "beginner", label: "🔰 序盤・日課" },
  { id: "battle",   label: "⚡ 戦闘・元素" },
  { id: "deck",     label: "🃏 デッキ・武器" },
  { id: "growth",   label: "👑 育成・限定SSR" },
  { id: "contents", label: "🗼 極限・イベント" },
  { id: "glossary", label: "📖 用語集" },
  { id: "faq",      label: "❓ FAQ・機能" }
];

function getWikiSections() {
  const cardTotal = Object.keys(window.MF_CARDS?.TACTIC_CARDS || {}).length || 102;
  const redeemedLaunch = (state?.redeemedCodes || []).includes("FRONTIER2026");

  return {
    beginner: [
      {
        title: "🚀 リリース記念・最初にやるべき3つのこと",
        tags: "初心者 序盤 コード ログボ FRONTIER2026",
        html: `
          <div class="wk-step"><strong>1. 支援コードを受け取る</strong><br>
            タブレット2ページ目の『⚙️ 端末設定』→ 支援コード欄に <code>FRONTIER2026</code> を入力すると特別支援物資がもらえます！${redeemedLaunch ? " <span class='tag' style='background:#18b88a;color:#fff;'>✓受取済</span>" : ""}</div>
          <div class="wk-step"><strong>2. Wログインボーナス＆配布箱を回収</strong><br>
            開始7日間は『初心者応援ログボ』と『通常ログボ』の2つを毎日同時に受け取れます。配布箱のプレゼントも忘れずに回収しましょう。</div>
          <div class="wk-step"><strong>3. 第1章・第四話まで進めて全基本機能を解放</strong><br>
            ・第1章 第三話踏破 → <strong>🤝 フレンド</strong>解放<br>
            ・第1章 第四話踏破 → <strong>🏭 キャンプ ＆ 🔨 クラフト</strong>解放<br>
            ・第1章 第二十話踏破 → <strong>🏆 対人アリーナ</strong>解放</div>
        `
      },
      {
        title: "📅 毎日やりたい日課チェックリスト",
        tags: "日課 デイリー 効率 ルーティン",
        html: `
          <ul class="wk-list">
            <li><strong>📅 ログインボーナス</strong>：Wログボのスタンプ受取</li>
            <li><strong>📋 デイリー任務</strong>：討伐・育成・強化をこなして石とパック券を回収</li>
            <li><strong>🏭 キャンプ回収</strong>：時間経過で貯まったクレジット・作戦記録を回収</li>
            <li><strong>🏪 補給ショップ</strong>：毎日0時更新。SSR戦術カードや『💐 アーク花のブーケ』をチェック</li>
            <li><strong>💞 隊員と語らう</strong>：1日1回無料で絆ポイント+1（Lv.3で個別エピソード解放）</li>
            <li><strong>🗼 無限タワー掃討</strong>：登った最高階層に応じた毎日ボーナスをワンタップ受取</li>
            <li><strong>🤝 フレンド応援</strong>：1日1回の応援ギフト受取</li>
          </ul>
        `
      },
      {
        title: "⚡ スタミナ（EN）と予備ENの仕組み",
        tags: "EN スタミナ 予備 回復",
        html: `
          <p class="wk-p">ENは最大 <strong>160</strong>（6分で1自動回復）です。上限160を超えて溢れた分も無駄にならず、<strong>2回に1回『予備EN（最大1,000）』へ自動貯蓄</strong>されます。ENが足りない時は自動で予備ENから補填されます。</p>
        `
      }
    ],

    battle: [
      {
        title: "⚡ 6元素反応・完全データ表（ダメージ激増の要）",
        tags: "元素 反応 融解 蒸発 凍結 過負荷 感電 超電導 拡散 結晶化 倍率",
        html: `
          <p class="wk-p">敵に1つ目の属性を付着させた状態で、<strong>別の属性カード</strong>を当てると強力な元素反応が炸裂します！</p>
          <div class="wk-table">
            <div class="wk-tr wk-th"><span>組み合わせ</span><span>反応名・効果</span></div>
            <div class="wk-tr"><span>🔥炎 × ❄️氷</span><span><strong>融解（2.2倍）</strong>：全反応中最大の単発火力！</span></div>
            <div class="wk-tr"><span>🔥炎 × 💧水</span><span><strong>蒸発（2.0倍）</strong>：水→炎でも炎→水でも大ダメージ</span></div>
            <div class="wk-tr"><span>🔥炎 × ⚡雷</span><span><strong>過負荷（1.65倍）</strong>：追加で敵の体勢ゲージ +30削り</span></div>
            <div class="wk-tr"><span>🌪️風 × 他属性</span><span><strong>元素拡散（1.55倍）</strong>：どの属性とも繋がる万能火力</span></div>
            <div class="wk-tr"><span>💧水 × ⚡雷</span><span><strong>感電（1.5倍）</strong>：2ターン継続の追加雷ダメージ</span></div>
            <div class="wk-tr"><span>⚡雷 × ❄️氷</span><span><strong>超電導（1.45倍）</strong>：2T防御DOWN（被ダメ1.35倍）</span></div>
            <div class="wk-tr"><span>💧水 × ❄️氷</span><span><strong>凍結（1.3倍）</strong>：敵を1ターン行動不能（※Lv差5以上は無効）</span></div>
            <div class="wk-tr"><span>✨煌 × 他属性</span><span><strong>結晶化（1.3倍）</strong>：小隊最大HP20%のバリア展開</span></div>
          </div>
        `
      },
      {
        title: "🎯 敵の予兆（行動予告）と完璧なカウンター対策",
        tags: "予兆 装甲硬化 チャージ 崩し 防御 カウンター 怒り",
        html: `
          <div class="wk-step"><strong>🛡️ 装甲硬化・反撃構え</strong><br>
            通常攻撃が半減します。<strong>【💥 崩し】カード</strong>を当てると特効ダメージ＋体勢+35＋強制行動不能（装甲粉砕）！</div>
          <div class="wk-step"><strong>⚡ 必殺チャージ中</strong><br>
            放置すると次ターンに致命級の大技（2.25倍）が来ます。<strong>【💥 崩し】カード</strong>で1.8倍ダメージ＆チャージ強制中断！</div>
          <div class="wk-step"><strong>💢 猛襲叩きつけ(1.55倍) ／ ☄️ 大技(2.25倍)</strong><br>
            <strong>【🛡️ 防御・バリア】</strong>や<strong>【🪞 カウンター】</strong>、または<strong>💧×❄️凍結</strong>で無力化しましょう。</div>
          <div class="wk-step"><strong>💢 怒り覚醒（オーバードライブ）</strong><br>
            ボスのHPが50%以下になると発動し攻撃力が1.35倍に上昇します。後半は防御札や回復札を手元に残すと安定します。</div>
        `
      },
      {
        title: "🔥 3連チェイン・EX必殺・手動ボーナス",
        tags: "3連チェイン EX 必殺 部位破壊 手動 AUTO Lv差圧倒",
        html: `
          <ul class="wk-list">
            <li><strong>🔥 3連チェイン</strong>：プレイマットに3枚並べて発動すると、<strong>3枚目の威力が+30%</strong>（🌹イリス編成時は<strong>+55%</strong>）＆EXゲージ追加+15%。「バフ → 起点属性 → フィニッシャー」の順が最強！</li>
            <li><strong>🌟 EX必殺札</strong>：ゲージ100%で<strong>コスト0の超必殺札</strong>が手札に降臨。限定SSRがいると優先して超強力な限定EX札が出現します。</li>
            <li><strong>💥 部位破壊</strong>：ボスの破壊可能部位を壊すと敵が即行動不能＆攻撃力ダウン、さらに鍛造用の希少素材が確定ドロップ！</li>
            <li><strong>🎮 手動 vs AUTO</strong>：手動クリア限定で『💎結晶石・活躍Pt・部位破壊ドロップ・🎟️パック券』のボーナスが付きます。</li>
            <li><strong>☠️ Lv差圧倒オーラ</strong>：中級・上級の育成クエストは基準Lv未満だと与ダメ激減・被ダメ激増します。まずは初級で隊員Lvを上げて挑みましょう。</li>
          </ul>
        `
      }
    ],

    deck: [
      {
        title: "🃏 デッキ編成の基本ルール（20〜40枚・5枠保存）",
        tags: "デッキ 20枚 40枚 スロット 圧縮 同名 3枚",
        html: `
          <p class="wk-p">デッキは<strong>「編成隊員4人の固定カード12枚」＋「自由な戦術カード8〜28枚」＝合計20〜40枚</strong>で構成します（同名カードは3枚まで／最大5枠まで名前付き保存可能）。</p>
          <div class="wk-step"><strong>⚖️ 20〜24枚（コンパクト圧縮型）</strong><br>
            隊員の強力な固有カードや限定SSR札が何度も手札に回ってきます。短期決戦・融光レイド・対人戦におすすめ！</div>
          <div class="wk-step"><strong>📚 32〜40枚（フルボリューム万能型）</strong><br>
            多彩な属性・回復・カウンターを幅広く採用できます。ギミックが多い高難度ボスや無限タワーで真価を発揮！</div>
          <div class="wk-step"><strong>✨ カードレベル強化（最大Lv.5）</strong><br>
            カードパックやショップで同名カードを集めると自動でLvアップします。レア度が高いほど強化幅が大きく、<strong>SSRは基礎1.24倍＆1Lvごとに+22%</strong>と別格の伸びを見せます（現在全${cardTotal}種）。</div>
        `
      },
      {
        title: "⚔️ 全8武器種ごとの固有カード特性一覧",
        tags: "武器 大剣 双剣 狙撃銃 重槌 戦術槍 戦術杖 アサルト 片手剣",
        html: `
          <div class="wk-table">
            <div class="wk-tr wk-th"><span>武器種</span><span>固有カードの強み・役割</span></div>
            <div class="wk-tr"><span>🗡️ 大剣</span><span>通常・戦技ともに高倍率＆体勢削りが優秀な主砲</span></div>
            <div class="wk-tr"><span>⚔️ 双剣</span><span>通常札が<strong>0コスト</strong>＆戦技にAP+1還元。EX回収最速</span></div>
            <div class="wk-tr"><span>🎯 狙撃銃</span><span>通常・崩し札に<strong>2T防御DOWN</strong>付与＆高火力</span></div>
            <div class="wk-tr"><span>🔨 重槌</span><span>圧倒的な体勢削り＆<strong>崩し2.8倍特効</strong>のブレイカー</span></div>
            <div class="wk-tr"><span>🔱 戦術槍</span><span>通常札に小防壁＆戦技に<strong>カウンター反撃</strong>付き</span></div>
            <div class="wk-tr"><span>🪄 戦術杖</span><span>通常札に1ドロー＆戦技に<strong>小隊回復</strong>の命綱</span></div>
            <div class="wk-tr"><span>🔫 アサルト</span><span>通常札に<strong>1ドロー</strong>付きで手札事故を徹底防止</span></div>
            <div class="wk-tr"><span>⚔️ 片手剣</span><span>攻防バランス型＆通常札のEXゲージ回収が高め</span></div>
          </div>
        `
      },
      {
        title: "💡 おすすめデッキ構築サンプル（3タイプ）",
        tags: "おすすめ テンプレ 構築 例 コンボ",
        html: `
          <div class="wk-step"><strong>① 迷ったらコレ！王道バランス型（24〜28枚）</strong><br>
            0コスドロー札（戦術リロード等）×3、崩し札×3〜4、防壁／カウンター札×4、回復札×2〜3、残りを小隊と元素反応が起きる攻撃札で固めます。</div>
          <div class="wk-step"><strong>② 対ボス・融解／蒸発ワンパン型（20〜24枚）</strong><br>
            炎アタッカー＋氷／水キャラを編成し、『元素オーバーロード』『弱点部位スキャン』などバフ＆防御DOWN札を多めに採用。3連チェインの3枚目で2.2倍融解を叩き込みます。</div>
          <div class="wk-step"><strong>③ 鉄壁カウンター持久戦型（30〜36枚）</strong><br>
            リリィ・クロエ・ランなどバリア持ちと『見切りカウンター』『イージス防壁』を厚めに採用。敵の大技を反撃しながら安定勝利を狙います。</div>
        `
      }
    ],

    growth: [
      {
        title: "📈 戦力を効率よく伸ばす4つの強化軸",
        tags: "育成 レベル 昇格 スキルツリー 凸 限界突破 主人公",
        html: `
          <ul class="wk-list">
            <li><strong>1. レベル上げ（📘作戦記録）</strong>：最も基本の火力・HP強化。育成クエスト『記録の間』で大量入手。</li>
            <li><strong>2. 昇格・ランク解放（💠元素コア）</strong>：Lv上限（20→40→60→80）を開放。<strong>主人公は昇格するとレア度自体が R → SR → SSR へ進化</strong>します！</li>
            <li><strong>3. スキルツリー</strong>：解放するほど固有カードとEX必殺の倍率が段階的にアップ。</li>
            <li><strong>4. 限界突破（凸＋1〜5）</strong>：スカウトで隊員が重なると自動で戦力が大きく底上げされます。</li>
            <li><strong>⚔️ 隊長の自由カスタマイズ</strong>：隊員詳細画面から、主人公の『6属性』と『8武器種』をいつでも無料で切替可能。パーティに足りない属性を埋めるのに最適です。</li>
          </ul>
        `
      },
      {
        title: "👑 限定ピックアップSSR 7名の固有パッシブ一覧",
        tags: "限定 ピックアップ SSR ミコト セレスティア シルフィ セリーナ リリィ マリナ イリス パッシブ",
        html: `
          <p class="wk-p">限定SSRは基礎戦力が別格（約1.38倍＋ボーナス）なうえ、<strong>完全専用の強力カード3枚・限定EX必殺・編成するだけで発動する固有パッシブ</strong>を持っています。</p>
          <div class="wk-table">
            <div class="wk-tr wk-th"><span>限定隊員</span><span>編成パッシブ＆特徴</span></div>
            <div class="wk-tr"><span>❄️ ミコト<br><small>(12月PU)</small></span><span>開幕に<strong>氷結バリア25%＆敵へ氷付着</strong>。攻防回復すべて高水準</span></div>
            <div class="wk-tr"><span>⚡ セレスティア<br><small>(1月PU)</small></span><span>開幕に<strong>3T防御DOWN＆EX+25%</strong>。初手から超火力狙撃</span></div>
            <div class="wk-tr"><span>🐺 シルフィ<br><small>(2月PU)</small></span><span>開幕に<strong>AP+2＆追加1ドロー</strong>。1ターン目から怒涛の連撃</span></div>
            <div class="wk-tr"><span>🌸 セリーナ<br><small>(3月PU)</small></span><span><strong>毎ターンHP10%回復＆EX+12%</strong>。圧倒的継戦サポート</span></div>
            <div class="wk-tr"><span>🤍 リリィ<br><small>(4月PU)</small></span><span>開幕<strong>特大バリア38%</strong>＆ターン経過時のバリア維持率UP(75%)</span></div>
            <div class="wk-tr"><span>🐚 マリナ<br><small>(5月PU)</small></span><span>開幕<strong>水付着＆部位破壊ダメ+45%</strong>。ボス部位破壊の鬼</span></div>
            <div class="wk-tr"><span>🌹 イリス<br><small>(6月PU)</small></span><span>開幕次撃1.35倍＆<strong>3連チェイン3枚目+55%</strong>の最強炎火力</span></div>
          </div>
        `
      },
      {
        title: "🌠 スカウト天井ルール ＆ 💞 絆システム",
        tags: "ガチャ スカウト 天井 復刻 絆 エピソード 称号",
        html: `
          <ul class="wk-list">
            <li><strong>🎯 80連SSR天井</strong>：SSR確率3.5%（65連目から14%へ確率UP・80連で確定）。PU招集でSSRがすり抜けた場合、次回のSSRは<strong>100%ピックアップ確定</strong>！</li>
            <li><strong>🔄 限定＆復刻ルール</strong>：限定SSRは恒常招集やすり抜け枠には出現せず、本PUまたは<strong>毎月11日〜20日の『中旬復刻PU』</strong>でのみ招集できます。</li>
            <li><strong>💞 絆Lv.3（30pt）で個別エピソード解放</strong>：読了すると💎結晶石+240・🎟️パック券+3・<strong>専用称号</strong>がもらえます。</li>
          </ul>
        `
      }
    ],

    contents: [
      {
        title: "🗼 無限の瘴霧タワー ＆ ☄️ 融光レイド",
        tags: "極限作戦 エンドコンテンツ タワー レイド ハイスコア 掃討",
        html: `
          <div class="wk-step"><strong>🗼 無限の瘴霧タワー</strong><br>
            階層が上がるほど敵が強くなる腕試しダンジョン。一度クリアした最高階層に応じて、<strong>毎日ワンタップで『掃討ボーナス』</strong>を受け取れるため、登れるところまで登るほど毎日お得になります。</div>
          <div class="wk-step"><strong>☄️ 融光レイド（5ターン・スコアアタック）</strong><br>
            5ターン以内にどれだけ総ダメージを稼げるか競うモード。<strong>防御DOWN（超電導／スキャン／セレスティア）＋攻撃倍率バフ＋融解(2.2倍)／蒸発(2.0倍)＋3連チェイン＋限定EX</strong>を重ねるのがSランク突破の鍵！</div>
        `
      },
      {
        title: "🏆 同時プロット対人アリーナ（オンライン＆1台2人）",
        tags: "対人 PvP アリーナ オンライン ルーム 読み合い 三すくみ",
        html: `
          <p class="wk-p">お互いにカードを伏せて同時にオープンする心理戦バトル！4桁の部屋番号を友達や<strong>💬 掲示板</strong>で共有すれば、離れた相手ともリアルタイム対戦できます。</p>
          <div class="wk-step"><strong>🔺 読み合いの基本三すくみ</strong><br>
            ・<strong>⚔️ 攻撃</strong> は <strong>💥 崩し</strong> に勝つ（純粋火力勝ち）<br>
            ・<strong>🛡️ 防御／カウンター</strong> は <strong>⚔️ 攻撃</strong> に勝つ（反撃で大逆転）<br>
            ・<strong>💥 崩し</strong> は <strong>🛡️ 防御</strong> に勝つ（装甲粉砕で大ダメージ）</div>
        `
      },
      {
        title: "🎪 月次期間限定イベント ＆ 🏭 キャンプ／クラフト",
        tags: "イベント 交換所 キャンプ 調理 料理 武器鍛造 クラフト",
        html: `
          <ul class="wk-list">
            <li><strong>🎪 月次大型イベント</strong>：毎月1日開幕！<strong>1日（第1弾）・11日（第2弾）・21日（第3弾）の3回更新</strong>で物語・狩猟・交換所が拡張され、更新ごとに新戦術カード2種（月計6種）が自動追加されます。</li>
            <li><strong>🍳 タイミング調理ミニゲーム</strong>：無料で挑戦でき、成功すると次のバトルの攻撃力に強力バフが付きます。難敵ボス戦の前に必ず食べましょう！</li>
            <li><strong>🔨 武器鍛造</strong>：ボスの部位破壊素材から作る伝説武器は、<strong>所持しているだけで常時パーティ全体の攻撃力が永続UP</strong>します。</li>
          </ul>
        `
      }
    ],

    glossary: [
      {
        title: "🌍 世界観・ストーリー用語集",
        tags: "用語集 世界観 ミアズマ 瘴霧 アーク 方舟都市 リベルタ クリアラー 第7小隊 霧獣 主霧獣 融光種 浄化ビーコン 軌道ポッド",
        html: `
          <div class="wk-table">
            <div class="wk-tr wk-th"><span>用語</span><span>解説</span></div>
            <div class="wk-tr"><span>🟣 ミアズマ<br><small>（瘴霧）</small></span><span>百年前に地上を覆った紫の霧。生物を凶暴化させ、通常の人間は長時間吸い込むと活動できない。</span></div>
            <div class="wk-tr"><span>💎 アーク結晶</span><span>旧文明が発見した未知のエネルギー結晶。都市の動力源であり、隊員の武器や戦術カードの力にも使われる。</span></div>
            <div class="wk-tr"><span>🏙️ 方舟都市<br><small>リベルタ</small></span><span>瘴霧から逃れた人類が築いた天空の避難都市。中央アーク炉の寿命が迫り、地上奪還計画が始動した。</span></div>
            <div class="wk-tr"><span>🛡️ 第7クリアラー<br><small>小隊</small></span><span>プレイヤーが隊長を務める地上開拓の精鋭部隊。浄化ビーコンを設置し、霧に閉ざされた大地を切り拓く。</span></div>
            <div class="wk-tr"><span>👾 霧獣<br><small>ミアズマ・ビースト</small></span><span>ミアズマと結晶を取り込んで変異した地上の怪物。強大な個体は『主霧獣』と呼ばれ領域を支配している。</span></div>
            <div class="wk-tr"><span>👑 融光種<br><small>ラディアント</small></span><span>超高純度の黄金アークと融合し暴走した特異個体。通常の主霧獣を遥かに凌ぐ戦闘力を持つ。</span></div>
            <div class="wk-tr"><span>📡 浄化ビーコン</span><span>周囲の瘴霧を吹き払い、前線キャンプや安全地帯を確保するための開拓装置。</span></div>
            <div class="wk-tr"><span>🛰️ 軌道ポッド</span><span>方舟都市から地上の前線へ、増援隊員や戦術物資を高速投下する降下カプセル（スカウト演出）。</span></div>
          </div>
        `
      },
      {
        title: "⚔️ バトル・システム用語集",
        tags: "用語集 AP コスト チェイン EX ブレイク 体勢 部位破壊 装甲硬化 チャージ オーバードライブ 凸 昇格 予備EN",
        html: `
          <div class="wk-table">
            <div class="wk-tr wk-th"><span>用語</span><span>意味・ルール</span></div>
            <div class="wk-tr"><span>🔵 AP</span><span>カードを使うための行動ポイント。毎ターン基本4回復し、一部カードの『AP+1』効果でさらに伸ばせる。</span></div>
            <div class="wk-tr"><span>🔥 3連チェイン</span><span>プレイマットの3枠すべてにカードを並べて発動すること。3枚目の威力が大幅UPし、EXゲージも追加上昇。</span></div>
            <div class="wk-tr"><span>🌟 EX必殺札</span><span>EXゲージ100%で手札に自動生成されるコスト0の超必殺カード。1度使うと消滅する切り札。</span></div>
            <div class="wk-tr"><span>💫 ブレイク<br><small>（体勢崩し）</small></span><span>敵の黄色い『体勢ゲージ』を満タンにすると発生。敵の行動を1ターン完全に止められる。</span></div>
            <div class="wk-tr"><span>🛡️ 装甲硬化</span><span>敵の防御構え。通常攻撃は半減されるが、【💥崩し】カードを当てると特効大ダメージ＆即ブレイク！</span></div>
            <div class="wk-tr"><span>💥 部位破壊</span><span>ボスの角や翼など特定部位のHPを0にすること。敵が弱体化し、武器鍛造用のレア素材が落ちる。</span></div>
            <div class="wk-tr"><span>💢 怒り覚醒</span><span>ボスのHPが50%以下で発動するオーバードライブ状態。敵の攻撃力が1.35倍に跳ね上がる。</span></div>
            <div class="wk-tr"><span>☠️ Lv差圧倒</span><span>育成クエスト中級・上級などで小隊平均Lvが基準未満の時に発動するペナルティ。育成すれば解除される。</span></div>
            <div class="wk-tr"><span>⭐ 凸（限界突破）</span><span>スカウトで所持済み隊員を再獲得した際の自動強化（最大凸＋5）。基礎戦力が大きく上昇する。</span></div>
            <div class="wk-tr"><span>⚡ 予備EN</span><span>上限160から溢れたスタミナが自動で貯まるタンク（最大1,000）。EN不足時に自動で補填される。</span></div>
          </div>
        `
      }
    ],

    faq: [
      {
        title: "❓ 戦術パック券（🎟️）はどこで集められる？",
        tags: "パック券 カードガチャ 集め方 クレジット",
        html: `
          <p class="wk-p">戦術カードは石を使わず『🎟️ 戦術パック券』で引けます（10連は券8枚でお得＆SR以上確定）。主な入手先は以下の通りです。</p>
          <ul class="wk-list">
            <li>霧獣討伐の手動クリア報酬（毎回ドロップ）</li>
            <li>デイリー・ウィークリー任務＆ログボ＆絆エピソード読了</li>
            <li>期間限定イベントの交換所</li>
            <li>スカウトの『🎟️ カード』画面でクレジット購入（🪙2,000＝券1枚）</li>
          </ul>
        `
      },
      {
        title: "❓ 強敵やストーリーのボスに勝てない時は？",
        tags: "勝てない 詰まった 攻略 コツ 難しい",
        html: `
          <ol class="wk-list">
            <li><strong>『⚔️ 討伐・育成』→『📘 育成クエスト（初級）』</strong>で隊員Lvと昇格ランクを上げる</li>
            <li>隊員詳細の<strong>スキルツリー</strong>を解放し、固有カード倍率を上げる</li>
            <li>敵の弱点に合わせた<strong>元素反応（特に融解2.2倍・蒸発2.0倍・凍結）</strong>が起きる小隊に組み替える</li>
            <li><strong>🍳 クラフト画面のキャンプ飯</strong>で攻撃力バフを付けてから挑む</li>
            <li>デッキに<strong>【崩し】と【防御・回復】</strong>をバランスよく入れる</li>
          </ol>
        `
      },
      {
        title: "❓ セーブデータの引き継ぎ・交流・設定について",
        tags: "セーブ 引き継ぎ バックアップ 掲示板 意見箱 音楽 テーマ 速度",
        html: `
          <ul class="wk-list">
            <li><strong>🔑 引き継ぎコード</strong>：データはブラウザ内に保存されます。キャッシュ削除や機種変更に備え、『⚙️ 端末設定』から定期的に『MF-SAVE-』コードをメモ帳等へ保存してください。</li>
            <li><strong>💬 掲示板 ＆ 💌 意見箱</strong>：画面上部の『💬』から他プレイヤーとの交流やフレンド募集が可能。バグ報告や要望はタブレット2ページ目の『💌 意見箱』から開発者へ直接送れます。</li>
            <li><strong>🎨 快適設定</strong>：上部バーの『🏕️／⚡』で明暗テーマ切替、『🔊』で全12曲BGM＆SEのON/OFF、物語画面の上部ボタンで文字速度＆オート再生＆ログ確認ができます。</li>
          </ul>
        `
      }
    ]
  };
}

function setWikiSearch(val) {
  wikiSearchQuery = String(val || "").trim();
  renderWikiBodyOnly();
}

function clearWikiSearch() {
  wikiSearchQuery = "";
  const inp = document.getElementById("wiki-search-input");
  if (inp) inp.value = "";
  playSfx("tap");
  renderWikiBodyOnly();
}

function renderWikiView() {
  renderTopBar();
  const tabsEl = document.getElementById("wiki-tabs");
  if (tabsEl) {
    tabsEl.innerHTML = WIKI_TABS.map(t => `
      <button class="select-chip ${currentWikiTab === t.id && !wikiSearchQuery ? "selected" : ""}"
              onclick="currentWikiTab='${t.id}'; wikiSearchQuery=''; playSfx('tap'); renderWikiView();">
        ${t.label}
      </button>
    `).join("");
  }

  const bodyEl = document.getElementById("wiki-body");
  if (!bodyEl) return;

  bodyEl.innerHTML = `
    <div style="display:flex; gap:5px; margin-bottom:10px;">
      <input type="text" id="wiki-search-input" value="${escapeHtml(wikiSearchQuery)}"
             placeholder="🔍 キーワード検索（例：融解 / 融光種 / AP / ミコト）"
             oninput="setWikiSearch(this.value)"
             style="flex:1; font-size:12px; padding:7px 10px;" />
      <button class="btn-xs" onclick="clearWikiSearch()">✕</button>
    </div>
    <div id="wiki-content-area"></div>
  `;

  renderWikiBodyOnly();
}

function renderWikiBodyOnly() {
  const area = document.getElementById("wiki-content-area");
  if (!area) return;
  const allData = getWikiSections();
  const q = wikiSearchQuery.toLowerCase();

  let items = [];
  if (q) {
    Object.values(allData).forEach(list => {
      list.forEach(sec => {
        const hay = `${sec.title} ${sec.tags || ""} ${sec.html.replace(/<[^>]+>/g, " ")}`.toLowerCase();
        if (hay.includes(q)) items.push(sec);
      });
    });
  } else {
    items = allData[currentWikiTab] || allData.beginner;
  }

  if (items.length === 0) {
    area.innerHTML = `
      <div style="text-align:center; padding:18px; font-size:12px; color:var(--muted); background:var(--surface-sub); border-radius:12px;">
        『${escapeHtml(wikiSearchQuery)}』に一致する記事が見つかりませんでした。
      </div>
    `;
    return;
  }

  area.innerHTML = (q ? `<div style="font-size:11px; font-weight:900; color:var(--accent); margin-bottom:7px;">🔍 検索結果：${items.length}件</div>` : "") +
    items.map(sec => `
      <div style="background:var(--surface-sub); border:2px solid var(--border); border-radius:12px; padding:10px; margin-bottom:9px; text-align:left;">
        <strong style="display:block; font-size:13px; color:var(--accent); margin-bottom:6px; border-bottom:1.5px dashed var(--border); padding-bottom:4px;">${sec.title}</strong>
        <div class="wk-box">${sec.html}</div>
      </div>
    `).join("");
}
