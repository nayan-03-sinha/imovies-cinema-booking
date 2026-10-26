const Show = require('../models/Show');
const Seat = require('../models/Seat');

const generateSeatsForShow = async (showId, pricing) => {
  const rows = [
    { row: 'A', tier: 'Silver', count: 10, price: pricing.Silver || 150 },
    { row: 'B', tier: 'Silver', count: 10, price: pricing.Silver || 150 },
    { row: 'C', tier: 'Gold', count: 10, price: pricing.Gold || 220 },
    { row: 'D', tier: 'Gold', count: 10, price: pricing.Gold || 220 },
    { row: 'E', tier: 'Platinum', count: 10, price: pricing.Platinum || 350 },
    { row: 'F', tier: 'Platinum', count: 10, price: pricing.Platinum || 350 }
  ];
  const seats = [];
  rows.forEach(r => {
    for (let i = 1; i <= r.count; i++) {
      seats.push({ show: showId, seatNumber: `${r.row}${i}`, row: r.row, col: i, tier: r.tier, price: r.price, status: 'available' });
    }
  });
  await Seat.insertMany(seats);
};

exports.getShows = async (req, res, next) => {
  try {
    const { movieId, showDate } = req.query;
    let query = {};
    if (movieId) query.movie = movieId;
    if (showDate) query.showDate = showDate;
    const shows = await Show.find(query).populate('movie').populate('theatre').sort({ showTime: 1 });
    res.json({ success: true, data: shows });
  } catch (err) { next(err); }
};

exports.getShowSeats = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id).populate('movie theatre');
    if (!show) return res.status(404).json({ success: false, message: 'Show not found' });
    await Seat.updateMany({ show: show._id, status: 'reserved', lockExpiresAt: { $lt: new Date() } }, { $set: { status: 'available', lockedBy: null, lockExpiresAt: null } });
    const seats = await Seat.find({ show: show._id }).sort({ row: 1, col: 1 });
    res.json({ success: true, data: { show, seats } });
  } catch (err) { next(err); }
};

exports.createShow = async (req, res, next) => {
  try {
    const show = await Show.create(req.body);
    await generateSeatsForShow(show._id, show.tierPricing);
    res.status(201).json({ success: true, data: show });
  } catch (err) { next(err); }
};

exports.deleteShow = async (req, res, next) => {
  try {
    await Seat.deleteMany({ show: req.params.id });
    await Show.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Show deleted' });
  } catch (err) { next(err); }
};