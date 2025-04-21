import React, { useContext } from 'react';
import { CaptainDataContext } from '../context/CapatainContext';
import CaptainNavbar from '../components/CaptainNavbar';

const CaptainProfile = () => {
  const { captain } = useContext(CaptainDataContext);

  return (
    <div className="min-h-screen bg-gray-100">
      <CaptainNavbar />
      
      <div className="container mx-auto px-4 py-20">
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-6">
          <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                {captain?.profileImage ? (
                  <img 
                    src={captain.profileImage} 
                    alt={captain?.name} 
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <i className="ri-user-fill text-5xl text-gray-600"></i>
                )}
              </div>
            <h1 className="text-2xl font-bold">{captain?.name}</h1>
            <p className="text-gray-600">{captain?.email}</p>
          </div>

          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p><span className="font-medium">Phone:</span> {captain?.phone}</p>
                <p><span className="font-medium">Vehicle:</span> {captain?.vehicleDetails?.model}</p>
                <p><span className="font-medium">License Plate:</span> {captain?.vehicleDetails?.licensePlate}</p>
              </div>
              <div className="space-y-2">
                <p><span className="font-medium">Join Date:</span> {new Date(captain?.createdAt).toLocaleDateString()}</p>
                <p>
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-sm ${captain?.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {captain?.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Carpool Statistics */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Carpool Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">
                  {captain?.totalRides || 0}
                </p>
                <p className="text-gray-600">Shared Rides</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">
                  {captain?.rating?.toFixed(1) || '0.0'}
                </p>
                <p className="text-gray-600">Community Rating</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">
                  {captain?.completedRides || 0}
                </p>
                <p className="text-gray-600">Completed Pools</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">
                  ${captain?.totalEarnings?.toFixed(2) || '0.00'}
                </p>
                <p className="text-gray-600">Cost Savings</p>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Vehicle Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p><span className="font-medium">Model:</span> {captain?.vehicleDetails?.model}</p>
                <p><span className="font-medium">Year:</span> {captain?.vehicleDetails?.year}</p>
                <p><span className="font-medium">Color:</span> {captain?.vehicleDetails?.color}</p>
              </div>
              <div className="space-y-2">
                <p><span className="font-medium">License Plate:</span> {captain?.vehicleDetails?.licensePlate}</p>
                <p><span className="font-medium">Insurance Number:</span> {captain?.vehicleDetails?.insuranceNumber}</p>
                <p><span className="font-medium">Last Maintenance:</span> {captain?.vehicleDetails?.lastMaintenance}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaptainProfile;
