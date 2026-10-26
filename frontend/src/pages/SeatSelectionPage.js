import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';

const SeatSelectionPage = () => {
  const { id: showId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const socket = useContext(SocketContext);

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    api.get(`/shows/${showId}/seats`).then(res => {
      setShow(res.data.data.show);
      setSeats(res.data.data.seats);
    });
  }, [showId]);

  useEffect(() => {
    if (!socket || !showId) return;
    socket.emit('join_show', showId);
    socket.on('seat_locked', ({ seatId, lockedBy }) => {
      setSeats(prev => prev.map(s => s._id === seatId ? { ...s, status: 'reserved', lockedBy } : s));
    });
    socket.on('seat_unlocked', ({ seatId }) => {
      setSeats(prev => prev.map(s => s._id === seatId ? { ...s, status: 'available', lockedBy: null } : s));
    });
    return () => socket.emit('leave_show', showId);
  }, [socket, showId]);

  const toggleSeat = (seat) => {
    if (!user) return navigate('/login');
    if (seat.status === 'booked' || (seat.status === 'reserved' && !selectedSeats.some(s => s._id === seat._id))) return;

    if (selectedSeats.some(s => s._id === seat._id)) {
      setSelectedSeats(prev => prev.filter(s => s._id !== seat._id));
      socket.emit('unlock_seat', { showId, seatId: seat._id, userId: user._id });
    } else {
      setSelectedSeats(prev => [...prev, seat]);
      socket.emit('lock_seat', { showId, seatId: seat._id, userId: user._id });
    }
  };

  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  if (!show) return <div className="text-center py-5">Loading seat layout...</div>;

  return (
    <div className="container py-4 text-center">
      <h3 className="fw-bold">{show.movie.title}</h3>
      <p className="text-muted">{show.theatre.name} &bull; {show.showTime}</p>

      <div className="glass-panel mx-auto my-4" style={{ maxWidth: '650px' }}>
        <div className="cinema-screen"></div>
        <div className="d-flex flex-wrap justify-content-center" style={{ maxWidth: '400px', margin: '0 auto' }}>
          {seats.map(s => {
            const isSel = selectedSeats.some(sel => sel._id === s._id);
            const statusClass = s.status === 'booked' ? 'seat-booked' : isSel ? 'seat-selected' : s.status === 'reserved' ? 'seat-reserved' : 'seat-available';
            return (
              <div key={s._id} className={`seat-btn ${statusClass}`} onClick={() => toggleSeat(s)}>
                {s.seatNumber}
              </div>
            );
          })}
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="glass-panel d-inline-block p-3">
          <h5>Selected: {selectedSeats.map(s => s.seatNumber).join(', ')} &bull; Total: ₹{total}</h5>
          <button onClick={() => navigate('/checkout', { state: { show, selectedSeats, totalAmount: total } })} className="btn btn-danger mt-2">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default SeatSelectionPage;