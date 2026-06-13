const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { protect, adminOnly } = require('../middleware/auth')

// Helper function — generates a login token for a user
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },  // data baked INTO the token
    process.env.JWT_SECRET,             // secret key used to sign it
    { expiresIn: '7d' }                 // token expires in 7 days
  )
}

// ─── PUBLIC ROUTES (no login needed) ───────────────────────────────────────

// POST /api/users/register
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body  // pull data from request body

  try {
    // Check if email already exists
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' })
    }

    // Create and save the new user (password gets hashed by the model's pre-save hook)
    const user = await User.create({ name, email, password, phone })

    // Send back the user data + token
    res.status(201).json({
      message: 'Account created successfully!',
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    })

} catch (error) {
  console.error('REGISTER ERROR:', error)  // add this line
  res.status(500).json({ message: 'Registration failed.', error: error.message })
}
})

// POST /api/users/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email.' })
    }

    // Check if password matches using the method we defined in the model
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password.' })
    }

    res.json({
      message: 'Logged in successfully!',
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    })

  } catch (error) {
    res.status(500).json({ message: 'Login failed.', error: error.message })
  }
})

// ─── PROTECTED ROUTES (must be logged in) ──────────────────────────────────

// GET /api/users/profile — get your own profile
router.get('/profile', protect, async (req, res) => {
  try {
    // req.user.id comes from the token (set in auth middleware)
    const user = await User.findById(req.user.id).select('-password')  // exclude password from response
    if (!user) return res.status(404).json({ message: 'User not found.' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch profile.', error: error.message })
  }
})

// ─── ADMIN ONLY ROUTES ──────────────────────────────────────────────────────

// GET /api/users — get ALL users (admin only)
// ?role=admin or ?role=customer to filter
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const filter = {}
    if (req.query.role) filter.role = req.query.role   // search/filter by role

    const users = await User.find(filter).select('-password')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch users.', error: error.message })
  }
})

// DELETE /api/users/:id — delete a user (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found.' })
    res.json({ message: 'User deleted successfully.' })
  } catch (error) {
    res.status(500).json({ message: 'Could not delete user.', error: error.message })
  }
})

// PUT /api/users/:id/reset-card — admin resets a customer's punch card
router.put('/:id/reset-card', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { punchCardResets: 1 } },  // $inc increments by 1
      { new: true }
    )
    if (!user) return res.status(404).json({ message: 'User not found.' })
    res.json({ message: 'Card reset successfully.', punchCardResets: user.punchCardResets })
  } catch (error) {
    res.status(500).json({ message: 'Could not reset card.', error: error.message })
  }
})

// PUT /api/users/:id/redeem-free — admin marks a free wash as used
router.put('/:id/redeem-free', protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $inc: { freeWashesRedeemed: 1 } },
      { new: true }
    )
    if (!user) return res.status(404).json({ message: 'User not found.' })
    res.json({ message: 'Free wash marked as redeemed.', freeWashesRedeemed: user.freeWashesRedeemed })
  } catch (error) {
    res.status(500).json({ message: 'Could not redeem.', error: error.message })
  }
})
module.exports = router