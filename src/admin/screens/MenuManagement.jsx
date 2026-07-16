import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../shared/context/AppContext.jsx'
import Card from '../../shared/components/Card.jsx'
import Button from '../../shared/components/Button.jsx'
import Modal from '../../shared/components/Modal.jsx'
import StatusBadge from '../../shared/components/StatusBadge.jsx'
import { Field, TextInput, TextArea, Select } from '../../shared/components/Field.jsx'
import { Icon } from '../../user/components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'

const AREAS = [
  { id: 'admin', label: 'Admin Sidebar' },
  { id: 'user', label: 'User App Tabs' },
]
const ICON_CHOICES = ['home', 'chat', 'factory', 'user', 'bell', 'badge', 'sparkles', 'calendar', 'heart', 'location', 'globe']
const MENU_TYPES = [
  { id: 'content', label: 'Content' },
  { id: 'board', label: 'Board' },
  { id: 'link', label: 'Link' },
  { id: 'folder', label: 'Folder' },
  { id: 'function', label: 'Function' },
]
const SNS_OPTIONS = ['KakaoTalk', 'Facebook', 'Twitter(X)', 'Naver', 'Copy URL']

export default function MenuManagement() {
  const { menus, addMenu, updateMenu, deleteMenu } = useApp()
  const [area, setArea] = useState('admin')
  const [editing, setEditing] = useState(null)
  const [orders, setOrders] = useState({})
  const [savedFlash, setSavedFlash] = useState(false)

  const rows = menus.filter((m) => m.area === area).sort((a, b) => a.order - b.order)

  // Keep the editable order inputs in sync with the current rows.
  useEffect(() => {
    setOrders(Object.fromEntries(rows.map((m) => [m.id, m.order])))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [area, menus.length])

  const dirty = rows.some((m) => Number(orders[m.id]) !== m.order)

  function saveOrder() {
    // Normalize: sort by entered number, then reassign sequential 1..N.
    const sorted = [...rows].sort((a, b) => (Number(orders[a.id]) || 0) - (Number(orders[b.id]) || 0))
    sorted.forEach((m, i) => updateMenu(m.id, { order: i + 1 }))
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 2000)
  }

  return (
    <div>
      <PageHeader
        title="Menu Management"
        subtitle="Control navigation for the admin console and the user app. Changes apply live."
        actions={
          <>
            <Button variant="secondary" disabled={!dirty} onClick={saveOrder}>
              Save Order
            </Button>
            <Button icon={<Icon name="plus" className="h-4 w-4" />} onClick={() => setEditing({ area })}>
              Add Menu
            </Button>
          </>
        }
      />

      <div className="mb-5 flex items-center gap-2">
        {AREAS.map((a) => (
          <button
            key={a.id}
            onClick={() => setArea(a.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              area === a.id ? 'bg-primary text-white' : 'bg-white text-ink-soft border border-line'
            }`}
          >
            {a.label}
          </button>
        ))}
        {savedFlash && (
          <span className="ml-2 flex items-center gap-1.5 text-sm font-medium text-success">
            <Icon name="check" className="h-4 w-4" strokeWidth={2.5} /> Order saved
          </span>
        )}
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="px-4 py-3 font-semibold">No.</th>
              <th className="px-4 py-3 font-semibold">Menu</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Path</th>
              <th className="px-4 py-3 font-semibold">Use</th>
              <th className="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m.id} className="border-b border-line/70">
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="1"
                    value={orders[m.id] ?? m.order}
                    onChange={(e) => setOrders((o) => ({ ...o, [m.id]: e.target.value }))}
                    className="w-16 rounded-lg border border-line bg-white px-2 py-1.5 text-center text-sm outline-none focus:border-primary"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Icon name={m.icon} className="h-4 w-4 text-primary" />
                    <span className="font-medium text-ink">{m.label}</span>
                    {m.core && <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-semibold text-ink-soft">CORE</span>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-medium text-ink-soft">
                    {MENU_TYPES.find((t) => t.id === (m.type || 'content'))?.label}
                  </span>
                </td>
                <td className="px-4 py-3"><span className="font-mono text-xs text-ink-soft">{m.path}</span></td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => { if (!m.core) updateMenu(m.id, { active: m.active === false }) }}
                    disabled={m.core}
                    title={m.core ? 'Core item — always in use' : 'Toggle use'}
                    className={m.core ? 'cursor-not-allowed' : ''}
                  >
                    <StatusBadge tone={m.active !== false ? 'success' : 'muted'}>
                      {m.active !== false ? 'In use' : 'Not used'}
                    </StatusBadge>
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <IconBtn icon="edit" title="Edit" onClick={() => setEditing(m)} />
                    <IconBtn
                      icon="trash"
                      danger
                      title={m.core ? 'Core item — cannot delete' : 'Delete'}
                      disabled={m.core}
                      onClick={() => { if (!m.core && confirm(`Delete menu "${m.label}"?`)) deleteMenu(m.id) }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <p className="mt-3 text-xs text-ink-soft">
        Edit the No. fields then press <b>Save Order</b>. CORE items can't be disabled or deleted, so you always keep access to the console.
      </p>

      <MenuForm
        editing={editing}
        onClose={() => setEditing(null)}
        onSave={(data) => { if (editing?.id) updateMenu(editing.id, data); else addMenu({ ...data, area: editing.area || area }); setEditing(null) }}
      />
    </div>
  )
}

/* ---------- Registration / edit form ---------- */
function MenuForm({ editing, onClose, onSave }) {
  const [f, setF] = useState({})
  useSync(editing, () =>
    setF({
      label: editing?.label || '',
      abbr: editing?.abbr || '',
      description: editing?.description || '',
      type: editing?.type || 'content',
      path: editing?.path || '',
      icon: editing?.icon || 'badge',
      visible: editing?.visible ?? true, // GNB use
      sitemap: editing?.sitemap ?? false,
      target: editing?.target || 'self',
      sns: editing?.sns || [],
      active: editing?.active ?? true, // use
    })
  )
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }))
  const toggleSns = (s) => set('sns', f.sns?.includes(s) ? f.sns.filter((x) => x !== s) : [...(f.sns || []), s])

  return (
    <Modal
      open={!!editing}
      onClose={onClose}
      title={editing?.id ? 'Edit Menu' : 'Register Menu'}
      maxWidth="max-w-lg"
      footer={
        <>
          <Button variant="subtle" onClick={onClose}>Cancel</Button>
          <Button disabled={!f.label?.trim() || !f.path?.trim()} onClick={() => onSave(f)}>Save</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Menu Name" required>
          <TextInput value={f.label || ''} onChange={(e) => set('label', e.target.value)} placeholder="Enter text" />
        </Field>
        <Field label="Short Name" required>
          <TextInput value={f.abbr || ''} onChange={(e) => set('abbr', e.target.value)} placeholder="Enter text" />
        </Field>
        <Field label="Description">
          <TextArea rows={2} value={f.description || ''} onChange={(e) => set('description', e.target.value)} placeholder="Enter text" />
        </Field>

        <Field label="Menu Type" required>
          <Radio options={MENU_TYPES} value={f.type} onChange={(v) => set('type', v)} />
        </Field>

        <Field label={f.type === 'link' ? 'Link URL' : 'Path / Content'} required>
          <TextInput value={f.path || ''} onChange={(e) => set('path', e.target.value)} placeholder="/admin/... or https://..." />
        </Field>

        <Field label="Icon">
          <Select options={ICON_CHOICES.map((i) => ({ id: i, en: i }))} value={f.icon} onChange={(e) => set('icon', e.target.value)} />
        </Field>

        <Field label="GNB Use" required>
          <Radio
            options={[{ id: true, label: 'Use' }, { id: false, label: "Don't use" }]}
            value={f.visible}
            onChange={(v) => set('visible', v)}
          />
        </Field>
        <Field label="Sitemap Use">
          <Radio
            options={[{ id: true, label: 'Use' }, { id: false, label: "Don't use" }]}
            value={f.sitemap}
            onChange={(v) => set('sitemap', v)}
          />
        </Field>
        <Field label="Target" required>
          <Radio
            options={[{ id: 'self', label: 'Current window' }, { id: 'blank', label: 'New window' }]}
            value={f.target}
            onChange={(v) => set('target', v)}
          />
        </Field>

        <Field label="SNS Share">
          <div className="flex flex-wrap gap-3">
            {SNS_OPTIONS.map((s) => (
              <label key={s} className="flex items-center gap-1.5 text-sm text-ink">
                <input type="checkbox" checked={f.sns?.includes(s) || false} onChange={() => toggleSns(s)} className="h-4 w-4 accent-[#6F4E37]" />
                {s}
              </label>
            ))}
          </div>
        </Field>

        <Field label="Use" required>
          <Radio
            options={[{ id: true, label: 'In use' }, { id: false, label: 'Not used' }]}
            value={f.active}
            onChange={(v) => set('active', v)}
          />
        </Field>

        {/* Live preview */}
        <div className="flex items-center gap-2 rounded-xl bg-surface p-3">
          <Icon name={f.icon || 'badge'} className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-ink">{f.label || 'Preview'}</span>
        </div>
      </div>
    </Modal>
  )
}

/* ---------- small inline radio group ---------- */
function Radio({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-4 py-1">
      {options.map((o) => {
        const active = value === o.id
        return (
          <button
            key={String(o.id)}
            type="button"
            onClick={() => onChange(o.id)}
            className="flex items-center gap-2 text-sm text-ink"
          >
            <span className={`grid h-4.5 w-4.5 place-items-center rounded-full border-2 ${active ? 'border-primary' : 'border-line'}`} style={{ height: 18, width: 18 }}>
              {active && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
            </span>
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

function IconBtn({ icon, onClick, danger, title, disabled }) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`grid h-7 w-7 place-items-center rounded-lg transition-colors hover:bg-surface disabled:opacity-30 ${danger ? 'text-danger' : 'text-ink-soft'}`}
    >
      <Icon name={icon} className="h-4 w-4" />
    </button>
  )
}

function useSync(editing, fn) {
  const ref = useRef(fn)
  ref.current = fn
  const key = editing ? editing.id || 'new' : null
  useEffect(() => { if (editing) ref.current() // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, editing])
}
