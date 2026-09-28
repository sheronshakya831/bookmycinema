const Movie = require('../models/movieModel');

// ==========================================
// GET ALL MOVIES
// ==========================================
// @desc    Fetch all movies from the database
// @route   GET /api/movies
// @access  Public

const getMovies = async (req, res) => {
    try {
        // Find all movies
        const movies = await Movie.find({});

        // Return movies to frontend
        res.status(200).json(movies);

    } catch (error) {
        res.status(500).json({
            message: 'Server Error fetching movies'
        });
    }
};

// ==========================================
// GET SINGLE MOVIE
// ==========================================
// @desc Fetch single movie by ID
// @route GET /api/movies/:id
// @access Public
const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (movie) {
            res.status(200).json(movie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching movie' });
    }
};

// ==========================================
// CREATE A NEW MOVIE
// ==========================================
// @desc    Add a new movie to the cinema
// @route   POST /api/movies
// @access  Private AND Admin Only

const createMovie = async (req, res) => {
    try {
        // Destructure data from request body
        const {
            title,
            description,
            language,
            duration,
            posterUrl,
            genre
        } = req.body;

        // Validation
        if (
            !title ||
            !description ||
            !language ||
            !duration ||
            !posterUrl ||
            !genre
        ) {
            return res.status(400).json({
                message: 'Please provide all required movie fields'
            });
        }

        // Create movie
        const movie = await Movie.create({
            title,
            description,
            language,
            duration,
            posterUrl,
            genre
        });

        // Return created movie
        res.status(201).json(movie);

    } catch (error) {
        res.status(400).json({
            message: 'Failed to create movie. Check your data format.'
        });
    }
};

module.exports = {
    getMovies,
    getMovieById,
    createMovie
};