const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  genre: [{ type: String, required: true }],
  language: { type: String, required: true },
  duration: { type: Number, required: true },
  releaseDate: { type: Date, required: true },
  posterUrl: { type: String, required: true },
  trailerUrl: { type: String, default: '' },
  rating: { type: Number, default: 8.0 },
  certificate: { type: String, default: 'UA' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

movieSchema.index({ title: 'text', genre: 'text', language: 'text' });
module.exports = mongoose.model('Movie', movieSchema);