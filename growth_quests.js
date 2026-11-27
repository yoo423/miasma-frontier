let currentBattleSubTab = "hunt"; // "hunt" | "growth"
let growthTierFilter = "easy";    // "easy" | "mid" | "hard"

const GROWTH_QUESTS = [
  // ===== 初級（Lv.1〜 誰でも育成を始められる） =====
  { id: "gq_books_1",   tier: "easy", icon: "📘", title: "作戦記録訓練【初級】", enCost: 15, enemyId: "wolf_pack",   minReqLv: 1,  recPower: 360,  hpMult: 1.0, atkMult: 1.0, bonus: { books: 22, credits: 1500 }, desc: "まずはここから！隊員のレベル上げ用『作戦記録』を確保。" },
  { id: "gq_credits_1", tier: "easy", icon: "🪙", title: "資金輸送護衛【初級】", enCost: 15, enemyId: "wolf_pack",   minReqLv: 1,  recPower: 360,  hpMult: 1.0, atkMult: 1.0, bonus: { credits: 10000, books: 5 }, desc: "強化やショップ買い物に使うクレジットを手堅く稼ぐ。" },
  { id: "gq_cores_1",   tier: "easy", icon: "💠", title: "元素コア採取【初級】", enCost: 20, enemyId: "spore_slime", minReqLv: 5,  recPower: 460,  hpMult: 1.0, atkMult: 1.0, bonus: { cores: 5, credits: 2500 }, desc: "昇格試練・スキルツリー用の『元素コア』を採取。" },
  { id: "gq_tickets_1", tier: "easy", icon: "🎟️", title: "戦術パック演習【初級】", enCost: 20, enemyId: "spore_slime", minReqLv: 5, recPower: 460, hpMult: 1.0, atkMult: 1.0, bonus: { tickets: 3, credits: 2000 }, desc: "カードスカウト用の『戦術パック券』を集める基礎演習。" },

  // ===== 中級（平均Lv.18必須：育成不足だと圧倒される難関） =====
  { id: "gq_books_2",   tier: "mid",  icon: "📘", title: "作戦記録訓練【中級】", enCost: 25, enemyId: "crystal_beetle", minReqLv: 18, recPower: 1100, hpMult: 1.85, atkMult: 1.65, bonus: { books: 65, credits: 5000 }, desc: "【平均Lv.18推奨】重装精鋭が相手。昇格と強化が必須！" },
  { id: "gq_credits_2", tier: "mid",  icon: "🪙", title: "資金輸送護衛【中級】", enCost: 25, enemyId: "crystal_beetle", minReqLv: 18, recPower: 1100, hpMult: 1.85, atkMult: 1.65, bonus: { credits: 32000, books: 12 }, desc: "【平均Lv.18推奨】精鋭霧獣の猛攻を凌ぎ巨額資金を得る。" },
  { id: "gq_cores_2",   tier: "mid",  icon: "💠", title: "元素コア採取【中級】", enCost: 30, enemyId: "moss_behemoth",  minReqLv: 20, recPower: 1350, hpMult: 1.55, atkMult: 1.55, bonus: { cores: 14, credits: 7000 }, desc: "【平均Lv.20推奨】主霧獣級の猛威。大量の元素コアを獲得。" },
  { id: "gq_tickets_2", tier: "mid",  icon: "🎟️", title: "戦術パック演習【中級】", enCost: 30, enemyId: "moss_behemoth", minReqLv: 20, recPower: 1350, hpMult: 1.55, atkMult: 1.55, bonus: { tickets: 6, credits: 6500 }, desc: "【平均Lv.20推奨】突破できればパック券を一気に6枚獲得！" },

  // ===== 上級（平均Lv.38必須：低レベルは絶対突破不可のエンド育成戦） =====
  { id: "gq_books_3",   tier: "hard", icon: "📘", title: "作戦記録訓練【上級】", enCost: 35, enemyId: "thunder_wyvern",  minReqLv: 38, recPower: 2600, hpMult: 2.3,  atkMult: 2.1,  bonus: { books: 160, credits: 15000 }, desc: "【平均Lv.38必須】極限強化された雷竜。育成MAX級の小隊で挑め！" },
  { id: "gq_credits_3", tier: "hard", icon: "🪙", title: "資金輸送護衛【上級】", enCost: 35, enemyId: "thunder_wyvern",  minReqLv: 38, recPower: 2600, hpMult: 2.3,  atkMult: 2.1,  bonus: { credits: 85000, books: 25 }, desc: "【平均Lv.38必須】超高難易度護衛戦。破格のクレジット報酬！" },
  { id: "gq_cores_3",   tier: "hard", icon: "💠", title: "元素コア採取【上級】", enCost: 40, enemyId: "radiant_wyvern",  minReqLv: 42, recPower: 3300, hpMult: 2.1,  atkMult: 2.0,  bonus: { cores: 32, credits: 20000 }, desc: "【平均Lv.42必須】融光種の猛攻を耐え抜く最難関コア採取。" },
  { id: "gq_tickets_3", tier: "hard", icon: "🎟️", title: "戦術パック演習【上級】", enCost: 40, enemyId: "radiant_wyvern", minReqLv: 42, recPower: 3300, hpMult: 2.1, atkMult: 2.0, bonus: { tickets: 12, credits: 18000 }, desc: "【平均Lv.42必須】最強小隊の試金石！突破でパック券12枚！" }
];

function getPartyAvgLevel() {
  const list = state.party || [];
  if (!list.length) return 1;
  const sum = list.reduce((s, id) => s + (state.charLevels?.[id] || 1), 0);
  return Math.floor(sum / list.length);
}

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
  const avgLv = getPartyAvgLevel();
  const teamPower = state.party.reduce((sum, id) => sum + calcCharPower(id), 0);

  const tabsHtml = `
    <div style="font-size:11px; background:var(--surface-sub); padding:7px 9px; border-radius:9px; margin-bottom:8px;">
      ⚡ EN：<strong>${state.en}/${MAX_EN}</strong>（予備+${state.reserveEn}） ｜ 小隊平均Lv：<strong>Lv.${avgLv}</strong><br>
      <span style="color:var(--muted);">※基準Lv未満で中級・上級へ挑むと敵が『Lv差圧倒オーラ』を発動します！</span>
    </div>
    <div class="chip-grid cols-3" style="margin-bottom:8px;">
      <button class="select-chip ${growthTierFilter === "easy" ? "selected" : ""}" onclick="growthTierFilter='easy'; playSfx('tap'); renderGrowthQuestList();">🟢 初級</button>
      <button class="select-chip ${growthTierFilter === "mid" ? "selected" : ""}" onclick="growthTierFilter='mid'; playSfx('tap'); renderGrowthQuestList();">🟠 中級(Lv18+)</button>
      <button class="select-chip ${growthTierFilter === "hard" ? "selected" : ""}" onclick="growthTierFilter='hard'; playSfx('tap'); renderGrowthQuestList();">🔴 上級(Lv38+)</button>
    </div>
  `;

  const list = GROWTH_QUESTS.filter(q => q.tier === growthTierFilter);
  box.innerHTML = tabsHtml + list.map(q => {
    const lvShort = avgLv < q.minReqLv;
    const warn = lvShort
      ? `☠️ Lv不足(要平均Lv.${q.minReqLv})`
      : (teamPower < q.recPower ? "⚠️ 強敵・要注意" : "✅ 挑戦圏内");
    const bdStyle = lvShort ? "border-color:#ff4d5a;" : (q.tier === "hard" ? "border-color:#ffd000;" : "");
    return `
      <div class="card" style="padding:10px; margin-bottom:8px; ${bdStyle}">
        <div class="top-row">
          <strong style="font-size:13px;">${q.icon} ${escapeHtml(q.title)}</strong>
          <span class="rank-pill">⚡ EN ${q.enCost}</span>
        </div>
        <div style="font-size:10.5px; color:${lvShort ? "#ff4d5a" : "var(--muted)"}; font-weight:${lvShort ? "900" : "700"}; margin:3px 0;">
          推奨平均Lv.${q.minReqLv} / 戦力${q.recPower}（${warn}）
        </div>
        <div style="font-size:10.5px; color:var(--muted); margin-bottom:5px;">${escapeHtml(q.desc)}</div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:11px; font-weight:900; color:var(--accent);">${formatGrowthBonus(q.bonus)}</span>
          <button class="btn-xs ${lvShort ? "" : "btn-primary"}" onclick="startGrowthQuest('${q.id}')">⚔️ 出撃</button>
        </div>
      </div>
    `;
  }).join("");
}

function startGrowthQuest(questId) {
  const q = GROWTH_QUESTS.find(x => x.id === questId);
  if (!q) return;

  const avgLv = getPartyAvgLevel();
  if (avgLv < q.minReqLv) {
    if (!confirm(`⚠️ 警告：現在の小隊平均Lvは【Lv.${avgLv}】です。\nこのクエストは【平均Lv.${q.minReqLv}以上】が必須のため、敵が圧倒的なLv差オーラを発動し極めて危険です。\nそれでも出撃しますか？`)) {
      return;
    }
  }

  if (state.en < q.enCost) {
    const need = q.enCost - state.en;
    if ((state.reserveEn || 0) >= need) { state.reserveEn -= need; state.en += need; }
    else { showToast(`⚡ ENが足りません（必要 ${q.enCost}）`); return; }
  }
  state.en -= q.enCost;
  saveGame(); renderTopBar();

  startBattle(q.enemyId, {
    returnView: "battle",
    hpMult: q.hpMult,
    atkMult: q.atkMult,
    minReqLv: q.minReqLv,
    questTitle: q.title,
    onWin: () => {
      if (q.bonus.books) state.expBooks = (state.expBooks || 0) + q.bonus.books;
      if (q.bonus.credits) state.credits += q.bonus.credits;
      if (q.bonus.cores) state.cores = (state.cores || 0) + q.bonus.cores;
      if (q.bonus.tickets) state.cardTickets = (state.cardTickets || 0) + q.bonus.tickets;
      saveGame(); renderTopBar();
      showToast(`🎓 ${q.title}クリア！追加報酬：${formatGrowthBonus(q.bonus)}`);
    }
  });
}
