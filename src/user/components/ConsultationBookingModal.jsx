import { useState } from 'react'
import { useApp } from '../../shared/context/AppContext.jsx'
import Modal from '../../shared/components/Modal.jsx'
import Button from '../../shared/components/Button.jsx'
import { Field, TextInput, TextArea } from '../../shared/components/Field.jsx'
import { factoryAvatar } from '../../shared/tokens.js'
import { Icon } from './Icon.jsx'

// Opens from a FactoryRecommendationCard. On confirm, writes ONE consultation
// row into the shared store (the data contract consumed by the Admin table).
export default function ConsultationBookingModal({ open, onClose, factory, answers, onBooked }) {
  const { t, addConsultation, user } = useApp()
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [note, setNote] = useState('')

  if (!factory) return null

  function confirm() {
    const record = addConsultation({
      applicantName: user?.displayName || user?.name || 'Guest Buyer',
      buyerId: user?.id ?? null,
      brandType: user?.businessType || 'startup',
      fabricType: answers?.fabricType,
      itemType: answers?.itemType,
      location: answers?.location,
      aiRecStatus: 'recommended',
      status: 'requested',
      matchedFactoryId: factory.id,
      matchScore: factory.matchScore,
      note,
      date,
      time,
      source: 'app',
      transcript: answers?.transcript || [],
    })
    onBooked?.(record)
    onClose()
    setDate(''); setTime(''); setNote('')
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('bookingTitle')}
      footer={
        <>
          <Button variant="subtle" onClick={onClose}>
            {t('cancel')}
          </Button>
          <Button disabled={!date || !time} onClick={confirm}>
            {t('confirmBooking')}
          </Button>
        </>
      }
    >
      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-surface p-3">
        <div
          className="grid h-11 w-11 place-items-center rounded-xl text-white"
          style={{ backgroundColor: factoryAvatar(factory.id) }}
        >
          <Icon name="factory" className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">{factory.name}</p>
          <p className="text-xs text-primary">{factory.matchScore}% {t('match')}</p>
        </div>
      </div>

      <div className="space-y-4">
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
