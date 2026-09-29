import { useEffect, useRef, useState } from 'react'
import '../styles/contact.css'

let turnstileScript
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (!turnstileScript) {
    turnstileScript = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      const timeout = setTimeout(() => { script.remove(); reject(new Error('timeout')) }, 12000)
      script.onload = () => { clearTimeout(timeout); window.turnstile ? resolve(window.turnstile) : reject(new Error('load')) }
      script.onerror = () => { clearTimeout(timeout); script.remove(); reject(new Error('load')) }
      document.head.appendChild(script)
    }).catch(error => { turnstileScript = null; throw error })
  }
  return turnstileScript
}

export default function ContactForm() {
  const [config, setConfig] = useState(null)
  const [configError, setConfigError] = useState(false)
  const [retry, setRetry] = useState(0)
  const [token, setToken] = useState('')
  const [captchaError, setCaptchaError] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [length, setLength] = useState(0)
  const container = useRef(null)
  const widget = useRef(null)
  const submission = useRef(null)
  const attempt = useRef(null)
  const successHeading = useRef(null)
  const sent = status === 'success'

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    const timeout = setTimeout(() => controller.abort(), 10000)
    fetch('/api/contact', { signal: controller.signal, cache: 'no-store' })
      .then(async response => {
        if (!response.ok) throw new Error('config')
        const value = await response.json()
        if (typeof value.enabled !== 'boolean' || (value.enabled && typeof value.siteKey !== 'string')) throw new Error('config')
        if (active) { setConfig(value); setConfigError(false) }
      }).catch(() => { if (active) setConfigError(true) }).finally(() => clearTimeout(timeout))
    return () => { active = false; clearTimeout(timeout); controller.abort() }
  }, [retry])

  useEffect(() => {
    if (!config?.enabled || sent) return
    let active = true
    loadTurnstile().then(api => {
      if (!active) return
      widget.current = api.render(container.current, {
        sitekey: config.siteKey, action: 'contact', theme: 'light', size: 'flexible', language: 'ko',
        callback: value => { if (active) { setToken(value); setCaptchaError('') } },
        'expired-callback': () => { if (active) setToken('') },
        'error-callback': () => { if (active) { setToken(''); setCaptchaError('자동 전송 확인을 불러오지 못했습니다. 확인 기능을 다시 불러와 주세요.') } },
      })
    }).catch(() => { if (active) setCaptchaError('확인 기능에 연결하지 못했습니다. 잠시 후 다시 불러와 주세요.') })
    return () => {
      active = false
      if (widget.current !== null && window.turnstile) window.turnstile.remove(widget.current)
      widget.current = null
    }
  }, [config, retry, sent])

  useEffect(() => () => submission.current?.abort(), [])
  useEffect(() => { if (status === 'success') successHeading.current?.focus() }, [status])

  const send = async event => {
    event.preventDefault()
    if (!config?.enabled || !token || submission.current) return
    const form = new FormData(event.currentTarget)
    const payload = {
      name: form.get('name').trim(), email: form.get('email').trim(), topic: form.get('topic'),
      message: form.get('message').trim(), website: form.get('website'), consent: form.get('consent') === 'on',
    }
    if (payload.message.length < 10) { setError('내용을 10자 이상 입력해 주세요.'); return }
    const fingerprint = JSON.stringify(payload)
    if (attempt.current?.fingerprint !== fingerprint) attempt.current = { fingerprint, id: crypto.randomUUID() }
    const controller = new AbortController()
    submission.current = controller
    const timeout = setTimeout(() => controller.abort(), 20000)
    setStatus('sending'); setError('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({ ...payload, requestId: attempt.current.id, token }),
      })
      const result = await response.json()
      if (!response.ok || result.ok !== true) throw new Error(result.error || '발송 결과를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.')
      setStatus('success')
    } catch (failure) {
      setStatus('idle')
      setError(failure.name === 'AbortError' || failure instanceof TypeError ? '연결이 끊겨 발송 결과를 확인하지 못했습니다. 입력한 내용으로 다시 시도해 주세요.' : failure.message)
    } finally {
      clearTimeout(timeout); submission.current = null; setToken('')
      if (widget.current !== null && window.turnstile) window.turnstile.reset(widget.current)
    }
  }

  return <section className="letter">
    <header className="letter-heading"><div><span className="letter-caption">TO. CHANG BIN</span><h2 id="dialog-title">편지 보내기</h2><p>프로젝트나 채용에 관한 이야기를 남겨주세요.</p></div><svg className="letter-stamp" viewBox="0 0 64 72" aria-hidden="true"><path d="M5 5h54v62H5z"/><path d="M16 26h32v23H16zM16 26l16 13 16-13"/><circle cx="32" cy="15" r="2"/><path d="M22 57h20"/></svg></header>
    {status === 'success' ? <div className="letter-success" role="status"><span aria-hidden="true">✓</span><h3 ref={successHeading} tabIndex={-1}>편지가 접수됐어요.</h3><p>입력한 답장 주소와 함께 발송 요청이 접수되었습니다.<br/>보내주셔서 감사합니다.</p></div> : <form onSubmit={send} aria-busy={status === 'sending'}>
      <fieldset disabled={status === 'sending'}>
        <legend className="sr-only">문의 내용 작성</legend>
        <div className="letter-sender"><label htmlFor="letter-name">보내는 사람<input id="letter-name" name="name" autoComplete="name" required maxLength={80} placeholder="이름 또는 소속"/></label><label htmlFor="letter-email">답장 받을 이메일<input id="letter-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com"/></label></div>
        <label className="letter-topic" htmlFor="letter-topic">어떤 이야기인가요?<select id="letter-topic" name="topic"><option value="project">프로젝트 문의</option><option value="hiring">채용 문의</option><option value="other">기타 문의</option></select></label>
        <label className="letter-message-label" htmlFor="letter-message">내용 <span>10자 이상</span><textarea id="letter-message" name="message" required minLength={10} maxLength={5000} rows={5} placeholder="함께하고 싶은 작업이나 궁금한 점을 적어주세요." onChange={event => setLength(event.target.value.length)} /></label>
        <div className="letter-count" aria-hidden="true">{length.toLocaleString()} / 5,000</div>
        <div className="letter-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <label className="letter-consent"><input name="consent" type="checkbox" required/><span>문의 응대 목적으로 이름, 이메일, 내용을 전달하는 데 동의합니다.</span></label>
        <details className="letter-privacy"><summary>입력한 정보는 어떻게 사용되나요?</summary><p>이름, 답장 주소와 문의 내용은 문의 확인·회신을 위해 정창빈에게 전달됩니다. 발송에는 Resend, 자동 전송 확인에는 Cloudflare Turnstile을 사용합니다. 입력 내용은 이 사이트의 별도 데이터베이스에 저장하지 않습니다. 동의하지 않으면 전송할 수 없습니다.</p></details>
      </fieldset>
      <div className="letter-verification" ref={container}/>
      {captchaError && <p className="letter-error" role="alert">{captchaError}<button type="button" onClick={() => { setToken(''); setCaptchaError(''); setRetry(value => value + 1) }}>확인 기능 다시 불러오기</button></p>}
      {error && <p className="letter-error" role="alert">{error}</p>}
      <div className="letter-bottom"><p className="letter-status" role="status">{configError ? <>전송 상태를 확인하지 못했습니다.<button type="button" onClick={() => setRetry(value => value + 1)}>다시 확인</button></> : !config ? '전송 상태를 확인하고 있습니다.' : !config.enabled ? '메시지 전송 준비 중입니다.' : status === 'sending' ? '편지를 보내고 있습니다…' : !token ? '자동 전송 확인을 완료해 주세요.' : '작성한 내용이 메일로 전달됩니다.'}</p><button className="letter-send" type="submit" disabled={!config?.enabled || !token || status === 'sending'}>{status === 'sending' ? '보내는 중…' : '편지 보내기'}<span aria-hidden="true">↗</span></button></div>
    </form>}
  </section>
}
