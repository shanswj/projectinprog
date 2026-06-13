import { useState, useEffect } from 'react'
import API from '../../api/axios'

const AdminDashboard = () => {
  const [allBookings, setAllBookings] = useState([])
  const [filtered, setFiltered] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const res = await API.get('/bookings')
      setAllBookings(res.data)
      setFiltered(res.data)
      setActiveFilter('all')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleFilter = (status) => {
    setActiveFilter(status)
    if (status === 'all') {
      setFiltered(allBookings)
    } else {
      setFiltered(allBookings.filter(b => b.status === status)) 
    }
  }

  const updateBookingStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}`, { status })
      await fetchData()
    } catch (err) {
      alert('Could not update booking.')
    }
  }

  const stats = [
    { label: 'Total Bookings', value: allBookings.length },
    { label: 'Completed',      value: allBookings.filter(b => b.status === 'completed').length },
    { label: 'Cancelled',      value: allBookings.filter(b => b.status === 'cancelled').length },
  ]

  const filterButtons = ['all', 'confirmed', 'completed', 'cancelled']

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <div className="page">
        <h1 style={{ marginBottom: '0.3rem', color: '#1a1a1a' }}>Dashboard 📊</h1>
        <p style={{ color: '#888', marginBottom: '2rem' }}>Overview of all business activity.</p>

        {loading ? <p style={{ color: '#888' }}>Loading...</p> : (
          <>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem', marginBottom: '2rem'
            }}>
              {stats.map((s, i) => (
                <div key={i} className="card" style={{ textAlign: 'center' }}>
                  <p style={{ color: '#888', fontSize: '0.82rem', marginBottom: '0.4rem' }}>{s.label}</p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1a1a1a' }}>{s.value}</p>
                </div>
              ))}
            </div>

            <h2 style={{ color: '#1a1a1a', fontSize: '1.1rem', marginBottom: '1rem' }}>Recent Bookings</h2>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {filterButtons.map(f => (
                <button key={f} onClick={() => handleFilter(f)} style={{
                  padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer',
                  border: '1.5px solid #ddd', fontSize: '0.82rem', fontWeight: '600',
                  background: activeFilter === f ? '#1a1a2e' : 'white',
                  color: activeFilter === f ? 'white' : '#1a1a1a',
                  textTransform: 'capitalize'
                }}>
                  {f === 'all' ? 'All' : f}
                </button>
              ))}
            </div>

            {filtered.map(b => (
              <div key={b._id} className="card" style={{
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem'
}}>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#1a1a1a' }}>{b.customer?.name}</p>
                  <p style={{ color: '#888', fontSize: '0.85rem' }}>
                    {b.service?.name} · {b.date} {b.time}
                  </p>
                  <p style={{ color: '#888', fontSize: '0.85rem' }}>🚘 {b.vehicle?.plateNumber}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <select
  value={b.status}
  onChange={e => updateBookingStatus(b._id, e.target.value)}
  style={{
    padding: '0.4rem 0.7rem',
    borderRadius: '20px',
    border: 'none',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer',
    outline: 'none',
    background:
      b.status === 'completed' ? '#d1f3e0' :
      b.status === 'confirmed' ? '#fff3cd' :
      b.status === 'cancelled' ? '#fde8e8' : '#f0f0f0',
    color:
      b.status === 'completed' ? '#155724' :
      b.status === 'confirmed' ? '#856404' :
      b.status === 'cancelled' ? '#842029' : '#555',
  }}
>
  <option value="confirmed">Confirmed</option>
  <option value="completed">Completed</option>
  <option value="cancelled">Cancelled</option>
</select>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="card" style={{ textAlign: 'center', color: '#aaa', padding: '2rem' }}>
                No bookings found.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard