import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import CustomerLayout from './components/CustomerLayout'

import Home from './pages/Home'
import CustomerHome from './pages/CustomerHome'
import Services from './pages/Services'
import BookNow from './pages/BookNow'
import MyBookings from './pages/MyBookings'
import MyVehicles from './pages/MyVehicles'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminManage from './pages/admin/AdminManage'

// Smart home — customers see punch card, guests see landing page
const SmartHome = () => {
  const { user } = useAuth()
  if (user && user.role === 'customer') {
    return <CustomerLayout><CustomerHome /></CustomerLayout>
  }
  return <><Navbar /><Home /></>
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Home */}
          <Route path="/" element={<SmartHome />} />

          {/* Public */}
          <Route path="/login"    element={<><Navbar /><Login /></>} />
          <Route path="/register" element={<><Navbar /><Register /></>} />

          {/* Customer routes — all wrapped with CustomerLayout (bottom tabs) */}
          <Route path="/services" element={
            <ProtectedRoute>
              <CustomerLayout><Services /></CustomerLayout>
            </ProtectedRoute>
          } />
          <Route path="/book" element={
            <ProtectedRoute>
              <CustomerLayout><BookNow /></CustomerLayout>
            </ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <CustomerLayout><MyBookings /></CustomerLayout>
            </ProtectedRoute>
          } />
          <Route path="/my-vehicles" element={
            <ProtectedRoute>
              <CustomerLayout><MyVehicles /></CustomerLayout>
            </ProtectedRoute>
          } />

          {/* Admin routes — dark navbar, no bottom tabs */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <><Navbar /><AdminDashboard /></>
            </ProtectedRoute>
          } />
          <Route path="/admin/manage" element={
            <ProtectedRoute adminOnly={true}>
              <><Navbar /><AdminManage /></>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App