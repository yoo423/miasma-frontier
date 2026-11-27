let activeBannerId = "";
let gachaTimers = [];
let currentPullResults = [];
let spotlightIdx = 0;

function getGachaTabs() {
  if (typeof syncEventUnlockedCards === "function") syncEventUnlockedCards();
  if (typeof window.MF_CARDS?.ensurePool === "function") window.MF_CARDS.ensurePool();
  const today = typeof getEventTodayStr === "function" ? getEventTodayStr() : new Date().toISOString().slice(0, 10);
  const sched = (window.MF_EVENTS_DATA?.GACHA_SCHEDULES || []).filter(b => today >= b.start && today <= b.end);

  const activeTimed = sched.length > 0 ? sched : [{
    id: "pu_default_mikoto", start: "2026-11-01", end: "2099-12-31",
    shortName: "❄️ ミコトPU", tag: "限定ピックアップ",
    title: "白狐の絶対零度・限定招集", featuredSsr: "mikoto", isLimitedBanner: true,
    desc: "限定SSR『ミコト』単独ピックアップ！限定隊員は本招集または復刻招集でのみ出現します。"
  }];

  const cardTotal = Object.keys(window.MF_CARDS?.TACTIC_CARDS || {}).length;
  return [
    ...activeTimed,
    {
      id: "standard_all", shortName: "🌠 恒常招集", tag: "スタンダード",
      title: "方舟都市・開拓隊員スカウト", featuredSsr: "lunaria",
      desc: "ルナリア・ヴァレリア・クロエら恒常SSR・SR隊員が出現します（※限定隊員は含まれません）。"
    },
    {
      id: "card_pack", shortName: "🎟️ カード", tag: "パック券専用",
      title: `全${cardTotal}種・戦術カードパック`, isCardBanner: true,
      desc: "討伐や任務・イベントで手に入る『🎟️ 戦術パック券』で引けます（10連は券8枚でお得＆SR以上確定！）。"
    }
  ];
}

function buyCardTicketsWithCredits(qty) {
  const cost = qty * 2000;
  if (state.credits < cost) { showToast(`🪙 クレジット不足（必要：${cost.toLocaleString()}）`); return; }
  state.credits -= cost;
  state.cardTickets = (state.cardTickets || 0) + qty;
  saveGame(); playSfx("gift");
  renderTopBar(); renderGachaView();
  showToast(`🎟️ 戦術パック券 ×${qty} を購入しました！`);
}

function renderGachaView() {
  renderTopBar();
  const tabs = getGachaTabs();
  if (!tabs.some(b => b.id === activeBannerId)) activeBannerId = tabs[0].id;
  const banner = tabs.find(b => b.id === activeBannerId) || tabs[0];

  document.getElementById("gacha-banner-tabs").innerHTML = tabs.map(b => `
    <button class="select-chip ${b.id === activeBannerId ? "selected" : ""}"
            onclick="activeBannerId='${b.id}'; playSfx('tap'); renderGachaView();">
      ${b.shortName}
    </button>
  `).join("");

  if (banner.isCardBanner) {
    const tk = state.cardTickets || 0;
    document.getElementById("gacha-banner-card").innerHTML = `
      <div class="top-row">
        <span class="rank-pill" style="background:#ffd13b;">${banner.tag}</span>
        <strong style="font-size:12px;">所持：🎟️ ${tk}枚</strong>
      </div>
      <h3 style="margin:6px 0 4px; font-size:15px;">🃏 ${escapeHtml(banner.title)}</h3>
      <p style="font-size:11px; color:var(--muted); margin:0 0 8px;">${escapeHtml(banner.desc)}</p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px;">
        <button class="btn-xs" onclick="buyCardTicketsWithCredits(1)">🪙2,000 → 🎟️券×1</button>
        <button class="btn-xs btn-primary" onclick="buyCardTicketsWithCredits(5)">🪙10,000 → 🎟️券×5</button>
      </div>
    `;
    document.getElementById("gacha-pity-text").textContent = "🎟️ 月3回のイベント更新ごとに新カードも自動追加されます！";
    document.getElementById("btn-gacha-1").innerHTML = `1枚引く<br><span style="font-size:11px;">🎟️ 券 ×1</span>`;
    document.getElementById("btn-gacha-10").innerHTML = `10連（SR以上確定！）<br><span style="font-size:11px;">🎟️ 券 ×8（2枚お得）</span>`;
  } else {
    const feat = window.MF_DATA.CHARACTERS[banner.featuredSsr] || window.MF_DATA.CHARACTERS.lunaria;
    const periodTxt = banner.start && banner.end ? `開催期間：${banner.start} 〜 ${banner.end}` : "常設開催";
    const limNote = banner.isLimitedBanner ? "※限定隊員は本招集・復刻招集でのみ排出" : "※恒常SSR（ルナリア・ヴァレリア・クロエ）が対象";
    document.getElementById("gacha-banner-card").innerHTML = `
      <div style="display:flex; gap:10px; align-items:center;">
        ${window.MF_SPRITES.portraitHTML(feat, "icon-lg")}
        <div style="text-align:left; flex:1;">
          <div style="display:flex; gap:4px; flex-wrap:wrap; align-items:center;">
            <span class="rank-pill" style="${banner.isRerun ? "background:#ff7b39; color:#fff;" : ""}">${banner.tag}</span>
            <span style="font-size:9.5px; color:var(--muted); font-weight:800;">${periodTxt}</span>
          </div>
          <h3 style="margin:4px 0; font-size:14px;">${escapeHtml(banner.title)}</h3>
          <p style="font-size:10.5px; color:var(--muted); margin:0 0 3px;">${escapeHtml(banner.desc)}</p>
          <div style="font-size:9.5px; color:var(--accent); font-weight:900;">${limNote}</div>
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

// 📊 正式リリース必須：提供割合・排出ラインナップ確認モーダル
function openGachaRatesModal() {
  const tabs = getGachaTabs();
  const banner = tabs.find(b => b.id === activeBannerId) || tabs[0];
  const body = document.getElementById("gacha-rates-body");
  if (!body) return;

  if (banner.isCardBanner) {
    const pool = Object.values(window.MF_CARDS.ensurePool());
    const cnt = r => pool.filter(c => c.rarity === r).length;
    body.innerHTML = `
      <div class="rate-box">
        <strong>🃏 ${escapeHtml(banner.title)}</strong>
        <div class="rate-row"><span>👑 SSR 戦術カード（${cnt("SSR")}種）</span><strong>12.0%</strong></div>
        <div class="rate-row"><span>⭐ SR 戦術カード（${cnt("SR")}種）</span><strong>26.0%</strong></div>
        <div class="rate-row"><span>🔹 R 戦術カード（${cnt("R")}種）</span><strong>34.0%</strong></div>
        <div class="rate-row"><span>▫️ N 戦術カード（${cnt("N")}種）</span><strong>28.0%</strong></div>
      </div>
      <p style="font-size:11px; color:var(--muted); text-align:left; line-height:1.5; margin:8px 0 0;">
        ・10連招集（券×8）では10枚目にSR以上が確定します。<br>
        ・同名カードを獲得すると自動でカードLvが上昇します（最大Lv.5）。
      </p>
    `;
  } else {
    const feat = window.MF_DATA.CHARACTERS[banner.featuredSsr];
    const chars = Object.values(window.MF_DATA.CHARACTERS).filter(c => !c.isProtagonist);
    const stdSsr = chars.filter(c => c.rarity === "SSR" && !c.limited).map(c => c.name).join(" / ");
    const srList = chars.filter(c => c.rarity === "SR" && !c.limited).map(c => c.name).join(" / ");
    body.innerHTML = `
      <div class="rate-box">
        <strong>🌠 ${escapeHtml(banner.title)}</strong>
        <div class="rate-row"><span>👑 SSR 隊員（65連〜確率UP / 80連確定）</span><strong>3.5%（65連〜14%）</strong></div>
        <div class="rate-row"><span>⭐ SR 隊員（10連時1枠確定）</span><strong>15.0%</strong></div>
        <div class="rate-row"><span>🔹 R 隊員</span><strong>40.0%</strong></div>
        <div class="rate-row"><span>▫️ N 隊員</span><strong>41.5%</strong></div>
      </div>
      <div style="text-align:left; font-size:11px; line-height:1.55; margin-top:8px;">
        ${banner.id !== "standard_all" ? `<div><strong>★ ピックアップ対象（SSR出現時50%、すり抜け後次回100%）：</strong><br>${escapeHtml(feat?.name || "")}</div>` : ""}
        <div style="margin-top:5px;"><strong>■ 恒常SSRラインナップ：</strong><br>${escapeHtml(stdSsr)}</div>
        <div style="margin-top:5px;"><strong>■ SRラインナップ：</strong><br>${escapeHtml(srList)}</div>
        <div style="margin-top:6px; color:var(--muted);">※限定ピックアップ隊員は恒常招集・すり抜け枠には含まれず、対象PUまたは復刻PUでのみ排出されます。</div>
      </div>
    `;
  }
  playSfx("tap");
  document.getElementById("modal-gacha-rates").classList.add("active");
}

function closeGachaRatesModal() {
  document.getElementById("modal-gacha-rates").classList.remove("active");
}

function executeScout(count) {
  const tabs = getGachaTabs();
  const banner = tabs.find(b => b.id === activeBannerId) || tabs[0];
  const results = [];

  if (banner.isCardBanner) {
    const needTk = count === 10 ? 8 : 1;
    if ((state.cardTickets || 0) < needTk) { showToast(`🎟️ 戦術パック券が足りません（必要：${needTk}枚）`); return; }
    const pool = Object.values(window.MF_CARDS.ensurePool());
    if (!pool.length) { showToast("⚠️ カードデータ読込中。もう一度お試しください"); return; }

    state.ownedCards = state.ownedCards || { ...window.MF_CARDS.STARTER_OWNED_CARDS };
    const byRar = r => { const a = pool.filter(c => c.rarity === r); return a.length ? a : pool; };

    for (let i = 0; i < count; i++) {
      let rar = "N";
      const roll = Math.random();
      if (roll < 0.12) rar = "SSR";
      else if (roll < 0.38) rar = "SR";
      else if (roll < 0.72) rar = "R";
      if (count === 10 && i === 9 && !results.some(x => x.rarity === "SSR" || x.rarity === "SR")) rar = "SR";

      const list = byRar(rar);
      const picked = list[Math.floor(Math.random() * list.length)] || pool[0];
      const prevLv = state.ownedCards[picked.id] || 0;
      const isNew = prevLv === 0;
      const newLv = Math.min(5, prevLv + 1);
      state.ownedCards[picked.id] = newLv;
      results.push({ isCard: true, card: picked, rarity: picked.rarity || rar, isNew, newLv });
    }
    state.cardTickets -= needTk;
  } else {
    const cost = count * 160;
    if (state.gems < cost) { showToast(`💎 結晶石が足りません（必要：${cost.toLocaleString()}）`); return; }
    const chars = Object.values(window.MF_DATA.CHARACTERS).filter(c => !c.isProtagonist);
    const standardSsrPool = chars.filter(c => c.rarity === "SSR" && !c.limited);
    const byRar = r => { const a = chars.filter(c => c.rarity === r && !c.limited); return a.length ? a : chars; };

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
        if (banner.id === "standard_all") {
          picked = standardSsrPool[Math.floor(Math.random() * standardSsrPool.length)] || window.MF_DATA.CHARACTERS.lunaria;
        } else {
          const winPu = state.pityGuaranteed || Math.random() < 0.5;
          if (winPu) { picked = window.MF_DATA.CHARACTERS[banner.featuredSsr] || window.MF_DATA.CHARACTERS.mikoto; state.pityGuaranteed = false; }
          else { picked = standardSsrPool[Math.floor(Math.random() * standardSsrPool.length)] || window.MF_DATA.CHARACTERS.lunaria; state.pityGuaranteed = true; }
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
    state.gems -= cost;
  }

  if (typeof addMissionProgress === "function") addMissionProgress("scout", count);
  saveGame(); renderTopBar(); renderGachaView();
  currentPullResults = results; spotlightIdx = 0;
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
    }, 550));
  }
  if (hasSSR) {
    gachaTimers.push(setTimeout(() => {
      beam.className = "sky-beam beam-rainbow"; orb.className = "pod-orb pod-rainbow";
      orb.textContent = "👑"; lbl.textContent = "🌈 虹色突破！！SSR確定！！"; playSfx("gift");
    }, 1100));
  }
  gachaTimers.push(setTimeout(() => showGachaResultGrid(), hasSSR ? 1800 : (hasSR ? 1150 : 750)));
}

function startSpotlightReveal() {
  gachaTimers.forEach(t => clearTimeout(t));
  document.getElementById("gacha-modal-stage").style.display = "none";
  document.getElementById("gacha-modal-spotlight").style.display = "block";
  spotlightIdx = 0; renderSpotlightCard();
}

function renderSpotlightCard() {
  const item = currentPullResults[spotlightIdx];
  if (!item) { showGachaResultGrid(); return; }
  document.getElementById("spotlight-counter").textContent = `結果 ${spotlightIdx + 1} / ${currentPullResults.length}`;
  playSfx(item.rarity === "SSR" ? "gift" : "tap");

  if (item.isCard) {
    const c = item.card;
    const el = (window.MF_DATA?.ELEMENTS?.[c.element]) || { icon: "✨", name: "煌" };
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
    const el = (window.MF_DATA?.ELEMENTS?.[ch.element]) || { icon: "✨", name: "煌" };
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

function closeGachaModal() { document.getElementById("modal-gacha").classList.remove("active"); }
