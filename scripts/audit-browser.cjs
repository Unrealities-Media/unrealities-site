// Run with PLAYWRIGHT_MODULE pointing to an installed Playwright module.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '../../DeckLogic/node_modules/playwright');
const base = process.env.AUDIT_BASE || 'https://unrealities.media';
const output = process.env.AUDIT_OUTPUT || 'docs/browser-audit.json';
(async () => {
  const browser = await chromium.launch({channel:'msedge',headless:true});
  const page = await browser.newPage();
  const report = [];
  const routes = ['/', '/explore/', '/fmv/', '/time-travel/', ...['index','game','timeline','titans','collect','channel'].map(p=>`/fmv/games/${p}.html`), '/404.html', '/audit-missing-page'];
  for (const route of routes) {
    const errors=[], failures=[];
    const onError=e=>errors.push(e.message);
    const onResponse=r=>{if(r.status()>=400)failures.push({url:r.url(),status:r.status()});};
    page.on('pageerror',onError); page.on('response',onResponse);
    const response=await page.goto(base+route,{waitUntil:'networkidle',timeout:60000});
    const desktop=await page.evaluate(()=>({title:document.title,headings:[...document.querySelectorAll('h1')].map(e=>e.textContent),links:[...document.querySelectorAll('a[href]')].map(e=>({text:e.textContent.trim(),url:e.href})),overflow:document.documentElement.scrollWidth>innerWidth, text:document.body.innerText.slice(0,350)}));
    await page.setViewportSize({width:390,height:844});
    const mobile=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,offenders:[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+2).slice(0,8).map(e=>e.tagName+'.'+e.className)}));
    await page.setViewportSize({width:1280,height:900});
    report.push({route,status:response.status(),errors,failures,desktop,mobile});
    page.off('pageerror',onError);page.off('response',onResponse);
    console.log(JSON.stringify({route,status:response.status(),errors,failures,mobile,headings:desktop.headings}));
  }
  fs.writeFileSync(path.resolve(output),JSON.stringify(report,null,2)+'\n');
  await browser.close();
  for(const row of report){
    assert.equal(row.status,row.route==='/audit-missing-page'?404:200,row.route);
    assert.equal(row.errors.length,0,row.route+' JavaScript errors');
    assert.equal(row.failures.filter(f=>!(row.route==='/audit-missing-page'&&f.url===base+row.route&&f.status===404)).length,0,row.route+' failed assets');
    assert.equal(row.mobile.overflow,false,row.route+' mobile overflow');
  }
})().catch(e=>{console.error(e);process.exitCode=1;});
