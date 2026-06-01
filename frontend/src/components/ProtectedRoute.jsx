import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// adminOnly prop = true means only admins can enter
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth()

  // While checking localStorage, show nothing
  if (loading) return <div>Loading...</div>

  // Not logged in at all → go to login
  if (!user) return <Navigate to="/login" />

  // Logged in but not admin, and this page requires admin → go home
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />

  // All good → show the page
  return children
}

export default ProtectedRoute