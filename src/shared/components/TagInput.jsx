import { useState } from 'react'

// Free-form chip entry (Manufacturer "Main Clients"). Add on Enter, remove via X.
export default function TagInput({ value = [], onChange, placeholder = 'Type and press Enter' }) {
  const [draft, setDraft] = useState('')

  function add() {
    const v = draft.trim()
    if (!v) return
    if (!value.includes(v)) onChange([...value, v])
    setDraft('')
  }

  function remove(tag) {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div className="rounded-2xl border border-line bg-white px-3 py-2.5">
      <div className="flex flex-wrap items-center gap-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 rounded-full bg-mint/25 px-3 py-1 text-sm font-medium text-primary"
          >
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              className="text-primary/60 hover:text-danger"
              aria-label={`Remove ${tag}`}
            >
              ✕
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            } else if (e.key === 'Backspace' && !draft && value.length) {
              remove(value[value.length - 1])
            }
          }}
          onBlur={add}
          placeholder={value.length ? '' : placeholder}
          className="min-w-[120px] flex-1 border-none py-1 text-sm outline-none placeholder:text-ink-soft/60"
        />
      </div>
    </div>
  )
}
