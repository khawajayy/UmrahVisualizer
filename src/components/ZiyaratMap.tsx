import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import L from 'leaflet'
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { Footprints, Info, Lightbulb, MapPinned } from 'lucide-react'
import { LANDMARKS, mapsDirections, mapsSearch, PLACES, ZIYARAT_META, type CityKey, type Landmark } from '../data/umrahData'
import { flashElement, useApp } from '../lib/nav'
import { MapsLink, SectionHeader, SmartImage } from './ui'

const KIND_COLOR: Record<Landmark['kind'], string> = {
  base: '#D4AF37',
  mosque: '#38BDF8',
  mountain: '#34d399',
  plain: '#a78bfa',
  cemetery: '#94a3b8',
  heritage: '#f59e0b',
}

function pinIcon(l: Landmark, active: boolean) {
  const color = KIND_COLOR[l.kind]
  const size = l.kind === 'base' ? 34 : active ? 32 : 26
  const label = l.kind === 'base' ? '⌂' : String(l.order - 1)
  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `<div class="glow-pin" style="width:${size}px;height:${size}px">
      <span class="ring" style="border:2px solid ${color};${active ? '' : 'animation-duration:3.2s;opacity:.5'}"></span>
      <span class="core" style="width:${size - 6}px;height:${size - 6}px;background:${active ? color : '#0c1018'};color:${active ? '#07090E' : color};border:2px solid ${color};box-shadow:0 0 ${active ? 22 : 12}px ${color}">${label}</span>
    </div>`,
  })
}

function MapController({ city, selected }: { city: CityKey; selected?: Landmark }) {
  const map = useMap()
  const shownCity = useRef<CityKey | null>(null)
  const shownSel = useRef<string | undefined>(undefined)
  useEffect(() => {
    // City change (or first mount): frame the whole circuit and don't zoom to the default selection.
    if (shownCity.current !== city) {
      shownCity.current = city
      shownSel.current = selected?.id
      const pts = LANDMARKS.filter((l) => l.city === city).map((l) => [l.lat, l.lng] as [number, number])
      map.invalidateSize()
      map.flyToBounds(L.latLngBounds(pts).pad(0.12), { duration: 0.9 })
      return
    }
    if (selected && selected.id !== shownSel.current) {
      shownSel.current = selected.id
      if (selected.kind !== 'base') map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 14), { duration: 0.8 })
    }
  }, [city, selected, map])
  return null
}

export function ZiyaratMap() {
  const { focus } = useApp()
  const [city, setCity] = useState<CityKey>('makkah')
  const [selectedId, setSelectedId] = useState<string>('mk-hira')
  const meta = ZIYARAT_META[city]
  const list = useMemo(() => LANDMARKS.filter((l) => l.city === city).sort((a, b) => a.order - b.order), [city])
  const selected = LANDMARKS.find((l) => l.id === selectedId && l.city === city) ?? list[1]
  const base = list[0]

  useEffect(() => {
    if (focus?.view !== 'ziyarat' || !focus.id) return
    const l = LANDMARKS.find((x) => x.id === focus.id)
    if (l) {
      setCity(l.city)
      setSelectedId(l.id)
      flashElement('landmark-detail')
    }
  }, [focus])

  const switchCity = (c: CityKey) => {
    setCity(c)
    setSelectedId(c === 'makkah' ? 'mk-hira' : 'md-nabawi')
  }

  const circuit = list.map((l) => [l.lat, l.lng] as [number, number])

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Dual-city navigation hub" title="Ziyarat" arabic="الزيارة">
        <div className="inline-flex rounded-xl border border-white/10 bg-black/40 p-1">
          {(['makkah', 'madinah'] as CityKey[]).map((c) => (
            <button key={c} onClick={() => switchCity(c)} className={`relative rounded-lg px-4 py-2 text-sm font-medium transition ${city === c ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}>
              {city === c && <motion.span layoutId="city-pill" className={`absolute inset-0 rounded-lg ${c === 'makkah' ? 'bg-gold/15 ring-1 ring-gold/40' : 'bg-tele/15 ring-1 ring-tele/40'}`} />}
              <span className="relative">{c === 'makkah' ? 'Makkah · 3 Dec' : 'Madinah · 8 Dec'}</span>
            </button>
          ))}
        </div>
      </SectionHeader>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="glass overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
            <div>
              <div className="font-medium text-white">{meta.title}</div>
              <div className="font-mono text-[11px] text-gold/80">{meta.date} · base: {meta.base.short}</div>
            </div>
            <div className="hidden flex-wrap gap-3 text-[10px] text-mist sm:flex">
              {(['mosque', 'mountain', 'plain', 'cemetery', 'heritage'] as const).map((k) => (
                <span key={k} className="flex items-center gap-1 capitalize">
                  <span className="h-2 w-2 rounded-full" style={{ background: KIND_COLOR[k] }} /> {k}
                </span>
              ))}
            </div>
          </div>
          <div className="relative h-[380px] sm:h-[480px]">
            <MapContainer center={meta.center} zoom={meta.zoom} scrollWheelZoom={false} className="h-full w-full" attributionControl>
              {/* Esri Dark Gray Canvas: keyless dark basemap (CARTO dark tiles now require an API key). */}
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                attribution='Tiles &copy; <a href="https://www.esri.com">Esri</a> &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors'
                maxNativeZoom={16}
                maxZoom={18}
              />
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}" maxNativeZoom={16} maxZoom={18} />
              <MapController city={city} selected={selected} />
              <Polyline positions={circuit} pathOptions={{ color: city === 'makkah' ? '#D4AF37' : '#38BDF8', weight: 1.5, opacity: 0.45, dashArray: '6 8' }} />
              {selected && selected.kind !== 'base' && (
                <Polyline positions={[[base.lat, base.lng], [selected.lat, selected.lng]]} pathOptions={{ color: '#38BDF8', weight: 3, opacity: 0.9, dashArray: '2 8', lineCap: 'round' }} />
              )}
              {city === 'madinah' && (
                <Polyline positions={[[PLACES.hotelMadinah.lat, PLACES.hotelMadinah.lng], [24.4694, 39.6111], [PLACES.nabawi.lat, PLACES.nabawi.lng]]} pathOptions={{ color: '#34d399', weight: 4, opacity: 0.9 }} />
              )}
              {city === 'makkah' && (
                <Polyline positions={[[base.lat, base.lng], [PLACES.haram.lat, PLACES.haram.lng]]} pathOptions={{ color: '#D4AF37', weight: 2, opacity: 0.6 }} />
              )}
              {list.map((l) => (
                <Marker key={l.id} position={[l.lat, l.lng]} icon={pinIcon(l, l.id === selected?.id)} eventHandlers={{ click: () => setSelectedId(l.id) }}>
                  <Tooltip direction="top" offset={[0, -14]} className="glow-tip">
                    {l.name}
                  </Tooltip>
                </Marker>
              ))}
              {city === 'makkah' && (
                <Marker position={[PLACES.haram.lat, PLACES.haram.lng]} icon={L.divIcon({ className: '', iconSize: [18, 18], iconAnchor: [9, 9], html: '<div style="width:18px;height:18px;background:#07090E;border:2px solid #D4AF37;box-shadow:0 0 16px #D4AF37"></div>' })}>
                  <Tooltip direction="left" offset={[-10, 0]} className="glow-tip">
                    Masjid al-Haram
                  </Tooltip>
                </Marker>
              )}
            </MapContainer>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-white/[0.06] p-3">
            {list.map((l) => (
              <button
                key={l.id}
                onClick={() => setSelectedId(l.id)}
                className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs transition ${l.id === selected?.id ? 'border-tele/50 bg-tele/10 text-white' : 'border-white/10 text-slate-400 hover:text-slate-200'}`}
              >
                <span className="grid h-5 w-5 place-items-center rounded-full font-mono text-[10px]" style={{ background: `${KIND_COLOR[l.kind]}22`, color: KIND_COLOR[l.kind] }}>
                  {l.kind === 'base' ? '⌂' : l.order - 1}
                </span>
                {l.name.split(' & ')[0].replace(' (Khandaq)', '')}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.article key={selected.id} id="landmark-detail" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.22 }} className="glass overflow-hidden">
              <div className="relative">
                <SmartImage src={selected.image} alt={selected.name} label={selected.arabic} className="h-52 sm:h-60" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="label" style={{ color: KIND_COLOR[selected.kind] }}>
                    {selected.kind === 'base' ? 'Home base' : `Stop ${selected.order - 1} · ${selected.kind}`}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{selected.name}</h3>
                  <div className="arabic text-lg leading-tight text-gold/80">{selected.arabic}</div>
                </div>
                {selected.imageCredit && <span className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-slate-400">{selected.imageCredit}</span>}
              </div>
              <div className="space-y-4 p-5">
                <p className="text-slate-200">{selected.summary}</p>
                <div>
                  <div className="label mb-1 flex items-center gap-1.5"><Info size={11} /> History</div>
                  <p className="text-sm leading-relaxed text-slate-400">{selected.history}</p>
                </div>
                <div>
                  <div className="label mb-1.5 text-gold/80">Etiquette</div>
                  <ul className="space-y-1.5 text-sm text-slate-300">
                    {selected.etiquette.map((e) => (
                      <li key={e} className="flex gap-2"><span className="text-gold">◆</span>{e}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="label mb-1.5 flex items-center gap-1.5 text-tele"><Lightbulb size={11} /> Visiting tips</div>
                  <ul className="space-y-1.5 text-sm text-slate-300">
                    {selected.tips.map((e) => (
                      <li key={e} className="flex gap-2"><span className="text-tele">›</span>{e}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selected.kind === 'base' ? (
                    <>
                      <MapsLink href={mapsSearch(selected.mapsQuery)} label="Open hotel" />
                      <MapsLink
                        href={city === 'makkah' ? mapsDirections(selected.mapsQuery, PLACES.haram.mapsQuery) : mapsDirections(selected.mapsQuery, PLACES.nabawi.mapsQuery, 'walking')}
                        label={city === 'makkah' ? 'Route to Haram' : 'Walk to Nabawi'}
                        variant="tele"
                        icon="nav"
                      />
                    </>
                  ) : (
                    <>
                      <MapsLink href={mapsDirections(meta.base.mapsQuery, selected.mapsQuery, selected.walking ? 'walking' : 'driving')} label={`Directions from ${meta.base.short}`} variant="tele" icon="nav" />
                      <MapsLink href={mapsSearch(selected.mapsQuery)} label="Google Maps" variant="ghost" />
                    </>
                  )}
                </div>
                {selected.walking && (
                  <p className="flex items-center gap-1.5 text-xs text-go">
                    <Footprints size={13} /> Walkable from Al Ansar Tulip
                  </p>
                )}
              </div>
            </motion.article>
          )}
        </AnimatePresence>
      </div>

      <p className="flex items-start gap-2 text-xs text-mist">
        <MapPinned size={14} className="mt-0.5 shrink-0" /> Dashed lines are straight-line connections for orientation, not driving routes. Use the Google Maps buttons for turn-by-turn directions. Map tiles need data the first time; places you've viewed are cached for offline use.
      </p>
    </div>
  )
}
