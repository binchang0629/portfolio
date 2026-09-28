const {chromium}=require('C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const root=process.cwd(),out=path.resolve('docs/design-v35');fs.mkdirSync(out,{recursive:true});
 const {tapeRoute}=await import(pathToFileURL(path.join(root,'src/lib/tape-path.js')));
 const {reelRadii}=await import(pathToFileURL(path.join(root,'src/lib/tape-mechanism.js')));
 const guides=[{x:214,y:830,radius:34},{x:1324,y:830,radius:34}];
 const sampled=[];
 for(let i=0;i<=100;i++){
  const progress=.04+.92*i/100,w=reelRadii(progress);
  const packs=[{x:469,y:441,radius:w.left*236/185},{x:1068,y:441,radius:w.right*236/185}];
  const route=tapeRoute(packs,guides);
  assert.ok(!/NaN|Infinity/.test(route.path));
  for(const [index,name] of ['left','right'].entries()){
   const t=route[name],pack=packs[index],guide=guides[index];
   const vx=t.guide.x-t.pack.x,vy=t.guide.y-t.pack.y;
   assert.ok(Math.abs(Math.hypot(t.pack.x-pack.x,t.pack.y-pack.y)-pack.radius)<1e-8);
   assert.ok(Math.abs(Math.hypot(t.guide.x-guide.x,t.guide.y-guide.y)-guide.radius)<1e-8);
   assert.ok(Math.abs(vx*(t.pack.x-pack.x)+vy*(t.pack.y-pack.y))<1e-7,'Ribbon leaves each winding on a tangent');
   assert.ok(name==='left'?t.pack.x<pack.x:t.pack.x>pack.x,'Ribbon routes around outer sides, never across center');
  }
  if(i%25===0)sampled.push({progress,path:route.path});
 }
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const errors=[];
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1280},reducedMotion:'no-preference'});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('.tape [data-part="magnetic-tape-path"]').count(),5);
  assert.equal(await page.locator('.tape [data-part="tape-guide"]').count(),10);
  assert.ok(await page.locator('.tape [data-part="cassette-surface"]').evaluateAll(surfaces=>surfaces.every(surface=>{
   const parts=[...surface.querySelector('[data-part="shell"]').parentElement.children].map(n=>n.dataset.part);
   return parts.indexOf('internal-mechanism')<parts.indexOf('cassette-front-cover')&&parts.indexOf('cassette-front-cover')<parts.indexOf('labels');
  })));
  assert.equal(await page.locator('.tape [data-part="case-reflections"]').count(),5);

  // Inspect the same asset at a useful scale without the desk's decorative rotation.
  await page.locator('.tape-about .cassette-art').evaluate(svg=>{
   const panel=document.createElement('div');panel.id='cassette-inspect';
   Object.assign(panel.style,{position:'fixed',left:'0',top:'0',width:'850px',zIndex:'10000',background:'#f7f3ee'});
   panel.appendChild(svg.cloneNode(true));document.body.appendChild(panel);
  });
  await page.locator('#cassette-inspect').screenshot({path:path.join(out,'cassette-internal-depth.png')});
  await page.locator('#cassette-inspect').evaluate(e=>e.remove());
  await page.mouse.move(0,0);
  await page.locator('.tape-next').click();
  assert.equal(await page.locator('.player [data-part="magnetic-tape-path"]').count(),1);
  const ribbon=page.locator('.player [data-part="magnetic-tape-path"]');
  const stopped=await ribbon.getAttribute('d');
  await page.locator('.player').screenshot({path:path.join(out,'player-internal-depth.png')});
  await page.getByRole('button',{name:'재생',exact:true}).click();
  await page.locator('dialog[open]').waitFor();await page.keyboard.press('Escape');
  await page.waitForFunction(previous=>document.querySelector('.player [data-part="magnetic-tape-path"]').getAttribute('d')!==previous,stopped,{timeout:10000}).catch(async error=>{console.log(await page.locator('.player').evaluate(e=>({state:e.dataset.state,angle:e.querySelector('[data-part="hub"]').dataset.angle,radius:e.querySelector('[data-part="tape-ribbon"]').dataset.leftRadius})));console.log(errors);throw error});
  await page.getByRole('button',{name:'정지',exact:true}).click();
  const paused=await ribbon.getAttribute('d');await page.waitForTimeout(180);
  assert.equal(await ribbon.getAttribute('d'),paused);
  await page.getByRole('button',{name:'되감기',exact:true}).click();
  await page.waitForFunction(previous=>document.querySelector('.player [data-part="magnetic-tape-path"]').getAttribute('d')!==previous,paused,{timeout:5000});
  await page.getByRole('button',{name:'정지',exact:true}).click();
  await page.getByRole('button',{name:'꺼내기 ⏏',exact:true}).click();
  assert.equal(await page.locator('.tape [data-part="magnetic-tape-path"]').count(),5);
  assert.deepEqual(errors,[]);
  const report={passed:true,tangentSamples:101,sampled,checks:['case reflections and moulding above internal mechanism, labels on top','pack and guide tangency','outer route avoids central window','shared ribbon on all desk tapes and inserted tape','route follows playback/rewind winding','paused route stationary','ejected tape restores ribbon'],errors};
  fs.writeFileSync(path.join(out,'tape-path-qa.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({passed:true,tangentSamples:101,checks:report.checks,errors}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
