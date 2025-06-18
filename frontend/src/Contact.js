import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Contact Us
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Get in touch with us for any queries or to book a service
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Contact Information */}
          <div className="bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-800">
            <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Phone</p>
                  <p className="text-sm text-gray-300">+91 7411116090</p>
                  <p className="text-sm text-gray-300">+91 7738956523</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Email</p>
                  <p className="text-sm text-gray-300">info@carspa.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Address</p>
                  <p className="text-sm text-gray-300">
                    Guruwar Peth, Belgaum<br />
                    Karnataka, India 590003<br />
                    India
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-gray-900 rounded-lg shadow-lg p-8 border border-gray-800">
            <h3 className="text-2xl font-bold text-white mb-6">Business Hours</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-white">Everyday</span>
                <span className="text-sm text-gray-300">8:00 AM - 8:00 PM</span>
              </div>
              
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-semibold text-white mb-4">Payment Methods</h4>
              <div className="flex space-x-4">
                <div className="bg-gray-800 rounded-lg p-3">
                  <span className="text-sm font-medium text-white">GPay</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <span className="text-sm font-medium text-white">PhonePe</span>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <span className="text-sm font-medium text-white">Cash</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.1234567890123!2d74.5083!3d15.8497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfba1063b5fa9b%3A0x889fa0c9e6c7f094!2sGuruwar%20Peth%2C%20Belgaum%2C%20Karnataka%20590003%2C%20India!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="The Car Spa - Guruwar Peth, Belgaum (Near A K Sports)"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 