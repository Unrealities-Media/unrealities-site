const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const talkie = path.resolve(root, '..', 'talkie-trivia')
const entries = JSON.parse(fs.readFileSync(path.join(talkie, 'data/public-time-travel-films.json'), 'utf8'))
const catalog = new Map(JSON.parse(fs.readFileSync(path.join(talkie, 'data/movies.json'), 'utf8')).map(movie => [movie.id, movie]))
const escape = value => String(value).replace(/[&<>"']/g, character => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[character]))
const allowed = new Set(['Journey', 'Branching timeline', 'Time loop', 'Overlapping selves', 'Personal rewind', 'Causal loop'])

if (entries.length < 10 || new Set(entries.map(entry => entry.id)).size !== entries.length) throw new Error('The public film guide needs at least ten unique movies.')
for (const entry of entries) {
  const movie = catalog.get(entry.id)
  if (!movie || movie.title !== entry.title || Number(movie.release_date.slice(0, 4)) !== entry.year) throw new Error(`Talkie catalog mismatch: ${entry.id} ${entry.title}`)
  if (!allowed.has(entry.mechanism) || ![entry.hook, entry.idea, entry.watchFor].every(value => typeof value === 'string' && value.length >= 30)) throw new Error(`Incomplete public entry: ${entry.id}`)
}

const cards = entries.slice().sort((a, b) => a.year - b.year || a.title.localeCompare(b.title)).map(entry => `
        <article class="film-card" id="film-${entry.id}" data-title="${escape(entry.title.toLowerCase())}" data-mechanism="${escape(entry.mechanism)}">
          <div class="film-topline"><span>${entry.year}</span><span>${escape(entry.mechanism)}</span></div>
          <h3>${escape(entry.title)}</h3>
          <p>${escape(entry.hook)}</p>
          <dl><dt>The time idea</dt><dd>${escape(entry.idea)}</dd><dt>Watch for</dt><dd>${escape(entry.watchFor)}</dd></dl>
          <a href="https://www.themoviedb.org/movie/${entry.id}" rel="noopener noreferrer">Film details at TMDB <span aria-hidden="true">↗</span></a>
        </article>`).join('')
const template = fs.readFileSync(path.join(root, 'scripts/time-travel-template.html'), 'utf8')
const output = require('./projects.cjs').render(template, undefined, 'time-travel').replace('<!-- FILM_CARDS -->', cards).replaceAll('<!-- FILM_COUNT -->', String(entries.length))
const target = path.join(root, 'time-travel/index.html')
if (process.argv.includes('--check')) {
  if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8').replaceAll('\r\n', '\n') !== output.replaceAll('\r\n', '\n')) throw new Error('time-travel/index.html is out of date; run node scripts/build-time-travel.cjs')
  console.log(`Checked ${entries.length} public film entries.`)
} else {
  fs.writeFileSync(target, output)
  console.log(`Built ${target} with ${entries.length} films.`)
}
