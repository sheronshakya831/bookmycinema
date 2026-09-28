const Booking = require('../models/bookingModel');
const Movie = require('../models/movieModel');

// ==========================================
// CREATE A NEW BOOKING
// ==========================================
// @desc    Book seats for a movie showtime
// @route   POST /api/bookings
// @access  Private (Requires login)
const createBooking = async (req, res) => {
  try {
    const { movieId, showtime, showDate, seats, totalAmount } = req.body;

    // 1. Validation: Ensure required fields are provided
    if (!movieId || !showtime || !showDate || !seats || seats.length === 0 || !totalAmount) {
      return res.status(400).json({ message: 'Please provide all booking details (movie, showtime, date, seats)' });
    }

    // 2. Verify movie exists
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // 3. Double Booking Prevention: Check if any of the requested seats are already booked
    const existingBookings = await Booking.find({
      movie: movieId,
      showtime,
      showDate,
      status: 'Confirmed',
    });

    // Flatten all existing booked seats into a single array
    const alreadyBookedSeats = existingBookings.flatMap((b) => b.seats);

    // Check collision
    const seatConflict = seats.some((seat) => alreadyBookedSeats.includes(seat));
    if (seatConflict) {
      return res.status(400).json({ message: 'One or more selected seats have already been booked by someone else!' });
    }

    // 4. Create the booking document
    const booking = await Booking.create({
      user: req.user._id, // Set by protect middleware
      movie: movieId,
      showtime,
      showDate,
      seats,
      totalAmount,
      seatPrice: 250,
      status: 'Confirmed',
    });

    // Populate movie info before returning response
    const populatedBooking = await Booking.findById(booking._id).populate('movie', 'title posterUrl language duration');

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Failed to complete ticket booking' });
  }
};

// ==========================================
// GET BOOKED SEATS FOR A MOVIE SHOWTIME
// ==========================================
// @desc    Get array of already booked seat IDs for grid locking
// @route   GET /api/bookings/movie/:movieId
// @access  Private
const getBookedSeats = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { showtime, showDate } = req.query;

    if (!showtime || !showDate) {
      return res.status(400).json({ message: 'Showtime and date query parameters are required' });
    }

    const bookings = await Booking.find({
      movie: movieId,
      showtime,
      showDate,
      status: 'Confirmed',
    });

    // Extract and flatten all booked seat codes (e.g. ["A1", "A2", "B5"])
    const bookedSeats = bookings.flatMap((b) => b.seats);

    res.status(200).json(bookedSeats);
  } catch (error) {
    console.error('Error fetching booked seats:', error);
    res.status(500).json({ message: 'Error loading seat availability' });
  }
};

// ==========================================
// GET LOGGED-IN USER'S BOOKINGS
// ==========================================
// @desc    Fetch all tickets booked by the logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title posterUrl language duration genre')
      .sort({ createdAt: -1 }); // Newest bookings first

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Error retrieving your tickets' });
  }
};

module.exports = {
  createBooking,
  getBookedSeats,
  getUserBookings,
};