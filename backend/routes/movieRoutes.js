const express = require('express');
const router = express.Router();
// Import the brain functions
const { getMovies, getMovieById, createMovie } = require('../controllers/movieController');
// Import both of our bouncers
const { protect, admin } = require('../middleware/authMiddleware');
// 1. GET /api/movies -> Anyone can view movies. No middleware needed.
router.get('/', getMovies);
// 1b. GET /api/movies/:id -> Fetch single movie details
router.get('/:id', getMovieById);
// 2. POST /api/movies -> Creating a movie requires TWO middlewares!
// Express reads left to right:
// FIRST: Run `protect`. Does the user have a valid JWT? If yes, go next.
// SECOND: Run `admin`. Is req.user.isAdmin === true? If yes, go next.
// THIRD: Run `createMovie`. Finally save the movie to the DB!
router.post('/', protect, admin, createMovie);
module.exports = router;