import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import Login from './screens/Login.jsx'
import DashboardOverview from './screens/DashboardOverview.jsx'
import ConsultationManagement from './screens/ConsultationManagement.jsx'
import ManufacturerDirectory from './screens/ManufacturerDirectory.jsx'
import BuyerDirectory from './screens/BuyerDirectory.jsx'
import NoticeboardManagement from './screens/NoticeboardManagement.jsx'
import AdminManagement from './screens/AdminManagement.jsx'
import CommonCodeManagement from './screens/CommonCodeManagement.jsx'
import MenuManagement from './screens/MenuManagement.jsx'
import MenuAccessManagement from './screens/MenuAccessManagement.jsx'
import MainManagement from './screens/MainManagement.jsx'
import PopupManagement from './screens/PopupManagement.jsx'
import HtmlPageManagement from './screens/HtmlPageManagement.jsx'
import Reports from './screens/Reports.jsx'
import Settings from './screens/Settings.jsx'

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-[#efe7dc]">
      <Sidebar />
      <main className="ml-60 min-h-screen">
        <div className="mx-auto max-w-[1400px] px-8 py-6">{children}</div>
      </main>
    </div>
  )
}

export default function AdminApp() {
  // Simple mock auth gate for the console.
  const [authed, setAuthed] = useState(
    () => localStorage.getItem('oveile.admin') === '1'
  )

  if (!authed) {
    return (
      <Login
        onLogin={() => {
          localStorage.setItem('oveile.admin', '1')
          setAuthed(true)
        }}
      />
    )
  }

  return (
    <Routes>
      <Route index element={<Shell><DashboardOverview /></Shell>} />
      <Route path="main" element={<Shell><MainManagement /></Shell>} />
      <Route path="popups" element={<Shell><PopupManagement /></Shell>} />
      <Route path="html" element={<Shell><HtmlPageManagement /></Shell>} />

      <Route path="consultations" element={<Shell><ConsultationManagement /></Shell>} />
      <Route path="manufacturers" element={<Shell><ManufacturerDirectory /></Shell>} />
      <Route path="buyers" element={<Shell><BuyerDirectory /></Shell>} />
      <Route path="noticeboard" element={<Shell><NoticeboardManagement /></Shell>} />
      <Route path="admins" element={<Shell><AdminManagement /></Shell>} />
      <Route path="codes" element={<Shell><CommonCodeManagement /></Shell>} />
      <Route path="menus" element={<Shell><MenuManagement /></Shell>} />
      <Route path="menu-access" element={<Shell><MenuAccessManagement /></Shell>} />
      <Route path="reports" element={<Shell><Reports /></Shell>} />
      <Route path="settings" element={<Shell><Settings onLogout={() => { localStorage.removeItem('oveile.admin'); setAuthed(false) }} /></Shell>} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  )
}
