window.MF_IMG_VER = "230";
let zoomCharId = null;
let zoomFaceMode = true;

window.mfImgFallback = function(img) {
  const step = Number(img.dataset.step || 0);
  const base = img.dataset.base || "";
  const fb = img.dataset.fb || "";
  const v = window.MF_IMG_VER;
  const list = [
    base + ".png?v=" + v,
    base + ".jpeg?v=" + v,
    fb ? fb + ".jpg?v=" + v : "",
    fb ? fb + ".png?v=" + v : "",
    fb ? fb + ".jpeg?v=" + v : ""
  ].filter(Boolean);

  if (step < list.length) {
    img.dataset.step = String(step + 1);
    img.src = list[step];
  } else {
    img.style.display = "none";
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

  // mode: "hero"(ホーム大立ち絵) / "contain"(全身) / "face-zoom"(顔アップ拡大) / "cutin"(顔カットイン) / "icon" / "icon-lg"
  portraitHTML(ch, mode = "contain") {
    const sid = ch.styleId || (typeof state !== "undefined" ? state.styleId : "m_cool") || "m_cool";
    const base = ch.isProtagonist ? `assets/protagonist_${sid}` : `assets/${ch.id}`;
    const fb = ch.isProtagonist ? "assets/protagonist" : "";
    const firstSrc = `${base}.jpg?v=${window.MF_IMG_VER}`;
    const alt = this.esc(ch.name);

    if (mode === "icon" || mode === "icon-lg") {
      const cls = mode === "icon-lg" ? "avatar-thumb lg" : "avatar-thumb";
      return `
        <div class="${cls}">
          <img class="portrait-img-face" src="${firstSrc}" data-base="${base}" data-fb="${fb}" data-step="0"
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
      <img class="${imgCls}" src="${firstSrc}" data-base="${base}" data-fb="${fb}" data-step="0"
           alt="${alt}" onerror="mfImgFallback(this)" />
      <div class="portrait-fallback" style="display:none;">
        <span style="font-size:52px;">${ch.emoji || "👤"}</span>
        <span style="font-size:12px; font-weight:900;">${alt}</span>
      </div>
    `;
  }
};
