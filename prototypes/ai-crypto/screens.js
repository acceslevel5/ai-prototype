/* მრავალეკრანიანი ნაწილი: router (iOS push/pop), მთავარი, ჩემი სივრცე, ინვესტიციები,
   პროდუქტის დამატება, ანაბრის ტიპები და ანაბრის გახსნის ფლოუ.
   კრიპტოს ეკრანი (index.html-ში) ერთ-ერთი ეკრანია: data-screen="crypto".
   მონაცემები — bank.js. AI ფენა (app.js) ყველა ეკრანზე ერთია; orb-ის ადგილს ეკრანი განსაზღვრავს. */
;(() => {
  const q = (s, r = document) => r.querySelector(s)
  const qa = (s, r = document) => [...r.querySelectorAll(s)]
  const P = (f) => `assets/p/${f}`
  const A = (f) => `assets/${f}`
  const ICON = (f) => `url(../../prototypes/ai-crypto/assets/${f})` // --icon იხსნება bog-ui/components/-დან
  const money = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const stage = q('.stage')
  const html = document.documentElement

  /* ================= ჩარჩო ================= */
  const STATUS = `<div class="statusbar" aria-hidden="true"><img class="statusbar__time" src="../../bog-ui/assets/status-time.svg" alt=""><img class="statusbar__icons" src="../../bog-ui/assets/status-icons.svg" alt=""></div>`
  const glass = (icon, label, act) => `<button class="glass-btn" type="button" aria-label="${label}"${act ? ` data-act="${act}"` : ''}><img src="${icon}" alt=""></button>`
  const TABS = [['home', 'მთავარი'], ['my-space', 'ჩემი სივრცე'], ['payments', 'გადარიცხვა'], ['offers', 'შეთავაზება', 1], ['hub', 'ჰაბი', 1]]
  const tabbar = (cur) => `<nav class="bog-tabbar tabbar" aria-label="მთავარი მენიუ"><div class="bog-tabbar__bar">${TABS.map(([id, t, dot]) =>
    `<a class="bog-tabbar__item" href="#" data-page="${id}"${dot ? ' data-badge' : ''}${id === cur ? ' aria-current="page"' : ''}>${t}</a>`).join('')}</div></nav>`

  // o: { title, back, close, root (QR + ძებნა), tab, body, bar, cls }
  function frame(name, o) {
    const s = document.createElement('section')
    s.className = `screen bank ${o.cls || ''}`
    s.dataset.screen = name
    const left = o.root ? glass(A('ic-qr.svg'), 'QR', '') : o.close ? glass(A('ic-close.svg'), 'დახურვა', 'close') : glass(A('ic-chevron-left.svg'), 'უკან', 'back')
    const right = o.root ? `<span class="topbar__spacer"></span>${glass(A('ic-search.svg'), 'ძებნა', '')}` : ''
    s.innerHTML = `<header class="topbar">${STATUS}<div class="topbar__row">${left}${o.title ? `<h1 class="topbar__title">${o.title}</h1>` : ''}${right}</div></header>
      <main class="screen__body" data-scroll>${o.body}</main>${o.bar ? `<footer class="bank-bar">${o.bar}</footer>` : ''}${o.tab ? tabbar(o.tab) : ''}${o.extra || ''}`
    stage.append(s)
    return s
  }

  /* ================= router ================= */
  // tab — რომელ ტაბს ეკუთვნის; orb — 'search' (ძებნის მარცხნივ) ან 'edge' (მარჯვენა კიდე); parent — სად ბრუნდება „უკან"
  const CONF = {
    home: { tab: 'home', orb: 'search' },
    myspace: { tab: 'my-space', orb: 'search' },
    investments: { tab: 'my-space', orb: 'edge', parent: 'myspace' },
    crypto: { tab: 'my-space', orb: 'search', parent: 'investments' },
    add: { tab: 'my-space', orb: 'edge', parent: 'myspace' },
    deptypes: { tab: 'my-space', orb: 'edge', parent: 'add' },
    deposit: { tab: 'my-space', orb: 'edge', parent: 'deptypes' },
    accounts: { tab: 'my-space', orb: 'edge', parent: 'deposit' },
    summary: { tab: 'my-space', orb: 'edge', parent: 'deposit' },
    success: { tab: 'my-space', orb: 'edge', parent: 'myspace' },
  }
  const TAB_ROOT = { home: 'home', 'my-space': 'myspace', hub: 'hub' }
  const scr = (name) => q(`[data-screen="${name}"]`)
  const stack = []
  let moving = null
  const ENTER = {} // ეკრანზე შესვლისას (ყოველ ჯერზე)
  let booted = false

  function apply(name) {
    const c = CONF[name] || {}
    html.style.setProperty('--orb-right', c.orb === 'edge' ? '60px' : '112px')
    html.dataset.view = name
    // ეკრანის შეცვლისას აბრა ღილაკად იკეცება (ახალ ეკრანზე ფრომფთები სხვა იქნება)
    if (typeof ai !== 'undefined' && ai.dataset.state === 'teaser') {
      clearInterval(teaserTimer)
      teaserDone = true
      teaserText.className = 'ai__teaser-text'
      setState('idle')
    }
    ENTER[name]?.()
    AI.setScreen(name)
  }
  function finish() {
    if (!moving) return
    moving.forEach((a) => a.finish())
  }
  function slide(inEl, outEl, dir) {
    finish()
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
    inEl.classList.add('is-active')
    if (!outEl || outEl === inEl || reducedMotion) {
      if (outEl && outEl !== inEl) outEl.classList.remove('is-active')
      return
    }
    const top = dir > 0 ? inEl : outEl
    const under = dir > 0 ? outEl : inEl
    top.style.zIndex = 3
    under.style.zIndex = 2
    top.classList.add('is-top')
    const opt = { duration: 480, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' }
    const a = dir > 0
      ? [top.animate([{ translate: '100% 0' }, { translate: '0 0' }], opt), under.animate([{ translate: '0 0' }, { translate: '-28% 0' }], opt)]
      : [top.animate([{ translate: '0 0' }, { translate: '100% 0' }], opt), under.animate([{ translate: '-28% 0' }, { translate: '0 0' }], opt)]
    a.push(under.animate([{ '--dim': dir > 0 ? 0 : 1 }, { '--dim': dir > 0 ? 1 : 0 }], opt))
    moving = a
    html.classList.add('is-navigating')
    // ანიმაციის დასრულება ან (ფონურ ტაბში, სადაც ანიმაცია ჩერდება) სათადარიგო ტაიმერი
    const done = () => {
      if (moving !== a) return
      a.forEach((x) => x.cancel())
      moving = null
      html.classList.remove('is-navigating')
      outEl.classList.remove('is-active')
      top.classList.remove('is-top')
      top.style.zIndex = under.style.zIndex = ''
    }
    a[0].finished.then(done, () => {})
    setTimeout(done, opt.duration + 150)
  }
  function go(name) {
    if (moving) return
    const from = scr(stack[stack.length - 1])
    stack.push(name)
    apply(name)
    slide(scr(name), from, 1)
  }
  // ჩანაცვლება (ანიმაციით, როგორც push), ისტორიაში წინა ეკრანის გარეშე
  function replace(name) {
    if (moving) return
    const from = scr(stack.pop())
    stack.push(name)
    apply(name)
    slide(scr(name), from, 1)
  }
  function back() {
    if (moving) return
    const cur = stack[stack.length - 1]
    if (stack.length > 1) {
      stack.pop()
    } else {
      // ღრმა ბმულით დაწყებული: მშობლების ჯაჭვს ავაგებთ
      const chain = []
      let p = CONF[cur]?.parent
      while (p) { chain.unshift(p); p = CONF[p]?.parent }
      if (!chain.length) return
      stack.splice(0, stack.length, ...chain)
    }
    const to = stack[stack.length - 1]
    apply(to)
    slide(scr(to), scr(cur), -1)
  }
  // ტაბზე გადასვლა: ისტორია იწმინდება, ანიმაციის გარეშე (როგორც iOS-ში)
  function tab(id) {
    const root = TAB_ROOT[id]
    if (!root || moving) return false
    const cur = scr(stack[stack.length - 1])
    stack.splice(0, stack.length, root)
    apply(root)
    const to = scr(root)
    if (to === cur) { q('.screen__body', to).scrollTo({ top: 0, behavior: 'smooth' }); return true }
    to.classList.add('is-active')
    cur?.classList.remove('is-active')
    to.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' })
    return true
  }
  window.NAV = { go, back, tab, replace, stack }

  // ზოგადი ნავიგაცია: [data-go], უკან, ტაბები
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-go], [data-act="back"], [data-act="close"]')
    if (t && t.closest('.screen')) {
      if (t.dataset.go) go(t.dataset.go)
      else if (t.dataset.act === 'back') back()
      else if (t.dataset.act === 'close') tab('my-space')
    }
  })
  // ტაბები: რეალიზებული ტაბი გადადის, დანარჩენი მხოლოდ მსუბუქ feedback-ს აძლევს (bog-ui-მ მიმდინარე ტაბი არ შეცვალოს)
  document.addEventListener('click', (e) => {
    const item = e.target.closest('.bog-tabbar__item')
    if (!item) return
    e.preventDefault()
    e.stopPropagation()
    if (!tab(item.dataset.page)) item.animate([{ transform: 'scale(0.9)' }, { transform: 'none' }], { duration: 220, easing: 'ease-out' })
  }, true)

  /* ================= მთავარი ================= */
  const B = window.BANK
  const chg = (t) => `<span class="chg chg--up"><span class="chg__icon"></span>${t}</span>`
  const balances = (list) => `<div class="bog-amount__balances">${list.map(([n, c, on]) => `<span class="bog-amount__balance"${on ? ' data-active' : ''}><span class="bog-amount__num">${n}</span>${c}</span>`).join('')}</div>`
  const secTitle = (t, chev = true) => `<h2 class="sec-title">${t}${chev ? '<i></i>' : ''}</h2>`
  const row = (o) => `<div class="bog-list-item${o.btn ? '' : ''}">
      <span class="bog-media-circle" data-size="40"><img src="${o.img}" alt=""></span>
      <span class="bog-list-item__content"><span class="bog-list-item__label">${o.name}</span>${o.sub ? `<span class="bog-list-item__secondary">${o.sub}</span>` : ''}</span>
      <span class="bog-list-item__end"><span class="bog-list-item__value${o.plus ? ' is-plus' : ''}">${o.value}</span>${o.extra ? `<span class="bog-list-item__value-sub">${o.extra}</span>` : ''}</span>
    </div>`

  frame('home', {
    root: true, tab: 'home', cls: 'screen--grey',
    body: `<div class="home">
      <div class="stories">${B.stories.map((s) => `<button type="button" class="story"><img src="${P(s.img)}" alt=""></button>`).join('')}</div>
      <div class="avail">
        <div><p class="avail__label">ხელმისაწვდომი თანხა</p><p class="avail__value" data-money>${B.available} ₾</p></div>
        <button type="button" class="round-btn" data-act="hide" aria-label="თანხის დამალვა"><span class="bog-icon" style="--icon: url(../icons/eye-hidden.svg)"></span></button>
      </div>
      <button type="button" class="acct">
        <span class="acct__top"><img class="acct__card" src="${P('home-card.png')}" alt=""><img class="acct__mc" src="${P('home-mc.png')}" alt=""></span>
        <span class="acct__name">${B.account.name}</span>
        <span class="bog-amount" data-size="large"><span class="bog-amount__main"><span class="bog-amount__value">${B.account.amount}</span><span class="bog-amount__currency">₾</span></span>${balances(B.account.balances)}</span>
      </button>
      <div class="qa">${B.quick.map((x) => `<button type="button" class="qa__item"><img src="${P(x.img)}" alt=""><span>${x.label}</span></button>`).join('')}</div>
      <section class="card-sec">${secTitle('ლოიალურობა')}
        <div class="bog-list" data-divider>${B.loyalty.map((x) => row({ img: P(x.img), name: x.name, value: x.value, extra: x.sub })).join('')}</div>
      </section>
      <section class="card-sec">
        <div class="card-sec__head">${secTitle('აქციები')}
          <div class="bog-segmented" data-size="small" role="radiogroup"><button class="bog-segment" role="radio" aria-checked="true">დღეს</button><button class="bog-segment" role="radio" aria-checked="false">სულ</button></div>
        </div>
        <div class="stocks-total"><b data-money>${B.stocks.total}</b>${chg(B.stocks.change)}</div>
        <div class="bog-list">${B.stocks.list.map((x) => `<div class="bog-list-item">
            <span class="bog-media-circle" data-size="40"><img src="${P(x.img)}" alt=""></span>
            <span class="bog-list-item__content"><span class="bog-list-item__label">${x.name}</span><span class="bog-list-item__secondary">${x.sub}</span></span>
            <span class="bog-list-item__end"><span class="bog-list-item__value">${x.value}</span>${chg(x.change)}</span>
          </div>`).join('')}</div>
      </section>
      <section class="card-sec">${secTitle('ბოლო ტრანზაქციები')}
        <div class="tx-day"><span>${B.tx.day}</span><span>${B.tx.dayTotal}</span></div>
        <div class="bog-list">${B.tx.list.map((x) => row({ img: P(x.img), name: x.name, sub: x.sub, value: x.value, extra: x.extra, plus: x.plus })).join('')}</div>
      </section>
      <button type="button" class="card-sec home-banner">
        <img src="${P('home-banner.png')}" alt="">
        <span class="home-banner__text"><b>მოირგე მთავარი გვერდი</b><span>შეგიძლია შენი პროდუქტები დამალო ან გამოაჩინო</span></span>
        <span class="bog-list-item__chevron"></span>
      </button>
    </div>`,
  })
  // თანხების დამალვა
  q('[data-screen="home"] [data-act="hide"]').addEventListener('click', (e) => {
    const on = !html.classList.contains('money-hidden')
    html.classList.toggle('money-hidden', on)
    q('.bog-icon', e.currentTarget).style.setProperty('--icon', `url(../icons/${on ? 'eye' : 'eye-hidden'}.svg)`)
  })

  /* ================= ჩემი სივრცე ================= */
  const tile = (x) => `<button type="button" class="tile"${x.go ? ` data-go="${x.go}"` : ''}${x.id ? ` data-id="${x.id}"` : ''}>
      <span class="tile__media"><img src="${P(x.img)}" alt="" style="width:${x.w}px"></span>
      <span class="tile__label">${x.label}</span><b class="tile__value" data-money>${x.value}</b></button>`
  frame('myspace', {
    root: true, tab: 'my-space',
    body: `<div class="myspace">
      <div class="myspace__head"><h2 class="page-title">ჩემი პროდუქტები</h2>
        <button type="button" class="bog-btn" data-type="neutral" data-size="small" data-go="add"><span class="bog-icon" style="--icon: url(../icons/plus.svg)"></span>დამატება</button></div>
      <div class="tiles">${B.products.map(tile).join('')}</div>
      <div class="bog-list services" data-divider>${B.services.map((x) => `<button type="button" class="bog-list-item">
          <span class="bog-icon-holder" data-size="40"><span class="bog-icon" style="--icon: ${ICON(x.icon)}"></span></span>
          <span class="bog-list-item__content"><span class="bog-list-item__label">${x.label}</span><span class="bog-list-item__secondary">${x.sub}</span></span>
          <span class="bog-list-item__chevron"></span></button>`).join('')}</div>
    </div>`,
  })

  /* ================= ინვესტიციები ================= */
  frame('investments', {
    title: 'ინვესტიციები', tab: 'my-space',
    body: `<div class="invest"><div class="invest__total"><span>სულ ინვესტირებული თანხა</span><b data-money>${B.investTotal}</b></div>${B.investments.map((x) => `<button type="button" class="invest__card"${x.go ? ` data-go="${x.go}"` : ''}>
        <span><span class="invest__label">${x.label}</span><b class="invest__value" data-money>${x.value}</b></span>
        <img src="${P(x.img)}" alt="" style="width:${x.w}px"></button>`).join('')}</div>`,
  })

  /* ================= პროდუქტის დამატება ================= */
  frame('add', {
    title: 'პროდუქტის დამატება', tab: 'my-space',
    body: `<div class="add">
      <label class="search-field"><span class="bog-icon" style="--icon: ${ICON('ic-search.svg')}"></span><input type="search" placeholder="ძებნა" autocomplete="off" enterkeyhint="search"></label>
      <section class="add__shelf"><h2 class="sec-title sec-title--page">პროდუქტები შენთვის</h2>
        <div class="shelf">${B.shelf.map((x) => `<div class="shelf__card" role="button" tabindex="0"${x.go ? ` data-go="${x.go}"` : ''}>
            ${x.close ? '<button type="button" class="shelf__close" aria-label="დამალვა"></button>' : ''}
            <img src="${P(x.img)}" alt=""><span class="shelf__title">${x.title}</span><span class="shelf__sub">${x.sub}</span><b class="shelf__value">${x.value}</b></div>`).join('')}</div>
      </section>
      <section><h2 class="sec-title sec-title--page">კატეგორიები</h2>
        <div class="cats">${B.categories.map((x) => `<button type="button" class="cat"${x.go ? ` data-go="${x.go}"` : ''} data-keys="${(x.label + ' ' + x.keys).toLowerCase()}">
            <span class="cat__media"><img src="${P(x.img)}" alt=""></span><span class="cat__label">${x.label}</span>
            ${x.badge ? `<span class="bog-feature-badge" data-type="new">${x.badge}</span>` : ''}<span class="bog-list-item__chevron"></span></button>`).join('')}</div>
        <p class="cats__empty" hidden>ვერაფერი მოიძებნა</p>
      </section>
    </div>`,
  })
  {
    const s = scr('add')
    const input = q('.search-field input', s)
    input.addEventListener('input', () => {
      const v = input.value.trim().toLowerCase()
      let n = 0
      qa('.cat', s).forEach((c) => { const on = !v || c.dataset.keys.includes(v); c.hidden = !on; n += on })
      q('.cats__empty', s).hidden = n > 0
      q('.add__shelf', s).hidden = !!v
    })
    s.addEventListener('click', (e) => {
      const x = e.target.closest('.shelf__close')
      if (!x) return
      e.stopPropagation()
      const card = x.closest('.shelf__card')
      card.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(0.9)' }], { duration: 220, easing: 'ease-in' }).finished.then(() => card.remove())
    }, true)
  }

  /* ================= ანაბრის ტიპები ================= */
  const D = window.DEPOSITS
  const typeCard = (t) => `<button type="button" class="dtype" data-ctx="dtype" data-dtype="${t.id}"${t.disabled ? '' : ` data-type="${t.id}"`}>
      <span class="dtype__top"><img src="${P(t.img)}" alt="" style="height:${t.h}px">${t.badge ? `<span class="bog-feature-badge" data-type="new">${t.badge}</span>` : ''}<span class="bog-list-item__chevron"></span></span>
      <b class="dtype__title">${t.name}</b><span class="dtype__desc">${t.desc}</span></button>`
  frame('deptypes', {
    title: 'ტიპები', tab: 'my-space',
    body: `<div class="dtypes">
      <h2 class="sec-title sec-title--page">შენთვის</h2>${[D.accumulate, D.ondemand, D.term].map(typeCard).join('')}
      <h2 class="sec-title sec-title--page">შვილისთვის</h2>${typeCard(D.kids)}
    </div>`,
  })
  scr('deptypes').addEventListener('click', (e) => {
    const c = e.target.closest('.dtype[data-type]')
    if (c) startDeposit(c.dataset.type)
  })

  /* ================= ანაბრის გახსნა ================= */
  const PAY = window.PAYOUTS
  const dep = { type: 'accumulate', amount: '', months: 24, end: null, payout: 'end', account: 0, agreed: false, ai: null } // ai: { why, amount, term } — AI-მ შეავსო (ნიშანი ქრება, როცა იუზერი ველს შეცვლის)
  const today = new Date()
  const addMonths = (d, m) => { const x = new Date(d); x.setMonth(x.getMonth() + m); return x }
  const dateText = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`
  function calc(type = dep.type, amount = parseFloat(dep.amount) || 0, months = dep.months, payout = dep.payout) {
    const T = D[type]
    const m = T.term ? months : 12
    const pay = T.payout ? (T.payout.includes(payout) ? payout : 'end') : null
    const r = T.rate(m) - (pay ? PAY[pay].cut : 0)
    const compound = !T.term || (T.compound && pay === 'end')
    const eff = compound ? ((1 + r / 1200) ** 12 - 1) * 100 : pay === 'end' ? ((1 + r / 100 * m / 12) ** (12 / m) - 1) * 100 : r
    const interest = compound ? amount * ((1 + r / 1200) ** m - 1) : (amount * r / 100) * m / 12
    return { r, eff, interest, total: amount + interest, m, end: T.term ? (dep.end || addMonths(today, m)) : null }
  }
  const termLabel = () => {
    const c = calc()
    return dep.end ? `${dateText(dep.end)} - ${c.r.toFixed(2)} %` : `${dep.months} თვე - ${c.r.toFixed(2)} %`
  }

  // ტიპის მიხედვით აწყობილი ეკრანი
  const depScreen = frame('deposit', {
    title: '', cls: 'screen--form',
    body: '<div class="dep"></div>',
    bar: '<button type="button" class="bog-btn" data-type="primary" data-width="fill" data-act="dep-next">შეჯამება</button>',
    extra: `<div class="kb" aria-hidden="true">
        <div class="kb__quick"></div>
        <div class="kb__pad">${[['1', ''], ['2', 'ABC'], ['3', 'DEF'], ['4', 'GHI'], ['5', 'JKL'], ['6', 'MNO'], ['7', 'PQRS'], ['8', 'TUV'], ['9', 'WXYZ']].map(([d, l]) => `<button type="button" class="kb__key" data-k="${d}"><b>${d}</b><small>${l}</small></button>`).join('')}
          <span></span><button type="button" class="kb__key" data-k="0"><b>0</b></button><button type="button" class="kb__key kb__key--del" data-k="del" aria-label="წაშლა"></button></div>
      </div>`,
  })

  function startDeposit(type, keep, pre) {
    dep.type = type
    if (!keep) Object.assign(dep, { amount: '', months: D[type].term ? 12 : 24, end: null, payout: 'end', account: 0, agreed: false, ai: null })
    if (pre) Object.assign(dep, { amount: String(pre.amount), months: pre.months || dep.months, payout: pre.payout || 'end', end: null, ai: { why: pre.why, amount: true, term: !!D[type].term } })
    if (!D[type].payout?.includes(dep.payout)) dep.payout = 'end'
    renderDeposit()
    if (stack[stack.length - 1] === 'deposit') { replace('deposit'); AI.setScreen('deposit') }
    else go('deposit')
    if (!keep && !pre) setTimeout(() => setKeyboard(true), 380)
    if (pre) {
      const keys = D[type].term ? ['amount', 'term'] : ['amount']
      const from = { total: 0, interest: 0 }
      keys.forEach((k) => (outEl(k).textContent = ''))
      outEl('total').textContent = outEl('interest').textContent = money(0)
      setTimeout(() => aiFill(keys, from), 560)
    }
  }
  // AI-მ შეცვალა ველი: ერთჯერადი გრადიენტული შემოვლა (როგორც „Show on page")
  function aiFlash(node) {
    if (!node) return
    node.querySelectorAll('.ai-spot__ring').forEach((n) => n.remove())
    node.classList.remove('ai-spot')
    void node.offsetWidth
    const ring = document.createElement('span')
    ring.className = 'ai-spot__ring'
    node.classList.add('ai-spot')
    node.append(ring)
    setTimeout(() => { ring.remove(); node.classList.remove('ai-spot') }, 3000)
  }
  const ORB = '<img class="ai-mark" src="assets/bog-ai.svg" alt="">'
  const outEl = (k) => q(`[data-out="${k}"]`, depScreen)
  const numOf = (k) => parseFloat(outEl(k).textContent.replace(/,/g, '')) || 0

  /* AI წერს ველში: ძველი მნიშვნელობა ბუნდოვნად ზემოთ გადის, ახალი ასო-ასო „იწერება" AI-ს ფერებში და მერე ჩვეულებრივ ფერს იღებს.
     ველზე გადის ნათების ზოლი, კიდეს გრადიენტი შემოუვლის, ჯამები ძველიდან ახალ ციფრამდე ითვლება */
  const WRITE_CHAR = 55 // მს ასოებს შორის
  function aiWrite(node, text, delay = 0) {
    return new Promise((done) => {
      const old = node.textContent
      const write = () => {
        node.classList.add('ai-writing')
        node.innerHTML = [...text].map((c, i) => `<span class="ai-ch" style="--i:${i}">${c === ' ' ? '&nbsp;' : c}</span>`).join('')
        setTimeout(() => { if (node.querySelector('.ai-ch')) node.textContent = text; node.classList.remove('ai-writing'); done() }, text.length * WRITE_CHAR + 650) // იუზერმა შუაში შეცვალა — მის მნიშვნელობას არ ვეხებით
      }
      setTimeout(() => {
        if (!old.trim()) return write()
        node.animate([{ opacity: 1, transform: 'none', filter: 'none' }, { opacity: 0, transform: 'translateY(-8px)', filter: 'blur(4px)' }], { duration: 200, easing: 'ease-in' }).finished.then(write)
      }, delay)
    })
  }
  function countUp(node, from, to, dur = 900) {
    const t0 = performance.now()
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur)
      const e = 1 - Math.pow(1 - k, 3)
      node.textContent = money(from + (to - from) * e)
      if (k < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    node.closest('p')?.animate([{ color: '#7a3df0' }, { color: 'inherit' }], { duration: dur + 400, easing: 'ease-out' })
  }
  // ველების „ჩაწერა" მიმდინარე მდგომარეობით; from — ჯამები ცვლილებამდე
  function aiFill(keys, from) {
    const c = calc()
    keys.forEach((k, i) => {
      const node = outEl(k)
      const field = node.closest('.dep-field, .dep-select')
      const text = k === 'amount' ? money(parseFloat(dep.amount) || 0) : termLabel()
      setTimeout(() => {
        field.classList.remove('ai-filling')
        void field.offsetWidth
        field.classList.add('ai-filling')
        aiFlash(field)
        setTimeout(() => field.classList.remove('ai-filling'), 1600)
      }, i * 420)
      aiWrite(node, text, i * 420 + 120)
    })
    if (from) setTimeout(() => {
      countUp(outEl('total'), from.total, c.total)
      countUp(outEl('interest'), from.interest, c.interest)
      if (dep.type && D[dep.type].term) aiWrite(outEl('eff'), c.eff.toFixed(2))
    }, 300)
  }

  function renderDeposit() {
    const T = D[dep.type]
    q('.topbar__title', depScreen)?.remove()
    q('.topbar__row', depScreen).insertAdjacentHTML('beforeend', `<h1 class="topbar__title">${T.name}</h1>`)
    q('.dep', depScreen).innerHTML = `
      <div class="dep__hero" data-ctx="dep-total"><p class="dep__hero-label">სულ მისაღები</p><p class="dep__hero-total"><span data-out="total">0.00</span> ₾</p><p class="dep__hero-sub">აქედან ჯამური სარგებელი: <span data-out="interest">0.00</span> ₾</p></div>
      ${dep.ai ? `<div class="ai-note">${ORB}<span>BOG AI-მ შეავსო შენი ხარჯების მიხედვით. ყველა ველი შეგიძლია შეცვალო.</span><button type="button" data-act="ai-why">რატომ?</button></div>` : ''}
      <h2 class="sec-title sec-title--page">${T.term ? 'რა თანხით და ვადით გახსნი?' : 'რა თანხით გახსნი?'}</h2>
      <div class="dep-field" data-act="amount" data-ctx="dep-amount" role="button" tabindex="0">
        <span class="dep-field__text"><span class="dep-field__label">ჩაწერე თანხა</span><span class="dep-field__value"><span data-out="amount"></span><i class="dep-field__caret"></i><span class="dep-field__ph">0.00</span><span class="dep-field__sym">₾</span></span></span>
        <span class="dep-field__cur"><span class="bog-flag" data-size="16"><img src="../../bog-ui/assets/flags/ge.svg" alt=""></span>GEL<i></i></span>
      </div>
      <p class="dep-field__msg" data-out="msg" hidden></p>
      <p class="ai-hint" data-out="hint" hidden></p>
      <div class="ai-guard" data-out="guard" hidden></div>
      ${T.term ? `<button type="button" class="dep-select" data-act="term" data-ctx="dep-term"><span class="dep-field__text"><span class="dep-field__label">აირჩიე ვადა და სარგებელი</span><span class="dep-select__value" data-out="term"></span></span><em class="ai-tag">${ORB}რეკომენდ.</em><i class="dep-select__chev"></i></button>
        <p class="dep__eff" data-ctx="dep-eff">ეფექტური: <span data-out="eff"></span> %</p>` : `<div class="bog-feedback dep__note" data-status="info"><div class="bog-feedback__text"><p class="bog-feedback__desc">${T.note}</p></div></div>`}
      <div class="dep__more">
        ${T.payout ? `<div class="dep__sec"><div class="dep__sec-head"><h2 class="sec-title sec-title--page">როდის მიიღებ სარგებელს?</h2><button type="button" class="round-btn round-btn--small" data-act="payout-info" aria-label="ინფორმაცია"><span class="bog-icon" style="--icon: url(../icons/info.svg)"></span></button></div>
          <div class="dep-chips" data-ctx="dep-payout">${T.payout.map((p) => `<button type="button" class="dep-chip" data-payout="${p}">${PAY[p].label}</button>`).join('')}</div></div>` : ''}
        <button type="button" class="bog-action-card dep__compare" data-act="compare">
          <span class="bog-icon-holder" data-size="40"><span class="bog-icon" style="--icon: ${ICON('ic-chart.svg')}"></span></span>
          <span class="bog-action-card__content"><span class="bog-action-card__title">შეადარე სარგებელი</span><span class="bog-action-card__text">ნახე რომელ ანაბარზე რა სარგებელს მიიღებ</span></span>
          <span class="bog-action-card__chevron"></span></button>
        <div class="dep__sec"><h2 class="sec-title sec-title--page">საიდან ჩარიცხავ?</h2>
          <button type="button" class="dep-acc" data-go="accounts" data-ctx="dep-acc">
            <span class="dep-acc__text"><span class="dep-acc__label">არჩეული ანგარიში<i data-out="fav"></i></span><b><span data-out="acc"></span> ₾</b></span>
            <img class="dep-acc__card" data-out="card" alt=""><span class="bog-list-item__chevron"></span></button>
          <p class="dep-field__msg is-error" data-out="accmsg" hidden>ანგარიშზე საკმარისი თანხა არ არის</p>
        </div>
      </div>`
    updateDeposit()
  }

  function updateDeposit() {
    const T = D[dep.type]
    const s = depScreen
    const a = parseFloat(dep.amount) || 0
    const c = calc()
    const out = (k) => q(`[data-out="${k}"]`, s)
    out('total').textContent = money(c.total)
    out('interest').textContent = money(c.interest)
    const editing = s.classList.contains('kb-open')
    out('amount').textContent = dep.amount ? (editing ? Number(dep.amount).toLocaleString('en-US') : money(a)) : ''
    q('.dep-field', s).classList.toggle('has-value', !!dep.amount)
    if (T.term) { out('term').textContent = termLabel(); out('eff').textContent = c.eff.toFixed(2) }
    qa('.dep-chip', s).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.payout === dep.payout)))
    const acc = B.accounts[dep.account]
    out('acc').textContent = money(acc.amount)
    out('fav').hidden = !acc.fav
    out('card').src = P(acc.card)
    // ვალიდაცია: მინიმალური თანხა · ბალანსი
    const low = a > 0 && a < T.min
    const msg = out('msg')
    msg.hidden = !low
    msg.textContent = low ? `მინიმალური თანხა ${money(T.min)} ₾` : ''
    q('.dep-field', s).classList.toggle('is-warning', low)
    const poor = a > acc.amount
    out('accmsg').hidden = !poor
    q('.dep-acc', s).classList.toggle('is-error', poor)
    s.classList.toggle('has-amount', a > 0)
    // AI-ის ნიშნები: რჩება, სანამ იუზერი ველს არ შეცვლის
    q('.dep-field', s).classList.toggle('is-ai', !!dep.ai?.amount)
    q('.dep-select', s)?.classList.toggle('is-ai', !!dep.ai?.term)
    const left = acc.amount - a
    const hint = out('hint')
    hint.hidden = !(dep.ai?.amount && a > 0 && left >= P0.spend)
    hint.innerHTML = `${ORB}ანგარიშზე დაგრჩება ${money(left)} ₾ — თვეში საშუალოდ ≈${P0.spend.toLocaleString("en-US")} ₾-ს ხარჯავ`
    // AI-ს გაფრთხილება: ანგარიშზე თვიურ ხარჯზე ნაკლები რჩება → ერთი შეხებით შესწორება
    const guard = out('guard')
    const safe = Math.floor((acc.amount - P0.spend) / 100) * 100
    const risky = a > 0 && !poor && left < P0.spend && safe >= T.min
    guard.hidden = !risky
    if (risky) guard.innerHTML = `<div class="ai-guard__head">${ORB}<b>ანგარიშზე მხოლოდ ${money(left)} ₾ დაგრჩება</b></div>
      <p>თვეში საშუალოდ ≈${P0.spend.toLocaleString("en-US")} ₾-ს ხარჯავ. გირჩევ, ანაბარზე დადო არაუმეტეს ${money(safe)} ₾.</p>
      <button type="button" class="bog-btn" data-type="secondary" data-size="small" data-act="ai-safe" data-v="${safe}">შეცვლა ${money(safe)} ₾-ზე</button>`
    if (booted) AI.refresh()
  }
  const P0 = B.persona

  // კლავიატურა (iOS-ის ციფრული, სწრაფი თანხებით)
  const kb = q('.kb', depScreen)
  function setKeyboard(on) {
    const T = D[dep.type]
    depScreen.classList.toggle('kb-open', on)
    q('.kb__quick', kb).innerHTML = T.quick.map((n) => `<button type="button" data-q="${n}">${money(n)}</button>`).join('')
    updateDeposit()
    if (on) {
      const body = q('.screen__body', depScreen)
      const f = q('.dep-field', depScreen)
      requestAnimationFrame(() => { if (f.offsetTop - body.scrollTop > body.clientHeight - 380) body.scrollTo({ top: f.offsetTop - 160, behavior: 'smooth' }) })
    }
  }
  kb.addEventListener('pointerdown', (e) => e.preventDefault())
  kb.addEventListener('click', (e) => {
    const k = e.target.closest('[data-k]')?.dataset.k
    const qv = e.target.closest('[data-q]')?.dataset.q
    if (qv) dep.amount = qv
    else if (k === 'del') dep.amount = dep.amount.slice(0, -1)
    else if (k && dep.amount.length < 7) dep.amount = (dep.amount === '0' ? '' : dep.amount) + k
    else return
    if (dep.ai) dep.ai.amount = false
    updateDeposit()
  })

  depScreen.addEventListener('click', (e) => {
    const t = e.target.closest('[data-act], [data-payout]')
    const insideKb = e.target.closest('.kb')
    if (!insideKb && !e.target.closest('[data-act="amount"]') && depScreen.classList.contains('kb-open')) setKeyboard(false)
    if (!t) return
    if (t.dataset.payout) { dep.payout = t.dataset.payout; updateDeposit(); return }
    switch (t.dataset.act) {
      case 'ai-why': AI.ask('რატომ ეს თანხა და ვადა?', 'why-fill'); break
      case 'ai-safe': {
        const from = { total: numOf('total'), interest: numOf('interest') }
        dep.amount = t.dataset.v
        if (dep.ai) dep.ai.amount = false
        updateDeposit()
        aiFill(['amount'], from)
        break
      }
      case 'amount': setKeyboard(true); break
      case 'term': openTerm(); break
      case 'payout-info': openPayoutInfo(); break
      case 'compare': openCompare(); break
      case 'dep-next': {
        const T = D[dep.type]
        const a = parseFloat(dep.amount) || 0
        if (a < T.min || a > B.accounts[dep.account].amount) {
          if (!a) setKeyboard(true)
          q(a > B.accounts[dep.account].amount ? '.dep-acc' : '.dep-field', depScreen).animate(
            [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(0)' }], { duration: 320 })
          return
        }
        renderSummary()
        go('summary')
      }
    }
  })

  /* --- bottom sheets (bog-ui): ვადა, თარიღი, სარგებლის მიღება, შედარება --- */
  const sheet = (id, title, content, bar, opts = '') => `<div class="bog-sheet" id="${id}" hidden${opts}><div class="bog-sheet__panel" role="dialog" aria-modal="true">
      <header class="bog-sheet__nav">${id === 'sh-date' ? '<button type="button" class="bog-icon-btn" data-type="neutral" data-act="date-back" aria-label="უკან"><span class="bog-icon" style="--icon: url(../icons/chevron-left.svg)"></span></button>' : ''}<div class="bog-sheet__heading"><h2 class="bog-sheet__title">${title}</h2></div></header>
      <div class="bog-sheet__content">${content}</div>${bar ? `<div class="bog-sheet__bar">${bar}</div>` : ''}</div></div>`
  depScreen.insertAdjacentHTML('beforeend',
    sheet('sh-term', 'აირჩიე ვადა და სარგებელი', '<div class="bog-wheel dep-wheel" role="listbox" tabindex="0"></div>',
      '<button class="bog-btn" data-type="primary" data-width="fill" data-act="term-ok">არჩევა</button><button class="bog-btn" data-type="neutral" data-width="fill" data-act="term-other"><span class="bog-icon" style="--icon: ' + ICON('ic-calendar.svg') + '"></span>აირჩიე სხვა</button>')
    + sheet('sh-date', 'აირჩიე დასრულების თარიღი', '<div class="bog-wheel-group dep-date"></div>', '<button class="bog-btn" data-type="primary" data-width="fill" data-act="date-ok">არჩევა</button>', ' data-close="false"')
    + sheet('sh-payout', 'სარგებლის მიღება', '<div class="payout-info"></div>', '<button class="bog-btn" data-type="primary" data-width="fill" data-sheet-close>გასაგებია</button>')
    + sheet('sh-compare', 'შეადარე სარგებელი', '<p class="compare__desc"></p><div class="bog-choice-card-group compare" data-deselectable="false"></div>', '<button class="bog-btn" data-type="primary" data-width="fill" data-act="compare-ok">არჩევა</button>'))
  const opts = (list, sel) => list.map((t) => `<div class="bog-wheel__option" role="option"${t === sel ? ' aria-selected="true"' : ''}>${t}</div>`).join('')
  const openSheet = (id) => { BOG.openSheet(id); requestAnimationFrame(() => qa(`#${id} .bog-wheel`).forEach(BOG.wheelInit)) }
  const wheelIndex = (w) => qa('.bog-wheel__option', w).findIndex((o) => o.getAttribute('aria-selected') === 'true')

  function openTerm() {
    const T = D[dep.type]
    const months = []
    for (let m = T.months[0]; m <= T.months[1]; m++) months.push(`${m} თვე`)
    q('#sh-term .bog-wheel').innerHTML = opts(months, `${dep.end ? 24 : dep.months} თვე`)
    openSheet('sh-term')
  }
  function openDate() {
    const end = dep.end || addMonths(today, dep.months)
    const years = []
    for (let y = today.getFullYear(); y <= today.getFullYear() + 3; y++) years.push(String(y))
    q('#sh-date .dep-date').innerHTML =
      `<div class="bog-wheel" role="listbox" aria-label="თვე" tabindex="0" style="width:84px">${opts(MONTHS_SHORT, MONTHS_SHORT[end.getMonth()])}</div>`
      + `<div class="bog-wheel" role="listbox" aria-label="დღე" tabindex="0" style="width:64px">${opts(Array.from({ length: 31 }, (_, i) => String(i + 1)), String(end.getDate()))}</div>`
      + `<div class="bog-wheel" role="listbox" aria-label="წელი" tabindex="0" style="width:96px">${opts(years, String(end.getFullYear()))}</div>`
    openSheet('sh-date')
  }
  function openPayoutInfo() {
    q('#sh-payout .payout-info').innerHTML = D[dep.type].payout.map((p) => `<div class="payout-info__row">
        <span class="bog-icon-holder" data-size="32"><span class="bog-icon" style="--icon: ${ICON(PAY[p].icon)}"></span></span>
        <span><b>${PAY[p].label}</b><span>${PAY[p].desc}</span></span></div>`).join('')
    BOG.openSheet('sh-payout')
  }
  function openCompare() {
    const a = parseFloat(dep.amount) || 0
    const m = D[dep.type].term ? dep.months : 24
    q('#sh-compare .compare__desc').textContent = `შედარებისთვის სარგებელი დათვლილია ანაბრის ტიპები ${m} თვეზე, ვადის ბოლოს სარგებლის პერიოდულობით`
    q('#sh-compare .compare').innerHTML = ['accumulate', 'ondemand', 'term'].map((id) => {
      const T = D[id]
      const c = calc(id, a, m, 'end')
      const interest = T.term ? c.interest : a * ((1 + T.rate() / 1200) ** m - 1)
      const ok = a >= T.min
      return `<label class="bog-choice-card" data-align="right">
        <input type="radio" class="bog-radio__input" name="cmp" value="${id}"${id === dep.type ? ' checked' : ''}>
        <span class="bog-choice-card__text"><span class="bog-choice-card__title">${T.short}</span>
          <span class="compare__val">${ok ? `<b>${money(interest)} ₾</b> სარგებელი` : `<b>- ₾</b> / მინ. თანხა: ${money(T.min)} ₾`}</span></span>
        <span class="bog-choice-card__list"><span><span>ეფექტური პროცენტი</span><b>${ok ? c.eff.toFixed(2) + ' %' : '-'}</b></span><span><span>თანხის დამატება</span><b>${T.topUp ? 'კი' : 'არა'}</b></span></span>
      </label>`
    }).join('')
    BOG.openSheet('sh-compare')
  }
  depScreen.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act
    if (act === 'term-ok') {
      const i = wheelIndex(q('#sh-term .bog-wheel'))
      dep.months = D[dep.type].months[0] + Math.max(0, i)
      dep.end = null
      if (dep.ai) dep.ai.term = false
      BOG.closeSheet('sh-term')
      updateDeposit()
    } else if (act === 'term-other') {
      BOG.closeSheet('sh-term')
      setTimeout(openDate, 260)
    } else if (act === 'date-back') {
      BOG.closeSheet('sh-date')
      setTimeout(openTerm, 260)
    } else if (act === 'date-ok') {
      const [mo, d, y] = qa('#sh-date .bog-wheel').map(wheelIndex)
      const years = today.getFullYear()
      let end = new Date(years + y, mo, Math.min(d + 1, new Date(years + y, mo + 1, 0).getDate()))
      const T = D[dep.type]
      const min = addMonths(today, T.months[0])
      const max = addMonths(today, T.months[1])
      if (end < min) end = min
      if (end > max) end = max
      dep.end = end
      if (dep.ai) dep.ai.term = false
      dep.months = Math.max(T.months[0], Math.min(T.months[1], Math.round((end - today) / (30.44 * 864e5))))
      BOG.closeSheet('sh-date')
      updateDeposit()
    } else if (act === 'compare-ok') {
      const id = q('#sh-compare input:checked')?.value
      BOG.closeSheet('sh-compare')
      if (id && id !== dep.type) setTimeout(() => startDeposit(id, true), 280)
    }
  })

  /* --- საიდან ჩარიცხავ? (Account Picker Page) --- */
  const accScreen = frame('accounts', {
    title: 'საიდან ჩარიცხავ?', cls: 'screen--form',
    body: `<div class="bog-picker-group accs">${B.accounts.map((x, i) => `<div class="bog-picker" data-i="${i}">
        <div class="bog-picker__box" role="button" tabindex="0">
          <div class="bog-picker__head"><div class="bog-picker__info">
            <span class="bog-picker__title">${x.iban}${x.fav ? '<span class="bog-picker__fav"></span>' : ''}</span>
            <div class="bog-amount" data-size="medium"><div class="bog-amount__main"><span class="bog-amount__value">${money(x.amount)}</span><span class="bog-amount__currency">₾</span></div></div>
          </div><span class="acc-art"><img src="${P(x.card)}" alt=""></span></div>
          ${balances(x.balances)}
        </div></div>`).join('')}</div>`,
    bar: '<button type="button" class="bog-btn" data-type="primary" data-width="fill" data-act="acc-ok">არჩევა</button>',
  })
  ENTER.accounts = () => qa('.bog-picker', accScreen).forEach((p) => p.toggleAttribute('data-selected', +p.dataset.i === dep.account))
  accScreen.addEventListener('click', (e) => {
    const p = e.target.closest('.bog-picker')
    if (p) qa('.bog-picker', accScreen).forEach((x) => x.toggleAttribute('data-selected', x === p))
    if (e.target.closest('[data-act="acc-ok"]')) {
      const sel = q('.bog-picker[data-selected]', accScreen)
      if (sel) dep.account = +sel.dataset.i
      updateDeposit()
      back()
    }
  })

  /* --- შეჯამება --- */
  const sumScreen = frame('summary', {
    title: 'შეჯამება', cls: 'screen--form',
    body: '<div class="sum"></div>',
    bar: `<label class="bog-checkbox sum__agree"><input type="checkbox" class="bog-checkbox__input"><span class="bog-checkbox__text"><span class="bog-checkbox__label">ვეთანხმები <a href="#" data-act="terms">ხელშეკრულების პირობებს</a></span></span></label>
      <button type="button" class="bog-btn" data-type="primary" data-width="fill" data-act="open-dep">ანაბრის გახსნა</button>`,
  })
  function renderSummary() {
    const T = D[dep.type]
    const c = calc()
    const item = (t, v) => `<div class="bog-summary__item" data-ctx="sum-row"><dt class="bog-summary__title">${t}</dt><dd class="bog-summary__value">${v}</dd></div>`
    q('.sum', sumScreen).innerHTML = `<h2 class="sec-title sec-title--big">გადახედე დეტალებს</h2>
      <dl class="bog-summary sum__card">
        ${item('სულ მისაღები', `${money(c.total)} ₾`)}
        ${item('სარგებელი', `წლიური: ${c.r.toFixed(2)} % , ეფექტური: ${c.eff.toFixed(2)} %`)}
        ${T.term ? item('დასრულების თარიღი', dateText(c.end)) : item('სარგებლის დარიცხვა', 'ყოველთვე')}
        ${T.payout ? item('სარგებლის მიღება', PAY[dep.payout].label) : ''}
      </dl>
      <div class="ai-sum" data-ctx="terms"><div class="ai-sum__head">${ORB}<b>მთავარი, რაც უნდა იცოდე</b><small>BOG AI · პირობებიდან</small></div>
        <ul>${T.key.map((x) => `<li>${x}</li>`).join('')}</ul></div>
      <h3 class="sum__cond-title">${T.name}ს სრული პირობები</h3><p class="sum__cond" data-ctx="terms">${T.conditions}</p>`
    const cb = q('.bog-checkbox__input', sumScreen)
    cb.checked = dep.agreed
    q('.sum__agree', sumScreen).removeAttribute('data-state')
  }
  sumScreen.addEventListener('click', (e) => {
    if (e.target.closest('[data-act="terms"]')) e.preventDefault()
    const b = e.target.closest('[data-act="open-dep"]')
    if (!b) return
    const cb = q('.bog-checkbox__input', sumScreen)
    if (!cb.checked) {
      const lbl = q('.sum__agree', sumScreen)
      lbl.setAttribute('data-state', 'error')
      lbl.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 300 })
      return
    }
    b.dataset.state = 'loading'
    setTimeout(() => {
      b.removeAttribute('data-state')
      renderSuccess()
      go('success')
    }, 1100)
  })
  sumScreen.addEventListener('change', (e) => {
    if (!e.target.matches('.bog-checkbox__input')) return
    dep.agreed = e.target.checked
    if (dep.agreed) q('.sum__agree', sumScreen).removeAttribute('data-state')
  })

  /* --- წარმატება (Result Page) --- */
  const okScreen = frame('success', {
    close: true, cls: 'screen--form',
    body: `<div class="bog-result ok" data-status="success"><span class="bog-result__icon"></span>
      <div class="bog-result__text"><h2 class="bog-result__title">ანაბარი გახსნილია</h2><p class="bog-result__desc">დეტალები მალე გამოგიჩნდება "ჩემს სივრცეში"</p></div>
      <div class="bog-result__amount"><p class="bog-result__amount-title">თანხა</p><div class="bog-amount" data-size="large" data-align="center"><div class="bog-amount__main"><span class="bog-amount__value"></span><span class="bog-amount__currency">₾</span></div></div><p class="bog-result__support"></p></div></div>`,
    bar: '<button type="button" class="bog-btn" data-type="primary" data-width="fill" data-act="close">გასაგებია</button>',
  })
  function renderSuccess() {
    const a = parseFloat(dep.amount) || 0
    q('.bog-amount__value', okScreen).textContent = money(a)
    q('.bog-result__support', okScreen).textContent = `ტიპი: ${D[dep.type].name}`
    // AI: ერთი შემდეგი ნაბიჯი (იუზერი თავად ჩართავს)
    q('.ai-nextstep', okScreen)?.remove()
    const ns = D[dep.type].nextStep
    if (ns) {
      q('.ok', okScreen).insertAdjacentHTML('afterend', `<div class="ai-nextstep is-waiting"><div class="ai-guard__head">${ORB}<b>${ns.title}</b></div><p>${ns.desc}</p>
        <div class="ai-nextstep__btns"><button type="button" class="bog-btn" data-type="secondary" data-size="small" data-act="ns-on">${ns.cta}</button><button type="button" class="bog-btn" data-type="neutral" data-size="small" data-act="ns-off">არა, მადლობა</button></div></div>`)
    }
    // ჩემს სივრცეში ანაბრის ფილა ემატება (ან იზრდება)
    const acc = B.accounts[dep.account]
    acc.amount -= a
    acc.balances[0][0] = money(acc.amount)
    addDepositTile(a)
  }
  let depositTotal = 0
  function addDepositTile(a) {
    depositTotal += a
    const tiles = q('[data-screen="myspace"] .tiles')
    let t = q('[data-id="deposits"]', tiles)
    if (!t) {
      tiles.insertAdjacentHTML('beforeend', tile({ id: 'deposits', img: 'cat-deposit.png', w: 46, label: 'ანაბრები', value: '' }))
      t = q('[data-id="deposits"]', tiles)
      t.classList.add('is-new')
    }
    q('.tile__value', t).textContent = `${money(depositTotal)} ₾`
  }
  // AI-ს შემდეგი ნაბიჯი შედეგის ანიმაციის ბოლოს ამოდის (ტექსტის ბლოკების შემდეგ, იმავე რიტმით)
  ENTER.success = () => {
    const anims = (BOG.resultIn && BOG.resultIn(okScreen)) || []
    const end = anims.reduce((m, a) => Math.max(m, a.effect?.getComputedTiming().endTime || 0), 0)
    const ns = q('.ai-nextstep', okScreen)
    if (ns) setTimeout(() => ns.classList.replace('is-waiting', 'is-in'), Math.max(0, end - 250))
  }
  okScreen.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act="ns-on"], [data-act="ns-off"]')
    if (!b) return
    const box = b.closest('.ai-nextstep')
    if (b.dataset.act === 'ns-off') { box.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200 }).finished.then(() => box.remove()); return }
    q('.ai-nextstep__btns', box).outerHTML = `<p class="ai-done"><span class="bog-status-icon" data-status="positive" data-size="x-small"></span>${D[dep.type].nextStep.done}</p>`
  })

  /* ================= კრიპტოს ეკრანი ================= */
  const crypto = scr('crypto')
  q('[data-tabbar]', crypto).outerHTML = tabbar('my-space')

  /* ================= BOG AI ეკრანების მიხედვით =================
     ყოველ ეკრანზე: ენა, ჩიპები (AI_CTX), proactive აბრა (ერთხელ, × — „აღარ მაჩვენო").
     app.js-ის გლობალურ ცვლადებს (ai, PROMPTS, teaserHold, started…) პირდაპირ ვიყენებთ */
  const AI = (() => {
    const CRYPTO = PROMPTS.slice()
    const shown = new Set()
    const dismissed = new Set()
    let timer, lineTimer, foldTimer
    const PROACTIVE_HOLD = 7600 // რამდენ ხანს ჩანს რჩევის აბრა (ორი ხაზი × 2), სანამ ღილაკად დაიკეცება
    // × აბრაზე: proactive შეტყობინების დამალვა
    const dismiss = document.createElement('button')
    dismiss.type = 'button'
    dismiss.className = 'ai__dismiss'
    dismiss.setAttribute('aria-label', 'აღარ მაჩვენო')
    ai.append(dismiss)
    function stopProactive() {
      clearInterval(lineTimer)
      clearTimeout(foldTimer)
      if (ai.classList.contains('is-proactive') && !busy) mainAvatar?.update({ mood: 'idle' })
      ai.classList.remove('is-proactive')
    }
    function prompts(name) {
      const p = window.AI_CTX?.[name]?.prompts
      return (typeof p === 'function' ? p() : p) || []
    }
    // საუბარი უკვე მიმდინარეობს: ახალი ეკრანის კითხვები საუბრის ბოლოს ჩნდება („ამ გვერდზე დაგეხმარები")
    function screenChips(name) {
      if (!started || busy || name === 'crypto') return
      const list = prompts(name)
      const key = list.map((x) => x.text).join('|')
      const old = thread.querySelector('.ai-next.is-screen')
      if (old && old.dataset.key === key) return
      thread.querySelectorAll('.ai-next:not(.is-collapsing)').forEach((n) => n.remove())
      if (!list.length) return
      const next = el('div', 'ai-next is-screen')
      next.dataset.key = key
      next.append(el('p', 'ai-next__label', 'ამ გვერდზე დაგეხმარები'))
      list.forEach((n, i) => { const c = chip(n, true); c.style.setProperty('--i', i); next.append(c) })
      ;([...thread.querySelectorAll('.ai-turn')].pop() || thread).append(next)
    }
    /* სცენარის (თემის) შეცვლა: კრიპტო ↔ ბანკი. მიმდინარე საუბარი ისტორიაში გადადის (☰ → ისტორია),
       ახალ თემაზე AI სუფთად იწყება; კრიპტოში შესვლისას აბრა კრიპტოს ფრომფთებით იშლება */
    let domain = null
    function switchDomain(name) {
      const next = name === 'crypto' ? 'crypto' : 'bank'
      const prev = domain
      domain = next
      if (!prev || prev === next) return
      if (started) {
        newChat() // parkConvo → ისტორია; started = false
        ai.classList.remove('has-unread')
        if (ai.dataset.state === 'teaser') setState('idle')
      }
      if (next === 'crypto') {
        teaserDone = false
        teaserCycles = 0
        teaserIndex = 0
        clearInterval(teaserTimer)
        setTimeout(() => { if (html.dataset.view === 'crypto' && ai.dataset.state === 'idle') expandTeaser() }, TIMING.teaserDelay)
      }
    }
    function setScreen(name) {
      const ka = name !== 'crypto'
      window.AI_TXT = AI_KA // ყველგან ქართულად
      input.placeholder = AI_TXT.placeholder
      $('.ai__convo-idle').textContent = AI_TXT.convo
      $('.ai__convo-busy').textContent = AI_TXT.answering
      html.dataset.orb = CONF[name]?.orb || 'search'
      PROMPTS.splice(0, PROMPTS.length, ...(ka ? prompts(name) : CRYPTO))
      switchDomain(name)
      teaserIndex = 0
      if (teaserHold && !started) ai.classList.remove('has-unread') // სხვა ეკრანზე რჩევა აღარ ეხება
      teaserHold = null
      clearTimeout(timer)
      if (ai.classList.contains('is-proactive')) { stopProactive(); if (ai.dataset.state === 'teaser') setState('idle') }
      if (ai.dataset.state === 'open' && !started && !busy) renderPrompts()
      screenChips(name)
      // ფრომფთების აბრა (როგორც კრიპტოში): ეკრანზე პირველად შესვლისას იშლება და ფრომფთებს აბრუნებს
      if (window.AI_CTX?.[name]?.teaser === 'rotate' && !started && !shown.has(name)) {
        shown.add(name)
        timer = setTimeout(() => {
          if (html.dataset.view !== name || ai.dataset.state !== 'idle' || started || moving) return
          teaserDone = false
          teaserCycles = 0
          teaserIndex = 0
          expandTeaser()
        }, 900)
      }
      const p = window.AI_CTX?.[name]?.proactive
      if (p && !shown.has(name) && !dismissed.has(p.id)) timer = setTimeout(() => proactive(name, p), p.delay || 1200)
    }
    function proactive(name, p) {
      if (html.dataset.view !== name || ai.dataset.state !== 'idle' || started || moving) return
      shown.add(name)
      teaserDone = true // ღილაკიდან გახსნა/დაკეცვა ჩვეულებრივად
      teaserHold = { id: p.id, text: p.question }
      ai.classList.add('is-expanding', 'is-glowing', 'is-proactive')
      mainAvatar?.update({ mood: 'happy' }) // რჩევის აბრაზე ქერექთერი ხალისობს
      setState('teaser')
      typeTeaser(p.lines[0])
      setTimeout(() => ai.classList.remove('is-expanding'), cssMs('--teaser-expand'))
      setTimeout(() => ai.classList.remove('is-glowing'), cssMs('--teaser-glow') + 400)
      // რამდენიმე წამში აბრა თავად იკეცება ღილაკად; ღილაკზე რჩება წერტილი — რჩევა პანელში პირველ ჩიპად ელოდება
      clearTimeout(foldTimer)
      foldTimer = setTimeout(() => {
        if (!ai.classList.contains('is-proactive') || ai.dataset.state !== 'teaser' || ai.classList.contains('is-pulling')) return
        stopProactive()
        ai.classList.add('is-closing')
        setTimeout(() => ai.classList.remove('is-closing'), cssMs('--close-dur') + 60)
        setState('idle')
        ai.classList.add('has-unread', 'is-glowing')
        setTimeout(() => ai.classList.remove('is-glowing'), cssMs('--teaser-glow') + 400)
      }, p.hold || PROACTIVE_HOLD)
      let i = 0
      clearInterval(lineTimer)
      lineTimer = setInterval(() => {
        if (!ai.classList.contains('is-proactive') || ai.dataset.state !== 'teaser') return clearInterval(lineTimer)
        i = (i + 1) % p.lines.length
        swapTeaser(p.lines[i])
      }, 3600)
    }
    // აბრაზე დაჭერა: პანელი იხსნება და ჩიპები ელოდება (რჩევის კითხვა — პირველი). თავისით არაფერი იგზავნება
    $('#aiTeaser').addEventListener('click', (e) => {
      if (!ai.classList.contains('is-proactive')) return
      e.stopImmediatePropagation()
      stopProactive()
      open()
    }, true)
    dismiss.addEventListener('click', (e) => {
      e.stopPropagation()
      if (teaserHold) dismissed.add(teaserHold.id)
      stopProactive()
      teaserHold = null
      setState('idle')
      BOG.toast?.({ status: 'neutral', title: 'ამ რჩევას აღარ გაჩვენებ', text: 'შეცვლა შეგიძლია პერსონალიზაციის პარამეტრებში' })
    })
    // პანელის გახსნა და კითხვის დასმა სხვა ადგილიდან (მაგ. „რატომ?" ფორმაში)
    function askNow(text, id, opts) {
      if (busy) return
      stopProactive()
      if (ai.dataset.state !== 'open') { open(); setTimeout(() => ask(text, id, null, opts), 700) } else ask(text, id, null, opts)
    }
    // ფორმა შეიცვალა → ჩიპები განახლდეს (თუ პანელი ღიაა და საუბარი არ დაწყებულა)
    function refresh() {
      if (html.dataset.view === 'crypto') return
      PROMPTS.splice(0, PROMPTS.length, ...prompts(html.dataset.view))
      if (ai.dataset.state !== 'open') screenChips(html.dataset.view)
    }
    return { setScreen, ask: askNow, refresh }
  })()

  /* AI → ეკრანი: ფორმის შევსება/შეცვლა, გადასვლა, ბარათის მონიშვნა. ბოლო ღილაკს იუზერი აჭერს */
  window.DEP_API = {
    calc: (type, amount, months, payout) => calc(type, amount, months, payout),
    state: () => ({ ...dep, amountN: parseFloat(dep.amount) || 0, T: D[dep.type], acc: B.accounts[dep.account], calc: calc() }),
    prefill(type, pre) {
      close()
      setTimeout(() => startDeposit(type, false, pre), 480)
    },
    // პანელი ჯერ იხურება, გვერდი ველამდე სქროლავს და მხოლოდ ამის შემდეგ „იწერება" ცვლილება — რომ იუზერმა დაინახოს
    apply(ch) {
      close()
      const target = ch.months ? q('.dep-select', depScreen) : ch.payout ? q('.dep-chips', depScreen) : q('.dep-field', depScreen)
      setTimeout(() => {
        const body = q('.screen__body', depScreen)
        body.scrollTo({ top: Math.max(0, target.offsetTop - 220), behavior: 'smooth' })
        setTimeout(() => {
          const from = { total: numOf('total'), interest: numOf('interest') }
          const oldTerm = outEl('term')?.textContent
          Object.assign(dep, ch)
          if (ch.months) { dep.end = null; if (dep.ai) dep.ai.term = false }
          updateDeposit()
          AI.refresh()
          if (ch.payout) {
            const chip = q(`.dep-chip[data-payout="${ch.payout}"]`, depScreen)
            chip.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 520, easing: 'cubic-bezier(0.3, 1.4, 0.5, 1)' })
            aiFlash(chip)
            setTimeout(() => {
              countUp(outEl('total'), from.total, calc().total)
              countUp(outEl('interest'), from.interest, calc().interest)
            }, 200)
          } else {
            if (ch.months) outEl('term').textContent = oldTerm
            aiFill(ch.months ? ['term'] : ['amount'], from)
          }
        }, 380)
      }, 460)
    },
    highlight(type) {
      close()
      setTimeout(() => {
        const c = q(`[data-screen="deptypes"] .dtype[data-type="${type}"]`)
        const body = q('[data-screen="deptypes"] .screen__body')
        if (!c) return
        body.scrollTo({ top: Math.max(0, c.offsetTop - 140), behavior: 'smooth' })
        aiFlash(c)
      }, 420)
    },
  }

  /* ხანგრძლივი დაჭერა ანაბრის ფლოუს ელემენტებზე → „ჰკითხე BOG AI-ს ამაზე" (app.js: bindLongPress, ai-bank.js: BANK_CTX) */
  ;['deptypes', 'deposit', 'summary'].forEach((n) => window.bindLongPress?.(q('.screen__body', scr(n)), '[data-ctx]'))

  /* სხვა სცენარების ფაილებისთვის (pfm.js): ეკრანის აწყობა, ნავიგაცია და AI-ს „ჩაწერის" ანიმაციები */
  window.SCR = { frame, go, back, replace, tab, CONF, ENTER, scr, money, aiWrite, aiFlash, countUp, ORB, ask: (t, id, o) => AI.ask(t, id, o), refreshAI: () => AI.refresh(), glass, tabbar }

  /* ================= start ================= */
  const first = CONF[START] ? START : 'crypto'
  stack.push(first)
  scr(first).classList.add('is-active')
  apply(first)
  booted = true
})()
