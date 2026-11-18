/* BOG AI ბანკის ეკრანებზე (ქართულად): რას სთავაზობს თითო ეკრანზე, proactive შეტყობინებები,
   ანაბრის არჩევის ქვიზი და პასუხები. პასუხი შეიძლება იყოს ფუნქცია — ითვლება კითხვის მომენტში
   ფორმის მიმდინარე მდგომარეობით (DEP_API.state()).
   პრინციპები: AI ყოველთვის ამბობს, საიდან იცის (წყაროები); უარყოფით მხარეს ისევე აჩვენებს, როგორც სარგებელს;
   ავსებს/ცვლის/გადაჰყავს, მაგრამ ბოლო ღილაკს მხოლოდ იუზერი აჭერს. */
;(() => {
  const P = BANK.persona
  const D = DEPOSITS
  const m2 = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const m0 = (n) => Math.round(n).toLocaleString('en-US')
  const SRC = {
    tx: { kind: 'account', name: 'შენი BOG ტრანზაქციები', detail: 'ბოლო 12 თვე · მხოლოდ BOG-ის მონაცემები' },
    rates: { kind: 'market', name: 'BOG-ის ანაბრის განაკვეთები', detail: 'ნოემბერი 2026' },
    terms: { kind: 'help', name: 'ანაბრის პირობები', detail: 'ხელშეკრულება და ტარიფები' },
  }
  const st = () => window.DEP_API?.state()
  const view = () => document.documentElement.dataset.view

  /* --- ანაბრის მოკლე პირობები (შეჯამებაზე „მთავარი, რაც უნდა იცოდე") და შემდეგი ნაბიჯი (წარმატებაზე) --- */
  D.accumulate.key = ['თანხის დამატება ნებისმიერ დროს შეგიძლია.', 'ვადამდე გატანისას სარგებლის ნაწილს დაკარგავ — გადაითვლება დაბალი განაკვეთით.', 'ანაბარი დაზღვეულია დეპოზიტების დაზღვევის სისტემით.']
  D.ondemand.key = ['თანხას ნებისმიერ დროს გაიტან, სარგებლის დაკარგვის გარეშე.', 'სარგებელი ერიცხება თვის განმავლობაში არსებულ მინიმალურ ნაშთს.', 'ანაბარი დაზღვეულია დეპოზიტების დაზღვევის სისტემით.']
  D.term.key = ['გახსნის შემდეგ თანხას ვეღარ დაამატებ.', 'ვადამდე გატანისას სარგებელი მოთხოვნამდე ანაბრის განაკვეთით (6.00%) გადაითვლება.', 'ანაბარი დაზღვეულია დეპოზიტების დაზღვევის სისტემით.']
  D.accumulate.nextStep = { title: `ყოველთვე ავტომატურად დავამატო 400 ₾?`, desc: `ხელფასი ≈${P.salaryDay} რიცხვში შემოდის და საშუალოდ ≈${P.leftover} ₾ გრჩება. ყოველი თვის 2 რიცხვში გადავრიცხავ — ნებისმიერ დროს გათიშავ.`, cta: 'ჩართვა', done: 'ჩაირთო: ყოველი თვის 2 რიცხვში 400 ₾' }
  D.term.nextStep = { title: 'ვადის დასრულებამდე შეგახსენო?', desc: '7 დღით ადრე მოგწერ, რომ გადაწყვიტო — გააგრძელებ თუ თანხა ანგარიშზე დაბრუნდება.', cta: 'შემახსენე', done: 'შეგახსენებ 7 დღით ადრე' }
  D.ondemand.nextStep = { title: 'ხელფასის შემდეგ ნაშთი აქ გადმოვიტანო?', desc: `ყოველი თვის 2 რიცხვში ≈${P.leftover} ₾-ს გადმოვიტან, ხარჯისთვის საჭირო თანხა ანგარიშზე დარჩება.`, cta: 'ჩართვა', done: 'ჩაირთო: ყოველი თვის 2 რიცხვში' }

  /* --- ეკრანების კონტექსტი: ჩიპები + proactive (აბრაზე ორი ხაზი მონაცვლეობით; დაჭერა = კითხვა question) --- */
  const Q = {
    idle: { id: 'idle', text: 'როგორ გამოვიყენო უმოქმედო 3,000 ₾?' },
    spend: { id: 'spend', text: 'რამდენს ვხარჯავ თვეში?' },
    which: { id: 'quiz', text: 'რომელი ანაბარი მერგება?' },
    quiz: { id: 'quiz', text: 'დამეხმარე ანაბრის არჩევაში' },
    diff: { id: 'types-diff', text: 'რით განსხვავდება ეს სამი?' },
    early: { id: 'early', text: 'რა მოხდება ვადამდე გატანისას?' },
    terms: { id: 'terms-3', text: 'მარტივად ამიხსენი პირობები' },
    insured: { id: 'insured', text: 'დაზღვეულია ჩემი ანაბარი?' },
    after: { id: 'what-next', text: 'რა ხდება ახლა?' },
  }
  window.AI_CTX = {
    home: { prompts: [Q.idle, Q.spend, Q.which], proactive: { id: 'idle', question: Q.idle.text, lines: ['3,000 ₾ უმოქმედოა', 'ანაბარზე ≈142 ₾'], delay: 1400 } },
    myspace: { prompts: [Q.which, Q.diff, Q.spend] },
    investments: { prompts: [Q.which, Q.spend] },
    add: { prompts: [Q.which, Q.diff, Q.spend] },
    deptypes: { prompts: [Q.quiz, Q.diff, Q.early], proactive: { id: 'quiz', question: Q.quiz.text, lines: ['არ იცი, რომელი აირჩიო?', '2 კითხვით დაგეხმარები'], delay: 900 } },
    deposit: {
      prompts: () => {
        const s = st()
        const list = []
        if (s?.ai) list.push({ id: 'why-fill', text: 'რატომ ეს თანხა და ვადა?' })
        if (s?.T.term) list.push({ id: 'term-alt', text: `${s.months === 12 ? 6 : 12} თვეზე რამდენს მივიღებ?` })
        if (s?.T.payout && s.payout === 'end') list.push({ id: 'payout-monthly', text: 'ყოველთვე სარგებელი ხომ არ ჯობს?' })
        if (s?.type === 'term') list.push({ id: 'acc-vs-term', text: 'შეგროვებადი ხომ არ ჯობს?' })
        list.push(Q.early)
        return list.slice(0, 4)
      },
    },
    accounts: { prompts: [Q.early, Q.spend] },
    summary: { prompts: [Q.terms, Q.early, Q.insured] },
    success: { prompts: [Q.after, Q.spend] },
  }

  /* --- აკრეფილი კითხვა → პასუხი (მხოლოდ ბანკის ეკრანებზე; კრიპტოზე ძველი წესები) --- */
  window.AI_ROUTE = (t) => {
    // კრიპტოს ეკრანი: ქართული კითხვები (data.js: CRYPTO_RULES); ვერ ამოიცნო → ინგლისური KEYWORDS → ზოგადი პასუხი
    if (view() === 'crypto') { const h = (window.CRYPTO_RULES || []).find(([re]) => re.test(t)); return h ? h[1] : null }
    // სხვა სცენარების წესები (pfm.js): [regex, id, ეკრანები] — ჯერ ისინი
    const ex = (window.AI_ROUTE_EXTRA || []).find(([re, , vs]) => (!vs || vs.includes(view())) && re.test(t))
    if (ex) return ex[1]
    // რიგი მნიშვნელოვანია: კონკრეტული ფრაზები ზოგადზე ადრე. ერთი კითხვა რამდენიმე ფორმულირებით
    const rules = [
      [/ვადამდე|გავიტან|გამოვიტან|გატან|დამჭირდ|დამჭირდეს|თუ ფული|თუ თანხა|შუაში/, 'early'],
      [/რატომ/, view() === 'deposit' ? 'why-fill' : 'idle'],
      [/ვადიანი თუ|შეგროვებადი თუ|შეგროვებ.*ჯობს|ჯობს.*შეგროვებ/, 'acc-vs-term'],
      [/განსხვავ|სხვაობა|რით გან/, 'types-diff'],
      [/ეფექტურ|პროცენტ|განაკვეთ|რამდენს მომცემ|რამდენს მივიღებ|რამდენი სარგებ|რამდენს გამოვიმუშავ/, view() === 'deposit' || view() === 'summary' ? 'rate-explain' : 'types-diff'],
      [/რამდენი დავდო|რამდენი ჩავდო|რა თანხა|რა თანხით|რამდენით გავხსნა|მინიმალ|მაქსიმალ/, 'amount-advice'],
      [/დავამატო|დამატება|შევავსო|ყოველთვე ჩავრიცხ/, 'topup'],
      [/ვადის ბოლოს რა|გაგრძელ|დასრულდება|ვადა რომ გავა/, 'renewal'],
      [/საკომისიო|გადასახადი|ფასიანი/, 'dep-fees'],
      [/ვალუტ|დოლარ|ევრო|usd|eur/, 'currency'],
      [/როგორ გავხსნა|გახსნა როგორ|სად გავხსნა|როგორ ვხსნი/, 'how-open'],
      [/რომელი|არჩევ|მერგება|დამეხმარე|მირჩიე|რა მირჩევ/, 'quiz'],
      [/\d+ ?თვ|ვად/, 'term-alt'],
      [/ყოველთვ/, 'payout-monthly'],
      [/პირობ|ხელშეკრულ/, 'terms-3'],
      [/დაზღვ|რისკ|უსაფრთხო|დავკარგავ/, 'insured'],
      [/უმოქმედ|3,?000|ნაშთ|ანაბარ/, 'idle'],
      [/ხარჯ|ვხარჯავ/, 'spend'],
    ]
    const hit = rules.find(([re]) => re.test(t))
    return hit ? hit[1] : 'ka-fallback'
  }
  window.AI_FALLBACK = () => ANSWERS['ka-fallback']()

  /* --- პასუხები --- */
  const A = ANSWERS
  A['ka-fallback'] = () => ({
    steps: ['ვკითხულობ კითხვას'], think: 0.4,
    title: 'ამაზე პასუხი პროტოტიპში ჯერ არ მაქვს',
    points: [['', 'სცადე ერთ-ერთი კითხვა ქვემოთ — ამ ეკრანზე ამაში დაგეხმარები.']],
    next: PROMPTS.slice(0, 3),
  })

  A.spend = {
    steps: ['ვკითხულობ ბოლო 6 თვის ტრანზაქციებს', 'ვაჯამებ კატეგორიებს'], think: 0.8,
    title: `თვეში საშუალოდ ≈${m0(P.spend)} ₾-ს ხარჯავ`,
    card: { type: 'kv', title: 'საშუალო თვიური ხარჯი · ბოლო 6 თვე', rows: [['სუპერმარკეტი', '≈520 ₾'], ['რესტორნები', '≈380 ₾'], ['ტრანსპორტი', '≈170 ₾'], ['კომუნალური', '≈160 ₾'], ['სხვა', '≈370 ₾']] },
    points: [['ხელფასის შემდეგ:', `ყოველთვე საშუალოდ ≈${P.leftover} ₾ გრჩება.`, 1], ['ნაშთი:', `${m0(P.idle)} ₾ ${P.idleDays} დღეა ანგარიშზე დევს და არ გამოგიყენებია.`, 1]],
    sources: [SRC.tx],
    next: [Q.idle, Q.which],
  }

  // proactive (მთავარი): უმოქმედო ნაშთი → ვადიანი ანაბარი
  A.idle = () => {
    const c = DEP_API.calc('term', P.idle, 6, 'end')
    return {
      steps: ['ვამოწმებ ნაშთის ისტორიას', 'ვითვლი თვიურ ხარჯს', 'ვადარებ ანაბრების განაკვეთებს'], think: 1.1,
      title: `${m0(P.idle)} ₾ შეგიძლია ვადიან ანაბარზე დადო`,
      card: { type: 'kv', title: 'ვადიანი ანაბარი · 6 თვე', value: `+${m2(c.interest)} ₾`, sub: 'სარგებელი ვადის ბოლოს', rows: [['თანხა', `${m2(P.idle)} ₾`], ['განაკვეთი', `${c.r.toFixed(2)}% · ეფექტური ${c.eff.toFixed(2)}%`], ['ანგარიშზე დაგრჩება', `${m2(P.balance - P.idle)} ₾`]] },
      points: [
        ['უმოქმედოა:', `${m0(P.idle)} ₾-ზე მეტი ${P.idleDays} დღეა ანგარიშზე დევს და არ შემცირებულა.`, 1],
        ['ბუფერი რჩება:', `თვეში საშუალოდ ≈${m0(P.spend)} ₾-ს ხარჯავ — ანგარიშზე დარჩენილი ${m2(P.balance - P.idle)} ₾ ამას ფარავს.`, 1],
        ['რატომ 6 თვე:', 'ბოლო 12 თვეში ერთჯერადი დიდი ხარჯი არ გქონია, ამიტომ 6 თვე უსაფრთხო ვადაა.', 1],
        ['გაითვალისწინე:', 'ვადამდე გატანისას სარგებელი დაბალი განაკვეთით გადაითვლება. თუ თანხა შეიძლება დაგჭირდეს, მოთხოვნამდე ანაბარი ჯობს.', 2],
      ],
      sources: [SRC.tx, SRC.rates],
      actions: [{ label: 'ანაბრის მომზადება', primary: true, run: () => DEP_API.prefill('term', { amount: P.idle, months: 6, why: 'idle' }), done: 'მოვამზადე — შეამოწმე და დაადასტურე' }],
      next: [Q.early, { id: 'acc-vs-term', text: 'შეგროვებადი ხომ არ ჯობს?' }],
    }
  }

  A.early = () => {
    const s = st()
    const inForm = view() === 'deposit' || view() === 'summary'
    const type = inForm ? s.type : 'term'
    const amount = inForm && s.amountN ? s.amountN : P.idle
    const months = inForm && s.T.term ? s.months : 6
    if (type === 'ondemand') return {
      steps: ['ვკითხულობ ანაბრის პირობებს'], think: 0.5,
      title: 'მოთხოვნამდე ანაბარზე არაფერს დაკარგავ',
      points: [['გატანა:', 'თანხას ნებისმიერ დროს გაიტან, დარიცხული სარგებელი შენთან რჩება.', 1], ['სარგებელი:', 'ერიცხება თვის მინიმალურ ნაშთს — თვის შუაში გატანა იმ თვის სარგებელს შეამცირებს.', 1]],
      sources: [SRC.terms], next: [Q.diff],
    }
    const half = Math.max(1, Math.round(months / 2))
    const full = DEP_API.calc(type, amount, half, 'end').interest
    const low = amount * 0.06 * half / 12
    return {
      steps: ['ვკითხულობ ანაბრის პირობებს', 'ვითვლი მაგალითს შენი თანხით'], think: 0.8,
      title: 'თანხას არ დაკარგავ — სარგებლის ნაწილს დაკარგავ',
      card: { type: 'kv', title: `მაგალითი: ${m0(amount)} ₾, გატანა ${half} თვეში`, rows: [[`${half} თვის სარგებელი ანაბრის განაკვეთით`, `≈${m2(full)} ₾`], ['ვადამდე გატანისას (6.00%)', `≈${m2(low)} ₾`]] },
      points: [
        ['თანხა:', `შენი ${m0(amount)} ₾ სრულად დაგიბრუნდება.`, 1],
        ['სარგებელი:', 'გადაითვლება მოთხოვნამდე ანაბრის განაკვეთით (6.00%) იმ დღეებზე, რაც თანხამ ანაბარზე დაყო.', 1],
        ['თუ ეს გაწუხებს:', type === 'term' ? 'მოთხოვნამდე ანაბარზე თანხა ნებისმიერ დროს ხელმისაწვდომია, ოღონდ განაკვეთი დაბალია.' : 'აირჩიე უფრო მოკლე ვადა — ასე რისკი ნაკლებია.', 1],
      ],
      sources: [SRC.terms],
      next: inForm && s.T.term ? [{ id: 'term-alt', text: `${s.months === 12 ? 6 : 12} თვეზე რამდენს მივიღებ?` }] : [Q.diff],
    }
  }

  A['acc-vs-term'] = () => ({
    steps: ['ვადარებ ორ ტიპს', 'ვითვლი 12 თვის სცენარს'], think: 0.9,
    title: 'თუ ყოველთვე დამატებას აპირებ — კი',
    card: { type: 'kv', title: '12 თვის შემდეგ · 3,000 ₾ + 400 ₾ ყოველთვე', rows: [['შეგროვებადი', '≈8,250 ₾'], ['ვადიანი (დამატება არ შეიძლება)', '≈3,300 ₾ + 4,800 ₾ ანგარიშზე']] },
    points: [
      ['შეგროვებადი:', `ყოველთვე დაამატებ — ხელფასის შემდეგ ≈${P.leftover} ₾ გრჩება. დამატებულ თანხასაც ერიცხება სარგებელი.`, 1],
      ['ვადიანი:', 'განაკვეთი ცოტა მაღალია, მაგრამ გახსნის შემდეგ თანხას ვეღარ დაამატებ.', 2],
      ['თუ დამატებას არ აპირებ:', 'ვადიანი ჯობს — მეტ სარგებელს მიიღებ.', 2],
    ],
    sources: [SRC.tx, SRC.rates],
    actions: [{ label: 'შეგროვებადის მომზადება', primary: true, run: () => DEP_API.prefill('accumulate', { amount: P.idle, months: 12, why: 'acc' }), done: 'მოვამზადე შეგროვებადი — შეამოწმე და დაადასტურე' }],
    next: [Q.early],
  })

  A['types-diff'] = {
    steps: ['ვადარებ ანაბრის ტიპებს'], think: 0.6,
    title: 'მთავარი განსხვავება — რამდენად ხელმისაწვდომია თანხა',
    card: { type: 'kv', title: 'სამი ტიპი ერთად', rows: [['მოთხოვნამდე', '6.00% · გაიტან ნებისმიერ დროს'], ['შეგროვებადი', '10.05%-მდე · დაამატებ ყოველთვე'], ['ვადიანი', '10.55%-მდე · დამატება არ შეიძლება']] },
    points: [
      ['მოთხოვნამდე:', 'როცა თანხა ნებისმიერ დროს შეიძლება დაგჭირდეს.', 1],
      ['შეგროვებადი:', 'როცა რაღაც მიზნისთვის აგროვებ და ყოველთვე ამატებ.', 1],
      ['ვადიანი:', 'როცა თანხა კონკრეტული ვადით არ გჭირდება — ყველაზე მაღალი სარგებელი.', 1],
    ],
    sources: [SRC.rates],
    next: [{ id: 'quiz', text: 'დამეხმარე არჩევაში' }],
  }

  /* --- ქვიზი: 2 კითხვა → რეკომენდაცია ფორმის წინასწარი შევსებით --- */
  const quiz = {}
  const QUIZ_LABEL = 'აირჩიე პასუხი (ან დაწერე)'
  const q2 = () => ({
    steps: ['ვინიშნავ პასუხს'], think: 0.2,
    title: 'გინდა ყოველთვე დამატება?',
    points: [['', `ხელფასის შემდეგ საშუალოდ ≈${P.leftover} ₾ გრჩება — შეგიძლია ავტომატურად დაამატო.`]],
    nextLabel: QUIZ_LABEL,
    next: [
      { id: () => { quiz.add = true; return result() }, text: 'კი, მიზნისთვის ვაგროვებ' },
      { id: () => { quiz.add = false; return result() }, text: 'არა, ერთჯერადად ვდებ' },
    ],
  })
  A.quiz = () => ({
    steps: ['ვიწყებ შერჩევას'], think: 0.2,
    title: 'როდის შეიძლება დაგჭირდეს ეს თანხა?',
    points: [['', 'ორი კითხვით შევარჩევ ტიპს და ფორმას წინასწარ შევავსებ. ნებისმიერ დროს შეგიძლია შეწყვიტო.']],
    nextLabel: QUIZ_LABEL,
    next: [
      { id: () => { quiz.when = 'any'; return q2() }, text: 'შეიძლება ნებისმიერ დროს' },
      { id: () => { quiz.when = 6; return q2() }, text: 'არა უადრეს 6 თვისა' },
      { id: () => { quiz.when = 12; return q2() }, text: '1 წელზე მეტ ხანს არ მჭირდება' },
    ],
  })
  const WHY_WHEN = { any: 'თანხა ნებისმიერ დროს შეიძლება დაგჭირდეს — ამიტომ თავისუფალი გატანა მნიშვნელოვანია.', 6: '6 თვე თანხა არ გჭირდება — ამ ვადაზე მაღალ განაკვეთს მიიღებ.', 12: 'წელიწადი თანხა არ გჭირდება — გრძელ ვადაზე განაკვეთი უფრო მაღალია.' }
  const DOWNSIDE = {
    accumulate: 'ვადამდე გატანისას სარგებლის ნაწილს დაკარგავ.',
    term: 'გახსნის შემდეგ თანხას ვეღარ დაამატებ, ვადამდე გატანისას კი სარგებელი შემცირდება.',
    ondemand: 'განაკვეთი ყველაზე დაბალია — 6.00%.',
  }
  const ALT = {
    accumulate: 'თუ დამატებას არ აპირებ, ვადიანი ანაბარი მეტ სარგებელს მოგცემს.',
    term: 'თუ ყოველთვე დამატება მოგინდება, შეგროვებადი ჯობს.',
    ondemand: 'თუ 6 თვე თანხა არ დაგჭირდება, ვადიანზე ≈1.5-ჯერ მეტს მიიღებ.',
  }
  const CTA = { accumulate: 'შეგროვებადის მომზადება', term: 'ვადიანის მომზადება', ondemand: 'მოთხოვნამდეს მომზადება' }
  function result() {
    const type = quiz.add ? 'accumulate' : quiz.when === 'any' ? 'ondemand' : 'term'
    const T = D[type]
    const months = type === 'ondemand' ? 12 : quiz.when === 12 ? 12 : 6
    const c = DEP_API.calc(type, P.idle, months, 'end')
    return {
      steps: ['ვაჯამებ შენს პასუხებს', 'ვადარებ ტიპებს შენი ხარჯებით'], think: 0.9,
      title: `შენს პასუხებს ${T.name} ერგება`,
      card: { type: 'kv', title: `${T.name}${T.term ? ` · ${months} თვე` : ''}`, value: `+${m2(c.interest)} ₾`, sub: T.term ? `სარგებელი ${months} თვეში` : 'სარგებელი წელიწადში', rows: [['თანხა', `${m2(P.idle)} ₾`], ['განაკვეთი', `${c.r.toFixed(2)}% · ეფექტური ${c.eff.toFixed(2)}%`], ['თანხის დამატება', T.topUp ? 'კი' : 'არა']] },
      points: [
        ['რატომ:', WHY_WHEN[quiz.when], 1],
        ...(quiz.add ? [['დამატება:', `ხელფასის შემდეგ ≈${P.leftover} ₾ გრჩება — ყოველთვე ავტომატურად დაამატებ.`, 1]] : []),
        ['თანხა:', `${m0(P.idle)} ₾ გთავაზობ — ანგარიშზე ${m2(P.balance - P.idle)} ₾ რჩება, რაც თვიურ ხარჯს (≈${m0(P.spend)} ₾) ფარავს.`, 1],
        ['გაითვალისწინე:', DOWNSIDE[type], 2],
        ['ალტერნატივა:', ALT[type], 2],
      ],
      sources: [SRC.tx, SRC.rates],
      actions: [
        { label: CTA[type], primary: true, run: () => DEP_API.prefill(type, { amount: P.idle, months, why: 'quiz' }), done: 'მოვამზადე — შეამოწმე და დაადასტურე' },
        { label: 'ბარათის ჩვენება', run: () => DEP_API.highlight(type) },
      ],
      next: [Q.early, Q.diff],
    }
  }

  /* --- ფორმაზე: რატომ ეს მონაცემები · სხვა ვადა · ყოველთვიური სარგებელი --- */
  A['why-fill'] = () => {
    const s = st()
    if (!s) return A['ka-fallback']()
    const left = s.acc.amount - s.amountN
    return {
      steps: ['ვამოწმებ, რით შევავსე ფორმა'], think: 0.6,
      title: 'რატომ ეს თანხა და ვადა',
      points: [
        ['თანხა:', `${m0(s.amountN)} ₾ — ${s.ai?.why === 'idle' ? `${P.idleDays} დღეა ანგარიშზე უმოქმედოდ დევს.` : 'ანგარიშზე საკმარისი ბუფერი რჩება.'}`, 1],
        ['ბუფერი:', `ანგარიშზე ${m2(left)} ₾ დაგრჩება, თვეში კი საშუალოდ ≈${m0(P.spend)} ₾-ს ხარჯავ.`, 1],
        ...(s.T.term ? [['ვადა:', `${s.months} თვე — ${s.ai?.why === 'idle' ? 'ბოლო 12 თვეში ერთჯერადი დიდი ხარჯი არ გქონია.' : 'შენი პასუხის მიხედვით, ამ ხნით თანხა არ გჭირდება.'}`, 1]] : []),
        ['შენ წყვეტ:', 'ყველა ველი შეგიძლია შეცვალო — ანაბარი მხოლოდ შენი დადასტურებით გაიხსნება.', 2],
      ],
      sources: [SRC.tx, SRC.rates],
      next: (AI_CTX.deposit.prompts().filter((x) => x.id !== 'why-fill')).slice(0, 2),
    }
  }
  A['term-alt'] = () => {
    const s = st()
    if (!s || !s.T.term) return A['types-diff']
    const alt = s.months === 12 ? 6 : 12
    const a = s.amountN || P.idle
    const now = DEP_API.calc(s.type, a, s.months, s.payout)
    const nx = DEP_API.calc(s.type, a, alt, s.payout)
    return {
      steps: ['ვითვლი ორივე ვადას'], think: 0.6,
      title: `${alt} თვეზე მიიღებ ≈${m2(nx.interest)} ₾`,
      card: { type: 'kv', title: `${m0(a)} ₾ · ${D[s.type].short}`, rows: [[`${s.months} თვე · ${now.r.toFixed(2)}%`, `+${m2(now.interest)} ₾`], [`${alt} თვე · ${nx.r.toFixed(2)}%`, `+${m2(nx.interest)} ₾`]] },
      points: [
        ['განსხვავება:', alt > s.months ? 'გრძელ ვადაზე განაკვეთიც მაღალია და სარგებელიც მეტი.' : 'მოკლე ვადაზე ნაკლებს მიიღებ, მაგრამ თანხა უფრო მალე გათავისუფლდება.', 1],
        ['რისკი:', `ვადამდე გატანისას სარგებელი შემცირდება — ${alt > s.months ? 'გრძელ ვადაზე ეს უფრო სავარაუდოა' : 'მოკლე ვადაზე ეს ნაკლებად სავარაუდოა'}.`, 2],
      ],
      sources: [SRC.rates, SRC.terms],
      actions: [{ label: `ვადის შეცვლა ${alt} თვეზე`, primary: true, run: () => DEP_API.apply({ months: alt }), done: `ვადა შევცვალე ${alt} თვეზე — ფორმაში ჩანს` }],
      next: [Q.early],
    }
  }
  A['payout-monthly'] = () => {
    const s = st()
    if (!s || !s.T.payout) return A['types-diff']
    const a = s.amountN || P.idle
    const end = DEP_API.calc(s.type, a, s.months, 'end')
    const mon = DEP_API.calc(s.type, a, s.months, 'monthly')
    return {
      steps: ['ვადარებ სარგებლის მიღების ორ გზას'], think: 0.6,
      title: 'ყოველთვე ცოტა ნაკლებს მიიღებ, მაგრამ უფრო ხშირად',
      card: { type: 'kv', title: `${m0(a)} ₾ · ${s.months} თვე`, rows: [['ვადის ბოლოს', `+${m2(end.interest)} ₾`], ['ყოველთვე', `+${m2(mon.interest / s.months)} ₾ × ${s.months}`]] },
      points: [
        ['ვადის ბოლოს:', `ჯამში მეტს მიიღებ — +${m2(end.interest)} ₾.`, 1],
        ['ყოველთვე:', `ჯამში +${m2(mon.interest)} ₾, სამაგიეროდ ყოველთვე მიიღებ. მოსახერხებელია, თუ სარგებელს ხარჯავ.`, 1],
      ],
      sources: [SRC.rates],
      actions: [{ label: 'ყოველთვიურზე გადართვა', run: () => DEP_API.apply({ payout: 'monthly' }), done: 'გადავრთე „ყოველთვე"-ზე — ფორმაში ჩანს' }],
      next: [Q.early],
    }
  }

  /* --- შეჯამება / წარმატება --- */
  A['terms-3'] = () => {
    const s = st()
    const T = D[s?.type || 'term']
    return {
      steps: ['ვკითხულობ სრულ პირობებს', 'ვარჩევ მთავარს'], think: 0.9,
      title: `${T.name} — 3 მთავარი პირობა`,
      points: T.key.map((x, i) => [`${i + 1}.`, x, 1]),
      sources: [SRC.terms],
      next: [Q.insured, Q.early],
    }
  }
  A.insured = {
    steps: ['ვკითხულობ პირობებს'], think: 0.5,
    title: 'კი, ანაბარი დაზღვეულია',
    points: [
      ['როგორ:', 'დეპოზიტების დაზღვევის სისტემით, „დეპოზიტების დაზღვევის სისტემის შესახებ" კანონის საფუძველზე.', 1],
      ['რამდენით:', 'კანონით დადგენილი ლიმიტის ფარგლებში — დეტალები ხელშეკრულებაშია.', 1],
    ],
    sources: [SRC.terms],
    next: [Q.terms],
  }
  A['what-next'] = () => {
    const s = st()
    return {
      steps: ['ვამოწმებ ანაბრის სტატუსს'], think: 0.5,
      title: 'ანაბარი გახსნილია — აი, რა მოხდება',
      points: [
        ['ჩემს სივრცეში:', 'ანაბარი „ანაბრების" ფილაზე გამოჩნდება.', 1],
        ['სარგებელი:', s?.T.term ? `დაგერიცხება ${s.payout === 'end' ? 'ვადის ბოლოს' : s.payout === 'monthly' ? 'ყოველთვე' : 'წინასწარ'}.` : 'დაგერიცხება ყოველთვე.', 1],
        ['შემდეგ:', s?.T.nextStep ? s.T.nextStep.title : 'თანხის დამატება ნებისმიერ დროს შეგიძლია.', 1],
      ],
      sources: [SRC.terms],
      next: [],
    }
  }

  /* --- დამატებითი პასუხები (აკრეფილი კითხვებისთვის) --- */
  const cur = () => { const s = st(); return s && (view() === 'deposit' || view() === 'summary' || view() === 'accounts') ? s : null }
  A['rate-explain'] = () => {
    const s = cur()
    const type = s ? s.type : 'term'
    const T = D[type]
    const c = s ? s.calc : DEP_API.calc('term', P.idle, 6, 'end')
    return {
      steps: ['ვითვლი სარგებელს შენი პარამეტრებით'], think: 0.6,
      title: `წლიური ${c.r.toFixed(2)}% · ეფექტური ${c.eff.toFixed(2)}%`,
      points: [
        ['წლიური:', 'ის პროცენტი, რომელსაც ბანკი წელიწადში გიხდის, დარიცხვის წესის გარეშე.', 1],
        ['ეფექტური:', T.compound || !T.term ? 'რეალურად რამდენს მიიღებ წელიწადში — სარგებელს ყოველთვე ემატება სარგებელი, ამიტომ წლიურზე მაღალია.' : 'რეალური წლიური შემოსავალი სარგებლის მიღების წესის გათვალისწინებით — ვადის ბოლოს ერთად მიღებისას წლიურს უახლოვდება.', 1],
        ['შენთვის:', s && s.amountN ? `${m0(s.amountN)} ₾-ზე ${T.term ? `${s.months} თვეში` : 'წელიწადში'} ≈${m2(c.interest)} ₾ სარგებელი.` : `${m0(P.idle)} ₾-ზე 6 თვეში ≈${m2(c.interest)} ₾ სარგებელი.`, 2],
      ],
      sources: [SRC.rates],
      next: [Q.early],
    }
  }
  A['amount-advice'] = () => {
    const s = cur()
    const safe = Math.floor((P.balance - P.spend) / 100) * 100
    return {
      steps: ['ვამოწმებ ნაშთს და თვიურ ხარჯს'], think: 0.7,
      title: `გირჩევ, არაუმეტეს ${m0(safe)} ₾`,
      points: [
        ['ნაშთი:', `ანგარიშზე ${m2(P.balance)} ₾ გაქვს.`, 1],
        ['ბუფერი:', `თვეში ≈${m0(P.spend)} ₾-ს ხარჯავ — ეს თანხა ანგარიშზე უნდა დარჩეს.`, 1],
        ['მინიმუმი:', `შეგროვებადი — 10 ₾-დან, ვადიანი — 500 ₾-დან, მოთხოვნამდე — ნებისმიერი თანხით.`, 2],
      ],
      sources: [SRC.tx, SRC.terms],
      actions: s && view() === 'deposit' && s.amountN !== safe ? [{ label: `თანხა ${m0(safe)} ₾`, primary: true, run: () => DEP_API.apply({ amount: String(safe) }), done: `შევცვალე ${m0(safe)} ₾-ზე — ფორმაში ჩანს` }] : undefined,
      next: [Q.early],
    }
  }
  A.topup = () => {
    const type = cur()?.type
    return {
      steps: ['ვკითხულობ ანაბრის პირობებს'], think: 0.5,
      title: type === 'term' ? 'ვადიანზე თანხას ვეღარ დაამატებ' : 'თანხას ნებისმიერ დროს დაამატებ',
      points: [
        ['შეგროვებადი და მოთხოვნამდე:', 'შეგიძლია ნებისმიერ დროს დაამატო, ხელითაც და ავტომატურადაც.', 1],
        ['ვადიანი:', 'გახსნის შემდეგ თანხა აღარ ემატება — თუ ყოველთვე დამატება გინდა, შეგროვებადი ჯობს.', 1],
        ['ავტომატურად:', `ხელფასის შემდეგ ≈${P.leftover} ₾ გრჩება — შემიძლია ყოველთვე გადავრიცხო.`, 2],
      ],
      sources: [SRC.terms, SRC.tx],
      next: type === 'term' ? [{ id: 'acc-vs-term', text: 'შეგროვებადი ხომ არ ჯობს?' }] : [Q.early],
    }
  }
  A.renewal = () => {
    const s = cur()
    return {
      steps: ['ვკითხულობ ანაბრის პირობებს'], think: 0.5,
      title: 'ვადის ბოლოს თანხა და სარგებელი შენთანაა',
      points: [
        ['დასრულება:', s && s.T.term ? `ანაბარი ${s.calc.end ? s.calc.end.toLocaleDateString('ka-GE') : ''}-ს სრულდება.` : 'ვადიან და შეგროვებად ანაბრებს დასრულების თარიღი აქვს.', 1],
        ['შემდეგ:', 'თანხა სარგებელთან ერთად ანგარიშზე ბრუნდება, ან შეგიძლია გააგრძელო.', 1],
        ['შეხსენება:', 'შემიძლია 7 დღით ადრე შეგახსენო, რომ დროულად გადაწყვიტო.', 2],
      ],
      sources: [SRC.terms],
      next: [Q.early],
    }
  }
  A['dep-fees'] = {
    steps: ['ვამოწმებ ტარიფებს'], think: 0.4,
    title: 'ანაბრის გახსნა და შენახვა უფასოა',
    points: [
      ['გახსნა:', 'საკომისიო არ არის.', 1],
      ['თანხის დამატება:', 'საკუთარი ანგარიშიდან უფასოა.', 1],
      ['ვადამდე გატანა:', 'საკომისიო არ არის, მაგრამ სარგებელი დაბალი განაკვეთით გადაითვლება.', 2],
    ],
    sources: [SRC.terms],
    next: [Q.early],
  }
  A.currency = {
    steps: ['ვამოწმებ ვალუტებს'], think: 0.4,
    title: 'ანაბარი ლარშიც და უცხოურ ვალუტაშიც შეგიძლია',
    points: [
      ['ლარი:', 'ყველაზე მაღალი განაკვეთია — ამიტომ ფორმა ლარით არის შევსებული.', 1],
      ['დოლარი და ევრო:', 'განაკვეთი უფრო დაბალია; ვალუტას თანხის ველში GEL-ზე დაჭერით შეცვლი.', 1],
      ['გაითვალისწინე:', 'ვალუტის კურსის ცვლილება შენს რეალურ შემოსავალზე იმოქმედებს.', 2],
    ],
    sources: [SRC.rates],
    next: [Q.diff],
  }
  A['how-open'] = {
    steps: ['ვამოწმებ, როგორ იხსნება ანაბარი'], think: 0.4,
    title: 'ანაბარი 1 წუთში იხსნება',
    points: [
      ['1.', 'აირჩიე ტიპი — თუ ვერ წყვეტ, 2 კითხვით დაგეხმარები.', 1],
      ['2.', 'მიუთითე თანხა, ვადა და საიდან ჩაირიცხოს.', 1],
      ['3.', 'გადახედე შეჯამებას, დაეთანხმე პირობებს და დაადასტურე.', 1],
    ],
    sources: [SRC.terms],
    next: [Q.quiz],
  }

  /* --- „ჰკითხე BOG AI-ს ამაზე": ხანგრძლივი დაჭერა ანაბრის ფლოუს ელემენტებზე (data-ctx) --- */
  const CTX_NAME = { 'dep-total': 'სულ მისაღები', 'dep-amount': 'თანხა', 'dep-term': 'ვადა და სარგებელი', 'dep-eff': 'ეფექტური განაკვეთი', 'dep-payout': 'სარგებლის მიღება', 'dep-acc': 'ანგარიში', terms: 'ანაბრის პირობები' }
  Object.assign(CTX_QUESTIONS, {
    'dep-total': ['როგორ დაითვალე ეს თანხა?', 'რა მოხდება ვადამდე გატანისას?'],
    'dep-amount': ['რამდენი უნდა დავდო?', 'დამატება შემიძლია?'],
    'dep-term': ['რატომ ეს ვადა?', 'რა მოხდება ვადამდე გატანისას?'],
    'dep-eff': ['რას ნიშნავს ეფექტური განაკვეთი?'],
    'dep-payout': ['რომელი ჯობს ჩემთვის?'],
    'dep-acc': ['რომელი ანგარიშიდან ჯობს?'],
    'sum-row': ['მარტივად ამიხსენი'],
    terms: ['მარტივად ამიხსენი', 'რა რისკებია?'],
    dtype: ['ვის ერგება ეს ანაბარი?', 'რა უნდა გავითვალისწინო?'],
  })
  window.BANK_CTX = (node) => {
    const kind = node.dataset.ctx
    const name = kind === 'sum-row' ? $q('dt', node)?.textContent : kind === 'dtype' ? $q('.dtype__title', node)?.textContent : CTX_NAME[kind]
    return { bank: true, kind, name: name || '', sub: '', value: kind === 'sum-row' ? $q('dd', node)?.textContent : '', type: node.dataset.dtype, node, logo: null }
  }
  function $q(sel, root) { return root.querySelector(sel) }
  const resolve = (id) => { const a = typeof id === 'function' ? id() : ANSWERS[id]; return typeof a === 'function' ? a() : a }
  const WHO = {
    accumulate: ['ვისაც რაღაც მიზნისთვის აგროვებს და ყოველთვე ამატებს.', 'ვადამდე გატანისას სარგებლის ნაწილი იკარგება.'],
    ondemand: ['ვისაც თანხა ნებისმიერ დროს შეიძლება დასჭირდეს.', 'განაკვეთი ყველაზე დაბალია — 6.00%.'],
    term: ['ვისაც თანხა კონკრეტული ვადით არ სჭირდება და მაქსიმალური სარგებელი უნდა.', 'გახსნის შემდეგ თანხას ვეღარ დაამატებ.'],
    kids: ['მშობლებს, ვინც შვილისთვის 18 წლამდე აგროვებს.', 'თანხას შვილი 18 წლის შემდეგ მიიღებს.'],
  }
  window.BANK_CTX_ANSWER = (c, q) => {
    const i = (CTX_QUESTIONS[c.kind] || []).indexOf(q)
    let a
    if (i < 0) a = resolve(AI_ROUTE(q.toLowerCase()) || 'ka-fallback') // საკუთარი კითხვა კონტექსტით
    else if (c.kind === 'dep-term') a = i === 0 ? (st()?.ai ? A['why-fill']() : A['term-alt']()) : A.early()
    else if (c.kind === 'dep-total') a = i === 0 ? A['rate-explain']() : A.early()
    else if (c.kind === 'dep-amount') a = i === 0 ? A['amount-advice']() : A.topup()
    else if (c.kind === 'dep-eff') a = A['rate-explain']()
    else if (c.kind === 'dep-payout') a = st()?.T.payout ? A['payout-monthly']() : A['rate-explain']()
    else if (c.kind === 'dep-acc') a = {
      steps: ['ვამოწმებ ანგარიშებს'], think: 0.4,
      title: 'მიმდინარე ანგარიშიდან',
      points: [['მიზეზი:', `მასზეა ${m2(P.balance)} ₾ — სხვა ანგარიშებზე ანაბრისთვის საკმარისი თანხა არ არის.`, 1], ['ბუფერი:', `ჩარიცხვის შემდეგ თვიური ხარჯისთვის (≈${m0(P.spend)} ₾) საკმარისი უნდა დარჩეს.`, 1]],
      sources: [SRC.tx], next: [],
    }
    else if (c.kind === 'sum-row') a = /სარგებ/.test(c.name) ? A['rate-explain']() : /თარიღ/.test(c.name) ? A.renewal() : /მისაღებ/.test(c.name) ? A['rate-explain']() : A['terms-3']()
    else if (c.kind === 'terms') a = i === 0 ? A['terms-3']() : {
      steps: ['ვკითხულობ სრულ პირობებს'], think: 0.7,
      title: 'რისკები და შეზღუდვები',
      points: [
        ['ვადამდე გატანა:', 'სარგებელი დაბალი განაკვეთით გადაითვლება — თანხა არ იკარგება.', 1],
        ['პირობების ცვლილება:', 'მნიშვნელოვან ცვლილებაზე ბანკი 2 თვით ადრე გაცნობებს.', 1],
        ['დაზღვევა:', 'ანაბარი დაზღვეულია დეპოზიტების დაზღვევის სისტემით, კანონით დადგენილ ლიმიტამდე.', 1],
      ],
      sources: [SRC.terms], next: [],
    }
    else if (c.kind === 'dtype') {
      const T = D[c.type] || D.term
      const [who, watch] = WHO[c.type] || WHO.term
      a = {
        steps: ['ვკითხულობ ანაბრის პირობებს'], think: 0.5,
        title: i === 0 ? `${T.name} — ვის ერგება` : `${T.name} — რა უნდა იცოდე`,
        points: i === 0 ? [['ერგება:', who, 1], ['შენთვის:', c.type === 'accumulate' ? `ხელფასის შემდეგ ≈${P.leftover} ₾ გრჩება — ყოველთვე დამატება მოგიხერხდება.` : c.type === 'term' ? `${m0(P.idle)} ₾ ${P.idleDays} დღეა უმოქმედოა — ვადიანზე მეტს მოიტანს.` : 'თუ თანხა სწრაფად შეიძლება დაგჭირდეს, ეს ყველაზე მოქნილია.', 2]]
          : [['გაითვალისწინე:', watch, 1], ...(T.key ? [['პირობა:', T.key[0], 1]] : [])],
        sources: [SRC.terms, SRC.tx], next: [Q.quiz],
      }
    }
    else a = A['ka-fallback']()
    return { points: [], next: [], ...a, ctx: c }
  }
})()
