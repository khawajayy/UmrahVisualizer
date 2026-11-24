import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Circle, Pause, Play, Scissors, User, UserRound } from 'lucide-react'
import { mapsSearch, RITUAL_STEPS, TALBIYAH, type RuleItem } from '../data/umrahData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { flashElement, useApp } from '../lib/nav'
import { SaiTracker } from './SaiTracker'
import { TawafCounter } from './TawafCounter'
import { MapsLink, RoleToggle, SectionHeader, SeverityTag } from './ui'

function TalbiyahCadence() {
  const [playing, setPlaying] = useState(true)
  const [beat, setBeat] = useState(0)
  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => setBeat((b) => (b + 1) % TALBIYAH.cadence.length), 1600)
    return () => window.clearInterval(id)
  }, [playing])

  return (
    <div className="rounded-2xl border border-gold/25 bg-gradient-to-br from-gold/[0.07] to-transparent p-5">
      <div className="flex items-center justify-between">
        <div className="label text-gold/80">Talbiyah · rhythm guide</div>
        <button onClick={() => setPlaying((p) => !p)} className="btn-ghost !px-2.5 !py-1.5 text-xs" aria-label={playing ? 'Pause rhythm' : 'Play rhythm'}>
          {playing ? <Pause size={14} /> : <Play size={14} />}
          {playing ? 'Pause' : 'Play'}
        </button>
      </div>
      <p className="arabic mt-3 text-2xl leading-[2.1] text-gold-soft sm:text-3xl">{TALBIYAH.arabic}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-4">
        {TALBIYAH.cadence.map((line, i) => (
          <motion.div
            key={line}
            animate={{ opacity: beat === i ? 1 : 0.4, scale: beat === i ? 1 : 0.98 }}
            className={`rounded-lg border px-3 py-2 text-sm ${beat === i ? 'border-gold/60 bg-gold/10 text-white' : 'border-white/10 text-slate-400'}`}
          >
            <div className="mb-1 flex gap-0.5">
              {Array.from({ length: 12 }).map((_, k) => (
                <motion.span
                  key={k}
                  className="w-1 rounded-full bg-gold"
                  animate={{ height: beat === i && playing ? [4, 6 + ((k * 7) % 14), 4] : 4 }}
                  transition={{ duration: 0.8, repeat: beat === i && playing ? Infinity : 0, delay: k * 0.05 }}
                />
              ))}
            </div>
            {line}
          </motion.div>
        ))}
      </div>
      <p className="mt-3 text-sm text-slate-400">{TALBIYAH.english}</p>
    </div>
  )
}

function RuleCard({ rule, tone }: { rule: RuleItem; tone: 'shared' | 'man' | 'woman' }) {
  const border = tone === 'man' ? 'border-tele/25 bg-tele/[0.04]' : tone === 'woman' ? 'border-gold/25 bg-gold/[0.04]' : 'border-white/[0.08] bg-white/[0.02]'
  return (
    <motion.div id={`rule-${rule.id}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`rounded-xl border p-4 ${border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="font-medium text-white">{rule.title}</div>
        <SeverityTag severity={rule.severity} />
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{rule.detail}</p>
    </motion.div>
  )
}

const PROHIBITIONS_KEY = 'ihram-checks'

export function UmrahGuide() {
  const { role, setRole, focus } = useApp()
  const [stepIdx, setStepIdx] = useLocalStorage<number>('guide-step', 0)
  const [completed, setCompleted] = useLocalStorage<string[]>('guide-done', [])
  const [checks, setChecks] = useLocalStorage<string[]>(PROHIBITIONS_KEY, [])
  const step = RITUAL_STEPS[stepIdx] ?? RITUAL_STEPS[0]

  useEffect(() => {
    if (focus?.view !== 'rituals' || !focus.id) return
    const id = focus.id
    let target = -1
    if (id === 'tawaf-counter') target = 1
    else if (id === 'sai-tracker') target = 2
    else target = RITUAL_STEPS.findIndex((s) => s.id === id || [...s.shared, ...s.man, ...s.woman].some((r) => `rule-${r.id}` === id))
    if (target >= 0) setStepIdx(target)
    flashElement(id.startsWith('rule-') || id.endsWith('-counter') || id.endsWith('-tracker') ? id : 'guide-step')
  }, [focus]) // eslint-disable-line react-hooks/exhaustive-deps

  const roleRules = role === 'man' ? step.man : step.woman
  const prohibitions = [...RITUAL_STEPS[0].shared.filter((r) => r.severity === 'avoid'), ...(role === 'man' ? RITUAL_STEPS[0].man.filter((r) => r.severity === 'must') : RITUAL_STEPS[0].woman.filter((r) => r.severity === 'avoid'))]
  const isDone = completed.includes(step.id)

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Rituals & live tracker" title="Umrah step by step" arabic="مناسك العمرة" />

      {/* Role switch banner */}
      <div className={`flex flex-col items-start gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between ${role === 'man' ? 'border-tele/30 bg-tele/[0.05]' : 'border-gold/30 bg-gold/[0.05]'}`}>
        <div className="flex items-center gap-3">
          <span className={`grid h-11 w-11 place-items-center rounded-xl ${role === 'man' ? 'bg-tele/15 text-tele' : 'bg-gold/15 text-gold'}`}>{role === 'man' ? <User size={22} /> : <UserRound size={22} />}</span>
          <div>
            <div className="label">Guidance mode</div>
            <div className="text-white">Every rule, dress code and Sunnah below is showing for <b className={role === 'man' ? 'text-tele' : 'text-gold-soft'}>{role === 'man' ? 'men' : 'women'}</b>.</div>
          </div>
        </div>
        <RoleToggle role={role} setRole={setRole} />
      </div>

      {/* Step rail */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {RITUAL_STEPS.map((s, i) => {
          const active = i === stepIdx
          const finished = completed.includes(s.id)
          return (
            <button
              key={s.id}
              onClick={() => setStepIdx(i)}
              className={`relative overflow-hidden rounded-xl border p-3 text-left transition ${active ? 'border-gold/50 bg-gold/10' : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest text-mist">STEP {s.n}</span>
                {finished ? <CheckCircle2 size={16} className="text-go" /> : <Circle size={16} className="text-slate-600" />}
              </div>
              <div className={`mt-1 text-sm font-medium ${active ? 'text-white' : 'text-slate-300'}`}>{s.title}</div>
              <div className="arabic text-right text-base leading-tight text-gold/70">{s.arabic}</div>
              {active && <motion.span layoutId="step-underline" className="absolute inset-x-0 bottom-0 h-0.5 bg-gold" />}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step.id + role} id="guide-step" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-6">
          <div className="glass p-5 sm:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="label text-tele/80">Step {step.n} · {step.subtitle}</div>
                <h3 className="mt-1 text-2xl font-semibold text-white">{step.title}</h3>
              </div>
              <button onClick={() => setCompleted(isDone ? completed.filter((x) => x !== step.id) : [...completed, step.id])} className={isDone ? 'btn-tele' : 'btn-gold'}>
                <CheckCircle2 size={16} /> {isDone ? 'Completed' : 'Mark step complete'}
              </button>
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-2">
              <div>
                <div className="label mb-2">For everyone</div>
                <div className="space-y-2.5">
                  {step.shared.map((r) => (
                    <RuleCard key={r.id} rule={r} tone="shared" />
                  ))}
                </div>
              </div>
              <div>
                <div className={`label mb-2 ${role === 'man' ? 'text-tele' : 'text-gold'}`}>{role === 'man' ? 'Men only' : 'Women only'}</div>
                <div className="space-y-2.5">
                  {roleRules.map((r) => (
                    <RuleCard key={r.id} rule={r} tone={role} />
                  ))}
                </div>

                {step.id === 'ihram' && (
                  <div className="mt-5 rounded-xl border border-stop/25 bg-stop/[0.04] p-4">
                    <div className="label text-stop">Ihram prohibitions · self-check</div>
                    <ul className="mt-2 space-y-1.5">
                      {prohibitions.map((p) => {
                        const on = checks.includes(p.id)
                        return (
                          <li key={p.id}>
                            <button onClick={() => setChecks(on ? checks.filter((x) => x !== p.id) : [...checks, p.id])} className="flex w-full items-center gap-2.5 rounded-lg px-1 py-1 text-left text-sm hover:bg-white/[0.03]">
                              {on ? <CheckCircle2 size={18} className="shrink-0 text-go" /> : <Circle size={18} className="shrink-0 text-slate-600" />}
                              <span className={on ? 'text-slate-400 line-through decoration-slate-600' : 'text-slate-200'}>{p.title}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )}

                {step.id === 'halq' && (
                  <div className="mt-5 rounded-xl border border-white/10 bg-black/30 p-4">
                    <div className="label flex items-center gap-1.5"><Scissors size={11} /> {role === 'man' ? 'Find a barber' : 'Bring small scissors'}</div>
                    {role === 'man' ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <MapsLink href={mapsSearch('barber near Marwah gate Masjid al-Haram')} label="Barbers near Marwah" />
                        <MapsLink href={mapsSearch('barber Al Aziziyah Makkah')} label="Barbers in Aziziyah" variant="ghost" />
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-slate-300">Gather all your hair together and cut about a fingertip's length (1–2 cm) from the ends. A mahram or another woman can help.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {step.id === 'ihram' && <TalbiyahCadence />}
          {step.id === 'tawaf' && <TawafCounter role={role} />}
          {step.id === 'sai' && <SaiTracker role={role} />}
          {step.id === 'halq' && completed.length >= 3 && (
            <div className="glass-gold p-6 text-center">
              <div className="arabic text-4xl text-gold-soft">تقبّل الله منا ومنكم</div>
              <p className="mt-2 text-slate-300">May Allah accept it from us and from you. Umrah Mubarak.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
