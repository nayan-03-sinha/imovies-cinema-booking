import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('imovies_token'));

  useEffect(() => {
    if (token) {
      api.get('/auth/me')
        .then(res => setUser(res.data.data))
        .catch(() => logout());
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('imovies_token', res.data.data.token);
    setToken(res.data.data.token);
    setUser(res.data.data);
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('imovies_token', res.data.data.token);
    setToken(res.data.data.token);
    setUser(res.data.data);
  };

  const logout = () => {
    localStorage.removeItem('imovies_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};