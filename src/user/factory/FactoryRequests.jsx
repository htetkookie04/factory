import { useNavigate } from 'react-router-dom'
import { useApp, formatDate } from '../../shared/context/AppContext.jsx'
import {
  CONSULT_STATUS,
  BUSINESS_TYPES,
  FABRIC_TYPES,
  ITEM_TYPES,
} from '../../shared/tokens.js'
import { label } from '../../shared/i18n.js'
import Card from '../../shared/components/Card.jsx'
import Button from '../../shared/components/Button.jsx'
import StatusBadge from '../../shared/components/StatusBadge.jsx'
import { Icon } from '../components/Icon.jsx'

const find = (arr, id, lang) => {
  const o = arr.find((x) => x.id === id)
  return o ? label(o, lang) : '—'
}

// Buyer bookings routed to this factory. Accept -> confirmed, Decline -> cancelled.
export default function FactoryRequests({ factory }) {
  const { t, lang, consultations, updateConsultation } = useApp()
  const navigate = useNavigate()

  const requests = consultations
    .filter((c) => c.matchedFactoryId === factory.id)
    .sort((a, b) => (a.status === 'requested' ? -1 : 1))

  return (
    <div className="min-h-full">
      <div className="border-b border-line bg-white px-5 pb-4 pt-12">
        <h1 className="text-xl font-bold text-ink">{t('consultationRequests')}</h1>
      </div>

      <div className="space-y-3 px-5 py-5">
        {requests.length === 0 && (
          <div className="mt-16 flex flex-col items-center text-center text-ink-soft">
            <Icon name="chat" className="h-12 w-12 opacity-40" />
            <p className="mt-3 text-sm">{t('noRequests')}</p>
          </div>
        )}

        {requests.map((c) => {
          const st = CONSULT_STATUS[c.status]
          const isPending = c.status === 'requested'
          return (
            <Card
              key={c.id}
              hover
              onClick={() => navigate(`/factory/requests/${c.id}`)}
              className="p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wide text-primary">{c.orderNo}</span>
                <StatusBadge tone={st.tone}>{label(st, lang)}</StatusBadge>
              </div>

              <div className="mt-2">
                <p className="text-sm font-semibold text-ink">{c.applicantName}</p>
                <p className="mt-0.5 text-xs text-ink-soft">
                  {find(BUSINESS_TYPES, c.brandType, lang)} · {formatDate(c.requestDate)}
                </p>
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {c.fabricType && (
                  <span className="rounded-full bg-surface px-2.5 py-1 text-xs text-ink-soft">
                    {find(FABRIC_TYPES, c.fabricType, lang)}
                  </span>
                )}
                {c.itemType && (
                  <span className="rounded-full bg-surface px-2.5 py-1 text-xs text-ink-soft">
                    {find(ITEM_TYPES, c.itemType, lang)}
                  </span>
                )}
                {c.date && (
                  <span className="rounded-full bg-surface px-2.5 py-1 text-xs text-ink-soft">
                    {formatDate(c.date)} {c.time}
                  </span>
                )}
              </div>

              {c.note && (
                <p className="mt-2 rounded-xl bg-surface px-3 py-2 text-xs text-ink-soft">“{c.note}”</p>
              )}

              {isPending && (
                <div className="mt-3 flex gap-2">
                  <Button
                    variant="subtle"
                    full
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); updateConsultation(c.id, { status: 'cancelled' }) }}
                  >
                    {t('decline')}
                  </Button>
                  <Button
                    full
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); updateConsultation(c.id, { status: 'confirmed' }) }}
                  >
                    {t('accept')}
                  </Button>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}
