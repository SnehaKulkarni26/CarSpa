import React, { useState } from 'react';

const PaymentInstructions = ({ paymentMethod, onClose }) => {
  const [copied, setCopied] = useState('');

  const paymentDetails = {
    gpay: {
      upiId: 'carspa@gpay',
      name: 'Google Pay',
      icon: '💳',
      color: 'bg-blue-500',
      instructions: [
        'Open Google Pay app',
        'Tap on "New Payment"',
        'Enter UPI ID: carspa@gpay',
        'Enter the amount',
        'Add a note: "Car Spa Booking"',
        'Complete the payment',
        'Take a screenshot of the confirmation'
      ]
    },
    phonepe: {
      upiId: 'carspa@phonepe',
      name: 'PhonePe',
      icon: '📱',
      color: 'bg-purple-500',
      instructions: [
        'Open PhonePe app',
        'Tap on "Send Money"',
        'Enter UPI ID: carspa@phonepe',
        'Enter the amount',
        'Add a note: "Car Spa Booking"',
        'Complete the payment',
        'Take a screenshot of the confirmation'
      ]
    }
  };

  const detail = paymentDetails[paymentMethod];

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  if (!detail) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-yellow-400">
            {detail.icon} {detail.name} Payment
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg border border-yellow-400">
            <p className="text-gray-300 text-sm mb-2">UPI ID:</p>
            <div className="flex items-center justify-between">
              <p className="text-yellow-400 font-bold text-lg">{detail.upiId}</p>
              <button
                onClick={() => copyToClipboard(detail.upiId, 'upi')}
                className={`px-3 py-1 rounded text-sm font-medium transition ${
                  copied === 'upi' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-blue-500 hover:bg-blue-400 text-white'
                }`}
              >
                {copied === 'upi' ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-2">Payment Instructions:</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-300 text-sm">
              {detail.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>

          <div className="bg-blue-900 p-3 rounded-lg border border-blue-400">
            <p className="text-blue-300 text-sm">
              <strong>Important:</strong> Please take a screenshot of your payment confirmation 
              and upload it in the booking form. This helps us verify your payment quickly.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 bg-green-500 hover:bg-green-400 text-black font-bold rounded transition"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructions; 