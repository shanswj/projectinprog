import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')  // send to home after logout
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🚗 Gleamorous ✨ </Link>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/services" style={styles.link}>Services</Link>

        {/* Only show these links if logged in */}
        {user && <Link to="/book" style={styles.link}>Book Now</Link>}
        {user && <Link to="/my-bookings" style={styles.link}>My Bookings</Link>}
        {user && <Link to="/my-vehicles" style={styles.link}>My Vehicles</Link>}

        {/* Only show admin links if user is admin */}
        {user?.role === 'admin' && <Link to="/admin" style={styles.link}>Dashboard</Link>}
        {user?.role === 'admin' && <Link to="/admin/manage" style={styles.link}>Manage</Link>}

        {/* Show login/register if NOT logged in, show logout if logged in */}
        {!user ? (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout ({user.name})
          </button>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '1rem 2rem', backgroundColor: '#1a1a2e', color: 'white',
    position: 'sticky', top: 0, zIndex: 100
  },
  brand: { color: '#e94560', fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' },
  links: { display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' },
  link: { color: 'white', textDecoration: 'none', fontSize: '0.95rem' },
  logoutBtn: {
    background: '#e94560', color: 'white', border: 'none',
    padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer'
  }
}

export default Navbar