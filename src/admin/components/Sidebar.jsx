import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../../shared/context/AppContext.jsx'
import { ADMIN_ROLES } from '../../shared/tokens.js'
import { Icon } from '../../user/components/Icon.jsx'

// Grouped navigation. Each sub-item is matched to a menu in the store (so
// Menu Management / Menu Access still control visibility, order and access);
// the group config only decides grouping and the content-specific icons.
const GROUPS = [
  {
    id: 'ops',
    label: 'Business Operations',
    icon: 'briefcase',
    items: [
      { path: '/admin/main', icon: 'sliders' },
      { path: '/admin/manufacturers', icon: 'building' },
      { path: '/admin/buyers', icon: 'idcard' },
      { path: '/admin/consultations', icon: 'chat' },
    ],
  },
  {
    id: 'content',
    label: 'Content Control',
    icon: 'newspaper',
    items: [
      { path: '/admin/popups', icon: 'popup' },
      { path: '/admin/html', icon: 'filecode' },
      { path: '/admin/noticeboard', icon: 'megaphone' },
    ],
  },
  {
    id: 'system',
    label: 'System Admin',
    icon: 'cog',
    items: [
      { path: '/admin/admins', icon: 'shield' },
      { path: '/admin/reports', icon: 'barchart' },
      { path: '/admin/menus', icon: 'list' },
      { path: '/admin/codes', icon: 'code2' },
      { path: '/admin/menu-access', icon: 'lock' },
    ],
  },
]

export default function Sidebar() {
  const { menus, adminRole, setAdminRole, canAccessMenu } = useApp()
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState({})

  const byPath = Object.fromEntries(menus.filter((m) => m.area === 'admin').map((m) => [m.path, m]))
  const visible = (path) => {
    const m = byPath[path]
    return m && m.visible !== false && m.active !== false && canAccessMenu(m)
  }
  const labelOf = (path) => byPath[path]?.label || path

  const groups = GROUPS.map((g) => ({ ...g, items: g.items.filter((it) => visible(it.path)) })).filter((g) => g.items.length)

  // Any admin menu not in a group (e.g. custom-added) still shows, ungrouped.
  const grouped = new Set(GROUPS.flatMap((g) => g.items.map((i) => i.path)).concat('/admin'))
  const others = menus
    .filter((m) => m.area === 'admin' && !grouped.has(m.path) && m.visible !== false && m.active !== false && canAccessMenu(m))
    .sort((a, b) => a.order - b.order)

  const dashVisible = visible('/admin')

  return (
    <aside className="fixed inset-y-0 left-0 flex w-60 flex-col border-r border-line bg-white">
      <div className="flex items-center gap-2.5 px-6 py-5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white">
          <Icon name="shirt" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-bold leading-tight text-ink">OVEILE</p>
          <p className="text-[11px] text-ink-soft">Coordinator Console</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {/* Dashboard — standalone top-level item */}
        {dashVisible && (
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                isActive ? 'bg-primary text-white shadow-soft' : 'text-ink hover:bg-surface'
              }`
            }
          >
            <Icon name="home" className="h-5 w-5" filled={pathname === '/admin'} />
            {labelOf('/admin')}
          </NavLink>
        )}

        {/* Grouped sections */}
        {groups.map((g) => {
          const hasActive = g.items.some((it) => it.path === pathname)
          const isOpen = collapsed[g.id] !== true || hasActive
          return (
            <div key={g.id} className="pt-2">
              <button
                onClick={() => setCollapsed((c) => ({ ...c, [g.id]: !(c[g.id] === true) }))}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-ink-soft transition-colors hover:text-ink"
              >
                <Icon name={g.icon} className="h-4 w-4" />
                <span className="flex-1 text-left">{g.label}</span>
                <Icon name="chevronDown" className={`h-4 w-4 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
              </button>

              {isOpen && (
                <div className="mt-1 space-y-0.5 border-l border-line pl-3">
                  {g.items.map((it) => (
                    <NavLink
                      key={it.path}
                      to={it.path}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                          isActive ? 'bg-primary text-white shadow-soft' : 'text-ink-soft hover:bg-surface hover:text-ink'
                        }`
                      }
                    >
                      <Icon name={it.icon} className="h-5 w-5" />
                      {labelOf(it.path)}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {/* Ungrouped / custom menus */}
        {others.length > 0 && (
          <div className="pt-3">
            {others.map((m) => (
              <NavLink
                key={m.id}
                to={m.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-primary text-white shadow-soft' : 'text-ink-soft hover:bg-surface hover:text-ink'
                  }`
                }
              >
                <Icon name={m.icon} className="h-5 w-5" />
                {m.label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className="space-y-2 border-t border-line px-3 py-3">
        <label className="block px-1 text-[11px] font-semibold uppercase tracking-wide text-ink-soft">Viewing as</label>
        <select
          value={adminRole}
          onChange={(e) => setAdminRole(e.target.value)}
          className="w-full rounded-xl border border-line bg-white px-3 py-2 text-sm font-medium text-ink outline-none focus:border-primary"
        >
          {ADMIN_ROLES.map((r) => (
            <option key={r.id} value={r.id}>{r.label}</option>
          ))}
        </select>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-primary text-white' : 'text-ink-soft hover:bg-surface'
            }`
          }
        >
          <Icon name="user" className="h-5 w-5" />
          Settings
        </NavLink>
      </div>
    </aside>
  )
}
