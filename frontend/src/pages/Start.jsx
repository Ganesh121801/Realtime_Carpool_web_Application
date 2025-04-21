import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Enhanced Navbar */}
      <nav className="bg-black/90 backdrop-blur-sm fixed w-full z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                className="w-16 md:w-20 hover:opacity-80 transition-opacity" 
                src="https://cdn-assets-eu.frontify.com/s3/frontify-enterprise-files-eu/eyJwYXRoIjoid2VhcmVcL2ZpbGVcLzhGbTh4cU5SZGZUVjUxYVh3bnEyLnN2ZyJ9:weare:F1cOF9Bps96cMy7r9Y2d7affBYsDeiDoIHfqZrbcxAw?width=1200&height=417" 
                alt="Uber Logo" 
              />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/services" className="text-white hover:text-yellow-400 transition-colors text-sm uppercase tracking-wider">
                Services
              </Link>
              <Link to="/captain-login" className="text-white hover:text-yellow-400 transition-colors text-sm uppercase tracking-wider">
                Drive with us
              </Link>
              <Link to="/about" className="text-white hover:text-yellow-400 transition-colors text-sm uppercase tracking-wider">
                About
              </Link>
              <Link to="/help" className="text-white hover:text-yellow-400 transition-colors text-sm uppercase tracking-wider">
                Help
              </Link>
              <Link to="/login" className="bg-white text-black px-4 py-2 rounded-full hover:bg-yellow-400 transition-colors text-sm font-medium">
                Sign In
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white p-2"
              >
                <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-2xl`}></i>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/95 absolute top-16 left-0 w-full py-4 px-4 shadow-xl">
              <div className="flex flex-col space-y-4">
                <Link to="/services" className="text-white hover:text-yellow-400 transition-colors">
                  Services
                </Link>
                <Link to="/captain-login" className="text-white hover:text-yellow-400 transition-colors">
                  Drive with us
                </Link>
                <Link to="/about" className="text-white hover:text-yellow-400 transition-colors">
                  About
                </Link>
                <Link to="/help" className="text-white hover:text-yellow-400 transition-colors">
                  Help
                </Link>
                <Link to="/login" className="bg-white text-black px-4 py-2 rounded-full text-center hover:bg-yellow-400 transition-colors">
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <div className="flex-grow">
        <div className="min-h-screen bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] 
          relative flex flex-col md:grid md:grid-cols-2 lg:grid-cols-5">
          
          {/* Enhanced Left side content - Desktop only */}
          <div className="hidden md:flex md:col-span-1 lg:col-span-3 items-center justify-center p-8">
            <div className="bg-black/80 backdrop-blur-sm p-8 rounded-xl text-white max-w-lg transform hover:scale-105 transition-all duration-300">
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent">
                Move with Safety
              </h1>
              <p className="text-lg mb-8 leading-relaxed">
                Your journey begins with us. Experience safe and comfortable rides with professional drivers.
              </p>
              <div className="space-y-6">
                {[
                  { icon: 'ri-shield-check-line', text: 'Verified Drivers', desc: 'All our drivers are thoroughly vetted' },
                  { icon: 'ri-map-pin-line', text: 'Real-time Tracking', desc: 'Know exactly where your ride is' },
                  { icon: 'ri-24-hours-line', text: '24/7 Support', desc: 'Were here to help anytime' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <i className={`${feature.icon} text-3xl text-yellow-400 group-hover:scale-110 transition-transform`}></i>
                    <div>
                      <h3 className="font-semibold text-lg">{feature.text}</h3>
                      <p className="text-gray-300 text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
               
          {/* Enhanced Right side / Mobile content */}
          <div className="flex-1 flex flex-col md:col-span-1 lg:col-span-2">
            {/* Mobile Welcome Text */}
            <div className="flex-1 flex items-center justify-center md:hidden px-6 pt-20">
              <h1 className="text-4xl font-bold text-white text-center shadow-text">
                Welcome to Carpool
              </h1>
            </div>

            {/* Get Started Section - Fixed at bottom for mobile */}
            <div className="w-full md:h-full md:flex md:items-center">
              <div className="w-full bg-white/95 backdrop-blur-sm p-6 
                md:p-8 md:m-8 md:rounded-xl md:shadow-2xl 
                transition-all duration-300 hover:shadow-yellow-400/20
                rounded-t-[2rem] shadow-xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 
                  bg-gradient-to-r from-black to-yellow-600 
                  bg-clip-text text-transparent">
                  Get Started
                </h2>
                <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
                  Join millions of riders who trust us for their daily commute.
                </p>
                <Link 
                  to='/login' 
                  className="flex items-center justify-center w-full bg-black text-white 
                    py-3 md:py-4 rounded-lg text-base md:text-lg font-medium
                    transition-all duration-300 hover:bg-yellow-400 hover:text-black 
                    active:transform active:scale-95"
                >
                  Continue <i className="ri-arrow-right-line ml-2"></i>
                </Link>
                <div className="mt-4 md:mt-6 text-center">
                  <span className="md:hidden text-xs text-gray-500">
                    <i className="ri-arrow-up-line animate-bounce mr-1"></i>
                    Swipe up for more options
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom style for text shadow */}
      <style jsx>{`
        .shadow-text {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  )
}

export default Start