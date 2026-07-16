export default function Card({ children, className = '', onClick, hover = false }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-line bg-white shadow-soft ${
        hover ? 'transition-shadow hover:shadow-card cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
