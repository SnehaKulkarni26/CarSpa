import React, { useState, useEffect } from 'react';

const coreValues = [
  { icon: '🚗', title: 'Quality', desc: 'We use the best products and techniques for every vehicle.' },
  { icon: '🤝', title: 'Trust', desc: 'Honest service and transparent pricing, always.' },
  { icon: '💡', title: 'Innovation', desc: 'Modern equipment and continuous improvement.' },
  { icon: '😊', title: 'Customer First', desc: 'Your satisfaction is our top priority.' },
];

const founders = [
  { name: 'Abhay Revankar', role: 'CEO', img: '/founder1.jpg', linkedin: '#' },
  { name: 'Drosten Fernandes', role: 'CF', img: '/founder2.jpg', linkedin: '#' },
];

const gallery = [
  '/carspa1.jpg',
  '/carspa2.jpg',
  '/carspa3.jpg',
  '/carspa4.jpg',
  '/carspa5.jpg',
  '/carspa6.jpg',
];

// Fallback reviews in case API fails
const fallbackReviews = [
  { name: 'Amit S.', text: 'Best car spa in Belgaum! My car looks brand new.', rating: 5, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=amit' },
  { name: 'Priya K.', text: 'Professional staff and great attention to detail.', rating: 5, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=priya' },
  { name: 'Rahul D.', text: 'Affordable and high quality service.', rating: 4, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=rahul' },
  { name: 'Sneha P.', text: 'Loved the interior cleaning. Highly recommend!', rating: 5, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=sneha' },
  { name: 'Vikram R.', text: 'Quick, clean, and friendly.', rating: 4, avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=vikram' },
];

export default function Home() {
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [userName, setUserName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [reviews, setReviews] = useState(fallbackReviews);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch approved reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/reviews/approved');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            setReviews(data);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Keep fallback reviews if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleRating = (r) => setUserRating(r);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userName.trim() || userRating === 0 || userReview.trim().length < 5) {
      alert('Please fill in all fields. Review must be at least 5 characters long.');
      return;
    }

    setSubmitLoading(true);
    
    try {
      const response = await fetch('http://localhost:5002/api/reviews/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userName.trim(),
          rating: userRating,
          text: userReview.trim()
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setSubmitted(true);
        setUserRating(0);
        setUserReview('');
        setUserName('');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section with Background Image */}
      <section
        className="relative flex flex-col items-center justify-center py-16 px-4 text-center min-h-[60vh]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
       
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 bg-clip-text text-transparent animate-pulse">
          The Car Spa, Belgaum
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mb-4 mx-auto drop-shadow">
          Premium Detailing, Cleaning, Protection & More. Book your car or bike for a spa experience today! We bring shine, protection, and care to every vehicle.
        </p>
        <a href="#about" className="mt-4 px-8 py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full text-base md:text-lg shadow-lg transition">Learn More</a>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-10 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-4">About Us</h2>
          <p className="text-base sm:text-lg text-gray-300 mb-4">
            The Car Spa is Belgaum's most trusted car care destination. With years of experience, a passion for automobiles, and a commitment to excellence, we offer a full range of detailing, cleaning, and protection services for cars and bikes. Our mission is to deliver showroom shine and lasting protection, every time.
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-400 text-center mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {coreValues.map((v) => (
              <div key={v.title} className="bg-gray-800 rounded-lg p-6 flex flex-col items-center shadow-lg">
                <span className="text-3xl sm:text-4xl mb-2">{v.icon}</span>
                <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2">{v.title}</h3>
                <p className="text-gray-300 text-center text-sm sm:text-base">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-10 px-2 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 text-center mb-8">Our Work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {gallery.map((img, i) => (
              <img key={img} src={img} alt={`Car Spa ${i+1}`} className="rounded-lg shadow-lg object-cover w-full h-40 sm:h-48 md:h-56 lg:h-64" />
            ))}
          </div>
        </div>
      </section>

      {/* Founders Section - Modern Card Layout */}
      <section className="py-10 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-green-400 mb-8">Meet Our Founders</h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            {founders.map((f) => (
              <div key={f.name} className="flex flex-col items-center bg-gray-800 rounded-2xl p-8 shadow-2xl w-full md:w-1/2 max-w-xs mx-auto border border-green-400">
                <img src={f.img} alt={f.name} className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover mb-4 border-4 border-green-400 shadow-lg" />
                <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-1">{f.name}</h3>
                <p className="text-gray-300 text-sm sm:text-base mb-2">{f.role}</p>
                {f.linkedin && (
                  <a href={f.linkedin} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300 text-2xl mt-2" aria-label="Instagram">
                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 inline"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section - Testimonial Cards */}
      <section className="py-10 px-2 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-yellow-400 text-center mb-8">What Our Customers Say</h2>
          {loading ? (
            <div className="text-center text-gray-300">Loading reviews...</div>
          ) : (
            <div className="flex overflow-x-auto space-x-6 pb-2 scrollbar-hide">
              {reviews.map((r, i) => (
                <div key={i} className="flex-shrink-0 bg-gray-800 rounded-2xl p-6 min-w-[260px] max-w-xs shadow-xl border border-yellow-400 flex flex-col items-center">
                  <img src={r.avatar} alt={r.name} className="w-14 h-14 rounded-full object-cover mb-2 border-2 border-green-400" />
                  <div className="flex items-center mb-1">
                    {[...Array(r.rating)].map((_, idx) => (
                      <span key={idx} className="text-yellow-400 text-lg">★</span>
                    ))}
                    {[...Array(5 - r.rating)].map((_, idx) => (
                      <span key={idx} className="text-gray-600 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-2 text-sm sm:text-base text-center">"{r.text}"</p>
                  <p className="text-green-400 font-bold text-xs sm:text-base">- {r.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* User Rating Section */}
      <section className="py-10 px-2">
        <div className="max-w-xl mx-auto bg-gray-900 rounded-lg p-6 sm:p-8 shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold text-green-400 mb-4 text-center">Rate Us</h2>
          {submitted ? (
            <div className="text-center text-green-400 font-bold">Thank you for your feedback!</div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
              <input
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded bg-gray-800 text-white p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <div className="flex space-x-2">
                {[1,2,3,4,5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRating(r)}
                    className={`text-2xl sm:text-3xl ${userRating >= r ? 'text-yellow-400' : 'text-gray-600'} focus:outline-none`}
                    aria-label={`Rate ${r} star${r > 1 ? 's' : ''}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea
                value={userReview}
                onChange={e => setUserReview(e.target.value)}
                placeholder="Write a review..."
                className="w-full rounded bg-gray-800 text-white p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                rows={3}
                maxLength={500}
                required
              />
              <button
                type="submit"
                className="px-8 py-2 bg-green-500 hover:bg-green-400 text-black font-bold rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={userRating === 0 || userReview.length < 5 || !userName.trim() || submitLoading}
              >
                {submitLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
} 