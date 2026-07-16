import { useApp } from '../../shared/context/AppContext.jsx'
import {
  FABRIC_TYPES,
  REGIONS,
  CONSULT_STATUS,
  colors,
} from '../../shared/tokens.js'
import Card from '../../shared/components/Card.jsx'
import PageHeader from '../components/PageHeader.jsx'

function tally(rows, key, source) {
  const counts = {}
  rows.forEach((r) => {
    const k = r[key]
    if (!k) return
    counts[k] = (counts[k] || 0) + 1
  })
  return source
    .map((opt) => ({ label: opt.en, value: counts[opt.id] || 0 }))
    .filter((d) => d.value > 0)
}

// Pure CSS/SVG bars — no external chart dependency.
function BarChart({ data, color = colors.primary }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  return (
    <div className="space-y-3">
      {data.length === 0 && <p className="text-sm text-ink-soft">No data.</p>}
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-sm text-ink-soft">{d.label}</span>
          <div className="h-6 flex-1 overflow-hidden rounded-full bg-surface">
            <div
              className="flex h-full items-center justify-end rounded-full px-2 text-xs font-semibold text-white transition-all"
              style={{ width: `${(d.value / max) * 100}%`, backgroundColor: color, minWidth: '1.5rem' }}
            >
              {d.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Reports() {
  const { consultations } = useApp()

  const byFabric = tally(consultations, 'fabricType', FABRIC_TYPES)
  const byRegion = tally(consultations, 'location', REGIONS)
  const byStatus = Object.entries(CONSULT_STATUS)
    .map(([id, v]) => ({
      label: v.en,
      value: consultations.filter((c) => c.status === id).length,
      tone: v.tone,
    }))
    .filter((d) => d.value > 0)

  return (
    <div>
      <PageHeader title="Reports" subtitle="Consultation analytics across the platform." />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-5 font-bold text-ink">Requests by Fabric Type</h2>
          <BarChart data={byFabric} color={colors.primary} />
        </Card>

        <Card className="p-6">
          <h2 className="mb-5 font-bold text-ink">Requests by Region</h2>
          <BarChart data={byRegion} color={colors.primaryLight} />
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="mb-5 font-bold text-ink">Requests by Status</h2>
          <div className="grid gap-4 sm:grid-cols-5">
            {byStatus.map((d) => (
              <div key={d.label} className="rounded-2xl bg-surface p-4 text-center">
                <p className="text-3xl font-bold text-ink">{d.value}</p>
                <p className="mt-1 text-xs text-ink-soft">{d.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
