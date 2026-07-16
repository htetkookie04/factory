import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import PhoneFrame from './PhoneFrame.jsx'
import BottomTabNav from './components/BottomTabNav.jsx'
import Welcome from './screens/Welcome.jsx'
import Auth from './screens/Auth.jsx'
import BuyerOnboarding from './screens/BuyerOnboarding.jsx'
import ManufacturerOnboarding from './screens/ManufacturerOnboarding.jsx'
import Home from './screens/Home.jsx'
import AIConsult from './screens/AIConsult.jsx'
import Bookings from './screens/Bookings.jsx'
import Favorites from './screens/Favorites.jsx'
import Profile from './screens/Profile.jsx'
import FactoryDetail from './screens/FactoryDetail.jsx'
import Notice from './screens/Notice.jsx'
import FactoryApp from './factory/FactoryApp.jsx'

// The main tab shell — wraps a screen with the phone frame + bottom nav.
function TabShell({ children }) {
  return <PhoneFrame bottomNav={<BottomTabNav />}>{children}</PhoneFrame>
}

// Plain (no bottom nav) screens for onboarding / detail.
function Plain({ children }) {
  return <PhoneFrame>{children}</PhoneFrame>
}

export default function UserApp() {
  const location = useLocation()
  return (
    <Routes location={location}>
      <Route index element={<Navigate to="/welcome" replace />} />
      <Route path="welcome" element={<Plain><Welcome /></Plain>} />
      <Route path="auth" element={<Plain><Auth /></Plain>} />
      <Route path="register" element={<Plain><BuyerOnboarding /></Plain>} />
      <Route
        path="register/manufacturer"
        element={<Plain><ManufacturerOnboarding /></Plain>}
      />

      <Route path="app" element={<TabShell><Home /></TabShell>} />
      <Route path="app/consult" element={<TabShell><AIConsult /></TabShell>} />
      <Route path="app/bookings" element={<TabShell><Bookings /></TabShell>} />
      <Route path="app/favorites" element={<TabShell><Favorites /></TabShell>} />
      <Route path="app/profile" element={<TabShell><Profile /></TabShell>} />
      <Route path="app/factory/:id" element={<Plain><FactoryDetail /></Plain>} />
      <Route path="app/notice" element={<Plain><Notice /></Plain>} />

      {/* Manufacturer account dashboard (own nested routes) */}
      <Route path="factory/*" element={<FactoryApp />} />

      <Route path="*" element={<Navigate to="/welcome" replace />} />
    </Routes>
  )
}
