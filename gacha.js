let currentBannerId = "pickup_mikoto";
let lastPullResults = [];
let gachaTimers = [];
let revealIndex = 0;

function clearGachaTimers() {
  gachaTimers.forEach(t => clearTimeout(t));
  gachaTimers = [];
}

function renderGachaView() {
  renderTopBar();
  const banners = window.MF_DATA.BANNERS;
  const banner = banners.find(b => b.id === currentBannerId) || banners[0];

  document.getElementById("gacha-banner-tabs").innerHTML = banners.map(b => `
    <button class="select-chip ${b.id === banner.id ? "selected" : ""}"
            onclick="currentBannerId='${b.id}'; playSfx('tap'); renderGachaView();">
      <strong>${escapeHtml(b.shortName)}</strong><br>
      <span style="font-size:10px;">${escapeHtml(b.tag)}</span>
    </button>
  `).join("");

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

  const pity = Number(state.pityCount) || 0;
  const remain = Math.max(1, 80 - pity);
  const guarText = state.pityGuaranteed ? "【次回SSRはピックアップ確定！】" : "";
  document.getElementById("gacha-pity-text").textContent =
    `🎯 累計 ${pity} / 80 連（SSR確定天井まであと ${remain} 連） ${guarText}`;
}

function rollSingleChar(banner, forceSrPlus) {
  state.pityCount = (Number(state.pityCount) || 0) + 1;

  const allChars = Object.values(window.MF_DATA.CHARACTERS).filter(c => !c.isProtagonist);
  const ssrPool = allChars.filter(c => c.rarity === "SSR" && (!c.limited || c.id === banner.featuredSsr));
  const srPool = allChars.filter(c => c.rarity === "SR");
  const rPool = allChars.filter(c => c.rarity === "R");
  const nPool = allChars.filter(c => c.rarity === "N");

  const r = Math.random() * 100;
  let rarity = "N";
  if (state.pityCount >= 80 || r < 3.0) {
    rarity = "SSR";
  } else if (forceSrPlus || r < 18.0) {
    rarity = "SR";
  } else if (r < 60.0) {
    rarity = "R";
  }

  let picked = null;
  if (rarity === "SSR") {
    state.pityCount = 0; // SSR排出時のみ天井リセット
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
  let hasSrOrHigher = false;

  for (let i = 0; i < times; i++) {
    const isLastOfTen = (times === 10 && i === 9 && !hasSrOrHigher);
    const ch = rollSingleChar(banner, isLastOfTen);
    if (ch.rarity === "SR" || ch.rarity === "SSR") hasSrOrHigher = true;
    pulled.push(ch);
  }

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
  clearGachaTimers();
  const hasSsr = results.some(r => r.char.rarity === "SSR");
  const hasSr = results.some(r => r.char.rarity === "SR");

  const modal = document.getElementById("modal-gacha");
  const pod = document.getElementById("pod-visual");
  const label = document.getElementById("pod-label");
  const subLabel = document.getElementById("pod-sub-label");
  const beam = document.getElementById("pod-beam");

  document.getElementById("gacha-modal-stage").style.display = "block";
  document.getElementById("gacha-modal-spotlight").style.display = "none";
  document.getElementById("gacha-modal-results").style.display = "none";

  pod.className = "pod-orb pod-blue";
  beam.className = "sky-beam beam-blue";
  pod.textContent = "🛰️";
  label.textContent = "STAGE 1：方舟衛星より降下ポッド射出！";
  subLabel.textContent = "大気圏突入シークエンス開始……";
  modal.classList.add("active");
  playSfx("tap");

  gachaTimers.push(setTimeout(() => {
    label.textContent = "STAGE 2：ミアズマ雲層を突破中……";
    subLabel.textContent = "エネルギー波長をスキャンしています……";
    playSfx("tap");
  }, 1100));

  if (hasSr || hasSsr) {
    gachaTimers.push(setTimeout(() => {
      pod.className = "pod-orb pod-gold";
      beam.className = "sky-beam beam-gold";
      pod.textContent = "✨";
      label.textContent = "STAGE 3：高出力ゴールドシグナル反応！！";
      subLabel.textContent = "精鋭隊員の生体反応を捕捉！";
      playSfx("switch");
    }, 2200));
  }

  if (hasSsr) {
    gachaTimers.push(setTimeout(() => {
      pod.className = "pod-orb pod-rainbow";
      beam.className = "sky-beam beam-rainbow";
      pod.textContent = "🌈";
      label.textContent = "FINAL STAGE：特級アーク共鳴・虹色昇格！！";
      subLabel.textContent = "超希少・SSRスペシャリスト降臨確定！！";
      if (navigator.vibrate) navigator.vibrate([100, 50, 160]);
      playSfx("gift");
    }, 3400));
  }

  const totalStageTime = hasSsr ? 4800 : (hasSr ? 3400 : 2200);
  gachaTimers.push(setTimeout(() => startSpotlightReveal(), totalStageTime));
}

function startSpotlightReveal() {
  clearGachaTimers();
  revealIndex = 0;
  document.getElementById("gacha-modal-stage").style.display = "none";
  document.getElementById("gacha-modal-results").style.display = "none";
  document.getElementById("gacha-modal-spotlight").style.display = "block";
  renderSpotlightCard();
}

function renderSpotlightCard() {
  const item = lastPullResults[revealIndex];
  if (!item) {
    showGachaResultGrid();
    return;
  }
  const c = item.char;
  const el = window.MF_DATA.ELEMENTS[c.element];
  const wp = window.MF_DATA.WEAPONS[c.weapon];
  const line = c.voiceLines?.[0] || "作戦に参加します！";

  if (c.rarity === "SSR") playSfx("gift");
  else if (c.rarity === "SR") playSfx("switch");
  else playSfx("tap");

  document.getElementById("spotlight-counter").textContent =
    `招集結果 ${revealIndex + 1} / ${lastPullResults.length}`;

  const statusTag = item.isNew
    ? `<span class="tag" style="background:#18b88a; color:#fff;">✨ NEW!</span>`
    : (item.bonusBooks > 0
        ? `<span class="tag">完凸済→記録+${item.bonusBooks}</span>`
        : `<span class="tag" style="background:#ffd13b;">限界突破 +${item.dupeAfter}</span>`);

  document.getElementById("spotlight-card-body").innerHTML = `
    <div class="spotlight-frame rarity-${c.rarity}">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="rank-pill" style="font-size:13px;">${c.rarity} RANK</span>
        ${statusTag}
      </div>
      <div class="portrait-frame" style="width:120px; height:152px; margin:8px auto;">
        <img src="${c.image}" alt="${escapeHtml(c.name)}"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
        <div class="portrait-fallback" style="display:none;">
          <span style="font-size:52px;">${c.emoji}</span>
        </div>
      </div>
      <h3 style="margin:4px 0; font-size:18px;">${escapeHtml(c.name)}</h3>
      <div style="font-size:11px; font-weight:900; margin-bottom:6px;">
        ${el.icon}${el.name}属性 ｜ ${wp.icon}${wp.name} ｜ 🐾${c.kemonomimi}
      </div>
      <div class="speech-bubble" style="font-size:11px; text-align:left;">
        「${escapeHtml(line)}」
      </div>
    </div>
  `;
}

function nextSpotlightCard() {
  revealIndex += 1;
  if (revealIndex >= lastPullResults.length) {
    showGachaResultGrid();
  } else {
    renderSpotlightCard();
  }
}

function showGachaResultGrid() {
  clearGachaTimers();
  document.getElementById("gacha-modal-stage").style.display = "none";
  document.getElementById("gacha-modal-spotlight").style.display = "none";
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
  clearGachaTimers();
  document.getElementById("modal-gacha").classList.remove("active");
}
