import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { Role } from './data/umrahData'
import { useLocalStorage } from './hooks/useLocalStorage'
import { AppContext, flashElement, type Focus, type View } from './lib/nav'
import { CommandPalette } from './components/CommandPalette'
import { DuaDeck } from './components/DuaDeck'
import { IntelGrid } from './components/IntelGrid'
import { ItineraryExplorer } from './components/ItineraryExplorer'
import { MissionView } from './components/MissionView'
import { Navbar } from './components/Navbar'
import { UmrahGuide } from './components/UmrahGuide'
import { ZiyaratMap } from './components/ZiyaratMap'
import { GeometricBackdrop } from './components/ui'

const VIEWS: View[] = ['mission', 'itinerary', 'rituals', 'ziyarat', 'intel', 'duas']

function viewFromHash(): View {
  const h = window.location.hash.replace('#', '') as View
  return VIEWS.includes(h) ? h : 'mission'
}

export default function App() {
  const [view, setView] = useState<View>(viewFromHash)
  const [role, setRole] = useLocalStorage<Role>('role', 'man')
  const [clock12, setClock12] = useLocalStorage<boolean>('clock12', false)
  const [focus, setFocus] = useState<Focus | null>(null)
  const [paletteOpen, setPaletteOpen] = useState(false)

  const go = useCallback(
    (v: View, id?: string, opts?: { role?: Role }) => {
      if (opts?.role) setRole(opts.role)
      setView(v)
      if (window.location.hash !== `#${v}`) history.replaceState(null, '', `#${v}`)
      if (id) {
        setFocus({ view: v, id, nonce: Date.now() })
        if (v === 'mission') flashElement(id)
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    [setRole],
  )

  useEffect(() => {
    const onHash = () => {
      setView(viewFromHash())
      window.scrollTo({ top: 0 })
    }
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      } else if (e.key === '/' && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        setPaletteOpen(true)
      }
    }
    window.addEventListener('hashchange', onHash)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('hashchange', onHash)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const ctx = useMemo(
    () => ({ view, focus, role, setRole, go, openPalette: () => setPaletteOpen(true), clock12, setClock12 }),
    [view, focus, role, setRole, go, clock12, setClock12],
  )

  return (
    <AppContext.Provider value={ctx}>
      <GeometricBackdrop />
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:pb-16">
        {/* Enter-only transition: an exit phase here can stall on nested layout animations. */}
        <motion.div key={view} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
          {view === 'mission' && <MissionView />}
          {view === 'itinerary' && <ItineraryExplorer />}
          {view === 'rituals' && <UmrahGuide />}
          {view === 'ziyarat' && <ZiyaratMap />}
          {view === 'intel' && <IntelGrid />}
          {view === 'duas' && <DuaDeck />}
        </motion.div>
        <footer className="mt-16 border-t border-white/[0.06] pt-6 text-center text-xs text-slate-600">
          <p className="arabic text-lg text-gold/40">رَبَّنَا تَقَبَّلْ مِنَّا</p>
          <p className="mt-1">Built for our first Umrah · 29 Nov – 11 Dec 2026 · works offline after first load</p>
        </footer>
      </main>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onSelect={(v, id, r) => go(v, id, r ? { role: r } : undefined)} />
    </AppContext.Provider>
  )
}
