import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ConfirmRidePopUp = (props) => {
    const [ otp, setOtp ] = useState('')
    const navigate = useNavigate()
    const halfFare = props.ride?.fare ? Math.round(props.ride.fare / 2) : 0;
            const submitHander = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
                params: {
                    rideId: props.ride._id,
                    otp: otp
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.status === 200) {
                // Ensure coordinates are available
                const geocoder = new window.google.maps.Geocoder();
                let pickupCoords = props.ride.pickupCoords;
                let destinationCoords = props.ride.destinationCoords;

                // If coordinates aren't available, get them
                if (!pickupCoords) {
                    const pickup = await new Promise((resolve) => {
                        geocoder.geocode({ address: props.ride.pickup }, (results, status) => {
                            if (status === 'OK') {
                                const location = results[0].geometry.location;
                                resolve({ lat: location.lat(), lng: location.lng() });
                            }
                        });
                    });
                    pickupCoords = pickup;
                }

                if (!destinationCoords) {
                    const destination = await new Promise((resolve) => {
                        geocoder.geocode({ address: props.ride.destination }, (results, status) => {
                            if (status === 'OK') {
                                const location = results[0].geometry.location;
                                resolve({ lat: location.lat(), lng: location.lng() });
                            }
                        });
                    });
                    destinationCoords = destination;
                }

                props.setConfirmRidePopupPanel(false);
                props.setRidePopupPanel(false);
                
                navigate('/captain-riding', { 
                    state: { 
                        ride: {
                            ...props.ride,
                            pickupCoords,
                            destinationCoords
                        },
                        showRoute: true 
                    } 
                });
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="relative min-h-[50vh] p-6 pt-8">
            {/* Handle bar */}
            <div className="absolute -top-3 left-0 right-0 flex flex-col items-center">
                <div className="w-12 h-1 bg-gray-300 rounded-full mb-4"></div>
                <h3 className='text-2xl font-semibold'>Confirm this ride to Start</h3>
            </div>

            {/* Rider Info Card */}
            <div className='flex items-center justify-between p-2 border-2 border-yellow-400 rounded-lg mt-6'>
                <div className='flex items-center gap-3'>
                    <img 
                        className='h-12 w-12 rounded-full object-cover' 
                        src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" 
                        alt="Rider" 
                    />
                    <h2 className='text-lg font-medium capitalize'>{props.ride?.user.fullname.firstname}</h2>
                </div>
                <h5 className='text-lg font-semibold'>2.2 KM</h5>
            </div>

            {/* Ride Details */}
            <div className='mt-6 space-y-2'>
                <div className='flex items-center gap-4 p-3 border-b'>
                    <i className="ri-map-pin-user-fill text-blue-600 text-xl"></i>
                    <div>
                        <p className='text-sm text-gray-600'>Pickup</p>
                        <p className='text-base font-medium'>{props.ride?.pickup}</p>
                    </div>
                </div>
                
                <div className='flex items-center gap-4 p-3 border-b'>
                    <i className="ri-map-pin-2-fill text-red-600 text-xl"></i>
                    <div>
                        <p className='text-sm text-gray-600'>Destination</p>
                        <p className='text-base font-medium'>{props.ride?.destination}</p>
                    </div>
                </div>

                <div className='flex items-center gap-4 p-3'>
                    <i className="ri-currency-line text-green-600 text-xl"></i>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Your Share:</span>
                        <span className="font-bold text-blue-600">₹{halfFare}</span>
                    </div>
                    <div>
                        <p className='text-sm text-gray-600'>Fare</p>
                        <p className='text-base font-medium'>₹{props.ride?.fare}</p>
                    </div>
                </div>
            </div>

            {/* OTP Form */}
            <form onSubmit={submitHander} className="mt-2 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                    <input 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        type="text" 
                        className='bg-[#eee] px-6 py-4 font-mono text-1xl tracking-wider rounded-lg w-full mt-3' 
                        placeholder='Enter 6-digit OTP'
                        maxLength="6"
                        pattern="\d{6}"
                        inputMode="numeric"
                    />
                </div>

                <div className="pt-2 space-y-3">
                    <button 
                        type="submit"
                        className='w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors'
                    >
                        Confirm Ride
                    </button>
                    <button 
                        type="button"
                        onClick={() => {
                            props.setConfirmRidePopupPanel(false)
                            props.setRidePopupPanel(false)
                        }} 
                        className='w-full py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors'
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ConfirmRidePopUp