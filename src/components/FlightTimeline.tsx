import { motion } from 'framer-motion'
import { BedDouble, Car, Clock, Landmark, MountainSnow, Plane, type LucideIcon } from 'lucide-react'
import { DAYS, MILESTONES, type MilestoneKind } from '../data/umrahData'
import { useNow } from '../hooks/useNow'
import { useApp, useClock } from '../lib/nav'
import { TZ_AST, ymd } from '../lib/time'

export const KIND_META: Record<MilestoneKind, { icon: LucideIcon; color: string; label: string }> = {
  flight: { icon: Plane, color: '#38BDF8', label: 'Flight' },
  layover: { icon: Clock, color: '#94a3b8', label: 'Layover' },
  stay: { icon: BedDouble, color: '#a78bfa', label: 'Hotel' },
  ritual: { icon: Landmark, color: '#D4AF37', label: 'Ritual' },
  ziyarat: { icon: MountainSnow, color: '#34d399', label: 'Ziyarat' },
  transfer: { icon: Car, color: '#f59e0b', label: 'Transfer' },
}

export function FlightTimeline() {
  const now = useNow(30_000)
  const { go } = useApp()
  const clock = useClock()
  const t = now.getTime()

  return (
    <section className="glass p-5 sm:p-6">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className="label text-tele/80">Mission timeline</div>
          <h3 className="mt-1 text-xl font-semibold text-white">13 legs, Lahore to Lahore</h3>
        </div>
        <div className="hidden gap-3 text-[11px] text-mist sm:flex">
          {Object.entries(KIND_META).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: v.color }} />
              {v.label}
            </span>
          ))}
        </div>
      </div>

      <ol className="relative grid gap-0">
        {MILESTONES.map((m, i) => {
          const meta = KIND_META[m.kind]
          const start = new Date(m.start).getTime()
          const end = new Date(m.end).getTime()
          const state = t >= end ? 'done' : t >= start ? 'live' : 'next'
          const dayId = DAYS.find((d) => d.date === ymd(new Date(m.start), TZ_AST))?.id
          return (
            <motion.li
              key={m.id}
              id={`ms-${m.id}`}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="relative grid grid-cols-[44px_1fr] gap-3 pb-4 last:pb-0"
            >
              {i < MILESTONES.length - 1 && <span className={`absolute left-[21px] top-10 bottom-0 w-px ${state === 'done' ? 'bg-gold/50' : 'bg-white/10'}`} />}
              <span
                className={`relative z-10 grid h-11 w-11 place-items-center rounded-xl border ${state === 'live' ? 'border-tele bg-tele/15' : state === 'done' ? 'border-gold/40 bg-gold/10' : 'border-white/10 bg-ink'}`}
                style={state === 'live' ? { boxShadow: '0 0 24px -4px #38BDF8' } : undefined}
              >
                <meta.icon size={18} style={{ color: state === 'next' ? meta.color : state === 'done' ? '#D4AF37' : '#38BDF8' }} />
              </span>
              <button
                onClick={() => dayId && go('itinerary', dayId)}
                className={`group rounded-xl border p-3 text-left transition ${m.alert === 'miqat' ? 'border-warn/30 bg-warn/[0.04] hover:border-warn/60' : 'border-white/[0.06] bg-white/[0.02] hover:border-white/20'}`}
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-mono text-[10px] text-mist">{String(m.n).padStart(2, '0')}</span>
                  <span className="font-medium text-white">{m.title}</span>
                  {m.from && m.to && m.kind === 'flight' && (
                    <span className="font-mono text-[11px] text-tele">
                      {m.from} → {m.to}
                    </span>
                  )}
                  {state === 'live' && <span className="rounded bg-tele/20 px-1.5 py-0.5 font-mono text-[9px] tracking-widest text-tele">LIVE</span>}
                  {m.alert === 'miqat' && <span className="rounded bg-warn/20 px-1.5 py-0.5 font-mono text-[9px] tracking-widest text-warn">MIQAT</span>}
                  {m.alert === 'zamzam' && <span className="rounded bg-tele/15 px-1.5 py-0.5 font-mono text-[9px] tracking-widest text-tele">ZAMZAM</span>}
                  {m.tbc && <span className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[9px] tracking-widest text-slate-500">TIME TBC</span>}
                </div>
                <div className="mt-0.5 font-mono text-xs text-gold/80">{clock.text(m.timeLabel)}</div>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400 group-hover:text-slate-300">{clock.text(m.detail)}</p>
              </button>
            </motion.li>
          )
        })}
      </ol>
    </section>
  )
}
