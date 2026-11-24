# Umrah Mission Control

Trip companion for our Umrah, 29 Nov – 11 Dec 2026. Vite + React + TypeScript, Tailwind v4, Framer Motion, Leaflet.

## Run

```powershell
npm install
npm run dev        # http://localhost:5173
npm run build      # type check + production build into dist/
npm run preview    # serve the production build (enables offline caching)
```

## Views

| View | What's there |
|---|---|
| Mission | Countdown, PKT/AST clocks, Hijri date, Miqat & Ihram protocol with flight-path schematic, 13-leg timeline, offline prayer times, hotel cards |
| Itinerary | Day-by-day plan for all 13 days with Google Maps links |
| Umrah Guide | 4 steps with a MAN / WOMAN switch, Talbiyah rhythm guide, Tawaf counter, Kaaba/Mataf diagram, Sa'i tracker |
| Ziyarat | Leaflet map + landmark cards for Makkah (3 Dec) and Madinah (8 Dec) |
| Local Intel | Filterable food/apps/transport/money/health cards and the packing checklist |
| Duas | Arabic, transliteration, translation, copy and favourites, plus Saudi phrases |

`Ctrl/Cmd + K` (or `/`) opens search across days, duas, sites and rules.

## Notes

- All content lives in `src/data/umrahData.ts`. Edit times there once the group confirms them (items marked TIME TBC).
- Checklists, counters, favourites and the man/woman setting are saved in localStorage on each phone.
- Preview the app mid-trip with `?now=`, e.g. `http://localhost:5173/?now=2026-11-30T10:00:00%2B03:00`.
- The production build registers a service worker that caches the app, fonts, photos and any map tiles you've viewed. Open every view once on hotel Wi-Fi before relying on it offline.
- Map tiles come from Esri's Dark Gray Canvas (no API key). CARTO's dark tiles now require a key.
- Prayer times are calculated on-device (Umm al-Qura method). Always follow the Haram adhan.
