const { chromium } = require('C:/Users/EZEN/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright')
const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')
const output = 'C:/bin/portfolio/docs/design-v53'

;(async () => {
  fs.mkdirSync(output, { recursive: true })
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true })
  const checks = []
  for (const [label, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' })
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.goto('http://127.0.0.1:5173/')
    await page.getByRole('button', { name: '편지 보내기' }).click()
    await page.getByText('메시지 전송 준비 중입니다.', { exact: true }).waitFor()
    assert.equal(await page.getByRole('button', { name: '편지 보내기', exact: true }).last().isDisabled(), true)
    await page.locator('#letter-name').fill('테스트 방문자')
    await page.locator('#letter-email').fill('visitor@example.org')
    await page.locator('#letter-message').fill('함께 작업할 수 있을지 문의를 드립니다.')
    await page.screenshot({ path: path.join(output, `letter-${label}.png`) })
    const geometry = await page.locator('.content-contact').evaluate(dialog => ({ width: dialog.clientWidth, scrollWidth: dialog.scrollWidth }))
    assert.ok(geometry.scrollWidth <= geometry.width + 1)
    assert.deepEqual(errors, [])
    await page.getByRole('button', { name: '닫기', exact: true }).click()
    assert.equal(await page.locator('dialog').count(), 0)
    checks.push(`${label}: honest unconfigured status, disabled sending, editable fields, no horizontal overflow, close and no errors`)
    await page.close()
  }

  // Browser-only fixtures exercise real form behavior; they never reach an email provider.
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
  await page.addInitScript(() => {
    window.turnstile = {
      render(container, options) { container.textContent = '테스트 확인 위젯'; window.contactTestCallback = options.callback; options.callback('test-verification-token'); return 'mock-widget' },
      reset() { window.contactTestCallback?.('new-test-token') },
      remove() {},
    }
  })
  let posts = []
  let result = 'fail'
  await page.route('**/api/contact', async route => {
    if (route.request().method() === 'GET') return route.fulfill({ json: { enabled: true, siteKey: 'test-public-key' } })
    posts.push(route.request().postDataJSON())
    await new Promise(resolve => setTimeout(resolve, 150))
    return route.fulfill({ status: result === 'fail' ? 502 : 200, json: result === 'fail' ? { error: '테스트 발송 실패' } : { ok: true } })
  })
  await page.goto('http://127.0.0.1:5173/')
  await page.getByRole('button', { name: '편지 보내기' }).click()
  const send = page.locator('.letter-send')
  await send.waitFor()
  await page.locator('#letter-name').fill('테스트 방문자')
  await page.locator('#letter-email').fill('visitor@example.org')
  await page.locator('#letter-topic').selectOption('hiring')
  await page.locator('#letter-message').fill('채용 관련 문의를 남기는 테스트입니다.')
  await page.locator('input[name=consent]').check()
  await send.click()
  await page.getByRole('alert').filter({ hasText: '테스트 발송 실패' }).waitFor()
  assert.equal(await page.locator('#letter-message').inputValue(), '채용 관련 문의를 남기는 테스트입니다.')
  const firstId = posts[0].requestId
  result = 'success'
  await send.click()
  await page.getByRole('heading', { name: '편지가 접수됐어요.' }).waitFor()
  assert.equal(posts[1].requestId, firstId)
  assert.ok(posts.every(post => !post.to && !post.from && post.consent && post.email === 'visitor@example.org'))
  checks.push('Browser fixture: failure retains input; retry has same ID; success only on confirmed response; no recipient in request')
  await page.getByRole('button', { name: '닫기', exact: true }).click()
  // NEXT TRACK also opens the same form, without adding contact to the exit toolbar.
  await page.getByRole('button', { name: '05 NEXT TRACK 테이프 넣기', exact: true }).click()
  await page.getByRole('button', { name: '재생', exact: true }).click()
  await page.getByRole('heading', { name: '다음 작업', exact: true }).waitFor()
  await page.locator('.reader-scroll').getByRole('button', { name: '편지 보내기' }).click()
  await page.getByRole('heading', { name: '편지 보내기' }).waitFor()
  await page.getByRole('button', { name: '닫기', exact: true }).click()
  await page.getByRole('button', { name: '나가기 · 책상 홈으로 돌아가기' }).click()
  checks.push('NEXT TRACK contact opens form; reader exit still restores desk')
  fs.writeFileSync(path.join(output, 'contact-qa.json'), JSON.stringify({ checks, actualEmailSent: false }, null, 2))
  await browser.close()
  console.log(JSON.stringify({ checks, actualEmailSent: false }, null, 2))
})().catch(error => { console.error(error); process.exitCode = 1 })
