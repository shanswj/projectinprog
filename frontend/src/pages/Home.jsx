import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const { user } = useAuth()

  return (
    <div>
      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>🚗 Gleamorous ✨ </h1>
        <p style={styles.heroSub}>Professional car wash services, booked in seconds.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/services" style={styles.btnPrimary}>View Services</Link>
          {user
            ? <Link to="/book" style={styles.btnOutline}>Book Now</Link>
            : <Link to="/register" style={styles.btnOutline}>Get Started</Link>
          }
        </div>
      </div>

      {/* Features Section */}
      <div className="page">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Why Choose Us?</h2>
        <div className="grid-3">
          {features.map((f, i) => (
            <div className="card" key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem' }}>{f.icon}</div>
              <h3 style={{ margin: '0.5rem 0' }}>{f.title}</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Service Highlights */}
        <h2 style={{ textAlign: 'center', margin: '2rem 0' }}>Our Packages</h2>
        <div className="grid-2">
          {packages.map((p, i) => (
            <div className="card" key={i}>
              <h3>{p.name}</h3>
              <p style={{ color: '#aaa', margin: '0.5rem 0' }}>{p.desc}</p>
              <p style={{ color: '#e94560', fontWeight: 'bold' }}>From RM {p.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const features = [
  { icon: '⚡', title: 'Fast Service', desc: 'Most washes completed in under 45 minutes.' },
  { icon: '👍', title: 'Quality Products', desc: 'Premium soaps and equipment used on every car.' },
  { icon: '📱', title: 'Easy Booking', desc: 'Book, manage and track your wash from your phone.' },
]

const packages = [
  { name: '🚿 Exterior Wash', desc: 'Wash, Rinse, and Dry.', price: '15' },
  { name: '🧹 Full Interior', desc: 'Vacuum, Wipe down, and Nano Mist.', price: '35' },
  { name: '💎 Premium Detail', desc: 'Exterior/Interior Water Wax + Polish.', price: '80' },
]

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    padding: '5rem 2rem',
    textAlign: 'center',
    borderBottom: '1px solid #2a2a4a'
  },
  heroTitle: { fontSize: '3rem', color: '#e94560', marginBottom: '1rem' },
  heroSub: { fontSize: '1.2rem', color: '#aaa', marginBottom: '2rem' },
  btnPrimary: {
    background: '#e94560', color: 'white', padding: '0.8rem 2rem',
    borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold'
  },
  btnOutline: {
    border: '2px solid #e94560', color: '#e94560', padding: '0.8rem 2rem',
    borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold'
  }
}

export default Home