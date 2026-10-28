/* Shared system table for every page: display order, short badge names, identity colors and the group each system sits in.
   data/games.json holds the systems in the order they were added; pages show them in this order instead. A system missing
   here still works: it sorts last with its full name and a grey badge. */
(() => {
  // Grouped as arcade, home consoles by launch year, then computers. Colors are an identity cue only; every badge also carries the name.
  const SYSTEMS = [
    { id: "laserdisc", short: "Arcade LD", color: "#5CF27A", group: "Arcade" },
    { id: "tgcd", short: "TG-CD", color: "#FF8A00", group: "Consoles" },
    { id: "cdtv", short: "CDTV", color: "#FF9F43", group: "Consoles" },
    { id: "segacd", short: "Sega CD", color: "#1E5BFF", group: "Consoles" },
    { id: "cdi", short: "CD-i", color: "#3AE0FF", group: "Consoles" },
    { id: "cd32", short: "CD32", color: "#FF9F43", group: "Consoles" },
    { id: "3do", short: "3DO", color: "#FFD23F", group: "Consoles" },
    { id: "laseractive", short: "LaserActive", color: "#D94BFF", group: "Consoles" },
    { id: "playdia", short: "Playdia", color: "#FFB7E0", group: "Consoles" },
    { id: "saturn", short: "Saturn", color: "#FF6A5C", group: "Consoles" },
    { id: "32x", short: "32X", color: "#1E5BFF", group: "Consoles" },
    { id: "ps1", short: "PS1", color: "#B9A4FF", group: "Consoles" },
    { id: "pcfx", short: "PC-FX", color: "#C6F25C", group: "Consoles" },
    { id: "jaguarcd", short: "Jag CD", color: "#E8452C", group: "Consoles" },
    { id: "pippin", short: "Pippin", color: "#F2A5D8", group: "Consoles" },
    { id: "dvd", short: "DVD", color: "#00B3A4", group: "Consoles" },
    { id: "ps2", short: "PS2", color: "#B9A4FF", group: "Consoles" },
    { id: "console", short: "Later", color: "#8FD3FF", group: "Consoles" },
    { id: "pc", short: "PC", color: "#D8C9A3", group: "Computers" },
    { id: "mac", short: "Mac", color: "#E4E4EC", group: "Computers" },
  ];
  const BY_ID = Object.fromEntries(SYSTEMS.map((s, i) => [s.id, { ...s, rank: i }]));
  // Preserve links/bookmarks while correcting the original platform attribution.
  const correctedSystems = {'ps1-117':'ps2','cd32-6':'cdtv','cd32-7':'cdtv','cd32-9':'cdtv'};
  const sysId = key => correctedSystems[key] || key.slice(0, key.lastIndexOf("-"));
  const info = id => BY_ID[id] || { id, short: id, color: "#9AA0B4", group: "Other", rank: SYSTEMS.length };

  // The systems list from data/games.json, sorted into display order, each with its short name, color and group added.
  const ordered = dataSystems => dataSystems.map(s => ({ ...info(s.id), ...s })).sort((a, b) => a.rank - b.rank);

  // A <select> of systems grouped into <optgroup>s, with a game count per system. Values are system ids.
  const fillSelect = (select, dataSystems, counts = {}) => {
    let group = null, og = null;
    for (const s of ordered(dataSystems)) {
      if (s.group !== group) { group = s.group; og = document.createElement("optgroup"); og.label = group; select.appendChild(og); }
      const o = document.createElement("option");
      o.value = s.id; o.textContent = s.name + (counts[s.id] != null ? ` (${counts[s.id]})` : "");
      og.appendChild(o);
    }
  };

  window.FMVSystems = { SYSTEMS, sysId, info, ordered, fillSelect };
})();
