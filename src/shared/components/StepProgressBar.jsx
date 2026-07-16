// Dot / bar step indicator. Works for the 3-step buyer flow and the
// 5-step manufacturer flow.
export default function StepProgressBar({ total, current, labels = [] }) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => {
          const done = i < current
          const active = i === current
          return (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                done || active ? 'bg-primary' : 'bg-line'
              }`}
            />
          )
        })}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs font-medium text-ink-soft">
        <span>
          Step {Math.min(current + 1, total)} / {total}
        </span>
        {labels[current] && <span className="text-primary">{labels[current]}</span>}
      </div>
    </div>
  )
}
