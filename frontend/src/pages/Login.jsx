import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  // Update form state when user types
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // ...form = keep existing values, [e.target.name] = update just the changed field
  }

  const handleSubmit = async (e) => {
    e.preventDefault()  // prevent page reload (default form behaviour)
    setError('')
    setLoading(true)
    try {
      const res = await API.post('/users/login', form)
      login(res.data.user, res.data.token)  // save to context + localStorage

      // Redirect based on role
      if (res.data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
      // err.response?.data?.message = the error message from your backend
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.box}>
        <h2 style={{ marginBottom: '0.3rem' }}>Welcome Back 👋</h2>
        <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Log in to your account</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />

          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center', color: '#aaa' }}>
          Don't have an account? <Link to="/register" style={{ color: '#e94560' }}>Register</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  wrapper: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem' },
  box: { background: '#1a1a2e', padding: '2.5rem', borderRadius: '12px', width: '100%', maxWidth: '420px', border: '1px solid #2a2a4a' }
}

export default Login