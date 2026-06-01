const express = require('express')
const router = express.Router()
const Booking = require('../models/Booking')
const { protect, adminOnly } = require('../middleware/auth')

// GET /api/bookings/mine — customer sees their own bookings
// ?status=pending to filter by status ← search/filter requirement
router.get('/mine', protect, async (req, res) => {
  try {
    const filter = { customer: req.user.id }
    if (req.query.status) filter.status = req.query.status

    const bookings = await Booking.find(filter)
      .populate('service', 'name price duration')    // replace service ID with name/price/duration
      .populate('vehicle', 'plateNumber make model') // replace vehicle ID with plate/make/model
      .sort({ createdAt: -1 })                       // newest first
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch your bookings.', error: error.message })
  }
})

// POST /api/bookings — create a booking (logged in users)
router.post('/', protect, async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, customer: req.user.id })
    res.status(201).json({ message: 'Booking created! We will confirm shortly.', booking })
  } catch (error) {
    res.status(400).json({ message: 'Could not create booking.', error: error.message })
  }
})

// PUT /api/bookings/:id/cancel — customer cancels their own booking
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, customer: req.user.id },
      { status: 'cancelled' },
      { new: true }
    )
    if (!booking) return res.status(404).json({ message: 'Booking not found.' })
    res.json({ message: 'Booking cancelled.', booking })
  } catch (error) {
    res.status(500).json({ message: 'Could not cancel booking.', error: error.message })
  }
})

// ─── ADMIN ROUTES ───────────────────────────────────────────────────────────

// GET /api/bookings — admin sees ALL bookings
// ?status=pending&date=2026-02-10 to filter ← search/filter requirement
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const filter = {}
    if (req.query.status) filter.status = req.query.status
    if (req.query.date) filter.date = req.query.date

    const bookings = await Booking.find(filter)
      .populate('customer', 'name email phone')
      .populate('service', 'name price')
      .populate('vehicle', 'plateNumber make model color')
      .sort({ date: 1, time: 1 })   // sort by date then time
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch bookings.', error: error.message })
  }
})

// PUT /api/bookings/:id — admin updates booking status
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!booking) return res.status(404).json({ message: 'Booking not found.' })
    res.json({ message: 'Booking updated!', booking })
  } catch (error) {
    res.status(400).json({ message: 'Could not update booking.', error: error.message })
  }
})

// DELETE /api/bookings/:id — admin deletes a booking
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Booking not found.' })
    res.json({ message: 'Booking deleted.' })
  } catch (error) {
    res.status(500).json({ message: 'Could not delete booking.', error: error.message })
  }
})

module.exports = router