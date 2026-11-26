window.MF_SPRITES = {
  // キャラごとの見た目・配色・アニメ設定（後から立ち絵や差分を追加しやすい構造）
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

  getVisual(charId) {
    return this.APPEARANCE[charId] || { hair: "#4a4e69", accent: "#ffd000", ear: "none", pose: "sword" };
  },

  // フィールド上のちびキャラ（SD）＆モーション描画
  drawChibiUnit(ctx, opts) {
    const { x, y, charId, element, time, stateAnim, facing, isEnemy, emoji, label, hpRatio } = opts;
    const bob = Math.sin(time * (stateAnim === "move" ? 16 : 6)) * (stateAnim === "move" ? 4 : 2);
    const atkThrust = stateAnim === "attack" ? facing * 12 : 0;
    const dodgeAlpha = stateAnim === "dodge" ? 0.55 : 1.0;

    ctx.save();
    ctx.globalAlpha = dodgeAlpha;

    // 足元の影
    ctx.fillStyle = "rgba(0, 0, 0, 0.38)";
    ctx.beginPath();
    ctx.ellipse(x, y + 20, isEnemy ? 26 : 16, isEnemy ? 10 : 6, 0, 0, Math.PI * 2);
    ctx.fill();

    if (isEnemy) {
      // 敵・主霧獣ユニット描画
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

      // 属性オーラリング
      ctx.strokeStyle = elColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(x, y + 19, 19, 7, 0, 0, Math.PI * 2);
      ctx.stroke();

      // 体（ジャケット）
      ctx.fillStyle = vis.accent;
      ctx.strokeStyle = "#121318";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(ux - 10, uy - 4, 20, 18, 6);
      ctx.fill();
      ctx.stroke();

      // 頭部
      ctx.fillStyle = "#ffe5d9";
      ctx.beginPath();
      ctx.arc(ux, uy - 14, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 髪＆ケモミミ装飾
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

      // 武器斬撃エフェクト
      if (stateAnim === "attack") {
        ctx.strokeStyle = elColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(ux + facing * 14, uy - 4, 18, -0.9, 0.9);
        ctx.stroke();
      }
    }

    // 頭上ネーム＆ミニHPバー
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
