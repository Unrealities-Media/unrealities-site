const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const assert = require('node:assert/strict');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || '../../DeckLogic/node_modules/playwright');
const root = path.resolve(__dirname,'..');
const G = require('../fmv/games/js/game-data.js');
const db = require('../fmv/games/data/games.json');
const catalog = G.buildCatalog(db);
(async()=>{
 const server=http.createServer((req,res)=>{
  let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return;}
  if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
  if(!fs.existsSync(file)){res.writeHead(404).end();return;}
  res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.jpg':'image/jpeg','.png':'image/png'})[path.extname(file)]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base=process.env.AUDIT_BASE || `http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 const errors=[], failures=[], broken=[], overflow=[], links=new Set();
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('game-media.local.json'))failures.push({url:r.url(),status:r.status()});});
 try {
  await page.goto(base+'/fmv/games/game.html',{waitUntil:'networkidle'});
  await page.waitForSelector('.directory-grid a');
  for(const group of catalog){
   const result=await page.evaluate(id=>{
    const a=document.createElement('a');a.dataset.guide='';a.href='game.html?game='+encodeURIComponent(id);document.body.append(a);a.click();a.remove();
    return {heading:document.querySelector('h1')?.textContent,overflow:document.documentElement.scrollWidth>innerWidth,
     broken:[...document.querySelectorAll('a[href^="#"]')].filter(a=>a.hash.length>1&&!document.getElementById(decodeURIComponent(a.hash.slice(1)))).map(a=>a.hash),
     links:[...document.querySelectorAll('#content a[href]')].map(a=>a.href)};
   },group.id);
   if(result.heading!==group.title)broken.push({id:group.id,heading:result.heading});
   if(result.broken.length)broken.push({id:group.id,anchors:result.broken});
   if(result.overflow)overflow.push(group.id);
   result.links.forEach(l=>links.add(l));
  }
  console.log(JSON.stringify({guides:catalog.length,broken,overflow,errors,failedRequests:failures.length,links:links.size}));
  fs.writeFileSync(path.join(root,'docs/guide-audit.json'),JSON.stringify({guides:catalog.length,broken,overflow,errors,failures,links:[...links]},null,2)+'\n');
  // Exercise the film search and both positive and empty states.
  await page.goto(base+'/time-travel/',{waitUntil:'networkidle'});
  await page.locator('#film-search').fill('Primer');
  assert.equal(await page.locator('.film-card:visible').count(),1);
  await page.locator('#film-mechanism').selectOption('Journey');
  assert.equal(await page.locator('.film-card:visible').count(),0);
  await page.locator('#film-search').fill('');
  await page.locator('#film-mechanism').selectOption('');
  assert.equal(await page.locator('.film-card:visible').count(),12);
  await page.goto(base+'/fmv/games/collect.html',{waitUntil:'networkidle'});
  await page.waitForSelector('#platform-list button');
  await page.locator('[data-mode="value"]').click();
  await page.locator('#platform-hardware').fill('100');
  await page.locator('#apply-hardware').click();
  assert.ok((await page.locator('#platform-detail').innerText()).includes('Hardware'));
  console.log('Film filters and Platform Titans/value controls passed.');
  await page.goto(base+'/fmv/games/?system=segacd',{waitUntil:'networkidle'});
  assert.equal(await page.locator('#f-sys').inputValue(),'segacd');
  await page.locator('#q').fill('Sewer Shark');
  assert.equal(await page.locator('#list > li').count(),1);
  await page.locator('#list > li').first().click();
  assert.equal(await page.locator('#drawer').getAttribute('aria-hidden'),'false');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#drawer').getAttribute('aria-hidden'),'true');
  await page.locator('#f-reset').click();
  assert.equal(await page.locator('#list > li').count(),db.games.length);
  await page.goto(base+'/fmv/games/timeline.html?system=segacd',{waitUntil:'networkidle'});
  assert.equal(await page.locator('#tl-sys').inputValue(),'segacd');
  await page.locator('#tl-q').fill('no-matching-game-xyz');
  assert.equal(await page.locator('#tl-empty').isVisible(),true);
  await page.locator('#tl-reset').click();
  assert.equal(await page.locator('#tl-empty').isVisible(),false);
  await page.goto(base+'/fmv/games/titans.html',{waitUntil:'networkidle'});
  assert.equal(await page.locator('#ti-list > li').count(),50);
  await page.locator('#ti-n').selectOption('100');
  assert.equal(await page.locator('#ti-list > li').count(),100);
  await page.goto(base+'/fmv/games/channel.html',{waitUntil:'networkidle'});
  const channelBefore=await page.locator('#view').innerText();
  await page.locator('[data-k="chup"]').click();
  assert.notEqual(await page.locator('#view').innerText(),channelBefore);
  await page.locator('[data-k="txt"]').click();
  assert.ok((await page.locator('#view').innerText()).length>100);
  await page.goto(base+'/explore/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('.explore-tree a').count(),catalog.length);
  await page.locator('.explore-tree summary').first().focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('.explore-tree details').first().getAttribute('open'),'');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:path.join(root,'docs/explore-mobile.png'),fullPage:true});
  await page.setViewportSize({width:1440,height:1000});
  await page.screenshot({path:path.join(root,'docs/explore-desktop.png'),fullPage:true});
  console.log('Index drawer/search/reset, timeline, Titans, channel, and Explore keyboard/mobile checks passed.');
  assert.equal(broken.length,0,'Broken guide routes/anchors');
  assert.equal(overflow.length,0,'Mobile guide overflow');
  assert.equal(errors.length,0,'Browser exceptions');
 } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
