let currentWikiTab = "battle";

const WIKI_SECTIONS = {
  battle: {
    title: "⚔️ バトル＆3すくみのコツ",
    items: [
      { head: "1. 敵の「予兆」を見て手札を選ぼう", body: "敵HPの下にある赤い予兆バナーが次の敵行動です。毎ターン最大3枚まで、出す順番を決めて発動します。" },
      { head: "2. 3すくみの読み合いルール", body: "【崩し】は敵の『装甲硬化』や『必殺チャージ』に大ダメージ＆行動キャンセル！【防御・カウンター】は敵の『攻撃・強攻撃』を軽減しつつ大反撃できます。" },
      { head: "3. 3連チェイン＆EX必殺カード", body: "カードを3枚続けて出すと、3枚目の威力が+30%＆EXゲージ大幅UP！ゲージ100%でリーダーの0コスト超必殺カードが手札に降臨します。" }
    ]
  },
  element: {
    title: "✨ 全6元素反応・早見表",
    items: [
      { head: "🔥炎 × 💧水 ＝ 蒸発（2.0倍）", body: "単発ダメージが2倍に跳ね上がる王道コンボ。1枚目に水、2枚目に高火力な炎カードを出すのが基本です。" },
      { head: "🔥炎 × ❄️氷 ＝ 融解（2.2倍）", body: "全反応中トップクラスの瞬間火力！ルナリアとミコトの組み合わせが極めて強力です。" },
      { head: "💧水 × ❄️氷 ＝ 凍結（完全行動封鎖）", body: "敵を凍らせてそのターンの行動を丸ごとスキップさせます。ボスの大技対策に最強です。" },
      { head: "🔥炎 × ⚡雷 ＝ 過負荷（爆発＆体勢大削り）", body: "爆発ダメージと同時に敵の体勢ゲージを大きく削り、ダウン（ブレイク）を狙いやすくします。" },
      { head: "⚡雷 × ❄️氷 ＝ 超電導（防御DOWN）", body: "2ターン敵の防御を下げ、部位破壊や通常ダメージを底上げします。" },
      { head: "💧水 × ⚡雷 ＝ 感電 ／ 🌪️風 ＝ 拡散 ／ ✨煌 ＝ 結晶化", body: "感電は継続ダメージ、風は付着中の元素を拡散して大ダメージ、煌は味方に強固な結晶バリアを張ります。" }
    ]
  },
  deck: {
    title: "🃏 デッキ構築＆カード強化",
    items: [
      { head: "固有12枚 ＋ 戦術8枚 ＝ 20枚デッキ", body: "パーティ編成した4人から固有カードが3枚ずつ（計12枚）自動で入り、残り8枚を戦術・防御・伝説カードから自由に組みます。" },
      { head: "おすすめバランス配分", body: "最初は『崩し2枚・防御/カウンター2枚・回復1枚・ドロー/バフ2枚・属性起点1枚』のバランスが安定して勝ちやすいです。" },
      { head: "カードの入手とLv強化", body: "スカウト画面の『🃏 カード招集』で新カードを入手できます。同じカードが重なると自動でカードLvが上がり（最大Lv.5）、威力やバリア量が強化されます！" }
    ]
  },
  hunt: {
    title: "💥 部位破壊・融光種・調査ノート",
    items: [
      { head: "部位破壊で弱体化＆レア素材GET", body: "ボス戦では『🎯 部位ボタン』で狙う部位を選べます。破壊すると敵の攻撃力が下がり、武器クラフト用の希少素材が確定ドロップします。" },
      { head: "変異強敵『融光種』とは", body: "濃霧の開拓マップや討伐リストに出現する黄金の変異個体。非常に手強いですが、最強クラスの武器素材と大量の報酬を落とします。" },
      { head: "調査ノートで初討伐ボーナス！", body: "初めて倒した霧獣や3体討伐を達成すると、タブレット内の『📓 調査ノート』から結晶石や作戦記録のボーナスを受け取れます。" }
    ]
  }
};

function renderWikiView() {
  renderTopBar();
  const tabsEl = document.getElementById("wiki-tabs");
  const bodyEl = document.getElementById("wiki-body");
  if (!tabsEl || !bodyEl) return;

  tabsEl.innerHTML = Object.entries(WIKI_SECTIONS).map(([key, sec]) => `
    <button class="select-chip ${currentWikiTab === key ? "selected" : ""}"
            onclick="currentWikiTab='${key}'; playSfx('tap'); renderWikiView();">
      ${sec.title}
    </button>
  `).join("");

  const active = WIKI_SECTIONS[currentWikiTab] || WIKI_SECTIONS.battle;
  bodyEl.innerHTML = active.items.map(it => `
    <div class="card" style="padding:10px; margin-bottom:8px; background:var(--surface-sub);">
      <strong style="font-size:13px; color:var(--accent); display:block; margin-bottom:4px;">${escapeHtml(it.head)}</strong>
      <div style="font-size:12px; line-height:1.55;">${escapeHtml(it.body)}</div>
    </div>
  `).join("");
}
