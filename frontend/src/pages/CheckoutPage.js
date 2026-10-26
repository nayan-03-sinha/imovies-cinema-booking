import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { show, selectedSeats, totalAmount } = location.state || {};
  const [method, setMethod] = useState('UPI');

  if (!show) return null;

  const handlePay = async () => {
    const res = await api.post('/bookings', { showId: show._id, seatIds: selectedSeats.map(s => s._id), paymentMethod: method });
    navigate(`/booking-confirmation/${res.data.data.booking._id}`, { state: { booking: res.data.data.booking } });
  };

  return (
    <div className="container py-5" style={{ maxWidth: '500px' }}>
      <div className="glass-panel">
        <h4 className="fw-bold mb-3">Order Summary</h4>
        <p>{show.movie.title} &bull; {show.theatre.name}</p>
        <p>Seats: {selectedSeats.map(s => s.seatNumber).join(', ')}</p>
        <h5>Total Payable: ₹{totalAmount}</h5>
        <button onClick={handlePay} className="btn btn-danger w-100 mt-3">Confirm & Pay</button>
      </div>
    </div>
  );
};
export default CheckoutPage;