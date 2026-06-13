import { useState, useEffect } from 'react'
import API from '../../api/axios'

const AdminManage = () => {
  const [tab, setTab] = useState('bookings')
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [services, setServices] = useState([])
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [resetMsg, setResetMsg] = useState('')
  const [serviceForm, setServiceForm] = useState({ name: '', description: '', price: '', duration: '', category: 'Basic' })
  const [formMsg, setFormMsg] = useState('')

  useEffect(() => { loadData() }, [tab, statusFilter, dateFilter])

  const loadData = async () => {
    setLoading(true)
    try {
      if (tab === 'bookings') {
        const params = {}
        if (statusFilter) params.status = statusFilter
        if (dateFilter) params.date = dateFilter
        const res = await API.get('/bookings', { params })
        setBookings(res.data)
      } else if (tab === 'users') {
        const res = await API.get('/users')
        setUsers(res.data)
      } else if (tab === 'services') {
        const res = await API.get('/services')
        setServices(res.data)
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

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return
    try {
      await API.delete(`/users/${id}`)
      loadData()
    } catch (err) {
      alert('Could not delete user.')
    }
  }

  const resetCard = async (id, name) => {
    if (!window.confirm(`Reset punch card for ${name}?`)) return
    try {
      await API.put(`/users/${id}/reset-card`)
      setResetMsg(`✅ Card reset for ${name}`)
      setTimeout(() => setResetMsg(''), 3000)
      loadData()
    } catch (err) {
      alert('Could not reset card.')
    }
  }

  const redeemFreeWash = async (id, name) => {
    if (!window.confirm(`Mark free wash as used for ${name}?`)) return
    try {
      await API.put(`/users/${id}/redeem-free`)
      setResetMsg(`✅ Free wash marked as used for ${name}`)
      setTimeout(() => setResetMsg(''), 3000)
      loadData()
    } catch (err) {
      alert('Could not update.')
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

  const handleAddService = async (e) => {
    e.preventDefault()
    setFormMsg('')
    try {
      await API.post('/services', serviceForm)
      setFormMsg('✅ Service added!')
      setServiceForm({ name: '', description: '', price: '', duration: '', category: 'Basic' })
      loadData()
    } catch (err) {
      setFormMsg('❌ ' + (err.response?.data?.message || 'Failed to add service.'))
    }
  }

  const filterButtons = ['', 'confirmed', 'completed', 'cancelled']

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <div className="page">
        <h1 style={{ color: '#1a1a1a', marginBottom: '0.3rem' }}>Manage ⚙️</h1>
        <p style={{ color: '#888', marginBottom: '1.5rem' }}>Manage bookings, services and customers.</p>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {['bookings', 'services', 'users'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '0.5rem 1.5rem', borderRadius: '20px', cursor: 'pointer',
              border: '1.5px solid #ddd', fontWeight: '600', fontSize: '0.9rem',
              background: tab === t ? '#1a1a2e' : 'white',
              color: tab === t ? 'white' : '#1a1a1a',
              textTransform: 'capitalize'
            }}>
              {t}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: '#888' }}>Loading...</p>}

        {/* ─── BOOKINGS TAB ─── */}
        {tab === 'bookings' && !loading && (
          <>
            {/* Status filter buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {filterButtons.map(f => (
                <button key={f} onClick={() => setStatusFilter(f)} style={{
                  padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer',
                  border: '1.5px solid #ddd', fontSize: '0.82rem', fontWeight: '600',
                  background: statusFilter === f ? '#1a1a2e' : 'white',
                  color: statusFilter === f ? 'white' : '#1a1a1a',
                  textTransform: 'capitalize'
                }}>
                  {f === '' ? 'All' : f}
                </button>
              ))}
            </div>

            {/* Date filter */}
            <input
              type="date"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              style={{ maxWidth: '180px', marginBottom: '1.5rem', cursor: 'pointer' }}
              onClick={e => e.target.showPicker()}
            />

            {bookings.map(b => (
              <div key={b._id} className="card" style={{
  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem'
}}>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#1a1a1a' }}>
                    {b.customer?.name}
                    <span style={{ color: '#aaa', fontWeight: 'normal', fontSize: '0.85rem' }}>
                      {' '}· {b.customer?.phone}
                    </span>
                  </p>
                  <p style={{ color: '#888', fontSize: '0.85rem' }}>{b.service?.name} · RM{b.service?.price}</p>
                  <p style={{ color: '#888', fontSize: '0.85rem' }}>🚘 {b.vehicle?.plateNumber} {b.vehicle?.color} {b.vehicle?.make}</p>
                  <p style={{ color: '#888', fontSize: '0.85rem' }}>📅 {b.date} at {b.time}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>

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
            {bookings.length === 0 && (
              <div className="card" style={{ textAlign: 'center', color: '#aaa', padding: '2rem' }}>
                No bookings found.
              </div>
            )}
          </>
        )}

        {/* ─── SERVICES TAB ─── */}
        {tab === 'services' && !loading && (
          <>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', color: '#1a1a1a' }}>Add New Service</h3>
              {formMsg && (
                <p style={{ marginBottom: '0.5rem', color: formMsg.startsWith('✅') ? '#27ae60' : '#e74c3c' }}>
                  {formMsg}
                </p>
              )}
              <form onSubmit={handleAddService}>
                <div className="grid-2">
                  <div>
                    <label>Name</label>
                    <input value={serviceForm.name} onChange={e => setServiceForm({...serviceForm, name: e.target.value})} required />
                  </div>
                 
                  <div>
                    <label>Price (RM)</label>
                    <input type="number" value={serviceForm.price} onChange={e => setServiceForm({...serviceForm, price: e.target.value})} required />
                  </div>
                  <div>
                    <label>Duration (mins)</label>
                    <input type="number" value={serviceForm.duration} onChange={e => setServiceForm({...serviceForm, duration: e.target.value})} required />
                  </div>
                </div>
                <label>Description</label>
                <input value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} required />
                <button type="submit" className="btn" style={{ marginTop: '0.5rem' }}>Add Service</button>
              </form>
            </div>

            <div className="grid-2">
              {services.map(s => (
                <div key={s._id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <h3 style={{ color: '#1a1a1a' }}>{s.name}</h3>
                    <span style={{ fontWeight: 'bold', color: '#1a1a2e' }}>RM{s.price}</span>
                  </div>
                  <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.3rem' }}>{s.category} · {s.duration} mins</p>
                  <p style={{ color: '#aaa', fontSize: '0.85rem' }}>{s.description}</p>
                  <button onClick={() => deleteService(s._id)} style={{
                    marginTop: '0.8rem', background: 'transparent',
                    border: '1px solid #e74c3c', color: '#e74c3c',
                    padding: '0.3rem 0.7rem', borderRadius: '4px',
                    cursor: 'pointer', fontSize: '0.82rem'
                  }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
            {services.length === 0 && <p style={{ color: '#888' }}>No services yet. Add one above!</p>}
          </>
        )}

        {/* ─── USERS TAB ─── */}
        {tab === 'users' && !loading && (
          <>
            {resetMsg && (
              <div style={{
                background: '#e8f8ee', border: '1px solid #27ae60', borderRadius: '8px',
                padding: '0.8rem 1rem', marginBottom: '1rem', color: '#1e7e45', fontSize: '0.9rem'
              }}>
                {resetMsg}
              </div>
            )}

            {users.filter(u => u.role !== 'admin').map(u => (
              <div key={u._id} className="card" style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem'
              }}>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#1a1a1a' }}>{u.name}</p>
                  <p style={{ color: '#888', fontSize: '0.85rem' }}>{u.email} · {u.phone || 'No phone'}</p>
                  <p style={{ color: '#aaa', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                    Card resets: {u.punchCardResets || 0} · Free used: {u.freeWashesRedeemed || 0}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button onClick={() => resetCard(u._id, u.name)} style={{
                    background: 'transparent', border: '1px solid #27ae60',
                    color: '#27ae60', padding: '0.4rem 0.8rem',
                    borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem'
                  }}>
                    Reset Card
                  </button>
                  <button onClick={() => redeemFreeWash(u._id, u.name)} style={{
                    background: 'transparent', border: '1px solid #f0a500',
                    color: '#f0a500', padding: '0.4rem 0.8rem',
                    borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem'
                  }}>
                    Mark Free Used
                  </button>
                  <button onClick={() => deleteUser(u._id)} style={{
                    background: 'transparent', border: '1px solid #e74c3c',
                    color: '#e74c3c', padding: '0.4rem 0.8rem',
                    borderRadius: '6px', cursor: 'pointer', fontSize: '0.82rem'
                  }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminManage