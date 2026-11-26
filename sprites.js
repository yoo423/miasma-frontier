window.MF_IMG_VER = "170";

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

window.openPortraitZoom = function(charId) {
  const modal = document.getElementById("modal-portrait-zoom");
  if (!modal || typeof getCharProfile !== "function") return;
  const ch = getCharProfile(charId);
  const titleEl = document.getElementById("zoom-char-title");
  const bodyEl = document.getElementById("zoom-img-body");
  if (titleEl) titleEl.textContent = `${ch.name}（${ch.rarity}）`;
  if (bodyEl) bodyEl.innerHTML = window.MF_SPRITES.portraitHTML(ch, "contain");
  modal.classList.add("active");
  if (typeof playSfx === "function") playSfx("tap");
};

window.closePortraitZoom = function() {
  const modal = document.getElementById("modal-portrait-zoom");
  if (modal) modal.classList.remove("active");
};

window.MF_SPRITES = {
  APPEARANCE: {
    protagonist: { hair: "#3d405b", accent: "#00e5ff", ear: "none",   pose: "command" },
    lunaria:     { hair: "#3b231e", accent: "#ff4d5a", ear: "ribbon", pose: "greatsword" },
    mikoto:      { hair: "#f4f7fb", accent: "#4cc9f0", ear: "fox",    pose: "staff" },
    celestia:    { hair: "#2b2d42", accent: "#ffd000", ear: "none",   pose: "sniper" },
    valeria:     { hair: "#e0e6f0", accent: "#1982c4", ear: "none",   pose: "spear" },
    chloe:       { hair: "#c77dff", accent: "#e0aaff", ear: "none",   pose: "command" },
    sylphy:      { hair: "#6c757d", accent: "#2ec4b6", ear: "wolf",   pose: "dual" },
    koharu:      { hair: "#ffe082", accent: "#ff9f1c", ear: "fox",    pose: "hammer" },
    fiona:       { hair: "#90e0ef", accent: "#48cae4", ear: "none",   pose: "gun" },
    noah:        { hair: "#2b2d42", accent: "#2ec4b6", ear: "cat",    pose: "sword" },
    leila:       { hair: "#dee2e6", accent: "#4cc9f0", ear: "none",   pose: "sniper" },
    kaede:       { hair: "#5c3a21", accent: "#ff595e", ear: "none",   pose: "sword" },
    melissa:     { hair: "#f72585", accent: "#ffca3a", ear: "none",   pose: "staff" },
    belle:       { hair: "#bde0fe", accent: "#1982c4", ear: "rabbit", pose: "staff" },
    ran:         { hair: "#22223b", accent: "#b565ff", ear: "none",   pose: "spear" },
    momo:        { hair: "#8d5b4c", accent: "#ff7b39", ear: "dog",    pose: "dual" },
    mint:        { hair: "#edf6f9", accent: "#2ec4b6", ear: "rabbit", pose: "sniper" },
    aoi:         { hair: "#3a5a40", accent: "#b565ff", ear: "none",   pose: "gun" }
  },

  esc(s) {
    return String(s || "").replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
    }[c]));
  },

  getVisual(charId) {
    return this.APPEARANCE[charId] || { hair: "#4a4e69", accent: "#ffd000", ear: "none", pose: "sword" };
  },

  // 立ち絵＆サムネイル共通HTML生成（assets/<id>.jpg / .png / .jpeg を自動読込）
  portraitHTML(ch, mode = "full") {
    const sid = ch.styleId || (typeof state !== "undefined" ? state.styleId : "m_cool") || "m_cool";
    const base = ch.isProtagonist ? `assets/protagonist_${sid}` : `assets/${ch.id}`;
    const fb = ch.isProtagonist ? "assets/protagonist" : "";
    const firstSrc = `${base}.jpg?v=${window.MF_IMG_VER}`;
    const alt = this.esc(ch.name);

    if (mode === "icon" || mode === "icon-lg") {
      const cls = mode === "icon-lg" ? "avatar-thumb lg" : "avatar-thumb";
      return `
        <div class="${cls}">
          <img class="portrait-img-icon" src="${firstSrc}" data-base="${base}" data-fb="${fb}" data-step="0"
               alt="${alt}" onerror="mfImgFallback(this)" />
          <div class="avatar-fallback" style="display:none;">${ch.emoji || "👤"}</div>
        </div>
      `;
    }

    const imgCls = mode === "contain" ? "portrait-img-contain" : "portrait-img-full";
    return `
      <img class="${imgCls}" src="${firstSrc}" data-base="${base}" data-fb="${fb}" data-step="0"
           alt="${alt}" onerror="mfImgFallback(this)" />
      <div class="portrait-fallback" style="display:none;">
        <span style="font-size:46px;">${ch.emoji || "👤"}</span>
        <span style="font-size:11px; font-weight:900;">${alt}</span>
      </div>
    `;
  },

  drawChibiUnit(ctx, opts) {
    const { x, y, charId, element, time, stateAnim, facing, isEnemy, emoji, label, hpRatio } = opts;
    const bob = Math.sin(time * (stateAnim === "move" ? 16 : 6)) * (stateAnim === "move" ? 4 : 2);
    const atkThrust = stateAnim === "attack" ? facing * 12 : 0;
    const dodgeAlpha = stateAnim === "dodge" ? 0.55 : 1.0;

    ctx.save();
    ctx.globalAlpha = dodgeAlpha;

    ctx.fillStyle = "rgba(0, 0, 0, 0.38)";
    ctx.beginPath();
    ctx.ellipse(x, y + 20, isEnemy ? 26 : 16, isEnemy ? 10 : 6, 0, 0, Math.PI * 2);
    ctx.fill();

    if (isEnemy) {
      const scale = opts.isBoss ? 1.45 : 1.05;
      ctx.font = `${Math.round(38 * scale)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(emoji || "🐺", x + atkThrust, y - 6 + bob);
    } else {
      const vis = this.getVisual(charId);
      const elColor = window.MF_DATA.ELEMENTS[element]?.color || "#ffd000";
      const ux = x + atkThrust;
      const uy = y + bob;

      ctx.strokeStyle = elColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(x, y + 19, 19, 7, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = vis.accent;
      ctx.strokeStyle = "#121318";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(ux - 10, uy - 4, 20, 18, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffe5d9";
      ctx.beginPath();
      ctx.arc(ux, uy - 14, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = vis.hair;
      ctx.beginPath();
      ctx.arc(ux, uy - 17, 11.5, Math.PI, 0);
      ctx.fill();

      if (vis.ear === "ribbon") {
        ctx.fillStyle = "#ff4d5a";
        ctx.beginPath();
        ctx.moveTo(ux, uy - 26); ctx.lineTo(ux - 9, uy - 32); ctx.lineTo(ux - 7, uy - 22);
        ctx.moveTo(ux, uy - 26); ctx.lineTo(ux + 9, uy - 32); ctx.lineTo(ux + 7, uy - 22);
        ctx.fill();
      } else if (vis.ear === "fox" || vis.ear === "cat" || vis.ear === "wolf") {
        ctx.fillStyle = vis.hair;
        ctx.beginPath();
        ctx.moveTo(ux - 9, uy - 22); ctx.lineTo(ux - 6, uy - 34); ctx.lineTo(ux - 1, uy - 24);
        ctx.moveTo(ux + 9, uy - 22); ctx.lineTo(ux + 6, uy - 34); ctx.lineTo(ux + 1, uy - 24);
        ctx.fill();
      } else if (vis.ear === "rabbit") {
        ctx.fillStyle = vis.hair;
        ctx.beginPath();
        ctx.ellipse(ux - 5, uy - 31, 3, 9, -0.15, 0, Math.PI * 2);
        ctx.ellipse(ux + 5, uy - 30, 3, 9, 0.35, 0, Math.PI * 2);
        ctx.fill();
      } else if (vis.ear === "dog") {
        ctx.fillStyle = vis.hair;
        ctx.beginPath();
        ctx.ellipse(ux - 11, uy - 18, 4, 7, 0.35, 0, Math.PI * 2);
        ctx.ellipse(ux + 11, uy - 18, 4, 7, -0.35, 0, Math.PI * 2);
        ctx.fill();
      }

      if (stateAnim === "attack") {
        ctx.strokeStyle = elColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(ux + facing * 14, uy - 4, 18, -0.9, 0.9);
        ctx.stroke();
      }
    }

    if (label) {
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(label, x, y - (isEnemy ? 34 : 38));
    }
    if (typeof hpRatio === "number") {
      const bw = isEnemy ? 48 : 32;
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.fillRect(x - bw / 2, y + 25, bw, 4);
      ctx.fillStyle = isEnemy ? "#ff595e" : "#18b88a";
      ctx.fillRect(x - bw / 2, y + 25, bw * Math.max(0, Math.min(1, hpRatio)), 4);
    }
    ctx.restore();
  }
};
