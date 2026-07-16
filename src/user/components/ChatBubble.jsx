// Chat bubble — ai (left, mint) | user (right, teal).
export default function ChatBubble({ role = 'ai', children }) {
  const isAI = role === 'ai'
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          isAI
            ? 'rounded-tl-md bg-[#F1E9DF] text-ink'
            : 'rounded-tr-md bg-primary text-white'
        }`}
      >
        {children}
      </div>
    </div>
  )
}
