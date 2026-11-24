import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plane, Radio } from 'lucide-react'
import { MILESTONES } from '../data/umrahData'
import { useNow } from '../hooks/useNow'
import { fmtDate, fmtTime, hijri, pad, splitDuration, tripStatus, TZ_AST, TZ_PKT } from '../lib/time'
import { ProgressRing } from './ui'

function useRingSize() {
  const calc = () => (window.innerWidth < 400 ? 68 : window.innerWidth < 640 ? 76 : 88)
  const [size, setSize] = useState(calc)
  useEffect(() => {
    const on = () => setSize(calc())
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [])
  return size
}

function Unit({ value, label, max, size }: { value: number; label: string; max: number; size: number }) {
  return (
    <ProgressRing value={value / max} size={size} stroke={5} color={label === 'SEC' ? '#38BDF8' : '#D4AF37'}>
      <div className="text-center">
        <div className={`font-mono font-medium tabular-nums text-white ${size < 80 ? 'text-xl' : 'text-2xl'}`}>{pad(value)}</div>
        <div className="font-mono text-[9px] tracking-[0.25em] text-mist">{label}</div>
      </div>
    </ProgressRing>
  )
}

export function CommandHeader() {
  const now = useNow(1000)
  const ring = useRingSize()
  const status = tripStatus(now)
  const target = status.phase === 'pre' ? status.toStart : status.next ? new Date(status.next.start).getTime() - now.getTime() : 0
  const d = splitDuration(target)
  const dayNumber = status.phase === 'live' ? Math.floor((now.getTime() - new Date('2026-11-29T00:00:00+05:00').getTime()) / 86400000) + 1 : 0
  const doneCount = MILESTONES.filter((m) => new Date(m.end).getTime() <= now.getTime()).length

  return (
    <section className="glass-gold relative overflow-hidden p-5 sm:p-7">
      <svg className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 opacity-[0.12]" viewBox="0 0 200 200" aria-hidden>
        <g fill="none" stroke="#D4AF37" strokeWidth="0.8">
          {[0, 15, 30, 45, 60, 75].map((r) => (
            <rect key={r} x="50" y="50" width="100" height="100" transform={`rotate(${r} 100 100)`} />
          ))}
          <circle cx="100" cy="100" r="30" />
          <circle cx="100" cy="100" r="85" />
        </g>
      </svg>

      <div className="relative grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tele opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-tele" />
            </span>
            <span className="label text-tele">
              {status.phase === 'pre' && 'Pre-flight · countdown to wheels-up'}
              {status.phase === 'live' && `Mission live · Day ${dayNumber} of 13`}
              {status.phase === 'post' && 'Mission complete'}
            </span>
          </div>

          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
            {status.phase === 'post' ? (
              <>Umrah Mubarak. <span className="text-gold-grad">Welcome home.</span></>
            ) : (
              <>
                Labbayk <span className="text-gold-grad">Allāhumma</span> ʿUmrah
              </>
            )}
          </h1>
          <p className="arabic mt-1 text-right text-2xl text-gold/80 sm:text-left sm:text-3xl" style={{ direction: 'rtl' }}>
            لَبَّيْكَ اللَّهُمَّ عُمْرَةً
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/30 p-3.5">
              <div className="label flex items-center gap-1.5"><Radio size={11} /> {status.phase === 'live' && status.current ? 'Now' : 'Next up'}</div>
              <div className="mt-1 font-medium text-white">{(status.phase === 'live' && status.current ? status.current : status.next ?? MILESTONES[0]).title}</div>
              <div className="mt-0.5 text-xs text-mist">{(status.phase === 'live' && status.current ? status.current : status.next ?? MILESTONES[0]).timeLabel}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-3.5">
              <div className="label flex items-center gap-1.5"><Plane size={11} /> Legs complete</div>
              <div className="mt-1.5 flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-gold-deep via-gold to-tele" initial={false} animate={{ width: `${(doneCount / MILESTONES.length) * 100}%` }} />
                </div>
                <span className="font-mono text-sm tabular-nums text-white">{doneCount}/{MILESTONES.length}</span>
              </div>
              <div className="mt-1 text-xs text-mist">Trip progress {Math.round(status.progress * 100)}%</div>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col items-center gap-4 lg:items-end">
          {status.phase !== 'post' && (
            <>
              <div className="label">{status.phase === 'pre' ? 'T-minus to LHE departure' : `T-minus to ${status.next?.title ?? 'arrival'}`}</div>
              <div className="flex gap-1.5 sm:gap-3">
                <Unit value={d.days} label="DAYS" max={Math.max(d.days, 14)} size={ring} />
                <Unit value={d.hours} label="HRS" max={24} size={ring} />
                <Unit value={d.minutes} label="MIN" max={60} size={ring} />
                <Unit value={d.seconds} label="SEC" max={60} size={ring} />
              </div>
            </>
          )}
          <div className="grid w-full max-w-sm grid-cols-2 gap-2 text-center">
            <div className="rounded-xl border border-white/10 bg-black/30 px-3 py-2.5">
              <div className="label">Lahore · PKT</div>
              <div className="mt-0.5 font-mono text-xl tabular-nums text-white">{fmtTime(now, TZ_PKT)}</div>
              <div className="text-[11px] text-mist">{fmtDate(now, TZ_PKT)}</div>
            </div>
            <div className="rounded-xl border border-gold/20 bg-gold/[0.05] px-3 py-2.5">
              <div className="label text-gold/70">Makkah · AST</div>
              <div className="mt-0.5 font-mono text-xl tabular-nums text-gold-soft">{fmtTime(now, TZ_AST)}</div>
              <div className="text-[11px] text-mist">{fmtDate(now, TZ_AST)}</div>
            </div>
          </div>
          <div className="text-xs text-mist">{hijri(now)} · AST is 2 h behind PKT</div>
        </div>
      </div>
    </section>
  )
}
