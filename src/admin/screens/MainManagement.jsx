import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../shared/context/AppContext.jsx'
import Card from '../../shared/components/Card.jsx'
import Button from '../../shared/components/Button.jsx'
import Modal from '../../shared/components/Modal.jsx'
import StatusBadge from '../../shared/components/StatusBadge.jsx'
import { Field, TextInput, TextArea, Select } from '../../shared/components/Field.jsx'
import { Icon } from '../../user/components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'

export default function MainManagement() {
  const { banners, addBanner, updateBanner, deleteBanner } = useApp()
  const [useFilter, setUseFilter] = useState('all')
  const [editing, setEditing] = useState(null)
  const [orders, setOrders] = useState({})
  const [flash, setFlash] = useState(false)

  const rows = banners
    .filter((b) => (useFilter === 'all' ? true : useFilter === 'on' ? b.active : !b.active))
    .sort((a, b) => a.order - b.order)

  useEffect(() => {
    setOrders(Object.fromEntries(banners.map((b) => [b.id, b.order])))
  }, [banners])

  const dirty = rows.some((b) => Number(orders[b.id]) !== b.order)
  function saveOrder() {
    const sorted = [...banners].sort((a, b) => (Number(orders[a.id]) || 0) - (Number(orders[b.id]) || 0))
    sorted.forEach((b, i) => updateBanner(b.id, { order: i + 1 }))
    setFlash(true); setTimeout(() => setFlash(false), 2000)
  }

  return (
    <div>
      <PageHeader
        title="Main Management"
        subtitle="Main-page images / banners."
        actions={
          <>
            <Button variant="secondary" disabled={!dirty} onClick={saveOrder}>Save Order</Button>
            <Button icon={<Icon name="plus" className="h-4 w-4" />} onClick={() => setEditing({})}>Register</Button>
          </>
        }
      />

      {/* Search bar */}
      <Card className="mb-4 p-4">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="font-semibold text-ink-soft">Area</span>
          <Select className="!w-44" options={[{ id: 'main', en: 'Main Image' }]} value="main" onChange={() => {}} />
          <span className="font-semibold text-ink-soft">Use</span>
          <Select
            className="!w-36"
            options={[{ id: 'all', en: 'All' }, { id: 'on', en: 'In use' }, { id: 'off', en: 'Not used' }]}
            value={useFilter}
            onChange={(e) => setUseFilter(e.target.value)}
          />
          {flash && <span className="ml-auto flex items-center gap-1.5 text-success"><Icon name="check" className="h-4 w-4" strokeWidth={2.5} /> Order saved</span>}
        </div>
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold">Image / Title</th>
              <th className="px-4 py-3 font-semibold">Use</th>
              <th className="px-4 py-3 font-semibold">Image</th>
              <th className="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-ink-soft">No banners.</td></tr>}
            {rows.map((b) => (
              <tr key={b.id} className="border-b border-line/70">
                <td className="px-4 py-3">
                  <input type="number" min="1" value={orders[b.id] ?? b.order}
                    onChange={(e) => setOrders((o) => ({ ...o, [b.id]: e.target.value }))}
                    className="w-16 rounded-lg border border-line bg-white px-2 py-1.5 text-center outline-none focus:border-primary" />
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => setEditing(b)} className="font-medium text-primary hover:underline">{b.name}</button>
                  <p className="text-xs text-ink-soft">{b.description}</p>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => updateBanner(b.id, { active: !b.active })}>
                    <StatusBadge tone={b.active ? 'success' : 'muted'}>{b.active ? 'In use' : 'Not used'}</StatusBadge>
                  </button>
                </td>
                <td className="px-4 py-3">
                  {b.imageUrl ? (
                    <img src={b.imageUrl} alt="" className="h-10 w-16 rounded-lg border border-line object-cover" />
                  ) : (
                    <span className="grid h-10 w-16 place-items-center rounded-lg border border-line bg-surface text-[10px] text-ink-soft">img</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <IconBtn icon="edit" title="Edit" onClick={() => setEditing(b)} />
                    <IconBtn icon="trash" danger title="Delete" onClick={() => { if (confirm(`Delete "${b.name}"?`)) deleteBanner(b.id) }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <BannerModal editing={editing} onClose={() => setEditing(null)}
        onSave={(data) => { if (editing?.id) updateBanner(editing.id, data); else addBanner(data); setEditing(null) }} />
    </div>
  )
}

function BannerModal({ editing, onClose, onSave }) {
  const [f, setF] = useState({})
  useSync(editing, () => setF({
    name: editing?.name || '', description: editing?.description || '',
    imageUrl: editing?.imageUrl || '', mobileUrl: editing?.mobileUrl || '',
    url: editing?.url || '', target: editing?.target || 'self', active: editing?.active ?? true,
  }))
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }))
  return (
    <Modal open={!!editing} onClose={onClose} title={editing?.id ? 'Edit Image' : 'Register Image'} maxWidth="max-w-lg"
      footer={<><Button variant="subtle" onClick={onClose}>Cancel</Button><Button disabled={!f.name?.trim() || !f.description?.trim()} onClick={() => onSave(f)}>Save</Button></>}>
      <div className="space-y-4">
        <Field label="Image / Banner Name" required><TextInput value={f.name || ''} onChange={(e) => set('name', e.target.value)} placeholder="Enter text" /></Field>
        <Field label="Description" required><TextInput value={f.description || ''} onChange={(e) => set('description', e.target.value)} placeholder="Enter text" /></Field>
        <Field label="Image (URL)" hint="Paste an image URL (mock upload)"><TextInput value={f.imageUrl || ''} onChange={(e) => set('imageUrl', e.target.value)} placeholder="https://..." /></Field>
        <Field label="Mobile Image (URL)"><TextInput value={f.mobileUrl || ''} onChange={(e) => set('mobileUrl', e.target.value)} placeholder="https://..." /></Field>
        <Field label="URL (link)"><TextInput value={f.url || ''} onChange={(e) => set('url', e.target.value)} placeholder="https://..." /></Field>
        <Field label="Target"><Radio options={[{ id: 'self', label: 'Current window' }, { id: 'blank', label: 'New window' }]} value={f.target} onChange={(v) => set('target', v)} /></Field>
        <Field label="Use"><Radio options={[{ id: true, label: 'In use' }, { id: false, label: 'Not used' }]} value={f.active} onChange={(v) => set('active', v)} /></Field>
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
