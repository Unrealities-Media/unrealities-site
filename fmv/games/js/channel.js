/* FMV Index — Channel select. The whole database as a CRT: each year with a release is a channel, each era opens on a teletext page,
   OK on a game opens its status screen (Titan score, culture, speedrun boards, your save data), and OK again opens the item shop of
   every version (prices, how to play it, lore, reviews, links, owned/played). INPUT picks a system. Reads data/games.json and the
   tracker the same way the index does; owned/played set here are the same entries the index drawer edits. */
(() => {
  const STORE_KEY = "segacd-fmv-tracker-v1";
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const money = n => n == null ? "--" : "$" + (n >= 100 ? Math.round(n).toLocaleString() : n.toFixed(2));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { sysId, info: sysInfo, ordered } = window.FMVSystems;
  const { artInto, galleryHTML } = window.FMVArt;
  const short = key => sysInfo(sysId(key)).short;
  const color = key => sysInfo(sysId(key)).color;

  // The six eras the story is told in. Editorial copy; the counts on each page come from the data.
  const ERAS = [
    { from: 1981, to: 1985, title: "The laserdisc arcade",
      body: "In 1983 a cabinet in the corner of the arcade played a cartoon instead of a game. Don Bluth's Dragon's Lair cost 50 cents a go, twice the usual price, and people queued for it. For two years every manufacturer chased it with a laserdisc machine of its own, from Sega's Astron Belt to Data East's Road Blaster. Then the players wore out, the novelty wore off and the boom ended." },
    { from: 1986, to: 1991, title: "Between formats",
      body: "Home hardware could not stream video yet, so the idea waited. Hasbro filmed Night Trap and Sewer Shark in 1987 for a tape-based console called NEMO that never shipped. American Laser Games kept the arcade side alive with Mad Dog McCree in 1990, a live-action western played with a light gun." },
    { from: 1992, to: 1994, title: "The CD-ROM gold rush",
      body: "A compact disc held 650 megabytes, enough for half an hour of grainy video. Sega CD, CD-i and 3DO all sold themselves on it, and studios rushed to film games. Night Trap reached shelves in 1992, and a year later it sat at the centre of the US Senate hearings on video game violence that led to the ESRB." },
    { from: 1995, to: 1997, title: "Hollywood on disc",
      body: "The peak. PlayStation and Saturn arrived, every new PC had a CD drive, and close to a hundred FMV games came out each year. Budgets grew to match: Phantasmagoria filled seven discs, Wing Commander IV brought back Mark Hamill, and Gabriel Knight went live action." },
    { from: 1998, to: 2014, title: "The long fade",
      body: "3D graphics got good and filmed video started to look dated. FMV shrank back to cutscenes, to the living room DVD player and to party games played with a remote. For fifteen years only a handful of releases a year kept the form going." },
    { from: 2015, to: 9999, title: "The revival",
      body: "Then Sam Barlow's Her Story put a police archive of video clips on PC in 2015, and FMV came back as a genre of its own: Late Shift, Telling Lies, Immortality, and a run of Chinese romance games shot like streaming dramas." },
  ];
  const eraOf = y => ERAS.find(e => y >= e.from && y <= e.to) || ERAS[0];

  let games = [], lineage = {}, systems = [], tracker = {}, groups = [], byId = new Map(), byKey = new Map(), titanCount = 0;

  // ---------- tracker: the committed seed with this browser's edits on top, as on the index ----------
  const loadTracker = async () => {
    let seed = {};
    try { const r = await fetch("data/tracker.json", { cache: "no-cache" }); if (r.ok) seed = await r.json(); } catch {}
    let local = {};
    try { local = JSON.parse(localStorage.getItem(STORE_KEY) || "{}"); } catch {}
    for (const k of Object.keys(local)) if (/^\d+$/.test(k)) { local["segacd-" + k] = local[k]; delete local[k]; }
    tracker = { ...seed, ...local };
  };
  const saveTracker = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(tracker)); } catch {} };
  const entry = key => tracker[key] || (tracker[key] = { owned: false, format: "", played: false, episode: "", recorded: "", uploaded: "", videoUrl: "", runtime: "", notes: "",
    challenge: "", capture: "", attempts: "", clears: "", pb: "", lastClear: "", srcRun: "", srcPlace: "" });
  const t = key => tracker[key] || {};

  // ---------- games: records grouped by gameId; a compilation counts as a version of each game it includes ----------
  const idsOf = g => g.includes?.length ? g.includes : [g.gameId || "key:" + g.key];
  const buildGroups = () => {
    const buckets = new Map();
    for (const g of games) for (const id of idsOf(g)) { if (!buckets.has(id)) buckets.set(id, []); buckets.get(id).push(g); }
    const rank = g => sysInfo(sysId(g.key)).rank;
    return [...buckets.entries()].map(([id, members]) => {
      members.sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999) || rank(a) - rank(b));
      const line = lineage[id] || {};
      return {
        id, members, rep: members.find(m => !m.includes?.length) || members[0],
        year: members.find(m => m.year != null)?.year ?? null,
        titan: line.titan || null, best: line.best || null, bestWhy: line.bestWhy || "", speedrun: line.speedrun || null,
        fmv: Math.max(...members.map(m => m.fmv || 0)),
      };
    });
  };

  // ---------- state ----------
  let input = "";          // system id, or "" for every system
  let years = [], yi = 0, sel = 0;
  let mode = "txt";        // txt | ch | status | shop
  let page = 101, statusId = null, vsel = 0, tab = "item";
  const seenEra = new Set();
  // Under an input, a game sits at the year it reached that system; otherwise at its first release.
  const onInput = gr => input ? gr.members.filter(m => sysId(m.key) === input) : gr.members;
  const yearOf = gr => { const ys = onInput(gr).map(m => m.year).filter(y => y != null); return ys.length ? Math.min(...ys) : null; };
  const visible = () => groups.filter(gr => onInput(gr).length && yearOf(gr) != null);
  const byTitan = (a, b) => (a.titan?.rank ?? 1e9) - (b.titan?.rank ?? 1e9) || a.rep.title.localeCompare(b.rep.title);
  const channelGames = () => visible().filter(gr => yearOf(gr) === years[yi]).sort(byTitan);
  const computeYears = keep => {
    years = [...new Set(visible().map(yearOf))].sort((a, b) => a - b);
    if (!years.length) { yi = 0; return; }
    const i = years.findIndex(y => y >= keep);
    yi = i < 0 ? years.length - 1 : i;
  };

  // ---------- static burst on every tune ----------
  const st = $("#static"), sx = st.getContext("2d"), simg = sx.createImageData(160, 120);
  let stT = 0;
  const noise = () => { for (let i = 0; i < simg.data.length; i += 4) { const v = Math.random() * 255 | 0; simg.data[i] = simg.data[i + 1] = simg.data[i + 2] = v; simg.data[i + 3] = 255; } sx.putImageData(simg, 0, 0); };
  const burst = (ms = 220) => {
    if (reduceMotion) return;
    st.classList.add("on"); const end = performance.now() + ms;
    cancelAnimationFrame(stT);
    const f = () => { noise(); if (performance.now() < end) stT = requestAnimationFrame(f); else st.classList.remove("on"); };
    f();
  };
  const view = $("#view"), screen = $("#screen");
  let toastT = 0;
  const toast = msg => {
    let el = $(".ch-toast", screen);
    if (!el) { el = document.createElement("div"); el.className = "ch-toast"; screen.appendChild(el); }
    el.textContent = msg; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => el.hidden = true, 1600);
  };

  // ---------- small renderers ----------
  const sysDots = gr => `<span class="ch-sys">${[...new Set(gr.members.map(m => sysId(m.key)))].map(id => `<i style="--c:${sysInfo(id).color}" title="${esc(sysInfo(id).short)}"></i>`).join("")}</span>`;
  const sysList = gr => [...new Set(gr.members.map(m => short(m.key)))].join(" / ");
  const owned = gr => gr.members.some(m => t(m.key).owned);
  const played = gr => gr.members.some(m => t(m.key).played);
  const host = u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return "source"; } };
  const link = (u, label) => u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(label)}</a>` : "";
  const depth = n => n == null ? "" : n >= 50 ? "deep" : n >= 5 ? "light" : "thin";
  const inputName = () => input ? (systems.find(s => s.id === input)?.name || input) : "All systems";

  // ---------- channel ----------
  const renderChannel = () => {
    const y = years[yi], gs = channelGames();
    sel = Math.min(sel, Math.max(0, gs.length - 1));
    const g = gs[sel], e = eraOf(y);
    if (!g) { view.className = "ch-view"; view.innerHTML = `<div class="ch-osd"><div class="ch-num"><small>CH</small>--</div><div class="ch-era"><b>No signal</b>${esc(inputName())}</div></div><p class="ch-empty">Nothing on this input.<br>Press INPUT to pick another system.</p><div></div>`; return; }
    const tr = g.titan;
    view.className = "ch-view";
    view.innerHTML = `<div class="ch-osd"><div class="ch-num"><small>CH · ${esc(input ? sysInfo(input).short : "ALL")}</small>${y}</div><div class="ch-era"><b>${esc(e.title)}</b>${gs.length} game${gs.length > 1 ? "s" : ""} on air</div></div>
      <div class="ch-main"><div class="ch-now"><div class="ch-disc" id="disc"></div><div class="ch-nt">${esc(g.rep.title)}</div>${window.FMVClassification.badgeHTML({...g.rep,gameId:g.id},lineage,true)}
        <div class="ch-nh">${tr ? `Titan ${tr.score.toFixed(1)} · #${tr.rank}` : "No Titan score"}<br>${esc(sysList(g))}${owned(g) ? " · OWNED" : ""}</div></div>
      <ol class="ch-menu" id="menu">${gs.map((x, i) => `<li data-i="${i}" class="${i === sel ? "sel" : ""}"><span class="cur">▶</span><span class="t">${esc(x.rep.title)}${sysDots(x)}${owned(x) ? `<span class="ch-tag">OWN</span>` : ""}${played(x) ? `<span class="ch-tag">PLAYED</span>` : ""}</span><span class="sc ${x.titan?.rank <= 50 ? "top" : ""}">${x.titan ? Math.round(x.titan.score) : "--"}</span></li>`).join("")}</ol></div>
      <div class="ch-ticker"><span>${esc(g.rep.hook || e.body)}</span></div>`;
    artInto($("#disc"), g.rep, { label: true });
    $("#menu li.sel")?.scrollIntoView({ block: "nearest" });
  };

  // ---------- teletext ----------
  const PAGES = [100, 101, 102, 103, 104, 105, 106, 200, 300, 400];
  const eraGroups = e => visible().filter(gr => { const y = yearOf(gr); return y >= e.from && y <= e.to; });
  const scopeRecords = () => games.filter(g => !input || sysId(g.key) === input);
  const renderTxt = () => {
    let title, body;
    const scope = input ? ` · ${esc(sysInfo(input).short)}` : "";
    if (page >= 101 && page <= 106) {
      const e = ERAS[page - 101], gs = eraGroups(e).sort(byTitan);
      const per = {};
      for (const gr of gs) for (const id of new Set(onInput(gr).map(m => sysId(m.key)))) per[id] = (per[id] || 0) + 1;
      const counts = ordered(systems).filter(s => per[s.id]).map(s => `<span class="c">${esc(s.short || sysInfo(s.id).short)}</span> ${per[s.id]}`).join(" · ");
      title = `<span>${page - 100}/6</span> ${esc(e.title.toUpperCase())}`;
      body = `<p>${esc(e.body)}</p><p><span class="y">${gs.length} GAMES${scope}:</span> ${counts || "none on this input"}</p>
        ${gs.length ? `<p class="y">TOP OF THE ERA</p><div class="tx-rows">${gs.slice(0, 5).map(gr => `<span class="g">${yearOf(gr)}</span><a data-game="${esc(gr.id)}">${esc(gr.rep.title)}</a><span class="y">${gr.titan ? Math.round(gr.titan.score) : "--"}</span>`).join("")}</div>` : ""}`;
    } else if (page === 200) {
      const gs = visible().filter(gr => gr.titan).sort(byTitan).slice(0, 12);
      title = `TITAN TOP ${gs.length}${scope}`;
      body = `<div class="tx-rows">${gs.map(gr => `<span class="y">#${gr.titan.rank}</span><a data-game="${esc(gr.id)}">${esc(gr.rep.title)} <span class="g">${yearOf(gr)}</span></a><span class="c">${gr.titan.score.toFixed(1)}</span>`).join("")}</div>
        <p style="margin-top:.6em">Titan = (0.4 quality + 0.4 culture + 0.2 reach) × FMV share. ${titanCount} games scored.</p>`;
    } else if (page === 300) {
      const pool = scopeRecords(), obt = pool.filter(g => g.status !== "NOT obtainable"), own = obt.filter(g => t(g.key).owned), un = obt.filter(g => !t(g.key).owned);
      const cost = (g, k) => g.priceDigital ?? g[k];  // PC is bought digitally
      const sum = k => un.some(g => cost(g, k) != null) ? money(un.reduce((a, g) => a + (cost(g, k) || 0), 0)) : "--";
      const unpriced = un.filter(g => cost(g, "priceLoose") == null && !g.priceStatus).length;
      const next = visible().filter(gr => !owned(gr) && onInput(gr).some(m => m.status !== "NOT obtainable")).sort(byTitan)[0];
      title = `COLLECTION${scope}`;
      body = `<div class="tx-rows"><span class="y">OWNED</span><span>${own.length} of ${obt.length} obtainable releases</span><span class="g">${obt.length ? Math.round(100 * own.length / obt.length) : 0}%</span>
        <span class="y">PLAYED</span><span>${pool.filter(g => t(g.key).played).length} releases</span><span></span>
        <span class="y">UPLOADED</span><span>${pool.filter(g => t(g.key).videoUrl).length} episodes</span><span></span>
        <span class="y">TO FINISH</span><span>${sum("priceLoose")} loose, ${sum("priceCib")} boxed</span><span></span></div>
        ${unpriced ? `<p class="r" style="margin-top:.5em">Not counting ${unpriced} release${unpriced > 1 ? "s" : ""} with no price.</p>` : ""}
        ${next ? `<p style="margin-top:.5em"><span class="y">NEXT UP:</span> <a data-game="${esc(next.id)}">${esc(next.rep.title)}</a>, the highest Titan score you don't own yet.</p>` : ""}`;
    } else if (page === 400) {
      title = "SYSTEMS";
      body = `<div class="tx-rows">${ordered(systems).map(s => { const rs = games.filter(g => sysId(g.key) === s.id), ys = rs.map(g => g.year).filter(Boolean);
        return `<a data-sys="${esc(s.id)}" class="${s.id === input ? "y" : ""}">${esc(s.name)}</a><span class="c">${rs.length} games${ys.length ? `, ${Math.min(...ys)}–${Math.max(...ys)}` : ""}</span><span class="g">${rs.filter(g => t(g.key).owned).length} own</span>`; }).join("")}
        <a data-sys="" class="${input ? "" : "y"}">All systems</a><span class="c">${games.length} releases</span><span></span></div>`;
    } else {
      const noYear = games.filter(g => g.year == null).length;
      title = "FMV TEXT · INDEX";
      body = `<div class="tx-rows">${ERAS.map((e, i) => `<span class="y">P${101 + i}</span><a data-page="${101 + i}">${esc(e.title)}</a><span class="g">${e.from}${e.to < 9999 ? "–" + e.to : "+"}</span>`).join("")}
        <span class="y">P200</span><a data-page="200">Titan top 12</a><span></span>
        <span class="y">P300</span><a data-page="300">Your collection</a><span></span>
        <span class="y">P400</span><a data-page="400">Systems and inputs</a><span></span></div>
        <p style="margin-top:.6em">${games.length} releases of ${groups.length} games on ${systems.length} systems.${noYear ? ` ${noYear} release${noYear > 1 ? "s have" : " has"} no known year and ${noYear > 1 ? "are" : "is"} only in the item shop.` : ""} Type a page number to jump.</p>`;
    }
    const i = PAGES.indexOf(page);
    view.className = "ch-view txt";
    view.innerHTML = `<div class="tx-bar"><span><b>P${page}</b> FMV TEXT</span><span>${esc(inputName())}</span></div><h2>${title}</h2><div class="tx-body">${body}</div>
      <div class="tx-keys"><button style="background:#FF2A3C" data-page="${PAGES[(i + PAGES.length - 1) % PAGES.length]}">◀ P${PAGES[(i + PAGES.length - 1) % PAGES.length]}</button><button style="background:#5CF27A" data-k="ok">OK Tune in</button><button style="background:#FFD23F" data-page="${PAGES[(i + 1) % PAGES.length]}">P${PAGES[(i + 1) % PAGES.length]} ▶</button><button style="background:#3AE0FF" data-page="100">P100 Index</button></div>`;
  };

  // ---------- status screen ----------
  const renderStatus = () => {
    const g = byId.get(statusId); if (!g) return;
    const tr = g.titan, best = g.best && byKey.get(g.best);
    const titles = [...new Set(g.members.filter(m => !m.includes?.length).map(m => m.title))].filter(x => x !== g.rep.title);
    const stat = (l, v, c, note = "") => { const n = Math.round((v || 0) / 10); return `<div class="st-stat" style="--c:${c}"><span>${l}</span><span class="st-seg">${Array.from({ length: 10 }, (_, k) => `<i class="${k < n ? "f" : ""}" style="--k:${k}"></i>`).join("")}</span><output>${Math.round(v || 0)}${note}</output></div>`; };
    const sr = g.speedrun;
    const pbs = g.members.filter(m => t(m.key).pb);
    const boards = (sr?.boards || []).map(b => `<div class="st-board">${link(b.url, b.name)}${b.runs != null ? ` <span class="dim">· ${b.runs} run${b.runs === 1 ? "" : "s"}, ${depth(b.runs)}</span>` : ""}${b.keys ? ` <span class="dim">· ${esc(b.keys.map(short).join(", "))} only</span>` : ""}
      ${b.categories?.length ? `<ul>${b.categories.map(c => `<li>${esc(c.name)}: ${c.wr ? `${c.wrUrl ? link(c.wrUrl, c.wr) : esc(c.wr)}${c.wrRunner ? " by " + esc(c.wrRunner) : ""}${c.wrPlatform ? `, ${esc(c.wrPlatform)}` : ""}` : "no time yet"}</li>`).join("")}</ul>` : ""}${b.note ? `<p class="dim">${esc(b.note)}</p>` : ""}</div>`).join("");
    const saves = g.members.filter(m => { const e = t(m.key); return e.owned || e.played || e.episode || e.videoUrl || e.notes || e.pb; });
    const art = [g.members.find(m => m.key === g.best), g.rep, ...g.members].find(m => m?.art);
    view.className = "ch-view status";
    view.innerHTML = `<div class="st-head"><div><h2>${esc(g.rep.title)}</h2>${window.FMVClassification.badgeHTML({...g.rep,gameId:g.id},lineage,true)}<div class="st-cls">${esc(g.rep.category)} · ${g.year ?? "year unknown"} · ${esc(g.rep.developer)}${titles.length ? ` · also ${esc(titles.join(", "))}` : ""}</div></div>
        <div class="st-lv ${tr?.rank <= 50 ? "top" : ""}">TITAN<b>${tr ? tr.score.toFixed(1) : "--"}</b>${tr ? `RANK ${tr.rank}/${titanCount}` : ""}</div></div>
      <div class="st-body">
        <div class="st-box"><h3>Stats</h3>${tr ? `${stat("QUALITY", tr.quality, "#3AE0FF", tr.qualityEstimated ? "*" : "")}${stat("CULTURE", tr.culture, "#FF6A5C")}${stat("REACH", tr.span, "#5CF27A")}${stat("FMV", tr.fmv, "#FFD23F")}
          <p class="dim">${tr.qualityEstimated ? "* No reviews found, so quality is the database median. " : ""}${tr.qualityFrom ? `Quality from ${esc(tr.qualityFrom)}.` : ""} Reach: ${tr.platforms} platform${tr.platforms === 1 ? "" : "s"}${tr.x32 ? " incl. 32X CD" : ""}${tr.modern ? " plus a modern re-release" : ""}.</p>` : `<p>No Titan score yet.</p>`}
          <p>${esc(g.rep.genre || "")}${g.rep.fmvType ? ` · ${esc(g.rep.fmvType)} video` : ""} · FMV ${g.fmv}/10</p>${g.rep.cast && g.rep.cast !== "—" ? `<p>STARRING ${esc(g.rep.cast)}</p>` : ""}</div>
        <div class="st-box"><h3>Party · ${g.members.length} version${g.members.length > 1 ? "s" : ""}</h3>
          <div class="st-party">${g.members.map(m => `<button data-key="${esc(m.key)}" class="${m.key === g.best ? "eq" : ""} ${t(m.key).owned ? "own" : ""}" style="--c:${color(m.key)}" title="${esc(m.title)}">${esc(short(m.key))}<small>${m.year ?? "?"}${m.includes?.length ? " · set" : ""}</small></button>`).join("")}</div>
          ${best ? `<p style="margin-top:8px">EQUIPPED: ${esc(best.system)}. ${esc(g.bestWhy)}</p>` : g.members.length > 1 ? `<p class="dim" style="margin-top:8px">No version picked as the one to play yet.</p>` : ""}
          <p class="dim">A green bar under a version means you own it.</p></div>
        ${art ? `<div class="st-box st-art"><h3>Cover and pictures</h3>${galleryHTML(art)}</div>` : ""}
        <div class="st-box"><h3>Quest log</h3><p>${esc(g.rep.hook)}</p>${tr?.cultureWhy ? `<p class="dim">${esc(tr.cultureWhy)}</p>` : ""}
          ${tr?.cultureSources?.length ? `<p>${tr.cultureSources.map(u => link(u, host(u))).join(" · ")}</p>` : ""}</div>
        <div class="st-box"><h3>Hi-score${sr?.class ? ` · ${esc(sr.class === "Official" ? "Official board" : sr.class)}` : ""}</h3>
          ${boards || (sr?.rules ? "" : `<p>No board checked yet.</p>`)}${sr?.rules ? `<p><b>Rules:</b> ${esc(sr.rules)}</p>` : ""}
          ${pbs.map(m => `<p>YOUR PB ${esc(t(m.key).pb)} on ${esc(short(m.key))}${t(m.key).srcPlace ? ` · ${esc(t(m.key).srcPlace)}` : ""}</p>`).join("")}
          ${sr?.checked ? `<p class="dim">Speedrun.com checked ${esc(sr.checked)}.</p>` : ""}</div>
        <div class="st-box st-wide"><h3>Save file</h3>${saves.length ? saves.map(m => { const e = t(m.key); return `<p>${esc(short(m.key))}: ${[e.owned && `owned${e.format ? ` (${esc(e.format)})` : ""}`, e.played && "played", e.episode && `episode ${esc(e.episode)}`, e.videoUrl && link(e.videoUrl, "video"), e.pb && `PB ${esc(e.pb)}`].filter(Boolean).join(" · ") || "notes only"}${e.notes ? ` <span class="dim">· ${esc(e.notes)}</span>` : ""}</p>`; }).join("") : `<p class="dim">No save data. Mark a version owned or played in the item shop.</p>`}</div>
        <button class="st-go" data-k="ok"><span class="cur">▶</span> OK · Versions and prices</button>
      </div>`;
  };

  // ---------- item shop: every version ----------
  const TABS = [["item", "Item"], ["play", "Play"], ["lore", "Lore"], ["reviews", "Reviews"], ["save", "Save"]];
  const renderShop = () => {
    const g = byId.get(statusId); if (!g) return;
    const vs = g.members; vsel = Math.min(vsel, vs.length - 1);
    const v = vs[vsel], e = t(v.key);
    const max = Math.max(1, ...vs.flatMap(x => [x.priceLoose, x.priceCib, x.priceNew].filter(p => p != null)));
    const cheap = vs.filter(x => x.priceLoose != null && x.status !== "NOT obtainable").sort((a, b) => a.priceLoose - b.priceLoose)[0];
    const row = (l, x, cls = "") => x != null && x !== "" && x !== "—" ? `<dt>${l}</dt><dd class="${cls}">${esc(x)}</dd>` : "";
    const pbar = (l, x) => `<div class="sh-pb"><span>${l}</span><i style="--v:${x == null ? 0 : x / max * 100}%"></i><output>${money(x)}</output></div>`;
    const isArcade = sysId(v.key) === "laserdisc";
    const regions = [v.na && "NA", v.jp && "JP", v.eu && "EU"].filter(Boolean).join(" ") + (v.x32 ? " · 32X CD" : "");
    const panes = {
      item: `${v.priceLoose != null || v.priceCib != null || v.priceNew != null ? `${pbar("LOOSE", v.priceLoose)}${pbar("BOXED", v.priceCib)}${pbar("SEALED", v.priceNew)}
          <p class="dim">PriceCharting ${esc(v.priceDate || "")} ${link(v.urlPriceCharting, "check today's price")}</p>` : `<p>${isArcade ? "Arcade boards are not listed on PriceCharting." : v.priceNote ? "No market price. " + esc(v.priceNote) : "No PriceCharting listing."}</p>`}
        ${v.priceDigital != null ? `<p>DIGITAL ${money(v.priceDigital)} on ${esc(v.digitalStore)}, ${esc(v.priceDigitalDate)} ${link(v.urlStore, "store page")}</p>` : ""}
        <dl class="sh-specs">${row("REGION", regions)}${row("STATUS", v.status, v.status === "NOT obtainable" ? "warn" : "")}${row("ACCESS", v.access)}${row("PUBLISHER", v.publisher)}${row("DEVELOPER", v.developer)}${row("DISCS", v.discs)}${row("SAVES", v.save)}${row("NEEDS", v.peripherals)}${v.includes?.length ? row("ON THE DISC", v.includes.map(id => byId.get(id)?.rep.title || id).join(", ")) : ""}</dl>
        ${v.key === g.best && g.bestWhy ? `<p style="margin-top:8px">★ THE ONE TO PLAY. ${esc(g.bestWhy)}</p>` : ""}`,
      play: `<dl class="sh-specs">${row("PLAY IT", [v.access, v.wherePlay].filter(Boolean).join(". "))}${row("RE-RELEASED", v.modern)}${row("LENGTH", v.length)}${row("DIFFICULTY", v.difficulty)}${row("ENDINGS", v.endings)}${row("VIDEO", v.video)}${row("CONTENT ID", [v.cidRisk, v.cidTrigger].filter(Boolean).join(": "), /HIGH|Med–High/.test(v.cidRisk || "") ? "warn" : "")}${row("CHEATS", v.cheats)}</dl>`,
      lore: `<dl class="sh-specs">${row("GENRE", v.genre)}${row("CATEGORY", v.category)}${row("FMV", `${v.fmv}/10${v.fmvType ? ", " + v.fmvType.toLowerCase() : ""}`)}${row("CAST", v.cast)}${row("SOURCE", v.source)}${row("ALSO ON", v.alsoOn)}${row("TRIVIA", v.trivia)}${row("VARIANTS", v.variants)}${row("NOTES", v.notes)}</dl>`,
      reviews: `<dl class="sh-specs">${v.sega16 ? row("SEGA-16", v.sega16) : ""}${row("MOBY CRITICS", v.mobyCritic)}${row("MOBY PLAYERS", v.mobyPlayer ? v.mobyPlayer + " / 5" : "")}${row("CRITICS", v.critic ? `${v.critic}${v.criticSrc ? ", " + v.criticSrc : ""}` : "")}</dl>
        ${!v.sega16 && !v.mobyCritic && !v.mobyPlayer && !v.critic ? `<p>No review scores on file for this version.</p>` : ""}
        <h3>Links</h3><div class="sh-links">${[[v.urlWiki, "Wikipedia"], [v.urlMoby, "MobyGames"], [v.urlBackloggd, "Backloggd"], [v.urlSegaRetro, "Sega Retro"], [v.urlSega16, "Sega-16 review"], [v.urlCritic, "Review source"], [v.urlKLOV, "KLOV"], [v.urlPriceCharting, "PriceCharting"]].map(([u, l]) => link(u, l)).filter(Boolean).join("") || "<span>None yet.</span>"}</div>`,
      save: `<div class="sh-save"><button data-save="owned" aria-pressed="${!!e.owned}">${e.owned ? "■" : "□"} OWNED</button><button data-save="played" aria-pressed="${!!e.played}">${e.played ? "■" : "□"} PLAYED</button></div>
        <dl class="sh-specs">${row("FORMAT", e.format)}${row("EPISODE", e.episode)}${row("RECORDED", e.recorded)}${row("UPLOADED", e.uploaded)}${e.videoUrl ? `<dt>VIDEO</dt><dd>${link(e.videoUrl, "watch")}</dd>` : ""}${row("RUNTIME", e.runtime)}${row("NOTES", e.notes)}${row("CHALLENGE", e.challenge)}${row("ATTEMPTS", e.attempts && `${e.attempts}${e.clears ? `, ${e.clears} cleared` : ""}`)}${row("PB", e.pb)}${e.srcRun ? `<dt>RUN</dt><dd>${link(e.srcRun, e.srcPlace || "on Speedrun.com")}</dd>` : ""}</dl>
        <p class="dim" style="margin-top:8px">Saved in this browser, shared with the index. <a href="./#${encodeURIComponent(v.key)}">Edit episode, notes and runs in the index</a>.</p>`,
    };
    view.className = "ch-view status shop";
    view.innerHTML = `<div class="st-head"><div><h2>Item shop</h2><div class="st-cls">${esc(g.rep.title)} · ${vs.length} version${vs.length > 1 ? "s" : ""}${cheap ? ` · cheapest is ${esc(short(cheap.key))} at ${money(cheap.priceLoose)} loose` : ""}</div></div><div class="st-lv">GOLD<b>${money(v.priceLoose)}</b>LOOSE</div></div>
      <div class="st-body">
        <div class="st-box"><h3>Versions</h3><ol class="sh-inv">${vs.map((x, i) => `<li data-v="${i}" class="${i === vsel ? "sel" : ""}"><span class="cur">▶</span><span class="t"><span class="ch-sys"><i style="--c:${color(x.key)}"></i></span> ${esc(short(x.key))} ${x.year ?? "?"}${x.key === g.best ? " ★" : ""}${t(x.key).owned ? " ·OWN" : ""}</span><span class="sc">${x.priceLoose != null ? money(x.priceLoose) : sysId(x.key) === "laserdisc" ? "ARCADE" : "--"}</span></li>`).join("")}</ol>
          <p class="dim" style="margin-top:8px">★ the version to play. ◀ ▶ switch pages.</p></div>
        <div class="st-box"><h3>${esc(v.title)}${v.alt ? ` <span class="dim">(${esc(v.alt)})</span>` : ""} · ${esc(v.system)}</h3>${window.FMVClassification.badgeHTML(v,lineage)}
          <div class="sh-tabs" role="tablist">${TABS.map(([k, l]) => `<button role="tab" data-tab="${k}" aria-selected="${k === tab}">${l}</button>`).join("")}</div>
          ${panes[tab]}</div>
      </div>`;
    $(".sh-inv li.sel", view)?.scrollIntoView({ block: "nearest" });
  };

  const render = () => {
    if (!years.length && mode === "ch") return renderChannel();
    ({ txt: renderTxt, status: renderStatus, shop: renderShop }[mode] || renderChannel)();
    paintDial();
  };

  // ---------- address: #gameId opens a status screen, #record-key the item shop on that version, ?system= the input ----------
  const syncUrl = () => {
    const u = new URL(location.href);
    input ? u.searchParams.set("system", input) : u.searchParams.delete("system");
    u.hash = mode === "status" ? statusId : mode === "shop" ? byId.get(statusId)?.members[vsel]?.key || "" : "";
    history.replaceState(null, "", u);
    for (const [id, href] of [["#nav-games", "./"], ["#nav-timeline", "timeline.html"], ["#nav-titans", "titans.html"]]) $(id).href = href + u.search;
  };

  // ---------- controls ----------
  const tune = d => {
    if (!years.length) return;
    const prev = eraOf(years[yi]);
    yi = Math.min(years.length - 1, Math.max(0, yi + d)); sel = 0;
    const e = eraOf(years[yi]);
    if (e !== prev && !seenEra.has(e)) { mode = "txt"; page = 101 + ERAS.indexOf(e); } else mode = "ch";
    seenEra.add(e);
    burst(); render(); syncUrl();
  };
  const tuneTo = y => { const i = years.findIndex(v => v >= y); const n = i < 0 ? years.length - 1 : i; if (n !== yi) tune(n - yi); };
  const openStatus = id => { statusId = id; mode = "status"; burst(120); render(); syncUrl(); };
  const openShop = key => { const g = byId.get(statusId); vsel = Math.max(0, key ? g.members.findIndex(m => m.key === key) : g.members.findIndex(m => m.key === g.best)); mode = "shop"; burst(120); render(); syncUrl(); };
  const move = d => {
    if (mode === "shop") { const n = byId.get(statusId).members.length; vsel = (vsel + d + n) % n; render(); syncUrl(); return; }
    if (mode === "txt") { $(".tx-body", view)?.scrollBy({ top: d * 60 }); return; }
    if (mode === "status") { $(".st-body", view)?.scrollBy({ top: d * 80 }); return; }
    const n = channelGames().length; if (!n) return; sel = (sel + d + n) % n; render();
  };
  const side = d => {
    if (mode === "shop") { const i = TABS.findIndex(([k]) => k === tab); tab = TABS[(i + d + TABS.length) % TABS.length][0]; render(); return; }
    if (mode === "txt") { const i = PAGES.indexOf(page); page = PAGES[(i + d + PAGES.length) % PAGES.length]; render(); return; }
    if (mode === "status") { const gs = channelGames(), i = gs.findIndex(x => x.id === statusId); if (i >= 0 && gs.length > 1) { sel = (i + d + gs.length) % gs.length; openStatus(gs[sel].id); } return; }
    tune(d);
  };
  const ok = () => {
    if (mode === "txt") {
      if (page >= 101 && page <= 106) { const e = ERAS[page - 101]; seenEra.add(e); const i = years.findIndex(y => y >= e.from && y <= e.to); if (i >= 0 && i !== yi) { yi = i; sel = 0; } }
      mode = "ch"; burst(120); render(); syncUrl(); return;
    }
    if (mode === "ch") { const g = channelGames()[sel]; if (g) openStatus(g.id); return; }
    if (mode === "status") return openShop();
  };
  const back = () => {
    if (mode === "shop") { mode = "status"; burst(90); render(); syncUrl(); return; }
    if (mode !== "ch") { mode = "ch"; burst(90); render(); syncUrl(); }
  };
  const txt = () => { if (mode === "txt") { mode = "ch"; } else { mode = "txt"; page = years.length ? 101 + ERAS.indexOf(eraOf(years[yi])) : 100; } burst(120); render(); syncUrl(); };
  const order = () => ["", ...ordered(systems).map(s => s.id)];
  const setInput = id => {
    input = id; const keep = years[yi] ?? 1983;
    computeYears(keep); sel = 0;
    if (mode === "status" || mode === "shop") mode = "ch";
    toast(`INPUT: ${inputName().toUpperCase()}`);
    buildDial(); burst(160); render(); syncUrl();
  };
  const cycleInput = () => { const o = order(); setInput(o[(o.indexOf(input) + 1) % o.length]); };
  const act = { chup: () => tune(1), chdown: () => tune(-1), up: () => move(-1), down: () => move(1), ok, back, txt, input: cycleInput };

  document.querySelector(".ch-remote").addEventListener("click", e => { const b = e.target.closest("[data-k]"); if (b) act[b.dataset.k](); });
  let digits = "", digitT = 0;
  addEventListener("keydown", e => {
    if (e.target.closest("input, textarea, select")) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "Escape" || e.key === "Backspace") { back(); e.preventDefault(); return; }
    if (/^\d$/.test(e.key)) {
      digits += e.key; clearTimeout(digitT); digitT = setTimeout(() => digits = "", 2000);
      if (digits.length === 3) { const p = +digits; digits = ""; if (PAGES.includes(p)) { mode = "txt"; page = p; burst(90); render(); syncUrl(); } else toast(`P${p} NOT FOUND`); }
      return;
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") { if (e.target.closest("#dial")) return; side(e.key === "ArrowRight" ? 1 : -1); e.preventDefault(); return; }
    const k = { ArrowUp: "up", ArrowDown: "down", Enter: "ok", " ": "ok", t: "txt", T: "txt", i: "input", I: "input" }[e.key];
    if (k && !(e.target.closest("button, a") && (e.key === "Enter" || e.key === " "))) { act[k](); e.preventDefault(); }
  });
  view.addEventListener("click", e => {
    const a = e.target.closest("[data-k]"); if (a) return act[a.dataset.k]();
    const pg = e.target.closest("[data-page]"); if (pg) { page = +pg.dataset.page; render(); return; }
    const gm = e.target.closest("[data-game]"); if (gm) { const gr = byId.get(gm.dataset.game); tuneQuiet(yearOf(gr)); sel = channelGames().indexOf(gr); return openStatus(gr.id); }
    const sy = e.target.closest("[data-sys]"); if (sy) { setInput(sy.dataset.sys); mode = "txt"; page = 400; render(); return; }
    const li = e.target.closest(".ch-menu li"); if (li) { const i = +li.dataset.i; if (i === sel) ok(); else { sel = i; render(); } return; }
    const pv = e.target.closest(".st-party button"); if (pv) return openShop(pv.dataset.key);
    const vl = e.target.closest(".sh-inv li"); if (vl) { vsel = +vl.dataset.v; render(); syncUrl(); return; }
    const tb = e.target.closest("[data-tab]"); if (tb) { tab = tb.dataset.tab; render(); return; }
    const sv = e.target.closest("[data-save]"); if (sv) { const v = byId.get(statusId).members[vsel], en = entry(v.key); en[sv.dataset.save] = !en[sv.dataset.save]; saveTracker(); render(); return; }
    if (mode === "txt" && !e.target.closest("a, button")) ok();
  });
  const tuneQuiet = y => { const i = years.indexOf(y); if (i >= 0) { yi = i; seenEra.add(eraOf(y)); } };
  // the wheel moves the cursor; a sideways swipe changes channel
  let wheelAcc = 0;
  screen.addEventListener("wheel", e => { if (mode !== "ch") return; e.preventDefault(); wheelAcc += e.deltaY; if (Math.abs(wheelAcc) > 40) { move(Math.sign(wheelAcc)); wheelAcc = 0; } }, { passive: false });
  let tx = null, ty = null;
  screen.addEventListener("touchstart", e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  screen.addEventListener("touchend", e => {
    if (tx == null) return; const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; tx = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) side(dx < 0 ? 1 : -1);
  });

  // ---------- tuner dial: games per year on the current input ----------
  const dial = $("#dial");
  let Y0 = 1981, Y1 = 2025;
  const xOf = y => ((y - Y0 + .5) / (Y1 - Y0 + 1)) * 100;
  const buildDial = () => {
    const all = groups.map(g => g.year).filter(y => y != null);
    Y0 = Math.min(...all); Y1 = Math.max(...all);
    const per = {}; for (const gr of visible()) { const y = yearOf(gr); per[y] = (per[y] || 0) + 1; }
    const maxN = Math.max(1, ...Object.values(per)), w = 100 / (Y1 - Y0 + 1);
    let html = "";
    for (let y = Y0; y <= Y1; y++) if (per[y]) html += `<i class="h" data-y="${y}" style="left:calc(${xOf(y) - w / 2}% + 1px);width:calc(${w}% - 2px);height:${4 + 28 * Math.sqrt(per[y] / maxN)}px" title="${y}: ${per[y]} games"></i>`;
    for (let y = Math.ceil(Y0 / 10) * 10 - 5; y <= Y1; y += 10) if (y >= Y0) html += `<span class="yl" style="left:${xOf(y)}%">${y}</span>`;
    ERAS.forEach((e, i) => { const a = Math.max(e.from, Y0), b = Math.min(e.to, Y1); html += `<span class="era" style="left:${xOf(a) - w / 2}%;width:${(b - a + 1) * w}%;top:${i % 2 ? 15 : 4}px">${esc(e.title)}</span>`; });
    dial.innerHTML = html + `<div class="ch-needle" id="needle"></div>`;
    dial.setAttribute("aria-valuemin", Y0); dial.setAttribute("aria-valuemax", Y1);
  };
  const paintDial = () => {
    const y = years[yi]; if (y == null || !$("#needle")) return;
    $("#needle").style.left = xOf(y) + "%";
    dial.querySelectorAll(".h").forEach(h => h.classList.toggle("lit", +h.dataset.y === y));
    dial.setAttribute("aria-valuenow", y); dial.setAttribute("aria-valuetext", `${y}, ${eraOf(y).title}, ${channelGames().length} games`);
  };
  const fromPointer = e => { const r = dial.getBoundingClientRect(); tuneTo(Math.round(Y0 - .5 + (e.clientX - r.left) / r.width * (Y1 - Y0 + 1))); };
  let dragging = false;
  dial.addEventListener("pointerdown", e => { dragging = true; dial.setPointerCapture(e.pointerId); fromPointer(e); });
  dial.addEventListener("pointermove", e => { if (dragging) fromPointer(e); });
  dial.addEventListener("pointerup", () => dragging = false);
  dial.addEventListener("keydown", e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); tune(e.key === "ArrowRight" ? 1 : -1); } });

  // ---------- init ----------
  const init = async () => {
    const data = await (await fetch("data/games.json", { cache: "no-cache" })).json();
    games = data.games; lineage = data.lineage || {};
    systems = ordered(data.systems || []);
    titanCount = Object.values(lineage).filter(l => l.titan).length;
    await loadTracker();
    groups = buildGroups();
    byId = new Map(groups.map(g => [g.id, g])); byKey = new Map(games.map(g => [g.key, g]));
    const want = new URLSearchParams(location.search).get("system");
    if (want && systems.some(s => s.id === want)) input = want;
    computeYears(1983);
    buildDial();
    // #gameId opens its status screen; a record key opens the item shop on that version
    const h = decodeURIComponent(location.hash.slice(1));
    const rec = byKey.get(h), gr = byId.get(h) || (rec && byId.get(idsOf(rec)[0]));
    if (gr && yearOf(gr) == null) input = "";
    if (gr) { computeYears(yearOf(gr) ?? 1983); tuneQuiet(yearOf(gr)); sel = Math.max(0, channelGames().indexOf(gr)); statusId = gr.id; mode = "status"; if (rec) { render(); openShop(rec.key); } }
    else { mode = "txt"; page = 101 + ERAS.indexOf(eraOf(years[yi])); seenEra.add(eraOf(years[yi])); }
    buildDial(); render(); syncUrl();
    screen.classList.add("on");
  };
  init();
})();
