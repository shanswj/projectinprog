import { useState, useEffect } from 'react'
import API from '../../api/axios'

const AdminManage = () => {
  const [tab, setTab] = useState('bookings')  // which tab is active
  const [bookings, setBookings] = useState([])
  const [services, setServices] = useState([])
  const [users, setUsers] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [loading, setLoading] = useState(true)

  // New service form
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', price: '', duration: '', category: 'Exterior' })
  const [formMsg, setFormMsg] = useState('')

  useEffect(() => {
    loadData()
  }, [tab, statusFilter, dateFilter])

  const loadData = async () => {
    setLoading(true)
    try {
      if (tab === 'bookings') {
        const params = {}
        if (statusFilter) params.status = statusFilter
        if (dateFilter) params.date = dateFilter
        const res = await API.get('/bookings', { params })
        setBookings(res.data)
      } else if (tab === 'services') {
        const res = await API.get('/services')
        setServices(res.data)
      } else if (tab === 'users') {
        const res = await API.get('/users')
        setUsers(res.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}`, { status })
      loadData()
    } catch (err) {
      alert('Could not update booking.')
    }
  }

  const deleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return
    try {
      await API.delete(`/services/${id}`)
      loadData()
    } catch (err) {
      alert('Could not delete service.')
    }
  }

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await API.delete(`/users/${id}`)
      loadData()
    } catch (err) {
      alert('Could not delete user.')
    }
  }

  const handleAddService = async (e) => {
    e.preventDefault()
    setFormMsg('')
    try {
      await API.post('/services', serviceForm)
      setFormMsg('✅ Service added!')
      setServiceForm({ name: '', description: '', price: '', duration: '', category: 'Exterior' })
      loadData()
    } catch (err) {
      setFormMsg('❌ ' + (err.response?.data?.message || 'Failed to add service.'))
    }
  }

  return (
    <div className="page">
      <h1 style={{ marginBottom: '0.5rem' }}>Manage ⚙️</h1>
      <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Full control over bookings, services, and users.</p>

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {['bookings', 'services', 'users'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '0.5rem 1.2rem', borderRadius: '6px', cursor: 'pointer', border: 'none',
            background: tab === t ? '#e94560' : '#2a2a4a',
            color: 'white', textTransform: 'capitalize'
          }}>
            {t}
          </button>
        ))}
      </div>

      {loading && <p>Loading...</p>}

      {/* ─── BOOKINGS TAB ─── */}
      {tab === 'bookings' && !loading && (
        <>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ margin: 0 }}>
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ margin: 0 }} />
          </div>
          {bookings.map(b => (
            <div className="card" key={b._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <p style={{ fontWeight: 'bold' }}>{b.customer?.name} — {b.customer?.phone}</p>
                  <p style={{ color: '#aaa', fontSize: '0.85rem' }}>{b.service?.name} • RM{b.service?.price}</p>
                  <p style={{ color: '#aaa', fontSize: '0.85rem' }}>🚘 {b.vehicle?.plateNumber} {b.vehicle?.color} {b.vehicle?.make}</p>
                  <p style={{ color: '#aaa', fontSize: '0.85rem' }}>📅 {b.date} at {b.time}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span className={`badge badge-${b.status}`}>{b.status}</span>
                  <select
                    value={b.status}
                    onChange={e => updateBookingStatus(b._id, e.target.value)}
                    style={{ margin: 0, fontSize: '0.8rem', padding: '0.3rem' }}
                  >
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          {bookings.length === 0 && <p style={{ color: '#aaa' }}>No bookings found.</p>}
        </>
      )}

      {/* ─── SERVICES TAB ─── */}
      {tab === 'services' && !loading && (
        <>
          {/* Add Service Form */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Add New Service</h3>
            {formMsg && <p style={{ marginBottom: '0.5rem' }}>{formMsg}</p>}
            <form onSubmit={handleAddService}>
              <div className="grid-2">
                <div><label>Name</label><input name="name" value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} required /></div>
                <div><label>Category</label>
                  <select value={serviceForm.category} onChange={e => setServiceForm({...serviceForm, category: e.target.value})} style={{ margin: '0.4rem 0 1rem 0' }}>
                    <option>Exterior</option><option>Full</option><option>Premium</option><option>Add-on</option>
                  </select>
                </div>
                <div><label>Price (RM)</label><input type="number" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: e.target.value})} required /></div>
                <div><label>Duration (mins)</label><input type="number" value={serviceForm.duration} onChange={e => setServiceForm({...serviceForm, duration: e.target.value})} required /></div>
              </div>
              <label>Description</label>
              <input value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} required />
              <button type="submit" className="btn">Add Service</button>
            </form>
          </div>

          {/* Services List */}
          <div className="grid-2">
            {services.map(s => (
              <div className="card" key={s._id}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3>{s.name}</h3>
                  <span style={{ color: '#e94560', fontWeight: 'bold' }}>RM{s.price}</span>
                </div>
                <p style={{ color: '#aaa', fontSize: '0.85rem', margin: '0.3rem 0' }}>{s.category} • {s.duration} mins</p>
                <p style={{ color: '#888', fontSize: '0.85rem' }}>{s.description}</p>
                <button onClick={() => deleteService(s._id)} style={styles.deleteBtn}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ─── USERS TAB ─── */}
      {tab === 'users' && !loading && (
        <div>
          {users.map(u => (
            <div className="card" key={u._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <p style={{ fontWeight: 'bold' }}>{u.name}</p>
                <p style={{ color: '#aaa', fontSize: '0.85rem' }}>{u.email} • {u.phone || 'No phone'}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span style={{ color: u.role === 'admin' ? '#e94560' : '#27ae60', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  {u.role}
                </span>
                {u.role !== 'admin' && (
                  <button onClick={() => deleteUser(u._id)} style={styles.deleteBtn}>Delete</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  deleteBtn: {
    marginTop: '0.8rem', background: 'transparent', border: '1px solid #e94560',
    color: '#e94560', padding: '0.3rem 0.7rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem'
  }
}

export default AdminManage