import { useRef } from 'react'

// 6-box auto-advancing OTP input (demo: accepts any 6 digits).
export default function OTPInput({ value, onChange, length = 6 }) {
  const refs = useRef([])
  const chars = value.padEnd(length, ' ').slice(0, length).split('')

  function setChar(i, ch) {
    const arr = value.padEnd(length, ' ').slice(0, length).split('')
    arr[i] = ch || ' '
    onChange(arr.join('').replace(/ /g, ''))
  }

  return (
    <div className="flex justify-center gap-2">
      {chars.map((c, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          inputMode="numeric"
          maxLength={1}
          value={c.trim()}
          onChange={(e) => {
            const digit = e.target.value.replace(/\D/g, '').slice(-1)
            setChar(i, digit)
            if (digit && i < length - 1) refs.current[i + 1]?.focus()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !c.trim() && i > 0) refs.current[i - 1]?.focus()
          }}
          className="h-12 w-11 rounded-xl border border-line bg-white text-center text-lg font-bold text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      ))}
    </div>
  )
}
