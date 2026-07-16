// Centers the mobile-only app (max 480px) on desktop with a soft device frame.
// The frame is locked to the viewport height so the bottom nav stays fixed and
// only the content area scrolls.
export default function PhoneFrame({ children, bottomNav }) {
  return (
    <div className="flex h-[100dvh] w-full justify-center overflow-hidden bg-[#efe7dc]">
      <div className="relative flex h-full w-full max-w-phone flex-col overflow-hidden bg-white shadow-card sm:my-4 sm:h-[calc(100dvh-2rem)] sm:rounded-[28px]">
        <div className="min-h-0 flex-1 overflow-y-auto no-scrollbar">{children}</div>
        {bottomNav}
      </div>
    </div>
  )
}
