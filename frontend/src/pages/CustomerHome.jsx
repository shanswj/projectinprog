import { useState, useEffect, useCallback } from 'react'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'

const PUNCHES_FOR_FREE = 10

const CustomerHome = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [allBookings, setAllBookings] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const [completedRes, allRes, profileRes] = await Promise.all([
        API.get('/bookings/mine', { params: { status: 'completed' } }),
        API.get('/bookings/mine'),
        API.get('/users/profile')
      ])
      setBookings(completedRes.data)
      setAllBookings(allRes.data)
      setProfile(profileRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [fetchData])

  const totalCompleted = bookings.length
  const resets = profile?.punchCardResets || 0
  const freeRedeemed = profile?.freeWashesRedeemed || 0
  const currentPunches = Math.max(0, totalCompleted - (resets * PUNCHES_FOR_FREE))
  const isFreeReady = currentPunches >= PUNCHES_FOR_FREE
  const displayStamps = isFreeReady ? PUNCHES_FOR_FREE : currentPunches

  const stamps = Array.from({ length: PUNCHES_FOR_FREE }, (_, i) => {
    if (isFreeReady) return 'free'
    return i < displayStamps ? 'filled' : 'empty'
  })

  return (
    <div className="customer-page">

      {/* Welcome + Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
        <div>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>Welcome back</p>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700' }}>{user?.name} 👋</h2>
        </div>
      </div>

      {loading ? (
        <div className="customer-card" style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>
          Loading your card...
        </div>
      ) : (
        <>
          {/* Free Wash Banner */}
          {isFreeReady && (
            <div className="free-banner">
              🎉 Free car wash this visit! Show this screen to staff.
            </div>
          )}

          {/* Punch Card */}
          <div className="customer-card" style={{
            background: 'linear-gradient(135deg, #6b7fa3, #4a5f8a)',
            color: 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}></div>

            <div className="punch-grid">
              {stamps.map((s, i) => (
                <div key={i} className={`punch ${s}`}>
                  {s === 'filled' && '✓'}
                  {s === 'free' && '✓'}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                {isFreeReady ? '10 / 10 washes' : `${displayStamps} / ${PUNCHES_FOR_FREE} washes`}
              </span>
              {isFreeReady && (
                <span style={{
                  background: '#f0a500', color: '#1a1a1a',
                  padding: '0.3rem 0.8rem', borderRadius: '20px',
                  fontSize: '0.8rem', fontWeight: 'bold'
                }}>
                  ✨ Claimable free wash today!
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="stat-row">
            <div className="stat-box">
              <div className="stat-num">{totalCompleted}</div>
              <div className="stat-label">Total washes</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">{freeRedeemed}</div>
              <div className="stat-label">Free redeemed</div>
            </div>
          </div>

          {/* Recent History */}
          <div className="customer-card">
            <h3 style={{ marginBottom: '0.8rem', fontSize: '1rem', fontWeight: '600' }}>⏱ Recent washes</h3>
            {allBookings.length === 0 && (
              <p style={{ color: '#aaa', fontSize: '0.9rem', textAlign: 'center', padding: '1rem 0' }}>
                No bookings yet. Tap Book to get started!
              </p>
            )}
            {allBookings.slice(0, 4).map(b => (
              <div className="history-item" key={b._id}>
                <div className="hi-left">
                  <span>
                    {b.status === 'completed' ? '🚿' :
                     b.status === 'pending' ? '⏳' :
                     b.status === 'confirmed' ? '✅' : '❌'}
                  </span>
                  <div>
                    <div className="hi-label">{b.service?.name || 'Wash'}</div>
                    <div className="hi-date">{b.date} · {b.time}</div>
                  </div>
                </div>
                <span className={`badge badge-${b.status}`} style={{ textTransform: 'capitalize' }}>{b.status}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default CustomerHome