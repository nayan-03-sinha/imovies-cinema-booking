import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');

  useEffect(() => {
    api.get('/movies', { params: { search, genre } })
      .then(res => setMovies(res.data.data))
      .catch(console.error);
  }, [search, genre]);

  return (
    <div className="container py-4">
      <div className="p-4 mb-4 rounded-3 text-white bg-danger bg-gradient">
        <h1 className="fw-bold">Book Cinema Tickets Effortlessly</h1>
        <p>Explore showtimes, pick your seats in real-time, and download your e-tickets instantly.</p>
      </div>

      <div className="glass-panel mb-4 row g-3">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control bg-dark text-light border-secondary"
            placeholder="Search movie titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select className="form-select bg-dark text-light border-secondary" value={genre} onChange={(e) => setGenre(e.target.value)}>
            {['All', 'Action', 'Sci-Fi', 'Romance', 'Adventure'].map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-4">
        {movies.map(m => (
          <div className="col" key={m._id}>
            <div className="glass-panel h-100 d-flex flex-column">
              <img src={m.posterUrl} alt={m.title} className="img-fluid rounded mb-3" style={{ height: '300px', objectFit: 'cover' }} />
              <h5 className="fw-bold">{m.title}</h5>
              <p className="text-muted small flex-grow-1">{m.description}</p>
              <Link to={`/movie/${m._id}`} className="btn btn-danger w-100">Select Showtimes</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;