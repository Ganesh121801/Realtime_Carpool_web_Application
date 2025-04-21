import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      title: "Daily Commute",
      description: "Share rides with people going your way",
      icon: "ri-group-line",
      features: [
        "Save up to 60% on travel costs",
        "Regular schedule matching",
        "Verified co-passengers"
      ],
      eco: "Reduces carbon footprint by sharing vehicles"
    },
    {
      title: "City Pool",
      description: "Quick in-city ride sharing",
      icon: "ri-route-line",
      features: [
        "Instant matching",
        "Flexible pickup points",
        "Split costs instantly"
      ],
      eco: "Less traffic congestion in city areas"
    },
    {
      title: "Long Distance",
      description: "Inter-city travel sharing",
      icon: "ri-roadster-line",
      features: [
        "Planned trips",
        "Choose your co-travelers",
        "Significant cost savings"
      ],
      eco: "Reduced highway traffic and emissions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto px-6 pt-24 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Share  Your Ride</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our community of smart travelers who share rides to save money, 
            reduce traffic, and help the environment
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} 
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl 
                transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-green-50 p-3 rounded-full">
                  <i className={`${service.icon} text-3xl text-green-600`}></i>
                </div>
                <h2 className="text-2xl font-semibold ml-4">{service.title}</h2>
              </div>
              
              <p className="text-gray-600 mb-6">{service.description}</p>
              
              <ul className="space-y-3 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <i className="ri-checkbox-circle-line text-green-500 mr-2 mt-1"></i>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-green-600">
                  <i className="ri-leaf-line mr-2"></i>
                  <span>{service.eco}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-green-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Sharing?</h3>
          <p className="text-gray-600 mb-6">
            Join thousands of people making their commute more sustainable and affordable
          </p>
          <Link to='/login' className="bg-green-600 text-white px-8 py-3 rounded-full 
            hover:bg-green-700 transition-colors duration-300 shadow-lg hover:shadow-xl">
            Get Started Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Services;
