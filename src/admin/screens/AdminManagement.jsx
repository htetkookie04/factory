import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../shared/context/AppContext.jsx'
import { ADMIN_ROLES, ACCOUNT_STATUS } from '../../shared/tokens.js'
import Table from '../../shared/components/Table.jsx'
import Card from '../../shared/components/Card.jsx'
import Button from '../../shared/components/Button.jsx'
import Modal from '../../shared/components/Modal.jsx'
import StatusBadge from '../../shared/components/StatusBadge.jsx'
import { Field, TextInput, Select } from '../../shared/components/Field.jsx'
import { Icon } from '../../user/components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'

const roleLabel = (id) => ADMIN_ROLES.find((r) => r.id === id)?.label || id
const ROLE_TONE = { super_admin: 'primary', coordinator: 'info', viewer: 'muted' }
const statusOf = (a) => (a.status === 'suspended' ? 'suspended' : 'active')

export default function AdminManagement() {
  const { admins, addAdmin, updateAdmin, deleteAdmin } = useApp()
  const [editing, setEditing] = useState(null)

  const columns = [
    { key: 'id', header: 'ID', render: (r) => <span className="font-semibold text-primary">{r.id}</span> },
    {
      key: 'name',
      header: 'Name',
      render: (r) => (
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {r.name.charAt(0)}
          </span>
          <span className="font-medium text-ink">{r.name}</span>
        </div>
      ),
    },
    { key: 'email', header: 'Email', render: (r) => <span className="text-ink-soft">{r.email}</span> },
    {
      key: 'role',
      header: 'Role',
      render: (r) => <StatusBadge tone={ROLE_TONE[r.role] || 'muted'} dot={false}>{roleLabel(r.role)}</StatusBadge>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => {
        const st = ACCOUNT_STATUS[statusOf(r)]
        return <StatusBadge tone={st.tone}>{st.label}</StatusBadge>
      },
    },
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
            onClick={(e) => { e.stopPropagation(); updateAdmin(r.id, { status: statusOf(r) === 'active' ? 'suspended' : 'active' }) }}
          />
          <IconBtn
            icon="trash"
            danger
            title="Delete"
            onClick={(e) => {
              e.stopPropagation()
              if (r.role === 'super_admin') { alert('A Super Admin cannot be deleted.'); return }
              if (confirm(`Delete ${r.name}?`)) deleteAdmin(r.id)
            }}
          />
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Admin Management"
        subtitle="Manage coordinator console accounts and their roles."
        actions={
          <Button icon={<Icon name="plus" className="h-4 w-4" />} onClick={() => setEditing({})}>
            Add Admin
          </Button>
        }
      />

      {/* Role legend */}
      <div className="mb-4 flex flex-wrap gap-2">
        {ADMIN_ROLES.map((r) => (
          <span key={r.id} className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-xs text-ink-soft">
            <StatusBadge tone={ROLE_TONE[r.id]} dot={false}>{r.label}</StatusBadge>
          </span>
        ))}
      </div>

      <Card className="overflow-hidden">
        <Table columns={columns} rows={admins} empty="No admins yet." />
      </Card>

      <AdminForm
        editing={editing}
        onClose={() => setEditing(null)}
        onSave={(data) => {
          if (editing?.id) updateAdmin(editing.id, data)
          else addAdmin(data)
          setEditing(null)
        }}
      />
    </div>
  )
}

function AdminForm({ editing, onClose, onSave }) {
  const [form, setForm] = useState({})
  useSync(editing, () =>
    setForm({
      name: editing?.name || '',
      email: editing?.email || '',
      role: editing?.role || 'coordinator',
      status: editing?.status || 'active',
    })
  )
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  return (
    <Modal
      open={!!editing}
      onClose={onClose}
      title={editing?.id ? 'Edit Admin' : 'Add Admin'}
      footer={
        <>
          <Button variant="subtle" onClick={onClose}>Cancel</Button>
          <Button disabled={!form.name?.trim() || !form.email?.trim()} onClick={() => onSave(form)}>Save</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Name" required>
          <TextInput value={form.name || ''} onChange={(e) => set('name', e.target.value)} />
        </Field>
        <Field label="Email" required>
          <TextInput type="email" value={form.email || ''} onChange={(e) => set('email', e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Role">
            <Select
              options={ADMIN_ROLES.map((r) => ({ id: r.id, en: r.label }))}
              value={form.role}
              onChange={(e) => set('role', e.target.value)}
            />
          </Field>
          <Field label="Status">
            <Select
              options={[{ id: 'active', en: 'Active' }, { id: 'suspended', en: 'Suspended' }]}
              value={form.status}
              onChange={(e) => set('status', e.target.value)}
            />
          </Field>
        </div>
      </div>
    </Modal>
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

function useSync(editing, fn) {
  const ref = useRef(fn)
  ref.current = fn
  const key = editing ? editing.id || 'new' : null
  useEffect(() => {
    if (editing) ref.current()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, editing])
}
