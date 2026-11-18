/* სამი სცენარი PO-ს კონცეფციიდან (BOG AI Assistant), ჩვენი BOG AI-ით:
   1) „ხელფასამდე მეყოფა?" — წინასწარი გაფრთხილება მთავარზე, „რატომ ვხედავ ამას?", ერთი დადასტურებით გამოსწორება
   2) „ბარათმა უარი თქვა" — შეტყობინება → AI პოულობს მიზეზს → ერთი დადასტურებით ასწორებს → „1 საათში გამოვრთო?"
   3) „ადამიანთან გადართვა" — AI ჯერ თავად ცდილობს, მერე შეჯამებით გადასცემს ოპერატორს (ცალკე ფანჯარა),
      სტატუსს თავად პასუხობს და თანხის ჩარიცხვისას საუბარს ხურავს.
   გარე მოვლენებს (შეტყობინებები, დროის გასვლა) მკვლევარი იწვევს: ზედა მარჯვენა კუთხეზე 2 წამიანი დაჭერა → მენიუ. */
;(() => {
  const { go, tab, scr, money, ORB, aiFlash } = window.SCR
  const q = (s, r = document) => r.querySelector(s)
  const A = ANSWERS
  const html = document.documentElement
  const SRC = {
    tx: { kind: 'account', name: 'შენი BOG ტრანზაქციები', detail: 'ბოლო 12 თვე · მხოლოდ BOG-ის მონაცემები' },
    plan: { kind: 'account', name: 'შენი რეგულარული გადახდები', detail: 'სესხი, კომუნალური, გამოწერები' },
    card: { kind: 'account', name: 'ბარათის პარამეტრები', detail: 'Visa •• 4417 · ლიმიტები და უსაფრთხოება' },
    help: { kind: 'help', name: 'BOG-ის დახმარების ცენტრი', detail: 'თანხის დაბრუნების წესები' },
  }
  const layer = q('.ai-layer')

  /* ===================== push შეტყობინება (iOS-ის მსგავსი, აპის თავზე) ===================== */
  const push = document.createElement('button')
  push.type = 'button'
  push.className = 'push'
  layer.append(push)
  let pushTimer
  function notify(title, body, onTap) {
    clearTimeout(pushTimer)
    push.innerHTML = `<span class="push__app">BOG</span><span class="push__t"><small>BOG · ახლა</small><b>${title}</b><span>${body}</span></span>`
    push.onclick = () => { hide(); onTap?.() }
    push.classList.remove('is-on')
    void push.offsetWidth
    push.classList.add('is-on')
    pushTimer = setTimeout(hide, 9000)
    function hide() { clearTimeout(pushTimer); push.classList.remove('is-on') }
  }

  /* ===================== მკვლევრის მენიუ (დამალული) ===================== */
  const menu = document.createElement('div')
  menu.className = 'rmenu'
  menu.hidden = true
  menu.innerHTML = `<div class="rmenu__box"><b>მკვლევრის მენიუ</b><small>მოვლენები, რომლებიც რეალურად აპის გარეთ ხდება</small>
    <button type="button" data-ev="payday">ხელფასამდე 3 დღე — თანხა არ ჰყოფნის</button>
    <button type="button" data-ev="declined">ბარათით გადახდა ვერ შესრულდა</button>
    <button type="button" data-ev="op-reply">ოპერატორმა უპასუხა</button>
    <button type="button" data-ev="refund">თანხა დაბრუნდა (მოთხოვნა იხურება)</button>
    <button type="button" data-ev="close" class="is-ghost">დახურვა</button></div>`
  document.body.append(menu)
  let rTimer
  const inRCorner = (e) => { const L = layer.getBoundingClientRect(); return L.right - e.clientX < 56 && e.clientY < 56 }
  document.addEventListener('pointerdown', (e) => { clearTimeout(rTimer); if (inRCorner(e)) rTimer = setTimeout(() => { menu.hidden = false }, 2000) }, true)
  ;['pointerup', 'pointercancel'].forEach((t) => document.addEventListener(t, () => clearTimeout(rTimer), true))
  document.addEventListener('pointermove', (e) => { if (!inRCorner(e)) clearTimeout(rTimer) }, true)
  menu.addEventListener('click', (e) => {
    const ev = e.target.closest('[data-ev]')?.dataset.ev
    if (!ev && e.target !== menu) return
    menu.hidden = true
    if (ev && EVENTS[ev]) setTimeout(EVENTS[ev], 500)
  })
  window.RESEARCH = (ev) => EVENTS[ev]?.() // ტესტირებისთვის

  /* ===================== 1) ხელფასამდე ===================== */
  const PD = { balance: 340, piggy: 1200, dues: [['მაგთი', 25, '29 ნოე'], ['სესხის შენატანი', 300, '30 ნოე'], ['კომუნალური ≈', 85, '30 ნოე']], salary: '1 დეკემბერს' }
  const dueSum = () => PD.dues.reduce((s, d) => s + d[1], 0)
  const short = () => Math.max(0, dueSum() - PD.balance)
  const home = scr('home')
  function setHomeBalance(v) {
    q('.avail__value', home).textContent = `${money(v)} ₾`
    q('.acct .bog-amount__value', home).textContent = money(v)
    const b = q('.acct .bog-amount__balance .bog-amount__num', home)
    if (b) b.textContent = money(v)
  }
  function paydayCard() {
    q('.pd-card', home)?.remove()
    q('.home', home).insertAdjacentHTML('afterbegin', `<div class="ai-nudge pd-card is-warn">
      <div class="ai-nudge__head">${ORB}<b>ხელფასამდე თანხა არ გეყოფა</b></div>
      <p>ანგარიშზე ${money(PD.balance)} ₾ გაქვს, ხელფასამდე (${PD.salary}) კი ${money(dueSum())} ₾ უნდა გადაიხადო.</p>
      <div class="pd-card__btns"><button type="button" class="bog-btn" data-type="primary" data-size="small" data-act="pd-move">ყულაბიდან ${money(short())} ₾</button><button type="button" class="bog-btn" data-type="neutral" data-size="small" data-act="pd-later">ახლა არა</button></div>
      <button type="button" class="pd-why" data-act="pd-why">რატომ ვხედავ ამას?</button>
      <div class="pd-whybox" hidden>${PD.dues.map(([n, a, d]) => `<span><span>${n} · ${d}</span><b>${money(a)} ₾</b></span>`).join('')}<span><span>ანგარიშზე</span><b>${money(PD.balance)} ₾</b></span><span><span>ყულაბაში</span><b>${money(PD.piggy)} ₾</b></span><small>${ORB}მხოლოდ შენი BOG-ის მონაცემები · ასეთ დროს შეთავაზებებს არ ვაჩვენებ</small></div>
    </div>`)
  }
  home.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act^="pd-"]')?.dataset.act
    if (!act) return
    e.stopPropagation()
    const card = q('.pd-card', home)
    if (act === 'pd-why') { const b = q('.pd-whybox', card); b.hidden = !b.hidden }
    else if (act === 'pd-later') { card.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200 }).finished.then(() => card.remove()); BOG.toast?.({ status: 'neutral', title: 'ხვალ ისევ შევამოწმებ', text: 'თუ ვითარება შეიცვლება, შეგატყობინებ' }) }
    else if (act === 'pd-move') window.SCR.ask(`ყულაბიდან ${money(short())} ₾-ის გადმოტანა`, 'payday-move')
  }, true)
  function paydayCovered() {
    PD.balance += short() || 70
    PD.piggy -= 70
    setHomeBalance(PD.balance)
    const card = q('.pd-card', home)
    if (card) {
      card.classList.remove('is-warn')
      card.innerHTML = `<div class="ai-nudge__head">${ORB}<b>ხელფასამდე უზრუნველყოფილია</b></div><p>ყულაბიდან 70 ₾ გადმოვიტანე. ${PD.salary} ყველა გადახდა დროზე წავა.</p>`
      setTimeout(() => aiFlash(card), 450)
    }
  }
  A['payday-move'] = () => ({
    steps: ['ვამოწმებ ყულაბას'], think: 0.3,
    title: `${money(short())} ₾ ყულაბიდან მთავარ ანგარიშზე`,
    points: [['რატომ ეს თანხა:', `ხელფასამდე ${money(dueSum())} ₾ გადასახდელია, ანგარიშზე ${money(PD.balance)} ₾ — აკლია ${money(short())} ₾.`, 1], ['ყულაბაში დარჩება:', `${money(PD.piggy - short())} ₾.`, 1]],
    sources: [SRC.plan, SRC.tx],
    actions: [{ label: 'გადმოტანა', primary: true, confirm: { title: `${money(short())} ₾-ის გადმოტანა`, detail: 'ყულაბა → მთავარი ანგარიში · საკომისიო 0 ₾', cta: 'გადმოტანა', done: `${money(short())} ₾ გადმოვიტანე — ხელფასამდე უზრუნველყოფილი ხარ` }, onDone: paydayCovered }],
    next: [],
  })
  A.payday = () => ({
    steps: ['ვამოწმებ ნაშთს', 'ვითვლი ხელფასამდე გადასახდელს'], think: 0.8,
    title: short() ? `ხელფასამდე ${money(short())} ₾ გაკლია` : 'ხელფასამდე გეყოფა',
    card: { type: 'kv', title: `ხელფასამდე (${PD.salary})`, value: `${money(dueSum())} ₾`, sub: 'გადასახდელი', rows: [...PD.dues.map(([n, a, d]) => [`${n} · ${d}`, `${money(a)} ₾`]), ['ანგარიშზე', `${money(PD.balance)} ₾`]] },
    points: [['გამოსავალი:', `ყულაბაში ${money(PD.piggy)} ₾ გაქვს — ${money(short() || 70)} ₾ საკმარისია.`, 1], ['კომუნალური:', 'შეფასებაა — ბოლო 3 თვე 78–110 ₾ იყო.', 1]],
    sources: [SRC.plan, SRC.tx],
    actions: short() ? [{ label: `ყულაბიდან ${money(short())} ₾`, primary: true, confirm: { title: `${money(short())} ₾-ის გადმოტანა`, detail: 'ყულაბა → მთავარი ანგარიში · საკომისიო 0 ₾', cta: 'გადმოტანა', done: `${money(short())} ₾ გადმოვიტანე — ხელფასამდე უზრუნველყოფილი ხარ` }, onDone: paydayCovered }] : undefined,
    next: [],
  })

  /* ===================== 2) ბარათმა უარი თქვა ===================== */
  const CARD = { name: 'Visa •• 4417', online: false }
  A.declined = () => ({
    steps: ['ვამოწმებ უარყოფილ გადახდას — Amazon · 58.90 $', 'ვამოწმებ ბარათის პარამეტრებს — ონლაინ გადახდები გამორთულია', 'ვამოწმებ ბალანსს და ლიმიტებს — რიგზეა'], think: 1.2,
    title: CARD.online ? 'ონლაინ გადახდები ჩართულია — სცადე თავიდან' : 'ონლაინ გადახდები გამორთულია',
    card: { type: 'kv', title: `${CARD.name} · Amazon 58.90 $`, rows: [['ონლაინ გადახდები', CARD.online ? 'ჩართული' : 'გამორთული ⚠︎'], ['ბალანსი', 'საკმარისია'], ['დღიური ლიმიტი', '2,000 ₾ — რიგზეა'], ['ბარათის სტატუსი', 'აქტიური']] },
    points: [['მიზეზი:', `გადახდა უარყოფილია, რადგან ${CARD.name}-ზე ონლაინ გადახდები გამორთულია. ბალანსი და ლიმიტი რიგზეა.`, 1], ['გამოსავალი:', 'ჩართე ონლაინ გადახდები და სცადე თავიდან — შემიძლია მოგვიანებით ისევ გამოვრთო.', 1]],
    sources: [SRC.card, SRC.tx],
    actions: CARD.online ? undefined : [{ label: 'ონლაინ გადახდების ჩართვა', primary: true, confirm: { title: 'ონლაინ გადახდები', detail: `${CARD.name} · გამორთული → ჩართული`, cta: 'ჩართვა', done: 'ონლაინ გადახდები ჩაირთო — სცადე გადახდა თავიდან' }, onDone: () => { CARD.online = true } }, { label: 'გამორთული დატოვე', run: () => {}, done: 'კარგი, გამორთული დარჩა' }],
    nextLabel: 'უსაფრთხოებისთვის',
    next: [{ id: 'declined-off', text: '1 საათში ისევ გამორთე' }, { id: 'declined-keep', text: 'ჩართული დატოვე' }],
  })
  A['declined-off'] = { steps: ['ვქმნი დავალებას'], think: 0.3, title: 'კარგი, 1 საათში გამოვრთავ', points: [['როდის:', 'დღეს 10:45-ზე ონლაინ გადახდებს ისევ გამოვრთავ და შეგატყობინებ.', 1], ['სად ჩანს:', 'დავალება „ჩემს დავალებებშია" — შეგიძლია გააუქმო.', 1]], sources: [SRC.card], next: [] }
  A['declined-keep'] = { steps: ['ვინიშნავ'], think: 0.2, title: 'ჩართული დარჩება', points: [['რჩევა:', 'ონლაინ გადახდებისთვის ციფრული ბარათი უფრო უსაფრთხოა — ლიმიტს თავად აკონტროლებ.', 1]], sources: [SRC.card], next: [] }

  /* ===================== 3) ადამიანთან გადართვა ===================== */
  const REQ = { open: false, status: 'პასუხს ელოდება', no: '#48213', msgs: [] }
  A.refund = {
    steps: ['ვეძებ დაბრუნებებს ბოლო 30 დღეში — ვერ ვიპოვე', 'ვეძებ საწყის გადახდას — TechShop.ge · 120 ₾ · 29 ოქტ.', 'ვამოწმებ დაბრუნების ჩვეულ ვადებს — 14 დღემდე'], think: 1.3,
    title: 'დაბრუნება ჯერ არ ჩანს — 18 დღეა',
    card: { type: 'kv', title: 'TechShop.ge · 29 ოქტომბერი', rows: [['გადახდა', '120.00 ₾'], ['დაბრუნება', 'არ მოსულა'], ['გასული დრო', '18 დღე (ჩვეულებრივ ≤14)']] },
    points: [['რა ვიპოვე:', '120 ₾-ის გადახდა TechShop.ge-ზე 29 ოქტომბერს, მაგრამ დაბრუნება ჯერ არ ჩანს.', 1], ['ეს ჩვეულებრივზე დიდხანსაა:', 'გადახდების გუნდს შეუძლია მაღაზიის ბანკს დაუკავშირდეს.', 2]],
    sources: [SRC.tx, SRC.help],
    nextLabel: 'როგორ გავაგრძელოთ?',
    next: [{ id: 'refund-handoff', text: 'გადაეცი გადახდების გუნდს' }, { id: 'refund-wait', text: 'კიდევ რამდენიმე დღე დაველოდები' }],
  }
  A['refund-wait'] = { steps: ['ვქმნი შეხსენებას'], think: 0.3, title: 'კარგი, 3 დღეში ისევ შევამოწმებ', points: [['თუ ჩაირიცხა:', 'მაშინვე შეგატყობინებ.', 1], ['თუ არა:', 'ისევ შემოგთავაზებ გუნდთან გადაცემას.', 1]], sources: [SRC.help], next: [{ id: 'refund-handoff', text: 'მაინც გადაეცი გუნდს' }] }
  A['refund-handoff'] = {
    steps: ['ვწერ შეჯამებას', 'ვარჩევ სწორ გუნდს — გადახდები'], think: 0.8,
    title: 'ამ შეჯამებას გავუგზავნი, რომ თავიდან არ მოგიწიოს ახსნა',
    card: { type: 'kv', title: 'შეჯამება ოპერატორისთვის', rows: [['საკითხი', 'თანხა არ დაბრუნდა'], ['გადახდა', 'TechShop.ge · 120 ₾ · 29 ოქტ.'], ['რა შევამოწმე', 'დაბრუნება ბოლო 30 დღეში — არ არის'], ['გუნდი', 'გადახდები']] },
    points: [['პასუხის დრო:', 'დაახლოებით 15 წუთი. შეგატყობინებ, როცა უპასუხებენ — მანამდე მე აქ ვარ.', 1], ['ცალკე ფანჯარა:', 'ადამიანთან საუბარი ცალკე ჩანს, რომ ყოველთვის იცოდე, ვის ესაუბრები.', 1]],
    sources: [SRC.help],
    actions: [{ label: 'დამაკავშირე', primary: true, run: () => { REQ.open = true; close(); setTimeout(() => openOp('wait'), 420) }, done: 'მოთხოვნა გადაეცა ნიკას · გადახდების გუნდი' }],
    next: [{ id: 'req-status', text: 'რა ხდება ჩემს მოთხოვნაზე?' }],
  }
  A['req-status'] = () => (REQ.open ? {
    steps: ['ვკითხულობ მოთხოვნას ' + REQ.no], think: 0.6,
    title: `მოთხოვნა ${REQ.no} — ${REQ.status}`,
    card: { type: 'kv', title: 'თანხა არ დაბრუნდა · TechShop.ge', rows: [['ოპერატორი', 'ნიკა · გადახდები'], ['სტატუსი', REQ.status], ['შემდეგი ნაბიჯი', REQ.status === 'ნიკამ უპასუხა' ? 'მაღაზიის ბანკი 3 სამუშაო დღეში ჩარიცხავს' : 'ნიკა ამოწმებს']] },
    points: [['მოკლედ:', REQ.status === 'ნიკამ უპასუხა' ? 'ნიკა მაღაზიის ბანკს დაუკავშირდა — თანხა 3 სამუშაო დღეში უნდა ჩაირიცხოს.' : 'ნიკამ შეჯამება მიიღო და ამოწმებს.', 1], ['როცა ჩაირიცხება:', 'შეგატყობინებ და მოთხოვნას დავხურავ.', 1]],
    sources: [SRC.help],
    actions: [{ label: 'ნიკასთან ჩატი', run: () => { close(); setTimeout(() => openOp(), 420) } }],
    next: [],
  } : { steps: ['ვამოწმებ მოთხოვნებს'], think: 0.3, title: 'ღია მოთხოვნა არ გაქვს', points: [['ბოლო:', 'ბარათის შეცვლა — მოგვარდა 12 სექტემბერს.', 1]], sources: [SRC.help], next: [] })
  A['refund-done'] = { steps: ['ვამოწმებ ჩარიცხვას'], think: 0.4, title: '120 ₾ TechShop.ge-დან დღეს ჩაირიცხა', points: [['მოთხოვნა:', `${REQ.no} დავხურე — ნიკას მადლობა გადავეცი.`, 1], ['მოგვარდა?', 'შეაფასე ქვემოთ 👍 / 👎 — თუ არა, ნიკასთან ხელახლა გავხსნი.', 1]], sources: [SRC.tx], next: [] }
  A.human = { steps: ['ვკითხულობ კითხვას'], think: 0.3, title: 'ჯერ მე ვცდი — თუ ვერ მოვაგვარე, ადამიანს გადაგაბარებ', points: [['როგორ:', 'მითხარი, რა მოხდა. თუ ოპერატორი დაგჭირდება, შეჯამებას მე დავწერ.', 1]], sources: [SRC.help], next: [{ id: 'refund', text: 'ონლაინ მაღაზიიდან თანხა არ დამიბრუნდა' }] }

  // ოპერატორის ცალკე ფანჯარა: განსხვავებული სტილი (მუქი ლურჯი სათაური, ადამიანის სახელი და გუნდი, სტატუსი)
  const op = document.createElement('div')
  op.className = 'op'
  op.hidden = true
  op.innerHTML = `<header class="op__head"><button type="button" class="op__back" aria-label="უკან"></button><span class="op__av">ნ</span><span class="op__who"><b>ნიკა</b><small>გადახდების გუნდი · Bank of Georgia</small></span><span class="op__case"></span></header>
    <div class="op__pin"><small>${ORB}BOG AI-ს შეჯამება</small><span>თანხა არ დაბრუნდა · TechShop.ge · 120 ₾ · 29 ოქტ.</span></div>
    <div class="op__msgs"></div>
    <form class="op__bar" autocomplete="off"><input placeholder="მისწერე ნიკას"><button type="submit" aria-label="გაგზავნა"></button></form>`
  document.body.append(op)
  const msgs = q('.op__msgs', op)
  const omsg = (who, text) => { msgs.insertAdjacentHTML('beforeend', `<div class="op__m is-${who}">${text}</div>`); msgs.scrollTop = msgs.scrollHeight }
  function setCase() { q('.op__case', op).textContent = `${REQ.no} · ${REQ.status}` }
  function openOp(mode) {
    op.hidden = false
    requestAnimationFrame(() => op.classList.add('is-on'))
    setCase()
    if (mode === 'wait' && !msgs.children.length) {
      omsg('sys', 'BOG AI-მ შეჯამება გადასცა ნიკას · 10:32')
      omsg('typing', '<i></i><i></i><i></i>')
      setTimeout(() => {
        q('.is-typing', msgs)?.remove()
        omsg('op', 'გამარჯობა, გიორგი! შეჯამება ვნახე, თავიდან ახსნა არ დაგჭირდებათ. TechShop.ge-ს ბანკს დავუკავშირდი — თანხა 3 სამუშაო დღეში უნდა ჩაირიცხოს. ჩარიცხვისას შეგატყობინებთ.')
        REQ.status = 'ნიკამ უპასუხა'
        setCase()
      }, 2600)
    }
  }
  q('.op__back', op).addEventListener('click', () => { op.classList.remove('is-on'); setTimeout(() => (op.hidden = true), 320) })
  q('.op__bar', op).addEventListener('submit', (e) => {
    e.preventDefault()
    const i = q('input', op)
    const v = i.value.trim()
    if (!v) return
    i.value = ''
    omsg('me', v)
    setTimeout(() => omsg('op', 'გმადლობთ, მივიღე — დამატებით რომ რამე გავიგო, აქვე მოგწერთ.'), 1400)
  })

  /* ===================== მოვლენები (მკვლევრის მენიუდან) ===================== */
  const EVENTS = {
    payday() {
      if (html.dataset.view !== 'home') tab('home')
      setHomeBalance(PD.balance)
      q('.ai-nudge:not(.pd-card)', home)?.remove() // ამ მომენტში სხვა რჩევებს/შეთავაზებებს არ ვაჩვენებთ
      setTimeout(() => {
        paydayCard()
        q('.screen__body', home).scrollTo({ top: 0, behavior: 'smooth' })
        notify('ხელფასამდე 3 დღეა', `${money(dueSum())} ₾ გადასახდელი გაქვს, ანგარიშზე — ${money(PD.balance)} ₾`, () => aiFlash(q('.pd-card', home)))
      }, 300)
    },
    declined() {
      CARD.online = false
      notify('გადახდა ვერ შესრულდა', 'Amazon · 58.90 $ · დააჭირე და გაიგე რატომ', () => window.SCR.ask('გადახდა ვერ შესრულდა · Amazon · 58.90 $', 'declined', { event: true }))
    },
    'op-reply'() {
      REQ.open = true
      REQ.status = 'ნიკამ უპასუხა'
      notify('ნიკამ უპასუხა · გადახდების გუნდი', 'TechShop.ge-ს დაბრუნებაზე', () => { if (!msgs.children.length) { omsg('sys', 'BOG AI-მ შეჯამება გადასცა ნიკას · 10:32'); omsg('op', 'გამარჯობა, გიორგი! TechShop.ge-ს ბანკს დავუკავშირდი — თანხა 3 სამუშაო დღეში უნდა ჩაირიცხოს.') } openOp() })
    },
    refund() {
      REQ.open = false
      REQ.status = 'მოგვარდა'
      setCase()
      notify('120 ₾ დაბრუნდა', 'TechShop.ge · შენი მოთხოვნა დაიხურა', () => window.SCR.ask('120 ₾ დაბრუნდა · TechShop.ge', 'refund-done', { event: true }))
    },
  }

  /* ===================== AI კონტექსტი და კითხვები ===================== */
  const refundQ = { id: 'refund', text: 'ონლაინ მაღაზიიდან თანხა არ დამიბრუნდა' }
  AI_CTX.home.prompts = [...AI_CTX.home.prompts, refundQ]
  AI_CTX.hub.prompts = [...AI_CTX.hub.prompts, refundQ]
  window.AI_ROUTE_EXTRA.unshift(
    [/ხელფასამდე|მეყოფა|ვეყოფი|ხელფასამდე/, 'payday'],
    [/გადახდა ვერ|უარი თქვა|უარყო|არ გადაიხადა|ბარათი არ მუშაობ/, 'declined'],
    [/დამიბრუნ|არ დაბრუნ|დაბრუნება|რეფანდ|refund/, 'refund'],
    [/მოთხოვნ|რა ხდება/, 'req-status'],
    [/ოპერატორ|ადამიანთან|ადამიანს|დამაკავშირე|კონსულტანტ/, 'human'],
  )
})()
