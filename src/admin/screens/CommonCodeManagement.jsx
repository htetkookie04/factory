import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../shared/context/AppContext.jsx'
import Card from '../../shared/components/Card.jsx'
import Button from '../../shared/components/Button.jsx'
import Modal from '../../shared/components/Modal.jsx'
import Table from '../../shared/components/Table.jsx'
import StatusBadge from '../../shared/components/StatusBadge.jsx'
import { Field, TextInput } from '../../shared/components/Field.jsx'
import { Icon } from '../../user/components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'

export default function CommonCodeManagement() {
  const { codeGroups, addCodeGroup, deleteCodeGroup, upsertCode, deleteCode } = useApp()
  const [activeId, setActiveId] = useState(codeGroups[0]?.id || null)
  const [groupModal, setGroupModal] = useState(false)
  const [codeEditing, setCodeEditing] = useState(null)

  const group = codeGroups.find((g) => g.id === activeId) || codeGroups[0]

  const columns = [
    { key: 'order', header: '#', render: (r) => <span className="text-ink-soft">{r.order}</span> },
    { key: 'code', header: 'Code', render: (r) => <span className="font-mono text-xs font-semibold text-primary">{r.code}</span> },
    { key: 'label', header: 'Label (EN)', render: (r) => <span className="font-medium text-ink">{r.label}</span> },
    { key: 'labelMy', header: 'Label (MY)', render: (r) => <span className="text-ink-soft">{r.labelMy || '—'}</span> },
    {
      key: 'active',
      header: 'Active',
      render: (r) => <StatusBadge tone={r.active ? 'success' : 'muted'}>{r.active ? 'Active' : 'Inactive'}</StatusBadge>,
    },
    {
      key: 'action',
      header: 'Action',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-1">
          <IconBtn icon="edit" title="Edit" onClick={(e) => { e.stopPropagation(); setCodeEditing(r) }} />
          <IconBtn
            icon={r.active ? 'clock' : 'check'}
            title={r.active ? 'Deactivate' : 'Activate'}
            onClick={(e) => { e.stopPropagation(); upsertCode(group.id, r.code, { active: !r.active }) }}
          />
          <IconBtn icon="trash" danger title="Delete" onClick={(e) => { e.stopPropagation(); if (confirm(`Delete code "${r.code}"?`)) deleteCode(group.id, r.code) }} />
        </div>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Common Codes"
        subtitle="Central registry of reference values (dropdowns, chips, statuses)."
        actions={
          <Button icon={<Icon name="plus" className="h-4 w-4" />} onClick={() => setGroupModal(true)}>
            New Group
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
        {/* Group list */}
        <Card className="h-fit overflow-hidden p-2">
          {codeGroups.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveId(g.id)}
              className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                g.id === group?.id ? 'bg-primary text-white' : 'text-ink hover:bg-surface'
              }`}
            >
              <span>
                <span className="block font-semibold">{g.name}</span>
                <span className={`block font-mono text-[11px] ${g.id === group?.id ? 'text-white/70' : 'text-ink-soft'}`}>
                  {g.id} · {g.codes.length}
                </span>
              </span>
              <span
                role="button"
                onClick={(e) => { e.stopPropagation(); if (confirm(`Delete group "${g.name}" and all its codes?`)) { deleteCodeGroup(g.id); setActiveId(codeGroups.find((x) => x.id !== g.id)?.id || null) } }}
                className={`opacity-0 transition-opacity group-hover:opacity-100 ${g.id === group?.id ? 'text-white/80' : 'text-danger'}`}
              >
                <Icon name="trash" className="h-4 w-4" />
              </span>
            </button>
          ))}
        </Card>

        {/* Codes table */}
        <div>
          {group ? (
            <>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-bold text-ink">{group.name} <span className="font-mono text-xs text-ink-soft">({group.id})</span></h2>
                <Button size="sm" icon={<Icon name="plus" className="h-4 w-4" />} onClick={() => setCodeEditing({})}>
                  Add Code
                </Button>
              </div>
              <Card className="overflow-hidden">
                <Table columns={columns} rows={[...group.codes].sort((a, b) => a.order - b.order)} empty="No codes in this group." />
              </Card>
            </>
          ) : (
            <p className="text-sm text-ink-soft">No code group selected.</p>
          )}
        </div>
      </div>

      <GroupModal open={groupModal} onClose={() => setGroupModal(false)} onSave={(id, name) => { addCodeGroup(id, name); setActiveId(id); setGroupModal(false) }} />
      <CodeModal
        editing={codeEditing}
        onClose={() => setCodeEditing(null)}
        onSave={(data) => { upsertCode(group.id, data.code, data); setCodeEditing(null) }}
      />
    </div>
  )
}

function GroupModal({ open, onClose, onSave }) {
  const [id, setId] = useState('')
  const [name, setName] = useState('')
  useEffect(() => { if (open) { setId(''); setName('') } }, [open])
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Code Group"
      footer={
        <>
          <Button variant="subtle" onClick={onClose}>Cancel</Button>
          <Button disabled={!id.trim() || !name.trim()} onClick={() => onSave(id.trim().toUpperCase().replace(/\s+/g, '_'), name.trim())}>Save</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Group ID" hint="e.g. PAYMENT_METHOD — uppercase, no spaces">
          <TextInput value={id} onChange={(e) => setId(e.target.value)} placeholder="GROUP_ID" />
        </Field>
        <Field label="Group Name">
          <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Human-readable name" />
        </Field>
      </div>
    </Modal>
  )
}

function CodeModal({ editing, onClose, onSave }) {
  const [form, setForm] = useState({})
  useSync(editing, () =>
    setForm({
      code: editing?.code || '',
      label: editing?.label || '',
      labelMy: editing?.labelMy || '',
      order: editing?.order || 1,
      active: editing?.active ?? true,
    })
  )
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const isEdit = !!editing?.code
  return (
    <Modal
      open={!!editing}
      onClose={onClose}
      title={isEdit ? 'Edit Code' : 'Add Code'}
      footer={
        <>
          <Button variant="subtle" onClick={onClose}>Cancel</Button>
          <Button disabled={!form.code?.trim() || !form.label?.trim()} onClick={() => onSave(form)}>Save</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Code" hint={isEdit ? undefined : 'lowercase key, e.g. woven'}>
          <TextInput value={form.code || ''} disabled={isEdit} onChange={(e) => set('code', e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Label (EN)">
            <TextInput value={form.label || ''} onChange={(e) => set('label', e.target.value)} />
          </Field>
          <Field label="Label (MY)">
            <TextInput value={form.labelMy || ''} onChange={(e) => set('labelMy', e.target.value)} />
          </Field>
          <Field label="Order">
            <TextInput type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value) || 1)} />
          </Field>
          <Field label="Active">
            <label className="flex h-[46px] items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={!!form.active} onChange={(e) => set('active', e.target.checked)} className="h-4 w-4 accent-[#6F4E37]" />
              Active
            </label>
          </Field>
        </div>
      </div>
    </Modal>
  )
}

function IconBtn({ icon, onClick, danger, title }) {
  return (
    <button title={title} onClick={onClick} className={`grid h-8 w-8 place-items-center rounded-lg transition-colors hover:bg-surface ${danger ? 'text-danger' : 'text-ink-soft'}`}>
      <Icon name={icon} className="h-4 w-4" />
    </button>
  )
}

function useSync(editing, fn) {
  const ref = useRef(fn)
  ref.current = fn
  const key = editing ? editing.code || 'new' : null
  useEffect(() => { if (editing) ref.current() // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, editing])
}
