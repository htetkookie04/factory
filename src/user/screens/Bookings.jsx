import { useState } from 'react'
import { useApp, formatDate } from '../../shared/context/AppContext.jsx'
import { CONSULT_STATUS, factoryAvatar } from '../../shared/tokens.js'
import Card from '../../shared/components/Card.jsx'
import Button from '../../shared/components/Button.jsx'
import StatusBadge from '../../shared/components/StatusBadge.jsx'
import NewBookingModal from '../components/NewBookingModal.jsx'
import { Icon } from '../components/Icon.jsx'

export default function Bookings() {
  const { t, lang, consultations, user, factoryById } = useApp()
  const [newOpen, setNewOpen] = useState(false)
  const [toast, setToast] = useState('')

  // Show this user's bookings (fall back to app-sourced when no user id).
  const mine = consultations.filter(
    (c) => c.source === 'app' && (!user?.id || c.buyerId === user.id || c.buyerId == null)
  )

  return (
    <div className="min-h-full">
      <div className="flex items-center justify-between border-b border-line bg-white px-5 pb-4 pt-12">
        <h1 className="text-xl font-bold text-ink">{t('myBookings')}</h1>
        <button
          onClick={() => setNewOpen(true)}
          className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white shadow-soft transition-colors hover:bg-[#5a3f2c]"
          aria-label={t('newBooking')}
        >
          <Icon name="plus" className="h-5 w-5" />
        </button>
      </div>

      {/* Success toast after creating a booking */}
      {toast && (
        <div className="mx-5 mt-4 flex items-center gap-2 rounded-2xl bg-success/12 px-4 py-3 text-sm font-medium text-success animate-slide-up">
          <Icon name="check" className="h-5 w-5" strokeWidth={2.5} />
          {toast}
        </div>
      )}

      <div className="space-y-3 px-5 py-5">
        {mine.length === 0 && (
          <div className="mt-16 flex flex-col items-center text-center text-ink-soft">
            <Icon name="calendar" className="h-12 w-12 opacity-40" />
            <p className="mt-3 text-sm">{t('noBookings')}</p>
            <Button
              className="mt-5"
              icon={<Icon name="plus" className="h-5 w-5" />}
              onClick={() => setNewOpen(true)}
            >
              {t('createBooking')}
            </Button>
          </div>
        )}

        {mine.map((c) => {
          const factory = factoryById(c.matchedFactoryId)
          const st = CONSULT_STATUS[c.status]
          return (
            <Card key={c.id} className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wide text-primary">{c.orderNo}</span>
                <StatusBadge tone={st.tone}>{st[lang] || st.en}</StatusBadge>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white"
                  style={{ backgroundColor: factoryAvatar(c.matchedFactoryId || c.id) }}
                >
                  <Icon name="factory" className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">
                    {factory?.name || '—'}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-soft">
                    {formatDate(c.requestDate)}
                    {c.date ? ` · ${formatDate(c.date)} ${c.time}` : ''}
                    {c.matchScore ? ` · ${c.matchScore}% ${t('match')}` : ''}
                  </p>
                </div>
              </div>
              {c.note && (
                <p className="mt-2 rounded-xl bg-surface px-3 py-2 text-xs text-ink-soft">
                  “{c.note}”
                </p>
              )}
            </Card>
          )
        })}
      </div>

      <NewBookingModal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onBooked={(rec) => {
          setToast(`${t('bookingCreated')} (${rec.orderNo})`)
          setTimeout(() => setToast(''), 4000)
        }}
      />
    </div>
  )
}
