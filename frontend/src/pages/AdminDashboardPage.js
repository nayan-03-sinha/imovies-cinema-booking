import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data.data));
  }, []);

  return (
    <div className="container py-4">
      <h3 className="fw-bold mb-4">Admin Operations Dashboard</h3>
      {stats && (
        <div className="row g-3">
          <div className="col-md-4"><div className="glass-panel text-center"><h6>Total Revenue</h6><h3 className="text-success">₹{stats.totalRevenue}</h3></div></div>
          <div className="col-md-4"><div className="glass-panel text-center"><h6>Confirmed Bookings</h6><h3>{stats.totalBookings}</h3></div></div>
          <div className="col-md-4"><div className="glass-panel text-center"><h6>Active Movies</h6><h3>{stats.totalMovies}</h3></div></div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;