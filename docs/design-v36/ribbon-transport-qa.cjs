const {chromium}=require('C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const out=path.resolve('docs/design-v36');fs.mkdirSync(out,{recursive:true});
 const {tapeRoute,TAPE_RIBBON_WIDTH}=await import(pathToFileURL(path.resolve('src/lib/tape-path.js')));
 const {reelRadii,initialMechanism,advanceMechanism}=await import(pathToFileURL(path.resolve('src/lib/tape-mechanism.js')));
 const guides=[{x:214,y:830,radius:34},{x:1324,y:830,radius:34}];
 for(let i=0;i<=100;i++){
  const winding=reelRadii(.04+.92*i/100);
  const packs=[{x:469,y:441,radius:winding.left*236/185},{x:1068,y:441,radius:winding.right*236/185}];
  const route=tapeRoute(packs,guides);
  assert.ok(!/NaN|Infinity/.test(route.path));
  for(const [j,name] of ['left','right'].entries()){
   const t=route[name],pack=packs[j];
   const dx=t.guide.x-t.pack.x,dy=t.guide.y-t.pack.y,length=Math.hypot(dx,dy);
   // The outer edge of the drawn stroke, not just its centerline, touches the coil.
   const distance=Math.abs(dx*(pack.y-t.pack.y)-dy*(pack.x-t.pack.x))/length;
   assert.ok(Math.abs(distance+TAPE_RIBBON_WIDTH/2-pack.radius)<1e-8);
   assert.ok(Math.hypot(t.pack.x-pack.x,t.pack.y-pack.y)<pack.radius,'Butt end hidden inside the coil');
  }
 }
 const initial=initialMechanism(.5);
 const play=advanceMechanism(initial,20,'playing');
 const forward=advanceMechanism(initial,20,'forwarding');
 const rewind=advanceMechanism(initial,20,'rewinding');
 assert.ok(Math.abs(forward.travel-3*play.travel)<1e-8);
 assert.ok(Math.abs(rewind.travel+3*play.travel)<1e-8);
 assert.equal(advanceMechanism(play,20,'stopped').travel,play.travel);
 assert.equal(advanceMechanism(initial,20,'playing',true).travel,0);
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const errors=[];
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1280},reducedMotion:'no-preference'});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('.tape [data-part="tape-moving-grain"]').count(),5);
  assert.ok(await page.locator('.tape [data-part="tape-ribbon"]').evaluateAll(ribbons=>ribbons.every(e=>Number(e.dataset.travel)===0)));
  await page.locator('.tape-about .cassette-art').evaluate(svg=>{
   const panel=document.createElement('div');panel.id='inspect';
   Object.assign(panel.style,{position:'fixed',left:'0',top:'0',width:'900px',zIndex:'10000',background:'#f7f3ee'});
   panel.appendChild(svg.cloneNode(true));document.body.appendChild(panel);
  });
  await page.locator('#inspect').screenshot({path:path.join(out,'cassette-smooth-contacts.png')});
  await page.locator('#inspect').evaluate(e=>e.remove());
  await page.locator('.tape-about').click();
  const snapshot=()=>page.locator('.player').evaluate(e=>({
   travel:Number(e.querySelector('[data-part="tape-ribbon"]').dataset.travel),
   offset:Number(e.querySelector('[data-part="tape-moving-grain"]').getAttribute('stroke-dashoffset')),
   path:e.querySelector('[data-part="magnetic-tape-path"]').getAttribute('d'),
   cover:e.querySelector('[data-part="cassette-front-cover"]').outerHTML,
   guides:[...e.querySelectorAll('[data-part="tape-guide"]')].map(g=>g.outerHTML),
   angles:[...e.querySelectorAll('[data-part="hub"]')].map(h=>Number(h.dataset.angle)),
  }));
  const idle=await snapshot();assert.equal(idle.travel,0);
  // Reproduce a repeated animation timestamp and verify playback keeps going.
  await page.evaluate(()=>{
   const nativeRAF=requestAnimationFrame.bind(window);let lastTick=null,injected=false;
   window.requestAnimationFrame=callback=>nativeRAF(time=>{
    if(callback.name==='tick'){
     if(lastTick!==null&&!injected){injected=true;window.__repeatedTapeFrame=true;callback(lastTick);return}
     lastTick=time;
    }
    callback(time);
   });
  });
  await page.getByRole('button',{name:'재생',exact:true}).click();
  await page.locator('dialog[open]').waitFor();await page.keyboard.press('Escape');
  await page.waitForFunction(()=>Number(document.querySelector('.player [data-part="tape-ribbon"]').dataset.travel)>0,{},{timeout:10000}).catch(async e=>{console.log(await page.locator('.player').evaluate(p=>({state:p.dataset.state,travel:p.querySelector('[data-part="tape-ribbon"]').dataset.travel,angle:p.querySelector('[data-part="hub"]').dataset.angle,reduce:matchMedia('(prefers-reduced-motion: reduce)').matches,visibility:document.visibilityState})));console.log(errors);throw e});
  const playing=await snapshot();
  assert.ok(await page.evaluate(()=>window.__repeatedTapeFrame===true));
  assert.equal(await page.locator('.player').getAttribute('data-state'),'playing');
  assert.ok(playing.offset<0&&playing.angles.every(a=>a>0));
  assert.equal(playing.cover,idle.cover);assert.deepEqual(playing.guides,idle.guides);
  await page.getByRole('button',{name:'정지',exact:true}).click();
  const stopped=await snapshot();await page.waitForTimeout(150);
  assert.deepEqual(await snapshot(),stopped);
  await page.getByRole('button',{name:'되감기',exact:true}).click();
  await page.waitForFunction(before=>Number(document.querySelector('.player [data-part="tape-ribbon"]').dataset.travel)<before,stopped.travel,{timeout:10000});
  const rewinding=await snapshot();assert.ok(rewinding.offset>stopped.offset);
  await page.getByRole('button',{name:'빨리 감기',exact:true}).click();
  await page.waitForFunction(before=>Number(document.querySelector('.player [data-part="tape-ribbon"]').dataset.travel)>before,rewinding.travel,{timeout:10000});
  const forwarding=await snapshot();assert.ok(forwarding.offset<rewinding.offset);
  await page.getByRole('button',{name:'정지',exact:true}).click();
  await page.locator('.player').screenshot({path:path.join(out,'player-ribbon-transport.png')});
  await page.getByRole('button',{name:'꺼내기 ⏏',exact:true}).click();
  assert.equal(await page.locator('.tape').count(),5);
  assert.ok(await page.locator('.tape [data-part="tape-ribbon"]').evaluateAll(r=>r.every(e=>Number(e.dataset.travel)===0)));
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'no-preference'});
  await mobile.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
  await mobile.locator('.tape-design').click();
  await mobile.getByRole('button',{name:'재생',exact:true}).click();await mobile.keyboard.press('Escape');
  await mobile.waitForFunction(()=>Number(document.querySelector('.player [data-part="tape-ribbon"]').dataset.travel)>0,{},{timeout:10000});
  assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const reduced=await browser.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce'});
  await reduced.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});await reduced.locator('.tape-about').click();
  await reduced.getByRole('button',{name:'재생',exact:true}).click();await reduced.keyboard.press('Escape');await reduced.waitForTimeout(250);
  assert.equal(await reduced.locator('.player [data-part="tape-ribbon"]').getAttribute('data-travel'),'0');
  assert.deepEqual(errors,[]);
  const report={passed:true,flushContactSamples:101,checks:['ribbon stroke edge flush with coil','cut ends inside winding','same transport clock for ribbon and reels','repeated animation timestamp does not stop playback','forward speed 3x, rewind reverses','stop freezes grain and reels','case reflections and guides fixed','mobile play','reduced motion honored'],travel:{playing:playing.travel,stopped:stopped.travel,rewinding:rewinding.travel,forwarding:forwarding.travel},errors};
  fs.writeFileSync(path.join(out,'ribbon-transport-qa.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
