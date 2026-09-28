const {chromium}=require('C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs');
const out='C:/bin/portfolio/docs/design-v50/';
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const report=[];const errors=[];
 try{
  for(const viewport of [{width:1440,height:960},{width:390,height:844}]){
   const page=await browser.newPage({viewport,reducedMotion:'reduce'});
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:5173/',{waitUntil:'networkidle'});
   await page.evaluate(()=>document.fonts.ready);
   const size=viewport.width>760?'desktop':'mobile';
   const dialog=page.locator('dialog[open]');
   async function check(name){
    const state=await page.evaluate(()=>{
     const d=document.querySelector('dialog[open]');
     return {title:d?.querySelector('h2')?.textContent,overflow:d?d.scrollWidth>d.clientWidth:document.documentElement.scrollWidth>innerWidth,
      fontLoaded:[...document.fonts].some(f=>f.family==='Pretendard Variable'&&f.status==='loaded'),
      wrongFonts:[...(d||document).querySelectorAll('h1,h2,h3,p,button,span,a,svg text')].filter(e=>!getComputedStyle(e).fontFamily.includes('Pretendard Variable')).length};
    });
    if(state.overflow||!state.fontLoaded||state.wrongFonts)throw new Error(name+JSON.stringify(state));
    report.push({size,name,...state});
   }
   async function close(){await dialog.getByRole('button',{name:'닫기',exact:true}).click();await dialog.waitFor({state:'hidden'});}
   await check('main');await page.screenshot({path:out+size+'.png',fullPage:viewport.width<760});
   await page.locator('.notebook').click();await check('notes');
   if(await dialog.locator('.work-entries article').count()!==4)throw new Error('Missing project entries');
   await dialog.screenshot({path:out+'notes-'+size+'.png'});
   await dialog.getByRole('button',{name:'프로젝트 보기'}).first().click();await check('note-project');
   await dialog.getByRole('button',{name:'← 작업 기록'}).click();await check('notes-return');await close();
   await page.locator('.memo').click();await check('memo');
   if(await dialog.locator('.work-checklist>li').count()!==3)throw new Error('Missing tasks');
   await dialog.screenshot({path:out+'memo-'+size+'.png'});await close();
   for(const [id,title] of [['about','ABOUT ME'],['team','TEAM PLAY'],['design','DESIGN'],['branding','BRANDING'],['next','NEXT TRACK']]){
    await page.locator('.tape-'+id).click();await page.getByRole('button',{name:'재생',exact:true}).click();await check(id);
    if(id==='about'||id==='team'||id==='design')await dialog.screenshot({path:out+id+'-'+size+'.png'});
    if(id==='team'||id==='design'){
     const count=await dialog.locator('.project-list>button').count();
     if(count!==2)throw new Error('Project count');
     for(let i=0;i<count;i++){
      await dialog.locator('.project-list>button').nth(i).click();await check(id+'-project-'+i);
      if(id==='team'&&i===1)await dialog.screenshot({path:out+'project-'+size+'.png'});
      await dialog.locator('.dialog-back').click();await check(id+'-back-'+i);
     }
    }
    await close();await page.getByRole('button',{name:'꺼내기 ⏏',exact:true}).click();
   }
   await page.locator('.contact-button').click();await check('contact');
   if(await dialog.locator('a[href="mailto:jcb0629@gmail.com"]').count()!==1)throw new Error('Contact');
   await page.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});
   await page.locator('.archive-caption').click();await check('archive');
   await dialog.getByRole('button',{name:'01 ABOUT ME 보관함에 넣기',exact:true}).click();await check('archive-store');
   if(await dialog.getByRole('button',{name:'01 ABOUT ME 테이프 꺼내기',exact:true}).count()!==1)throw new Error('Store');
   await dialog.getByRole('button',{name:'01 ABOUT ME 테이프 꺼내기',exact:true}).click();await dialog.waitFor({state:'hidden'});
   if(await page.locator('.tape-about').count()!==1)throw new Error('Take');
   await page.locator('.notebook').click();await page.keyboard.press('Escape');
   if(!await page.locator('.notebook').evaluate(e=>e===document.activeElement))throw new Error('Focus not restored');
   await page.close();
  }
  if(errors.length)throw new Error(errors.join('\n'));
  fs.writeFileSync(out+'qa.json',JSON.stringify({report,errors},null,2));
  console.log(JSON.stringify({screens:report.length,viewports:2,errors,checks:'All sections, four projects, back navigation, notes, tasks, email, archive store/take, Escape and focus passed.'}));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
