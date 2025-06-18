import React from 'react';

const Services = () => {
  const services = [
    {
      name: 'Body Wash',
      description: 'Exterior cleaning and washing of your vehicle',
      prices: {
        'Hatchback': '₹299',
        'Sedan': '₹399',
        'Compact SUV': '₹499',
        'SUV': '₹599',
        '7 Seater': '₹699'
      }
    },
    {
      name: 'Full Wash',
      description: 'Complete interior and exterior cleaning',
      prices: {
        'Hatchback': '₹599',
        'Sedan': '₹799',
        'Compact SUV': '₹999',
        'SUV': '₹1199',
        '7 Seater': '₹1399'
      }
    },
    {
      name: 'Premium Wash',
      description: 'Premium detailing with waxing and polishing',
      prices: {
        'Hatchback': '₹999',
        'Sedan': '₹1299',
        'Compact SUV': '₹1499',
        'SUV': '₹1799',
        '7 Seater': '₹1999'
      }
    }
  ];

  const additionalServices = [
    {
      name: 'INTERIOR CLEANING',
      description: 'Deep cleaning of car interior including seats, dashboard, and carpets'
    },
    {
      name: 'CAR & BIKE POLISH',
      description: 'Professional polishing service for cars and bikes'
    },
    {
      name: 'GLASS POLISH',
      description: 'Specialized glass cleaning and polishing'
    },
    {
      name: 'CERAMIC COATING',
      description: 'Long-lasting protective ceramic coating for your vehicle'
    },
    {
      name: 'TEFLON COATING',
      description: 'Protective teflon coating for enhanced shine and protection'
    },
    {
      name: 'PAINT PROTECTION FILM (PPF)',
      description: 'Transparent protective film for paint protection'
    },
    {
      name: 'SCRATCH REMOVAL',
      description: 'Professional scratch removal and paint touch-up'
    },
    {
      name: 'DENT REMOVAL & PAINT',
      description: 'Paintless dent removal and paint restoration'
    },
    {
      name: 'ACCESSORIES INSTALLATION',
      description: 'Professional installation of car accessories'
    }
  ];

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Our Services
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Professional car care services at competitive prices
          </p>
        </div>

        {/* Main Services with Pricing */}
        <div className="mt-12 space-y-8">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800">
              <div className="px-6 py-8">
                <h3 className="text-2xl font-bold text-white mb-2">{service.name}</h3>
                <p className="text-gray-300 mb-6">{service.description}</p>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-800">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Vehicle Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-900 divide-y divide-gray-800">
                      {Object.entries(service.prices).map(([type, price]) => (
                        <tr key={type}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                            {type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">
                            {price}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Additional Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-gray-900 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-gray-800">
                <h4 className="text-xl font-semibold text-white mb-2">{service.name}</h4>
                <p className="text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services; 