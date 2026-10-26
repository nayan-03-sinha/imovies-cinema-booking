import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) { alert('Invalid credentials'); }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '400px' }}>
      <form onSubmit={handle} className="glass-panel p-4">
        <h4 className="fw-bold mb-3 text-center">Sign In</h4>
        <input className="form-control mb-3 bg-dark text-light border-secondary" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="form-control mb-3 bg-dark text-light border-secondary" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="btn btn-danger w-100">Login</button>
        <p className="small text-muted mt-3 text-center">No account? <Link to="/register" className="text-danger">Sign Up</Link></p>
      </form>
    </div>
  );
};
export default LoginPage;