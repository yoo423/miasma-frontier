// =========================================================
// 🎖️ 指揮官拡張モジュール（v2）
//   1. ホーム中央「秘書官メインステージ」（左立ち絵＋右機能ドック／主人公対応）
//   2. 自由移動・ピンチズーム対応 立ち絵拡大ビューア
//   3. 元素共鳴（属性シナジー）＆ 小隊プリセット（5枠）
//   4. 指揮官IDカード（スクショモード・URL共有・掲示板自動展開・名刺帳）
// =========================================================
let cfVoiceCursor = 0;
let cfActiveIdCardTab = "mine";
let cfViewingForeignCard = null;
let cfPresetEditIdx = -1;
let cfDeckKeyCache = null;
let cfDomLock = false;

const CF_RESONANCE_META = {
  fire:    { icon: "🔥", name: "紅蓮の共鳴", color: "#ff5a36", desc: "炎×2：小隊ATK+15%（3名で+22%）" },
  water:   { icon: "💧", name: "蒼海の共鳴", color: "#2ea8ff", desc: "水×2：最大HP+18% ＆ 毎ターンHP5%回復" },
  ice:     { icon: "❄️", name: "極氷の共鳴", color: "#6be4ff", desc: "氷×2：体勢削り+22% ＆ 開幕氷付着" },
  volt:    { icon: "⚡", name: "迅雷の共鳴", color: "#ffd000", desc: "雷×2：開幕EX+20% ＆ EX獲得+25%" },
  wind:    { icon: "🌪️", name: "翠嵐の共鳴", color: "#2ee6a6", desc: "風×2：開幕AP+1 ＆ 追加1ドロー" },
  arc:     { icon: "✨", name: "煌晶の共鳴", color: "#f3cf00", desc: "煌×2：開幕防壁16% ＆ DEF+20%" },
  rainbow: { icon: "🌈", name: "四極調和",   color: "#c77dff", desc: "4属性編成：全ステ+10% ＆ 堅牢防御" }
};

const CF_SECRETARY_VOICES = {
  protagonist: {
    morning: "よし、今日も第7クリアラー小隊の作戦開始だ。装備とデッキの点検をしておこう。",
    day:     "霧の晴れたエリアが少しずつ広がってきたな。この調子で前線を押し上げよう！",
    evening: "夕焼けの向こうにもまだ未踏の瘴霧がある……だが、今の仲間となら必ず突破できる。",
    night:   "夜間の警戒態勢よし。明日の強敵に備えて、今夜は作戦を練りつつしっかり休もう。",
    late:    "静かな夜だな……仲間の顔を思い浮かべると、どんな絶望にも負ける気がしない。"
  },
  aoi: {
    morning: "おはようございます、隊長！本日の作戦計画書と温かいコーヒーを用意しておきました。",
    day:     "戦線データ更新完了です。午後も無理しすぎず、補給を挟みながら進みましょうね。",
    evening: "夕焼けが綺麗ですね……今日の成果をまとめておきますから、少し一息ついてください。",
    night:   "夜間の瘴霧濃度が上昇しています。明日に備えて今夜はしっかり休みましょう、隊長。",
    late:    "まだ起きていらっしゃったんですか？ ……まったく、私も隣でお付き合いしますよ。"
  },
  mikoto: {
    morning: "おはよう存じます、隊長。朝露が凍りつく澄んだ空気……今日も良い日になりそうですね。",
    day:     "昼の日差しは少し眩しいですね。作戦の合間に氷菓子でもご一緒しませんか？",
    evening: "黄昏どきは瘴霧が動き出す刻。……私の氷華があれば、隊長に指一本触れさせませんよ。",
    night:   "月が美しい夜ですね。……もう少しだけ、私の傍にいてくださっても構いませんよ？",
    late:    "深夜までお務めとは感心ですが、お体に障ります。さあ、お休みの支度を。"
  },
  celestia: {
    morning: "おはようございます。視界クリア、風速安定。いつでも狙撃支援可能です、隊長。",
    day:     "午後の偵察データを同期しました。次の目標座標を指定していただければ即座に撃ち抜きます。",
    evening: "夕陽は照準を惑わせますが……貴方の背中だけは、どんな光の中でも見失いません。",
    night:   "暗視スコープ起動。夜間の見張りは私に任せて、隊長は休んでいてください。",
    late:    "深夜の作戦会議ですか？ 結構。熱い紅茶を淹れてきましょう。"
  },
  sylphy: {
    morning: "おはよー隊長！ 朝ランしてきたとこ！ 今日もトップスピードで駆け抜けようぜ！",
    day:     "腹減ったなー！ 次の討伐サクッと終わらせて、キャンプで旨いもん食おうぜ！",
    evening: "おっ、いい夕風！ こういう時間に隊長と並んで歩くの、結構好きなんだよな。",
    night:   "ふぁ〜……さすがにあたしもちょっと眠くなってきたかも。明日も頼むぜ、相棒！",
    late:    "うわっ、隊長まだ起きてたの！？ 夜更かし仲間だな、作戦でも練るか！"
  },
  serina: {
    morning: "おはようございます、隊長♪ 小鳥と一緒に朝の歌を練習していたんですよ。",
    day:     "お昼ですね。疲れたらいつでも私のところへ来てくださいね、癒やしの旋律を奏でますから。",
    evening: "夕暮れの風って、なんだか優しい気持ちになりますね。今日も一日お疲れさまでした。",
    night:   "おやすみの前に、静かな子守唄を歌いましょうか？ ぐっすり眠れますように。",
    late:    "こんな時間まで頑張っていたんですね……無理は禁物ですよ、隊長。"
  },
  lily: {
    morning: "おはようございます、隊長！ 盾の磨き上げも完了し、いつでも出撃できます！",
    day:     "本日の護衛任務も抜かりありません。私の聖壁の後ろにいれば絶対安全です！",
    evening: "日が落ちてきましたね。帰還後の装備点検は私が手伝いますから安心してください。",
    night:   "夜の巡回は私に任せてください。隊長が安らかに眠れるよう、扉の前でお守りします。",
    late:    "隊長、お夜食をお持ちしました。……ですが、食べたらすぐにお休みくださいね？"
  },
  marina: {
    morning: "ふわぁ……おはよう、隊長。朝の涼しい風、海の匂いがするみたいで気持ちいいね。",
    day:     "日差しが強いね〜。水分補給ちゃんとしてる？ ほら、冷たい水筒あげる！",
    evening: "夕陽が水面に映る景色、大好きなんだ。いつか霧のない本物の海、一緒に見ようね。",
    night:   "夜は静かで落ち着くね。波の音を思い出しながら、ゆっくり休もう？",
    late:    "あれ、隊長も眠れないの？ じゃあ少しだけ、二人でおしゃべりしよっか。"
  },
  iris: {
    morning: "よく眠れたか、隊長。朝から闘気が漲っているな……いい顔だ、出撃するぞ！",
    day:     "強敵と刃を交える準備は万端だ。一番熱い戦場へ私を連れていけ。",
    evening: "紅に染まる空は悪くない。今日の戦果を肴に、明日の戦略を語るとしよう。",
    night:   "炎も時には熾火にして休ませるものだ。お前も今夜は剣を置いて休め。",
    late:    "深夜に一人で背負い込むな。……お前の隣には私がいることを忘れるなよ。"
  },
  lunaria: {
    morning: "おはようございます、隊長。夜明けの光を見ると、この世界も必ず救えると信じられます。",
    day:     "開拓マップの進捗、順調ですね！ 私も全力でお手伝いします。",
    evening: "夕空に一番星が見えてきましたよ。……少しだけ、一緒に眺めていきませんか？",
    night:   "満天の星空ですね。隊長とこうして夜を過ごせるのが、今の私にとって一番の宝物です。",
    late:    "まだ灯りが点いていたので……あまりご無理なさらないでくださいね、隊長。"
  },
  koharu: {
    morning: "おはようございますっ隊長さん！ 焼きたてパンの匂いでお目覚めバッチリですか？",
    day:     "お昼ですよー！ ハンマー振るってペコペコなので、一緒にごはん食べましょっ！",
    evening: "わぁ、お空がオレンジ色です！ 今日もみんなで無事に帰ってこられてよかったぁ。",
    night:   "ふぁあ……しっぽがもふもふして眠くなってきちゃいました。おやすみなさいっ隊長さん！",
    late:    "隊長さん、夜更かしはダメですよーっ！ ホットミルク作ったので飲んで寝ましょ？"
  }
};

function cfEsc(s) {
  if (typeof escapeHtml === "function") return escapeHtml(s);
  return String(s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  }[c]));
}

function cfDetectDeckIdxKey() {
  if (cfDeckKeyCache) return cfDeckKeyCache;
  const keys = ["activeDeckIdx", "currentDeckIdx", "selectedDeckIdx", "deckIndex", "deckIdx"];
  if (typeof state !== "undefined" && state) {
    for (const k of keys) {
      if (typeof state[k] === "number") { cfDeckKeyCache = k; return k; }
    }
  }
  cfDeckKeyCache = "activeDeckIdx";
  return cfDeckKeyCache;
}

function cfGetOwnedAllies() {
  const owned = new Set(state?.ownedChars || []);
  const chars = window.MF_DATA?.CHARACTERS || {};
  const rarRank = { SSR: 4, SR: 3, R: 2, N: 1 };
  return Object.values(chars)
    .filter(c => c && !c.isProtagonist && c.id !== "protagonist" && owned.has(c.id))
    .sort((a, b) => (rarRank[b.rarity] || 0) - (rarRank[a.rarity] || 0) || (state?.charLevels?.[b.id] || 1) - (state?.charLevels?.[a.id] || 1));
}

// 主人公＋所持済み隊員（秘書官＆プリセット両対応）
function cfGetOwnedPartyCandidates() {
  const protag = typeof getCharProfile === "function"
    ? getCharProfile("protagonist")
    : { id: "protagonist", name: state?.playerName || "隊長", rarity: "SR", element: "fire", isProtagonist: true, styleId: state?.styleId || "m_cool", emoji: "🧑‍✈️" };
  return [protag, ...cfGetOwnedAllies()];
}

function cfEnsureState() {
  if (typeof state === "undefined" || !state) return;
  if (!state.commanderCode) {
    const seg = () => Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4).padEnd(4, "7");
    state.commanderCode = `MF-${seg()}-${seg()}`;
  }
  if (typeof state.commanderBio !== "string") {
    state.commanderBio = "第7クリアラー小隊、前線開拓中！";
  }
  if (!Array.isArray(state.friendIdCards)) state.friendIdCards = [];

  // 主人公＋所持済み隊員のみ秘書官として許可
  const ownedSet = new Set(["protagonist", ...(state.ownedChars || [])]);
  if (!state.secretaryCharId || !ownedSet.has(state.secretaryCharId)) {
    const allies = cfGetOwnedAllies();
    const fromParty = (state.party || []).find(id => id !== "protagonist" && ownedSet.has(id));
    state.secretaryCharId = fromParty || allies[0]?.id || "protagonist";
  }

  if (!Array.isArray(state.squadPresets) || state.squadPresets.length < 5) {
    const dkKey = cfDetectDeckIdxKey();
    const curDeck = Number(state[dkKey] || 0);
    const base = Array.isArray(state.squadPresets) ? [...state.squadPresets] : [];
    while (base.length < 5) {
      const idx = base.length;
      base.push(idx === 0
        ? { name: "主力小隊", party: [...(state.party || ["protagonist"])], deckIdx: curDeck }
        : { name: `プリセット ${idx + 1}`, party: [], deckIdx: idx }
      );
    }
    state.squadPresets = base;
  }
}

// =========================================================
// 🔍 自由移動（ドラッグ）＆ ピンチズーム対応 立ち絵拡大ビューア
// =========================================================
let cfZoomState = {
  charId: "protagonist",
  scale: 1,
  tx: 0,
  ty: 0,
  dragging: false,
  pinching: false,
  startX: 0,
  startY: 0,
  baseTx: 0,
  baseTy: 0,
  pinchDist: 0,
  pinchScale: 1,
  lastTap: 0
};

function cfApplyZoomTransform() {
  const el = document.getElementById("cf-zoom-target");
  const readout = document.getElementById("cf-zoom-pct");
  if (el) {
    el.style.transform = `translate3d(${cfZoomState.tx}px, ${cfZoomState.ty}px, 0) scale(${cfZoomState.scale})`;
  }
  if (readout) {
    readout.textContent = `${Math.round(cfZoomState.scale * 100)}%`;
  }
}

function cfAdjustZoom(delta) {
  cfZoomState.scale = Math.max(0.85, Math.min(4.5, +(cfZoomState.scale + delta).toFixed(2)));
  cfApplyZoomTransform();
  if (typeof playSfx === "function") playSfx("tap");
}

function cfResetZoom() {
  cfZoomState.scale = 1;
  cfZoomState.tx = 0;
  cfZoomState.ty = 0;
  cfApplyZoomTransform();
  if (typeof playSfx === "function") playSfx("tap");
}

function cfCloseFreeZoom() {
  const ov = document.getElementById("cf-free-zoom-overlay");
  if (ov) ov.classList.remove("active");
}

function cfOpenFreeZoom(charId) {
  cfEnsureState();
  const id = charId || state?.secretaryCharId || "protagonist";
  const ch = typeof getCharProfile === "function"
    ? getCharProfile(id)
    : (window.MF_DATA?.CHARACTERS?.[id] || { id, name: id, rarity: "SR", emoji: "👤" });

  cfZoomState = {
    charId: id, scale: 1, tx: 0, ty: 0,
    dragging: false, pinching: false,
    startX: 0, startY: 0, baseTx: 0, baseTy: 0,
    pinchDist: 0, pinchScale: 1, lastTap: 0
  };

  let ov = document.getElementById("cf-free-zoom-overlay");
  if (!ov) {
    ov = document.createElement("div");
    ov.id = "cf-free-zoom-overlay";
    ov.className = "cf-free-zoom-overlay";
    document.body.appendChild(ov);
  }

  const el = window.MF_DATA?.ELEMENTS?.[ch.element] || { icon: "✨", name: "煌" };
  const art = window.MF_SPRITES?.portraitHTML
    ? window.MF_SPRITES.portraitHTML(ch, "contain")
    : `<div style="font-size:84px;">${ch.emoji || "👤"}</div>`;

  ov.innerHTML = `
    <div class="cf-zoom-topbar">
      <div style="text-align:left;">
        <strong style="font-size:13.5px; color:#fff;">${el.icon} ${cfEsc(ch.name)} <small style="color:#f3cf00;">(${ch.rarity || "SR"})</small></strong>
        <div style="font-size:9.5px; color:#b6c6e6;">ドラッグで自由移動 ／ 2本指ピンチ＆ボタンで拡大縮小</div>
      </div>
      <button class="btn-xs btn-accent2" onclick="cfCloseFreeZoom()">閉じる ✕</button>
    </div>

    <div id="cf-zoom-canvas" class="cf-zoom-canvas">
      <div id="cf-zoom-target" class="cf-zoom-target">
        ${art}
      </div>
    </div>

    <div class="cf-zoom-controls">
      <button class="btn-xs" style="padding:7px 12px; font-size:14px;" onclick="cfAdjustZoom(-0.35)">－</button>
      <span id="cf-zoom-pct" class="cf-zoom-pct">100%</span>
      <button class="btn-xs" style="padding:7px 12px; font-size:14px;" onclick="cfAdjustZoom(0.35)">＋</button>
      <button class="btn-xs btn-primary" style="padding:7px 11px;" onclick="cfResetZoom()">↺ リセット</button>
    </div>
  `;

  ov.classList.add("active");
  cfBindZoomGestures();
  cfApplyZoomTransform();
  if (typeof playSfx === "function") playSfx("tap");
}

function cfBindZoomGestures() {
  const canvas = document.getElementById("cf-zoom-canvas");
  if (!canvas || canvas._cfBound) return;
  canvas._cfBound = true;

  const getDist = (t1, t2) => Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);

  // タッチ（1本指パン・2本指ピンチ・ダブルタップ拡大）
  canvas.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      const now = Date.now();
      if (now - cfZoomState.lastTap < 280) {
        if (cfZoomState.scale > 1.3) cfResetZoom();
        else { cfZoomState.scale = 2.2; cfApplyZoomTransform(); }
        cfZoomState.lastTap = 0;
        return;
      }
      cfZoomState.lastTap = now;
      cfZoomState.dragging = true;
      cfZoomState.pinching = false;
      cfZoomState.startX = e.touches[0].clientX;
      cfZoomState.startY = e.touches[0].clientY;
      cfZoomState.baseTx = cfZoomState.tx;
      cfZoomState.baseTy = cfZoomState.ty;
    } else if (e.touches.length >= 2) {
      cfZoomState.dragging = false;
      cfZoomState.pinching = true;
      cfZoomState.pinchDist = getDist(e.touches[0], e.touches[1]);
      cfZoomState.pinchScale = cfZoomState.scale;
    }
  }, { passive: true });

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && cfZoomState.dragging) {
      const dx = e.touches[0].clientX - cfZoomState.startX;
      const dy = e.touches[0].clientY - cfZoomState.startY;
      cfZoomState.tx = cfZoomState.baseTx + dx;
      cfZoomState.ty = cfZoomState.baseTy + dy;
      cfApplyZoomTransform();
    } else if (e.touches.length >= 2 && cfZoomState.pinching && cfZoomState.pinchDist > 10) {
      const dist = getDist(e.touches[0], e.touches[1]);
      const ratio = dist / cfZoomState.pinchDist;
      cfZoomState.scale = Math.max(0.85, Math.min(4.5, cfZoomState.pinchScale * ratio));
      cfApplyZoomTransform();
    }
  }, { passive: false });

  canvas.addEventListener("touchend", (e) => {
    if (e.touches.length === 0) {
      cfZoomState.dragging = false;
      cfZoomState.pinching = false;
    } else if (e.touches.length === 1) {
      cfZoomState.pinching = false;
      cfZoomState.dragging = true;
      cfZoomState.startX = e.touches[0].clientX;
      cfZoomState.startY = e.touches[0].clientY;
      cfZoomState.baseTx = cfZoomState.tx;
      cfZoomState.baseTy = cfZoomState.ty;
    }
  }, { passive: true });

  // PCマウス（ドラッグ＆ホイール）
  canvas.addEventListener("mousedown", (e) => {
    e.preventDefault();
    cfZoomState.dragging = true;
    cfZoomState.startX = e.clientX;
    cfZoomState.startY = e.clientY;
    cfZoomState.baseTx = cfZoomState.tx;
    cfZoomState.baseTy = cfZoomState.ty;
  });
  window.addEventListener("mousemove", (e) => {
    if (!cfZoomState.dragging) return;
    cfZoomState.tx = cfZoomState.baseTx + (e.clientX - cfZoomState.startX);
    cfZoomState.ty = cfZoomState.baseTy + (e.clientY - cfZoomState.startY);
    cfApplyZoomTransform();
  });
  window.addEventListener("mouseup", () => { cfZoomState.dragging = false; });
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    cfAdjustZoom(e.deltaY < 0 ? 0.25 : -0.25);
  }, { passive: false });
}

// =========================================================
// 1. ⚡ 元素共鳴（属性シナジー）計算 ＆ 小隊プリセット
// =========================================================
function cfCalcResonance(partyIds) {
  const ids = (partyIds && partyIds.length ? partyIds : (state?.party || [])).slice(0, 4);
  const counts = {};
  ids.forEach(id => {
    const prof = typeof getCharProfile === "function" ? getCharProfile(id) : window.MF_DATA?.CHARACTERS?.[id];
    const el = prof?.element || "arc";
    counts[el] = (counts[el] || 0) + 1;
  });

  const active = [];
  const mods = {
    atkPct: 0, hpPct: 0, defPct: 0,
    turnHealPct: 0, staggerPct: 0, startIce: false,
    startEx: 0, exGainPct: 0,
    startAp: 0, startDraw: 0,
    startShieldPct: 0
  };

  Object.keys(counts).forEach(el => {
    const cnt = counts[el];
    if (cnt >= 2 && CF_RESONANCE_META[el]) {
      const m = CF_RESONANCE_META[el];
      let detail = m.desc;
      if (el === "fire") {
        const v = cnt >= 3 ? 22 : 15;
        mods.atkPct += v;
        detail = `小隊ATK +${v}%`;
      } else if (el === "water") {
        mods.hpPct += 18;
        mods.turnHealPct += 5;
        detail = "最大HP +18% / 毎T回復5%";
      } else if (el === "ice") {
        mods.staggerPct += 22;
        mods.startIce = true;
        detail = "体勢削り +22% / 開幕氷付着";
      } else if (el === "volt") {
        mods.startEx += 20;
        mods.exGainPct += 25;
        detail = "開幕EX +20% / EX獲得+25%";
      } else if (el === "wind") {
        mods.startAp += 1;
        mods.startDraw += 1;
        detail = "開幕AP +1 / 追加1ドロー";
      } else if (el === "arc") {
        mods.startShieldPct += 16;
        mods.defPct += 20;
        detail = "開幕防壁16% / DEF +20%";
      }
      active.push({ id: el, icon: m.icon, name: m.name, color: m.color, detail, count: cnt });
    }
  });

  const uniqueCount = Object.keys(counts).length;
  if (ids.length >= 4 && uniqueCount >= 4) {
    const rm = CF_RESONANCE_META.rainbow;
    mods.atkPct += 10;
    mods.hpPct += 10;
    mods.defPct += 24;
    active.push({ id: "rainbow", icon: rm.icon, name: rm.name, color: rm.color, detail: "全ステ+10% / 堅牢防御", count: 4 });
  }

  return { active, mods, counts };
}

function cfApplyBattleResonance() {
  if (typeof btl === "undefined" || !btl || btl._cfResApplied) return;
  const res = cfCalcResonance(state?.party || []);
  btl.resonance = res;
  btl._cfResApplied = true;
  btl._cfResTurn = btl.turn || 1;
  if (!res.active.length) return;

  const m = res.mods;
  if (m.atkPct > 0) btl.members.forEach(mem => { mem.atk = Math.round(mem.atk * (1 + m.atkPct / 100)); });
  if (m.hpPct > 0) {
    btl.teamMaxHp = Math.round(btl.teamMaxHp * (1 + m.hpPct / 100));
    btl.teamHp = btl.teamMaxHp;
  }
  if (m.defPct > 0) btl.teamDef = Math.round((btl.teamDef || 0) * (1 + m.defPct / 100));
  if (m.startEx > 0) btl.exGauge = Math.min(95, (btl.exGauge || 0) + m.startEx);
  if (m.startShieldPct > 0) btl.shield = (btl.shield || 0) + Math.round(btl.teamMaxHp * (m.startShieldPct / 100));
  if (m.startAp > 0) btl.ap = Math.min(8, (btl.ap || 4) + m.startAp);
  if (m.startDraw > 0 && typeof drawCards === "function") drawCards(m.startDraw);
  if (m.startIce && !btl.attachedElement) btl.attachedElement = "ice";

  const names = res.active.map(r => `${r.icon}${r.name}`).join(" ＆ ");
  if (typeof pushBattleLog === "function") pushBattleLog(`⚡ 元素共鳴発動：【${names}】！`);
  if (typeof renderBattleHUD === "function") renderBattleHUD();
}

function cfOpenPresetModal() {
  cfEnsureState();
  cfPresetEditIdx = -1;
  let modal = document.getElementById("modal-cf-presets");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-cf-presets";
    modal.className = "modal-overlay";
    modal.style.zIndex = "1500";
    modal.onclick = () => modal.classList.remove("active");
    document.body.appendChild(modal);
  }
  cfRenderPresetModal();
  modal.classList.add("active");
  if (typeof playSfx === "function") playSfx("switch");
}

function cfSaveCurrentToPreset(idx) {
  cfEnsureState();
  const dkKey = cfDetectDeckIdxKey();
  const curName = state.squadPresets[idx]?.name || `プリセット ${idx + 1}`;
  state.squadPresets[idx] = {
    name: curName,
    party: [...(state.party || ["protagonist"])].slice(0, 4),
    deckIdx: Number(state[dkKey] || 0)
  };
  if (typeof saveGame === "function") saveGame();
  if (typeof playSfx === "function") playSfx("gift");
  cfRenderPresetModal();
  cfRenderAllBars();
  showToast(`💾 現在の小隊・デッキを『${curName}』へ保存しました！`);
}

function cfApplyPreset(idx) {
  cfEnsureState();
  const pr = state.squadPresets[idx];
  if (!pr || !Array.isArray(pr.party) || pr.party.length === 0) {
    showToast("この枠にはまだ小隊が保存されていません");
    return;
  }
  const owned = new Set(["protagonist", ...(state.ownedChars || [])]);
  const validParty = pr.party.filter(id => owned.has(id)).slice(0, 4);
  if (validParty.length === 0) return;

  state.party = validParty;
  const dkKey = cfDetectDeckIdxKey();
  if (typeof pr.deckIdx === "number") state[dkKey] = pr.deckIdx;

  if (typeof saveGame === "function") saveGame();
  if (typeof playSfx === "function") playSfx("win");
  if (typeof renderTopBar === "function") renderTopBar();
  if (typeof renderBattleView === "function" && document.getElementById("view-battle")?.classList.contains("active")) renderBattleView();
  if (typeof renderGrowthView === "function" && document.getElementById("view-growth")?.classList.contains("active")) renderGrowthView();
  cfRenderPresetModal();
  cfRenderAllBars();

  const res = cfCalcResonance(state.party);
  const rTxt = res.active.length ? `（${res.active.map(r => r.icon + r.name).join("・")}）` : "";
  showToast(`⚡ 『${pr.name}』へ小隊＆デッキを切替！${rTxt}`);
}

function cfRenamePreset(idx) {
  cfEnsureState();
  const cur = state.squadPresets[idx]?.name || `プリセット ${idx + 1}`;
  const next = prompt("プリセット名を入力してください（12文字以内）：", cur);
  if (!next || !next.trim()) return;
  state.squadPresets[idx].name = next.trim().slice(0, 12);
  if (typeof saveGame === "function") saveGame();
  cfRenderPresetModal();
}

function cfTogglePresetMember(idx, charId) {
  cfEnsureState();
  const pr = state.squadPresets[idx];
  if (!pr) return;
  pr.party = Array.isArray(pr.party) ? pr.party : [];
  const pos = pr.party.indexOf(charId);
  if (pos >= 0) {
    if (pr.party.length <= 1) { showToast("最低1名は編成してください"); return; }
    pr.party.splice(pos, 1);
  } else {
    if (pr.party.length >= 4) { showToast("小隊は最大4名までです（1名外してから追加）"); return; }
    pr.party.push(charId);
  }
  if (typeof saveGame === "function") saveGame();
  if (typeof playSfx === "function") playSfx("tap");
  cfRenderPresetModal();
}

function cfSetPresetDeck(idx, deckIdx) {
  cfEnsureState();
  if (!state.squadPresets[idx]) return;
  state.squadPresets[idx].deckIdx = deckIdx;
  if (typeof saveGame === "function") saveGame();
  if (typeof playSfx === "function") playSfx("tap");
  cfRenderPresetModal();
}

function cfRenderPresetModal() {
  const modal = document.getElementById("modal-cf-presets");
  if (!modal) return;
  cfEnsureState();
  const curRes = cfCalcResonance(state.party);

  let bodyHtml = "";
  if (cfPresetEditIdx >= 0) {
    const idx = cfPresetEditIdx;
    const pr = state.squadPresets[idx];
    const editRes = cfCalcResonance(pr.party);
    const cands = cfGetOwnedPartyCandidates();
    bodyHtml = `
      <div class="top-row" style="margin-bottom:7px;">
        <strong style="font-size:13px;">✏️ 『${cfEsc(pr.name)}』のメンバー編集</strong>
        <button class="btn-xs" onclick="cfPresetEditIdx=-1; cfRenderPresetModal();">← 一覧へ</button>
      </div>
      <div class="cf-res-box" style="margin-bottom:7px;">
        <div style="font-size:10.5px; font-weight:900; margin-bottom:3px;">この編成で発動する元素共鳴：</div>
        ${editRes.active.length
          ? editRes.active.map(r => `<span class="cf-res-pill" style="border-color:${r.color};">${r.icon} ${r.name}（${r.detail}）</span>`).join("")
          : `<span style="font-size:10px; opacity:0.75;">同属性2名以上、または4属性バラバラで共鳴発動！</span>`}
      </div>
      <div style="font-size:10.5px; font-weight:900; margin-bottom:4px; text-align:left;">連動するマイデッキ枠：</div>
      <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:4px; margin-bottom:8px;">
        ${[0, 1, 2, 3, 4].map(d => `
          <button class="btn-xs ${Number(pr.deckIdx || 0) === d ? "btn-primary" : ""}" onclick="cfSetPresetDeck(${idx}, ${d})">デッキ${d + 1}</button>
        `).join("")}
      </div>
      <div style="font-size:10.5px; font-weight:900; margin-bottom:4px; text-align:left;">編成メンバー選択（${pr.party.length}/4名）：</div>
      <div class="cf-pick-grid">
        ${cands.map(ch => {
          const el = window.MF_DATA?.ELEMENTS?.[ch.element] || { icon: "✨" };
          const sel = pr.party.includes(ch.id);
          const lv = state?.charLevels?.[ch.id] || 1;
          return `
            <button class="cf-pick-tile ${sel ? "selected" : ""}" onclick="cfTogglePresetMember(${idx}, '${ch.id}')">
              <div style="font-size:10px; font-weight:900;">${el.icon} ${cfEsc(ch.name)}</div>
              <div style="font-size:9px; opacity:0.8;">Lv.${lv} ${sel ? "✓編成中" : ""}</div>
            </button>
          `;
        }).join("")}
      </div>
      <button class="btn-accent2" style="width:100%; padding:10px; margin-top:9px;" onclick="cfApplyPreset(${idx}); cfPresetEditIdx=-1;">
        ⚡ この編成を今すぐ小隊へ適用する！
      </button>
    `;
  } else {
    bodyHtml = `
      <div class="cf-res-box" style="margin-bottom:8px;">
        <div style="font-size:11px; font-weight:900; margin-bottom:4px;">⚡ 現在の小隊で発動中の元素共鳴</div>
        ${curRes.active.length
          ? `<div style="display:flex; flex-direction:column; gap:4px;">${curRes.active.map(r => `<div class="cf-res-pill" style="border-color:${r.color};">${r.icon} <strong>${r.name}</strong>：${r.detail}</div>`).join("")}</div>`
          : `<div style="font-size:10.5px; opacity:0.8;">現在未発動（同属性2名以上、または4人全員異なる属性で発動！）</div>`}
      </div>

      <details style="text-align:left; font-size:10px; background:var(--surface-sub); border-radius:9px; padding:6px 8px; margin-bottom:8px;">
        <summary style="font-weight:900; cursor:pointer;">📖 全7種の元素共鳴効果一覧を見る</summary>
        <div style="margin-top:5px; line-height:1.55;">
          ${Object.values(CF_RESONANCE_META).map(m => `<div>${m.icon} <strong>${m.name}</strong>：${m.desc}</div>`).join("")}
        </div>
      </details>

      <div style="display:flex; flex-direction:column; gap:7px;">
        ${state.squadPresets.map((pr, i) => {
          const pRes = cfCalcResonance(pr.party);
          const hasData = pr.party && pr.party.length > 0;
          const names = (pr.party || []).map(id => {
            const c = typeof getCharProfile === "function" ? getCharProfile(id) : { name: id, element: "arc" };
            const el = window.MF_DATA?.ELEMENTS?.[c.element]?.icon || "";
            return `${el}${c.name}`;
          }).join(" / ");
          const isCurrent = hasData && JSON.stringify(pr.party) === JSON.stringify(state.party || []);
          return `
            <div class="cf-preset-card ${isCurrent ? "current" : ""}">
              <div class="top-row" style="margin-bottom:3px;">
                <strong style="font-size:12px;">${isCurrent ? "✅ " : ""}${cfEsc(pr.name)} <small style="opacity:0.75;">(デッキ${Number(pr.deckIdx || 0) + 1})</small></strong>
                <button class="btn-xs" style="font-size:9px; padding:2px 6px;" onclick="cfRenamePreset(${i})">✎ 名前</button>
              </div>
              <div style="font-size:10px; color:var(--muted); text-align:left; margin-bottom:4px;">
                ${hasData ? cfEsc(names) : "（未登録：現在の小隊を保存または編集）"}
              </div>
              ${pRes.active.length ? `<div style="font-size:9.5px; color:#f3cf00; font-weight:900; text-align:left; margin-bottom:5px;">⚡ ${pRes.active.map(r => r.icon + r.name).join(" / ")}</div>` : ""}
              <div style="display:grid; grid-template-columns:1.1fr 1fr 0.9fr; gap:5px;">
                <button class="btn-xs btn-primary" ${hasData ? "" : "disabled"} onclick="cfApplyPreset(${i})">⚡ 切替</button>
                <button class="btn-xs" onclick="cfSaveCurrentToPreset(${i})">💾 現小隊を上書</button>
                <button class="btn-xs btn-accent2" onclick="cfPresetEditIdx=${i}; playSfx('tap'); cfRenderPresetModal();">✏️ 編集</button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  modal.innerHTML = `
    <div class="modal-box" onclick="event.stopPropagation()" style="max-height:86dvh; overflow-y:auto;">
      <div class="top-row" style="margin-bottom:8px;">
        <strong style="font-size:14.5px;">⚡ 元素共鳴 ＆ 小隊プリセット</strong>
        <button class="btn-xs" onclick="document.getElementById('modal-cf-presets').classList.remove('active')">閉じる ✕</button>
      </div>
      ${bodyHtml}
    </div>
  `;
}

// =========================================================
// 2. 🎙️ ホーム秘書官メインステージ（主人公対応・左立ち絵・右サイドボタン）
// =========================================================
function cfGetTimeSlot() {
  const h = new Date().getHours();
  if (h >= 5 && h < 11)  return { key: "morning", label: "🌅 朝ボイス" };
  if (h >= 11 && h < 17) return { key: "day",     label: "☀️ 昼ボイス" };
  if (h >= 17 && h < 20) return { key: "evening", label: "🌆 夕方ボイス" };
  if (h >= 20 && h < 24) return { key: "night",   label: "🌙 夜ボイス" };
  return { key: "late", label: "🌌 深夜ボイス" };
}

function cfGetBondLvSafe(charId) {
  if (charId === "protagonist") return 5;
  const map = state?.bonds || state?.bondPoints || state?.charBonds || {};
  const pt = Number(map[charId] || 0);
  if (pt >= 100) return 5;
  if (pt >= 60) return 4;
  if (pt >= 30) return 3;
  if (pt >= 10) return 2;
  return 1;
}

function cfGetSecretaryVoicePool(ch) {
  const slot = cfGetTimeSlot();
  const key = (ch.isProtagonist || ch.id === "protagonist") ? "protagonist" : ch.id;
  const preset = CF_SECRETARY_VOICES[key];
  const pName = state?.playerName || "隊長";
  const elName = window.MF_DATA?.ELEMENTS?.[ch.element]?.name || "煌";
  const timeText = preset?.[slot.key] || ({
    morning: `おはようございます、${pName}！ 今日も${elName}の力で前線を切り拓きましょう！`,
    day:     `作戦の調子はどうですか、${pName}？ 出撃の準備はいつでもできていますよ。`,
    evening: `日が傾いてきましたね。今日も一日お疲れさまです、${pName}。`,
    night:   `夜は瘴霧が濃くなりますから、キャンプでしっかり体を休めてくださいね。`,
    late:    `こんな時間までお疲れさまです、${pName}。……私ももう少し隣にいますよ。`
  }[slot.key]);

  const pool = [{ tag: slot.label, text: timeText }];

  if (Array.isArray(ch.voiceLines)) {
    ch.voiceLines.forEach(v => pool.push({ tag: "💬 隊員ボイス", text: v }));
  }

  if (key !== "protagonist") {
    const bLv = cfGetBondLvSafe(ch.id);
    if (bLv >= 3) {
      const lore = typeof BO_CHAR_LORE !== "undefined" ? BO_CHAR_LORE[ch.id] : null;
      pool.push({
        tag: "💞 絆Lv.3特別ボイス",
        text: lore?.l3 || `${pName}の指揮のもとで戦えるのが、今の私にとって一番の誇りです。`
      });
    }
    if (bLv >= 5) {
      const lore = typeof BO_CHAR_LORE !== "undefined" ? BO_CHAR_LORE[ch.id] : null;
      pool.push({
        tag: "👑 絆Lv.5極ボイス",
        text: lore?.l5 || `どんな未来が待っていようと、ずっと${pName}の隣で戦い抜くと誓います。`
      });
    }
  }
  return pool;
}

function cfTapSecretary() {
  cfEnsureState();
  const ch = typeof getCharProfile === "function" ? getCharProfile(state.secretaryCharId) : window.MF_DATA?.CHARACTERS?.[state.secretaryCharId];
  if (!ch) return;
  const pool = cfGetSecretaryVoicePool(ch);
  cfVoiceCursor = (cfVoiceCursor + 1) % pool.length;
  const picked = pool[cfVoiceCursor];

  const tagEl = document.getElementById("cf-sec-voice-tag");
  const txtEl = document.getElementById("cf-sec-voice-text");
  const artEl = document.getElementById("cf-sec-art-box");
  if (tagEl) tagEl.textContent = picked.tag;
  if (txtEl) txtEl.textContent = `「${picked.text}」`;
  if (artEl) {
    artEl.classList.remove("cf-sec-pop");
    void artEl.offsetWidth;
    artEl.classList.add("cf-sec-pop");
  }
  if (typeof playSfx === "function") playSfx("tap");
}

function cfOpenSecretaryPicker() {
  cfEnsureState();
  const candidates = cfGetOwnedPartyCandidates(); // 主人公＋所持隊員
  let modal = document.getElementById("modal-cf-secretary");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-cf-secretary";
    modal.className = "modal-overlay";
    modal.style.zIndex = "1520";
    modal.onclick = () => modal.classList.remove("active");
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-box" onclick="event.stopPropagation()" style="max-height:84dvh; overflow-y:auto;">
      <div class="top-row" style="margin-bottom:7px;">
        <strong style="font-size:14px;">🎙️ ホーム秘書官を選択（主人公＋所持隊員）</strong>
        <button class="btn-xs" onclick="document.getElementById('modal-cf-secretary').classList.remove('active')">閉じる ✕</button>
      </div>
      <div style="font-size:10.5px; color:var(--muted); margin-bottom:8px; text-align:left;">
        選んだキャラがホーム画面の主役＆あなたの『指揮官IDカード』の看板キャラになります。
      </div>
      <div class="cf-sec-picker-grid">
        ${candidates.map(ch => {
          const isProtag = ch.id === "protagonist" || ch.isProtagonist;
          const isCur = state.secretaryCharId === ch.id;
          const el = window.MF_DATA?.ELEMENTS?.[ch.element] || { icon: "✨" };
          const bLv = cfGetBondLvSafe(ch.id);
          const lv = state?.charLevels?.[ch.id] || 1;
          const img = window.MF_SPRITES?.portraitHTML ? window.MF_SPRITES.portraitHTML(ch, "icon-lg") : `<div>${ch.emoji || "👤"}</div>`;
          return `
            <div class="cf-sec-pick-card ${isCur ? "active" : ""}" onclick="cfSetSecretary('${ch.id}')">
              ${img}
              <div style="font-size:11px; font-weight:900; margin-top:3px;">${el.icon} ${cfEsc(ch.name)}</div>
              <div style="font-size:9px; color:var(--muted);">Lv.${lv} ${isProtag ? "｜ 👑隊長" : `｜ 💞Lv.${bLv}`}</div>
              ${isCur ? `<span class="tag" style="background:#f3cf00; color:#111; font-size:8.5px; margin-top:2px;">配置中</span>` : ""}
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
  modal.classList.add("active");
  if (typeof playSfx === "function") playSfx("switch");
}

function cfSetSecretary(charId) {
  cfEnsureState();
  const owned = new Set(["protagonist", ...(state.ownedChars || [])]);
  if (!owned.has(charId)) {
    showToast("未所持の隊員は秘書官に設定できません");
    return;
  }
  state.secretaryCharId = charId;
  cfVoiceCursor = 0;
  if (typeof saveGame === "function") saveGame();
  if (typeof playSfx === "function") playSfx("gift");
  const m = document.getElementById("modal-cf-secretary");
  if (m) m.classList.remove("active");
  cfRenderHomeWidgets();
  const ch = typeof getCharProfile === "function" ? getCharProfile(charId) : { name: charId };
  showToast(`🎙️ ${ch.name} をホーム画面へ配置しました！`);
}

function cfGetRewardHubBadgesSafe() {
  if (typeof rhCountBadges === "function") {
    try { return rhCountBadges(); } catch (_) {}
  }
  return { ach: 0, disp: 0, weekly: 0, total: 0 };
}

// ホーム画面：旧切替ステージ＆旧上部バーを廃止し、ド真ん中の秘書官メインステージへ統合
function cfHideLegacyHomeStages(homeEl) {
  if (!homeEl) return;
  const keepSel = ".home-play-row, .home-main-dock";

  // 下のメインボタン群（物語・討伐・デッキ・隊員・極限・タブレット）を確実に表示維持
  homeEl.querySelectorAll(keepSel).forEach(el => {
    el.style.display = "";
    Array.from(el.children).forEach(c => { c.style.display = ""; });
  });

  // 秘書官ステージと下のボタン群以外の「旧切り替え画面」だけを非表示にする
  const prune = (container) => {
    Array.from(container.children).forEach(el => {
      if (!el || el.id === "cf-home-main-stage" || el.id === "cf-home-extra-dock") return;
      if (el.matches(keepSel)) {
        el.style.display = "";
        return;
      }
      if (el.querySelector(keepSel)) {
        el.style.display = "";
        prune(el);
        return;
      }
      el.style.display = "none";
    });
  };

  prune(homeEl);
}


function cfRenderHomeWidgets() {
  if (typeof state === "undefined" || !state) return;
  cfEnsureState();
  const home = document.getElementById("view-home");
  if (!home) return;

  const ch = typeof getCharProfile === "function"
    ? getCharProfile(state.secretaryCharId)
    : (window.MF_DATA?.CHARACTERS?.[state.secretaryCharId] || { id: "protagonist", name: state.playerName || "隊長", element: "fire", isProtagonist: true });
  if (!ch) return;

  const isProtag = ch.id === "protagonist" || ch.isProtagonist;
  const pool = cfGetSecretaryVoicePool(ch);
  const voice = pool[cfVoiceCursor % pool.length] || pool[0];
  const res = cfCalcResonance(state.party);
  const el = window.MF_DATA?.ELEMENTS?.[ch.element] || { icon: "✨", name: "煌" };
  const bLv = cfGetBondLvSafe(ch.id);
  const badges = cfGetRewardHubBadgesSafe();
  const portrait = window.MF_SPRITES?.portraitHTML
    ? window.MF_SPRITES.portraitHTML(ch, "contain")
    : `<div style="font-size:64px;">${ch.emoji || "👤"}</div>`;

  cfDomLock = true;
  try {
    let stage = document.getElementById("cf-home-main-stage");
    if (!stage) {
      stage = document.createElement("div");
      stage.id = "cf-home-main-stage";
      stage.className = "cf-home-stage";
      home.prepend(stage);
    }

    cfHideLegacyHomeStages(home);

    stage.innerHTML = `
      <div class="cf-stage-grid"></div>
      <div class="cf-stage-glow"></div>

      <div class="cf-stage-top">
        <div class="cf-stage-char-chip">
          <span>${el.icon} <strong>${cfEsc(ch.name)}</strong></span>
          <small>${isProtag ? "👑 指揮官" : `💞 絆Lv.${bLv}`}</small>
        </div>
        <button class="cf-stage-zoom-btn" onclick="cfOpenFreeZoom('${ch.id}')">🔍 拡大・移動</button>
      </div>

      <div class="cf-stage-body">
        <div id="cf-sec-art-box" class="cf-stage-left-art" onclick="cfTapSecretary()">
          ${portrait}
        </div>

        <div class="cf-stage-right-dock">
          <button class="cf-side-btn ${badges.ach ? "hot" : ""}" onclick="typeof rhOpenHubModal==='function' && rhOpenHubModal('ach')">
            <span>🏆 実績</span>
            ${badges.ach ? `<b class="rh-dot">${badges.ach}</b>` : ""}
          </button>
          <button class="cf-side-btn ${badges.disp ? "hot" : ""}" onclick="typeof rhOpenHubModal==='function' && rhOpenHubModal('dispatch')">
            <span>🚁 派遣</span>
            ${badges.disp ? `<b class="rh-dot">${badges.disp}</b>` : ""}
          </button>
          <button class="cf-side-btn ${badges.weekly ? "hot" : ""}" onclick="typeof rhOpenHubModal==='function' && rhOpenHubModal('weekly')">
            <span>🎯 週次挑戦</span>
            ${badges.weekly ? `<b class="rh-dot">${badges.weekly}</b>` : ""}
          </button>
          <button class="cf-side-btn accent-cyan" onclick="cfOpenPresetModal()">
            <span>⚡ ${res.active.length ? res.active.map(r => r.icon).join("") + "共鳴中" : "共鳴/小隊"}</span>
          </button>
          <button class="cf-side-btn accent-gold" onclick="cfOpenIdCardModal('mine')">
            <span>🪪 IDカード</span>
          </button>
          <button class="cf-side-btn" onclick="cfOpenSecretaryPicker()">
            <span>🔄 秘書官変更</span>
          </button>
        </div>
      </div>

      <div class="cf-stage-voice-bar" onclick="cfTapSecretary()">
        <span id="cf-sec-voice-tag" class="cf-sec-vtag">${cfEsc(voice.tag)}</span>
        <div id="cf-sec-voice-text" class="cf-sec-vtxt">「${cfEsc(voice.text)}」</div>
      </div>
    `;
  } finally {
    setTimeout(() => { cfDomLock = false; }, 0);
  }
}

// =========================================================
// 3. 🪪 スクショ映え指揮官IDカード ＆ フレンド/掲示板共有システム
// =========================================================
function cfBuildMyCardPayload() {
  cfEnsureState();
  const secId = state.secretaryCharId || "protagonist";
  const secLv = Number(state.charLevels?.[secId] || 1);
  const secDupe = window.MF_LIMIT_BREAK?.getDupeCount ? window.MF_LIMIT_BREAK.getDupeCount(secId) : 0;
  const secBond = cfGetBondLvSafe(secId);
  const party = (state.party || ["protagonist"]).slice(0, 4);
  const totalPower = party.reduce((s, id) => s + (typeof calcCharPower === "function" ? calcCharPower(id) : 400), 0);
  const maxCharLv = Math.max(1, ...Object.values(state.charLevels || { protagonist: 1 }).map(Number));
  const bondMap = state.bonds || state.bondPoints || state.charBonds || {};
  const bondMaxCnt = Object.values(bondMap).filter(v => Number(v || 0) >= 100).length;
  const cardCnt = Object.values(state.ownedCards || {}).filter(v => Number(v || 0) > 0).length;

  return {
    v: 1,
    n: String(state.playerName || "第7小隊・隊長").slice(0, 14),
    t: String(state.activeTitle || "第7小隊・新任隊長").slice(0, 22),
    c: String(state.commanderCode || "MF-0000-0000"),
    r: Number(state.playerRank || 1),
    p: Math.round(totalPower),
    ml: maxCharLv,
    s: secId,
    sl: secLv,
    sd: secDupe,
    sb: secBond,
    st: String(state.styleId || "m_cool"),
    pe: String(typeof getCharProfile === "function" ? (getCharProfile("protagonist")?.element || "fire") : "fire"),
    sq: party,
    w: Number(state.arenaWins || 0),
    t3: Number(state.achStats?.tier3Clears || 0),
    t4: Number(state.achStats?.tier4Clears || 0),
    b5: bondMaxCnt,
    cd: cardCnt,
    cm: String(state.commanderBio || "").slice(0, 40)
  };
}

function cfEncodeCard(obj) {
  const bytes = new TextEncoder().encode(JSON.stringify(obj));
  let bin = "";
  bytes.forEach(b => { bin += String.fromCharCode(b); });
  return "MFCARD:" + btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function cfDecodeCard(rawText) {
  const m = String(rawText || "").match(/MFCARD:([A-Za-z0-9_-]+)/) || String(rawText || "").match(/idcard=([A-Za-z0-9_-]+)/);
  if (!m) return null;
  try {
    let b64 = m[1].replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const obj = JSON.parse(new TextDecoder().decode(bytes));
    if (!obj || !obj.n || !obj.c) return null;
    return obj;
  } catch (_) {
    return null;
  }
}

function cfRenderIdCardPlateHtml(card, isForeign = false) {
  const chars = window.MF_DATA?.CHARACTERS || {};
  const isProtagSec = card.s === "protagonist";
  const secChar = isProtagSec
    ? { id: "protagonist", name: card.n, rarity: "SR", element: card.pe || "fire", isProtagonist: true, styleId: card.st || "m_cool", emoji: "🧑‍✈️" }
    : (chars[card.s] || { id: card.s || "aoi", name: "アオイ", rarity: "SR", element: "water", emoji: "🛡️" });
  const el = window.MF_DATA?.ELEMENTS?.[secChar.element] || { icon: "✨", name: "煌", color: "#f3cf00" };
  const portrait = window.MF_SPRITES?.portraitHTML
    ? window.MF_SPRITES.portraitHTML(secChar, "contain")
    : `<div style="font-size:64px;">${secChar.emoji || "👤"}</div>`;

  const sqIds = Array.isArray(card.sq) ? card.sq.slice(0, 4) : ["protagonist"];
  const elCounts = {};
  sqIds.forEach(id => {
    const elId = id === "protagonist" ? (card.pe || "fire") : (chars[id]?.element || "arc");
    elCounts[elId] = (elCounts[elId] || 0) + 1;
  });
  const resBadges = [];
  Object.keys(elCounts).forEach(k => { if (elCounts[k] >= 2 && CF_RESONANCE_META[k]) resBadges.push(`${CF_RESONANCE_META[k].icon}${CF_RESONANCE_META[k].name}`); });
  if (sqIds.length >= 4 && Object.keys(elCounts).length >= 4) resBadges.push("🌈四極調和");

  const stars = "★".repeat(Math.min(5, card.sd || 0)) + "☆".repeat(Math.max(0, 5 - (card.sd || 0)));

  return `
    <div class="cf-idcard-plate">
      <div class="cf-id-hazard"></div>
      <div class="cf-id-grid"></div>

      <div class="cf-id-top">
        <span class="ef-code">MIASMA FRONTIER // OPERATOR PASS</span>
        <span class="cf-id-serial">${cfEsc(card.c)}</span>
      </div>

      <div class="cf-id-main">
        <div class="cf-id-art-frame">
          ${portrait}
          <div class="cf-id-sec-cap">
            <span>${el.icon} ${cfEsc(secChar.name)}</span>
            <small>Lv.${card.sl || 1} ${stars} ${isProtagSec ? "👑隊長" : `💞${card.sb || 1}`}</small>
          </div>
        </div>

        <div class="cf-id-info">
          <div class="cf-id-title-pill">🏅 ${cfEsc(card.t)}</div>
          <div class="cf-id-name">${cfEsc(card.n)}</div>
          <div class="cf-id-sub-meta">
            <span>開拓 <strong>Lv.${card.r}</strong></span>
            <span>小隊戦力 <strong>${Number(card.p || 0).toLocaleString()}</strong></span>
          </div>

          <div class="cf-id-metrics">
            <div class="cf-id-m"><span>最高Lv</span><strong>Lv.${card.ml || 1}</strong></div>
            <div class="cf-id-m"><span>終焉/災厄</span><strong>${card.t4 || 0} / ${card.t3 || 0}</strong></div>
            <div class="cf-id-m"><span>対人勝利</span><strong>${card.w || 0}勝</strong></div>
            <div class="cf-id-m"><span>絆MAX/札</span><strong>${card.b5 || 0}名 / ${card.cd || 0}</strong></div>
          </div>

          <div class="cf-id-bio">「${cfEsc(card.cm || "第7クリアラー小隊、前線開拓中！")}」</div>
        </div>
      </div>

      <div class="cf-id-squad-row">
        <div class="cf-id-squad-icons">
          ${sqIds.map(id => {
            const c = id === "protagonist"
              ? { id: "protagonist", name: card.n, emoji: "🧑‍✈️", isProtagonist: true, styleId: card.st || "m_cool" }
              : (chars[id] || { id, name: id, emoji: "👤" });
            return window.MF_SPRITES?.portraitHTML ? window.MF_SPRITES.portraitHTML(c, "icon") : `<span>${c.emoji}</span>`;
          }).join("")}
        </div>
        <div class="cf-id-res-tags">
          ${resBadges.length ? resBadges.map(b => `<span>${b}</span>`).join("") : `<span>SQUAD READY</span>`}
        </div>
      </div>

      <div class="cf-id-footer">
        <span>AUTH // ${isForeign ? "VISITOR RECORD" : "VERIFIED COMMANDER"}</span>
        <span class="cf-barcode">||| || ||| | |||| || |</span>
      </div>
    </div>
  `;
}

function cfCopyText(txt, msg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(txt).then(() => showToast(msg)).catch(() => prompt("以下をコピーしてください：", txt));
  } else {
    prompt("以下をコピーしてください：", txt);
  }
}

function cfCopyMyCardUrl() {
  const code = cfEncodeCard(cfBuildMyCardPayload());
  const raw = code.replace(/^MFCARD:/, "");
  const url = `${window.location.origin}${window.location.pathname}?idcard=${raw}`;
  cfCopyText(`🪪『ミアズマ・フロンティア』私の指揮官IDカードです！開くとプロフィールが見られます✨\n${url}`, "🔗 共有リンクをコピーしました！友達へ送れます");
}

function cfCopyMyCardForBoard() {
  const p = cfBuildMyCardPayload();
  const code = cfEncodeCard(p);
  cfCopyText(`🪪【指揮官名刺】${p.n}（開拓Lv.${p.r} / 戦力${p.p}）よろしくお願いします！\n${code}`, "📋 掲示板貼り付け用の名刺テキストをコピーしました！");
}

function cfEditCommanderBio() {
  cfEnsureState();
  const next = prompt("IDカードのひとことコメントを入力（40文字以内）：", state.commanderBio || "");
  if (next === null) return;
  state.commanderBio = next.trim().slice(0, 40) || "第7クリアラー小隊、前線開拓中！";
  if (typeof saveGame === "function") saveGame();
  if (typeof playSfx === "function") playSfx("gift");
  cfRenderIdCardModal();
  showToast("✏️ IDカードのコメントを更新しました！");
}

function cfOpenPhotoMode(isForeign = false) {
  const card = isForeign && cfViewingForeignCard ? cfViewingForeignCard : cfBuildMyCardPayload();
  let ov = document.getElementById("cf-photo-overlay");
  if (!ov) {
    ov = document.createElement("div");
    ov.id = "cf-photo-overlay";
    ov.className = "cf-photo-overlay";
    ov.onclick = () => ov.classList.remove("active");
    document.body.appendChild(ov);
  }
  ov.innerHTML = `
    <div style="width:100%; max-width:410px; padding:12px;">
      ${cfRenderIdCardPlateHtml(card, isForeign)}
      <div style="margin-top:12px; font-size:10.5px; color:rgba(255,255,255,0.65); text-align:center; font-family:monospace;">
        📸 SCREENSHOT MODE // タップで元の画面へ戻る
      </div>
    </div>
  `;
  ov.classList.add("active");
  if (typeof playSfx === "function") playSfx("switch");
}

function cfSaveForeignCardToBook(cardObj) {
  cfEnsureState();
  if (!cardObj || !cardObj.c) return;
  const list = state.friendIdCards;
  const idx = list.findIndex(x => x.c === cardObj.c);
  const stamped = { ...cardObj, savedAt: Date.now() };
  if (idx >= 0) list[idx] = stamped;
  else list.unshift(stamped);
  if (list.length > 30) list.length = 30;
  if (typeof saveGame === "function") saveGame();
  if (typeof playSfx === "function") playSfx("gift");
  showToast(`📒 ${cardObj.n} のIDカードを名刺帳へ保存しました！`);
  cfRenderIdCardModal();
}

function cfDeleteForeignCard(serial) {
  cfEnsureState();
  state.friendIdCards = state.friendIdCards.filter(x => x.c !== serial);
  if (typeof saveGame === "function") saveGame();
  cfRenderIdCardModal();
}

function cfOpenForeignCardModal(rawOrObj) {
  const card = typeof rawOrObj === "string" ? cfDecodeCard(rawOrObj) : rawOrObj;
  if (!card) {
    showToast("名刺コードまたは共有URLを正しく読み取れませんでした");
    return;
  }
  cfViewingForeignCard = card;
  cfActiveIdCardTab = "lookup";
  cfOpenIdCardModal("lookup");
}

function cfOpenIdCardModal(tab = "mine") {
  cfEnsureState();
  cfActiveIdCardTab = tab;
  if (tab === "mine") cfViewingForeignCard = null;
  let modal = document.getElementById("modal-cf-idcard");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-cf-idcard";
    modal.className = "modal-overlay";
    modal.style.zIndex = "1550";
    modal.onclick = () => modal.classList.remove("active");
    document.body.appendChild(modal);
  }
  cfRenderIdCardModal();
  modal.classList.add("active");
  if (typeof playSfx === "function") playSfx("switch");
}

function cfRenderIdCardModal() {
  const modal = document.getElementById("modal-cf-idcard");
  if (!modal) return;
  cfEnsureState();

  let bodyHtml = "";
  if (cfActiveIdCardTab === "mine") {
    const myCard = cfBuildMyCardPayload();
    bodyHtml = `
      ${cfRenderIdCardPlateHtml(myCard, false)}
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:9px;">
        <button class="btn-accent2" style="padding:9px 4px; font-size:11px;" onclick="cfOpenPhotoMode(false)">📸 スクショ専用表示</button>
        <button class="btn-primary" style="padding:9px 4px; font-size:11px;" onclick="cfCopyMyCardUrl()">🔗 友達へ共有リンク</button>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:6px;">
        <button class="btn-xs" style="padding:7px;" onclick="cfCopyMyCardForBoard()">💬 掲示板用コードコピー</button>
        <button class="btn-xs" style="padding:7px;" onclick="cfEditCommanderBio()">✏️ ひとこと編集</button>
      </div>
      <div style="font-size:10px; color:var(--muted); margin-top:7px; text-align:left; line-height:1.45;">
        ※共有リンクを送ると友達があなたのIDカードを見られます。『掲示板用コード』をゲーム内掲示板へ貼ると、他の全員がワンタップであなたの名刺を見られます！
      </div>
    `;
  } else if (cfActiveIdCardTab === "book") {
    const list = state.friendIdCards || [];
    bodyHtml = list.length === 0 ? `
      <div style="text-align:center; padding:22px 10px; background:var(--surface-sub); border-radius:12px;">
        <div style="font-size:36px; margin-bottom:6px;">📒</div>
        <strong style="font-size:13px;">まだフレンドの名刺がありません</strong>
        <p style="font-size:11px; color:var(--muted); margin:5px 0 10px;">友達の共有URLを開くか、掲示板の『🪪 IDカードを見る』から保存できます！</p>
        <button class="btn-primary" onclick="cfActiveIdCardTab='lookup'; cfRenderIdCardModal();">🔍 コードから読み込む</button>
      </div>
    ` : `
      <div style="display:flex; flex-direction:column; gap:7px; max-height:56dvh; overflow-y:auto;">
        ${list.map(fc => `
          <div class="cf-book-row">
            <div style="flex:1; min-width:0; text-align:left;">
              <strong style="font-size:12px;">🪪 ${cfEsc(fc.n)} <small style="opacity:0.75;">(開拓Lv.${fc.r})</small></strong>
              <div style="font-size:10px; color:var(--muted);">🏅 ${cfEsc(fc.t)} ｜ 戦力 ${Number(fc.p || 0).toLocaleString()}</div>
            </div>
            <button class="btn-xs btn-primary" onclick="cfOpenForeignCardModal(state.friendIdCards.find(x=>x.c==='${cfEsc(fc.c)}'))">見る</button>
            <button class="btn-xs" onclick="cfDeleteForeignCard('${cfEsc(fc.c)}')">✕</button>
          </div>
        `).join("")}
      </div>
    `;
  } else {
    const fc = cfViewingForeignCard;
    bodyHtml = `
      <div style="display:flex; gap:5px; margin-bottom:8px;">
        <input id="cf-lookup-input" type="text" placeholder="MFCARD:... または 共有URLを貼付" style="flex:1; font-size:11px;" />
        <button class="btn-xs btn-primary" onclick="cfOpenForeignCardModal(document.getElementById('cf-lookup-input').value)">読込</button>
      </div>
      ${fc ? `
        ${cfRenderIdCardPlateHtml(fc, true)}
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:8px;">
          <button class="btn-primary" style="padding:9px 4px; font-size:11px;" onclick="cfSaveForeignCardToBook(cfViewingForeignCard)">📒 名刺帳へ保存</button>
          <button class="btn-accent2" style="padding:9px 4px; font-size:11px;" onclick="cfOpenPhotoMode(true)">📸 拡大表示</button>
        </div>
      ` : `
        <div style="font-size:11px; color:var(--muted); padding:16px 8px; background:var(--surface-sub); border-radius:10px;">
          友達から送られた共有URLや、掲示板の <code>MFCARD:...</code> コードを上の欄に貼って『読込』を押すと、相手の指揮官IDカードを表示できます。
        </div>
      `}
    `;
  }

  const bookCnt = (state.friendIdCards || []).length;
  modal.innerHTML = `
    <div class="modal-box" onclick="event.stopPropagation()" style="max-height:88dvh; overflow-y:auto;">
      <div class="top-row" style="margin-bottom:7px;">
        <strong style="font-size:14px;">🪪 指揮官IDカード</strong>
        <button class="btn-xs" onclick="document.getElementById('modal-cf-idcard').classList.remove('active')">閉じる ✕</button>
      </div>
      <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:4px; margin-bottom:8px;">
        <button class="btn-xs ${cfActiveIdCardTab === "mine" ? "btn-primary" : ""}" style="padding:6px 2px; font-size:10px;" onclick="cfActiveIdCardTab='mine'; playSfx('tap'); cfRenderIdCardModal();">🪪 自分の名刺</button>
        <button class="btn-xs ${cfActiveIdCardTab === "book" ? "btn-primary" : ""}" style="padding:6px 2px; font-size:10px;" onclick="cfActiveIdCardTab='book'; playSfx('tap'); cfRenderIdCardModal();">📒 名刺帳(${bookCnt})</button>
        <button class="btn-xs ${cfActiveIdCardTab === "lookup" ? "btn-primary" : ""}" style="padding:6px 2px; font-size:10px;" onclick="cfActiveIdCardTab='lookup'; playSfx('tap'); cfRenderIdCardModal();">🔍 読込/閲覧</button>
      </div>
      ${bodyHtml}
    </div>
  `;
}

function cfRenderAllBars() {
  cfRenderHomeWidgets();
  if (typeof state === "undefined" || !state) return;
  cfEnsureState();
  const res = cfCalcResonance(state.party);

  cfDomLock = true;
  try {
    const selPanel = document.getElementById("btl-select-panel");
    if (selPanel) {
      let bar = document.getElementById("cf-battle-res-bar");
      if (!bar) {
        bar = document.createElement("div");
        bar.id = "cf-battle-res-bar";
        bar.className = "cf-res-inline-bar";
        const rh = document.getElementById("rh-entry-battle");
        if (rh && rh.parentNode === selPanel) selPanel.insertBefore(bar, rh.nextSibling);
        else selPanel.prepend(bar);
      }
      const lbl = res.active.length
        ? res.active.map(r => `${r.icon}${r.name}`).join(" / ")
        : "元素共鳴：未発動（同属性×2 or 4属性で発動）";
      bar.innerHTML = `
        <div style="font-size:10.5px; font-weight:900; text-align:left; flex:1; min-width:0;">⚡ ${cfEsc(lbl)}</div>
        <button class="btn-xs btn-primary" style="flex-shrink:0;" onclick="cfOpenPresetModal()">小隊プリセット</button>
      `;
    }

    ["view-board", "view-friends"].forEach(vid => {
      const sec = document.getElementById(vid);
      if (!sec) return;
      const bid = `cf-card-bar-${vid}`;
      let bar = document.getElementById(bid);
      if (!bar) {
        bar = document.createElement("div");
        bar.id = bid;
        bar.className = "cf-res-inline-bar";
        const card = sec.querySelector(".card");
        if (card) card.prepend(bar);
        else sec.prepend(bar);
      }
      bar.innerHTML = `
        <span style="font-size:10.5px; font-weight:900;">🪪 指揮官IDカード共有</span>
        <div style="display:flex; gap:4px;">
          <button class="btn-xs btn-accent2" onclick="cfCopyMyCardForBoard()">📋 貼付コピー</button>
          <button class="btn-xs btn-primary" onclick="cfOpenIdCardModal('mine')">🪪 見る/名刺帳</button>
        </div>
      `;
    });
  } finally {
    setTimeout(() => { cfDomLock = false; }, 0);
  }
}

function cfEnhanceBoardCardLinks() {
  const board = document.getElementById("view-board");
  if (!board) return;
  cfDomLock = true;
  try {
    const candidates = board.querySelectorAll("div, p, li, article");
    candidates.forEach(el => {
      if (el.dataset.mfCardParsed || el.children.length > 4) return;
      const txt = el.textContent || "";
      const m = txt.match(/MFCARD:[A-Za-z0-9_-]+/);
      if (!m) return;
      const parsed = cfDecodeCard(m[0]);
      if (!parsed) return;
      el.dataset.mfCardParsed = "1";

      const btn = document.createElement("button");
      btn.className = "btn-xs btn-accent2 cf-board-card-btn";
      btn.textContent = `🪪 ${parsed.n}（開拓Lv.${parsed.r}）のIDカードを見る`;
      btn.onclick = (ev) => { ev.stopPropagation(); cfOpenForeignCardModal(parsed); };
      el.appendChild(btn);
    });
  } finally {
    setTimeout(() => { cfDomLock = false; }, 0);
  }
}

// ---------- 🔗 安全フック ----------
(function installCommanderHooks() {
  // 既存の画像拡大呼び出しもすべて「自由移動＆ピンチズーム版」へ統一
  window.openPortraitZoom = function(charId) {
    cfOpenFreeZoom(charId);
  };

  if (typeof window.startBattle === "function" && !window.startBattle._cfHooked) {
    const origStart = window.startBattle;
    window.startBattle = function() {
      const r = origStart.apply(this, arguments);
      cfApplyBattleResonance();
      return r;
    };
    window.startBattle._cfHooked = true;
  }

  if (typeof window.resolveSingleCard === "function" && !window.resolveSingleCard._cfHooked) {
    const origResolve = window.resolveSingleCard;
    window.resolveSingleCard = function(card, isThirdChain) {
      const prevStag = typeof btl !== "undefined" && btl ? btl.stagger : 0;
      const prevEx = typeof btl !== "undefined" && btl ? btl.exGauge : 0;
      const r = origResolve.apply(this, arguments);
      if (typeof btl !== "undefined" && btl && !btl.finished && btl.resonance?.mods) {
        const mods = btl.resonance.mods;
        if (mods.staggerPct > 0 && card?.power && !btl.stunned && btl.stagger > prevStag) {
          const extraS = Math.max(1, Math.round((btl.stagger - prevStag) * (mods.staggerPct / 100)));
          btl.stagger = Math.min(btl.maxStagger, btl.stagger + extraS);
        }
        if (mods.exGainPct > 0 && !card?.isUlt && btl.exGauge > prevEx && btl.exGauge < 100) {
          const extraE = Math.max(1, Math.round((btl.exGauge - prevEx) * (mods.exGainPct / 100)));
          btl.exGauge = Math.min(99, btl.exGauge + extraE);
        }
      }
      return r;
    };
    window.resolveSingleCard._cfHooked = true;
  }

  if (typeof window.renderBattleHUD === "function" && !window.renderBattleHUD._cfHooked) {
    const origHud = window.renderBattleHUD;
    window.renderBattleHUD = function() {
      if (typeof btl !== "undefined" && btl && !btl.finished && btl.resonance?.mods?.turnHealPct > 0) {
        if (btl.turn > (btl._cfResTurn || 1)) {
          btl._cfResTurn = btl.turn;
          const heal = Math.round(btl.teamMaxHp * (btl.resonance.mods.turnHealPct / 100));
          btl.teamHp = Math.min(btl.teamMaxHp, btl.teamHp + heal);
          if (typeof pushBattleLog === "function") pushBattleLog(`💧 蒼海の共鳴：小隊HP +${heal.toLocaleString()} 自然回復！`);
        }
      }
      return origHud.apply(this, arguments);
    };
    window.renderBattleHUD._cfHooked = true;
  }

  // reward_hub のバッジ更新時にもホーム右側のボタンバッジを自動同期
  if (window.MF_REWARD_HUB?.renderEntryBanners && !window.MF_REWARD_HUB._cfHooked) {
    const origRh = window.MF_REWARD_HUB.renderEntryBanners;
    window.MF_REWARD_HUB.renderEntryBanners = function() {
      const r = origRh.apply(this, arguments);
      cfRenderHomeWidgets();
      return r;
    };
    window.MF_REWARD_HUB._cfHooked = true;
  }

  if (typeof window.switchView === "function" && !window.switchView._cfHooked) {
    const origSwitch = window.switchView;
    window.switchView = function() {
      const r = origSwitch.apply(this, arguments);
      setTimeout(() => {
        cfRenderAllBars();
        cfEnhanceBoardCardLinks();
      }, 45);
      return r;
    };
    window.switchView._cfHooked = true;
  }

  let obsTimer = null;
  const obs = new MutationObserver(() => {
    if (cfDomLock) return;
    clearTimeout(obsTimer);
    obsTimer = setTimeout(() => {
      cfEnhanceBoardCardLinks();
      const home = document.getElementById("view-home");
      if (home && home.classList.contains("active")) cfHideLegacyHomeStages(home);
    }, 120);
  });

  const boot = () => {
    setTimeout(() => {
      cfRenderAllBars();
      if (document.body) obs.observe(document.body, { childList: true, subtree: true });

      try {
        const params = new URLSearchParams(window.location.search);
        const raw = params.get("idcard");
        if (raw) {
          const card = cfDecodeCard("MFCARD:" + raw);
          if (card) setTimeout(() => cfOpenForeignCardModal(card), 900);
        }
      } catch (_) {}
    }, 260);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

window.MF_COMMANDER = {
  calcResonance: cfCalcResonance,
  openPresetModal: cfOpenPresetModal,
  openIdCardModal: cfOpenIdCardModal,
  openSecretaryPicker: cfOpenSecretaryPicker,
  openFreeZoom: cfOpenFreeZoom,
  renderAllBars: cfRenderAllBars
};
window.cfTapSecretary = cfTapSecretary;
window.cfOpenSecretaryPicker = cfOpenSecretaryPicker;
window.cfSetSecretary = cfSetSecretary;
window.cfOpenFreeZoom = cfOpenFreeZoom;
window.cfCloseFreeZoom = cfCloseFreeZoom;
window.cfAdjustZoom = cfAdjustZoom;
window.cfResetZoom = cfResetZoom;
window.cfOpenPresetModal = cfOpenPresetModal;
window.cfRenderPresetModal = cfRenderPresetModal;
window.cfSaveCurrentToPreset = cfSaveCurrentToPreset;
window.cfApplyPreset = cfApplyPreset;
window.cfRenamePreset = cfRenamePreset;
window.cfTogglePresetMember = cfTogglePresetMember;
window.cfSetPresetDeck = cfSetPresetDeck;
window.cfOpenIdCardModal = cfOpenIdCardModal;
window.cfRenderIdCardModal = cfRenderIdCardModal;
window.cfOpenForeignCardModal = cfOpenForeignCardModal;
window.cfCopyMyCardUrl = cfCopyMyCardUrl;
window.cfCopyMyCardForBoard = cfCopyMyCardForBoard;
window.cfEditCommanderBio = cfEditCommanderBio;
window.cfOpenPhotoMode = cfOpenPhotoMode;
window.cfSaveForeignCardToBook = cfSaveForeignCardToBook;
window.cfDeleteForeignCard = cfDeleteForeignCard;
// =========================================================
// 📱 画面下部の空きスペース連動・タブレット重要ショートカット
// =========================================================
const CF_EXTRA_SHORTCUTS = [
  // 1段目（最重要・空き56px以上で表示）
  { label: "スカウト", icon: "🛰️", views: ["gacha", "scout"],        accent: "gold" },
  { label: "絆",       icon: "💞", views: ["bonds", "bond"],         accent: "pink", badgeFn: () => {
    if (typeof boGetOwnedBondChars === "function" && typeof boHasUnreadEp === "function") {
      return boGetOwnedBondChars().filter(c => boHasUnreadEp(c.id)).length;
    }
    return 0;
  }},
  { label: "ショップ", icon: "🏪", views: ["shop", "store"],         accent: "mint" },
  { label: "アリーナ", icon: "🏆", views: ["arena", "pvp"],          accent: "cyan" },
  // 2段目（空き118px以上で追加表示）
  { label: "任務",     icon: "📋", views: ["missions", "mission"],   accent: "mint" },
  { label: "キャンプ", icon: "🏕️", views: ["camp"],                  accent: "gold" },
  { label: "イベント", icon: "🎪", views: ["events", "event"],       accent: "pink" },
  { label: "掲示板",   icon: "💬", views: ["board", "bbs"],          accent: "cyan" }
];

function cfResolveExistingView(candidates) {
  for (const id of candidates) {
    if (document.getElementById(`view-${id}`)) return id;
  }
  return candidates[0];
}

function cfOpenExtraShortcut(viewId) {
  if (typeof playSfx === "function") playSfx("tap");
  if (typeof switchView === "function") switchView(viewId);
}

function cfUpdateHomeExtraDock() {
  const home = document.getElementById("view-home");
  if (!home || !home.classList.contains("active")) return;

  cfDomLock = true;
  try {
    let dock = document.getElementById("cf-home-extra-dock");
    if (!dock) {
      dock = document.createElement("div");
      dock.id = "cf-home-extra-dock";
      dock.className = "cf-extra-dock";
      home.appendChild(dock);
    }

    // 自分自身を一旦隠して、既存ホームUIの最下端と画面下端の空きスペースを正確に計測
    dock.style.display = "none";

    let maxBottom = 0;
    home.querySelectorAll("#cf-home-main-stage, .home-play-row, .home-main-dock").forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.height > 0 && rect.bottom > maxBottom) maxBottom = rect.bottom;
    });

    const viewportH = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    const freePx = Math.floor(viewportH - maxBottom - 10);

    // 機種ごとの空きスペースに応じて 0段 / 1段(4個) / 2段(8個) を自動決定
    const rows = freePx >= 118 ? 2 : (freePx >= 56 ? 1 : 0);
    if (rows === 0) {
      dock.style.display = "none";
      return;
    }

    const available = CF_EXTRA_SHORTCUTS
      .map(item => ({ ...item, targetView: cfResolveExistingView(item.views) }))
      .filter(item => document.getElementById(`view-${item.targetView}`));

    const shown = available.slice(0, rows * 4);
    if (!shown.length) {
      dock.style.display = "none";
      return;
    }

    dock.innerHTML = `
      <div class="cf-extra-dock-label">QUICK ACCESS // タブレット主要機能</div>
      <div class="cf-extra-dock-grid">
        ${shown.map(item => {
          const badge = typeof item.badgeFn === "function" ? item.badgeFn() : 0;
          return `
            <button class="cf-extra-btn acc-${item.accent}" onclick="cfOpenExtraShortcut('${item.targetView}')">
              <span class="cf-extra-ico">${item.icon}</span>
              <span class="cf-extra-lbl">${cfEsc(item.label)}</span>
              ${badge > 0 ? `<b class="cf-extra-badge">${badge}</b>` : ""}
            </button>
          `;
        }).join("")}
      </div>
    `;
    dock.style.display = "block";
  } finally {
    setTimeout(() => { cfDomLock = false; }, 0);
  }
}

window.cfOpenExtraShortcut = cfOpenExtraShortcut;
window.cfUpdateHomeExtraDock = cfUpdateHomeExtraDock;

// ホーム描画・リサイズ・画面回転時に自動で空きスペースを再計算
(function hookHomeExtraDock() {
  const schedule = () => {
    requestAnimationFrame(() => cfUpdateHomeExtraDock());
    setTimeout(() => cfUpdateHomeExtraDock(), 160);
  };

  if (typeof window.cfRenderHomeWidgets === "function" && !window.cfRenderHomeWidgets._extraHooked) {
    const orig = window.cfRenderHomeWidgets;
    window.cfRenderHomeWidgets = function() {
      const r = orig.apply(this, arguments);
      schedule();
      return r;
    };
    window.cfRenderHomeWidgets._extraHooked = true;
  }

  window.addEventListener("resize", schedule);
  window.addEventListener("orientationchange", schedule);
  setTimeout(schedule, 420);
})();
