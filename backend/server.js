const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');


// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Allow parsing JSON bodies in requests
app.use(express.urlencoded({ extended: false })); // Allow parsing URL encoded data


// Basic Route
app.get('/', (req, res) => {
    res.send('BookMyCinema API is running...');
});

// Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));
// Movie Routes
app.use('/api/movies', require('./routes/movieRoutes'));
// Booking Routes
app.use('/api/bookings', require('./routes/bookingRoutes'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});