import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Eye, EyeOff, Minus, Plus, Star } from 'lucide-react'
import { DUA_CATEGORIES, DUAS, type Dua, type DuaCategory } from '../data/umrahData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { flashElement, useApp } from '../lib/nav'
import { SectionHeader } from './ui'

type Filter = DuaCategory | 'All' | 'Favorites'

function DuaCard({ dua, fav, onFav, size, showTranslit }: { dua: Dua; fav: boolean; onFav: () => void; size: number; showTranslit: boolean }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    const text = `${dua.title}\n\n${dua.arabic}\n\n${dua.translit}\n\n${dua.english}`
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      ta.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }
  const phrase = dua.category === 'Saudi phrases'

  return (
    <motion.article layout id={`dua-${dua.id}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} className={`flex flex-col p-5 ${phrase ? 'glass' : 'glass-gold'}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className={`label ${phrase ? 'text-tele/80' : 'text-gold/70'}`}>{dua.category}</div>
          <h3 className="mt-0.5 font-medium text-white">{dua.title}</h3>
        </div>
        <div className="flex shrink-0 gap-1">
          <button onClick={copy} className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-slate-400 transition hover:text-white" aria-label="Copy">
            {copied ? <Check size={16} className="text-go" /> : <Copy size={16} />}
          </button>
          <button onClick={onFav} className={`grid h-9 w-9 place-items-center rounded-lg border transition ${fav ? 'border-gold/50 bg-gold/15 text-gold' : 'border-white/10 text-slate-400 hover:text-white'}`} aria-label={fav ? 'Remove favourite' : 'Add favourite'} aria-pressed={fav}>
            <Star size={16} fill={fav ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
      <p className="arabic mt-4 text-gold-soft" style={{ fontSize: `${size}px`, lineHeight: 2.05 }}>
        {dua.arabic}
      </p>
      {showTranslit && <p className="mt-3 text-[15px] italic leading-relaxed text-slate-200">{dua.translit}</p>}
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{dua.english}</p>
      {dua.note && <p className="mt-3 rounded-lg border border-white/[0.06] bg-black/30 px-3 py-2 text-xs text-slate-400">{dua.note}</p>}
    </motion.article>
  )
}

export function DuaDeck() {
  const { focus } = useApp()
  const [filter, setFilter] = useState<Filter>('All')
  const [favs, setFavs] = useLocalStorage<string[]>('dua-favs', [])
  const [size, setSize] = useLocalStorage<number>('dua-size', 28)
  const [showTranslit, setShowTranslit] = useLocalStorage<boolean>('dua-translit', true)

  useEffect(() => {
    if (focus?.view !== 'duas' || !focus.id) return
    setFilter('All')
    flashElement(`dua-${focus.id}`)
  }, [focus])

  const list = DUAS.filter((d) => (filter === 'All' ? true : filter === 'Favorites' ? favs.includes(d.id) : d.category === filter))
  const toggleFav = (id: string) => setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))

  return (
    <div className="space-y-5">
      <SectionHeader eyebrow="Pocket deck" title="Duas & phrasebook" arabic="الأدعية">
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/40 p-1">
          <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-300 hover:bg-white/5" onClick={() => setSize(Math.max(20, size - 4))} aria-label="Smaller Arabic">
            <Minus size={14} />
          </button>
          <span className="arabic w-10 text-center text-gold-soft">أ</span>
          <button className="grid h-8 w-8 place-items-center rounded-lg text-slate-300 hover:bg-white/5" onClick={() => setSize(Math.min(48, size + 4))} aria-label="Larger Arabic">
            <Plus size={14} />
          </button>
        </div>
        <button onClick={() => setShowTranslit(!showTranslit)} className="btn-ghost text-xs">
          {showTranslit ? <EyeOff size={14} /> : <Eye size={14} />} Transliteration
        </button>
      </SectionHeader>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {(['All', 'Favorites', ...DUA_CATEGORIES] as Filter[]).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm transition ${filter === c ? 'border-gold/50 bg-gold/10 text-white' : 'border-white/10 text-slate-400 hover:text-slate-200'}`}
          >
            {c === 'Favorites' && <Star size={13} className="text-gold" fill={favs.length ? 'currentColor' : 'none'} />}
            {c}
            {c === 'Favorites' && <span className="font-mono text-[10px] text-slate-500">{favs.length}</span>}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="glass p-10 text-center text-slate-400">Tap the star on any card to keep it here for quick access.</div>
      ) : (
        <motion.div layout className="grid gap-4 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {list.map((d) => (
              <DuaCard key={d.id} dua={d} fav={favs.includes(d.id)} onFav={() => toggleFav(d.id)} size={d.category === 'Saudi phrases' ? Math.max(20, size - 4) : size} showTranslit={showTranslit} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
