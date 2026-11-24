import { motion } from 'framer-motion'
import { BookOpenText, CalendarDays, Compass, Gauge, Map, Search, Sparkles } from 'lucide-react'
import { useApp, type View } from '../lib/nav'
import { RoleToggle } from './ui'

export const NAV_ITEMS: { view: View; label: string; short: string; icon: typeof Gauge }[] = [
  { view: 'mission', label: 'Mission', short: 'Mission', icon: Gauge },
  { view: 'itinerary', label: 'Itinerary', short: 'Days', icon: CalendarDays },
  { view: 'rituals', label: 'Umrah Guide', short: 'Umrah', icon: Compass },
  { view: 'ziyarat', label: 'Ziyarat', short: 'Ziyarat', icon: Map },
  { view: 'intel', label: 'Local Intel', short: 'Intel', icon: Sparkles },
  { view: 'duas', label: 'Duas', short: 'Duas', icon: BookOpenText },
]

export function Navbar() {
  const { view, go, role, setRole, openPalette } = useApp()
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-obsidian/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <button onClick={() => go('mission')} className="group flex items-center gap-2.5" aria-label="Home">
            <svg viewBox="0 0 40 40" className="h-8 w-8 transition-transform duration-700 group-hover:rotate-45" aria-hidden>
              <g fill="none" stroke="#D4AF37" strokeWidth="1.6">
                <rect x="10" y="10" width="20" height="20" />
                <rect x="10" y="10" width="20" height="20" transform="rotate(45 20 20)" />
              </g>
              <rect x="16" y="16" width="8" height="8" fill="#D4AF37" />
            </svg>
            <div className="leading-tight text-left lg:hidden xl:block">
              <div className="text-sm font-semibold tracking-wide text-white">Umrah Mission Control</div>
              <div className="font-mono text-[10px] tracking-[0.2em] text-gold/70">29 NOV – 11 DEC 2026</div>
            </div>
          </button>

          <nav className="ml-6 hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((n) => {
              const active = view === n.view
              return (
                <button
                  key={n.view}
                  onClick={() => go(n.view)}
                  className={`relative rounded-lg px-3 py-2 text-sm transition-colors ${active ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  {active && <motion.span layoutId="nav-active" className="absolute inset-0 rounded-lg border border-gold/30 bg-gold/[0.07]" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />}
                  <span className="relative flex items-center gap-2">
                    <n.icon size={15} className={active ? 'text-gold' : ''} />
                    {n.label}
                  </span>
                </button>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:block">
              <RoleToggle role={role} setRole={setRole} size="sm" />
            </div>
            <button onClick={openPalette} className="btn-ghost !px-2.5 sm:!px-3" aria-label="Search (Ctrl+K)">
              <Search size={16} />
              <span className="hidden text-slate-400 md:inline">Search</span>
              <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] text-slate-400 md:inline">{isMac ? '⌘' : 'Ctrl'} K</kbd>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-obsidian/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-6">
          {NAV_ITEMS.map((n) => {
            const active = view === n.view
            return (
              <button key={n.view} onClick={() => go(n.view)} className="relative flex flex-col items-center gap-1 py-2.5 text-[10px]">
                {active && <motion.span layoutId="mnav-active" className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-gold shadow-[0_0_12px_#D4AF37]" />}
                <n.icon size={20} className={active ? 'text-gold' : 'text-slate-500'} />
                <span className={active ? 'text-gold-soft' : 'text-slate-500'}>{n.short}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
