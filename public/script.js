// 메뉴 이동은 HTML 앵커(#home 등)와 CSS scroll-behavior 로 처리한다.
// 여기서는 ① 지금 보는 구역을 메뉴에 표시 ② 이메일 복사 ③ 문의 양식 → 메일 앱 ④ 바닥글 연도.

(() => {
  /* ① 지금 보는 구역 표시 */
  const links = [...document.querySelectorAll('.nav a[href^="#"]')]
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean)
  const mark = id => {
    for (const a of links) {
      if (a.getAttribute('href') === '#' + id) a.setAttribute('aria-current', 'true')
      else a.removeAttribute('aria-current')
    }
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      for (const e of entries) if (e.isIntersecting) mark(e.target.id)
    }, { rootMargin: '-40% 0px -55% 0px' })
    sections.forEach(s => io.observe(s))
  }
  links.forEach(a => a.addEventListener('click', () => mark(a.getAttribute('href').slice(1))))
  // 맨 아래에서는 마지막 구역 — 짧은 마지막 구역은 위 기준선에 닿지 않는다
  window.addEventListener('scroll', () => {
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
    if (atBottom && sections.length) mark(sections[sections.length - 1].id)
  }, { passive: true })

  /* ② 이메일 복사 — 실패하면(권한 없음 등) 조용히 넘어가지 않고 직접 복사하라고 알린다 */
  for (const btn of document.querySelectorAll('[data-copy]')) {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy')
      try {
        await navigator.clipboard.writeText(text)
        btn.textContent = '복사됨'
        btn.classList.add('is-done')
      } catch {
        btn.textContent = '직접 복사'
      }
      setTimeout(() => { btn.textContent = '복사'; btn.classList.remove('is-done') }, 2000)
    })
  }

  /* ③ 문의 양식 — 서버가 없는 정적 사이트라 내용을 저장하지 않고, 메일 앱을 채워서 연다 */
  const form = document.getElementById('contact-form')
  const note = document.getElementById('form-note')
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault()
      const fields = [...form.querySelectorAll('input, textarea')]
      let firstBad = null
      for (const f of fields) {
        const bad = !f.value.trim() || (f.type === 'email' && !f.checkValidity())
        f.setAttribute('aria-invalid', bad ? 'true' : 'false')
        if (bad && !firstBad) firstBad = f
      }
      if (firstBad) {
        note.textContent = '빈 칸이나 형식이 맞지 않는 칸이 있어요. 표시된 칸을 확인해 주세요.'
        note.classList.add('is-error')
        firstBad.focus()
        return
      }
      const v = n => form.elements[n].value.trim()
      const body = `${v('message')}\n\n— ${v('name')} (${v('email')})`
      window.location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(v('subject'))}&body=${encodeURIComponent(body)}`
      note.textContent = '메일 앱을 열었어요. 내용을 확인하고 보내 주세요.'
      note.classList.remove('is-error')
    })
  }

  /* ④ 바닥글 연도 */
  const y = document.getElementById('year')
  if (y) y.textContent = String(new Date().getFullYear())
})()
