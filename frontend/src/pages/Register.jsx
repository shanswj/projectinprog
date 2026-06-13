import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await API.post('/users/register', form)
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.box}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🚗</span>
          <h2 style={{ marginTop: '0.5rem', fontSize: '1.4rem', fontWeight: '700' }}>Create account</h2>
          <p style={{ color: '#888', fontSize: '0.9rem', marginTop: '0.3rem' }}>Start booking your car washes</p>
        </div>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />

          <label>Phone Number</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} />

          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p style={{ marginTop: '1.2rem', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1a1a2e', fontWeight: '600', textDecoration: 'none' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    minHeight: '80vh', padding: '2rem', background: '#f5f5f5'
  },
  box: {
    background: 'white', padding: '2.5rem', borderRadius: '16px',
    width: '100%', maxWidth: '400px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  }
}

export default Register