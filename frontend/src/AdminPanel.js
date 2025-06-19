import React, { useEffect, useState } from 'react';
import AdminReviews from './AdminReviews';
import { apiFetch, API_BASE_URL } from './api';

const STATUS_OPTIONS = ['pending', 'confirmed', 'completed', 'cancelled'];

const AdminPanel = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updateError, setUpdateError] = useState('');
  const [activeTab, setActiveTab] = useState('bookings');

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch('/api/booking/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setBookings(data);
      } else {
        setError(data.message || 'Failed to fetch bookings');
      }
    } catch (err) {
      setError('Server error');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user && user.isAdmin && activeTab === 'bookings') fetchBookings();
  }, [user, activeTab]);

  const handleStatusChange = async (id, status) => {
    setUpdateError('');
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch(`/api/booking/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        fetchBookings();
      } else {
        setUpdateError(data.message || 'Update failed');
      }
    } catch (err) {
      setUpdateError('Server error');
    }
  };

  const filtered = statusFilter === 'all' ? bookings : bookings.filter(b => b.status === statusFilter);

  if (!user || !user.isAdmin) return <div className="text-center mt-10 text-red-400">Access denied.</div>;

  return (
    <div className="max-w-6xl mx-auto bg-gray-900 p-8 rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">Admin Panel</h2>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'bookings'
              ? 'text-green-400 border-b-2 border-green-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Bookings Management
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'reviews'
              ? 'text-green-400 border-b-2 border-green-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Reviews Management
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'bookings' && (
        <div>
          {loading ? (
            <div className="text-center text-lg text-gray-300">Loading bookings...</div>
          ) : error ? (
            <div className="text-center text-red-400">{error}</div>
          ) : (
            <>
              <div className="mb-4 flex items-center space-x-4">
                <label className="text-white">Filter by status:</label>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-2 py-1 rounded bg-gray-800 text-white"
                >
                  <option value="all">All</option>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              
              {filtered.length === 0 ? (
                <div className="text-center text-gray-400">No bookings found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-white">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="py-2">User</th>
                        <th>Email</th>
                        <th>Service</th>
                        <th>Car Type</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((b) => (
                        <tr key={b.id || b._id} className="border-b border-gray-800">
                          <td className="py-2">{b.user?.name}</td>
                          <td>{b.user?.email}</td>
                          <td>{b.service}</td>
                          <td>{b.carType}</td>
                          <td>{b.date}</td>
                          <td>{b.time}</td>
                          <td className="text-sm">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  b.paymentMethod === 'gpay' ? 'bg-blue-500 text-white' :
                                  b.paymentMethod === 'phonepe' ? 'bg-purple-500 text-white' :
                                  'bg-green-500 text-white'
                                }`}>
                                  {b.paymentMethod === 'gpay' ? '💳 GPay' :
                                   b.paymentMethod === 'phonepe' ? '📱 PhonePe' :
                                   b.paymentMethod === 'cash' ? '💵 Cash' : 'N/A'}
                                </span>
                              </div>
                              {b.paymentId && (
                                <div className="text-gray-400 text-xs">
                                  ID: {b.paymentId}
                                </div>
                              )}
                              {b.paymentScreenshot && (
                                <a 
                                  href={`${API_BASE_URL}/api/booking${b.paymentScreenshot}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 text-xs underline"
                                >
                                  View Screenshot
                                </a>
                              )}
                              {b.photoUrl && (
                                <a 
                                  href={`${API_BASE_URL}/api/booking${b.photoUrl}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-green-400 hover:text-green-300 text-xs underline block"
                                >
                                  View Car Photo
                                </a>
                              )}
                            </div>
                          </td>
                          <td className={
                            b.status === 'cancelled' ? 'text-red-400' :
                            b.status === 'completed' ? 'text-green-400' :
                            b.status === 'confirmed' ? 'text-yellow-400' : 'text-white'
                          }>{b.status}</td>
                          <td>
                            {STATUS_OPTIONS.filter(s => s !== b.status).map(s => (
                              <button
                                key={s}
                                onClick={() => handleStatusChange(b.id || b._id, s)}
                                className="px-2 py-1 m-1 rounded text-xs font-bold "
                                style={{ background: s === 'cancelled' ? '#ef4444' : s === 'completed' ? '#22c55e' : '#facc15', color: s === 'confirmed' ? '#232323' : '#fff' }}
                              >
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </button>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {updateError && <div className="text-red-400 text-center mt-4">{updateError}</div>}
            </>
          )}
        </div>
      )}

      {activeTab === 'reviews' && <AdminReviews />}
    </div>
  );
};

export default AdminPanel; 