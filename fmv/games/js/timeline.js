/* FMV Index — release timeline. Groups every record in data/games.json into one entry per game (records sharing a gameId)
   and places it at its earliest year. Read-only: the tracker is shown, never edited, here. */
(() => {
  const STORE_KEY = "segacd-fmv-tracker-v1";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const { artInto } = window.FMVArt;

  const { sysId, info: sysInfo, fillSelect } = window.FMVSystems;
  const sysShort = key => sysInfo(sysId(key)).short;
  const sysColor = key => sysInfo(sysId(key)).color;

  let groups = [];
  let tracker = {};
  let lineage = {};
  let span = [1991, 2002];
  const open = new Set();

  // ---------- grouping ----------
  // Every record carries a gameId shared by all its versions (tools/lineage.py). A compilation also lists the
  // gameIds it contains in "includes" and is shown as a version of each of those games, not as a game of its own.
  // Records without a gameId fall back to title matching (same title or alt title on another system).
  const norm = t => String(t || "").toLowerCase().replace(/\(.*?\)/g, "").replace(/&/g, "and").replace(/^(the|a) /, "").replace(/[^a-z0-9]/g, "");
  const fallbackIds = games => {
    const byTitle = new Map();
    for (const g of games) if (g.gameId) for (const part of [g.title, ...String(g.alt || "").split(/[;,/]/)]) { const k = norm(part); if (k.length > 3 || part === g.title) byTitle.set(k, g.gameId); }
    for (const g of games) if (!g.gameId) {
      const hit = [g.title, ...String(g.alt || "").split(/[;,/]/)].map(norm).find(k => byTitle.has(k));
      g.gameId = hit ? byTitle.get(hit) : "key:" + g.key;
      byTitle.set(norm(g.title), g.gameId);
    }
  };
  const buildGroups = games => {
    fallbackIds(games);
    const buckets = new Map();
    const add = (id, g) => { if (!buckets.has(id)) buckets.set(id, []); buckets.get(id).push(g); };
    for (const g of games) {
      if (g.includes?.length) for (const id of g.includes) add(id, g);
      else add(g.gameId, g);
    }
    const rank = g => sysInfo(sysId(g.key)).rank;
    return [...buckets.entries()].map(([id, members]) => {
      members.sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999) || rank(a) - rank(b));
      const rep = members.find(m => !m.includes?.length) || members[0];
      const first = members[0];
      const year = first.year ?? null;
      const titles = [...new Set(members.filter(m => !m.includes?.length).map(m => m.title))];
      const line = lineage[id] || {};
      return {
        id, rep, members, year, titles, first,
        best: members.find(m => m.key === line.best) || null, bestWhy: line.bestWhy || "",
        debut: members.filter(m => m.year === year),
        later: members.filter(m => m.year !== year),
        fmv: Math.max(...members.map(m => m.fmv || 0)),
        titan: line.titan || null,
        owned: members.some(m => tracker[m.key]?.owned),
        played: members.some(m => tracker[m.key]?.played),
        hay: members.flatMap(m => [m.title, m.alt, m.developer, m.publisher, m.cast, m.genre]).join(" ").toLowerCase(),
      };
    });
  };

  // ---------- filters ----------
  const passes = gr => {
    const q = $("#tl-q").value.trim().toLowerCase();
    const sys = $("#tl-sys").value, cat = $("#tl-cat").value, fmv = $("#tl-fmv").value, multi = $("#tl-multi").value;
    if (sys && !gr.members.some(m => sysId(m.key) === sys)) return false;
    if (cat && !gr.members.some(m => m.category === cat)) return false;
    if (fmv) { const [lo, hi] = fmv.split("-").map(Number); if (gr.fmv < lo || gr.fmv > hi) return false; }
    if (multi === "multi" && gr.members.length < 2) return false;
    if (multi === "single" && gr.members.length > 1) return false;
    if (q && !gr.hay.includes(q)) return false;
    return true;
  };
  const sorter = () => ({
    title: (a, b) => a.rep.title.replace(/^the /i, "").localeCompare(b.rep.title.replace(/^the /i, "")),
    fmv: (a, b) => b.fmv - a.fmv || a.rep.title.localeCompare(b.rep.title),
    systems: (a, b) => b.members.length - a.members.length || a.rep.title.localeCompare(b.rep.title),
    titan: (a, b) => (b.titan?.score ?? -1) - (a.titan?.score ?? -1) || a.rep.title.localeCompare(b.rep.title),
  }[$("#tl-sort").value]);

  // ---------- pieces ----------
  const badge = (m, debut, gr) => {
    const best = gr.best === m;
    return `<a class="sysb${debut ? " debut" : ""}${best ? " best" : ""}" href="./#${encodeURIComponent(m.key)}" style="--sys:${sysColor(m.key)}" title="${esc(m.title)} on ${esc(m.system)}${m.year ? ", " + m.year : ""}${best ? ". Recommended version" : ""}. Open its full record">${esc(sysShort(m.key))}${debut ? "" : `<i>${m.year ? "’" + String(m.year).slice(2) : "?"}</i>`}</a>`;
  };

  // A strip across the whole index span, one pip per system release, joined from first release to last.
  // The labelled version in an open card spans only the game's own years, so its labels have room.
  const track = (gr, labelled) => {
    const dated = gr.members.filter(m => m.year);
    if (dated.length < 2) return "";
    const first = dated[0].year, last = dated[dated.length - 1].year;
    if (first === last) return "";
    const [y0, y1] = labelled ? [first, last] : span; const w = y1 - y0 || 1;
    const pos = y => ((y - y0) / w * 100).toFixed(2) + "%";
    const byYear = {};
    for (const m of dated) (byYear[m.year] ||= []).push(m);
    const pips = Object.entries(byYear).map(([y, ms]) => `<span class="pip" style="left:${pos(+y)}">${ms.map(m => `<b style="--sys:${sysColor(m.key)}" title="${esc(m.system)}, ${y}"></b>`).join("")}${labelled ? `<em>${ms.map(m => esc(sysShort(m.key))).join(" · ")}<br>${y}</em>` : ""}</span>`).join("");
    return `<div class="track${labelled ? " labelled" : ""}" aria-hidden="true"><span class="rail"></span><span class="run" style="left:${pos(first)};width:${((last - first) / w * 100).toFixed(2)}%"></span>${pips}</div>`;
  };

  const card = gr => {
    const r = gr.rep;
    const li = document.createElement("li");
    li.className = "tl-game" + (gr.members.length > 1 ? " multi" : "") + (open.has(gr.id) ? " open" : "");
    li.id = "g-" + gr.id;
    const others = gr.titles.filter(t => t !== r.title);
    const gap = gr.later.length ? gr.later[gr.later.length - 1].year - gr.year : 0;
    li.innerHTML = `
      <button class="tl-card" type="button" aria-expanded="${open.has(gr.id)}" aria-controls="m-${esc(gr.id)}">
        <span class="thumb" aria-hidden="true"></span>
        <span class="tl-card-main">
          <span class="tl-title">${esc(r.title)}</span>${window.FMVClassification.badgeHTML({...r,gameId:gr.id},lineage,true)}
          <span class="tl-sub">${esc(r.category)} · FMV ${gr.fmv}/10${gr.owned ? ` · <span class="tl-own">owned</span>` : ""}</span>
        </span>
        <span class="tl-count" title="${gr.members.length} system${gr.members.length > 1 ? "s" : ""} in the index">${gr.members.length > 1 ? `×${gr.members.length}` : ""}</span>
        ${gr.titan ? `<span class="titan-badge${gr.titan.rank <= 50 ? " top" : ""}" title="Titan score ${Math.round(gr.titan.score)}, number ${gr.titan.rank} of all games"><b>${Math.round(gr.titan.score)}</b><small>#${gr.titan.rank}</small></span>` : ""}
      </button>
      <div class="tl-badges">${gr.debut.map(m => badge(m, true, gr)).join("")}${gr.later.map(m => badge(m, false, gr)).join("")}</div>
      ${track(gr, false)}
      <div class="tl-more" id="m-${esc(gr.id)}" ${open.has(gr.id) ? "" : "hidden"}>
        <p><a href="game.html?game=${encodeURIComponent(gr.id)}">Open the full game field guide ↗</a></p>
        <p class="tl-hook">${esc(r.hook)}</p>
        <dl class="tl-facts">
          ${gr.titan ? `<dt>Titan score</dt><dd>${Math.round(gr.titan.score)}, number ${gr.titan.rank}. Quality ${Math.round(gr.titan.quality)}${gr.titan.qualityEstimated ? " (est.)" : ""}, culture ${Math.round(gr.titan.culture)}, reach ${Math.round(gr.titan.span)}, FMV ${gr.titan.fmv}. <a href="titans.html">How it works</a></dd>` : ""}
          <dt>First release</dt><dd>${esc(gr.first.system)}${gr.first.year ? ", " + gr.first.year : ""}${gr.first.title !== r.title ? ` as ${esc(gr.first.title)}` : ""}</dd>
          ${gr.best ? `<dt>Best version</dt><dd>★ ${esc(gr.best.system)}${gr.bestWhy ? ". " + esc(gr.bestWhy) : ""}</dd>` : ""}
          <dt>Developer</dt><dd>${esc(r.developer)}</dd>
          <dt>Publisher</dt><dd>${esc(r.publisher)}</dd>
          ${others.length ? `<dt>Also titled</dt><dd>${others.map(esc).join(" · ")}</dd>` : ""}
          ${r.alt ? `<dt>Alt title</dt><dd>${esc(r.alt)}</dd>` : ""}
          <dt>Source</dt><dd>${esc(r.source)}</dd>
          <dt>Also on</dt><dd>${esc(r.alsoOn || "—")}</dd>
        </dl>
        ${gr.members.length > 1 ? `<h3>${gap ? `Reached ${gr.members.length} systems over ${gap} year${gap > 1 ? "s" : ""}` : `Out on ${gr.members.length} systems the same year`}</h3>${track(gr, true)}` : ""}
        <ul class="tl-versions">${gr.members.map(m => `<li><span class="sysdot" style="--sys:${sysColor(m.key)}"></span><b>${gr.best === m ? "★ " : ""}${esc(m.system)}</b> ${m.year ?? "year unknown"}${m.includes?.length ? ` · in ${esc(m.title)}` : ""} · FMV ${m.fmv}/10${m.access ? ` · ${esc(m.access)}` : ""} <a href="./#${encodeURIComponent(m.key)}">Open record</a></li>`).join("")}</ul>
      </div>`;
    artInto($(".thumb", li), r);
    $(".tl-card", li).addEventListener("click", () => toggle(gr.id, li));
    return li;
  };

  const toggle = (id, li, force) => {
    const on = force ?? !open.has(id);
    on ? open.add(id) : open.delete(id);
    li.classList.toggle("open", on);
    $(".tl-card", li).setAttribute("aria-expanded", on);
    $(".tl-more", li).hidden = !on;
    history.replaceState(null, "", location.pathname + location.search + (on ? "#" + encodeURIComponent(id) : ""));
  };

  const jumpTo = id => {
    const li = document.getElementById("g-" + id); if (!li) return;
    toggle(id, li, true);
    li.scrollIntoView({ block: "center" });
    for (const f of $$(".tl-game.flash")) f.classList.remove("flash");
    li.classList.add("flash");
    $(".tl-card", li).focus({ preventScroll: true });
  };

  // ---------- render ----------
  const render = () => {
    const shown = groups.filter(passes);
    const years = new Map();
    const slot = y => { if (!years.has(y)) years.set(y, { games: [], ports: [] }); return years.get(y); };
    for (const gr of shown) {
      slot(gr.year).games.push(gr);
      for (const m of gr.later) slot(m.year ?? null).ports.push({ gr, m });
    }
    const order = [...years.keys()].sort((a, b) => (a ?? 9999) - (b ?? 9999));
    const sort = sorter();
    const tl = $("#tl"); tl.innerHTML = "";
    for (const y of order) {
      const { games, ports } = years.get(y);
      games.sort(sort);
      const sec = document.createElement("li");
      sec.className = "tl-year"; sec.id = "y-" + (y ?? "unknown");
      const label = y ?? "Undated";
      sec.innerHTML = `
        <div class="tl-year-head">
          <span class="tl-node" aria-hidden="true"></span>
          <h2>${label}</h2>
          <p>${games.length} new game${games.length === 1 ? "" : "s"}${ports.length ? `<span class="tl-sep"> · </span><br>${ports.length} port${ports.length === 1 ? "" : "s"} arriving` : ""}</p>
        </div>
        <div class="tl-year-body">
          <ol class="tl-games"></ol>
          ${ports.length ? `<div class="tl-ports"><h3>Arriving on new systems in ${label}</h3><ul></ul></div>` : ""}
        </div>`;
      const ol = $(".tl-games", sec);
      for (const gr of games) ol.appendChild(card(gr));
      if (!games.length) ol.remove();
      if (ports.length) {
        const ul = $(".tl-ports ul", sec);
        ports.sort((a, b) => a.gr.rep.title.localeCompare(b.gr.rep.title));
        for (const { gr, m } of ports) {
          const li = document.createElement("li");
          li.innerHTML = `<button type="button" class="port-chip" style="--sys:${sysColor(m.key)}"><span>${esc(gr.rep.title)}</span> <b>${esc(sysShort(m.key))}</b> <i>from ${gr.year}</i></button>`;
          li.firstChild.addEventListener("click", () => jumpTo(gr.id));
          ul.appendChild(li);
        }
      }
      tl.appendChild(sec);
    }
    $("#tl-empty").hidden = shown.length > 0;
    renderChart(years);
    renderYearNav(order, years);
  };

  const renderChart = years => {
    const bars = $("#tl-bars"); bars.innerHTML = "";
    const all = [];
    for (let y = span[0]; y <= span[1]; y++) all.push(y);
    const max = Math.max(1, ...all.map(y => years.get(y)?.games.length || 0));
    for (const y of all) {
      const n = years.get(y)?.games.length || 0, p = years.get(y)?.ports.length || 0;
      const b = document.createElement("button");
      b.type = "button"; b.className = "tl-bar"; b.setAttribute("role", "listitem");
      b.disabled = !n && !p;
      b.setAttribute("aria-label", `${y}: ${n} new games, ${p} ports. Jump to ${y}`);
      if (y % 5) b.classList.add("minor");
      b.innerHTML = `<span class="tl-bar-n">${n || ""}</span><span class="tl-bar-col"><i style="height:${(n / max * 100).toFixed(1)}%"></i></span><span class="tl-bar-y">’${String(y).slice(2)}</span>`;
      b.dataset.tip = `${y}: ${n} new game${n === 1 ? "" : "s"}${p ? `, ${p} port${p === 1 ? "" : "s"} of older games` : ""}`;
      b.addEventListener("click", () => document.getElementById("y-" + y)?.scrollIntoView({ block: "start" }));
      bars.appendChild(b);
    }
  };

  const renderYearNav = (order, years) => {
    const nav = $("#tl-yearnav"); nav.innerHTML = "";
    for (const y of order) {
      const a = document.createElement("a");
      a.href = "#y-" + (y ?? "unknown");
      a.innerHTML = `${y ?? "Undated"}<small>${years.get(y).games.length}</small>`;
      a.addEventListener("click", e => { e.preventDefault(); document.getElementById("y-" + (y ?? "unknown"))?.scrollIntoView({ block: "start" }); });
      nav.appendChild(a);
    }
    syncNav();
  };

  // Highlight the year currently at the top of the viewport.
  const syncNav = () => {
    const navH = $("#tl-yearnav").offsetHeight + 8;
    let cur = null;
    for (const sec of $$(".tl-year")) { if (sec.getBoundingClientRect().top - navH <= 4) cur = sec.id; }
    for (const a of $$("#tl-yearnav a")) a.classList.toggle("on", a.getAttribute("href") === "#" + cur);
  };

  // Chart tooltip follows the hovered or focused bar.
  const tip = (el, on) => {
    const t = $("#tl-tip");
    if (!on || !el.dataset.tip) { t.hidden = true; return; }
    t.textContent = el.dataset.tip; t.hidden = false;
    const box = $(".tl-chart").getBoundingClientRect(), r = el.getBoundingClientRect();
    t.style.left = Math.min(Math.max(r.left + r.width / 2 - box.left, 70), box.width - 70) + "px";
    t.style.top = (r.top - box.top - 8) + "px";
  };

  // ---------- init ----------
  const loadTracker = async () => {
    let seed = {}, local = {};
    try { const r = await fetch("data/tracker.json", { cache: "no-cache" }); if (r.ok) seed = await r.json(); } catch {}
    try { local = JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch {}
    for (const k of Object.keys(local)) if (/^\d+$/.test(k)) { local["segacd-" + k] = local[k]; delete local[k]; }
    tracker = { ...seed, ...local };
  };

  const init = async () => {
    const data = await (await fetch("data/games.json", { cache: "no-cache" })).json();
    await loadTracker();
    const systems = data.systems || [];
    const yrs = data.games.map(g => g.year).filter(Boolean);
    span = [Math.min(...yrs), Math.max(...yrs)];
    lineage = data.lineage || {};
    groups = buildGroups(data.games);
    const multi = groups.filter(g => g.members.length > 1).length;
    $("#tl-count").textContent = groups.length;
    $("#tl-years").textContent = `${span[0]}–${span[1]}, ${multi} of them on more than one system`;
    // Count games, not records, per system: a game on a system counts once even with two records there.
    const perSys = {};
    for (const gr of groups) for (const id of new Set(gr.members.map(m => sysId(m.key)))) perSys[id] = (perSys[id] || 0) + 1;
    fillSelect($("#tl-sys"), systems, perSys);
    for (const c of [...new Set(data.games.map(g => g.category))].sort()) { const o = document.createElement("option"); o.textContent = c; $("#tl-cat").appendChild(o); }
    const want = new URLSearchParams(location.search).get("system");
    if (want && systems.some(s => s.id === want)) $("#tl-sys").value = want;
    const syncSysParam = () => {
      const u = new URL(location.href);
      $("#tl-sys").value ? u.searchParams.set("system", $("#tl-sys").value) : u.searchParams.delete("system");
      history.replaceState(null, "", u);
      $("#nav-games").href = "./" + u.search; $("#nav-titans").href = "titans.html" + u.search; $("#nav-channel").href = "channel.html" + u.search;
    };
    const setLayout = () => $("#tl").classList.toggle("compact", $("#tl-layout").value === "compact");
    for (const el of $$(".tl-controls select, #tl-q")) el.addEventListener("input", render);
    $("#tl-sys").addEventListener("input", syncSysParam);
    $("#tl-layout").addEventListener("input", setLayout);
    $("#tl-reset").addEventListener("click", () => { for (const el of $$(".tl-controls select")) el.selectedIndex = Math.max(0, [...el.options].findIndex(o => o.defaultSelected)); $("#tl-q").value = ""; setLayout(); syncSysParam(); render(); });
    const bars = $("#tl-bars");
    for (const ev of ["mouseover", "focusin"]) bars.addEventListener(ev, e => { const b = e.target.closest(".tl-bar"); if (b) tip(b, true); });
    for (const ev of ["mouseleave", "focusout"]) bars.addEventListener(ev, () => tip(null, false));
    addEventListener("scroll", syncNav, { passive: true });
    syncSysParam(); render();
    const h = decodeURIComponent(location.hash.slice(1));
    const gr = h && (groups.find(g => g.id === h) || groups.find(g => g.members.some(m => m.key === h)));
    if (gr) jumpTo(gr.id);
  };
  init();
})();
