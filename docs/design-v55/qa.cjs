const {chromium}=require('C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs=require('node:fs'),assert=require('node:assert/strict')
;(async()=>{
 const out='C:/bin/portfolio/docs/design-v55';fs.mkdirSync(out,{recursive:true})
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
 const checks=[]
 try{
  for(const [name,width,height] of [['desktop',1440,960],['laptop',1280,720],['mobile',390,844]]){
   const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message))
   await page.goto('http://127.0.0.1:5173/')
   await page.getByRole('button',{name:'보관함 목록 열기'}).click()
   for(const title of ['01 ABOUT ME','02 TEAM PLAY','03 DESIGN','04 BRANDING','05 NEXT TRACK'])await page.getByRole('button',{name:`${title} 보관함에 넣기`,exact:true}).click()
   await page.keyboard.press('Escape')
   await page.locator('.archive').scrollIntoViewIfNeeded()
   await page.mouse.move(0,0)
   await page.screenshot({path:`${out}/desk-${name}.png`})
   await page.locator('.archive').screenshot({path:`${out}/archive-${name}.png`})
   const rows=await page.locator('.archive-slot').evaluateAll(nodes=>nodes.map(e=>({slot:+e.dataset.slot,x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y,width:e.getBoundingClientRect().width,height:e.getBoundingClientRect().height})))
   assert.equal(rows.length,5);assert.ok(rows.every((r,i)=>r.width>r.height*3&&(i===0||r.y>rows[i-1].y)))
   if(width>760){
    // A real desktop drag into the sixth row must highlight and commit that row.
    await page.locator('.archive-slot[data-slot="0"]').click()
    const tape=page.locator('.tape-about'),source=await tape.boundingBox()
    const destination=await page.locator('.archive-art').evaluate(svg=>{const p=svg.createSVGPoint();p.x=544;p.y=153+1131/7*5.5;const q=p.matrixTransform(svg.getScreenCTM());return{x:q.x,y:q.y}})
    await page.mouse.move(source.x+source.width/2,source.y+source.height/2);await page.mouse.down()
    await page.mouse.move(destination.x,destination.y,{steps:20})
    assert.equal(await page.locator('.archive').getAttribute('data-preview-slot'),'5')
    assert.equal(await page.locator('.archive [data-part="storage-silhouette"]').getAttribute('data-slot'),'5')
    await page.mouse.up()
    assert.equal(await page.locator('.archive [data-stored-id="about"]').getAttribute('data-slot'),'5')
    assert.equal(await page.locator('.tape-about').count(),0)
    // Drag out of a horizontal case into the player.
    const box=await page.locator('.archive-slot[data-slot="5"]').boundingBox(),player=await page.locator('.player').boundingBox()
    await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down()
    await page.mouse.move(player.x+player.width/2,player.y+player.height/2,{steps:18});await page.mouse.up()
    assert.equal(await page.locator('.player').getAttribute('data-state'),'stopped')
    assert.equal(await page.locator('.archive [data-stored-id="about"]').count(),0)
   } else {
    await page.locator('.archive-slot[data-slot="0"]').click();await page.locator('.tape-about').click()
   }
   await page.getByRole('button',{name:'재생',exact:true}).click()
   await page.locator('.story-reader').waitFor()
   if(width<761)await page.locator('.reader-shelf-toggle').click()
   await page.locator('.reader-shelf').scrollIntoViewIfNeeded()
   await page.screenshot({path:`${out}/reader-${name}.png`})
   const cases=await page.locator('.reader-case').evaluateAll(nodes=>nodes.map(n=>({slot:+n.dataset.slot,disabled:n.disabled,y:n.getBoundingClientRect().y})))
   assert.deepEqual(cases.map(c=>c.slot),[0,1,2,3,4]);assert.ok(cases[0].disabled);assert.ok(cases.every((r,i)=>i===0||r.y>cases[i-1].y))
   await page.locator('.reader-case[data-slot="2"]').click()
   assert.equal(await page.locator('.reader-case[data-slot="2"]').isDisabled(),true)
   assert.equal(await page.locator('.reader-case[data-slot="0"]').isDisabled(),false)
   assert.deepEqual(errors,[])
   checks.push({name,rows,readingSwap:true,errors})
   await page.close()
  }
  fs.writeFileSync(out+'/qa.json',JSON.stringify(checks,null,2));console.log(JSON.stringify(checks,null,2))
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1})
