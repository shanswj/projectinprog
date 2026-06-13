import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (user?.role === 'admin') {
    return (
      <nav style={styles.nav}>
        <Link to="/admin" style={styles.brand}>🚗 Sudsnautica</Link>
        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
          <Link to="/admin/manage" style={styles.link}>Manage</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout ({user.name})
          </button>
        </div>
      </nav>
    )
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🚗 Sudsnautica</Link>
      <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
        {!user ? (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    background: 'white', padding: '1rem 1.5rem',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)', position: 'sticky', top: 0, zIndex: 100
  },
  brand: { fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'none', color: '#1a1a1a' },
  link: { color: '#1a1a1a', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' },
  logoutBtn: {
    background: 'none', border: '1.5px solid #ddd', padding: '0.35rem 0.9rem',
    borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', color: '#1a1a1a'
  }
}

export default Navbar