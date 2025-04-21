import React, { useState, useEffect, useContext } from 'react';
import CaptainNavbar from '../components/CaptainNavbar';
import { CaptainDataContext } from '../context/CapatainContext';
import axios from 'axios';

const CaptainEarnings = () => {
  const [earnings, setEarnings] = useState({
    today: 0,
    weekly: 0,
    monthly: 0,
    totalRides: 0,
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captain/earnings`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          }
        );
        setEarnings(response.data);
      } catch (error) {
        console.error('Error fetching earnings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CaptainNavbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">My Earnings</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-gray-500 mb-2">Today's Earnings</h3>
                <p className="text-2xl font-bold">{formatCurrency(earnings.today)}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-gray-500 mb-2">This Week</h3>
                <p className="text-2xl font-bold">{formatCurrency(earnings.weekly)}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-gray-500 mb-2">This Month</h3>
                <p className="text-2xl font-bold">{formatCurrency(earnings.monthly)}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-gray-500 mb-2">Total Rides</h3>
                <p className="text-2xl font-bold">{earnings.totalRides}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Recent Transactions</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {earnings.recentTransactions.map((transaction, index) => (
                  <div key={index} className="px-6 py-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Ride #{transaction.rideId}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-bold text-lg">{formatCurrency(transaction.amount)}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CaptainEarnings;
