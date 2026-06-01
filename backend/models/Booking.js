const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({

  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true
  },

  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },

  date: {
    type: String,   // stored as "2026-02-10"
    required: [true, 'Booking date is required']
  },

  time: {
    type: String,   // stored as "10:00 AM"
    required: [true, 'Booking time is required']
  },

  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'   // every new booking starts as pending
  },

  notes: {
    type: String,
    default: ''
  }

}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingSchema)