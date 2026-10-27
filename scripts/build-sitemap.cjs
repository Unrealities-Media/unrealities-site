const fs = require('node:fs');
const path = require('node:path');
const G = require('../fmv/games/js/game-data.js');
const games = G.buildCatalog(require('../fmv/games/data/games.json'));
const routes = ['/', '/fmv/', '/time-travel/', '/fmv/games/',
  ...['game', 'timeline', 'titans', 'collect', 'channel'].map(p => '/fmv/games/' + p + '.html'),
  ...fs.readdirSync(path.resolve(__dirname, '../time-travel/films')).filter(f => f.endsWith('.html')).sort().map(f => '/time-travel/films/' + f),
  ...games.map(g => '/fmv/games/game.html?game=' + encodeURIComponent(g.id))];
const content = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + routes.map(r => '  <url><loc>https://unrealities.media' + r.replaceAll('&', '&amp;') + '</loc></url>').join('\n')
  + '\n</urlset>\n';
const file = path.resolve(__dirname, '../sitemap.xml');
if (process.argv.includes('--check')) {
  if (fs.readFileSync(file, 'utf8').replaceAll('\r\n', '\n') !== content) throw Error('sitemap.xml needs regeneration');
} else fs.writeFileSync(file, content);
console.log('Sitemap: ' + routes.length + ' URLs.');
