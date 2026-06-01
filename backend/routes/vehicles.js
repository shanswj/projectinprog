const express = require('express')
const router = express.Router()
const Vehicle = require('../models/Vehicle')
const { protect, adminOnly } = require('../middleware/auth')

// GET /api/vehicles/mine — get all vehicles belonging to the logged-in user
router.get('/mine', protect, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user.id })
    res.json(vehicles)
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch your vehicles.', error: error.message })
  }
})

// POST /api/vehicles — register a new vehicle (logged in users)
router.post('/', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.create({ ...req.body, owner: req.user.id })
    // spread req.body (make, model, color, plate) then add owner from the token
    res.status(201).json({ message: 'Vehicle added!', vehicle })
  } catch (error) {
    res.status(400).json({ message: 'Could not add vehicle.', error: error.message })
  }
})

// PUT /api/vehicles/:id — update a vehicle
router.put('/:id', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },  // only update if it belongs to this user
      req.body,
      { new: true, runValidators: true }
    )
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found or not yours.' })
    res.json({ message: 'Vehicle updated!', vehicle })
  } catch (error) {
    res.status(400).json({ message: 'Could not update vehicle.', error: error.message })
  }
})

// DELETE /api/vehicles/:id — delete a vehicle
router.delete('/:id', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, owner: req.user.id })
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found or not yours.' })
    res.json({ message: 'Vehicle removed.' })
  } catch (error) {
    res.status(500).json({ message: 'Could not delete vehicle.', error: error.message })
  }
})

// GET /api/vehicles — admin gets ALL vehicles
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('owner', 'name email')
    // populate() replaces the owner ID with actual name and email from the User collection
    res.json(vehicles)
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch vehicles.', error: error.message })
  }
})

module.exports = router