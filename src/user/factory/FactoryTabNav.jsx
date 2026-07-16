import { NavLink } from 'react-router-dom'
import { useApp } from '../../shared/context/AppContext.jsx'
import { Icon } from '../components/Icon.jsx'

const TABS = [
  { to: '/factory', end: true, icon: 'factory', key: 'factoryHomeTab' },
  { to: '/factory/requests', icon: 'chat', key: 'requestsTab' },
  { to: '/factory/profile', icon: 'user', key: 'factoryProfileTab' },
]

export default function FactoryTabNav() {
  const { t } = useApp()
  return (
    <div className="px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2">
      <nav className="flex items-center justify-around rounded-full bg-[#2A2420] px-3 py-2 shadow-card">
        {TABS.map((tab) => (
          <NavLink key={tab.key} to={tab.to} end={tab.end} aria-label={t(tab.key)}>
            {({ isActive }) =>
              isActive ? (
                <span className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-white shadow-soft">
                  <Icon name={tab.icon} className="h-5 w-5" />
                  <span className="text-xs font-semibold">{t(tab.key)}</span>
                </span>
              ) : (
                <span className="grid h-11 w-11 place-items-center rounded-full text-white/55 transition-colors hover:text-white/90">
                  <Icon name={tab.icon} className="h-5 w-5" />
                </span>
              )
            }
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
