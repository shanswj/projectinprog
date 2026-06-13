import { useState, useEffect } from 'react'
import API from '../api/axios'

const MyVehicles = () => {
  const [vehicles, setVehicles] = useState([])
  const [form, setForm] = useState({ plateNumber: '', make: '', model: '', color: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch user's vehicles on page load
  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      const res = await API.get('/vehicles/mine')
      setVehicles(res.data)
    } catch (err) {
      setError('Could not load vehicles.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAdd = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    try {
      await API.post('/vehicles', form)
      setSuccess('Vehicle added!')
      setForm({ plateNumber: '', make: '', model: '', color: '' })
      fetchVehicles()  // refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add vehicle.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this vehicle?')) return
    try {
      await API.delete(`/vehicles/${id}`)
      fetchVehicles()
    } catch (err) {
      setError('Could not remove vehicle.')
    }
  }

  return (
    <div className="page">
      <h1 style={{ marginBottom: '0.5rem' }}>My Vehicles 🚘</h1>
      <p style={{ color: '#aaa', marginBottom: '2rem' }}>Manage your registered cars.</p>

      {/* Add Vehicle Form */}
      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Add New Vehicle</h3>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleAdd}>
          <div className="grid-2">
            <div>
              <label>Plate Number</label>
              <input name="plateNumber" value={form.plateNumber} onChange={handleChange} placeholder="e.g. ABC 1234" required />
            </div>
            <div>
              <label>Make (Brand)</label>
              <input name="make" value={form.make} onChange={handleChange} placeholder="e.g. Toyota" required />
            </div>
            <div>
              <label>Model</label>
              <input name="model" value={form.model} onChange={handleChange} placeholder="e.g. Vios" required />
            </div>
            <div>
              <label>Color</label>
              <input name="color" value={form.color} onChange={handleChange} placeholder="e.g. Silver" required />
            </div>
          </div>
          <button type="submit" className="btn" style={{ background:'linear-gradient(135deg, #6b7fa3, #4a5f8a)', marginTop: '0.5rem' }}>Add Vehicle</button>
        </form>
      </div>

      {/* Vehicles List */}
      {loading ? <p>Loading...</p> : (
        <div className="grid-2">
          {vehicles.map(v => (
            <div className="card" key={v._id}>
              <h3>{v.plateNumber}</h3>
              <p style={{ color: '#aaa' }}>{v.make} {v.model} • {v.color}</p>
              <button
                onClick={() => handleDelete(v._id)}
                style={styles.deleteBtn}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      {!loading && vehicles.length === 0 && <p style={{ color: '#aaa' }}>No vehicles yet. Add one above!</p>}
    </div>
  )
}

const styles = {
  deleteBtn: {
    marginTop: '0.8rem', background: 'transparent', border: '1px solid #e94560',
    color: '#e94560', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer'
  }
}

export default MyVehicles