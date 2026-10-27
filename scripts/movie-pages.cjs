const fs = require('node:fs');
const path = require('node:path');
const { render } = require('./projects.cjs');
const root = path.resolve(__dirname, '..');
const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const number = value => value !== null && value !== undefined && String(value).trim() !== '' && Number.isFinite(Number(value)) ? Number(value) : null;
const fixed = (value, digits = 1) => number(value) === null ? 'Unscored' : number(value).toFixed(digits);
const safeURL = value => { try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
const list = value => { try { const parsed = Array.isArray(value) ? value : JSON.parse(value); return Array.isArray(parsed) ? parsed : []; } catch { return []; } };
const filmPath = m => '/time-travel/films/' + m.id + '.html';
const mechanism = value => ({Ancestral:'Consciousness transfer',Unstuck:'Nonlinear temporal perception'}[value] || value || 'Unclassified');
const titanNote = m => [m.Titan_Data_Status === 'partial' ? 'Partial inputs' : '', m.TT_Confidence !== 'high' && number(m.TT_Score) !== null ? 'Provisional weighting' : ''].filter(Boolean).join(' · ');
function card(m) {
  const formats = [...new Set(m.releases.map(r => r.format))];
  return `<article class="film-card" id="film-${escape(m.id)}" data-search="${escape([m.Title,m.Director,m['Top Cast'],m.Overview].join(' ').toLowerCase())}" data-title="${escape(m.Title)}" data-year="${escape(m.Year)}" data-status="${escape(m.Catalog_Status)}" data-mechanism="${escape(m.Mechanism)}" data-score="${escape(m.TT_Score)}" data-titan="${escape(m._Titan)}" data-formats="${escape(formats.join('|'))}">
    <div class="film-topline"><span>${escape(m.Year || 'Year unknown')}</span><span>${escape(m.Catalog_Status || 'unreviewed')}</span></div>
    <h3><a href="${filmPath(m)}">${escape(m.Title)}</a></h3>
    <p class="film-credit">${escape(m.Director || 'Director not recorded')}</p>
    <p class="film-synopsis">${escape(m.Overview || 'Synopsis not yet available.')}</p>
    <div class="film-scores"><div><span>Titan</span><strong>${fixed(m._Titan)}</strong><small>${escape(titanNote(m) || 'Weighted archive score')}</small></div><div><span>Time travel</span><strong>${number(m.TT_Score) === null ? 'Unscored' : escape(m.TT_Score)+'/10'}</strong><small>${m.TT_Confidence === 'high' ? 'High confidence' : 'Provisional assessment'}</small></div></div>
    <p class="film-mechanism">${escape(mechanism(m.Mechanism))}</p>
    <a class="film-detail-link" href="${filmPath(m)}">Film guide <span aria-hidden="true">→</span><span>${m.releases.length} release${m.releases.length === 1 ? '' : 's'}</span></a>
  </article>`;
}
function releaseCard(r) {
  const specs = [['Release date',r.date],['Studio',r.studio],['Resolution',r.resolution],['Region / playback',r.region],['Discs',r.discs],['Audio',r.audio],['Subtitles',r.subtitles]].filter(([,value]) => value);
  return `<article class="release-card" data-format="${escape(r.format)}"><p class="project-label">${escape(r.format)}</p><h3>${escape(r.title)}</h3>${r.edition ? `<p>${escape(r.edition)}</p>` : ''}<dl>${specs.map(([label,value])=>`<div><dt>${label}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl>${specs.length ? '' : '<p class="archive-note">Edition specifications have not been cataloged yet.</p>'}<a href="${escape(safeURL(r.url))}" rel="noopener noreferrer">View release source ↗</a></article>`;
}
function detail(m) {
  const sources = [...new Set([...list(m.Catalog_Sources),...list(m.TT_Sources),m['Letterboxd URL'],m['IMDb Link']].map(safeURL).filter(Boolean))];
  const formats = [...new Set(m.releases.map(r=>r.format))].sort();
  return `<main id="main" class="film-page">
    <div class="archive-breadcrumb"><a href="/time-travel/">← Time Travel Movies</a><span>${escape(m.Year)}</span></div>
    <section class="film-intro"><p class="eyebrow">${escape(m.Catalog_Status || 'Unreviewed')} · ${escape(mechanism(m.Mechanism))}</p><h1>${escape(m.Title)}</h1><p class="film-byline">${escape(m.Director || 'Director not recorded')}${m['Runtime (Mins)'] ? ' · '+escape(m['Runtime (Mins)'])+' minutes' : ''}</p><p class="film-overview">${escape(m.Overview || 'Synopsis not yet available.')}</p><p class="film-credit">${escape(m.Genres)}</p><nav class="archive-section-nav" aria-label="Film sections"><a href="#scores">Scores</a><a href="#releases">Releases (${m.releases.length})</a><a href="#research">Research &amp; sources</a></nav></section>
    <section id="scores" class="film-section"><div class="guide-heading"><div><p class="eyebrow">Scale, legacy &amp; time</p><h2>The scores</h2></div></div><div class="score-grid"><div class="score-card primary-score"><span>Titan</span><strong>${fixed(m._Titan)}</strong><p>${escape(titanNote(m) || (number(m._Titan) === null ? 'Awaiting sufficient data' : 'Weighted archive score'))}</p></div><div class="score-card"><span>Time-travel significance</span><strong>${number(m.TT_Score) === null ? 'Unscored' : escape(m.TT_Score)+'/10'}</strong><p>${escape(m.TT_Confidence || 'Unreviewed')} confidence</p></div><div class="score-card"><span>Quality consensus</span><strong>${number(m._Quality) === null ? 'Unscored' : fixed(m._Quality)+'/10'}</strong><p>Aggregate source ratings</p></div></div>
    <details class="methodology"><summary>How Titan works</summary><p>Titan combines the archive’s quality, audience and legacy base with the significance of time travel. It is an index, not a score out of 100, and is distinct from the FMV archive’s scoring model.</p><p class="score-formula">Titan = base × [0.20 + 0.80 × (time-travel score ÷ 10)²]</p><p>${number(m._Titan_Base) !== null && number(m._Titan_TT_Multiplier) !== null ? `This film: ${fixed(m._Titan_Base,2)} base × ${(number(m._Titan_TT_Multiplier)*100).toFixed(1)}% weighting.` : 'A base score and time-travel assessment are both required; missing values remain unscored.'} ${escape(m.Titan_Data_Note)}</p><p>Partial inputs flag incomplete source metadata. Provisional weighting flags a time-travel assessment that remains uncertain; it receives no additional confidence penalty.</p></details></section>
    <section id="releases" class="film-section"><div class="guide-heading"><div><p class="eyebrow">Edition by edition</p><h2>Releases &amp; formats</h2></div><p>${m.releases.length} cataloged editions. Source links provide further details; this archive does not track current stock or prices.</p></div>${m.releases.length ? `<div class="release-controls" hidden><label for="release-format">Show format</label><select id="release-format"><option value="">All formats</option>${formats.map(f=>`<option>${escape(f)}</option>`).join('')}</select><p id="release-count" role="status"></p></div><div class="release-grid">${m.releases.map(releaseCard).join('')}</div>` : '<p class="empty-state">No release editions are cataloged for this film yet. This does not mean that no release exists.</p>'}</section>
    <section id="research" class="film-section"><p class="eyebrow">The evidence</p><h2>Research &amp; sources</h2><p class="archive-note">Research notes may reveal plot details.</p><details class="methodology"><summary>Read the assessment (spoilers)</summary><dl class="research-notes"><dt>Catalog assessment: ${escape(m.Catalog_Status)}</dt><dd>${escape(m.Catalog_Rationale || 'Assessment pending.')}</dd><dt>Time-travel significance</dt><dd>${escape(m.TT_Reason || 'Assessment pending.')}</dd><dt>Cast</dt><dd>${escape(m['Top Cast'] || 'Not recorded')}</dd></dl></details><ul class="archive-sources">${sources.map((link,i)=>`<li><a href="${escape(link)}" rel="noopener noreferrer">${escape(new URL(link).hostname.replace(/^www\./,''))} <span class="source-number">${i+1}</span> ↗</a></li>`).join('')}</ul></section>
    <a class="back-to-archive" href="/time-travel/">← Explore more time-travel films</a>
  </main>`;
}
function build() {
  const { movies } = require('../../movie-archivist/public-catalog.cjs').load();
  if (movies.some(m=> !/^[a-z0-9-]+$/.test(m.id))) throw Error('Unsafe film identity');
  const check = process.argv.includes('--check');
  const template = render(fs.readFileSync(path.join(__dirname,'time-travel-template.html'),'utf8'),undefined,'time-travel');
  function save(relative, content) {
    const file = path.join(root,relative);
    content = content.replaceAll('\r\n','\n');
    if(check) { if(!fs.existsSync(file)||fs.readFileSync(file,'utf8').replaceAll('\r\n','\n')!==content) throw Error(`${relative} needs regeneration`); }
    else { fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content); }
  }
  const mechanisms=[...new Set(movies.map(m=>m.Mechanism).filter(Boolean))].sort();
  save('time-travel/index.html',template.replace('<!-- FILM_CARDS -->',movies.slice().sort((a,b)=>String(a.Title).localeCompare(String(b.Title),'en')).map(card).join('\n')).replaceAll('<!-- FILM_COUNT -->',String(movies.length)).replaceAll('<!-- RELEASE_COUNT -->',String(movies.reduce((n,m)=>n+m.releases.length,0))).replace('<!-- MECHANISMS -->',mechanisms.map(m=>`<option value="${escape(m)}">${escape(mechanism(m))}</option>`).join('')));
  for(const movie of movies) {
    const title=escape(`${movie.Title} (${movie.Year}) — Time Travel Movies`);
    const page=template.replace(/<main id="main">[\s\S]*?<\/main>/,()=>detail(movie)).replace(/<title>.*?<\/title>/,()=>`<title>${title}</title>`).replace(/(<meta property="og:title" content=")[^"]*/,()=>`<meta property="og:title" content="${title}`).replaceAll('https://unrealities.media/time-travel/','https://unrealities.media'+filmPath(movie)).replace('/time-travel/filters.js','/time-travel/film.js').replace(/(<meta (?:name="description"|property="og:description") content=")[^"]*/g,(_,prefix)=>prefix+escape(`Titan scoring, releases and time-travel research for ${movie.Title} (${movie.Year}).`));
    save('time-travel/films/'+movie.id+'.html',page);
  }
  const expected=new Set(movies.map(m=>m.id+'.html'));
  for(const file of fs.readdirSync(path.join(root,'time-travel/films'))) {
    if(/^[a-z0-9-]+\.html$/.test(file) && !expected.has(file)) {
      if(check) throw Error('Stale generated film page: '+file);
      fs.unlinkSync(path.join(root,'time-travel/films',file));
    }
  }
  console.log(`${check?'Checked':'Built'} ${movies.length} public film guides with Titan scores and releases.`);
}
module.exports={build,card,detail,number};
