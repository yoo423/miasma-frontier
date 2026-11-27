function hashStringSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pickFromPoolWithSeed(pool, seed, offset = 0) {
  if (!pool.length) return null;
  return pool[(seed + offset * 7) % pool.length];
}

function generateDailyShopItems(dateKey, refreshCount = 0) {
  const seed = hashStringSeed(`${dateKey}-shop-${refreshCount}`);
  const allCards = Object.values(window.MF_CARDS.TACTIC_CARDS || {});
  const ssrCards = allCards.filter(c => c.rarity === "SSR");
  const srCards = allCards.filter(c => c.rarity === "SR");
  const rCards = allCards.filter(c => c.rarity === "R");

  const cSsr = pickFromPoolWithSeed(ssrCards, seed, 1);
  const cSr1 = pickFromPoolWithSeed(srCards, seed, 2);
  const cSr2 = pickFromPoolWithSeed(srCards, seed, 5);
  const cR1 = pickFromPoolWithSeed(rCards, seed, 3);

  const items = [];
  if (cSsr) items.push({ uid: "s_ssr", kind: "card", cardId: cSsr.id, icon: cSsr.icon, name: `【SSR】${cSsr.name}`, desc: cSsr.summary, price: 18000, tag: "目玉SSR" });
  if (cSr1) items.push({ uid: "s_sr1", kind: "card", cardId: cSr1.id, icon: cSr1.icon, name: `【SR】${cSr1.name}`, desc: cSr1.summary, price: 7500, tag: "日替SR" });
  if (cSr2 && cSr2.id !== cSr1?.id) items.push({ uid: "s_sr2", kind: "card", cardId: cSr2.id, icon: cSr2.icon, name: `【SR】${cSr2.name}`, desc: cSr2.summary, price: 7500, tag: "日替SR" });
  if (cR1) items.push({ uid: "s_r1", kind: "card", cardId: cR1.id, icon: cR1.icon, name: `【R】${cR1.name}`, desc: cR1.summary, price: 3200, tag: "日替R" });

  items.push(
    { uid: "s_tk",   kind: "tickets", qty: 3,  icon: "🎟️", name: "戦術パック券 ×3",       desc: "カードスカウト用の割引パック券セット", price: 5000, tag: "お得" },
    { uid: "s_book", kind: "books",   qty: 25, icon: "📘", name: "作戦記録 ×25",          desc: "隊員のレベルを一気に引き上げる教本", price: 4500, tag: "育成" },
    { uid: "s_core", kind: "cores",   qty: 5,  icon: "💠", name: "元素コア ×5",           desc: "昇格試練・スキルツリー解放用の結晶コア", price: 6000, tag: "育成" },
    { uid: "s_gift", kind: "gift",    qty: 2,  icon: "💐", name: "アーク花のブーケ ×2",   desc: "隊員に贈ると絆ポイント+2（絆話解放用）", price: 3000, tag: "絆ギフト" }
  );
  return items;
}

function ensureShopState() {
  const today = typeof getLoginTodayStr === "function" ? getLoginTodayStr() : new Date().toISOString().slice(0, 10);
  if (!state.shopState || state.shopState.dateKey !== today) {
    state.shopState = {
      dateKey: today,
      refreshCount: 0,
      boughtIds: []
    };
  }
  return state.shopState;
}

function renderShopView() {
  renderTopBar();
  const sh = ensureShopState();
  const items = generateDailyShopItems(sh.dateKey, sh.refreshCount);

  document.getElementById("shop-header-info").innerHTML = `
    <div class="top-row">
      <span style="font-size:11px; font-weight:900;">📅 本日の品揃え（毎日0時更新）</span>
      <button class="btn-xs btn-primary" onclick="refreshShopLineup()">🔄 品揃え更新（🪙3,000）</button>
    </div>
    <div style="font-size:10px; color:var(--muted); margin-top:4px;">所持クレジット：🪙 ${state.credits.toLocaleString()} ｜ 欲しいSSRカードや絆ギフトを入手しよう！</div>
  `;

  document.getElementById("shop-item-list").innerHTML = items.map(it => {
    const sold = (sh.boughtIds || []).includes(it.uid);
    const canBuy = !sold && state.credits >= it.price;
    const ownedLv = it.kind === "card" ? window.MF_CARDS.getCardLevel(it.cardId) : 0;
    const cardExtra = it.kind === "card" ? (ownedLv > 0 ? `（所持Lv.${ownedLv}→Lv.${Math.min(5, ownedLv + 1)}）` : "（🆕未所持）") : "";
    return `
      <div class="card" style="padding:10px; margin-bottom:7px; opacity:${sold ? 0.55 : 1};">
        <div class="top-row">
          <strong style="font-size:12.5px;">${it.icon} ${escapeHtml(it.name)} <span class="tag">${it.tag}</span></strong>
          <span style="font-size:11px; font-weight:900; color:var(--accent);">🪙 ${it.price.toLocaleString()}</span>
        </div>
        <div style="font-size:10.5px; color:var(--muted); margin:3px 0;">${escapeHtml(it.desc)}${cardExtra}</div>
        <div style="display:flex; justify-content:flex-end; gap:5px; margin-top:5px;">
          ${it.kind === "card" ? `<button class="btn-xs" onclick="openTacticCardDetail('${it.cardId}')">詳細</button>` : ""}
          <button class="btn-xs ${canBuy ? "btn-accent2" : ""}" ${sold ? "disabled" : ""} onclick="buyShopItem('${it.uid}')">
            ${sold ? "SOLD OUT" : "購入する"}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function buyShopItem(uid) {
  const sh = ensureShopState();
  if (sh.boughtIds.includes(uid)) return;
  const items = generateDailyShopItems(sh.dateKey, sh.refreshCount);
  const it = items.find(x => x.uid === uid);
  if (!it) return;
  if (state.credits < it.price) { showToast(`🪙 クレジットが足りません（必要 ${it.price.toLocaleString()}）`); return; }

  state.credits -= it.price;
  sh.boughtIds.push(uid);

  if (it.kind === "card") {
    state.ownedCards = state.ownedCards || { ...window.MF_CARDS.STARTER_OWNED_CARDS };
    const prev = state.ownedCards[it.cardId] || 0;
    state.ownedCards[it.cardId] = Math.min(5, prev + 1);
    showToast(`🃏 ${it.name} を購入！（Lv.${state.ownedCards[it.cardId]}）`);
  } else if (it.kind === "tickets") {
    state.cardTickets = (state.cardTickets || 0) + it.qty;
    showToast(`🎟️ 戦術パック券 ×${it.qty} を購入しました！`);
  } else if (it.kind === "books") {
    state.expBooks = (state.expBooks || 0) + it.qty;
    showToast(`📘 作戦記録 ×${it.qty} を購入しました！`);
  } else if (it.kind === "cores") {
    state.cores = (state.cores || 0) + it.qty;
    showToast(`💠 元素コア ×${it.qty} を購入しました！`);
  } else if (it.kind === "gift") {
    state.bondGifts = (state.bondGifts || 0) + it.qty;
    showToast(`💐 アーク花のブーケ ×${it.qty} を購入！（絆画面で隊員に贈れます）`);
  }

  saveGame(); playSfx("gift");
  renderShopView();
}

function refreshShopLineup() {
  const cost = 3000;
  if (state.credits < cost) { showToast(`🪙 品揃え更新には ${cost.toLocaleString()} クレジット必要です`); return; }
  if (!confirm(`🪙 ${cost.toLocaleString()} を使って本日のショップ品揃えを更新しますか？`)) return;
  const sh = ensureShopState();
  state.credits -= cost;
  sh.refreshCount = (sh.refreshCount || 0) + 1;
  sh.boughtIds = [];
  saveGame(); playSfx("switch");
  renderShopView();
  showToast("🔄 補給ショップの品揃えを更新しました！");
}
