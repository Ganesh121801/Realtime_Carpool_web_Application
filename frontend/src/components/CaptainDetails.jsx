import React, { useContext, useEffect, useState } from 'react';
import { CaptainDataContext } from '../context/CapatainContext';
import { SocketContext } from '../context/SocketContext';

const CaptainDetails = () => {
    const { captain } = useContext(CaptainDataContext);
    const { socket } = useContext(SocketContext);
    const [stats, setStats] = useState({
        todayEarnings: 0,
        totalEarnings: captain?.earnings || 0,
        totalSavings: captain?.totalSavings || 0,
        completedRides: captain?.completedRides || 0
    });

    useEffect(() => {
        socket.on('earnings-updated', (data) => {
            setStats(prev => ({
                ...prev,
                todayEarnings: prev.todayEarnings + data.earnings,
                totalEarnings: prev.totalEarnings + data.earnings,
                totalSavings: prev.totalSavings + data.earnings,
                completedRides: prev.completedRides + 1
            }));
        });

        return () => socket.off('earnings-updated');
    }, [socket]);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            {/* <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Rideshare Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Today's Earnings</p>
                        <p className="text-xl font-bold text-blue-600">₹{stats.todayEarnings}</p>
                        <p className="text-xs text-gray-500">(50% of fare)</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Total Savings</p>
                        <p className="text-xl font-bold text-green-600">₹{stats.totalSavings}</p>
                        <p className="text-xs text-gray-500">From ridesharing</p>
                    </div>
                </div>
            </div> */}

            <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                        <p className="text-sm text-gray-600">Completed Rides</p>
                        <p className="font-semibold">{stats.completedRides}</p>
                    </div>
                    <i className="ri-route-line text-2xl text-blue-600"></i>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                        <p className="text-sm text-gray-600">Vehicle Type</p>
                        <p className="font-semibold capitalize">{captain?.vehicle?.vehicleType}</p>
                    </div>
                    <i className="ri-car-line text-2xl text-blue-600"></i>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                        <p className="text-sm text-gray-600">Average Rating</p>
                        <p className="font-semibold">{captain?.rating?.toFixed(1) || '0.0'} ⭐</p>
                    </div>
                    <i className="ri-star-line text-2xl text-blue-600"></i>
                </div>
            </div>
        </div>
    );
};

export default CaptainDetails;