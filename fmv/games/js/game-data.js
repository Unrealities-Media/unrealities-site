/* Shared, DOM-free model for the game field guides. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.FMVGameData = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const externalURL = value => {
    try { const url = new URL(String(value || '')); return /^(https?):$/.test(url.protocol) ? url.href : ''; }
    catch { return ''; }
  };
  const buildCatalog = data => {
    const buckets = new Map();
    for (const record of data.games || []) {
      for (const id of new Set([record.gameId || record.key, ...(record.includes || [])])) {
        if (!buckets.has(id)) buckets.set(id, []);
        buckets.get(id).push(record);
      }
    }
    return [...buckets].map(([id, records]) => {
      const members = records.slice().sort((a,b) => (a.year ?? Infinity) - (b.year ?? Infinity) || a.key.localeCompare(b.key));
      const originals = members.filter(g => g.gameId === id && !g.includes?.length);
      const representative = originals[0] || members.find(g => g.gameId === id) || members[0];
      const first = originals[0] || members[0];
      return { id, title: representative.title, representative, members, year: first.year ?? null, line: data.lineage?.[id] || {} };
    }).sort((a,b) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id));
  };
  const resolveGame = (catalog, identifier, versionKey) => {
    if (!identifier) return null;
    // A release key resolves its own game, including when that release is a compilation.
    const keyed = catalog.flatMap(g => g.members).find(g => g.key === identifier);
    const group = catalog.find(g => g.id === (keyed ? keyed.gameId || keyed.key : identifier));
    if (!group) return null;
    const release = group.members.find(g => g.key === (versionKey || keyed?.key)) ||
      group.members.find(g => g.key === group.line.best) || group.representative;
    return {group, release};
  };
  const episodesFor = (group, tracker = {}) => {
    const seen = new Set(), videos = [];
    for (const release of group.members) {
      const entry = tracker[release.key] || {};
      const url = externalURL(entry.videoUrl);
      if (!url || seen.has(url)) continue;
      seen.add(url);
      videos.push({url, key:release.key, system:release.system, episode:entry.episode || '', uploaded:entry.uploaded || '', runtime:entry.runtime || ''});
    }
    return videos;
  };
  const publicText = value => {
    const prose=String(value ?? '');
    if(/^\s*Season Zero (?:episode proposal|route)\b/i.test(prose))return '';
    return prose.split(/(?<=[.!?])\s+(?=[A-Z])/)
      .filter(sentence => !/Season Zero|episode proposal|episode prep|for (?:the|this|an?) episode|the main episode|\bTom (?:owns|confirmed|reported)\b|no recordings? yet|recording pending|capture (?:tests?|checks?|validation|not tested)|owned tower|R\.I\.P\./i.test(sentence)).join(' ').trim();
  };
  const sourcesFor = group => {
    const sources = new Map();
    const add = (url, title) => { const safe = externalURL(url); if (safe && !sources.has(safe)) sources.set(safe, {url:safe,title:title || new URL(safe).hostname.replace(/^www\./,'')}); };
    const titles = {urlWiki:'Wikipedia',urlMoby:'MobyGames',urlSega16:'Sega-16 review',urlCritic:'Review source',urlSegaRetro:'Sega Retro',urlKLOV:'Arcade Museum',urlBackloggd:'Backloggd',urlPriceCharting:'PriceCharting',urlStore:'Store'};
    for (const release of group.members) for (const [field,value] of Object.entries(release)) {
      if (typeof value !== 'string') continue;
      if (titles[field]) add(value,`${titles[field]} · ${release.system}`);
      else for (let match of value.matchAll(/https?:\/\/[^\s<>"']+/g)) {
        let url = match[0].replace(/[.,;]+$/,'');
        while (url.endsWith(')') && (url.match(/\)/g)||[]).length > (url.match(/\(/g)||[]).length) url = url.slice(0,-1);
        add(url);
      }
    }
    for (const url of group.line.titan?.cultureSources || []) add(url,'Cultural context');
    return [...sources.values()];
  };
  const localPath = value => typeof value === 'string' && value && !/^(?:[a-z]+:|\/)|(?:^|\/)\.\.(?:\/|$)/i.test(value);
  const mediaFor = (group, supplemental = {}, allowLocal = false) => {
    const seen = new Set(), media = [];
    const add = (item, release, kind, prefix='') => {
      if (!item || !localPath(item.file) || (item.localOnly && !allowLocal)) return;
      const src = prefix + item.file;
      if (seen.has(src)) return;
      seen.add(src);
      media.push({...item,src,key:release.key,system:release.system,kind,title:item.title || (kind === 'cover' ? 'Cover' : 'Game image'),page:externalURL(item.page)});
    };
    for (const release of group.members) {
      add(release.art?.cover,release,'cover','img/');
      for (const item of release.art?.shots || []) add(item,release,'shot','img/');
      for (const item of supplemental[release.key] || []) add(item,release,item.kind === 'screenshot' ? 'shot' : item.kind || 'shot');
    }
    return media;
  };
  const comparisonFor = (group, keys) => [...new Set(keys)].map(key => group.members.find(g => g.key === key)).filter(Boolean).slice(0,3);
  return {buildCatalog,resolveGame,episodesFor,publicText,sourcesFor,mediaFor,externalURL,comparisonFor};
});
