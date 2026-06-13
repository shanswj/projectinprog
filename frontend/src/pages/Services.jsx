import { useState, useEffect } from 'react'
import API from '../api/axios'

const Services = () => {
  const [services, setServices] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const params = {}
        if (search) params.name = search
        const res = await API.get('/services', { params })
        setServices(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [search])

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <div className="customer-page">
        <h1 style={{ marginBottom: '0.3rem', color: '#1a1a1a' }}>Our Services ✨</h1>
        <p style={{ color: '#888', marginBottom: '1.2rem', fontSize: '0.9rem' }}>View our range of services with prices.</p>

        {loading && <p style={{ color: '#888' }}>Loading...</p>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {services.map(s => (
            <div key={s._id} className="customer-card" style={{ padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ color: '#1a1a1a', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{s.name}</h3>
                  <p style={{ color: '#888', fontSize: '0.82rem' }}>{s.description}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: '1rem' }}>
                  <p style={{ fontWeight: 'bold', color: '#118C4F', fontSize: '1rem' }}>RM {s.price}</p>
                  <p style={{ color: '#aaa', fontSize: '0.78rem' }}>⏱ {s.duration} mins</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && services.length === 0 && (
          <div className="customer-card" style={{ textAlign: 'center', color: '#aaa', padding: '2rem' }}>
            No services found.
          </div>
        )}
      </div>
    </div>
  )
}

export default Services