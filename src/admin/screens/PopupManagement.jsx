import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../shared/context/AppContext.jsx'
import Card from '../../shared/components/Card.jsx'
import Button from '../../shared/components/Button.jsx'
import Modal from '../../shared/components/Modal.jsx'
import StatusBadge from '../../shared/components/StatusBadge.jsx'
import { Field, TextInput, Select } from '../../shared/components/Field.jsx'
import { Icon } from '../../user/components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'

export default function PopupManagement() {
  const { popups, addPopup, updatePopup, deletePopup } = useApp()
  const [useFilter, setUseFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [preview, setPreview] = useState(null)

  const rows = popups.filter((p) => {
    if (useFilter !== 'all' && (useFilter === 'on') !== !!p.active) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div>
      <PageHeader
        title="Popup Management"
        subtitle="Site popups with schedule, size and position."
        actions={<Button icon={<Icon name="plus" className="h-4 w-4" />} onClick={() => setEditing({})}>Register</Button>}
      />

      <Card className="mb-4 p-4">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-semibold text-ink-soft">Use</span>
          <Select className="!w-36" options={[{ id: 'all', en: 'All' }, { id: 'on', en: 'In use' }, { id: 'off', en: 'Not used' }]} value={useFilter} onChange={(e) => setUseFilter(e.target.value)} />
          <div className="flex flex-1 items-center gap-2 rounded-xl bg-surface px-3 py-2">
            <Icon name="search" className="h-4 w-4 text-ink-soft" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search popup name…" className="w-full bg-transparent outline-none" />
          </div>
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="px-4 py-3 font-semibold">No.</th>
              <th className="px-4 py-3 font-semibold">Popup Name</th>
              <th className="px-4 py-3 font-semibold">Display Period</th>
              <th className="px-4 py-3 font-semibold">Use</th>
              <th className="px-4 py-3 font-semibold">Registered By</th>
              <th className="px-4 py-3 font-semibold">Registered At</th>
              <th className="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-ink-soft">No popups.</td></tr>}
            {rows.map((p, i) => (
              <tr key={p.id} className="border-b border-line/70">
                <td className="px-4 py-3 text-ink-soft">{rows.length - i}</td>
                <td className="px-4 py-3">
                  <button onClick={() => setEditing(p)} className="font-medium text-primary hover:underline">{p.name}</button>
                </td>
                <td className="px-4 py-3 text-ink-soft">{p.startDate} ~ {p.endDate}</td>
                <td className="px-4 py-3">
                  <button onClick={() => updatePopup(p.id, { active: !p.active })}>
                    <StatusBadge tone={p.active ? 'success' : 'muted'}>{p.active ? 'In use' : 'Not used'}</StatusBadge>
                  </button>
                </td>
                <td className="px-4 py-3 text-ink-soft">{p.createdBy || '—'}</td>
                <td className="px-4 py-3 text-ink-soft">{p.createdAt}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <IconBtn icon="search" title="Preview" onClick={() => setPreview(p)} />
                    <IconBtn icon="edit" title="Edit" onClick={() => setEditing(p)} />
                    <IconBtn icon="trash" danger title="Delete" onClick={() => { if (confirm(`Delete "${p.name}"?`)) deletePopup(p.id) }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <PopupModal editing={editing} onClose={() => setEditing(null)} onPreview={setPreview}
        onSave={(data) => { if (editing?.id) updatePopup(editing.id, data); else addPopup(data); setEditing(null) }} />
      <PreviewModal popup={preview} onClose={() => setPreview(null)} />
    </div>
  )
}

function PopupModal({ editing, onClose, onSave, onPreview }) {
  const [f, setF] = useState({})
  useSync(editing, () => setF({
    name: editing?.name || '', kind: editing?.kind || 'image',
    width: editing?.width || '', height: editing?.height || '',
    top: editing?.top || '', left: editing?.left || '',
    startDate: editing?.startDate || '', endDate: editing?.endDate || '',
    webImage: editing?.webImage || '', mobileImage: editing?.mobileImage || '',
    url: editing?.url || '', target: editing?.target || 'self', active: editing?.active ?? true,
  }))
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }))
  const valid = f.name?.trim() && f.startDate && f.endDate
  return (
    <Modal open={!!editing} onClose={onClose} title={editing?.id ? 'Edit Popup' : 'Register Popup'} maxWidth="max-w-2xl"
      footer={<><Button variant="subtle" onClick={() => onPreview({ ...f, id: 'preview' })} disabled={!f.name}>Preview</Button><div className="flex-1" /><Button variant="subtle" onClick={onClose}>Cancel</Button><Button disabled={!valid} onClick={() => onSave(f)}>Save</Button></>}>
      <div className="space-y-4">
        <Field label="Popup Name" required><TextInput value={f.name || ''} onChange={(e) => set('name', e.target.value)} placeholder="Enter popup name" /></Field>
        <Field label="Popup Type" required><Radio options={[{ id: 'image', label: 'Image' }, { id: 'text', label: 'Text' }]} value={f.kind} onChange={(v) => set('kind', v)} /></Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Size (W × H)" required>
            <div className="flex items-center gap-2">
              <TextInput type="number" placeholder="W" value={f.width} onChange={(e) => set('width', e.target.value)} />
              <span className="text-ink-soft">×</span>
              <TextInput type="number" placeholder="H" value={f.height} onChange={(e) => set('height', e.target.value)} />
            </div>
          </Field>
          <Field label="Position (Top × Left)" required>
            <div className="flex items-center gap-2">
              <TextInput type="number" placeholder="Top" value={f.top} onChange={(e) => set('top', e.target.value)} />
              <span className="text-ink-soft">×</span>
              <TextInput type="number" placeholder="Left" value={f.left} onChange={(e) => set('left', e.target.value)} />
            </div>
          </Field>
        </div>
        <Field label="Display Period" required>
          <div className="flex items-center gap-2">
            <TextInput type="date" value={f.startDate} onChange={(e) => set('startDate', e.target.value)} />
            <span className="text-ink-soft">~</span>
            <TextInput type="date" value={f.endDate} onChange={(e) => set('endDate', e.target.value)} />
          </div>
        </Field>
        <Field label="Web Image (URL)"><TextInput value={f.webImage || ''} onChange={(e) => set('webImage', e.target.value)} placeholder="https://..." /></Field>
        <Field label="Mobile Image (URL)"><TextInput value={f.mobileImage || ''} onChange={(e) => set('mobileImage', e.target.value)} placeholder="https://..." /></Field>
        <Field label="URL"><TextInput value={f.url || ''} onChange={(e) => set('url', e.target.value)} placeholder="https://..." /></Field>
        <Field label="Target" required><Radio options={[{ id: 'self', label: 'Current window' }, { id: 'blank', label: 'New window' }]} value={f.target} onChange={(v) => set('target', v)} /></Field>
        <Field label="Use" required><Radio options={[{ id: true, label: 'In use' }, { id: false, label: 'Not used' }]} value={f.active} onChange={(v) => set('active', v)} /></Field>
      </div>
    </Modal>
  )
}

function PreviewModal({ popup, onClose }) {
  if (!popup) return null
  return (
    <Modal open={!!popup} onClose={onClose} title={`Preview — ${popup.name}`} maxWidth="max-w-lg">
      <div className="mx-auto rounded-xl border border-line bg-white shadow-card" style={{ width: Math.min(Number(popup.width) || 360, 460), maxWidth: '100%' }}>
        {popup.webImage ? (
          <img src={popup.webImage} alt="" className="w-full rounded-t-xl" />
        ) : (
          <div className="grid h-40 place-items-center rounded-t-xl bg-surface text-ink-soft">{popup.kind === 'text' ? 'Text popup' : 'Popup image'}</div>
        )}
        <div className="p-3 text-sm">
          <p className="font-semibold text-ink">{popup.name}</p>
          <p className="text-xs text-ink-soft">{popup.startDate} ~ {popup.endDate}</p>
        </div>
      </div>
    </Modal>
  )
}

function Radio({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-4 py-1">
      {options.map((o) => (
        <button key={String(o.id)} type="button" onClick={() => onChange(o.id)} className="flex items-center gap-2 text-sm text-ink">
          <span className={`grid place-items-center rounded-full border-2 ${value === o.id ? 'border-primary' : 'border-line'}`} style={{ height: 18, width: 18 }}>
            {value === o.id && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
          </span>
          {o.label}
        </button>
      ))}
    </div>
  )
}
function IconBtn({ icon, onClick, danger, title }) {
  return <button title={title} onClick={onClick} className={`grid h-7 w-7 place-items-center rounded-lg transition-colors hover:bg-surface ${danger ? 'text-danger' : 'text-ink-soft'}`}><Icon name={icon} className="h-4 w-4" /></button>
}
function useSync(editing, fn) {
  const ref = useRef(fn); ref.current = fn
  const key = editing ? editing.id || 'new' : null
  useEffect(() => { if (editing) ref.current() /* eslint-disable-next-line */ }, [key, editing])
}
