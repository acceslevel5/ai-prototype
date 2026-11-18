/* BOG AI — კრიპტოს სცენარი
   მდგომარეობები (#ai[data-state]):
     idle    → 44px მრგვალი AI ღილაკი ნავბარში (Figma: Crypto)
     teaser  → ღილაკი იშლება აბრად და ფრომფთებს აბრუნებს (Figma: Crypto - Ai Active)
     open    → პანელი ფრომფთების სიით / საუბრით (Figma: Crypto - Ai Expanded, Typing)
   ტაიმინგები ერთ ადგილას, დასახვეწად: */
const TIMING = {
  teaserDelay: 900,     // ეკრანზე შესვლიდან აბრის გაშლამდე
  teaserRotate: 3200,   // აბრაზე ფრომფთის შეცვლა
  teaserCycles: 1,      // რამდენი სრული წრის შემდეგ დაიკეცოს აბრა ღილაკად (0 = არ იკეცება)
  bubbleToThink: 350,   // კითხვის bubble-დან „Thinking"-მდე
  stepMs: 850,          // „ფიქრის" თითო ნაბიჯი (მინიმუმ)
  thinkSettle: 350,     // ბოლო ✓-ის შემდეგ პაუზა, სანამ „Thought for…" გამოჩნდება
  collapseToAnswer: 260, // ნაბიჯების დაკეცვიდან პასუხის დაწყებამდე
  thinkScale: 1600,     // „ფიქრის" ხანგრძლივობა = think (წამი) × ეს მამრავლი, თუ ნაბიჯებზე მეტია
  wordDelay: 32,        // პასუხის ნაკადი — სიტყვებს შორის (თანაბრად, პაუზების გარეშე)
  cardToText: 320,      // ბარათის გამოჩენიდან ტექსტის დაწყებამდე
  actionMs: 800,        // მოქმედების „შესრულება" (ღილაკის loading)
  nextDelay: 300,       // პასუხიდან „შემდეგი ნაბიჯების" გამოჩენამდე
  pickHold: 160,        // დანარჩენი ჩიპები ქრება, სანამ არჩეული გაფრინდება
  flyMs: 560,           // ჩიპის ფრენა bubble-ის ადგილას
  flyArc: 10,           // ფრენის რკალის სიმაღლე (px)
  listenMs: 1100,       // ხმა: სიჩუმე „საუბრის" დაწყებამდე
  voiceWordMs: 270,     // ხმა: სიტყვებს შორის (საშუალოდ)
  voiceSendMs: 1000,    // ხმა: სიჩუმე ბოლო სიტყვის შემდეგ, სანამ თავისით გაიგზავნება (0 = მხოლოდ ღილაკით)
  longPress: 450,       // ხანგრძლივი დაჭერა გვერდის ელემენტზე → „Ask BOG AI about this"
  suggestMs: 7000,      // რამდენ ხანს აჩვენებს აბრა სექციაზე მორგებულ ფრომფთს
  dragExpand: 56,       // ჟესტი: რამდენი px-ით ქვემოთ ჩამოწევა შლის პანელს სრულ ეკრანზე
  dragClose: 0.28,      // ჟესტი: პანელის რა ნაწილი უნდა აიწიოს, რომ დაიხუროს (ან სწრაფი აწევა)
  inputMaxLines: 4,     // ველი იზრდება ამდენ ხაზამდე, მერე სქროლავს
  growSpringBusy: 10,   // იგივე, პასუხის წერისას: უფრო რბილი, რომ ხაზ-ხაზ ზრდა ერთ უწყვეტ მოძრაობად ჩანდეს
  growSpring: 16,       // პანელის სიმაღლის „ზამბარა" (მეტი = უფრო სწრაფი; ~16 ≈ 0.3 წმ)
  scrollSpring: 10,     // სქროლის „ზამბარა" (კითხვის თავში მიმაგრება, პასუხის მიდევნება)
}

/* AI-ს ინტერფეისის ტექსტები: კრიპტოს სცენარი ინგლისურად, ბანკის ეკრანები ქართულად (screens.js ცვლის AI_TXT-ს) */
window.AI_EN = { thinking: 'Thinking', thought: (s) => `Thought for ${s} sec`, stopped: 'Stopped', youStopped: 'You stopped this response', next: 'What would you like to do next?', cancel: 'Cancel', sources: (n) => `${n} source${n > 1 ? 's' : ''}`, placeholder: 'Ask BOG AI', convo: 'Continue conversation', answering: 'Answering…' }
window.AI_KA = { thinking: 'ვფიქრობ', thought: (s) => `ვიფიქრე ${s} წმ`, stopped: 'შეჩერდა', youStopped: 'პასუხი შეაჩერე', next: 'რა გავაკეთოთ შემდეგ?', cancel: 'გაუქმება', sources: (n) => `${n} წყარო`, placeholder: 'ჰკითხე BOG AI-ს', convo: 'გააგრძელე საუბარი', answering: 'ვპასუხობ…' }
window.AI_TXT = window.AI_KA // ყველა ეკრანზე ქართულად (AI_EN — საჭიროების შემთხვევაში)
const $ = (s, r = document) => r.querySelector(s)
const el = (tag, cls, html) => {
  const n = document.createElement(tag)
  if (cls) n.className = cls
  if (html != null) n.innerHTML = html
  return n
}
const asset = (f) => `assets/${f}`
const iconUrl = (f) => `url(../../prototypes/ai-crypto/assets/${f})` // --icon იხსნება bog-ui/components/-დან
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
// pause: როგორც wait, მაგრამ „Stop"-ზე მაშინვე სრულდება
let pauses = []
const pause = (ms) => new Promise((r) => {
  const done = () => { clearTimeout(t); r() }
  const t = setTimeout(done, ms)
  pauses.push(done)
})
const flushPauses = () => pauses.splice(0).forEach((f) => f())

/* ---------- გვერდის სიები ---------- */
function listItem({ icon, logo, name, sub, value, chg, up, extra }) {
  const media = logo
    ? `<span class="bog-media-circle" data-size="40"><img src="${asset(logo)}" alt=""></span>`
    : `<span class="bog-icon-holder" data-size="40"><span class="bog-icon" style="--icon: ${iconUrl(icon)}"></span></span>`
  const second = chg
    ? `<span class="chg ${up ? 'chg--up' : 'chg--down'}"><span class="chg__icon"></span>${chg}</span>`
    : extra ? `<span class="bog-list-item__value-sub">${extra}</span>` : ''
  return `<button type="button" class="bog-list-item">${media}
    <span class="bog-list-item__content"><span class="bog-list-item__label">${name}</span><span class="bog-list-item__secondary">${sub}</span></span>
    <span class="bog-list-item__end"><span class="bog-list-item__value">${value}</span>${second}</span></button>`
}
$('#portfolios').innerHTML = DATA.portfolios.map(listItem).join('')
$('#stocks').innerHTML = DATA.stocks.map(listItem).join('')
// ზედა ჯამი, დღის/სრული ცვლილება, გრაფიკის ნიშნულები და საინვესტიციო თანხა — სიების რეალური ჯამიდან (data.js: CRYPTO)
{
  const scr = $('[data-screen="crypto"]')
  $('.price .bog-amount__value', scr).textContent = CRYPTO.f(CRYPTO.total)
  const [today, all] = scr.querySelectorAll('.price .chg')
  today.innerHTML = `<span class="chg__icon"></span>${CRYPTO.$(CRYPTO.today)} (${CRYPTO.todayPct.toFixed(2)}%) <span class="chg__label">დღეს</span>`
  all.innerHTML = `<span class="chg__icon"></span>${CRYPTO.$(CRYPTO.gain)} (${CRYPTO.gainPct.toFixed(2)}%) <span class="chg__label">სულ</span>`
  $('.chart__mark--high', scr).innerHTML = `<i></i>${CRYPTO.f(CRYPTO.total + 0.64)}`
  $('.chart__mark--low', scr).innerHTML = `${CRYPTO.f(CRYPTO.total - 4.71)}<i></i>`
  $('#cashBalance').textContent = `${CRYPTO.f(DATA.cash)} $`
}
$('#transactions').innerHTML = DATA.transactions
  .map((g) => `<p class="tx-date">${g.date}</p><div class="bog-list">${g.items.map(listItem).join('')}</div>`)
  .join('')

// სეგმენტები: მხოლოდ ვიზუალური გადართვა
document.addEventListener('click', (e) => {
  const seg = e.target.closest('.bog-segment')
  if (!seg) return
  seg.parentElement.querySelectorAll('.bog-segment').forEach((s) => s.setAttribute('aria-checked', String(s === seg)))
})

/* ---------- BOG AI ---------- */
const ai = $('#ai')
ai.prepend(el('span', 'ai__beam', '<i class="b"></i><i class="g"></i><i class="s"></i>')) // აბრის სხივი (style.css: Beam)
const backdrop = $('#aiBackdrop')
const teaserText = $('#aiTeaserText')
// აბრა საუბრის დროს: ფრომფთების ნაცვლად — „Continue conversation" / „Answering…" და ბოლო კითხვა
$('#aiTeaser').append(el('span', 'ai__convo', '<small><span class="ai__convo-idle">Continue conversation</span><span class="ai__convo-busy">Answering…</span></small><b id="aiConvoText"></b>'))
const chat = $('#aiChat')
const inner = $('#aiInner')
const thread = $('#aiThread')
const form = $('#aiForm')
const input = $('#aiInput')

let busy = false       // პასუხი იწერება
let started = false    // საუბარი დაიწყო (ფრომფთების სია აღარ ჩანს)
let listening = false  // მიკროფონი „უსმენს"

const vv = window.visualViewport

function setState(state) {
  ai.dataset.state = state
  document.documentElement.classList.toggle('ai-open', state === 'open')
  clearTimeout(settleTimer)
  ai.classList.remove('is-settled')
  if (state === 'open') {
    fitPanel()
    const h = Math.min(targetH, maxPanelH())
    ai.style.setProperty('--panel-h', h + 'px')
    // მაღალ პანელს (მაგ. საუბრის ხელახლა გახსნა) გაშლას მეტი დრო სჭირდება, რომ ერთნაირად რბილი იყოს
    ai.style.setProperty('--open-h-dur', Math.round(Math.min(900, 620 + Math.max(0, h - 320) * 0.6)) + 'ms')
    // გაშლის ანიმაციის შემდეგ სიმაღლეს აღარ CSS transition, არამედ rAF-ის რბილი მიდევნება მართავს
    settleTimer = setTimeout(() => ai.classList.add('is-settled'), (parseFloat(getComputedStyle(ai).getPropertyValue('--open-h-dur')) || 620) + 40)
    loop()
  } else {
    ai.style.removeProperty('--panel-h')
    ai.style.removeProperty('--open-h-dur')
  }
}

/* პანელის სიმაღლე და ჩატის სქროლი — ერთ rAF ციკლში.
   ორივე „კრიტიკულად ჩამქრალ ზამბარას" მისდევს: მოძრაობა ნულოვანი სიჩქარიდან იწყება და გადახტომის გარეშე
   ჩერდება, ამიტომ არც დიდ ცვლილებაზე (ჩიპების სიის გაქრობა, კლავიატურა) „ბიძგი" არ არის.
   სამიზნეები ყოველ კადრში თავიდან ითვლება:
     • სიმაღლე = min(კონტენტი, ხილული სიმაღლე)
     • სქროლი  = ახალი კითხვა თავში (pin), ხოლო თუ პასუხი ეკრანს აღემატება — პასუხის ბოლო */
let targetH = 0
let tailUntil = 0 // პასუხის შემდეგ ცოტა ხანს ისევ მივყვებით, რომ „შემდეგი ნაბიჯები" გამოჩნდეს
let settleTimer
let looping = false
let pinned = null // ბოლო კითხვის turn, რომელიც თავშია მიმაგრებული
const H = { x: 0, v: 0 } // პანელის სიმაღლე
const S = { x: 0, v: 0 } // ჩატის სქროლი
function spring(st, target, dt, w) {
  const x = st.x - target
  const k = st.v + w * x
  const e = Math.exp(-w * dt)
  st.x = target + (x + k * dt) * e
  st.v = (st.v - w * k * dt) * e
}
let streaming = false // პასუხის ტექსტი იწერება (ფიქრი უკვე დასრულდა)
let dragH = null // ჟესტის დროს პანელის სიმაღლე (null = ჟესტი არ მიმდინარეობს)
const barHeight = () => (ai.classList.contains('is-voice') ? $('.ai-voice').offsetHeight : form.offsetHeight) // ქვედა ზოლი: ველი ან ხმის რეჟიმი
let floorH = 0 // პასუხის წერისას პანელის ქვედა ზღვარი (ფიქრის ბოლოს არსებული სიმაღლე)
let heldH = 0 // პასუხის წერისას პანელი ამაზე დაბლა არ იკუმშება
const hasHistory = () => !!(pinned && pinned.isConnected && pinned.previousElementSibling && pinned.previousElementSibling.classList.contains('ai-turn'))
function fitPanel() {
  if (ai.dataset.state !== 'open') return
  if (isFull()) { targetH = maxPanelH(); return }
  const chrome = barHeight() + 16 /* top pad */ + 16 /* gap */ + 16 /* bottom pad */
  if (pinned && pinned.isConnected) {
    // საუბარი: პანელი ბოლო კითხვა-პასუხს ერგება (ისტორია ზემოთ, სქროლშია; იკეცებადი ჩიპების სია არ ითვლება).
    // layout ზომებით ვითვლით — შესვლის ანიმაციების transform სიმაღლეს არ არხევს
    const last = pinned.lastElementChild
    const natural = last.offsetTop + last.offsetHeight - pinned.offsetTop
    targetH = natural + (hasHistory() ? 8 : 0) + chrome
    // სანამ AI ფიქრობს/წერს, პანელი არ იკუმშება (არც კითხვის გაგზავნისას, არც ფიქრის ჟურნალის დაკეცვისას) —
    // მხოლოდ იზრდება, როცა პასუხს მეტი ადგილი სჭირდება; დასრულებისას ერთხელ ერგება შიგთავსს
    if (busy) targetH = Math.max(targetH, heldH, floorH)
  } else targetH = inner.offsetHeight + chrome
}
const ro = new ResizeObserver(fitPanel)
ro.observe(inner)
ro.observe(form) // ველი იზრდება მრავალხაზიან ტექსტზე

// მაქსიმალური სიმაღლე: კლავიატურის ზემოთ (აკრეფისას) ან ტაბ ბარის ზემოთ
const safeProbe = el('div', 'safe-probe')
document.body.append(safeProbe)
function maxPanelH() {
  const vvh = vv ? vv.height : window.innerHeight
  if (isFull()) return vvh // სრული ეკრანი (კლავიატურისას — მის ზემოთ)
  const typing = ai.classList.contains('is-typing')
  return vvh - ai.offsetTop - (typing ? 8 : 120 + safeProbe.offsetHeight)
}
// ჩატის ხილული სიმაღლე, როცა პანელი სამიზნე სიმაღლეს მიაღწევს (padding/gap/ველის გამოკლებით)
// რეალური განლაგებიდან ვითვლით, რომ სრული ეკრანის სათაურიც და ველის სიმაღლეც თავისით გაითვალისწინოს
const chatViewport = (panelH) => chat.clientHeight + (panelH - ai.offsetHeight)
const isFull = () => ai.classList.contains('is-full')

function scrollGoal(panelGoal) {
  const view = chatViewport(panelGoal)
  const max = Math.max(0, chat.scrollHeight - chat.clientHeight)
  let goal = 0
  if (pinned && pinned.isConnected) {
    const last = pinned.lastElementChild
    const natural = last.offsetTop + last.offsetHeight - pinned.offsetTop
    if (hasHistory()) {
      const top = pinned.getBoundingClientRect().top - chat.getBoundingClientRect().top + chat.scrollTop
      goal = Math.max(top - 4, top + natural + 8 - view) // კითხვა თავში; გრძელ პასუხზე — ბოლოს მივყვებით
    } else goal = natural + 8 - view // პირველი კითხვა: სქროლი მხოლოდ მაშინ, როცა პასუხი ეკრანს აღემატება
  } else goal = inner.offsetHeight + 8 - view
  return Math.min(max, Math.max(0, goal))
}

let lastT = 0
function loop() {
  if (looping) return
  looping = true
  lastT = performance.now()
  H.x = ai.offsetHeight
  H.v = 0
  const step = (now) => {
    if (ai.dataset.state !== 'open') { looping = false; return }
    const dt = Math.min(0.05, (now - lastT) / 1000)
    lastT = now
    fitPanel()
    const goal = Math.min(targetH, maxPanelH())
    // მიმაგრებულ turn-ს ყოველთვის ხილული არის სიმაღლე აქვს, რომ კითხვა თავში დარჩეს
    if (hasHistory()) pinned.style.minHeight = Math.max(0, Math.max(chat.clientHeight, chatViewport(goal)) - 8) + 'px'
    if (dragH != null) {
      // თითი მართავს სიმაღლეს (ჟესტით დახურვა)
      H.x = dragH
      H.v = 0
      ai.style.setProperty('--panel-h', H.x.toFixed(1) + 'px')
    } else if (ai.classList.contains('is-settled')) {
      spring(H, goal, dt, streaming ? TIMING.growSpringBusy : TIMING.growSpring)
      if (Math.abs(H.x - goal) < 0.3 && Math.abs(H.v) < 1) { H.x = goal; H.v = 0 }
      ai.style.setProperty('--panel-h', H.x.toFixed(1) + 'px')
    } else {
      H.x = ai.offsetHeight
      H.v = 0
    }
    if (follow && (busy || now < tailUntil)) {
      spring(S, scrollGoal(goal), dt, TIMING.scrollSpring)
      chat.scrollTop = S.x
    } else {
      S.x = chat.scrollTop
      S.v = 0
    }
    requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

// კლავიატურა (iOS): ხილული სიმაღლე, რომ პანელი კლავიატურის ქვეშ არ მოექცეს
function syncViewport() {
  const h = vv ? vv.height : window.innerHeight
  document.documentElement.style.setProperty('--vvh', h + 'px')
  if (vv) window.scrollTo(0, 0)
}
if (vv) {
  vv.addEventListener('resize', syncViewport)
  vv.addEventListener('scroll', () => window.scrollTo(0, 0))
}
syncViewport()

/* --- teaser: ღილაკი იშლება და ფრომფთებს აბრუნებს --- */
const cssMs = (name) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0
let teaserIndex = 0
let teaserTimer
let teaserCycles = 0
let teaserHold = null  // სექციაზე მორგებული ფრომფთი აბრაზე (როტაცია ამ დროს ჩერდება)
let teaserDone = false // წრე დასრულდა: აბრა ღილაკად დაიკეცა

// პირველი ფრომფთი ასო-ასო ჩნდება
function typeTeaser(text) {
  teaserText.className = 'ai__teaser-text'
  teaserText.innerHTML = [...text].map((c, i) => `<span class="ch" style="--c:${i}">${c}</span>`).join('')
}
// შემდეგი ფრომფთები: ძველი ზემოთ გადის, ახალი ქვემოდან შემოდის
function swapTeaser(text) {
  teaserText.className = 'ai__teaser-text is-out'
  setTimeout(() => {
    teaserText.textContent = text
    teaserText.className = 'ai__teaser-text is-in'
  }, cssMs('--teaser-swap'))
}
function rotateTeaser() {
  clearInterval(teaserTimer)
  teaserTimer = setInterval(() => {
    if (ai.dataset.state !== 'teaser' || started || teaserHold) return // საუბრისას აბრა ფრომფთებს აღარ აბრუნებს და არ იკეცება
    teaserIndex = (teaserIndex + 1) % PROMPTS.length
    if (teaserIndex === 0) teaserCycles++
    // TIMING.teaserCycles სრული წრის შემდეგ აბრა ისევ ღილაკად იკეცება (0 = არასდროს)
    if (TIMING.teaserCycles && teaserCycles >= TIMING.teaserCycles) {
      clearInterval(teaserTimer)
      teaserDone = true
      teaserText.className = 'ai__teaser-text'
      setState('idle')
      return
    }
    swapTeaser(PROMPTS[teaserIndex].text)
  }, TIMING.teaserRotate)
}
function expandTeaser() {
  // იუზერმა ღილაკი გაშლამდე უკვე გახსნა — აბრა აღარ გვჭირდება
  if (ai.dataset.state !== 'idle') { teaserDone = true; return }
  ai.classList.add('is-expanding', 'is-glowing')
  setState('teaser')
  typeTeaser(PROMPTS[teaserIndex].text)
  setTimeout(() => ai.classList.remove('is-expanding'), cssMs('--teaser-expand'))
  setTimeout(() => ai.classList.remove('is-glowing'), cssMs('--teaser-glow') + 400)
  rotateTeaser()
}
// აბრა თავისით მხოლოდ კრიპტოს ეკრანზე იშლება (სხვა ეკრანიდან შესვლისას — screens.js)
if (window.START === 'crypto' || !window.START) setTimeout(expandTeaser, TIMING.teaserDelay)

/* --- open / close --- */
let closeTimer
let morph = [] // მიმდინარე WAAPI ანიმაციები (ღილაკი ↔ პანელი)
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const stopMorph = () => { morph.forEach((a) => a.cancel()); morph = [] }
// „Reduce motion": ფრენა, ნაკადი და ზამბარები მყისიერია (CSS ანიმაციებს style.css-ის media წესი თიშავს)
if (reduced) Object.assign(TIMING, { flyMs: 1, pickHold: 0, wordDelay: 0, bubbleToThink: 0, growSpring: 400, growSpringBusy: 400, scrollSpring: 400 })

function open() {
  if (ai.dataset.state === 'open') return
  clearTimeout(closeTimer)
  ai.classList.remove('is-closing', 'has-unread')
  if (!started) renderPrompts()
  if (ai.dataset.state === 'idle' && !reduced) return openFromButton()
  ai.classList.remove('from-button')
  setState('open')
}
function close() {
  endEdit()
  toggleHistory(false)
  // სრული ეკრანიდან: ჯერ პანელად იკეცება, შემდეგ იხურება
  if (isFull()) { setFull(false); setTimeout(close, 360); return }
  input.blur()
  if (ctxCurrent) setContext(null, true)
  setListening(false)
  toggleMenu(false)
  if (teaserDone && !started && !reduced) return closeToButton() // საუბრისას ყოველთვის აბრად იკეცება, რომ კონტექსტი ჩანდეს
  ai.classList.add('is-closing')
  clearTimeout(closeTimer)
  closeTimer = setTimeout(() => ai.classList.remove('is-closing'), cssMs('--close-dur') + 60)
  // წრის დასრულებამდე პანელი აბრად იკეცება
  setState('teaser')
}

/* ღილაკი ↔ პანელი: პანელი მაშინვე საბოლოო ადგილზე დგას და ჩანს მხოლოდ clip-path-ის „ფანჯრიდან",
   რომელიც ღილაკის ზომიდან იზრდება. ასე კონტენტი ადგილზე რჩება და ეკრანზე არ „დაცურავს" */
function buttonClip(w, h, bx) {
  // bx — ღილაკის მარცხენა კიდე პანელის მარცხენა კიდიდან
  return `inset(0px ${w - bx - 44}px ${h - 44}px ${bx}px round 22px)`
}
function orbFrom(bx) {
  // idle orb: 35px, (4.5, 4.5) ღილაკში → open orb: 24px, (16, 16) პანელში
  const k = 35 / 24
  return `translate(${bx + 4.5 - 16}px, ${4.5 - 16}px) scale(${k})`
}
function openFromButton() {
  stopMorph()
  const btnLeft = ai.offsetLeft
  ai.classList.add('no-geom', 'from-button', 'is-revealing')
  setState('open')
  ai.classList.add('is-settled')
  const w = ai.offsetWidth
  const h = ai.offsetHeight
  const bx = btnLeft - ai.offsetLeft
  const dur = cssMs('--btn-open-dur')
  const ease = getComputedStyle(document.documentElement).getPropertyValue('--btn-ease').trim()
  morph = [
    ai.animate([{ clipPath: buttonClip(w, h, bx) }, { clipPath: `inset(0px 0px 0px 0px round 32px)` }], { duration: dur, easing: ease }),
    $('.ai__orb').animate([{ transform: orbFrom(bx), opacity: 1 }, { transform: 'none', opacity: started ? 0 : 1 }], { duration: dur * 0.9, easing: ease }),
  ]
  morph[0].finished.then(() => {
    morph = []
    ai.classList.remove('no-geom', 'is-revealing')
  }, () => {})
}
function closeToButton() {
  stopMorph()
  ai.classList.add('no-geom', 'is-revealing', 'is-closing-btn')
  document.documentElement.classList.remove('ai-open')
  const w = ai.offsetWidth
  const h = ai.offsetHeight
  const bx = ai.parentElement.offsetWidth - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--orb-right')) || 112) - ai.offsetLeft
  const dur = cssMs('--btn-close-dur')
  const ease = getComputedStyle(document.documentElement).getPropertyValue('--btn-close-ease').trim()
  morph = [
    ai.animate([{ clipPath: `inset(0px 0px 0px 0px round 32px)` }, { clipPath: buttonClip(w, h, bx) }], { duration: dur, easing: ease, fill: 'forwards' }),
    $('.ai__orb').animate([{ transform: 'none', opacity: getComputedStyle($('.ai__orb')).opacity }, { transform: orbFrom(bx), opacity: 1 }], { duration: dur, easing: ease, fill: 'forwards' }),
  ]
  morph[0].finished.then(() => {
    // ხილული ფორმა უკვე ღილაკია — გეომეტრიას უხილავად ვცვლით და clip-ს ვხსნით
    setState('idle')
    ai.offsetWidth
    stopMorph()
    requestAnimationFrame(() => ai.classList.remove('no-geom', 'is-revealing', 'is-closing-btn', 'from-button'))
  }, () => {})
}
$('#aiTeaser').addEventListener('click', open)

/* --- საუბრის აბრა (pill): შეკეცვის ღილაკი და ჟესტები.
   ქვემოთ გაწევა → აბრა თითს მიჰყვება (რეზინასავით იჭიმება) და გაშვებისას პანელად იშლება;
   ზემოთ აწევა → ღილაკად იკეცება. საუბარი არ იკარგება — ღილაკზე დაჭერა ისევ ხსნის --- */
const collapseBtn = el('button', 'ai__collapse')
collapseBtn.type = 'button'
collapseBtn.setAttribute('aria-label', 'შეკეცვა')
ai.append(collapseBtn)
function collapsePill() {
  if (ai.classList.contains('is-proactive')) return $('.ai__dismiss')?.click() // რჩევის აბრა — „აღარ მაჩვენო"
  ai.classList.add('is-closing')
  clearTimeout(closeTimer)
  closeTimer = setTimeout(() => ai.classList.remove('is-closing'), cssMs('--close-dur') + 60)
  setState('idle')
}
collapseBtn.addEventListener('click', (e) => { e.stopPropagation(); collapsePill() })
{
  const pill = $('#aiTeaser')
  let y0 = null, dy = 0, moved = false, t0 = 0, dragEnd = 0
  pill.addEventListener('pointerdown', (e) => {
    if (ai.dataset.state !== 'teaser') return
    y0 = e.clientY
    dy = 0
    moved = false
    t0 = performance.now()
    pill.setPointerCapture?.(e.pointerId)
  })
  pill.addEventListener('pointermove', (e) => {
    if (y0 === null) return
    dy = e.clientY - y0
    if (!moved && Math.abs(dy) < 6) return
    moved = true
    ai.classList.add('is-pulling')
    const down = Math.max(0, dy)
    const up = Math.min(0, dy)
    // ქვემოთ: სიმაღლე იზრდება რეზინასავით (რაც მეტს სწევ, მით ნაკლებად იჭიმება)
    ai.style.height = `${44 + 70 * (1 - Math.exp(-down / 110))}px`
    ai.style.setProperty('--pull', Math.min(1, down / 80).toFixed(3))
    // ზემოთ: ოდნავ მიჰყვება და პატარავდება
    ai.style.transform = up ? `translateY(${up * 0.3}px) scale(${Math.max(0.9, 1 + up / 500)})` : ''
  })
  const end = () => {
    if (y0 === null) return
    y0 = null
    if (!moved) return
    const v = dy / Math.max(1, performance.now() - t0) // px/ms
    dragEnd = performance.now()
    ai.classList.remove('is-pulling')
    ai.style.transform = ''
    ai.style.removeProperty('--pull')
    if (dy > 48 || (dy > 16 && v > 0.45)) {
      // გაშვება: inline სიმაღლე იხსნება და იმავე კადრში პანელი იშლება — გადასვლა თითის ადგილიდან იწყება
      ai.style.height = ''
      pill.click()
    } else if (dy < -26 || (dy < -10 && v < -0.45)) {
      ai.style.height = ''
      collapsePill()
    } else {
      ai.style.height = '' // უკან ბრუნდება
    }
  }
  pill.addEventListener('pointerup', end)
  pill.addEventListener('pointercancel', end)
  // ჟესტის შემდეგ ბრაუზერის „ნამდვილი" click აღარ გვჭირდება (პროგრამული click — ჟესტის შედეგი — გადის)
  pill.addEventListener('click', (e) => {
    if (e.isTrusted && performance.now() - dragEnd < 400) { e.stopImmediatePropagation(); e.preventDefault() }
  }, true)
}
$('.ai__orb').addEventListener('click', () => (ai.dataset.state === 'open' ? null : open()))
backdrop.addEventListener('click', close)

/* --- ფრომფთების სია (Figma: Crypto - Ai Expanded) --- */
function chip({ id, icon, text }, small) {
  const b = el('button', 'ai-chip' + (small ? ' ai-chip--next' : ''))
  b.type = 'button'
  b.innerHTML = `<img src="${asset(icon || 'ic-ai-outline.svg')}" alt=""><span>${text}</span>`
  b.dataset.text = text
  b.addEventListener('click', () => pick(b, text, id))
  b.addEventListener('animationend', (e) => { if (e.target === b) b.style.animation = 'none' })
  return b
}

let picking = false
/* ჩიპის არჩევა: ჩიპი „იწევა", დანარჩენები ქრება, შემდეგ ჩიპი თავად გადაფრინდება კითხვის bubble-ის
   ადგილას და გზაში იცვლის ფორმას (pill → bubble), ფერს (ღია → მუქი) და ტექსტს (ერთი ხაზი → bubble-ის განლაგება) */
async function pick(b, text, id) {
  if (busy || picking) return
  picking = true
  const group = b.closest('.ai-next, .ai-prompts')
  group.querySelectorAll('.ai-chip, .ai-chip img, .ai-next__label').forEach((n) => (n.style.animation = 'none'))
  void group.offsetWidth

  // „მოჩვენება": ჩიპის ზუსტი ასლი პანელის ფენაზე, რომელიც ფრენას ასრულებს
  const ghost = makeGhost(b.getBoundingClientRect(), b.innerHTML, text, b.classList.contains('ai-chip--next') ? 'ai-ghost--next' : '')
  b.style.visibility = 'hidden'
  group.classList.add('is-picking')
  await wait(TIMING.pickHold)
  // ჯგუფი ფრენის პარალელურად რბილად იკეცება (და არა ერთბაშად ქრება), რომ პანელი არ „ჩაიკეცოს" ჩიპის ქვეშ
  group.classList.add('is-collapsing')
  collapse(group, TIMING.flyMs).then(() => group.remove())
  picking = false
  ask(text, id, (bubble) => fly(ghost, bubble))
}
// ელემენტის რბილი დაკეცვა: სიმაღლეც და მშობლის gap-იც (ზემოთ ან, თუ პირველია, ქვემოთ) ქრება,
// რომ წაშლისას არაფერი „ახტეს"
function collapse(node, duration) {
  const gap = parseFloat(getComputedStyle(node.parentElement).rowGap) || 0
  const cs = getComputedStyle(node)
  const side = node.previousElementSibling ? 'marginTop' : 'marginBottom'
  const from = { height: node.offsetHeight + 'px', [side]: cs[side] }
  const to = { height: '0px', [side]: -gap + 'px' }
  return node.animate([from, to], { duration, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'forwards' }).finished
}

function makeGhost(r, html, text, cls = '') {
  const a = ai.getBoundingClientRect()
  const ghost = el('div', 'ai-ghost ' + cls, `<span class="ai-ghost__chip">${html}</span><span class="ai-ghost__text">${text}</span>`)
  Object.assign(ghost.style, { left: r.left - a.left + 'px', top: r.top - a.top + 'px', width: r.width + 'px', height: r.height + 'px' })
  ai.append(ghost)
  return ghost
}

// ფრენა: ყოველ კადრში bubble-ის მიმდინარე ადგილს ვზომავთ (სქროლი/პანელის ზრდა რომ არ შეუშალოს)
const lerp = (x, y, t) => x + (y - x) * t
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
function fly(ghost, bubble) {
  return new Promise((done) => {
    const from = { x: parseFloat(ghost.style.left), y: parseFloat(ghost.style.top), w: parseFloat(ghost.style.width), h: parseFloat(ghost.style.height) }
    const txt = $('.ai-ghost__text', ghost)
    txt.style.width = bubble.clientWidth - 24 + 2 + 'px' // ტექსტი უკვე bubble-ის სიგანითაა — გზაში არ „გადაეწყობა"
    ghost.classList.add('is-flying')
    const t0 = performance.now()
    const step = (now) => {
      const p = Math.min(1, (now - t0) / TIMING.flyMs)
      const e = easeInOut(p)
      const a = ai.getBoundingClientRect()
      const r = bubble.getBoundingClientRect()
      const arc = Math.sin(Math.PI * e) * TIMING.flyArc // მსუბუქი რკალი ზემოთ
      ghost.style.left = lerp(from.x, r.left - a.left, e) + 'px'
      // სამიზნე bubble თავდაპირველად ქვემოთაა (ისტორია ჯერ ზემოთ სქროლავს) — ჩიპი ქვემოთ არ უნდა ჩავიდეს,
      // ამიტომ სამიზნე სიმაღლე საწყისზე დაბლა არასდროს ჩამოდის
      const ty = Math.min(r.top - a.top, from.y)
      ghost.style.top = lerp(from.y, ty, e) - arc + 'px'
      ghost.style.width = lerp(from.w, r.width, e) + 'px'
      ghost.style.height = lerp(from.h, r.height, e) + 'px'
      const r0 = Math.min(from.h / 2, 14) // მრავალხაზიან ტექსტს კუთხეები არ უნდა მოეჭრას
      ghost.style.borderRadius = `${lerp(r0, 16, e)}px ${lerp(r0, 16, e)}px ${lerp(r0, 4, e)}px ${lerp(r0, 16, e)}px`
      ghost.style.transform = `scale(${1 + Math.sin(Math.PI * p) * 0.03})`
      if (p < 1) requestAnimationFrame(step)
      else {
        bubble.style.animation = 'none' // bubble-ის საკუთარი fade-in აღარ გაეშვას
        bubble.classList.remove('is-landing')
        ghost.remove()
        done()
      }
    }
    requestAnimationFrame(step)
  })
}

function renderPrompts() {
  thread.innerHTML = ''
  const list = el('div', 'ai-prompts')
  const items = ctxCurrent
    ? (CTX_QUESTIONS[ctxCurrent.kind] || []).map((q) => ({ id: contextAnswer(ctxCurrent, q), text: q }))
    : teaserHold ? [{ id: teaserHold.id, text: teaserHold.text }, ...PROMPTS.filter((p) => p.text !== teaserHold.text)] : PROMPTS
  items.forEach((p, i) => {
    const c = chip(p)
    c.style.setProperty('--i', i)
    list.append(c)
  })
  thread.append(list)
}

/* --- 👍 / 👎 პასუხის ქვეშ (Siri-ს მსგავსად): ერთის არჩევა მეორეს აუქმებს, მსუბუქი „ამოხტომით" --- */
const THUMB = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"><path d="M7 10v10H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3Zm0 0 4-7a2 2 0 0 1 2.9 2.2L13 10h5.6a2 2 0 0 1 2 2.3l-1.2 6.5A2 2 0 0 1 17.4 20H7"/></svg>'
/* პასუხის მოქმედებები: 👍 👎 · კოპირება · თავიდან გენერაცია · კითხვის რედაქტირება.
   ბოლო ორი მხოლოდ ბოლო პასუხზე ჩანს. შეჩერებულ პასუხზე (minimal) — მხოლოდ თავიდან გენერაცია და რედაქტირება */
const ICO = (d) => `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">${d}</svg>`
const ICONS = {
  copy: ICO('<rect x="8.500" y="8.500" width="11" height="11" rx="2.500"/><path d="M15.500 8.500V6.500a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/>'),
  regen: ICO('<path d="M19.500 12a7.500 7.500 0 1 1-2.200-5.300"/><path d="M19.500 4.500v4.200h-4.200"/>'),
  edit: ICO('<path d="M4.500 19.500l1-4L16 5a2.100 2.100 0 0 1 3 3L8.500 18.500l-4 1Z"/><path d="M14 7l3 3"/>'),
  check: ICO('<path d="M5 12.500l4.500 4.500L19 7.500"/>'),
}
const turnMeta = new WeakMap() // turn → { text, id } (თავიდან გენერაციისა და რედაქტირებისთვის)
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text)
  // http-ზე (ტელეფონის ტესტი ლოკალურ ქსელში) Clipboard API მიუწვდომელია — ძველი ხერხი
  const ta = el('textarea')
  ta.value = text
  ta.style.cssText = 'position:fixed;left:-9999px;top:0'
  document.body.append(ta)
  ta.select()
  try { document.execCommand('copy') } catch {}
  ta.remove()
  return Promise.resolve()
}
function feedbackRow(turn, minimal) {
  const row = el('div', 'ai-feedback')
  const btn = (act, label, icon, cls = '') => `<button type="button" class="ai-fb ${cls}" data-act="${act}" aria-label="${label}">${icon}</button>`
  row.innerHTML = (minimal ? '' : btn('up', 'კარგი პასუხი', THUMB) + btn('down', 'ცუდი პასუხი', THUMB, 'ai-fb--down') + '<i class="ai-fb__sep"></i>' + btn('copy', 'კოპირება', ICONS.copy))
    + btn('regen', 'თავიდან', ICONS.regen) + btn('edit', 'კითხვის რედაქტირება', ICONS.edit)
  row.addEventListener('click', (e) => {
    const b = e.target.closest('.ai-fb')
    if (!b) return
    const act = b.dataset.act
    if (act === 'up' || act === 'down') {
      const on = !b.classList.contains('is-on')
      row.querySelectorAll('.ai-fb').forEach((x) => x.classList.remove('is-on'))
      b.classList.toggle('is-on', on)
    } else if (act === 'copy') {
      const text = [$('.ai-answer__title', turn)?.textContent, ...[...turn.querySelectorAll('.ai-answer__list li')].map((li, i) => `${i + 1}. ${($('b', li).textContent + $('span', li).textContent).trim()}`)].filter(Boolean).join('\n')
      copyText(text).then(() => {
        b.innerHTML = ICONS.check
        b.classList.add('is-done')
        b.setAttribute('aria-label', 'დაკოპირდა')
        setTimeout(() => { b.innerHTML = ICONS.copy; b.classList.remove('is-done'); b.setAttribute('aria-label', 'Copy') }, 1500)
      })
    } else if (act === 'regen') regenerate(turn)
    else if (act === 'edit') startEdit(turn)
  })
  return row
}
// თავიდან გენერაცია: კითხვა ადგილზე რჩება, ძველი პასუხი ქრება და ფიქრი თავიდან იწყება
function regenerate(turn) {
  const meta = turnMeta.get(turn)
  if (busy || !meta) return
  endEdit()
  const olds = [...turn.children].filter((c) => !c.classList.contains('ai-bubble'))
  olds.forEach((o) => o.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' }))
  setTimeout(() => olds.forEach((o) => o.remove()), 180)
  ask(meta.text, meta.id, null, { turn })
}
// კითხვის რედაქტირება: ტექსტი ველში ბრუნდება; გაგზავნისას ძველი კითხვა-პასუხი ახლით იცვლება
let editing = null
function startEdit(turn) {
  const meta = turnMeta.get(turn)
  if (busy || !meta) return
  endEdit()
  editing = turn
  turn.classList.add('is-editing')
  const chipEl = el('span', 'ai-ctx ai-edit', `<span class="ai-ctx__chip">${ICONS.edit}<b>კითხვის რედაქტირება</b><button type="button" aria-label="რედაქტირების გაუქმება"></button></span>`)
  $('button', chipEl).addEventListener('click', (e) => { e.preventDefault(); endEdit(); input.value = ''; autosize(); setAction() })
  $('.ai__field').prepend(chipEl)
  input.value = meta.text
  autosize()
  setAction()
  input.focus()
}
function endEdit() {
  if (editing) editing.classList.remove('is-editing')
  editing = null
  $('.ai-edit')?.remove()
}

/* --- წყაროები: პუნქტის ბოლოს ნომერი, პასუხის ქვეშ იშლებადი სია --- */
const SRC_ICON = {
  market: '<path d="M2.500 9.500 5 6.500l2 2 3.500-4.500"/>',
  news: '<path d="M2.500 3.500h7M2.500 6h7M2.500 8.500h4.500"/>',
  account: '<circle cx="6" cy="4.200" r="1.900"/><path d="M2.500 10c.4-1.800 1.800-2.800 3.500-2.800s3.100 1 3.500 2.800"/>',
  help: '<path d="M4.500 4.600a1.600 1.600 0 1 1 2.300 1.400c-.5.300-.8.600-.8 1.200"/><path d="M6 9.300v.1"/>',
}
const srcIcon = (kind) => `<span class="ai-src-ico" data-kind="${kind}"><svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.300" stroke-linecap="round" stroke-linejoin="round">${SRC_ICON[kind]}</svg></span>`
function renderSources(list) {
  const box = el('div', 'ai-sources')
  box.innerHTML = `<button type="button" class="ai-sources__toggle" aria-expanded="false"><span class="ai-sources__stack">${list.map((x) => srcIcon(x.kind)).join('')}</span><span>${AI_TXT.sources(list.length)}</span><i></i></button>
    <div class="ai-sources__list"><div>${list.map((x, i) => `<div class="ai-source" data-n="${i + 1}"><span class="ai-source__n">${i + 1}</span>${srcIcon(x.kind)}<span class="ai-source__text"><b>${x.name}</b><span>${x.detail}</span></span></div>`).join('')}</div></div>`
  $('.ai-sources__toggle', box).addEventListener('click', () => toggleSources(box))
  return box
}
function toggleSources(box, on = !box.classList.contains('is-open')) {
  box.classList.toggle('is-open', on)
  $('.ai-sources__toggle', box).setAttribute('aria-expanded', String(on))
}
function citeMark(n) {
  const b = el('button', 'ai-cite', String(n))
  b.type = 'button'
  b.setAttribute('aria-label', `წყარო ${n}`)
  // ნომერზე დაჭერა წყაროების სიას შლის და შესაბამის წყაროს ანათებს
  b.addEventListener('click', () => {
    const box = $('.ai-sources', b.closest('.ai-answer'))
    if (!box) return
    toggleSources(box, true)
    const row = $(`.ai-source[data-n="${n}"]`, box)
    row.classList.remove('is-hit')
    void row.offsetWidth
    row.classList.add('is-hit')
  })
  return b
}

/* --- შეცდომები: რეალური offline, ან კვლევისთვის ?fail=network / ?fail=action (ერთხელ, Retry მუშაობს) --- */
const failQueue = new Set((new URLSearchParams(location.search).get('fail') || '').split(',').filter(Boolean))
const takeFailure = (kind) => (failQueue.delete(kind) ? true : false)
const errorBox = (status, title, desc, buttons) =>
  el('div', 'bog-feedback ai-error', `<div class="bog-feedback__text"><p class="bog-feedback__title">${title}</p><p class="bog-feedback__desc">${desc}</p></div>`
    + (buttons ? `<div class="bog-feedback__actions">${buttons}</div>` : ''))
// offline: ველის ზემოთ პატარა ზოლი
const offlineBar = el('div', 'ai-offline', '<span></span>ინტერნეტი არ არის — პასუხები კავშირის აღდგენისას გაგრძელდება')
$('#aiPanel').insertBefore(offlineBar, form)
const syncOnline = () => ai.classList.toggle('is-offline', !navigator.onLine)
window.addEventListener('online', syncOnline)
window.addEventListener('offline', syncOnline)
syncOnline()

/* --- პასუხის ბარათები (bog-ui: Sparkline, List) --- */
const trend = (text, up) => `<span class="chg ${up ? 'chg--up' : 'chg--down'}"><span class="chg__icon"></span>${text}</span>`
const cardRows = (rows) => `<div class="ai-card__rows">${rows.map((r) => `<div class="ai-card__row"><span class="ai-card__sym">${r.sym}</span><span class="ai-card__sub">${r.name}</span>${trend(r.chg, r.up)}</div>`).join('')}</div>`
function renderCard(c) {
  const card = el('div', 'ai-card ai-card--' + c.type)
  if (c.type === 'price') {
    const logo = c.logo ? `<span class="bog-media-circle" data-size="32"><img src="${asset(c.logo)}" alt=""></span>` : ''
    card.innerHTML = `${logo}<div class="ai-card__main"><span class="ai-card__title">${c.symbol} <i>${c.name}</i></span><span class="ai-card__value">${c.price}</span>${trend(c.chg, c.up)}</div>
      <svg class="bog-sparkline ai-card__spark" data-values="${c.spark.join(',')}"${c.up ? '' : ' data-trend="negative"'}></svg>`
    BOG.sparkline($('svg', card))
  } else if (c.type === 'bars') {
    // ზოლები კატეგორიების მიხედვით: [სახელი, თანხა, ცვლილება, ფერი, კლასი (up = ცუდი/წითელი, dn = კარგი/მწვანე)]
    const max = c.max || Math.max(...c.rows.map((r) => r[1]))
    const f0 = (n) => Math.round(n).toLocaleString('en-US')
    card.innerHTML = `<div class="ai-card__main"><span class="ai-card__title">${c.title}</span>${c.value ? `<span class="ai-card__value">${c.value}</span>` : ''}${c.sub ? `<span class="ai-card__note">${c.sub}</span>` : ''}</div>
      <div class="ai-bars">${c.rows.map(([l, v, d, col, cls]) => `<div class="ai-bar"><div class="ai-bar__top"><span>${l}</span><b>${f0(v)} ₾${d ? ` <i class="ai-bar__d is-${cls || (d[0] === '+' ? 'up' : 'dn')}">${d}</i>` : ''}</b></div><span class="ai-bar__tr"><i style="width:${Math.min(100, (v / max) * 100)}%;background:${col}"></i></span></div>`).join('')}</div>`
  } else if (c.type === 'kv') {
    // ბარათი: სათაური + მთავარი ციფრი + label · value რიგები (ანაბრის შეთავაზება, შედარება)
    card.innerHTML = `<div class="ai-card__main"><span class="ai-card__title">${c.title}</span>${c.value ? `<span class="ai-card__value">${c.value}</span>` : ''}${c.sub ? `<span class="ai-card__note">${c.sub}</span>` : ''}</div>
      <div class="ai-kv">${c.rows.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('')}</div>`
  } else {
    const head = c.value ? `<div class="ai-card__main"><span class="ai-card__title">${c.title}</span><span class="ai-card__value">${c.value}</span>${trend(c.chg, c.up)}</div>` : `<span class="ai-card__title">${c.title}</span>`
    card.innerHTML = head + cardRows(c.rows)
  }
  return card
}

/* --- მოქმედებები პასუხში: ღილაკი → დადასტურება ერთი დაჭერით → შედეგი --- */
function renderActions(actions) {
  const wrap = el('div', 'ai-actions')
  const buttons = el('div', 'ai-actions__row')
  wrap.append(buttons)
  actions.forEach((a) => {
    const b = el('button', 'bog-btn', a.label)
    b.type = 'button'
    b.dataset.type = a.primary ? 'primary' : 'secondary'
    b.dataset.size = 'small'
    b.addEventListener('click', () => {
      if (a.spot) return spot(a.spot)
      if (!a.run) return confirmAction(wrap, buttons, a)
      a.run()
      if (a.done) {
        wrap.append(el('div', 'ai-done', `<span class="bog-status-icon" data-status="positive" data-size="x-small" role="img" aria-label="Done"></span>${a.done}`))
        b.remove()
        buttons.hidden = !buttons.children.length
      }
    })
    buttons.append(b)
  })
  return wrap
}
function confirmAction(wrap, buttons, a) {
  const box = el('div', 'ai-confirm', `<div class="ai-confirm__text"><b>${a.confirm.title}</b><span>${a.confirm.detail}</span></div>
    <div class="ai-confirm__btns"><button type="button" class="bog-btn" data-type="neutral" data-size="small">${AI_TXT.cancel}</button><button type="button" class="bog-btn" data-type="primary" data-size="small">${a.confirm.cta}</button></div>`)
  const [cancel, ok] = box.querySelectorAll('button')
  buttons.hidden = true
  wrap.append(box)
  cancel.addEventListener('click', () => { box.remove(); buttons.hidden = false })
  ok.addEventListener('click', async () => {
    ok.dataset.state = 'loading'
    cancel.disabled = true
    await wait(TIMING.actionMs)
    if (!navigator.onLine || takeFailure('action')) {
      // წარუმატებელი: დადასტურების ბლოკი შეცდომით იცვლება; „Try again" ისევ დადასტურებას აჩვენებს
      box.remove()
      const isAlert = /alert|შეტყობინ/i.test(a.label)
      const err = errorBox('negative', isAlert ? ACTION_ERROR.alertTitle : ACTION_ERROR.title, isAlert ? ACTION_ERROR.alertDesc : ACTION_ERROR.desc,
        '<button type="button" class="bog-btn" data-type="neutral" data-size="small" data-act="cancel">გაუქმება</button><button type="button" class="bog-btn" data-type="secondary" data-size="small" data-act="retry">თავიდან ცდა</button>')
      err.dataset.status = 'negative'
      wrap.append(err)
      err.addEventListener('click', (e) => {
        const act = e.target.closest('button')?.dataset.act
        if (!act) return
        err.remove()
        if (act === 'retry') confirmAction(wrap, buttons, a)
        else buttons.hidden = false
      })
      return
    }
    box.remove()
    wrap.append(el('div', 'ai-done', `<span class="bog-status-icon" data-status="positive" data-size="x-small" role="img" aria-label="Done"></span>${a.confirm.done}`))
    // დარჩენილი მოქმედებები (თუ იყო) ისევ ჩანს, შესრულებული — აღარ
    ;[...buttons.children].find((b) => b.textContent === a.label)?.remove()
    a.onDone?.()
    buttons.hidden = !buttons.children.length
  })
}

/* --- „Show on page": პანელი იკეცება, გვერდი ელემენტამდე სქროლავს და ის ორჯერ ანათებს --- */
function spot(target) {
  const node = typeof target === 'string'
    ? $(target)
    : [...document.querySelectorAll(`${target.list} .bog-list-item`)].find((n) => $('.bog-list-item__label', n)?.textContent === target.name)
  if (!node) return
  close()
  const body = $('[data-screen="crypto"] .screen__body')
  const y = node.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop
  setTimeout(() => {
    body.scrollTo({ top: Math.max(0, y - body.clientHeight * 0.4), behavior: reduced ? 'auto' : 'smooth' })
    node.querySelectorAll('.ai-spot__ring').forEach((n) => n.remove())
    node.classList.remove('ai-spot')
    void node.offsetWidth
    const ring = el('span', 'ai-spot__ring')
    node.classList.add('ai-spot')
    node.append(ring)
    setTimeout(() => { ring.remove(); node.classList.remove('ai-spot') }, cssMs('--spot-dur') + 600)
  }, cssMs('--btn-close-dur') * 0.6)
}

/* --- საუბარი --- */
const mic = $('#aiMic')
let stopped = false // იუზერმა პასუხი შეაჩერა

// პასუხი: id (ANSWERS-ში), მზა ობიექტი ან ფუნქცია (ითვლება კითხვის მომენტში — მაგ. ფორმის მიმდინარე მდგომარეობით)
function resolveAnswer(id) {
  let a = typeof id === 'function' ? id() : typeof id === 'object' && id ? id : ANSWERS[id]
  if (typeof a === 'function') a = a()
  if (!a) a = window.AI_FALLBACK && document.documentElement.dataset.view !== 'crypto' ? AI_FALLBACK() : ANSWERS.fallback
  return { points: [], next: [], think: 0.6, ...a }
}
async function ask(text, id, flyIn, opts = {}) {
  if (busy) return
  busy = true
  stopped = false
  if (!opts.keepFocus) input.blur()
  setAction()
  const answer = resolveAnswer(id)
  const ctx = answer.ctx
  if (ctx) setContext(null, true)

  // პირველ კითხვაზე: სათაური „BOG AI" და orb ქრება (ფრომფთების სიას pick/submit უკვე კეცავს)
  if (!started) {
    started = true
    ai.classList.add('is-chat')
  }
  // დარჩენილი ჩიპების ჯგუფები (თუ კითხვა სხვა გზით მოვიდა) რბილად იკეცება
  thread.querySelectorAll('.ai-prompts:not(.is-collapsing), .ai-next:not(.is-collapsing)').forEach((g) => {
    g.classList.add('is-collapsing', 'is-picking')
    collapse(g, TIMING.flyMs).then(() => g.remove())
  })

  let turn = opts.turn // თავიდან გენერაცია: იგივე turn და კითხვა, იცვლება მხოლოდ პასუხი
  if (turn) {
    heldH = ai.offsetHeight
    floorH = 0
  } else {
  turn = el('div', 'ai-turn')
  // opts.event: კითხვის ნაცვლად მოვლენა (შეტყობინება) — AI თავად იწყებს საუბარს
  const bubble = el('div', 'ai-bubble' + (flyIn ? ' is-landing' : '') + (opts.event ? ' is-event' : ''), text)
  if (ctx) bubble.insertAdjacentHTML('afterbegin', `<span class="ai-bubble__ctx">${ctx.name}</span>`) // რაზეა კითხვა
  turn.append(bubble)
  $('#aiConvoText').textContent = text
  // Siri-ს მსგავსად: თუ წინა მიმოწერა არსებობს, ახალი კითხვა პანელის თავში „მიიმაგრება",
  // ძველი კი ზემოთ გადის (სქროლით ისევ ჩანს). ამისთვის ბოლო turn-ს ხილული არის სიმაღლე აქვს
  const history = !!thread.querySelector('.ai-turn')
  thread.querySelectorAll('.ai-turn').forEach((t) => (t.style.minHeight = ''))
  heldH = ai.offsetHeight
  floorH = 0
  if (history) turn.style.minHeight = Math.max(0, chat.clientHeight - 8) + 'px'
  thread.append(turn)
  }
  turnMeta.set(turn, { text, id })
  if (!convo) { convo = { title: text, when: 'ახლა', nodes: null }; convos.unshift(convo) } // ახალი საუბარი ისტორიაში
  pin(turn)
  if (flyIn) await flyIn($('.ai-bubble', turn)) // ჩიპი გადაფრინდა bubble-ის ადგილას
  await wait(TIMING.bubbleToThink)

  /* 1. ფიქრი: „ცოცხალი" orb + „Thinking…" და ნაბიჯების ჟურნალი:
        მიმდინარე ნაბიჯს მფეთქავი წერტილი აქვს, დასრულებულს — ✓; ბოლოს სია იკეცება */
  const steps = answer.steps || STEPS_DEFAULT
  const status = el('button', 'ai-status is-thinking')
  status.type = 'button'
  status.innerHTML = `<span class="ai-orb"><span class="ai-orb__glow"></span><span class="ai-av"></span></span>
    <span class="ai-status__label"><span class="ai-status__text">${AI_TXT.thinking}</span><span class="ai-dots"><i></i><i></i><i></i></span></span>
    <span class="ai-status__chev"></span>`
  const stepsBox = el('div', 'ai-steps')
  const log = el('ol', 'ai-steps__log')
  stepsBox.append(log)
  turn.append(status, stepsBox)
  // ცოცხალი ქერექთერი: ფიქრობს → პასუხი მზადაა (happy) → წყნარდება
  const turnAv = window.BotAvatar?.mount($('.ai-av', status), { mood: 'thinking' })
  turnAv?.spin(true) // ფიქრისას ჰორიზონტალურად ტრიალებს

  const thinkMs = Math.max(TIMING.stepMs * steps.length, answer.think * TIMING.thinkScale)
  const t0 = performance.now()
  const failed = !navigator.onLine || takeFailure('network')
  let prev
  for (const [n, step] of steps.entries()) {
    if (stopped || (failed && n > 0)) break
    if (prev) prev.className = 'is-done'
    const li = el('li', 'is-active', `<span class="ai-steps__mark"></span><span class="ai-steps__text">${step}</span>`)
    log.append(li)
    prev = li
    await pause(thinkMs / steps.length)
  }
  if (failed && !stopped) {
    // კავშირი ვერ დამყარდა: orb ჩერდება და ნაცრისფერდება, ნაბიჯი ✓-ს არ იღებს, ქვემოთ — შეცდომა და „Try again"
    await pause(TIMING.stepMs)
    if (prev) prev.className = 'is-stopped'
    status.classList.remove('is-thinking')
    status.classList.add('is-error')
    turnAv?.spin(false)
    turnAv?.update({ mood: 'idle', reducedMotion: true })
    $('.ai-status__text', status).textContent = 'კავშირი ვერ დამყარდა'
    turn.classList.add('is-thought')
    floorH = targetH
    const offline = !navigator.onLine
    const box = errorBox('negative', offline ? 'ინტერნეტი არ არის' : 'BOG AI-სთან კავშირი ვერ დამყარდა', offline ? 'დაუკავშირდი ინტერნეტს და სცადე თავიდან.' : 'ჩვენს მხარეს რაღაც შეფერხდა. შენი კითხვა შენახულია.',
      '<button type="button" class="bog-btn" data-type="secondary" data-size="small">თავიდან ცდა</button>')
    box.dataset.status = 'negative'
    $('button', box).addEventListener('click', () => regenerate(turn))
    turn.append(box, feedbackRow(turn, true))
    busy = false
    tailUntil = performance.now() + 900
    setAction()
    return
  }
  const stoppedThinking = stopped // შეჩერდა ფიქრის დროს: ბოლო ნაბიჯი ✓-ს არ იღებს, ლეიბლი — „Stopped"
  if (prev) prev.className = stoppedThinking ? 'is-stopped' : 'is-done'
  if (!stopped) await pause(TIMING.thinkSettle)
  const secs = ((performance.now() - t0) / 1000).toFixed(1)

  // orb რბილად ჩერდება (მიმდინარე კუთხიდან 0-მდე), ლეიბლი ბუნდოვნად იცვლება, ჟურნალი იკეცება
  const orbImg = $('.ai-orb .ai-av', status)
  const from = getComputedStyle(orbImg).transform
  status.classList.remove('is-thinking')
  orbImg.animate([{ transform: from === 'none' ? 'none' : from }, { transform: 'none' }], { duration: 500, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' })
  const label = $('.ai-status__text', status)
  label.textContent = stoppedThinking ? AI_TXT.stopped : AI_TXT.thought(secs)
  label.animate([{ opacity: 0, filter: 'blur(3px)', transform: 'translateY(4px)' }, { opacity: 1, filter: 'none', transform: 'none' }], { duration: 360, easing: 'ease-out' })
  floorH = targetH
  turn.classList.add('is-thought')
  turnAv?.spin(false)
  turnAv?.update({ mood: stoppedThinking ? 'idle' : 'happy' })
  setTimeout(() => turnAv?.update({ mood: 'idle', reducedMotion: true }), 2200) // ძველი პასუხების ქერექთერები აღარ მოძრაობს
  status.addEventListener('click', () => turn.classList.toggle('is-steps-open'))
  if (!stopped) await pause(TIMING.collapseToAnswer)

  /* 2. პასუხი: სათაური მთლიანად ჩნდება, ტექსტი — „ნაკადად" (რამდენიმე სიტყვა ერთად), ბოლოში მფეთქავი კურსორით */
  if (!stopped) {
    const body = el('div', 'ai-answer')
    turn.append(body)
    if (answer.notice) {
      const n = errorBox(answer.notice.status, answer.notice.title, answer.notice.desc)
      n.dataset.status = answer.notice.status
      n.classList.add('ai-notice')
      body.append(n)
    } else body.append(el('h3', 'ai-answer__title', answer.title))
    if (answer.card) {
      body.append(renderCard(answer.card))
      await pause(TIMING.cardToText)
    }
    const ol = el('ol', 'ai-answer__list')
    body.append(ol)
    caret = el('span', 'ai-caret')
    streaming = true
    for (const [k, [lead, rest, cite]] of answer.points.entries()) {
      if (stopped) break
      const li = el('li')
      const b = el('b')
      const sp = el('span')
      li.append(b, sp)
      ol.append(li)
      await stream(b, lead)
      await stream(sp, ' ' + rest)
      if (!stopped && answer.sources) li.append(citeMark(cite || Math.min(k, answer.sources.length - 1) + 1))
    }
    streaming = false
    // კურსორი რბილად ქრება
    const c = caret
    caret = null
    c.classList.add('is-out')
    setTimeout(() => c.remove(), 300)
    if (!stopped && answer.sources) body.append(renderSources(answer.sources))
    if (!stopped && answer.actions) body.append(renderActions(answer.actions))
    if (!stopped) body.append(feedbackRow(turn))
  }
  if (stopped && !stoppedThinking) turn.append(el('p', 'ai-stopped', AI_TXT.youStopped))
  if (stopped) turn.append(feedbackRow(turn, true)) // შეჩერებულზე: თავიდან გენერაცია / რედაქტირება

  /* 3. შემდეგი ნაბიჯები */
  if (!stopped && answer.next.length) {
    await pause(TIMING.nextDelay)
    const next = el('div', 'ai-next')
    next.append(el('p', 'ai-next__label', answer.nextLabel || AI_TXT.next))
    answer.next.forEach((n, i) => {
      const c = chip(n, true)
      c.style.setProperty('--i', i)
      next.append(c)
    })
    turn.append(next)
  }
  busy = false
  tailUntil = performance.now() + 900
  setAction()
  // პანელი დახურულია: ღილაკი/აბრა ერთხელ ანათებს და წერტილით ანიშნებს, რომ პასუხი მზადაა
  if (ai.dataset.state !== 'open' && !stopped) {
    ai.classList.add('has-unread', 'is-glowing')
    setTimeout(() => ai.classList.remove('is-glowing'), cssMs('--teaser-glow') + 400)
  }
}

// ნაკადი: სიტყვები თანაბარი ტემპით, პაუზების გარეშე; თითო სიტყვა ბუნდოვნიდან ჩნდება.
// ცვლილებები (+5.3% / -1.1%) ჩნდება და მერე ფერდება
let caret = null
const isUp = (w) => /^\(?\+\d.*%/.test(w)
const isDown = (w) => /^\(?[-−]\d.*%/.test(w)
async function stream(node, text) {
  for (const w of text.split(/(\s+)/).filter(Boolean)) {
    if (stopped) return
    if (!w.trim()) { node.append(w); continue }
    const span = el('span', 'w', w)
    if (isUp(w)) span.classList.add('w--up')
    else if (isDown(w)) span.classList.add('w--down')
    node.append(span)
    if (caret) node.append(caret) // კურსორი ყოველთვის ბოლო სიტყვის შემდეგაა
    await pause(TIMING.wordDelay)
  }
}

// მიდევნება: ახალი კითხვა თავში, გრძელი პასუხი — ბოლოში; იუზერი თუ თითით სქროლავს, ვჩერდებით
let follow = true
// იუზერი თითით ზემოთ ასქროლავს → მიდევნება ჩერდება; ბოლოში დაბრუნებისას — გრძელდება
chat.addEventListener('touchmove', () => (userScrolling = true), { passive: true })
chat.addEventListener('wheel', () => (userScrolling = true), { passive: true })
chat.addEventListener('scroll', () => {
  if (!userScrolling) return
  // იუზერი ბოლოში დაბრუნდა → მიდევნება გრძელდება
  follow = chat.scrollHeight - chat.scrollTop - chat.clientHeight < 40
}, { passive: true })
chat.addEventListener('touchend', () => setTimeout(() => (userScrolling = false), 600), { passive: true })
let userScrolling = false
function edges() {
  chat.classList.toggle('no-scroll', chat.scrollHeight <= chat.clientHeight + 1) // სქროლი არ არის → ჩატზეც შეიძლება ჟესტის დაწყება
  chat.classList.toggle('has-above', chat.scrollTop > 2)
  chat.classList.toggle('has-below', chat.scrollHeight - chat.scrollTop - chat.clientHeight > 2)
}
chat.addEventListener('scroll', edges, { passive: true })
new ResizeObserver(edges).observe(inner)

function pin(turn) {
  pinned = turn
  follow = true
  userScrolling = false
  S.x = chat.scrollTop
  S.v = 0
}

/* --- მარჯვენა ღილაკი: მიკროფონი / გაგზავნა (ტექსტისას) / შეჩერება (პასუხისას) --- */
function setAction() {
  const mode = busy ? 'stop' : listening ? 'listen' : input.value.trim() ? 'send' : 'mic'
  mic.dataset.mode = mode
  mic.setAttribute('aria-label', { stop: 'შეჩერება', listen: 'მოსმენის შეწყვეტა', send: 'გაგზავნა', mic: 'ხმით' }[mode])
  ai.classList.toggle('is-busy', busy) // დახურულ ღილაკზე/აბრაზე orb „ფიქრობს", სანამ პასუხი იწერება
  if (busy !== wasBusy) {
    clearTimeout(happyTimer)
    mainAvatar?.spin(busy)
    if (busy) mainAvatar?.update({ mood: 'thinking' })
    else { mainAvatar?.update({ mood: 'happy' }); happyTimer = setTimeout(() => mainAvatar?.update({ mood: 'idle' }), 1800) }
    wasBusy = busy
  }
}
let wasBusy = false
let happyTimer
// მთავარი ღილაკის ქერექთერი (avatar.js)
const mainAvatar = window.BotAvatar?.mount($('.ai__orb'), { mood: 'idle' })
mic.addEventListener('click', () => {
  const mode = mic.dataset.mode
  if (mode === 'stop') { stopped = true; flushPauses() }
  else if (mode === 'send') form.requestSubmit()
  else setListening(mode === 'mic')
})

/* --- ხმის რეჟიმი (პროტოტიპი — მიკროფონი რეალურად არ ირთვება, საუბარი სიმულირებულია).
   შეყვანის ზოლს ცვლის ხმის ზოლი: ცოცხალი ტრანსკრიპტი, ხმის დონეზე მორეაგირე orb და ტალღა, გაუქმება / გაგზავნა.
   ფაზები: სიჩუმე („Listening…") → საუბარი (სიტყვები რიგრიგობით, დონე მაღალია) → სიჩუმე → თავისით იგზავნება --- */
const voice = el('div', 'ai-voice', `<p class="ai-voice__text"><span class="ai-voice__hint">გისმენ…</span><span class="ai-voice__words"></span></p>
  <div class="ai-voice__row">
    <button type="button" class="ai__round" data-act="cancel" aria-label="ხმის გაუქმება">${'<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 5l10 10M15 5 5 15"/></svg>'}</button>
    <div class="ai-voice__wave"><span class="ai-voice__bars">${'<i></i>'.repeat(7)}</span><span class="ai-voice__orb"><i></i><img src="${asset('bog-ai.svg')}" alt=""></span><span class="ai-voice__bars">${'<i></i>'.repeat(7)}</span></div>
    <button type="button" class="ai__round ai-voice__send" data-act="send" aria-label="გაგზავნა" disabled><img src="${asset('ic-send.svg')}" alt=""></button>
  </div>`)
$('#aiPanel').append(voice)
ro.observe(voice)
const voiceWords = $('.ai-voice__words', voice)
const voiceBars = [...voice.querySelectorAll('.ai-voice__bars i')]
let voiceTimers = []
let speaking = false
let voiceText = ''
const later = (fn, ms) => voiceTimers.push(setTimeout(fn, ms))

function setListening(on) {
  if (listening === on) return
  listening = on
  voiceTimers.splice(0).forEach(clearTimeout)
  speaking = false
  ai.classList.toggle('is-voice', on)
  setAction()
  if (!on) return
  input.blur()
  toggleMenu(false)
  voiceText = ''
  voiceWords.textContent = ''
  voice.classList.remove('has-words')
  $('.ai-voice__send', voice).disabled = true
  // „საუბრის" სცენარი
  let t = TIMING.listenMs
  VOICE_SAMPLE.split(' ').forEach((w, i, all) => {
    later(() => {
      speaking = true
      voiceText += (voiceText ? ' ' : '') + w
      voiceWords.append(i ? ' ' : '', el('span', 'w', w))
      voice.classList.add('has-words')
      $('.ai-voice__send', voice).disabled = false
      if (i === all.length - 1) {
        later(() => (speaking = false), 320)
        if (TIMING.voiceSendMs) later(sendVoice, 320 + TIMING.voiceSendMs)
      }
    }, t)
    t += TIMING.voiceWordMs * (0.7 + Math.random() * 0.6)
  })
  voiceLoop()
}

// ხმის დონის სიმულაცია: orb და ტალღის ზოლები ყოველ კადრში მიჰყვება
let lvl = 0
function voiceLoop() {
  if (!listening) { voice.style.setProperty('--lvl', 0); return }
  const t = performance.now() / 1000
  const target = speaking ? 0.5 + 0.35 * Math.sin(t * 9) * Math.sin(t * 3.1) + Math.random() * 0.15 : 0.06 + 0.04 * Math.sin(t * 2)
  lvl += (Math.max(0, target) - lvl) * 0.22
  voice.style.setProperty('--lvl', lvl.toFixed(3))
  voiceBars.forEach((b, i) => {
    const centre = 1 - Math.abs((i % 7) - 3) / 4 // შუა ზოლები უფრო მაღალია
    const wob = 0.55 + 0.45 * Math.sin(t * (7 + (i % 7) * 1.3) + i)
    b.style.setProperty('--h', (lvl * centre * wob).toFixed(3))
  })
  requestAnimationFrame(voiceLoop)
}

// გაგზავნა: ტრანსკრიპტი ხმის ზოლიდან „აფრინდება" კითხვის bubble-ად (როგორც აკრეფილი ტექსტი)
function sendVoice() {
  const text = voiceText.trim()
  if (!listening || !text || busy || picking) return setListening(false)
  const r = voiceWords.getBoundingClientRect()
  const ghost = makeGhost(r, `<span class="ai-ghost__field">${text}</span>`, text, 'ai-ghost--field')
  $('.ai-ghost__chip', ghost).style.width = r.width + 'px'
  setListening(false)
  const group = chipGroup()
  if (group) {
    group.classList.add('is-collapsing', 'is-picking')
    collapse(group, TIMING.flyMs).then(() => group.remove())
  }
  ask(text, ctxCurrent ? contextAnswer(ctxCurrent, text) : answerFor(text), (bubble) => fly(ghost, bubble))
}
voice.addEventListener('click', (e) => {
  const act = e.target.closest('button')?.dataset.act
  if (act === 'cancel') setListening(false)
  else if (act === 'send') sendVoice()
})

/* --- „+" მენიუ (პროტოტიპი): სამი მიმაგრების ვარიანტი; არჩევა მხოლოდ ხურავს --- */
const plus = $('.ai__bar .ai__round')
const ICON = (d) => `<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`
const menu = el('div', 'ai-menu', [
  ['ფოტო', '<rect x="1.5" y="4" width="13" height="9.5" rx="2.5"/><circle cx="8" cy="8.8" r="2.4"/><path d="M5.5 4l1-1.5h3l1 1.5"/>'],
  ['ფაილი', '<path d="M9 1.5H4.5A1.5 1.5 0 0 0 3 3v10a1.5 1.5 0 0 0 1.5 1.5h7A1.5 1.5 0 0 0 13 13V5.5L9 1.5Z"/><path d="M9 1.5v4h4"/>'],
  ['ჩემი პორტფელი', '<path d="M8 1.5A6.5 6.5 0 1 0 14.5 8H8V1.5Z"/><path d="M10.5 1.9a6.5 6.5 0 0 1 3.6 3.6h-3.6V1.9Z"/>'],
].map(([t, d]) => `<button type="button">${ICON(d)}${t}</button>`).join(''))
$('#aiPanel').append(menu)
function toggleMenu(on) {
  menu.style.bottom = form.offsetHeight + 28 + 'px'
  ai.classList.toggle('is-menu', on)
  plus.setAttribute('aria-expanded', String(on))
}
plus.addEventListener('click', () => toggleMenu(!ai.classList.contains('is-menu')))
$('#aiPanel').addEventListener('click', (e) => { if (!plus.contains(e.target)) toggleMenu(false) })
// გაგზავნაზე ველი ფოკუსს არ კარგავს (iOS-ზე კლავიატურა არ დაიხურება და ხელახლა არ გაიხსნება)
mic.addEventListener('pointerdown', (e) => { if (mic.dataset.mode === 'send') e.preventDefault() })

/* --- აკრეფა (Figma: Crypto - Typing) ---
   ველი იზრდება inputMaxLines ხაზამდე; აკრეფისას ხილული ჩიპები იფილტრება და დამთხვევა მუქდება */
const LINE = 22
// სიმაღლეს ვზომავთ უხილავ ასლზე, რომ ნამდვილმა ველმა ახალ ხაზზე რბილად გაიზარდოს (height transition)
const mirror = el('textarea', 'ai-mirror')
mirror.rows = 1
mirror.tabIndex = -1
mirror.setAttribute('aria-hidden', 'true')
document.body.append(mirror)
function autosize() {
  mirror.style.width = input.clientWidth + 'px'
  mirror.value = input.value || ' '
  const h = Math.min(Math.max(LINE, mirror.scrollHeight), LINE * TIMING.inputMaxLines)
  input.style.height = h + 'px'
  form.classList.toggle('is-multiline', h > LINE + 2)
}
const chipGroup = () => [...thread.querySelectorAll('.ai-prompts:not(.is-collapsing), .ai-next:not(.is-collapsing)')].pop()
function filterChips() {
  const q = input.value.trim().toLowerCase()
  const group = chipGroup()
  if (!group) return
  group.querySelectorAll('.ai-chip').forEach((c) => {
    const t = c.dataset.text
    const i = q ? t.toLowerCase().indexOf(q) : -1
    c.classList.toggle('is-filtered', !!q && i < 0)
    c.querySelector('span').innerHTML = i >= 0 ? `${t.slice(0, i)}<mark>${t.slice(i, i + q.length)}</mark>${t.slice(i + q.length)}` : t
  })
}
input.addEventListener('input', () => {
  autosize()
  setAction()
  filterChips()
})
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault()
    form.requestSubmit()
  }
})

// აკრეფილი კითხვის პასუხი: ზუსტი ფრომფთი → საკვანძო სიტყვა (data.js: KEYWORDS) → ზოგადი
function answerFor(text) {
  const t = text.toLowerCase()
  if (window.AI_ROUTE) { const r = AI_ROUTE(t); if (r) return r }
  const exact = PROMPTS.find((p) => p.text.toLowerCase() === t)
  if (exact) return exact.id
  const hit = KEYWORDS.find(([words]) => words.some((w) => new RegExp('\\b' + w).test(t)))
  return hit ? hit[1] : 'fallback'
}

// გაგზავნა: აკრეფილი ტექსტი ველიდან „აფრინდება" და კითხვის bubble-ად იქცევა
const measure = document.createElement('canvas').getContext('2d')
form.addEventListener('submit', (e) => {
  e.preventDefault()
  const text = input.value.trim()
  if (!text || busy || picking) return
  setListening(false)
  const f = input.getBoundingClientRect()
  measure.font = getComputedStyle(input).font
  const oneLine = !form.classList.contains('is-multiline')
  const r = { left: f.left, top: oneLine ? f.top + (f.height - LINE) / 2 : f.top, width: Math.min(measure.measureText(text).width + 2, f.width), height: oneLine ? LINE : f.height }
  const ghost = makeGhost(r, `<span class="ai-ghost__field">${text}</span>`, text, 'ai-ghost--field')
  $('.ai-ghost__chip', ghost).style.width = f.width + 'px' // ტექსტი ველის სიგანით, რომ ხაზები არ გადაეწყოს
  input.value = ''
  autosize()
  filterChips()
  setAction()
  // ჩიპების ჯგუფი ფრენისას იკეცება (როგორც ჩიპის არჩევისას)
  const group = chipGroup()
  if (group) {
    group.classList.add('is-collapsing', 'is-picking')
    collapse(group, TIMING.flyMs).then(() => group.remove())
  }
  // რედაქტირება: ძველი კითხვა-პასუხი ქრება და ახალი მის ადგილს იკავებს (კონტექსტი, თუ ჰქონდა, რჩება)
  const old = editing
  const oldId = old && turnMeta.get(old).id
  endEdit()
  if (old) old.remove()
  const answerId = ctxCurrent ? contextAnswer(ctxCurrent, text) : oldId && typeof oldId === 'object' && oldId.ctx ? contextAnswer(oldId.ctx, text) : answerFor(text)
  ask(text, answerId, (bubble) => fly(ghost, bubble), { keepFocus: true })
})
input.addEventListener('focus', () => ai.classList.add('is-typing'))
input.addEventListener('blur', () => ai.classList.remove('is-typing'))

/* --- ჟესტით დახურვა: პანელი ზემოდან ჩამოდის, ამიტომ ზემოთ „აწევით" იკეცება (როგორც iOS-ის შეტყობინებების ფარდა).
   იწყება ქვედა სახელურიდან, შეყვანის ზოლის ცარიელი ადგილიდან ან ჩატიდან (თუ ის არ სქროლავს).
   პანელის ქვედა კიდე თითს მიჰყვება; გაშვებისას — იხურება (≥ dragClose ან სწრაფი აწევა) ან რბილად ბრუნდება */
ai.append(el('span', 'ai__grab'))
let drag = null
const dragZone = (t) => {
  if (ai.dataset.state !== 'open' || isFull() || t.closest('button, textarea, .ai-menu, .ai-history')) return false
  return !!t.closest('.ai__grab, .ai__bar') || (!!t.closest('.ai__chat') && chat.classList.contains('no-scroll'))
}
ai.addEventListener('pointerdown', (e) => {
  if (!dragZone(e.target) || !ai.classList.contains('is-settled')) return
  drag = { id: e.pointerId, y: e.clientY, h: ai.offsetHeight, active: false, samples: [[e.timeStamp, e.clientY]] }
})
ai.addEventListener('pointermove', (e) => {
  if (!drag || e.pointerId !== drag.id) return
  const dy = e.clientY - drag.y
  if (!drag.active) {
    if (Math.abs(dy) < 8) return
    drag.active = true
    try { ai.setPointerCapture(drag.id) } catch {}
    ai.classList.add('is-dragging')
    toggleMenu(false)
  }
  drag.samples.push([e.timeStamp, e.clientY])
  if (drag.samples.length > 5) drag.samples.shift()
  // ზემოთ: 1:1; ქვემოთ: „რეზინა" (მაქს. +36px)
  dragH = dy < 0 ? Math.max(56, drag.h + dy) : drag.h + Math.min(72, dy * 0.45)
  const progress = Math.min(1, Math.max(0, -dy) / (drag.h - 56))
  ai.style.setProperty('--drag', progress.toFixed(3))
})
const endDrag = (e) => {
  if (!drag || e.pointerId !== drag.id) return
  const d = drag
  drag = null
  if (!d.active) return
  const [t0, y0] = d.samples[0]
  const velocity = (e.clientY - y0) / Math.max(1, e.timeStamp - t0) // px/ms, უარყოფითი = ზემოთ
  const dy = e.clientY - d.y
  const shouldClose = e.type !== 'pointercancel' && dy < 0 && (-dy / (d.h - 56) > TIMING.dragClose || (velocity < -0.5 && dy < -24))
  ai.classList.remove('is-dragging')
  ai.style.removeProperty('--drag')
  dragH = null
  if (shouldClose) close()
  else if (e.type !== 'pointercancel' && dy > TIMING.dragExpand) setFull(true) // ქვემოთ ჩამოწევა → სრული ეკრანი
  // დაჭერა ჟესტის ბოლოს click-ად არ ჩაითვალოს
  const swallow = (ev) => { ev.stopPropagation(); ev.preventDefault() }
  window.addEventListener('click', swallow, { capture: true, once: true })
  setTimeout(() => window.removeEventListener('click', swallow, { capture: true }), 80)
}
ai.addEventListener('pointerup', endDrag)
ai.addEventListener('pointercancel', endDrag)

/* ===================== კონტექსტური შესვლა =====================
   1) ხანგრძლივი დაჭერა გვერდის ელემენტზე (სიის რიგი, გრაფიკი) → მენიუ „Ask BOG AI about this" + მზა კითხვები
   2) ელემენტი კითხვას კონტექსტად მიებმება: ჩიპი შეყვანის ველში, ტეგი კითხვის bubble-ში, მორგებული პასუხი
   3) აბრა სთავაზობს ფრომფთს იმ სექციისთვის, რომელსაც იუზერი უყურებს */
let ctxCurrent = null
const layer = $('.ai-layer')
const pageBody = $('[data-screen="crypto"] .screen__body')

function contextOf(node) {
  // ბანკის ეკრანები: ელემენტი თავად ამბობს, რა არის (data-ctx) — ai-bank.js: BANK_CTX
  if (node.dataset.ctx && window.BANK_CTX) return BANK_CTX(node)
  if (node.matches('.chart, .price')) return { kind: 'chart', name: 'პორტფელის გრაფიკი', sub: 'ეს კვირა', node: $('.chart') }
  const list = node.closest('#portfolios, #stocks, #transactions')
  const chg = $('.chg', node)
  const img = $('.bog-media-circle img', node)
  return {
    kind: !list ? 'balance' : list.id === 'portfolios' ? 'portfolio' : list.id === 'stocks' ? 'stock' : 'tx',
    name: $('.bog-list-item__label', node)?.textContent || '',
    sub: $('.bog-list-item__secondary', node)?.textContent || '',
    value: $('.bog-list-item__value', node)?.textContent || '',
    chg: chg ? chg.textContent.trim() : '',
    up: chg ? chg.classList.contains('chg--up') : true,
    logo: img ? img.getAttribute('src').replace('assets/', '') : null,
    node,
  }
}

// კონტექსტზე მორგებული პასუხი (ტექსტები პროტოტიპისთვისაა; რიცხვები თავად ელემენტიდან მოდის)
function contextAnswer(c, q) {
  if (c.bank && window.BANK_CTX_ANSWER) return BANK_CTX_ANSWER(c, q)
  const i = (CTX_QUESTIONS[c.kind] || []).indexOf(q)
  const dir = c.up ? 'up' : 'down'
  let title = c.name, points, card
  if (c.kind === 'portfolio' || c.kind === 'stock') {
    const base = 100, drift = c.up ? 0.5 : -0.5
    card = { type: 'price', logo: c.logo, symbol: c.name, name: c.sub, price: c.value, chg: c.chg, up: c.up, spark: Array.from({ length: 12 }, (_, k) => base + drift * k + Math.sin(k * 1.7) * 1.2) }
    points = i === 0 ? [
      ['დღეს:', `${c.name} ${c.up ? 'გაიზარდა' : 'შემცირდა'} ${c.chg}-ით.`],
      [c.up ? 'რამ შეუწყო ხელი:' : 'რამ დაწია:', c.up ? 'ზრდას ალტკოინები ქაჩავენ, ბიტკოინი სტაბილურია.' : 'კრიპტო ბაზარზე დღეს რისკის თავიდან არიდების განწყობაა.'],
      ['ფართო სურათი:', 'ცვლილება მცირეა და ჩვეულებრივი დღიური რყევის ფარგლებშია.'],
    ] : i === 1 ? [
      ['მოკლედ:', c.kind === 'stock' ? 'ლოდინიც ლოგიკურია — დღევანდელი მოძრაობა გრძელვადიან სურათს არ ცვლის.' : 'ახლა ცვლილება არ სჭირდება — შენი ინვესტიციების ჯანსაღ წილს შეადგენს.'],
      ['დააკვირდი:', 'თუ ინვესტიციების მესამედს გადააჭარბებს, შეგიძლია ნაწილი შეამცირო.'],
    ] : [
      [`${c.name}:`, `ღირს ${c.value}, დღეს ${c.up ? 'გაიზარდა' : 'შემცირდა'} ${c.chg}-ით.`],
      ['რჩევა:', 'მკითხე, რატომ შეიცვალა ან ღირს თუ არა გადანაწილება.'],
    ]
  } else if (c.kind === 'tx') {
    const amount = c.value.replace('-', '')
    const fee = c.sub.includes('საკომისიო')
    title = fee ? 'ამ საკომისიოს შესახებ' : 'ამ ყიდვის შესახებ'
    points = fee ? [
      ['რა არის:', `${amount} საკომისიო შენი ${c.name}-ის შეკვეთისთვის.`],
      ['რატომ:', 'ყოველ ყიდვა-გაყიდვას ფიქსირებული საკომისიო აქვს, რომელიც დადასტურებამდე ჩანს.'],
      ['როგორ გადაიხადო ნაკლები:', 'ნაკლები, მაგრამ დიდი შეკვეთები ნაკლებ საკომისიოს ნიშნავს.'],
    ] : [
      ['რა არის:', `${c.name} იყიდე ${amount}-ად.`],
      ['როგორ შესრულდა:', 'შეკვეთა შესრულდა იმ ფასად, რომელიც განთავსების მომენტში იყო.'],
      ['ახლა:', 'კრიპტო შენს კრიპტოვალუტებშია.'],
    ]
  } else if (c.kind === 'chart') {
    title = i === 1 ? 'რატომ დაეცა' : 'ეს კვირა'
    points = i === 1 ? [
      ['მინიმუმი:', `კვირის შუაში პორტფელი ${CRYPTO.$(CRYPTO.total - 4.71)}-მდე ჩამოვიდა.`],
      ['რატომ:', 'კრიპტო ბაზარზე ერთი რთული დღე იყო და აქტივების უმეტესობა ერთად შემცირდა.'],
      ['მას შემდეგ:', `აღდგა ${CRYPTO.$(CRYPTO.total)}-მდე.`],
    ] : [
      ['დიაპაზონი:', `ამ კვირაში პორტფელი ${CRYPTO.$(CRYPTO.total - 4.71)}-სა და ${CRYPTO.$(CRYPTO.total + 0.64)}-ს შორის მერყეობდა.`],
      ['ვარდნა:', 'კვირის შუაში ბაზრის ნეგატიურმა განწყობამ დაწია, მერე აღდგა.'],
      ['ახლა:', `ახლა ${CRYPTO.$(CRYPTO.total)}-ია, დღეს +${CRYPTO.todayPct.toFixed(2)}%.`],
    ]
  } else {
    title = 'საინვესტიციო თანხა'
    points = [
      ['ხელმისაწვდომია:', `ჩასადებად გაქვს ${c.value}.`],
      ['იდეები:', 'შეავსე პორტფელი ან ჩართე რეგულარული ყიდვა, რომ ავტომატურად ჩაიდოს.'],
    ]
  }
  const sources = c.kind === 'tx' ? [SOURCES.account, SOURCES.tariffs] : [SOURCES.account, SOURCES.market]
  return { ctx: c, steps: [`ვუყურებ: ${c.name}`, 'ვამოწმებ დღევანდელ მონაცემებს'], think: 0.7, title, card, points, sources, next: [] }
}

// კონტექსტის ჩიპი შეყვანის ველში
function setContext(c, silent) {
  ctxCurrent = c
  $('.ai-ctx')?.remove()
  if (c) {
    const media = c.logo ? `<img src="${asset(c.logo)}" alt="">` : `<img src="${asset('ic-ai-outline.svg')}" alt="">`
    const chipEl = el('span', 'ai-ctx', `<span class="ai-ctx__chip">${media}<b>${c.name}</b><button type="button" aria-label="კონტექსტის მოშორება"></button></span>`)
    $('button', chipEl).addEventListener('click', (e) => { e.preventDefault(); setContext(null) })
    $('.ai__field').prepend(chipEl)
  }
  if (!silent && !started && ai.dataset.state === 'open') renderPrompts()
}

async function openWithContext(c, q) {
  if (q) {
    // მზა კითხვა: პანელი პირდაპირ ამ კითხვით იხსნება
    if (!started) { started = true; ai.classList.add('is-chat'); thread.innerHTML = '' }
    if (ai.dataset.state !== 'open') { open(); await wait(460) }
    ask(q, contextAnswer(c, q))
  } else {
    setContext(c, true)
    if (ai.dataset.state !== 'open') open()
    else if (!started) renderPrompts()
  }
}

// მენიუ
const pop = el('div', 'ctx-pop')
const popBack = el('div', 'ctx-back')
layer.append(popBack, pop)
let popCtx = null
function flash(node) {
  node.querySelectorAll('.ai-spot__ring').forEach((n) => n.remove())
  node.classList.remove('ai-spot')
  void node.offsetWidth
  const ring = el('span', 'ai-spot__ring')
  node.classList.add('ai-spot')
  node.append(ring)
  setTimeout(() => { ring.remove(); node.classList.remove('ai-spot') }, cssMs('--spot-dur') + 600)
}
function showPop(c) {
  popCtx = c
  pop.innerHTML = `<button type="button" class="ctx-pop__head"><img src="${asset('bog-ai.svg')}" alt=""><span>ჰკითხე BOG AI-ს ამაზე</span></button>`
    + (CTX_QUESTIONS[c.kind] || []).map((q) => `<button type="button" class="ctx-pop__q">${q}</button>`).join('')
  const L = layer.getBoundingClientRect()
  const r = c.node.getBoundingClientRect()
  const h = pop.offsetHeight
  const below = r.bottom - L.top + 8
  const fits = below + h < L.height - 110
  pop.style.top = (fits ? below : r.top - L.top - h - 8) + 'px'
  pop.style.transformOrigin = fits ? '24px 0' : '24px 100%'
  layer.classList.add('has-pop')
  flash(c.node)
}
function hidePop() {
  layer.classList.remove('has-pop')
  popCtx = null
}
popBack.addEventListener('click', hidePop)
pop.addEventListener('click', (e) => {
  const b = e.target.closest('button')
  if (!b || !popCtx) return
  const c = popCtx
  hidePop()
  openWithContext(c, b.classList.contains('ctx-pop__q') ? b.textContent : null)
})

// ხანგრძლივი დაჭერა
let lp = null
let lpFired = false
const cancelLp = () => {
  if (!lp) return
  clearTimeout(lp.t)
  clearTimeout(lp.p)
  lp.node.classList.remove('ctx-pressing')
  lp = null
}
// ნებისმიერ ეკრანზე: body — სქროლის კონტეინერი, sel — რომელ ელემენტებზე მუშაობს ხანგრძლივი დაჭერა
function bindLongPress(body, sel) {
  body.addEventListener('pointerdown', (e) => {
    lpFired = false
    const node = e.target.closest(sel)
    if (!node || ai.dataset.state === 'open') return
    cancelLp()
    lp = {
      node, x: e.clientX, y: e.clientY,
      p: setTimeout(() => node.classList.add('ctx-pressing'), 130),
      t: setTimeout(() => {
        const n = lp.node
        cancelLp()
        lpFired = true
        if (navigator.vibrate && navigator.userActivation?.hasBeenActive) navigator.vibrate(10)
        showPop(contextOf(n))
      }, TIMING.longPress),
    }
  })
  body.addEventListener('pointermove', (e) => { if (lp && Math.hypot(e.clientX - lp.x, e.clientY - lp.y) > 8) cancelLp() })
  ;['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => body.addEventListener(t, cancelLp))
  body.addEventListener('scroll', cancelLp, { passive: true })
  body.addEventListener('click', (e) => { if (lpFired) { lpFired = false; e.stopPropagation(); e.preventDefault() } }, true)
  body.addEventListener('contextmenu', (e) => { if (e.target.closest(sel)) e.preventDefault() })
}
bindLongPress(pageBody, '.bog-list-item, .chart, .price')
window.bindLongPress = bindLongPress

// აბრა სექციის მიხედვით: როცა იუზერი ახალ სექციამდე ჩასქროლავს, აბრა (ან ღილაკი — ხელახლა იშლება) მის ფრომფთს აჩვენებს
let sectionSel = null
let holdTimer
function sectionInView() {
  for (const sp of [...SECTION_PROMPTS].reverse()) if ($(sp.sel).getBoundingClientRect().top < window.innerHeight * 0.55) return sp
  return null
}
function endSuggest() {
  clearTimeout(holdTimer)
  if (!teaserHold) return
  teaserHold = null
  ai.classList.remove('is-suggest')
  if (started || ai.dataset.state !== 'teaser') return
  if (teaserDone) setState('idle')
  else swapTeaser(PROMPTS[teaserIndex].text)
}
function suggest(sp) {
  clearTimeout(holdTimer)
  teaserHold = sp
  ai.classList.add('is-suggest')
  if (ai.dataset.state === 'idle') { setState('teaser'); typeTeaser(sp.text) }
  else swapTeaser(sp.text)
  holdTimer = setTimeout(endSuggest, TIMING.suggestMs)
}
let scrollTick = false
pageBody.addEventListener('scroll', () => {
  if (scrollTick) return
  scrollTick = true
  requestAnimationFrame(() => {
    scrollTick = false
    const sp = sectionInView()
    const sel = sp ? sp.sel : null
    if (sel === sectionSel) return
    sectionSel = sel
    if (started || ai.dataset.state === 'open' || (document.documentElement.dataset.view || 'crypto') !== 'crypto') return
    if (sp) suggest(sp)
    else endSuggest()
  })
}, { passive: true })

/* --- სრული ეკრანი: გაშლის ღილაკი (საუბრისას, ზედა მარცხენა კუთხე) ან სახელურის ქვემოთ ჩამოწევა.
   ზემოთ ჩნდება სათაური: შემცირება (უკან პანელად) · BOG AI · დახურვა --- */
const SVG = (d) => `<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`
const expandBtn = el('button', 'ai__expand', SVG('<path d="M11.5 3.500h5v5M16.500 3.500 11 9M8.500 16.500h-5v-5M3.500 16.500 9 11"/>'))
expandBtn.type = 'button'
expandBtn.setAttribute('aria-label', 'სრულ ეკრანზე გაშლა')
ai.append(expandBtn)
const head = el('div', 'ai__head', `<button type="button" class="ai__head-btn" data-act="collapse" aria-label="პანელზე დაბრუნება">${SVG('<path d="M16.500 8.500h-5v-5M11.500 8.500 17 3M3.500 11.500h5v5M8.500 11.500 3 17"/>')}</button>
  <span class="ai__head-title"><img src="${asset('bog-ai.svg')}" alt="">BOG AI</span>
  <button type="button" class="ai__head-btn" data-act="close" aria-label="დახურვა">${SVG('<path d="M5 5l10 10M15 5 5 15"/>')}</button>`)
$('#aiPanel').prepend(head)
function setFull(on) {
  if (isFull() === on || ai.dataset.state !== 'open') return
  toggleMenu(false)
  ai.classList.toggle('is-full', on)
  document.documentElement.classList.toggle('ai-full', on)
}
expandBtn.addEventListener('click', () => setFull(true))
head.addEventListener('click', (e) => {
  const act = e.target.closest('button')?.dataset.act
  if (act === 'collapse') setFull(false)
  else if (act === 'close') close()
  else if (act === 'history') toggleHistory(true)
  else if (act === 'new') newChat()
})

/* ===================== ახალი საუბარი და ისტორია =====================
   convos — საუბრების სია (ახალი ზემოთ). მიმდინარე საუბრის turn-ები thread-შია; სხვაზე გადასვლისას
   მათი DOM ინახება (nodes) და დაბრუნებისას იგივე ბრუნდება. წინასწარ შევსებული საუბრები (HISTORY)
   პირველ გახსნაზე აეწყობა instantTurn-ით — ანიმაციის გარეშე, დასრულებული პასუხებით */
const convos = HISTORY.map((h) => ({ title: h.title, when: h.when, seed: h.turns, nodes: null }))
let convo = null // მიმდინარე საუბარი (null = ჯერ არაფერი უკითხავს)

function fillText(node, text) {
  for (const w of text.split(/(\s+)/).filter(Boolean)) {
    if (!w.trim()) { node.append(w); continue }
    const span = el('span', 'w', w)
    if (isUp(w)) span.classList.add('w--up')
    else if (isDown(w)) span.classList.add('w--down')
    node.append(span)
  }
}
function instantTurn(text, id) {
  const answer = resolveAnswer(id)
  const turn = el('div', 'ai-turn no-anim is-thought')
  const status = el('button', 'ai-status')
  status.type = 'button'
  status.innerHTML = `<span class="ai-orb"><span class="ai-orb__glow"></span><img src="${asset('bog-ai.svg')}" alt=""></span>
    <span class="ai-status__label"><span class="ai-status__text">${AI_TXT.thought(Math.max(0.9, (answer.think || 0.5) * 1.6).toFixed(1))}</span></span><span class="ai-status__chev"></span>`
  status.addEventListener('click', () => turn.classList.toggle('is-steps-open'))
  const steps = answer.steps || STEPS_DEFAULT
  const stepsBox = el('div', 'ai-steps', `<ol class="ai-steps__log">${steps.map((x) => `<li class="is-done"><span class="ai-steps__mark"></span><span class="ai-steps__text">${x}</span></li>`).join('')}</ol>`)
  const body = el('div', 'ai-answer')
  if (answer.notice) {
    const n = errorBox(answer.notice.status, answer.notice.title, answer.notice.desc)
    n.dataset.status = answer.notice.status
    n.classList.add('ai-notice')
    body.append(n)
  } else body.append(el('h3', 'ai-answer__title', answer.title))
  if (answer.card) body.append(renderCard(answer.card))
  const ol = el('ol', 'ai-answer__list')
  answer.points.forEach(([lead, rest, cite], k) => {
    const li = el('li')
    const b = el('b')
    const sp = el('span')
    fillText(b, lead)
    fillText(sp, ' ' + rest)
    li.append(b, sp)
    if (answer.sources) li.append(citeMark(cite || Math.min(k, answer.sources.length - 1) + 1))
    ol.append(li)
  })
  body.append(ol)
  if (answer.sources) body.append(renderSources(answer.sources))
  if (answer.actions) body.append(renderActions(answer.actions))
  body.append(feedbackRow(turn))
  turn.append(el('div', 'ai-bubble', text), status, stepsBox, body)
  turnMeta.set(turn, { text, id })
  return turn
}

// მიმდინარე საუბრის შენახვა და thread-ის დაცლა
async function parkConvo() {
  if (busy) { stopped = true; flushPauses(); await wait(80) } // მიმდინარე პასუხი ჩერდება
  endEdit()
  if (ctxCurrent) setContext(null, true)
  thread.querySelectorAll('.ai-next, .ai-prompts').forEach((n) => n.remove())
  if (convo) convo.nodes = [...thread.querySelectorAll('.ai-turn')]
  thread.innerHTML = ''
  pinned = null
  chat.scrollTop = 0
}
async function newChat() {
  toggleHistory(false)
  await parkConvo()
  convo = null
  started = false
  ai.classList.remove('is-chat')
  renderPrompts()
}
async function openConvo(c) {
  toggleHistory(false)
  if (c === convo) return
  await parkConvo()
  convo = c
  if (!c.nodes) c.nodes = c.seed.map(([q, id]) => instantTurn(q, id))
  c.nodes.forEach((n) => { n.style.minHeight = ''; n.classList.add('no-anim') })
  thread.append(...c.nodes)
  started = true
  ai.classList.add('is-chat')
  const last = c.nodes[c.nodes.length - 1]
  $('#aiConvoText').textContent = turnMeta.get(last).text
  pin(last) // ბოლო კითხვა თავში
  tailUntil = performance.now() + 1200
}

// ისტორიის ხედი (პანელის თავზე)
const SVG_CLOCK = SVG('<circle cx="10" cy="10" r="6.500"/><path d="M10 6.500V10l2.300 1.500"/>')
const SVG_NEW = SVG('<path d="M10 4.500H6.500a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V10"/><path d="M9 11l1-3 5.200-5.200a1.400 1.400 0 0 1 2 2L12 10l-3 1Z"/>')
const histBtn = el('button', 'ai__hist', SVG_CLOCK)
histBtn.type = 'button'
histBtn.setAttribute('aria-label', 'საუბრების ისტორია')
ai.append(histBtn)
histBtn.addEventListener('click', () => toggleHistory(true))
// სრული ეკრანის სათაურში: ისტორია შემცირების გვერდით, ახალი საუბარი დახურვის გვერდით
$('[data-act="collapse"]', head).insertAdjacentHTML('afterend', `<button type="button" class="ai__head-btn" data-act="history" aria-label="საუბრების ისტორია">${SVG_CLOCK}</button>`)
$('[data-act="close"]', head).insertAdjacentHTML('beforebegin', `<button type="button" class="ai__head-btn" data-act="new" aria-label="ახალი საუბარი">${SVG_NEW}</button>`)

const histView = el('div', 'ai-history', `<div class="ai-history__head"><b>საუბრები</b><button type="button" class="bog-btn" data-type="secondary" data-size="small" data-act="new">ახალი საუბარი</button><button type="button" class="ai__head-btn" data-act="close" aria-label="ისტორიის დახურვა">${SVG('<path d="M5 5l10 10M15 5 5 15"/>')}</button></div><div class="ai-history__list"></div>`)
ai.append(histView)
function toggleHistory(on) {
  if (on) {
    toggleMenu(false)
    input.blur()
    const count = (c) => (c === convo ? thread.querySelectorAll('.ai-turn').length : c.nodes ? c.nodes.length : c.seed.length)
    $('.ai-history__list', histView).innerHTML = convos.map((c, i) => {
      const n = count(c)
      return `<button type="button" class="ai-history__row${c === convo ? ' is-current' : ''}" data-i="${i}" style="--i:${i}"><b>${c.title}</b><span>${c === convo ? 'მიმდინარე საუბარი' : c.when} · ${n} კითხვა</span></button>`
    }).join('') || '<p class="ai-history__empty">საუბრები ჯერ არ არის</p>'
  }
  ai.classList.toggle('is-history', on)
}
histView.addEventListener('click', (e) => {
  const b = e.target.closest('button')
  if (!b) return
  if (b.dataset.act === 'close') toggleHistory(false)
  else if (b.dataset.act === 'new') newChat()
  else if (b.dataset.i) openConvo(convos[+b.dataset.i])
})

/* --- დამალული reset: ზედა მარცხენა კუთხეზე 2 წამი.
   ცალკე ფენის ნაცვლად კოორდინატებით ვიჭერთ, რომ კუთხეში მდგარ ღილაკებს (უკან, გაშლა) დაჭერა არ დაუბლოკოს --- */
let resetTimer
const inCorner = (e) => e.clientX - layer.getBoundingClientRect().left < 56 && e.clientY < 56
document.addEventListener('pointerdown', (e) => {
  clearTimeout(resetTimer)
  if (inCorner(e)) resetTimer = setTimeout(() => location.reload(), 2000)
}, true)
;['pointerup', 'pointercancel'].forEach((t) => document.addEventListener(t, () => clearTimeout(resetTimer), true))
document.addEventListener('pointermove', (e) => { if (!inCorner(e)) clearTimeout(resetTimer) }, true)
setAction()
