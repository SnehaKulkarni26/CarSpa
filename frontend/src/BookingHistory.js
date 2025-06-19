import React, { useEffect, useState } from 'react';
import { apiFetch } from './api';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelId, setCancelId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch('/api/booking/my', {
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
    fetchBookings();
  }, []);

  const canCancel = (createdAt, status) => {
    if (status !== 'pending') return false;
    const now = new Date();
    const created = new Date(createdAt);
    const diffHours = (now - created) / (1000 * 60 * 60);
    return diffHours <= 6;
  };

  const handleCancel = async (id) => {
    setCancelError('');
    if (!cancelReason) {
      setCancelError('Please provide a reason for cancellation.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch(`/api/booking/${id}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: cancelReason }),
      });
      const data = await res.json();
      if (res.ok) {
        setCancelId(null);
        setCancelReason('');
        fetchBookings();
      } else {
        setCancelError(data.message || 'Cancellation failed');
      }
    } catch (err) {
      setCancelError('Server error');
    }
  };

  if (loading) return <div className="text-center mt-10 text-lg text-gray-300">Loading bookings...</div>;
  if (error) return <div className="text-center mt-10 text-red-400">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto bg-gray-900 p-8 rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-green-400 text-center">My Bookings</h2>
      {bookings.length === 0 ? (
        <div className="text-center text-gray-400">No bookings found.</div>
      ) : (
        <table className="w-full text-left text-white">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2">Service</th>
              <th>Car Type</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-gray-800">
                <td className="py-2">{b.service}</td>
                <td>{b.carType}</td>
                <td>{b.date}</td>
                <td>{b.time}</td>
                <td className={
                  b.status === 'cancelled' ? 'text-red-400' :
                  b.status === 'completed' ? 'text-green-400' :
                  b.status === 'confirmed' ? 'text-yellow-400' : 'text-white'
                }>{b.status}</td>
                <td>
                  {canCancel(b.createdAt, b.status) ? (
                    cancelId === b.id ? (
                      <div className="flex flex-col space-y-2">
                        <input
                          type="text"
                          placeholder="Reason for cancellation"
                          value={cancelReason}
                          onChange={e => setCancelReason(e.target.value)}
                          className="px-2 py-1 rounded bg-gray-800 text-white"
                        />
                        <button
                          onClick={() => handleCancel(b.id)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-400 text-white rounded"
                        >
                          Confirm Cancel
                        </button>
                        {cancelError && <div className="text-red-400 text-sm">{cancelError}</div>}
                      </div>
                    ) : (
                      <button
                        onClick={() => { setCancelId(b.id); setCancelReason(''); setCancelError(''); }}
                        className="px-3 py-1 bg-red-500 hover:bg-red-400 text-white rounded"
                      >
                        Cancel
                      </button>
                    )
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BookingHistory; 