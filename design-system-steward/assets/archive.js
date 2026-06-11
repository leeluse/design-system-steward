/* ============================================================
   archive.js — Design System Steward archive engine v2. No modification needed.
   Two spaces: type "workspace" (screen) | "component" (part)
   Simply register using Archive.add({...}) in components.js.
   ============================================================ */
(function () {
  "use strict";
  const items = [];
  let current = null;

  window.Archive = { add: function (c) { c.type = c.type || "component"; items.push(c); } };

  document.addEventListener("DOMContentLoaded", function () {
    renderList("");
    document.getElementById("search").addEventListener("input", function (e) {
      renderList(e.target.value.trim().toLowerCase());
    });
    const firstWs = items.find(function (x) { return x.type === "workspace"; });
    if (firstWs) select(firstWs.id); else if (items.length) select(items[0].id);
    setupMeasure();
    window.addEventListener("resize", function () { if (current && current.type === "workspace") fitFrame(); });
  });

  /* ── Left list: Workspaces section → Components section (grouped by category) ── */
  function renderList(q) {
    const nav = document.getElementById("list");
    nav.innerHTML = "";
    const match = function (c) {
      return !q || c.name.toLowerCase().includes(q) || (c.category || "").toLowerCase().includes(q) || (c.route || "").toLowerCase().includes(q);
    };
    const ws = items.filter(function (c) { return c.type === "workspace" && match(c); });
    const comps = items.filter(function (c) { return c.type === "component" && match(c); });
    document.getElementById("count").textContent = ws.length + " ws · " + comps.length + " comp";

    if (ws.length) {
      nav.appendChild(groupEl("Workspaces"));
      ws.forEach(function (c) { nav.appendChild(itemEl(c, c.route || "")); });
    }
    if (comps.length) {
      nav.appendChild(groupEl("Components"));
      const groups = {};
      comps.forEach(function (c) { const g = c.category || "Etc"; (groups[g] = groups[g] || []).push(c); });
      Object.keys(groups).sort().forEach(function (g) {
        const sub = groupEl(g); sub.classList.add("sub"); nav.appendChild(sub);
        groups[g].forEach(function (c) { nav.appendChild(itemEl(c, "")); });
      });
    }
  }

  function groupEl(t) { const d = document.createElement("div"); d.className = "group"; d.textContent = t; return d; }

  function itemEl(c, sub) {
    const a = document.createElement("a");
    a.href = "#" + c.id; a.dataset.id = c.id;
    if (current && current.id === c.id) a.className = "active";
    a.innerHTML = "<span>" + esc(c.name) + (sub ? ' <em class="route">' + esc(sub) + "</em>" : "") +
      '</span><span class="dot" data-s="' + (c.status || "draft") + '"></span>';
    a.addEventListener("click", function (e) { e.preventDefault(); select(c.id); });
    return a;
  }

  /* ── Select → Render canvas + spec ── */
  function select(id) {
    const c = items.find(function (x) { return x.id === id; });
    if (!c) return;
    current = c;
    document.querySelectorAll(".list a").forEach(function (a) { a.classList.toggle("active", a.dataset.id === id); });
    document.getElementById("comp-name").textContent = c.name + (c.route ? "  ·  " + c.route : "");
    const badge = document.getElementById("comp-status");
    badge.textContent = c.status || "draft"; badge.dataset.s = c.status || "draft";

    const canvas = document.getElementById("canvas");
    canvas.classList.toggle("ws", c.type === "workspace");

    if (c.type === "workspace") {
      /* Inject CSS of components registered in 'uses' → Workspace 'assembles' components */
      const usedCss = (c.uses || []).map(function (uid) {
        const u = items.find(function (x) { return x.id === uid; });
        return u ? u.css : "";
      }).join("\n");
      canvas.innerHTML = '<div class="ws-frame" id="ws-frame"><style>' + usedCss + (c.css || "") + "</style>" + c.html + "</div>";
      fitFrame();
    } else {
      canvas.innerHTML = "<style>" + (c.css || "") + "</style>" + c.html;
    }
    renderSpec(c, canvas);
  }

  function fitFrame() {
    const canvas = document.getElementById("canvas");
    const frame = document.getElementById("ws-frame");
    if (!frame) return;
    const scale = Math.min(1, (canvas.clientWidth - 64) / 1080);
    frame.style.transform = "scale(" + scale + ")";
    frame.style.marginBottom = (scale < 1 ? -(1 - scale) * frame.offsetHeight : 0) + "px";
  }

  /* ── Right spec: (Route/Uses first for workspace) + Colors/Size/Spacing ── */
  function renderSpec(c, canvas) {
    const root = firstElement(canvas.querySelector(".ws-frame") || canvas);
    const auto = autoExtract(root);
    const merged = {
      colors: Object.assign({}, auto.colors, (c.spec || {}).colors),
      size: Object.assign({}, auto.size, (c.spec || {}).size),
      spacing: Object.assign({}, auto.spacing, (c.spec || {}).spacing)
    };
    const panel = document.getElementById("inspect");
    let html = "";
    if (c.type === "workspace") {
      html += '<h3>Route</h3><div class="spec-row"><span class="v">' + esc(c.route || "—") + "</span></div>";
      html += "<h3>Uses</h3>";
      if (c.uses && c.uses.length) {
        c.uses.forEach(function (uid) {
          const u = items.find(function (x) { return x.id === uid; });
          html += '<div class="spec-row"><a href="#" class="use-link" data-id="' + esc(uid) + '">' +
            esc(u ? u.name : uid) + "</a>" +
            (u ? '<span class="dot" data-s="' + (u.status || "draft") + '"></span>' : "") + "</div>";
        });
      } else html += '<div class="empty">—</div>';
    } else if (c.workspace) {
      const w = items.find(function (x) { return x.id === c.workspace; });
      html += '<h3>Workspace</h3><div class="spec-row"><a href="#" class="use-link" data-id="' + esc(c.workspace) + '">' +
        esc(w ? w.name : c.workspace) + "</a></div>";
    }
    html += section("Colors", merged.colors, true) + section("Size", merged.size, false) +
      section("Padding · Margin", merged.spacing, false) +
      (c.note ? '<h3>Note</h3><div class="empty" style="color:#6b7280">' + esc(c.note) + "</div>" : "");
    panel.innerHTML = html;
    panel.querySelectorAll(".use-link").forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); select(a.dataset.id); });
    });
  }

  function section(title, obj, isColor) {
    let rows = "";
    for (const k in obj) {
      const v = obj[k];
      if (v == null || v === "") continue;
      rows += '<div class="spec-row"><span class="k">' + esc(k) + '</span><span class="v">' +
        (isColor ? '<span class="swatch" style="background:' + esc(v) + '"></span>' : "") + esc(v) + "</span></div>";
    }
    return "<h3>" + title + "</h3>" + (rows || '<div class="empty">—</div>');
  }

  function autoExtract(el) {
    if (!el) return { colors: {}, size: {}, spacing: {} };
    const cs = getComputedStyle(el);
    return {
      colors: {
        background: toHex(cs.backgroundColor), text: toHex(cs.color),
        border: cs.borderWidth !== "0px" ? toHex(cs.borderColor) : null
      },
      size: {
        width: el.offsetWidth + "px", height: el.offsetHeight + "px",
        radius: cs.borderRadius, font: cs.fontSize + " / " + cs.fontWeight
      },
      spacing: {
        padding: shorthand(cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft),
        margin: shorthand(cs.marginTop, cs.marginRight, cs.marginBottom, cs.marginLeft),
        gap: cs.gap && cs.gap !== "normal" ? cs.gap : null
      }
    };
  }

  function shorthand(t, r, b, l) {
    if (t === r && r === b && b === l) return t;
    if (t === b && r === l) return t + " " + r;
    return t + " " + r + " " + b + " " + l;
  }

  function toHex(rgb) {
    const m = rgb && rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!m) return rgb;
    if (m[4] !== undefined && parseFloat(m[4]) === 0) return null;
    const hex = "#" + [m[1], m[2], m[3]].map(function (x) { return (+x).toString(16).padStart(2, "0"); }).join("").toUpperCase();
    return m[4] !== undefined && parseFloat(m[4]) < 1 ? hex + " / " + Math.round(parseFloat(m[4]) * 100) + "%" : hex;
  }

  function firstElement(box) {
    for (const n of box.children) if (n.tagName !== "STYLE") return n;
    return null;
  }

  function setupMeasure() {
    const tip = document.createElement("div");
    tip.id = "measure-tip"; document.body.appendChild(tip);
    document.addEventListener("keydown", function (e) { if (e.key === "Alt") document.body.classList.add("measuring"); });
    document.addEventListener("keyup", function (e) {
      if (e.key === "Alt") { document.body.classList.remove("measuring"); tip.style.display = "none"; }
    });
    document.addEventListener("mousemove", function (e) {
      if (!document.body.classList.contains("measuring")) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el || !el.closest(".canvas") || el.classList.contains("canvas")) { tip.style.display = "none"; return; }
      const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      tip.textContent = Math.round(r.width) + " × " + Math.round(r.height) + "\n" +
        "pad " + shorthand(cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft) + "\n" +
        "mar " + shorthand(cs.marginTop, cs.marginRight, cs.marginBottom, cs.marginLeft);
      tip.style.display = "block";
      tip.style.left = e.clientX + 14 + "px"; tip.style.top = e.clientY + 14 + "px";
    });
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
})();
