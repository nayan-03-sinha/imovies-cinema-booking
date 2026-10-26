const express = require('express');
const router = express.Router();
const { getMovies, getMovieById, createMovie, deleteMovie } = require('../controllers/movieController');
const { protect, authorize } = require('../middleware/auth');
router.get('/', getMovies);
router.get('/:id', getMovieById);
router.post('/', protect, authorize('admin'), createMovie);
router.delete('/:id', protect, authorize('admin'), deleteMovie);
module.exports = router;