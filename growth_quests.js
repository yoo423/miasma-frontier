let currentBattleSubTab = "hunt"; // "hunt" | "growth"

const GROWTH_QUESTS = [
  {
    id: "gq_books_1", cat: "books", icon: "📘", title: "作戦記録訓練【初級】",
    enCost: 15, enemyId: "wolf_pack", recPower: 360,
    bonus: { books: 22, credits: 1500 },
    desc: "隊員のレベル上げに必要な『作戦記録』を大量獲得！"
  },
  {
    id: "gq_books_2", cat: "books", icon: "📘", title: "作戦記録訓練【中級】",
    enCost: 25, enemyId: "forest_boar", recPower: 560,
    bonus: { books: 48, credits: 3000 },
    desc: "中盤のレベル上げに最適！作戦記録を一気に稼ぐ訓練。"
  },
  {
    id: "gq_credits_1", cat: "credits", icon: "🪙", title: "資金輸送護衛【初級】",
    enCost: 15, enemyId: "wolf_pack", recPower: 360,
    bonus: { credits: 10000, books: 5 },
    desc: "強化・昇格・カード券交換に使うクレジットを大量確保！"
  },
  {
    id: "gq_credits_2", cat: "credits", icon: "🪙", title: "資金輸送護衛【上級】",
    enCost: 30, enemyId: "crystal_beetle", recPower: 720,
    bonus: { credits: 26000, books: 10 },
    desc: "高難易度の輸送護衛。クリアで大量のクレジットを獲得！"
  },
  {
    id: "gq_cores_1", cat: "cores", icon: "💠", title: "元素コア採取【初級】",
    enCost: 20, enemyId: "spore_slime", recPower: 460,
    bonus: { cores: 6, credits: 2500 },
    desc: "昇格試練やスキルツリー解放に必須の『元素コア』を採取！"
  },
  {
    id: "gq_cores_2", cat: "cores", icon: "💠", title: "元素コア採取【上級】",
    enCost: 30, enemyId: "crystal_beetle", recPower: 720,
    bonus: { cores: 14, credits: 5000 },
    desc: "高純度の元素コアを大量採取できる上級訓練。"
  },
  {
    id: "gq_tickets_1", cat: "tickets", icon: "🎟️", title: "戦術パック演習【初級】",
    enCost: 20, enemyId: "spore_slime", recPower: 460,
    bonus: { tickets: 3, credits: 2000 },
    desc: "カードガチャ専用『戦術パック券』を確実に集める演習！"
  },
  {
    id: "gq_tickets_2", cat: "tickets", icon: "🎟️", title: "戦術パック演習【上級】",
    enCost: 35, enemyId: "moss_behemoth", recPower: 980,
    bonus: { tickets: 7, credits: 6000 },
    desc: "主霧獣級の模擬演習。突破で大量の戦術パック券を獲得！"
  }
];

function setBattleSubTab(tab) {
  currentBattleSubTab = tab;
  playSfx("tap");
  const huntTab = document.getElementById("btl-tab-hunt");
  const grTab = document.getElementById("btl-tab-growth");
  if (huntTab) huntTab.className = `select-chip ${tab === "hunt" ? "selected" : ""}`;
  if (grTab) grTab.className = `select-chip ${tab === "growth" ? "selected" : ""}`;

  document.getElementById("btl-enemy-list").style.display = tab === "hunt" ? "block" : "none";
  document.getElementById("btl-growth-list").style.display = tab === "growth" ? "block" : "none";

  if (tab === "growth") renderGrowthQuestList();
  else if (typeof renderBattleView === "function") renderBattleView();
}

function formatGrowthBonus(b) {
  const p = [];
  if (b.books) p.push(`📘記録+${b.books}`);
  if (b.credits) p.push(`🪙+${b.credits.toLocaleString()}`);
  if (b.cores) p.push(`💠コア+${b.cores}`);
  if (b.tickets) p.push(`🎟️パック券+${b.tickets}`);
  return p.join(" / ");
}

function renderGrowthQuestList() {
  const box = document.getElementById("btl-growth-list");
  if (!box) return;
  const teamPower = state.party.reduce((sum, id) => sum + calcCharPower(id), 0);

  const infoHtml = `
    <div style="font-size:11px; background:var(--surface-sub); padding:7px 9px; border-radius:9px; margin-bottom:8px;">
      ⚡ 現在のEN：<strong>${state.en}/${MAX_EN}</strong>（予備 +${state.reserveEn}）<br>
      <span style="color:var(--muted);">ストーリーのボスに勝てない時は、ここで素材を集めて隊員とデッキを強化しよう！</span>
    </div>
  `;

  box.innerHTML = infoHtml + GROWTH_QUESTS.map(q => {
    const warn = teamPower < q.recPower ? "⚠️ 強敵" : "✅ 推奨圏内";
    return `
      <div class="card" style="padding:10px; margin-bottom:8px;">
        <div class="top-row">
          <strong style="font-size:13px;">${q.icon} ${escapeHtml(q.title)}</strong>
          <span class="rank-pill">⚡ EN ${q.enCost}</span>
        </div>
        <div style="font-size:10.5px; color:var(--muted); margin:3px 0;">
          推奨戦力 ${q.recPower}（${warn}） ／ ${escapeHtml(q.desc)}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
          <span style="font-size:11px; font-weight:900; color:var(--accent);">${formatGrowthBonus(q.bonus)}</span>
          <button class="btn-xs btn-primary" onclick="startGrowthQuest('${q.id}')">⚔️ 出撃</button>
        </div>
      </div>
    `;
  }).join("");
}

function startGrowthQuest(questId) {
  const q = GROWTH_QUESTS.find(x => x.id === questId);
  if (!q) return;

  // EN消費（本体ENが足りなければ予備ENから自動補充）
  if (state.en < q.enCost) {
    const need = q.enCost - state.en;
    if ((state.reserveEn || 0) >= need) {
      state.reserveEn -= need;
      state.en += need;
    } else {
      showToast(`⚡ ENが足りません（必要 ${q.enCost}）`);
      return;
    }
  }
  state.en -= q.enCost;
  saveGame();
  renderTopBar();

  startBattle(q.enemyId, {
    returnView: "battle",
    onWin: () => {
      if (q.bonus.books) state.expBooks = (state.expBooks || 0) + q.bonus.books;
      if (q.bonus.credits) state.credits += q.bonus.credits;
      if (q.bonus.cores) state.cores = (state.cores || 0) + q.bonus.cores;
      if (q.bonus.tickets) state.cardTickets = (state.cardTickets || 0) + q.bonus.tickets;
      saveGame();
      renderTopBar();
      showToast(`🎓 ${q.title}クリア！追加報酬：${formatGrowthBonus(q.bonus)}`);
    }
  });
}
