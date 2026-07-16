import { Navigate, Route, Routes } from 'react-router-dom'
import { useApp } from '../../shared/context/AppContext.jsx'
import PhoneFrame from '../PhoneFrame.jsx'
import FactoryTabNav from './FactoryTabNav.jsx'
import FactoryHome from './FactoryHome.jsx'
import FactoryRequests from './FactoryRequests.jsx'
import FactoryRequestDetail from './FactoryRequestDetail.jsx'
import FactoryProfile from './FactoryProfile.jsx'

// Guarded manufacturer dashboard. Requires a logged-in manufacturer account
// (user.role === 'manufacturer') linked to a manufacturer record.
export default function FactoryApp() {
  const { user, factoryById } = useApp()
  const factory = user?.role === 'manufacturer' ? factoryById(user.manufacturerId) : null

  if (!factory) return <Navigate to="/welcome" replace />

  // Tab screens carry the bottom nav; the detail page is full-screen.
  const Shell = ({ nav = false, children }) => (
    <PhoneFrame bottomNav={nav ? <FactoryTabNav /> : null}>{children}</PhoneFrame>
  )

  return (
    <Routes>
      <Route index element={<Shell nav><FactoryHome factory={factory} /></Shell>} />
      <Route path="requests" element={<Shell nav><FactoryRequests factory={factory} /></Shell>} />
      <Route path="requests/:id" element={<Shell><FactoryRequestDetail factory={factory} /></Shell>} />
      <Route path="profile" element={<Shell nav><FactoryProfile factory={factory} /></Shell>} />
      <Route path="*" element={<Navigate to="/factory" replace />} />
    </Routes>
  )
}
