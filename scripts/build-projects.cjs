const fs = require('node:fs');
const path = require('node:path');
const { root, upstream, snapshot, render } = require('./projects.cjs');
const check = process.argv.includes('--check');
const refresh = process.argv.includes('--refresh');
if (check && refresh) throw Error('Use --check or --refresh, not both');
const dataFile = path.join(root, 'data/projects.json');
const lockFile = path.join(root, 'data/project-sources.json');
if (refresh || process.argv.includes('--upstream')) {
  const next = upstream();
  if (refresh) {
    fs.mkdirSync(path.dirname(dataFile), {recursive:true});
    const previous = fs.existsSync(lockFile) ? JSON.parse(fs.readFileSync(lockFile, 'utf8')) : {};
    for (const [repo, source] of Object.entries(next.provenance)) {
      if (previous[repo]?.summaryHash === source.summaryHash) next.provenance[repo] = previous[repo];
    }
    fs.writeFileSync(dataFile, JSON.stringify(next.projects, null, 2) + '\n');
    fs.writeFileSync(lockFile, JSON.stringify(next.provenance, null, 2) + '\n');
  } else if (JSON.stringify(snapshot()) !== JSON.stringify(next.projects)) throw Error('Upstream project summaries changed; run build-projects.cjs --refresh');
}
for (const [template, destination, current] of [['home-template.html', 'index.html', ''], ['fmv-template.html', 'fmv/index.html', 'rip-fmv']]) {
  const releases = require('../fmv/games/data/games.json');
  const games = require('../fmv/games/js/game-data.js').buildCatalog(releases);
  const content = render(fs.readFileSync(path.join(__dirname, template), 'utf8'), snapshot(), current)
    .replaceAll('<!-- GAME_COUNT -->', games.length.toLocaleString('en-US'))
    .replaceAll('<!-- RELEASE_COUNT -->', releases.games.length.toLocaleString('en-US'))
    .replaceAll('\r\n', '\n');
  const file = path.join(root, destination);
  if (check) {
    if (fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n') !== content) throw Error(`${destination} is stale`);
  } else fs.writeFileSync(file, content);
}
console.log('Checked four equal-weight project summaries and built studio pages.');
