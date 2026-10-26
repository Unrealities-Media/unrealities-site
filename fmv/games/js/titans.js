/* FMV Titans: games ranked by the Titan score that tools/titan.py writes into lineage[<gameId>].titan. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const host = u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; } };

  let rows = [];

  // One row per game: its records (compilations count under each game they include), the record to open, the score.
  const build = data => {
    const lineage = data.lineage || {};
    const { info, ordered } = window.FMVSystems;
    const sysName = Object.fromEntries(ordered(data.systems || []).map(s => [s.id, s.name]));
    const by = new Map();
    for (const g of data.games) for (const id of g.includes?.length ? g.includes : [g.gameId]) { if (!by.has(id)) by.set(id, []); by.get(id).push(g); }
    return [...by.entries()].filter(([id]) => lineage[id]?.titan).map(([id, ms]) => {
      const t = lineage[id].titan;
      ms.sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999));
      const own = ms.filter(m => !m.includes?.length);
      const open = ms.find(m => m.key === lineage[id].best) || own.find(m => m.na) || own[0] || ms[0];
      return {
        id, t, ms, open, title: (own.find(m => m.na) || own[0] || ms[0]).title, year: ms[0].year,
        systems: [...t.systems].sort((a, b) => info(a).rank - info(b).rank).map(s => sysName[s] || s), na: ms.some(m => m.na), jp: ms.some(m => m.jp), eu: ms.some(m => m.eu),
      };
    }).sort((a, b) => a.t.rank - b.t.rank);
  };

  const bar = (cls, label, v, note) => `<div class="ti-bar ${cls}"><span>${label}</span><i><b style="width:${v}%"></b></i><em>${Math.round(v)}${note || ""}</em></div>`;

  const render = () => {
    const n = +$("#ti-n").value, sys = $("#ti-sys").value, region = $("#ti-region").value;
    const pool = rows.filter(r => (!sys || r.t.systems.includes(sys)) &&
      (!region || (region === "jponly" ? r.jp && !r.na && !r.eu : r[region])));
    // Rank stays the Titan rank whatever the sort, so a game keeps its number when sorted by one component.
    const sort = $("#ti-sort").value;
    const key = sort === "year" ? r => r.year ?? 9999 : r => -(r.t[sort] ?? -1);
    pool.sort((a, b) => key(a) - key(b) || a.t.rank - b.t.rank);
    const shown = n ? pool.slice(0, n) : pool;
    const list = $("#ti-list"); list.innerHTML = "";
    for (const r of shown) {
      const t = r.t, li = document.createElement("li");
      li.className = "ti-row";
      const reach = `${t.platforms} platform${t.platforms === 1 ? "" : "s"}: ${r.systems.join(", ")}${t.x32 ? ", 32X CD" : ""}${t.modern ? ", modern re-release" : ""}`;
      li.innerHTML = `
        <span class="ti-rank">${t.rank}</span>
        <a class="thumb" href="game.html?game=${encodeURIComponent(r.id)}" aria-hidden="true" tabindex="-1"></a>
        <div class="ti-main">
          <a class="ti-title" href="game.html?game=${encodeURIComponent(r.id)}">${esc(r.title)}</a>
          <span class="ti-sub">${r.year ?? "year unknown"} · ${esc(reach)}</span>
          <div class="ti-bars">
            ${bar("q", "Quality", t.quality, t.qualityEstimated ? " est." : "")}
            ${bar("c", "Culture", t.culture)}
            ${bar("s", "Reach", t.span)}
            ${bar("f", "FMV", t.fmv)}
          </div>
          <details class="ti-why"><summary>Why</summary>
            <p><b>Culture.</b> ${t.cultureWhy ? esc(t.cultureWhy) : "Not rated yet."}
              ${t.cultureSources.map(u => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(host(u))}</a>`).join(" ")}</p>
            <p><b>Quality.</b> ${t.qualityFrom ? esc(t.qualityFrom) : "No critic score in the index yet; uses the median."}</p>
          </details>
        </div>
        <span class="ti-score" title="Titan score">${Math.round(t.score)}</span>`;
      window.FMVArt.artInto($(".thumb", li), r.open);
      list.appendChild(li);
    }
    $("#ti-count").textContent = `${rows.length} games scored.`;
  };

  const init = async () => {
    const data = await (await fetch("data/games.json", { cache: "no-cache" })).json();
    rows = build(data);
    const counts = {};
    for (const r of rows) for (const s of r.t.systems) counts[s] = (counts[s] || 0) + 1;
    window.FMVSystems.fillSelect($("#ti-sys"), data.systems || [], counts);
    // ?system=<id> opens the chart filtered to one system, like the index and the timeline.
    const want = new URLSearchParams(location.search).get("system");
    if (want && counts[want]) $("#ti-sys").value = want;
    const syncSysParam = () => {
      const u = new URL(location.href);
      $("#ti-sys").value ? u.searchParams.set("system", $("#ti-sys").value) : u.searchParams.delete("system");
      history.replaceState(null, "", u);
      $("#nav-games").href = "./" + u.search; $("#nav-timeline").href = "timeline.html" + u.search; $("#nav-channel").href = "channel.html" + u.search;
    };
    for (const el of document.querySelectorAll(".controls select")) el.addEventListener("input", render);
    $("#ti-sys").addEventListener("input", syncSysParam);
    syncSysParam(); render();
  };
  init();
})();
