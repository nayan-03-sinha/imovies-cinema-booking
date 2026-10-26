import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    await register(form);
    navigate('/');
  };

  return (
    <div className="container py-5" style={{ maxWidth: '400px' }}>
      <form onSubmit={handle} className="glass-panel p-4">
        <h4 className="fw-bold mb-3 text-center">Create Account</h4>
        <input className="form-control mb-2 bg-dark text-light border-secondary" placeholder="Full Name" onChange={e => setForm({ ...form, name: e.target.value })} required />
        <input className="form-control mb-2 bg-dark text-light border-secondary" type="email" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input className="form-control mb-3 bg-dark text-light border-secondary" type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} required />
        <button type="submit" className="btn btn-danger w-100">Sign Up</button>
      </form>
    </div>
  );
};
export default RegisterPage;