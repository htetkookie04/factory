import { useState, useEffect, useMemo } from 'react'
import { useApp } from '../../shared/context/AppContext.jsx'
import { ADMIN_ROLES, MENU_PERMISSIONS } from '../../shared/tokens.js'
import Card from '../../shared/components/Card.jsx'
import Button from '../../shared/components/Button.jsx'
import { Icon } from '../../user/components/Icon.jsx'
import PageHeader from '../components/PageHeader.jsx'

const emptyPerm = () => ({ read: false, write: false, edit: false, delete: false, download: false })

// Permission assignment by menu: for a selected role, set Read/Write/Edit/
// Delete/Download per menu. Super Admin is always fully granted.
export default function MenuAccessManagement() {
  const { menus, menuPermissions, setMenuPermissions } = useApp()
  const [role, setRole] = useState('coordinator')
  const [draft, setDraft] = useState({})

  const rows = useMemo(
    () => menus.filter((m) => m.area === 'admin').sort((a, b) => a.order - b.order),
    [menus]
  )
  const locked = role === 'super_admin'

  // Load the selected role's saved permissions into the editable draft.
  function loadDraft(r) {
    const saved = menuPermissions[r] || {}
    const next = {}
    rows.forEach((m) => {
      next[m.id] = locked || r === 'super_admin'
        ? { read: true, write: true, edit: true, delete: true, download: true }
        : { ...emptyPerm(), ...(saved[m.id] || {}) }
    })
    setDraft(next)
  }
  useEffect(() => { loadDraft(role) /* eslint-disable-next-line */ }, [role, menus.length])

  const dirty = useMemo(() => {
    const saved = menuPermissions[role] || {}
    return rows.some((m) =>
      MENU_PERMISSIONS.some((p) => !!draft[m.id]?.[p.id] !== !!saved[m.id]?.[p.id])
    )
  }, [draft, menuPermissions, role, rows])

  function toggle(menuId, action) {
    if (locked) return
    setDraft((d) => ({ ...d, [menuId]: { ...d[menuId], [action]: !d[menuId]?.[action] } }))
  }
  function toggleColumn(action) {
    if (locked) return
    const allOn = rows.every((m) => draft[m.id]?.[action])
    setDraft((d) => {
      const next = { ...d }
      rows.forEach((m) => { next[m.id] = { ...next[m.id], [action]: !allOn } })
      return next
    })
  }
  function save() {
    setMenuPermissions({ ...menuPermissions, [role]: draft })
  }

  return (
    <div>
      <PageHeader title="Menu Access" subtitle="Assign Read / Write / Edit / Delete / Download permissions per menu, per role." />

      {/* Search / filter bar */}
      <Card className="mb-4 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-semibold text-ink-soft">Role</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-56 rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium text-ink outline-none focus:border-primary"
          >
            {ADMIN_ROLES.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
          <div className="ml-auto flex gap-2">
            <Button variant="subtle" icon={<Icon name="history" className="h-4 w-4" />} onClick={() => loadDraft(role)}>
              Reset
            </Button>
          </div>
        </div>
        {locked && (
          <p className="mt-2 text-xs text-ink-soft">Super Admin always has full permissions on every menu.</p>
        )}
      </Card>

      {/* Permission grid */}
      <Card className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-xs font-semibold uppercase tracking-wide text-ink-soft">
              <th rowSpan={2} className="border-r border-line px-4 py-3 text-center">1Depth</th>
              <th rowSpan={2} className="border-r border-line px-4 py-3 text-center">2Depth</th>
              <th rowSpan={2} className="border-r border-line px-4 py-3 text-center">3Depth</th>
              <th colSpan={MENU_PERMISSIONS.length} className="px-4 py-2.5 text-center">Permissions</th>
            </tr>
            <tr className="border-b border-line text-xs font-semibold text-ink-soft">
              {MENU_PERMISSIONS.map((p) => {
                const allOn = rows.length > 0 && rows.every((m) => draft[m.id]?.[p.id])
                return (
                  <th key={p.id} className="px-3 py-2.5 text-center">
                    <label className="flex items-center justify-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={allOn}
                        disabled={locked}
                        onChange={() => toggleColumn(p.id)}
                        className="h-4 w-4 accent-[#6F4E37] disabled:opacity-50"
                      />
                      {p.label}
                    </label>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((m, i) => (
              <tr key={m.id} className="border-b border-line/70">
                {/* 1Depth: single spanning cell for the admin console */}
                {i === 0 && (
                  <td rowSpan={rows.length} className="border-r border-line px-4 py-3 text-center align-middle font-semibold text-ink">
                    Admin Console
                  </td>
                )}
                <td className="border-r border-line px-4 py-3 text-center">
                  <span className="inline-flex items-center gap-2 font-medium text-ink">
                    <Icon name={m.icon} className="h-4 w-4 text-primary" />
                    {m.label}
                  </span>
                </td>
                <td className="border-r border-line px-4 py-3 text-center text-ink-soft">—</td>
                {MENU_PERMISSIONS.map((p) => (
                  <td key={p.id} className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={!!draft[m.id]?.[p.id]}
                      disabled={locked}
                      onChange={() => toggle(m.id, p.id)}
                      className="h-4 w-4 accent-[#6F4E37] disabled:opacity-50"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Footer actions */}
      <div className="mt-5 flex items-center justify-end gap-2">
        <Button variant="subtle" onClick={() => loadDraft(role)}>Cancel</Button>
        <Button disabled={locked || !dirty} onClick={save}>Save</Button>
      </div>
    </div>
  )
}
