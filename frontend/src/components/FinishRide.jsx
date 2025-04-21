import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const FinishRide = ({ ride, setFinishRidePanel }) => {
    const navigate = useNavigate()

    async function endRide() {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
                { rideId: ride._id },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            )
            if (response.status === 200) {
                navigate('/captain-home')
            }
        } catch (error) {
            console.error('Error ending ride:', error)
        }
    }

    // Calculate half fare
    const halfFare = ride?.fare ? Math.round(ride.fare / 2) : 0

    return (
        <div className="relative">
            {/* Close Handle */}
            <div 
                className="absolute -top-6 left-1/2 -translate-x-1/2 w-full text-center cursor-pointer"
                onClick={() => setFinishRidePanel(false)}
            >
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <i className="ri-arrow-down-s-line text-gray-400 text-2xl"></i>
            </div>

            {/* Header */}
            <div className="mb-6">
                <h3 className='text-2xl font-bold'>Complete Journey</h3>
                <p className="text-gray-600">Review and finish the ride</p>
            </div>

            {/* Passenger Card */}
            <div className='bg-gradient-to-r from-yellow-50 to-amber-50 p-4 rounded-xl mb-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                        <div className="relative">
                            <img 
                                className='h-16 w-16 rounded-full object-cover ring-2 ring-yellow-400' 
                                src={ride?.user?.profileImage || "https://i.pravatar.cc/300"} 
                                alt={ride?.user?.fullname?.firstname} 
                            />
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                            <h2 className='font-semibold text-lg capitalize'>{ride?.user?.fullname?.firstname}</h2>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <i className="ri-map-pin-line"></i>
                                <span>2.2 KM travelled</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Your Share</p>
                        <p className="text-xl font-bold">₹{halfFare}</p>
                        <span className="text-xs text-gray-500">(Total: ₹{ride?.fare || 0})</span>
                    </div>
                </div>
            </div>

            {/* Journey Details */}
            <div className='bg-gray-50 rounded-xl p-4 mb-6'>
                <div className="space-y-4">
                    {/* Pickup Location */}
                    <div className='flex items-center gap-4'>
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <i className="ri-map-pin-user-fill text-blue-600"></i>
                        </div>
                        <div>
                            <p className='text-sm text-gray-500'>PICKUP POINT</p>
                            <h3 className='font-medium'>{ride?.pickup}</h3>
                        </div>
                    </div>

                    {/* Destination */}
                    <div className='flex items-center gap-4'>
                        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                            <i className="ri-map-pin-2-fill text-green-600"></i>
                        </div>
                        <div>
                            <p className='text-sm text-gray-500'>DESTINATION</p>
                            <h3 className='font-medium'>{ride?.destination}</h3>
                        </div>
                    </div>

                    {/* Payment */}
                    <div className='flex items-center gap-4'>
                        <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <i className="ri-currency-line text-purple-600"></i>
                        </div>
                        <div>
                            <p className='text-sm text-gray-500'>PAYMENT METHOD</p>
                            <h3 className='font-medium'>Cash Payment</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                <button
                    onClick={endRide}
                    className='w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold p-4 rounded-xl flex items-center justify-center gap-2 hover:from-green-700 hover:to-green-600 transition-all shadow-lg'
                >
                    <i className="ri-check-double-line text-xl"></i>
                    Complete Journey
                </button>
                <button
                    onClick={() => setFinishRidePanel(false)}
                    className='w-full bg-gray-100 text-gray-700 font-semibold p-4 rounded-xl hover:bg-gray-200 transition-all'
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default FinishRide