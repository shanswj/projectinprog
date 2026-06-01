const mongoose = require('mongoose')

const vehicleSchema = new mongoose.Schema({

  owner: {
    type: mongoose.Schema.Types.ObjectId,  // stores a reference (ID) to a User document
    ref: 'User',                           // tells Mongoose which model to link to
    required: true
  },

  plateNumber: {
    type: String,
    required: [true, 'Plate number is required'],
    uppercase: true,   // e.g. "abc 1234" becomes "ABC 1234"
    trim: true
  },

  make: {
    type: String,      // e.g. "Toyota"
    required: [true, 'Car make is required']
  },

  model: {
    type: String,      // e.g. "Vios"
    required: [true, 'Car model is required']
  },

  color: {
    type: String,
    required: [true, 'Color is required']
  }

}, { timestamps: true })

module.exports = mongoose.model('Vehicle', vehicleSchema)