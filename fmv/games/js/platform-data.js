/* Ownership-independent platform rankings and separate purchase-value estimates. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory(require('./priority-data.js'));
  else root.FMVPlatformData = factory(root.FMVPriority);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (languageModel) {
  'use strict';
  const systems = {pc:'PC', mac:'Macintosh', ...languageModel.systems, laserdisc:'Laserdisc arcade', dvd:'DVD'};
  const weights = {library:1, best:0.5, exclusive:1};
  const sys = languageModel.sys;
  const safeURL = languageModel.url;
  const number = value => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
  const round = value => Math.round(value * 100) / 100;
  const platformID = id => ({windows:'pc', linux:'pc', macos:'mac'})[id] || id;
  const live = release => /^Released\b/.test(release.status || '') && release.access !== 'Lost';
  const titleRank = game => game.line?.titan?.rank ?? Infinity;
  const orderGames = (a,b) => b.points-a.points || a.rank-b.rank || a.title.localeCompare(b.title);
  const mentionedPlatforms = text => {
    const rules=[['pc',/\bPC\b(?!-(?:FX|88|98)|\s+Engine)|Windows|Steam|GOG|DOSBox|\bDOS\b/i],['pc98',/PC-(?:88|98(?:21)?)/i],['tgcd',/TurboGrafx|PC\s*Engine/i],['pcfx',/PC-FX/i],['mac',/Macintosh|macOS|\bMac\b/i],['switch',/\bSwitch\b/i],['ps1',/\bPS1\b|PlayStation(?!\s*(?:[2345]|Network|Portable|Vita))/i],['ps2',/\bPS2\b|PlayStation\s*2/i],['ps3',/\bPS3\b|PlayStation\s*3/i],['ps4',/\bPS4\b|PlayStation\s*4/i],['ps5',/\bPS5\b|PlayStation\s*5/i],['xboxone',/Xbox\s*One/i],['xboxseries',/Xbox\s*Series/i],['xbox360',/Xbox\s*360/i],['ios',/iOS/i],['android',/Android/i],['dreamcast',/Dreamcast/i],['gamecube',/GameCube/i],['wiiu',/Wii\s*U/i],['psp',/\bPSP\b/i],['vita',/\bVita\b/i],['saturn',/Saturn/i],['3do',/3DO/i],['segacd',/Sega CD|Mega.CD|32X\s*CD/i],['cdi',/CD-i/i],['dvd',/DVD|Blu.ray/i]];
    const ids=rules.filter(([,pattern])=>pattern.test(text)).map(([id])=>id);
    if(/Xbox/i.test(text)&&!ids.some(id=>id.startsWith('xbox')))ids.push('xbox');
    if(/mobile/i.test(text)&&!ids.some(id=>['ios','android'].includes(id)))ids.push('mobile');
    if(/\bWii\b/i.test(text)&&!ids.includes('wiiu'))ids.push('wii');
    return ids;
  };
  const releaseClaims = text => String(text || '').split(';').filter(clause=>! /sequel|cancelled|canceled|unreleased|different games?|not a port|never released/i.test(clause)).join(';');
  const purchaseID = value => {
    const safe=safeURL(value); if(!safe)return '';
    const u=new URL(safe),steam=u.hostname==='store.steampowered.com' && u.pathname.match(/^\/(app|sub|bundle)\/(\d+)/);
    return steam?`steam:${steam[1]}:${steam[2]}`:u.origin+u.pathname.replace(/\/+$/,'');
  };

  function rank(catalog, evidence = {}, stores = {}, options = {}) {
    const top = Number.isFinite(+options.top) && +options.top > 0 ? +options.top : Infinity;
    const minFMV = +options.minFMV || 0;
    const allLanguages = options.language === 'all';
    const platforms = new Map(Object.entries(systems).map(([id,name]) => [id, {id,name,games:[],otherLanguages:[],library:0,best:0,exclusive:0,raw:0,score:0,unscored:0}]));
    const unassigned = [];

    for (const group of catalog) {
      if (group.members.every(r => r.includes?.length && r.gameId===group.id)) continue;
      const records = group.members.filter(live);
      const maxFMV = Math.min(10,Math.max(0,...group.members.map(r => number(r.fmv) ?? 0)));
      const fmvFactor = Math.round((maxFMV/10)**3*1e6)/1e6;
      if (maxFMV < minFMV || titleRank(group) > top) continue;
      const info = evidence.games?.[group.id] || {};
      const entries = new Map();
      const add = (id, item) => {
        if (!entries.has(id)) entries.set(id, []);
        entries.get(id).push(item);
      };
      for (const release of records) {
        const id = sys(release);
        const lang = languageModel.language(release, evidence);
        add(id, {release,language:lang,english:lang.english,label:release.title,kind:'original',key:release.key});
      }

      const explicitRoutes = info.routes || [];
      for (const route of explicitRoutes) {
        if (route.available !== true || !safeURL(route.url)) continue;
        const id = platformID(route.platform);
        const rejected=(stores._reject?.[group.id] || []).some(u=>purchaseID(u)===purchaseID(route.url));
        const hint=!rejected && (stores[group.id]?.stores || []).find(s=>purchaseID(s.url)===purchaseID(route.url));
        const pricedRoute={...route,price:number(route.price)??number(hint?.price),priceChecked:number(route.price)!==null?route.checked:hint?stores[group.id].checked:null};
        add(id, {route:pricedRoute,english:['official','fan'].includes(route.english),language:{status:route.english || 'unknown',basis:'reviewed',note:route.note},label:route.label,kind:'digital',key:purchaseID(route.url)});
      }

      // Store routes are positive catalog evidence; text-only modern claims never invent a PC edition.
      const pcOverride = explicitRoutes.some(r => platformID(r.platform) === 'pc');
      if (!pcOverride) {
        const routes = [];
        for (const release of records) if (sys(release)==='pc' && release.priceDigitalDate && safeURL(release.urlStore)) {
          routes.push({url:release.urlStore,label:`${release.digitalStore || 'PC'} edition`,price:release.priceDigital,checked:release.priceDigitalDate,english:languageModel.language(release,evidence).english});
        }
        const rejected = new Set((stores._reject?.[group.id] || []).map(safeURL));
        const hasEnglish = group.members.some(r => languageModel.language(r,evidence).english);
        for (const store of stores[group.id]?.stores || []) {
          if (!safeURL(store.url) || rejected.has(safeURL(store.url)) || (store.match ?? 0) < 0.9) continue;
          if (!/Steam|GOG/i.test(store.store || '')) continue;
          routes.push({...store,label:`${store.title} · ${store.store}`,checked:stores[group.id].checked,english:hasEnglish});
        }
        const seen = new Set();
        for (const route of routes) {
          const key = purchaseID(route.url);
          if (seen.has(key)) continue;
          seen.add(key);
          add('pc',{route,english:route.english,language:{status:route.english?'official':'unknown',basis:'catalog',note:'Dated catalog/store match; exact language and current Windows compatibility need checking.'},label:route.label,kind:'digital',key});
        }
      }

      const availableIDs = [...entries.keys()];
      const modernText = group.members.flatMap(r => releaseClaims(r.modern).split(';'))
        .filter(clause=>!/emulat|MAME|Hypseus|Daphne|Mednafen|RetroArch/i.test(clause)||/Steam|GOG|remaster|anniversary/i.test(clause)).join(' ');
      const distribution = new Set([...availableIDs,...mentionedPlatforms(modernText)]);
      for (const record of group.members) {const claims=releaseClaims(record.alsoOn);if(claims && !/^\s*(none|no\b|n\/a|—)/i.test(claims))for(const id of mentionedPlatforms(claims))distribution.add(id);}
      if([...distribution].some(id=>/^xbox(?:one|series|360)$/.test(id)))distribution.delete('xbox');
      const platformCount = Math.max(1,distribution.size);
      const externalModern = /Switch|\bPS[2345]\b|PlayStation\s*[2345]|Xbox|iOS|Android|mobile|Dreamcast|Blu.ray/i.test(modernText) ||
        (!entries.has('pc') && /\bPC\b|Windows|Steam|GOG/i.test(modernText)) ||
        records.some(r => {const claims=releaseClaims(r.alsoOn);return claims && !/^\s*(none|no\b|n\/a|—)/i.test(claims) && mentionedPlatforms(claims).length===0;});
      const exclusiveID = availableIDs.length === 1 && platformCount===1 && !externalModern ? availableIDs[0] : null;
      const titan = number(group.line?.titan?.score);

      for (const [id, editions] of entries) {
        if (!platforms.has(id)) {if (id==='console') unassigned.push({id:group.id,title:group.title}); continue;}
        const platform = platforms.get(id);
        const usable = editions.filter(e => allLanguages || e.english);
        const base = {id:group.id,title:group.title,group,rank:titleRank(group),fmv:maxFMV,fmvFactor,titan,editions,eligible:usable,platformCount,platformIDs:[...distribution]};
        if (!usable.length) {platform.otherLanguages.push(base); continue;}
        const bestEdition = group.line.best ? usable.find(e => e.release?.key === group.line.best) : null;
        const libraryPoints = (titan ?? 0) * weights.library / platformCount * fmvFactor;
        const bestPoints = bestEdition ? (titan ?? 0) * weights.best * fmvFactor : 0;
        const exclusivePoints = id === exclusiveID ? (titan ?? 0) * weights.exclusive * fmvFactor : 0;
        const game = {...base,libraryPoints,bestPoints,exclusivePoints,points:round(libraryPoints+bestPoints+exclusivePoints),
          bestReason:bestEdition ? group.line.bestWhy || 'Catalog preferred edition.' : '',
          bestProvisional:!!bestEdition && /provisional|pending|untested|unverified/i.test(group.line.bestWhy || ''),
          exclusiveConfidence:exclusivePoints ? info.alternativesReviewed && info.sources?.length ? 'reviewed' : 'catalog' : null,
          currentPC:id==='pc' && usable.some(e => e.kind==='digital'),
          compatibility:id==='pc'?'PC family includes historical releases; a current Windows route is only established where separately documented.':null};
        platform.games.push(game);
        platform.library += libraryPoints;
        platform.best += bestPoints;
        platform.exclusive += exclusivePoints;
        if (titan === null) platform.unscored++;
      }
    }
    const result = [...platforms.values()];
    for (const p of result) {
      p.library=round(p.library); p.best=round(p.best); p.exclusive=round(p.exclusive);
      p.raw=round(p.library+p.best+p.exclusive);
      p.games.sort(orderGames); p.otherLanguages.sort((a,b)=>a.rank-b.rank || a.title.localeCompare(b.title));
      p.top50=p.games.filter(g=>g.rank<=50).length; p.top100=p.games.filter(g=>g.rank<=100).length;
      p.bestCount=p.games.filter(g=>g.bestPoints>0).length;
      p.exclusiveCount=p.games.filter(g=>g.exclusivePoints>0).length;
      p.provisionalExclusives=p.games.filter(g=>g.exclusiveConfidence==='catalog').length;
      p.currentPCCount=p.games.filter(g=>g.currentPC).length;
    }
    result.sort((a,b)=>b.raw-a.raw || b.library-a.library || a.name.localeCompare(b.name));
    const leading=result[0]?.raw || 0;
    result.forEach((p,i)=>{p.score=leading ? round(p.raw/leading*100):0;p.rank=p.raw>0?i+1:null;});
    return {platforms:result,weights,unassigned,scope:{top,minFMV,language:allLanguages?'all':'english'}};
  }

  function value(platform, hardwareCost, options = {}) {
    const count = Math.max(1, Math.trunc(options.count || 5));
    const basket=platform.games.filter(g=>g.titan!==null).slice(0,count);
    const purchases=new Map();
    let unknownGames=0,compatibilityUnknown=0;
    for (const game of basket) {
      const editions=['pc','mac'].includes(platform.id)&&game.eligible.some(e=>e.kind==='digital')?game.eligible.filter(e=>e.kind==='digital'):game.eligible;
      const choices=editions.map(e=>({edition:e,cost:number(e.kind==='digital'?e.route.price:e.release.priceCib)}))
        .filter(c=>c.cost!==null).sort((a,b)=>a.cost-b.cost);
      const reused=choices.find(c=>purchases.has(c.edition.key));
      const choice=reused || choices[0];
      if (!choice) {unknownGames++;continue;}
      if (['pc','mac'].includes(platform.id) && choice.edition.kind!=='digital') compatibilityUnknown++;
      const previous=purchases.get(choice.edition.key);
      purchases.set(choice.edition.key,{...choice,titles:[...(previous?.titles || []),game.title]});
    }
    const gamesCost=round([...purchases.values()].reduce((sum,p)=>sum+p.cost,0));
    const hardware=number(hardwareCost);
    const patchSetup=[...purchases.values()].some(c=>c.edition.language.status==='fan') && number(options.setupCost)===null;
    const accessorySetup=[...purchases.values()].some(c=>c.edition.release?.access==='Add-on required') && number(options.setupCost)===null;
    const setup=number(options.setupCost) ?? 0;
    const complete=basket.length>0 && !unknownGames && hardware!==null && !patchSetup && !accessorySetup && !compatibilityUnknown;
    const totalCost=complete?round(hardware+gamesCost+setup):null;
    const points=round(basket.reduce((sum,g)=>sum+g.points,0));
    return {basket,purchases:[...purchases.values()],gamesCost,hardwareCost:hardware,setupCost:setup,unknownGames,patchSetup,accessorySetup,compatibilityUnknown,complete,totalCost,points,
      value:complete && totalCost>0?round(points/totalCost*100):null};
  }
  return {rank,value,systems,weights,safeURL,language:languageModel.language};
});
