const express = require('express');
const router = express.Router();
const { getShows, getShowSeats, createShow, deleteShow } = require('../controllers/showController');
const { protect, authorize } = require('../middleware/auth');
router.get('/', getShows);
router.get('/:id/seats', getShowSeats);
router.post('/', protect, authorize('admin'), createShow);
router.delete('/:id', protect, authorize('admin'), deleteShow);
module.exports = router;