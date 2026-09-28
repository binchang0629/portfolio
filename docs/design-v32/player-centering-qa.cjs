const {chromium}=require('C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
 const out=path.resolve('docs/design-v32');fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const errors=[],measurements=[];
 try{
  const page=await browser.newPage({viewport:{width:1920,height:1280},reducedMotion:'no-preference'});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
  await page.locator('.player').screenshot({path:path.join(out,'player-empty-centered.png')});
  const shaftOffset=await page.locator('[data-part="empty-spindles"]').evaluate(e=>Number(e.dataset.offsetX));
  for(const name of ['01 ABOUT ME','02 TEAM PLAY','03 DESIGN','04 BRANDING','05 NEXT TRACK']){
   await page.getByRole('button',{name:`${name} 테이프 넣기`,exact:true}).click();
   assert.equal(await page.locator('.tape').count(),4);
   const data=await page.locator('.integrated-player').evaluate(svg=>{
    const inserted=svg.querySelector('[data-part="inserted-cassette"]');
    const clipId=inserted.getAttribute('clip-path').match(/#([^)]*)/)[1];
    const clip=svg.querySelector(`[id="${clipId}"] path`);
    const b=clip.getBBox(), y=520, t=(y-b.y)/b.height;
    const nums=clip.getAttribute('d').match(/-?\d+(?:\.\d+)?/g).map(Number);
    const left=nums[0]+(nums[6]-nums[0])*t, right=nums[2]+(nums[4]-nums[2])*t;
    const matrix=svg.getScreenCTM();
    const hubs=[...svg.querySelectorAll('[data-part="hub"]')].map(h=>{
     const m=h.getCTM();return {x:m.e,y:m.f,scaleX:Math.hypot(m.a,m.b),scaleY:Math.hypot(m.c,m.d)};
    });
    return {leftGap:(left-170)*matrix.a,rightGap:(1185-right)*matrix.a,hubs,base:svg.querySelector(':scope > image').getAttribute('href')};
   });
   assert.ok(Math.abs(data.leftGap-data.rightGap)<1,'Left/right clearances differ by less than one screen pixel');
   assert.equal(data.base,'/assets/player/coherent/empty-interior-v1.png');
   assert.ok(data.hubs.every(h=>Math.abs(h.scaleX-h.scaleY)<.0001));
   // getCTM includes the root viewBox; compare against the root CTM to source coordinates.
   const sourceAxes=await page.locator('.integrated-player').evaluate(svg=>[...svg.querySelectorAll('[data-part="hub"]')].map(h=>{
    const m=svg.getScreenCTM().inverse().multiply(h.getScreenCTM());return {x:m.e,y:m.f};
   }));
   assert.ok(Math.abs(sourceAxes[0].x-(513+shaftOffset))<.001);
   assert.ok(Math.abs(sourceAxes[1].x-(905+shaftOffset))<.001);
   assert.ok(sourceAxes.every(h=>Math.abs(h.y-520)<.001));
   measurements.push({name,leftGapPx:data.leftGap,rightGapPx:data.rightGap,sourceAxes});
   if(name==='05 NEXT TRACK'){
    await page.locator('.player').screenshot({path:path.join(out,'player-next-centered.png')});
    await page.screenshot({path:path.join(out,'portfolio-centered.png')});
   }
   await page.getByRole('button',{name:'재생',exact:true}).click();
   await page.locator('dialog[open]').waitFor();await page.keyboard.press('Escape');
   await page.waitForFunction(()=>[...document.querySelectorAll('.player [data-part="hub"]')].every(e=>Number(e.dataset.angle)>0),{},{timeout:5000});
   await page.getByRole('button',{name:'정지',exact:true}).click();
   await page.getByRole('button',{name:'꺼내기 ⏏',exact:true}).click();
   assert.equal(await page.locator('.tape').count(),5);
  }
  assert.deepEqual(errors,[]);
  const report={passed:true,doorRailsAtReelHeight:{left:170,right:1185},measurements,errors};
  fs.writeFileSync(path.join(out,'player-centering-qa.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
