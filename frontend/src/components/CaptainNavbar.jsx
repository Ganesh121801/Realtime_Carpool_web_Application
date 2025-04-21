import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CaptainDataContext } from '../context/CapatainContext';

const CaptainNavbar = () => {
  const { captain } = useContext(CaptainDataContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
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
            <Link to="/captain-earnings" className="text-gray-700 hover:text-black">Earnings</Link>
            <Link to="/captain-trips" className="text-gray-700 hover:text-black">My Trips</Link>
            <Link to="/captain-help" className="text-gray-700 hover:text-black">Help</Link>
            <Link to="/captain-profile" className="text-gray-700 hover:text-black">Profile</Link>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/captain-login';
              }}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} pt-4`}>
          <div className="flex flex-col gap-3">
            <Link 
              to="/captain-earnings" 
              className="text-gray-700 hover:text-black py-2 px-4 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Earnings
            </Link>
            <Link 
              to="/captain-trips" 
              className="text-gray-700 hover:text-black py-2 px-4 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              My Trips
            </Link>
            <Link 
              to="/captain-help" 
              className="text-gray-700 hover:text-black py-2 px-4 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Help
            </Link>
            <Link 
              to="/captain-profile" 
              className="text-gray-700 hover:text-black py-2 px-4 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/captain-login';
              }}
              className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 text-left"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CaptainNavbar;
