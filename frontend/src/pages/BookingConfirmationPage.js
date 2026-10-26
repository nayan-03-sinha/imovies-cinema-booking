import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const BookingConfirmationPage = () => {
  const { state } = useLocation();
  const booking = state?.booking;

  if (!booking) return null;

  return (
    <div className="container py-5 text-center">
      <div className="glass-panel mx-auto p-4" style={{ maxWidth: '450px' }}>
        <h2 className="text-success fw-bold">Booking Confirmed!</h2>
        <p className="text-warning font-monospace fs-5">Ref: {booking.bookingReference}</p>
        <p>Movie: {booking.movie.title}</p>
        <p>Theatre: {booking.theatre.name}</p>
        <p>Seats: {booking.seats.map(s => s.seatNumber).join(', ')}</p>
        <Link to="/" className="btn btn-danger mt-3">Back to Home</Link>
      </div>
    </div>
  );
};
export default BookingConfirmationPage;