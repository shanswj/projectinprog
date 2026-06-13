import { useState, useEffect } from 'react'
import API from '../api/axios'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [statusFilter])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const params = {}
      if (statusFilter) params.status = statusFilter
      const res = await API.get('/bookings/mine', { params })
      setBookings(res.data)
    } catch (err) {
      setError('Could not load bookings.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await API.put(`/bookings/${id}/cancel`)
      fetchBookings()
    } catch (err) {
      alert('Could not cancel booking.')
    }
  }

  return (
    <div className="page">
      <h1 style={{ marginBottom: '0.5rem' }}>My Bookings 📋</h1>
      <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Track and manage your wash appointments.</p>

      {/* Filter Bar */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        style={{ maxWidth: '200px', marginBottom: '1.5rem' }}
      >
        <option value="">All Statuses</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {bookings.map(b => (
        <div className="card" key={b._id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3>{b.service?.name || 'Service'}</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                🚘 {b.vehicle?.plateNumber} • {b.vehicle?.make} {b.vehicle?.model}
              </p>
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>
                📅 {b.date} at {b.time}
              </p>
              {b.notes && <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.3rem' }}>📝 {b.notes}</p>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              <span className={`badge badge-${b.status}`} style={{ textTransform: 'capitalize' }}>{b.status}</span>
            </div>
          </div>
          {b.status === 'pending' && (
            <button onClick={() => handleCancel(b._id)} style={styles.cancelBtn}>
              Cancel Booking
            </button>
          )}
        </div>
      ))}

      {!loading && bookings.length === 0 && (
        <p style={{ color: '#aaa', textAlign: 'center' }}>No bookings yet. <a href="/book" style={{ color: '#e94560' }}>Book your first wash!</a></p>
      )}
    </div>
  )
}

const styles = {
  cancelBtn: {
    marginTop: '0.8rem', background: 'transparent', border: '1px solid #c0392b',
    color: '#c0392b', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer'
  }
}

export default MyBookings