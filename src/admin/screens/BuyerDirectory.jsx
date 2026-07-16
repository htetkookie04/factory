import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../shared/context/AppContext.jsx'
import { BUSINESS_TYPES, ACCOUNT_STATUS } from '../../shared/tokens.js'
import Table from '../../shared/components/Table.jsx'
import Card from '../../shared/components/Card.jsx'
import Button from '../../shared/components/Button.jsx'
import Modal from '../../shared/components/Modal.jsx'
import Drawer from '../../shared/components/Drawer.jsx'
import StatusBadge from '../../shared/components/StatusBadge.jsx'
import { Field, TextInput, Select } from '../../shared/components/Field.jsx'
import { Icon } from '../../user/components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'

const btLabel = (id) => BUSINESS_TYPES.find((b) => b.id === id)?.en || id
const statusOf = (b) => (b.status === 'suspended' ? 'suspended' : 'active')

export default function BuyerDirectory() {
  const { buyers, consultations, addBuyer, updateBuyer, deleteBuyer } = useApp()
  const [detail, setDetail] = useState(null)
  const [editing, setEditing] = useState(null) // buyer or {} for new

  const countFor = (id) => consultations.filter((c) => c.buyerId === id).length

  const columns = [
    { key: 'id', header: 'ID', render: (r) => <span className="font-semibold text-primary">{r.id}</span> },
    {
      key: 'name',
      header: 'Buyer / Brand',
      render: (r) => (
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {r.name.charAt(0)}
          </span>
          <span className="font-medium text-ink">{r.name}</span>
        </div>
      ),
    },
    {
      key: 'businessType',
      header: 'Brand Type',
      render: (r) => (
        <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-ink-soft">
          {btLabel(r.businessType)}
        </span>
      ),
    },
    { key: 'city', header: 'City', render: (r) => <span className="text-ink-soft">{r.city}</span> },
    {
      key: 'status',
      header: 'Status',
      render: (r) => {
        const st = ACCOUNT_STATUS[statusOf(r)]
        return <StatusBadge tone={st.tone}>{st.label}</StatusBadge>
      },
    },
    { key: 'requests', header: 'Requests', render: (r) => <span className="font-semibold text-ink">{countFor(r.id)}</span> },
    {
      key: 'action',
      header: 'Action',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <IconBtn icon="edit" title="Edit" onClick={(e) => { e.stopPropagation(); setEditing(r) }} />
          <IconBtn
            icon={statusOf(r) === 'active' ? 'clock' : 'check'}
            title={statusOf(r) === 'active' ? 'Suspend' : 'Activate'}
            onClick={(e) => { e.stopPropagation(); updateBuyer(r.id, { status: statusOf(r) === 'active' ? 'suspended' : 'active' }) }}
          />
          <IconBtn
            icon="trash"
            danger
            title="Delete"
            onClick={(e) => { e.stopPropagation(); if (confirm(`Delete ${r.name}?`)) deleteBuyer(r.id) }}
          />
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Buyers / Brands"
        subtitle={`${buyers.length} registered buyers`}
        actions={
          <Button icon={<Icon name="plus" className="h-4 w-4" />} onClick={() => setEditing({})}>
            Register New
          </Button>
        }
      />
      <Card className="overflow-hidden">
        <Table columns={columns} rows={buyers} onRowClick={setDetail} empty="No buyers registered yet." />
      </Card>

      <BuyerDrawer buyer={detail} onClose={() => setDetail(null)} countFor={countFor} />
      <BuyerForm
        editing={editing}
        onClose={() => setEditing(null)}
        onSave={(data) => {
          if (editing?.id) updateBuyer(editing.id, data)
          else addBuyer(data)
          setEditing(null)
        }}
      />
    </div>
  )
}

function BuyerDrawer({ buyer, onClose, countFor }) {
  if (!buyer) return null
  const st = ACCOUNT_STATUS[statusOf(buyer)]
  return (
    <Drawer open={!!buyer} onClose={onClose} title={buyer.name}>
      <div className="space-y-5">
        <div className="flex items-center gap-2">
          <StatusBadge tone={st.tone}>{st.label}</StatusBadge>
          <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-ink-soft">{btLabel(buyer.businessType)}</span>
        </div>
        <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-line bg-surface/50 p-4 text-sm">
          <Info label="ID" value={buyer.id} />
          <Info label="City" value={buyer.city} />
          <Info label="Contact Person" value={buyer.contactPerson || '—'} />
          <Info label="Phone" value={buyer.phone || '—'} />
          <Info label="User ID" value={buyer.userId || '—'} />
          <Info label="Consultations" value={countFor(buyer.id)} />
        </dl>
      </div>
    </Drawer>
  )
}

function BuyerForm({ editing, onClose, onSave }) {
  const [form, setForm] = useState({})
  useSync(editing, () =>
    setForm({
      name: editing?.name || '',
      businessType: editing?.businessType || 'startup',
      city: editing?.city || 'Yangon',
      contactPerson: editing?.contactPerson || '',
      phone: editing?.phone || '',
    })
  )
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  return (
    <Modal
      open={!!editing}
      onClose={onClose}
      title={editing?.id ? 'Edit Buyer' : 'Register New Buyer'}
      footer={
        <>
          <Button variant="subtle" onClick={onClose}>Cancel</Button>
          <Button disabled={!form.name?.trim()} onClick={() => onSave(form)}>Save</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Buyer / Brand Name" required>
          <TextInput value={form.name || ''} onChange={(e) => set('name', e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Brand Type">
            <Select options={BUSINESS_TYPES} value={form.businessType} onChange={(e) => set('businessType', e.target.value)} />
          </Field>
          <Field label="City">
            <TextInput value={form.city || ''} onChange={(e) => set('city', e.target.value)} />
          </Field>
          <Field label="Contact Person">
            <TextInput value={form.contactPerson || ''} onChange={(e) => set('contactPerson', e.target.value)} />
          </Field>
          <Field label="Phone">
            <TextInput value={form.phone || ''} onChange={(e) => set('phone', e.target.value)} />
          </Field>
        </div>
      </div>
    </Modal>
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

// keep local form state synced to the row being edited
function useSync(editing, fn) {
  const ref = useRef(fn)
  ref.current = fn
  const key = editing ? editing.id || 'new' : null
  useEffect(() => {
    if (editing) ref.current()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, editing])
}
