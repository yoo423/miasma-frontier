window.MF_IMG_VER = "536";
let zoomCharId = null;
let zoomFaceMode = true;

function normalizeProtagStyleId(raw) {
  const s = String(raw || "").trim().toLowerCase();
  if (s === "m_cool" || s === "m_genki" || s === "f_cool" || s === "f_genki") return s;
  const isF = s.includes("f") || s.includes("girl") || s.includes("woman") || s.includes("female") || s.includes("女");
  const isGenki = s.includes("genki") || s.includes("bright") || s.includes("active") || s.includes("元気") || s.includes("2");
  return `${isF ? "f" : "m"}_${isGenki ? "genki" : "cool"}`;
}

window.mfImgFallback = function(img) {
  const step = Number(img.dataset.step || 0);
  const base = img.dataset.base || "";
  const isProtag = img.dataset.protag === "1";
  const v = window.MF_IMG_VER;

  const list = isProtag
    ? [
        base + ".jpeg?v=" + v,
        base + ".png?v=" + v,
        "assets/protagonist_m_cool.jpg?v=" + v,
        "assets/protagonist_m_genki.jpg?v=" + v,
        "assets/protagonist_f_cool.jpg?v=" + v,
        "assets/protagonist_f_genki.jpg?v=" + v
      ]
    : [
        base + ".jpeg?v=" + v,
        base + ".png?v=" + v
      ];

  if (step < list.length) {
    img.dataset.step = String(step + 1);
    img.src = list[step];
  } else {
    img.dataset.failed = "1";
    img.style.setProperty("display", "none", "important");
    if (img.nextElementSibling) img.nextElementSibling.style.display = "flex";
  }
};

window.openPortraitZoom = function(charId, startFace = true) {
  const modal = document.getElementById("modal-portrait-zoom");
  if (!modal || typeof getCharProfile !== "function") return;
  zoomCharId = charId;
  zoomFaceMode = startFace;
  renderPortraitZoomModal();
  modal.classList.add("active");
  if (typeof playSfx === "function") playSfx("tap");
};

window.togglePortraitZoomMode = function() {
  zoomFaceMode = !zoomFaceMode;
  if (typeof playSfx === "function") playSfx("tap");
  renderPortraitZoomModal();
};

function renderPortraitZoomModal() {
  const ch = getCharProfile(zoomCharId || "protagonist");
  const titleEl = document.getElementById("zoom-char-title");
  const bodyEl = document.getElementById("zoom-img-body");
  const modeBtn = document.getElementById("btn-zoom-mode");
  if (titleEl) titleEl.textContent = `${ch.name}（${ch.rarity}）`;
  if (modeBtn) modeBtn.textContent = zoomFaceMode ? "🧍 全身を見る" : "😊 顔アップ";
  if (bodyEl) bodyEl.innerHTML = window.MF_SPRITES.portraitHTML(ch, zoomFaceMode ? "face-zoom" : "contain");
}

window.closePortraitZoom = function() {
  const modal = document.getElementById("modal-portrait-zoom");
  if (modal) modal.classList.remove("active");
};

window.MF_SPRITES = {
  esc(s) {
    return String(s || "").replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    }[c]));
  },

  resolveFirstSrc(base) {
    const cached = window.MF_RESOLVED_IMG_SRC && window.MF_RESOLVED_IMG_SRC[base];
    return cached || `${base}.jpg?v=${window.MF_IMG_VER}`;
  },

  portraitHTML(ch, mode = "contain") {
    const st = typeof state !== "undefined" ? state : null;
    const isProtag = Boolean(
      ch && (ch.isProtagonist || ch.id === "protagonist" || (st && ch.name === st.playerName))
    );
    const rawSid = (ch && (ch.styleId || ch.style))
      || (st && (st.styleId || st.protagonistStyle || st.avatarStyle || `${st.gender || ""}_${st.personality || ""}`))
      || "m_cool";
    const sid = normalizeProtagStyleId(rawSid);
    const base = isProtag ? `assets/protagonist_${sid}` : `assets/${ch.id}`;
    const firstSrc = this.resolveFirstSrc(base);
    const alt = this.esc(ch.name);

    if (mode === "icon" || mode === "icon-lg") {
      const cls = mode === "icon-lg" ? "avatar-thumb lg" : "avatar-thumb";
      return `
        <div class="${cls}">
          <img class="portrait-img-face" src="${firstSrc}" data-base="${base}" data-protag="${isProtag ? "1" : "0"}" data-step="0"
               alt="${alt}" onerror="mfImgFallback(this)" />
          <div class="avatar-fallback" style="display:none;">${ch.emoji || "👤"}</div>
        </div>
      `;
    }

    const clsMap = {
      hero: "portrait-img-hero",
      contain: "portrait-img-contain",
      "face-zoom": "portrait-img-face-zoom",
      cutin: "portrait-img-face",
      full: "portrait-img-contain"
    };
    const imgCls = clsMap[mode] || "portrait-img-contain";
    return `
      <img class="${imgCls}" src="${firstSrc}" data-base="${base}" data-protag="${isProtag ? "1" : "0"}" data-step="0"
           alt="${alt}" onerror="mfImgFallback(this)" />
      <div class="portrait-fallback" style="display:none;">
        <span style="font-size:52px;">${ch.emoji || "👤"}</span>
        <span style="font-size:12px; font-weight:900;">${alt}</span>
      </div>
    `;
  },

  enemyHTML(en, mode = "stage") {
    if (!en) return "";
    const base = `assets/${en.id}`;
    const firstSrc = this.resolveFirstSrc(base);
    const alt = this.esc(en.name);

    if (mode === "thumb") {
      return `
        <div class="enemy-thumb">
          <img class="enemy-thumb-img" src="${firstSrc}" data-base="${base}" data-protag="0" data-step="0"
               alt="${alt}" onerror="mfImgFallback(this)" />
          <div class="enemy-thumb-fallback" style="display:none;">${en.emoji || "👾"}</div>
        </div>
      `;
    }

    return `
      <img class="enemy-stage-img" src="${firstSrc}" data-base="${base}" data-protag="0" data-step="0"
           alt="${alt}" onerror="mfImgFallback(this)" />
      <div class="stage-enemy-emoji" style="display:none;">${en.emoji || "👾"}</div>
    `;
  }
};
