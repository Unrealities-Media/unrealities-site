/* The curated series page uses explicit game flags from the shared catalog. */
(() => {
  'use strict';
  const $=selector=>document.querySelector(selector);
  const esc=value=>String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let games=[];
  const render=()=>{
    const query=$('#series-search').value.trim().toLowerCase();
    const shown=games.filter(game=>[game.title,game.release.title,game.release.system,game.selection.reason,game.rotation?.episodeQuestion].join(' ').toLowerCase().includes(query));
    $('#series-count').textContent=`${shown.length} of ${games.length} selected games`;
    $('#series-empty').hidden=shown.length!==0;
    $('#series-games').innerHTML=shown.map(game=>{
      const {release,selection,rotation}=game;
      const episode=rotation?.plannedEpisode ? `Planned episode ${rotation.plannedEpisode}` : 'Selected for a future episode';
      const href=`game.html?game=${encodeURIComponent(game.id)}&version=${encodeURIComponent(release.key)}`;
      return `<li class="series-card"><div class="series-card-header"><div class="series-art" aria-hidden="true">${window.FMVArt.labelSVG(release)}</div><div><span class="series-episode">${esc(episode)}</span><h3><a href="${href}">${esc(game.title)}</a></h3><span class="series-edition">${esc(release.system)} · ${esc(release.title)}${release.year?` · ${release.year}`:''}</span></div></div>${rotation?.episodeQuestion?`<p class="series-question">${esc(rotation.episodeQuestion)}</p>`:''}<p>${esc(selection.reason)}</p><a class="series-card-link" href="${href}">Game guide and chosen edition ↗</a></li>`;
    }).join('');
  };
  const init=async()=>{
    const response=await fetch('data/games.json',{cache:'no-cache'});
    if(!response.ok)throw new Error('Could not load the shared catalog.');
    const db=await response.json(), series=window.FMVSeries.buildSeries(db);
    games=series.selected;
    $('#series-summary').innerHTML=`<div><b>${games.length}</b><span>selected for the series</span></div><div><b>${series.eligibleCount}</b><span>eligible pre-2000 games in the catalog</span></div><div><b>${series.candidateCount}</b><span>eligible games not yet selected</span></div>`;
    $('#candidate-description').textContent=`${series.candidateCount} eligible games have not yet been selected. They remain in the full catalog alongside later FMV, hybrids and clearly labeled related games. The series list changes only when its editorial flags change.`;
    if(series.issues.length){$('#series-error').hidden=false;$('#series-error').textContent=`${series.issues.length} selections need an edition review before they can be displayed.`;}
    $('#series-search').addEventListener('input',render);
    render();
  };
  init().catch(error=>{$('#series-summary').textContent='The series list could not be loaded. The complete catalog and written episode plan remain linked below.';$('#series-error').hidden=false;$('#series-error').textContent=error.message;});
})();
