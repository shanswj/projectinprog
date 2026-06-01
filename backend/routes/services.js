const express = require('express')
const router = express.Router()
const Service = require('../models/Service')
const { protect, adminOnly } = require('../middleware/auth')

// GET /api/services — get all services
// ?category=Premium or ?name=wax to filter/search ← satisfies search/filter requirement
router.get('/', async (req, res) => {
  try {
    const filter = {}
    if (req.query.category) filter.category = req.query.category
    if (req.query.name) filter.name = { $regex: req.query.name, $options: 'i' }
    // $regex = partial match, $options: 'i' = case-insensitive (e.g. "wax" finds "Full Wax")

    const services = await Service.find(filter)
    res.json(services)
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch services.', error: error.message })
  }
})

// GET /api/services/:id — get one service by its ID
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) return res.status(404).json({ message: 'Service not found.' })
    res.json(service)
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch service.', error: error.message })
  }
})

// POST /api/services — create a new service (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.create(req.body)
    res.status(201).json({ message: 'Service created!', service })
  } catch (error) {
    res.status(400).json({ message: 'Could not create service.', error: error.message })
  }
})

// PUT /api/services/:id — update a service (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,   // which document to update
      req.body,        // what to update it with
      { new: true, runValidators: true }  // new:true returns the UPDATED doc, runValidators re-checks rules
    )
    if (!service) return res.status(404).json({ message: 'Service not found.' })
    res.json({ message: 'Service updated!', service })
  } catch (error) {
    res.status(400).json({ message: 'Could not update service.', error: error.message })
  }
})

// DELETE /api/services/:id — delete a service (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id)
    if (!service) return res.status(404).json({ message: 'Service not found.' })
    res.json({ message: 'Service deleted successfully.' })
  } catch (error) {
    res.status(500).json({ message: 'Could not delete service.', error: error.message })
  }
})

module.exports = router