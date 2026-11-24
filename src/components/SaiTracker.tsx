import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Minus, RotateCcw } from 'lucide-react'
import { DUAS, type Role } from '../data/umrahData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { buzz } from './TawafCounter'

const GREEN_FROM = 0.27
const GREEN_TO = 0.4

export function SaiTracker({ role }: { role: Role }) {
  const [laps, setLaps] = useLocalStorage<number>('sai-laps', 0)
  const done = laps >= 7
  const current = Math.min(laps + 1, 7)
  const towardMarwah = current % 2 === 1
  // walker position: 0 = Safa, 1 = Marwah
  const pos = laps === 0 ? 0 : laps % 2 === 1 ? 1 : 0
  const dhikr = DUAS.find((d) => d.id === 'safa-dhikr')!
  const green = DUAS.find((d) => d.id === 'green')!

  const tap = () => {
    if (done) return
    setLaps(laps + 1)
    buzz(laps + 1 === 7 ? [60, 80, 120] : 35)
  }

  return (
    <section id="sai-tracker" className="glass p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="label text-tele/80">Live tracker</div>
          <h3 className="mt-1 text-xl font-semibold text-white">Sa'i · 7 laps</h3>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setLaps(Math.max(0, laps - 1))} className="btn-ghost !px-2.5" aria-label="Undo one lap" disabled={laps === 0}>
            <Minus size={16} />
          </button>
          <button onClick={() => setLaps(0)} className="btn-ghost !px-2.5" aria-label="Reset laps" disabled={laps === 0}>
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Track */}
      <div className="mt-6 px-1">
        <div className="relative h-24">
          <div className="absolute inset-x-10 top-1/2 h-3 -translate-y-1/2 rounded-full bg-white/[0.05]" />
          <div
            className="absolute top-1/2 h-8 -translate-y-1/2 rounded-md border border-go/60 bg-go/15"
            style={{ left: `calc(2.5rem + (100% - 5rem) * ${GREEN_FROM})`, width: `calc((100% - 5rem) * ${GREEN_TO - GREEN_FROM})`, boxShadow: '0 0 24px -4px #34d399' }}
          >
            <span className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] tracking-widest text-go">GREEN LIGHTS</span>
          </div>
          <div className="absolute left-0 top-1/2 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-xl border border-gold/40 bg-gold/10 text-center">
            <div>
              <div className="text-xs font-semibold text-gold-soft">Safa</div>
              <div className="arabic text-xs leading-none text-gold/70">الصفا</div>
            </div>
          </div>
          <div className="absolute right-0 top-1/2 grid h-14 w-14 -translate-y-1/2 place-items-center rounded-xl border border-tele/40 bg-tele/10 text-center">
            <div>
              <div className="text-xs font-semibold text-tele">Marwah</div>
              <div className="arabic text-xs leading-none text-tele/70">المروة</div>
            </div>
          </div>
          <motion.div
            className="absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_16px_#fff]"
            initial={false}
            animate={{ left: `calc(2.5rem + (100% - 5rem) * ${pos} - 10px)` }}
            transition={{ type: 'spring', stiffness: 50, damping: 14 }}
          />
        </div>
        <div className="mt-1 flex justify-center gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className={`flex h-7 w-9 items-center justify-center rounded-md font-mono text-[10px] ${i < laps ? (i % 2 === 0 ? 'bg-tele/20 text-tele' : 'bg-gold/20 text-gold-soft') : 'bg-white/[0.04] text-slate-500'}`}>
              {i % 2 === 0 ? 'S→M' : 'M→S'}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[260px_1fr]">
        <motion.button whileTap={{ scale: 0.96 }} onClick={tap} disabled={done} className={`flex flex-col items-center justify-center rounded-2xl border p-5 ${done ? 'border-go/40 bg-go/10' : 'border-gold/40 bg-gold/[0.07] hover:bg-gold/[0.12]'}`}>
          {done ? (
            <>
              <div className="arabic text-2xl text-go">تقبّل الله</div>
              <div className="mt-1 font-mono text-[11px] tracking-[0.2em] text-go">7 / 7 · ENDED AT MARWAH</div>
            </>
          ) : (
            <>
              <div className="font-mono text-[10px] tracking-[0.25em] text-mist">LAP {current} OF 7</div>
              <div className="mt-2 flex items-center gap-2 text-lg font-medium text-white">
                {towardMarwah ? (
                  <>Safa <ArrowRight size={18} className="text-tele" /> Marwah</>
                ) : (
                  <>Safa <ArrowLeft size={18} className="text-gold" /> Marwah</>
                )}
              </div>
              <div className="mt-2 text-xs text-gold/80">Tap on reaching {towardMarwah ? 'Marwah' : 'Safa'}</div>
            </>
          )}
        </motion.button>

        <div className="space-y-3 text-sm">
          <div className={`rounded-xl border p-3.5 ${role === 'man' ? 'border-go/40 bg-go/[0.06]' : 'border-white/10 bg-black/30'}`}>
            <div className="label text-go">Green-light zone</div>
            <p className="mt-1 text-slate-200">{role === 'man' ? 'Men: jog lightly between the green markers on every lap, in both directions.' : 'Women: keep a steady, normal walk through the green zone. No jogging.'}</p>
            <p className="arabic mt-1 text-lg text-go/90">{green.arabic}</p>
          </div>
          <div className="rounded-xl border border-gold/20 bg-gold/[0.04] p-3.5">
            <div className="label text-gold/80">On Safa & Marwah · face the Kaaba</div>
            <p className="arabic mt-1 text-lg leading-[2] text-gold-soft">{dhikr.arabic}</p>
            <p className="mt-1 text-xs italic text-slate-400">{dhikr.translit}</p>
          </div>
          {done && <p className="rounded-xl border border-tele/30 bg-tele/[0.05] p-3.5 text-slate-200">Sa'i done. Next: {role === 'man' ? 'Halq (shave) or Taqsir (trim) at the barbers near Marwah.' : 'trim a fingertip\'s length from the ends of your hair, in private.'}</p>}
        </div>
      </div>
    </section>
  )
}
