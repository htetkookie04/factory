// Chip + ChipGroup. ChipGroup supports single-select (Type A / General Member)
// and multi-select (Type B / Manufacturer) via the `multi` prop.

export function Chip({ active = false, children, onClick, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-150 ${
        active
          ? 'border-primary bg-primary text-white shadow-soft'
          : 'border-line bg-white text-ink-soft hover:border-primary/40 hover:text-ink'
      } ${className}`}
    >
      {children}
    </button>
  )
}

export function ChipGroup({ options, value, onChange, multi = false, getLabel }) {
  const selected = multi ? value || [] : value

  function toggle(id) {
    if (multi) {
      const set = new Set(selected)
      set.has(id) ? set.delete(id) : set.add(id)
      onChange(Array.from(set))
    } else {
      onChange(id)
    }
  }

  function isActive(id) {
    return multi ? selected.includes(id) : selected === id
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <Chip key={opt.id} active={isActive(opt.id)} onClick={() => toggle(opt.id)}>
          {getLabel ? getLabel(opt) : opt.label ?? opt.en ?? opt.id}
        </Chip>
      ))}
    </div>
  )
}

export default Chip
