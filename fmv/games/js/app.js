/* FMV Index — games list and detail drawer. Data from data/games.json; tracker in localStorage, optionally seeded from data/tracker.json. */
(() => {
  const STORE_KEY = "segacd-fmv-tracker-v1";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = n => n == null ? "—" : "$" + Math.round(n).toLocaleString();
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  let games = [];
  let lineage = {};
  let tracker = {};
  let priceDate = "";
  let titanCount = 0;

  // ---------- persistence ----------
  const loadTracker = async () => {
    let seed = {};
    try { const r = await fetch("data/tracker.json", { cache: "no-cache" }); if (r.ok) seed = await r.json(); } catch {}
    let local = {};
    try { local = JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch {}
    // Local edits win over the committed seed; the seed fills in anything the browser hasn't seen.
    // Migrate pre-multi-system local keys ("10" -> "segacd-10").
    for (const k of Object.keys(local)) if (/^\d+$/.test(k)) { local["segacd-" + k] = local[k]; delete local[k]; }
    tracker = { ...seed, ...local };
  };
  const saveTracker = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(tracker)); } catch {} };
  const entry = key => tracker[key] || (tracker[key] = { owned: false, format: "", played: false, episode: "", recorded: "", uploaded: "", videoUrl: "", runtime: "", notes: "",
    challenge: "", capture: "", attempts: "", clears: "", pb: "", lastClear: "", srcRun: "", srcPlace: "" });
  const SPEEDRUN_FIELDS = ["challenge", "capture", "attempts", "clears", "pb", "lastClear", "srcRun", "srcPlace"];

  const { artInto, galleryHTML } = window.FMVArt;
  const { sysId, info: sysInfo, ordered, fillSelect } = window.FMVSystems;
  let sysNames = {};

  // ---------- stats ----------
  const inSystem = g => !$("#f-sys").value || sysId(g.key) === $("#f-sys").value;
  const renderStats = () => {
    const pool = games.filter(inSystem);
    const obtainable = pool.filter(g => g.status !== "NOT obtainable");
    const owned = obtainable.filter(g => entry(g.key).owned);
    const played = pool.filter(g => entry(g.key).played).length;
    const uploaded = pool.filter(g => entry(g.key).videoUrl).length;
    const unowned = obtainable.filter(g => !entry(g.key).owned);
    // PC is bought digitally, so its store price stands in for the disc price.
    const cost = (g, k) => g.priceDigital ?? g[k];
    const sum = k => unowned.some(g => cost(g, k) != null) ? money(unowned.reduce((a, g) => a + (cost(g, k) || 0), 0)) : "—";
    const unpriced = unowned.filter(g => cost(g, "priceLoose") == null && !g.priceStatus).length;
    $("#st-owned").textContent = owned.length;
    $("#st-total").textContent = obtainable.length;
    $("#st-played").textContent = played;
    $("#st-uploaded").textContent = uploaded;
    $("#st-loose").textContent = sum("priceLoose");
    $("#st-cib").textContent = sum("priceCib");
    $("#st-unpriced").textContent = unpriced ? `, not counting ${unpriced} with no price` : "";
    const pct = obtainable.length ? Math.round(100 * owned.length / obtainable.length) : 0;
    $("#st-scope").textContent = sysNames[$("#f-sys").value] || "all systems";
    $("#st-barfill").style.width = pct + "%";
    $(".stat-bar").setAttribute("aria-valuenow", pct);
  };

  // ---------- list ----------
  const gradeNum = s => { const m = /^(\d+)\s*\/\s*10/.exec(s || ""); return m ? +m[1] : null; };
  const pctNum = s => { const m = /^(\d+)%/.exec(s || ""); return m ? +m[1] : null; };

  const filtered = () => {
    const q = $("#q").value.trim().toLowerCase();
    const cat = $("#f-cat").value, region = $("#f-region").value, fmv = $("#f-fmv").value, cid = $("#f-cid").value, own = $("#f-own").value, run = $("#f-run").value;
    const sort = $("#f-sort").value;
    let out = games.filter(g => {
      if (!inSystem(g)) return false;
      if (cat && g.category !== cat) return false;
      if (region && !g[region]) return false;
      if (fmv) { const [lo, hi] = fmv.split("-").map(Number); if (g.fmv < lo || g.fmv > hi) return false; }
      if (cid && g.cidRisk !== cid) return false;
      const t = entry(g.key);
      if (own === "owned" && !t.owned) return false;
      if (own === "wanted" && (t.owned || g.status === "NOT obtainable")) return false;
      if (own === "played" && !t.played) return false;
      if (own === "unplayed" && !(t.owned && !t.played)) return false;
      if (own === "uploaded" && !t.videoUrl) return false;
      if (run) {
        const sr = speedrunOf(g);
        if (run === "pb" ? !t.pb : run === "board" ? !sr?.boards?.length : sr?.class !== run) return false;
      }
      if (q) {
        const hay = [g.title, g.alt, g.developer, g.publisher, g.cast, g.trivia, g.hook, g.genre, g.notes].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    const key = {
      title: g => g.title.replace(/^the /i, "").toLowerCase(), year: g => g.year ?? 9999,
      system: g => String(sysInfo(sysId(g.key)).rank).padStart(3, "0") + g.title.replace(/^the /i, "").toLowerCase(), fmv: g => -g.fmv,
      priceCib: g => -(g.priceCib ?? -1), priceLoose: g => -(g.priceLoose ?? -1),
      sega16: g => -(gradeNum(g.sega16) ?? -1), mobyCritic: g => -(pctNum(g.mobyCritic || g.critic) ?? -1),
      // By Titan rank, so a game's versions stay together: the recommended version first, then the rest in system order.
      titan: g => String(titanOf(g)?.rank ?? 99999).padStart(5, "0") + (isBest(g) ? 0 : 1) + String(sysInfo(sysId(g.key)).rank).padStart(3, "0"),
    }[sort];
    out.sort((a, b) => { const x = key(a), y = key(b); return x < y ? -1 : x > y ? 1 : a.title.localeCompare(b.title); });
    return out;
  };

  // Rows are built once and reused across filter changes; a tracker edit drops that game's row so it is rebuilt.
  const rowCache = new Map();
  let visibleLimit = 48, lastFilters = '';
  const renderList = (more = false) => {
    const filterKey = $$('.controls select, #q').map(el => el.value).join('\u0000');
    if (filterKey !== lastFilters) { visibleLimit = 48; lastFilters = filterKey; }
    if (more === true) visibleLimit += 48;
    const rows = filtered();
    const frag = document.createDocumentFragment();
    for (const g of rows.slice(0, visibleLimit)) {
      if (!rowCache.has(g.key)) rowCache.set(g.key, buildRow(g));
      frag.appendChild(rowCache.get(g.key));
    }
    $("#list").replaceChildren(frag);
    $("#result-count").textContent = !rows.length ? "No games match these filters." : `Showing ${Math.min(visibleLimit, rows.length)} of ${rows.length} matching release records`;
    $("#list-more").hidden = visibleLimit >= rows.length;
    $("#list-more").textContent = `Show ${Math.min(48, rows.length - visibleLimit)} more releases`;
  };
  const buildRow = g => {
    const t = entry(g.key);
    const li = $("#row-tpl").content.firstElementChild.cloneNode(true);
    li.dataset.key = g.key;
    if (t.owned) li.classList.add("owned");
    if (g.status === "NOT obtainable") li.classList.add("unobtainable");
    artInto($(".thumb", li), g);
    $(".t", li).textContent = g.title;
    $(".alt", li).textContent = g.alt || "";
    $(".year", li).textContent = g.year ?? "Year unknown";
    $(".sys", li).innerHTML = `<i class="sysdot" style="--sys:${sysInfo(sysId(g.key)).color}"></i>${esc(g.system)}`;
    $(".cat", li).textContent = g.category;
    $(".regions", li).textContent = [g.na && "NA", g.jp && "JP", g.eu && "EU", g.x32 && "32X CD"].filter(Boolean).join(" ");
    $(".meter b", li).style.width = (g.fmv * 10) + "%";
    $(".n", li).textContent = g.fmv;
    const price = $(".row-price", li);
    price.innerHTML = g.priceDigital != null ? `${money(g.priceDigital)}<small>on ${esc(g.digitalStore)}</small>`
      : g.priceCib != null ? `${money(g.priceCib)}<small>${money(g.priceLoose)} loose</small>`
      : `<small>${sysId(g.key) === "laserdisc" ? "arcade board" : g.priceStatus ? "no market" : "no price"}</small>`;
    const grade = $(".row-grade", li);
    if (g.sega16) { const gn = gradeNum(g.sega16); grade.textContent = g.sega16; grade.title = "Sega-16 grade";
      if (gn != null && gn >= 7) grade.classList.add("good"); if (gn != null && gn <= 3) grade.classList.add("bad"); }
    else if (g.mobyCritic || g.critic) { const pn = pctNum(g.mobyCritic || g.critic); grade.textContent = g.mobyCritic || g.critic;
      grade.title = g.mobyCritic ? "MobyGames critics" : "Critics: " + (g.criticSrc || "other sources");
      if (pn != null && pn >= 70) grade.classList.add("good"); if (pn != null && pn < 50) grade.classList.add("bad"); }
    else grade.textContent = "–";
    $(".row-titan", li).innerHTML = titanBadge(titanOf(g));
    const flags = $(".row-flags", li);
    const flag = (cls, txt) => { const s = document.createElement("span"); s.className = "flag " + cls; s.textContent = txt; flags.appendChild(s); };
    if (t.owned) flag("own", "Owned");
    if (t.played) flag("play", "Played");
    if (t.videoUrl) flag("play", "Uploaded");
    if (isBest(g)) flag("best", "Best version");
    if (g.cidRisk === "HIGH" || g.cidRisk === "Med–High") flag("cid", "Content ID");
    if (g.status !== "Released") flag("proto", g.status === "NOT obtainable" ? "Unobtainable" : g.status === "Prototype dumped" ? "Prototype" : "Late release");
    li.addEventListener("click", () => openDrawer(g.key));
    li.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDrawer(g.key); } });
    return li;
  };

  // ---------- lineage: every version of a game shares gameId; a compilation lists its games in includes ----------
  const idsOf = g => g.includes?.length ? g.includes : [g.gameId];
  const versionsOf = g => {
    const ids = new Set(idsOf(g));
    return games.filter(x => x.key === g.key || idsOf(x).some(id => ids.has(id))).sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999));
  };
  const isBest = g => idsOf(g).some(id => lineage[id]?.best === g.key);
  // Titan score is per game (tools/titan.py); a compilation shows the best-ranked game on it.
  const titanOf = g => idsOf(g).map(id => lineage[id]?.titan).filter(Boolean).sort((a, b) => a.rank - b.rank)[0];
  // Speedrun board facts are per game too (tools/speedrun); a board's keys name the releases it accepts, none = all.
  const speedrunOf = g => idsOf(g).map(id => lineage[id]?.speedrun).find(Boolean);

  // ---------- drawer ----------
  let openId = null;
  const titanBadge = t => t ? `<span class="titan-badge${t.rank <= 50 ? " top" : ""}" title="Titan score ${Math.round(t.score)}, number ${t.rank} of all games"><b>${Math.round(t.score)}</b><small>#${t.rank}</small></span>` : "";
  const titanHTML = g => {
    const t = titanOf(g);
    if (!t) return "";
    const bar = (cls, label, v, note = "") => `<div class="ti-bar ${cls}"><span>${label}</span><i><b style="width:${v}%"></b></i><em>${Math.round(v)}${note}</em></div>`;
    return `<div class="d-titanbox"><h3>Titan score <a href="titans.html">How it works</a></h3>
      <div class="d-titan"><b>${Math.round(t.score)}</b><div class="ti-bars">${bar("q", "Quality", t.quality, t.qualityEstimated ? " est." : "")}${bar("c", "Culture", t.culture)}${bar("s", "Reach", t.span)}${bar("f", "FMV", t.fmv)}</div></div>
      <p>Number ${t.rank} of ${titanCount} games. ${t.cultureWhy ? esc(t.cultureWhy) : "Culture not rated yet."}</p></div>`;
  };
  const versionsHTML = g => {
    const vs = versionsOf(g);
    if (vs.length < 2) return "";
    const first = vs[0];
    const best = idsOf(g).map(id => lineage[id]).find(l => l && vs.some(v => v.key === l.best));
    const dot = v => `<i class="sysdot" style="--sys:${sysInfo(sysId(v.key)).color}"></i>`;
    const row = v => `<li${v.key === g.key ? ' class="here"' : ""}>${dot(v)}${v.key === g.key ? `<b>${esc(v.system)}</b>` : `<button type="button" data-key="${esc(v.key)}">${esc(v.system)}</button>`}
      ${v.year ?? "year unknown"}${v.title !== g.title ? ` as ${esc(v.title)}` : ""}${v.access ? ` · ${esc(v.access)}` : ""}${v === first ? ' <span class="flag">First release</span>' : ""}${best?.best === v.key ? ' <span class="flag best">Best version</span>' : ""}</li>`;
    return `<div class="d-lineage"><h3>Every version <a href="timeline.html#${encodeURIComponent(idsOf(g)[0])}">See it on the timeline</a></h3>
      <ul class="d-versions">${vs.map(row).join("")}</ul></div>`;
  };
  // The version to play, at the top of the drawer: confirmed on that record, pointed to from every other one.
  const pickHTML = g => {
    const vs = versionsOf(g);
    const best = vs.length > 1 && idsOf(g).map(id => lineage[id]).find(l => l && vs.some(v => v.key === l.best));
    if (!best) return "";
    const b = games.find(x => x.key === best.best);
    return `<p class="d-pick"><span>★</span> ${b.key === g.key ? "<b>This is the version to play.</b>" : `<b>Play the <button type="button" data-key="${esc(b.key)}">${esc(b.system)} version</button>.</b>`} ${esc(best.bestWhy)}</p>`;
  };
  // The game's capture route (lineage playToday, from tools/play_today.py): what to run it on and what to buy, for footage.
  const routeHTML = g => {
    const p = idsOf(g).map(id => lineage[id]?.playToday).find(Boolean);
    if (!p) return "";
    const v = p.key && p.key !== g.key && p.route !== "Re-release" && games.find(x => x.key === p.key);
    const buy = p.owned ? "You own the disc." : p.buy === "Disc" ? `Buy the disc${p.price ? ` (${money(p.price)} loose)` : ""}.` : p.buy === "Digital" ? `Buy it digitally${p.store ? ` (${p.price ? "$" + p.price.toFixed(2) : "free"} on <a href="${esc(p.storeUrl)}" target="_blank" rel="noopener">${esc(p.store)}</a>, ${esc(p.priceDate)})` : ""}.` : "";
    return `<p class="d-route"><b>To record it: ${esc(p.route)}${v ? `, the <button type="button" data-key="${esc(v.key)}">${esc(v.system)} version</button>` : ""}.</b> ${esc(p.on)}. ${buy} ${esc(p.why)}${p.compare ? ` <span>For a comparison: ${esc(p.compare)}</span>` : ""}</p>`;
  };
  const depth = n => n == null ? "" : n >= 50 ? "deep" : n >= 5 ? "light" : "thin";
  const speedrunHTML = (g, t) => {
    const sr = speedrunOf(g);
    if (!sr && !t.pb) return "";
    const accepts = b => !b.keys || b.keys.includes(g.key);
    const boards = (sr?.boards || []).slice().sort((a, b) => accepts(b) - accepts(a));
    const cat = c => `<li><b>${esc(c.name)}</b> ${c.wr ? `${c.wrUrl ? `<a href="${esc(c.wrUrl)}" target="_blank" rel="noopener">${esc(c.wr)}</a>` : esc(c.wr)}${c.wrRunner ? " by " + esc(c.wrRunner) : ""}${c.wrPlatform ? ", " + esc(c.wrPlatform) : ""}` : "no time recorded"}</li>`;
    const board = b => `<div class="d-board${accepts(b) ? "" : " other"}"><p><a href="${esc(b.url)}" target="_blank" rel="noopener">${esc(b.name)}</a>
      ${b.runs != null ? ` · ${b.runs} run${b.runs === 1 ? "" : "s"} <span class="flag">${depth(b.runs)}</span>` : " · runs not counted yet"}${accepts(b) ? "" : ` · for the ${esc(b.keys.map(k => games.find(x => x.key === k)?.system || k).join(", "))} version only`}</p>
      ${b.categories?.length ? `<ul>${b.categories.map(cat).join("")}</ul>` : ""}${b.note ? `<p class="d-board-note">${esc(b.note)}</p>` : ""}</div>`;
    const label = { "Official": "Official speedrun", "Speed-clear": "Personal speed-clear", "Completion": "Completion challenge" }[sr?.class] || "";
    return `<div class="d-speedrun"><h3>Speedrun ${label ? `<span class="flag best">${label}</span>` : ""}</h3>
      ${boards.map(board).join("")}
      ${sr?.rules ? `<p><b>Rules:</b> ${esc(sr.rules)}</p>` : ""}
      ${t.pb ? `<p class="d-best">Your best: <b>${esc(t.pb)}</b>${t.challenge ? ", " + esc(t.challenge) : ""}${t.capture ? " on " + esc(t.capture) : ""}${t.srcPlace ? " · " + esc(t.srcPlace) : ""}</p>` : ""}
      ${sr ? `<p class="d-board-note">${boards.length ? "Speedrun.com checked" : "No Speedrun.com board found, searched"} ${esc(sr.checked)}.</p>` : ""}</div>`;
  };
  const openDrawer = key => {
    openId = key;
    const g = games.find(x => x.key === key); const t = entry(key);
    const body = $("#drawer-body");
    const link = (url, label) => url ? `<a href="${esc(url)}" target="_blank" rel="noopener">${label}</a>` : "";
    const isArcade = sysId(g.key) === "laserdisc";
    const regions = [g.na && "North America", g.jp && "Japan", g.eu && "Europe"].filter(Boolean).join(", ") + (g.x32 ? " · 32X CD version" : "");
    body.innerHTML = `
      <div class="d-head">
        <div class="d-art" id="d-art" aria-hidden="true"></div>
        <div>
          <p class="d-cat">${esc(g.system)} — ${esc([g.category, g.fmvType].filter(c => c && c !== g.system).join(", "))}</p>
          <h2 class="d-title" id="d-title">${esc(g.title)}</h2>
          <p class="d-alt">${esc(g.alt || "")}${g.alt ? " · " : ""}${esc(g.developer)} / ${esc(g.publisher)} · ${g.year ?? "year unknown"}</p>
          ${titanBadge(titanOf(g))}
        </div>
      </div>
      ${pickHTML(g)}
      <p class="d-hook">${esc(g.hook)}</p>
      <p><a href="game.html?game=${encodeURIComponent(g.gameId)}&amp;version=${encodeURIComponent(g.key)}">Open the full game field guide ↗</a></p>
      ${titanHTML(g)}
      ${versionsHTML(g)}
      ${speedrunHTML(g, t)}

      <form class="d-track" id="d-track">
        <label class="check"><input type="checkbox" name="owned" ${t.owned ? "checked" : ""}> Owned</label>
        <label class="check"><input type="checkbox" name="played" ${t.played ? "checked" : ""}> Played</label>
        <label>Format <select name="format">
          ${["", "Original disc", "Repro/burned", "Flash cart (ISO)", "Emulator", "Other"].map(o => `<option ${t.format === o ? "selected" : ""}>${o}</option>`).join("")}
        </select></label>
        <label>Episode # <input type="text" name="episode" value="${esc(t.episode)}"></label>
        <label>Recorded <input type="date" name="recorded" value="${esc(t.recorded)}"></label>
        <label>Uploaded <input type="date" name="uploaded" value="${esc(t.uploaded)}"></label>
        <label class="span2">Video URL <input type="url" name="videoUrl" value="${esc(t.videoUrl)}" placeholder="https://youtube.com/…"></label>
        <label>Runtime <input type="text" name="runtime" value="${esc(t.runtime)}" placeholder="e.g. 42:10"></label>
        <label class="span2">My notes <textarea name="notes">${esc(t.notes)}</textarea></label>
        <details class="span2 d-runs"${speedrunOf(g) || SPEEDRUN_FIELDS.some(f => t[f]) ? " open" : ""}><summary>Speedrun attempts</summary><div>
          <label class="span2">Challenge <input type="text" name="challenge" value="${esc(t.challenge)}" placeholder="e.g. Beat the game (Speedrun.com rules)"></label>
          <label class="span2">Capture <input type="text" name="capture" value="${esc(t.capture)}" placeholder="Original hardware, FPGA, or emulator name and version"></label>
          <label>Attempts <input type="number" min="0" name="attempts" value="${esc(t.attempts)}"></label>
          <label>Clears <input type="number" min="0" name="clears" value="${esc(t.clears)}"></label>
          <label>Personal best <input type="text" name="pb" value="${esc(t.pb)}" placeholder="h:mm:ss.mmm"></label>
          <label>Last clear <input type="date" name="lastClear" value="${esc(t.lastClear)}"></label>
          <label class="span2">Speedrun.com run <input type="url" name="srcRun" value="${esc(t.srcRun)}" placeholder="https://www.speedrun.com/…"></label>
          <label class="span2">Board place <input type="text" name="srcPlace" value="${esc(t.srcPlace)}" placeholder="e.g. 3 of 5, 2026-11-02"></label>
        </div></details>
        <span class="d-saved" id="d-saved"></span>
      </form>

      <dl class="d-facts">
        <dt>Regions</dt><dd>${esc(regions)}</dd>
        <dt>Status</dt><dd class="${g.status === "NOT obtainable" ? "d-warn" : ""}">${esc(g.status)}</dd>
        <dt>Genre</dt><dd>${esc(g.genre)}</dd>
        <dt>FMV amount</dt><dd>${g.fmv} / 10</dd>
        <dt>Discs</dt><dd>${esc(g.discs)}</dd>
        <dt>Save support</dt><dd>${esc(g.save)}</dd>
        <dt>Peripherals</dt><dd>${esc(g.peripherals)}</dd>
        <dt>Playthrough</dt><dd>${esc(g.length)}</dd>
        <dt>Difficulty</dt><dd>${esc(g.difficulty)}</dd>
        <dt>Endings</dt><dd>${esc(g.endings)}</dd>
        <dt>Content ID risk</dt><dd class="${/HIGH|Med–High/.test(g.cidRisk) ? "d-warn" : ""}">${esc(g.cidRisk)}${g.cidTrigger ? " — " + esc(g.cidTrigger) : ""}</dd>
        <dt>Modern re-release</dt><dd>${esc(g.modern)}</dd>
      </dl>

      <div class="d-section">
        ${g.art ? `<h3>Cover and pictures</h3>${galleryHTML(g)}` : ""}
        <h3>How to play it</h3>
        <p>${g.access ? `<b>${esc(g.access)}.</b> ` : ""}${esc(g.wherePlay || "")}</p>
        ${routeHTML(g)}
        ${isArcade ? "" : `<h3>Prices</h3>
        ${g.priceDigital != null ? `<p>Digital: <b>${money(g.priceDigital)}</b> on ${esc(g.digitalStore)}, checked ${esc(g.priceDigitalDate)}. ${link(g.urlStore, "Open the store page")}</p>` : ""}
        ${g.priceNote ? `<p>No market price. ${esc(g.priceNote)}</p>` : ""}
        <div class="d-prices">
          <div><b>${money(g.priceLoose)}</b><span>loose</span></div>
          <div><b>${money(g.priceCib)}</b><span>complete</span></div>
          <div><b>${money(g.priceNew)}</b><span>new</span></div>
        </div>
        <p>${g.priceDate ? "PriceCharting snapshot " + esc(g.priceDate) + "." : "No PriceCharting listing."} ${link(g.urlPriceCharting, "Check current price")}</p>`}

        <h3>Reviews</h3>
        <p>${sysId(g.key) === "segacd" ? `Sega-16: <b>${esc(g.sega16 || "not reviewed")}</b> ${link(g.urlSega16, "read")} &nbsp; ` : ""}MobyGames: critics <b>${esc(g.mobyCritic || "—")}</b>, players <b>${esc(g.mobyPlayer || "—")}</b>/5 ${link(g.urlMoby, "open")}</p>
        ${g.critic ? `<p>Critics: <b>${esc(g.critic)}</b> from ${esc(g.criticSrc)} ${link(g.urlCritic, "source")}</p>` : ""}

        <h3>Cheats and codes</h3><p>${esc(g.cheats)}</p>
        <h3>Video quality</h3><p>${esc(g.video)}</p>
        <h3>Cast</h3><p>${esc(g.cast)}</p>
        <h3>Source</h3><p>${esc(g.source)}</p>
        <h3>Also on</h3><p>${esc(g.alsoOn)}</p>
        <h3>Production trivia</h3><p>${esc(g.trivia)}</p>
        <h3>Variants</h3><p>${esc(g.variants)}</p>
        <h3>Notes</h3><p>${esc(g.notes)}</p>
        <div class="d-links">${link(g.urlSegaRetro, "Sega Retro")}${link(g.urlWiki, "Wikipedia")}${link(g.urlBackloggd, "Backloggd")}${link(g.urlMoby, "MobyGames")}${link(g.urlKLOV, "KLOV")}${link(g.urlPriceCharting, "PriceCharting")}</div>
      </div>`;
    artInto($("#d-art"), g);
    for (const b of $$(".d-versions button, .d-pick button, .d-route button", body)) b.addEventListener("click", () => openDrawer(b.dataset.key));
    const form = $("#d-track");
    form.addEventListener("input", () => {
      const fd = new FormData(form);
      Object.assign(t, {
        owned: form.owned.checked, played: form.played.checked, format: fd.get("format") || "", episode: fd.get("episode") || "",
        recorded: fd.get("recorded") || "", uploaded: fd.get("uploaded") || "", videoUrl: fd.get("videoUrl") || "", runtime: fd.get("runtime") || "", notes: fd.get("notes") || "",
        ...Object.fromEntries(SPEEDRUN_FIELDS.map(f => [f, fd.get(f) || ""])),
      });
      rowCache.delete(g.key); saveTracker(); renderStats(); renderList();
      $("#d-saved").textContent = "Saved";
    });
    $("#drawer").classList.add("open"); $("#drawer").setAttribute("aria-hidden", "false"); $("#backdrop").hidden = false;
    $("#drawer-body").scrollTop = 0; $("#drawer-close").focus();
    history.replaceState(null, "", location.pathname + location.search + "#" + encodeURIComponent(g.key));
  };
  const closeDrawer = () => {
    openId = null;
    $("#drawer").classList.remove("open"); $("#drawer").setAttribute("aria-hidden", "true"); $("#backdrop").hidden = true;
    history.replaceState(null, "", location.pathname + location.search);
  };

  // ---------- export / import ----------
  const exportTracker = () => {
    const out = {};
    for (const g of games) { const t = tracker[g.key]; if (t && (t.owned || t.played || t.episode || t.videoUrl || t.notes || SPEEDRUN_FIELDS.some(f => t[f]))) out[g.key] = { title: g.title, system: g.system, ...t }; }
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "tracker.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  const importTracker = file => {
    const r = new FileReader();
    r.onload = () => {
      try { const data = JSON.parse(r.result); for (const [key, t] of Object.entries(data)) { const { title, system, ...rest } = t; const k = /^\d+$/.test(key) ? "segacd-" + key : key; tracker[k] = { ...entry(k), ...rest }; } rowCache.clear(); saveTracker(); renderStats(); renderList(); }
      catch { alert("That file isn't a tracker export from this site."); }
    };
    r.readAsText(file);
  };

  // ---------- init ----------
  const init = async () => {
    const res = await fetch("data/games.json", { cache: "no-cache" }); const data = await res.json();
    games = data.games;
    lineage = data.lineage || {};
    titanCount = Object.values(lineage).filter(l => l.titan).length;
    const dates = games.map(g => g.priceDate).filter(Boolean).sort();
    priceDate = dates.length ? (dates[0] === dates[dates.length - 1] ? dates[0] : `${dates[0]} to ${dates[dates.length - 1]}`) : "";
    await loadTracker();
    $("#hero-count").textContent = games.length;
    $("#foot-pricedate").textContent = priceDate;
    const systems = data.systems || [...new Set(games.map(g => sysId(g.key)))].map(id => ({ id, name: games.find(g => sysId(g.key) === id).system }));
    sysNames = Object.fromEntries(systems.map(sy => [sy.id, sy.name]));
    const perSys = {};
    for (const g of games) perSys[sysId(g.key)] = (perSys[sysId(g.key)] || 0) + 1;
    fillSelect($("#f-sys"), systems, perSys);
    const shown = ordered(systems);
    $("#hero-systems").innerHTML = shown.map((sy, i) => `<span><a href="?system=${esc(sy.id)}" data-sys="${esc(sy.id)}">${esc(sy.name)}</a>${i < shown.length - 1 ? " ·" : ""}</span>`).join(" ");
    $("#hero-systems").title = shown.map(sy => sy.name + (sy.aliases ? " (" + sy.aliases + ")" : "")).join("; ");
    const perCat = {};
    for (const g of games) perCat[g.category] = (perCat[g.category] || 0) + 1;
    for (const c of Object.keys(perCat).sort()) { const o = document.createElement("option"); o.value = c; o.textContent = `${c} (${perCat[c]})`; $("#f-cat").appendChild(o); }
    // ?system=<id> preselects a system, so each system has a link of its own.
    const want = new URLSearchParams(location.search).get("system");
    if (want && sysNames[want]) $("#f-sys").value = want;
    const syncSysParam = () => {
      const u = new URL(location.href);
      $("#f-sys").value ? u.searchParams.set("system", $("#f-sys").value) : u.searchParams.delete("system");
      history.replaceState(null, "", u);
      $("#nav-timeline").href = "timeline.html" + u.search; $("#nav-titans").href = "titans.html" + u.search; $("#nav-channel").href = "channel.html" + u.search;
      for (const a of $$("#hero-systems a")) a.toggleAttribute("aria-current", a.dataset.sys === $("#f-sys").value);
    };
    for (const el of $$(".controls select, #q")) el.addEventListener("input", renderList);
    $("#list-more").addEventListener("click", () => { const shown = $("#list").children.length; renderList(true); $("#list").children[shown]?.focus(); });
    $("#f-sys").addEventListener("input", () => { renderStats(); syncSysParam(); });
    // The system names in the hero are links of their own; on this page they set the filter without reloading. A second click clears it.
    $("#hero-systems").addEventListener("click", e => {
      const a = e.target.closest("a[data-sys]"); if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      $("#f-sys").value = $("#f-sys").value === a.dataset.sys ? "" : a.dataset.sys;
      renderStats(); renderList(); syncSysParam();
    });
    $("#f-reset").addEventListener("click", () => { for (const el of $$(".controls select")) el.selectedIndex = Math.max(0, [...el.options].findIndex(o => o.defaultSelected)); $("#q").value = ""; renderStats(); renderList(); syncSysParam(); });
    $("#drawer-close").addEventListener("click", closeDrawer);
    $("#backdrop").addEventListener("click", closeDrawer);
    document.addEventListener("keydown", e => { if (e.key === "Escape" && openId != null) closeDrawer(); });
    $("#export-btn").addEventListener("click", exportTracker);
    $("#import-file").addEventListener("change", e => { if (e.target.files[0]) importTracker(e.target.files[0]); e.target.value = ""; });
    syncSysParam(); renderStats(); renderList();
    const h = decodeURIComponent(location.hash.slice(1)); const g = h && games.find(x => x.key === h || x.title === h); if (g) openDrawer(g.key);
  };
  init();
})();
