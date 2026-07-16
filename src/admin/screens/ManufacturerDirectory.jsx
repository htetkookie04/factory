import { useState } from 'react'
import { useApp } from '../../shared/context/AppContext.jsx'
import {
  MANUFACTURER_STATUS,
  MANUFACTURER_APPLIED_OPTIONS,
  REGIONS,
  YANGON_ZONES,
  FABRIC_TYPES,
  ITEM_TYPES,
} from '../../shared/tokens.js'
import Table from '../../shared/components/Table.jsx'
import Card from '../../shared/components/Card.jsx'
import Button from '../../shared/components/Button.jsx'
import Drawer from '../../shared/components/Drawer.jsx'
import StatusBadge from '../../shared/components/StatusBadge.jsx'
import { Icon } from '../../user/components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'

const regionLabel = (id) => REGIONS.find((r) => r.id === id)?.en || id
const zoneLabel = (id) => YANGON_ZONES.find((z) => z.id === id)?.en || id
const listLabel = (ids, src) => (ids || []).map((i) => src.find((o) => o.id === i)?.en || i)

export default function ManufacturerDirectory() {
  const { manufacturers, updateManufacturer, deleteManufacturer } = useApp()
  const [detail, setDetail] = useState(null)

  const columns = [
    { key: 'id', header: 'ID', render: (r) => <span className="font-semibold text-primary">{r.id}</span> },
    { key: 'name', header: 'Factory', render: (r) => <span className="font-medium text-ink">{r.name}</span> },
    { key: 'region', header: 'Region', render: (r) => <span className="text-ink-soft">{regionLabel(r.region)}</span> },
    {
      key: 'fabrics',
      header: 'Fabrics',
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {listLabel(r.fabrics, FABRIC_TYPES).map((f) => (
            <span key={f} className="rounded-full bg-surface px-2 py-0.5 text-xs text-ink-soft">{f}</span>
          ))}
        </div>
      ),
    },
    { key: 'capacity', header: 'Capacity', render: (r) => <span className="text-ink-soft">{r.monthlyCapacity.toLocaleString()}/mo</span> },
    {
      key: 'status',
      header: 'Status',
      render: (r) => {
        const st = MANUFACTURER_STATUS[r.status] || MANUFACTURER_STATUS.pending
        return <StatusBadge tone={st.tone}>{st.en}</StatusBadge>
      },
    },
    {
      key: 'action',
      header: 'Action',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <StatusSelect
            value={['pending', 'verified', 'rejected'].includes(r.status) ? r.status : 'pending'}
            onChange={(next) =>
              updateManufacturer(r.id, {
                status: next,
                // give a default rating on first confirmation
                rating: next === 'verified' && !r.rating ? 4.5 : r.rating,
              })
            }
          />
          <Button size="sm" variant="secondary" onClick={() => setDetail(r)}>View</Button>
          <IconBtn icon="trash" danger title="Delete" onClick={() => { if (confirm(`Delete ${r.name}?`)) deleteManufacturer(r.id) }} />
        </div>
      ),
    },
  ]

  const pendingCount = manufacturers.filter((m) => m.status === 'pending').length

  return (
    <div>
      <PageHeader
        title="Manufacturer Directory"
        subtitle={`${manufacturers.length} factories · ${pendingCount} newly applied`}
      />
      <Card className="overflow-hidden">
        <Table columns={columns} rows={manufacturers} onRowClick={setDetail} empty="No manufacturers yet." />
      </Card>

      <ManufacturerDrawer factory={detail} onClose={() => setDetail(null)} />
    </div>
  )
}

function ManufacturerDrawer({ factory, onClose }) {
  if (!factory) return null
  const st = MANUFACTURER_STATUS[factory.status] || MANUFACTURER_STATUS.pending
  return (
    <Drawer open={!!factory} onClose={onClose} title={factory.name} width="max-w-lg">
      <div className="space-y-5">
        <StatusBadge tone={st.tone}>{st.en}</StatusBadge>
        <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-line bg-surface/50 p-4 text-sm">
          <Info label="ID" value={factory.id} />
          <Info label="Region" value={regionLabel(factory.region)} />
          {factory.zone && <Info label="Industrial Zone" value={zoneLabel(factory.zone)} />}
          <Info label="Township" value={factory.township || '—'} />
          <Info label="Registration" value={factory.regNumber || factory.regStatus} />
          <Info label="Capacity" value={`${factory.monthlyCapacity.toLocaleString()}/mo`} />
        </dl>
        <Block title="Fabrics" items={listLabel(factory.fabrics, FABRIC_TYPES)} />
        <Block title="Items" items={listLabel(factory.items, ITEM_TYPES)} />
        <Block title="Clients" items={factory.clients} />
        <Block title="Certifications" items={factory.certifications} />
      </div>
    </Drawer>
  )
}

function Block({ title, items }) {
  if (!items || items.length === 0) return null
  return (
    <div>
      <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-soft">{title}</h4>
      <div className="flex flex-wrap gap-1.5">
        {items.map((i) => (
          <span key={i} className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-ink">{i}</span>
        ))}
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

// Compact applied-status changer: Applied / Confirmed / Rejected.
function StatusSelect({ value, onChange }) {
  const tone = MANUFACTURER_STATUS[value]?.tone || 'muted'
  const ring = {
    success: 'border-success/40 text-success',
    warning: 'border-warning/50 text-[#a9781f]',
    danger: 'border-danger/40 text-danger',
    muted: 'border-line text-ink-soft',
  }[tone]
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-full border bg-white px-3 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-primary/20 ${ring}`}
    >
      {MANUFACTURER_APPLIED_OPTIONS.map((o) => (
        <option key={o.id} value={o.id}>{o.label}</option>
      ))}
    </select>
  )
}

function IconBtn({ icon, onClick, danger, title }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`grid h-8 w-8 place-items-center rounded-lg transition-colors hover:bg-surface ${danger ? 'text-danger' : 'text-ink-soft'}`}
    >
      <Icon name={icon} className="h-4 w-4" />
    </button>
  )
}
