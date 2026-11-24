import { useState } from 'react'
import { MoonStar } from 'lucide-react'
import { PLACES, PRAYER_NOTE, type CityKey } from '../data/umrahData'
import { useNow } from '../hooks/useNow'
import { prayerTimes } from '../lib/prayer'
import { fmtTime, pad, splitDuration, TZ_AST, ymd } from '../lib/time'

/** Which city the itinerary puts you in on a given AST date. */
export function cityForDate(date: string): CityKey {
  return date >= '2026-12-07' && date <= '2026-12-10' ? 'madinah' : 'makkah'
}

export function PrayerTimes() {
  const now = useNow(1000)
  const today = ymd(now, TZ_AST)
  const [override, setOverride] = useState<CityKey | null>(null)
  const city = override ?? cityForDate(today)
  const p = city === 'makkah' ? PLACES.haram : PLACES.nabawi
  const times = prayerTimes(today, p.lat, p.lng, 3)
  const salah = times.filter((x) => x.key !== 'sunrise')
  let next = salah.find((x) => x.at.getTime() > now.getTime())
  let nextLabel = ''
  if (!next) {
    const tomorrow = ymd(new Date(now.getTime() + 86400000), TZ_AST)
    next = prayerTimes(tomorrow, p.lat, p.lng, 3)[0]
    nextLabel = ' (tomorrow)'
  }
  const d = splitDuration(next.at.getTime() - now.getTime())

  return (
    <section className="glass p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="label text-tele/80 flex items-center gap-1.5"><MoonStar size={11} /> Prayer telemetry</div>
          <h3 className="mt-1 text-lg font-semibold text-white">{city === 'makkah' ? 'Masjid al-Haram' : 'Al-Masjid an-Nabawi'}</h3>
        </div>
        <div className="inline-flex rounded-lg border border-white/10 bg-black/40 p-0.5 text-[11px]">
          {(['makkah', 'madinah'] as CityKey[]).map((c) => (
            <button key={c} onClick={() => setOverride(c)} className={`rounded-md px-2.5 py-1 capitalize ${city === c ? 'bg-gold/15 text-gold-soft' : 'text-slate-400'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-tele/25 bg-tele/[0.06] px-4 py-3">
        <div>
          <div className="label text-tele">Next · {next.name}{nextLabel}</div>
          <div className="arabic text-lg leading-tight text-tele/80">{next.arabic}</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl tabular-nums text-white">
            {pad(d.hours + d.days * 24)}:{pad(d.minutes)}:{pad(d.seconds)}
          </div>
          <div className="font-mono text-xs text-tele/80">at {fmtTime(next.at, TZ_AST)} AST</div>
        </div>
      </div>

      <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {times.map((x) => {
          const isNext = x.key === next!.key && !nextLabel
          return (
            <li key={x.key} className={`rounded-lg border px-2 py-2 text-center ${isNext ? 'border-tele/50 bg-tele/10' : 'border-white/[0.06] bg-white/[0.02]'} ${x.key === 'sunrise' ? 'opacity-60' : ''}`}>
              <div className="text-[11px] text-mist">{x.name}</div>
              <div className={`font-mono text-sm tabular-nums ${isNext ? 'text-tele' : 'text-slate-100'}`}>{fmtTime(x.at, TZ_AST)}</div>
            </li>
          )
        })}
      </ul>
      <p className="mt-3 text-[11px] leading-relaxed text-slate-500">{PRAYER_NOTE}</p>
    </section>
  )
}
