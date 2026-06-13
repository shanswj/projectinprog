import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const tabs = [
  { path: '/',             icon: '🏠', label: 'Home'     },
  { path: '/services',     icon: '✨', label: 'Services'  },
  { path: '/book',         icon: '📅', label: 'Book'      },
  { path: '/my-bookings',  icon: '📋', label: 'Bookings'  },
  { path: '/my-vehicles',  icon: '🚘', label: 'Vehicles'  },
]

const CustomerLayout = ({ children }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', paddingBottom: '70px' }}>

      {/* Top Bar */}
      <div style={{
        background: 'white',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.3rem' }}>🚗</span>
          <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Sudsnautica</span>
        </div>
        <button onClick={handleLogout} style={{
          background: 'none',
          border: '1.5px solid #ddd',
          padding: '0.35rem 0.9rem',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          color: '#1a1a1a',
          fontWeight: '500'
        }}>
          Logout
        </button>
      </div>

      {/* Page Content */}
      {children}

      {/* Bottom Tab Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        borderTop: '1px solid #eee',
        display: 'flex',
        zIndex: 100,
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)'
      }}>
        {tabs.map(tab => {
          const isActive = location.pathname === tab.path
          return (
            <Link key={tab.path} to={tab.path} style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0.6rem 0.3rem',
              textDecoration: 'none',
              color: isActive ? '#1a1a2e' : '#aaa',
              fontSize: '0.7rem',
              fontWeight: isActive ? '700' : '400',
              borderTop: isActive ? '2px solid #4a5f8a' : '2px solid transparent',
              transition: 'all 0.15s'
            }}>
              <span style={{ fontSize: '1.2rem', marginBottom: '0.1rem' }}>{tab.icon}</span>
              {tab.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default CustomerLayout