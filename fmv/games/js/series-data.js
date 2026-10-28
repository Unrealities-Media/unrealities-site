/* Editorial series membership is independent of factual FMV classification. */
(function(root,factory){
  if(typeof module==='object' && module.exports)module.exports=factory(require('./game-data.js'));
  else root.FMVSeries=factory(root.FMVGameData);
})(typeof globalThis!=='undefined'?globalThis:this,function(G){
  'use strict';
  const buildSeries=db=>{
    const catalog=G.buildCatalog(db), selected=[], issues=[];
    const eligible=catalog.filter(g=>g.line.scope?.series==='rip-fmv');
    for(const group of catalog){
      const selection=group.line.ripFmv;
      if(selection?.selected!==true)continue;
      const release=group.members.find(r=>r.key===selection.releaseKey);
      if(!release || group.line.scope?.series!=='rip-fmv' || !group.line.scope.consumerKeys?.includes(release.key)){
        issues.push({id:group.id,reason:'Selected edition needs an eligible consumer route.'});continue;
      }
      selected.push({...group,release,selection,rotation:group.line.playGuide?.rotation || null});
    }
    selected.sort((a,b)=>(a.selection.order ?? Infinity)-(b.selection.order ?? Infinity) || a.title.localeCompare(b.title));
    return {selected,eligibleCount:eligible.length,candidateCount:eligible.length-selected.length,issues};
  };
  return {buildSeries};
});
