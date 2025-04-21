import React, { useEffect, useRef, useState, useContext } from "react";
import { useGSAP } from "@gsap/react";
import Navbar from "../components/Navbar.jsx";
import gsap from "gsap";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";
import { CaptainDataContext } from "../context/CapatainContext";
import userChat from "../pages/userChat.jsx";
const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupCoords, setPickupCoords] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const [vehiclePanel, setVehiclePanel] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);
  const [captainVehicleModel, setCaptainVehicleModel] = useState(null);
  const [showDirections, setShowDirections] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [availableRides, setAvailableRides] = useState([]);
  const navigate = useNavigate();
  const [recentRides, setRecentRides] = useState([]);
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    const fetchAvailableRides = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/available-rides`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAvailableRides(response.data);
      } catch (error) {
        console.error("Error getting available rides:", error);
      }
    };

    fetchAvailableRides();

    //listen for new rideshares using socket
    socket.on("new-rides-available", (rideshare) => {
      setAvailableRides((prev) => [...prev, rideshare]);
    });

    return () => {
      socket.off("new-rides-available");
    };
  }, [socket]);

  useEffect(() => {
    socket.emit("join", { userType: "user", userId: user._id });

    // Add socket event listeners
    socket.on("ride-confirmed", (rideData) => {
      setVehicleFound(false);
      setWaitingForDriver(true);
      setRide(rideData);
    });

    socket.on("ride-started", (rideData) => {
      setWaitingForDriver(false);
      // Get coordinates if they don't exist
      if (!rideData.pickupCoords || !rideData.destinationCoords) {
        const geocoder = new window.google.maps.Geocoder();

        Promise.all([
          new Promise((resolve) => {
            geocoder.geocode(
              { address: rideData.pickup },
              (results, status) => {
                if (status === "OK") {
                  const location = results[0].geometry.location;
                  resolve({ lat: location.lat(), lng: location.lng() });
                }
              }
            );
          }),
          new Promise((resolve) => {
            geocoder.geocode(
              { address: rideData.destination },
              (results, status) => {
                if (status === "OK") {
                  const location = results[0].geometry.location;
                  resolve({ lat: location.lat(), lng: location.lng() });
                }
              }
            );
          }),
        ]).then(([pickupCoords, destinationCoords]) => {
          navigate("/riding", {
            state: {
              ride: {
                ...rideData,
                pickupCoords,
                destinationCoords,
              },
            },
          });
        });
      } else {
        navigate("/riding", { state: { ride: rideData } });
      }
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("ride-confirmed");
      socket.off("ride-started");
    };
  }, [user, socket, navigate]);

  useEffect(() => {
    const fetchRecentRides = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/rides/recent-rides`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setRecentRides(response.data);
        } catch (error) {
            console.error("Error fetching recent rides:", error);
        }
    };

    fetchRecentRides();
}, []);
  const handlePickupChange = async (e) => {
    setPickup(e.target.value);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPickupSuggestions(response.data);
    } catch {
      // handle error
    }
  };

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDestinationSuggestions(response.data);
    } catch {
      // handle error
    }
  };

  const handleJoinRideshare = async (rideshare) =>{
    try {
      const response = await axios.post( `${import.meta.env.VITE_BASE_URL}/rides/join-rideshare`,
        {
          rideshareId: rideshare._id
        },{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );
      socket.emit('new-ride', {
        rideId: response.data._id,
        captainId: rideshare.captain._id,
        data: response.data
      });
      //navigate to riding page with ride
      navigate("/riding", { state: { ride: response.data } });
    } catch (error) {
      console.error("Error joining rideshare:", error);
      alert("Error joining rideshare");
    }
  }

  const handlePickupSelect = (suggestion) => {
    setPickup(suggestion.description);
    setPickupCoords({
      lat: suggestion.geometry.location.lat(),
      lng: suggestion.geometry.location.lng(),
    });
    setPickupSuggestions([]);
  };

  const handleDestinationSelect = (suggestion) => {
    setDestination(suggestion.description);
    setDestinationCoords({
      lat: suggestion.geometry.location.lat(),
      lng: suggestion.geometry.location.lng(),
    });
    setDestinationSuggestions([]);
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  useGSAP(
    function () {
      if (panelOpen) {
        gsap.to(panelRef.current, {
          height: "55%",
          padding: 24,
          // opacity:1
        });
        gsap.to(panelCloseRef.current, {
          opacity: 1,
        });
      } else {
        gsap.to(panelRef.current, {
          height: "5%",
          padding: 0,
          // opacity:0
        });
        gsap.to(panelCloseRef.current, {
          height: "0%",
          opacity: 0,
        });
      }
    },
    [panelOpen]
  );

  useGSAP(
    function () {
      if (vehiclePanel) {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehiclePanel]
  );

  useGSAP(
    function () {
      if (confirmRidePanel) {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(confirmRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [confirmRidePanel]
  );

  useGSAP(
    function () {
      if (vehicleFound) {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(vehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [vehicleFound]
  );

  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [waitingForDriver]
  );

  async function findTrip() {
    setVehiclePanel(true);
    setPanelOpen(false);

    // Only show directions if we have both coordinates
    if (pickupCoords && destinationCoords) {
      setShowDirections(true);
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: { pickup, destination },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setFare(response.data);
    } catch (error) {
      console.error("Error getting fare:", error);
    }
  }

  async function createRide() {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/create`,
        {
          pickup,
          destination,
          vehicleType,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Set showRoute to true when ride is created
      setShowRoute(true);

      // Convert addresses to coordinates if needed
      if (!pickupCoords || !destinationCoords) {
        const geocoder = new window.google.maps.Geocoder();

        // Get pickup coordinates
        geocoder.geocode({ address: pickup }, (results, status) => {
          if (status === "OK") {
            const { lat, lng } = results[0].geometry.location;
            setPickupCoords({ lat: lat(), lng: lng() });
          }
        });

        // Get destination coordinates
        geocoder.geocode({ address: destination }, (results, status) => {
          if (status === "OK") {
            const { lat, lng } = results[0].geometry.location;
            setDestinationCoords({ lat: lat(), lng: lng() });
          }
        });
      }
    } catch (error) {
      console.error("Error creating ride:", error);
    }
  }

  // Add this function to sort rides by date
  const sortRidesByDate = (rides) => {
    return [...rides].sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 relative">
        {/* Updated Hero Section */}
        <div className="bg-grey-300 text-white pt-10  pb-10 px-2 md:px-8">
          {/* <div className="max-w-7xl mx-auto">
            <h1 className="text-gray-800 text-3xl md:text-4xl font-bold mb-4">
              Share Rides, Split Costs
            </h1>
            <p className="text-gray-600 text-lg">
              Find people traveling to your destination and share the journey
            </p>
          </div> */}
        </div>

        {/* New Recent Rides Section */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Recent Rides</h2>
                <p className="text-gray-600 mt-1">Join existing rides and save more</p>
              </div>
              <button 
                                onClick={() => {
                                    const ridesSection = document.getElementById('availableRides');
                                    ridesSection?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                View all rides <i className="ri-arrow-right-line"></i>
                            </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4 overflow-hidden">
                            {recentRides.map((ride) => (
                                <div
                                    key={ride._id}
                                    onClick={() => {
                                        const ridesSection = document.getElementById('availableRides');
                                        ridesSection?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                    className="group bg-gray-50 hover:bg-gray-100 p-4 rounded-xl cursor-pointer transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="relative">
                                            <img
                                                src={ride.captain?.profileImage || "/default-avatar.png"}
                                                alt=""
                                                className="w-10 h-10 rounded-full object-cover border-2 border-white"
                                            />
                                            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {ride.captain?.fullname?.firstname || 'Captain'}
                                            </p>
                                            <div className="flex items-center gap-1">
                                                <i className="ri-star-fill text-yellow-400 text-sm"></i>
                                                <span className="text-sm text-gray-600">
                                                    {ride.captain?.rating || "4.5"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-start gap-2">
                                            <i className="ri-map-pin-line text-blue-600 mt-1"></i>
                                            <p className="text-sm text-gray-600 truncate flex-1">
                                                {ride.pickup}
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <i className="ri-map-pin-2-line text-green-600 mt-1"></i>
                                            <p className="text-sm text-gray-600 truncate flex-1">
                                                {ride.destination}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="bg-green-50 text-green-700 px-2 py-1 rounded">
                                            ₹{ride.pricePerSeat || ride.fare}/seat
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <i className="ri-user-line"></i>
                                            {ride.maxPassengers || '4'} seats left
                                        </div>
                                    </div>

                                    <div className="mt-4 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-blue-600 text-sm font-medium">
                                            View Details <i className="ri-arrow-right-line"></i>
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {recentRides.length === 0 && (
                                <div className="md:col-span-3 text-center py-8">
                                    <i className="ri-route-line text-4xl text-gray-300 mb-2"></i>
                                    <p className="text-gray-500">No rides available at the moment</p>
                                </div>
                            )}
                        </div>
          </div>
        </div>

        {/* Main Content Section with updated UI */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="grid md:grid-cols-12 gap-8">
            {/* Updated Booking Panel */}
            <div className="md:col-span-4">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20">
                <div className="flex items-center gap-2 mb-6">
                  <h4 className="text-2xl font-semibold">Find a Rideshare</h4>
                  <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded">
                    Save up to 50%
                  </span>
                </div>

                {/* Existing form with updated styling */}
                <form className="relative py-3" onSubmit={submitHandler}>
                  <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                  <input
                    onClick={() => {
                      setPanelOpen(true);
                      setActiveField("pickup");
                    }}
                    value={pickup}
                    onChange={handlePickupChange}
                    className="bg-[#eee] px-12 py-3 text-lg rounded-lg w-full mb-3"
                    type="text"
                    placeholder="Add a pick-up location"
                  />
                  <input
                    onClick={() => {
                      setPanelOpen(true);
                      setActiveField("destination");
                    }}
                    value={destination}
                    onChange={handleDestinationChange}
                    className="bg-[#eee] px-12 py-3 text-lg rounded-lg w-full"
                    type="text"
                    placeholder="Enter your destination"
                  />

                  {pickup && destination && (
                    <button
                      onClick={findTrip}
                      className="bg-black text-white px-6 py-3 rounded-lg mt-6 w-full"
                    >
                      Find Trip
                    </button>
                  )}
                </form>

                {/* New Rideshare Filters
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium mb-3">Preferences</h5>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="sameGender" className="mr-2" />
                      <label htmlFor="sameGender" className="text-sm text-gray-600">Same gender preference</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="verified" className="mr-2" />
                      <label htmlFor="verified" className="text-sm text-gray-600">Verified riders only</label>
                    </div>
                  </div>
                </div> */}

                {panelOpen && (
                  <div className="absolute left-0 right-0 bg-white px-6 py-4 shadow-lg z-40">
                    <LocationSearchPanel
                      suggestions={
                        activeField === "pickup"
                          ? pickupSuggestions
                          : destinationSuggestions
                      }
                      setPanelOpen={setPanelOpen}
                      setVehiclePanel={setVehiclePanel}
                      setPickup={setPickup}
                      setDestination={setDestination}
                      activeField={activeField}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Map Section */}
            <div className="md:col-span-8">
              <div className="h-[600px] rounded-xl overflow-hidden shadow-lg">
                <LiveTracking
                  pickup={pickupCoords}
                  destination={destinationCoords}
                  showRoute={showRoute}
                  isCaptain={false}
                  ride={ride}
                />
              </div>
            </div>
          </div>

          {/* Updated Features Section */}
          <div className="py-16">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Why Choose Ridesharing
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <i className="ri-money-dollar-circle-line text-4xl text-green-600 mb-4"></i>
                <h3 className="text-xl font-semibold mb-2">Save Money</h3>
                <p className="text-gray-600">
                  Split travel costs with fellow passengers
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <i className="ri-shield-check-line text-4xl text-green-600 mb-4"></i>
                <h3 className="text-xl font-semibold mb-2">Safe Rides</h3>
                <p className="text-gray-600">
                  Verified drivers and real-time tracking for your peace of mind
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <i className="ri-money-dollar-circle-line text-4xl text-purple-600 mb-4"></i>
                <h3 className="text-xl font-semibold mb-2">Best Rates</h3>
                <p className="text-gray-600">
                  Competitive pricing with no hidden charges
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Improved Available Rideshares Section */}
        <div id="availableRides" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Available Rideshares</h2>
                <p className="text-gray-600 mt-2">Find and join rides that match your route</p>
              </div>
              <div className="flex gap-4">
                <select className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Filter by Price</option>
                  <option value="low">Lowest Price</option>
                  <option value="high">Highest Price</option>
                </select>
                <select className="px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Sort by Time</option>
                  <option value="early">Earliest First</option>
                  <option value="late">Latest First</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortRidesByDate(availableRides).slice(0, 6).map((rideshare) => (
                <div
                  key={rideshare._id}
                  className="bg-white rounded-xl border border-gray-100 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md p-6"
                >
                  {/* Driver Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <img
                        src={rideshare.captain.profileImage || "https://via.placeholder.com/50"}
                        alt={rideshare.captain.fullname.firstname}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800">
                          {rideshare.captain.fullname.firstname}
                        </h3>
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                          <i className="ri-star-fill text-yellow-400 mr-1"></i>
                          <span className="text-sm font-medium text-yellow-700">
                            {rideshare.captain.rating || "4.5"}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{rideshare.captain.totalRides || "50+"} rides</p>
                    </div>
                  </div>

                  {/* Journey Details */}
                  <div className="relative mb-6 pl-6">
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    <div className="space-y-4">
                      <div>
                        <div className="absolute left-0 w-2 h-2 rounded-full bg-blue-500 -translate-x-[3px]"></div>
                        <p className="text-xs text-gray-500 mb-1">PICKUP</p>
                        <p className="text-sm font-medium text-gray-800">{rideshare.pickup}</p>
                      </div>
                      <div>
                        <div className="absolute left-0 w-2 h-2 rounded-full bg-green-500 -translate-x-[3px]"></div>
                        <p className="text-xs text-gray-500 mb-1">DESTINATION</p>
                        <p className="text-sm font-medium text-gray-800">{rideshare.destination}</p>
                      </div>
                    </div>
                  </div>

                  {/* Ride Details */}
                  <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">PRICE</p>
                      <p className="font-semibold text-green-600">₹{rideshare.pricePerSeat}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">SEATS LEFT</p>
                      <p className="font-semibold">{rideshare.maxPassengers}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">TIME</p>
                      <p className="font-semibold">
                        {new Date(rideshare.departureTime).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleJoinRideshare(rideshare)}
                      className="flex-1 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <i className="ri-taxi-line"></i>
                      Join Ride
                    </button>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <i className="ri-message-3-line text-gray-600"></i>
                      <userChat captainId={ride?.captain?._id} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {availableRides.length === 0 && (
              <div className="text-center py-16 bg-gray-50 rounded-xl">
                <i className="ri-route-line text-5xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Rides Available</h3>
                <p className="text-gray-600">Check back later for new rideshares</p>
              </div>
            )}

            {/* Add pagination or load more button if needed */}
            {availableRides.length > 6 && (
              <div className="text-center mt-8">
                <button className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
                  Load More Rides
                  <i className="ri-arrow-down-line"></i>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Safety Feature Banner */}
        <div className="bg-blue-50 py-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  Your Safety is Our Priority
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  With features like real-time tracking, trusted drivers, and
                  24/7 support, we ensure you reach your destination safely.
                </p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Learn More About Safety
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <i className="ri-police-car-line text-3xl text-blue-600 mb-2"></i>
                  <h4 className="font-semibold">Emergency Support</h4>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <i className="ri-road-map-line text-3xl text-blue-600 mb-2"></i>
                  <h4 className="font-semibold">Route Sharing</h4>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <i className="ri-user-voice-line text-3xl text-blue-600 mb-2"></i>
                  <h4 className="font-semibold">Verified Drivers</h4>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <i className="ri-24-hours-line text-3xl text-blue-600 mb-2"></i>
                  <h4 className="font-semibold">24/7 Support</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Existing sliding panels */}
        <div
          ref={vehiclePanelRef}
          className="fixed w-full md:w-[400px] md:right-0 z-[60] bottom-0 translate-y-full bg-white px-3 py-10 pt-12 rounded-t-3xl md:rounded-none md:shadow-lg"
        >
          <VehiclePanel
            selectVehicle={setVehicleType}
            fare={fare}
            setConfirmRidePanel={setConfirmRidePanel}
            setVehiclePanel={setVehiclePanel}
          />
        </div>

        <div
          ref={confirmRidePanelRef}
          className="fixed w-full md:w-[400px] md:right-0 z-[60] bottom-0 translate-y-full bg-white px-3 py-6 pt-12 rounded-t-3xl md:rounded-none md:shadow-lg"
        >
          <ConfirmRide
            createRide={createRide}
            pickup={pickup}
            destination={destination}
            fare={fare}
            vehicleType={vehicleType}
            setConfirmRidePanel={setConfirmRidePanel}
            setVehicleFound={setVehicleFound}
          />
        </div>

        <div
          ref={vehicleFoundRef}
          className="fixed w-full md:w-[400px] md:right-0 z-[60] bottom-0 translate-y-full bg-white px-3 py-6 pt-12 rounded-t-3xl md:rounded-none md:shadow-lg"
        >
          <LookingForDriver
            createRide={createRide}
            pickup={pickup}
            destination={destination}
            fare={fare}
            vehicleType={vehicleType}
            setVehicleFound={setVehicleFound}
          />
        </div>

        <div
          ref={waitingForDriverRef}
          className="fixed w-full md:w-[400px] md:right-0 z-[60] bottom-0 translate-y-full bg-white px-3 py-6 pt-12 rounded-t-3xl md:rounded-none md:shadow-lg"
        >
          <WaitingForDriver
            ride={ride}
            captain={captain}
            setVehicleFound={setVehicleFound}
            setWaitingForDriver={setWaitingForDriver}
            waitingForDriver={waitingForDriver}
            vehicleModel={ride?.captain?.vehicle?.model}
          />
        </div>
      </div>
    </>
  );
};

export default Home;
