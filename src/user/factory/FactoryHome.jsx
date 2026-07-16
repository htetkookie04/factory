import { useNavigate } from 'react-router-dom'
import { useApp } from '../../shared/context/AppContext.jsx'
import { MANUFACTURER_STATUS } from '../../shared/tokens.js'
import { label } from '../../shared/i18n.js'
import Card from '../../shared/components/Card.jsx'
import StatusBadge from '../../shared/components/StatusBadge.jsx'
import { Icon } from '../components/Icon.jsx'

// Profile completeness = share of key fields that are filled in.
export function completeness(m) {
  if (!m) return 0
  const checks = [
    m.name,
    m.township,
    m.regNumber || m.regStatus !== 'registered',
    m.fabrics?.length,
    m.items?.length,
    m.monthlyCapacity,
    m.clients?.length,
    m.certifications?.length,
  ]
  const done = checks.filter(Boolean).length
  return Math.round((done / checks.length) * 100)
}

export default function FactoryHome({ factory }) {
  const { t, lang, consultations } = useApp()
  const navigate = useNavigate()

  const requests = consultations.filter((c) => c.matchedFactoryId === factory.id)
  const pending = requests.filter((c) => c.status === 'requested')
  const pct = completeness(factory)
  const st = MANUFACTURER_STATUS[factory.status]

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="rounded-b-3xl bg-primary px-5 pb-6 pt-12 text-white">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm text-white/70">{t('manageFactory')}</p>
            <h1 className="truncate text-xl font-bold">{factory.name}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={() => navigate('/app/notice')}
              className="grid h-11 w-11 place-items-center rounded-full bg-white/15"
              aria-label={t('noticeCenter')}
            >
              <Icon name="bell" className="h-5 w-5" />
            </button>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15">
              <Icon name="factory" className="h-6 w-6" />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <StatusBadge tone={st.tone}>{label(st, lang)}</StatusBadge>
        </div>
      </div>

      <div className="space-y-4 px-5 pt-5">
        {/* Profile completeness */}
        <Card className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">{t('profileCompleteness')}</span>
            <span className="text-sm font-bold text-primary">{pct}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-surface">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <button
            onClick={() => navigate('/factory/profile')}
            className="mt-3 text-xs font-semibold text-primary"
          >
            {t('factoryProfile')} →
          </button>
        </Card>

        {/* Incoming requests summary */}
        <button onClick={() => navigate('/factory/requests')} className="w-full text-left">
          <Card hover className="flex items-center gap-4 p-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Icon name="chat" className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">{t('incomingRequests')}</p>
              <p className="mt-0.5 text-xs text-ink-soft">
                {requests.length} total · {pending.length} {t('pendingRequests')}
              </p>
            </div>
            {pending.length > 0 && (
              <span className="grid h-7 min-w-7 place-items-center rounded-full bg-danger px-2 text-xs font-bold text-white">
                {pending.length}
              </span>
            )}
            <Icon name="arrowRight" className="h-5 w-5 text-ink-soft" />
          </Card>
        </button>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <p className="text-2xl font-bold text-ink">{factory.monthlyCapacity.toLocaleString()}</p>
            <p className="mt-0.5 text-xs text-ink-soft">{t('capacity')} / mo</p>
          </Card>
          <Card className="p-4">
            <p className="text-2xl font-bold text-ink">
              {requests.filter((c) => ['confirmed', 'completed', 'linked'].includes(c.status)).length}
            </p>
            <p className="mt-0.5 text-xs text-ink-soft">{t('accepted')}</p>
          </Card>
        </div>
      </div>
    </div>
  )
}
