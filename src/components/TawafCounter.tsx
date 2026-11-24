import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, RotateCcw, Sun, Zap } from 'lucide-react'
import { RABBANA_ATINA, TAWAF_ROUNDS, type Role } from '../data/umrahData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { KaabaDiagram } from './KaabaDiagram'

type WakeLockSentinelLike = { release: () => Promise<void> }

function useWakeLock() {
  const [on, setOn] = useState(false)
  const ref = useRef<WakeLockSentinelLike | null>(null)
  const supported = typeof navigator !== 'undefined' && 'wakeLock' in navigator
  const toggle = async () => {
    if (!supported) return
    try {
      if (ref.current) {
        await ref.current.release()
        ref.current = null
        setOn(false)
      } else {
        ref.current = await (navigator as unknown as { wakeLock: { request: (t: 'screen') => Promise<WakeLockSentinelLike> } }).wakeLock.request('screen')
        setOn(true)
      }
    } catch {
      setOn(false)
    }
  }
  useEffect(() => () => void ref.current?.release(), [])
  return { on, toggle, supported }
}

export const buzz = (ms: number | number[] = 30) => {
  try {
    navigator.vibrate?.(ms)
  } catch {
    /* not supported */
  }
}

export function TawafCounter({ role }: { role: Role }) {
  const [count, setCount] = useLocalStorage<number>('tawaf-count', 0)
  const [pulse, setPulse] = useState(0)
  const wake = useWakeLock()
  const done = count >= 7
  const current = Math.min(count + 1, 7)
  const prompt = TAWAF_ROUNDS[current - 1]

  const tap = () => {
    if (done) return
    const next = count + 1
    setCount(next)
    setPulse((p) => p + 1)
    buzz(next === 7 ? [60, 80, 60, 80, 120] : 35)
  }

  return (
    <section id="tawaf-counter" className="glass-gold p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="label text-gold/80">Live tracker</div>
          <h3 className="mt-1 text-xl font-semibold text-white">Tawaf counter · 7 rounds</h3>
        </div>
        <div className="flex gap-2">
          {wake.supported && (
            <button onClick={wake.toggle} className={wake.on ? 'btn-tele' : 'btn-ghost'} title="Keep the screen awake during Tawaf">
              <Sun size={15} /> {wake.on ? 'Screen on' : 'Keep awake'}
            </button>
          )}
          <button onClick={() => setCount(Math.max(0, count - 1))} className="btn-ghost !px-2.5" aria-label="Undo one round" disabled={count === 0}>
            <Minus size={16} />
          </button>
          <button onClick={() => setCount(0)} className="btn-ghost !px-2.5" aria-label="Reset counter" disabled={count === 0}>
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
        <div className="flex flex-col items-center gap-4">
          {/* Big thumb target */}
          <motion.button
            onClick={tap}
            whileTap={{ scale: 0.94 }}
            disabled={done}
            aria-label={done ? 'Tawaf complete' : `Tap when you complete round ${current}`}
            className="relative grid aspect-square w-full max-w-[300px] place-items-center rounded-full"
          >
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90">
              <circle cx="100" cy="100" r="90" fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              {Array.from({ length: 7 }).map((_, i) => {
                const seg = (2 * Math.PI * 90) / 7
                return (
                  <motion.circle
                    key={i}
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke={i < count ? (role === 'man' && i < 3 ? '#38BDF8' : '#D4AF37') : 'rgba(255,255,255,0.08)'}
                    strokeWidth="10"
                    strokeDasharray={`${seg - 6} ${2 * Math.PI * 90 - seg + 6}`}
                    strokeDashoffset={-seg * i}
                    initial={false}
                    animate={{ opacity: i < count ? 1 : 0.6 }}
                    style={i < count ? { filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.8))' } : undefined}
                  />
                )
              })}
            </svg>
            <AnimatePresence>
              <motion.span
                key={pulse}
                initial={{ scale: 0.7, opacity: 0.6 }}
                animate={{ scale: 1.25, opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="pointer-events-none absolute inset-6 rounded-full border-2 border-gold"
              />
            </AnimatePresence>
            <div className="relative text-center">
              {done ? (
                <>
                  <div className="arabic text-3xl text-gold-soft">الحمد لله</div>
                  <div className="mt-1 font-mono text-xs tracking-[0.2em] text-gold/80">7 / 7 COMPLETE</div>
                </>
              ) : (
                <>
                  <div className="font-mono text-[10px] tracking-[0.3em] text-mist">ROUND</div>
                  <motion.div key={current} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="font-mono text-7xl font-light tabular-nums text-white">
                    {current}
                  </motion.div>
                  <div className="font-mono text-[10px] tracking-[0.2em] text-gold/80">TAP AT THE GREEN LINE</div>
                </>
              )}
            </div>
          </motion.button>
          <div className="flex items-center gap-2 text-xs text-mist">
            <span className="font-mono tabular-nums text-white">{count}</span> rounds logged · saved on this device
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                <div className="rounded-xl border border-go/40 bg-go/[0.07] p-4">
                  <div className="label text-go">Next · 2 rak'ahs</div>
                  <p className="mt-1 text-slate-200">
                    {role === 'man' ? 'Cover your right shoulder (end Idtiba). ' : ''}Pray two rak'ahs behind Maqam Ibrahim if there is room, otherwise anywhere in the Haram. Recite al-Kafirun in the first and al-Ikhlas in the second.
                  </p>
                  <p className="arabic mt-2 text-xl text-gold-soft">وَاتَّخِذُوا مِنْ مَقَامِ إِبْرَاهِيمَ مُصَلًّى</p>
                </div>
                <div className="rounded-xl border border-tele/40 bg-tele/[0.07] p-4">
                  <div className="label text-tele">Then · Zamzam</div>
                  <p className="mt-1 text-slate-200">Drink Zamzam, make dua, then head to Safa to begin Sa'i.</p>
                  <p className="arabic mt-2 text-lg text-tele/90">اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا وَاسِعًا، وَشِفَاءً مِنْ كُلِّ دَاءٍ</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key={current} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
                <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                  <div className="flex items-center justify-between">
                    <div className="label text-gold/80">Round {current} · suggested focus: {prompt.theme}</div>
                    {role === 'man' && current <= 3 && (
                      <span className="flex items-center gap-1 rounded-md bg-tele/15 px-2 py-0.5 font-mono text-[10px] tracking-widest text-tele">
                        <Zap size={11} /> RAML
                      </span>
                    )}
                  </div>
                  <p className="arabic mt-2 text-2xl leading-[2] text-gold-soft">{prompt.arabic}</p>
                  <p className="mt-1 text-sm italic text-slate-300">{prompt.translit}</p>
                  <p className="mt-1 text-sm text-slate-400">{prompt.english}</p>
                </div>
                <div className="rounded-xl border border-tele/30 bg-tele/[0.05] p-4">
                  <div className="label text-tele">Every round · Rukn al-Yamani → Black Stone</div>
                  <p className="arabic mt-2 text-xl leading-[2] text-tele/90">{RABBANA_ATINA.arabic}</p>
                  <p className="mt-1 text-sm italic text-slate-300">{RABBANA_ATINA.translit}</p>
                </div>
                <p className="text-xs text-mist">
                  No fixed dua per round is reported in the Sunnah. These themes are only suggestions; pray in any language, recite Quran, or do dhikr.
                  {role === 'man' ? ' Men: Idtiba all 7 rounds, Raml in rounds 1–3.' : ' Women: normal pace for all 7 rounds.'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-6 border-t border-white/[0.06] pt-5">
        <div className="label mb-3">Mataf map · tap a point</div>
        <KaabaDiagram role={role} rounds={count} />
      </div>
    </section>
  )
}
