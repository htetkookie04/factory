import { Navigate, Route, Routes } from 'react-router-dom'
import UserApp from './user/UserApp.jsx'
import AdminApp from './admin/AdminApp.jsx'

// Two route roots: "/" = mobile-style buyer/manufacturer app,
// "/admin" = desktop coordinator dashboard.
export default function App() {
  return (
    <Routes>
      <Route path="/*" element={<UserApp />} />
      <Route path="/admin/*" element={<AdminApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
