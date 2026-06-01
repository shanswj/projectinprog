const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Define the shape of a User document in MongoDB
const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'Name is required'],   // [rule, error message if broken]
    trim: true                               // removes accidental spaces
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,                            // no two users can have the same email
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },

  phone: {
    type: String,
    trim: true
  },

  role: {
    type: String,
    enum: ['customer', 'admin'],   // only these two values are allowed
    default: 'customer'            // new users are customers by default
  }

}, {
  timestamps: true   // automatically adds createdAt and updatedAt fields
})

// This runs BEFORE a user is saved — it scrambles the password
userSchema.pre('save', async function (next) {
  // If the password wasn't changed, skip hashing (avoids double-hashing)
  if (!this.isModified('password')) return next()

  // bcrypt.hash() scrambles the password — the "10" is how strong the scramble is
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

// A method on every user — compares a typed password to the saved scrambled one
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model('User', userSchema)