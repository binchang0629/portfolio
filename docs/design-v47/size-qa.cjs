const {chromium}=require('C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const out='C:/bin/portfolio/docs/design-v47/';
const measure=async(page,index)=>page.locator(`.mechanical-key[data-key-index="${index}"]`).evaluate(key=>{
 const bounds=key.querySelector('[data-part="key-face-outline"]').getBoundingClientRect();
 const m=key.querySelector('[data-part="key-face-texture"]').getScreenCTM();
 return {width:bounds.width,height:bounds.height,x:bounds.x,y:bounds.y,textureScale:[m.a,m.b,m.c,m.d]};
});
const sameSize=(before,after)=>{
 assert.ok(Math.abs(before.width-after.width)<.001);assert.ok(Math.abs(before.height-after.height)<.001);
 assert.deepEqual(before.textureScale,after.textureScale);assert.ok(Math.abs(before.x-after.x)<.001);
};
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const errors=[],measurements=[];
 try{
  const page=await browser.newPage({viewport:{width:1440,height:960}});page.setDefaultTimeout(6000);page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});await page.locator('.tape-about').click();
  await page.locator('.player').evaluate(p=>Object.assign(p.style,{width:'800px',left:'400px',top:'200px',zIndex:'6'}));
  await page.locator('.player').screenshot({path:out+'released.png'});
  for(const [name,index,file] of [['재생',0,'play'],['빨리 감기',2,'forward'],['되감기',3,'rewind']]){
   const before=await measure(page,index);const button=page.getByRole('button',{name,exact:true});await button.click();
   if(index===0)await page.keyboard.press('Escape');
   const during=await measure(page,index);sameSize(before,during);
   await page.waitForTimeout(160);const after=await measure(page,index);sameSize(before,after);
   assert.ok(after.y>before.y);assert.equal(await page.locator('.mechanical-key[data-latched="true"]').count(),1);
   measurements.push({mode:name,before,during,after});await button.evaluate(e=>e.blur());
   await page.locator('.player').screenshot({path:out+file+'-pressed.png'});
  }
  const stop=page.getByRole('button',{name:'정지',exact:true}),beforeStop=await measure(page,1),b=await stop.boundingBox();
  await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();await page.waitForTimeout(150);
  sameSize(beforeStop,await measure(page,1));await page.mouse.up();await page.waitForTimeout(150);
  assert.equal(await page.locator('.mechanical-key[data-latched="true"]').count(),0);
  sameSize(beforeStop,await measure(page,1));
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});mobile.on('pageerror',e=>errors.push(e.message));
  await mobile.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});await mobile.locator('.player').scrollIntoViewIfNeeded();const before=await measure(mobile,0);
  await mobile.getByRole('button',{name:'재생',exact:true}).tap();await mobile.keyboard.press('Escape');await mobile.locator('.player').scrollIntoViewIfNeeded();const after=await measure(mobile,0);
  sameSize(before,after);await mobile.getByRole('button',{name:'재생',exact:true}).evaluate(e=>e.blur());await mobile.locator('.player').screenshot({path:out+'mobile-play-pressed.png'});
  assert.deepEqual(errors,[]);fs.writeFileSync(out+'size-qa.json',JSON.stringify({passed:true,measurements,mobile:{before,after},errors},null,2));
  console.log('All key faces and photo icons keep identical width, height and scale during press animation; latch and stop verified on desktop and mobile.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
