const {chromium}=require('C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs=require('node:fs'),assert=require('node:assert/strict')
;(async()=>{
 const out='C:/bin/portfolio/docs/design-v56';fs.mkdirSync(out,{recursive:true})
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true})
 const results=[]
 try {
  for(const [name,width,height] of [['desktop',1440,1000],['laptop',1280,720],['mobile',390,844]]){
   const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message))
   await page.goto('http://127.0.0.1:5173/')
   assert.equal(await page.locator('.archive-art').getAttribute('viewBox'),'80 87 975 1313')
   await page.getByRole('button',{name:'재생',exact:true}).click()
   await page.locator('.story-reader').waitFor()
   if(width<761)await page.locator('.reader-shelf-toggle').click()
   const shelf=page.locator('.reader-shelf'),art=page.locator('.reader-shelf-art')
   await shelf.scrollIntoViewIfNeeded()
   assert.equal(await art.locator('svg.archive-art').getAttribute('viewBox'),'87 80 1265 975')
   const cases=await page.locator('.reader-case').evaluateAll(nodes=>nodes.map(n=>({slot:+n.dataset.slot,x:n.getBoundingClientRect().x,y:n.getBoundingClientRect().y,width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height})))
   assert.deepEqual(cases.map(c=>c.slot),[0,1,2,3,4]);assert.ok(cases.every((c,i)=>c.height>c.width*3&&(i===0||c.x>cases[i-1].x)))
   assert.equal(await art.locator('[data-layer="case-number-labels"] text').count(),5)
   assert.equal(await page.locator('.reader-case[data-slot="0"]').isDisabled(),true)
   await page.mouse.move(0,0)
   await page.screenshot({path:`${out}/reader-${name}.png`})
   await art.screenshot({path:`${out}/shelf-${name}.png`})
   const size=await art.boundingBox();assert.ok(size.width>250)
   await page.locator('.reader-case[data-slot="2"]').click()
   assert.equal(await page.locator('.reader-case[data-slot="2"]').isDisabled(),true)
   assert.equal(await page.locator('.reader-case[data-slot="0"]').isDisabled(),false)
   if(width>760){
    await page.locator('.reader-player').scrollIntoViewIfNeeded()
    const source=await page.locator('.reader-case[data-slot="1"]').boundingBox(),player=await page.locator('.reader-player').boundingBox()
    await page.mouse.move(source.x+source.width/2,Math.min(height-8,source.y+source.height/3));await page.mouse.down()
    await page.mouse.move(player.x+player.width/2,player.y+player.height/2,{steps:18})
    assert.equal(await page.locator('.reader-player.is-drop-target').count(),1)
    await page.mouse.up()
    assert.equal(await page.locator('.reader-case[data-slot="1"]').isDisabled(),true)
   }
   assert.deepEqual(errors,[])
   results.push({name,size,columns:cases.map(c=>c.slot),clickSwap:true,dragSwap:width>760,errors})
   await page.close()
  }
  fs.writeFileSync(out+'/qa.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2))
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1})
