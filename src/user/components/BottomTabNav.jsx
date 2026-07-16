import { NavLink } from 'react-router-dom'
import { useApp } from '../../shared/context/AppContext.jsx'
import { Icon } from './Icon.jsx'

// Tabs come from the Menu registry (area 'user'); hiding/reordering in
// Menu Management drives the real bottom nav. Labels stay bilingual via i18n key.
export default function BottomTabNav() {
  const { t, menus } = useApp()
  const tabs = menus
    .filter((m) => m.area === 'user' && m.visible !== false && m.active !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2">
      <nav className="flex items-center justify-between rounded-full bg-[#2A2420] px-3 py-2 shadow-card">
        {tabs.map((tab) => {
          const text = tab.key ? t(tab.key) : tab.label
          return (
            <NavLink key={tab.id} to={tab.path} end={tab.path === '/app'} aria-label={text}>
              {({ isActive }) =>
                isActive ? (
                  <span className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-white shadow-soft">
                    <Icon name={tab.icon} className="h-5 w-5" filled />
                    <span className="text-xs font-semibold">{text}</span>
                  </span>
                ) : (
                  <span className="grid h-11 w-11 place-items-center rounded-full text-white/55 transition-colors hover:text-white/90">
                    <Icon name={tab.icon} className="h-5 w-5" />
                  </span>
                )
              }
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
