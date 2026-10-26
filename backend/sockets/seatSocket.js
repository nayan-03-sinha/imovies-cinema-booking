const Seat = require('../models/Seat');

const setupSeatSocket = (io) => {
  io.on('connection', (socket) => {
    socket.on('join_show', (showId) => socket.join(`show_${showId}`));
    socket.on('leave_show', (showId) => socket.leave(`show_${showId}`));

    socket.on('lock_seat', async ({ showId, seatId, userId }) => {
      try {
        const lockDuration = 5 * 60 * 1000;
        const expiresAt = new Date(Date.now() + lockDuration);

        const seat = await Seat.findOneAndUpdate(
          { _id: seatId, show: showId, status: 'available' },
          { $set: { status: 'reserved', lockedBy: userId, lockExpiresAt: expiresAt } },
          { new: true }
        );

        if (seat) {
          io.to(`show_${showId}`).emit('seat_locked', { seatId, lockedBy: userId, expiresAt });
        } else {
          socket.emit('seat_lock_failed', { seatId, message: 'Seat already selected or sold' });
        }
      } catch (err) {
        socket.emit('seat_lock_error', { message: err.message });
      }
    });

    socket.on('unlock_seat', async ({ showId, seatId, userId }) => {
      try {
        const seat = await Seat.findOneAndUpdate(
          { _id: seatId, show: showId, lockedBy: userId, status: 'reserved' },
          { $set: { status: 'available', lockedBy: null, lockExpiresAt: null } },
          { new: true }
        );
        if (seat) io.to(`show_${showId}`).emit('seat_unlocked', { seatId });
      } catch (err) {
        socket.emit('seat_lock_error', { message: err.message });
      }
    });

    socket.on('seats_booked_broadcast', ({ showId, seatIds }) => {
      io.to(`show_${showId}`).emit('seats_permanently_booked', { seatIds });
    });
  });
};

module.exports = setupSeatSocket;