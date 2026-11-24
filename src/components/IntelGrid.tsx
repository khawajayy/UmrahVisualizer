import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Banknote, Bus, HeartPulse, Smartphone, UtensilsCrossed, Wifi, type LucideIcon } from 'lucide-react'
import { INTEL, INTEL_CATEGORIES, mapsSearch, type IntelCategory } from '../data/umrahData'
import { flashElement, useApp } from '../lib/nav'
import { PackingChecklist } from './PackingChecklist'
import { MapsLink, SectionHeader } from './ui'

const CAT_META: Record<IntelCategory, { icon: LucideIcon; color: string }> = {
  Food: { icon: UtensilsCrossed, color: '#f59e0b' },
  Apps: { icon: Smartphone, color: '#38BDF8' },
  Transport: { icon: Bus, color: '#a78bfa' },
  Connectivity: { icon: Wifi, color: '#34d399' },
  Money: { icon: Banknote, color: '#D4AF37' },
  Health: { icon: HeartPulse, color: '#f87171' },
}

export function IntelGrid() {
  const { focus } = useApp()
  const [filter, setFilter] = useState<IntelCategory | 'All'>('All')
  const items = INTEL.filter((i) => filter === 'All' || i.category === filter)

  useEffect(() => {
    if (focus?.view !== 'intel' || !focus.id) return
    if (focus.id !== 'packing') setFilter('All')
    flashElement(focus.id === 'packing' ? 'packing' : `intel-${focus.id}`)
  }, [focus])

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Beyond rituals" title="Food, logistics & local intel" />

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {(['All', ...INTEL_CATEGORIES] as const).map((c) => {
          const active = filter === c
          const meta = c === 'All' ? null : CAT_META[c]
          return (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition ${active ? 'border-gold/50 bg-gold/10 text-white' : 'border-white/10 text-slate-400 hover:text-slate-200'}`}
            >
              {meta && <meta.icon size={14} style={{ color: meta.color }} />}
              {c}
              <span className="font-mono text-[10px] text-slate-500">{c === 'All' ? INTEL.length : INTEL.filter((i) => i.category === c).length}</span>
            </button>
          )
        })}
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {items.map((i) => {
            const meta = CAT_META[i.category]
            return (
              <motion.article
                layout
                key={i.id}
                id={`intel-${i.id}`}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="glass flex flex-col p-5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: `${meta.color}1a`, color: meta.color }}>
                    <meta.icon size={18} />
                  </span>
                  <div>
                    <div className="font-medium text-white">{i.title}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest" style={{ color: meta.color }}>{i.category}</div>
                  </div>
                </div>
                {i.where && <div className="mt-3 text-xs text-gold/80">{i.where}</div>}
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">{i.body}</p>
                {i.mapsQuery && (
                  <div className="mt-4">
                    <MapsLink href={mapsSearch(i.mapsQuery)} label="Find nearby" variant="ghost" />
                  </div>
                )}
              </motion.article>
            )
          })}
        </AnimatePresence>
      </motion.div>

      <PackingChecklist />
    </div>
  )
}
