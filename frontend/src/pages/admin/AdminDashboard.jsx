import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../../api/axios'

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 })
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get('/bookings')  // admin gets all bookings
        const all = res.data

        // Calculate stats from the bookings array
        setStats({
          total: all.length,
          pending: all.filter(b => b.status === 'pending').length,
          confirmed: all.filter(b => b.status === 'confirmed').length,
          completed: all.filter(b => b.status === 'completed').length,
        })

        // Show only the 5 most recent
        setRecentBookings(all.slice(0, 5))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statCards = [
    { label: 'Total Bookings', value: stats.total, color: '#3498db' },
    { label: 'Pending', value: stats.pending, color: '#f39c12' },
    { label: 'Confirmed', value: stats.confirmed, color: '#27ae60' },
    { label: 'Completed', value: stats.completed, color: '#9b59b6' },
  ]

  return (
    <div className="page">
      <h1 style={{ marginBottom: '0.3rem' }}>Admin Dashboard 📊</h1>
      <p style={{ color: '#aaa', marginBottom: '2rem' }}>Overview of all business activity.</p>

      {loading ? <p>Loading...</p> : (
        <>
          {/* Stats Cards */}
          <div className="grid-2" style={{ marginBottom: '2rem' }}>
            {statCards.map((s, i) => (
              <div className="card" key={i} style={{ borderLeft: `4px solid ${s.color}` }}>
                <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{s.label}</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Recent Bookings */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2>Recent Bookings</h2>
            <Link to="/admin/manage" style={{ color: '#e94560', textDecoration: 'none' }}>View All →</Link>
          </div>

          {recentBookings.map(b => (
            <div className="card" key={b._id} style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <p style={{ fontWeight: 'bold' }}>{b.customer?.name}</p>
                <p style={{ color: '#aaa', fontSize: '0.85rem' }}>{b.service?.name} • {b.date} {b.time}</p>
                <p style={{ color: '#aaa', fontSize: '0.85rem' }}>🚘 {b.vehicle?.plateNumber}</p>
              </div>
              <span className={`badge badge-${b.status}`}>{b.status}</span>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default AdminDashboard