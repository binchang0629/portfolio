const topics = { project: '프로젝트 문의', hiring: '채용 문의', other: '기타 문의' }
const emailPattern = /^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/
// Reject header-control characters supplied by visitors.
// eslint-disable-next-line no-control-regex
const controls = /[\u0000-\u001f\u007f]/
const maxBytes = 24000

function settings(env) {
  let origin
  try {
    const url = new URL(env.CONTACT_SITE_URL)
    if (url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) origin = url.origin
  } catch { /* Missing configuration keeps sending disabled. */ }
  const enabled = Boolean(origin && env.RESEND_API_KEY && env.TURNSTILE_SITE_KEY && env.TURNSTILE_SECRET_KEY &&
    emailPattern.test(env.CONTACT_TO_EMAIL || '') && !controls.test(env.CONTACT_TO_EMAIL || '') &&
    emailPattern.test(env.CONTACT_FROM_EMAIL || '') && !controls.test(env.CONTACT_FROM_EMAIL || ''))
  return { enabled, origin }
}

async function readBody(req) {
  if (Number(req.headers['content-length']) > maxBytes) throw new Error('size')
  // Vercel supplies a parsed body; Vite supplies a Node request stream.
  if (req.body !== undefined) {
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
    if (Buffer.byteLength(raw) > maxBytes) throw new Error('size')
    return typeof req.body === 'string' ? JSON.parse(raw) : req.body
  }
  const chunks = []
  let bytes = 0
  for await (const chunk of req) {
    bytes += Buffer.byteLength(chunk)
    if (bytes > maxBytes) throw new Error('size')
    chunks.push(Buffer.from(chunk))
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'))
}

function validate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null
  const { name, email, topic, message, consent, requestId, token, website } = body
  if (![name, email, topic, message, requestId, token].every(value => typeof value === 'string')) return null
  if (typeof website !== 'string' || website.trim() || consent !== true) return null
  if (!name.trim() || name.length > 80 || controls.test(name)) return null
  if (email.length > 254 || controls.test(email) || !emailPattern.test(email.trim())) return null
  // eslint-disable-next-line no-control-regex
  if (!Object.hasOwn(topics, topic) || message.trim().length < 10 || message.length > 5000 || /[\u0000\u007f]/.test(message)) return null
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId) || !token || token.length > 2048) return null
  return { name: name.trim(), email: email.trim(), topic, message: message.trim(), requestId, token }
}

export function createContactHandler(env, fetcher = fetch) {
  return async (req, res) => {
    const reply = (status, body) => {
      res.statusCode = status
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.setHeader('Cache-Control', 'no-store')
      res.setHeader('X-Content-Type-Options', 'nosniff')
      res.end(JSON.stringify(body))
    }
    const config = settings(env)
    if (req.method === 'GET') return reply(200, { enabled: config.enabled, siteKey: config.enabled ? env.TURNSTILE_SITE_KEY : null })
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'GET, POST')
      return reply(405, { error: '지원하지 않는 요청입니다.' })
    }
    if (!config.enabled) return reply(503, { error: '메시지 전송을 준비 중입니다. 나중에 다시 방문해 주세요.' })
    if (req.headers.origin !== config.origin) return reply(403, { error: '이 사이트의 문의 창에서 보내주세요.' })
    if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) return reply(415, { error: '요청 형식을 확인해 주세요.' })
    let body
    try { body = await readBody(req) } catch (error) {
      return reply(error.message === 'size' ? 413 : 400, { error: '입력 내용을 확인해 주세요.' })
    }
    const input = validate(body)
    if (!input) return reply(400, { error: '이름, 이메일, 내용과 전송 동의를 확인해 주세요.' })
    let verification
    try {
      const response = await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(5000),
        body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: input.token }),
      })
      if (!response.ok) throw new Error('verification')
      verification = await response.json()
    } catch { return reply(502, { error: '자동 전송 확인에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.' }) }
    if (verification.success !== true || verification.action !== 'contact' || verification.hostname !== new URL(config.origin).hostname) {
      return reply(403, { error: '자동 전송 확인을 다시 완료해 주세요.' })
    }
    try {
      const response = await fetcher('https://api.resend.com/emails', {
        method: 'POST', signal: AbortSignal.timeout(8000),
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `contact-${input.requestId}` },
        body: JSON.stringify({
          from: env.CONTACT_FROM_EMAIL, to: [env.CONTACT_TO_EMAIL], reply_to: input.email,
          subject: `[포트폴리오 · ${topics[input.topic]}] ${input.name}`,
          text: `보낸 사람: ${input.name}\n답장 주소: ${input.email}\n문의 유형: ${topics[input.topic]}\n\n${input.message}`,
        }),
      })
      if (!response.ok) throw new Error('email')
      const result = await response.json()
      if (typeof result.id !== 'string' || !result.id) throw new Error('email')
      return reply(200, { ok: true })
    } catch { return reply(502, { error: '발송 결과를 확인하지 못했습니다. 내용을 그대로 두었으니 잠시 후 다시 시도해 주세요.' }) }
  }
}

export default createContactHandler(process.env)
