import React, { useRef, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveTracking from '../components/LiveTracking'
import CaptainChat from "./captainChat";
import axios from 'axios';

const CaptainRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768)
    const [isPanelExpanded, setIsPanelExpanded] = useState(true)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const { ride } = location.state || {}

    const [pickupCoords] = useState(ride?.pickupCoords || null);
    const [destinationCoords] = useState(ride?.destinationCoords || null);
    const [showRoute] = useState(true);

    // State for real distance/time
    const [distanceTime, setDistanceTime] = useState({ distance: '', duration: '' });
    const [captainCoords, setCaptainCoords] = useState(null);

    useEffect(() => {
        const handleResize = () => setIsMobileView(window.innerWidth < 768)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Get captain's live location
    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setCaptainCoords({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (err) => console.error(err),
            { enableHighAccuracy: true }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // Fetch real distance/time from backend
    useEffect(() => {
        if (
            captainCoords &&
            ride?.destination &&
            captainCoords.lat &&
            captainCoords.lng
        ) {
            axios
                .get(`${import.meta.env.VITE_BASE_URL}/maps/get-distance-time`, {
                    params: {
                        origin: `${captainCoords.lat},${captainCoords.lng}`,
                        destination: ride.destination,
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                .then((res) => {
                    setDistanceTime({
                        distance: res.data.distance?.text || '',
                        duration: res.data.duration?.text || '',
                    });
                })
                .catch(() => setDistanceTime({ distance: '', duration: '' }));
        }
    }, [captainCoords, ride?.destination]);

    useGSAP(() => {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(0)',
                duration: 0.3,
                ease: 'power2.out'
            })
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: 'power2.in'
            })
        }
    }, [finishRidePanel])

    return (
        <div className='h-screen bg-gray-50 relative overflow-hidden'>
            <div className={`flex ${isMobileView ? 'flex-col' : 'flex-row'} h-full`}>
                {/* Map Section */}
                <div className={`relative transition-all duration-300 ${
                    isMobileView 
                        ? 'h-[75vh]' 
                        : isPanelExpanded ? 'w-[70%]' : 'w-[85%]'
                }`}>
                    <LiveTracking
                        pickup={pickupCoords}
                        destination={destinationCoords}
                        showRoute={showRoute}
                        isCaptain={true}
                        ride={ride}
                    />

                    {/* Header */}
                    <div className='absolute top-4 left-4 right-4 flex items-center justify-between z-10'>
                        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-lg">
                            <img className='w-12 h-12 rounded-full object-cover ring-2 ring-blue-500' 
                                 src={ride?.user?.profileImage || "https://i.pravatar.cc/300"} 
                                 alt="Passenger" />
                            <div>
                                <h3 className="font-semibold">{ride?.user?.fullname?.firstname || "Passenger"}</h3>
                                <p className="text-sm text-gray-600">Co-passenger</p>
                            </div>
                        </div>
                        <Link to='/captain-home' 
                              className='h-10 w-10 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-full shadow-lg hover:bg-white transition-colors'>
                            <i className="ri-logout-box-r-line text-lg"></i>
                        </Link>
                    </div>

                    {/* Ride Progress Card */}
                    <div className="absolute top-24 left-4 z-10 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <i className="ri-route-line text-xl text-blue-600"></i>
                            </div>
                            <div>
                                <h4 className="font-semibold">{distanceTime.distance ? `${distanceTime.distance} remaining` : '...'} </h4>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <i className="ri-time-line"></i>
                                    <span>{distanceTime.duration ? `${distanceTime.duration} to destination` : '...'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                                <i className="ri-money-dollar-circle-line text-green-600"></i>
                                <span className="font-medium">
            Each Rider Pays: ₹{ride?.fare ? Math.round(ride.fare / 2) : "0"}
        </span>
        <span className="text-xs text-gray-500 ml-2">(Total: ₹{ride?.fare || "0"})</span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Toggle Button */}
                    {!isMobileView && (
                        <button 
                            onClick={() => setIsPanelExpanded(!isPanelExpanded)}
                            className="absolute top-1/2 -translate-y-1/2 right-0 bg-white shadow-lg rounded-l-full p-2"
                        >
                            <i className={`ri-arrow-${isPanelExpanded ? 'right' : 'left'}-s-line text-xl`}></i>
                        </button>
                    )}
                </div>

                {/* Control Panel */}
                <div className={`bg-white transition-all duration-300 ${
                    isMobileView
                        ? 'h-[25vh]'
                        : `${isPanelExpanded ? 'w-[30%]' : 'w-[15%]'}`
                } shadow-xl relative`}>
                    <div className="p-6 h-full flex flex-col justify-between">
                        {/* Navigation Details */}
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                        <div className="w-0.5 h-12 bg-gray-300"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="flex-1 space-y-6">
                                        <div>
                                            <p className="text-xs text-gray-500">CURRENT LOCATION</p>
                                            <p className="font-medium">{distanceTime.distance ? `${distanceTime.distance} from destination` : '...'}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">DESTINATION</p>
                                            <p className="font-medium">{ride?.destination}</p>
                                        </div>
                                        <div>
                                            <i className="ri-message-3-line text-gray-600 text-md"> Want to chat ??</i>
                                            <CaptainChat userId={ride?.user?._id} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Complete Journey Button */}
                        <button 
                            onClick={() => setFinishRidePanel(true)}
                            className='w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold p-4 rounded-xl flex items-center justify-center gap-2 hover:from-green-700 hover:to-green-600 transition-all shadow-lg'
                        >
                            <i className="ri-flag-2-line text-lg"></i>
                            Complete Journey
                        </button>
                    </div>
                </div>
            </div>

            {/* Finish Ride Panel */}
            <div 
                ref={finishRidePanelRef} 
                className='fixed w-full z-[500] bottom-0 translate-y-full bg-white px-6 py-8 rounded-t-3xl shadow-lg'
            >
                <FinishRide
                    ride={ride}
                    setFinishRidePanel={setFinishRidePanel}
                />
            </div>
        </div>
    )
}

export default CaptainRiding