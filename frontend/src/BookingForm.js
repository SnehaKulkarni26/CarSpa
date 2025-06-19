import React, { useState } from 'react';
import PaymentInstructions from './PaymentInstructions';

const SERVICES = [
  'Washing',
  'Detailing',
  'Interior Cleaning',
  'Car & Bike Polish',
  'Glass Polish',
  'Ceramic Coating',
  'Teflon Coating',
  'Paint Protection Film (PPF)',
  'Scratch Removal',
  'Dent Removal & Paint',
  'Accessories Installation',
];

const CAR_TYPES = [
  'Hatchback',
  'Sedan',
  'Compact SUV',
  'SUV',
  '7 Seater',
  'Bike',
];

const PAYMENT_METHODS = [
  { value: 'gpay', label: 'Google Pay', icon: '💳' },
  { value: 'phonepe', label: 'PhonePe', icon: '📱' },

];

const BookingForm = ({ onBooked }) => {
  const [form, setForm] = useState({
    service: '',
    carType: '',
    date: '',
    time: '',
    carPhoto: null,
    paymentMethod: '',
    paymentId: '',
    paymentScreenshot: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'carPhoto' || name === 'paymentScreenshot') {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Only allow times between 9:00 and 19:00
  const isValidTime = (time) => {
    const [h, m] = time.split(':').map(Number);
    return h >= 9 && h < 19;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (!isValidTime(form.time)) {
      setError('Please select a time between 09:00 and 19:00');
      setLoading(false);
      return;
    }

    // Validate payment method requirements
    if (form.paymentMethod === 'gpay' || form.paymentMethod === 'phonepe') {
      if (!form.paymentId.trim()) {
        setError('Payment Transaction ID is required for digital payments');
        setLoading(false);
        return;
      }
      if (!form.paymentScreenshot) {
        setError('Payment screenshot is required for digital payments');
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('service', form.service);
      formData.append('carType', form.carType);
      formData.append('date', form.date);
      formData.append('time', form.time);
      formData.append('paymentMethod', form.paymentMethod);
      formData.append('paymentId', form.paymentId);
      
      if (form.carPhoto) {
        formData.append('carPhoto', form.carPhoto);
      }
      if (form.paymentScreenshot) {
        formData.append('paymentScreenshot', form.paymentScreenshot);
      }

      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Booking successful! We will confirm your appointment soon.');
        setForm({ 
          service: '', 
          carType: '', 
          date: '', 
          time: '', 
          carPhoto: null, 
          paymentMethod: '',
          paymentId: '', 
          paymentScreenshot: null 
        });
        if (onBooked) onBooked();
      } else {
        setError(data.message || 'Booking failed');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError('Server error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-900 p-8 rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">Book a Service</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <select
          name="service"
          value={form.service}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-green-400 focus:outline-none"
          required
        >
          <option value="">Select Service</option>
          {SERVICES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          name="carType"
          value={form.carType}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-green-400 focus:outline-none"
          required
        >
          <option value="">Select Car/Bike Type</option>
          {CAR_TYPES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-green-400 focus:outline-none"
          required
        />

        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-green-400 focus:outline-none"
          required
        />

        <div>
          <label className="block text-white mb-2">Car Photo (Optional)</label>
          <input
            type="file"
            name="carPhoto"
            accept="image/*"
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-green-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-white mb-2">Payment Method *</label>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-green-400 focus:outline-none"
            required
          >
            <option value="">Select Payment Method</option>
            {PAYMENT_METHODS.map((method) => (
              <option key={method.value} value={method.value}>
                {method.icon} {method.label}
              </option>
            ))}
          </select>
        </div>

        {(form.paymentMethod === 'gpay' || form.paymentMethod === 'phonepe') && (
          <>
            <div>
              <label className="block text-white mb-2">
                {form.paymentMethod === 'gpay' ? 'Google Pay' : 'PhonePe'} UPI ID
              </label>
              <div className="bg-gray-800 p-3 rounded border border-yellow-400">
                <p className="text-yellow-400 font-bold text-center">
                  {form.paymentMethod === 'gpay' ? 'abhayrevenkarbgm-1@okhdfcbank' : 'abhay.revenkar@ybl'}
                </p>
                <p className="text-gray-400 text-sm text-center mt-1">
                  Please send payment to this UPI ID
                </p>
                <button
                  type="button"
                  onClick={() => setShowPaymentInstructions(true)}
                  className="w-full mt-2 py-1 bg-blue-500 hover:bg-blue-400 text-white text-sm font-medium rounded transition"
                >
                  📋 View Payment Instructions
                </button>
              </div>
            </div>

            <input
              type="text"
              name="paymentId"
              placeholder="Payment Transaction ID (Required)"
              value={form.paymentId}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-green-400 focus:outline-none"
              required
            />

            <div>
              <label className="block text-white mb-2">Payment Screenshot (Required)</label>
              <input
                type="file"
                name="paymentScreenshot"
                accept="image/*"
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-green-400 focus:outline-none"
                required
              />
              <p className="text-gray-400 text-sm mt-1">
                Please upload a screenshot of your payment confirmation
              </p>
            </div>
          </>
        )}

        {showPaymentInstructions && (
          <PaymentInstructions
            paymentMethod={form.paymentMethod}
            onClose={() => setShowPaymentInstructions(false)}
          />
        )}

        

        <button
          type="submit"
          className="w-full py-3 bg-green-500 hover:bg-green-400 text-black font-bold rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Booking...' : 'Book Now'}
        </button>
      </form>
      
      {message && <div className="mt-4 text-green-400 text-center font-bold">{message}</div>}
      {error && <div className="mt-4 text-red-400 text-center">{error}</div>}
      
      <div className="mt-6 text-gray-400 text-sm">
        <p className="text-center">
          <strong>Shop Hours:</strong> 8:00 AM - 8:00 PM
        </p>
        <p className="text-center mt-2">
          For digital payments, please ensure you have the payment screenshot ready.
        </p>
      </div>
    </div>
  );
};

export default BookingForm; 