// src/components/Navbar.jsx
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';

const Navbar = () => {
  const { user } = useContext(UserDataContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <i className="ri-group-line text-2xl text-blue-600"></i>
            <span className="font-bold text-xl">RideShare</span>
          </Link>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            <i className={`ri-${isMenuOpen ? 'close-line' : 'menu-line'} text-2xl`}></i>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/services" className="text-gray-700 hover:text-black">Services</Link>
            <Link to="/about" className="text-gray-700 hover:text-black">About</Link>
            <Link to="/help" className="text-gray-700 hover:text-black">Help</Link>
            {user ? (
              <>
                <Link to="/profile" className="text-gray-700 hover:text-black">Profile</Link>
                <button 
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.reload();
                  }}
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-black">Login</Link>
                <Link to="/signup" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pt-4`}>
          <div className="flex flex-col gap-3">
            <Link 
              to="/services" 
              className="text-gray-700 hover:text-black py-2 px-4 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-black py-2 px-4 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/help" 
              className="text-gray-700 hover:text-black py-2 px-4 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Help
            </Link>
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-black py-2 px-4 hover:bg-gray-100 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button 
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.reload();
                  }}
                  className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-black py-2 px-4 hover:bg-gray-100 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;