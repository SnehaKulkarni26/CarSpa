// Central API utility for The Car Spa frontend

// Set your production backend URL here
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002';

// For Socket.IO (can be same as API_BASE_URL)
export const SOCKET_IO_URL = import.meta.env.VITE_SOCKET_IO_URL || API_BASE_URL;

// Helper for fetch requests
export function apiFetch(path, options = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  return fetch(url, options);
} 