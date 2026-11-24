import { createContext, useContext } from 'react'
import type { Role } from '../data/umrahData'

export type View = 'mission' | 'itinerary' | 'rituals' | 'ziyarat' | 'intel' | 'duas'

export interface Focus {
  view: View
  id?: string
  nonce: number
}

export interface AppContextValue {
  view: View
  focus: Focus | null
  role: Role
  setRole: (r: Role) => void
  go: (view: View, id?: string, opts?: { role?: Role }) => void
  openPalette: () => void
}

export const AppContext = createContext<AppContextValue | null>(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppContext')
  return ctx
}

/** Scroll an element into view and briefly highlight it. */
export function flashElement(id: string) {
  let tries = 0
  const attempt = () => {
    const el = document.getElementById(id)
    if (!el) {
      if (tries++ < 20) window.setTimeout(attempt, 60)
      return
    }
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.remove('flash')
    void el.offsetWidth
    el.classList.add('flash')
  }
  window.setTimeout(attempt, 80)
}
