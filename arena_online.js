// =========================================================
// 🏆 ステップ5：オンライン同時プロット対人アリーナ（WSS安定通信版）
// =========================================================
const AO_BROKERS = [
  "wss://broker.emqx.io:8084/mqtt",
  "wss://broker.hivemq.com:8884/mqtt",
  "wss://test.mosquitto.org:8081/mqtt"
];

const AO_STAMPS = ["よろしく！", "読まれた…！", "ナイス！", "次で決める！", "もう一戦！"];

// ---------- 📡 ゼロ依存・軽量 MQTT 3.1.1 over WSS クライアント ----------
class AoWssRelay {
  constructor(urls, onMessage, onStatus) {
    this.urls = urls;
    this.urlIdx = 0;
    this.onMessage = onMessage;
    this.onStatus = onStatus;
    this.ws = null;
    this.connected = false;
    this.closed = false;
    this.topic = "";
    this.pingTimer = null;
    this.connTimer = null;
    this.rxBuf = new Uint8Array(0);
    this.pktId = 1;
    this.te = new TextEncoder();
    this.td = new TextDecoder();
    this.clientId = "mf_" + Math.random().toString(36).slice(2, 12);
  }

  encRemLen(len) {
    const out = [];
    do {
      let d = len % 128;
      len = Math.floor(len / 128);
      if (len > 0) d |= 0x80;
      out.push(d);
    } while (len > 0);
    return out;
  }

  encStr(str) {
    const b = this.te.encode(str);
    return [(b.length >> 8) & 0xff, b.length & 0xff, ...b];
  }

  connect(topic) {
    this.topic = topic;
    this.closed = false;
    this.urlIdx = 0;
    this._tryNext();
  }

  _tryNext() {
    if (this.closed) return;
    if (this.urlIdx >= this.urls.length) {
      this.onStatus("error", "通信サーバーに接続できませんでした。電波状況を確認して再試行してください。");
      return;
    }
    const url = this.urls[this.urlIdx];
    this.onStatus("connecting", `通信リレー接続中 (${this.urlIdx + 1}/${this.urls.length})...`);

    try {
      const ws = new WebSocket(url, "mqtt");
      ws.binaryType = "arraybuffer";
      this.ws = ws;
      this.rxBuf = new Uint8Array(0);

      clearTimeout(this.connTimer);
      this.connTimer = setTimeout(() => {
        if (!this.connected && !this.closed) {
          try { ws.close(); } catch (_) {}
          this.urlIdx += 1;
          this._tryNext();
        }
      }, 5500);

      ws.onopen = () => {
        if (this.closed) { ws.close(); return; }
        const body = [
          ...this.encStr("MQTT"),
          0x04, 0x02, 0x00, 45,
          ...this.encStr(this.clientId)
        ];
        ws.send(new Uint8Array([0x10, ...this.encRemLen(body.length), ...body]));
      };

      ws.onmessage = (ev) => {
        if (!(ev.data instanceof ArrayBuffer)) return;
        const inc = new Uint8Array(ev.data);
        const merged = new Uint8Array(this.rxBuf.length + inc.length);
        merged.set(this.rxBuf, 0);
        merged.set(inc, this.rxBuf.length);
        this.rxBuf = merged;
        this._parseBuffer();
      };

      ws.onerror = () => {
        if (!this.connected && !this.closed) {
          clearTimeout(this.connTimer);
          try { ws.close(); } catch (_) {}
        }
      };

      ws.onclose = () => {
        clearInterval(this.pingTimer);
        if (this.closed) return;
        if (!this.connected) {
          clearTimeout(this.connTimer);
          this.urlIdx += 1;
          this._tryNext();
        } else {
          this.connected = false;
          this.onStatus("reconnecting", "通信が一時切断されました。自動再接続中...");
          setTimeout(() => { if (!this.closed) this._tryNext(); }, 1500);
        }
      };
    } catch (_) {
      this.urlIdx += 1;
      this._tryNext();
    }
  }

  _parseBuffer() {
    while (this.rxBuf.length >= 2) {
      let mult = 1, remLen = 0, idx = 1, b = 0, complete = false;
      while (idx < this.rxBuf.length) {
        b = this.rxBuf[idx++];
        remLen += (b & 127) * mult;
        mult *= 128;
        if ((b & 128) === 0) { complete = true; break; }
        if (mult > 128 * 128 * 128) return;
      }
      if (!complete || this.rxBuf.length < idx + remLen) return;

      const hdr = this.rxBuf[0];
      const pktType = hdr & 0xf0;
      const body = this.rxBuf.subarray(idx, idx + remLen);
      this.rxBuf = this.rxBuf.subarray(idx + remLen);

      if (pktType === 0x20) {
        if (body.length >= 2 && body[1] === 0x00) {
          clearTimeout(this.connTimer);
          this.connected = true;
          this._subscribe(this.topic);
          clearInterval(this.pingTimer);
          this.pingTimer = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
              this.ws.send(new Uint8Array([0xc0, 0x00]));
            }
          }, 20000);
        } else {
          try { this.ws.close(); } catch (_) {}
        }
      } else if (pktType === 0x90) {
        this.onStatus("connected", "オンライン接続完了");
      } else if (pktType === 0x30) {
        const qos = (hdr >> 1) & 0x03;
        if (body.length < 2) continue;
        const tLen = (body[0] << 8) | body[1];
        let pIdx = 2 + tLen + (qos > 0 ? 2 : 0);
        if (pIdx > body.length) continue;
        try {
          const obj = JSON.parse(this.td.decode(body.subarray(pIdx)));
          this.onMessage(obj);
        } catch (_) {}
      }
    }
  }

  _subscribe(topic) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const pid = this.pktId++;
    const body = [(pid >> 8) & 0xff, pid & 0xff, ...this.encStr(topic), 0x00];
    this.ws.send(new Uint8Array([0x82, ...this.encRemLen(body.length), ...body]));
  }

  publish(obj) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.connected) return false;
    const pBytes = this.te.encode(JSON.stringify(obj));
    const tBytes = this.encStr(this.topic);
    const body = new Uint8Array(tBytes.length + pBytes.length);
    body.set(tBytes, 0);
    body.set(pBytes, tBytes.length);
    const rem = this.encRemLen(body.length);
    const pkt = new Uint8Array(1 + rem.length + body.length);
    pkt[0] = 0x30;
    pkt.set(rem, 1);
    pkt.set(body, 1 + rem.length);
    this.ws.send(pkt);
    return true;
  }

  close() {
    this.closed = true;
    this.connected = false;
    clearTimeout(this.connTimer);
    clearInterval(this.pingTimer);
    if (this.ws) {
      try { this.ws.close(); } catch (_) {}
      this.ws = null;
    }
  }
}

// ---------- 🏆 アリーナ状態管理 ----------
const AO_MY_ID = "p_" + Math.random().toString(36).slice(2, 10);
let aoRelay = null;
let aoRetryTimer = null;
let aoRule = "fair"; // "fair" | "power"
let aoRoomInput = "";
let aoMatch = null;
let aoNet = {
  state: "idle", // "idle" | "connecting" | "waiting" | "joining" | "matched" | "error"
  role: "",      // "host" | "guest"
  roomCode: "",
  statusMsg: ""
};

function aoEsc(s) {
  if (typeof escapeHtml === "function") return escapeHtml(s);
  return String(s || "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  }[c]));
}

function aoTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function aoBuildMyProfile(rule = aoRule) {
  const partyIds = (state?.party || ["protagonist"]).slice(0, 4);
  const rawPower = partyIds.reduce((s, id) => s + (typeof calcCharPower === "function" ? calcCharPower(id) : 400), 0);
  const lead = typeof getCharProfile === "function" ? getCharProfile(partyIds[0] || "protagonist") : { id: "protagonist", name: "隊長", element: "fire", emoji: "👤" };

  // 公平ルールは全員ほぼ均一（戦術とデッキの読み合い勝負）、ガチ戦力は育成値を反映
  const effPower = rule === "fair" ? 2400 : Math.max(1200, rawPower);
  const maxHp = Math.round(effPower * 2.25);
  const atk = Math.round(effPower * 0.27);

  return {
    peerId: AO_MY_ID,
    name: state?.playerName || "第7小隊・隊長",
    title: state?.activeTitle || "第7小隊・新任隊長",
    leadId: lead.id,
    leadStyle: state?.styleId || "m_cool",
    leadEmoji: lead.emoji || "👤",
    leadElement: lead.element || "fire",
    power: rawPower,
    maxHp,
    atk
  };
}

function aoBuildCpuProfile(rule = aoRule) {
  const rivals = [
    { name: "白銀の模擬AI・ミコト型", title: "戦術演習シミュレータ", leadId: "mikoto", leadEmoji: "🦊", leadElement: "ice" },
    { name: "蒼雷の模擬AI・セレスティア型", title: "狙撃特化プロトコル", leadId: "celestia", leadEmoji: "⚡", leadElement: "volt" },
    { name: "紅蓮の模擬AI・ルナリア型", title: "強襲突破プロトコル", leadId: "lunaria", leadEmoji: "🔥", leadElement: "fire" }
  ];
  const pick = rivals[Math.floor(Math.random() * rivals.length)];
  const my = aoBuildMyProfile(rule);
  return {
    peerId: "cpu_ai",
    ...pick,
    leadStyle: "m_cool",
    power: my.power,
    maxHp: my.maxHp,
    atk: my.atk
  };
}

// 自分のデッキから三すくみ対応の4枚手札（＋EX100%時は必殺札）を抽出
function aoDrawHand(exGauge = 0, isPlayer2Local = false) {
  const fallback = [
    { name: "アーク強襲斬", type: "attack", element: "fire", icon: "⚔️", power: 1.45, summary: "⚔️ 攻撃 / 崩しに勝利" },
    { name: "アーマーブレイク", type: "break", element: "volt", icon: "💥", power: 1.35, guardBreakMult: 1.75, summary: "💥 崩し / 防御を粉砕" },
    { name: "見切りカウンター", type: "guard", element: "arc", icon: "🛡️", shield: 0.48, counterMult: 1.45, summary: "🛡️ 防御 / 攻撃へ反撃" },
    { name: "救急ナノミスト", type: "heal", element: "water", icon: "💚", healRatio: 0.22, nextAtkMult: 1.25, summary: "💚 回復＋次撃強化" }
  ];

  let pool = [];
  if (!isPlayer2Local && window.MF_CARDS?.buildActiveDeck) {
    try { pool = window.MF_CARDS.buildActiveDeck(); } catch (_) {}
  }

  const pickByType = (types, fb) => {
    const list = pool.filter(c => types.includes(c.type));
    const src = list.length ? list[Math.floor(Math.random() * list.length)] : fb;
    return {
      name: src.name,
      type: src.type,
      element: src.element || "arc",
      icon: src.icon || "🃏",
      power: Number(src.power || (src.type === "attack" ? 1.45 : (src.type === "break" ? 1.35 : 0))),
      shield: Number(src.shield || (src.type === "guard" ? 0.45 : 0)),
      healRatio: Number(src.healRatio || (src.type === "heal" ? 0.22 : 0)),
      counterMult: Number(src.counterMult || (src.type === "guard" ? 1.35 : 0)),
      guardBreakMult: Number(src.guardBreakMult || (src.type === "break" ? 1.7 : 1.0)),
      nextAtkMult: Number(src.nextAtkMult || (src.type === "buff" ? 1.45 : 1.0)),
      shredTurns: Number(src.shredTurns || 0),
      isUlt: false,
      summary: src.summary || ""
    };
  };

  const hand = [
    pickByType(["attack"], fallback[0]),
    pickByType(["break"], fallback[1]),
    pickByType(["guard"], fallback[2]),
    pickByType(["heal", "buff", "attack"], fallback[3])
  ];

  if (exGauge >= 100) {
    const leadId = (state?.party || [])[0] || "protagonist";
    const ultSrc = (!isPlayer2Local && window.MF_CARDS?.getUltCard) ? window.MF_CARDS.getUltCard(leadId) : null;
    hand.push({
      name: ultSrc ? ultSrc.name : "【EX】ユニゾン・ストライク",
      type: "ult",
      element: ultSrc?.element || "arc",
      icon: "🌟",
      power: 2.35,
      shield: 0.25,
      healRatio: 0.12,
      counterMult: 0,
      guardBreakMult: 1.5,
      nextAtkMult: 1.0,
      shredTurns: 1,
      isUlt: true,
      summary: "🌟 EX必殺 / 全相性優勢の切り札"
    });
  }
  return hand;
}

// ---------- ⚔️ 決定論的・同時プロット三すくみ解決エンジン ----------
function aoGetClashOutcome(aType, bType) {
  if (aType === "ult" && bType !== "ult") return { a: "WIN", b: "LOSE", label: "🌟 EX OVERDRIVE" };
  if (bType === "ult" && aType !== "ult") return { a: "LOSE", b: "WIN", label: "🌟 EX OVERDRIVE" };
  if (aType === "attack" && bType === "break") return { a: "WIN", b: "LOSE", label: "⚔️ 攻撃が崩しを制圧！" };
  if (bType === "attack" && aType === "break") return { a: "LOSE", b: "WIN", label: "⚔️ 攻撃が崩しを制圧！" };
  if (aType === "guard" && bType === "attack") return { a: "WIN", b: "LOSE", label: "🪞 防御カウンター炸裂！" };
  if (bType === "guard" && aType === "attack") return { a: "LOSE", b: "WIN", label: "🪞 防御カウンター炸裂！" };
  if (aType === "break" && bType === "guard") return { a: "WIN", b: "LOSE", label: "💥 装甲粉砕（GUARD CRUSH）！" };
  if (bType === "break" && aType === "guard") return { a: "LOSE", b: "WIN", label: "💥 装甲粉砕（GUARD CRUSH）！" };
  return { a: "EVEN", b: "EVEN", label: "⚡ 互角の正面激突！" };
}

function aoApplyReaction(attachedEl, atkEl, dmg, attacker) {
  if (!attachedEl || attachedEl === atkEl) return { dmg, nextEl: atkEl, txt: "" };
  const p = [attachedEl, atkEl];
  if (p.includes("fire") && p.includes("ice"))   return { dmg: Math.round(dmg * 1.65), nextEl: null, txt: "❄️🔥融解" };
  if (p.includes("fire") && p.includes("water")) return { dmg: Math.round(dmg * 1.55), nextEl: null, txt: "💧🔥蒸発" };
  if (p.includes("arc")) {
    attacker.shield += Math.round(attacker.maxHp * 0.12);
    return { dmg: Math.round(dmg * 1.25), nextEl: null, txt: "✨結晶化" };
  }
  if (p.includes("fire") && p.includes("volt"))  return { dmg: Math.round(dmg * 1.45), nextEl: null, txt: "⚡🔥過負荷" };
  if (p.includes("wind"))                        return { dmg: Math.round(dmg * 1.35), nextEl: null, txt: "🌪️拡散" };
  return { dmg: Math.round(dmg * 1.3), nextEl: null, txt: "⚡元素反応" };
}

function aoResolveSimultaneousTurn(p1, p2, c1, c2) {
  const clash = aoGetClashOutcome(c1.type, c2.type);
  const logs = [`【TURN ${aoMatch.turn}】 ${clash.label}`];

  const applySupport = (actor, target, card, outcome) => {
    if (card.isUlt) actor.ex = 0;
    else actor.ex = Math.min(100, actor.ex + (outcome === "WIN" ? 40 : 28));

    if (card.healRatio > 0) {
      const h = Math.round(actor.maxHp * Math.min(0.32, card.healRatio));
      actor.hp = Math.min(actor.maxHp, actor.hp + h);
      logs.push(`💚 ${actor.name}：HP +${h.toLocaleString()} 回復`);
    }
    if (card.shield > 0) {
      const sh = Math.round(actor.maxHp * Math.min(0.42, card.shield * 0.45));
      actor.shield += sh;
    }
    if (card.shredTurns > 0) target.shred = Math.max(target.shred, card.shredTurns);
  };

  applySupport(p1, p2, c1, clash.a);
  applySupport(p2, p1, c2, clash.b);

  const calcStrike = (actor, target, card, oppCard, outcome) => {
    let rawPow = card.power || 0;
    if (card.type === "guard" && outcome === "WIN") {
      rawPow = Math.max(1.25, card.counterMult || 1.35);
    }
    if (rawPow <= 0) return 0;

    let mult = actor.nextMult || 1.0;
    actor.nextMult = 1.0;
    if (outcome === "WIN") mult *= (card.type === "break" ? 1.55 : 1.35);
    else if (outcome === "LOSE") mult *= (oppCard.type === "guard" ? 0.35 : 0.6);
    if (target.shred > 0) mult *= 1.25;

    let dmg = Math.round(actor.atk * rawPow * mult);
    const react = aoApplyReaction(target.attachedEl, card.element, dmg, actor);
    dmg = react.dmg;
    target.attachedEl = react.nextEl;

    // ガードクラッシュ時は相手の防壁を粉砕してからダメージ適用
    if (card.type === "break" && oppCard.type === "guard") {
      target.shield = 0;
    }
    if (target.shield > 0) {
      const abs = Math.min(target.shield, dmg);
      target.shield -= abs;
      dmg -= abs;
    }
    target.hp = Math.max(0, target.hp - dmg);
    logs.push(`${card.icon} ${actor.name}『${card.name}』→ ${dmg.toLocaleString()} DMG${react.txt ? `（${react.txt}）` : ""}`);
    return dmg;
  };

  const d1 = calcStrike(p1, p2, c1, c2, clash.a);
  const d2 = calcStrike(p2, p1, c2, c1, clash.b);

  if (c1.nextAtkMult > 1) p1.nextMult = Math.min(1.8, c1.nextAtkMult);
  if (c2.nextAtkMult > 1) p2.nextMult = Math.min(1.8, c2.nextAtkMult);
  if (p1.shred > 0) p1.shred -= 1;
  if (p2.shred > 0) p2.shred -= 1;
  p1.shield = Math.floor(p1.shield * 0.45);
  p2.shield = Math.floor(p2.shield * 0.45);

  return { clash, d1, d2, c1, c2, logs };
}

// ---------- 🌐 オンライン接続・マッチング制御 ----------
function aoDisconnectAll(resetUi = false) {
  clearInterval(aoRetryTimer);
  aoRetryTimer = null;
  if (aoRelay) {
    aoRelay.close();
    aoRelay = null;
  }
  if (resetUi) {
    aoNet = { state: "idle", role: "", roomCode: "", statusMsg: "" };
    aoMatch = null;
  }
}

function aoCreateOnlineRoom() {
  aoDisconnectAll(true);
  const code = String(Math.floor(1000 + Math.random() * 9000));
  aoNet = { state: "connecting", role: "host", roomCode: code, statusMsg: "ルームを作成中..." };
  renderArenaView();

  const topic = `mf_arena_v5/room_${code}`;
  aoRelay = new AoWssRelay(
    AO_BROKERS,
    (msg) => aoHandleNetMsg(msg),
    (st, text) => {
      if (st === "connected") {
        aoNet.state = aoMatch ? "matched" : "waiting";
        aoNet.statusMsg = "🟢 オンライン待機中（対戦相手の入室を待っています）";
        if (typeof playSfx === "function") playSfx("switch");
        clearInterval(aoRetryTimer);
        aoRetryTimer = setInterval(() => {
          if (!aoMatch && aoRelay && aoRelay.connected) {
            aoRelay.publish({ type: "host_beacon", from: AO_MY_ID, rule: aoRule });
          }
        }, 2500);
      } else if (st === "error") {
        aoNet.state = "error";
        aoNet.statusMsg = text;
      } else {
        aoNet.statusMsg = text;
      }
      renderArenaView();
    }
  );
  aoRelay.connect(topic);
}

function aoJoinOnlineRoom(codeOverride = "") {
  const raw = String(codeOverride || aoRoomInput || document.getElementById("ao-room-input")?.value || "").replace(/\D/g, "").slice(0, 4);
  if (raw.length !== 4) {
    showToast("4桁の部屋番号を入力してください");
    return;
  }
  aoRoomInput = raw;
  aoDisconnectAll(true);
  aoNet = { state: "connecting", role: "guest", roomCode: raw, statusMsg: `部屋 #${raw} へ接続中...` };
  renderArenaView();

  const topic = `mf_arena_v5/room_${raw}`;
  let joinAttempts = 0;

  aoRelay = new AoWssRelay(
    AO_BROKERS,
    (msg) => aoHandleNetMsg(msg),
    (st, text) => {
      if (st === "connected") {
        aoNet.state = aoMatch ? "matched" : "joining";
        aoNet.statusMsg = `🟢 接続完了！部屋 #${raw} のホストへ応答を送信中...`;
        const sendJoin = () => {
          if (aoMatch || !aoRelay || !aoRelay.connected) return;
          joinAttempts += 1;
          aoRelay.publish({
            type: "guest_join",
            from: AO_MY_ID,
            profile: aoBuildMyProfile("fair"),
            powerProfile: aoBuildMyProfile("power")
          });
          if (joinAttempts === 8) {
            aoNet.statusMsg = `⏳ 部屋 #${raw} のホスト待機中…（相手がまだ部屋を作っていないか、番号違いの可能性があります）`;
            renderArenaView();
          }
        };
        sendJoin();
        clearInterval(aoRetryTimer);
        aoRetryTimer = setInterval(sendJoin, 1500);
      } else if (st === "error") {
        aoNet.state = "error";
        aoNet.statusMsg = text;
      } else {
        aoNet.statusMsg = text;
      }
      renderArenaView();
    }
  );
  aoRelay.connect(topic);
}

function aoHandleNetMsg(msg) {
  if (!msg || msg.from === AO_MY_ID) return;

  // ホスト側：ゲスト入室を受信 → マッチ開始を送信
  if (msg.type === "guest_join" && aoNet.role === "host") {
    if (!aoMatch) {
      const hostProf = aoBuildMyProfile(aoRule);
      const guestProf = aoRule === "power" ? (msg.powerProfile || msg.profile) : msg.profile;
      const matchId = "m_" + Date.now().toString(36);
      aoStartMatchObject("online", "host", matchId, aoRule, hostProf, guestProf);
    }
    if (aoMatch && aoRelay) {
      aoRelay.publish({
        type: "match_start",
        from: AO_MY_ID,
        matchId: aoMatch.matchId,
        rule: aoMatch.rule,
        hostProfile: aoMatch.p1.profile,
        guestProfile: aoMatch.p2.profile
      });
    }
    return;
  }

  // ゲスト側：ホストからマッチ開始を受信
  if (msg.type === "match_start" && aoNet.role === "guest") {
    if (!aoMatch || aoMatch.matchId !== msg.matchId) {
      aoStartMatchObject("online", "guest", msg.matchId, msg.rule, msg.hostProfile, msg.guestProfile);
    }
    return;
  }

  if (!aoMatch || (msg.matchId && msg.matchId !== aoMatch.matchId)) return;

  // カード選択を受信
  if (msg.type === "pick" && msg.turn === aoMatch.turn) {
    aoMatch.oppPick = msg.card;
    aoMatch.oppLocked = true;
    if (aoMatch.myPick && aoMatch.oppPick && !aoMatch.resolving) {
      aoExecuteTurnResolution();
    } else {
      renderArenaView();
    }
    return;
  }

  // スタンプ受信
  if (msg.type === "stamp") {
    aoMatch.lastStamp = `${aoMatch.opp.name}：「${msg.text}」`;
    if (typeof playSfx === "function") playSfx("tap");
    renderArenaView();
    return;
  }

  // 降参受信
  if (msg.type === "forfeit" && !aoMatch.finished) {
    aoFinishMatch("win", "対戦相手が降参しました。");
    return;
  }
}

function aoMakeFighter(prof) {
  return {
    profile: prof,
    name: prof.name,
    title: prof.title || "",
    leadId: prof.leadId || "protagonist",
    leadStyle: prof.leadStyle || "m_cool",
    leadEmoji: prof.leadEmoji || "👤",
    hp: prof.maxHp,
    maxHp: prof.maxHp,
    atk: prof.atk,
    shield: 0,
    ex: 0,
    attachedEl: null,
    shred: 0,
    nextMult: 1.0
  };
}

function aoStartMatchObject(mode, myRole, matchId, rule, p1Prof, p2Prof) {
  clearInterval(aoRetryTimer);
  aoRetryTimer = null;

  const p1 = aoMakeFighter(p1Prof);
  const p2 = aoMakeFighter(p2Prof);
  const me = myRole === "guest" ? p2 : p1;
  const opp = myRole === "guest" ? p1 : p2;

  aoNet.state = mode === "online" ? "matched" : "idle";
  aoMatch = {
    mode, // "online" | "cpu" | "local2p"
    myRole, // "host" | "guest"
    matchId,
    rule,
    p1, p2, me, opp,
    turn: 1,
    hand: aoDrawHand(0, false),
    handP2: mode === "local2p" ? aoDrawHand(0, true) : [],
    localPhase: "p1", // "p1" | "handoff" | "p2"
    myPick: null,
    oppPick: null,
    oppLocked: false,
    resolving: false,
    lastClash: null,
    lastStamp: "",
    logs: [mode === "online"
      ? `🌐 オンライン対戦開始！（${rule === "fair" ? "公平ルール" : "ガチ戦力"}）`
      : (mode === "cpu" ? "🤖 戦術シミュレータ演習開始！" : "📱 1台2人・読み合い対戦開始！")],
    finished: false,
    result: null
  };

  if (window.MF_AUDIO) window.MF_AUDIO.playBgm("battle");
  if (typeof playSfx === "function") playSfx("win");
  renderArenaView();
}

function aoStartCpuMatch() {
  aoDisconnectAll(true);
  const myProf = aoBuildMyProfile(aoRule);
  const cpuProf = aoBuildCpuProfile(aoRule);
  aoStartMatchObject("cpu", "host", "cpu_" + Date.now(), aoRule, myProf, cpuProf);
}

function aoStartLocal2pMatch() {
  aoDisconnectAll(true);
  const p1Prof = aoBuildMyProfile("fair");
  const p2Prof = { ...aoBuildCpuProfile("fair"), name: "プレイヤー2（挑戦者）", title: "ローカル対戦" };
  aoStartMatchObject("local2p", "host", "loc_" + Date.now(), "fair", p1Prof, p2Prof);
}

function aoSelectCard(idx) {
  if (!aoMatch || aoMatch.finished || aoMatch.resolving) return;

  if (aoMatch.mode === "local2p") {
    if (aoMatch.localPhase === "p1") {
      aoMatch.myPick = aoMatch.hand[idx];
      aoMatch.localPhase = "handoff";
      if (typeof playSfx === "function") playSfx("switch");
      renderArenaView();
      return;
    }
    if (aoMatch.localPhase === "p2") {
      aoMatch.oppPick = aoMatch.handP2[idx];
      if (typeof playSfx === "function") playSfx("switch");
      aoExecuteTurnResolution();
      return;
    }
    return;
  }

  if (aoMatch.myPick) return;
  const card = aoMatch.hand[idx];
  if (!card) return;
  aoMatch.myPick = card;
  if (typeof playSfx === "function") playSfx("switch");

  if (aoMatch.mode === "cpu") {
    const cpuHand = aoDrawHand(aoMatch.opp.ex, true);
    aoMatch.oppPick = cpuHand[Math.floor(Math.random() * cpuHand.length)];
    aoMatch.oppLocked = true;
    aoExecuteTurnResolution();
    return;
  }

  // オンライン送信＋相手応答まで2秒ごとに安全再送
  const payload = { type: "pick", from: AO_MY_ID, matchId: aoMatch.matchId, turn: aoMatch.turn, card };
  if (aoRelay) aoRelay.publish(payload);
  clearInterval(aoRetryTimer);
  aoRetryTimer = setInterval(() => {
    if (!aoMatch || aoMatch.finished || !aoMatch.myPick || aoMatch.oppPick) {
      clearInterval(aoRetryTimer);
      return;
    }
    if (aoRelay && aoRelay.connected) aoRelay.publish(payload);
  }, 2000);

  if (aoMatch.oppPick) {
    aoExecuteTurnResolution();
  } else {
    renderArenaView();
  }
}

function aoExecuteTurnResolution() {
  if (!aoMatch || aoMatch.resolving || aoMatch.finished) return;
  aoMatch.resolving = true;
  clearInterval(aoRetryTimer);
  aoRetryTimer = null;

  const isGuest = aoMatch.myRole === "guest";
  const c1 = isGuest ? aoMatch.oppPick : aoMatch.myPick;
  const c2 = isGuest ? aoMatch.myPick : aoMatch.oppPick;
  const res = aoResolveSimultaneousTurn(aoMatch.p1, aoMatch.p2, c1, c2);

  aoMatch.lastClash = {
    label: res.clash.label,
    myCard: aoMatch.myPick,
    oppCard: aoMatch.oppPick,
    myDmgOut: isGuest ? res.d2 : res.d1,
    oppDmgOut: isGuest ? res.d1 : res.d2
  };
  aoMatch.logs = [...res.logs, ...aoMatch.logs].slice(0, 6);

  if (typeof playSfx === "function") playSfx("break");
  renderArenaView();

  setTimeout(() => {
    if (!aoMatch || aoMatch.finished) return;
    const myHp = aoMatch.me.hp;
    const oppHp = aoMatch.opp.hp;

    if (myHp <= 0 || oppHp <= 0) {
      const outcome = (myHp <= 0 && oppHp <= 0) ? "draw" : (oppHp <= 0 ? "win" : "lose");
      aoFinishMatch(outcome);
      return;
    }

    aoMatch.turn += 1;
    aoMatch.myPick = null;
    aoMatch.oppPick = null;
    aoMatch.oppLocked = false;
    aoMatch.resolving = false;
    aoMatch.localPhase = "p1";
    aoMatch.hand = aoDrawHand(aoMatch.me.ex, false);
    if (aoMatch.mode === "local2p") aoMatch.handP2 = aoDrawHand(aoMatch.opp.ex, true);
    renderArenaView();
  }, 1350);
}

function aoFinishMatch(outcome, reason = "") {
  if (!aoMatch || aoMatch.finished) return;
  aoMatch.finished = true;
  aoMatch.resolving = false;
  clearInterval(aoRetryTimer);
  aoRetryTimer = null;

  let rewardText = "";
  if (outcome === "win") {
    if (typeof playSfx === "function") playSfx("win");
    if (typeof state !== "undefined" && state) {
      state.arenaWins = (state.arenaWins || 0) + 1;
      const today = aoTodayStr();
      if (state.arenaRewardDate !== today) {
        state.arenaRewardDate = today;
        state.arenaDailyWins = 0;
      }
      if ((state.arenaDailyWins || 0) < 5) {
        state.arenaDailyWins = (state.arenaDailyWins || 0) + 1;
        state.credits = (state.credits || 0) + 1800;
        state.cardTickets = (state.cardTickets || 0) + 1;
        rewardText = `🎁 勝利報酬：🪙+1,800 ／ 🎟️パック券+1（本日 ${state.arenaDailyWins}/5回）`;
      } else {
        rewardText = "※本日の勝利報酬上限（5回）に到達済みです";
      }
      if (typeof saveGame === "function") saveGame();
      if (typeof renderTopBar === "function") renderTopBar();
    }
  } else {
    if (typeof playSfx === "function") playSfx("lose");
  }

  aoMatch.result = { outcome, reason, rewardText };
  renderArenaView();
}

function aoSendStamp(text) {
  if (!aoMatch || aoMatch.mode !== "online" || !aoRelay || !aoRelay.connected) return;
  aoRelay.publish({ type: "stamp", from: AO_MY_ID, matchId: aoMatch.matchId, text });
  aoMatch.lastStamp = `あなた：「${text}」`;
  if (typeof playSfx === "function") playSfx("tap");
  renderArenaView();
}

function aoForfeitMatch() {
  if (!aoMatch || aoMatch.finished) return;
  if (!confirm("この対戦を降参してロビーへ戻りますか？")) return;
  if (aoMatch.mode === "online" && aoRelay && aoRelay.connected) {
    aoRelay.publish({ type: "forfeit", from: AO_MY_ID, matchId: aoMatch.matchId });
  }
  aoFinishMatch("lose", "降参しました。");
}

function aoLeaveToLobby() {
  aoDisconnectAll(true);
  if (window.MF_AUDIO) window.MF_AUDIO.playBgm("home");
  renderArenaView();
}

function aoCopyText(txt, okMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(txt).then(() => showToast(okMsg)).catch(() => prompt("以下をコピーしてください：", txt));
  } else {
    prompt("以下をコピーしてください：", txt);
  }
}

function aoCopyInviteLink() {
  const code = aoNet.roomCode;
  if (!code) return;
  const baseUrl = window.location.origin + window.location.pathname;
  const inviteUrl = `${baseUrl}?room=${code}`;
  aoCopyText(`🏆『ミアズマ・フロンティア』オンライン対戦しよう！\n部屋番号：${code}\n${inviteUrl}`, "🔗 招待メッセージ＆リンクをコピーしました！");
}

function aoPortraitHtml(f) {
  const ch = window.MF_DATA?.CHARACTERS?.[f.leadId] || { id: f.leadId, name: f.name, emoji: f.leadEmoji, isProtagonist: f.leadId === "protagonist", styleId: f.leadStyle };
  if (window.MF_SPRITES?.portraitHTML) {
    return window.MF_SPRITES.portraitHTML({ ...ch, styleId: f.leadStyle }, "icon");
  }
  return `<div style="font-size:26px;">${f.leadEmoji || "👤"}</div>`;
}

// ---------- 🖥️ 対人アリーナ画面レンダリング ----------
function renderArenaView() {
  if (typeof renderTopBar === "function") renderTopBar();
  const sec = document.getElementById("view-arena");
  if (!sec) return;

  // 対戦中画面
  if (aoMatch) {
    const m = aoMatch;
    const mePct = Math.max(0, Math.round((m.me.hp / m.me.maxHp) * 100));
    const oppPct = Math.max(0, Math.round((m.opp.hp / m.opp.maxHp) * 100));
    const meEl = m.me.attachedEl ? (window.MF_DATA?.ELEMENTS?.[m.me.attachedEl]?.icon || "") : "";
    const oppEl = m.opp.attachedEl ? (window.MF_DATA?.ELEMENTS?.[m.opp.attachedEl]?.icon || "") : "";

    let actionArea = "";
    if (m.finished && m.result) {
      const rTitle = m.result.outcome === "win" ? "🏆 VICTORY!!" : (m.result.outcome === "draw" ? "⚖️ DRAW" : "💀 DEFEAT...");
      const rColor = m.result.outcome === "win" ? "#18e0a8" : (m.result.outcome === "draw" ? "#f3cf00" : "#ff4d5a");
      actionArea = `
        <div class="ao-result-card" style="border-color:${rColor};">
          <div style="font-size:22px; font-weight:900; color:${rColor};">${rTitle}</div>
          ${m.result.reason ? `<div style="font-size:11.5px; margin-top:4px;">${aoEsc(m.result.reason)}</div>` : ""}
          ${m.result.rewardText ? `<div style="font-size:11px; color:#f3cf00; font-weight:900; margin-top:6px;">${aoEsc(m.result.rewardText)}</div>` : ""}
          <button class="btn-primary" style="width:100%; margin-top:10px; padding:11px;" onclick="aoLeaveToLobby()">🏆 アリーナロビーへ戻る</button>
        </div>
      `;
    } else if (m.mode === "local2p" && m.localPhase === "handoff") {
      actionArea = `
        <div class="ao-wait-box">
          <strong>📱 プレイヤー2へ端末を渡してください</strong>
          <div style="font-size:11px; margin:6px 0 10px; color:#c8d4ee;">プレイヤー1のカードは伏せられています。準備ができたら下をタップ！</div>
          <button class="btn-accent2" style="width:100%; padding:10px;" onclick="aoMatch.localPhase='p2'; playSfx('tap'); renderArenaView();">▶ プレイヤー2のカードを選ぶ</button>
        </div>
      `;
    } else if (m.mode === "online" && m.myPick && !m.oppPick) {
      actionArea = `
        <div class="ao-wait-box">
          <strong>⏳ 対戦相手のプロット待機中…</strong>
          <div style="font-size:11px; margin-top:4px; color:#f3cf00;">あなたの伏せ札：${m.myPick.icon} ${aoEsc(m.myPick.name)}</div>
        </div>
      `;
    } else {
      const activeHand = (m.mode === "local2p" && m.localPhase === "p2") ? m.handP2 : m.hand;
      const turnPrompt = m.mode === "local2p"
        ? (m.localPhase === "p2" ? "【P2】伏せるカードを1枚選択" : "【P1】伏せるカードを1枚選択")
        : (m.oppLocked ? "⚡ 相手は選択完了！あなたのカードを1枚選べ！" : "🃏 同時プロット：今ターンのカードを1枚選択");
      actionArea = `
        <div style="font-size:11px; font-weight:900; color:#f3cf00; margin-bottom:6px;">${turnPrompt}</div>
        <div class="ao-hand-grid">
          ${activeHand.map((c, i) => {
            const el = window.MF_DATA?.ELEMENTS?.[c.element] || { icon: "✨" };
            const tLbl = { attack: "⚔️攻撃", break: "💥崩し", guard: "🛡️防御", heal: "💚回復", buff: "✨支援", ult: "🌟EX必殺" }[c.type] || "";
            return `
              <button class="ao-card el-pat-${c.element} ${c.isUlt ? "ao-ult" : ""}" onclick="aoSelectCard(${i})">
                <div class="ao-card-top"><span>${tLbl}</span><span>${el.icon}</span></div>
                <div style="font-size:24px; margin:2px 0;">${c.icon}</div>
                <div class="ao-card-name">${aoEsc(c.name)}</div>
                <div class="ao-card-sum">${aoEsc(c.summary)}</div>
              </button>
            `;
          }).join("")}
        </div>
      `;
    }

    const clashHtml = m.lastClash ? `
      <div class="ao-clash-strip">
        <div style="font-size:11px; font-weight:900; color:#f3cf00; margin-bottom:4px;">${aoEsc(m.lastClash.label)}</div>
        <div style="display:grid; grid-template-columns:1fr auto 1fr; gap:6px; align-items:center; font-size:10.5px;">
          <div><strong>${m.lastClash.myCard.icon} ${aoEsc(m.lastClash.myCard.name)}</strong><br><span style="color:#18e0a8;">与 ${m.lastClash.myDmgOut.toLocaleString()}</span></div>
          <span style="font-weight:900; color:#f3cf00;">VS</span>
          <div><strong>${m.lastClash.oppCard.icon} ${aoEsc(m.lastClash.oppCard.name)}</strong><br><span style="color:#ff595e;">被 ${m.lastClash.oppDmgOut.toLocaleString()}</span></div>
        </div>
      </div>
    ` : "";

    sec.innerHTML = `
      <div class="card ao-arena-shell">
        <div class="top-row" style="margin-bottom:7px;">
          <span class="ef-code">// TURN ${m.turn} ・ ${m.mode === "online" ? `ROOM #${aoNet.roomCode}` : (m.mode === "cpu" ? "CPU SIM" : "LOCAL 2P")}</span>
          <button class="btn-xs" onclick="${m.finished ? "aoLeaveToLobby()" : "aoForfeitMatch()"}">${m.finished ? "退出" : "🏳️ 降参"}</button>
        </div>

        <div class="ao-fighter opp">
          <div style="display:flex; gap:8px; align-items:center;">
            ${aoPortraitHtml(m.opp)}
            <div style="flex:1; min-width:0;">
              <div class="top-row">
                <strong style="font-size:12px;">${aoEsc(m.opp.name)} ${oppEl}</strong>
                <span style="font-size:10px; color:#f3cf00;">${m.oppLocked ? "✅選択済" : "思考中"}</span>
              </div>
              <div class="gauge-bar" style="height:7px; margin:3px 0;"><div style="background:#ff4d5a; width:${oppPct}%;"></div></div>
              <div style="font-size:10px; display:flex; justify-content:space-between;">
                <span>HP ${m.opp.hp.toLocaleString()} / ${m.opp.maxHp.toLocaleString()} ${m.opp.shield > 0 ? "🛡️防壁" : ""}</span>
                <span>🌟EX ${m.opp.ex}%</span>
              </div>
            </div>
          </div>
        </div>

        ${clashHtml}

        <div class="ao-fighter me">
          <div style="display:flex; gap:8px; align-items:center;">
            ${aoPortraitHtml(m.me)}
            <div style="flex:1; min-width:0;">
              <div class="top-row">
                <strong style="font-size:12px;">${aoEsc(m.me.name)} ${meEl}</strong>
                <span style="font-size:10px; color:#18e0a8;">あなた</span>
              </div>
              <div class="gauge-bar" style="height:7px; margin:3px 0;"><div style="background:#18e0a8; width:${mePct}%;"></div></div>
              <div style="font-size:10px; display:flex; justify-content:space-between;">
                <span>HP ${m.me.hp.toLocaleString()} / ${m.me.maxHp.toLocaleString()} ${m.me.shield > 0 ? "🛡️防壁" : ""}</span>
                <span>🌟EX ${m.me.ex}%</span>
              </div>
            </div>
          </div>
        </div>

        ${m.lastStamp ? `<div class="ao-stamp-toast">💬 ${aoEsc(m.lastStamp)}</div>` : ""}

        ${actionArea}

        ${m.mode === "online" && !m.finished ? `
          <div style="display:flex; gap:4px; flex-wrap:wrap; margin-top:8px;">
            ${AO_STAMPS.map(st => `<button class="btn-xs" style="font-size:9.5px; padding:3px 6px;" onclick="aoSendStamp('${st}')">${st}</button>`).join("")}
          </div>
        ` : ""}

        <div class="ao-log-box">
          ${m.logs.slice(0, 3).map(l => `<div>${aoEsc(l)}</div>`).join("")}
        </div>
      </div>
    `;
    return;
  }

  // ロビー画面（待機中含む）
  const wins = state?.arenaWins || 0;
  const isWaiting = aoNet.state === "connecting" || aoNet.state === "waiting" || aoNet.state === "joining";

  sec.innerHTML = `
    <div class="card">
      <div class="section-title">
        <span>🏆 同時プロット対人アリーナ</span>
        <button class="btn-xs" onclick="aoDisconnectAll(true); switchView('home')">← 拠点へ</button>
      </div>

      <div class="ao-lobby-hero">
        <div class="top-row" style="margin-bottom:4px;">
          <span class="ef-code">// TACTICAL PVP RELAY v5</span>
          <span class="rank-pill" style="background:#f3cf00; color:#111;">通算 ${wins}勝</span>
        </div>
        <div style="font-size:11px; color:#d7e1f7; line-height:1.45;">
          <strong>三すくみ：</strong> ⚔️攻撃 ＞ 💥崩し ＞ 🛡️防御 ＞ ⚔️攻撃<br>
          お互い同時にカードを伏せてオープン！勝利で毎日5回まで🪙+1,800＆🎟️券+1！
        </div>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:5px; margin-bottom:9px;">
        <button class="btn-xs ${aoRule === "fair" ? "btn-primary" : ""}" style="padding:7px;" onclick="aoRule='fair'; playSfx('tap'); renderArenaView();">
          ⚖️ 公平ルール（Lv均一）
        </button>
        <button class="btn-xs ${aoRule === "power" ? "btn-accent2" : ""}" style="padding:7px;" onclick="aoRule='power'; playSfx('tap'); renderArenaView();">
          🔥 ガチ戦力（育成反映）
        </button>
      </div>

      ${isWaiting ? `
        <div class="ao-waiting-panel">
          <div style="font-size:11px; color:#f3cf00; font-weight:900;">${aoEsc(aoNet.statusMsg)}</div>
          ${aoNet.role === "host" ? `
            <div class="ao-room-code-big">${aoNet.roomCode}</div>
            <div style="font-size:10.5px; color:#cfd9f0; margin-bottom:8px;">この4桁の番号を友達に伝えてください</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:7px;">
              <button class="btn-xs btn-primary" style="padding:7px;" onclick="aoCopyText('${aoNet.roomCode}', '📋 部屋番号 ${aoNet.roomCode} をコピーしました')">📋 番号コピー</button>
              <button class="btn-xs btn-accent2" style="padding:7px;" onclick="aoCopyInviteLink()">🔗 招待リンク</button>
            </div>
          ` : `
            <div style="font-size:13px; font-weight:900; margin:10px 0;">部屋 #${aoNet.roomCode} へ入室待機中…</div>
          `}
          <button class="btn-xs" style="width:100%; padding:7px;" onclick="aoLeaveToLobby()">✕ キャンセルして戻る</button>
        </div>
      ` : `
        <div style="background:var(--surface-sub); border:2px solid var(--border); border-radius:12px; padding:10px; margin-bottom:9px;">
          <strong style="display:block; font-size:12.5px; margin-bottom:6px;">🌐 オンライン対戦（4G/5G・Wi-Fi対応）</strong>
          ${aoNet.state === "error" ? `<div style="font-size:11px; color:#ff4d5a; font-weight:800; margin-bottom:6px;">⚠️ ${aoEsc(aoNet.statusMsg)}</div>` : ""}
          <button class="btn-primary" style="width:100%; padding:10px; margin-bottom:8px;" onclick="aoCreateOnlineRoom()">
            🏠 対戦部屋を作成する（4桁番号を発行）
          </button>
          <div style="display:flex; gap:6px;">
            <input id="ao-room-input" type="tel" maxlength="4" value="${aoEsc(aoRoomInput)}"
                   oninput="aoRoomInput=this.value.replace(/\\D/g,'').slice(0,4)"
                   placeholder="4桁の部屋番号" style="flex:1; text-align:center; font-size:15px; font-weight:900; letter-spacing:0.18em;" />
            <button class="btn-accent2" style="padding:8px 14px;" onclick="aoJoinOnlineRoom()">🚪 入室</button>
          </div>
          <button class="btn-xs" style="width:100%; margin-top:7px; padding:6px;" onclick="switchView('board')">
            💬 交流掲示板で対戦相手を募集する ▶
          </button>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:7px;">
          <button style="padding:10px 6px; font-size:11.5px;" onclick="aoStartCpuMatch()">🤖 CPU模擬戦<br><span style="font-size:9.5px; opacity:0.8;">1人で読み合い練習</span></button>
          <button style="padding:10px 6px; font-size:11.5px;" onclick="aoStartLocal2pMatch()">📱 1台で2人対戦<br><span style="font-size:9.5px; opacity:0.8;">友達と交互に操作</span></button>
        </div>
      `}
    </div>
  `;
}

// URLの ?room=1234 招待リンク自動読み取り＆画面離脱時の安全な切断フック
(function initArenaOnline() {
  try {
    const params = new URLSearchParams(window.location.search);
    const invitedRoom = (params.get("room") || "").replace(/\D/g, "").slice(0, 4);
    if (invitedRoom.length === 4) {
      aoRoomInput = invitedRoom;
      setTimeout(() => {
        if (typeof showToast === "function") showToast(`🏆 対戦招待を受信！アリーナの部屋 #${invitedRoom} から入室できます`);
      }, 1800);
    }
  } catch (_) {}

  if (typeof window.switchView === "function" && !window.switchView._aoHooked) {
    const origSwitch = window.switchView;
    window.switchView = function(viewId) {
      if (viewId !== "arena" && aoRelay) aoDisconnectAll(true);
      return origSwitch.apply(this, arguments);
    };
    window.switchView._aoHooked = true;
  }
})();

// グローバル公開（既存の arena.js を安全に上書き）
window.renderArenaView = renderArenaView;
window.aoCreateOnlineRoom = aoCreateOnlineRoom;
window.aoJoinOnlineRoom = aoJoinOnlineRoom;
window.aoStartCpuMatch = aoStartCpuMatch;
window.aoStartLocal2pMatch = aoStartLocal2pMatch;
window.aoSelectCard = aoSelectCard;
window.aoSendStamp = aoSendStamp;
window.aoForfeitMatch = aoForfeitMatch;
window.aoLeaveToLobby = aoLeaveToLobby;
window.aoCopyText = aoCopyText;
window.aoCopyInviteLink = aoCopyInviteLink;
window.aoDisconnectAll = aoDisconnectAll;
