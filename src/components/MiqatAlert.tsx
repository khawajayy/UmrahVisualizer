import { AlertTriangle, Check } from 'lucide-react'
import { MIQATS, PLACES, TALBIYAH } from '../data/umrahData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useClock } from '../lib/nav'

// Projection for the Hijaz schematic: 400×560 viewBox, lat 25.2 → 20.2, ~103 px per degree of longitude from 37.6°E.
const X = (lng: number) => (lng - 37.6) * 103
const Y = (lat: number) => (25.2 - lat) * 112

export function MiqatMap() {
  const clock = useClock()
  const med = { x: X(PLACES.med.lng), y: Y(PLACES.med.lat) }
  const jed = { x: X(PLACES.jed.lng), y: Y(PLACES.jed.lat) }
  const mak = { x: X(PLACES.haram.lng), y: Y(PLACES.haram.lat) }
  const mad = { x: X(PLACES.nabawi.lng), y: Y(PLACES.nabawi.lat) }
  const dh = MIQATS[0]
  const at = (id: string) => {
    const m = MIQATS.find((x) => x.id === id)!
    return `${X(m.lng).toFixed(1)} ${Y(m.lat).toFixed(1)}`
  }
  // The coastal edge bulges west so Jeddah sits inside the boundary, as it does in reality.
  const ringPath = `M${at('dhul-hulayfah')} L${at('dhat-irq')} L${at('qarn')} L${at('yalamlam')} Q 70 440 ${at('juhfah')} Q 150 170 ${at('dhul-hulayfah')} Z`
  const niyyah = { x: X(dh.lng) - 4, y: Y(dh.lat) + 14 }

  return (
    <svg viewBox="0 0 400 560" className="h-auto w-full" role="img" aria-label="Schematic map of the flight path from Madinah to Jeddah crossing the Miqat at Dhul Hulayfah">
      <defs>
        <linearGradient id="sea" x1="0" x2="1">
          <stop offset="0" stopColor="#0b2235" />
          <stop offset="1" stopColor="#081521" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="rgba(148,163,184,0.06)" />
        </pattern>
      </defs>
      <rect width="400" height="560" fill="#090c13" />
      <rect width="400" height="560" fill="url(#grid)" />
      {/* Red Sea (schematic coastline) */}
      <path d="M0 0 L0 560 L242 560 L190 482 L157 414 L152 332 L147 270 L100 200 L47 124 L28 88 L6 0 Z" fill="url(#sea)" />
      <text x="40" y="340" fill="#1f4b6b" fontSize="13" fontFamily="var(--font-mono)" letterSpacing="4" transform="rotate(-62 40 340)">RED SEA</text>

      {/* Miqat boundary */}
      <path d={ringPath} fill="rgba(212,175,55,0.05)" stroke="#D4AF37" strokeOpacity="0.55" strokeWidth="1.2" strokeDasharray="5 5" />
      <text x={X(40.0)} y={Y(23.2)} fill="#D4AF37" fillOpacity="0.6" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="2" textAnchor="middle">INSIDE MIQAT</text>
      <text x={X(40.0)} y={Y(23.2) + 12} fill="#D4AF37" fillOpacity="0.45" fontSize="8" fontFamily="var(--font-mono)" textAnchor="middle">Ihram required</text>

      {/* Lahore leg arriving */}
      <path d={`M400 18 Q 310 30 ${med.x + 4} ${med.y - 4}`} fill="none" stroke="#94a3b8" strokeOpacity="0.5" strokeWidth="1.4" strokeDasharray="3 5" />
      <text x="392" y="12" fill="#94a3b8" fontSize="9" fontFamily="var(--font-mono)" textAnchor="end">← from LHE · ~3,500 km · no Ihram needed</text>

      {/* MED → JED leg */}
      <path id="leg2" d={`M${med.x} ${med.y} C ${med.x - 20} ${med.y + 60}, ${jed.x + 30} ${jed.y - 150}, ${jed.x} ${jed.y}`} fill="none" stroke="#38BDF8" strokeWidth="2.2" strokeDasharray="8 6" className="anim-dash" filter="url(#glow)" />

      {/* Miqat markers */}
      {MIQATS.map((m) => {
        const x = X(m.lng)
        const y = Y(m.lat)
        const primary = m.id === 'dhul-hulayfah'
        return (
          <g key={m.id}>
            <rect x={x - (primary ? 6 : 4)} y={y - (primary ? 6 : 4)} width={primary ? 12 : 8} height={primary ? 12 : 8} transform={`rotate(45 ${x} ${y})`} fill={primary ? '#D4AF37' : '#0c1018'} stroke="#D4AF37" strokeWidth="1.2" filter={primary ? 'url(#glow)' : undefined} />
            <text x={x + (m.id === 'juhfah' ? -10 : 10)} y={y + 4} fill={primary ? '#f1e3b0' : '#a59366'} fontSize={primary ? 11 : 9} fontWeight={primary ? 600 : 400} textAnchor={m.id === 'juhfah' ? 'end' : 'start'}>
              {primary ? '' : m.name}
            </text>
          </g>
        )
      })}
      <text x={X(dh.lng) - 12} y={Y(dh.lat) - 2} fill="#f1e3b0" fontSize="11" fontWeight="600" textAnchor="end">Dhul Hulayfah</text>
      <text x={X(dh.lng) - 12} y={Y(dh.lat) + 10} fill="#a59366" fontSize="9" textAnchor="end">Abyar Ali · Miqat</text>

      {/* Niyyah pulse */}
      <g transform={`translate(${niyyah.x} ${niyyah.y})`}>
        <circle r="14" fill="none" stroke="#34d399" strokeWidth="1.5">
          <animate attributeName="r" values="6;22" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle r="4" fill="#34d399" />
      </g>
      <path d={`M${niyyah.x - 6} ${niyyah.y + 6} L ${niyyah.x - 40} ${niyyah.y + 34}`} stroke="#34d399" strokeOpacity="0.6" />
      <g transform={`translate(${niyyah.x - 190} ${niyyah.y + 50})`}>
        <rect x="0" y="-13" width="150" height="34" rx="6" fill="rgba(6,40,30,0.9)" stroke="#34d399" strokeOpacity="0.6" />
        <text x="8" y="0" fill="#6ee7b7" fontSize="10" fontWeight="600">NIYYAH + TALBIYAH HERE</text>
        <text x="8" y="13" fill="#a7f3d0" fontSize="9">before / just after MED takeoff</text>
      </g>

      {/* Cities & airports */}
      {[
        { p: med, label: 'MED', sub: 'layover 00:30–03:30', dx: 10, anchor: 'start' as const },
        { p: jed, label: 'JED', sub: 'land 05:00–05:30', dx: -10, anchor: 'end' as const },
      ].map((a) => (
        <g key={a.label}>
          <circle cx={a.p.x} cy={a.p.y} r="5" fill="#07090E" stroke="#38BDF8" strokeWidth="2" />
          <text x={a.p.x + a.dx} y={a.p.y - 2} fill="#e0f2fe" fontSize="12" fontFamily="var(--font-mono)" fontWeight="600" textAnchor={a.anchor}>{a.label}</text>
          <text x={a.p.x + a.dx} y={a.p.y + 11} fill="#7dd3fc" fontSize="9" textAnchor={a.anchor}>{clock.text(a.sub)}</text>
        </g>
      ))}
      <circle cx={mad.x} cy={mad.y} r="3" fill="#94a3b8" />
      <circle cx={mak.x} cy={mak.y} r="7" fill="#D4AF37" filter="url(#glow)" />
      <rect x={mak.x - 3} y={mak.y - 3} width="6" height="6" fill="#07090E" />
      <text x={mak.x + 12} y={mak.y + 4} fill="#f1e3b0" fontSize="12" fontWeight="600">Makkah</text>
      <path d={`M${jed.x + 6} ${jed.y + 4} L ${mak.x - 8} ${mak.y - 2}`} stroke="#D4AF37" strokeOpacity="0.6" strokeWidth="1.5" strokeDasharray="2 4" />
      <text x={(jed.x + mak.x) / 2} y={(jed.y + mak.y) / 2 + 18} fill="#a59366" fontSize="8" textAnchor="middle">road ~1 h 15 m</text>

      <text x="392" y="552" fill="#475569" fontSize="8" fontFamily="var(--font-mono)" textAnchor="end">SCHEMATIC · NOT FOR NAVIGATION</text>
    </svg>
  )
}

const PROTOCOL = [
  { id: 'p1', when: 'Sun 29 Nov · home, before LHE', what: 'Ghusl, trim nails and hair. Men may already put on the Izar and Rida. No Niyyah yet, so no restrictions apply.' },
  { id: 'p2', when: 'Mon 30 Nov · MED layover', what: 'Madinah is outside the Miqat, so landing there needs no Ihram. Change into Ihram now if you haven\'t. Pray 2 rak\'ahs in the prayer room if it\'s not a disliked time.' },
  { id: 'p3', when: 'MED → JED · boarding / takeoff', what: 'Make Niyyah ("Labbayk Allāhumma ʿUmrah") and start the Talbiyah before or right after takeoff. The aircraft passes Dhul Hulayfah within minutes. Stay awake for it.' },
  { id: 'p4', when: 'Never wait for Jeddah', what: 'Jeddah is inside the Miqat boundary. Landing at JED without Ihram means the Miqat was crossed, which requires a dam (sacrifice). There is no need to worry about a Yalamlam crossing on this route.' },
]

export function MiqatAlert() {
  const [done, setDone] = useLocalStorage<string[]>('miqat-protocol', [])
  const toggle = (id: string) => setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]))

  return (
    <section id="miqat-alert" className="relative overflow-hidden rounded-2xl border-2 border-warn/50 bg-gradient-to-br from-warn/[0.09] via-obsidian to-obsidian">
      <div className="flex items-center gap-3 border-b border-warn/30 bg-warn/10 px-5 py-3">
        <AlertTriangle className="shrink-0 text-warn" size={22} />
        <div>
          <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-warn">Critical · Miqat & Ihram Protocol</div>
          <div className="text-sm text-amber-100/80">Your outbound route lands in Madinah first. Your Miqat is <b className="text-amber-50">Dhul Hulayfah</b>, crossed on the MED → JED leg.</div>
        </div>
      </div>
      <div className="grid gap-6 p-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {PROTOCOL.map((p, i) => {
            const checked = done.includes(p.id)
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                className={`flex w-full gap-3 rounded-xl border p-3.5 text-left transition ${checked ? 'border-go/40 bg-go/[0.06]' : 'border-white/10 bg-black/30 hover:border-warn/40'}`}
              >
                <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border font-mono text-xs ${checked ? 'border-go bg-go/20 text-go' : 'border-white/20 text-slate-400'}`}>
                  {checked ? <Check size={14} /> : i + 1}
                </span>
                <span>
                  <span className={`block font-mono text-[11px] uppercase tracking-[0.15em] ${i === 3 ? 'text-stop' : 'text-warn'}`}>{p.when}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-200">{p.what}</span>
                </span>
              </button>
            )
          })}
          <div className="rounded-xl border border-gold/20 bg-gold/[0.04] p-4">
            <div className="label text-gold/80">Talbiyah · begin after Niyyah</div>
            <p className="arabic mt-2 text-xl leading-[2.1] text-gold-soft sm:text-2xl">{TALBIYAH.arabic}</p>
            <p className="mt-2 text-sm italic text-slate-300">{TALBIYAH.translit}</p>
          </div>
          <p className="text-xs text-mist">Fiqh note: this follows the common ruling for pilgrims routing via Madinah. Confirm details with your group leader or scholar before departure.</p>
        </div>
        <div className="overflow-hidden rounded-xl border border-white/10">
          <MiqatMap />
        </div>
      </div>
    </section>
  )
}
