const express = require('express');
const router = express.Router();
const { getTheatres, createTheatre, deleteTheatre } = require('../controllers/theatreController');
const { protect, authorize } = require('../middleware/auth');
router.get('/', getTheatres);
router.post('/', protect, authorize('admin'), createTheatre);
router.delete('/:id', protect, authorize('admin'), deleteTheatre);
module.exports = router;