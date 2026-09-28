const { chromium } = require('C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
  const errors = [], failed = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('requestfailed', r => failed.push(r.url()));
  page.on('response', r => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.resolve('output/portfolio-refined-v29-desktop.png'), fullPage: true });
  await page.locator('.tape-about .tape-orientation').screenshot({ path: path.resolve('output/portfolio-v29-cassette-detail.png') });
  await page.locator('.archive').screenshot({ path: path.resolve('output/portfolio-v29-tray-detail.png') });
  const commonCamera = await page.locator('.tape .cassette-art').evaluateAll(tapes => tapes.map(tape => ({
    camera: tape.dataset.camera, viewBox: tape.getAttribute('viewBox'),
    source: tape.querySelector('[data-part="shell"]').getAttribute('href'),
    hubSources: [...tape.querySelectorAll('[data-part="hub"] image')].map(image => image.getAttribute('href')),
    hubRadius: tape.querySelector('clipPath[id$="left-hub"] circle').getAttribute('r'),
  })));
  assert.ok(commonCamera.every(tape => tape.camera === 'orthographic-topview-v1' && tape.viewBox === '36 48 1464 884' && tape.source === '/assets/cassette/topview/clean-v1.png' && tape.hubRadius === '109'), 'All tapes share one overhead camera and circular hub mask');
  assert.deepEqual(await page.locator('.archive [data-layer]').evaluateAll(layers => layers.map(layer => layer.dataset.layer)), ['floor','stored-tapes','inner-shadow','rim','dividers'], 'Archive has independent inner shade, rim and future tape layers');
  assert.equal(await page.locator('.archive [data-layer="stored-tapes"] g').count(), 0, 'Empty archive does not invent projects');
  const noteOverlap = await page.evaluate(() => {
    const a=document.querySelector('.notebook .object-eyebrow').getBoundingClientRect();
    const b=document.querySelector('.contact-button').getBoundingClientRect();
    return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  });
  assert.equal(noteOverlap, false, 'Notebook label does not overlap contact link');
  const tape = name => page.getByRole('button', { name, exact: true });
  assert.equal(await page.locator('.tape').count(), 5);
  const geometry = await page.evaluate(() => ({
    tape: document.querySelector('.tape').getBoundingClientRect().toJSON(),
    player: document.querySelector('.player').getBoundingClientRect().toJSON(),
    width: document.documentElement.scrollWidth,
  }));
  const about = tape('01 ABOUT ME 테이프 넣기');
  let box = await about.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 - 90, box.y + box.height / 2 + 65, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(80);
  assert.equal(await page.locator('.tape').count(), 5, 'Outside drop must not insert');
  const changed = await about.boundingBox();
  assert.ok(changed.x < box.x - 50, 'Free movement should persist');
  const player = await page.locator('.player').boundingBox();
  await page.mouse.move(changed.x + changed.width / 2, changed.y + changed.height / 2);
  await page.mouse.down();
  await page.mouse.move(player.x + player.width / 2, player.y + player.height / 2, { steps: 18 });
  await page.mouse.up();
  await page.waitForTimeout(100);
  assert.equal(await page.locator('.tape').count(), 4, 'Inserted tape must disappear');
  const matchedScale = await page.evaluate(() => {
    const inside=document.querySelector('.player [data-part="cassette-surface"]').getScreenCTM();
    const desk=document.querySelector('.tape [data-part="cassette-surface"]').getScreenCTM();
    const scale = m => Math.hypot(m.a,m.b);
    return { ratio: scale(inside)/scale(desk), insideAnisotropy: Math.hypot(inside.c,inside.d)/scale(inside), deskAnisotropy: Math.hypot(desk.c,desk.d)/scale(desk) };
  });
  assert.ok(Math.abs(matchedScale.ratio-1)<.02, 'Inserted tape has the same apparent physical scale as desk tape');
  assert.ok(Math.abs(matchedScale.insideAnisotropy-1)<.001 && Math.abs(matchedScale.deskAnisotropy-1)<.001, 'No stretched tape or elliptical hub');
  assert.equal(await page.locator('.integrated-player').count(), 1, 'One coherent player render');
  assert.equal(await page.locator('.inserted-tape').count(), 0, 'No warped pasted cassette');
  assert.equal(await page.locator('.transport-controls svg').count(), 0, 'No flat control icons');
  const transparentControls = await page.locator('.transport-controls button').evaluateAll(buttons => buttons.every(button => getComputedStyle(button).backgroundColor === 'rgba(0, 0, 0, 0)'));
  assert.ok(transparentControls, 'Click regions retain rendered mechanical keys');
  const reelSources = await page.locator('.player [data-part="hub"] image').evaluateAll(images => images.map(image => image.getAttribute('href')));
  assert.deepEqual(reelSources, ['/assets/cassette/topview/render-v1.png', '/assets/cassette/topview/render-v1.png'], 'Hubs are photographic parts of the same render');
  const spindleOffsets = await page.locator('.player').evaluate(player => {
    const box = player.getBoundingClientRect();
    return [...player.querySelectorAll('[data-part^="reel-"]')].map((reel, i) => {
      const matrix = reel.getScreenCTM();
      const expectedX = box.x + ([513, 905][i] - 70) / 1380 * box.width;
      const expectedY = box.y + (520 - 75) / 880 * box.height;
      return { x: Math.abs(matrix.e - expectedX), y: Math.abs(matrix.f - expectedY) };
    });
  });
  assert.ok(spindleOffsets.every(offset => offset.x < 1 && offset.y < 1), 'Rendered hub positions preserved');
  await page.screenshot({ path: path.resolve('output/portfolio-refined-v29-loaded.png'), fullPage: true });
  await page.locator('.player').screenshot({ path: path.resolve('output/portfolio-v29-front-player.png') });
  await page.getByRole('button', { name: '재생', exact: true }).click();
  await page.locator('dialog[open]').waitFor();
  assert.match(await page.locator('dialog h2').innerText(), /디자이너/);
  await page.keyboard.press('Escape');
  await page.locator('dialog').waitFor({ state: 'detached' });
  await page.getByRole('button', { name: '정지', exact: true }).click();
  const winding = () => page.locator('.integrated-player [data-part="reel-left"] [data-part="pack-surface"]').getAttribute('r');
  const stopped = await winding();
  await page.waitForTimeout(100);
  assert.equal(await winding(), stopped, 'Stop freezes winding');
  await page.getByRole('button', { name: '되감기', exact: true }).click();
  await page.waitForTimeout(300);
  assert.ok(Number(await winding()) > Number(stopped), 'Rewind transfers tape to the left pack');
  await page.getByRole('button', { name: '빨리 감기', exact: true }).click();
  const beforeForward = Number(await winding());
  await page.waitForTimeout(300);
  assert.ok(Number(await winding()) < beforeForward, 'Forward transfers tape to the right pack');
  await page.getByRole('button', { name: '꺼내기 ⏏', exact: true }).click();
  assert.equal(await page.locator('.tape').count(), 5);
  await tape('02 TEAM PLAY 테이프 넣기').click();
  await page.getByRole('button', { name: '재생', exact: true }).click();
  assert.equal(await page.locator('.project-grid button').count(), 2);
  await page.locator('.project-grid button').filter({ hasText: '왈가왈BOT' }).click();
  assert.match(await page.locator('dialog').innerText(), /개발 팀장/);
  assert.match(await page.locator('dialog').innerText(), /홈·배심원 광장·후일담/);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /MORE TAPES/ }).click();
  assert.match(await page.locator('dialog').innerText(), /추가 작업을 준비/);
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /배치 초기화/ }).click();
  assert.equal(await page.locator('.tape').count(), 5);
  const archivePage = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  archivePage.on('pageerror', e => errors.push(e.message));
  // This fixture exists only in an intercepted test response, never in public content.
  await archivePage.route('**/src/data/portfolio.js*', async route => {
    const response = await route.fetch();
    const source = await response.text();
    const pattern = /export const archiveTracks\s*=\s*\[\s*\];?/;
    assert.ok(pattern.test(source), 'Test fixture can replace only the empty archive list');
    const body = source.replace(pattern, 'export const archiveTracks = [{ ...tracks[0], id: "archive-qa", number: "06", title: "ARCHIVE QA", subtitle: "Test fixture.", x:410, y:150, winding:.9599 }];');
    await route.fulfill({ response, body });
  });
  await archivePage.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  await archivePage.getByRole('button', { name: /MORE TAPES/ }).click();
  await archivePage.locator('.collection button').click();
  assert.equal(await archivePage.locator('.tape').count(), 6, 'Archive tape can be taken onto desk');
  await archivePage.getByRole('button', { name: '06 ARCHIVE QA 테이프 넣기', exact: true }).click();
  assert.equal(await archivePage.locator('.tape').count(), 5, 'Archive tape disappears on insertion');
  await archivePage.getByRole('button', { name: '재생', exact: true }).click();
  await archivePage.keyboard.press('Escape');
  await archivePage.waitForTimeout(200);
  assert.equal(await archivePage.locator('.player').getAttribute('data-state'), 'stopped', 'Tape stops automatically at end');
  await archivePage.getByRole('button', { name: '01 ABOUT ME 테이프 넣기', exact: true }).click();
  assert.equal(await archivePage.locator('.tape').count(), 4, 'Replaced archive tape returns to box');
  await archivePage.getByRole('button', { name: /MORE TAPES/ }).click();
  assert.equal(await archivePage.locator('.collection button').count(), 1, 'Returned tape appears in archive');
  await archivePage.keyboard.press('Escape');
  await archivePage.getByRole('button', { name: /MORE TAPES/ }).click();
  await archivePage.locator('.collection button').click();
  await archivePage.getByRole('button', { name: '06 ARCHIVE QA 테이프 넣기', exact: true }).click();
  await archivePage.getByRole('button', { name: '꺼내기 ⏏', exact: true }).click();
  assert.equal(await archivePage.locator('.tape').count(), 5, 'Ejected archive tape returns to box');
  await archivePage.close();
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  mobile.on('pageerror', e => errors.push(e.message));
  await mobile.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
  assert.equal(await mobile.locator('.tape').count(), 5);
  assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), 'No mobile horizontal overflow');
  await mobile.screenshot({ path: path.resolve('output/portfolio-refined-v29-mobile.png'), fullPage: true });
  await mobile.getByRole('button', { name: '03 DESIGN 테이프 넣기', exact: true }).click();
  await mobile.locator('.player').screenshot({ path: path.resolve('output/portfolio-v29-mobile-loaded.png') });
  await mobile.getByRole('button', { name: '재생', exact: true }).click();
  assert.match(await mobile.locator('dialog').innerText(), /코레일/);
  assert.match(await mobile.locator('dialog').innerText(), /반려식물/);
  assert.deepEqual(errors, []);
  assert.deepEqual(failed, []);
  const report = { passed: true, desktopGeometry: geometry, spindleOffsets, commonCamera, matchedScale, checks: ['shared orthographic tape camera', 'uniform scale in player', 'no stretched hubs', 'source hub excluded from winding texture', 'independent tray layers', 'top-rim label', 'notebook/contact separation', 'free drag', 'player drop', 'inserted tape removed', 'coherent product render', 'photographic hubs', 'rendered spindle alignment', 'no warped cassette', 'transparent mechanical-key hit areas', 'play story', 'escape dialog', 'stop', 'rewind', 'forward', 'eject', 'team project roles', 'archive empty state', 'archive take and load', 'archive replacement and return', 'archive eject and return', 'automatic stop at end', 'reset', 'mobile no overflow', 'personal project content'], errors, failed };
  fs.writeFileSync(path.resolve('output/refinement-v29-qa.json'), JSON.stringify(report, null, 2));
  process.stdout.write(JSON.stringify(report));
  await browser.close();
})().catch(e => { process.stderr.write(e.stack); process.exit(1); });


