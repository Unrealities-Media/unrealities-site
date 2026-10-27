const grid = document.querySelector('#film-grid');
const films = [...grid.children];
const controls = Object.fromEntries(['search','mechanism','status','sort','format','focus'].map(key => [key,document.querySelector('#film-'+key)]));
const keys = {search:'q',mechanism:'mechanism',status:'status',sort:'sort',format:'format',focus:'focus'};
const pageSize = 24;
let page = 1;
const params = new URLSearchParams(location.search);
for (const [key,input] of Object.entries(controls)) {
  const value = params.get(keys[key]);
  if (value !== null && (input.tagName !== 'SELECT' || [...input.options].some(o=>o.value === value))) input.value = value;
}
page = Math.max(1,Number.parseInt(params.get('page'),10)||1);
const numeric = value => value !== '' && Number.isFinite(Number(value)) ? Number(value) : null;
function update(moveFocus = false) {
  const query = controls.search.value.trim().toLowerCase();
  const matched = films.filter(film => {
    const d = film.dataset, formats = d.formats.split('|');
    return (!controls.focus.value || (numeric(d.score)>=7 && d.confidence==='high')) && d.search.includes(query) && (!controls.mechanism.value || d.mechanism === controls.mechanism.value) && (!controls.status.value || d.status === controls.status.value) && (!controls.format.value || (controls.format.value === 'physical' ? formats.some(f => ['4K UHD','Blu-ray','DVD'].includes(f)) : formats.includes(controls.format.value)));
  }).sort((a,b) => {
    const key = controls.sort.value;
    if (key !== 'title') { const x=numeric(a.dataset[key]), y=numeric(b.dataset[key]); if(x===null&&y!==null)return 1;if(y===null&&x!==null)return -1;if(x!==y)return y-x; }
    return a.dataset.title.localeCompare(b.dataset.title,'en');
  });
  const totalPages = Math.max(1,Math.ceil(matched.length/pageSize));
  page = Math.min(page,totalPages);
  for (const film of films) film.hidden = true;
  const visible = matched.slice((page-1)*pageSize,page*pageSize);
  for (const film of visible) film.hidden = false;
  grid.append(...visible);
  document.querySelector('#film-count').textContent = matched.length ? `${(page-1)*pageSize+1}–${Math.min(page*pageSize,matched.length)} of ${matched.length} matching films · ${films.length} records in the archive` : 'No films match. Try another search or reset browsing.';
  document.querySelector('#film-page').textContent = `Page ${page} of ${totalPages}`;
  document.querySelector('#film-prev').disabled = page === 1;
  document.querySelector('#film-next').disabled = page === totalPages;
  document.querySelector('.archive-pagination').hidden = !matched.length;
  const context = [];
  if(controls.focus.value)context.push('Time travel drives much or all of the story: significance 7–10, high confidence.');
  if(controls.sort.value==='titan')context.push('Titan emphasizes audience, legacy and time-travel significance. A higher score is not a promise that you will enjoy the film.');
  if(controls.status.value==='questionable')context.push('These are disputed cases, not confirmed examples. Read the assessment in each guide.');
  if(controls.status.value==='excluded')context.push('These records explain what falls outside the catalog’s criteria.');
  if(controls.format.value)context.push('A cataloged edition is a research lead, not a claim of current availability.');
  document.querySelector('#browse-context').textContent=context.join(' ') || 'Choose by premise and interpretation; use Titan as one research signal, not a verdict on what you will enjoy.';
  const next = new URLSearchParams();
  for(const [key,input] of Object.entries(controls)) if(input.value && !(key==='sort'&&input.value==='title')) next.set(keys[key],input.value);
  if(page>1)next.set('page',page);
  history.replaceState(null,'',location.pathname+(next.size?'?'+next:'')+location.hash);
  for(const button of document.querySelectorAll('[data-view]')) button.setAttribute('aria-pressed',String(button.dataset.view === 'titans' ? controls.sort.value==='titan'&&controls.status.value==='included'&&!controls.format.value : button.dataset.view==='releases' ? controls.format.value==='physical' : !controls.format.value&&controls.sort.value==='title'&&!controls.status.value));
  if(moveFocus)document.querySelector('#guide-title').focus();
}
function reset() { for(const [key,input] of Object.entries(controls))input.value=key==='sort'?'title':'';page=1; }
for(const input of Object.values(controls))input.addEventListener('input',()=>{page=1;update();});
document.querySelector('#film-reset').addEventListener('click',()=>{reset();update();});
for(const button of document.querySelectorAll('[data-view]'))button.addEventListener('click',()=>{reset();if(button.dataset.view==='titans'){controls.sort.value='titan';controls.status.value='included';}if(button.dataset.view==='releases')controls.format.value='physical';update();});
document.querySelector('#film-prev').addEventListener('click',()=>{page--;update(true);});
document.querySelector('#film-next').addEventListener('click',()=>{page++;update(true);});
function revealLink() {
  let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
  const film=document.getElementById(id);
  if(film?.classList.contains('film-card')){reset();controls.search.value=film.dataset.title;update();film.scrollIntoView();}
}
document.querySelector('.archive-tools').hidden=false;
update();revealLink();
window.addEventListener('hashchange',revealLink);
