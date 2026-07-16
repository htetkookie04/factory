const VARIANTS = {
  primary:
    'bg-primary text-white hover:bg-[#5a3f2c] active:bg-[#4a3323] shadow-soft disabled:opacity-40',
  secondary:
    'bg-white text-primary border border-primary hover:bg-primary/5 active:bg-primary/10 disabled:opacity-40',
  light:
    'bg-primary-light text-white hover:brightness-95 active:brightness-90 disabled:opacity-40',
  ghost: 'bg-transparent text-primary hover:bg-primary/5 disabled:opacity-40',
  subtle:
    'bg-surface text-ink border border-line hover:bg-line/40 disabled:opacity-40',
  danger:
    'bg-danger text-white hover:brightness-95 active:brightness-90 disabled:opacity-40',
}

const SIZES = {
  sm: 'px-3.5 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  full = false,
  className = '',
  icon = null,
  iconRight = null,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${full ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  )
}
