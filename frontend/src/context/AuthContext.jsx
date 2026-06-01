import { createContext, useContext, useState, useEffect } from 'react'

// 1. Create the context — think of it as a "global variable holder"
const AuthContext = createContext()

// 2. The Provider wraps your whole app and shares the state
export const AuthProvider = ({ children }) => {

  // user = the logged in user object, or null if not logged in
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // When the app first loads, check if a user was previously logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))  // restore the user from localStorage
    }
    setLoading(false)
  }, [])  // empty array = run once on mount

  // Login: save user + token to state AND localStorage
  const login = (userData, token) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', token)
  }

  // Logout: clear everything
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    // Everything inside value is accessible to any page that uses useAuth()
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. Custom hook — any page imports this to get the user
export const useAuth = () => useContext(AuthContext)