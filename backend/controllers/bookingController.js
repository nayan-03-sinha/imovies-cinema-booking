const Booking = require('../models/Booking');
const Seat = require('../models/Seat');
const Show = require('../models/Show');
const Payment = require('../models/Payment');

exports.createBooking = async (req, res, next) => {
  try {
    const { showId, seatIds, paymentMethod } = req.body;
    const show = await Show.findById(showId).populate('movie theatre');
    const seatsToBook = await Seat.find({ _id: { $in: seatIds }, show: showId });

    if (seatsToBook.some(s => s.status === 'booked')) {
      return res.status(400).json({ success: false, message: 'Selected seat is already sold' });
    }

    const totalAmount = seatsToBook.reduce((acc, curr) => acc + curr.price, 0);
    const bookingRef = `IMV-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const booking = await Booking.create({
      bookingReference: bookingRef,
      user: req.user._id,
      show: showId,
      movie: show.movie._id,
      theatre: show.theatre._id,
      seats: seatsToBook.map(s => ({ seatId: s._id, seatNumber: s.seatNumber, tier: s.tier, price: s.price })),
      totalAmount,
      bookingStatus: 'confirmed'
    });

    await Seat.updateMany({ _id: { $in: seatIds } }, { $set: { status: 'booked', lockedBy: null, lockExpiresAt: null } });
    show.availableSeatsCount = Math.max(0, show.availableSeatsCount - seatIds.length);
    await show.save();

    await Payment.create({
      booking: booking._id,
      user: req.user._id,
      amount: totalAmount,
      paymentMethod: paymentMethod || 'UPI',
      transactionId: `TXN-${Date.now()}`
    });

    const populated = await Booking.findById(booking._id).populate('movie theatre show');
    res.status(201).json({ success: true, data: { booking: populated } });
  } catch (err) { next(err); }
};

exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('movie theatre show').sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) { next(err); }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('movie theatre show');
    res.json({ success: true, data: booking });
  } catch (err) { next(err); }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    await Seat.updateMany({ _id: { $in: booking.seats.map(s => s.seatId) } }, { $set: { status: 'available' } });
    await Show.findByIdAndUpdate(booking.show, { $inc: { availableSeatsCount: booking.seats.length } });
    await Payment.findOneAndUpdate({ booking: booking._id }, { $set: { status: 'refunded' } });

    res.json({ success: true, message: 'Booking cancelled and seats restored', data: booking });
  } catch (err) { next(err); }
};