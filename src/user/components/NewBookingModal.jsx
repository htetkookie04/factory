import { useMemo, useState } from 'react'
import { useApp } from '../../shared/context/AppContext.jsx'
import { factoryAvatar } from '../../shared/tokens.js'
import Modal from '../../shared/components/Modal.jsx'
import Button from '../../shared/components/Button.jsx'
import { Field, TextInput, TextArea, Select } from '../../shared/components/Field.jsx'
import { Icon } from './Icon.jsx'

// Create a consultation booking directly from the Bookings tab (no AI flow).
// Buyer picks a verified factory, date, time and note. Writes ONE consultation
// row into the shared store — same contract the Admin table consumes.
export default function NewBookingModal({ open, onClose, onBooked }) {
  const { t, addConsultation, manufacturers, user } = useApp()
  const [factoryId, setFactoryId] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [note, setNote] = useState('')

  const verified = useMemo(
    () => manufacturers.filter((m) => m.status === 'verified'),
    [manufacturers]
  )
  const factory = verified.find((m) => m.id === factoryId) || null

  function reset() {
    setFactoryId(''); setDate(''); setTime(''); setNote('')
  }

  function confirm() {
    if (!factory) return
    const record = addConsultation({
      applicantName: user?.displayName || user?.name || 'Guest Buyer',
      buyerId: user?.id ?? null,
      brandType: user?.businessType || 'startup',
      fabricType: factory.fabrics?.[0] ?? null,
      itemType: factory.items?.[0] ?? null,
      location: factory.zone || factory.region || null,
      aiRecStatus: 'recommended',
      status: 'requested',
      matchedFactoryId: factory.id,
      matchScore: Math.min(99, Math.round((factory.rating || 4.5) * 18 + 10)),
      note,
      date,
      time,
      source: 'app',
      transcript: [
        { role: 'ai', text: 'Direct booking created from the Bookings tab.' },
        { role: 'user', text: `Factory: ${factory.name}` },
      ],
    })
    onBooked?.(record)
    onClose()
    reset()
  }

  return (
    <Modal
      open={open}
      onClose={() => { onClose(); reset() }}
      title={t('newBooking')}
      footer={
        <>
          <Button variant="subtle" onClick={() => { onClose(); reset() }}>
            {t('cancel')}
          </Button>
          <Button disabled={!factory || !date || !time} onClick={confirm}>
            {t('confirmBooking')}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label={t('factory')} required>
          <Select
            placeholder={t('selectFactory')}
            options={verified.map((m) => ({ id: m.id, en: m.name }))}
            value={factoryId}
            onChange={(e) => setFactoryId(e.target.value)}
          />
        </Field>

        {/* Live preview of the chosen factory */}
        {factory ? (
          <div className="flex items-center gap-3 rounded-2xl bg-surface p-3">
            <div
              className="grid h-11 w-11 place-items-center rounded-xl text-white"
              style={{ backgroundColor: factoryAvatar(factory.id) }}
            >
              <Icon name="factory" className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{factory.name}</p>
              <p className="text-xs text-ink-soft">
                ⭐ {factory.rating} · {factory.monthlyCapacity.toLocaleString()} units/mo
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-ink-soft">{t('chooseFactoryFirst')}</p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label={t('date')} required>
            <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label={t('time')} required>
            <TextInput type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </Field>
        </div>

        <Field label={t('note')}>
          <TextArea
            placeholder={t('notePlaceholder')}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </Field>
      </div>
    </Modal>
  )
}
