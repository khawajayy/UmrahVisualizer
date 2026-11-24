import { MILESTONES, TRIP_END, TRIP_START, type Milestone } from '../data/umrahData'

export const TZ_AST = 'Asia/Riyadh'
export const TZ_PKT = 'Asia/Karachi'

export const fmtTime = (d: Date, timeZone: string) =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone }).format(d)

export const fmtDate = (d: Date, timeZone: string) =>
  new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone }).format(d)

/** YYYY-MM-DD in the given zone */
export const ymd = (d: Date, timeZone: string) => {
  const parts = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone }).formatToParts(d)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  return `${get('year')}-${get('month')}-${get('day')}`
}

export function hijri(d: Date) {
  try {
    return new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ_AST }).format(d)
  } catch {
    return ''
  }
}

export function splitDuration(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 }
}

export const pad = (n: number) => String(n).padStart(2, '0')

export type Phase = 'pre' | 'live' | 'post'

export interface TripStatus {
  phase: Phase
  current?: Milestone
  next?: Milestone
  progress: number
  toStart: number
}

const span = (m: Milestone) => new Date(m.end).getTime() - new Date(m.start).getTime()

export function tripStatus(now: Date): TripStatus {
  const t = now.getTime()
  const start = new Date(TRIP_START).getTime()
  const end = new Date(TRIP_END).getTime()
  const phase: Phase = t < start ? 'pre' : t > end ? 'post' : 'live'
  // most specific active milestone wins (e.g. a Ziyarat day over the hotel stay around it)
  const active = MILESTONES.filter((m) => new Date(m.start).getTime() <= t && t < new Date(m.end).getTime()).sort((a, b) => span(a) - span(b))
  const next = MILESTONES.find((m) => new Date(m.start).getTime() > t)
  return {
    phase,
    current: active[0],
    next,
    progress: Math.min(1, Math.max(0, (t - start) / (end - start))),
    toStart: start - t,
  }
}
