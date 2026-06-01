const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true
  },

  description: {
    type: String,
    required: [true, 'Description is required']
  },

  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },

  duration: {
    type: Number,   // in minutes, e.g. 30 or 60
    required: [true, 'Duration is required']
  },

  category: {
    type: String,
    enum: ['Exterior', 'Full', 'Premium', 'Add-on'],  // only 4 valid options
    required: [true, 'Category is required']
  },

  isAvailable: {
    type: Boolean,
    default: true   // services are available by default
  }

}, { timestamps: true })

module.exports = mongoose.model('Service', serviceSchema)