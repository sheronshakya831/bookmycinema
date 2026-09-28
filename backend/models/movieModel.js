const mongoose = require('mongoose');
const movieSchema = new mongoose.Schema({
    // The title of the movie (e.g., "Inception")
    title: {
        type: String,
        required: [true, 'Please add a movie title']
    },
    // A brief summary of the movie
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    // e.g., "English", "Hindi", "Nepali"
    language: {
        type: String,
        required: [true, 'Please add a language']
    },
    // Duration in minutes (e.g., 148)
    duration: {
        type: Number,
        required: [true, 'Please add a duration in minutes']
    },
    // A web link to the image poster
    posterUrl: {
        type: String,
        required: [true, 'Please add a poster URL']
    },
    // Genre is an Array of Strings!
    // Example: ["Sci-Fi", "Action", "Thriller"]
    genre: {
        type: [String],
        required: true
    }
}, {
    timestamps: true // Gives us createdAt and updatedAt for free
});
module.exports = mongoose.model('Movie', movieSchema);