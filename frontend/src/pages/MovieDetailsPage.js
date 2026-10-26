import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);

  useEffect(() => {
    api.get(`/movies/${id}`).then(res => setMovie(res.data.data));
    api.get('/shows', { params: { movieId: id } }).then(res => setShows(res.data.data));
  }, [id]);

  if (!movie) return <div className="text-center py-5">Loading movie details...</div>;

  return (
    <div className="container py-4">
      <div className="glass-panel mb-4 row align-items-center">
        <div className="col-md-3">
          <img src={movie.posterUrl} alt={movie.title} className="img-fluid rounded" />
        </div>
        <div className="col-md-9">
          <h2 className="fw-bold">{movie.title}</h2>
          <p className="text-muted">{movie.language} &bull; {movie.duration} mins &bull; Rating: {movie.rating}/10</p>
          <p>{movie.description}</p>
        </div>
      </div>

      <h4 className="fw-bold mb-3">Available Showtimes</h4>
      <div className="row g-3">
        {shows.map(s => (
          <div className="col-md-4" key={s._id}>
            <div className="glass-panel p-3">
              <h6 className="fw-bold text-danger">{s.theatre.name}</h6>
              <p className="text-muted small mb-2">{s.showDate} at {s.showTime} ({s.screenName})</p>
              <Link to={`/shows/${s._id}/seats`} className="btn btn-outline-light btn-sm w-100">Pick Seats</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieDetailsPage;