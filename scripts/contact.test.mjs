import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Readable } from 'node:stream'
import { createContactHandler } from '../api/contact.js'

const env = {
  RESEND_API_KEY: 'test-private-key', CONTACT_TO_EMAIL: 'owner@example.com', CONTACT_FROM_EMAIL: 'letters@example.com',
  CONTACT_SITE_URL: 'https://portfolio.example.com', TURNSTILE_SITE_KEY: 'public-site-key', TURNSTILE_SECRET_KEY: 'test-private-turnstile',
}
const valid = {
  name: '테스트 방문자', email: 'visitor@example.org', topic: 'project', message: '프로젝트에 대해 문의를 드립니다.',
  consent: true, website: '', token: 'mock-token', requestId: 'ec21ce67-8f25-4a61-8b54-7c4fbc8b2702',
}
function responder() {
  return { headers: {}, setHeader(key, value) { this.headers[key] = value }, end(raw) { this.body = JSON.parse(raw) } }
}
async function invoke({ config = env, method = 'POST', body = valid, origin = env.CONTACT_SITE_URL, contentType = 'application/json', fetcher = successful, stream = false, headers = {} } = {}) {
  const req = stream ? Readable.from([body]) : { body }
  req.method = method
  req.headers = { origin, 'content-type': contentType, ...headers }
  const res = responder()
  await createContactHandler(config, fetcher)(req, res)
  return res
}
const successful = async url => ({ ok: true, json: async () => url.includes('siteverify') ? { success: true, hostname: 'portfolio.example.com', action: 'contact' } : { id: 'mock-email-id' } })

test('public configuration contains only status and public site key', async () => {
  const res = await invoke({ method: 'GET' })
  assert.equal(res.statusCode, 200)
  assert.deepEqual(res.body, { enabled: true, siteKey: env.TURNSTILE_SITE_KEY })
  assert.equal(res.headers['Cache-Control'], 'no-store')
  assert.ok(!JSON.stringify(res.body).includes(env.CONTACT_TO_EMAIL))
})
test('every required setting fails closed when missing', async () => {
  for (const key of Object.keys(env)) {
    const config = { ...env, [key]: '' }
    assert.deepEqual((await invoke({ config, method: 'GET' })).body, { enabled: false, siteKey: null })
    assert.equal((await invoke({ config })).statusCode, 503)
  }
})
test('unsupported method, origin, content type and oversized request are rejected', async () => {
  assert.equal((await invoke({ method: 'PUT' })).statusCode, 405)
  assert.equal((await invoke({ origin: 'https://other.example.com' })).statusCode, 403)
  assert.equal((await invoke({ origin: undefined, headers: { origin: undefined } })).statusCode, 403)
  assert.equal((await invoke({ contentType: 'text/plain' })).statusCode, 415)
  assert.equal((await invoke({ headers: { 'content-length': '24001' } })).statusCode, 413)
})
test('malformed JSON, arrays and oversized parsed body are rejected', async () => {
  assert.equal((await invoke({ body: '{no' })).statusCode, 400)
  assert.equal((await invoke({ body: [] })).statusCode, 400)
  assert.equal((await invoke({ body: { ...valid, message: 'x'.repeat(24000) } })).statusCode, 413)
})
test('required fields, bounds, consent, header injection, UUID and honeypot are validated before any provider call', async () => {
  const patches = [
    { name: '' }, { name: 'x'.repeat(81) }, { name: 'Name\r\nBcc: attacker@example.com' },
    { email: 'invalid' }, { email: 'visitor@example.com\n' }, { message: 'short' }, { message: 'x'.repeat(5001) },
    { message: '\u0000 ten characters' }, { consent: false }, { topic: 'constructor' }, { website: 'spam' },
    { token: '' }, { token: 'x'.repeat(2049) }, { requestId: 'not-a-uuid' }, { name: 2 }, { website: undefined },
  ]
  for (const patch of patches) {
    const res = await invoke({ body: { ...valid, ...patch }, fetcher: () => { assert.fail('provider must not be called') } })
    assert.equal(res.statusCode, 400, JSON.stringify(patch).slice(0, 80))
  }
})
test('Turnstile rejects false verification, wrong action and wrong hostname without sending', async () => {
  for (const verification of [{ success: false }, { success: true, action: 'login', hostname: 'portfolio.example.com' }, { success: true, action: 'contact', hostname: 'other.example.com' }]) {
    let calls = 0
    const res = await invoke({ fetcher: async url => { calls++; assert.ok(url.includes('siteverify')); return { ok: true, json: async () => verification } } })
    assert.equal(res.statusCode, 403)
    assert.equal(calls, 1)
  }
})
test('verification connection failure has a generic error and does not send', async () => {
  const res = await invoke({ fetcher: async () => { throw new Error(env.TURNSTILE_SECRET_KEY) } })
  assert.equal(res.statusCode, 502)
  assert.ok(!JSON.stringify(res.body).includes(env.TURNSTILE_SECRET_KEY))
})
test('recipient and sender stay fixed, visitor is reply-to, and retry uses same idempotency key', async () => {
  const calls = []
  const fetcher = async (url, options) => { calls.push({ url, options }); return successful(url) }
  for (let i = 0; i < 2; i++) {
    const res = await invoke({ body: { ...valid, to: 'attacker@example.com', from: 'attacker@example.com', message: '<script>alert(1)</script> 테스트 문의입니다.' }, fetcher })
    assert.equal(res.statusCode, 200)
    assert.deepEqual(res.body, { ok: true })
  }
  const payload = JSON.parse(calls[1].options.body)
  assert.deepEqual(payload.to, [env.CONTACT_TO_EMAIL])
  assert.equal(payload.from, env.CONTACT_FROM_EMAIL)
  assert.equal(payload.reply_to, valid.email)
  assert.ok(!payload.html)
  assert.ok(payload.text.includes('<script>')) // Plain text, never evaluated as HTML.
  assert.equal(calls[1].options.headers['Idempotency-Key'], calls[3].options.headers['Idempotency-Key'])
  assert.equal(calls[1].options.body, calls[3].options.body)
  assert.ok(calls.every(call => call.options.signal instanceof AbortSignal))
})
test('provider rejection, timeout and missing email ID never produce fake success or expose upstream details', async () => {
  for (const outcome of ['reject', 'timeout', 'missing-id']) {
    const res = await invoke({ fetcher: async url => {
      if (url.includes('siteverify')) return successful(url)
      if (outcome === 'timeout') throw new Error(env.RESEND_API_KEY)
      return { ok: outcome !== 'reject', json: async () => ({ private: env.CONTACT_TO_EMAIL }) }
    } })
    assert.equal(res.statusCode, 502)
    assert.ok(!res.body.ok)
    assert.ok(!JSON.stringify(res.body).includes(env.CONTACT_TO_EMAIL))
    assert.ok(!JSON.stringify(res.body).includes(env.RESEND_API_KEY))
  }
})
test('Vite request stream accepts JSON and rejects malformed or oversized data', async () => {
  assert.equal((await invoke({ body: JSON.stringify(valid), stream: true })).statusCode, 200)
  assert.equal((await invoke({ body: '{bad', stream: true })).statusCode, 400)
  assert.equal((await invoke({ body: 'x'.repeat(24001), stream: true })).statusCode, 413)
})
