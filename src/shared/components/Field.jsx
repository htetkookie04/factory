// Small labeled form primitives shared across onboarding forms.

export function Field({ label, children, hint, required }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1.5 block text-sm font-semibold text-ink">
          {label}
          {required && <span className="text-danger"> *</span>}
        </span>
      )}
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  )
}

const baseInput =
  'w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/15'

export function TextInput(props) {
  return <input className={`${baseInput} ${props.className || ''}`} {...props} />
}

export function TextArea(props) {
  return (
    <textarea
      rows={3}
      {...props}
      className={`${baseInput} resize-none ${props.className || ''}`}
    />
  )
}

export function Select({ options, placeholder, ...props }) {
  return (
    <select className={`${baseInput} ${props.className || ''}`} {...props}>
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o.value ?? o.id} value={o.value ?? o.id}>
          {o.label ?? o.en}
        </option>
      ))}
    </select>
  )
}

export function RadioCardGroup({ options, value, onChange }) {
  return (
    <div className="grid gap-2">
      {options.map((o) => {
        const active = value === (o.value ?? o.id)
        return (
          <button
            key={o.value ?? o.id}
            type="button"
            onClick={() => onChange(o.value ?? o.id)}
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
              active ? 'border-primary bg-primary/5' : 'border-line bg-white hover:border-primary/40'
            }`}
          >
            <span
              className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
                active ? 'border-primary' : 'border-line'
              }`}
            >
              {active && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
            </span>
            <span className="text-sm font-medium text-ink">{o.label ?? o.en}</span>
          </button>
        )
      })}
    </div>
  )
}
