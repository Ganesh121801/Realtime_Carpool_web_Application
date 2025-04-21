import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { useEffect, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CapatainContext";
import axios from "axios";
import LiveTracking from "../components/LiveTracking";
import CaptainNavbar from '../components/CaptainNavbar';

const CaptainHome = () => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [showRoute, setShowRoute] = useState(false);

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);
  const [ride, setRide] = useState(null);

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [rideDetails, setRideDetails] = useState({
    maxPassengers: 3,
    pricePerSeat: 0,
    departureTime: "",
  });

  const getCoordinates = async (address) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
          if (status === 'OK') {
            const { lat, lng } = results[0].geometry.location;
            resolve({ lat: lat(), lng: lng() });
          } else {
            reject(new Error('Geocoding failed'));
          }
        });
      });
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  };

  useEffect(() => {
    socket.emit("join", {
      userId: captain._id,
      userType: "captain",
    });
    console.log("Captain socket ID:", socket.id);

    socket.on("new-ride", (data) => {
      console.log("New ride request received:", data);
      setRide(data.data || data);
      setRidePopupPanel(true);
    });

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socket.emit("update-location-captain", {
            userId: captain._id,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
            },
          });
        });
      }
    };

   

    const locationInterval = setInterval(updateLocation, 10000);
    updateLocation();

    return () => {
      clearInterval(locationInterval);
      socket.off("new-ride");
    };
  }, [captain._id, socket]);

  async function confirmRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: ride._id,
          captainId: captain._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const pickupCoordinates = await getCoordinates(ride.pickup);
      const destinationCoordinates = await getCoordinates(ride.destination);

      setPickupCoords(pickupCoordinates);
      setDestinationCoords(destinationCoordinates);
      setShowRoute(true);
      setRidePopupPanel(false);
      setConfirmRidePopupPanel(true);
    } catch (error) {
      console.error("Error confirming ride:", error);
    }
  }

  const handleCreateRidesharebyCaptain = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    
    if (!pickupLocation || !destinationLocation) {
      alert('Please enter pickup and destination locations');
      setIsCreating(false);
      return;
    }

    if (rideDetails.pricePerSeat <= 0) {
      alert('Please enter a valid price');
      setIsCreating(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create-rideshare`,
        {
          pickup: pickupLocation,
          destination: destinationLocation,
          maxPassengers: rideDetails.maxPassengers,
          pricePerSeat: rideDetails.pricePerSeat,
          departureTime: rideDetails.departureTime
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );

      setRideDetails({
        maxPassengers: 3,
        pricePerSeat: 0,
        departureTime: ""
      });

      alert('Rideshare published successfully');
      socket.emit('new-rideshare-created', response.data);

    } catch (error) {
      console.log('Error creating rideshare:', error);
      alert('Failed to create rideshare');
    } finally {
      setIsCreating(false);
    }
  };

  useGSAP(
    () => {
      gsap.to(ridePopupPanelRef.current, {
        transform: ridePopupPanel ? "translateY(0)" : "translateY(100%)"
      });
    },
    [ridePopupPanel]
  );

  useGSAP(
    () => {
      gsap.to(confirmRidePopupPanelRef.current, {
        transform: confirmRidePopupPanel ? "translateY(0)" : "translateY(100%)"
      });
    },
    [confirmRidePopupPanel]
  );

  return (
    <div className="h-screen w-full relative overflow-hidden md:flex bg-gray-50">
      <CaptainNavbar />

      <div className="fixed h-full w-full md:w-[calc(100%-400px)] md:left-[400px] top-0 z-10">
        <div className="absolute top-20 left-4 z-20 bg-white px-4 py-2 rounded-lg shadow-md">
          <p className="text-sm md:text-base font-semibold text-blue-600">Rideshare Creator Mode</p>
          <p className="text-xs md:text-sm text-gray-600">Share your journey & split costs</p>
        </div>
        
        <div className="h-full w-full pt-16">
          <LiveTracking
            pickup={pickupCoords}
            destination={destinationCoords}
            showRoute={showRoute}
            isCaptain={true}
            ride={ride}
          />
        </div>
      </div>

      <div className="fixed bottom-0 w-full md:w-[400px] md:left-0 h-[70vh] md:h-screen bg-white p-4 md:p-6 z-30 md:top-0 md:pt-20 shadow-lg rounded-t-3xl md:rounded-none">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4 md:hidden"></div>
        
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 pb-4 border-b scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 sticky top-0 bg-white p-2">
              Create a Rideshare
            </h2>
            
            <form onSubmit={handleCreateRidesharebyCaptain}>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-700 mb-2">Your Journey Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600">Pickup Location</label>
                      <input 
                        type="text"
                        className="w-full p-2 rounded border mt-1"
                        placeholder="Enter pickup location"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-600">Destination</label>
                      <input 
                        type="text"
                        className="w-full p-2 rounded border mt-1"
                        placeholder="Enter destination"
                        value={destinationLocation}
                        onChange={(e) => setDestinationLocation(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Available Seats</label>
                      <select 
                        className="w-full p-2 rounded border mt-1"
                        value={rideDetails.maxPassengers}
                        onChange={(e) => setRideDetails({...rideDetails, maxPassengers: e.target.value})}
                      >
                        <option value="1">1 Seat</option>
                        <option value="2">2 Seats</option>
                        <option value="3">3 Seats</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm text-gray-600">Price per Seat</label>
                      <input 
                        type="number"
                        className="w-full p-2 rounded border mt-1"
                        placeholder="Enter amount"
                        value={rideDetails.pricePerSeat}
                        onChange={(e) => setRideDetails({...rideDetails, pricePerSeat: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-600">Departure Time</label>
                      <input 
                        type="datetime-local"
                        className="w-full p-2 rounded border mt-1"
                        value={rideDetails.departureTime}
                        onChange={(e) => setRideDetails({...rideDetails, departureTime: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300"
                >
                  {isCreating ? 'Publishing...' : 'Publish Rideshare'}
                </button>
              </div>
            </form>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4 sticky top-0 bg-white p-2">
              Rideshare Statistics
            </h2>
            <div className="pr-2">
              <CaptainDetails />
            </div>
          </div>
        </div>
      </div>

      <div
        ref={ridePopupPanelRef}
        className="fixed w-full md:w-[400px] md:right-0 z-40 bottom-0 translate-y-full bg-white px-3 py-6 md:py-10 pt-8 md:pt-12 rounded-t-3xl md:rounded-none md:shadow-lg"
      >
        <div className="absolute top-3 left-0 w-full px-4">
          <div className="w-20 h-1 bg-gray-300 rounded-full mx-auto"></div>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          <RidePopUp
            ride={ride}
            setRidePopupPanel={setRidePopupPanel}
            setConfirmRidePopupPanel={setConfirmRidePopupPanel}
            confirmRide={confirmRide}
          />
        </div>
      </div>

      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full md:w-[400px] md:right-0 z-40 bottom-0 translate-y-full bg-white px-3 py-6 md:py-10 pt-8 md:pt-12 rounded-t-3xl md:rounded-none md:shadow-lg"
      >
        <div className="absolute top-3 left-0 w-full px-4">
          <div className="w-20 h-1 bg-gray-300 rounded-full mx-auto"></div>
          <h3 className="text-center text-base md:text-lg font-semibold mt-2">Carpool Details</h3>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          <ConfirmRidePopUp
            ride={ride}
            setConfirmRidePopupPanel={setConfirmRidePopupPanel}
            setRidePopupPanel={setRidePopupPanel}
          />
        </div>
      </div>
    </div>
  );
};

export default CaptainHome;