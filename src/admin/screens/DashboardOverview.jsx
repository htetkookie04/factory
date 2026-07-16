import { useNavigate } from 'react-router-dom'
import { useApp, formatDate } from '../../shared/context/AppContext.jsx'
import { CONSULT_STATUS, BUSINESS_TYPES } from '../../shared/tokens.js'
import Card from '../../shared/components/Card.jsx'
import StatusBadge from '../../shared/components/StatusBadge.jsx'
import { Icon } from '../../user/components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'

const btLabel = (id) => BUSINESS_TYPES.find((b) => b.id === id)?.en || id

export default function DashboardOverview() {
  const { consultations, manufacturers, buyers } = useApp()
  const navigate = useNavigate()

  const total = consultations.length
  const pending = consultations.filter((c) => c.status === 'requested').length
  const completed = consultations.filter((c) => ['completed', 'linked'].includes(c.status)).length
  const conversion = total ? Math.round((completed / total) * 100) : 0

  const kpis = [
    { label: 'Total Requests', value: total, icon: 'chat', tone: '#6F4E37' },
    { label: 'Pending', value: pending, icon: 'clock', tone: '#E0A63A' },
    { label: 'Verified Factories', value: manufacturers.filter((m) => m.status === 'verified').length, icon: 'factory', tone: '#A07C5B' },
    { label: 'Conversion Rate', value: `${conversion}%`, icon: 'badge', tone: '#8A6244' },
  ]

  const recent = [...consultations].slice(0, 6)

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Coordinator overview at a glance." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5">
            <div
              className="grid h-11 w-11 place-items-center rounded-2xl text-white"
              style={{ backgroundColor: k.tone }}
            >
              <Icon name={k.icon} className="h-5 w-5" />
            </div>
            <p className="mt-4 text-3xl font-bold text-ink">{k.value}</p>
            <p className="mt-1 text-sm text-ink-soft">{k.label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-ink">Recent Consultations</h2>
            <button
              onClick={() => navigate('/admin/consultations')}
              className="text-sm font-semibold text-primary"
            >
              View all →
            </button>
          </div>
          <div className="divide-y divide-line">
            {recent.map((c) => {
              const st = CONSULT_STATUS[c.status]
              return (
                <div
                  key={c.id}
                  className="flex items-center gap-3 py-3 cursor-pointer"
                  onClick={() => navigate('/admin/consultations')}
                >
                  <span className="text-sm font-semibold text-primary">{c.orderNo}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{c.applicantName}</p>
                    <p className="text-xs text-ink-soft">{btLabel(c.brandType)} · {formatDate(c.requestDate)}</p>
                  </div>
                  <StatusBadge tone={st.tone}>{st.en}</StatusBadge>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="mb-4 font-bold text-ink">Registered Buyers</h2>
          <p className="text-4xl font-bold text-primary">{buyers.length}</p>
          <p className="mt-1 text-sm text-ink-soft">brands & buyers on the platform</p>
          <div className="mt-4 space-y-2">
            {buyers.slice(0, 4).map((b) => (
              <div key={b.id} className="flex items-center gap-2 text-sm">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {b.name.charAt(0)}
                </span>
                <span className="truncate text-ink">{b.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
