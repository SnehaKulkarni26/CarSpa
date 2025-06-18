import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Logo from './Logo';
import Home from './Home';
import Services from './Services';
import Contact from './Contact';
import BookingForm from './BookingForm';
import BookingHistory from './BookingHistory';
import Chat from './Chat';
import AdminPanel from './AdminPanel';
import AdminChat from './AdminChat';
import Login from './Login';
import Register from './Register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setIsAdmin(userData.isAdmin);
    setUser(userData);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser(null);
    localStorage.removeItem('token');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        {/* Navigation */}
        <nav className="bg-black shadow-lg border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link to="/" onClick={closeMobileMenu} className="flex items-center">
                  <Logo className="mr-2" />
                </Link>
                {/* Desktop Nav */}
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/"
                    className="border-transparent text-gray-300 hover:text-green-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    to="/services"
                    className="border-transparent text-gray-300 hover:text-green-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Services
                  </Link>
                  <Link
                    to="/contact"
                    className="border-transparent text-gray-300 hover:text-green-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Contact
                  </Link>
                  {isLoggedIn && (
                    <>
                      <Link
                        to="/book"
                        className="border-transparent text-gray-300 hover:text-green-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                      >
                        Book Service
                      </Link>
                      <Link
                        to="/history"
                        className="border-transparent text-gray-300 hover:text-green-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                      >
                        Booking History
                      </Link>
                      <Link
                        to="/chat"
                        className="border-transparent text-gray-300 hover:text-green-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                      >
                        Chat
                      </Link>
                    </>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="border-transparent text-gray-300 hover:text-green-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    >
                      Admin Panel
                    </Link>
                  )}
                </div>
              </div>
              {/* Hamburger Icon for Mobile */}
              <div className="sm:hidden flex items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-300 hover:text-green-400 focus:outline-none focus:text-green-400"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? (
                    <span className="text-3xl">×</span>
                  ) : (
                    <span className="text-3xl">☰</span>
                  )}
                </button>
              </div>
              {/* Desktop Auth Buttons */}
              <div className="hidden sm:flex items-center space-x-4">
                {!isLoggedIn ? (
                  <>
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-green-500 hover:bg-green-400"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => setShowRegisterModal(true)}
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-yellow-500 hover:bg-yellow-400"
                    >
                      Register
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="sm:hidden bg-black border-t border-gray-800 px-4 pb-4 pt-2 space-y-2 z-50">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="block text-gray-300 hover:text-green-400 py-2"
              >
                Home
              </Link>
              <Link
                to="/services"
                onClick={closeMobileMenu}
                className="block text-gray-300 hover:text-green-400 py-2"
              >
                Services
              </Link>
              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className="block text-gray-300 hover:text-green-400 py-2"
              >
                Contact
              </Link>
              {isLoggedIn && (
                <>
                  <Link
                    to="/book"
                    onClick={closeMobileMenu}
                    className="block text-gray-300 hover:text-green-400 py-2"
                  >
                    Book Service
                  </Link>
                  <Link
                    to="/history"
                    onClick={closeMobileMenu}
                    className="block text-gray-300 hover:text-green-400 py-2"
                  >
                    Booking History
                  </Link>
                  <Link
                    to="/chat"
                    onClick={closeMobileMenu}
                    className="block text-gray-300 hover:text-green-400 py-2"
                  >
                    Chat
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className="block text-gray-300 hover:text-green-400 py-2"
                >
                  Admin Panel
                </Link>
              )}
              <div className="flex flex-col space-y-2 mt-2">
                {!isLoggedIn ? (
                  <>
                    <button
                      onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }}
                      className="w-full px-4 py-2 rounded bg-green-500 hover:bg-green-400 text-black font-bold"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => { setShowRegisterModal(true); setMobileMenuOpen(false); }}
                      className="w-full px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-400 text-black font-bold"
                    >
                      Register
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-bold"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="bg-black">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book" element={<BookingForm user={user} />} />
            <Route path="/history" element={<BookingHistory user={user} />} />
            <Route path="/chat" element={<Chat user={user} />} />
            <Route path="/admin" element={<AdminPanel user={user} />} />
            <Route path="/admin/chat" element={<AdminChat user={user} />} />
          </Routes>
        </main>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-lg shadow-xl max-w-md w-full">
              <Login onLogin={handleLogin} onClose={() => setShowLoginModal(false)} />
            </div>
          </div>
        )}

        {/* Register Modal */}
        {showRegisterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-lg shadow-xl max-w-md w-full">
              <Register onClose={() => setShowRegisterModal(false)} />
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
