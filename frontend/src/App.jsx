import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'

// Import all pages
import Home from './pages/Home'
import Services from './pages/Services'
import BookNow from './pages/BookNow'
import MyBookings from './pages/MyBookings'
import MyVehicles from './pages/MyVehicles'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminManage from './pages/admin/AdminManage'

function App() {
  return (
    // AuthProvider wraps everything so every page can access the logged-in user
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public routes — anyone can visit */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes — must be logged in */}
          <Route path="/book" element={
            <ProtectedRoute><BookNow /></ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute><MyBookings /></ProtectedRoute>
          } />
          <Route path="/my-vehicles" element={
            <ProtectedRoute><MyVehicles /></ProtectedRoute>
          } />

          {/* Admin only routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/manage" element={
            <ProtectedRoute adminOnly={true}><AdminManage /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App