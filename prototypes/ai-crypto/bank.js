/* ბანკის ეკრანების ფეიკ მონაცემები (მთავარი, ჩემი სივრცე, პროდუქტები, ანაბრები).
   ყველაფერი აქ არის, რომ ტექსტის/ციფრის შეცვლა კოდის გარეშე იყოს შესაძლებელი. */
/* საწყისი ეკრანი: ნაგულისხმევად მთავარი (ორივე სცენარი ერთ ბმულზე: ანაბარი მთავარიდან, კრიპტო — ჩემი სივრცე → ინვესტიციები).
   ?start=crypto და სხვ. — პირდაპირ კონკრეტულ ეკრანზე */
window.START = new URLSearchParams(location.search).get("start") || "home"
window.BANK = {
  stories: [
    { img: 'story-1.png' }, { img: 'story-2.png' }, { img: 'story-3.png' }, { img: 'story-4.png' },
  ],
  /* პერსონა (PO-ს კონცეფციის ციფრები, რომ შესადარებელი იყოს): ანგარიშზე 4,820.50 ₾, თვიური ხარჯი ≈1,600 ₾,
     ხელფასი ≈1 რიცხვში, ხელფასის შემდეგ ყოველთვე ≈450 ₾ რჩება, 3,000 ₾ 60 დღეა უმოქმედოდ დევს */
  persona: { name: 'გიორგი', balance: 4820.5, spend: 1600, salaryDay: 1, leftover: 450, idle: 3000, idleDays: 60 },
  available: '4,820.50',
  account: { name: 'მიმდინარე ანგარიში', amount: '4,820.50', balances: [['4,820.50', '₾', 1], ['0.00', '$', 0], ['0.00', '€', 0], ['0.00', '£', 0]] },
  quick: [
    { img: 'qa-pay.png', label: 'გადახდა' },
    { img: 'qa-own.png', label: 'საკუთარ ანგარიშზე' },
    { img: 'qa-other.png', label: 'სხვასთან გადარიცხვა' },
  ],
  loyalty: [
    { img: 'logo-plus.png', name: 'PLUS ქულა', value: '19,642 PLUS', sub: '49.10 ₾' },
    { img: 'logo-mr.png', name: 'MR ქულა', value: '90,780 MR', sub: '605.20 ₾' },
  ],
  stocks: {
    total: '1,134.03', change: '$89.48 (3.12%)',
    list: [
      { img: '../logo-spy.png', name: 'SPY', sub: '1.40 აქცია', value: '1012.71 $', change: '0.12$ (0.01%)' },
      { img: '../logo-goog.png', name: 'GOOG', sub: '1.62 აქცია', value: '121.32 $', change: '0.12$ (0.01%)' },
    ],
  },
  tx: {
    day: 'დღეს', dayTotal: '+1,099.08 ₾',
    list: [
      { img: 'tx-deposit.png', name: 'თანხის შეტანა', sub: 'საკუთარ ანგარიშებს შორის', value: '1,272.00 ₾', plus: true },
      { img: 'tx-convert.png', name: 'ავტომატური კონვერტაცია', sub: 'კონვერტაცია', value: '5.99 $', plus: true },
      { img: 'tx-nikora.png', name: 'ნიკორა', sub: 'სუპერმარკეტები', value: '-125.00 ₾', extra: '+235 PLUS ქულა' },
      { img: 'tx-chamomile.png', name: 'Chamomile', sub: 'სუპერმარკეტები', value: '-47.92 ₾', extra: '+119 PLUS ქულა' },
      { img: 'tx-tamar.png', name: 'თამარ ზარნაძე', sub: 'გადარიცხვები', value: '-126.00 ₾' },
    ],
  },

  /* ჩემი სივრცე */
  products: [
    { id: 'accounts', img: 'tile-accounts.png', w: 70, label: 'ანგარიშები და ბარათები', value: '5,224.10 ₾' },
    { id: 'credit', img: 'tile-amex.png', w: 91, label: 'საკრედიტო ბარათი', value: '25,841.50 ₾' },
    { id: 'invest', img: 'tile-invest.png', w: 71, label: 'ინვესტიციები', value: CRYPTO.f(1134.03 + CRYPTO.total) + ' $', go: 'investments' },
    { id: 'gt', img: 'tile-gt.png', w: 58, label: 'Galt & Taggart პორტფელი', value: '435.50 ₾' },
  ],
  services: [
    { icon: 'ic-car.svg', label: 'ავტომატური დავალებები', sub: '6 აქტიური დავალება' },
    { icon: 'ic-card.svg', label: 'სამგზავრო ბარათი', sub: '1 კვირა' },
    { icon: 'ic-umbrella.svg', label: 'დაზღვევა', sub: '2 აქტიური პოლისი' },
    { icon: 'ic-bundle.svg', label: 'ნაკრები M', sub: 'მომდევნო გადახდა 1 დეკემბერს' },
  ],
  // ინვესტიციები = აქციები + კრიპტო (კრიპტოს ჯამი data.js-ის სიებიდან)
  stocksTotal: 1134.03,
  investTotal: CRYPTO.f(1134.03 + CRYPTO.total) + ' $',
  investments: [
    { label: 'აქციები', value: '1,134.03 $', img: 'tile-invest.png', w: 76 },
    { label: 'კრიპტო', value: CRYPTO.f(CRYPTO.total) + ' $', go: 'crypto', img: 'invest-globe.png', w: 72 },
  ],

  /* პროდუქტის დამატება */
  shelf: [
    { img: 'shelf-1.png', title: 'გახსენი ანაბარი საუკეთესო პირობით', sub: 'ეფექტური 19%-დან', value: '53,630.00 GEL', go: 'deptypes', close: true },
    { img: 'shelf-2.png', title: 'ნაწილ-ნაწილ', sub: 'ეფექტური 0%', value: '3,880.00 GEL' },
  ],
  categories: [
    { img: 'cat-card.png', label: 'ბარათი', keys: 'card barati' },
    { img: 'cat-credit.png', label: 'საკრედიტო ბარათი', badge: 'ახალი', keys: 'credit card sakredito' },
    { img: 'cat-deposit.png', label: 'ანაბარი', go: 'deptypes', keys: 'deposit anabari saving' },
    { img: 'cat-savings.png', label: 'ყულაბა', keys: 'piggy savings qulaba' },
    { img: 'cat-secured.png', label: 'ანაბრით უზრუნველყოფილი სესხი', keys: 'loan sesxi deposit' },
    { img: 'cat-invest.png', label: 'ინვესტიციები', go: 'investments', keys: 'invest stocks crypto investiciebi' },
    { img: 'cat-car.png', label: 'მანქანა', keys: 'car auto manqana' },
    { img: 'cat-bnpl.png', label: 'ნაწილ-ნაწილ', keys: 'installment bnpl nawil' },
    { img: 'cat-paydist.png', label: 'გადახდის განვადება', keys: 'installment ganvadeba' },
    { img: 'cat-insurance.png', label: 'დაზღვევა', keys: 'insurance dazgveva' },
    { img: 'cat-gift.png', label: 'სასაჩუქრე ბარათი', keys: 'gift card sachuqari' },
    { img: 'cat-travel.png', label: 'სამგზავრო ბარათი', keys: 'travel metro card' },
    { img: 'cat-auto.png', label: 'ავტომატური დავალებები', keys: 'automatic tasks' },
    { img: 'cat-other.png', label: 'სხვა ბანკები', keys: 'other banks' },
  ],

  /* ანაბრები */
  accounts: [
    { iban: 'GE00BG0000000123456789', name: 'მიმდინარე ანგარიში', amount: 4820.5, card: 'acc-card-1.png', fav: true, balances: [['4,820.50', '₾', 1], ['0.00', '$', 0], ['0.00', '€', 0], ['0.00', '£', 0]] },
    { iban: 'GE00BG0000000318842207', amount: 40, card: 'acc-card-2.png', balances: [['40.00', '₾', 1], ['28.00', '$', 1], ['0.00', '€', 0], ['0.00', '£', 0]] },
    { iban: 'GE00BG0000000907715530', amount: 0, card: 'acc-card-3.png', balances: [['0.00', '₾', 0], ['0.00', '$', 0], ['0.00', '€', 0], ['0.00', '£', 0]] },
  ],
}

/* ანაბრის ტიპები. rate(m) — წლიური % ვადის მიხედვით (ფეიკ ცხრილი, 24 თვე = 9.40%) */
// განაკვეთების ცხრილი (ფეიკ, PO-ს კონცეფციასთან შესადარებლად): თვე → წლიური %, შუალედები — წრფივად
const rateTable = (t) => (m) => {
  const ks = Object.keys(t).map(Number).sort((a, b) => a - b)
  if (m <= ks[0]) return t[ks[0]]
  for (let i = 1; i < ks.length; i++) if (m <= ks[i]) {
    const a = ks[i - 1], b = ks[i]
    return Math.round((t[a] + (t[b] - t[a]) * (m - a) / (b - a)) * 100) / 100
  }
  return t[ks[ks.length - 1]]
}
window.DEPOSITS = {
  accumulate: {
    id: 'accumulate', name: 'შეგროვებადი ანაბარი', short: 'შეგროვებადი', img: 'dep-accumulate.png', h: 54,
    desc: 'დაიწყე შეგროვება, დაამატე თანხა ნებისმიერ დროს. 10.05%-მდე სარგებელი მობილბანკში, ეფექტური 10.53%-მდე',
    min: 10, quick: [10, 50, 100], term: true, payout: ['end', 'monthly'], topUp: true,
    rate: rateTable({ 3: 8.2, 6: 8.9, 12: 9.6, 24: 10.05 }), months: [3, 24], compound: true,
    conditions: 'საპროცენტო სარგებელი ერიცხება ანაბრის თანხას, უკვე დარიცხული საპროცენტო სარგებლის თანხის გამოკლებით. ანაბრის თანხა უნდა იყოს 10-დან 1,000,000 ერთეულამდე. ანაბრის ვადაზე ადრე დარღვევის შემთხვევაში დაგერიცხებათ ნაკლები სარგებელი, რომლის ოდენობაც დამოკიდებულია დარღვევის მომენტზე. დეტალური ინფორმაცია ნახეთ ხელშეკრულებაში. თქვენი დეპოზიტი დაზღვეულია "დეპოზიტების დაზღვევის სისტემის შესახებ" საქართველოს კანონის საფუძველზე შექმნილი დეპოზიტების დაზღვევის სისტემის ფარგლებში. ანაბრის მნიშვნელოვანი პირობების ცვლილების შემთხვევაში შეგატყობინებთ ცვლილებამდე 2 თვით ადრე, სხვა საფინანსო პროდუქტების ფასის ზრდის შემთხვევაში კი - 1 თვით ადრე.',
  },
  ondemand: {
    id: 'ondemand', name: 'მოთხოვნამდე ანაბარი', short: 'მოთხოვნამდე', img: 'dep-ondemand.png', h: 59,
    desc: 'გახსენი ნებისმიერი თანხით, დაამატე და გამოიყენე თანხა, როცა გინდა. 6.00%-მდე სარგებელი, ეფექტური 6.17%-მდე',
    min: 0.01, quick: [10, 50, 100], term: false, payout: null, topUp: true,
    rate: () => 6, note: 'სარგებელი დაგერიცხება ყოველთვე, თვის განმავლობაში არსებულ მინიმალურ ნაშთზე',
    conditions: 'საპროცენტო სარგებელი ერიცხება მოთხოვნამდე ანაბრის თანხას, უკვე გაცემული საპროცენტო სარგებლის ჩათვლით, თითოეული საბანკო დღის დახურვის მომენტისთვის საანაბრე ანგარიშზე არსებულ ნაშთს. თქვენი დეპოზიტი დაზღვეულია "დეპოზიტების დაზღვევის სისტემის შესახებ" საქართველოს კანონის საფუძველზე შექმნილი დეპოზიტების დაზღვევის სისტემის ფარგლებში. ანაბრის მნიშვნელოვანი პირობების ცვლილების შემთხვევაში შეგატყობინებთ ცვლილებამდე 2 თვით ადრე, სხვა საფინანსო პროდუქტების ფასის ზრდის შემთხვევაში კი - 1 თვით ადრე.',
  },
  term: {
    id: 'term', name: 'ვადიანი ანაბარი', short: 'ვადიანი', img: 'dep-term.png', h: 44,
    desc: 'შეინახე დანაზოგი კონკრეტული ვადით - გახსნის შემდეგ თანხას ვეღარ დაამატებ. 10.55%-მდე სარგებელი მობილბანკში, ეფექტური 10.05%-მდე',
    min: 500, quick: [500, 1000, 2000], term: true, payout: ['end', 'monthly', 'upfront'], topUp: false,
    rate: rateTable({ 3: 8.75, 6: 9.5, 12: 10.05, 24: 10.55 }), months: [3, 24],
    conditions: 'საპროცენტო სარგებელი ერიცხება ვადიანი ანაბრის თანხას, უკვე დარიცხული საპროცენტო სარგებლის თანხის გამოკლებით. ანაბრის თანხა უნდა აღემატებოდეს 500 ერთეულს. ანაბრის ვადაზე ადრე დარღვევის შემთხვევაში დაგერიცხებათ ნაკლები სარგებელი, რომლის ოდენობაც დამოკიდებულია დარღვევის მომენტზე. დეტალური ინფორმაცია ნახეთ ხელშეკრულებაში. თქვენი დეპოზიტი დაზღვეულია "დეპოზიტების დაზღვევის სისტემის შესახებ" საქართველოს კანონის საფუძველზე შექმნილი დეპოზიტების დაზღვევის სისტემის ფარგლებში. ანაბრის მნიშვნელოვანი პირობების ცვლილების შემთხვევაში შეგატყობინებთ ცვლილებამდე 2 თვით ადრე, სხვა საფინანსო პროდუქტების ფასის ზრდის შემთხვევაში კი - 1 თვით ადრე.',
  },
  kids: {
    id: 'kids', name: 'საბავშვო ანაბარი', img: 'dep-kids.png', h: 50, badge: 'ახალი', disabled: true,
    desc: 'დაიწყე შვილისთვის შეგროვება და როცა 18 წლის გახდება, თანხას მაშინ მიიღებს. 10.50%-მდე სარგებელი, ეფექტური 11.02%-მდე',
  },
}
window.PAYOUTS = {
  end: { label: 'ვადის ბოლოს', icon: 'ic-cal-pct.svg', desc: 'მიიღებ უფრო მეტ სარგებელს, ანაბრის ვადის დასრულებისას', cut: 0 },
  monthly: { label: 'ყოველთვე', icon: 'ic-cal-repeat.svg', desc: 'სარგებელი დაგერიცხება ყოველთვიურად', cut: 0.25 },
  upfront: { label: 'წინასწარ', icon: 'ic-upfront.svg', desc: 'სარგებელი წინასწარ ჩაგერიცხება, თუმცა, თუ ვადაზე ადრე გაიტან ანაბრის თანხას, მიღებული სარგებელი გამოაკლდება', cut: 0.6 },
}
window.MONTHS = ['იანვარი', 'თებერვალი', 'მარტი', 'აპრილი', 'მაისი', 'ივნისი', 'ივლისი', 'აგვისტო', 'სექტემბერი', 'ოქტომბერი', 'ნოემბერი', 'დეკემბერი']
window.MONTHS_SHORT = ['იან.', 'თებ.', 'მარ.', 'აპრ.', 'მაი.', 'ივნ.', 'ივლ.', 'აგვ.', 'სექ.', 'ოქტ.', 'ნოე.', 'დეკ.']
