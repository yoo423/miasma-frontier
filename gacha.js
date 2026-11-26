let currentBannerId = "pickup_mikoto";
let lastPullResults = [];

function renderGachaView() {
  renderTopBar();
  const banners = window.MF_DATA.BANNERS;
  const banner = banners.find(b => b.id === currentBannerId) || banners[0];

  // バナー切替タブ
  document.getElementById("gacha-banner-tabs").innerHTML = banners.map(b => `
    <button class="select-chip ${b.id === banner.id ? "selected" : ""}"
            onclick="currentBannerId='${b.id}'; playSfx('tap'); renderGachaView();">
      <strong>${escapeHtml(b.shortName)}</strong><br>
      <span style="font-size:10px;">${escapeHtml(b.tag)}</span>
    </button>
  `).join("");

  // バナー詳細表示
  const featured = window.MF_DATA.CHARACTERS[banner.featuredSsr];
  const el = window.MF_DATA.ELEMENTS[featured.element];
  const wp = window.MF_DATA.WEAPONS[featured.weapon];

  document.getElementById("gacha-banner-card").innerHTML = `
    <div style="display:flex; gap:10px; align-items:center;">
      <div class="portrait-frame" style="width:92px; height:118px; flex-shrink:0;">
        <img src="${featured.image}" alt="${escapeHtml(featured.name)}"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <div class="portrait-fallback" style="display:none;">
          <span style="font-size:36px;">${featured.emoji}</span>
        </div>
      </div>
      <div style="flex:1; min-width:0;">
        <span class="rank-pill" style="background:#ff7b39; color:#fff;">${escapeHtml(banner.tag)}</span>
        <h3 style="margin:4px 0; font-size:15px;">${escapeHtml(banner.title)}</h3>
        <div style="font-size:12px; font-weight:900;">
          目玉SSR：${escapeHtml(featured.name)}（${el.icon}${el.name}・${wp.name}）
        </div>
        <p style="font-size:11px; color:var(--muted); margin:4px 0 0; line-height:1.4;">
          ${escapeHtml(banner.desc)}
        </p>
      </div>
    </div>
  `;

  const remain = 80 - (state.pityCount || 0);
  const guarText = state.pityGuaranteed ? "（次回SSRはピックアップ確定！）" : "";
  document.getElementById("gacha-pity-text").textContent =
    `🎯 SSR確定天井まであと ${remain} 連 ${guarText}`;
}

function rollSingleChar(banner) {
  state.pityCount = (state.pityCount || 0) + 1;
  const allChars = Object.values(window.MF_DATA.CHARACTERS).filter(c => !c.isProtagonist);
  const ssrPool = allChars.filter(c => c.rarity === "SSR" && (!c.limited || c.id === banner.featuredSsr));
  const srPool = allChars.filter(c => c.rarity === "SR");
  const rPool = allChars.filter(c => c.rarity === "R");
  const nPool = allChars.filter(c => c.rarity === "N");

  const r = Math.random() * 100;
  let rarity = "N";
  if (state.pityCount >= 80 || r < 3.0) {
    rarity = "SSR";
  } else if (r < 18.0) {
    rarity = "SR";
  } else if (r < 60.0) {
    rarity = "R";
  }

  let picked = null;
  if (rarity === "SSR") {
    state.pityCount = 0;
    if (banner.featuredSsr && (state.pityGuaranteed || Math.random() < 0.5)) {
      picked = window.MF_DATA.CHARACTERS[banner.featuredSsr];
      state.pityGuaranteed = false;
    } else {
      picked = ssrPool[Math.floor(Math.random() * ssrPool.length)];
      if (banner.featuredSsr && picked.id !== banner.featuredSsr) {
        state.pityGuaranteed = true;
      }
    }
  } else if (rarity === "SR") {
    if (banner.featuredSr?.length && Math.random() < 0.5) {
      const fid = banner.featuredSr[Math.floor(Math.random() * banner.featuredSr.length)];
      picked = window.MF_DATA.CHARACTERS[fid];
    } else {
      picked = srPool[Math.floor(Math.random() * srPool.length)];
    }
  } else if (rarity === "R") {
    picked = rPool[Math.floor(Math.random() * rPool.length)];
  } else {
    picked = nPool[Math.floor(Math.random() * nPool.length)];
  }

  return picked;
}

function executeScout(times) {
  const cost = times * 160;
  if (state.gems < cost) {
    showToast(`💎 アーク結晶石が足りません（必要：${cost}）`);
    return;
  }
  state.gems -= cost;

  const banner = window.MF_DATA.BANNERS.find(b => b.id === currentBannerId) || window.MF_DATA.BANNERS[0];
  const pulled = [];
  for (let i = 0; i < times; i++) {
    pulled.push(rollSingleChar(banner));
  }

  // 10連で全てR/Nだった場合、最後の1枠をSRに昇格保証
  if (times === 10 && !pulled.some(c => c.rarity === "SR" || c.rarity === "SSR")) {
    const srPool = Object.values(window.MF_DATA.CHARACTERS).filter(c => c.rarity === "SR");
    pulled[9] = srPool[Math.floor(Math.random() * srPool.length)];
  }

  // 所持＆限界突破（凸）反映
  lastPullResults = pulled.map(ch => {
    const isNew = !state.ownedChars.includes(ch.id);
    let dupeAfter = state.charDupes[ch.id] || 0;
    let bonusBooks = 0;

    if (isNew) {
      state.ownedChars.push(ch.id);
      state.charLevels[ch.id] = 1;
      state.charRanks[ch.id] = 0;
      state.charDupes[ch.id] = 0;
    } else if (dupeAfter < 5) {
      dupeAfter += 1;
      state.charDupes[ch.id] = dupeAfter;
    } else {
      // 完凸済み被りは作戦記録に変換
      bonusBooks = ch.rarity === "SSR" ? 20 : (ch.rarity === "SR" ? 8 : 3);
      state.expBooks = (state.expBooks || 0) + bonusBooks;
    }
    return { char: ch, isNew, dupeAfter, bonusBooks };
  });

  saveGame();
  renderGachaView();
  playGachaAnimation(lastPullResults);
}

function playGachaAnimation(results) {
  const hasSsr = results.some(r => r.char.rarity === "SSR");
  const hasSr = results.some(r => r.char.rarity === "SR");

  const modal = document.getElementById("modal-gacha");
  const pod = document.getElementById("pod-visual");
  const label = document.getElementById("pod-label");
  const resultArea = document.getElementById("gacha-modal-results");
  const stageArea = document.getElementById("gacha-modal-stage");

  stageArea.style.display = "block";
  resultArea.style.display = "none";
  pod.className = "pod-orb pod-blue";
  pod.textContent = "🛰️";
  label.textContent = "軌道ビーコンより降下中……";
  modal.classList.add("active");
  playSfx("tap");

  clearTimeout(modal._t1);
  clearTimeout(modal._t2);
  clearTimeout(modal._t3);

  if (hasSr || hasSsr) {
    modal._t1 = setTimeout(() => {
      pod.className = "pod-orb pod-gold";
      pod.textContent = "✨";
      label.textContent = "高エネルギー反応を検知！";
      playSfx("switch");
    }, 650);
  }

  if (hasSsr) {
    modal._t2 = setTimeout(() => {
      pod.className = "pod-orb pod-rainbow";
      pod.textContent = "🌈";
      label.textContent = "特級シグナル確定！！";
      if (navigator.vibrate) navigator.vibrate([80, 40, 120]);
      playSfx("gift");
    }, 1350);
  }

  const revealDelay = hasSsr ? 2150 : (hasSr ? 1350 : 900);
  modal._t3 = setTimeout(() => showGachaResultGrid(), revealDelay);
}

function showGachaResultGrid() {
  const modal = document.getElementById("modal-gacha");
  clearTimeout(modal._t1);
  clearTimeout(modal._t2);
  clearTimeout(modal._t3);

  document.getElementById("gacha-modal-stage").style.display = "none";
  const resultArea = document.getElementById("gacha-modal-results");
  resultArea.style.display = "block";

  document.getElementById("gacha-result-grid").innerHTML = lastPullResults.map(item => {
    const c = item.char;
    const el = window.MF_DATA.ELEMENTS[c.element];
    const badge = item.isNew
      ? `<span class="tag" style="background:#18b88a; color:#fff;">NEW!</span>`
      : (item.bonusBooks > 0
          ? `<span class="tag">完凸済→記録+${item.bonusBooks}</span>`
          : `<span class="tag" style="background:#ffd13b;">凸+${item.dupeAfter}</span>`);
    return `
      <div class="pull-card rarity-${c.rarity}">
        <div style="font-size:10px; font-weight:900;">${c.rarity} ${el.icon}</div>
        <div style="font-size:24px; margin:2px 0;">${c.emoji}</div>
        <div style="font-size:11px; font-weight:900; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
          ${escapeHtml(c.name)}
        </div>
        <div style="margin-top:3px;">${badge}</div>
      </div>
    `;
  }).join("");
}

function closeGachaModal() {
  document.getElementById("modal-gacha").classList.remove("active");
}
