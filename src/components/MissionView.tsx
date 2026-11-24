import { BedDouble, BookOpenText, Bus, Footprints, RotateCcw } from 'lucide-react'
import { mapsDirections, mapsSearch, PLACES } from '../data/umrahData'
import { useApp } from '../lib/nav'
import { CommandHeader } from './CommandHeader'
import { FlightTimeline } from './FlightTimeline'
import { MiqatAlert } from './MiqatAlert'
import { PrayerTimes } from './PrayerTimes'
import { MapsLink } from './ui'

const BASECAMPS = [
  {
    place: PLACES.hotelMakkah,
    dates: '30 Nov → 7 Dec · 7 nights',
    distance: '~4–5 km to Masjid al-Haram',
    transit: 'Hotel shuttle / Makkah Bus / Careem (15–30 min)',
    icon: Bus,
    to: PLACES.haram,
    mode: 'driving' as const,
    accent: 'gold',
  },
  {
    place: PLACES.hotelMadinah,
    dates: '7 Dec → 10/11 Dec · 3–4 nights',
    distance: '~150–250 m to the north courtyard',
    transit: '2–3 min walk to King Fahd Gate (no. 21)',
    icon: Footprints,
    to: PLACES.nabawi,
    mode: 'walking' as const,
    accent: 'tele',
  },
]

export function MissionView() {
  const { go } = useApp()
  return (
    <div className="space-y-6">
      <CommandHeader />
      <MiqatAlert />

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <FlightTimeline />
        <div className="space-y-6">
          <PrayerTimes />

          <section className="glass p-5">
            <div className="label text-tele/80 flex items-center gap-1.5"><BedDouble size={11} /> Basecamps</div>
            <div className="mt-3 space-y-3">
              {BASECAMPS.map((b) => (
                <div key={b.place.id} className={`rounded-xl border p-4 ${b.accent === 'gold' ? 'border-gold/20 bg-gold/[0.03]' : 'border-tele/20 bg-tele/[0.03]'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium text-white">{b.place.name}</div>
                      <div className="mt-0.5 font-mono text-[11px] text-gold/80">{b.dates}</div>
                    </div>
                    <b.icon size={18} className={b.accent === 'gold' ? 'text-gold' : 'text-tele'} />
                  </div>
                  {b.place.address && <p className="mt-2 text-xs text-slate-400">{b.place.address}</p>}
                  <p className="mt-2 text-sm text-slate-300">
                    {b.distance}
                    <br />
                    <span className="text-slate-400">{b.transit}</span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <MapsLink href={mapsSearch(b.place.mapsQuery)} label="Hotel" variant="ghost" />
                    <MapsLink href={mapsDirections(b.place.mapsQuery, b.to.mapsQuery, b.mode)} label={`Route to ${b.to.short}`} variant={b.accent === 'gold' ? 'gold' : 'tele'} icon="nav" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3">
            <button onClick={() => go('rituals', 'tawaf-counter')} className="glass group p-4 text-left transition hover:border-gold/40">
              <RotateCcw className="text-gold transition-transform duration-500 group-hover:-rotate-180" size={22} />
              <div className="mt-3 font-medium text-white">Tawaf counter</div>
              <div className="text-xs text-mist">7 rounds, one tap each</div>
            </button>
            <button onClick={() => go('duas')} className="glass group p-4 text-left transition hover:border-tele/40">
              <BookOpenText className="text-tele" size={22} />
              <div className="mt-3 font-medium text-white">Pocket duas</div>
              <div className="text-xs text-mist">Arabic, transliteration, meaning</div>
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
