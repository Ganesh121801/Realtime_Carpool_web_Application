import React, { useContext, useEffect, useState } from 'react';
import { UserDataContext } from '../context/UserContext';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Profile = () => {
  const { user } = useContext(UserDataContext);
  const [rideHistory, setRideHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRideHistory = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/history`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRideHistory(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ride history:', error);
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchRideHistory();
    }
  }, [user]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Date not available';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                {user?.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt={user?.name} 
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <i className="ri-user-fill text-5xl text-gray-600"></i>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-500">Member since {formatDate(user?.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* User Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <h3 className="text-gray-500">Total Rides</h3>
              <p className="text-2xl font-bold">{rideHistory.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <h3 className="text-gray-500">Total Spent</h3>
              <p className="text-2xl font-bold">
                {formatCurrency(rideHistory.reduce((acc, ride) => acc + (ride.fare || 0), 0))}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md text-center">
              <h3 className="text-gray-500">Average Rating</h3>
              <p className="text-2xl font-bold flex items-center justify-center">
                {user?.rating || 'N/A'} {user?.rating && <i className="ri-star-fill text-yellow-500 ml-1"></i>}
              </p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-gray-500">Full Name</p>
                  <p className="font-medium">{user?.name || 'Not provided'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">{user?.phone || 'Not provided'}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-500">Location</p>
                  <p className="font-medium">{user?.location || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Rides */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Rides</h2>
            </div>
            
            {loading ? (
              <div className="text-center py-4">
                <i className="ri-loader-4-line animate-spin text-2xl"></i>
                <p className="text-gray-600 mt-2">Loading ride history...</p>
              </div>
            ) : rideHistory.length > 0 ? (
              <div className="space-y-4">
                {rideHistory.map((ride) => (
                  <div key={ride._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <i className="ri-map-pin-line mr-2"></i>
                          <p>From: {ride.pickup}</p>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <i className="ri-flag-line mr-2"></i>
                          <p>To: {ride.destination}</p>
                        </div>
                        <p className="text-sm text-gray-500">{formatDate(ride.createdAt)}</p>
                        <p className="text-sm text-gray-500">Status: {ride.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(ride.fare)}</p>
                        {ride.rating && (
                          <div className="flex items-center text-yellow-500">
                            <span className="text-sm mr-1">{ride.rating}</span>
                            <i className="ri-star-fill"></i>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No rides yet</p>
            )}
          </div>

          {/* Edit Profile Button */}
          <div className="mt-6 flex justify-end">
            <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
