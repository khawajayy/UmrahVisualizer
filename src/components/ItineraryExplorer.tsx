import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react'
import { DAYS, mapsDirections, mapsSearch, PLACES, type DayPlan, type Place } from '../data/umrahData'
import { useNow } from '../hooks/useNow'
import { flashElement, useApp } from '../lib/nav'
import { TZ_AST, ymd } from '../lib/time'
import { KIND_META } from './FlightTimeline'
import { MapsLink, SectionHeader } from './ui'

const CITY_COLOR: Record<DayPlan['city'], string> = {
  Lahore: '#94a3b8',
  'In transit': '#94a3b8',
  Makkah: '#D4AF37',
  Madinah: '#38BDF8',
  'Jeddah / Riyadh': '#a78bfa',
}

export function ItineraryExplorer() {
  const now = useNow(60_000)
  const { focus } = useApp()
  const today = ymd(now, TZ_AST)
  const [idx, setIdx] = useState(() => Math.max(0, DAYS.findIndex((d) => d.date === today)))
  const stripRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (focus?.view === 'itinerary' && focus.id) {
      const i = DAYS.findIndex((d) => d.id === focus.id)
      if (i >= 0) {
        setIdx(i)
        flashElement('day-detail')
      }
    }
  }, [focus])

  useEffect(() => {
    const el = stripRef.current?.querySelector<HTMLElement>(`[data-idx="${idx}"]`)
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [idx])

  const day = DAYS[idx]
  const base: Place | undefined = day.base ? PLACES[day.base] : undefined

  return (
    <div>
      <SectionHeader eyebrow="Day-by-day explorer" title="Itinerary" arabic="الرحلة">
        <span className="text-xs text-mist">Times marked TBC depend on your group or driver.</span>
      </SectionHeader>

      <div ref={stripRef} className="-mx-4 flex snap-x gap-2 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
        {DAYS.map((d, i) => {
          const active = i === idx
          const isToday = d.date === today
          return (
            <button
              key={d.id}
              data-idx={i}
              onClick={() => setIdx(i)}
              className={`relative min-w-[92px] snap-center rounded-xl border px-3 py-2.5 text-left transition ${active ? 'border-gold/50 bg-gold/10' : 'border-white/[0.07] bg-white/[0.02] hover:border-white/20'}`}
            >
              <div className="font-mono text-[10px] tracking-wider text-mist">DAY {String(i + 1).padStart(2, '0')}</div>
              <div className={`mt-0.5 text-sm font-medium ${active ? 'text-white' : 'text-slate-300'}`}>{d.label}</div>
              <div className="mt-1 flex items-center gap-1.5 text-[10px]" style={{ color: CITY_COLOR[d.city] }}>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: CITY_COLOR[d.city] }} />
                {d.city}
              </div>
              {isToday && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-tele shadow-[0_0_8px_#38BDF8]" title="Today" />}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={day.id}
          id="day-detail"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="glass mt-3 p-5 sm:p-7"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="label" style={{ color: CITY_COLOR[day.city] }}>
                {day.label} 2026 · {day.city}
              </div>
              <h3 className="mt-1 text-2xl font-semibold text-white sm:text-3xl">{day.title}</h3>
              <p className="mt-2 max-w-2xl text-slate-300">{day.summary}</p>
            </div>
            <div className="flex gap-2">
              <button className="btn-ghost !px-2.5" disabled={idx === 0} onClick={() => setIdx(idx - 1)} aria-label="Previous day">
                <ChevronLeft size={18} />
              </button>
              <button className="btn-ghost !px-2.5" disabled={idx === DAYS.length - 1} onClick={() => setIdx(idx + 1)} aria-label="Next day">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <ol className="relative space-y-3 border-l border-white/10 pl-5">
              {day.events.map((e, i) => {
                const meta = e.kind && e.kind in KIND_META ? KIND_META[e.kind as keyof typeof KIND_META] : null
                const color = meta?.color ?? (e.kind === 'prayer' ? '#38BDF8' : '#64748b')
                return (
                  <motion.li key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="relative">
                    <span className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full border-2 border-obsidian" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <span className="w-20 shrink-0 font-mono text-xs text-gold/80">{e.time}</span>
                      <span className="font-medium text-slate-100">{e.title}</span>
                    </div>
                    {e.note && <p className="mt-0.5 pl-[92px] text-sm text-slate-400 max-sm:pl-0">{e.note}</p>}
                  </motion.li>
                )
              })}
            </ol>

            <div className="space-y-3">
              {base && (
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <div className="label">Base tonight</div>
                  <div className="mt-1 font-medium text-white">{base.name}</div>
                  {base.address && <div className="mt-1 text-xs text-slate-400">{base.address}</div>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <MapsLink href={mapsSearch(base.mapsQuery)} label="Map" variant="ghost" />
                    <MapsLink
                      href={day.base === 'hotelMakkah' ? mapsDirections(base.mapsQuery, PLACES.haram.mapsQuery) : mapsDirections(base.mapsQuery, PLACES.nabawi.mapsQuery, 'walking')}
                      label={day.base === 'hotelMakkah' ? 'To Haram' : 'To Nabawi'}
                      icon="nav"
                    />
                  </div>
                </div>
              )}
              {day.tips && (
                <div className="rounded-xl border border-tele/20 bg-tele/[0.04] p-4">
                  <div className="label flex items-center gap-1.5 text-tele"><Lightbulb size={11} /> Field notes</div>
                  <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
                    {day.tips.map((t) => (
                      <li key={t} className="flex gap-2"><span className="text-tele">›</span>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </motion.section>
      </AnimatePresence>
    </div>
  )
}
