const fs=require('node:fs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || '../../DeckLogic/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const context=await browser.newContext();
 const top=require('../docs/browser-audit.json');
 const guides=require('../docs/guide-audit.json');
 const urls=new Set(top.flatMap(p=>p.desktop.links.map(l=>l.url)).filter(u=>/^https?:/.test(u)&&!u.startsWith('https://unrealities.media')));
 const domains=new Map();
 for(const u of guides.links){if(!/^https?:/.test(u))continue;const h=new URL(u).hostname;if(['127.0.0.1','unrealities.media'].includes(h))continue; if((domains.get(h)||0)<2){urls.add(u);domains.set(h,(domains.get(h)||0)+1);}}
 const queue=[...urls], results=[];
 await Promise.all(Array.from({length:4},async()=>{
  while(queue.length){const url=queue.shift();try{const r=await context.request.get(url,{timeout:15000});results.push({url,status:r.status(),final:r.url()});await r.dispose();}catch(e){results.push({url,error:e.message.split('\n')[0]});}}
 }));
 fs.writeFileSync('docs/link-audit.json',JSON.stringify(results,null,2)+'\n');
 console.log(JSON.stringify({checked:results.length,ok:results.filter(r=>r.status<400).length,other:results.filter(r=>!r.status||r.status>=400)},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
