/* BOG AI ქერექთერი: open-bot-avatar (MIT, vendor/open-bot-avatar) — ცოცხალი, მდგომარეობებით idle / thinking / happy.
   ბიბლიოთეკა ერთ ფერს ხატავს; ტანს თეთრად ვხატავთ და კადრის შემდეგ ზემოდან ვადებთ ძველი ქერექთერის გრადიენტს
   (multiply → თვალები მუქი რჩება), შემდეგ ფორმის მიღმა ყველაფერს ვაჭრით. პატარა ნიშნებისთვის — assets/bog-ai.svg */
import { mountAvatar } from './vendor/open-bot-avatar/dom/index.js'

const DEF = {
  version: 1, id: 'bog-ai', name: 'BOG AI',
  body: { path: 'M27 30C30 19 42 10 54 10C62 10 69 14 73 18C66 20 62 25 61 31C74 26 87 34 91 45C92 48 91 50 89 49L85 47C91 54 92 66 89 74C88 77 86 74 83 71C86 81 80 87 75 87C72 87 70 84 68 81C62 88 52 92 45 91C41 90 44 87 43 85C42 82 37 82 35 81C31 88 23 83 19 78C16 74 15 70 16 66C13 71 11 70 10 67C7 59 10 49 18 43C14 42 12 44 10 45C8 40 18 31 27 30Z' },
  eyes: { x: 50, y: 53, spacing: 18, scale: 1 },
}
// გრადიენტი (როგორც ძველ ქერექთერზე): მარცხნივ ნარინჯისფერი → ვარდისფერი → იისფერი → მარჯვნივ ლურჯი-იისფერი
const STOPS = [[0, '#ff6a1a'], [0.24, '#ff7d2e'], [0.52, '#e2479c'], [0.78, '#9b46ee'], [1, '#5b3cf0']]
const tmp = document.createElement('canvas')
const tctx = tmp.getContext('2d')
const inv = document.createElement('canvas')
const ictx = inv.getContext('2d')
/* კადრის შემდეგ: ტანი თეთრია, თვალები შავი →
   1) ტანს გრადიენტი (multiply), ფორმის მიღმა ვჭრით;
   2) თვალების ნიღაბი = შებრუნებული კადრი (თვალები თეთრი, ტანი შავი), ვადებთ „lighten"-ით → თვალები თეთრდება */
function paintOver(canvas, ctx) {
  const w = canvas.width, h = canvas.height
  if (!w || !h) return
  for (const c of [tmp, inv]) if (c.width !== w || c.height !== h) { c.width = w; c.height = h }
  tctx.globalCompositeOperation = 'copy'
  tctx.drawImage(canvas, 0, 0)
  // შებრუნებული კადრი
  ictx.globalCompositeOperation = 'copy'
  ictx.fillStyle = '#fff'
  ictx.fillRect(0, 0, w, h)
  ictx.globalCompositeOperation = 'difference'
  ictx.drawImage(tmp, 0, 0)
  ictx.globalCompositeOperation = 'destination-in'
  ictx.drawImage(tmp, 0, 0)

  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  const g = ctx.createLinearGradient(0, h * 0.35, w, h * 0.65)
  STOPS.forEach(([o, c]) => g.addColorStop(o, c))
  ctx.globalCompositeOperation = 'multiply'
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.globalCompositeOperation = 'destination-in'
  ctx.drawImage(tmp, 0, 0)
  ctx.globalCompositeOperation = 'lighten'
  ctx.drawImage(inv, 0, 0)
  ctx.restore()
}

/* ჰორიზონტალური ბრუნვა (ვერტიკალური ღერძის გარშემო, 3D მოცულობით): ერთი წრე SPIN_MS-ში, დასაწყისში და ბოლოს ნელდება.
   გაჩერებისას მიმდინარე წრეს ამთავრებს და სახით ჩერდება */
const SPIN_MS = 1700
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
function spinner(handle) {
  let on = false, raf = 0, t0 = 0
  const tick = (now) => {
    const k = (now - t0) / SPIN_MS
    const turn = Math.floor(k)
    if (!on && turn >= 1) { handle.update({ view: { yaw: 0, pitch: 0 } }); raf = 0; return }
    const f = k - turn
    handle.update({ view: { yaw: 2 * Math.PI * ease(f), pitch: 0 } })
    if (!on && f > 0 && turn >= 1) return
    if (turn >= 1 && on) t0 += turn * SPIN_MS // შემდეგი წრე
    raf = requestAnimationFrame(tick)
  }
  return (next) => {
    if (next === on) return
    on = next
    if (on && !raf) { t0 = performance.now(); raf = requestAnimationFrame(tick) }
  }
}

window.BotAvatar = {
  def: DEF,
  // el — კვადრატული ელემენტი; mood: 'idle' | 'thinking' | 'happy'. დაბრუნებულ ობიექტს აქვს spin(true|false)
  mount(el, opts = {}) {
    const handle = mountAvatar(el, { definition: DEF, color: '#ffffff', eyeColor: '#000000', label: '', depth: 6, paintOver, ...opts })
    // ბრუნვისას thinking-ის გვერდითი გადახრა (roll) და დახრა ქერექთერს „ამოყირავებულს" ხდის — ბრუნვის დროს სწორად დგას
    let spinning = false, mood = opts.mood || 'idle'
    const update = handle.update.bind(handle)
    handle.update = (o) => {
      if (o.mood) mood = o.mood
      update(spinning && o.mood === 'thinking' ? { ...o, mood: 'idle' } : o)
    }
    const spin = spinner({ update })
    handle.spin = (on) => {
      spinning = on
      update({ mood: on && mood === 'thinking' ? 'idle' : mood })
      spin(on)
    }
    return handle
  },
}
