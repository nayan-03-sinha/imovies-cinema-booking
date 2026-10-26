const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Card', 'UPI', 'NetBanking', 'MockGateway'], default: 'UPI' },
  transactionId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['success', 'failed', 'refunded'], default: 'success' }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);