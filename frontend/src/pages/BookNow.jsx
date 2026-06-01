import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

const BookNow = () => {
  const [services, setServices] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState({ service: '', vehicle: '', date: '', time: '', notes: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Load services and user's vehicles when page opens
  useEffect(() => {
    API.get('/services').then(res => setServices(res.data))
    API.get('/vehicles/mine').then(res => setVehicles(res.data))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await API.post('/bookings', form)
      navigate('/my-bookings')  // go to bookings page after successful booking
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Today's date in YYYY-MM-DD format (for min date on date picker)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
      <div style={styles.box}>
        <h2 style={{ marginBottom: '0.3rem' }}>Book a Wash 📅</h2>
        <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Fill in the details below</p>

        {error && <p className="error">{error}</p>}

        {vehicles.length === 0 && (
          <p className="error">You have no vehicles registered. <a href="/my-vehicles" style={{ color: '#e94560' }}>Add one first.</a></p>
        )}

        <form onSubmit={handleSubmit}>
          <label>Select Service</label>
          <select name="service" value={form.service} onChange={handleChange} required>
            <option value="">-- Choose a service --</option>
            {services.map(s => (
              <option key={s._id} value={s._id}>{s.name} — RM{s.price}</option>
            ))}
          </select>

          <label>Select Vehicle</label>
          <select name="vehicle" value={form.vehicle} onChange={handleChange} required>
            <option value="">-- Choose your vehicle --</option>
            {vehicles.map(v => (
              <option key={v._id} value={v._id}>{v.plateNumber} ({v.make} {v.model})</option>
            ))}
          </select>

          <label>Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} min={today} required />

          <label>Preferred Time</label>
          <select name="time" value={form.time} onChange={handleChange} required>
            <option value="">-- Choose a time slot --</option>
            {['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <label>Notes (optional)</label>
          <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} placeholder="e.g. Please focus on the rims" />

          <button type="submit" className="btn" disabled={loading || vehicles.length === 0}>
            {loading ? 'Booking...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  box: {
    background: '#1a1a2e', padding: '2.5rem', borderRadius: '12px',
    width: '100%', maxWidth: '520px', border: '1px solid #2a2a4a'
  }
}

export default BookNow