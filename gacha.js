let activeBannerId = "pickup_mikoto";
let gachaTimers = [];
let currentPullResults = [];
let spotlightIdx = 0;

function getGachaTabs() {
  return [
    ...(window.MF_DATA.BANNERS || []),
    {
      id: "card_pack", shortName: "🃏 カード", tag: "デッキ強化パック",
      title: "戦術・伝説カード特別パック", isCardBanner: true,
      desc: "全20種の戦術・防御・伝説SSRカードが排出！被ったカードは自動でLv.UPして性能強化（最大Lv.5）！"
    }
  ];
}

function renderGachaView() {
  renderTopBar();
  const tabs = getGachaTabs();
  const banner = tabs.find(b => b.id === activeBannerId) || tabs[0];

  document.getElementById("gacha-banner-tabs").innerHTML = tabs.map(b => `
    <button class="select-chip ${b.id === activeBannerId ? "selected" : ""}"
            onclick="activeBannerId='${b.id}'; playSfx('tap'); renderGachaView();">
      ${b.shortName}
    </button>
  `).join("");

  if (banner.isCardBanner) {
    document.getElementById("gacha-banner-card").innerHTML = `
      <span class="rank-pill" style="background:#ffd13b;">${banner.tag}</span>
      <h3 style="margin:6px 0 4px; font-size:16px;">🃏 ${escapeHtml(banner.title)}</h3>
      <p style="font-size:11px; color:var(--muted); margin:0;">${escapeHtml(banner.desc)}</p>
      <div style="font-size:11px; font-weight:900; color:var(--accent); margin-top:6px;">
        目玉SSR：⏳クロノ・シンクロ / 🌟融光ノヴァ / ❄️零度結界 / 🌩️天雷ブレイカー
      </div>
    `;
    document.getElementById("gacha-pity-text").textContent = "🃏 10連でSR以上の戦術カードが1枚確定！（被り＝自動カードLv.UP）";
    document.getElementById("btn-gacha-1").innerHTML = `1枚引く<br><span style="font-size:11px;">💎 120</span>`;
    document.getElementById("btn-gacha-10").innerHTML = `10連パック（SR以上確定）<br><span style="font-size:11px;">💎 1,000</span>`;
  } else {
    const feat = window.MF_DATA.CHARACTERS[banner.featuredSsr];
    document.getElementById("gacha-banner-card").innerHTML = `
      <div style="display:flex; gap:10px; align-items:center;">
        ${window.MF_SPRITES.portraitHTML(feat, "icon-lg")}
        <div style="text-align:left;">
          <span class="rank-pill">${banner.tag}</span>
          <h3 style="margin:4px 0; font-size:14px;">${escapeHtml(banner.title)}</h3>
          <p style="font-size:11px; color:var(--muted); margin:0;">${escapeHtml(banner.desc)}</p>
        </div>
      </div>
    `;
    const remain = Math.max(1, 80 - (state.pityCount || 0));
    document.getElementById("gacha-pity-text").textContent =
      `🎯 80連SSR天井まであと ${remain}回${state.pityGuaranteed ? "（★次回SSRはピックアップ確定！）" : ""}`;
    document.getElementById("btn-gacha-1").innerHTML = `1回招集<br><span style="font-size:11px;">💎 160</span>`;
    document.getElementById("btn-gacha-10").innerHTML = `10回招集（SR以上確定）<br><span style="font-size:11px;">💎 1,600</span>`;
  }
}

function executeScout(count) {
  const tabs = getGachaTabs();
  const banner = tabs.find(b => b.id === activeBannerId) || tabs[0];
  const cost = banner.isCardBanner ? (count === 10 ? 1000 : 120) : count * 160;

  if (state.gems < cost) { showToast(`💎 結晶石が足りません（必要：${cost.toLocaleString()}）`); return; }
  state.gems -= cost;

  const results = [];
  if (banner.isCardBanner) {
    state.ownedCards = state.ownedCards || { ...window.MF_CARDS.STARTER_OWNED_CARDS };
    const pool = Object.values(window.MF_CARDS.TACTIC_CARDS);
    const byRar = r => pool.filter(c => c.rarity === r);
    for (let i = 0; i < count; i++) {
      let rar = "N";
      const roll = Math.random();
      if (roll < 0.08) rar = "SSR";
      else if (roll < 0.30) rar = "SR";
      else if (roll < 0.65) rar = "R";
      if (count === 10 && i === 9 && !results.some(x => x.rarity === "SSR" || x.rarity === "SR")) rar = "SR";

      const list = byRar(rar);
      const picked = list[Math.floor(Math.random() * list.length)] || pool[0];
      const prevLv = state.ownedCards[picked.id] || 0;
      const isNew = prevLv === 0;
      const newLv = Math.min(5, prevLv + 1);
      state.ownedCards[picked.id] = newLv;
      results.push({ isCard: true, card: picked, rarity: picked.rarity, isNew, newLv });
    }
  } else {
    const chars = Object.values(window.MF_DATA.CHARACTERS).filter(c => !c.isProtagonist);
    const byRar = r => chars.filter(c => c.rarity === r);
    for (let i = 0; i < count; i++) {
      state.pityCount = (state.pityCount || 0) + 1;
      let rar = "N";
      const ssrRate = state.pityCount >= 65 ? 0.14 : 0.035;
      if (state.pityCount >= 80 || Math.random() < ssrRate) rar = "SSR";
      else if (Math.random() < 0.15) rar = "SR";
      else if (Math.random() < 0.55) rar = "R";
      if (count === 10 && i === 9 && !results.some(x => x.rarity === "SSR" || x.rarity === "SR")) rar = "SR";

      let picked = null;
      if (rar === "SSR") {
        state.pityCount = 0;
        const winPu = state.pityGuaranteed || Math.random() < 0.5;
        if (winPu) { picked = window.MF_DATA.CHARACTERS[banner.featuredSsr]; state.pityGuaranteed = false; }
        else {
          const std = byRar("SSR").filter(c => !c.limited);
          picked = std[Math.floor(Math.random() * std.length)] || window.MF_DATA.CHARACTERS.lunaria;
          state.pityGuaranteed = true;
        }
      } else {
        const list = byRar(rar);
        picked = list[Math.floor(Math.random() * list.length)];
      }
      const isNew = !state.ownedChars.includes(picked.id);
      if (isNew) {
        state.ownedChars.push(picked.id);
        state.charLevels[picked.id] = 1; state.charRanks[picked.id] = 0; state.charDupes[picked.id] = 0;
      } else {
        state.charDupes[picked.id] = Math.min(5, (state.charDupes[picked.id] || 0) + 1);
      }
      results.push({ isCard: false, char: picked, rarity: picked.rarity, isNew, dupe: state.charDupes[picked.id] || 0 });
    }
  }

  saveGame();
  renderTopBar();
  renderGachaView();
  currentPullResults = results;
  spotlightIdx = 0;
  openGachaAnimation(results);
}

function openGachaAnimation(results) {
  gachaTimers.forEach(t => clearTimeout(t));
  gachaTimers = [];
  const modal = document.getElementById("modal-gacha");
  document.getElementById("gacha-modal-stage").style.display = "block";
  document.getElementById("gacha-modal-spotlight").style.display = "none";
  document.getElementById("gacha-modal-results").style.display = "none";
  modal.classList.add("active");

  const hasSSR = results.some(r => r.rarity === "SSR");
  const hasSR = results.some(r => r.rarity === "SR");
  const beam = document.getElementById("pod-beam");
  const orb = document.getElementById("pod-visual");
  const lbl = document.getElementById("pod-label");

  beam.className = "sky-beam beam-blue";
  orb.className = "pod-orb pod-blue";
  orb.textContent = results[0]?.isCard ? "🃏" : "🛰️";
  lbl.textContent = results[0]?.isCard ? "戦術パックを開封中……" : "軌道ポッド降下開始……";
  playSfx("switch");

  if (hasSR || hasSSR) {
    gachaTimers.push(setTimeout(() => {
      beam.className = "sky-beam beam-gold"; orb.className = "pod-orb pod-gold";
      lbl.textContent = "⚡ 高エネルギー反応！黄金昇格！！"; playSfx("switch");
    }, 600));
  }
  if (hasSSR) {
    gachaTimers.push(setTimeout(() => {
      beam.className = "sky-beam beam-rainbow"; orb.className = "pod-orb pod-rainbow";
      orb.textContent = "👑"; lbl.textContent = "🌈 虹色突破！！SSR確定！！"; playSfx("gift");
    }, 1200));
  }
  gachaTimers.push(setTimeout(() => startSpotlightReveal(), hasSSR ? 1950 : (hasSR ? 1300 : 850)));
}

function startSpotlightReveal() {
  gachaTimers.forEach(t => clearTimeout(t));
  document.getElementById("gacha-modal-stage").style.display = "none";
  document.getElementById("gacha-modal-spotlight").style.display = "block";
  spotlightIdx = 0;
  renderSpotlightCard();
}

function renderSpotlightCard() {
  const item = currentPullResults[spotlightIdx];
  if (!item) { showGachaResultGrid(); return; }
  document.getElementById("spotlight-counter").textContent = `結果 ${spotlightIdx + 1} / ${currentPullResults.length}`;
  playSfx(item.rarity === "SSR" ? "gift" : "tap");

  if (item.isCard) {
    const c = item.card;
    const el = window.MF_DATA.ELEMENTS[c.element];
    document.getElementById("spotlight-card-body").innerHTML = `
      <div class="spotlight-frame rarity-${c.rarity}">
        <span class="rank-pill">${c.rarity} CARD</span>
        <span class="tag" style="background:#ffd13b;">${item.isNew ? "🆕 NEW!" : `Lv.${item.newLv} UP!`}</span>
        <div style="font-size:52px; margin:12px 0;">${c.icon}</div>
        <h3 style="margin:0 0 4px;">${escapeHtml(c.name)}</h3>
        <div style="font-size:12px; font-weight:900; color:var(--accent);">${el.icon} AP${c.cost} ｜ ${escapeHtml(c.summary)}</div>
        <div style="font-size:11px; color:var(--muted); margin-top:6px;">${escapeHtml(c.desc)}</div>
      </div>
    `;
  } else {
    const ch = item.char;
    const el = window.MF_DATA.ELEMENTS[ch.element];
    document.getElementById("spotlight-card-body").innerHTML = `
      <div class="spotlight-frame rarity-${ch.rarity}">
        <span class="rank-pill">${ch.rarity}</span>
        <span class="tag" style="background:#ffd13b;">${item.isNew ? "🆕 NEW!" : `凸+${item.dupe}`}</span>
        <div style="width:120px; height:150px; margin:8px auto; border-radius:12px; overflow:hidden; border:2px solid var(--border); background:#f6f4ee;">
          ${window.MF_SPRITES.portraitHTML(ch, "contain")}
        </div>
        <h3 style="margin:4px 0;">${escapeHtml(ch.name)}</h3>
        <div style="font-size:11px; color:var(--muted);">${el.icon}${el.name} ／ ${ch.trait || ""}</div>
      </div>
    `;
  }
}

function nextSpotlightCard() {
  spotlightIdx += 1;
  if (spotlightIdx >= currentPullResults.length) showGachaResultGrid();
  else renderSpotlightCard();
}

function showGachaResultGrid() {
  gachaTimers.forEach(t => clearTimeout(t));
  document.getElementById("gacha-modal-stage").style.display = "none";
  document.getElementById("gacha-modal-spotlight").style.display = "none";
  document.getElementById("gacha-modal-results").style.display = "block";

  document.getElementById("gacha-result-grid").innerHTML = currentPullResults.map(item => {
    if (item.isCard) {
      return `
        <div class="pull-card rarity-${item.rarity}">
          <div style="font-size:10px; font-weight:900;">${item.rarity} ${item.isNew ? "🆕" : `Lv.${item.newLv}`}</div>
          <div style="font-size:26px; margin:3px 0;">${item.card.icon}</div>
          <div style="font-size:11px; font-weight:900;">${escapeHtml(item.card.name)}</div>
        </div>
      `;
    }
    return `
      <div class="pull-card rarity-${item.rarity}">
        <div style="font-size:10px; font-weight:900;">${item.rarity} ${item.isNew ? "🆕" : `凸+${item.dupe}`}</div>
        ${window.MF_SPRITES.portraitHTML(item.char, "icon")}
        <div style="font-size:11px; font-weight:900;">${escapeHtml(item.char.name)}</div>
      </div>
    `;
  }).join("");
}

function closeGachaModal() {
  document.getElementById("modal-gacha").classList.remove("active");
}
