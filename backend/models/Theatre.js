const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true, index: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  totalScreens: { type: Number, default: 3 }
}, { timestamps: true });

module.exports = mongoose.model('Theatre', theatreSchema);