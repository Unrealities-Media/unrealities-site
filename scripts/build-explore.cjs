const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const db=require('../fmv/games/data/games.json');
const G=require('../fmv/games/js/game-data.js');
const games=G.buildCatalog(db);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const groups=new Map();
for(const game of games){const initial=/^[a-z]/i.test(game.title)?game.title[0].toUpperCase():'#';if(!groups.has(initial))groups.set(initial,[]);groups.get(initial).push(game);}
const header=fs.readFileSync(path.join(root,'index.html'),'utf8').match(/<header class="site-header">[\s\S]*?<\/header>/)[0].replace('href="/explore/"','href="/explore/" aria-current="page"').replace('href="#about"','href="/#about"');
const html=`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Explore the archives — Unrealities</title>
  <meta name="description" content="A map of Unrealities: every FMV game guide, platform, timeline, film guide and studio project in one place.">
  <link rel="canonical" href="https://unrealities.media/explore/">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <meta name="theme-color" content="#2F4858">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Explore the archives — Unrealities">
  <meta property="og:description" content="Find your way through the games, films and stories.">
  <meta property="og:url" content="https://unrealities.media/explore/">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Archivo+Black&display=swap">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  ${header}
  <main id="main">
    <section class="page-hero"><p class="eyebrow">A map for curious minds</p><h1>Pick a thread.<br>See where it leads.</h1><p class="lede">Every corner of Unrealities, from the first laserdisc experiments to films that fold time. Find a starting point, then follow the connections.</p><div class="actions"><a class="button" href="#games">Find a game</a><a class="link-button" href="#films">Follow the films</a></div></section>
    <section class="guide-section" aria-labelledby="archive-title"><div class="guide-heading"><div><p class="eyebrow">The game shelf</p><h2 id="archive-title">Six ways into FMV.</h2></div><p>${games.length} games. ${db.games.length.toLocaleString('en-US')} release records. Choose the view that fits your curiosity.</p></div><div class="feature-grid">
    ${[
      ['game.html','Game field guides','Explore each game, compare its editions and follow the sources.'],
      ['index.html','All release records','Search and filter the catalog, with a collection tracker saved in your browser.'],
      ['timeline.html','Release timeline','See when the games first appeared and how their versions spread.'],
      ['titans.html','Game Titans','Explore the editorial game ranking and the reasons behind each score.'],
      ['collect.html','Platform Titans','Compare platform libraries, then explore hardware and game costs separately.'],
      ['channel.html','Channel select','Tune through the years with a television-style remote and teletext.']
    ].map(([url,title,copy])=>`<a class="feature-card" href="/fmv/games/${url}"><h3>${title}</h3><p>${copy}</p><span class="feature-link">Explore →</span></a>`).join('\n')}
    </div></section>
    <section class="guide-section" id="systems" aria-labelledby="systems-title"><p class="eyebrow">Follow a platform</p><h2 id="systems-title">One system at a time.</h2><ul class="explore-links">${db.systems.map(s=>`<li><a href="/fmv/games/?system=${encodeURIComponent(s.id)}">${esc(s.name)}</a></li>`).join('')}</ul></section>
    <section class="guide-section" id="games" aria-labelledby="games-title"><p class="eyebrow">The complete guide tree</p><h2 id="games-title">Every game, A to Z.</h2><p>Open a letter to browse its guides. Each guide branches into the recorded releases and research sources.</p><div class="explore-tree">${[...groups].sort(([a],[b])=>a.localeCompare(b)).map(([letter,entries])=>`<details><summary>${letter} <span>${entries.length} guides</span></summary><ul class="explore-links">${entries.sort((a,b)=>a.title.localeCompare(b.title)).map(g=>`<li><a href="/fmv/games/game.html?game=${encodeURIComponent(g.id)}">${esc(g.title)}</a></li>`).join('')}</ul></details>`).join('\n')}</div></section>
    <section class="crosslink" id="films"><p class="eyebrow">The film shelf</p><h2>Journeys, loops and tangled timelines.</h2><p>The time-travel film guide connects twelve films through the ideas that make their timelines tick. Search by title or filter by time mechanic.</p><div class="actions"><a class="button" href="/time-travel/">Explore time-travel movies</a><a class="link-button" href="https://talkie-trivia-beta.web.app/">Play Talkie Trivia · public beta ↗</a></div></section>
    <section class="guide-section"><p class="eyebrow">From the studio</p><h2>Keep exploring.</h2><ul class="explore-links"><li><a href="/fmv/">An introduction to FMV games</a></li><li><a href="https://unrealities-media.github.io/DeckLogic/">DeckLogic · in development</a></li><li><a href="/#about">About Unrealities</a></li><li><a href="mailto:hello@unrealities.media">Get in touch</a></li></ul></section>
  </main>
  <footer class="site-footer"><a class="brand" href="/">UNREALITIES</a><small>Games, films and the stories between them.</small></footer>
</body>
</html>
`;
const routes=['/','/explore/','/fmv/','/time-travel/','/fmv/games/',...['game','timeline','titans','collect','channel'].map(p=>`/fmv/games/${p}.html`),...games.map(g=>`/fmv/games/game.html?game=${encodeURIComponent(g.id)}`)];
const sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+routes.map(r=>`  <url><loc>https://unrealities.media${esc(r)}</loc></url>`).join('\n')+'\n</urlset>\n';
for(const [relative,content] of [['explore/index.html',html],['sitemap.xml',sitemap]]){
 const file=path.join(root,relative);
 if(process.argv.includes('--check')){if(!fs.existsSync(file)||fs.readFileSync(file,'utf8').replaceAll('\r\n','\n')!==content.replaceAll('\r\n','\n'))throw Error(relative+' needs regeneration');}
 else {fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content);}
}
console.log(`Explore directory and sitemap: ${games.length} guides, ${routes.length} URLs.`);
