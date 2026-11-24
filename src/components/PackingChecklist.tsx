import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Luggage, RotateCcw } from 'lucide-react'
import { PACKING, type PackItem } from '../data/umrahData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useApp } from '../lib/nav'
import { ProgressRing } from './ui'

const GROUPS: PackItem['group'][] = ['Documents', 'Ihram & Clothing', 'Health', 'Gear']

export function PackingChecklist() {
  const { role } = useApp()
  const [packed, setPacked] = useLocalStorage<string[]>('packing', [])
  const items = PACKING.filter((p) => !p.role || p.role === role)
  const doneCount = items.filter((p) => packed.includes(p.id)).length
  const toggle = (id: string) => setPacked((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  return (
    <section id="packing" className="glass p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="label flex items-center gap-1.5 text-tele/80"><Luggage size={11} /> Persistent checklist</div>
          <h3 className="mt-1 text-xl font-semibold text-white">Packing & health kit</h3>
          <p className="mt-1 text-xs text-mist">Showing items for {role === 'man' ? 'men' : 'women'} plus shared items. Saved on this device.</p>
        </div>
        <ProgressRing value={items.length ? doneCount / items.length : 0} size={72} stroke={6} color={doneCount === items.length ? '#34d399' : '#D4AF37'}>
          <div className="font-mono text-sm tabular-nums text-white">
            {doneCount}/{items.length}
          </div>
        </ProgressRing>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {GROUPS.map((g) => (
          <div key={g}>
            <div className="label mb-2">{g}</div>
            <ul className="space-y-1">
              {items
                .filter((p) => p.group === g)
                .map((p) => {
                  const on = packed.includes(p.id)
                  return (
                    <li key={p.id}>
                      <motion.button whileTap={{ scale: 0.98 }} onClick={() => toggle(p.id)} className={`flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition ${on ? 'border-go/25 bg-go/[0.05]' : 'border-transparent hover:border-white/10 hover:bg-white/[0.03]'}`}>
                        {on ? <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-go" /> : <Circle size={19} className="mt-0.5 shrink-0 text-slate-600" />}
                        <span>
                          <span className={`block text-sm ${on ? 'text-slate-400 line-through decoration-slate-600' : 'text-slate-100'}`}>{p.label}</span>
                          {p.note && <span className="block text-xs text-gold/70">{p.note}</span>}
                        </span>
                      </motion.button>
                    </li>
                  )
                })}
            </ul>
          </div>
        ))}
      </div>
      {packed.length > 0 && (
        <button onClick={() => setPacked([])} className="btn-ghost mt-4 text-xs">
          <RotateCcw size={13} /> Reset list
        </button>
      )}
    </section>
  )
}
