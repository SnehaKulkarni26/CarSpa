import React from 'react';

const Logo = ({ className = '' }) => (
  <img
    src="/logo.jpg"
    alt="The Car Spa Logo"
    className={`h-20 md:h-24 lg:h-28 w-auto ${className}`}
    style={{ maxHeight: '80px' }}
  />
);

export default Logo; 