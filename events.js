let currentEventSubTab = "story"; // "story" | "quest" | "shop"
let activeEventNovel = null;
let evTypeTimer = null;
let evIsTyping = false;
let evFullText = "";

function getEventTodayStr() {
  if (window.MF_EVENT_DATE_OVERRIDE && /^\d{4}-\d{2}-\d{2}$/.test(window.MF_EVENT_DATE_OVERRIDE)) {
    return window.MF_EVENT_DATE_OVERRIDE;
  }
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getDaysUntil(targetDateStr) {
  const today = new Date(`${getEventTodayStr()}T00:00:00`);
  const tgt = new Date(`${targetDateStr}T00:00:00`);
  return Math.max(0, Math.ceil((tgt - today) / 86400000));
}

// 日付に応じて解禁された新戦術カードを自動でカードプール＆図鑑へ追加
function syncEventUnlockedCards() {
  if (!window.MF_CARDS?.TACTIC_CARDS || !window.MF_EVENTS_DATA?.SEASONAL_CARDS) return;
  const today = getEventTodayStr();
  window.MF_EVENTS_DATA.SEASONAL_CARDS.forEach(c => {
    if (today >= c.releaseDate) {
      window.MF_CARDS.TACTIC_CARDS[c.id] = { ...c };
    }
  });
}

function getCurrentActiveEvent() {
  const today = getEventTodayStr();
  const list = window.MF_EVENTS_DATA?.EVENTS || [];
  return list.find(ev => today >= ev.start && today <= ev.end) || null;
}

function getNextUpcomingEvent() {
  const today = getEventTodayStr();
  const list = (window.MF_EVENTS_DATA?.EVENTS || []).filter(ev => ev.start > today);
  return list[0] || null;
}

function getCurrentEventPhase(ev) {
  if (!ev) return 0;
  const today = getEventTodayStr();
  let p = 0;
  ev.phases.forEach(ph => { if (today >= ph.unlockDate) p = Math.max(p, ph.num); });
  return p;
}

function ensureEventSave(evId) {
  state.eventProgress = state.eventProgress || {};
  if (!state.eventProgress[evId]) {
    state.eventProgress[evId] = { medals: 0, clearedStories: [], boughtCounts: {} };
  }
  return state.eventProgress[evId];
}

// ホーム画面に表示するイベントバナー（開催中 or 近日開幕カウントダウン）
function renderHomeEventBanner() {
  const box = document.getElementById("home-event-banner");
  if (!box) return;
  const active = getCurrentActiveEvent();
  if (active) {
    const phase = getCurrentEventPhase(active);
    box.style.display = "block";
    box.innerHTML = `
      <div class="event-home-banner" style="background:${active.bannerBg};" onclick="switchView('event')">
        <div class="top-row">
          <span class="tag" style="background:#ffd13b; color:#121318;">🎪 開催中・第${phase}弾公開</span>
          <span style="font-size:10px; color:#fff; font-weight:900;">〜${active.end.slice(5)}</span>
        </div>
        <strong style="font-size:13px; color:#fff; display:block; margin-top:3px;">${active.icon} ${escapeHtml(active.title)}</strong>
        <div style="font-size:10px; color:#eef2ff;">限定ストーリー・狩猟・交換所で新SSRカード獲得 ▶</div>
      </div>
    `;
    return;
  }

  const next = getNextUpcomingEvent();
  if (next) {
    const days = getDaysUntil(next.start);
    box.style.display = "block";
    box.innerHTML = `
      <div class="event-home-banner" style="background:${next.bannerBg}; opacity:0.92;" onclick="switchView('event')">
        <div class="top-row">
          <span class="tag" style="background:#00e5ff; color:#121318;">🔜 ${next.start.slice(5)} 開幕（あと${days}日）</span>
          <span style="font-size:10px; color:#fff; font-weight:900;">詳細を見る ▶</span>
        </div>
        <strong style="font-size:13px; color:#fff; display:block; margin-top:3px;">${next.icon} ${escapeHtml(next.title)}</strong>
        <div style="font-size:10px; color:#eef2ff;">毎月1日開幕＆3回更新・新カード6種＆限定PU同時開催！</div>
      </div>
    `;
    return;
  }
  box.style.display = "none";
}

function renderEventView() {
  renderTopBar();
  syncEventUnlockedCards();
  const active = getCurrentActiveEvent();
  const novelBox = document.getElementById("ev-novel-panel");
  const mainBox = document.getElementById("ev-main-panel");

  if (activeEventNovel) {
    novelBox.style.display = "block";
    mainBox.style.display = "none";
    renderEventNovelScene();
    return;
  }
  novelBox.style.display = "none";
  mainBox.style.display = "block";

  if (!active) {
    const next = getNextUpcomingEvent();
    const list = window.MF_EVENTS_DATA?.EVENTS || [];
    document.getElementById("ev-hero-card").innerHTML = next
      ? `<div style="background:${next.bannerBg}; color:#fff; padding:12px; border-radius:13px;">
           <span class="tag" style="background:#ffd13b; color:#121318;">🔜 ${next.start} 開幕（あと${getDaysUntil(next.start)}日）</span>
           <h3 style="margin:6px 0 4px; font-size:16px;">${next.icon} ${escapeHtml(next.title)}</h3>
           <div style="font-size:11.5px; opacity:0.92;">${escapeHtml(next.subtitle)}</div>
         </div>`
      : `<div style="padding:12px; text-align:center;">次期イベント準備中です。</div>`;

    document.getElementById("ev-tabs-wrap").style.display = "none";
    document.getElementById("ev-body").innerHTML = `
      <div class="card" style="background:var(--surface-sub);">
        <strong style="font-size:13px; display:block; margin-bottom:6px;">📅 今後の月次イベント＆更新スケジュール</strong>
        ${list.map(ev => `
          <div style="background:var(--surface); border:1.5px solid var(--border); border-radius:10px; padding:8px; margin-bottom:6px;">
            <div class="top-row"><strong style="font-size:12px;">${ev.icon} ${escapeHtml(ev.title)}</strong><span class="tag">${ev.start.slice(5)}〜</span></div>
            <div style="font-size:10.5px; color:var(--muted); margin-top:3px;">1日・11日・21日の3回更新（新カード計6種＆中旬復刻PU開催）</div>
          </div>
        `).join("")}
      </div>
    `;
    return;
  }

  const phase = getCurrentEventPhase(active);
  const prog = ensureEventSave(active.id);
  document.getElementById("ev-tabs-wrap").style.display = "grid";

  const phaseChips = active.phases.map(ph => {
    const open = phase >= ph.num;
    return `<span class="tag" style="${open ? "background:#18b88a; color:#fff;" : "opacity:0.55;"}">${open ? "✓" : "🔒"} ${ph.label}</span>`;
  }).join("");

  document.getElementById("ev-hero-card").innerHTML = `
    <div style="background:${active.bannerBg}; color:#fff; padding:11px; border-radius:13px;">
      <div class="top-row">
        <span class="tag" style="background:#ffd13b; color:#121318;">${active.monthLabel}</span>
        <strong style="font-size:12px;">${active.currencyIcon} ${prog.medals}個</strong>
      </div>
      <h3 style="margin:5px 0 3px; font-size:15.5px;">${active.icon} ${escapeHtml(active.title)}</h3>
      <div style="font-size:10.5px; opacity:0.9; margin-bottom:6px;">期間：${active.start} 〜 ${active.end}</div>
      <div style="display:flex; gap:4px; flex-wrap:wrap;">${phaseChips}</div>
    </div>
  `;

  document.getElementById("ev-tab-story").className = `select-chip ${currentEventSubTab === "story" ? "selected" : ""}`;
  document.getElementById("ev-tab-quest").className = `select-chip ${currentEventSubTab === "quest" ? "selected" : ""}`;
  document.getElementById("ev-tab-shop").className  = `select-chip ${currentEventSubTab === "shop" ? "selected" : ""}`;

  if (currentEventSubTab === "story") renderEventStoryList(active, phase, prog);
  else if (currentEventSubTab === "quest") renderEventQuestList(active, phase);
  else renderEventShopList(active, phase, prog);
}

function renderEventStoryList(ev, phase, prog) {
  document.getElementById("ev-body").innerHTML = ev.stories.map(st => {
    const locked = st.phase > phase;
    const done = prog.clearedStories.includes(st.id);
    const unlockDate = ev.phases.find(p => p.num === st.phase)?.unlockDate || "";
    return `
      <div class="card" style="padding:10px; margin-bottom:7px; opacity:${locked ? 0.55 : 1};">
        <div class="top-row">
          <strong style="font-size:12.5px;">📖 ${escapeHtml(st.title)}</strong>
          <span class="tag" style="${done ? "background:#18b88a; color:#fff;" : ""}">${done ? "読了済" : (locked ? `🔒${unlockDate.slice(5)}〜` : `第${st.phase}弾`)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
          <span style="font-size:10.5px; font-weight:900; color:var(--accent);">初回：💎+${st.rewardGems} / ${ev.currencyIcon}+${st.rewardMedals}</span>
          <button class="btn-xs ${locked ? "" : "btn-primary"}" ${locked ? "disabled" : ""} onclick="openEventStory('${st.id}')">${done ? "回想" : "読む ▶"}</button>
        </div>
      </div>
    `;
  }).join("");
}

function renderEventQuestList(ev, phase) {
  document.getElementById("ev-body").innerHTML = ev.quests.map(q => {
    const locked = q.phase > phase;
    const unlockDate = ev.phases.find(p => p.num === q.phase)?.unlockDate || "";
    const enObj = (window.MF_DATA.ENEMIES || []).find(e => e.id === q.enemyId);
    const thumb = enObj && window.MF_SPRITES.enemyHTML ? window.MF_SPRITES.enemyHTML(enObj, "thumb") : "";
    return `
      <div class="card" style="padding:10px; margin-bottom:8px; opacity:${locked ? 0.55 : 1};">
        <div style="display:flex; gap:9px; align-items:center;">
          ${thumb}
          <div style="flex:1;">
            <div class="top-row"><strong style="font-size:12.5px;">${escapeHtml(q.title)}</strong><span class="rank-pill">⚡EN ${q.enCost}</span></div>
            <div style="font-size:10.5px; color:var(--muted); margin-top:2px;">推奨戦力 ${q.recPower} ｜ ${locked ? `🔒 ${unlockDate.slice(5)} 解禁` : `獲得：${ev.currencyIcon}${ev.currencyName} ×${q.medals}`}</div>
          </div>
        </div>
        <div style="display:flex; justify-content:flex-end; margin-top:6px;">
          <button class="btn-xs ${locked ? "" : "btn-accent2"}" ${locked ? "disabled" : ""} onclick="startEventQuest('${q.id}')">⚔️ 狩猟へ出撃</button>
        </div>
      </div>
    `;
  }).join("");
}

function renderEventShopList(ev, phase, prog) {
  document.getElementById("ev-body").innerHTML = ev.shop.map(it => {
    const locked = it.phase > phase;
    const bought = prog.boughtCounts[it.id] || 0;
    const remain = Math.max(0, it.stock - bought);
    const canBuy = !locked && remain > 0 && prog.medals >= it.price;
    const unlockDate = ev.phases.find(p => p.num === it.phase)?.unlockDate || "";
    return `
      <div class="card" style="padding:10px; margin-bottom:7px; opacity:${locked || remain === 0 ? 0.55 : 1};">
        <div class="top-row">
          <strong style="font-size:12.5px;">${escapeHtml(it.name)}</strong>
          <span class="tag">${locked ? `🔒${unlockDate.slice(5)}〜` : `残り ${remain}/${it.stock}`}</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">
          <span style="font-size:11px; font-weight:900; color:var(--accent);">${ev.currencyIcon} ${it.price}個</span>
          <div style="display:flex; gap:5px;">
            ${it.kind === "card" ? `<button class="btn-xs" onclick="openTacticCardDetail('${it.cardId}')">詳細</button>` : ""}
            <button class="btn-xs ${canBuy ? "btn-primary" : ""}" ${canBuy ? "" : "disabled"} onclick="buyEventShopItem('${it.id}')">${remain === 0 ? "交換済" : "交換する"}</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function startEventQuest(questId) {
  const ev = getCurrentActiveEvent();
  if (!ev) return;
  const q = ev.quests.find(x => x.id === questId);
  if (!q || q.phase > getCurrentEventPhase(ev)) return;

  if (state.en < q.enCost) {
    const need = q.enCost - state.en;
    if ((state.reserveEn || 0) >= need) { state.reserveEn -= need; state.en += need; }
    else { showToast(`⚡ ENが足りません（必要 ${q.enCost}）`); return; }
  }
  state.en -= q.enCost;
  saveGame(); renderTopBar();

  const launch = () => {
    switchView("battle");
    startBattle(q.enemyId, {
      returnView: "event",
      hpMult: q.hpMult,
      atkMult: q.atkMult,
      questTitle: q.title,
      onWin: () => {
        const prog = ensureEventSave(ev.id);
        prog.medals += q.medals;
        saveGame();
        showToast(`${ev.currencyIcon} ${ev.currencyName} ×${q.medals} を獲得しました！`);
      }
    });
  };
  if (typeof showLoadingScreen === "function") showLoadingScreen(`${q.title} へ出撃中……`, launch, 560);
  else launch();
}

function buyEventShopItem(itemId) {
  const ev = getCurrentActiveEvent();
  if (!ev) return;
  const it = ev.shop.find(x => x.id === itemId);
  const prog = ensureEventSave(ev.id);
  if (!it || it.phase > getCurrentEventPhase(ev)) return;
  if ((prog.boughtCounts[it.id] || 0) >= it.stock || prog.medals < it.price) return;

  prog.medals -= it.price;
  prog.boughtCounts[it.id] = (prog.boughtCounts[it.id] || 0) + 1;

  if (it.kind === "card") {
    state.ownedCards = state.ownedCards || {};
    state.ownedCards[it.cardId] = Math.min(5, (state.ownedCards[it.cardId] || 0) + 1);
  } else if (it.kind === "tickets") state.cardTickets = (state.cardTickets || 0) + it.qty;
  else if (it.kind === "books") state.expBooks = (state.expBooks || 0) + it.qty;
  else if (it.kind === "cores") state.cores = (state.cores || 0) + it.qty;
  else if (it.kind === "gift") state.bondGifts = (state.bondGifts || 0) + it.qty;
  else if (it.kind === "title") {
    state.unlockedTitles = state.unlockedTitles || ["第7小隊・新任隊長"];
    if (!state.unlockedTitles.includes(it.titleName)) state.unlockedTitles.push(it.titleName);
  }

  saveGame(); playSfx("gift");
  renderEventView();
  showToast(`🎁 ${it.name} を交換しました！`);
}

function openEventStory(storyId) {
  const ev = getCurrentActiveEvent();
  if (!ev) return;
  const st = ev.stories.find(s => s.id === storyId);
  if (!st || st.phase > getCurrentEventPhase(ev)) return;
  activeEventNovel = { ev, st, idx: 0 };
  if (window.MF_AUDIO) window.MF_AUDIO.playBgm("story");
  playSfx("switch");
  renderEventView();
}

function renderEventNovelScene() {
  clearInterval(evTypeTimer);
  const { st, idx } = activeEventNovel;
  const sc = st.scenes[idx];
  const ch = getCharProfile(sc.speaker);

  document.getElementById("ev-novel-title").textContent = `${st.title}（${idx + 1}/${st.scenes.length}）`;
  const stage = document.getElementById("ev-novel-stage");
  stage.className = `novel-stage nbg-${sc.bg || "camp_dusk"}`;
  stage.innerHTML = window.MF_SPRITES.portraitHTML(ch, "contain");
  document.getElementById("ev-novel-speaker").textContent = ch.name;

  const textEl = document.getElementById("ev-novel-text");
  const spd = typeof getTextSpeedObj === "function" ? getTextSpeedObj() : { ms: 40 };
  evFullText = sc.text;
  if (spd.ms === 0) { textEl.textContent = evFullText; evIsTyping = false; return; }
  evIsTyping = true; textEl.textContent = "";
  let pos = 0;
  evTypeTimer = setInterval(() => {
    pos += 1; textEl.textContent = evFullText.slice(0, pos);
    if (pos >= evFullText.length) { clearInterval(evTypeTimer); evIsTyping = false; }
  }, spd.ms);
}

function advanceEventNovel() {
  if (!activeEventNovel) return;
  if (evIsTyping) { clearInterval(evTypeTimer); evIsTyping = false; document.getElementById("ev-novel-text").textContent = evFullText; return; }
  const { ev, st, idx } = activeEventNovel;
  if (idx < st.scenes.length - 1) { activeEventNovel.idx += 1; playSfx("tap"); renderEventNovelScene(); return; }

  activeEventNovel = null;
  const prog = ensureEventSave(ev.id);
  if (!prog.clearedStories.includes(st.id)) {
    prog.clearedStories.push(st.id);
    prog.medals += st.rewardMedals;
    state.gems += st.rewardGems;
    saveGame(); playSfx("gift");
    showToast(`📖 イベント話読了！💎+${st.rewardGems} / ${ev.currencyIcon}+${st.rewardMedals}`);
  }
  if (window.MF_AUDIO) window.MF_AUDIO.playBgm("home");
  renderEventView();
}

function closeEventNovel() {
  clearInterval(evTypeTimer);
  activeEventNovel = null;
  if (window.MF_AUDIO) window.MF_AUDIO.playBgm("home");
  renderEventView();
}

// スクリプト読込時に解禁済みイベントカードを即座にカードプールへ反映
syncEventUnlockedCards();
