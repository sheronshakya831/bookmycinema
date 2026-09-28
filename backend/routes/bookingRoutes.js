const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookedSeats,
  getUserBookings,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// All booking routes require a logged-in user (protect middleware)
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/movie/:movieId', protect, getBookedSeats);

module.exports = router;