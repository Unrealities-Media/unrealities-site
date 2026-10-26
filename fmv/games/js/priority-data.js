/* Console purchase decisions: whole games, language coverage and explicit evidence. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.FMVPriority=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 const systems={segacd:'Sega CD','3do':'3DO',saturn:'Sega Saturn',ps1:'PlayStation',cdi:'Philips CD-i',jaguarcd:'Jaguar CD',cd32:'Amiga CD32',laseractive:'LaserActive',tgcd:'TurboGrafx-CD',pcfx:'PC-FX',pippin:'Pippin',playdia:'Playdia'};
 const sys=r=>r.key.slice(0,r.key.lastIndexOf('-'));
 const rank=g=>g.line?.titan?.rank??Infinity;
 const released=r=>/^Released\b/.test(r.status||'')&&r.access!=='Lost';
 const price=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0?n:null;
 const url=s=>{try{const u=new URL(s);return /^https?:$/.test(u.protocol)?u.href:'';}catch{return '';}};
 const originalLead=g=>g.decision==='research'&&!g.live.some(r=>['pc','mac'].includes(sys(r)))&&!g.routes.some(r=>r.available===true)&&!g.live.some(r=>/\byes\b|Steam|GOG|remaster/i.test(r.modern||''));
 function language(release,evidence={}){
  const item=evidence.releases?.[release.key];
  if(item)return {...item,english:['official','fan'].includes(item.status),basis:'reviewed'};
  if(release.na)return {status:'official',english:true,basis:'catalog',note:'English expected from the cataloged North American release; check the exact disc edition.'};
  return {status:'unknown',english:false,basis:'catalog',note:'English coverage has not been verified for this release.'};
 }
 function comparison(group,kit={},tracker={},hardware={},condition='loose',evidence={}){
  const field=condition==='cib'?'priceCib':'priceLoose';
  return group.members.filter(r=>released(r)&&systems[sys(r)]).map(release=>{
   const id=sys(release),owned=kit.owned?.includes(id)||false,copyOwned=!!tracker[release.key]?.owned;
   const lang=language(release,evidence),setupUnknown=lang.status==='fan';
   const gamePrice=price(release[field]),hardwarePrice=owned?0:hardware.systems?.[id]?.requiresAdditionalHardware?null:price(hardware.systems?.[id]?.unboxed);
   const total=setupUnknown||hardwarePrice==null||(!copyOwned&&gamePrice==null)?null:hardwarePrice+(copyOwned?0:gamePrice);
   return {release,system:id,gamePrice,hardwarePrice,total,copyOwned,hardwareOwned:owned,language:lang,english:lang.english,setupUnknown,condition:copyOwned?'owned copy':condition,completeness:copyOwned?'unconfirmed':condition==='cib'?'CIB reference':'loose reference',date:release.priceDate||null};
  }).sort((a,b)=>Number(b.english)-Number(a.english)||(a.total??Infinity)-(b.total??Infinity)||Number(b.hardwareOwned)-Number(a.hardwareOwned)||(a.gamePrice??Infinity)-(b.gamePrice??Infinity));
 }
 function prioritize(consoles,{top=100,minFMV=0}={}){
  const inScope=g=>g.rank<=top&&g.maxFMV>=minFMV;
  const metric=c=>{const reasons=[...c.required,...c.choices].filter(inScope),leads=c.research.filter(inScope).filter(originalLead),research=c.research.filter(inScope);return [Number(c.owned),reasons.filter(g=>g.rank<=50).length,reasons.length,-Math.min(Infinity,...reasons.map(g=>g.rank)),-Math.min(Infinity,...leads.map(g=>g.rank)),-Math.min(Infinity,...research.map(g=>g.rank))];};
  return consoles.slice().sort((a,b)=>{const x=metric(a),y=metric(b);for(let i=0;i<x.length;i++)if(x[i]!==y[i])return y[i]-x[i];return a.name.localeCompare(b.name);});
 }
 function build(catalog,evidence={},kit={},tracker={},hardware={}){
  const owned=kit.owned||[], modern=Object.keys(kit.modern||{}),games=[];
  for(const group of catalog){
   // Compilation pages stay available in guides, but their included games are the decisions.
   if(group.representative.includes?.length&&group.members.every(r=>r.includes?.length))continue;
   const live=group.members.filter(released),english=live.filter(r=>language(r,evidence).english);
   const entry=evidence.games?.[group.id]||{};
   const catalogRoutes=live.filter(r=>sys(r)==='pc'&&r.priceDigitalDate&&url(r.urlStore)&&language(r,evidence).english).map(r=>({label:`${r.digitalStore||'PC'} edition`,platform:'windows',english:'official',available:true,url:r.urlStore,price:price(r.priceDigital),checked:r.priceDigitalDate,basis:'catalog',note:'Dated catalog storefront reference; confirm language, Windows support and availability at the store before buying.'}));
   const routes=entry.routes!==undefined?entry.routes:catalogRoutes;
   const mainRoute=routes.find(r=>r.available===true&&['official','fan'].includes(r.english)&&modern.includes(r.platform)&&url(r.url));
   const ownedRelease=english.find(r=>owned.includes(sys(r)));
   const nativeSystems=[...new Set(english.map(sys).filter(id=>systems[id]))];
   const maxFMV=Math.max(0,...live.map(r=>r.fmv||0));
   let decision='research',main=null,reason='Other versions and current purchasing routes need review before this can justify hardware.';
   if(mainRoute){decision='covered';main={...mainRoute,type:'digital'};reason='A purchasable English route is listed on your existing modern hardware.';}
   else if(ownedRelease){decision='covered';main={type:'original',release:ownedRelease,label:`${systems[sys(ownedRelease)]} · hardware owned`,copyOwned:!!tracker[ownedRelease.key]?.owned};reason='You already own the console for an English release; the game copy may still need buying.';}
   else if(entry.purchaseUnavailable===true&&entry.emulation){decision='fallback';main={...entry.emulation,type:'emulation'};reason='Evidence explicitly records that a usable purchase is unavailable; emulation is a fallback.';}
   else if(!english.length){decision='language';reason='No fully English-playable route has been confirmed. Partial translations and untranslated releases stay separate.';}
   else if(entry.alternativesReviewed===true&&entry.sources?.length&&nativeSystems.length&&!english.some(r=>['pc','mac'].includes(sys(r)))){decision=nativeSystems.length===1?'required':'choice';main={type:'original-choice',label:nativeSystems.map(id=>systems[id]).join(' or '),note:'Buy one suitable original copy and console. Fan-translated editions also need the documented patch and compatible playback setup.'};reason=nativeSystems.length===1?'Reviewed alternatives currently identify one English original-console route.':'Reviewed English routes require one of these consoles; you do not need to buy every port.';}
   else if(live.some(r=>['pc','mac'].includes(sys(r))))reason='A PC or Mac release is cataloged; purchasing and current Windows compatibility need review before buying a console.';
   else if(routes.some(r=>r.available===true)){reason='An alternative is listed, but its language coverage or access on your owned platforms needs review.';}
   else if(live.some(r=>/\byes\b|remaster|Steam|GOG|Switch|PS4|PS5|Xbox/i.test(r.modern||''))&&!entry.alternativesReviewed){reason='The catalog mentions a rerelease or another platform. Verify it before treating this as a hardware requirement.';}
   const item={...group,rank:rank(group),maxFMV,live,english,nativeSystems,routes,decision,main,reason,review:entry,comparisons:comparison(group,kit,tracker,hardware,'loose',evidence)};
   games.push(item);
  }
  games.sort((a,b)=>a.rank-b.rank||a.title.localeCompare(b.title));
  const consoles=Object.entries(systems).map(([id,name])=>{
   const all=games.filter(g=>g.live.some(r=>sys(r)===id)),english=all.filter(g=>g.english.some(r=>sys(r)===id));
   const required=english.filter(g=>g.decision==='required'),choices=english.filter(g=>g.decision==='choice'),research=english.filter(g=>g.decision==='research');
   const reasons=[...required,...choices].sort((a,b)=>a.rank-b.rank);
   const top50=reasons.filter(g=>g.rank<=50).length,top100=reasons.filter(g=>g.rank<=100).length;
   return {id,name,owned:owned.includes(id),planned:kit.planned?.includes(id)||false,all,english,required,choices,research,top50,top100,backlog:english.filter(g=>g.maxFMV===10&&g.rank>100),covered:english.filter(g=>g.decision==='covered'),language:all.filter(g=>!g.english.some(r=>sys(r)===id)),region:evidence.systems?.[id]||null,hardware:hardware.systems?.[id]||null,
    priority:owned.includes(id)?'Owned':top50?'Strong game reasons':top100?'Worth considering':research.some(g=>g.rank<=100)?'Check alternatives first':reasons.length?'Later priority':'Optional / later',
    first:Math.min(Infinity,...reasons.map(g=>g.rank)),firstOriginal:Math.min(Infinity,...research.filter(originalLead).map(g=>g.rank)),firstResearch:Math.min(Infinity,...research.map(g=>g.rank))};
  });
  return {games,consoles:prioritize(consoles)};
 }
 return {systems,sys,rank,language,comparison,build,url,originalLead,prioritize};
});
