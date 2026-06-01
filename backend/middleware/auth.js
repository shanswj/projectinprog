const jwt = require('jsonwebtoken')

// This function runs BEFORE the actual route logic
// req = the incoming request, res = our response, next = "okay, continue to the route"
const protect = (req, res, next) => {

  // 1. Grab the token from the request header
  // The frontend sends: Authorization: Bearer eyJhbGci...
  const authHeader = req.headers.authorization

  // 2. If there's no token at all, block the request
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized. Please log in.' })
  }

  // 3. Extract just the token part (remove the word "Bearer ")
  const token = authHeader.split(' ')[1]

  try {
    // 4. Verify the token using our secret key — if it was tampered with, this throws an error
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 5. Attach the user's ID and role to the request so routes can use it
    req.user = decoded  // decoded looks like: { id: '...', role: 'customer', iat: ..., exp: ... }

    // 6. Move on to the actual route
    next()

  } catch (error) {
    res.status(401).json({ message: 'Token is invalid or expired. Please log in again.' })
  }
}

// A second middleware — only lets admins through
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ message: 'Admin access only.' })
  }
}

module.exports = { protect, adminOnly }