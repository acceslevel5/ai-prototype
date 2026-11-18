/* ორი სცენარი PO-ს კონცეფციის სტრუქტურით, ჩვენი BOG AI-ით:
   1) ხარჯები (PFM): ჰაბი → სტატისტიკა (ხარჯი/შემოსავალი, დიაგრამა, ბიუჯეტი, კატეგორიები) → AI ანალიზი,
      ბიუჯეტის შეთავაზება (ბიუჯეტის ეკრანი რედაქტირებით), დიდი გადახდის გაყოფა.
   2) ავტომატური გადარიცხვა: მთავარზე AI-ს ბანერი („გავხადოთ ავტომატური?") → შევსებული ფორმა → შეჯამება → წარმატება
      + „ვიპოვე კიდევ 2 მსგავსი".
   ციფრები ერთ პერსონაზეა (bank.js: persona): ხელფასი 3,400 ₾ ~1 რიცხვში, ფიქსირებული გადარიცხვები 1,350 ₾
   (ქირა 800, ბაღი 250, დედა 300), თვიური ხარჯი ≈1,600 ₾, ხელფასის შემდეგ ≈450 ₾ რჩება. */
;(() => {
  const { frame, go, back, tab, CONF, ENTER, scr, money, aiWrite, aiFlash, countUp, ORB } = window.SCR
  const q = (s, r = document) => r.querySelector(s)
  const qa = (s, r = document) => [...r.querySelectorAll(s)]
  const f0 = (n) => Math.round(n).toLocaleString('en-US')
  const P = BANK.persona
  const A = ANSWERS
  const SRC = {
    tx: { kind: 'account', name: 'შენი BOG ტრანზაქციები', detail: 'ბოლო 12 თვე · მხოლოდ BOG-ის მონაცემები' },
    cat: { kind: 'market', name: 'ხარჯების კატეგორიები', detail: 'BOG-ის კატეგორიზაცია' },
    terms: { kind: 'help', name: 'BOG-ის დახმარების ცენტრი', detail: 'ავტომატური გადარიცხვები' },
  }

  /* ===================== მონაცემები ===================== */
  const I = {
    bank: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M3 9h18M8 21l-3-3 3-3M5 18h9"/>',
    shop: '<circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M2 3h3l2.4 12h11.2L21 7H6"/>',
    food: '<path d="M7 3v8M5 3v5a2 2 0 004 0V3M7 11v10M17 3c-2 2-3 4-3 7h3v11"/>',
    basket: '<path d="M4 10h16l-1.5 10h-13zM8 10l3-6M16 10l-3-6"/>',
    car: '<path d="M5 16v-5l2-5h10l2 5v5M3 16h18v3H3z"/>',
    util: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    health: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V4h6v3M12 11v5M9.5 13.5h5"/>',
    other: '<circle cx="6" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18" cy="12" r="1.2"/>',
    salary: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
    p2p: '<circle cx="8" cy="8" r="3"/><circle cx="17" cy="10" r="2.5"/><path d="M2 20c0-3 3-5 6-5s6 2 6 5M14 20c0-2 1.5-4 3-4s4 1.5 4 4"/>',
    cash: '<path d="M12 3v18M17 7H9.5a3 3 0 000 6h5a3 3 0 010 6H6"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    filter: '<path d="M4 7h16M7 12h10M10 17h4"/>',
    stats: '<path d="M4 20V10M10 20V4M16 20v-7"/>',
    home: '<path d="M4 10l8-6 8 6v10H4z"/><path d="M10 20v-6h4v6"/>',
    repeat: '<path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 014-4h12M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 01-4 4H4"/>',
    tpl: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    gift: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8c-2-4-6-4-6-1s6 1 6 1c0 0 6 2 6-1s-4-3-6 1"/>',
  }
  const svg = (k, c = 'currentColor', s = 20) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${I[k]}</svg>`

  // ოქტომბერი 2026 (28-მდე). „გადარიცხვები" ბიუჯეტში არ ითვლება
  const EXP = [
    { n: 'გადარიცხვები', k: 'bank', c: '#E57373', v: 1350, sub: 'ბიუჯეტში არ ითვლება', excl: true },
    { n: 'რესტორნები', k: 'food', c: '#9CCC65', v: 560 },
    { n: 'სუპერმარკეტი', k: 'basket', c: '#FFB74D', v: 480 },
    { n: 'საყიდლები', k: 'shop', c: '#4DB6AC', v: 260 },
    { n: 'ტრანსპორტი', k: 'car', c: '#FFCA28', v: 170 },
    { n: 'კომუნალური', k: 'util', c: '#64B5F6', v: 160 },
    { n: 'ჯანმრთელობა', k: 'health', c: '#90A4AE', v: 95 },
    { n: 'სხვა', k: 'other', c: '#BDBDBD', v: 85 },
  ]
  const INC = [
    { n: 'ხელფასი', k: 'salary', c: '#4DB6AC', v: 3400, sub: 'შპს „ალფა ტექი"' },
    { n: 'გადმორიცხვები', k: 'p2p', c: '#64B5F6', v: 650, sub: '3 ადამიანისგან' },
    { n: 'ქეშბექი', k: 'cash', c: '#FFCA28', v: 35 },
  ]
  const SALARY = 3400, FIXED = 1350, OCT_BUDGET = 2000
  const BIG = 320
  const st = { tab: 'exp', bigPending: true, spent: 1810, rest: 560, restBudget: 600, novSet: false }
  // ნოემბრის ბიუჯეტი: ბოლო 6 თვის მედიანა, ზრდაზე −10%-მდე
  const BUD = [
    { n: 'სუპერმარკეტი', k: 'basket', c: '#FFB74D', med: 520, v: 520 },
    { n: 'რესტორნები', k: 'food', c: '#9CCC65', med: 440, v: 400 },
    { n: 'საყიდლები', k: 'shop', c: '#4DB6AC', med: 330, v: 300 },
    { n: 'ტრანსპორტი', k: 'car', c: '#FFCA28', med: 170, v: 170 },
    { n: 'კომუნალური', k: 'util', c: '#64B5F6', med: 150, v: 170 },
    { n: 'ჯანმრთელობა', k: 'health', c: '#90A4AE', med: 100, v: 100 },
    { n: 'სხვა', k: 'other', c: '#BDBDBD', med: 95, v: 90 },
  ]
  const budTotal = () => BUD.reduce((s, b) => s + b.v, 0)
  const left = () => SALARY - FIXED - budTotal()
  const saveTip = () => Math.max(0, Math.round(left() / 2 / 10) * 10)

  /* ===================== ჰაბი (რეალური აპის სტრუქტურით) ===================== */
  // ფერადი აიქონები ნაცრისფერ წრეებში
  const HI = {
    loan: ['#24a148', '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 15l6-6"/><circle cx="9.5" cy="9.5" r=".8"/><circle cx="14.5" cy="14.5" r=".8"/>'],
    bnpl: ['#8a3ffc', '<path d="M5 8l5-3 2 9-5 3zM10 7l5-3 2 9-5 3z"/><path d="M15 6l4-2 1 9-3 2"/>'],
    paydist: ['#8a3ffc', '<rect x="4" y="5" width="15" height="14" rx="3"/><path d="M8 3v4M15 3v4M4 10h15"/><rect x="11" y="12" width="9" height="7" rx="2"/><path d="M11 15h9"/>'],
    deposit: ['#6c7075', '<rect x="4" y="5" width="16" height="13" rx="2"/><circle cx="12" cy="11.5" r="2.5"/><path d="M7 18v2M17 18v2M12 7.5v1.5M12 14v1.5"/>'],
    cert: ['#e8833a', '<rect x="4" y="5" width="16" height="13" rx="2"/><path d="M8 9h4M8 12h3M8 15h2"/><path d="M16 12l1 1.5 1.6.3-1.2 1.1.3 1.6-1.7-.8-1.4.8.2-1.6-1.1-1.1 1.6-.3z"/>'],
    card: ['#e8833a', '<rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M3 10h18M7 14.5h3"/>'],
    credit: ['#4589ff', '<rect x="3" y="5" width="15" height="11" rx="2"/><path d="M3 9h15"/><rect x="11" y="11" width="10" height="9" rx="2"/><path d="M14 18l4-4"/><circle cx="14.5" cy="14.3" r=".6"/><circle cx="17.5" cy="17.3" r=".6"/>'],
    piggy: ['#24a148', '<path d="M5 12c0-3.5 3-6 7-6 1 0 2 .2 3 .6L18 5v3.5c1 .8 1.6 1.8 1.8 3H21v3h-1.5c-.5 1.2-1.4 2.2-2.5 2.8V20h-3v-1.6a8 8 0 01-3 0V20H8v-2.3C6.2 16.5 5 14.4 5 12z"/><circle cx="15.5" cy="10.5" r=".7"/>'],
    offers: ['#e8833a', '<path d="M12 2.5l2.4 2 3.1-.4.9 3 2.8 1.5-1.2 2.9 1.2 2.9-2.8 1.5-.9 3-3.1-.4-2.4 2-2.4-2-3.1.4-.9-3-2.8-1.5 1.2-2.9-1.2-2.9 2.8-1.5.9-3 3.1.4z"/><path d="M9.5 14.5l5-5"/><circle cx="9.8" cy="9.8" r=".7"/><circle cx="14.2" cy="14.2" r=".7"/>'],
    invest: ['#1d5fa8', '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 15l3-3 2 2 4-4M14 10h3v3"/>'],
    insurance: ['#8a3ffc', '<path d="M3 12a9 9 0 0118 0z"/><path d="M12 12v6a2 2 0 01-4 0"/>'],
    gift: ['#e8689a', '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M3 12h18M12 7v12M12 7c-1.5-3-5-3-5-1s5 1 5 1c0 0 5 1 5-1s-3.5-2-5 1"/>'],
    car: ['#a0522d', '<path d="M5 11l1.6-4.2A2 2 0 018.5 5.5h7a2 2 0 011.9 1.3L19 11"/><rect x="3.5" y="11" width="17" height="6" rx="2"/><path d="M6 17v2M18 17v2"/><circle cx="7.5" cy="14" r=".7"/><circle cx="16.5" cy="14" r=".7"/>'],
    travel: ['#e8833a', '<rect x="5" y="3" width="14" height="15" rx="3"/><path d="M5 11h14M8 18v3M16 18v3"/><circle cx="8.5" cy="14.5" r=".7"/><circle cx="15.5" cy="14.5" r=".7"/>'],
    auto: ['#24a148', '<path d="M20 12a8 8 0 11-3-6.2"/><path d="M20 4v4h-4"/><path d="M8.5 12.5l2.3 2.3 4.7-4.6"/>'],
    fx: ['#24a148', '<circle cx="9" cy="9" r="5"/><path d="M15 5.5A5 5 0 0119 15"/><path d="M8 7.5h2a1 1 0 010 2H8m0-2v4m1-5v1m0 4v1"/><path d="M13 19l2 2 4-1M17 17l2 3"/>'],
    pfm: ['#1d7a8c', '<path d="M12 3a9 9 0 109 9h-9z"/><path d="M15 3.5A9 9 0 0120.5 9H15z"/>'],
    bell: ['#1b1c1d', '<path d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 004 0"/>'],
  }
  const hic = (k, s = 28) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${HI[k][0]}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${HI[k][1]}</svg>`
  const PRODUCTS = [
    ['loan', 'სესხი'], ['bnpl', 'ნაწილ-ნაწილ'], ['paydist', 'გადახდის განვადება'],
    ['deposit', 'ანაბარი', 'deptypes'], ['cert', 'სადეპოზიტო სერტიფიკატი'], ['card', 'ბარათი'],
    ['credit', 'საკრედიტო ბარათი'], ['piggy', 'ყულაბა'], ['solo', 'SOLO'],
    ['offers', 'შეთავაზებები & განაცხადები'], ['invest', 'ინვესტიციები', 'investments'], ['insurance', 'დაზღვევა'],
    ['gift', 'სასაჩუქრე ბარათი'], ['car', 'მანქანა'], ['travel', 'სამგზავრო ბარათი'],
    ['auto', 'ავტომატური გადარიცხვები', 'auto'],
  ]
  const solo = '<svg width="30" height="30" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#e8a23a"/><path d="M15.2 8.6c-.8-1.2-2-1.7-3.3-1.7-1.8 0-3 .9-3 2.3 0 3 6.4 1.8 6.4 4.9 0 1.4-1.3 2.4-3.2 2.4-1.4 0-2.7-.6-3.4-1.8" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>'
  CONF.hub = { tab: 'hub', orb: 'edge' }
  const hubScr = frame('hub', {
    root: true, tab: 'hub',
    body: `<div class="hub">
      <button type="button" class="hub-profile"><span class="bog-avatar" data-size="56">გბ</span><span class="hub-profile__t"><b>გიორგი ბერიძე</b><em>SOLO Premium</em></span><span class="hub-profile__go"></span></button>
      <label class="search-field hub-search"><span class="bog-icon" style="--icon: url(../../prototypes/ai-crypto/assets/ic-search.svg)"></span><input type="search" placeholder="ძებნა" autocomplete="off"></label>
      <div class="hub-tiles">
        <button type="button" class="hub-tile"><span class="hub-tile__ico">${hic('fx', 22)}</span><span>ვალუტის კურსი</span></button>
        <button type="button" class="hub-tile" data-go="stats"><span class="hub-tile__ico">${hic('pfm', 22)}</span><span>ფინანსური მენეჯერი</span></button>
      </div>
      <h2 class="page-title hub-h">პროდუქტები</h2>
      <div class="hub-grid">${PRODUCTS.map(([k, n, to]) => `<button type="button" class="hub-item"${to && to !== 'auto' ? ` data-go="${to}"` : ''}${to === 'auto' ? ' data-act="hub-auto"' : ''}><span class="hub-item__c">${k === 'solo' ? solo : hic(k)}</span><span>${n}</span></button>`).join('')}</div>
    </div>`,
  })
  // ზედა ზოლი: QR · „ჰაბი" · ზარი · (AI — მარჯვენა კიდეზე, ჩატის ღილაკის ადგილას)
  {
    const row = q('.topbar__row', hubScr)
    row.innerHTML = `${row.firstElementChild.outerHTML}<h1 class="topbar__title hub-title">ჰაბი</h1><button class="glass-btn hub-bell" type="button" aria-label="შეტყობინებები">${hic('bell', 24)}<i></i></button>`
  }
  hubScr.addEventListener('click', (e) => {
    if (e.target.closest('[data-act="hub-auto"]')) openAuto()
    const s = q('.hub-search input', hubScr)
    if (e.target === s) return
  })
  q('.hub-search input', hubScr).addEventListener('input', (e) => {
    const v = e.target.value.trim()
    qa('.hub-item', hubScr).forEach((b) => (b.hidden = !!v && !b.textContent.includes(v)))
  })

  /* ===================== სტატისტიკა ===================== */
  CONF.stats = { tab: 'hub', orb: 'edge', parent: 'hub' }
  const statsScr = frame('stats', {
    title: 'ფინანსური მენეჯერი', tab: 'hub',
    body: `<div class="pfm">
      <div class="bog-segmented pfm-tabs" role="radiogroup" aria-label="ტიპი"><button class="bog-segment" role="radio" aria-checked="true" data-t="exp">ხარჯი</button><button class="bog-segment" role="radio" aria-checked="false" data-t="inc">შემოსავალი</button></div>
      <div class="pfm-filters"><span class="pfm-month">${svg('cal', '#ff5c0a', 18)}ოქტომბერი 2026</span><button type="button" class="bog-btn" data-type="neutral" data-size="small">${svg('filter', 'currentColor', 16)}ფილტრი</button></div>
      <div class="pfm-donut"><svg viewBox="0 0 220 220" width="220" height="220"></svg><div class="pfm-donut__c"><small></small><b></b></div></div>
      <div class="pfm-budget"></div>
      <div class="pfm-list"></div>
    </div>`,
  })
  function donut(data) {
    const tot = data.reduce((a, b) => a + b.v, 0)
    const r = 84, C = 2 * Math.PI * r
    let off = 0
    return data.map((d) => {
      const len = (d.v / tot) * C
      const out = `<circle cx="110" cy="110" r="${r}" fill="none" stroke="${d.c}" stroke-width="30" stroke-dasharray="${Math.max(0, len - 2)} ${C - len + 2}" stroke-dashoffset="${-off}" transform="rotate(-90 110 110)"/>`
      off += len
      return out
    }).join('')
  }
  const CHIPS = {
    exp: [{ id: 'sep', text: 'სად დავხარჯე თანხა სექტემბერში?' }, { id: 'plan', text: 'შემდეგი თვის ბიუჯეტირება' }, { id: 'freq', text: 'სად ვიხდი ყველაზე ხშირად?' }, { id: 'count', text: '2026-ის ტრანზაქციების რაოდენობა' }],
    inc: [{ id: 'top-in', text: 'ყველაზე მეტს ვინ მირიცხავს?' }, { id: 'inout', text: 'შემოსავალი vs ხარჯი' }, { id: 'count', text: '2026-ის ტრანზაქციების რაოდენობა' }],
  }
  function renderStats() {
    const exp = st.tab === 'exp'
    const data = exp ? EXP : INC
    const tot = data.reduce((a, b) => a + b.v, 0)
    qa('.pfm-tabs .bog-segment', statsScr).forEach((b) => b.setAttribute('aria-checked', String(b.dataset.t === st.tab)))
    q('.pfm-donut svg', statsScr).innerHTML = donut(data)
    q('.pfm-donut__c small', statsScr).textContent = exp ? 'ხარჯი' : 'შემოსავალი'
    q('.pfm-donut__c b', statsScr).textContent = `${exp ? '-' : '+'}${money(tot)} ₾`
    // ბიუჯეტის ბარათი (მხოლოდ ხარჯზე): დარჩენილი ოქტომბრის ბიუჯეტი + რგოლი
    const pct = Math.round((st.spent / OCT_BUDGET) * 100)
    const col = pct >= 90 ? '#da1e28' : pct >= 80 ? '#f1c21b' : '#24a148'
    const Cr = 2 * Math.PI * 20
    q('.pfm-budget', statsScr).innerHTML = exp ? `<button type="button" class="pfm-bcard" data-id="budget-status">
        <span class="pfm-ring"><svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="none" stroke="rgba(108,112,117,0.14)" stroke-width="4"/><circle cx="24" cy="24" r="20" fill="none" stroke="${col}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${(Cr * Math.min(pct, 100)) / 100} ${Cr}" transform="rotate(-90 24 24)"/></svg><b>${pct}%</b></span>
        <span class="pfm-bcard__t"><small>დარჩენილი ბიუჯეტი · ოქტომბერი</small><b>${money(OCT_BUDGET - st.spent)} ₾</b>${st.novSet ? `<em>${ORB}ნოემბრის ბიუჯეტი დაყენებულია · ${f0(budTotal())} ₾</em>` : ''}</span>
        <span class="bog-list-item__chevron"></span></button>` : ''
    const listTot = data.reduce((a, b) => a + b.v, 0)
    q('.pfm-list', statsScr).innerHTML = data.map((x) => `<div class="pfm-row" style="--c:${x.c}">
        <span class="pfm-row__ico" style="color:${x.c}">${svg(x.k, x.c, 22)}</span>
        <span class="pfm-row__n">${x.n}${x.sub ? `<small>${x.sub}</small>` : ''}</span>
        <span class="pfm-row__v">${exp ? '-' : '+'}${money(x.v)} ₾<small>${((x.v / listTot) * 100).toFixed(1)} %</small></span></div>`).join('')
  }
  statsScr.addEventListener('click', (e) => {
    const seg = e.target.closest('.pfm-tabs .bog-segment')
    if (seg) { st.tab = seg.dataset.t; renderStats(); window.SCR.refreshAI(); return }
    const c = e.target.closest('[data-id]')
    if (c) window.SCR.ask(c.dataset.id === 'budget-status' ? 'როგორ ვარ ოქტომბრის ბიუჯეტში?' : c.textContent.trim(), c.dataset.id)
  })
  ENTER.stats = renderStats
  renderStats()

  /* ===================== ბიუჯეტის ეკრანი ===================== */
  CONF.budget = { tab: 'hub', orb: 'edge', parent: 'stats' }
  const budScr = frame('budget', {
    title: 'ნოემბრის ბიუჯეტი', cls: 'screen--form',
    body: '<div class="bud"></div>',
    bar: '<button type="button" class="bog-btn" data-type="primary" data-width="fill" data-act="bud-save">ბიუჯეტის დაყენება</button>',
  })
  function renderBudget() {
    const tot = budTotal()
    q('.bud', budScr).innerHTML = `
      <div class="ai-note">${ORB}<span>BOG AI-მ შემოგთავაზა ბოლო 6 თვის ხარჯებიდან. ყველა თანხა შეგიძლია შეცვალო.</span><button type="button" data-act="bud-why">რატომ?</button></div>
      <div class="bud-total" data-ctx="bud-total"><small>ჯამური ბიუჯეტი</small><b data-out="bud-total">${f0(tot)} ₾</b>
        <span class="bud-track">${BUD.map((b) => `<i style="width:${(b.v / (SALARY - FIXED)) * 100}%;background:${b.c}"></i>`).join('')}</span>
        <span class="bud-legend"><span>ხელფასი − ფიქსირებული: <b>${f0(SALARY - FIXED)} ₾</b></span><span>რჩება <b data-out="bud-left">${f0(left())} ₾</b></span></span></div>
      <div class="ai-guard bud-save">${'<div class="ai-guard__head">' + ORB + `<b>გირჩევ, ${f0(saveTip())} ₾ დაზოგო</b></div>`}<p>დარჩენილის ნახევარი თვის დასაწყისში გადადე — მაგალითად, შეგროვებად ანაბარზე.</p></div>
      <h2 class="sec-title sec-title--page bud-h">კატეგორიები</h2>
      <div class="bud-cats">${BUD.map((b, i) => {
        const d = Math.round(((b.v - b.med) / b.med) * 100)
        return `<div class="bud-row" data-i="${i}" data-ctx="bud-cat">
          <span class="bud-row__ico" style="background:${b.c}22">${svg(b.k, b.c, 18)}</span>
          <span class="bud-row__n">${b.n}<small>მედიანა ${f0(b.med)} ₾${d ? ` · <em class="${d > 0 ? 'is-up' : ''}">${d > 0 ? '+' : ''}${d}%</em>` : ''}</small></span>
          <span class="bud-step"><button type="button" data-d="-10" aria-label="შემცირება">−</button><b data-out="v${i}">${f0(b.v)} ₾</b><button type="button" data-d="10" aria-label="გაზრდა">+</button></span></div>`
      }).join('')}</div>
      <h2 class="sec-title sec-title--page bud-h">შეტყობინებები</h2>
      <div class="bud-notes">
        <label class="bog-toggle"><span class="bog-toggle__row"><span class="bog-toggle__text"><span class="bog-toggle__title">გაფრთხილება 80% და 100%-ზე</span><span class="bog-toggle__desc">როცა კატეგორია ლიმიტს უახლოვდება</span></span><input type="checkbox" role="switch" class="bog-toggle__input" checked></span></label>
        <label class="bog-toggle"><span class="bog-toggle__row"><span class="bog-toggle__text"><span class="bog-toggle__title">დიდი გადახდის შემოწმება</span><span class="bog-toggle__desc">გკითხავ, ანგარიში ხომ არ გაყავი</span></span><input type="checkbox" role="switch" class="bog-toggle__input" checked></span></label>
      </div>`
  }
  function syncBudget(changed) {
    q('[data-out="bud-total"]', budScr).textContent = `${f0(budTotal())} ₾`
    q('[data-out="bud-left"]', budScr).textContent = `${f0(left())} ₾`
    q('.bud-save b', budScr).textContent = `გირჩევ, ${f0(saveTip())} ₾ დაზოგო`
    qa('.bud-track i', budScr).forEach((n, i) => (n.style.width = `${(BUD[i].v / (SALARY - FIXED)) * 100}%`))
    ;(changed || []).forEach((i) => {
      const b = BUD[i], d = Math.round(((b.v - b.med) / b.med) * 100)
      q(`.bud-row[data-i="${i}"] small`, budScr).innerHTML = `მედიანა ${f0(b.med)} ₾${d ? ` · <em class="${d > 0 ? 'is-up' : ''}">${d > 0 ? '+' : ''}${d}%</em>` : ''}`
    })
  }
  budScr.addEventListener('click', (e) => {
    const s = e.target.closest('.bud-step button')
    if (s) {
      const i = +s.closest('.bud-row').dataset.i
      BUD[i].v = Math.max(0, BUD[i].v + +s.dataset.d)
      q(`[data-out="v${i}"]`, budScr).textContent = `${f0(BUD[i].v)} ₾`
      syncBudget([i])
      return
    }
    if (e.target.closest('[data-act="bud-why"]')) return window.SCR.ask('რატომ ეს თანხები?', 'why-budget')
    if (e.target.closest('[data-act="bud-save"]')) saveBudget()
  })
  function saveBudget() {
    st.novSet = true
    BOG.toast?.({ status: 'positive', title: 'ნოემბრის ბიუჯეტი დაყენდა', text: `${f0(budTotal())} ₾ · 80%-ზე გაგაფრთხილებ` })
    back()
    setTimeout(() => { renderStats(); aiFlash(q('.pfm-bcard', statsScr)) }, 520)
  }
  function openBudget() {
    close()
    renderBudget()
    setTimeout(() => {
      go('budget')
      // AI „წერს" თანხებს
      setTimeout(() => {
        BUD.forEach((b, i) => setTimeout(() => { const n = q(`[data-out="v${i}"]`, budScr); n.textContent = ''; aiWrite(n, `${f0(b.v)} ₾`) }, i * 90))
        aiFlash(q('.bud-total', budScr))
      }, 450)
    }, 460)
  }
  // AI → ბიუჯეტი: კატეგორიების შეცვლა ანიმაციით (იუზერი მერე თავად აყენებს)
  function applyBudget(changes) {
    close()
    setTimeout(() => {
      const body = q('.screen__body', budScr)
      const first = q(`.bud-row[data-i="${changes[0][0]}"]`, budScr)
      body.scrollTo({ top: Math.max(0, first.offsetTop - 220), behavior: 'smooth' })
      setTimeout(() => {
        changes.forEach(([i, v], k) => setTimeout(() => {
          BUD[i].v = v
          const row = q(`.bud-row[data-i="${i}"]`, budScr)
          aiFlash(row)
          aiWrite(q(`[data-out="v${i}"]`, budScr), `${f0(v)} ₾`)
          syncBudget([i])
        }, k * 380))
      }, 380)
    }, 460)
  }
  ENTER.budget = () => { if (!q('.bud-row', budScr)) renderBudget() }

  /* ===================== ხარჯების AI პასუხები ===================== */
  const bars = (rows) => rows
  A.sep = {
    steps: ['ვკითხულობ სექტემბრის ტრანზაქციებს', 'ვადარებ აგვისტოს', 'ვეძებ, რა შეიცვალა'], think: 1.1,
    title: 'სექტემბერში 1,640 ₾ დახარჯე',
    card: { type: 'bars', title: 'სექტემბრის ხარჯი (გადარიცხვების გარეშე)', value: '1,640 ₾', sub: '−6% აგვისტოსთან', rows: bars([['სუპერმარკეტი', 540, '−3%', '#FFB74D'], ['რესტორნები', 420, '+22%', '#9CCC65'], ['საყიდლები', 330, '+14%', '#4DB6AC'], ['ტრანსპორტი', 170, '−8%', '#FFCA28'], ['კომუნალური', 110, '', '#64B5F6'], ['სხვა', 70, '', '#BDBDBD']]) },
    points: [
      ['რესტორნები +22%:', 'ზრდის უმეტესი ნაწილი ორი ვახშამია (140 ₾) — დანარჩენი შენი ჩვეული დონეა.', 1],
      ['საყიდლები +14%:', 'ძირითადად ერთი შენაძენი — Zara, 139 ₾.', 1],
      ['გადარიცხვები:', `${f0(FIXED)} ₾ (ქირა, ბაღი, დედა) ბიუჯეტში არ ჩავთვალე — ეს შენი რეგულარული გადარიცხვებია.`, 2],
    ],
    sources: [SRC.tx, SRC.cat],
    next: [{ id: 'plan', text: 'ბიუჯეტის დაგეგმვა' }, { id: 'rest', text: 'რესტორნები დეტალურად' }],
  }
  A.rest = {
    steps: ['ვარჩევ რესტორნების ტრანზაქციებს'], think: 0.7,
    title: 'რესტორნები · სექტემბერი — 420 ₾',
    card: { type: 'kv', title: 'სად დახარჯე', rows: [['Kakhelebi Bistro · 2 ვიზიტი', '160 ₾'], ['Wolt · 6 შეკვეთა', '110 ₾'], ['Coffee Lab · 14 ვიზიტი', '98 ₾'], ['სხვა · 5 გადახდა', '52 ₾']] },
    points: [['ფაქტი:', 'Coffee Lab-ში თითქმის ყოველ მეორე დღეს ხარ — თვეში ~100 ₾ ყავაზე.', 1], ['ზრდა:', 'Kakhelebi Bistro-ს ორი ვახშამი — ზრდის მთავარი მიზეზი.', 1]],
    sources: [SRC.tx],
    next: [{ id: 'plan', text: 'ბიუჯეტის დაგეგმვა' }, { id: 'freq', text: 'სად ვიხდი ყველაზე ხშირად?' }],
  }
  A.plan = () => ({
    steps: ['ვითვლი ბოლო 6 თვის მედიანას', 'ვამოწმებ ზრდის კატეგორიებს', 'ვადგენ ბიუჯეტს'], think: 1.3,
    title: `ნოემბრის ბიუჯეტი — ${f0(budTotal())} ₾`,
    card: { type: 'kv', title: 'ნოემბრის ბიუჯეტი', value: `${f0(budTotal())} ₾`, sub: 'ბოლო 6 თვის ხარჯებიდან', rows: BUD.map((b) => [b.n, `${f0(b.v)} ₾`]) },
    points: [
      ['როგორ დავითვალე:', 'თითო კატეგორია ბოლო 6 თვის მედიანაა; სადაც ზრდა იყო (რესტორნები, საყიდლები), მაქსიმუმ 10%-ით შევამცირე.', 1],
      ['კომუნალური ↑:', 'ზამთარში გაზი იზრდება — 170 ₾ ჩავდე.', 1],
      ['დარჩება:', `ხელფასიდან (${f0(SALARY)} ₾) გადარიცხვების (${f0(FIXED)} ₾) და ბიუჯეტის შემდეგ ≈${f0(left())} ₾ — გირჩევ ${f0(saveTip())} ₾ დაზოგო.`, 2],
    ],
    sources: [SRC.tx, SRC.cat],
    actions: [
      { label: 'ნახვა და რედაქტირება', primary: true, run: openBudget, done: 'გავხსენი ბიუჯეტი — შეცვალე და დააყენე' },
      { label: 'დაყენება ასე', confirm: { title: `ნოემბრის ბიუჯეტი · ${f0(budTotal())} ₾`, detail: '7 კატეგორია · გაფრთხილება 80%-ზე', cta: 'დაყენება', done: 'ნოემბრის ბიუჯეტი დაყენდა' }, onDone: () => { st.novSet = true; renderStats() } },
    ],
    next: [{ id: 'why-budget', text: 'რატომ ეს თანხები?' }],
  })
  A['why-budget'] = {
    steps: ['ვამოწმებ, როგორ დავთვალე'], think: 0.6,
    title: 'რატომ ეს თანხები',
    points: [
      ['მედიანა:', 'ბოლო 6 თვის შუა მნიშვნელობაა — ერთჯერადი დიდი ხარჯები (მაგ. 320 ₾-იანი ვახშამი) არ ზრდის.', 1],
      ['შემცირება:', 'სადაც ბოლო თვეებში ზრდა იყო, თვეში მაქსიმუმ 10%-ით ვამცირებ, რომ ბიუჯეტი რეალური დარჩეს.', 1],
      ['დამრგვალება:', 'თანხებს 10 ₾-მდე ვამრგვალებ — შენ შეგიძლია ნებისმიერი შეცვალო.', 2],
    ],
    sources: [SRC.tx],
    next: [{ id: 'save-more', text: 'როგორ დავზოგო მეტი?' }],
  }
  A['save-more'] = () => ({
    steps: ['ვეძებ, სად შეგიძლია დაზოგო'], think: 0.8,
    title: 'რესტორნებსა და საყიდლებზე ≈80 ₾',
    points: [
      ['რესტორნები −50 ₾:', 'Coffee Lab-ში ყავა თვეში ~100 ₾-ია — ნახევარი სახლში რომ დალიო, დაზოგავ.', 1],
      ['საყიდლები −30 ₾:', 'ბოლო 6 თვეში 3-ჯერ გადააჭარბე — 270 ₾ რეალისტურია.', 1],
      ['ჯამში:', `დარჩება ≈${f0(left() + 80)} ₾ — დაზოგვა ${f0(Math.round((left() + 80) / 2 / 10) * 10)} ₾-მდე გაიზრდება.`, 2],
    ],
    sources: [SRC.tx],
    actions: [{ label: 'ბიუჯეტში შეცვლა', primary: true, run: () => { if (!q('.bud-row', budScr)) renderBudget(); if (document.documentElement.dataset.view !== 'budget') { close(); setTimeout(() => go('budget'), 460); setTimeout(() => applyBudget([[1, BUD[1].v - 50], [2, BUD[2].v - 30]]), 900) } else applyBudget([[1, BUD[1].v - 50], [2, BUD[2].v - 30]]) }, done: 'შევცვალე — ბიუჯეტში ჩანს, დასაყენებლად დააჭირე' }],
    next: [],
  })
  A['budget-status'] = () => {
    const pct = Math.round((st.spent / OCT_BUDGET) * 100)
    return {
      steps: ['ვამოწმებ ოქტომბრის ბიუჯეტს'], think: 0.6,
      title: `ოქტომბრის ბიუჯეტის ${pct}% დახარჯე`,
      card: { type: 'bars', title: 'ოქტომბერი, დღემდე', max: OCT_BUDGET, rows: [['სულ', st.spent, `${pct}%`, pct >= 90 ? '#da1e28' : '#24a148', pct >= 90 ? 'up' : 'dn'], ['რესტორნები', st.rest, `${Math.round((st.rest / st.restBudget) * 100)}%`, '#9CCC65', st.rest / st.restBudget >= 0.9 ? 'up' : 'dn']] },
      points: [
        ['დარჩა:', `${money(OCT_BUDGET - st.spent)} ₾ თვის ბოლომდე (3 დღე).`, 1],
        ['მთავარი მიზეზი:', st.bigPending ? `რესტორნები — ${BIG} ₾-იანი ვახშამი 18 ოქტომბერს.` : 'რესტორნები ლიმიტთან ახლოსაა.', 1],
      ],
      sources: [SRC.tx],
      next: st.bigPending ? [{ id: 'big', text: 'დიდი გადახდა რესტორანში' }, { id: 'plan', text: 'შემდეგი თვის ბიუჯეტირება' }] : [{ id: 'plan', text: 'შემდეგი თვის ბიუჯეტირება' }],
    }
  }
  // დიდი გადახდა → გაყოფა
  const restBar = (v) => ['რესტორნების ბიუჯეტი', v, `${Math.round((v / st.restBudget) * 100)}%`, v / st.restBudget >= 0.9 ? '#da1e28' : '#9CCC65', v / st.restBudget >= 0.9 ? 'up' : 'dn']
  A.big = () => ({
    steps: ['ვამოწმებ ბოლო გადახდებს'], think: 0.6,
    title: `18 ოქტომბერს Kakhelebi Bistro-ში ${BIG} ₾ გადაიხადე`,
    card: { type: 'bars', title: 'რესტორნები · ოქტომბერი', max: st.restBudget, sub: `ამ გადახდით ${st.restBudget} ₾-დან ${st.rest} ₾ დაიხარჯა`, rows: [restBar(st.rest)] },
    points: [['კითხვა:', 'ასეთ ვახშამს ხშირად მეგობრებთან ერთად იხდიან. ჩავთვალო მთლიანად შენს ბიუჯეტში?', 1]],
    sources: [SRC.tx],
    nextLabel: 'აირჩიე',
    next: [{ id: 'split-q', text: 'ანგარიში გავყავი' }, { id: 'full', text: 'კი, სრულად' }, { id: 'skip', text: 'ბიუჯეტში არ ჩათვალო' }],
  })
  A['split-q'] = {
    steps: ['ვინიშნავ'], think: 0.2,
    title: 'რამდენ ადამიანზე გაიყო? შენი ჩათვლით',
    points: [],
    nextLabel: 'აირჩიე რაოდენობა',
    next: [2, 3, 4, 5].map((n) => ({ id: () => split(n), text: String(n) })),
  }
  function split(n) {
    const share = Math.round((BIG / n) * 100) / 100
    st.bigPending = false
    st.rest = 240 + share
    st.spent = 1810 - BIG + share
    renderStats()
    return {
      steps: ['ვითვლი შენს წილს', 'ვასწორებ ბიუჯეტს'], think: 0.6,
      title: `შენი წილი — ${money(share)} ₾`,
      card: { type: 'bars', title: 'რესტორნები · ოქტომბერი', max: st.restBudget, sub: `ბიუჯეტში მხოლოდ შენი წილი ჩავთვალე`, rows: [restBar(st.rest)] },
      points: [
        ['დარჩა რესტორნებზე:', `${money(st.restBudget - st.rest)} ₾ ოქტომბრის ბოლომდე.`, 1],
        ['სტატისტიკაში:', 'გადახდა ჩანს სრულად (320 ₾) — ცვლილება მხოლოდ ბიუჯეტს ეხება.', 1],
      ],
      sources: [SRC.tx],
      next: [{ id: 'plan', text: 'შემდეგი თვის ბიუჯეტირება' }],
    }
  }
  A.full = () => {
    st.bigPending = false
    renderStats()
    return { steps: ['ვინიშნავ'], think: 0.3, title: `კარგი, ${BIG} ₾ მთლიანად ჩავთვალე`, points: [['რესტორნები:', `ოქტომბერში ${st.restBudget - st.rest} ₾ დაგრჩა — 90%-ს გადააჭარბე, ამიტომ გაგაფრთხილე.`, 1]], sources: [SRC.tx], next: [{ id: 'plan', text: 'შემდეგი თვის ბიუჯეტირება' }] }
  }
  A.skip = () => {
    st.bigPending = false
    st.rest -= BIG
    st.spent -= BIG
    renderStats()
    return { steps: ['ვინიშნავ'], think: 0.3, title: 'ეს გადახდა ბიუჯეტიდან ამოვიღე', points: [['სტატისტიკაში:', 'ისევ ჩანს, მაგრამ ლიმიტს აღარ ეხება.', 1], ['რესტორნები:', `ოქტომბერში ${st.restBudget - st.rest} ₾ დაგრჩა.`, 1]], sources: [SRC.tx], next: [{ id: 'plan', text: 'შემდეგი თვის ბიუჯეტირება' }] }
  }
  A['top-in'] = {
    steps: ['ვკითხულობ 2026-ის ჩარიცხვებს'], think: 0.8,
    title: 'ყველაზე მეტი ჩარიცხვა · 2026',
    card: { type: 'kv', title: 'ტოპ 3', rows: [['1. შპს „ალფა ტექი" · ხელფასი, 10 ჩარიცხვა', '34,000 ₾'], ['2. ლევან კ. · 7 ჩარიცხვა', '1,150 ₾'], ['3. ანა მ. · 4 ჩარიცხვა', '620 ₾']] },
    points: [['ფაქტი:', 'ხელფასი ყოველთვე 1 რიცხვში შემოდის — 10-დან მხოლოდ ერთხელ დაგვიანდა 2 დღით.', 1], ['ლევანი:', '7-დან 5 ჩარიცხვა თვის ბოლოსაა.', 1]],
    sources: [SRC.tx],
    next: [{ id: 'inout', text: 'შემოსავალი vs ხარჯი' }, { id: 'count', text: '2026-ის ტრანზაქციების რაოდენობა' }],
  }
  A.count = {
    steps: ['ვითვლი 2026-ის ტრანზაქციებს'], think: 0.7,
    title: '2026 წელს 1,284 ტრანზაქცია შეასრულე',
    card: { type: 'kv', title: 'საინტერესო ფაქტები', rows: [['საშუალოდ დღეში', '4.4'], ['ყველაზე აქტიური დღე', '14 თებ. · 11'], ['ყველაზე ხარჯიანი დღე', 'შაბათი'], ['ფავორიტი', 'Coffee Lab · 96×']] },
    points: [],
    sources: [SRC.tx],
    next: [{ id: 'freq', text: 'სად ვიხდი ყველაზე ხშირად?' }, { id: 'top-in', text: 'ყველაზე მეტს ვინ მირიცხავს?' }],
  }
  A.freq = {
    steps: ['ვალაგებ გადახდებს სიხშირით'], think: 0.7,
    title: 'სად იხდი ყველაზე ხშირად · 2026',
    card: { type: 'kv', title: 'ტოპ 4', rows: [['1. Coffee Lab · რესტორნები · 1,150 ₾', '96×'], ['2. ნიკორა · სუპერმარკეტი · 2,890 ₾', '74×'], ['3. Bolt · ტრანსპორტი · 720 ₾', '61×'], ['4. Wolt · რესტორნები · 1,040 ₾', '38×']] },
    points: [['ფაქტი:', 'Coffee Lab-ში წელს 96-ჯერ იყავი — ყოველ მესამე დღეს.', 1]],
    sources: [SRC.tx],
    next: [{ id: 'count', text: '2026-ის ტრანზაქციების რაოდენობა' }, { id: 'plan', text: 'შემდეგი თვის ბიუჯეტირება' }],
  }
  A.inout = () => ({
    steps: ['ვადარებ შემოსავალს და ხარჯს'], think: 0.6,
    title: `ოქტომბერში +${f0(4085 - (FIXED + st.spent))} ₾-ით პლიუსში ხარ`,
    card: { type: 'bars', title: 'ოქტომბერი, დღემდე', max: 4085, rows: [['შემოსავალი', 4085, '', '#24a148'], ['ხარჯი', FIXED + st.spent, '', '#da1e28']] },
    points: [['გადარიცხვების გარეშე:', `ხარჯი ${f0(st.spent)} ₾-ია.`, 1], ['ფიქსირებული:', `${f0(FIXED)} ₾ — ქირა, ბაღი, დედა.`, 1]],
    sources: [SRC.tx],
    next: [{ id: 'plan', text: 'შემდეგი თვის ბიუჯეტირება' }, { id: 'top-in', text: 'ყველაზე მეტს ვინ მირიცხავს?' }],
  })

  /* ===================== ავტომატური გადარიცხვა ===================== */
  const NINO = { name: 'ნინო ბ.', iban: 'GE29 BG00 0000 0000 4512', amount: 800, day: 2, history: [['2 ივლ.', 800], ['1 აგვ.', 800], ['3 სექ.', 780], ['2 ოქტ.', 800]], purpose: 'ბინის ქირა' }
  const SIMILAR = [
    { id: 'kg', name: 'საბავშვო ბაღი', amount: 250, day: 5, sub: 'ყოველთვე ~5 რიცხვში' },
    { id: 'mom', name: 'დედა', amount: 300, day: 15, sub: 'ყოველთვე ~15 რიცხვში' },
  ]
  const at = { amount: NINO.amount, freq: 'monthly', day: NINO.day, ai: { amount: true, day: true }, done: false, dismissed: false }
  const nextDate = (day) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() + (new Date().getDate() >= day ? 1 : 0)); d.setDate(day); return d }
  const dText = (d) => `${d.getDate()} ${MONTHS[d.getMonth()]}`
  const FREQ = { monthly: 'ყოველთვე', weekly: 'ყოველკვირა', custom: 'სხვა თარიღი' }

  // მთავარზე: AI-ს ბანერი გვერდში (ჩვენი AI-ს ნიშნით) — ღილაკების შემდეგ
  const home = scr('home')
  q('.qa', home).insertAdjacentHTML('afterend', `<div class="ai-nudge" role="button" tabindex="0" data-act="at-open">
      <div class="ai-nudge__head">${ORB}<b>გავხადოთ ავტომატური?</b><button type="button" class="ai-nudge__x" data-act="at-dismiss" aria-label="დამალვა"></button></div>
      <p>${NINO.name}-ს ყოველთვე ~${NINO.day} რიცხვში ${f0(NINO.amount)} ₾-ს უგზავნი — ბოლო 4 თვე ერთნაირად.</p>
      <span class="ai-nudge__cta">ნახვა<i></i></span></div>`)
  home.addEventListener('click', (e) => {
    if (e.target.closest('[data-act="at-dismiss"]')) {
      e.stopPropagation()
      const n = q('.ai-nudge', home)
      at.dismissed = true
      n.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(0.96)' }], { duration: 220 }).finished.then(() => n.remove())
      BOG.toast?.({ status: 'neutral', title: 'ამ რჩევას აღარ გაჩვენებ', text: 'შეცვლა შეგიძლია პერსონალიზაციის პარამეტრებში' })
      return
    }
    if (e.target.closest('[data-act="at-open"]')) openAuto()
  })

  CONF.autotr = { tab: 'home', orb: 'edge', parent: 'home' }
  CONF['autotr-sum'] = { tab: 'home', orb: 'edge', parent: 'autotr' }
  CONF['autotr-ok'] = { tab: 'home', orb: 'edge', parent: 'home' }
  const atScr = frame('autotr', {
    title: 'ავტომატური გადარიცხვა', cls: 'screen--form',
    body: `<div class="dep at">
      <div class="ai-note">${ORB}<span>BOG AI-მ შეავსო შენი გადარიცხვების მიხედვით. ყველა ველი შეგიძლია შეცვალო.</span><button type="button" data-act="at-why">რატომ?</button></div>
      <h2 class="sec-title sec-title--page">ვის გადაურიცხავ?</h2>
      <div class="at-rcp" data-ctx="at-rcp"><span class="bog-avatar" data-size="40">ნბ</span><span class="at-rcp__t"><b>${NINO.name}</b><small>${NINO.iban}</small></span><span class="at-tag">${ORB}ისტორიიდან</span></div>
      <h2 class="sec-title sec-title--page at-h">რა თანხით?</h2>
      <div class="dep-field has-value" data-ctx="at-amount"><span class="dep-field__text"><span class="dep-field__label">თანხა</span><span class="dep-field__value"><span data-out="at-amount"></span><span class="dep-field__sym">₾</span></span></span><span class="dep-field__cur"><span class="bog-flag" data-size="16"><img src="../../bog-ui/assets/flags/ge.svg" alt=""></span>GEL</span></div>
      <p class="ai-hint">${ORB}ბოლო 4 თვე: ${NINO.history.map(([, v]) => f0(v)).join(' · ')} ₾</p>
      <h2 class="sec-title sec-title--page at-h">რა სიხშირით?</h2>
      <div class="dep-chips">${Object.entries(FREQ).map(([k, t]) => `<button type="button" class="dep-chip" data-freq="${k}">${t}</button>`).join('')}</div>
      <button type="button" class="dep-select at-day" data-act="at-day" data-ctx="at-day"><span class="dep-field__text"><span class="dep-field__label">როდის?</span><span class="dep-select__value" data-out="at-day"></span></span><em class="ai-tag">${ORB}ხელფასის შემდეგ</em><i class="dep-select__chev"></i></button>
      <p class="ai-hint" data-out="at-dayhint">${ORB}ხელფასი ≈${P.salaryDay} რიცხვში შემოდის — ქირა არ დაგვიანდება</p>
      <h2 class="sec-title sec-title--page at-h">დანიშნულება</h2>
      <div class="dep-field has-value"><span class="dep-field__text"><span class="dep-field__label">ავტომატურად</span><span class="dep-field__value">${NINO.purpose}</span></span></div>
      <div class="dep__sec"><h2 class="sec-title sec-title--page">საიდან ჩამოიჭრება?</h2>
        <div class="dep-acc"><span class="dep-acc__text"><span class="dep-acc__label">მიმდინარე ანგარიში<i></i></span><b>${money(P.balance)} ₾</b></span><img class="dep-acc__card" src="assets/p/acc-card-1.png" alt=""></div></div>
    </div>`,
    bar: '<button type="button" class="bog-btn" data-type="primary" data-width="fill" data-act="at-next">შეჯამება</button>',
    extra: `<div class="bog-sheet" id="sh-atday" hidden><div class="bog-sheet__panel" role="dialog" aria-modal="true"><header class="bog-sheet__nav"><div class="bog-sheet__heading"><h2 class="bog-sheet__title">აირჩიე რიცხვი</h2></div></header>
      <div class="bog-sheet__content"><div class="bog-wheel dep-wheel" role="listbox" tabindex="0">${Array.from({ length: 28 }, (_, i) => `<div class="bog-wheel__option" role="option">ყოველი თვის ${i + 1} რიცხვში</div>`).join('')}</div></div>
      <div class="bog-sheet__bar"><button class="bog-btn" data-type="primary" data-width="fill" data-act="at-day-ok">არჩევა</button></div></div></div>`,
  })
  const dayLabel = () => (at.freq === 'weekly' ? 'ყოველ ორშაბათს' : `ყოველი თვის ${at.day} რიცხვში`)
  function syncAuto() {
    q('[data-out="at-amount"]', atScr).textContent = money(at.amount)
    q('[data-out="at-day"]', atScr).textContent = dayLabel()
    qa('.dep-chip', atScr).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.freq === at.freq)))
    q('.dep-field[data-ctx="at-amount"]', atScr).classList.toggle('is-ai', at.ai.amount)
    q('.at-day', atScr).classList.toggle('is-ai', at.ai.day)
    q('[data-out="at-dayhint"]', atScr).hidden = !(at.ai.day && at.day >= P.salaryDay + 1 && at.day <= 5 && at.freq === 'monthly')
    window.SCR.refreshAI()
  }
  function openAuto() {
    Object.assign(at, { amount: NINO.amount, freq: 'monthly', day: NINO.day, ai: { amount: true, day: true } })
    syncAuto()
    q('[data-out="at-amount"]', atScr).textContent = ''
    q('[data-out="at-day"]', atScr).textContent = ''
    go('autotr')
    setTimeout(() => {
      ;[['at-amount', money(at.amount)], ['at-day', dayLabel()]].forEach(([k, t], i) => {
        const node = q(`[data-out="${k}"]`, atScr)
        const field = node.closest('.dep-field, .dep-select')
        setTimeout(() => { field.classList.add('ai-filling'); aiFlash(field); setTimeout(() => field.classList.remove('ai-filling'), 1600) }, i * 420)
        aiWrite(node, t, i * 420 + 120)
      })
    }, 560)
  }
  // AI → ფორმა: დღის შეცვლა ანიმაციით
  function applyDay(day) {
    close()
    setTimeout(() => {
      at.day = day
      at.ai.day = false
      const sel = q('.at-day', atScr)
      q('.screen__body', atScr).scrollTo({ top: Math.max(0, sel.offsetTop - 220), behavior: 'smooth' })
      setTimeout(() => {
        syncAuto()
        const node = q('[data-out="at-day"]', atScr)
        node.textContent = `ყოველი თვის ${NINO.day} რიცხვში`
        sel.classList.add('ai-filling'); aiFlash(sel); setTimeout(() => sel.classList.remove('ai-filling'), 1600)
        aiWrite(node, dayLabel())
      }, 380)
    }, 460)
  }
  atScr.addEventListener('click', (e) => {
    const t = e.target.closest('[data-act], [data-freq]')
    if (!t) return
    if (t.dataset.freq) { at.freq = t.dataset.freq; syncAuto(); return }
    const act = t.dataset.act
    if (act === 'at-why') window.SCR.ask('რატომ ეს მონაცემები?', 'why-auto')
    else if (act === 'at-day') { BOG.openSheet('sh-atday'); requestAnimationFrame(() => { const w = q('#sh-atday .bog-wheel'); qa('.bog-wheel__option', w).forEach((o, i) => o.setAttribute('aria-selected', String(i + 1 === at.day))); BOG.wheelInit(w) }) }
    else if (act === 'at-day-ok') {
      const i = qa('#sh-atday .bog-wheel__option').findIndex((o) => o.getAttribute('aria-selected') === 'true')
      at.day = i + 1
      at.ai.day = false
      BOG.closeSheet('sh-atday')
      syncAuto()
    } else if (act === 'at-next') { renderAutoSum(); go('autotr-sum') }
  })

  const atSum = frame('autotr-sum', {
    title: 'შეჯამება', cls: 'screen--form',
    body: '<div class="sum at-sum"></div>',
    bar: '<button type="button" class="bog-btn" data-type="primary" data-width="fill" data-act="at-confirm">დადასტურება</button>',
  })
  function renderAutoSum() {
    const item = (t, v) => `<div class="bog-summary__item"><dt class="bog-summary__title">${t}</dt><dd class="bog-summary__value">${v}</dd></div>`
    q('.at-sum', atSum).innerHTML = `<h2 class="sec-title sec-title--big">გადახედე დეტალებს</h2>
      <dl class="bog-summary sum__card">
        ${item('მიმღები', NINO.name)}${item('თანხა', `${money(at.amount)} ₾`)}${item('გრაფიკი', at.freq === 'weekly' ? 'ყოველკვირა, ორშაბათს' : `ყოველთვე, ${at.day} რიცხვში`)}
        ${item('პირველი გადარიცხვა', dText(nextDate(at.day)))}${item('ანგარიში', 'მიმდინარე')}${item('საკომისიო', '0.00 ₾')}
      </dl>
      <div class="bud-notes at-notes">
        <label class="bog-toggle"><span class="bog-toggle__row"><span class="bog-toggle__text"><span class="bog-toggle__title">შემახსენე 1 დღით ადრე</span><span class="bog-toggle__desc">Push შეტყობინება</span></span><input type="checkbox" role="switch" class="bog-toggle__input" checked></span></label>
        <label class="bog-toggle"><span class="bog-toggle__row"><span class="bog-toggle__text"><span class="bog-toggle__title">გამაფრთხილე, თუ ნაშთი არ იქნება საკმარისი</span><span class="bog-toggle__desc">2 დღით ადრე ვამოწმებთ</span></span><input type="checkbox" role="switch" class="bog-toggle__input" checked></span></label>
      </div>
      <p class="sum__cond">შეჩერება ან გაუქმება — ნებისმიერ დროს, შაბლონებში „დაგეგმილი".</p>`
  }
  atSum.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act="at-confirm"]')
    if (!b) return
    b.dataset.state = 'loading'
    setTimeout(() => { b.removeAttribute('data-state'); renderAutoOk(); go('autotr-ok') }, 1000)
  })

  const atOk = frame('autotr-ok', {
    close: true, cls: 'screen--form',
    body: `<div class="bog-result ok" data-status="success"><span class="bog-result__icon"></span>
      <div class="bog-result__text"><h2 class="bog-result__title">ავტომატური გადარიცხვა ჩაირთო</h2><p class="bog-result__desc"></p></div>
      <div class="bog-result__amount"><p class="bog-result__amount-title">თანხა</p><div class="bog-amount" data-size="large" data-align="center"><div class="bog-amount__main"><span class="bog-amount__value"></span><span class="bog-amount__currency">₾</span></div></div><p class="bog-result__support">მიმღები: ${NINO.name}</p></div></div>`,
    bar: '<button type="button" class="bog-btn" data-type="primary" data-width="fill" data-act="at-home">მთავარზე დაბრუნება</button>',
  })
  function renderAutoOk() {
    at.done = true
    q('.ai-nudge', home)?.remove()
    q('.bog-result__desc', atOk).textContent = `შემდეგი: ${dText(nextDate(at.day))} · ${f0(at.amount)} ₾ → ${NINO.name}`
    q('.bog-amount__value', atOk).textContent = money(at.amount)
    q('.ai-nextstep', atOk)?.remove()
    q('.ok', atOk).insertAdjacentHTML('afterend', `<div class="ai-nextstep is-waiting"><div class="ai-guard__head">${ORB}<b>ვიპოვე კიდევ 2 მსგავსი</b></div><p>ამათ ყოველთვე ხელით აგზავნი — ავტომატური გავხადო?</p>
      <div class="at-sim">${SIMILAR.map((x) => `<div class="at-sim__row"><span><b>${x.name}</b><small>${f0(x.amount)} ₾ · ${x.sub}</small></span><button type="button" class="bog-btn" data-type="secondary" data-size="small" data-sim="${x.id}">ჩართვა</button></div>`).join('')}</div></div>`)
  }
  ENTER['autotr-ok'] = () => {
    const anims = (BOG.resultIn && BOG.resultIn(atOk)) || []
    const end = anims.reduce((m, a) => Math.max(m, a.effect?.getComputedTiming().endTime || 0), 0)
    setTimeout(() => q('.ai-nextstep', atOk)?.classList.replace('is-waiting', 'is-in'), Math.max(0, end - 250))
  }
  atOk.addEventListener('click', (e) => {
    const s = e.target.closest('[data-sim]')
    if (s) { s.outerHTML = `<span class="ai-done"><span class="bog-status-icon" data-status="positive" data-size="x-small"></span>ჩაირთო</span>`; return }
    if (e.target.closest('[data-act="at-home"]')) tab('home')
  })

  /* ===================== ავტომატური გადარიცხვის AI პასუხები ===================== */
  A['why-auto'] = {
    steps: ['ვამოწმებ, რით შევავსე'], think: 0.6,
    title: 'რატომ ეს მონაცემები',
    card: { type: 'kv', title: `${NINO.name}-ს გადარიცხვები`, rows: NINO.history.map(([d, v]) => [d, `${f0(v)} ₾`]) },
    points: [
      ['თანხა:', '4 თვიდან 3-ჯერ 800 ₾ გადაურიცხე, ერთხელ — 780 ₾. ამიტომ ავირჩიე ყველაზე ხშირი თანხა.', 1],
      ['თარიღი:', `ხელფასი ≈${P.salaryDay} რიცხვში შემოდის, ამიტომ ${NINO.day} რიცხვი შევარჩიე — თანხა უკვე ანგარიშზე იქნება.`, 1],
      ['მონაცემები:', 'გამოვიყენე მხოლოდ შენი BOG-ის ტრანზაქციები.', 1],
      ['შენ წყვეტ:', 'ყველა ველი შეგიძლია შეცვალო — გადარიცხვა მხოლოდ შენი დადასტურებით ჩაირთვება.', 2],
    ],
    sources: [SRC.tx, SRC.terms],
    next: [{ id: 'auto-late', text: 'ხელფასი თუ დაგვიანდა?' }, { id: 'auto-low', text: 'რა მოხდება, თუ თანხა არ მეყოფა?' }],
  }
  A['auto-late'] = {
    steps: ['ვამოწმებ ხელფასის ისტორიას'], think: 0.6,
    title: 'ხელფასი 10-დან ერთხელ 2 დღით დაგვიანდა',
    points: [
      ['ისტორია:', 'ხელფასი თითქმის ყოველთვე 1 რიცხვში შემოდის, ერთხელ — 3 რიცხვში.', 1],
      ['რისკი:', 'ასეთ შემთხვევაში 2 რიცხვში ანგარიშზე თანხა შეიძლება არ იყოს — 2 დღით ადრე გაგაფრთხილებ.', 1],
      ['უფრო უსაფრთხოდ:', '3 რიცხვი ამ რისკსაც ფარავს და ქირა მაინც დროზე წავა.', 2],
    ],
    sources: [SRC.tx],
    actions: [{ label: 'თარიღის შეცვლა 3 რიცხვზე', primary: true, run: () => applyDay(3), done: 'შევცვალე 3 რიცხვზე — ფორმაში ჩანს' }],
    next: [{ id: 'auto-low', text: 'რა მოხდება, თუ თანხა არ მეყოფა?' }],
  }
  A['auto-low'] = {
    steps: ['ვკითხულობ პირობებს'], think: 0.5,
    title: '2 დღით ადრე გაგაფრთხილებ',
    points: [
      ['შემოწმება:', 'გადარიცხვამდე 2 დღით ადრე ვამოწმებ ნაშთს და თუ არ ჰყოფნის, შეგატყობინებ.', 1],
      ['თუ მაინც არ ეყო:', 'გადარიცხვა არ შესრულდება და თანხა მინუსში არ წავა — გეტყვი და ერთი შეხებით გაიმეორებ.', 1],
      ['ანაბრიდან:', 'თუ ანაბარი გაქვს, შემიძლია შემოგთავაზო საჭირო თანხის გადმოტანა.', 2],
    ],
    sources: [SRC.terms],
    next: [{ id: 'auto-stop', text: 'როგორ გავაჩერო?' }],
  }
  A['auto-stop'] = {
    steps: ['ვამოწმებ პარამეტრებს'], think: 0.4,
    title: 'ნებისმიერ დროს, ერთი შეხებით',
    points: [
      ['სად:', 'ჰაბი → დაგეგმილი გადარიცხვები, ან შაბლონებში „დაგეგმილი".', 1],
      ['როგორ:', 'შეგიძლია ერთი თვით გამოტოვო, შეაჩერო ან სულ გააუქმო.', 1],
    ],
    sources: [SRC.terms],
    next: [],
  }
  A['auto-offer'] = {
    steps: ['ვეძებ განმეორებად გადარიცხვებს', 'ვადარებ თანხებს და თარიღებს'], think: 1.0,
    title: 'ვიპოვე 3 განმეორებადი გადარიცხვა',
    card: { type: 'kv', title: 'ყოველთვე ხელით აგზავნი', rows: [[`${NINO.name} · ~${NINO.day} რიცხვში`, `${f0(NINO.amount)} ₾`], ...SIMILAR.map((x) => [`${x.name} · ~${x.day} რიცხვში`, `${f0(x.amount)} ₾`])] },
    points: [
      ['რატომ ავტომატური:', 'აღარ დაგავიწყდება და თარიღს ხელფასს მოვარგებ.', 1],
      ['კონტროლი:', 'ყოველ გადარიცხვამდე შეგახსენებ და ნებისმიერ დროს შეაჩერებ.', 2],
    ],
    sources: [SRC.tx, SRC.terms],
    actions: [{ label: `${NINO.name}-ს გადარიცხვის მომზადება`, primary: true, run: () => { close(); setTimeout(openAuto, 460) }, done: 'მოვამზადე — შეამოწმე და დაადასტურე' }],
    next: [],
  }

  /* ===================== AI კონტექსტი ეკრანებზე ===================== */
  Object.assign(AI_CTX, {
    hub: { prompts: [{ id: 'sep', text: 'სად დავხარჯე თანხა სექტემბერში?' }, { id: 'auto-offer', text: 'რომელი გადარიცხვები გავხადო ავტომატური?' }, { id: 'quiz', text: 'რომელი ანაბარი მერგება?' }] },
    // ფრომფთები აბრაში (როგორც კრიპტოში); დიდი გადახდა — პირველი, სანამ გადაწყვეტილი არ არის
    stats: {
      teaser: 'rotate',
      prompts: () => [...(st.tab === 'exp' && st.bigPending ? [{ id: 'big', text: `დიდი გადახდა რესტორანში — ${BIG} ₾` }] : []), ...(st.tab === 'exp' ? CHIPS.exp : CHIPS.inc)],
    },
    budget: { prompts: [{ id: 'why-budget', text: 'რატომ ეს თანხები?' }, { id: 'save-more', text: 'როგორ დავზოგო მეტი?' }] },
    autotr: { prompts: [{ id: 'why-auto', text: 'რატომ ეს მონაცემები?' }, { id: 'auto-late', text: 'ხელფასი თუ დაგვიანდა?' }, { id: 'auto-low', text: 'რა მოხდება, თუ თანხა არ მეყოფა?' }, { id: 'auto-stop', text: 'როგორ გავაჩერო?' }] },
    'autotr-sum': { prompts: [{ id: 'auto-low', text: 'რა მოხდება, თუ თანხა არ მეყოფა?' }, { id: 'auto-stop', text: 'როგორ გავაჩერო?' }] },
    'autotr-ok': { prompts: [{ id: 'auto-offer', text: 'სხვა რა გავხადო ავტომატური?' }, { id: 'auto-stop', text: 'როგორ გავაჩერო?' }] },
  })
  AI_CTX.home.prompts = [...AI_CTX.home.prompts, { id: 'auto-offer', text: 'რომელი გადარიცხვები გავხადო ავტომატური?' }]
  // აკრეფილი კითხვები (ai-bank.js AI_ROUTE-მდე მოწმდება): [regex, id, ეკრანები]
  const PFM_VIEWS = ['hub', 'stats', 'budget']
  const AT_VIEWS = ['autotr', 'autotr-sum', 'autotr-ok', 'home']
  window.AI_ROUTE_EXTRA = [
    [/სექტემბ|სად დავხარჯე|სად წავიდა/, 'sep', PFM_VIEWS],
    [/რესტორ/, () => (st.bigPending ? A.big() : A.rest), PFM_VIEWS],
    [/ბიუჯეტ.*(რატომ|როგორ დაით)|რატომ ეს თანხ/, 'why-budget', PFM_VIEWS],
    [/დავზოგო|დაზოგვ|ეკონომ/, 'save-more', PFM_VIEWS],
    [/ბიუჯეტ|დაგეგმ|შემდეგი თვ|ნოემბ/, 'plan', PFM_VIEWS],
    [/ვინ მირიცხ|მირიცხავს|ჩარიცხვ/, 'top-in', PFM_VIEWS],
    [/რამდენი ტრანზაქ|რაოდენობ/, 'count', PFM_VIEWS],
    [/ხშირად/, 'freq', PFM_VIEWS],
    [/შემოსავალი|ხარჯი vs|პლიუს|მინუს/, 'inout', PFM_VIEWS],
    [/გავყავი|გაყოფ|გავიყავით|მეგობრებთან/, 'split-q', PFM_VIEWS],
    [/დაგვიანდ|ხელფას/, 'auto-late', AT_VIEWS],
    [/არ მეყოფა|არ ეყოფა|ნაშთი|თანხა არ/, 'auto-low', AT_VIEWS],
    [/გავაჩერო|გაუქმ|შევაჩერო/, 'auto-stop', AT_VIEWS],
    [/რატომ/, 'why-auto', ['autotr', 'autotr-sum']],
    [/ავტომატ|ყოველთვე ვუგზავნი|განმეორებ/, 'auto-offer', AT_VIEWS.concat(PFM_VIEWS)],
  ]
  // proactive რჩევა სტატისტიკაზე მხოლოდ მაშინ, როცა დიდი გადახდა ჯერ გადასაწყვეტია


  /* ხანგრძლივი დაჭერა ახალ ეკრანებზე */
  ;['budget', 'autotr'].forEach((n) => window.bindLongPress?.(q('.screen__body', scr(n)), '[data-ctx]'))
  Object.assign(CTX_QUESTIONS, {
    'bud-total': ['როგორ დაითვალე ბიუჯეტი?'],
    'bud-cat': ['რატომ ეს თანხა?', 'როგორ დავზოგო აქ?'],
    'at-rcp': ['რატომ ნინო?'],
    'at-amount': ['რატომ 800 ₾?'],
    'at-day': ['რატომ 2 რიცხვი?', 'ხელფასი თუ დაგვიანდა?'],
  })
  const CTX_NAMES = { 'bud-total': 'ჯამური ბიუჯეტი', 'at-rcp': NINO.name, 'at-amount': 'თანხა', 'at-day': 'თარიღი' }
  const baseCtx = window.BANK_CTX
  window.BANK_CTX = (node) => {
    const kind = node.dataset.ctx
    if (kind === 'bud-cat') return { bank: true, kind, name: q('.bud-row__n', node).firstChild.textContent, node, logo: null, i: +node.dataset.i }
    if (CTX_NAMES[kind]) return { bank: true, kind, name: CTX_NAMES[kind], node, logo: null }
    return baseCtx(node)
  }
  const baseAns = window.BANK_CTX_ANSWER
  window.BANK_CTX_ANSWER = (c, qq) => {
    const i = (CTX_QUESTIONS[c.kind] || []).indexOf(qq)
    const res = (a) => ({ points: [], next: [], ...(typeof a === 'function' ? a() : a), ctx: c })
    if (c.kind === 'bud-total') return res(A['why-budget'])
    if (c.kind === 'bud-cat') {
      const b = BUD[c.i]
      if (i === 1) return res(A['save-more'])
      return res({ steps: ['ვამოწმებ კატეგორიის ისტორიას'], think: 0.5, title: `${b.n} — ${f0(b.v)} ₾`, points: [['მედიანა:', `ბოლო 6 თვეში შუა მნიშვნელობა ${f0(b.med)} ₾-ია.`, 1], ['რატომ ასე:', b.v < b.med ? 'ზრდა იყო, ამიტომ ~10%-ით შევამცირე.' : b.v > b.med ? 'ზამთარში ხარჯი იზრდება, ამიტომ ცოტა მეტი ჩავდე.' : 'სტაბილურია — მედიანა დავტოვე.', 1]], sources: [SRC.tx], next: [] })
    }
    if (c.kind === 'at-day') return res(i === 1 ? A['auto-late'] : A['why-auto'])
    if (c.kind === 'at-rcp' || c.kind === 'at-amount') return res(A['why-auto'])
    return baseAns(c, qq)
  }
})()
