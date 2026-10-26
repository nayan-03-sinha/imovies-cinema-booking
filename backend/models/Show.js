const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true, index: true },
  theatre: { type: mongoose.Schema.Types.ObjectId, ref: 'Theatre', required: true, index: true },
  screenName: { type: String, default: 'Audi 1' },
  showDate: { type: String, required: true, index: true }, // Format: YYYY-MM-DD
  showTime: { type: String, required: true },             // Format: '06:30 PM'
  tierPricing: {
    Silver: { type: Number, default: 150 },
    Gold: { type: Number, default: 220 },
    Platinum: { type: Number, default: 350 }
  },
  totalSeats: { type: Number, default: 60 },
  availableSeatsCount: { type: Number, default: 60 }
}, { timestamps: true });

showSchema.index({ movie: 1, theatre: 1, showDate: 1 });
module.exports = mongoose.model('Show', showSchema);