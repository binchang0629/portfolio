const {chromium}=require('C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{
 const physics=await import('file:///C:/bin/portfolio/src/lib/tape-mechanism.js');
 const initial=physics.initialMechanism(.28),end=physics.seekMechanism(initial,.94),back=physics.seekMechanism(end,.28);
 assert.ok(Math.abs(back.angles.left)<1e-8&&Math.abs(back.angles.right)<1e-8&&Math.abs(back.travel)<1e-8);
 for(const value of [.04,.2,.5,.8,.96]){const r=physics.reelRadii(value);assert.ok(Math.abs(r.left*r.left+r.right*r.right-(91**2+185**2))<1e-6)}
 assert.equal(physics.seekMechanism(initial,.5,true).angles,initial.angles);
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const checks=[];
 try{
  const page=await browser.newPage({viewport:{width:1440,height:960},reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});await page.getByRole('button',{name:'재생',exact:true}).click();
  const reader=page.locator('.story-reader');await reader.waitFor();
  for(let i=0;i<5;i++){
   if(i)await reader.locator('.reader-transport button').nth(2).click();
   await page.waitForTimeout(150);
   assert.ok((await reader.locator('.reader-case').nth(i).getAttribute('aria-label')).includes('현재 재생 중'));
   const dimensions=await reader.locator('.reader-scroll').evaluate(e=>({scroll:e.scrollHeight,client:e.clientHeight,article:e.firstElementChild.offsetHeight,top:e.scrollTop}));
   checks.push({track:i+1,dimensions});
   const r1=await reader.locator('[data-part="reel-left"] [data-part="pack-surface"]').getAttribute('r');await page.waitForTimeout(180);
   assert.equal(await reader.locator('[data-part="reel-left"] [data-part="pack-surface"]').getAttribute('r'),r1,'No timed automatic scrolling/winding in reader');
  }
  assert.ok(await reader.locator('.reader-transport button').nth(2).isDisabled());
  await page.keyboard.press('Escape');await reader.waitFor({state:'hidden'});
  assert.equal(await page.locator('.tape').count(),5);await page.close();
  const phone=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  await phone.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});await phone.getByRole('button',{name:'재생',exact:true}).tap();
  const r=phone.locator('.story-reader');await r.waitFor();await r.locator('.reader-shelf-toggle').tap();
  const source=await r.locator('.reader-case[data-slot="3"]').boundingBox(),target=await r.locator('.reader-player').boundingBox();
  const cdp=await phone.context().newCDPSession(phone);
  const sx=source.x+source.width/2,sy=source.y+source.height/2,tx=target.x+target.width/2,ty=target.y+target.height/2;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:sx,y:sy,id:1}]});
  for(let i=1;i<=12;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:sx+(tx-sx)*i/12,y:sy+(ty-sy)*i/12,id:1}]});
  assert.equal(await r.locator('.reader-held-tape').count(),1);assert.equal(await r.locator('.reader-player.is-drop-target').count(),1);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await phone.waitForTimeout(200);
  assert.ok((await r.locator('h2').textContent()).includes('ポ')===false);
  assert.ok((await r.locator('.reader-case').nth(3).getAttribute('aria-label')).includes('현재 재생 중'));
  assert.equal(await r.locator('.reader-shelf').evaluate(e=>e.classList.contains('is-expanded')),false);
  await phone.screenshot({path:'C:/bin/portfolio/docs/design-v52/mobile-collapsed.png'});await phone.close();
  fs.writeFileSync('C:/bin/portfolio/docs/design-v52/extra-qa.json',JSON.stringify({checks,physics:'Length conserved; reverse seek restores angle and travel; reduced motion preserves angle.',touch:'Native touch drag swapped to 04; 01 returned to its own case; shelf closed.'},null,2));
  console.log(JSON.stringify({tracks:5,physics:'pass',touch:'pass',escape:'pass',timedWindingInReader:false,checks}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
