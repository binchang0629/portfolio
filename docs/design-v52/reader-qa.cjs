const {chromium}=require('C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');const assert=require('node:assert/strict');
const out='C:/bin/portfolio/docs/design-v52/';
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});const report=[],errors=[];
 try{
 for(const [name,viewport,reducedMotion] of [['desktop',{width:1440,height:960},'no-preference'],['laptop',{width:1280,height:720},'reduce'],['mobile',{width:390,height:844},'reduce']]){
  const page=await browser.newPage({viewport,reducedMotion});page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
  await page.locator('.tape-team').click();await page.getByRole('button',{name:'재생',exact:true}).click();
  const reader=page.locator('.story-reader');await reader.waitFor();await page.waitForTimeout(750);
  assert.equal(await page.locator('dialog[open]').count(),0,'Reading should be a page, not a modal');
  async function shelf(expected){
   const actual=await reader.locator('.reader-case').evaluateAll(nodes=>nodes.map(node=>({slot:Number(node.dataset.slot),name:node.getAttribute('aria-label'),disabled:node.disabled})));
   assert.deepEqual(actual.map(item=>item.slot),[0,1,2,3,4]);assert.equal(actual.filter(item=>item.disabled).length,1);
   assert.ok(actual[expected].disabled);
   const occupied=await reader.locator('.reader-shelf-art [data-part="paper-insert"]').count();
   const empty=await reader.locator('.reader-shelf-art').getByText('EMPTY',{exact:true}).count();
   assert.equal(empty,1,'Only loaded tape has an empty case');return {actual,occupied,empty};
  }
  const first=await shelf(1);
  assert.ok((await reader.locator('h2').textContent()).includes('팀 프로젝트'));
  await reader.locator('.project-list>button').nth(1).click();await page.waitForTimeout(350);
  const pane=reader.locator('.reader-scroll');
  const before=await reader.locator('[data-part="reel-left"] [data-part="pack-surface"]').getAttribute('r');
  await pane.evaluate(element=>element.scrollTo({top:element.scrollHeight,behavior:'instant'}));await page.waitForTimeout(250);
  assert.equal(await reader.getByRole('progressbar').getAttribute('aria-valuenow'),'100');
  const after=await reader.locator('[data-part="reel-left"] [data-part="pack-surface"]').getAttribute('r');
  assert.notEqual(before,after,'Scrolling should wind the reel');
  await page.screenshot({path:out+name+'-project.png'});
  await reader.locator('.reader-toolbar>button').first().click();await page.waitForTimeout(350);
  assert.ok((await reader.locator('h2').textContent()).includes('팀 프로젝트'));
  if(viewport.width<761)await reader.locator('.reader-shelf-toggle').click();
  const source=reader.locator('.reader-case[data-slot="2"]');const sourceBox=await source.boundingBox(),playerBox=await reader.locator('.reader-player').boundingBox();
  await page.mouse.move(sourceBox.x+sourceBox.width/2,sourceBox.y+sourceBox.height/2);await page.mouse.down();
  await page.mouse.move(playerBox.x+playerBox.width/2,playerBox.y+playerBox.height/2,{steps:18});
  assert.equal(await reader.locator('.reader-player.is-drop-target').count(),1);
  assert.equal(await reader.locator('.reader-held-tape').count(),1);
  await page.screenshot({path:out+name+'-drag.png'});await page.mouse.up();await page.waitForTimeout(400);
  const swap=await shelf(2);assert.ok((await reader.locator('h2').textContent()).includes('개인 프로젝트'));
  if(viewport.width<761)await reader.locator('.reader-shelf-toggle').click();
  await reader.locator('.reader-case[data-slot="0"]').click();await page.waitForTimeout(400);await shelf(0);
  const previous=reader.locator('.reader-transport button').first();assert.ok(await previous.isDisabled());
  await reader.locator('.reader-transport button').nth(2).click();await page.waitForTimeout(350);await shelf(1);
  await reader.locator('.reader-transport button').nth(1).click();assert.equal(await reader.locator('.reader-player').getAttribute('data-state'),'stopped');
  await reader.locator('.reader-transport button').nth(1).click();assert.equal(await reader.locator('.reader-player').getAttribute('data-state'),'playing');
  if(viewport.width<761)await reader.locator('.reader-shelf-toggle').click();
  const cancelSource=reader.locator('.reader-case[data-slot="3"]'),cancelBox=await cancelSource.boundingBox();
  await page.mouse.move(cancelBox.x+cancelBox.width/2,cancelBox.y+cancelBox.height/2);await page.mouse.down();await page.mouse.move(viewport.width-10,viewport.height-10,{steps:12});await page.mouse.up();await page.waitForTimeout(200);
  await shelf(1);assert.equal(await reader.locator('.reader-held-tape').count(),0);
  const inspect=await reader.evaluate(element=>({overflow:element.scrollWidth>element.clientWidth,sidebarOverflow:element.querySelector('.reader-sidebar').scrollHeight>element.querySelector('.reader-sidebar').clientHeight,bodyOverflow:document.documentElement.scrollWidth>innerWidth,font:getComputedStyle(element).fontFamily}));
  assert.equal(inspect.overflow,false);assert.equal(inspect.bodyOverflow,false);assert.ok(inspect.font.includes('Pretendard Variable'));
  await page.screenshot({path:out+name+'.png'});
  await reader.getByRole('button',{name:'연락 ↗',exact:true}).click();await page.locator('dialog[open]').waitFor();await page.keyboard.press('Escape');await page.locator('dialog[open]').waitFor({state:'hidden'});assert.equal(await reader.count(),1);
  await reader.locator('.reader-return').click();await reader.waitFor({state:'hidden'});await page.waitForTimeout(700);
  assert.equal(await page.locator('.tape-stage>.tape').count(),5,'All five tapes restored after ejecting');
  await page.locator('.notebook').click();await page.locator('dialog[open]').waitFor();await page.keyboard.press('Escape');
  await page.locator('.archive-caption').click();await page.locator('dialog[open]').getByRole('button',{name:'01 ABOUT ME 보관함에 넣기',exact:true}).click();await page.keyboard.press('Escape');
  assert.equal(await page.locator('.tape-about').count(),0);await page.locator('.archive-slot').click();assert.equal(await page.locator('.tape-about').count(),1);
  report.push({name,viewport,reducedMotion,first,swap,before,after,inspect});await page.close();
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(out+'qa.json',JSON.stringify({report,errors},null,2));console.log(JSON.stringify({viewports:3,errors,checks:'Reader, reel scroll, fixed shelf order, drag swap, click swap, cancellation, previous/next/pause, contact/Escape, desk return and original storage passed.'}));
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exit(1)});
