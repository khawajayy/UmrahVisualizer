import { useEffect, useState } from 'react'

/** Ticks every `interval` ms. Add ?now=2026-11-30T10:00:00%2B03:00 to the URL to preview the app mid-trip. */
export function useNow(interval = 1000) {
  const [offset] = useState(() => {
    const p = new URLSearchParams(window.location.search).get('now')
    const t = p ? Date.parse(p) : NaN
    return Number.isNaN(t) ? 0 : t - Date.now()
  })
  const [now, setNow] = useState(() => new Date(Date.now() + offset))
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date(Date.now() + offset)), interval)
    return () => window.clearInterval(id)
  }, [interval, offset])
  return now
}
