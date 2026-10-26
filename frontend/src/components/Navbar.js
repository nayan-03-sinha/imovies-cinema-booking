import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary px-3 sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-danger fs-3" to="/">IMovies</Link>
        <div className="collapse navbar-collapse show">
          <ul className="navbar-nav me-auto ms-3">
            <li className="nav-item"><Link className="nav-link text-light" to="/">Movies</Link></li>
            {user && <li className="nav-item"><Link className="nav-link text-light" to="/my-bookings">My Bookings</Link></li>}
            {isAdmin && <li className="nav-item"><Link className="nav-link text-warning fw-bold" to="/admin">Admin Panel</Link></li>}
          </ul>
          <div className="d-flex align-items-center gap-2">
            {user ? (
              <>
                <span className="text-muted small me-2">{user.name}</span>
                <button onClick={logout} className="btn btn-outline-danger btn-sm">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-danger btn-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;