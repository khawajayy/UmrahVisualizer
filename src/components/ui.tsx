import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation } from 'lucide-react'
import type { Role } from '../data/umrahData'

/* Islamic geometric lattice drawn once, fixed behind everything. */
export function GeometricBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(212,175,55,0.10),transparent_60%),radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(56,189,248,0.07),transparent_60%)]" />
      <svg className="absolute inset-0 h-full w-full opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="lattice" width="96" height="96" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="#D4AF37" strokeWidth="0.8">
              <rect x="28" y="28" width="40" height="40" />
              <rect x="28" y="28" width="40" height="40" transform="rotate(45 48 48)" />
              <circle cx="48" cy="48" r="9" />
              <path d="M0 48 L20 48 M76 48 L96 48 M48 0 L48 20 M48 76 L48 96" />
              <path d="M0 0 L19.7 19.7 M96 0 L76.3 19.7 M0 96 L19.7 76.3 M96 96 L76.3 76.3" />
              <rect x="-12" y="-12" width="24" height="24" transform="rotate(45 0 0)" />
              <rect x="84" y="-12" width="24" height="24" transform="rotate(45 96 0)" />
              <rect x="-12" y="84" width="24" height="24" transform="rotate(45 0 96)" />
              <rect x="84" y="84" width="24" height="24" transform="rotate(45 96 96)" />
            </g>
          </pattern>
          <radialGradient id="fade" cx="50%" cy="30%" r="75%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0.15" />
          </radialGradient>
          <mask id="fadeMask">
            <rect width="100%" height="100%" fill="url(#fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#lattice)" mask="url(#fadeMask)" />
      </svg>
    </div>
  )
}

export function SectionHeader({ eyebrow, title, arabic, children }: { eyebrow: string; title: string; arabic?: string; children?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="label text-tele/80">{eyebrow}</div>
        <h2 className="mt-1 flex flex-wrap items-baseline gap-x-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {title}
          {arabic && <span className="arabic text-2xl font-normal text-gold/80 sm:text-3xl">{arabic}</span>}
        </h2>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  )
}

export function RoleToggle({ role, setRole, size = 'md' }: { role: Role; setRole: (r: Role) => void; size?: 'sm' | 'md' }) {
  const opts: { v: Role; label: string }[] = [
    { v: 'man', label: 'MAN' },
    { v: 'woman', label: 'WOMAN' },
  ]
  return (
    <div role="radiogroup" aria-label="Guidance for" className={`relative inline-flex rounded-xl border border-white/10 bg-black/40 p-1 ${size === 'sm' ? 'text-[11px]' : 'text-sm'}`}>
      {opts.map((o) => {
        const active = role === o.v
        return (
          <button
            key={o.v}
            role="radio"
            aria-checked={active}
            onClick={() => setRole(o.v)}
            className={`relative z-10 font-mono font-semibold tracking-[0.18em] transition-colors ${size === 'sm' ? 'px-2.5 py-1' : 'px-4 py-2'} ${active ? (o.v === 'man' ? 'text-tele' : 'text-gold-soft') : 'text-slate-500 hover:text-slate-300'}`}
          >
            {active && (
              <motion.span
                layoutId={`role-pill-${size}`}
                className={`absolute inset-0 -z-10 rounded-lg ${o.v === 'man' ? 'bg-tele/15 ring-1 ring-tele/40' : 'bg-gold/15 ring-1 ring-gold/40'}`}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/** Image with a gradient + lattice fallback when the remote photo can't load (offline, blocked, 404). */
export function SmartImage({ src, alt, className = '', label }: { src?: string; alt: string; className?: string; label?: string }) {
  const [failed, setFailed] = useState(!src)
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-ink-2 via-ink to-obsidian ${className}`}>
      {(failed || !loaded) && (
        <div className="absolute inset-0 grid place-items-center">
          <svg viewBox="0 0 100 100" className="h-16 w-16 opacity-40" aria-hidden>
            <g fill="none" stroke="#D4AF37" strokeWidth="1.2">
              <rect x="25" y="25" width="50" height="50" />
              <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" />
              <circle cx="50" cy="50" r="12" />
            </g>
          </svg>
          {failed && label && <span className="absolute bottom-3 left-3 arabic text-lg text-gold/60">{label}</span>}
        </div>
      )}
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/10 to-transparent" />
    </div>
  )
}

export function ProgressRing({ value, size = 120, stroke = 8, color = '#D4AF37', track = 'rgba(255,255,255,0.06)', children }: { value: number; size?: number; stroke?: number; color?: string; track?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c * (1 - Math.min(1, Math.max(0, value))) }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  )
}

export function MapsLink({ href, label = 'Open in Google Maps', variant = 'gold', icon = 'pin' }: { href: string; label?: string; variant?: 'gold' | 'tele' | 'ghost'; icon?: 'pin' | 'nav' }) {
  const cls = variant === 'gold' ? 'btn-gold' : variant === 'tele' ? 'btn-tele' : 'btn-ghost'
  return (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {icon === 'pin' ? <MapPin size={15} /> : <Navigation size={15} />}
      {label}
    </a>
  )
}

const SEVERITY: Record<string, { label: string; cls: string }> = {
  must: { label: 'Required', cls: 'border-gold/40 text-gold-soft bg-gold/10' },
  sunnah: { label: 'Sunnah', cls: 'border-tele/40 text-tele bg-tele/10' },
  avoid: { label: 'Avoid', cls: 'border-stop/40 text-stop bg-stop/10' },
  tip: { label: 'Tip', cls: 'border-white/15 text-slate-300 bg-white/5' },
}

export function SeverityTag({ severity }: { severity?: string }) {
  const s = SEVERITY[severity ?? 'tip']
  return <span className={`rounded-md border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] ${s.cls}`}>{s.label}</span>
}
