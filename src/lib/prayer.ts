// Offline prayer-time calculator (Umm al-Qura style): Fajr 18.5°, Isha = Maghrib + 90 min,
// Asr shadow factor 1 (as called in the Harams). Based on the public-domain PrayTimes.org formulas.

const rad = (d: number) => (d * Math.PI) / 180
const deg = (r: number) => (r * 180) / Math.PI
const sin = (d: number) => Math.sin(rad(d))
const cos = (d: number) => Math.cos(rad(d))
const tan = (d: number) => Math.tan(rad(d))
const arcsin = (x: number) => deg(Math.asin(x))
const arccos = (x: number) => deg(Math.acos(Math.max(-1, Math.min(1, x))))
const arctan2 = (y: number, x: number) => deg(Math.atan2(y, x))
const arccot = (x: number) => deg(Math.atan(1 / x))
const fix = (a: number, b: number) => {
  const r = a - b * Math.floor(a / b)
  return r < 0 ? r + b : r
}

function julian(y: number, m: number, d: number) {
  if (m <= 2) {
    y -= 1
    m += 12
  }
  const A = Math.floor(y / 100)
  const B = 2 - A + Math.floor(A / 4)
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5
}

function sunPosition(jd: number) {
  const D = jd - 2451545.0
  const g = fix(357.529 + 0.98560028 * D, 360)
  const q = fix(280.459 + 0.98564736 * D, 360)
  const L = fix(q + 1.915 * sin(g) + 0.02 * sin(2 * g), 360)
  const e = 23.439 - 0.00000036 * D
  const RA = arctan2(cos(e) * sin(L), cos(L)) / 15
  const eqt = q / 15 - fix(RA, 24)
  const decl = arcsin(sin(e) * sin(L))
  return { decl, eqt }
}

export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'

export interface PrayerTime {
  key: PrayerKey
  name: string
  arabic: string
  at: Date
}

const NAMES: Record<PrayerKey, [string, string]> = {
  fajr: ['Fajr', 'الفجر'],
  sunrise: ['Sunrise', 'الشروق'],
  dhuhr: ['Dhuhr', 'الظهر'],
  asr: ['Asr', 'العصر'],
  maghrib: ['Maghrib', 'المغرب'],
  isha: ['Isha', 'العشاء'],
}

/** date: YYYY-MM-DD for the local day; tz: UTC offset in hours (KSA = 3). */
export function prayerTimes(date: string, lat: number, lng: number, tz = 3): PrayerTime[] {
  const [y, m, d] = date.split('-').map(Number)
  const jd = julian(y, m, d) - lng / (15 * 24)

  const pos = (t: number) => sunPosition(jd + t / 24)
  const midDay = (t: number) => fix(12 - pos(t).eqt, 24)
  const angleTime = (angle: number, t: number, ccw: boolean) => {
    const { decl } = pos(t)
    const noon = midDay(t)
    const T = arccos((-sin(angle) - sin(decl) * sin(lat)) / (cos(decl) * cos(lat))) / 15
    return noon + (ccw ? -T : T)
  }
  const asrTime = (factor: number, t: number) => {
    const { decl } = pos(t)
    const angle = -arccot(factor + tan(Math.abs(lat - decl)))
    return angleTime(angle, t, false)
  }

  let fajr = 5
  let sunrise = 6
  let dhuhr = 12
  let asr = 13
  let sunset = 18
  for (let i = 0; i < 2; i++) {
    fajr = angleTime(18.5, fajr / 24, true)
    sunrise = angleTime(0.833, sunrise / 24, true)
    dhuhr = midDay(dhuhr / 24)
    asr = asrTime(1, asr / 24)
    sunset = angleTime(0.833, sunset / 24, false)
  }
  const shift = tz - lng / 15
  const local: Record<PrayerKey, number> = {
    fajr: fajr + shift,
    sunrise: sunrise + shift,
    dhuhr: dhuhr + shift + 1 / 60,
    asr: asr + shift,
    maghrib: sunset + shift,
    isha: sunset + shift + 1.5,
  }
  const base = Date.UTC(y, m - 1, d) - tz * 3600_000
  return (Object.keys(local) as PrayerKey[]).map((key) => ({
    key,
    name: NAMES[key][0],
    arabic: NAMES[key][1],
    at: new Date(base + Math.round(local[key] * 60) * 60_000),
  }))
}
