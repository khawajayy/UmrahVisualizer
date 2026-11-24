import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { KAABA_HOTSPOTS, type Role } from '../data/umrahData'

// Top-down schematic of the Mataf. North is up. The Kaaba's corners point roughly to the compass points:
// Black Stone (E), Iraqi (N), Shami (W), Yemeni (S). Tawaf runs anticlockwise with the Kaaba on your left.
const C = 300
const N = { x: 300, y: 222 }
const E = { x: 378, y: 300 }
const S = { x: 300, y: 378 }
const W = { x: 222, y: 300 }
const lerp = (a: { x: number; y: number }, b: { x: number; y: number }, t: number) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })

const ORBIT = 178
const polar = (deg: number, r = ORBIT) => ({ x: C + r * Math.cos((deg * Math.PI) / 180), y: C + r * Math.sin((deg * Math.PI) / 180) })
const arc = (fromDeg: number, toDeg: number, r = ORBIT) => {
  const a = polar(fromDeg, r)
  const b = polar(toDeg, r)
  const large = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0
  const sweep = toDeg > fromDeg ? 1 : 0
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${r} ${r} 0 ${large} ${sweep} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
}

const door1 = lerp(E, N, 0.2)
const door2 = lerp(E, N, 0.44)
const hijr1 = lerp(N, W, 0.12)
const hijr2 = lerp(N, W, 0.88)
const maqam = { x: 392, y: 236 }

const SPOTS: Record<string, { x: number; y: number }> = {
  hajar: E,
  yamani: S,
  hijr: { x: 228, y: 228 },
  multazam: lerp(E, N, 0.1),
  maqam,
  door: lerp(E, N, 0.32),
  line: { x: 520, y: 300 },
}

export function KaabaDiagram({ role, rounds = 0 }: { role: Role; rounds?: number }) {
  const [active, setActive] = useState<string>('hajar')
  const spot = KAABA_HOTSPOTS.find((h) => h.id === active)!
  // head of the progress arc: completed share of 7 rounds, from the Black Stone line (0°) moving anticlockwise
  const head = polar(-(Math.min(rounds, 7) / 7) * 360, ORBIT - 12)

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
      <svg viewBox="40 40 520 520" className="h-auto w-full max-w-[520px] justify-self-center" role="img" aria-label="Interactive top-down diagram of the Kaaba and Mataf">
        <defs>
          <radialGradient id="mataf" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1f2b" />
            <stop offset="100%" stopColor="#0b0e15" />
          </radialGradient>
          <filter id="kglow" filterUnits="userSpaceOnUse" x="0" y="0" width="600" height="600">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill="#D4AF37" fillOpacity="0.7" />
          </marker>
        </defs>

        {/* Mataf floor */}
        <circle cx={C} cy={C} r="250" fill="url(#mataf)" stroke="rgba(212,175,55,0.25)" />
        {[215, 140].map((r) => (
          <circle key={r} cx={C} cy={C} r={r} fill="none" stroke="rgba(255,255,255,0.04)" />
        ))}

        {/* Rabbana atina stretch: Yemeni corner (90°) → Black Stone (0°/360°) */}
        <path d={arc(90, 0, ORBIT + 22)} fill="none" stroke="#38BDF8" strokeOpacity="0.5" strokeWidth="10" strokeLinecap="round" />
        <text x={polar(45, ORBIT + 46).x} y={polar(45, ORBIT + 46).y} fill="#7dd3fc" fontSize="11" textAnchor="middle" transform={`rotate(-45 ${polar(45, ORBIT + 46).x} ${polar(45, ORBIT + 46).y})`}>
          Rabbanā ātinā…
        </text>

        {/* Direction arrows (anticlockwise) */}
        {[-20, -140, -260].map((a) => (
          <path key={a} d={arc(a, a - 80, ORBIT - 32)} fill="none" stroke="#D4AF37" strokeOpacity="0.45" strokeWidth="1.5" markerEnd="url(#arrow)" />
        ))}

        {/* Black Stone start line with green light */}
        <line x1={E.x} y1={E.y} x2="550" y2="300" stroke="#34d399" strokeWidth="3" filter="url(#kglow)" />
        <circle cx="548" cy="300" r="6" fill="#34d399" filter="url(#kglow)">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x="540" y="290" fill="#6ee7b7" fontSize="10" textAnchor="end" fontFamily="var(--font-mono)">START / END</text>

        {/* Hijr Ismail */}
        <path
          d={`M${hijr1.x} ${hijr1.y} C ${hijr1.x - 52} ${hijr1.y - 52}, ${hijr2.x - 52} ${hijr2.y - 52}, ${hijr2.x} ${hijr2.y}`}
          fill="rgba(212,175,55,0.06)"
          stroke="#e9cf7a"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <text x="232" y="232" fill="#a59366" fontSize="9" textAnchor="middle">HIJR</text>

        {/* Maqam Ibrahim */}
        <g transform={`translate(${maqam.x} ${maqam.y})`}>
          <circle r="9" fill="#0b0e15" stroke="#D4AF37" strokeWidth="1.5" />
          <circle r="4" fill="#D4AF37" />
        </g>

        {/* Kaaba */}
        <polygon points={`${N.x},${N.y} ${E.x},${E.y} ${S.x},${S.y} ${W.x},${W.y}`} fill="#050505" stroke="#D4AF37" strokeWidth="1.5" />
        {/* Kiswah band */}
        <polygon
          points={[lerp(N, { x: C, y: C }, 0.18), lerp(E, { x: C, y: C }, 0.18), lerp(S, { x: C, y: C }, 0.18), lerp(W, { x: C, y: C }, 0.18)].map((p) => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="#D4AF37"
          strokeOpacity="0.55"
          strokeWidth="5"
        />
        {/* Door */}
        <line x1={door1.x + 4} y1={door1.y - 4} x2={door2.x + 4} y2={door2.y - 4} stroke="#f5d76e" strokeWidth="5" />
        {/* Multazam */}
        <line x1={E.x + 6} y1={E.y - 6} x2={door1.x + 6} y2={door1.y - 6} stroke="#e879f9" strokeOpacity="0.8" strokeWidth="3" />
        {/* Corners */}
        <circle cx={E.x} cy={E.y} r="7" fill="#111" stroke="#34d399" strokeWidth="2.5" filter="url(#kglow)" />
        <circle cx={S.x} cy={S.y} r="6" fill="#111" stroke="#38BDF8" strokeWidth="2" />
        <circle cx={N.x} cy={N.y} r="4" fill="#111" stroke="#64748b" />
        <circle cx={W.x} cy={W.y} r="4" fill="#111" stroke="#64748b" />

        <text x={S.x} y={S.y + 22} fill="#7dd3fc" fontSize="10" textAnchor="middle">Rukn al-Yamani</text>
        <text x={E.x + 12} y={E.y + 18} fill="#6ee7b7" fontSize="10">Hajar al-Aswad</text>
        <text x={N.x} y={N.y - 10} fill="#64748b" fontSize="9" textAnchor="middle">Iraqi</text>
        <text x={W.x - 10} y={W.y + 3} fill="#64748b" fontSize="9" textAnchor="end">Shami</text>
        <text x={maqam.x + 14} y={maqam.y - 6} fill="#e9cf7a" fontSize="10">Maqam Ibrahim</text>

        {/* compass & Safa hint */}
        <g transform="translate(80 80)" fill="#475569" fontSize="9" fontFamily="var(--font-mono)">
          <path d="M0 -14 L4 0 L0 -3 L-4 0 Z" fill="#94a3b8" />
          <text y="12" textAnchor="middle">N</text>
        </g>
        <text x="556" y="552" fill="#475569" fontSize="9" textAnchor="end" fontFamily="var(--font-mono)">Mas'a / Safa → east side</text>

        {/* Progress of the 7 rounds, drawn anticlockwise from the start line */}
        {rounds > 0 && (
          <>
            {rounds >= 7 ? (
              <circle cx={C} cy={C} r={ORBIT - 12} fill="none" stroke="#D4AF37" strokeWidth="3" filter="url(#kglow)" />
            ) : (
              <path d={arc(0, -(rounds / 7) * 360, ORBIT - 12)} fill="none" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" filter="url(#kglow)" />
            )}
            <motion.g animate={{ x: head.x, y: head.y }} transition={{ type: 'spring', stiffness: 60, damping: 14 }}>
              <circle r="9" fill="#38BDF8" opacity="0.25" />
              <circle r="5" fill="#38BDF8" />
            </motion.g>
          </>
        )}

        {/* Hotspots */}
        {Object.entries(SPOTS).map(([id, p]) => (
          <g key={id} onClick={() => setActive(id)} className="cursor-pointer" role="button" aria-label={KAABA_HOTSPOTS.find((h) => h.id === id)?.name}>
            <circle cx={p.x} cy={p.y} r="16" fill="transparent" />
            {active === id && <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="3 3" className="anim-dash" />}
          </g>
        ))}
      </svg>

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          {KAABA_HOTSPOTS.map((h) => (
            <button
              key={h.id}
              onClick={() => setActive(h.id)}
              className={`rounded-lg border px-2 py-1 text-[11px] transition ${active === h.id ? 'border-tele/50 bg-tele/10 text-tele' : 'border-white/10 text-slate-400 hover:text-slate-200'}`}
            >
              {h.name}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={spot.id + role} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl border border-white/10 bg-black/40 p-4">
            <div className="flex items-baseline justify-between gap-2">
              <div className="font-medium text-white">{spot.name}</div>
              <div className="arabic text-lg text-gold/80">{spot.arabic}</div>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{spot.body}</p>
            {(role === 'man' ? spot.man : spot.woman) && (
              <p className={`mt-2 rounded-lg border px-3 py-2 text-sm ${role === 'man' ? 'border-tele/30 bg-tele/5 text-tele' : 'border-gold/30 bg-gold/5 text-gold-soft'}`}>
                {role === 'man' ? spot.man : spot.woman}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
