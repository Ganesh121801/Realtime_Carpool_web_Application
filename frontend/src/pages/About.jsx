import React from 'react';
import Navbar from '../components/Navbar';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-6 pt-24 pb-12">
        <h1 className="text-4xl font-bold mb-8">About CarPool</h1>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-600">
                To reduce traffic congestion and carbon emissions by connecting people 
                for shared rides, making commuting more sustainable, affordable, and social.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <i className="ri-shield-check-line mr-2 text-green-500"></i>
                  Community Trust
                </li>
                <li className="flex items-center">
                  <i className="ri-recycle-line mr-2 text-green-500"></i>
                  Environmental Responsibility
                </li>
                <li className="flex items-center">
                  <i className="ri-team-line mr-2 text-green-500"></i>
                  Shared Economy
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Our Impact</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">Environmental Impact</h3>
                <p className="text-gray-600">Reducing CO2 emissions through shared rides</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-semibold mb-2">Community Building</h3>
                <p className="text-gray-600">Connecting neighbors and coworkers for shared commutes</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Cost Savings</h3>
                <p className="text-gray-600">Helping users save on transportation costs through sharing</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">How Carpooling Helps</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <i className="ri-money-dollar-circle-line text-4xl text-green-500 mb-2"></i>
              <h3 className="font-semibold">Share Costs</h3>
              <p className="text-gray-600">Split fuel and maintenance costs</p>
            </div>
            <div className="text-center">
              <i className="ri-earth-line text-4xl text-green-500 mb-2"></i>
              <h3 className="font-semibold">Reduce Emissions</h3>
              <p className="text-gray-600">Lower your carbon footprint</p>
            </div>
            <div className="text-center">
              <i className="ri-road-map-line text-4xl text-green-500 mb-2"></i>
              <h3 className="font-semibold">Less Traffic</h3>
              <p className="text-gray-600">Fewer cars on the road</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
