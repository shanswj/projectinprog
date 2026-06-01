// 1. Import all the libraries we installed
const express = require('express')        // the framework that creates our server
const mongoose = require('mongoose')      // connects us to MongoDB
const dotenv = require('dotenv')          // reads our .env file
const cors = require('cors')              // allows frontend to talk to backend

// 2. Import our route files (we'll create these next)
const userRoutes = require('./routes/users')
const vehicleRoutes = require('./routes/vehicles')
const serviceRoutes = require('./routes/services')
const bookingRoutes = require('./routes/bookings')

// 3. Load the .env file so we can use process.env.PORT etc.
dotenv.config()

// 4. Create the express app — this IS the server
const app = express()

// 5. Middleware — these run on EVERY request before it hits a route
app.use(cors())                           // allow all cross-origin requests
app.use(express.json())                   // allow server to read JSON from request body

// 6. Connect to MongoDB using the URI from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))   // success message
  .catch((err) => console.log('❌ DB Error:', err))  // error message

// 7. Register our routes — tell the server which URL prefix each file handles
app.use('/api/users', userRoutes)        // anything at /api/users goes to users.js
app.use('/api/vehicles', vehicleRoutes)  // anything at /api/vehicles goes to vehicles.js
app.use('/api/services', serviceRoutes)  // anything at /api/services goes to services.js
app.use('/api/bookings', bookingRoutes)  // anything at /api/bookings goes to bookings.js

// 8. A simple test route — visit http://localhost:5000/api in your browser to confirm it works
app.get('/api', (req, res) => {
  res.json({ message: '🚗 CarWash API is running!' })
})

// 9. Global error handler — if anything breaks, this catches it and sends a clean message
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong on the server.' })
})

// 10. Start listening for requests on the PORT from .env (or 5000 as fallback)
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))