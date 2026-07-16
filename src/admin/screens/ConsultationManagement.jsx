import { useMemo, useState } from 'react'
import { useApp, formatDate } from '../../shared/context/AppContext.jsx'
import {
  CONSULT_STATUS,
  AI_REC_STATUS,
  BUSINESS_TYPES,
} from '../../shared/tokens.js'
import Table from '../../shared/components/Table.jsx'
import StatusBadge from '../../shared/components/StatusBadge.jsx'
import Button from '../../shared/components/Button.jsx'
import Card from '../../shared/components/Card.jsx'
import { Select } from '../../shared/components/Field.jsx'
import { Icon } from '../../user/components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'
import ConsultationDetailDrawer from '../components/ConsultationDetailDrawer.jsx'
import ResultRegistrationModal from '../components/ResultRegistrationModal.jsx'
import NewConsultationModal from '../components/NewConsultationModal.jsx'
import { exportConsultations } from '../excel.js'

const btLabel = (id) => BUSINESS_TYPES.find((b) => b.id === id)?.en || id

export default function ConsultationManagement() {
  const { consultations, factoryById } = useApp()

  const [statusFilter, setStatusFilter] = useState('')
  const [brandFilter, setBrandFilter] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState({ key: 'requestDate', dir: 'desc' })

  const [detailRow, setDetailRow] = useState(null)
  const [resultRow, setResultRow] = useState(null)
  const [resultReadOnly, setResultReadOnly] = useState(false)
  const [newOpen, setNewOpen] = useState(false)

  const filtered = useMemo(() => {
    let rows = consultations.filter((c) => {
      if (statusFilter && c.status !== statusFilter) return false
      if (brandFilter && c.brandType !== brandFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !c.orderNo.toLowerCase().includes(q) &&
          !c.applicantName.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
    const { key, dir } = sort
    rows = [...rows].sort((a, b) => {
      const av = a[key] ?? ''
      const bv = b[key] ?? ''
      const cmp = String(av).localeCompare(String(bv))
      return dir === 'asc' ? cmp : -cmp
    })
    return rows
  }, [consultations, statusFilter, brandFilter, search, sort])

  function toggleSort(key) {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }
    )
  }

  const columns = [
    {
      key: 'orderNo',
      header: 'Order No',
      sortable: true,
      render: (r) => <span className="font-semibold text-primary">{r.orderNo}</span>,
    },
    {
      key: 'requestDate',
      header: 'Request Date',
      sortable: true,
      render: (r) => <span className="whitespace-nowrap text-ink-soft">{formatDate(r.requestDate)}</span>,
    },
    {
      key: 'applicantName',
      header: 'Applicant',
      sortable: true,
      render: (r) => (
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-surface text-ink-soft">
            <Icon name={r.source === 'app' ? 'user' : 'plus'} className="h-4 w-4" />
          </span>
          <span className="font-medium text-ink">{r.applicantName}</span>
        </div>
      ),
    },
    {
      key: 'brandType',
      header: 'Brand Type',
      render: (r) => (
        <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-ink-soft">
          {btLabel(r.brandType)}
        </span>
      ),
    },
    {
      key: 'aiRecStatus',
      header: 'AI Rec.',
      render: (r) => {
        const ai = AI_REC_STATUS[r.aiRecStatus]
        return <StatusBadge tone={ai.tone} dot={false}>{ai.en}</StatusBadge>
      },
    },
    {
      key: 'status',
      header: 'Current Status',
      render: (r) => {
        const st = CONSULT_STATUS[r.status]
        return <StatusBadge tone={st.tone}>{st.en}</StatusBadge>
      },
    },
    {
      key: 'action',
      header: 'Action',
      cellClassName: 'text-right',
      className: 'text-right',
      render: (r) => {
        const canRegister = r.status === 'requested' || r.status === 'confirmed'
        return (
          <Button
            size="sm"
            variant={canRegister ? 'primary' : 'subtle'}
            onClick={(e) => {
              e.stopPropagation()
              setResultReadOnly(!canRegister)
              setResultRow(r)
            }}
          >
            {canRegister ? 'Register Result' : 'View Result'}
          </Button>
        )
      },
    },
  ]

  return (
    <div>
      <PageHeader
        title="Consultation Management"
        subtitle="Every booking from the buyer app lands here in real time."
        actions={
          <>
            <Button
              variant="secondary"
              icon={<Icon name="badge" className="h-4 w-4" />}
              onClick={() => exportConsultations(filtered, factoryById)}
            >
              Excel Download
            </Button>
            <Button
              icon={<Icon name="plus" className="h-4 w-4" />}
              onClick={() => setNewOpen(true)}
            >
              Register New
            </Button>
          </>
        }
      />

      {/* Filter bar */}
      <Card className="mb-4 p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-surface px-3 py-2">
            <Icon name="search" className="h-4 w-4 text-ink-soft" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order no or applicant…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink-soft/70"
            />
          </div>
          <Select
            className="!w-44"
            placeholder="All statuses"
            options={[
              { id: '', en: 'All statuses' },
              ...Object.entries(CONSULT_STATUS).map(([id, v]) => ({ id, en: v.en })),
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Select
            className="!w-52"
            options={[
              { id: '', en: 'All brand types' },
              ...BUSINESS_TYPES.map((b) => ({ id: b.id, en: b.en })),
            ]}
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          />
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <Table
          columns={columns}
          rows={filtered}
          sort={sort}
          onSort={toggleSort}
          onRowClick={(r) => setDetailRow(r)}
          empty="No consultations match your filters."
        />
      </Card>

      <p className="mt-3 text-xs text-ink-soft">
        Showing {filtered.length} of {consultations.length} consultations · click a row for full detail.
      </p>

      {/* Overlays */}
      <ConsultationDetailDrawer
        open={!!detailRow}
        consultation={detailRow}
        onClose={() => setDetailRow(null)}
      />
      <ResultRegistrationModal
        open={!!resultRow}
        consultation={resultRow}
        readOnly={resultReadOnly}
        onClose={() => setResultRow(null)}
      />
      <NewConsultationModal open={newOpen} onClose={() => setNewOpen(false)} />
    </div>
  )
}
