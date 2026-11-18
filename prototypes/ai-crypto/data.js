/* ფეიკ მონაცემები: გვერდის სიები და BOG AI-ის ფრომფთები/პასუხები.
   ახალი ფრომფთის დასამატებლად: დაამატე ჩანაწერი PROMPTS-ში და პასუხი ANSWERS-ში იმავე id-ით. */

window.DATA = {
  /* კრიპტო პორტფელები და ცალკეული კრიპტოვალუტები. ეკრანის ჯამი (Portfolio), „კრიპტო" ინვესტიციებში და
     „სულ ინვესტირებული" ამ სიებიდან ითვლება (CRYPTO ქვემოთ), ამიტომ ციფრი მხოლოდ აქ იცვლება */
  portfolios: [
    { icon: 'ic-bundle.svg', name: 'AI bundle', sub: 'ჭკვიანი პორტფელი', value: '$51.12', chg: '$0.42 (0.82%)', up: true },
    { icon: 'ic-pie.svg', name: 'Top 10', sub: '10 კრიპტო', value: '$72.93', chg: '$0.61 (0.84%)', up: true },
    { icon: 'ic-pie.svg', name: 'DeFi', sub: '6 კრიპტო', value: '$64.31', chg: '$0.95 (1.46%)', up: false },
    { icon: 'ic-pie.svg', name: 'Layer 1', sub: '5 კრიპტო', value: '$121.32', chg: '$1.18 (0.98%)', up: true },
    { icon: 'ic-bundle.svg', name: 'Memecoins', sub: 'ჭკვიანი პორტფელი', value: '$42.35', chg: '$0.87 (2.10%)', up: true },
  ],
  stocks: [
    { logo: 'logo-btc.svg', name: 'BTC', sub: '0.00069 Bitcoin', value: '50.88 $', chg: '0.56$ (1.10%)', up: false },
    { logo: 'logo-eth.svg', name: 'ETH', sub: '0.0172 Ethereum', value: '35.38 $', chg: '0.94$ (2.60%)', up: false },
    { logo: 'logo-sol.svg', name: 'SOL', sub: '0.21 Solana', value: '35.28 $', chg: '0.71$ (2.05%)', up: true },
    { logo: 'logo-doge.svg', name: 'DOGE', sub: '80 Dogecoin', value: '12.40 $', chg: '0.29$ (2.39%)', up: true },
    { logo: 'logo-xrp.svg', name: 'XRP', sub: '12.5 XRP', value: '6.50 $', chg: '0.08$ (1.25%)', up: true },
  ],
  cash: 25.0, // საინვესტიციო ანგარიშზე, ჯერ არ არის ჩადებული — ჯამში არ ითვლება
  transactions: [
    { date: '25 აპრ, 2025', items: [
      { icon: 'ic-commission.svg', name: 'Solana (SOL)', sub: 'საკომისიოს გადახდა', value: '-0.05 $' },
      { logo: 'logo-sol.svg', name: 'Solana (SOL)', sub: 'ლიმიტური ყიდვა', value: '-10.00 $', extra: '+0.0595 SOL' },
    ] },
    { date: '24 აპრ, 2025', items: [
      { icon: 'ic-commission.svg', name: 'Bitcoin (BTC)', sub: 'საკომისიოს გადახდა', value: '-0.05 $' },
      { logo: 'logo-btc.svg', name: 'Bitcoin (BTC)', sub: 'საბაზრო ყიდვა', value: '-10.00 $', extra: '+0.000136 BTC' },
    ] },
  ],
}

/* ჯამები სიებიდან: total — ყველა აქტივი (პორტფელები + კრიპტოვალუტები), today — დღის ცვლილება */
{
  const num = (t) => parseFloat(String(t).replace(/[^0-9.]/g, '')) || 0
  const all = [...DATA.portfolios, ...DATA.stocks]
  const total = all.reduce((s, x) => s + num(x.value), 0)
  const today = all.reduce((s, x) => s + (x.up ? 1 : -1) * num(x.chg.split('(')[0]), 0)
  const invested = 450 // რამდენი ჩადო სულ (ფეიკ)
  const f = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  window.CRYPTO = { total, today, todayPct: (today / (total - today)) * 100, gain: total - invested, gainPct: ((total - invested) / invested) * 100, f, $: (n) => `$${f(n)}` }
}

/* წინასწარ გამზადებული ფრომფთები (Figma: Crypto - Ai Expanded) */
window.PROMPTS = [
  { id: 'opportunities', icon: 'ic-notification.svg', text: 'რა შესაძლებლობებია დღეს კრიპტო ბაზარზე?' },
  { id: 'trending', icon: 'ic-notification.svg', text: 'რა თემებია დღეს აქტუალური?' },
  { id: 'bullish', icon: 'ic-auto.svg', text: 'რომელი კრიპტო იზრდება ყველაზე სწრაფად?' },
  { id: 'buy-btc', icon: 'ic-sunrise.svg', text: 'როგორ ვიყიდო BTC?' },
  { id: 'btc-flows', icon: 'ic-stop-order.svg', text: 'BTC-ის კაპიტალის ნაკადები დღეს' },
]

/* პასუხები. points: [სათაური (bold), ტექსტი]; next: შემდეგი ნაბიჯის ფრომფთები */
const NEXT_DEFAULT = [
  { id: 'btc-indicators', text: 'BTC-ის ტექნიკური ინდიკატორები' },
  { id: 'rwa', text: 'RWA-ს ყველაზე ძლიერი აქტივები' },
  { id: 'alert', text: 'BTC-ის ფასზე შეტყობინება' },
]

/* „ფიქრის" ნაბიჯები — თუ პასუხს საკუთარი steps არ აქვს */
window.STEPS_DEFAULT = ['ვკითხულობ კითხვას', 'ვამოწმებ ბაზრის მონაცემებს', 'ვწერ შეჯამებას']

window.ANSWERS = {
  opportunities: {
    steps: ['ვამოწმებ BTC-ისა და ETH-ის ფასებს', 'ვათვალიერებ 39 ლიკვიდურ USDT წყვილს', 'ვეძებ ყველაზე ძლიერ მოძრაობებს'],
    think: 0.5,
    title: 'შეჯამება',
    points: [
      ['ბაზარი ფრთხილობს, მაგრამ ერთნაირად არ ეცემა:', '08:38 UTC-ის მდგომარეობით BTC $73.74K-ია (-1.1% 24 სთ), ETH — $2,057 (-2.6% 24 სთ). ლიკვიდურ USDT წყვილებში 34 ეცემა და 5 იზრდება.'],
      ['ზრდა რამდენიმე აქტივზეა თავმოყრილი:', 'RWA ყველაზე მყარად დგას (+0.9%), ძლიერ მოძრაობებს შორისაა ICP (+5.3%) და GRAM (+4.8%). ბაზრის მთავარი თემა მაინერების მიერ ბირჟებზე BTC-ის გადატანა და Ethereum-ის ინფრასტრუქტურის განახლებებია.'],
    ],
    next: NEXT_DEFAULT,
  },
  trending: {
    steps: ['ვკითხულობ დღევანდელ კრიპტო სიახლეებს', 'ვალაგებ თემებს ხსენების მიხედვით'],
    think: 0.8,
    title: 'დღის აქტუალური თემები',
    points: [
      ['მაინერები აქტიურობენ:', 'მაინერებიდან ბირჟებზე დიდი გადარიცხვები ყველაზე განხილული თემაა — ტრეიდერები გაყიდვის წნეხს ელოდებიან.'],
      ['Ethereum-ის განახლებები:', 'ინფრასტრუქტურის განახლებები და დაბალი საკომისიოები ETH-ს ყურადღების ცენტრში ტოვებს, მიუხედავად -2.6%-იანი დღისა.'],
      ['რეალური აქტივები (RWA):', 'ტოკენიზებული ობლიგაციები და ფონდები დაცვით აქტივად განიხილება და ყურადღებას იძენს.'],
    ],
    next: NEXT_DEFAULT,
  },
  bullish: {
    steps: ['ვადარებ 7-დღიან საშუალოებს', 'ვამოწმებ ვაჭრობის მოცულობას', 'ვალაგებ ზრდის ტემპით'],
    think: 1.1,
    title: 'ზრდის ტენდენცია',
    points: [
      ['ICP +5.3%:', 'ყველაზე ძლიერი მოძრაობა ლიკვიდურ წყვილებში — 7-დღიან საშუალოზე მაღლაა და მოცულობა იზრდება.'],
      ['GRAM +4.8%:', 'ორკვირიანი დიაპაზონიდან ამოდის ჩვეულებრივზე მაღალი მოცულობით.'],
      ['RWA +0.9%:', 'მცირე, მაგრამ სტაბილური ზრდა, როცა ბაზრის უმეტესობა ეცემა.'],
    ],
    next: NEXT_DEFAULT,
  },
  'buy-btc': {
    steps: ['ვამოწმებ, როგორ ხდება ყიდვა აპში'],
    think: 0.4,
    title: 'როგორ ვიყიდო BTC',
    points: [
      ['გახსენი კრიპტო:', 'გადადი „აღმოაჩინე"-ზე და მოძებნე Bitcoin (BTC).'],
      ['აირჩიე თანხა:', 'შეიყვანე, რამდენის დახარჯვა გინდა $-ში ან ₾-ში — შეგიძლია $1-დან დაიწყო.'],
      ['დაადასტურე:', 'გადახედე ფასს და საკომისიოს, შემდეგ დაადასტურე. BTC მაშინვე გამოჩნდება „ჩემს კრიპტოში".'],
    ],
    next: [
      { id: 'alert', text: 'BTC-ის ფასზე შეტყობინება' },
      { id: 'btc-indicators', text: 'BTC-ის ტექნიკური ინდიკატორები' },
    ],
  },
  'btc-flows': {
    steps: ['ვამოწმებ ბირჟებზე შემოსვლებს', 'ვკითხულობ სპოტ ETF-ების ნაკადებს', 'ვადარებ წინა კვირას'],
    think: 1.4,
    title: 'BTC-ის კაპიტალის ნაკადები დღეს',
    points: [
      ['ბირჟებზე შემოსვლა გაიზარდა:', 'ბოლო 24 საათში ბირჟებზე დაახლოებით 12,400 BTC გადავიდა, ძირითადად მაინერების საფულეებიდან.'],
      ['ETF-ების ნაკადები შერეულია:', 'სპოტ ETF-ებიდან მცირე წმინდა გადინება იყო, უმეტესად უდიდესი ფონდებიდან.'],
      ['რას ნიშნავს:', 'ბირჟებზე მეტი BTC ხშირად მოკლევადიან გაყიდვის წნეხს ზრდის; გრძელვადიანი მფლობელები უმეტესად უცვლელები არიან.'],
    ],
    next: NEXT_DEFAULT,
  },
  'btc-indicators': {
    steps: ['ვითვლი მოძრავ საშუალოებს', 'ვამოწმებ RSI-ს', 'ვეძებ მხარდაჭერისა და წინააღმდეგობის დონეებს'],
    think: 0.9,
    title: 'BTC-ის ტექნიკური ინდიკატორები',
    points: [
      ['ტრენდი:', 'BTC 20-დღიან მოძრავ საშუალოზე დაბლაა, 50-დღიანზე კი მაღლა — ტრენდი ნეიტრალურია.'],
      ['RSI 44:', 'არც გადახურებულია და არც ზედმეტად გაყიდული.'],
      ['მთავარი დონეები:', 'მხარდაჭერა ~$72K-ზე, წინააღმდეგობა ~$76K-ზე.'],
    ],
    next: [{ id: 'alert', text: 'BTC-ის ფასზე შეტყობინება' }],
  },
  rwa: {
    steps: ['ვარჩევ რეალური აქტივების ტოკენებს', 'ვალაგებ 24-საათიანი ცვლილებით'],
    think: 0.7,
    title: 'RWA-ს ყველაზე ძლიერი აქტივები',
    points: [
      ['ONDO +2.1%:', 'ლიდერობს ტოკენიზებულ ობლიგაციებზე მოთხოვნის ფონზე.'],
      ['POLYX +1.4%:', 'სტაბილური ზრდა საშუალო მოცულობით.'],
      ['OM +0.6%:', 'სტაბილური, წინა კვირის დიაპაზონში რჩება.'],
    ],
    next: [{ id: 'btc-indicators', text: 'BTC-ის ტექნიკური ინდიკატორები' }],
  },
  alert: {
    steps: ['ვაყენებ შეტყობინებას'],
    think: 0.3,
    title: 'ფასის შეტყობინება',
    points: [
      ['შეტყობინება დაყენდა:', 'შეგატყობინებ, როცა BTC $76,000-ს მიაღწევს ან $72,000-მდე ჩამოვა.'],
      ['ნებისმიერ დროს შეცვლი:', 'შეტყობინებები კრიპტო → პარამეტრებშია.'],
    ],
    next: [],
  },
  /* ხელით აკრეფილ კითხვაზე */
  fallback: {
    think: 1.0,
    title: 'შეჯამება',
    points: [
      ['აი, რა ვიპოვე:', 'კრიპტო ბაზარი დღეს ოდნავ ეცემა (BTC -1.1%, ETH -2.6%), თუმცა რამდენიმე აქტივი, მაგალითად ICP და GRAM, ძლიერად იზრდება.'],
    ],
    next: NEXT_DEFAULT,
  },
}

/* ხელით აკრეფილი (ან ნაკარნახევი) კითხვები: პირველი დამთხვეული საკვანძო სიტყვა წყვეტს პასუხს.
   სიტყვა სიტყვის დასაწყისს ემთხვევა („opportunit" → opportunity / opportunities). ქართული კითხვები — CRYPTO_RULES (ქვემოთ) */
window.KEYWORDS = [
  [['alert', 'notify', 'remind'], 'alert'],
  [['eth', 'ethereum'], 'eth'], // ETH ჯერ: „how to buy ETH" ETH-ის პასუხს იღებს და არა BTC-ის ყიდვის ინსტრუქციას
  [['how to buy', 'how do i buy', 'how can i buy', 'buy btc', 'buy bitcoin'], 'buy-btc'],
  [['portfolio', 'my crypto', 'my balance', 'holdings'], 'portfolio'],
  [['rwa'], 'rwa'],
  [['indicator', 'technical', 'rsi', 'support', 'resistance'], 'btc-indicators'],
  [['flow', 'inflow', 'etf'], 'btc-flows'],
  [['bullish', 'momentum', 'gainer', 'mover'], 'bullish'],
  [['trend', 'news', 'topic'], 'trending'],
  [['opportunit', 'market', 'today'], 'opportunities'],
  [['btc', 'bitcoin'], 'btc-indicators'],
]
/* ქართულად აკრეფილი კითხვები კრიპტოს ეკრანზე (რიგი მნიშვნელოვანია: უარის თქმა → კონკრეტული → ზოგადი) */
window.CRYPTO_RULES = [
  [/იწინასწარმეტყველ|პროგნოზ|გაიზრდება\?|დაეცემა\?|რამდენი იქნება|მომავალ კვირა|მომავალ თვე|100k/, 'refuse-predict'],
  [/ვიყიდო თუ|გავყიდო თუ|ღირს ყიდვა|ღირს ჩადება|გარანტ|უსაფრთხო ინვესტ|ჩავდო თუ/, 'refuse-advice'],
  [/შეტყობინ|შემატყობინე|გამაფრთხილე/, 'alert'],
  [/eth|ეთერ|ethereum/, 'eth'],
  [/როგორ ვიყიდ|ყიდვა როგორ|ვიყიდო btc|ვიყიდო ბიტკოინ/, 'buy-btc'],
  [/პორტფელ|ჩემი კრიპტო|ბალანს/, 'portfolio'],
  [/საკომისიო|გადასახად/, 'fees'],
  [/კრიპტოვალუტ|ჩემი მონეტ|შემადარე/, 'stocks'],
  [/rwa|რეალური აქტივ/, 'rwa'],
  [/ინდიკატორ|ტექნიკურ|rsi|მხარდაჭერ|წინააღმდეგობ/, 'btc-indicators'],
  [/ნაკად|etf|შემოსვლ/, 'btc-flows'],
  [/იზრდება|ზრდის|სწრაფად/, 'bullish'],
  [/აქტუალურ|სიახლე|თემ/, 'trending'],
  [/შესაძლებლობ|ბაზარ|დღეს/, 'opportunities'],
  [/btc|ბიტკოინ/, 'btc-indicators'],
]

/* მიკროფონის სანიმუშო კითხვა */
window.VOICE_SAMPLE = 'როგორ არის ჩემი პორტფელი დღეს?'

ANSWERS.eth = {
  steps: ['ვამოწმებ ETH-ის ფასს', 'ვადარებ ბოლო 7 დღეს', 'ვკითხულობ ქსელის სიახლეებს'],
  think: 0.9,
  title: 'Ethereum (ETH)',
  points: [
    ['ფასი:', 'ETH $2,057-ია (-2.6% 24 სთ), 7-დღიან საშუალოზე ~4%-ით დაბლა.'],
    ['რა მოქმედებს:', 'მთელ ბაზარზე ფრთხილი დღეა; ინფრასტრუქტურის განახლებები გრძელვადიან ინტერესს ინარჩუნებს.'],
    ['კარგია იცოდე:', 'ETH ჩვეულებრივ BTC-ზე მეტად მოძრაობს ორივე მიმართულებით, ამიტომ მოკლევადიანი რყევები მეტია.'],
  ],
  next: [
    { id: 'btc-indicators', text: 'BTC-ის ტექნიკური ინდიკატორები' },
    { id: 'alert', text: 'BTC-ის ფასზე შეტყობინება' },
  ],
}
ANSWERS.portfolio = {
  steps: ['ვხსნი შენს პორტფელს', 'ვითვლი დღის ცვლილებას', 'ვეძებ, რამ შეცვალა'],
  think: 0.8,
  title: 'შენი პორტფელი დღეს',
  points: [
    ['სულ:', `შენი კრიპტო ${CRYPTO.$(CRYPTO.total)}-ია, დღეს +${CRYPTO.$(CRYPTO.today)} (+${CRYPTO.todayPct.toFixed(2)}%).`],
    ['საუკეთესო:', 'Memecoins +2.10%-ით იზრდება, შემდეგ Layer 1 — +0.98%.'],
    ['ჩამორჩება:', 'DeFi ერთადერთი პორტფელია მინუსში, -1.46%-ით.'],
  ],
  next: NEXT_DEFAULT,
}

/* ===== პასუხის ბარათები, მოქმედებები და გვერდის მონიშვნა =====
   card:    { type: 'price' | 'movers' | 'portfolio', … } — ჩნდება სათაურის შემდეგ, ტექსტამდე
   actions: [{ label, primary?, confirm: { title, detail, cta, done } }]  — ღილაკი → დადასტურება → შედეგი
            [{ label, spot: '.selector' | { list: '#id', name: 'row label' } }] — პანელს კეცავს და გვერდზე ელემენტს ანათებს */
const BTC_CARD = { type: 'price', logo: 'logo-btc.svg', symbol: 'BTC', name: 'Bitcoin', price: '$73,740', chg: '-1.1% 24 სთ', up: false, spark: [76.1, 75.8, 75.9, 75.2, 74.9, 75.3, 74.6, 74.1, 74.4, 73.9, 73.5, 73.7] }
const ALERT_ACTION = { label: 'შეტყობინების დაყენება', confirm: { title: 'BTC-ის ფასის შეტყობინება', detail: 'შემატყობინე $76,000-ზე ან $72,000-ზე', cta: 'დაყენება', done: 'შეტყობინება დაყენდა — შეგატყობინებ' } }
const BUY_ACTION = { label: 'BTC-ის ყიდვა', primary: true, confirm: { title: '$10-ის BTC-ის ყიდვა', detail: '≈ 0.000136 BTC · საკომისიო $0.05 · საინვესტიციო თანხიდან', cta: 'ყიდვა', done: 'იყიდე $10-ის BTC' } }

ANSWERS.opportunities.card = { type: 'movers', title: 'ყველაზე ძლიერი მოძრაობა · 24 სთ', rows: [
  { sym: 'ICP', name: 'Internet Computer', chg: '+5.3%', up: true },
  { sym: 'GRAM', name: 'Gram', chg: '+4.8%', up: true },
  { sym: 'RWA', name: 'რეალური აქტივები', chg: '+0.9%', up: true },
] }
ANSWERS.bullish.card = ANSWERS.opportunities.card
ANSWERS['btc-indicators'].card = BTC_CARD
ANSWERS['btc-indicators'].actions = [ALERT_ACTION, BUY_ACTION]
ANSWERS['btc-flows'].card = BTC_CARD
ANSWERS['buy-btc'].card = BTC_CARD
ANSWERS['buy-btc'].actions = [BUY_ACTION]
ANSWERS.eth.card = { type: 'price', logo: 'logo-eth.svg', symbol: 'ETH', name: 'Ethereum', price: '$2,057', chg: '-2.6% 24 სთ', up: false, spark: [2140, 2132, 2138, 2121, 2110, 2118, 2096, 2085, 2090, 2071, 2060, 2057] }
ANSWERS.portfolio.card = { type: 'portfolio', title: 'პორტფელი', value: CRYPTO.$(CRYPTO.total), chg: `+${CRYPTO.$(CRYPTO.today)} (${CRYPTO.todayPct.toFixed(2)}%) დღეს`, up: true, rows: [
  { sym: 'Memecoins', name: 'ჭკვიანი პორტფელი', chg: '+2.10%', up: true },
  { sym: 'Layer 1', name: '5 კრიპტო', chg: '+0.98%', up: true },
  { sym: 'DeFi', name: '6 კრიპტო', chg: '-1.46%', up: false },
] }
ANSWERS.portfolio.actions = [{ label: 'გვერდზე ჩვენება', spot: { list: '#portfolios', name: 'DeFi' } }]

// შეტყობინება: AI ჯერ სთავაზობს, იუზერი ადასტურებს
ANSWERS.alert = {
  steps: ['ვამოწმებ BTC-ის ფასს', 'ვარჩევ გონივრულ დონეებს'],
  think: 0.6,
  title: 'ფასის შეტყობინება',
  card: BTC_CARD,
  points: [
    ['შემოთავაზებული დონეები:', 'შეგატყობინებ, როცა BTC $76,000-ს მიაღწევს (წინააღმდეგობა) ან $72,000-მდე ჩამოვა (მხარდაჭერა).'],
    ['ნებისმიერ დროს შეცვლი:', 'შეტყობინებები კრიპტო → პარამეტრებშია.'],
  ],
  actions: [ALERT_ACTION],
  next: [],
}

/* ===== კონტექსტური შესვლა =====
   CTX_QUESTIONS: ხანგრძლივი დაჭერის მენიუს კითხვები ელემენტის ტიპის მიხედვით
   SECTION_PROMPTS: რა ფრომფთს სთავაზობს აბრა, როცა იუზერი ამ სექციამდე ჩასქროლავს */
window.CTX_QUESTIONS = {
  portfolio: ['რატომ შეიცვალა დღეს?', 'გადავანაწილო?'],
  stock: ['რატომ შეიცვალა დღეს?', 'ვიყიდო კიდევ?'],
  tx: ['ამიხსენი ეს ტრანზაქცია'],
  chart: ['რა მოხდა ამ კვირაში?', 'რატომ დაეცა?'],
  balance: ['როგორ გამოვიყენო ეს თანხა?'],
}
window.SECTION_PROMPTS = [
  { sel: '#portfolios', id: 'portfolio', text: 'რომელი პორტფელია საუკეთესო?' },
  { sel: '#stocks', id: 'stocks', text: 'შემადარე ჩემი კრიპტოვალუტები' },
  { sel: '#transactions', id: 'fees', text: 'ამიხსენი ეს საკომისიოები' },
]
ANSWERS.stocks = {
  steps: ['ვკითხულობ შენს 5 კრიპტოვალუტას', 'ვადარებ დღის ცვლილებას'],
  think: 0.8,
  title: 'შენი კრიპტოვალუტები დღეს',
  card: { type: 'movers', title: 'კრიპტოვალუტები · დღეს', rows: [
    { sym: 'DOGE', name: 'Dogecoin', chg: '+2.39%', up: true },
    { sym: 'SOL', name: 'Solana', chg: '+2.05%', up: true },
    { sym: 'ETH', name: 'Ethereum', chg: '-2.60%', up: false },
  ] },
  points: [
    ['ლიდერები:', 'DOGE და SOL 2%-ზე მეტით იზრდება — დღეს ალტკოინები ქაჩავენ.'],
    ['ჩამორჩენილები:', 'ETH (-2.60%) და BTC (-1.10%) მინუსშია ბაზრის ფრთხილი განწყობის გამო.'],
    ['საერთო:', 'ხუთიდან სამი იზრდება; ერთად ' + CRYPTO.$(DATA.stocks.reduce((s, x) => s + parseFloat(x.value), 0)) + ' ღირს.'],
  ],
  actions: [{ label: 'გვერდზე ჩვენება', spot: { list: '#stocks', name: 'ETH' } }],
  next: [],
}
ANSWERS.fees = {
  steps: ['ვკითხულობ ბოლო ტრანზაქციებს', 'ვაჯამებ საკომისიოებს'],
  think: 0.7,
  title: 'ბოლო საკომისიოები',
  points: [
    ['რა არის:', 'თითო $0.05 — ერთი კრიპტოს ყიდვის შეკვეთის საკომისიოა (BTC და SOL).'],
    ['ამ თვეში:', '$20.00-ის ყიდვაზე საკომისიოში $0.10 გადაიხადე — თანხის 0.5%.'],
    ['როგორ გადაიხადო ნაკლები:', 'ნაკლები, მაგრამ დიდი შეკვეთები ნაკლებ ფიქსირებულ საკომისიოს ნიშნავს.'],
  ],
  next: [],
}

/* ===== წყაროები =====
   ყველა პასუხს აქვს sources სია; პუნქტის ბოლოს პატარა ნომერი მიუთითებს წყაროზე.
   პუნქტის მესამე ელემენტით (['lead', 'text', 2]) შეიძლება კონკრეტული წყაროს მითითება; თუ არ არის — რიგით ნაწილდება */
window.SOURCES = {
  market: { kind: 'market', name: 'BOG-ის ბაზრის მონაცემები', detail: 'ცოცხალი ფასები · განახლდა 08:38 UTC' },
  news: { kind: 'news', name: 'ბაზრის სიახლეები', detail: 'CoinDesk, The Block · დღეს' },
  account: { kind: 'account', name: 'შენი BOG ანგარიში', detail: 'აქტივები და ტრანზაქციები' },
  help: { kind: 'help', name: 'BOG-ის დახმარების ცენტრი', detail: 'როგორ ხდება კრიპტოს ყიდვა' },
  tariffs: { kind: 'help', name: 'BOG-ის ტარიფები', detail: 'საინვესტიციო საკომისიოები' },
}
const src = (...keys) => keys.map((k) => SOURCES[k])
ANSWERS.opportunities.sources = src('market', 'news')
ANSWERS.trending.sources = src('news')
ANSWERS.bullish.sources = src('market')
ANSWERS['buy-btc'].sources = src('help', 'market')
ANSWERS['btc-flows'].sources = src('market', 'news')
ANSWERS['btc-indicators'].sources = src('market')
ANSWERS.rwa.sources = src('market')
ANSWERS.alert.sources = src('market')
ANSWERS.eth.sources = src('market', 'news')
ANSWERS.portfolio.sources = src('account', 'market')
ANSWERS.stocks.sources = src('account', 'market')
ANSWERS.fees.sources = src('account', 'tariffs')
ANSWERS.fallback.sources = src('market')
// „როგორ ვიყიდო BTC": სამივე ნაბიჯი დახმარების ცენტრიდანაა; ბაზრის მონაცემი ფასის ბარათს ეკუთვნის
ANSWERS['buy-btc'].points.forEach((p) => (p[2] = 1))

/* ===== ისტორია: წინა საუბრები (პროტოტიპისთვის წინასწარ შევსებული). turns: [კითხვა, პასუხის id] ===== */
window.HISTORY = [
  { title: 'როგორ ვიყიდო BTC?', when: 'გუშინ', turns: [['როგორ ვიყიდო BTC?', 'buy-btc'], ['BTC-ის ფასზე შეტყობინება', 'alert']] },
  { title: 'ამიხსენი ეს საკომისიოები', when: 'ორშაბათი', turns: [['ამიხსენი ეს საკომისიოები', 'fees']] },
  { title: 'რა თემებია დღეს აქტუალური?', when: 'წინა კვირა', turns: [['რა თემებია დღეს აქტუალური?', 'trending']] },
]

/* ===== შეცდომები და შეზღუდვები =====
   „ვერ გიპასუხებ": notice ჩნდება სათაურის ნაცვლად (bog-ui Feedback, info), შემდეგ — რისი გაკეთება შეუძლია.
   საკვანძო სიტყვები სიის თავში ემატება, რომ ETH/BTC-ის წესებზე ადრე შემოწმდეს */
ANSWERS['refuse-predict'] = {
  steps: ['ვკითხულობ კითხვას'],
  think: 0.4,
  notice: { status: 'info', title: 'ფასს ვერ ვიწინასწარმეტყველებ', desc: 'კრიპტოს მომავალს ვერავინ იტყვის საიმედოდ. აი, რაში შემიძლია დაგეხმარო.' },
  points: [
    ['დღევანდელი სურათი:', 'BTC $73,740-ია (-1.1%), ETH — $2,057 (-2.6%).'],
    ['მნიშვნელოვანი დონეები:', 'BTC-ის მხარდაჭერა ~$72K-ზე, წინააღმდეგობა ~$76K-ზე.'],
  ],
  sources: [SOURCES.market],
  next: [
    { id: 'btc-indicators', text: 'BTC-ის ტექნიკური ინდიკატორები' },
    { id: 'alert', text: 'BTC-ის ფასზე შეტყობინება' },
  ],
}
ANSWERS['refuse-advice'] = {
  steps: ['ვკითხულობ კითხვას'],
  think: 0.4,
  notice: { status: 'info', title: 'პერსონალურ საინვესტიციო რჩევას ვერ მოგცემ', desc: 'ყიდვა-გაყიდვა შენს მიზნებსა და რისკზეა დამოკიდებული. შემიძლია ფაქტები გაგიზიარო, რომ გადაწყვიტო.' },
  points: [
    ['შენი პოზიცია:', `შენი კრიპტო ${CRYPTO.$(CRYPTO.total)}-ია, დღეს +${CRYPTO.todayPct.toFixed(2)}%.`],
    ['ესაუბრე ექსპერტს:', 'BOG-ის საინვესტიციო მრჩეველი დაგეხმარება გეგმის შედგენაში.'],
  ],
  sources: [SOURCES.account],
  next: [
    { id: 'btc-indicators', text: 'BTC-ის ტექნიკური ინდიკატორები' },
    { id: 'bullish', text: 'რომელი კრიპტო იზრდება ყველაზე სწრაფად?' },
  ],
}
KEYWORDS.unshift(
  [['predict', 'prediction', 'forecast', 'will btc', 'will eth', 'will bitcoin', 'go up', 'go down', 'price target', 'next week', 'next month', '100k'], 'refuse-predict'],
  [['should i buy', 'should i sell', 'should i invest', 'is it a good buy', 'good buy', 'good time to buy', 'guarantee', 'safe investment', 'all in'], 'refuse-advice'],
)

/* მოქმედების წარუმატებლობის ტექსტები */
window.ACTION_ERROR = { title: 'ყიდვა ვერ შესრულდა', desc: 'ბირჟასთან კავშირი ვერ დამყარდა. თანხა არ ჩამოგეჭრა.', alertTitle: 'შეტყობინება ვერ დაყენდა', alertDesc: 'ჩვენს მხარეს რაღაც შეფერხდა. სცადე თავიდან.' }
