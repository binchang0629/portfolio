const {chromium}=require('C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
 const out=path.resolve('docs/design-v39');fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const errors=[],checks=[];
 const ids=['about','team','design','branding','next'];
 const names=['01 ABOUT ME','02 TEAM PLAY','03 DESIGN','04 BRANDING','05 NEXT TRACK'];
 const inventory=async page=>{
  const loaded=await page.locator('.player').evaluate(p=>p.querySelector('[data-part="cassette-surface"] > g > text')?.textContent ?? null);
  const records=[];
  for(let i=0;i<ids.length;i++){
   const desk=await page.locator(`.tape-${ids[i]}`).count(),box=await page.locator(`[data-stored-id="${ids[i]}"]`).count();
   const inPlayer=loaded===names[i].replace(' ','. ')?1:0;
   assert.equal(desk+box+inPlayer,1,`${ids[i]} has exactly one location`);
   records.push({id:ids[i],desk,box,inPlayer});
  }
  return records;
 };
 const slotPoint=async(page,index)=>page.locator('.archive-art').evaluate((svg,i)=>{
  const point=svg.createSVGPoint();point.x=155+(i+.5)*1131/7;point.y=540;
  const screen=point.matrixTransform(svg.getScreenCTM());return{x:screen.x,y:screen.y};
 },index);
 const dragTo=async(page,id,point)=>{
  const box=await page.locator(`.tape-${id}`).boundingBox();
  await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();
  await page.mouse.move(point.x,point.y,{steps:20});await page.mouse.up();await page.waitForTimeout(100);
 };
 try{
  const page=await browser.newPage({viewport:{width:1440,height:960},reducedMotion:'reduce'});
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('.archive-art [data-layer="floor"] > svg').count(),7);
  assert.equal(await page.locator('.archive-art [data-divider]').count(),6);
  assert.equal(await page.locator('.tape').count(),5);
  const chosenSlots=[0,2,3,4,6];
  for(let i=0;i<ids.length;i++){
   await dragTo(page,ids[i],await slotPoint(page,chosenSlots[i]));
   assert.equal(await page.locator(`[data-stored-id="${ids[i]}"]`).getAttribute('data-slot'),String(chosenSlots[i]));
   await inventory(page);
  }
  assert.equal(await page.locator('.tape').count(),0);
  assert.equal(await page.locator('.archive-art [data-stored-id]').count(),5);
  assert.equal(await page.locator('dialog[open]').count(),0);
  await page.mouse.move(0,0);
  await page.screenshot({path:path.join(out,'portfolio-seven-slot-stored.png')});
  await page.locator('.archive-art').evaluate(svg=>{
   const panel=document.createElement('div');panel.id='archive-inspect';
   Object.assign(panel.style,{position:'fixed',left:'0',top:'0',width:'850px',height:'623px',zIndex:'10000',background:'#f7f3ee'});
   panel.appendChild(svg.cloneNode(true));document.body.appendChild(panel);
  });
  await page.locator('#archive-inspect').screenshot({path:path.join(out,'archive-seven-five-stored.png')});
  await page.locator('#archive-inspect').evaluate(e=>e.remove());
  checks.push('seven cells and six physical dividers','five tapes dragged into selected rotated slots','no duplicate tape locations','two empty cells remain');
  await page.getByRole('button',{name:'보관함 목록 열기',exact:true}).click();
  const dialog=page.locator('dialog[open]');
  assert.equal(await dialog.locator('.collection button').count(),5);
  await page.getByRole('button',{name:'닫기',exact:true}).click();
  await page.getByRole('button',{name:'01 ABOUT ME 테이프 꺼내기',exact:true}).click();
  assert.equal(await page.locator('.tape-about').count(),1);await inventory(page);
  const player=await page.locator('.player').boundingBox();
  await dragTo(page,'about',{x:player.x+player.width*.45,y:player.y+player.height*.5});
  await inventory(page);
  await page.getByRole('button',{name:'재생',exact:true}).click();assert.equal(await page.locator('dialog[open]').count(),1);
  await page.keyboard.press('Escape');await page.getByRole('button',{name:'꺼내기 ⏏',exact:true}).click();
  await dragTo(page,'about',await slotPoint(page,0));await inventory(page);
  checks.push('direct slot takeout','takeout then drag to player and play','eject then return to storage');
  await page.getByRole('button',{name:'배치 초기화 ↺',exact:true}).click();
  assert.equal(await page.locator('.tape').count(),5);assert.equal(await page.locator('[data-stored-id]').count(),0);await inventory(page);
  await dragTo(page,'about',await slotPoint(page,0));await dragTo(page,'team',await slotPoint(page,0));
  assert.equal(await page.locator('[data-stored-id="about"]').getAttribute('data-slot'),'0');
  assert.equal(await page.locator('[data-stored-id="team"]').getAttribute('data-slot'),'1');
  await inventory(page);checks.push('reset restores desk tapes','occupied-slot drop uses free cell without overwriting');
  const mobile=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  mobile.on('pageerror',e=>errors.push(e.message));
  await mobile.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
  await mobile.getByRole('button',{name:'보관함 목록 열기',exact:true}).click();
  for(const name of names){await mobile.getByRole('button',{name:`${name} 보관함에 넣기`,exact:true}).click();await inventory(mobile)}
  assert.equal(await mobile.locator('dialog[open] .collection button').count(),5);
  await mobile.getByRole('button',{name:'닫기',exact:true}).click();
  await mobile.locator('.archive').screenshot({path:path.join(out,'archive-seven-mobile.png')});
  await mobile.getByRole('button',{name:'재생',exact:true}).click();await mobile.keyboard.press('Escape');await inventory(mobile);
  await mobile.getByRole('button',{name:'보관함 목록 열기',exact:true}).click();
  await mobile.getByRole('button',{name:'01 ABOUT ME 보관함에 넣기',exact:true}).click();
  assert.equal(await mobile.locator('.player [data-part="cassette-surface"]').count(),0);
  assert.equal(await mobile.locator('.player').getAttribute('data-state'),'stopped');await inventory(mobile);
  await mobile.locator('dialog[open]').getByRole('button',{name:'01 ABOUT ME 테이프 꺼내기',exact:true}).click();await inventory(mobile);
  await mobile.locator('.tape-about').click();await inventory(mobile);
  assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  checks.push('mobile menu stores all five without closing repeatedly','default play takes a stored tape','loaded tape can return directly to storage','mobile takeout and playback','no mobile horizontal overflow');
  assert.deepEqual(errors,[]);
  const report={passed:true,capacity:7,checks,chosenSlots,errors};
  fs.writeFileSync(path.join(out,'storage-qa.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
