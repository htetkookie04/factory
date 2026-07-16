// Single shared status pill used across BOTH the mobile app and admin web.
// `tone` maps to a color token; pass a label for the visible text.

const TONES = {
  success: 'bg-success/12 text-success border-success/25',
  warning: 'bg-warning/15 text-[#a9781f] border-warning/30',
  danger: 'bg-danger/12 text-danger border-danger/25',
  info: 'bg-[#3b82f6]/12 text-[#2f6fd0] border-[#3b82f6]/25',
  primary: 'bg-primary/12 text-primary border-primary/25',
  muted: 'bg-ink-soft/10 text-ink-soft border-line',
}

export default function StatusBadge({ tone = 'muted', children, dot = true, className = '' }) {
  const cls = TONES[tone] || TONES.muted
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cls} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />}
      {children}
    </span>
  )
}
