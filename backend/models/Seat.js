const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true, index: true },
  seatNumber: { type: String, required: true },
  row: { type: String, required: true },
  col: { type: Number, required: true },
  tier: { type: String, enum: ['Silver', 'Gold', 'Platinum'], default: 'Gold' },
  price: { type: Number, required: true },
  status: { type: String, enum: ['available', 'reserved', 'booked'], default: 'available', index: true },
  lockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  lockExpiresAt: { type: Date, default: null }
}, { timestamps: true });

seatSchema.index({ show: 1, seatNumber: 1 }, { unique: true });
module.exports = mongoose.model('Seat', seatSchema);