// =========================================================
// 🎓 ミアズマ・フロンティア チュートリアル（自動生成安全版）
// =========================================================
let tutStepIdx = 0;
let tutIsReplay = false;
let tutPendingAfterLogin = false;
let tutPracticeActive = false;
let tutBattleStepDone = false;

const HOME_TUTORIAL_STEPS = [
  {
    badge: "STEP 1 / 5",
    title: "ようこそ第7クリアラー小隊へ！",
    highlight: ".top-bar",
    speakerText: "着任おめでとうございます、隊長！副官のアオイです。まずは画面一番上の『ステータスバー』の見方からご案内しますね。",
    bodyHtml: `
      <div class="tut-box">
        <div>⚡ <strong>EN</strong>：作戦や討伐に使うスタミナ（溢れた分も予備ENに自動貯蓄）</div>
        <div>💎 <strong>結晶石</strong>：隊員スカウトやショップで使用</div>
        <div>🎟️ <strong>パック券</strong>：戦術カードガチャ専用のチケット</div>
        <div>💬📢🏕️🔊：<strong>掲示板・お知らせ・表示切替・サウンド</strong></div>
      </div>
    `
  },
  {
    badge: "STEP 2 / 5",
    title: "基本の進め方（物語 ＆ 育成）",
    highlight: ".home-play-row",
    speakerText: "最初は『📖 物語・開拓へ』から第1章を進めましょう！物語を進めるだけでキャンプ・クラフト・対人戦などが次々と解放されます。",
    bodyHtml: `
      <div class="tut-box">
        <div>📖 <strong>物語・開拓へ</strong>：メインストーリー第1章からスタート！</div>
        <div>⚔️ <strong>討伐・育成</strong>：敵が強いと感じたら『📘 育成クエスト（初級）』で隊員のLv上げ＆昇格をしよう！</div>
      </div>
    `
  },
  {
    badge: "STEP 3 / 5",
    title: "バトルの極意：元素反応 ＆ 3連チェイン",
    highlight: "",
    speakerText: "戦闘はカードを選んで並べるだけですが、この3つのコツを知っていると火力が一気に跳ね上がりますよ！",
    bodyHtml: `
      <div class="tut-mini-grid">
        <div class="tut-mini-card">
          <strong>⚡ 元素反応</strong>
          <span>🔥×❄️ 融解 <b>2.2倍</b><br>🔥×💧 蒸発 <b>2.0倍</b><br>💧×❄️ 凍結 <b>行動不能</b></span>
        </div>
        <div class="tut-mini-card">
          <strong>💥 予兆への対処</strong>
          <span>🛡️装甲・⚡チャージには<br><b>【💥崩し】</b>で特効＆大削り！<br>💫ブレイク中は<b>与ダメ1.25倍</b></span>
        </div>
      </div>
      <div class="tut-box" style="margin-top:6px;">
        🔥 <strong>3連チェイン</strong>：プレイマットに<strong>3枚並べて発動</strong>すると、3枚目の威力が大幅UP＆必殺EXゲージが急上昇！
      </div>
    `
  },
  {
    badge: "STEP 4 / 5",
    title: "デッキ編成 ＆ 隊員カスタマイズ",
    highlight: ".home-main-dock",
    speakerText: "小隊4人の固定カード12枚に、お気に入りの戦術カードを8〜28枚加えて最大40枚の『マイデッキ』を組めます！",
    bodyHtml: `
      <div class="tut-box">
        <div>🃏 <strong>デッキ</strong>：最大5枠保存OK。『＋／−』ボタンで直感編成！</div>
        <div>🧑‍✈️ <strong>隊員</strong>：Lv強化・昇格・スキルツリー解放。<strong>隊長（あなた）は6属性＆8武器種をいつでも切替可能</strong>です！</div>
        <div>🗼 <strong>極限作戦</strong>：育ってきたら無限タワーや融光レイドに挑戦！</div>
      </div>
    `
  },
  {
    badge: "STEP 5 / 5",
    title: "作戦タブレット ＆ 準備完了！",
    highlight: ".home-main-dock",
    speakerText: "右下の『📱 タブレット』は横にスワイプできる2ページ式！スカウト・ログボ・任務・攻略Wiki・意見箱が全部入っています。",
    bodyHtml: `
      <div class="tut-reward-box">
        🎁 <strong>チュートリアル完了ボーナス</strong><br>
        💎 結晶石 ＋320 ／ 🎟️ 戦術パック券 ＋3
      </div>
      <div style="font-size:11px; color:var(--muted); margin-top:6px; line-height:1.45;">
        ※タブレット2ページ目の『⚙️ 端末設定』からいつでも見直せます。<br>
        支援コード欄に <strong>FRONTIER2026</strong> を入れるとリリース記念報酬も受け取れます！
      </div>
    `
  }
];

function ensureTutorialModal() {
  let modal = document.getElementById("modal-tutorial");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "modal-tutorial";
    modal.className = "modal-overlay";
    modal.style.zIndex = "1200";
    modal.innerHTML = `
      <div class="modal-box" onclick="event.stopPropagation()">
        <div class="top-row" style="margin-bottom:4px;">
          <span id="tut-step-badge" class="rank-pill" style="background:#ffd13b;">STEP 1 / 5</span>
          <button class="btn-xs" onclick="skipHomeTutorial()">スキップ ✕</button>
        </div>
        <h3 id="tut-step-title" style="margin:4px 0 6px; font-size:15px;">チュートリアル</h3>
        <div class="tut-guide-row">
          <div id="tut-guide-portrait"></div>
          <div style="flex:1; min-width:0;">
            <div style="font-size:10px; font-weight:900; color:var(--accent);">副官アオイ</div>
            <div id="tut-speech-text" style="font-size:11.5px; line-height:1.45; font-weight:800;"></div>
          </div>
        </div>
        <div id="tut-step-body"></div>
        <div id="tut-progress-dots" class="tablet-dots" style="margin:10px 0;"></div>
        <div id="tut-nav-row" style="display:grid; grid-template-columns:1fr 1.6fr; gap:8px;">
          <button id="btn-tut-prev" onclick="prevTutorialStep()">◀ 戻る</button>
          <button id="btn-tut-next" class="btn-primary" onclick="nextTutorialStep()">次へ ▶</button>
        </div>
        <div id="tut-end-actions" style="display:none; flex-direction:column; gap:7px;">
          <button class="btn-accent2" style="width:100%; padding:11px;" onclick="finishHomeTutorial(true)">⚔️ 模擬バトルで実戦練習する！</button>
          <button class="btn-primary" style="width:100%; padding:10px;" onclick="finishHomeTutorial(false)">🏕️ 拠点へ戻って冒険を始める</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  return modal;
}

function clearTutorialHighlight() {
  document.querySelectorAll(".tut-spotlight-ring").forEach(el => el.classList.remove("tut-spotlight-ring"));
}

function applyTutorialHighlight(selector) {
  clearTutorialHighlight();
  if (!selector) return;
  const el = document.querySelector(selector);
  if (el) el.classList.add("tut-spotlight-ring");
}

function startHomeTutorial(isReplay = false) {
  tutStepIdx = 0;
  tutIsReplay = !!isReplay;
  if (typeof switchView === "function") {
    const homeEl = document.getElementById("view-home");
    if (homeEl && !homeEl.classList.contains("active")) switchView("home");
  }
  const modal = ensureTutorialModal();
  modal.classList.add("active");
  if (typeof playSfx === "function") playSfx("switch");
  renderTutorialStep();
}

function renderTutorialStep() {
  const step = HOME_TUTORIAL_STEPS[tutStepIdx];
  if (!step) return;

  const aoi = (window.MF_DATA?.CHARACTERS?.aoi) || (typeof getCharProfile === "function" ? getCharProfile("protagonist") : { name: "アオイ", emoji: "🛡️" });
  const portraitEl = document.getElementById("tut-guide-portrait");
  if (portraitEl && window.MF_SPRITES) portraitEl.innerHTML = window.MF_SPRITES.portraitHTML(aoi, "icon-lg");

  const badgeEl = document.getElementById("tut-step-badge");
  const titleEl = document.getElementById("tut-step-title");
  const speechEl = document.getElementById("tut-speech-text");
  const bodyEl = document.getElementById("tut-step-body");
  if (badgeEl) badgeEl.textContent = step.badge;
  if (titleEl) titleEl.textContent = step.title;
  if (speechEl) speechEl.textContent = `「${step.speakerText}」`;
  if (bodyEl) bodyEl.innerHTML = step.bodyHtml;

  const dotsEl = document.getElementById("tut-progress-dots");
  if (dotsEl) {
    dotsEl.innerHTML = HOME_TUTORIAL_STEPS.map((_, i) =>
      `<span class="tb-dot ${i === tutStepIdx ? "active" : ""}" onclick="tutStepIdx=${i}; playSfx('tap'); renderTutorialStep();"></span>`
    ).join("");
  }

  const prevBtn = document.getElementById("btn-tut-prev");
  const endActions = document.getElementById("tut-end-actions");
  const navRow = document.getElementById("tut-nav-row");
  const isLast = tutStepIdx >= HOME_TUTORIAL_STEPS.length - 1;

  if (prevBtn) prevBtn.disabled = tutStepIdx === 0;
  if (navRow) navRow.style.display = isLast ? "none" : "grid";
  if (endActions) endActions.style.display = isLast ? "flex" : "none";

  applyTutorialHighlight(step.highlight);
}

function nextTutorialStep() {
  if (tutStepIdx < HOME_TUTORIAL_STEPS.length - 1) {
    tutStepIdx += 1;
    if (typeof playSfx === "function") playSfx("tap");
    renderTutorialStep();
  }
}

function prevTutorialStep() {
  if (tutStepIdx > 0) {
    tutStepIdx -= 1;
    if (typeof playSfx === "function") playSfx("tap");
    renderTutorialStep();
  }
}

function grantHomeTutorialRewardIfFirst() {
  if (typeof state === "undefined" || !state || state.tutorialDone) return false;
  state.tutorialDone = true;
  state.gems = (state.gems || 0) + 320;
  state.cardTickets = (state.cardTickets || 0) + 3;
  if (typeof saveGame === "function") saveGame();
  if (typeof renderTopBar === "function") renderTopBar();
  if (typeof playSfx === "function") playSfx("gift");
  if (typeof showToast === "function") showToast("🎓 チュートリアル完了！💎+320 / 🎟️パック券+3 獲得！");
  return true;
}

function finishHomeTutorial(launchPractice = false) {
  clearTutorialHighlight();
  const modal = document.getElementById("modal-tutorial");
  if (modal) modal.classList.remove("active");
  grantHomeTutorialRewardIfFirst();
  if (launchPractice) startTutorialPracticeBattle();
}

function skipHomeTutorial() {
  clearTutorialHighlight();
  const modal = document.getElementById("modal-tutorial");
  if (modal) modal.classList.remove("active");
  grantHomeTutorialRewardIfFirst();
}

function startTutorialPracticeBattle() {
  const firstEnemy = (window.MF_DATA?.ENEMIES || [])[0];
  if (!firstEnemy || typeof startBattle !== "function") {
    if (typeof showToast === "function") showToast("模擬戦の準備ができませんでした");
    return;
  }
  tutPracticeActive = true;
  tutBattleStepDone = false;
  if (typeof switchView === "function") switchView("battle");
  startBattle(firstEnemy.id, {
    questTitle: "🎓 【模擬戦】基本操作トレーニング",
    hpMult: 0.6,
    atkMult: 0.45,
    returnView: "home"
  });
}

// ---------- ⚔️ 初戦バトル実践コーチ ----------
function ensureBattleCoachEl() {
  const panel = document.getElementById("btl-arena-panel");
  if (!panel) return null;
  let el = document.getElementById("btl-tut-coach");
  if (!el) {
    el = document.createElement("div");
    el.id = "btl-tut-coach";
    el.className = "btl-tut-coach";
    const stage = document.getElementById("btl-stage");
    if (stage && stage.parentNode === panel) panel.insertBefore(el, stage);
    else panel.prepend(el);
  }
  return el;
}

function dismissBattleCoach() {
  const el = document.getElementById("btl-tut-coach");
  if (el) el.style.display = "none";
  tutPracticeActive = false;
  if (typeof state !== "undefined" && state && !state.battleTutorialDone) {
    state.battleTutorialDone = true;
    if (typeof saveGame === "function") saveGame();
  }
}

function updateBattleTutorialCoach(phase = "auto") {
  const curBtl = typeof btl !== "undefined" ? btl : null;
  const el = ensureBattleCoachEl();
  if (!el) return;

  const shouldShow = curBtl && !curBtl.finished && (!state?.battleTutorialDone || tutPracticeActive);
  if (!shouldShow || (curBtl.turn > 1 && tutBattleStepDone)) {
    el.style.display = "none";
    return;
  }

  let title = "";
  let msg = "";

  if (phase === "executed" || tutBattleStepDone) {
    tutBattleStepDone = true;
    let rewardMsg = "";
    if (typeof state !== "undefined" && state && !state.battleTutorialDone) {
      state.battleTutorialDone = true;
      state.cardTickets = (state.cardTickets || 0) + 2;
      if (typeof saveGame === "function") saveGame();
      if (typeof renderTopBar === "function") renderTopBar();
      rewardMsg = " 🎁実戦ボーナス：🎟️パック券+2獲得！";
    }
    title = "✨ ナイスチェイン！実戦ガイド完了";
    msg = `この調子で敵の予兆に合わせて【💥崩し】や【🛡️防御】を使い分けよう！${rewardMsg}`;
  } else if (curBtl.queue.length === 0) {
    title = "🎓 実践1/3：手札からカードを選ぼう";
    msg = "下のカードを『タップ』または『上へスワイプ』してプレイマットに置こう！";
  } else if (curBtl.queue.length < 3 && curBtl.ap > 0) {
    title = `🎓 実践2/3：あと${3 - curBtl.queue.length}枚並べて3連チェイン！`;
    msg = "別の属性を続けると『⚡元素反応』が炸裂！3枚置くと3枚目の威力が大幅UP！";
  } else {
    title = "🎓 実践3/3：チェインを発動しよう！";
    msg = "オレンジの『🔥 決定してチェイン発動！』ボタンを押して攻撃開始！";
  }

  el.style.display = "flex";
  el.innerHTML = `
    <div style="flex:1; min-width:0;">
      <strong style="font-size:11px; color:#ffd000; display:block;">${title}</strong>
      <div style="font-size:10.5px; color:#eef3ff; line-height:1.35;">${msg}</div>
    </div>
    <button class="btn-xs" style="flex-shrink:0;" onclick="dismissBattleCoach()">✕</button>
  `;
}

// グローバル公開（onclickから確実に呼べるように明示）
window.startHomeTutorial = startHomeTutorial;
window.nextTutorialStep = nextTutorialStep;
window.prevTutorialStep = prevTutorialStep;
window.finishHomeTutorial = finishHomeTutorial;
window.skipHomeTutorial = skipHomeTutorial;
window.dismissBattleCoach = dismissBattleCoach;
window.startTutorialPracticeBattle = startTutorialPracticeBattle;

(function installTutorialHooks() {
  if (typeof window.confirmProtagonist === "function" && !window.confirmProtagonist._tutHooked) {
    const origConfirm = window.confirmProtagonist;
    window.confirmProtagonist = function() {
      const wasUninit = typeof state !== "undefined" && state && !state.initialized;
      origConfirm.apply(this, arguments);
      if (wasUninit && typeof state !== "undefined" && state && state.initialized && !state.tutorialDone) {
        const loginModal = document.getElementById("modal-login-bonus");
        if (loginModal && loginModal.classList.contains("active")) tutPendingAfterLogin = true;
        else setTimeout(() => startHomeTutorial(false), 320);
      }
    };
    window.confirmProtagonist._tutHooked = true;
  }

  if (typeof window.closeLoginBonusModal === "function" && !window.closeLoginBonusModal._tutHooked) {
    const origCloseLogin = window.closeLoginBonusModal;
    window.closeLoginBonusModal = function() {
      origCloseLogin.apply(this, arguments);
      if (tutPendingAfterLogin && typeof state !== "undefined" && state && !state.tutorialDone) {
        tutPendingAfterLogin = false;
        setTimeout(() => startHomeTutorial(false), 260);
      }
    };
    window.closeLoginBonusModal._tutHooked = true;
  }

  if (typeof window.startBattle === "function" && !window.startBattle._tutHooked) {
    const origStart = window.startBattle;
    window.startBattle = function() {
      const r = origStart.apply(this, arguments);
      tutBattleStepDone = false;
      updateBattleTutorialCoach("start");
      return r;
    };
    window.startBattle._tutHooked = true;
  }

  ["selectHandCard", "removeQueueCard", "clearQueueCards"].forEach(fnName => {
    if (typeof window[fnName] === "function" && !window[fnName]._tutHooked) {
      const origFn = window[fnName];
      window[fnName] = function() {
        const r = origFn.apply(this, arguments);
        updateBattleTutorialCoach("queue");
        return r;
      };
      window[fnName]._tutHooked = true;
    }
  });

  if (typeof window.executeTurnQueue === "function" && !window.executeTurnQueue._tutHooked) {
    const origExec = window.executeTurnQueue;
    window.executeTurnQueue = function() {
      const hadCards = typeof btl !== "undefined" && btl && btl.queue.length > 0;
      const r = origExec.apply(this, arguments);
      if (hadCards) updateBattleTutorialCoach("executed");
      return r;
    };
    window.executeTurnQueue._tutHooked = true;
  }

  if (typeof window.exitBattleArena === "function" && !window.exitBattleArena._tutHooked) {
    const origExit = window.exitBattleArena;
    window.exitBattleArena = function() {
      tutPracticeActive = false;
      const el = document.getElementById("btl-tut-coach");
      if (el) el.style.display = "none";
      return origExit.apply(this, arguments);
    };
    window.exitBattleArena._tutHooked = true;
  }
})();
