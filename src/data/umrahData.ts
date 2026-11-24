// All trip, ritual, map and dua data lives here so the app works fully offline.
// Times are stored as ISO strings with explicit offsets (PKT = +05:00, AST = +03:00).

export type Role = 'man' | 'woman'
export type CityKey = 'makkah' | 'madinah'

export interface LatLng {
  lat: number
  lng: number
}

/* ------------------------------------------------------------------ */
/*  Places (hotels, airports, Miqat)                                   */
/* ------------------------------------------------------------------ */

export interface Place extends LatLng {
  id: string
  name: string
  short: string
  address?: string
  mapsQuery: string
}

export const PLACES = {
  lhe: { id: 'lhe', name: 'Allama Iqbal International Airport', short: 'LHE', lat: 31.5216, lng: 74.4036, mapsQuery: 'Allama Iqbal International Airport Lahore' },
  med: { id: 'med', name: 'Prince Mohammad Bin Abdulaziz International Airport', short: 'MED', lat: 24.5534, lng: 39.7051, mapsQuery: 'Prince Mohammad Bin Abdulaziz International Airport Madinah' },
  jed: { id: 'jed', name: 'King Abdulaziz International Airport', short: 'JED', lat: 21.6796, lng: 39.1565, mapsQuery: 'King Abdulaziz International Airport Jeddah' },
  ruh: { id: 'ruh', name: 'King Khalid International Airport', short: 'RUH', lat: 24.9576, lng: 46.6988, mapsQuery: 'King Khalid International Airport Riyadh' },
  hotelMakkah: {
    id: 'hotelMakkah',
    name: 'Holiday Inn Makkah Al Aziziah',
    short: 'Holiday Inn Aziziah',
    address: '8324 Masjid Ash Shaikh Bin Baz, Al Aziziyah District, Makkah 24243',
    lat: 21.4106,
    lng: 39.8651,
    mapsQuery: 'Holiday Inn Makkah Al Aziziah',
  },
  hotelMadinah: {
    id: 'hotelMadinah',
    name: 'Al Ansar Tulip Hotel',
    short: 'Al Ansar Tulip',
    address: 'Northern Central Area (Markazia), Madinah',
    lat: 24.4706,
    lng: 39.6108,
    mapsQuery: 'Al Ansar Tulip Hotel Madinah',
  },
  haram: { id: 'haram', name: 'Masjid al-Haram', short: 'Haram', lat: 21.4225, lng: 39.8262, mapsQuery: 'Masjid al-Haram King Abdulaziz Gate' },
  nabawi: { id: 'nabawi', name: 'Al-Masjid an-Nabawi', short: 'Nabawi', lat: 24.4672, lng: 39.6112, mapsQuery: 'Al-Masjid an-Nabawi King Fahd Gate' },
  dhulHulayfah: { id: 'dhulHulayfah', name: 'Masjid Dhul Hulayfah (Abyar Ali)', short: 'Dhul Hulayfah', lat: 24.4135, lng: 39.5436, mapsQuery: 'Masjid Dhul Hulayfah Abyar Ali Madinah' },
} satisfies Record<string, Place>

export type PlaceId = keyof typeof PLACES

export const mapsSearch = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

export const mapsDirections = (origin: string, destination: string, mode: 'driving' | 'walking' = 'driving') =>
  `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${mode}`

/* ------------------------------------------------------------------ */
/*  Trip milestones                                                    */
/* ------------------------------------------------------------------ */

export type MilestoneKind = 'flight' | 'layover' | 'stay' | 'ritual' | 'ziyarat' | 'transfer'

export interface Milestone {
  id: string
  n: number
  kind: MilestoneKind
  title: string
  start: string
  end: string
  from?: string
  to?: string
  /** human-readable times as printed on the ticket */
  timeLabel: string
  detail: string
  tbc?: boolean
  alert?: string
}

export const TRIP_START = '2026-11-29T21:00:00+05:00'
export const TRIP_END = '2026-12-11T19:10:00+05:00'

export const MILESTONES: Milestone[] = [
  {
    id: 'out-1', n: 1, kind: 'flight', title: 'Lahore → Madinah',
    start: '2026-11-29T21:00:00+05:00', end: '2026-11-30T00:30:00+03:00',
    from: 'LHE', to: 'MED', timeLabel: 'Sun 29 Nov · 21:00 PKT → ~00:30 AST',
    detail: 'Depart Allama Iqbal International. Men can board already wearing Ihram garments (Niyyah comes later, on the Madinah to Jeddah leg).',
    alert: 'miqat',
  },
  {
    id: 'out-layover', n: 2, kind: 'layover', title: 'Madinah layover',
    start: '2026-11-30T00:30:00+03:00', end: '2026-11-30T03:30:00+03:00',
    from: 'MED', timeLabel: 'Mon 30 Nov · ~00:30 → 03:30 AST',
    detail: '3 hours at MED. Freshen up, change into Ihram if not done yet, pray Isha (and 2 rak\'ahs for Ihram if it isn\'t a disliked time), get ready for Niyyah.',
    alert: 'miqat',
  },
  {
    id: 'out-2', n: 3, kind: 'flight', title: 'Madinah → Jeddah',
    start: '2026-11-30T03:30:00+03:00', end: '2026-11-30T05:15:00+03:00',
    from: 'MED', to: 'JED', timeLabel: 'Mon 30 Nov · ~03:30 → 05:15 AST',
    detail: 'Make Niyyah for Umrah before takeoff or as the aircraft passes Dhul Hulayfah (minutes after departure). Begin Talbiyah. Land at JED between 05:00 and 05:30.',
    alert: 'miqat',
  },
  {
    id: 'makkah-stay', n: 4, kind: 'stay', title: 'Makkah basecamp',
    start: '2026-11-30T07:30:00+03:00', end: '2026-12-07T10:00:00+03:00',
    to: 'Holiday Inn Makkah Al Aziziah', timeLabel: '30 Nov → 7 Dec · 7 nights',
    detail: 'Holiday Inn Makkah Al Aziziah, about 4–5 km from Masjid al-Haram. Ask reception for early check-in or bag drop and the Haram shuttle timetable.',
  },
  {
    id: 'first-umrah', n: 5, kind: 'ritual', title: 'First Umrah',
    start: '2026-11-30T09:00:00+03:00', end: '2026-11-30T14:00:00+03:00',
    to: 'Masjid al-Haram', timeLabel: 'Mon 30 Nov · morning', tbc: true,
    detail: 'Drop bags at the hotel, then straight to the Haram: Tawaf, 2 rak\'ahs, Zamzam, Sa\'i, then Halq/Taqsir. Plan 3–5 hours depending on crowds.',
  },
  {
    id: 'makkah-ziyarat', n: 6, kind: 'ziyarat', title: 'Makkah Ziyarat',
    start: '2026-12-03T07:00:00+03:00', end: '2026-12-03T13:00:00+03:00',
    from: 'Holiday Inn Aziziah', timeLabel: 'Thu 3 Dec · full day', tbc: true,
    detail: 'Jabal al-Nour, Jabal Thawr, Mina, Muzdalifah, Arafat, Jannat al-Mu\'alla, Masjid al-Jinn and the Makkah Library.',
  },
  {
    id: 'hijrah-transfer', n: 7, kind: 'transfer', title: 'Makkah → Madinah',
    start: '2026-12-07T10:00:00+03:00', end: '2026-12-07T15:00:00+03:00',
    from: 'Holiday Inn Aziziah', to: 'Al Ansar Tulip', timeLabel: 'Mon 7 Dec · ~450 km, 4.5–5 h', tbc: true,
    detail: 'Private car via the Hijrah Highway. Consider a farewell Tawaf (Tawaf al-Wada\') before leaving Makkah.',
  },
  {
    id: 'madinah-stay', n: 8, kind: 'stay', title: 'Madinah basecamp',
    start: '2026-12-07T15:00:00+03:00', end: '2026-12-11T00:30:00+03:00',
    to: 'Al Ansar Tulip Hotel', timeLabel: '7 Dec → 10/11 Dec · 3–4 nights',
    detail: 'Al Ansar Tulip Hotel, Northern Markazia. Roughly 150–250 m (2–3 min walk) to the northern courtyard and King Fahd Gate of Al-Masjid an-Nabawi.',
  },
  {
    id: 'madinah-ziyarat', n: 9, kind: 'ziyarat', title: 'Madinah Ziyarat',
    start: '2026-12-08T08:00:00+03:00', end: '2026-12-08T12:30:00+03:00',
    from: 'Al Ansar Tulip', timeLabel: 'Tue 8 Dec · full day', tbc: true,
    detail: 'Masjid Quba (make Wudu at the hotel first), Uhud and the Martyrs\' Cemetery, Masjid al-Qiblatayn, the Seven Mosques.',
  },
  {
    id: 'return-transfer', n: 10, kind: 'transfer', title: 'Madinah → Jeddah Airport',
    start: '2026-12-11T00:30:00+03:00', end: '2026-12-11T05:00:00+03:00',
    from: 'Al Ansar Tulip', to: 'JED', timeLabel: 'Thu 10 Dec night · ~4–4.5 h', tbc: true,
    detail: 'Private transfer overnight. Aim to reach JED by about 05:00 for the 08:00 departure. Backup: Haramain train Madinah → KAIA Airport station.',
  },
  {
    id: 'ret-1', n: 11, kind: 'flight', title: 'Jeddah → Riyadh',
    start: '2026-12-11T08:00:00+03:00', end: '2026-12-11T09:40:00+03:00',
    from: 'JED', to: 'RUH', timeLabel: 'Fri 11 Dec · 08:00 AST',
    detail: 'Check in Zamzam at JED (one sealed 5 L airport carton per passenger, usually checked separately). Confirm the allowance with the airline.',
    alert: 'zamzam',
  },
  {
    id: 'ret-layover', n: 12, kind: 'layover', title: 'Riyadh layover',
    start: '2026-12-11T09:40:00+03:00', end: '2026-12-11T13:20:00+03:00',
    from: 'RUH', timeLabel: 'Fri 11 Dec · 3 h 40 m',
    detail: 'Friday: Jumu\'ah falls during the layover. As travellers you may pray Dhuhr instead (shortened to 2 rak\'ahs). Check your Zamzam tag is on the onward bag list.',
  },
  {
    id: 'ret-2', n: 13, kind: 'flight', title: 'Riyadh → Lahore',
    start: '2026-12-11T13:20:00+03:00', end: '2026-12-11T19:10:00+05:00',
    from: 'RUH', to: 'LHE', timeLabel: 'Fri 11 Dec · 13:20 AST → 19:10 PKT',
    detail: 'Arrive Lahore 19:10 local time, Friday 11 December 2026. Alhamdulillah.',
  },
]

/* ------------------------------------------------------------------ */
/*  Day-by-day plan                                                    */
/* ------------------------------------------------------------------ */

export interface DayEvent {
  time: string
  title: string
  note?: string
  kind?: MilestoneKind | 'prayer' | 'rest'
}

export interface DayPlan {
  id: string
  date: string // YYYY-MM-DD (local)
  label: string
  city: 'Lahore' | 'In transit' | 'Makkah' | 'Madinah' | 'Jeddah / Riyadh'
  title: string
  summary: string
  base?: PlaceId
  events: DayEvent[]
  tips?: string[]
}

export const DAYS: DayPlan[] = [
  {
    id: 'd0', date: '2026-11-29', label: 'Sun 29 Nov', city: 'Lahore', title: 'Departure night',
    summary: 'Final packing, Ghusl and Ihram prep at home. Flight to Madinah at 21:00.',
    events: [
      { time: '14:00', title: 'Ghusl, trim nails, remove unwanted hair', note: 'Men may apply attar to the body (not the cloth) before Niyyah.', kind: 'ritual' },
      { time: '16:00', title: 'Men: put on Izar and Rida at home', note: 'Optional. You can also change at MED. No Niyyah yet.', kind: 'ritual' },
      { time: '18:00', title: 'Leave for LHE', note: 'Arrive 3 hours before departure.', kind: 'transfer' },
      { time: '21:00', title: 'Flight LHE → MED', kind: 'flight' },
    ],
    tips: ['Keep passport, visa printout, and hotel vouchers in a front pouch.', 'Pack the Ihram belt and a spare Izar in hand luggage.'],
  },
  {
    id: 'd1', date: '2026-11-30', label: 'Mon 30 Nov', city: 'Makkah', title: 'Arrival and first Umrah',
    summary: 'Madinah layover, Niyyah on the Jeddah leg, transfer to Aziziyah, then the first Umrah.',
    base: 'hotelMakkah',
    events: [
      { time: '00:30', title: 'Land at MED, 3 h layover', kind: 'layover' },
      { time: '03:30', title: 'Flight MED → JED. Make Niyyah, start Talbiyah', note: 'Dhul Hulayfah is passed within minutes of takeoff.', kind: 'flight' },
      { time: '05:15', title: 'Land at JED, pray Fajr', kind: 'prayer' },
      { time: '06:00', title: 'Road transfer to Holiday Inn Aziziah (~1 h 15 m)', kind: 'transfer' },
      { time: '07:30', title: 'Bag drop / early check-in, short rest', kind: 'rest' },
      { time: '09:00', title: 'Transfer to Masjid al-Haram, perform Umrah', note: 'Tawaf → 2 rak\'ahs → Zamzam → Sa\'i → Halq/Taqsir.', kind: 'ritual' },
    ],
    tips: ['Stay in Ihram restrictions until Halq/Taqsir is done.', 'Note your entry gate number and a landmark for regrouping.'],
  },
  {
    id: 'd2', date: '2026-12-01', label: 'Tue 1 Dec', city: 'Makkah', title: 'Rest and Haram routine',
    summary: 'Recover from the journey. Pray in the Haram, add a nafl Tawaf when crowds thin.',
    base: 'hotelMakkah',
    events: [
      { time: 'Fajr', title: 'Fajr in the Haram (leave Aziziyah ~1 h early)', kind: 'prayer' },
      { time: 'Day', title: 'Sleep, eat, hydrate', kind: 'rest' },
      { time: 'Late night', title: 'Optional nafl Tawaf (quieter after midnight)', kind: 'ritual' },
    ],
  },
  {
    id: 'd3', date: '2026-12-02', label: 'Wed 2 Dec', city: 'Makkah', title: 'Haram day',
    summary: 'Quran, dhikr and prayers in the Haram. Scout the Clock Tower food courts and Zamzam points.',
    base: 'hotelMakkah',
    events: [
      { time: 'Dhuhr–Isha', title: 'Stay in the Haram between prayers', kind: 'prayer' },
      { time: 'Evening', title: 'Book Rawdah slots in Nusuk if the window is open', kind: 'rest' },
    ],
  },
  {
    id: 'd4', date: '2026-12-03', label: 'Thu 3 Dec', city: 'Makkah', title: 'Makkah Ziyarat',
    summary: 'Full-day guided circuit from the Holiday Inn.',
    base: 'hotelMakkah',
    events: [
      { time: '06:30', title: 'Depart hotel after Fajr', kind: 'transfer' },
      { time: '07:00', title: 'Jabal al-Nour & Cave of Hira', kind: 'ziyarat' },
      { time: '09:00', title: 'Jabal Thawr (view from the base)', kind: 'ziyarat' },
      { time: '10:00', title: 'Mina, Muzdalifah, Arafat / Jabal al-Rahmah', kind: 'ziyarat' },
      { time: '12:00', title: 'Jannat al-Mu\'alla, Masjid al-Jinn, Makkah Library', kind: 'ziyarat' },
      { time: '13:00', title: 'Back for Dhuhr / rest', kind: 'rest' },
    ],
    tips: ['Wear proper walking shoes if climbing Jabal al-Nour.', 'Carry water and some riyals for parking and snacks.'],
  },
  {
    id: 'd5', date: '2026-12-04', label: 'Fri 4 Dec', city: 'Makkah', title: 'Jumu\'ah in the Haram',
    summary: 'Friday prayer at Masjid al-Haram. Go very early; roads and gates close as it fills.',
    base: 'hotelMakkah',
    events: [
      { time: '09:30', title: 'Leave Aziziyah for Jumu\'ah', note: 'Ghusl, best clothes, Surah al-Kahf.', kind: 'prayer' },
      { time: 'Dhuhr', title: 'Jumu\'ah prayer', kind: 'prayer' },
    ],
  },
  {
    id: 'd6', date: '2026-12-05', label: 'Sat 5 Dec', city: 'Makkah', title: 'Haram day',
    summary: 'Nafl Tawaf, Quran, and shopping for gifts in the evening.',
    base: 'hotelMakkah',
    events: [
      { time: 'Morning', title: 'Nafl Tawaf after Fajr or late at night', kind: 'ritual' },
      { time: 'Evening', title: 'Souvenir shopping (Ibrahim Khalil St., Clock Tower malls)', kind: 'rest' },
    ],
  },
  {
    id: 'd7', date: '2026-12-06', label: 'Sun 6 Dec', city: 'Makkah', title: 'Last full day in Makkah',
    summary: 'Pack. Final prayers in the Haram. Settle hotel bills.',
    base: 'hotelMakkah',
    events: [
      { time: 'Night', title: 'Farewell Tawaf (Tawaf al-Wada\') if leaving straight after', note: 'Recommended for Umrah pilgrims; not obligatory per most scholars.', kind: 'ritual' },
      { time: 'Night', title: 'Pack, confirm car for 7 Dec', kind: 'rest' },
    ],
  },
  {
    id: 'd8', date: '2026-12-07', label: 'Mon 7 Dec', city: 'Madinah', title: 'Hijrah transit',
    summary: 'Private car Makkah → Madinah (~450 km). Check in at Al Ansar Tulip.',
    base: 'hotelMadinah',
    events: [
      { time: '10:00', title: 'Check out, depart Aziziyah', kind: 'transfer' },
      { time: '12:30', title: 'Rest stop / Dhuhr on the Hijrah Highway', kind: 'prayer' },
      { time: '15:00', title: 'Arrive Al Ansar Tulip, check in', kind: 'stay' },
      { time: 'Maghrib', title: 'First prayer at Al-Masjid an-Nabawi, send salam', kind: 'prayer' },
    ],
    tips: ['Exact times depend on the driver. Confirm pickup the night before.'],
  },
  {
    id: 'd9', date: '2026-12-08', label: 'Tue 8 Dec', city: 'Madinah', title: 'Madinah Ziyarat',
    summary: 'Quba, Uhud, Qiblatayn and the Seven Mosques.',
    base: 'hotelMadinah',
    events: [
      { time: '07:45', title: 'Make Wudu at the hotel', note: 'For the reward of an Umrah at Quba.', kind: 'ritual' },
      { time: '08:00', title: 'Masjid Quba, pray 2 rak\'ahs', kind: 'ziyarat' },
      { time: '09:15', title: 'Uhud, Martyrs\' Cemetery, Jabal al-Rumah', kind: 'ziyarat' },
      { time: '10:45', title: 'Masjid al-Qiblatayn', kind: 'ziyarat' },
      { time: '11:30', title: 'The Seven Mosques (Khandaq)', kind: 'ziyarat' },
      { time: '12:30', title: 'Back for Dhuhr at the Nabawi', kind: 'prayer' },
    ],
  },
  {
    id: 'd10', date: '2026-12-09', label: 'Wed 9 Dec', city: 'Madinah', title: 'Rawdah & Baqi',
    summary: 'Rawdah visit (Nusuk slot), Baqi after Fajr, dates market in the afternoon.',
    base: 'hotelMadinah',
    events: [
      { time: 'After Fajr', title: 'Jannat al-Baqi (men)', kind: 'ziyarat' },
      { time: 'Slot', title: 'Rawdah visit per Nusuk booking', kind: 'ritual' },
      { time: 'Afternoon', title: 'Ajwa / Safawi dates at the Central Date Market', kind: 'rest' },
    ],
  },
  {
    id: 'd11', date: '2026-12-10', label: 'Thu 10 Dec', city: 'Madinah', title: 'Final day in Madinah',
    summary: 'Last prayers at the Prophet\'s Mosque. Farewell salam. Overnight transfer to Jeddah.',
    base: 'hotelMadinah',
    events: [
      { time: 'Isha', title: 'Final prayer and farewell salam at the Nabawi', kind: 'prayer' },
      { time: '23:30', title: 'Check out, load car', kind: 'rest' },
      { time: '00:30', title: 'Depart for JED (~4–4.5 h)', kind: 'transfer' },
    ],
  },
  {
    id: 'd12', date: '2026-12-11', label: 'Fri 11 Dec', city: 'Jeddah / Riyadh', title: 'Homeward',
    summary: 'JED 08:00 → RUH, 3 h 40 m layover, RUH 13:20 → LHE 19:10.',
    events: [
      { time: '05:00', title: 'Arrive JED, check in, Zamzam carton', kind: 'transfer' },
      { time: '08:00', title: 'Flight JED → RUH', kind: 'flight' },
      { time: '09:40', title: 'Riyadh layover (Dhuhr as traveller)', kind: 'layover' },
      { time: '13:20', title: 'Flight RUH → LHE', kind: 'flight' },
      { time: '19:10', title: 'Land in Lahore (PKT)', kind: 'flight' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Miqat data for the flight-path schematic                           */
/* ------------------------------------------------------------------ */

export const MIQATS = [
  { id: 'dhul-hulayfah', name: 'Dhul Hulayfah', alt: 'Abyar Ali', lat: 24.4135, lng: 39.5436, forWhom: 'From Madinah' },
  { id: 'juhfah', name: 'Al-Juhfah', alt: 'Rabigh', lat: 22.7036, lng: 39.1414, forWhom: 'From Syria/Egypt' },
  { id: 'qarn', name: 'Qarn al-Manazil', alt: 'As-Sayl al-Kabir', lat: 21.6315, lng: 40.4235, forWhom: 'From Najd/east' },
  { id: 'yalamlam', name: 'Yalamlam', alt: 'As-Sa\'diyah', lat: 20.5497, lng: 39.8616, forWhom: 'From Yemen/south' },
  { id: 'dhat-irq', name: 'Dhat Irq', alt: 'Ad-Dariba', lat: 21.9314, lng: 40.4269, forWhom: 'From Iraq' },
]

/* ------------------------------------------------------------------ */
/*  Ritual guide                                                       */
/* ------------------------------------------------------------------ */

export interface RuleItem {
  id: string
  title: string
  detail: string
  severity?: 'must' | 'sunnah' | 'avoid' | 'tip'
}

export interface RitualStep {
  id: string
  n: number
  title: string
  arabic: string
  subtitle: string
  shared: RuleItem[]
  man: RuleItem[]
  woman: RuleItem[]
}

export const RITUAL_STEPS: RitualStep[] = [
  {
    id: 'ihram', n: 1, title: 'Preparation & Ihram', arabic: 'الإحرام', subtitle: 'Before the Miqat',
    shared: [
      { id: 'ghusl', title: 'Ghusl and grooming', detail: 'Take a full bath, trim nails, remove underarm and pubic hair, trim the moustache. Do this at home or the hotel before travelling.', severity: 'sunnah' },
      { id: 'niyyah', title: 'Niyyah at the Miqat', detail: 'On the Madinah → Jeddah flight, before or as you pass Dhul Hulayfah, intend Umrah in your heart and say: "Labbayk Allāhumma ʿUmrah." If you fear being unable to finish, you may add "Allāhumma maḥillī ḥaythu ḥabastanī."', severity: 'must' },
      { id: 'talbiyah', title: 'Talbiyah', detail: 'Begin reciting the Talbiyah right after Niyyah and keep repeating it until you begin Tawaf.', severity: 'sunnah' },
      { id: 'ihram-salah', title: '2 rak\'ahs before Ihram', detail: 'If possible, pray two rak\'ahs at the MED airport prayer room before the Niyyah (not during a disliked time). A fard prayer also covers this.', severity: 'sunnah' },
      { id: 'proh-scent', title: 'No fragrance', detail: 'After Niyyah: no perfume, scented soap, scented wipes, or scented lotion on body or clothes. Use unscented products only.', severity: 'avoid' },
      { id: 'proh-hair', title: 'No cutting hair or nails', detail: 'Don\'t cut, pluck or shave any hair, and don\'t clip nails until Halq/Taqsir. Hair that falls naturally is fine.', severity: 'avoid' },
      { id: 'proh-conduct', title: 'No arguing, obscenity or hunting', detail: 'Avoid disputes, foul speech, marital relations, marriage contracts, and hunting or harming animals.', severity: 'avoid' },
    ],
    man: [
      { id: 'm-garments', title: 'Two unstitched white sheets', detail: 'Izar (wrapped around the waist, covering navel to below the knees) and Rida (over the shoulders). No stitched, body-shaped clothing, including underwear.', severity: 'must' },
      { id: 'm-head', title: 'Head uncovered', detail: 'No cap, turban or hood. An umbrella or shade is fine.', severity: 'must' },
      { id: 'm-feet', title: 'Footwear that exposes the feet', detail: 'Sandals or slippers that leave the ankles and the raised bone on top of the foot uncovered (the Hanafi position). No closed shoes or socks.', severity: 'must' },
      { id: 'm-talbiyah', title: 'Recite Talbiyah aloud', detail: 'Men raise their voices with the Talbiyah, without shouting or disturbing others.', severity: 'sunnah' },
      { id: 'm-scent', title: 'Perfume before Niyyah only', detail: 'You may apply perfume to the body (not the Ihram cloth) before making Niyyah. Its lingering scent afterwards is fine.', severity: 'tip' },
    ],
    woman: [
      { id: 'w-clothes', title: 'Regular modest clothing', detail: 'Any modest, loose, stitched clothing in any colour (white is not required). Hair, arms and legs covered as usual.', severity: 'must' },
      { id: 'w-niqab', title: 'No niqab, no gloves', detail: 'Do not wear a niqab (face veil tied over the face) or gloves while in Ihram. If you want to screen your face from non-mahram men, you may lower the edge of your scarf from above, as long as it isn\'t tied on.', severity: 'avoid' },
      { id: 'w-talbiyah', title: 'Recite Talbiyah softly', detail: 'Women say the Talbiyah quietly, loud enough for those next to them to hear.', severity: 'sunnah' },
      { id: 'w-menses', title: 'If your period arrives', detail: 'You can still enter Ihram and do everything except Tawaf (and salah). Wait in Ihram until you are pure, take Ghusl, then do Tawaf and Sa\'i. Speak to your group scholar if timing gets tight.', severity: 'tip' },
      { id: 'w-jewellery', title: 'Jewellery and makeup', detail: 'Plain jewellery is allowed. Avoid scented cosmetics and perfume entirely.', severity: 'tip' },
    ],
  },
  {
    id: 'tawaf', n: 2, title: 'Entering the Haram & Tawaf', arabic: 'الطواف', subtitle: '7 circuits around the Kaaba',
    shared: [
      { id: 't-enter', title: 'Enter with the right foot', detail: 'Say the entering-the-masjid dua. Keep Talbiyah going until Tawaf begins.', severity: 'sunnah' },
      { id: 't-wudu', title: 'Be in Wudu', detail: 'Tawaf requires Wudu. If it breaks mid-Tawaf, renew it and continue from where you stopped (or restart, per your school).', severity: 'must' },
      { id: 't-start', title: 'Start at the Hajar al-Aswad line', detail: 'Face the Black Stone, raise your right hand toward it and say "Bismillāhi Allāhu Akbar". Kiss or touch it only if you can do so without pushing. Keep the Kaaba on your left.', severity: 'must' },
      { id: 't-hijr', title: 'Walk outside Hijr Ismail', detail: 'The semicircular Hateem is part of the Kaaba. A round that cuts through it does not count.', severity: 'must' },
      { id: 't-yamani', title: 'Rukn al-Yamani', detail: 'Touch it with your right hand if you can reach easily. Don\'t kiss it and don\'t point at it from afar.', severity: 'sunnah' },
      { id: 't-rabbana', title: 'Between the Yemeni corner and the Black Stone', detail: 'Recite "Rabbanā ātinā fid-dunyā ḥasanah..." on this stretch of every round.', severity: 'sunnah' },
      { id: 't-maqam', title: '2 rak\'ahs behind Maqam Ibrahim', detail: 'After the 7th round, pray two rak\'ahs behind the Maqam if space allows, otherwise anywhere in the masjid. Recite al-Kafirun, then al-Ikhlas.', severity: 'sunnah' },
      { id: 't-zamzam', title: 'Drink Zamzam', detail: 'Drink your fill, facing the Qibla if possible, and make dua. Then head to Safa.', severity: 'sunnah' },
    ],
    man: [
      { id: 'm-idtiba', title: 'Idtiba for all 7 rounds', detail: 'Pass the Rida under your right arm and over the left shoulder so the right shoulder is bare. Do it for all seven rounds of this Tawaf only, then cover both shoulders before the 2 rak\'ahs.', severity: 'sunnah' },
      { id: 'm-raml', title: 'Raml in rounds 1–3', detail: 'Walk briskly with short steps and moving shoulders in the first three rounds, as long as the crowd allows. Walk normally in rounds 4–7.', severity: 'sunnah' },
    ],
    woman: [
      { id: 'w-pace', title: 'Normal pace all 7 rounds', detail: 'No Raml and no Idtiba. Walk at a calm, normal pace throughout.', severity: 'must' },
      { id: 'w-cover', title: 'Shoulders fully covered', detail: 'Keep your clothing loose and fully covering. Pin your scarf so it stays put in the crowd.', severity: 'must' },
      { id: 'w-crowd', title: 'Keep away from the crush at the Black Stone', detail: 'Point from afar with your right hand and say "Allāhu Akbar". The outer rings or the upper floors are easier for women and the elderly.', severity: 'tip' },
    ],
  },
  {
    id: 'sai', n: 3, title: 'Sa\'i between Safa & Marwah', arabic: 'السعي', subtitle: '7 laps, Safa to Marwah',
    shared: [
      { id: 's-start', title: 'Begin at Safa', detail: 'Approaching Safa, recite "Inna aṣ-ṣafā wal-marwata min shaʿā\'irillāh... Abda\'u bimā bada\'allāhu bih" (first time only). Climb, face the Kaaba, raise your hands in dua (not like the takbir of salah).', severity: 'must' },
      { id: 's-laps', title: 'Counting laps', detail: 'Safa → Marwah is lap 1. Marwah → Safa is lap 2. You finish at Marwah at the end of lap 7.', severity: 'must' },
      { id: 's-dhikr', title: 'Dhikr on the hills', detail: 'On Safa and Marwah: say Allāhu Akbar three times and the tahlil, three times over, making your own dua in between.', severity: 'sunnah' },
      { id: 's-wudu', title: 'Wudu recommended', detail: 'Wudu is not required for Sa\'i, but it is better to have it. Women in menses may do Sa\'i if Tawaf was already completed.', severity: 'tip' },
    ],
    man: [
      { id: 'm-green', title: 'Jog between the green lights', detail: 'Move at a light jog between the two green-lit markers on every lap, both directions. Walk normally the rest of the way.', severity: 'sunnah' },
      { id: 'm-shoulder', title: 'Shoulders covered', detail: 'Idtiba ends with Tawaf. Keep both shoulders covered during Sa\'i.', severity: 'tip' },
    ],
    woman: [
      { id: 'w-green', title: 'Steady walk through the green zone', detail: 'Women do not jog between the green lights. Keep your normal walking pace for all 7 laps.', severity: 'must' },
      { id: 'w-floor', title: 'Choose a calmer floor', detail: 'The upper floors and the roof of the Mas\'a are usually less crowded.', severity: 'tip' },
    ],
  },
  {
    id: 'halq', n: 4, title: 'Halq or Taqsir', arabic: 'الحلق أو التقصير', subtitle: 'Exiting Ihram',
    shared: [
      { id: 'h-final', title: 'The final act', detail: 'Cutting the hair completes Umrah. Ihram restrictions are lifted once it\'s done.', severity: 'must' },
      { id: 'h-dua', title: 'Shukr', detail: 'Thank Allah, make dua for acceptance: "Rabbanā taqabbal minnā innaka antas-samīʿul-ʿalīm."', severity: 'tip' },
    ],
    man: [
      { id: 'm-halq', title: 'Halq: full head shave (preferred)', detail: 'The Prophet ﷺ made dua three times for those who shave and once for those who trim. Use a barber with a fresh blade.', severity: 'sunnah' },
      { id: 'm-taqsir', title: 'Taqsir: even trim', detail: 'If trimming, cut evenly from all over the head (Hanafis require at least a quarter; all over is better). Snipping a few strands is not enough.', severity: 'must' },
      { id: 'm-barbers', title: 'Where to find barbers', detail: 'Barbers line the streets outside the Marwah end of the Mas\'a (toward the Clock Tower and Souq al-Layl side) and across Aziziyah. Expect roughly 20–40 SAR.', severity: 'tip' },
    ],
    woman: [
      { id: 'w-trim', title: 'Trim a fingertip\'s length', detail: 'Gather your hair and cut about 1–2 cm (a fingertip\'s length) from the ends. Never shave.', severity: 'must' },
      { id: 'w-privacy', title: 'Do it in private', detail: 'Trim in the hotel room or a private corner with a mahram or another woman. Bring small scissors.', severity: 'tip' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Tawaf rounds: there is no fixed dua per round in the Sunnah.       */
/*  These are suggested focus themes with authentic duas.              */
/* ------------------------------------------------------------------ */

export interface RoundPrompt {
  round: number
  theme: string
  arabic: string
  translit: string
  english: string
}

export const TAWAF_ROUNDS: RoundPrompt[] = [
  { round: 1, theme: 'Forgiveness', arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ', translit: 'Rabbighfir lī wa tub ʿalayya innaka antat-tawwābur-raḥīm', english: 'My Lord, forgive me and accept my repentance. You are the Accepter of repentance, the Merciful.' },
  { round: 2, theme: 'Parents', arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', translit: 'Rabbir-ḥamhumā kamā rabbayānī ṣaghīrā', english: 'My Lord, have mercy on them as they raised me when I was small. (17:24)' },
  { round: 3, theme: 'Spouse & family', arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا', translit: 'Rabbanā hab lanā min azwājinā wa dhurriyyātinā qurrata aʿyunin wajʿalnā lil-muttaqīna imāmā', english: 'Our Lord, grant us joy in our spouses and children, and make us leaders of the righteous. (25:74)' },
  { round: 4, theme: 'Steadfast faith', arabic: 'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي عَلَى دِينِكَ', translit: 'Yā muqallibal-qulūb, thabbit qalbī ʿalā dīnik', english: 'O Turner of hearts, keep my heart firm on Your religion.' },
  { round: 5, theme: 'Wellbeing', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ', translit: 'Allāhumma innī as\'alukal-ʿafwa wal-ʿāfiyata fid-dunyā wal-ākhirah', english: 'O Allah, I ask You for pardon and wellbeing in this world and the next.' },
  { round: 6, theme: 'Those who asked for dua', arabic: 'رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ', translit: 'Rabbanagh-fir lanā wa li-ikhwāninal-ladhīna sabaqūnā bil-īmān', english: 'Our Lord, forgive us and our brothers who preceded us in faith. (59:10)' },
  { round: 7, theme: 'Acceptance', arabic: 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ', translit: 'Rabbanā taqabbal minnā innaka antas-samīʿul-ʿalīm', english: 'Our Lord, accept this from us. You are the All-Hearing, the All-Knowing. (2:127)' },
]

export const RABBANA_ATINA = {
  arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
  translit: 'Rabbanā ātinā fid-dunyā ḥasanah, wa fil-ākhirati ḥasanah, wa qinā ʿadhāban-nār',
  english: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire. (2:201)',
}

/* ------------------------------------------------------------------ */
/*  Duas & phrases                                                     */
/* ------------------------------------------------------------------ */

export type DuaCategory =
  | 'Ihram & Talbiyah'
  | 'Masjid'
  | 'Kaaba & Tawaf'
  | 'Zamzam'
  | 'Safa & Marwah'
  | 'Madinah'
  | 'Travel'
  | 'Saudi phrases'

export interface Dua {
  id: string
  category: DuaCategory
  title: string
  arabic: string
  translit: string
  english: string
  note?: string
}

export const DUA_CATEGORIES: DuaCategory[] = [
  'Ihram & Talbiyah', 'Masjid', 'Kaaba & Tawaf', 'Zamzam', 'Safa & Marwah', 'Madinah', 'Travel', 'Saudi phrases',
]

export const TALBIYAH = {
  arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
  translit: 'Labbayk Allāhumma labbayk, labbayka lā sharīka laka labbayk, innal-ḥamda wan-niʿmata laka wal-mulk, lā sharīka lak',
  english: 'Here I am, O Allah, here I am. Here I am, You have no partner, here I am. All praise, all blessings and all sovereignty belong to You. You have no partner.',
  cadence: ['Labbayk Allāhumma labbayk', 'Labbayka lā sharīka laka labbayk', 'Innal-ḥamda wan-niʿmata laka wal-mulk', 'Lā sharīka lak'],
}

export const DUAS: Dua[] = [
  { id: 'talbiyah', category: 'Ihram & Talbiyah', title: 'Talbiyah', arabic: TALBIYAH.arabic, translit: TALBIYAH.translit, english: TALBIYAH.english, note: 'From Niyyah until you start Tawaf. Men aloud, women softly.' },
  { id: 'niyyah', category: 'Ihram & Talbiyah', title: 'Niyyah for Umrah', arabic: 'لَبَّيْكَ اللَّهُمَّ عُمْرَةً', translit: 'Labbayk Allāhumma ʿUmrah', english: 'Here I am, O Allah, for Umrah.', note: 'Said once at the Miqat with intention in the heart.' },
  { id: 'ishtirat', category: 'Ihram & Talbiyah', title: 'Condition (Ishtirat)', arabic: 'اللَّهُمَّ مَحِلِّي حَيْثُ حَبَسْتَنِي', translit: 'Allāhumma maḥillī ḥaythu ḥabastanī', english: 'O Allah, my place of exiting Ihram is wherever You hold me back.', note: 'Optional, for anyone worried about illness or delays.' },
  { id: 'enter-masjid', category: 'Masjid', title: 'Entering the masjid', arabic: 'بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ', translit: 'Bismillāh, waṣ-ṣalātu was-salāmu ʿalā Rasūlillāh. Allāhummaf-taḥ lī abwāba raḥmatik', english: 'In the name of Allah, and peace and blessings on the Messenger of Allah. O Allah, open for me the doors of Your mercy.', note: 'Step in with the right foot.' },
  { id: 'leave-masjid', category: 'Masjid', title: 'Leaving the masjid', arabic: 'بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ', translit: 'Bismillāh, waṣ-ṣalātu was-salāmu ʿalā Rasūlillāh. Allāhumma innī as\'aluka min faḍlik', english: 'In the name of Allah, and peace and blessings on the Messenger of Allah. O Allah, I ask You of Your bounty.', note: 'Step out with the left foot.' },
  { id: 'first-sight', category: 'Kaaba & Tawaf', title: 'First sight of the Kaaba', arabic: 'اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ فَحَيِّنَا رَبَّنَا بِالسَّلَامِ', translit: 'Allāhumma antas-salām wa minkas-salām, fa ḥayyinā Rabbanā bis-salām', english: 'O Allah, You are Peace and from You is peace, so greet us, our Lord, with peace.', note: 'Reported from Umar (RA). No fixed dua is confirmed from the Prophet ﷺ here, so ask for whatever you wish in your own words.' },
  { id: 'hajar', category: 'Kaaba & Tawaf', title: 'At the Black Stone (each round)', arabic: 'بِسْمِ اللَّهِ، وَاللَّهُ أَكْبَرُ', translit: 'Bismillāhi wallāhu akbar', english: 'In the name of Allah, Allah is the Greatest.', note: 'Face the Stone, raise the right hand toward it.' },
  { id: 'rabbana', category: 'Kaaba & Tawaf', title: 'Rukn al-Yamani → Black Stone', arabic: RABBANA_ATINA.arabic, translit: RABBANA_ATINA.translit, english: RABBANA_ATINA.english },
  { id: 'maqam', category: 'Kaaba & Tawaf', title: 'Approaching Maqam Ibrahim', arabic: 'وَاتَّخِذُوا مِنْ مَقَامِ إِبْرَاهِيمَ مُصَلًّى', translit: 'Wattakhidhū min maqāmi Ibrāhīma muṣallā', english: 'And take the station of Ibrahim as a place of prayer. (2:125)', note: 'Then pray 2 rak\'ahs: al-Kafirun, then al-Ikhlas.' },
  { id: 'zamzam', category: 'Zamzam', title: 'Drinking Zamzam', arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا وَاسِعًا، وَشِفَاءً مِنْ كُلِّ دَاءٍ', translit: 'Allāhumma innī as\'aluka ʿilman nāfiʿan, wa rizqan wāsiʿan, wa shifā\'an min kulli dā\'', english: 'O Allah, I ask You for beneficial knowledge, abundant provision, and a cure for every illness.', note: '"Zamzam is for whatever it is drunk for." Reported from Ibn Abbas (RA).' },
  { id: 'safa-approach', category: 'Safa & Marwah', title: 'Approaching Safa (first lap only)', arabic: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ، أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ', translit: 'Innaṣ-ṣafā wal-marwata min shaʿā\'irillāh. Abda\'u bimā bada\'allāhu bih', english: 'Safa and Marwah are among the symbols of Allah. I begin with what Allah began with. (2:158)' },
  { id: 'safa-dhikr', category: 'Safa & Marwah', title: 'On Safa and Marwah', arabic: 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الْأَحْزَابَ وَحْدَهُ', translit: 'Allāhu akbar (×3). Lā ilāha illallāhu waḥdahu lā sharīka lah, lahul-mulku wa lahul-ḥamdu wa huwa ʿalā kulli shay\'in qadīr. Lā ilāha illallāhu waḥdah, anjaza waʿdah, wa naṣara ʿabdah, wa hazamal-aḥzāba waḥdah', english: 'Allah is the Greatest. There is no god but Allah alone, without partner. His is the dominion and the praise, and He has power over all things. There is no god but Allah alone. He fulfilled His promise, aided His servant, and defeated the confederates alone.', note: 'Face the Kaaba. Repeat three times with personal dua in between.' },
  { id: 'green', category: 'Safa & Marwah', title: 'Between the green lights', arabic: 'رَبِّ اغْفِرْ وَارْحَمْ، إِنَّكَ أَنْتَ الْأَعَزُّ الْأَكْرَمُ', translit: 'Rabbighfir warḥam, innaka antal-aʿazzul-akram', english: 'My Lord, forgive and have mercy. You are the Most Mighty, the Most Generous.', note: 'Reported from Ibn Masʿud and Ibn Umar (RA).' },
  { id: 'salam-prophet', category: 'Madinah', title: 'Salam to the Prophet ﷺ', arabic: 'السَّلَامُ عَلَيْكَ يَا رَسُولَ اللَّهِ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ', translit: 'As-salāmu ʿalayka yā Rasūlallāhi wa raḥmatullāhi wa barakātuh', english: 'Peace be upon you, O Messenger of Allah, and the mercy of Allah and His blessings.', note: 'Said calmly, voice lowered, facing the grave. Then move one step right for Abu Bakr and another for Umar.' },
  { id: 'salam-abubakr', category: 'Madinah', title: 'Salam to Abu Bakr & Umar', arabic: 'السَّلَامُ عَلَيْكَ يَا أَبَا بَكْرٍ، السَّلَامُ عَلَيْكَ يَا عُمَرُ', translit: 'As-salāmu ʿalayka yā Abā Bakr. As-salāmu ʿalayka yā ʿUmar', english: 'Peace be upon you, O Abu Bakr. Peace be upon you, O Umar.' },
  { id: 'salawat', category: 'Madinah', title: 'Salat Ibrahimiyyah (Rawdah)', arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ', translit: 'Allāhumma ṣalli ʿalā Muḥammadin wa ʿalā āli Muḥammad, kamā ṣallayta ʿalā Ibrāhīma wa ʿalā āli Ibrāhīm, innaka ḥamīdum-majīd', english: 'O Allah, send blessings on Muhammad and the family of Muhammad, as You sent blessings on Ibrahim and the family of Ibrahim. You are Praiseworthy, Glorious.', note: 'In the Rawdah, pray 2 rak\'ahs and make dua. Your Nusuk slot is short, so keep it focused.' },
  { id: 'graves', category: 'Madinah', title: 'Visiting graves (Baqi, Uhud)', arabic: 'السَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَالْمُسْلِمِينَ، وَإِنَّا إِنْ شَاءَ اللَّهُ بِكُمْ لَلَاحِقُونَ، نَسْأَلُ اللَّهَ لَنَا وَلَكُمُ الْعَافِيَةَ', translit: 'As-salāmu ʿalaykum ahlad-diyāri minal-mu\'minīna wal-muslimīn, wa innā in shā\'allāhu bikum la-lāḥiqūn, nas\'alullāha lanā wa lakumul-ʿāfiyah', english: 'Peace be upon you, O believing and Muslim inhabitants of these dwellings. We will, if Allah wills, join you. We ask Allah for wellbeing for us and for you.', note: 'Reported in Sahih Muslim.' },
  { id: 'travel', category: 'Travel', title: 'Dua for travel', arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ', translit: 'Subḥānal-ladhī sakhkhara lanā hādhā wa mā kunnā lahu muqrinīn, wa innā ilā Rabbinā lamunqalibūn', english: 'Glory be to Him who has subjected this to us, and we could not have done it ourselves. And to our Lord we will surely return. (43:13–14)', note: 'Say after takeoff and when the car sets off.' },
  { id: 'arrive', category: 'Travel', title: 'Arriving somewhere new', arabic: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', translit: 'Aʿūdhu bi-kalimātillāhit-tāmmāti min sharri mā khalaq', english: 'I seek refuge in the perfect words of Allah from the evil of what He has created.', note: 'Reported in Sahih Muslim. Say it on reaching the hotel.' },
  // Saudi colloquial phrases
  { id: 'p-salam', category: 'Saudi phrases', title: 'Greeting', arabic: 'السلام عليكم', translit: 'As-salāmu ʿalaykum', english: 'Peace be upon you (hello)' },
  { id: 'p-haram', category: 'Saudi phrases', title: 'To the taxi driver', arabic: 'ودّني الحرم، لو سمحت', translit: 'Waddinī al-Ḥaram, law samaḥt', english: 'Take me to the Haram, please' },
  { id: 'p-hotel', category: 'Saudi phrases', title: 'Back to the hotel', arabic: 'ودّني الفندق', translit: 'Waddinī al-funduq', english: 'Take me to the hotel' },
  { id: 'p-howmuch', category: 'Saudi phrases', title: 'Price', arabic: 'بكم هذا؟', translit: 'Bikam hādha?', english: 'How much is this?' },
  { id: 'p-fare', category: 'Saudi phrases', title: 'Agree the fare first', arabic: 'كم الأجرة للحرم؟', translit: 'Kam al-ujra lil-Ḥaram?', english: 'How much is the fare to the Haram?' },
  { id: 'p-expensive', category: 'Saudi phrases', title: 'Bargaining', arabic: 'غالي، فيه خصم؟', translit: 'Ghālī, fīh khaṣm?', english: 'That\'s expensive. Any discount?' },
  { id: 'p-stop', category: 'Saudi phrases', title: 'Stop here', arabic: 'وقّف هنا', translit: 'Waggif hina', english: 'Stop here' },
  { id: 'p-directions', category: 'Saudi phrases', title: 'Directions', arabic: 'سيدا، يمين، يسار', translit: 'Sīda, yamīn, yasār', english: 'Straight, right, left' },
  { id: 'p-where', category: 'Saudi phrases', title: 'Where is gate…?', arabic: 'وين باب الملك فهد؟', translit: 'Wēn Bāb al-Malik Fahd?', english: 'Where is King Fahd Gate?' },
  { id: 'p-toilet', category: 'Saudi phrases', title: 'Washroom / Wudu area', arabic: 'وين دورات المياه؟', translit: 'Wēn dawrāt al-miyāh?', english: 'Where are the washrooms?' },
  { id: 'p-water', category: 'Saudi phrases', title: 'Water', arabic: 'مويه، لو سمحت', translit: 'Moya, law samaḥt', english: 'Water, please' },
  { id: 'p-wait', category: 'Saudi phrases', title: 'Wait', arabic: 'لحظة / انتظر شوي', translit: 'Laḥẓa / Intaẓir shway', english: 'One moment / wait a bit' },
  { id: 'p-understand', category: 'Saudi phrases', title: 'I don\'t understand', arabic: 'ما أفهم، تتكلم إنجليزي؟', translit: 'Mā afham, titkallam Ingilīzī?', english: 'I don\'t understand. Do you speak English?' },
  { id: 'p-lost', category: 'Saudi phrases', title: 'I\'m lost', arabic: 'أنا ضايع، ساعدني', translit: 'Ana ḍāyiʿ, sāʿidnī', english: 'I\'m lost, please help me' },
  { id: 'p-thanks', category: 'Saudi phrases', title: 'Thank you', arabic: 'جزاك الله خير', translit: 'Jazāk Allāhu khayr', english: 'May Allah reward you (thank you)' },
  { id: 'p-yesno', category: 'Saudi phrases', title: 'Yes / No', arabic: 'إيوه / لا', translit: 'Aywa / Lā', english: 'Yes / No' },
]

/* ------------------------------------------------------------------ */
/*  Ziyarat landmarks                                                  */
/* ------------------------------------------------------------------ */

const wm = (path: string, file: string) =>
  `https://upload.wikimedia.org/wikipedia/commons/thumb/${path}/${file}/960px-${file}`

export interface Landmark extends LatLng {
  id: string
  city: CityKey
  order: number
  name: string
  arabic: string
  kind: 'base' | 'mosque' | 'mountain' | 'plain' | 'cemetery' | 'heritage'
  summary: string
  history: string
  etiquette: string[]
  tips: string[]
  image?: string
  imageCredit?: string
  mapsQuery: string
  walking?: boolean
}

export const LANDMARKS: Landmark[] = [
  // --- Makkah ---
  {
    id: 'mk-hotel', city: 'makkah', order: 1, name: 'Holiday Inn Makkah Al Aziziah', arabic: 'هوليداي إن مكة العزيزية', kind: 'base',
    lat: PLACES.hotelMakkah.lat, lng: PLACES.hotelMakkah.lng,
    summary: 'Home base for 30 Nov – 7 Dec. About 4–5 km east of Masjid al-Haram in Aziziyah, on the Mina side of the city.',
    history: 'Aziziyah is a residential district between the Haram and Mina. It is quieter and cheaper than the central area, with lots of restaurants, pharmacies and barbers.',
    etiquette: ['Leave about an hour before each prayer you want inside the Haram.', 'Save the hotel name in Arabic on your phone for taxi drivers.'],
    tips: ['Ask reception for the Haram shuttle timetable and pickup point.', 'Makkah Bus routes run from Aziziyah toward the Haram (pay by card).', 'Careem/Uber: 15–30 min depending on traffic; road closures near the Haram at peak times.'],
    image: wm('b/b8', 'Edited_Great_Mosque_of_Mecca1_5-2019-ccsa4.0_%28cropped%29.jpg'), imageCredit: 'Wikimedia Commons, CC BY-SA 4.0',
    mapsQuery: PLACES.hotelMakkah.mapsQuery,
  },
  {
    id: 'mk-hira', city: 'makkah', order: 2, name: 'Jabal al-Nour & Cave of Hira', arabic: 'جبل النور وغار حراء', kind: 'mountain',
    lat: 21.4575, lng: 39.8592,
    summary: 'The mountain where the first revelation, "Iqra\'" (Surah al-Alaq), came to the Prophet ﷺ in the Cave of Hira.',
    history: 'Before prophethood, the Prophet ﷺ would retreat to Hira for days of reflection. Jibril came to him here around 610 CE. The summit is about 640 m high, with the cave just below it.',
    etiquette: ['Climbing is not a ritual and carries no special reward. Go for reflection.', 'Do not write on rocks or take stones as souvenirs.'],
    tips: ['Roughly 1,000+ steps; 1–2 hours up for most adults.', 'Climb right after Fajr, before the heat. December mornings are pleasant.', 'Proper shoes, water, and a torch. Skip the climb if you have knee or heart issues.'],
    image: wm('5/57', 'Jabbal_An-Nour_%282024%29.jpg'), imageCredit: 'Wikimedia Commons',
    mapsQuery: 'Jabal al-Nour Makkah',
  },
  {
    id: 'mk-thawr', city: 'makkah', order: 3, name: 'Jabal Thawr', arabic: 'جبل ثور', kind: 'mountain',
    lat: 21.3772, lng: 39.8497,
    summary: 'The cave where the Prophet ﷺ and Abu Bakr (RA) hid for three nights during the Hijrah to Madinah.',
    history: 'Quraysh trackers reached the mouth of the cave. The Quran recalls the Prophet ﷺ telling Abu Bakr, "Do not grieve, Allah is with us" (9:40).',
    etiquette: ['As at Hira, no special act of worship is prescribed here.'],
    tips: ['A harder climb than Hira (about 2 hours). Most Ziyarat groups view it from the base.', 'Photo stop and a moment to recall the Hijrah story.'],
    image: wm('1/1a', 'Jabele_thor_-_panoramio.jpg'), imageCredit: 'Wikimedia Commons / Panoramio',
    mapsQuery: 'Jabal Thawr Makkah',
  },
  {
    id: 'mk-hajj', city: 'makkah', order: 4, name: 'Mina, Muzdalifah & Arafat', arabic: 'منى ومزدلفة وعرفات', kind: 'plain',
    lat: 21.3549, lng: 39.9841,
    summary: 'The Hajj plains: the tent city of Mina, the open ground of Muzdalifah, and Jabal al-Rahmah on Arafat.',
    history: 'The Prophet ﷺ delivered the Farewell Sermon at Arafat in 10 AH. Standing at Arafat is the core pillar of Hajj. Masjid Namirah marks where he prayed.',
    etiquette: ['Arafat is outside the Haram boundary; Mina and Muzdalifah are inside it.', 'Make dua at Arafat for your family and for a future Hajj.', 'There is no Sunnah of climbing Jabal al-Rahmah or touching its pillar.'],
    tips: ['Usually a drive-through with stops at Jamarat, Muzdalifah and Jabal al-Rahmah.', 'Expect hawkers and camel rides at Jabal al-Rahmah. Agree prices first.'],
    image: wm('5/50', 'Pilgrims_cover_Arafat%27s_roads%2C_plains_and_mountain_-_Flickr_-_Al_Jazeera_English.jpg'), imageCredit: 'Al Jazeera English, CC BY-SA 2.0',
    mapsQuery: 'Jabal al-Rahmah Arafat',
  },
  {
    id: 'mk-mualla', city: 'makkah', order: 5, name: 'Jannat al-Mu\'alla', arabic: 'جنة المعلاة', kind: 'cemetery',
    lat: 21.4333, lng: 39.8292,
    summary: 'Makkah\'s historic cemetery, resting place of Khadijah (RA), the Prophet\'s first wife.',
    history: 'Also buried here are the Prophet\'s grandfather Abdul Muttalib, his uncle Abu Talib, and his son al-Qasim. It sits about 1.5 km north of the Haram.',
    etiquette: ['Give salam to the people of the graves and make dua for them.', 'Women generally view from the gate; entry is usually for men only.'],
    tips: ['Graves are unmarked in line with Sunnah practice, so a guide helps.'],
    image: wm('0/05', 'Jannat_ul_Mualla_Cemetery.jpg'), imageCredit: 'Wikimedia Commons',
    mapsQuery: 'Jannat al-Mualla Makkah',
  },
  {
    id: 'mk-jinn', city: 'makkah', order: 6, name: 'Masjid al-Jinn & Makkah Library', arabic: 'مسجد الجن ومكتبة مكة المكرمة', kind: 'heritage',
    lat: 21.4319, lng: 39.8294,
    summary: 'Masjid al-Jinn marks where a group of jinn listened to the Prophet ﷺ recite the Quran. The Makkah Library stands on the site widely held to be his birthplace.',
    history: 'Surah al-Jinn (72) describes the jinn who heard the Quran and believed. The library (Maktaba Makkah al-Mukarramah) is east of the Haram near the Marwah side, on the reputed site of the Prophet\'s birth in 570 CE.',
    etiquette: ['Pray 2 rak\'ahs of Tahiyyat al-Masjid at Masjid al-Jinn if it\'s open.', 'The library is usually closed to visitors; view it from outside.'],
    tips: ['Masjid al-Jinn is right next to Jannat al-Mu\'alla, so visit both together.', 'The library is a short walk from the Marwah exits; combine with a Haram trip.'],
    image: wm('c/c7', 'Mosque_of_the_Jinn_03.jpg'), imageCredit: 'Wikimedia Commons',
    mapsQuery: 'Masjid al-Jinn Makkah',
  },
  // --- Madinah ---
  {
    id: 'md-hotel', city: 'madinah', order: 1, name: 'Al Ansar Tulip Hotel', arabic: 'فندق الأنصار توليب', kind: 'base', walking: true,
    lat: PLACES.hotelMadinah.lat, lng: PLACES.hotelMadinah.lng,
    summary: 'Home base for 7 – 10/11 Dec in the Northern Central Area. About 150–250 m (2–3 minutes on foot) to the northern courtyard and King Fahd Gate.',
    history: 'The northern Markazia is packed with hotels, restaurants and shops, and opens straight onto the Nabawi\'s north plaza.',
    etiquette: ['Make Wudu at the hotel before heading out; Wudu areas get crowded before prayers.'],
    tips: ['Note which gate number you use and a meeting point under a specific umbrella.', 'Women\'s prayer sections are signposted from the north plaza.'],
    image: wm('0/0c', 'Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg'), imageCredit: 'Wikimedia Commons',
    mapsQuery: PLACES.hotelMadinah.mapsQuery,
  },
  {
    id: 'md-nabawi', city: 'madinah', order: 2, name: 'Al-Masjid an-Nabawi', arabic: 'المسجد النبوي', kind: 'mosque', walking: true,
    lat: PLACES.nabawi.lat, lng: PLACES.nabawi.lng,
    summary: 'The Prophet\'s Mosque. Home of the Rawdah (Riyad ul-Jannah), the Green Dome and the Prophet\'s grave ﷺ.',
    history: 'Built by the Prophet ﷺ in 1 AH next to his house. One prayer here is better than 1,000 elsewhere, except Masjid al-Haram. "Between my house and my minbar is a garden from the gardens of Paradise."',
    etiquette: ['Rawdah: book a slot in the Nusuk app; men and women have separate times.', 'For salam at the grave, men usually enter at Bab al-Salam (south-west) and exit at Bab al-Baqi.', 'Lower your voice; don\'t push, wipe the grilles or face the grave in prayer.'],
    tips: ['From Al Ansar Tulip, the north plaza gates (around King Fahd Gate, no. 21) are closest.', 'Zamzam coolers are throughout the mosque.', 'The umbrellas open around sunrise and close before Maghrib, which is worth watching once.'],
    image: wm('0/0c', 'Masjid_Nabawi_The_Prophet%27s_Mosque%2C_Madina.jpg'), imageCredit: 'Wikimedia Commons',
    mapsQuery: PLACES.nabawi.mapsQuery,
  },
  {
    id: 'md-quba', city: 'madinah', order: 3, name: 'Masjid Quba', arabic: 'مسجد قباء', kind: 'mosque',
    lat: 24.4393, lng: 39.6173,
    summary: 'The first mosque built in Islam. Praying two rak\'ahs here after making Wudu at home carries the reward of an Umrah.',
    history: 'The Prophet ﷺ laid its foundation on arriving at Madinah during the Hijrah. He used to visit it every Saturday, riding or walking. "Whoever purifies himself at home, then comes to Masjid Quba and prays in it, has the reward of an Umrah." (Ibn Majah)',
    etiquette: ['Make Wudu at Al Ansar Tulip before leaving.', 'Pray 2 rak\'ahs (Tahiyyat al-Masjid or nafl) inside.'],
    tips: ['About 3.5 km south of the Nabawi, 10–15 min by car.', 'There is a walking path (Quba Walkway) from the Nabawi if you want to go on foot another day.'],
    image: wm('a/af', 'Masjid_Quba_Mosque.jpg'), imageCredit: 'Wikimedia Commons',
    mapsQuery: 'Masjid Quba Madinah',
  },
  {
    id: 'md-uhud', city: 'madinah', order: 4, name: 'Mount Uhud & Martyrs\' Cemetery', arabic: 'جبل أحد ومقبرة الشهداء', kind: 'mountain',
    lat: 24.5025, lng: 39.6125,
    summary: 'Site of the Battle of Uhud (3 AH). Sayyid al-Shuhada Hamzah (RA) and 70 martyrs are buried here, facing Jabal al-Rumah, the Archers\' Hill.',
    history: 'The archers left Jabal al-Rumah against orders, letting Khalid ibn al-Walid (then not yet Muslim) attack from behind. The Prophet ﷺ was wounded. He said, "Uhud is a mountain that loves us and we love it."',
    etiquette: ['Give salam to the martyrs with the dua for visiting graves.', 'Women view the cemetery from the fence.'],
    tips: ['Climbing Jabal al-Rumah takes 5–10 minutes and gives the best view of the battlefield.', 'Date and souvenir stalls are next to the parking area.'],
    image: wm('e/e3', 'Jabal-e-Uhud.jpg'), imageCredit: 'Wikimedia Commons',
    mapsQuery: 'Uhud Martyrs Cemetery Madinah',
  },
  {
    id: 'md-qiblatayn', city: 'madinah', order: 5, name: 'Masjid al-Qiblatayn', arabic: 'مسجد القبلتين', kind: 'mosque',
    lat: 24.4840, lng: 39.5790,
    summary: 'The Mosque of the Two Qiblas, where the instruction came to turn from Jerusalem to the Kaaba mid-prayer.',
    history: 'In 2 AH, during Dhuhr (or Asr), revelation came (2:144) and the congregation turned around to face Makkah within the same prayer.',
    etiquette: ['Pray 2 rak\'ahs of Tahiyyat al-Masjid.'],
    tips: ['About 5 km north-west of the Nabawi.'],
    image: wm('b/bc', 'Masjid_al-Qiblatain.jpg'), imageCredit: 'Wikimedia Commons',
    mapsQuery: 'Masjid al-Qiblatayn Madinah',
  },
  {
    id: 'md-sabaa', city: 'madinah', order: 6, name: 'The Seven Mosques (Khandaq)', arabic: 'المساجد السبعة', kind: 'heritage',
    lat: 24.4777, lng: 39.5984,
    summary: 'Small mosques on the site of the Battle of the Trench (5 AH), with the larger Masjid al-Khandaq nearby.',
    history: 'The Muslims dug a trench on Salman al-Farisi\'s advice to defend Madinah against the confederate army. Masjid al-Fath marks where the Prophet ﷺ made dua for three days before victory came.',
    etiquette: ['There is no specific prayer to perform at each of the mosques.'],
    tips: ['Quick stop between Qiblatayn and the Nabawi.'],
    image: wm('e/ec', 'Sab%27u_Masajid.jpg'), imageCredit: 'Wikimedia Commons',
    mapsQuery: 'Seven Mosques Madinah',
  },
  {
    id: 'md-baqi', city: 'madinah', order: 7, name: 'Jannat al-Baqi', arabic: 'جنة البقيع', kind: 'cemetery', walking: true,
    lat: 24.4672, lng: 39.6160,
    summary: 'The main cemetery of Madinah, across the south-eastern courtyard of the Nabawi. Uthman (RA), many of the Prophet\'s wives and family, and thousands of Companions rest here.',
    history: 'The Prophet ﷺ would visit Baqi at night and pray for its people. His son Ibrahim and daughter Fatimah (RA, by many accounts) are buried here.',
    etiquette: ['Usually open for men after Fajr and after Asr. Check the gate times on the day.', 'Women do not enter; you can make dua from outside.', 'Say the dua for visiting graves. Don\'t wipe or take soil.'],
    tips: ['From Al Ansar Tulip, walk through the mosque or around the east side (~10 min).'],
    image: wm('e/eb', 'Al-Baqi_Cemetery_2021.jpg'), imageCredit: 'Wikimedia Commons',
    mapsQuery: 'Jannat al-Baqi Madinah',
  },
]

export const ZIYARAT_META: Record<CityKey, { title: string; date: string; base: Place; center: [number, number]; zoom: number }> = {
  makkah: { title: 'Makkah Ziyarat', date: 'Thu 3 Dec 2026', base: PLACES.hotelMakkah, center: [21.405, 39.87], zoom: 12 },
  madinah: { title: 'Madinah Ziyarat', date: 'Tue 8 Dec 2026', base: PLACES.hotelMadinah, center: [24.477, 39.605], zoom: 13 },
}

/* ------------------------------------------------------------------ */
/*  Food, logistics & local intel                                      */
/* ------------------------------------------------------------------ */

export type IntelCategory = 'Food' | 'Apps' | 'Transport' | 'Connectivity' | 'Money' | 'Health'

export interface IntelItem {
  id: string
  category: IntelCategory
  title: string
  where?: string
  body: string
  mapsQuery?: string
}

export const INTEL_CATEGORIES: IntelCategory[] = ['Food', 'Apps', 'Transport', 'Connectivity', 'Money', 'Health']

export const INTEL: IntelItem[] = [
  { id: 'albaik', category: 'Food', title: 'AlBaik', where: 'Aziziyah · Haram area · Madinah Central', body: 'The Saudi fried chicken institution. Broasted chicken, shrimp and the garlic sauce. Queues peak after Isha; branches near the Haram can sell out, Aziziyah is quicker.', mapsQuery: 'AlBaik Aziziyah Makkah' },
  { id: 'romansiah', category: 'Food', title: 'Al Romansiah', where: 'Makkah & Madinah', body: 'Saudi rice dishes: kabsa, mandi and madfoon with chicken or lamb. Good for a family meal; portions are large.', mapsQuery: 'Al Romansiah Makkah' },
  { id: 'tazaj', category: 'Food', title: 'Tazaj', where: 'Makkah & Madinah', body: 'Charcoal-grilled chicken with rice or bread. Lighter than fried options.', mapsQuery: 'Tazaj Makkah' },
  { id: 'mandi', category: 'Food', title: 'Yemeni Mandi', where: 'Aziziyah side streets', body: 'Slow-cooked lamb or chicken over spiced rice. Many small Yemeni restaurants in Aziziyah serve it fresh at lunch.', mapsQuery: 'Mandi restaurant Aziziyah Makkah' },
  { id: 'dates', category: 'Food', title: 'Ajwa & Safawi dates', where: 'Central Date Market, Madinah', body: 'Buy Madinah dates where they grow. Ajwa is the prized variety. Taste before you buy, and ask for vacuum packing for the flight home.', mapsQuery: 'Central Date Market Madinah' },
  { id: 'qahwa', category: 'Food', title: 'Qahwa & Kunafa after Fajr', where: 'Hotels and cafés around both Harams', body: 'Arabic coffee with cardamom, a few dates, and warm kunafa makes a good post-Fajr breakfast before you sleep.' },
  { id: 'nusuk', category: 'Apps', title: 'Nusuk', body: 'The official Hajj and Umrah app. Required for Rawdah bookings in Madinah. Check your Umrah permit there (your agent normally issues it). Rawdah slots are limited, so book as soon as the window opens.' },
  { id: 'tawakkalna', category: 'Apps', title: 'Tawakkalna & Absher', body: 'Government apps. Not normally needed for visitors but useful if officials ask for digital ID.' },
  { id: 'maps-offline', category: 'Apps', title: 'Offline maps', body: 'Download offline Google Maps areas for Makkah, Madinah and Jeddah before you fly. This app also caches itself for offline use after the first load.' },
  { id: 'careem', category: 'Transport', title: 'Careem / Uber', body: 'Reliable and metered. Expect 25–50 SAR Aziziyah ↔ Haram depending on time. Drop-offs stop short of the Haram at peak times, so plan a 10–15 min walk.' },
  { id: 'makkah-bus', category: 'Transport', title: 'Makkah Bus', body: 'The public bus network has routes linking Aziziyah with the Haram. Low fare, pay by card or the app. Also ask the hotel about its own shuttle.' },
  { id: 'haramain', category: 'Transport', title: 'Haramain High-Speed Rail', body: 'Makkah, Jeddah (incl. KAIA airport) and Madinah. A good backup for the 10 Dec night transfer if the car falls through. Book on the Haramain app.' },
  { id: 'sim', category: 'Connectivity', title: 'Saudi SIM: STC / Mobily / Zain', body: 'Counters in the arrivals hall at MED and JED. Bring your passport; registration is fingerprinted. Tourist data packs are cheap. An eSIM bought before travel saves time.' },
  { id: 'wifi', category: 'Connectivity', title: 'Haram Wi-Fi', body: 'Free Wi-Fi exists but is patchy at peak times. Keep a power bank charged; your phone will drain fast searching for signal.' },
  { id: 'riyal', category: 'Money', title: 'Cash and cards', body: 'Cards and Apple/Google Pay work almost everywhere. Keep 200–300 SAR in small notes for barbers, porters and small shops.' },
  { id: 'exchange', category: 'Money', title: 'Exchange', body: 'Exchange counters around both Harams give better rates than the airport. Check the rate board and count your cash at the counter.' },
  { id: 'heat', category: 'Health', title: 'December weather', body: 'Makkah roughly 22–31°C, Madinah cooler at 14–26°C with chilly nights. Carry a light shawl for Madinah and the air-conditioned Haram.' },
  { id: 'feet', category: 'Health', title: 'Look after your feet', body: 'Tawaf and Sa\'i together are about 7–8 km. Use unscented Vaseline against chafing, pop blister plasters on early, and rest between rituals.' },
  { id: 'cough', category: 'Health', title: 'The "Umrah cough"', body: 'Crowds and air conditioning spread colds fast. Pack throat lozenges, paracetamol, and a mask for crowded places.' },
]

/* ------------------------------------------------------------------ */
/*  Packing & health checklist                                         */
/* ------------------------------------------------------------------ */

export interface PackItem {
  id: string
  group: 'Documents' | 'Ihram & Clothing' | 'Health' | 'Gear'
  label: string
  note?: string
  role?: Role
}

export const PACKING: PackItem[] = [
  { id: 'passport', group: 'Documents', label: 'Passports + Umrah visa printouts' },
  { id: 'tickets', group: 'Documents', label: 'Flight e-tickets (LHE–MED–JED, JED–RUH–LHE)' },
  { id: 'vouchers', group: 'Documents', label: 'Hotel vouchers: Holiday Inn Aziziah & Al Ansar Tulip' },
  { id: 'vaccine', group: 'Documents', label: 'Vaccination certificates (meningitis ACYW)' },
  { id: 'photos', group: 'Documents', label: 'Passport photocopies + 2 photos' },
  { id: 'izar', group: 'Ihram & Clothing', label: 'Two Ihram sets (Izar + Rida)', role: 'man' },
  { id: 'belt', group: 'Ihram & Clothing', label: 'Ihram belt / pouch + safety pins', role: 'man' },
  { id: 'sandals', group: 'Ihram & Clothing', label: 'Ihram sandals (top of foot uncovered)', role: 'man' },
  { id: 'abaya', group: 'Ihram & Clothing', label: 'Loose abayas / modest outfits (3–4)', role: 'woman' },
  { id: 'hijab', group: 'Ihram & Clothing', label: 'Scarves + underscarves + pins', role: 'woman' },
  { id: 'scissors', group: 'Ihram & Clothing', label: 'Small scissors for Taqsir (check-in bag)', role: 'woman' },
  { id: 'shawl', group: 'Ihram & Clothing', label: 'Light shawl / jacket for Madinah nights' },
  { id: 'vaseline', group: 'Health', label: 'Unscented Vaseline / moisturiser', note: 'Prevents chafing in Tawaf and Sa\'i' },
  { id: 'soap', group: 'Health', label: 'Unscented soap, shampoo & wipes' },
  { id: 'blister', group: 'Health', label: 'Blister plasters' },
  { id: 'ors', group: 'Health', label: 'Electrolyte sachets (ORS)' },
  { id: 'meds', group: 'Health', label: 'Paracetamol, lozenges, personal meds' },
  { id: 'masks', group: 'Health', label: 'Face masks (crowds)' },
  { id: 'mat', group: 'Gear', label: 'Compact prayer mat' },
  { id: 'shoebag', group: 'Gear', label: 'Drawstring shoe bag', note: 'Carry shoes; racks fill up and get mixed' },
  { id: 'powerbank', group: 'Gear', label: 'Power bank + cable' },
  { id: 'adapter', group: 'Gear', label: 'UK-type (Type G) plug adapter' },
  { id: 'bottle', group: 'Gear', label: 'Small refillable bottle for Zamzam' },
  { id: 'counter', group: 'Gear', label: 'Tasbih / finger counter (backup for this app)' },
]

/* ------------------------------------------------------------------ */
/*  Kaaba diagram hotspots                                             */
/* ------------------------------------------------------------------ */

export interface KaabaHotspot {
  id: string
  name: string
  arabic: string
  body: string
  man?: string
  woman?: string
}

export const KAABA_HOTSPOTS: KaabaHotspot[] = [
  { id: 'hajar', name: 'Hajar al-Aswad', arabic: 'الحجر الأسود', body: 'The Black Stone, set in the eastern corner. Every round starts and ends on the line aligned with it. Face it, raise your right hand and say "Bismillāhi Allāhu Akbar".', man: 'Kiss or touch it only if possible without pushing anyone.', woman: 'Point from afar. The crush here is no place for women; touching it is not required.' },
  { id: 'yamani', name: 'Rukn al-Yamani', arabic: 'الركن اليماني', body: 'The Yemeni corner, the last corner before the Black Stone. Touch it with your right hand if you can reach easily. Don\'t kiss it and don\'t point at it.' },
  { id: 'hijr', name: 'Hijr Ismail (Hateem)', arabic: 'حجر إسماعيل', body: 'The low semicircular wall on the north-west side. It is part of the Kaaba, so Tawaf must go around the outside of it. Praying inside it counts as praying inside the Kaaba.' },
  { id: 'multazam', name: 'Multazam', arabic: 'الملتزم', body: 'The wall between the Black Stone and the Kaaba door. Companions would press their chests and arms against it in dua. Optional and very crowded.' },
  { id: 'maqam', name: 'Maqam Ibrahim', arabic: 'مقام إبراهيم', body: 'The stone Ibrahim (AS) stood on while building the Kaaba, in a gold-and-glass enclosure facing the door. Pray 2 rak\'ahs behind it after Tawaf if space allows.' },
  { id: 'door', name: 'Door of the Kaaba', arabic: 'باب الكعبة', body: 'On the north-east wall, raised about 2 m above the ground, near the Black Stone corner.' },
  { id: 'line', name: 'Start / end line', arabic: 'خط البداية', body: 'Look for the green light on the wall of the Mataf aligned with the Black Stone. It marks the start and end of each round.' },
]

export const PRAYER_NOTE = 'Calculated offline with the Umm al-Qura method (Fajr 18.5°, Isha 90 min after Maghrib). Always follow the Haram adhan.'
