const BASE_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
const groupOf = (l) => {
  const id = l.id;
  if (l.type === "background") return "background";
  if (/residential/.test(id)) return "residential";
  if (/^park/.test(id)) return "park";
  if (/wood/.test(id)) return "wood";
  if (/grass|wetland|pitch|track|cemetery|hospital|school|sand/.test(id)) return "grass";
  if (id === "water") return "water";
  if (/^waterway/.test(id) && l.type === "line") return "waterLine";
  if (/^building/.test(id)) return "building";
  if (/rail/.test(id) && l.type === "line") return "rail";
  if (/casing/.test(id)) return "roadCasing";
  if (/motorway|trunk|primary|secondary|tertiary/.test(id) && l.type === "line") return "roadMajor";
  if (/minor|street|service|link|path|pedestrian|aeroway/.test(id) && l.type === "line") return "roadMinor";
  if (/boundary/.test(id)) return "boundary";
  if (/water_name|waterway_line_label/.test(id)) return "waterLabel";
  if (l.type === "symbol") return "label";
  return null;
};
// Seasonal icons, drawn on a canvas at 2x and added to the map on demand.
const ICON_SIZE = 48;
const ICONS = {
  snowflake(g) {
    g.fillStyle = "#ffffff"; g.beginPath(); g.arc(24, 24, 21, 0, 7); g.fill();
    g.strokeStyle = "#4f86b8"; g.lineWidth = 3.2; g.lineCap = "round";
    for (let i = 0; i < 6; i++) {
      g.save(); g.translate(24, 24); g.rotate(i * Math.PI / 3);
      g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -16);
      g.moveTo(0, -9); g.lineTo(-5, -14); g.moveTo(0, -9); g.lineTo(5, -14);
      g.stroke(); g.restore();
    }
  },
  pine(g) {
    g.fillStyle = "#ffffff"; g.beginPath(); g.arc(24, 24, 21, 0, 7); g.fill();
    g.fillStyle = "#6b4a33"; g.fillRect(21.5, 33, 5, 7);
    g.fillStyle = "#3f7564";
    for (const [y, w] of [[7, 9], [15, 13], [23, 16]]) { g.beginPath(); g.moveTo(24, y); g.lineTo(24 - w, y + 12); g.lineTo(24 + w, y + 12); g.closePath(); g.fill(); }
    g.fillStyle = "#ffffff";
    for (const [y, w] of [[7, 9], [15, 13], [23, 16]]) { g.beginPath(); g.moveTo(24, y); g.lineTo(24 - w * 0.45, y + 5.5); g.lineTo(24 + w * 0.45, y + 5.5); g.closePath(); g.fill(); }
  },
  "leaf-orange"(g) { leaf(g, "#e2771f", "#fff4e4"); },
  "leaf-rust"(g) { leaf(g, "#a8401c", "#fff4e4"); },
  pumpkin(g) {
    g.fillStyle = "#ff8a1f";
    for (const [x, rx] of [[15, 11], [33, 11], [24, 12]]) { g.beginPath(); g.ellipse(x, 28, rx, 14, 0, 0, 7); g.fill(); }
    g.strokeStyle = "#c95d0a"; g.lineWidth = 2;
    for (const x of [18, 30]) { g.beginPath(); g.ellipse(x === 18 ? 21 : 27, 28, 5, 13, 0, 0, 7); g.stroke(); }
    g.fillStyle = "#4e7d2a"; g.fillRect(22, 8, 5, 8);
    g.fillStyle = "#2a1408";
    g.beginPath(); g.moveTo(14, 25); g.lineTo(20, 25); g.lineTo(17, 20); g.fill();
    g.beginPath(); g.moveTo(28, 25); g.lineTo(34, 25); g.lineTo(31, 20); g.fill();
    g.beginPath(); g.moveTo(14, 31); g.lineTo(34, 31); g.lineTo(30, 37); g.lineTo(18, 37); g.closePath(); g.fill();
  },
  bat(g) {
    g.fillStyle = "#c9a6ff";
    g.beginPath(); g.moveTo(24, 18);
    g.quadraticCurveTo(14, 8, 2, 16); g.quadraticCurveTo(7, 20, 6, 26); g.quadraticCurveTo(11, 22, 14, 28);
    g.quadraticCurveTo(18, 24, 24, 32);
    g.quadraticCurveTo(30, 24, 34, 28); g.quadraticCurveTo(37, 22, 42, 26); g.quadraticCurveTo(41, 20, 46, 16);
    g.quadraticCurveTo(34, 8, 24, 18); g.fill();
    g.beginPath(); g.moveTo(20, 17); g.lineTo(21, 11); g.lineTo(23, 16); g.lineTo(25, 16); g.lineTo(27, 11); g.lineTo(28, 17); g.fill();
    g.fillStyle = "#17141f"; g.beginPath(); g.arc(22, 19, 1.3, 0, 7); g.arc(26, 19, 1.3, 0, 7); g.fill();
  }
};
function leaf(g, fill, vein) {
  g.save(); g.translate(24, 24); g.rotate(-0.6);
  g.fillStyle = fill; g.beginPath(); g.moveTo(0, -20);
  g.bezierCurveTo(16, -12, 14, 10, 0, 17); g.bezierCurveTo(-14, 10, -16, -12, 0, -20); g.fill();
  g.strokeStyle = vein; g.lineWidth = 2; g.lineCap = "round";
  g.beginPath(); g.moveTo(0, -15); g.lineTo(0, 22);
  for (const y of [-8, -1, 6]) { g.moveTo(0, y + 4); g.lineTo(-7, y - 2); g.moveTo(0, y + 4); g.lineTo(7, y - 2); }
  g.stroke(); g.restore();
}
function drawIcon(name) {
  const c = document.createElement("canvas"); c.width = c.height = ICON_SIZE;
  const g = c.getContext("2d");
  g.shadowColor = "rgba(0,0,0,.25)"; g.shadowBlur = 3; g.shadowOffsetY = 1;
  ICONS[name](g);
  return g.getImageData(0, 0, ICON_SIZE, ICON_SIZE);
}
// Symbol layers that place the theme's icons on parks, woods and grass areas, below the labels.
// For polygons MapLibre puts each icon at the area's visual center; collisions keep it from crowding.
const ICON_LAYER_IDS = ["season-icons-park", "season-icons-edge", "season-icons-green"];
function iconLayers(theme, visible) {
  const [a, b] = theme.icons;
  const layout = {
    visibility: visible ? "visible" : "none",
    "icon-image": ["case", ["==", ["%", ["length", ["coalesce", ["get", "name"], ["get", "class"], "park"]], 2], 0], a, b],
    "icon-size": ["interpolate", ["linear"], ["zoom"], 10, 0.7, 13, 1, 16, 1.3],
    "icon-padding": 10, "icon-allow-overlap": false
  };
  return [
    { id: ICON_LAYER_IDS[0], type: "symbol", source: "openmaptiles", "source-layer": "park", minzoom: 10, layout },
    // Icons along the edges of parks and green areas, so large parks like Central Park get a ring of
    // icons instead of a single one. (City parks live in the landcover layer in this tile schema.)
    { id: ICON_LAYER_IDS[1], type: "symbol", source: "openmaptiles", "source-layer": "landcover", minzoom: 13,
      filter: ["match", ["get", "class"], ["wood", "grass"], true, false],
      layout: { ...layout, "symbol-placement": "line", "icon-image": ["match", ["get", "class"], "wood", a, b], "symbol-spacing": 150, "icon-rotation-alignment": "viewport", "icon-pitch-alignment": "viewport" } },
    { id: ICON_LAYER_IDS[2], type: "symbol", source: "openmaptiles", "source-layer": "landcover", minzoom: 12,
      filter: ["match", ["get", "class"], ["wood", "grass"], true, false],
      layout: { ...layout, "icon-image": ["match", ["get", "class"], "wood", a, b] } }
  ];
}
// Optional falling snow overlay. Never intercepts input; off for reduced motion.
const Snow = (() => {
  const cv = document.getElementById("fx"), g = cv.getContext("2d");
  let flakes = [], raf = 0, on = false;
  function resize() { const r = devicePixelRatio || 1; cv.width = innerWidth * r; cv.height = innerHeight * r; g.setTransform(r, 0, 0, r, 0, 0); }
  function seed() {
    const n = innerWidth < 600 ? 60 : 130;
    flakes = Array.from({ length: n }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: 1.6 + Math.random() * 2.4, s: 0.4 + Math.random() * 1.1, w: Math.random() * 6.28 }));
  }
  function frame() {
    g.clearRect(0, 0, innerWidth, innerHeight);
    g.fillStyle = "rgba(255,255,255,.9)"; g.strokeStyle = "rgba(60,95,130,.6)"; g.lineWidth = 0.9;
    for (const f of flakes) {
      f.y += f.s; f.w += 0.01; f.x += Math.sin(f.w) * 0.4;
      if (f.y > innerHeight + 4) { f.y = -4; f.x = Math.random() * innerWidth; }
      g.beginPath(); g.arc(f.x, f.y, f.r, 0, 7); g.fill(); g.stroke();
    }
    raf = requestAnimationFrame(frame);
  }
  function start() { if (on) return; on = true; resize(); seed(); raf = requestAnimationFrame(frame); }
  function stop() { on = false; cancelAnimationFrame(raf); g.clearRect(0, 0, cv.width, cv.height); }
  addEventListener("resize", () => { if (on) { resize(); seed(); } });
  document.addEventListener("visibilitychange", () => { if (!on) return; if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(frame); });
  return { start, stop };
})();
let baseStyle;
const optIcons = document.getElementById("opt-icons"), optSnow = document.getElementById("opt-snow"), snowWrap = document.getElementById("snow-wrap");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
function themedStyle(theme) {
  const s = structuredClone(baseStyle);
  if (!theme.colors) return s;
  const c = theme.colors;
  for (const l of s.layers) {
    const g = groupOf(l); if (!g) continue;
    l.paint = l.paint || {};
    if (l.type === "raster") { continue; }
    if (l.type === "background") l.paint["background-color"] = c.background;
    else if (l.type === "fill") {
      l.paint["fill-color"] = g === "building" ? c.building : (c[g] || c.background);
      if (g === "building") l.paint["fill-outline-color"] = c.buildingOutline;
      delete l.paint["fill-pattern"];
    } else if (l.type === "fill-extrusion") l.paint["fill-extrusion-color"] = c.building;
    else if (l.type === "line") l.paint["line-color"] = c[g] || c.roadMinor;
    else if (l.type === "symbol") {
      l.paint["text-color"] = g === "waterLabel" ? c.waterLabel : c.label;
      l.paint["text-halo-color"] = c.labelHalo;
    }
  }
  // dim the shaded-relief raster on dark themes
  const ne = s.layers.find(l => l.type === "raster");
  if (ne && theme.id === "halloween") { ne.paint = { ...(ne.paint||{}), "raster-opacity": 0.15 }; }
  if (theme.icons) {
    const firstLabel = s.layers.findIndex(l => l.type === "symbol");
    // Fade the stock transit icons so the seasonal ones stand out.
    const transit = s.layers.find(l => l.id === "poi_transit");
    if (transit) transit.paint = { ...(transit.paint || {}), "icon-opacity": 0.35, "text-opacity": 0.5 };
    s.layers.splice(firstLabel < 0 ? s.layers.length : firstLabel, 0, ...iconLayers(theme, optIcons.checked));
  }
  return s;
}
let map, current;
const themesEl = document.getElementById("themes"), descEl = document.getElementById("desc");
function select(id) {
  const t = THEMES.find(x => x.id === id) || THEMES[0];
  if (baseStyle) {
    if (!map) {
      map = new maplibregl.Map({ container: "map", style: themedStyle(t), center: matchMedia("(max-width: 600px)").matches ? [-73.9665, 40.7752] : [-73.9665, 40.7812], zoom: 14, attributionControl: false });
      map.addControl(new maplibregl.NavigationControl(), "top-right");
      map.on("styleimagemissing", (e) => { if (ICONS[e.id] && !map.hasImage(e.id)) map.addImage(e.id, drawIcon(e.id), { pixelRatio: 2 }); });
      // On phones the theme panel sits at the bottom, so keep the map credit visible at the top.
      map.addControl(new maplibregl.AttributionControl({ compact: false }), matchMedia("(max-width: 600px)").matches ? "top-left" : "bottom-right");
    } else map.setStyle(themedStyle(t), { diff: false });
  }
  for (const b of themesEl.children) { const on = b.dataset.id === t.id; b.setAttribute("aria-checked", String(on)); b.tabIndex = on ? 0 : -1; }
  descEl.textContent = t.desc;
  updateSnow(t);
  current = t.id;
  if (location.hash.slice(1) !== t.id) history.replaceState(null, "", "#" + t.id);
}
THEMES.forEach(t => {
  const b = document.createElement("button");
  b.type = "button"; b.setAttribute("role", "radio"); b.dataset.id = t.id;
  b.innerHTML = `<span class="sw">${t.swatch.map(c => `<span style="background:${c}"></span>`).join("")}</span>${t.name}`;
  b.addEventListener("click", () => select(t.id));
  b.addEventListener("keydown", (e) => {
    const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!d) return;
    e.preventDefault();
    const i = (THEMES.findIndex(x => x.id === t.id) + d + THEMES.length) % THEMES.length;
    select(THEMES[i].id); themesEl.children[i].focus();
  });
  themesEl.appendChild(b);
});
fetch(BASE_STYLE_URL).then(r => r.json()).then(s => { baseStyle = s; select(location.hash.slice(1) || "winter"); })
  .catch(() => { descEl.textContent = "Could not load the base map style. Check your connection and reload."; });
window.addEventListener("hashchange", () => { const id = location.hash.slice(1); if (id && id !== current) select(id); });
function updateSnow(t) {
  const canSnow = t.effect === "snow" && !reducedMotion.matches;
  snowWrap.hidden = !canSnow;
  if (canSnow && optSnow.checked) Snow.start(); else Snow.stop();
}
optIcons.addEventListener("change", () => {
  if (!map) return;
  for (const id of ICON_LAYER_IDS) if (map.getLayer(id)) map.setLayoutProperty(id, "visibility", optIcons.checked ? "visible" : "none");
});
optSnow.addEventListener("change", () => updateSnow(THEMES.find(x => x.id === current)));
reducedMotion.addEventListener("change", () => updateSnow(THEMES.find(x => x.id === current)));
