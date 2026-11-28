// =========================================================
// ⭐ ステップ2：手動限界突破 ＆ 完凸超過クレスト交換所システム
// =========================================================
let lbDupeKeyCache = null;
let lbLastDupeSnap = {};
let lbStashedDupes = null;
let lbManualActionRunning = false;
let lbSaveIntercepting = false;
let lbDomUpdating = false;
let lbLastCharId = null;

const LB_CREST_RATES = {
  LIMITED_SSR: 80,
  SSR: 50,
  SR: 15,
  R: 5,
  N: 2
};

const LB_SHOP_ITEMS = [
  { id: "rainbow_core", icon: "🌈", name: "虹の共鳴コア ×1",    desc: "どの隊員（主人公・限定SSR含む）でも手動で1段階限界突破できる万能コア", cost: 80 },
  { id: "gems_160",     icon: "💎", name: "結晶石 ×160",        desc: "隊員スカウト1回分の結晶石", cost: 25 },
  { id: "tickets_5",    icon: "🎟️", name: "戦術パック券 ×5",    desc: "戦術カードパック用チケット5枚", cost: 20 },
  { id: "cores_15",     icon: "💠", name: "元素コア ×15",       desc: "隊員の昇格・ランク解放素材", cost: 15 },
  { id: "books_60",     icon: "📘", name: "作戦記録 ×60",       desc: "隊員のレベル強化用アイテム", cost: 12 },
  { id: "credits_30k",  icon: "🪙", name: "クレジット ×30,000", desc: "強化・ショップ用の軍資金", cost: 10 },
  { id: "bouquet_5",    icon: "💐", name: "アーク花のブーケ ×5", desc: "隊員の絆ポイントを深める贈り物", cost: 15 }
];

function detectDupeKey() {
  if (lbDupeKeyCache) return lbDupeKeyCache;
  const known = [
    "charDupes", "charLimitBreaks", "charBreaks", "charLimit",
    "dupes", "limitBreaks", "charCopies", "charStars", "charTotsu", "charAwaken"
  ];

  // 既存関数ソースから本物のキー名を自動検出（セーブデータ完全互換）
  try {
    const names = Object.keys(window).filter(k =>
      /char|growth|roster|gacha|scout|pull|limit|dupe|power|detail/i.test(k) &&
      typeof window[k] === "function"
    );
    const codeBlob = names.map(n => {
      try { return window[n].toString(); } catch (_) { return ""; }
    }).join("\n");

    for (const k of known) {
      if (codeBlob.includes(`state.${k}`) || codeBlob.includes(`"${k}"`) || codeBlob.includes(`'${k}'`)) {
        lbDupeKeyCache = k;
        return k;
      }
    }
  } catch (_) {}

  if (typeof state !== "undefined" && state) {
    for (const k of known) {
      if (state[k] && typeof state[k] === "object" && !Array.isArray(state[k])) {
        lbDupeKeyCache = k;
        return k;
      }
    }
  }
  lbDupeKeyCache = "charDupes";
  return lbDupeKeyCache;
}

function ensureLbState() {
  if (typeof state === "undefined" || !state) return null;
  const key = detectDupeKey();
  if (!state[key] || typeof state[key] !== "object") state[key] = {};
  if (!state.charMemories || typeof state.charMemories !== "object") state.charMemories = {};
  if (typeof state.arcCrests !== "number") state.arcCrests = 0;
  if (typeof state.rainbowCores !== "number") state.rainbowCores = 0;
  return state[key];
}

function getDupeCount(charId) {
  const map = ensureLbState();
  return map ? Math.min(5, Math.max(0, Number(map[charId] || 0))) : 0;
}

function setDupeCount(charId, val) {
  const map = ensureLbState();
  if (!map) return;
  map[charId] = Math.min(5, Math.max(0, Number(val || 0)));
}

function getCharMemoryCount(charId) {
  ensureLbState();
  return Math.max(0, Number(state?.charMemories?.[charId] || 0));
}

function getCrestValueForChar(charId) {
  const ch = window.MF_DATA?.CHARACTERS?.[charId];
  if (!ch) return LB_CREST_RATES.R;
  if (ch.limited && ch.rarity === "SSR") return LB_CREST_RATES.LIMITED_SSR;
  return LB_CREST_RATES[ch.rarity] || LB_CREST_RATES.R;
}

function syncDupeSnapshot() {
  const map = ensureLbState();
  if (!map) return;
  lbLastDupeSnap = {};
  Object.keys(map).forEach(id => {
    lbLastDupeSnap[id] = Number(map[id] || 0);
  });
}

// 記憶が必要上限(5 - 現在凸数)を超えて余っていたら自動でクレスト変換
function convertOverflowMemories() {
  ensureLbState();
  if (!state) return 0;
  let gainedCrests = 0;
  Object.keys(state.charMemories || {}).forEach(id => {
    const cur = getDupeCount(id);
    const need = Math.max(0, 5 - cur);
    const mem = Number(state.charMemories[id] || 0);
    if (mem > need) {
      const over = mem - need;
      state.charMemories[id] = need;
      gainedCrests += over * getCrestValueForChar(id);
    }
  });
  if (gainedCrests > 0) state.arcCrests += gainedCrests;
  return gainedCrests;
}

// ガチャ重複を検知 → 自動凸をキャンセルし「専用記憶」または「完凸クレスト」へ変換
function processGachaDupeChanges() {
  const map = ensureLbState();
  if (!map || lbManualActionRunning) return;

  const baseSnap = lbStashedDupes || lbLastDupeSnap;
  const memSummary = [];
  let totalCrests = 0;
  let changed = false;

  const allIds = new Set([...Object.keys(baseSnap), ...Object.keys(map)]);
  allIds.forEach(id => {
    const prevReal = Number(baseSnap[id] || 0);
    const curVal = Number(map[id] || 0);
    const delta = lbStashedDupes ? curVal : (curVal - prevReal);

    // 退避していた場合は必ず元の凸数へ戻す
    if (lbStashedDupes) {
      map[id] = Math.min(5, prevReal);
    }

    if (delta > 0) {
      changed = true;
      map[id] = Math.min(5, prevReal);
      const curMem = getCharMemoryCount(id);
      const needForMax = Math.max(0, 5 - Math.min(5, prevReal) - curMem);
      const toMem = Math.min(delta, needForMax);
      const toCrest = delta - toMem;

      if (toMem > 0) {
        state.charMemories[id] = curMem + toMem;
        const ch = window.MF_DATA?.CHARACTERS?.[id];
        memSummary.push(`${ch?.name || id}の記憶+${toMem}`);
      }
      if (toCrest > 0) {
        totalCrests += toCrest * getCrestValueForChar(id);
      }
    }
  });

  if (totalCrests > 0) state.arcCrests += totalCrests;
  totalCrests += convertOverflowMemories();

  lbStashedDupes = null;
  syncDupeSnapshot();

  if (changed && typeof showToast === "function") {
    const parts = [];
    if (memSummary.length > 0) {
      parts.push(`✨ 手動凸用：${memSummary.slice(0, 2).join("・")}${memSummary.length > 2 ? "ほか" : ""}`);
    }
    if (totalCrests > 0) {
      parts.push(`💠 完凸変換：クレスト +${totalCrests}`);
    }
    if (parts.length > 0) {
      setTimeout(() => showToast(parts.join(" ／ ")), 220);
    }
  }
  if (changed) {
    setTimeout(() => {
      renderCrestBanners();
      renderManualLimitBreakPanel();
    }, 120);
  }
}

// 手動限界突破の実行（source: "memory" | "rainbow"）
function executeManualLimitBreak(charId, source = "memory") {
  const map = ensureLbState();
  if (!map || !charId) return;

  const cur = getDupeCount(charId);
  if (cur >= 5) {
    showToast("👑 すでに最大限界突破（＋5）です！");
    return;
  }

  if (source === "rainbow") {
    if ((state.rainbowCores || 0) < 1) {
      showToast("🌈 虹の共鳴コアが足りません（クレスト交換所で入手できます）");
      return;
    }
    const ch = typeof getCharProfile === "function" ? getCharProfile(charId) : { name: charId };
    if (!confirm(`🌈『虹の共鳴コア』を1個消費して、${ch.name}を限界突破（+${cur} → +${cur + 1}）しますか？`)) return;
    state.rainbowCores -= 1;
  } else {
    const mem = getCharMemoryCount(charId);
    if (mem < 1) {
      showToast("✨ この隊員の『共鳴の記憶』がありません");
      return;
    }
    state.charMemories[charId] = mem - 1;
  }

  lbManualActionRunning = true;
  try {
    setDupeCount(charId, cur + 1);
    const bonusCrests = convertOverflowMemories();
    syncDupeSnapshot();
    if (typeof saveGame === "function") saveGame();
    if (typeof playSfx === "function") playSfx("win");
    if (typeof renderTopBar === "function") renderTopBar();

    // 既存の隊員詳細・一覧画面を再描画してステータスと星表示を即更新
    refreshCharDetailScreen(charId);
    renderManualLimitBreakPanel();

    const ch = typeof getCharProfile === "function" ? getCharProfile(charId) : { name: charId };
    showToast(
      `⭐ ${ch.name} 限界突破成功！（＋${cur} → ＋${cur + 1}）` +
      (bonusCrests > 0 ? ` 💠余剰変換+${bonusCrests}` : "")
    );
  } finally {
    lbManualActionRunning = false;
  }
}

function refreshCharDetailScreen(charId) {
  const candidates = ["renderCharDetail", "showCharDetail", "openCharDetail", "renderCharDetailView"];
  for (const fn of candidates) {
    if (typeof window[fn] === "function") {
      try { window[fn](charId); return; } catch (_) {}
    }
  }
  if (typeof window.renderGrowthView === "function") {
    try { window.renderGrowthView(); } catch (_) {}
  }
}

// 隊員詳細画面で現在開いているキャラIDを自動特定
function detectCurrentDetailCharId() {
  const heroBox = document.getElementById("cd-hero-box");
  if (!heroBox) return null;
  const view = heroBox.closest(".view, section");
  if (view && !view.classList.contains("active") && view.style.display === "none") return null;

  const img = heroBox.querySelector("img");
  let name = img ? String(img.getAttribute("alt") || "").trim() : "";
  if (!name) {
    const fb = heroBox.querySelector(".portrait-fallback span:last-child");
    if (fb) name = String(fb.textContent || "").trim();
  }
  if (name) {
    if (typeof state !== "undefined" && state && name === state.playerName) return "protagonist";
    const found = Object.values(window.MF_DATA?.CHARACTERS || {}).find(c => c.name === name);
    if (found) return found.id;
  }
  if (typeof window.currentCharId === "string") return window.currentCharId;
  if (typeof window.selectedCharId === "string") return window.selectedCharId;
  return lbLastCharId;
}

// 隊員詳細画面に「⭐ 手動限界突破パネル」を描画
function renderManualLimitBreakPanel() {
  const heroBox = document.getElementById("cd-hero-box");
  if (!heroBox) return;
  const view = heroBox.closest(".view, section") || heroBox.parentElement;
  if (!view) return;

  const charId = detectCurrentDetailCharId();
  if (!charId) return;
  lbLastCharId = charId;
  ensureLbState();

  const ch = typeof getCharProfile === "function" ? getCharProfile(charId) : { name: charId };
  const cur = getDupeCount(charId);
  const mem = getCharMemoryCount(charId);
  const rainbow = state?.rainbowCores || 0;
  const crests = state?.arcCrests || 0;
  const stars = "★".repeat(cur) + "☆".repeat(Math.max(0, 5 - cur));
  const isMax = cur >= 5;

  lbDomUpdating = true;
  try {
    let panel = document.getElementById("lb-manual-panel");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "lb-manual-panel";
      panel.className = "card lb-panel";

      // 既存の「限界突破：」を含むカードの直後に挿入（なければヒーローカードの直後）
      const cards = Array.from(view.querySelectorAll(".card"));
      const targetCard = cards.find(c => c.textContent && c.textContent.includes("限界突破")) || heroBox.closest(".card");
      if (targetCard && targetCard.parentNode) {
        targetCard.parentNode.insertBefore(panel, targetCard.nextSibling);
      } else {
        view.appendChild(panel);
      }
    }

    panel.innerHTML = `
      <div class="top-row" style="margin-bottom:5px;">
        <strong style="font-size:12.5px;">⭐ 手動限界突破（${escapeHtml(ch.name)}）</strong>
        <span class="rank-pill" style="background:${isMax ? "#ffd13b" : "var(--surface-sub)"};">${stars} ＋${cur}/5</span>
      </div>
      <div class="lb-stock-row">
        <span>✨ 専用記憶：<strong>${mem}個</strong></span>
        <span>🌈 虹コア：<strong>${rainbow}個</strong></span>
        <span>💠 クレスト：<strong>${crests}</strong></span>
      </div>
      ${isMax ? `
        <div class="lb-max-banner">
          👑 最大限界突破（完凸）達成！<br>
          <span>今後スカウトで重複獲得した分は自動で <b>💠スター・クレスト（+${getCrestValueForChar(charId)}）</b> に変換されます。</span>
        </div>
      ` : `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:7px;">
          <button class="${mem > 0 ? "btn-primary" : ""}" style="padding:8px 4px; font-size:11px;" ${mem > 0 ? "" : "disabled"} onclick="executeManualLimitBreak('${charId}', 'memory')">
            ⭐ 記憶で突破<br><span style="font-size:9.5px; opacity:0.88;">(${mem} / 1個)</span>
          </button>
          <button class="${rainbow > 0 ? "btn-accent2" : ""}" style="padding:8px 4px; font-size:11px;" ${rainbow > 0 ? "" : "disabled"} onclick="executeManualLimitBreak('${charId}', 'rainbow')">
            🌈 虹コアで突破<br><span style="font-size:9.5px; opacity:0.88;">(${rainbow} / 1個)</span>
          </button>
        </div>
      `}
      <button class="btn-xs" style="width:100%; margin-top:7px; padding:6px;" onclick="openCrestShopModal()">
        💠 スター・クレスト交換所を開く（所持：${crests}） ▶
      </button>
    `;
  } finally {
    setTimeout(() => { lbDomUpdating = false; }, 0);
  }
}

// スカウト画面・ショップ画面にも交換所へのショートカットバーを自動配置
function renderCrestBanners() {
  ensureLbState();
  const crests = state?.arcCrests || 0;
  const rainbow = state?.rainbowCores || 0;
  const targets = [
    { viewId: "view-gacha", barId: "lb-crest-bar-gacha" },
    { viewId: "view-shop",  barId: "lb-crest-bar-shop" }
  ];

  lbDomUpdating = true;
  try {
    targets.forEach(({ viewId, barId }) => {
      const sec = document.getElementById(viewId);
      if (!sec) return;
      let bar = document.getElementById(barId);
      if (!bar) {
        bar = document.createElement("div");
        bar.id = barId;
        bar.className = "lb-crest-shortcut";
        const firstCard = sec.querySelector(".card");
        if (firstCard) firstCard.prepend(bar);
        else sec.prepend(bar);
      }
      bar.innerHTML = `
        <div style="font-size:11px; font-weight:900;">
          💠 クレスト：<strong>${crests}</strong> ｜ 🌈 虹コア：<strong>${rainbow}</strong>
        </div>
        <button class="btn-xs btn-accent2" onclick="openCrestShopModal()">💠 交換所</button>
      `;
    });
  } finally {
    setTimeout(() => { lbDomUpdating = false; }, 0);
  }
}

// ---------- 💠 スター・クレスト交換所モーダル ----------
function ensureCrestShopModal() {
  let modal = document.getElementById("modal-crest-shop");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-crest-shop";
    modal.className = "modal-overlay";
    modal.style.zIndex = "1150";
    modal.onclick = () => closeCrestShopModal();
    modal.innerHTML = `
      <div class="modal-box" onclick="event.stopPropagation()" style="max-height:84dvh; overflow-y:auto;">
        <div class="top-row" style="margin-bottom:6px;">
          <strong style="font-size:15px;">💠 スター・クレスト交換所</strong>
          <button class="btn-xs" onclick="closeCrestShopModal()">閉じる ✕</button>
        </div>
        <div id="crest-shop-wallet" class="lb-wallet-box"></div>
        <div style="font-size:10.5px; color:var(--muted); text-align:left; margin:6px 0 8px; line-height:1.45;">
          完凸（＋5）済みの隊員がスカウトで重複すると自動でクレストに変換されます（限定SSR:+80 / SSR:+50 / SR:+15 / R:+5 / N:+2）。
        </div>
        <div id="crest-shop-list"></div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  return modal;
}

function openCrestShopModal() {
  ensureLbState();
  convertOverflowMemories();
  const modal = ensureCrestShopModal();
  renderCrestShopList();
  modal.classList.add("active");
  if (typeof playSfx === "function") playSfx("switch");
}

function closeCrestShopModal() {
  const modal = document.getElementById("modal-crest-shop");
  if (modal) modal.classList.remove("active");
}

function renderCrestShopList() {
  ensureLbState();
  const crests = state?.arcCrests || 0;
  const rainbow = state?.rainbowCores || 0;
  const wallet = document.getElementById("crest-shop-wallet");
  if (wallet) {
    wallet.innerHTML = `
      <span>💠 所持クレスト：<strong>${crests.toLocaleString()}</strong></span>
      <span>🌈 虹の共鳴コア：<strong>${rainbow}個</strong></span>
    `;
  }
  const list = document.getElementById("crest-shop-list");
  if (!list) return;
  list.innerHTML = LB_SHOP_ITEMS.map(it => {
    const canBuy = crests >= it.cost;
    return `
      <div class="lb-shop-row">
        <div style="flex:1; min-width:0; text-align:left;">
          <strong style="font-size:12px;">${it.icon} ${it.name}</strong>
          <div style="font-size:10px; color:var(--muted); line-height:1.35;">${it.desc}</div>
        </div>
        <button class="btn-xs ${canBuy ? "btn-primary" : ""}" style="flex-shrink:0; padding:6px 9px;" ${canBuy ? "" : "disabled"} onclick="buyCrestShopItem('${it.id}')">
          💠 ${it.cost}
        </button>
      </div>
    `;
  }).join("");
}

function buyCrestShopItem(itemId) {
  ensureLbState();
  const it = LB_SHOP_ITEMS.find(x => x.id === itemId);
  if (!it) return;
  if ((state.arcCrests || 0) < it.cost) {
    showToast("💠 スター・クレストが足りません");
    return;
  }
  state.arcCrests -= it.cost;
  if (itemId === "rainbow_core") state.rainbowCores = (state.rainbowCores || 0) + 1;
  else if (itemId === "gems_160") state.gems = (state.gems || 0) + 160;
  else if (itemId === "tickets_5") state.cardTickets = (state.cardTickets || 0) + 5;
  else if (itemId === "cores_15") state.cores = (state.cores || 0) + 15;
  else if (itemId === "books_60") state.expBooks = (state.expBooks || 0) + 60;
  else if (itemId === "credits_30k") state.credits = (state.credits || 0) + 30000;
  else if (itemId === "bouquet_5") state.bondGifts = (state.bondGifts || 0) + 5;

  if (typeof saveGame === "function") saveGame();
  if (typeof playSfx === "function") playSfx("gift");
  if (typeof renderTopBar === "function") renderTopBar();
  renderCrestShopList();
  renderCrestBanners();
  renderManualLimitBreakPanel();
  showToast(`✨ ${it.name} と交換しました！`);
}

// グローバル公開
window.executeManualLimitBreak = executeManualLimitBreak;
window.openCrestShopModal = openCrestShopModal;
window.closeCrestShopModal = closeCrestShopModal;
window.buyCrestShopItem = buyCrestShopItem;
window.MF_LIMIT_BREAK = {
  getDupeCount,
  getCharMemoryCount,
  openCrestShopModal,
  renderManualLimitBreakPanel,
  renderCrestBanners
};

// ---------- 安全フック（既存 gacha.js / growth.js / saveGame に自動接続） ----------
(function installLimitBreakHooks() {
  ensureLbState();
  syncDupeSnapshot();

  // 1. saveGame 監視フック（自動凸を確実にキャッチして記憶・クレストへ振替）
  if (typeof window.saveGame === "function" && !window.saveGame._lbHooked) {
    const origSave = window.saveGame;
    window.saveGame = function() {
      if (!lbSaveIntercepting && !lbManualActionRunning) {
        lbSaveIntercepting = true;
        try { processGachaDupeChanges(); } finally { lbSaveIntercepting = false; }
      }
      return origSave.apply(this, arguments);
    };
    window.saveGame._lbHooked = true;
  }

  // 2. スカウト実行関数の自動ラップ（既に5凸の完凸キャラ重複も10連単位で漏れなくカウント）
  const gachaFnNames = Object.keys(window).filter(k =>
    typeof window[k] === "function" &&
    /^(pull|do|run|exec|roll|draw|perform|start)?(Char)?(Gacha|Scout|Summon)/i.test(k) &&
    !/card|pack|render|view|close|open|modal|switch|banner|tab/i.test(k)
  );

  gachaFnNames.forEach(fnName => {
    const orig = window[fnName];
    if (!orig || orig._lbHooked) return;
    window[fnName] = function() {
      const map = ensureLbState();
      if (map && !lbStashedDupes) {
        // 実行中だけ凸数を一時0退避（Math.min(5,...)の頭打ちを回避し、正確な重複回数を計測）
        lbStashedDupes = {};
        Object.keys(map).forEach(id => { lbStashedDupes[id] = Number(map[id] || 0); map[id] = 0; });
      }
      try {
        return orig.apply(this, arguments);
      } finally {
        if (lbStashedDupes) {
          lbSaveIntercepting = true;
          try { processGachaDupeChanges(); } finally { lbSaveIntercepting = false; }
        }
      }
    };
    window[fnName]._lbHooked = true;
  });

  // 3. 画面切替＆隊員詳細のDOM変化を監視してパネルを自動描画
  if (typeof window.switchView === "function" && !window.switchView._lbHooked) {
    const origSwitch = window.switchView;
    window.switchView = function() {
      const r = origSwitch.apply(this, arguments);
      setTimeout(() => {
        renderCrestBanners();
        renderManualLimitBreakPanel();
      }, 40);
      return r;
    };
    window.switchView._lbHooked = true;
  }

  let obsTimer = null;
  const observer = new MutationObserver(() => {
    if (lbDomUpdating) return;
    clearTimeout(obsTimer);
    obsTimer = setTimeout(() => {
      renderManualLimitBreakPanel();
      renderCrestBanners();
    }, 60);
  });

  const attachObs = () => {
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
      renderCrestBanners();
      renderManualLimitBreakPanel();
    }
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", attachObs);
  else attachObs();
})();
