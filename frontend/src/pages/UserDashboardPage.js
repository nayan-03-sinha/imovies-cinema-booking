import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const UserDashboardPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get('/bookings/my').then(res => setBookings(res.data.data));
  }, []);

  const cancel = async (id) => {
    if (window.confirm('Cancel this ticket?')) {
      await api.put(`/bookings/${id}/cancel`);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, bookingStatus: 'cancelled' } : b));
    }
  };

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">My Bookings</h3>
      <div className="row g-3">
        {bookings.map(b => (
          <div className="col-md-6" key={b._id}>
            <div className="glass-panel">
              <span className={`badge ${b.bookingStatus === 'confirmed' ? 'bg-success' : 'bg-danger'}`}>{b.bookingStatus}</span>
              <h5 className="fw-bold mt-2">{b.movie.title}</h5>
              <p className="text-muted small">{b.theatre.name} &bull; Ref: {b.bookingReference}</p>
              <p>Seats: {b.seats.map(s => s.seatNumber).join(', ')} &bull; Amount: ₹{b.totalAmount}</p>
              {b.bookingStatus === 'confirmed' && (
                <button onClick={() => cancel(b._id)} className="btn btn-outline-danger btn-sm">Cancel Booking</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboardPage;