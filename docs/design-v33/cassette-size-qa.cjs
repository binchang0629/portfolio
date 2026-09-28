const {chromium}=require('C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
 const out=path.resolve('docs/design-v33');fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const errors=[],cases=[];
 const measure=locator=>locator.evaluate(svg=>{
  const hubs=[...svg.querySelectorAll('[data-part="hub"]')];
  const a=hubs[0].getScreenCTM(),b=hubs[1].getScreenCTM();
  return {hubDistance:Math.hypot(a.e-b.e,a.f-b.f),hubRadius:Number(hubs[0].dataset.radius)*Math.hypot(a.a,a.b),sourceScale:Math.hypot(a.a,a.b)};
 });
 try{
  for(const viewport of [{width:1920,height:1080},{width:1366,height:768},{width:1440,height:600},{width:390,height:844}]){
   const page=await browser.newPage({viewport,reducedMotion:'reduce',isMobile:viewport.width<761,hasTouch:viewport.width<761});
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
   const comparison=[];
   for(const id of ['about','team','design','branding','next']){
    await page.mouse.move(0,0);
    const before=await measure(page.locator(`.tape-${id} .cassette-art`));
    await page.locator(`.tape-${id}`).click();
    const inside=await measure(page.locator('.integrated-player'));
    assert.ok(Math.abs(before.hubDistance-inside.hubDistance)<.1,`${id}: reel separation preserved during insertion`);
    assert.ok(Math.abs(before.hubRadius-inside.hubRadius)<.05,`${id}: hub size preserved during insertion`);
    assert.equal(await page.locator(`.tape-${id}`).count(),0);
    await page.getByRole('button',{name:'꺼내기 ⏏',exact:true}).click();
    await page.mouse.move(0,0);
    const after=await measure(page.locator(`.tape-${id} .cassette-art`));
    assert.ok(Math.abs(before.hubDistance-after.hubDistance)<.1,`${id}: original size restored on eject`);
    comparison.push({id,before,inside,after});
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   if(viewport.width>760){
    assert.equal(await page.locator('.portfolio').evaluate(e=>e.getBoundingClientRect().height),viewport.height);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight));
   }
   if(viewport.width===1920){
    await page.screenshot({path:path.join(out,'portfolio-size-matched.png')});
    await page.locator('.tape-about .cassette-art').screenshot({path:path.join(out,'desk-cassette.png')});
    // Also confirm resizing the existing page updates both source scales.
    await page.setViewportSize({width:1024,height:768});
    const before=await measure(page.locator('.tape-about .cassette-art'));
    await page.locator('.tape-about').click();
    const inside=await measure(page.locator('.integrated-player'));
    assert.ok(Math.abs(before.hubDistance-inside.hubDistance)<.1,'live viewport resize keeps size match');
   }
   if(viewport.width===390)await page.screenshot({path:path.join(out,'portfolio-size-matched-mobile.png'),fullPage:true});
   cases.push({viewport,comparison});
   await page.close();
  }
  assert.deepEqual(errors,[]);
  const report={passed:true,cases,errors};
  fs.writeFileSync(path.join(out,'cassette-size-qa.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({passed:true,viewports:cases.map(c=>c.viewport),example:cases[0].comparison[0],errors}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
