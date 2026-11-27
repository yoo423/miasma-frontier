const PRESET_FRIENDS = [
  { id: "npc_lunaria", name: "ルナリア（公認フレンド）", rank: 8, power: 420, lead: "lunaria", party: ["lunaria", "kaede", "koharu", "momo"], deck: ["crimson_flare", "shield_breaker", "element_boost", "counter_stance", "blaze_slash", "camp_ration", "tactical_draw", "magma_crush"] },
  { id: "npc_mikoto",  name: "ミコト（公認フレンド）",   rank: 10, power: 520, lead: "mikoto",  party: ["mikoto", "valeria", "leila", "fiona"],  deck: ["frost_seal", "mirror_aegis", "ice_pike", "tidal_surge", "sanctuary_bell", "hydro_splash", "aqua_barrier", "crystal_focus"] },
  { id: "npc_celestia",name: "セレスティア（公認）",     rank: 14, power: 680, lead: "celestia",party: ["celestia", "sylphy", "chloe", "melissa"],deck: ["ssr_storm_break", "chain_spark", "sniper_lock", "tempest_dance", "prism_counter", "overclock_link", "plasma_lance", "volt_battery"] }
];

function getMyFriendCode() {
  const payload = {
    n: state.playerName,
    r: state.playerRank || 1,
    pw: state.party.reduce((s, id) => s + calcCharPower(id), 0),
    p: state.party.slice(0, 4),
    d: (state.tacticDeck || window.MF_CARDS.DEFAULT_TACTIC_DECK).slice(0, 8)
  };
  const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  return `MF-${b64}`;
}

function decodeFriendCode(raw) {
  try {
    const clean = String(raw || "").trim().replace(/^MF-/, "");
    const obj = JSON.parse(decodeURIComponent(escape(atob(clean))));
    if (!obj || !obj.n || !Array.isArray(obj.p)) return null;
    return {
      id: `fr_${Date.now()}_${Math.floor(Math.random() * 999)}`,
      name: String(obj.n).slice(0, 14),
      rank: Number(obj.r) || 1,
      power: Number(obj.pw) || 200,
      lead: obj.p[0] || "protagonist",
      party: obj.p.slice(0, 4),
      deck: Array.isArray(obj.d) ? obj.d : [...window.MF_CARDS.DEFAULT_TACTIC_DECK]
    };
  } catch (e) {
    return null;
  }
}

function copyMyFriendCode() {
  const code = getMyFriendCode();
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      playSfx("gift");
      showToast("📋 自分のフレンドコードをコピーしました！友達に送ろう！");
    }).catch(() => prompt("このコードをコピーして友達に送ってください：", code));
  } else {
    prompt("このコードをコピーして友達に送ってください：", code);
  }
}

function addFriendByInput() {
  const input = document.getElementById("fr-code-input");
  const parsed = decodeFriendCode(input.value);
  if (!parsed) { showToast("⚠️ 無効なフレンドコードです（MF-から始まるコードを入力）"); return; }
  state.friends = state.friends || [];
  if (state.friends.length >= 20) { showToast("フレンド上限（20人）に達しています"); return; }
  if (state.friends.some(f => f.name === parsed.name)) { showToast("すでにフレンド登録されています！"); return; }

  state.friends.push(parsed);
  saveGame();
  playSfx("gift");
  input.value = "";
  renderFriendsView();
  showToast(`🤝 ${parsed.name} をフレンド登録しました！`);
}

function addPresetFriends() {
  state.friends = state.friends || [];
  let added = 0;
  PRESET_FRIENDS.forEach(pf => {
    if (!state.friends.some(f => f.id === pf.id)) {
      state.friends.push({ ...pf });
      added += 1;
    }
  });
  saveGame();
  playSfx("gift");
  renderFriendsView();
  showToast(added > 0 ? `🤝 公認フレンドを ${added}人 追加しました！` : "公認フレンドは全員登録済みです");
}

function removeFriend(idx) {
  if (!confirm("このフレンドをリストから外しますか？")) return;
  state.friends.splice(idx, 1);
  saveGame();
  playSfx("tap");
  renderFriendsView();
}

function claimDailyFriendGift() {
  const list = state.friends || [];
  if (list.length === 0) { showToast("まずはフレンドを1人以上登録しましょう！"); return; }
  const today = typeof getTodayKey === "function" ? getTodayKey() : new Date().toISOString().slice(0, 10);
  if (state.friendGiftKey === today) { showToast("本日のフレンド応援ギフトは受取済みです！"); return; }

  const tkGain = Math.min(5, Math.max(1, list.length));
  const crGain = list.length * 1000;
  state.friendGiftKey = today;
  state.cardTickets = (state.cardTickets || 0) + tkGain;
  state.credits += crGain;
  saveGame();
  playSfx("gift");
  renderTopBar();
  renderFriendsView();
  showToast(`🎁 フレンド応援完了！🎟️パック券+${tkGain} / 🪙+${crGain.toLocaleString()}！`);
}

function challengeFriend(idx) {
  const fr = (state.friends || [])[idx];
  if (!fr) return;
  if (!isFeatureUnlocked("arena")) {
    showToast("🔒 フレンド模擬戦は第1章クリア（対人アリーナ解放後）に遊べます！");
    return;
  }
  startArenaMatch("friend", fr);
}

function renderFriendsView() {
  renderTopBar();
  state.friends = state.friends || [];
  const today = typeof getTodayKey === "function" ? getTodayKey() : new Date().toISOString().slice(0, 10);
  const gifted = state.friendGiftKey === today;

  document.getElementById("fr-my-code").textContent = getMyFriendCode();
  const giftBtn = document.getElementById("btn-fr-gift");
  if (giftBtn) {
    giftBtn.disabled = gifted || state.friends.length === 0;
    giftBtn.textContent = gifted ? "✅ 本日の応援ギフト受取済" : `🎁 フレンド全員に応援＆ギフト受取（🎟️+${Math.min(5, Math.max(1, state.friends.length))}）`;
  }

  document.getElementById("fr-count-title").textContent = `🤝 フレンド一覧（${state.friends.length} / 20人）`;
  if (state.friends.length === 0) {
    document.getElementById("fr-list").innerHTML = `<div style="font-size:12px; color:var(--muted); text-align:center; padding:12px;">まだフレンドがいません。上の「公認フレンドを追加」か友達のコード入力で登録しよう！</div>`;
    return;
  }

  document.getElementById("fr-list").innerHTML = state.friends.map((f, idx) => {
    const ch = window.MF_DATA.CHARACTERS[f.lead] || window.MF_DATA.CHARACTERS.lunaria;
    return `
      <div class="card" style="padding:9px; margin-bottom:7px;">
        <div style="display:flex; align-items:center; gap:9px;">
          ${window.MF_SPRITES.portraitHTML(ch, "icon")}
          <div style="flex:1; min-width:0;">
            <strong style="font-size:12.5px;">${escapeHtml(f.name)}</strong>
            <div style="font-size:10px; color:var(--muted);">開拓Lv.${f.rank} ｜ 小隊戦力 ${f.power}</div>
          </div>
          <div style="display:flex; gap:4px;">
            <button class="btn-xs btn-accent2" onclick="challengeFriend(${idx})">⚔️ 模擬戦</button>
            <button class="btn-xs" onclick="removeFriend(${idx})">✕</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}
