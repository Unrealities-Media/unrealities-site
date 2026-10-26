/* Shared art for every page: procedural disc label, Tom's own img/<key>.(jpg|png), or the fetched cover in the record's
   "art" (tools/art/fetch_art.py, credited per file). */
(() => {
  const CAT_COLORS = {
    "Laserdisc arcade": ["#FF2A3C", "#5CF27A"], "Laserdisc port": ["#FF2A3C", "#FFD23F"], "Digital Pictures": ["#1E5BFF", "#3AE0FF"], "American Laser Games": ["#B8702B", "#FFD23F"],
    "Sega FMV": ["#1E5BFF", "#F4F4F8"], "Interactive movie": ["#7A2BFF", "#3AE0FF"], "Pre-rendered CG": ["#1E9ABF", "#5CF27A"],
    "FMV adventure": ["#5A2BB8", "#FF2A3C"], "Game show / trivia": ["#FF8A00", "#FFD23F"], "Sports w/ FMV": ["#2B8A3E", "#5CF27A"],
    "Cutscenes only": ["#4A4A66", "#9AA0B4"], "Post-cancellation release": ["#8A2B6E", "#FF6FD8"], "Prototype": ["#333348", "#9A7BFF"],
  };
  const hash = s => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  const labelSVG = g => {
    const [a, b] = CAT_COLORS[g.category] || ["#1E5BFF", "#3AE0FF"];
    const h = hash(g.key); const rot = h % 360; const rings = 3 + (h % 4);
    const initials = g.title.replace(/^(the|a) /i, "").split(/[\s:]+/).filter(Boolean).slice(0, 3).map(w => w[0].toUpperCase()).join("");
    let ringEls = "";
    for (let i = 0; i < rings; i++) { const r = 44 - i * (30 / rings); ringEls += `<circle cx="50" cy="50" r="${r.toFixed(1)}" fill="none" stroke="${i % 2 ? a : b}" stroke-width="${(30 / rings / 2).toFixed(1)}" opacity=".55"/>`; }
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="">
      <defs><pattern id="d${h}" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="2" height="2" fill="#000" opacity=".35"/><rect x="2" y="2" width="2" height="2" fill="#000" opacity=".35"/></pattern></defs>
      <rect width="100" height="100" fill="${a}"/>
      <g transform="rotate(${rot} 50 50)"><rect x="-20" y="38" width="140" height="24" fill="${b}" opacity=".9"/></g>
      ${ringEls}
      <rect width="100" height="100" fill="url(#d${h})"/>
      <circle cx="50" cy="50" r="13" fill="#0C0C12"/><circle cx="50" cy="50" r="5" fill="#161624"/>
      <text x="50" y="86" text-anchor="middle" font-family="'Press Start 2P', monospace" font-size="9" fill="#F4F4F8" stroke="#0C0C12" stroke-width="2" paint-order="stroke">${initials}</text>
    </svg>`;
  };
  // Art files Tom supplied, listed in img/index.json, so a page with 800 games doesn't ask the server for 1,600 images that
  // aren't there. Anything not listed keeps the procedural label.
  const supplied = fetch("img/index.json", { cache: "no-cache" }).then(r => r.ok ? r.json() : []).then(list => new Set(list)).catch(() => new Set());
  // Labels are drawn when they come near the screen, so a list of 900 games doesn't build 900 SVGs up front.
  const pending = new WeakMap();
  const io = "IntersectionObserver" in window && new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) { io.unobserve(e.target); draw(e.target, ...pending.get(e.target)); }
  }, { rootMargin: "800px 0px" });
  // opts.label keeps the drawn label (Channel's spinning disc).
  const artInto = (el, g, opts = {}) => {
    if (!io) return draw(el, g, opts);
    pending.set(el, [g, opts]); io.observe(el);
  };
  const draw = (el, g, opts = {}) => {
    el.innerHTML = labelSVG(g);
    if (opts.label) return;
    supplied.then(files => {
      const own = [`${g.key}.jpg`, `${g.key}.png`].find(f => files.has(f));
      const file = own || g.art?.cover?.file;
      if (!file) return;
      const img = new Image();
      img.alt = ""; img.decoding = "async";  // not loading="lazy": a detached lazy image never loads
      if (!own) img.className = "cover";
      img.onload = () => { el.innerHTML = ""; el.appendChild(img); };
      img.src = "img/" + file;
    });
  };
  // Cover and pictures with their credits, for the drawer and Channel. Each links to the file's source page.
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const credit = it => [esc(it.source), esc(it.license), it.credit && esc(it.credit)].filter(Boolean).join(" · ");
  const fig = (it, label, cls) => `<figure class="art-fig ${cls}"><a href="${esc(it.page)}" target="_blank" rel="noopener"><img src="img/${esc(it.file)}" alt="${esc(label)}" loading="lazy" decoding="async"></a>
    <figcaption>${esc(label)}. ${credit(it)}</figcaption></figure>`;
  const galleryHTML = g => {
    const a = g.art; if (!a) return "";
    const items = [a.cover && fig(a.cover, "Cover", "is-cover"), ...(a.shots || []).map((s, i) => fig(s, s.title ? s.title.replace(/\.$/, "") : `Picture ${i + 1}`, "is-shot"))].filter(Boolean);
    return items.length ? `<div class="art-gallery">${items.join("")}</div>` : "";
  };
  window.FMVArt = { CAT_COLORS, labelSVG, artInto, galleryHTML };
})();
