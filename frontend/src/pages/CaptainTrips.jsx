import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CaptainDataContext } from '../context/CapatainContext';
import CaptainNavbar from '../components/CaptainNavbar';

const CaptainTrips = () => {
  const [trips, setTrips] = useState([]);
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/captain/${captain._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setTrips(response.data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };

    fetchTrips();
  }, [captain._id]);

  return (
    <div className="min-h-screen bg-gray-100">
      <CaptainNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <h1 className="text-3xl font-bold mb-6">Your Trips History</h1>
        <div className="space-y-4">
          {trips.map((trip) => (
            <div key={trip._id} className="bg-white p-4 rounded-lg shadow">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Date:</p>
                  <p className="font-semibold">{new Date(trip.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Amount:</p>
                  <p className="font-semibold">${trip.amount}</p>
                </div>
                <div>
                  <p className="text-gray-600">From:</p>
                  <p className="font-semibold">{trip.pickup.address}</p>
                </div>
                <div>
                  <p className="text-gray-600">To:</p>
                  <p className="font-semibold">{trip.destination.address}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status:</p>
                  <p className={`font-semibold ${trip.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {trips.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No trips found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaptainTrips;
