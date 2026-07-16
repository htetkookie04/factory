import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp, formatDate } from '../../shared/context/AppContext.jsx'
import {
  CONSULT_STATUS,
  BUSINESS_TYPES,
  FABRIC_TYPES,
  ITEM_TYPES,
} from '../../shared/tokens.js'
import { label } from '../../shared/i18n.js'
import Button from '../../shared/components/Button.jsx'
import Card from '../../shared/components/Card.jsx'
import StatusBadge from '../../shared/components/StatusBadge.jsx'
import { Field, TextArea } from '../../shared/components/Field.jsx'
import ChatBubble from '../components/ChatBubble.jsx'
import { Icon } from '../components/Icon.jsx'

const find = (arr, id, lang) => {
  const o = arr.find((x) => x.id === id)
  return o ? label(o, lang) : '—'
}

export default function FactoryRequestDetail({ factory }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, lang, consultations, updateConsultation } = useApp()
  const c = consultations.find((x) => x.id === id)

  const [note, setNote] = useState(c?.factoryNote || '')
  const [toast, setToast] = useState('')

  if (!c || c.matchedFactoryId !== factory.id) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center gap-4 px-6">
        <p className="text-ink-soft">Request not found.</p>
        <Button onClick={() => navigate('/factory/requests')}>{t('requestsTab')}</Button>
      </div>
    )
  }

  const st = CONSULT_STATUS[c.status]
  const isPending = c.status === 'requested'

  function saveNote() {
    updateConsultation(c.id, { factoryNote: note })
    setToast(t('noteSaved'))
    setTimeout(() => setToast(''), 2500)
  }

  return (
    <div className="min-h-full pb-6">
      {/* Header */}
      <div className="border-b border-line bg-white px-5 pb-3 pt-12">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/factory/requests')}
            className="grid h-9 w-9 place-items-center rounded-full bg-surface text-ink"
          >
            <Icon name="arrowLeft" className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-ink">{t('requestDetail')}</h1>
        </div>
      </div>

      {toast && (
        <div className="mx-5 mt-4 flex items-center gap-2 rounded-2xl bg-success/12 px-4 py-3 text-sm font-medium text-success animate-slide-up">
          <Icon name="check" className="h-5 w-5" strokeWidth={2.5} />
          {toast}
        </div>
      )}

      <div className="space-y-4 px-5 py-5">
        {/* Order summary */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold tracking-wide text-primary">{c.orderNo}</span>
            <StatusBadge tone={st.tone}>{label(st, lang)}</StatusBadge>
          </div>
          <p className="mt-2 text-lg font-bold text-ink">{c.applicantName}</p>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <Info label={t('businessType')} value={find(BUSINESS_TYPES, c.brandType, lang)} />
            <Info label={t('date')} value={formatDate(c.requestDate)} />
            <Info label={t('fabrics')} value={c.fabricType ? find(FABRIC_TYPES, c.fabricType, lang) : '—'} />
            <Info label={t('items')} value={c.itemType ? find(ITEM_TYPES, c.itemType, lang) : '—'} />
            {c.date && <Info label={t('time')} value={`${formatDate(c.date)} ${c.time}`} />}
            {c.matchScore ? <Info label={t('match')} value={`${c.matchScore}%`} /> : null}
          </dl>
        </Card>

        {/* Buyer note */}
        {c.note && (
          <Section title={t('buyerNote')}>
            <p className="rounded-2xl bg-surface p-3 text-sm text-ink">“{c.note}”</p>
          </Section>
        )}

        {/* AI transcript */}
        {c.transcript?.length > 0 && (
          <Section title={t('aiTitle')}>
            <div className="space-y-2 rounded-2xl bg-surface/60 p-3">
              {c.transcript.map((m, i) => (
                <ChatBubble key={i} role={m.role}>{m.text}</ChatBubble>
              ))}
            </div>
          </Section>
        )}

        {/* Factory note — editable */}
        <Section title={t('factoryNote')}>
          <Field>
            <TextArea
              rows={4}
              placeholder={t('factoryNotePlaceholder')}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Field>
          <Button
            full
            className="mt-2"
            disabled={note === (c.factoryNote || '')}
            onClick={saveNote}
          >
            {t('saveNote')}
          </Button>
        </Section>

        {/* Accept / Decline for pending requests */}
        {isPending && (
          <div className="flex gap-2 pt-2">
            <Button variant="subtle" full onClick={() => updateConsultation(c.id, { status: 'cancelled' })}>
              {t('decline')}
            </Button>
            <Button full onClick={() => updateConsultation(c.id, { status: 'confirmed' })}>
              {t('accept')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-ink-soft">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink">{value}</dd>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-soft">{title}</h3>
      {children}
    </div>
  )
}
