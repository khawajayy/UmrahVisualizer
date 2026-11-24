import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpenText, CalendarDays, Compass, CornerDownLeft, Map, Search, Sparkles, Wrench, type LucideIcon } from 'lucide-react'
import { DAYS, DUAS, INTEL, LANDMARKS, RITUAL_STEPS, type Role } from '../data/umrahData'
import type { View } from '../lib/nav'
import { NAV_ITEMS } from './Navbar'

interface Entry {
  key: string
  group: string
  title: string
  subtitle?: string
  icon: LucideIcon
  view: View
  id?: string
  role?: Role
  hay: string
}

function buildIndex(): Entry[] {
  const out: Entry[] = []
  const add = (e: Omit<Entry, 'hay'>, extra = '') => out.push({ ...e, hay: `${e.title} ${e.subtitle ?? ''} ${e.group} ${extra}`.toLowerCase() })

  NAV_ITEMS.forEach((n) => add({ key: `v-${n.view}`, group: 'Go to', title: n.label, icon: n.icon, view: n.view }))
  add({ key: 't-tawaf', group: 'Tools', title: 'Tawaf counter', subtitle: '7-round tap counter', icon: Wrench, view: 'rituals', id: 'tawaf-counter' }, 'circuits rounds kaaba')
  add({ key: 't-sai', group: 'Tools', title: 'Sa\'i tracker', subtitle: 'Safa ↔ Marwah, 7 laps', icon: Wrench, view: 'rituals', id: 'sai-tracker' }, 'sai safa marwah laps green lights')
  add({ key: 't-miqat', group: 'Tools', title: 'Miqat & Ihram protocol', subtitle: 'Dhul Hulayfah on the MED → JED leg', icon: Wrench, view: 'mission', id: 'miqat-alert' }, 'ihram niyyah abyar ali yalamlam')
  add({ key: 't-pack', group: 'Tools', title: 'Packing checklist', subtitle: 'Documents, Ihram, health kit', icon: Wrench, view: 'intel', id: 'packing' }, 'vaseline luggage')

  DAYS.forEach((d, i) => add({ key: `d-${d.id}`, group: 'Itinerary', title: `Day ${i + 1} · ${d.label}: ${d.title}`, subtitle: d.city, icon: CalendarDays, view: 'itinerary', id: d.id }, d.summary + ' ' + d.events.map((e) => e.title).join(' ')))

  RITUAL_STEPS.forEach((s) => {
    s.shared.forEach((r) => add({ key: `r-${r.id}`, group: 'Umrah rules', title: r.title, subtitle: `Step ${s.n} · ${s.title}`, icon: Compass, view: 'rituals', id: `rule-${r.id}` }, r.detail))
    s.man.forEach((r) => add({ key: `r-${r.id}`, group: 'Umrah rules', title: `Men: ${r.title}`, subtitle: `Step ${s.n} · ${s.title}`, icon: Compass, view: 'rituals', id: `rule-${r.id}`, role: 'man' }, 'man men male ' + r.detail))
    s.woman.forEach((r) => add({ key: `r-${r.id}`, group: 'Umrah rules', title: `Women: ${r.title}`, subtitle: `Step ${s.n} · ${s.title}`, icon: Compass, view: 'rituals', id: `rule-${r.id}`, role: 'woman' }, 'woman women female ' + r.detail))
  })

  LANDMARKS.forEach((l) => add({ key: `l-${l.id}`, group: 'Ziyarat', title: l.name, subtitle: l.city === 'makkah' ? 'Makkah · 3 Dec' : 'Madinah · 8 Dec', icon: Map, view: 'ziyarat', id: l.id }, l.summary))
  DUAS.forEach((d) => add({ key: `du-${d.id}`, group: d.category === 'Saudi phrases' ? 'Phrases' : 'Duas', title: d.title, subtitle: d.translit.slice(0, 70), icon: BookOpenText, view: 'duas', id: d.id }, d.english + ' ' + d.category))
  INTEL.forEach((i) => add({ key: `i-${i.id}`, group: 'Local intel', title: i.title, subtitle: i.category, icon: Sparkles, view: 'intel', id: i.id }, i.body))
  return out
}

export function CommandPalette({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (view: View, id?: string, role?: Role) => void }) {
  const index = useMemo(buildIndex, [])
  const [q, setQ] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const tokens = q.toLowerCase().trim().split(/\s+/).filter(Boolean)
    if (!tokens.length) return index.filter((e) => e.group === 'Go to' || e.group === 'Tools')
    return index
      .filter((e) => tokens.every((t) => e.hay.includes(t)))
      .sort((a, b) => Number(b.title.toLowerCase().includes(tokens[0])) - Number(a.title.toLowerCase().includes(tokens[0])))
      .slice(0, 40)
  }, [q, index])

  useEffect(() => {
    if (open) {
      setQ('')
      setCursor(0)
      window.setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  useEffect(() => setCursor(0), [q])

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-i="${cursor}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  const choose = (e?: Entry) => {
    if (!e) return
    onSelect(e.view, e.id, e.role)
    onClose()
  }

  const onKey = (ev: React.KeyboardEvent) => {
    if (ev.key === 'ArrowDown') {
      ev.preventDefault()
      setCursor((c) => Math.min(results.length - 1, c + 1))
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault()
      setCursor((c) => Math.max(0, c - 1))
    } else if (ev.key === 'Enter') {
      ev.preventDefault()
      choose(results[cursor])
    } else if (ev.key === 'Escape') {
      onClose()
    }
  }

  let lastGroup = ''

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[1000] flex items-start justify-center bg-black/70 px-3 pt-[10vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            initial={{ y: -12, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -12, scale: 0.98 }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-gold/25 bg-ink/95 shadow-[0_0_80px_-20px_rgba(212,175,55,0.5)]"
          >
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-4">
              <Search size={18} className="text-gold" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder="Jump to a day, dua, ziyarat site, or rule…"
                className="h-14 flex-1 bg-transparent text-[15px] text-white placeholder:text-slate-500 focus:outline-none"
                aria-label="Search"
              />
              <kbd className="rounded border border-white/10 px-1.5 font-mono text-[10px] text-slate-500">ESC</kbd>
            </div>
            <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
              {results.length === 0 && <div className="p-8 text-center text-sm text-slate-500">Nothing matches "{q}"</div>}
              {results.map((e, i) => {
                const header = e.group !== lastGroup ? e.group : null
                lastGroup = e.group
                return (
                  <div key={e.key}>
                    {header && <div className="label px-3 pb-1 pt-3">{header}</div>}
                    <button
                      data-i={i}
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => choose(e)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left ${i === cursor ? 'bg-gold/10 ring-1 ring-gold/30' : ''}`}
                    >
                      <e.icon size={16} className={i === cursor ? 'text-gold' : 'text-slate-500'} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-slate-100">{e.title}</span>
                        {e.subtitle && <span className="block truncate text-xs text-slate-500">{e.subtitle}</span>}
                      </span>
                      {i === cursor && <CornerDownLeft size={14} className="text-gold/70" />}
                    </button>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center gap-4 border-t border-white/[0.06] px-4 py-2 font-mono text-[10px] text-slate-500">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span className="ml-auto">{results.length} results</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
