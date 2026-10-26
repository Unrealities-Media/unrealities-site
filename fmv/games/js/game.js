/* One live-data field guide for every game. No episode or game-specific template assumptions. */
(() => {
  'use strict';
  const M = window.FMVGameData;
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => [...el.querySelectorAll(s)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = value => value == null ? 'Not priced' : new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(value);
  const present = value => value !== null && value !== undefined && value !== '';
  const meaningful = value => present(value) && !/^(?:unknown(?:\s*[—-]\s*verify)?|—|n\/?a)$/i.test(String(value).trim());
  const fieldName = key => key.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/^url /,'Link: ').replace(/^./,c=>c.toUpperCase());
  const outLink = (url,title) => { const safe=M.externalURL(url); return safe ? `<a href="${esc(safe)}" target="_blank" rel="noopener noreferrer">${esc(title)} ↗</a>` : ''; };
  const guideURL = (id,key,anchor='') => `game.html?game=${encodeURIComponent(id)}${key ? `&version=${encodeURIComponent(key)}` : ''}${anchor ? `#${anchor}` : ''}`;
  const guideLink = (id,title,key,anchor='') => `<a data-guide href="${guideURL(id,key,anchor)}">${esc(title)}</a>`;
  const regions = g => [g.na && 'NA',g.jp && 'JP',g.eu && 'EU',g.x32 && '32X CD'].filter(Boolean).join(' · ') || 'No regional release recorded';
  const text = value => esc(M.publicText(value));
  const factGrid = fields => `<dl class="field-grid">${fields.filter(([,v])=>meaningful(v)).map(([label,value])=>`<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>`;
  const paragraphs = fields => fields.filter(([,v])=>meaningful(M.publicText(v))).map(([label,value])=>`<div class="copy-block"><h3>${esc(label)}</h3><p>${text(value)}</p></div>`).join('');
  const rawValue = value => !present(value) ? '<span class="muted">Not recorded</span>' : typeof value === 'boolean' ? value ? 'Yes':'No' : typeof value === 'object' ? `<pre>${esc(JSON.stringify(value,null,2))}</pre>` : M.externalURL(value) ? outLink(value,value) : esc(value);
  const rawTable = object => `<div class="table-scroll"><table class="raw-table"><tbody>${Object.entries(object).map(([key,value])=>`<tr data-field="${esc((fieldName(key)+' '+JSON.stringify(value)).toLowerCase())}"><th scope="row">${esc(fieldName(key))}</th><td>${rawValue(value)}</td></tr>`).join('')}</tbody></table></div>`;
  let db, catalog=[], tracker={}, supplemental={}, supplied=[], directoryLimit=48;
  const content=$('#content'), search=$('#game-search'), results=$('#game-results');
  const optionalJSON = async (url,fallback) => {try {const response=await fetch(url,{cache:'no-cache'});return response.ok ? await response.json():fallback;}catch{return fallback;}};
  const matchGame = (game,query) => [game.title,game.id,...game.members.flatMap(g=>[g.title,g.alt,g.system,g.developer])].join(' ').toLowerCase().includes(query.toLowerCase());
  const navigate = url => {history.pushState(null,'',url);renderRoute();if(location.hash)requestAnimationFrame(()=>$(location.hash)?.scrollIntoView());else window.scrollTo(0,0);};
  const searchMatches = query => catalog.filter(g=>matchGame(g,query));
  const updateSearch = () => {
    const query=search.value.trim();
    if (!query){results.hidden=true;search.setAttribute('aria-expanded','false');return;}
    const matches=searchMatches(query);
    results.innerHTML=matches.slice(0,8).map(g=>`<li>${guideLink(g.id,g.title)}<small>${g.year ?? 'Year unrecorded'} · ${g.members.length} release${g.members.length===1?'':'s'}</small></li>`).join('') || '<li><p>No matching games. Try a title, platform or developer.</p></li>';
    if(matches.length>8)results.innerHTML+=`<li><a data-guide href="game.html?q=${encodeURIComponent(query)}">See all ${matches.length} matches →</a></li>`;
    results.hidden=false;search.setAttribute('aria-expanded','true');
  };
  search.addEventListener('input',updateSearch);
  search.addEventListener('keydown',event=>{if(event.key==='Escape'){results.hidden=true;search.setAttribute('aria-expanded','false');}});
  $('#game-search-form').addEventListener('submit',event=>{event.preventDefault();directoryLimit=48;navigate(`game.html?q=${encodeURIComponent(search.value.trim())}`);});
  document.addEventListener('click',event=>{
    if(!event.target.closest('.game-search')){results.hidden=true;search.setAttribute('aria-expanded','false');}
    const link=event.target.closest('a[data-guide]');
    if(link && event.button===0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey){event.preventDefault();navigate(link.getAttribute('href'));}
  });
  window.addEventListener('popstate',renderRoute);
  const renderDirectory = (query='',unknown='') => {
    document.title='Game field guides — FMV Games Index';
    const matches=searchMatches(query);
    content.innerHTML=`<div class="empty-state"><span class="eyebrow">The FMV Games Index / Field guides</span><h1>${unknown ? 'Let’s find that game.' : 'Every game.<br>Every version.'}</h1><p>${unknown ? `No game matches “${esc(unknown)}”. Search the catalog above or choose a guide below.` : 'Explore the games, compare their releases and follow the research. Choose a game to see the information available for it.'}</p><p class="fine">${catalog.length} game guides · ${db.games.length} release records · ${db.systems?.length || 0} systems</p></div><div class="directory"><div class="directory-title"><h2>${query ? `Results for “${esc(query)}”`:'Browse the catalog'}</h2><span class="fine">${matches.length} game${matches.length===1?'':'s'}${query ? ' matched':''} · alphabetical</span></div><div class="directory-grid">${matches.slice(0,directoryLimit).map(g=>`<a data-guide href="${guideURL(g.id)}"><h3>${esc(g.title)}</h3><p>${g.year ?? 'Year unrecorded'} · ${g.members.length} release${g.members.length===1?'':'s'}<br>${esc([...new Set(g.members.map(r=>r.system))].join(' · '))}</p></a>`).join('') || '<p>No matching games. Try a broader search.</p>'}</div>${matches.length>directoryLimit ? '<div class="directory-more"><button class="button" id="more-games">Show more games ↓</button></div>':''}</div>`;
    $('#more-games')?.addEventListener('click',()=>{directoryLimit+=48;const y=window.scrollY;renderDirectory(query,unknown);window.scrollTo(0,y);});
  };
  const imageFigure = image => `<figure class="${image.kind==='cover'?'is-cover':''}"><button class="image-button" data-image="${esc(image.src)}" data-caption="${esc(image.title+' · '+image.system)}" aria-label="Enlarge ${esc(image.title)} on ${esc(image.system)}"><img src="${esc(image.src)}" alt="${esc(image.title+' · '+image.system)}" loading="lazy" decoding="async"></button><figcaption><b>${esc(image.system)} · ${esc(image.title)}</b>${[image.source,image.license,image.credit].filter(Boolean).map(esc).join(' · ')} ${outLink(image.page,'Source')}</figcaption></figure>`;
  function renderRoute(){
    if(!db)return;
    const params=new URLSearchParams(location.search), id=params.get('game') || params.get('id');
    results.hidden=true;search.setAttribute('aria-expanded','false');
    if(!id){renderDirectory(params.get('q') || '');return;}
    const resolved=M.resolveGame(catalog,id,params.get('version'));
    if(!resolved){renderDirectory('',id);return;}
    renderGame(resolved.group,resolved.release);
  }
  function renderGame(group,g){
    document.title=`${group.title} — FMV game field guide`;
    $('meta[name="description"]').content=`${group.title}: ${group.members.length} release${group.members.length===1?'':'s'}, gameplay, credits, images, prices, reviews and research sources.`;
    const local=['localhost','127.0.0.1','[::1]','::1'].includes(location.hostname);
    const media=M.mediaFor(group,supplemental,local);
    for(const release of group.members){
      const own=supplied.find(file=>file===`${release.key}.jpg` || file===`${release.key}.png`);
      if(own)media.unshift({src:`img/${own}`,key:release.key,system:release.system,kind:'cover',title:'User-supplied art',credit:'Supplied to the catalog by its owner'});
    }
    const hero=media.find(it=>it.key===g.key && it.kind==='shot') || media.find(it=>it.key===g.key) || media[0];
    const videos=M.episodesFor(group,tracker), sources=M.sourcesFor(group), sections=[];
    const add=(id,title,description,body)=>{if(body)sections.push({id,title,description,body});};
    const notes=M.publicText(g.notes), synopsis=M.publicText(g.hook), aliases=[...new Set(group.members.flatMap(r=>[r.title,r.alt]).filter(t=>t && t!==group.title))];
    const compilationLinks=g.includes?.map(id=>guideLink(id,catalog.find(game=>game.id===id)?.title || id)).join(' · ');
    add('overview','About the game',`${group.members.length} catalogued release${group.members.length===1?'':'s'} · select an edition for its specific details.`,
      (synopsis && !/^Can (?:I|we)\b/i.test(synopsis)?`<p class="synopsis">${esc(synopsis)}</p>`:'')+factGrid([['First documented release',group.year],['Developer',g.developer],['Publisher',g.publisher],['Genre',g.genre],['Format',g.fmvType],['Category',g.category]])+
      (meaningful(M.publicText(g.source))?`<p class="copy-block">${text(g.source)}</p>`:'')+
      (aliases.length?`<p class="fine"><b>Other names and editions:</b> ${esc(aliases.join(' · '))}</p>`:'')+
      (compilationLinks?`<div class="note"><b>This release is a compilation.</b><p>Included games: ${compilationLinks}</p></div>`:''));
    let compareKeys=[...new Set([g.key,group.line.best,...group.members.map(r=>r.key)].filter(Boolean))].slice(0,Math.min(3,group.members.length));
    if(group.members.length>1){
      const systems=[...new Set(group.members.map(r=>r.system))];
      add('versions','Versions and differences','Browse every release. Choose up to three editions to compare side by side.',
        `${group.line.best && group.members.some(r=>r.key===group.line.best)?`<div class="note"><b>Catalog recommendation: ${esc(group.members.find(r=>r.key===group.line.best).system)}</b>${M.publicText(group.line.bestWhy)?`<p>${text(group.line.bestWhy)}</p>`:''}</div>`:''}<div class="version-tools"><label class="sr-only" for="version-filter">Filter versions</label><input id="version-filter" type="search" placeholder="Filter by title, region, year or status…"><label class="sr-only" for="version-system">Filter versions by system</label><select id="version-system"><option value="">All systems (${systems.length})</option>${systems.map(s=>`<option value="${esc(s)}">${esc(s)}</option>`).join('')}</select></div><p id="version-count" class="count-label" aria-live="polite">${group.members.length} releases</p><div class="table-scroll"><table class="version-table"><thead><tr><th>Compare</th><th>Release</th><th>Year</th><th>Region</th><th>Access</th><th>Complete in box</th></tr></thead><tbody>${group.members.map(r=>`<tr class="${r.key===g.key?'selected':''}" data-version-row data-system="${esc(r.system)}" data-hay="${esc([r.title,r.system,r.year,regions(r),r.status,r.access].join(' ').toLowerCase())}"><td><input type="checkbox" name="compare" value="${esc(r.key)}" aria-label="Compare ${esc(r.title)} on ${esc(r.system)}${r.year ? ` (${r.year})`:''}" ${compareKeys.includes(r.key)?'checked':''}></td><th scope="row">${guideLink(group.id,r.system,r.key,'release')}<small>${esc(r.title)}${r.key===group.line.best?' · Catalog recommendation':''}${r.key===g.key?' · Viewing':''}</small></th><td>${r.year ?? '—'}</td><td>${esc(regions(r))}</td><td>${esc(r.access || r.status || 'Not documented')}</td><td>${r.priceCib != null ? `${money(r.priceCib)} CIB` : 'CIB not priced'}</td></tr>`).join('')}</tbody></table></div><p class="compare-hint" id="compare-hint" aria-live="polite">Select up to three releases. Filtering the list keeps your comparison selection.</p><div id="comparison"></div>`);
    }
    const releaseFields=[['Release year',g.year],['Status',g.status],['Regions',regions(g)],['FMV amount',g.fmv==null?null:`${g.fmv} / 10`],['Discs',g.discs],['Save support',g.save]];
    add('release','Release details',`${g.system} · ${g.title}`,`<div class="release-picker"><div><h3>${esc(g.title)}</h3><span class="fine">${esc(g.system)}${g.year?` · ${g.year}`:''}</span></div><span class="pill">${esc(g.key)}</span></div>${factGrid(releaseFields)}${paragraphs([['Version notes',g.variants],['Video presentation',g.video]])}<div class="release-links"><a href="index.html#${encodeURIComponent(g.key)}">Open collection record ↗</a>${outLink(g.urlWiki,'Wikipedia')}${outLink(g.urlMoby,'MobyGames')}${outLink(g.urlSegaRetro,'Sega Retro')}</div>`);
    const gameplayFields=[['Playing time',g.length],['Difficulty',g.difficulty],['Controllers and requirements',g.peripherals]];
    const gameplay=paragraphs(gameplayFields);
    if(gameplay || meaningful(g.endings) || meaningful(g.cheats))add('gameplay','Gameplay and controls','Mechanics, requirements and playthrough information for the selected release.',gameplay+
      (meaningful(g.endings)?`<details><summary>Endings and branching <span>Spoilers</span></summary><p>${esc(g.endings)}</p></details>`:'')+
      (meaningful(g.cheats)?`<details><summary>Cheats, continues and extras</summary><p>${esc(g.cheats)}</p></details>`:''));
    const history=paragraphs([['Production and history',g.trivia],['Cast and credits',g.cast],['Research notes',notes]]);
    if(history)add('history','History and credits','Production details and research recorded for this edition.',history);
    if(media.length)add('images','Images and packaging',`${media.length} credited image${media.length===1?'':'s'} across the catalogued releases.`, `<div id="gallery" class="gallery-grid">${media.slice(0,12).map(imageFigure).join('')}</div>${media.length>12?`<button class="button gallery-more" id="more-images">Show ${media.length-12} more images ↓</button>`:''}`);
    const route=group.line.playToday;
    const routeRecord=route && group.members.find(r=>r.key===route.key);
    const routeWhy=M.publicText(route?.why);
    const access=paragraphs([['Availability',g.access],['Other platforms and editions',g.alsoOn],['Modern editions',g.modern],['Where to play',g.wherePlay],['Recording considerations',g.cidRisk ? `${g.cidRisk}${g.cidTrigger ? ` — ${g.cidTrigger}`:''}`:'']]);
    if(access || route)add('access','Play and availability','Access routes and edition-specific requirements from the catalog.',access+
      (route?`<div class="note"><b>Catalog access route: ${esc(route.route)}</b>${routeRecord?`<p>${guideLink(group.id,`${routeRecord.system} · ${routeRecord.title}`,routeRecord.key,'release')}</p>`:''}${routeWhy?`<p>${esc(routeWhy)}</p>`:''}${outLink(route.storeUrl,'Open listed store')}</div>`:'')+
      (g.cidRisk?'<p class="fine">Content ID risk is a catalog estimate. It is not a record of a tested upload.</p>':''));
    const hasPrices=group.members.some(r=>['priceLoose','priceCib','priceNew','priceDigital','priceStatus','priceNote'].some(k=>present(r[k])));
    if(hasPrices)add('prices','Prices and purchase links','Dated snapshots, not live stock or checkout totals.',
      `<div class="table-scroll"><table class="version-table"><thead><tr><th>Release</th><th>Complete in box</th><th>Loose</th><th>New</th><th>Digital</th><th>Checked / source</th></tr></thead><tbody>${group.members.map(r=>`<tr><th scope="row">${guideLink(group.id,r.system,r.key,'release')}<small>${esc(r.title)}</small></th><td>${money(r.priceCib)}</td><td>${money(r.priceLoose)}</td><td>${money(r.priceNew)}</td><td>${r.priceDigital==null?'Not priced':`${money(r.priceDigital)}${r.digitalStore?` · ${esc(r.digitalStore)}`:''}`}</td><td>${r.priceDate?`Disc: ${esc(r.priceDate)}<br>`:''}${r.priceDigitalDate?`Digital: ${esc(r.priceDigitalDate)}<br>`:''}${outLink(r.urlPriceCharting,'Physical market')} ${outLink(r.urlStore,'Store')}${r.priceNote?`<p class="fine">${esc(r.priceNote)}</p>`:r.priceStatus?`<p class="fine">${esc(r.priceStatus)}</p>`:''}</td></tr>`).join('')}</tbody></table></div>`);
    const reviewed=group.members.filter(r=>[r.sega16,r.mobyCritic,r.mobyPlayer,r.critic].some(present));
    if(reviewed.length)add('reviews','Reviews and reception','Keep each review attached to the edition it describes.',`<div class="table-scroll"><table class="review-table"><thead><tr><th>Release</th><th>Moby critics</th><th>Moby players</th><th>Sega-16</th><th>Other critics</th></tr></thead><tbody>${reviewed.map(r=>`<tr><th scope="row">${guideLink(group.id,r.system,r.key,'release')}</th><td>${esc(r.mobyCritic || 'Not rated')}<br>${outLink(r.urlMoby,'Reviews')}</td><td>${r.mobyPlayer!=null?`${esc(r.mobyPlayer)} / 5`:'Not rated'}</td><td>${esc(r.sega16 || 'Not rated')}<br>${outLink(r.urlSega16,'Review')}</td><td>${esc(r.critic || 'Not rated')}${r.criticSrc?`<p class="fine">${esc(r.criticSrc)}</p>`:''}${outLink(r.urlCritic,'Source')}</td></tr>`).join('')}</tbody></table></div>`);
    const titan=group.line.titan;
    if(titan)add('significance','Place in FMV','The index’s editorial ranking, with its components and evidence.',`<div class="score-layout"><div><span class="eyebrow">FMV Titan ${titan.rank!=null?`/ #${titan.rank}`:''}</span><div class="big-score">${esc(titan.score)}<small>/100</small></div></div><div class="component-bars">${[['Quality',titan.quality],['Culture',titan.culture],['Reach',titan.span],['FMV',titan.fmv]].filter(([,v])=>v!=null).map(([name,value])=>`<div><span>${name}</span><i><b style="width:${Math.max(0,Math.min(100,Number(value)||0))}%"></b></i><strong>${Number(value).toFixed(1)}</strong></div>`).join('')}</div></div>${titan.cultureWhy?`<p class="copy-block">${esc(titan.cultureWhy)}</p>`:''}<p class="fine">${esc(titan.qualityFrom || '')}${titan.qualityEstimated?' Quality is estimated.':''} This is an editorial composite, not a review consensus. <a href="titans.html">See the ranking method ↗</a></p>`);
    const speedrun=group.line.speedrun;
    if(speedrun)add('challenges','Speedruns and challenges',speedrun.checked?`Catalog snapshot checked ${speedrun.checked}; consult the current board for rules and records.`:'Challenge information recorded in the catalog.',
      `${speedrun.class?`<p class="fine">Classification: ${esc(speedrun.class)}</p>`:''}${speedrun.rules?`<p class="copy-block">${esc(speedrun.rules)}</p>`:''}${(speedrun.boards||[]).map(board=>`<article class="speedrun-board"><h3>${esc(board.name || 'Leaderboard')}</h3><p>${outLink(board.url,'Open live board')}${board.runs!=null?` · ${board.runs} runs in the catalog snapshot`:''}</p>${board.note?`<p class="fine">${esc(board.note)}</p>`:''}${board.keys?.length?`<p class="fine">Linked releases: ${board.keys.map(k=>guideLink(group.id,group.members.find(r=>r.key===k)?.system || k,k,'release')).join(' · ')}</p>`:''}${board.categories?.length?`<div class="table-scroll"><table class="run-table"><thead><tr><th>Category</th><th>Snapshot time</th><th>Runner</th><th>Platform</th></tr></thead><tbody>${board.categories.map(c=>`<tr><th scope="row">${esc(c.name)}</th><td>${c.wr?outLink(c.wrUrl,c.wr)||esc(c.wr):'Not documented'}</td><td>${esc(c.wrRunner || 'Not documented')}</td><td>${esc(c.wrPlatform || 'Not documented')}</td></tr>`).join('')}</tbody></table></div>`:''}</article>`).join('')}`);
    if(videos.length)add('videos','Videos','Linked videos from the collection tracker.',`<div class="episode-links">${videos.map(video=>`<article class="episode-link"><div>${outLink(video.url,video.episode?`Watch video ${video.episode}`:'Watch video')}<p>${esc(video.system)}${video.uploaded?` · ${esc(video.uploaded)}`:''}${video.runtime?` · ${esc(video.runtime)}`:''}</p></div><span aria-hidden="true">↗</span></article>`).join('')}</div>`);
    add('sources','Sources and further reading',`${sources.length} source link${sources.length===1?'':'s'} collected across the releases.`,sources.length?`<ol class="source-list">${sources.map((source,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><div>${outLink(source.url,source.title)}<small>${esc(new URL(source.url).hostname.replace(/^www\./,''))}</small></div></li>`).join('')}</ol><p class="fine">Source links retain the catalog’s research trail. Verification notes and uncertain claims remain visible in the release records.</p>`:'<p class="fine">No external sources are linked yet. The complete existing record is available below.</p>');
    const familyTracker=Object.fromEntries(group.members.filter(r=>tracker[r.key] && Object.values(tracker[r.key]).some(Boolean)).map(r=>[r.key,tracker[r.key]]));
    add('database','Complete database','Every release field and game-level value remains accessible.',`<label class="catalog-search" for="field-search">Find a field across releases <input id="field-search" type="search" placeholder="Try cast, save, video, price…" autocomplete="off"></label><p class="fine" id="field-count" aria-live="polite"></p>${group.members.map(r=>`<details class="catalog-record"><summary>${esc(r.system)} · ${esc(r.title)} <span>${Object.keys(r).length} fields</span></summary>${rawTable(r)}</details>`).join('')}${Object.keys(group.line).length?`<details class="catalog-record"><summary>Game-level data <span>Ranking · version pick · access · challenges</span></summary>${rawTable(group.line)}</details>`:''}${Object.keys(familyTracker).length?`<details class="catalog-record"><summary>Collection tracker <span>Existing activity and notes</span></summary>${rawTable(familyTracker)}</details>`:''}<p class="fine">Catalog generated ${esc(db.generated || 'date not recorded')}. Empty values are unrecorded, not zero. <a href="data/games.json">Download the catalog ↗</a></p>`);
    content.innerHTML=`<div class="page-shell"><div class="breadcrumb"><a data-guide href="game.html">Game guides</a><span>/</span><span>${esc(g.system || 'System unrecorded')}</span><span>/</span><b>${esc(group.title)}</b></div><header class="hero"><div class="hero-copy"><span class="eyebrow">Game field guide${group.year?` / ${group.year}`:''}</span><h1>${esc(group.title)}</h1><h2>${esc([g.genre,g.developer].filter(Boolean).join(' / ') || 'An entry in the FMV Games Index')}</h2><p>${esc([g.fmvType && `${g.fmvType} video`,g.category].filter(Boolean).join(' · '))}</p><div class="hero-meta"><span>${group.members.length} release${group.members.length===1?'':'s'}</span><span>${new Set(group.members.map(r=>r.system)).size} system${new Set(group.members.map(r=>r.system)).size===1?'':'s'}</span>${titan?.rank!=null?`<span class="pill">FMV Titan #${titan.rank}</span>`:''}</div><div class="hero-actions"><a class="button" href="#${group.members.length>1?'versions':'release'}">${group.members.length>1?'Explore the versions':'Explore the release'} ↓</a><a href="#sources">Follow the sources ↗</a></div></div><div class="hero-art">${hero?`<button data-image="${esc(hero.src)}" data-caption="${esc(hero.title+' · '+hero.system)}" aria-label="Enlarge featured image"><img src="${esc(hero.src)}" alt="${esc(hero.title+' · '+hero.system)}"></button><p class="fine">${esc(hero.system)} · ${esc(hero.title)} · ${outLink(hero.page,'Source')}</p>`:`${window.FMVArt.labelSVG(g)}<p class="fine">Catalog emblem · no game image is documented yet</p>`}</div></header><div class="reading-layout"><aside class="toc"><span class="eyebrow">In this guide</span><nav aria-label="On this page">${sections.map((s,i)=>`<a href="#${s.id}"><span>${String(i+1).padStart(2,'0')}</span>${esc(s.title)}</a>`).join('')}</nav><p class="fine">${group.members.length} release records<br>${sources.length} source links</p></aside><main class="guide-main">${sections.map((s,i)=>`<section id="${s.id}"><header class="section-head"><span class="section-number">${String(i+1).padStart(2,'0')}</span><div><h2>${esc(s.title)}</h2><p>${esc(s.description)}</p></div></header>${s.body}</section>`).join('')}</main></div></div>`;
    const comparisons=[['Release title','title'],['Year','year'],['Status','status'],['Regions',regions],['Format','fmvType'],['FMV amount',r=>r.fmv==null?'Not documented':`${r.fmv} / 10`],['Video presentation','video'],['Controls / requirements','peripherals'],['Save support','save'],['Disc count','discs'],['Playing time','length'],['Difficulty','difficulty'],['Version differences','variants'],['Availability','access'],['Modern editions','modern'],['Complete in box',r=>money(r.priceCib)],['Loose disc',r=>money(r.priceLoose)],['Digital',r=>money(r.priceDigital)]];
    const renderComparison=()=>{
      const selected=M.comparisonFor(group,compareKeys), target=$('#comparison');
      if(!target)return;
      target.innerHTML=selected.length?`<div class="table-scroll"><table class="comparison-table"><thead><tr><th>Compare</th>${selected.map(r=>`<th>${esc(r.system)}<small>${esc(r.title)}</small></th>`).join('')}</tr></thead><tbody>${comparisons.filter(([,key])=>typeof key==='function' || selected.some(r=>meaningful(r[key]))).map(([label,key])=>`<tr><th scope="row">${esc(label)}</th>${selected.map(r=>`<td>${typeof key==='function'?esc(key(r)):meaningful(M.publicText(r[key]))?text(r[key]):'Not documented'}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'<p class="fine">Select releases above to compare their details.</p>';
    };
    renderComparison();
    const filterVersions=()=>{const q=($('#version-filter')?.value || '').toLowerCase(), system=$('#version-system')?.value || '';let shown=0;$$('[data-version-row]').forEach(row=>{row.hidden=!row.dataset.hay.includes(q) || (system && row.dataset.system!==system);if(!row.hidden)shown++;});$('#version-count').textContent=`${shown} of ${group.members.length} releases${shown===0?' · try a broader filter':''}`;};
    $('#version-filter')?.addEventListener('input',filterVersions);$('#version-system')?.addEventListener('change',filterVersions);
    $$('input[name="compare"]').forEach(checkbox=>checkbox.addEventListener('change',()=>{if(checkbox.checked && compareKeys.length>=3){checkbox.checked=false;$('#compare-hint').textContent='Three releases are selected. Deselect one to compare another.';return;}compareKeys=checkbox.checked?[...compareKeys,checkbox.value]:compareKeys.filter(k=>k!==checkbox.value);$('#compare-hint').textContent=`${compareKeys.length} releases selected. Choose up to three.`;renderComparison();}));
    $('#more-images')?.addEventListener('click',event=>{$('#gallery').insertAdjacentHTML('beforeend',media.slice(12).map(imageFigure).join(''));event.currentTarget.remove();});
    $('#field-search').addEventListener('input',event=>{const q=event.target.value.toLowerCase().trim();let found=0;$$('.catalog-record').forEach(detail=>{let matches=0;$$('[data-field]',detail).forEach(row=>{row.hidden=!row.dataset.field.includes(q);if(!row.hidden){matches++;found++;}});detail.hidden=!!q && matches===0;if(q && matches)detail.open=true;});$('#field-count').textContent=q?`${found} matching fields across the records.`:'';});
  }
  const modal=$('#lightbox');
  content.addEventListener('click',event=>{const button=event.target.closest('[data-image]');if(!button)return;modal.querySelector('img').src=button.dataset.image;modal.querySelector('img').alt=button.dataset.caption;$('#image-caption').textContent=button.dataset.caption;modal.showModal();});
  $('#close-lightbox').addEventListener('click',()=>modal.close());modal.addEventListener('click',event=>{if(event.target===modal)modal.close();});
  (async()=>{
    try{
      const response=await fetch('data/games.json',{cache:'no-cache'});
      if(!response.ok)throw new Error('catalog unavailable');
      db=await response.json();if(!Array.isArray(db.games))throw new Error('invalid catalog');
      const localMediaAllowed=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
      const [seed,media,files,localMedia]=await Promise.all([optionalJSON('data/tracker.json',{}),optionalJSON('data/game-media.json',{}),optionalJSON('img/index.json',[]),localMediaAllowed?optionalJSON('data/game-media.local.json',{}):Promise.resolve({})]);
      let local={};try{local=JSON.parse(localStorage.getItem('segacd-fmv-tracker-v1') || '{}');if(!local || typeof local!=='object' || Array.isArray(local))local={};}catch{}
      for(const key of Object.keys(local))if(/^\d+$/.test(key))local[`segacd-${key}`]=local[key];
      tracker={...seed,...local};supplemental={...media,...localMedia};supplied=Array.isArray(files)?files:[];catalog=M.buildCatalog(db);renderRoute();
    }catch{content.innerHTML='<div class="load-state"><h1>The catalog could not be loaded.</h1><p>Serve the site through a static host and try again.</p><button class="button" id="retry-load">Try again ↻</button> <a href="index.html">Return to the catalog</a></div>';$('#retry-load').addEventListener('click',()=>location.reload());}
  })();
})();
