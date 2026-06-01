import { useState, useEffect } from 'react'
import API from '../api/axios'

const Services = () => {
  const [services, setServices] = useState([])
  const [category, setCategory] = useState('')   // filter state
  const [search, setSearch] = useState('')       // search state
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch services whenever filter or search changes
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        // Build query string based on what the user typed
        const params = {}
        if (category) params.category = category
        if (search) params.name = search

        const res = await API.get('/services', { params })  // GET /api/services?category=...&name=...
        setServices(res.data)
      } catch (err) {
        setError('Could not load services.')
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [category, search])  // re-run when category or search changes

  return (
    <div className="page">
      <h1 style={{ marginBottom: '0.5rem' }}>Our Services</h1>
      <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Choose from our range of professional wash packages.</p>

      {/* Search and Filter Bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '200px', margin: 0 }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ flex: 1, minWidth: '150px', margin: 0 }}
        >
          <option value="">All Categories</option>
          <option value="Exterior">Exterior</option>
          <option value="Full">Full</option>
          <option value="Premium">Premium</option>
          <option value="Add-on">Add-on</option>
        </select>
      </div>

      {loading && <p>Loading services...</p>}
      {error && <p className="error">{error}</p>}

      <div className="grid-2">
        {services.map(service => (
          <div className="card" key={service._id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h3>{service.name}</h3>
              <span style={styles.categoryBadge}>{service.category}</span>
            </div>
            <p style={{ color: '#aaa', margin: '0.5rem 0', fontSize: '0.9rem' }}>{service.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <span style={{ color: '#e94560', fontWeight: 'bold', fontSize: '1.2rem' }}>RM {service.price}</span>
              <span style={{ color: '#aaa', fontSize: '0.9rem' }}>⏱ {service.duration} mins</span>
            </div>
          </div>
        ))}
      </div>

      {!loading && services.length === 0 && (
        <p style={{ textAlign: 'center', color: '#aaa' }}>No services found.</p>
      )}
    </div>
  )
}

const styles = {
  categoryBadge: {
    background: '#2a2a4a', padding: '0.2rem 0.6rem',
    borderRadius: '20px', fontSize: '0.75rem', color: '#aaa'
  }
}

export default Services