import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>

      {/* Hero */}
      <div style={styles.hero}>
        <span style={{ fontSize: '3rem' }}>🚗</span>
        <h1 style={styles.heroTitle}>Sudsnautica</h1>
        <p style={styles.heroSub}>Professional car wash services, booked in seconds.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" style={styles.btnDark}>Get Started</Link>
          <Link to="/login" style={styles.btnOutline}>Login</Link>
        </div>
      </div>

      {/* Features */}
      <div className="page">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.4rem' }}>Why Choose Us?</h2>
        <div className="grid-3">
          {features.map((f, i) => (
            <div className="card" key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>{f.title}</h3>
              <p style={{ color: '#888', fontSize: '0.88rem' }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <h2 style={{ textAlign: 'center', margin: '2rem 0 1.5rem', fontSize: '1.4rem' }}>Our Packages</h2>
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
  {packages.map((p, i) => (
    <div className="card" key={i}>
      <h3 style={{ marginBottom: '0.3rem', fontSize: '0.95rem' }}>{p.name}</h3>
      <p style={{ color: '#888', fontSize: '0.82rem', marginBottom: '0.8rem' }}>{p.desc}</p>
      <p style={{ fontWeight: 'bold', color: '#1a1a2e', fontSize: '0.9rem' }}>From RM {p.price}</p>
    </div>
  ))}
</div>
      </div>
    </div>
  )
}

const features = [
  { icon: '⚡', title: 'Fast Service', desc: 'Most washes completed under 45 minutes.' },
  { icon: '✨', title: 'Quality Products', desc: 'Premium soaps and equipment on every car.' },
  { icon: '📱', title: 'Easy Booking', desc: 'Book and track your wash from your phone.' },
]

const packages = [
  { name: '🚿 Exterior Wash', desc: 'Body wash, rinse, and dry.', price: '15' },
  { name: '🧹 Interior Vacuum', desc: 'Vacuum & wipe down.', price: '15' },
  { name: '💎 Premium Detail', desc: 'Full exterior + interior + wax.', price: '80' },
  { name: '➕ Add-Ons', desc: 'Tyre shine, engine wash,etc.', price: '100' },
]

const styles = {
  hero: {
    padding: '5rem 2rem',
    textAlign: 'center',
    background: 'white',
    borderBottom: '1px solid #eee'
  },
  heroTitle: { fontSize: '2.5rem', fontWeight: '800', margin: '0.5rem 0', color: '#1a1a2e' },
  heroSub: { color: '#888', fontSize: '1.1rem', marginBottom: '2rem' },
  btnDark: {
    background: '#1a1a2e', color: 'white', padding: '0.8rem 2rem',
    borderRadius: '10px', textDecoration: 'none', fontWeight: '600'
  },
  btnOutline: {
    border: '2px solid #1a1a2e', color: '#1a1a2e', padding: '0.8rem 2rem',
    borderRadius: '10px', textDecoration: 'none', fontWeight: '600'
  }
}

export default Home