let cookCursor = 0;
let cookDir = 1;
let cookAnimId = null;
let cookingActive = false;

function getCampSave() {
  state.camp = state.camp || {
    minerLv: 1,
    smelterLv: 1,
    labLv: 1,
    linkedBeast: "none",
    lastCollectTime: Date.now(),
    activeBuff: null
  };
  return state.camp;
}

const BEAST_LINKS = [
  { id: "none", name: "未リンク（標準稼働）", emoji: "⚙️", bonusText: "生産効率 1.0倍", mult: 1.0 },
  { id: "wolf", name: "ミアズマ・ウルフ", emoji: "🐺", bonusText: "採掘＆搬送効率 1.4倍", mult: 1.4 },
  { id: "beetle", name: "結晶甲虫", emoji: "🪲", bonusText: "鉱石＆資金産出 1.8倍", mult: 1.8 },
  { id: "wyvern", name: "サンダー・ワイバーン", emoji: "🐉", bonusText: "全工場オーバークロック 2.4倍", mult: 2.4 }
];

function calcPendingCampOutput() {
  const camp = getCampSave();
  const mins = Math.min(720, Math.max(0, (Date.now() - camp.lastCollectTime) / 60000));
  const link = BEAST_LINKS.find(b => b.id === camp.linkedBeast) || BEAST_LINKS[0];
  return {
    mins: Math.floor(mins),
    ore: Math.floor(mins * (0.4 + camp.minerLv * 0.25) * link.mult),
    credits: Math.floor(mins * (45 + camp.smelterLv * 35) * link.mult),
    books: Math.floor(mins * (0.12 + camp.labLv * 0.08) * link.mult),
    mult: link.mult
  };
}

function renderCampView() {
  renderTopBar();
  const camp = getCampSave();
  const pending = calcPendingCampOutput();

  document.getElementById("camp-pending-box").innerHTML = `
    <div class="top-row">
      <strong>🏭 自動ライン稼働中（蓄積 ${pending.mins}分 / 最大720分）</strong>
      <span class="rank-pill">効率 ×${pending.mult.toFixed(1)}</span>
    </div>
    <div style="font-size:12px; font-weight:800; margin:6px 0;">
      ⛏️ アーク結晶鉱：<strong>+${pending.ore}</strong> ｜ 🪙 精錬資金：<strong>+${pending.credits.toLocaleString()}</strong> ｜ 📘 解析記録：<strong>+${pending.books}</strong>
    </div>
    <button class="btn-primary" style="width:100%;" onclick="collectCampOutput()">
      📦 生産された資材を一括回収する
    </button>
  `;

  const facilities = [
    { key: "minerLv", icon: "⛏️", name: "自動採掘リグ", desc: "アーク結晶鉱の自動採掘量を増加" },
    { key: "smelterLv", icon: "🔥", name: "アーク精錬炉", desc: "精錬クレジットの自動生産量を増加" },
    { key: "labLv", icon: "🔬", name: "戦術データ解析機", desc: "作戦記録の自動生成量を増加" }
  ];

  document.getElementById("camp-facility-list").innerHTML = facilities.map(f => {
    const lv = camp[f.key] || 1;
    const cost = lv * 1800;
    return `
      <div class="card" style="padding:9px; margin-bottom:6px;">
        <div class="top-row">
          <strong>${f.icon} ${f.name}（Lv.${lv}）</strong>
          <button class="btn-xs btn-accent2" onclick="upgradeCampFacility('${f.key}')">強化（🪙${cost.toLocaleString()}）</button>
        </div>
        <div style="font-size:11px; color:var(--muted); margin-top:3px;">${f.desc}</div>
      </div>
    `;
  }).join("");

  document.getElementById("camp-beast-grid").innerHTML = BEAST_LINKS.map(b => `
    <button class="select-chip ${camp.linkedBeast === b.id ? "selected" : ""}" onclick="setCampBeastLink('${b.id}')">
      ${b.emoji} <strong>${escapeHtml(b.name)}</strong><br><span style="font-size:10px;">${b.bonusText}</span>
    </button>
  `).join("");
}

function collectCampOutput() {
  const camp = getCampSave();
  const pending = calcPendingCampOutput();
  if (pending.ore === 0 && pending.credits === 0 && pending.books === 0) {
    showToast("まだ回収できる資材が溜まっていません（1分以上で蓄積）");
    return;
  }
  camp.lastCollectTime = Date.now();
  state.materials = state.materials || {};
  if (pending.ore > 0) state.materials["アーク結晶鉱"] = (state.materials["アーク結晶鉱"] || 0) + pending.ore;

  let prismBonus = "";
  if (pending.mins >= 5 && Math.random() < 0.35) {
    state.materials["純度100%アーク・プリズム"] = (state.materials["純度100%アーク・プリズム"] || 0) + 1;
    prismBonus = " ＋ ✨突然変異『純度100%アーク・プリズム』×1！";
  }

  state.credits += pending.credits;
  state.expBooks = (state.expBooks || 0) + pending.books;
  saveGame();
  playSfx("gift");
  renderTopBar();
  renderCampView();
  showToast(`📦 回収完了！鉱石+${pending.ore} / 🪙+${pending.credits}${prismBonus}`);
}

function upgradeCampFacility(key) {
  const camp = getCampSave();
  const lv = camp[key] || 1;
  const cost = lv * 1800;
  if (state.credits < cost) { showToast(`🪙 クレジット不足（必要：${cost.toLocaleString()}）`); return; }
  state.credits -= cost;
  camp[key] = lv + 1;
  saveGame();
  playSfx("switch");
  renderTopBar();
  renderCampView();
  showToast(`🏭 施設レベルが Lv.${lv + 1} にアップ！`);
}

function setCampBeastLink(beastId) {
  getCampSave().linkedBeast = beastId;
  saveGame();
  playSfx("switch");
  renderCampView();
  showToast("🐾 霧獣の生体リンクを切り替えました！");
}

function renderCraftView() {
  renderTopBar();
  const camp = getCampSave();
  const mats = state.materials || {};
  state.craftedWeapons = state.craftedWeapons || [];

  document.getElementById("craft-buff-status").textContent = camp.activeBuff
    ? `🍖 現在のキャンプ飯バフ：${camp.activeBuff.name}（次回バトル攻撃力 +${camp.activeBuff.atkBonus}%）`
    : "🍖 キャンプ飯バフ：なし（下の調理ミニゲームでバフを獲得！）";

  document.getElementById("craft-recipe-list").innerHTML = (window.MF_DATA.CRAFT_RECIPES || []).map(rec => {
    const ownedWeapon = rec.cat === "weapon" && state.craftedWeapons.includes(rec.id);
    const reqText = Object.entries(rec.req).map(([k, v]) => `${k}×${v}(所持${mats[k] || 0})`).join(" / ");
    return `
      <div class="card" style="padding:10px; margin-bottom:8px;">
        <div class="top-row">
          <strong>${rec.icon} ${escapeHtml(rec.name)}</strong>
          ${ownedWeapon
            ? `<span class="tag" style="background:#18b88a; color:#fff;">鍛造済・効果発動中</span>`
            : `<button class="btn-xs btn-accent2" onclick="craftItem('${rec.id}')">作成（🪙${rec.credits.toLocaleString()}）</button>`}
        </div>
        <div style="font-size:11px; color:var(--muted); margin-top:3px;">${escapeHtml(rec.desc)}</div>
        <div style="font-size:10px; font-weight:800; margin-top:4px;">必要素材：${reqText}</div>
      </div>
    `;
  }).join("");
}

function craftItem(recipeId) {
  const rec = (window.MF_DATA.CRAFT_RECIPES || []).find(r => r.id === recipeId);
  if (!rec) return;
  state.materials = state.materials || {};
  state.craftedWeapons = state.craftedWeapons || [];

  if (state.credits < rec.credits) { showToast(`🪙 クレジット不足（必要：${rec.credits.toLocaleString()}）`); return; }
  for (const [matName, need] of Object.entries(rec.req)) {
    if ((state.materials[matName] || 0) < need) { showToast(`素材不足：『${matName}』が ${need}個 必要です`); return; }
  }

  state.credits -= rec.credits;
  for (const [matName, need] of Object.entries(rec.req)) state.materials[matName] -= need;
  if (rec.cat === "weapon") state.craftedWeapons.push(rec.id);
  else state.materials[rec.name] = (state.materials[rec.name] || 0) + 1;

  saveGame();
  playSfx("gift");
  renderCraftView();
  showToast(`🔨『${rec.name}』を作成しました！`);
}

function startCookingGame() {
  if (cookingActive) { stopCookingGame(); return; }
  cookingActive = true;
  cookCursor = 0;
  cookDir = 1;
  document.getElementById("btn-cook-action").textContent = "🔥 今だ！火を止める！";

  const step = () => {
    if (!cookingActive) return;
    cookCursor += cookDir * 2.6;
    if (cookCursor >= 100) { cookCursor = 100; cookDir = -1; }
    if (cookCursor <= 0) { cookCursor = 0; cookDir = 1; }
    const bar = document.getElementById("cook-cursor");
    if (bar) bar.style.left = `${cookCursor}%`;
    cookAnimId = requestAnimationFrame(step);
  };
  cookAnimId = requestAnimationFrame(step);
}

function stopCookingGame() {
  cookingActive = false;
  cancelAnimationFrame(cookAnimId);
  document.getElementById("btn-cook-action").textContent = "🍳 キャンプ飯を作る（無料）";

  const camp = getCampSave();
  const dist = Math.abs(50 - cookCursor);
  if (dist <= 12) {
    camp.activeBuff = { name: "特上・主霧獣ステーキ", atkBonus: 30 };
    playSfx("gift");
    showToast("🌟 大成功！『特上・主霧獣ステーキ』完成（攻撃力+30%）！");
  } else if (dist <= 28) {
    camp.activeBuff = { name: "こんがりアーク串焼き", atkBonus: 15 };
    playSfx("switch");
    showToast("🍖 成功！『こんがりアーク串焼き』完成（攻撃力+15%）！");
  } else {
    camp.activeBuff = { name: "謎の焦げ焦げダークシチュー", atkBonus: 5 };
    playSfx("tap");
    showToast("💀 焦げた……『謎のダークシチュー』完成（攻撃力+5%）");
  }
  saveGame();
  renderCraftView();
}
