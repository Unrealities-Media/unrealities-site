const fs = require('node:fs');
const path = require('node:path');
const { load } = require('../../movie-archivist/public-catalog.cjs');
const { movies } = load();
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
const list = value => { if (Array.isArray(value)) return value; try { const parsed = JSON.parse(value); return Array.isArray(parsed) ? parsed : []; } catch { return []; } };
const url = value => { try { const u = new URL(value); return ['https:', 'http:'].includes(u.protocol) ? u.href : null; } catch { return null; } };
const cards = movies.slice().sort((a,b) => String(a.Title).localeCompare(String(b.Title))).map(m => {
  const sources = [...new Set([...list(m.Catalog_Sources), ...list(m.TT_Sources), m['Letterboxd URL'], m['IMDb Link']].map(url).filter(Boolean))];
  const score = m.TT_Score === '' ? 'Not yet assessed' : `${m.TT_Score}/10${m.TT_Confidence === 'high' ? '' : ' · provisional'}`;
  return `<article class="film-card" id="film-${escape(m.id)}" data-search="${escape([m.Title,m.Director,m['Top Cast'],m.Overview].join(' ').toLowerCase())}" data-title="${escape(m.Title)}" data-year="${escape(m.Year)}" data-status="${escape(m.Catalog_Status)}" data-mechanism="${escape(m.Mechanism)}" data-score="${escape(m.TT_Score)}">
    <div class="film-topline"><span>${escape(m.Year || 'Year unknown')}</span><span>${escape(m.Catalog_Status || 'unreviewed')}</span></div>
    <h3><a href="#film-${escape(m.id)}">${escape(m.Title)}</a></h3>
    <p class="film-credit">${escape(m.Director || 'Director not recorded')} · ${escape(m.Catalog_Format || 'Film')}</p>
    <p>${escape(m.Overview || 'Synopsis not yet available.')}</p>
    <div class="archive-tags"><span>${escape(m.Mechanism || 'Mechanism unclassified')}</span><span>Time-travel significance: ${escape(score)}</span></div>
    <details><summary>Research &amp; sources <span class="spoiler-note">(may contain spoilers)</span></summary>
      <dl><dt>Catalog assessment</dt><dd>${escape(m.Catalog_Rationale || 'Assessment pending.')}</dd><dt>Time-travel significance</dt><dd>${escape(m.TT_Reason || 'Assessment pending.')}</dd><dt>Cast</dt><dd>${escape(m['Top Cast'] || 'Not recorded')}</dd><dt>Genres / runtime</dt><dd>${escape(m.Genres)}${m['Runtime (Mins)'] ? ' · '+escape(m['Runtime (Mins)'])+' minutes' : ''}</dd></dl>
      <ul class="archive-sources">${sources.map(link => `<li><a href="${escape(link)}" rel="noopener noreferrer">${escape(new URL(link).hostname.replace(/^www\./,''))}</a></li>`).join('')}</ul>
    </details></article>`;
}).join('\n');
const mechanisms = [...new Set(movies.map(m => m.Mechanism).filter(Boolean))].sort();
const output = require('./projects.cjs').render(fs.readFileSync(path.join(__dirname, 'time-travel-template.html'), 'utf8'), undefined, 'time-travel')
  .replace('<!-- FILM_CARDS -->', cards).replaceAll('<!-- FILM_COUNT -->', String(movies.length))
  .replace('<!-- MECHANISMS -->', mechanisms.map(m => `<option>${escape(m)}</option>`).join(''));
const target = path.resolve(__dirname, '../time-travel/index.html');
if (process.argv.includes('--check')) {
  if (fs.readFileSync(target, 'utf8').replaceAll('\r\n', '\n') !== output.replaceAll('\r\n', '\n')) throw Error('Public archive is out of date; run node scripts/update-site.cjs');
} else fs.writeFileSync(target, output);
console.log(`${process.argv.includes('--check') ? 'Checked' : 'Built'} ${movies.length} public Movie Archivist records.`);
