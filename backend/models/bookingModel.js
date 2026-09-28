const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    showtime: {
      type: String,
      required: [true, 'Please select a showtime'],
    },
    showDate: {
      type: String,
      required: [true, 'Please select a date'],
    },
    seats: {
      type: [String],
      required: [true, 'Please select at least one seat'],
    },
    seatPrice: {
      type: Number,
      default: 250,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Cancelled'],
      default: 'Confirmed',
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

module.exports = mongoose.model('Booking', bookingSchema);