/* Independent FMV facts and editorial series scope. No quality/ownership gates. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object' && module.exports)module.exports=api;
  else root.FMVClassification=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const labels={
    core:'Core FMV',hybrid:'Hybrid',cutscenes:'Cutscenes only',adjacent:'Adjacent',
    'non-game':'Non-game video',unknown:'Unknown',
    'rip-fmv':'Pre-2000 consumer FMV', 'later-fmv':'Later FMV','related-history':'Related history',
    'cinematic-adventures':'Cinematic adventures', 'arcade-only':'Arcade / no reviewed home edition',
    compilation:'Compilation',unreleased:'Unreleased / unavailable',review:'Needs review',
    'live-action':'Live action','drawn-animation':'Drawn animation','cg-animation':'CG animation',
    'still-photographs':'Still photographs','stop-motion':'Stop motion',
    'prerecorded-video':'Prerecorded video','still-images':'Still images','real-time':'Real-time graphics','sprite-overlays':'Sprite overlays',
    background:'Background','main-playfield':'Main playfield','interactive-narrative':'Interactive narrative',illustration:'Illustration',
    qte:'QTEs',shooting:'Shooting',driving:'Driving',investigation:'Investigation',puzzles:'Puzzles',
    'point-and-click':'Point and click',choices:'Choices','camera-management':'Camera management',
    quiz:'Quiz',fighting:'Fighting','video-editing':'Video editing',exploration:'Exploration',sports:'Sports',cards:'Cards',
    'timed-actions':'Timed actions','route-selection':'Route selection',
    'catalog-reviewed':'Catalog reviewed',inferred:'Inferred',unreviewed:'Unreviewed',
    integrated:'Integrated',substantial:'Substantial',none:'None',yes:'Yes',no:'No',
    original:'Original',port:'Port',remaster:'Remaster',remake:'Remake',
  };
  const label=value=>labels[value] || String(value || 'Unknown').replace(/-/g,' ');
  const eligible=(record,scope)=>(scope?.series==='rip-fmv' || scope?.compilationRoute===true) && (scope.consumerKeys || []).includes(record.key);
  const scopeFor=(record,lineage={})=>{
    const line=lineage[record.gameId];
    const own=line?.scope ? {...line.scope,ripFmv:line.ripFmv} : undefined;
    if(!record.includes?.length)return own;
    const children=record.includes.map(id=>({id,scope:lineage[id]?.scope})).filter(child=>eligible(record,child.scope));
    if(!children.length)return own;
    const years=children.map(child=>child.scope.qualifyingYear).filter(Number.isInteger);
    return {...own,series:own?.series || 'compilation',compilationRoute:true,
      consumerKeys:[record.key],routeGameIds:children.map(child=>child.id),
      qualifyingYear:years.length?Math.min(...years):null,
      reason:`Eligible compilation route for ${children.map(child=>child.id).join(', ')}. Count the constituent games once; this package adds no completion obligation.`};
  };
  const badgeHTML=(record,lineage={},family=false)=>{
    const scope=scopeFor(record,lineage);
    const qualifies=eligible(record,scope) || (family && scope?.series==='rip-fmv' && scope.consumerKeys?.length>0);
    if(!qualifies)return '';
    const explanation=record.includes?.length
      ? 'Compilation containing eligible games. Count its constituent games once. Eligibility does not mean selected for the series.'
      : 'Pre-2000 core FMV with a reviewed consumer edition. Eligibility does not mean selected for the series.';
    return `<span class="rip-fmv-badge" title="${explanation}">R.I.P. FMV eligible</span>`;
  };
  const matches=(record,filters={},scope)=>{
    const c=record.classification || {};
    if(filters.series){
      if(filters.series==='rip-fmv'){if(!eligible(record,scope))return false;}
      else if(filters.series==='review'){
        if(scope?.series!=='review' && c.reviewStatus==='catalog-reviewed')return false;
      } else if(scope?.series!==filters.series)return false;
    }
    if(filters.relationship && (c.relationship || 'unknown')!==filters.relationship)return false;
    for(const [filter,field] of [['material','visualMaterial'],['presentation','presentation'],['interaction','interaction']]){
      if(filters[filter] && !(c[field] || []).includes(filters[filter]))return false;
    }
    if(filters.qte && (c.qte || 'unknown')!==filters.qte)return false;
    return true;
  };
  const facts=(record,scope)=>{
    const c=record.classification || {}, inferred=new Set(c.evidence?.inferredFields || []);
    const list=field=>(c[field] || []).map(label).join(' · ') || 'Unknown';
    const note=field=>inferred.has(field) && c[field]?.length ? ' (inferred)' : '';
    const other=c.otherGameplay || {extent:'unknown',types:[]};
    return [
      ['FMV relationship',label(c.relationship)],
      ['Catalog scope',label(scope?.series || 'review')],
      ['This edition eligible for R.I.P. FMV',eligible(record,scope)?record.includes?.length?'Yes — compilation route':'Yes':'No'],
      ['R.I.P. FMV selection',scope?.ripFmv?.selected===true?'Selected for the series':scope?.ripFmv?.eligible || eligible(record,scope)?'Eligible candidate — not selected':'Not selected'],
      ['Established qualifying FMV year',scope?.qualifyingYear ?? 'Unknown'],
      ['Visual material',list('visualMaterial')+note('visualMaterial')],
      ['Presentation',list('presentation')+note('presentation')],
      ['Video role',list('videoRole')+note('videoRole')],
      ['Interaction',list('interaction')+note('interaction')],
      ['QTEs',label(c.qte || 'unknown')+(inferred.has('qte') && c.qte==='yes'?' (inferred)':'')],
      ['Timed input',label(c.timedInput || 'unknown')+(inferred.has('timedInput') && c.timedInput==='yes'?' (inferred)':'')],
      ['Other gameplay',label(other.extent)+(other.types?.length?` · ${other.types.map(label).join(' · ')}`:'')],
      ['Edition relationship',label(c.version || 'unknown')+(inferred.has('version') && c.version!=='unknown'?' (inferred)':'')],
      ['Classification review',label(c.reviewStatus || 'unreviewed')+(c.checked?` · ${c.checked}`:'')],
      ['Classification reason',c.rationale || 'No format decision recorded.'],
      ['Scope reason',scope?.reason || 'No scope decision recorded.'],
    ];
  };
  return {labels,label,matches,facts,eligible,scopeFor,badgeHTML};
});
