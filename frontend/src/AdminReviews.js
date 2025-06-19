import React, { useState, useEffect } from 'react';
import { apiFetch } from './api';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await apiFetch('/api/reviews/all');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId, isApproved) => {
    setUpdating(reviewId);
    try {
      const response = await apiFetch(`/api/reviews/${reviewId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isApproved }),
      });

      if (response.ok) {
        // Update the review in the local state
        setReviews(reviews.map(review => 
          review.id === reviewId 
            ? { ...review, isApproved } 
            : review
        ));
        alert(`Review ${isApproved ? 'approved' : 'rejected'} successfully!`);
      } else {
        alert('Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review');
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    setUpdating(reviewId);
    try {
      const response = await apiFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setReviews(reviews.filter(review => review.id !== reviewId));
        alert('Review deleted successfully!');
      } else {
        alert('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-green-400 mb-6">Reviews Management</h2>
        <div className="text-center text-gray-300">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-green-400 mb-6">Reviews Management</h2>
      
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-yellow-400">All Reviews ({reviews.length})</h3>
          <div className="text-sm text-gray-300">
            Approved: {reviews.filter(r => r.isApproved).length} | 
            Pending: {reviews.filter(r => !r.isApproved).length}
          </div>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center text-gray-300 py-8">No reviews found</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-gray-700 rounded-lg p-4 border-l-4 border-green-400">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <img 
                      src={review.avatar} 
                      alt={review.name} 
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-white">{review.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          review.isApproved 
                            ? 'bg-green-500 text-white' 
                            : 'bg-yellow-500 text-black'
                        }`}>
                          {review.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(review.rating)].map((_, idx) => (
                          <span key={idx} className="text-yellow-400">★</span>
                        ))}
                        {[...Array(5 - review.rating)].map((_, idx) => (
                          <span key={idx} className="text-gray-600">★</span>
                        ))}
                        <span className="text-gray-400 text-sm ml-2">({review.rating}/5)</span>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-2">"{review.text}"</p>
                      <p className="text-gray-400 text-xs">{formatDate(review.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    {!review.isApproved && (
                      <button
                        onClick={() => handleApprove(review.id, true)}
                        disabled={updating === review.id}
                        className="px-3 py-1 bg-green-500 hover:bg-green-400 text-black text-xs font-medium rounded transition disabled:opacity-50"
                      >
                        {updating === review.id ? 'Updating...' : 'Approve'}
                      </button>
                    )}
                    
                    {review.isApproved && (
                      <button
                        onClick={() => handleApprove(review.id, false)}
                        disabled={updating === review.id}
                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-medium rounded transition disabled:opacity-50"
                      >
                        {updating === review.id ? 'Updating...' : 'Reject'}
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={updating === review.id}
                      className="px-3 py-1 bg-red-500 hover:bg-red-400 text-white text-xs font-medium rounded transition disabled:opacity-50"
                    >
                      {updating === review.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 