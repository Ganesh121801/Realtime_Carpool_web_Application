import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import LiveTracking from "../components/LiveTracking";
import axios from "axios";
import UserChat from "../pages/userChat.jsx";

const Riding = (props) => {
  const location = useLocation();
  const { ride } = location.state || {};
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  const [pickupCoords] = useState(ride?.pickupCoords || null);
  const [destinationCoords] = useState(ride?.destinationCoords || null);
  const [showRoute] = useState(true);
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [isChatOpen, setIsChatOpen] = useState(false);
 // --- Add these states for real-time distance/time ---
 const [distanceTime, setDistanceTime] = useState({ distance: '', duration: '' });
 const [userCoords, setUserCoords] = useState(null);


  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
   // --- Get rider's live location ---
   useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // --- Fetch real distance/time from backend ---
  useEffect(() => {
    if (
      userCoords &&
      ride?.destination &&
      userCoords.lat &&
      userCoords.lng
    ) {
      axios
        .get(`${import.meta.env.VITE_BASE_URL}/maps/get-distance-time`, {
          params: {
            origin: `${userCoords.lat},${userCoords.lng}`,
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
  }, [userCoords, ride?.destination]);

  socket.on("ride-ended", () => {
    navigate("/home");
  });

  const calculateFare = () => {
    if (!ride) return 0;
    // For rideshare, use pricePerSeat
    if (ride.type === "rideshare") {
      return ride.pricePerSeat;
    }
    // For regular rides, use fare
    return Math.round(ride.fare / 2);
  };

  const makepaymentHandler = async () => {
    try {
      const amount = calculateFare();
      if (!amount) {
        console.error("Invalid fare amount");
        return;
      }

      const {
        data: { key },
      } = await axios.get(`${import.meta.env.VITE_BASE_URL}/payment/getkey`);
      const {
        data: { order },
      } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/payment/process`,
        { amount },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Carpool Payment",
        description:
          ride.type === "rideshare" ? "Rideshare Payment" : "Ride Payment",
        order_id: order.id,
        handler: async function (response) {
          const verificationResponse = await axios.post(
            `${import.meta.env.VITE_BASE_URL}/payment/paymentverification`,
            {
              ...response,
              rideId: ride._id,
            }
          );
          if (verificationResponse.data.success) {
            navigate(
              `/home`
            );
          }
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  return (
    <div className="h-screen bg-gray-50 relative overflow-hidden">
      <div className={`flex ${isMobileView ? "flex-col" : "flex-row"} h-full`}>
        <div
          className={`relative transition-all duration-300 ${
            isMobileView
              ? isPanelExpanded
                ? "h-[40vh]"
                : "h-[85vh]"
              : isPanelExpanded
              ? "w-[60%]"
              : "w-[85%]"
          }`}
        >
          <LiveTracking
            pickup={pickupCoords}
            destination={destinationCoords}
            showRoute={showRoute}
            isCaptain={false}
            ride={ride}
          />

          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <Link
              to="/home"
              className="h-10 w-10 bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center rounded-full hover:bg-white transition-colors"
            >
              <i className="ri-arrow-left-s-line text-xl"></i>
            </Link>
            <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-full px-4 py-2 flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Trip Active</span>
            </div>
          </div>

          {isMobileView && (
            <div
              onClick={() => setIsPanelExpanded(!isPanelExpanded)}
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full cursor-pointer"
            />
          )}

          {!isMobileView && (
            <button
              onClick={() => setIsPanelExpanded(!isPanelExpanded)}
              className="absolute top-1/2 -translate-y-1/2 right-0 bg-white shadow-lg rounded-l-full p-2"
            >
              <i
                className={`ri-arrow-${
                  isPanelExpanded ? "right" : "left"
                }-s-line text-xl`}
              ></i>
            </button>
          )}
        </div>

        <div
          className={`bg-white transition-all duration-300 ${
            isMobileView
              ? `h-[60vh] ${
                  isPanelExpanded
                    ? "translate-y-0"
                    : "translate-y-[calc(100%-80px)]"
                }`
              : `${isPanelExpanded ? "w-[40%]" : "w-[15%]"}`
          } shadow-xl overflow-y-auto relative`}
        >
          <div
            className={`${
              isMobileView
                ? "px-4 py-6"
                : isPanelExpanded
                ? "px-6 py-4"
                : "px-3 py-2"
            }`}
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-500"
                    src="https://i.pravatar.cc/300"
                    alt="Driver"
                  />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                {(isPanelExpanded || isMobileView) && (
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="font-semibold capitalize">
                          {ride?.captain?.fullname?.firstname}
                        </h2>
                        <div className="flex items-center gap-1">
                          <i className="ri-star-fill text-yellow-400 text-sm"></i>
                          <span className="text-sm">4.8</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <h4 className="font-bold">
                          {ride?.captain?.vehicle?.plate}
                        </h4>
                        <h4 className="font-bold">
                          {props?.ride?.otp}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {ride?.captain?.vehicle?.model}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 bg-white backdrop-blur-sm py-2 rounded-lg flex items-center justify-center gap-2  transition-colors">
                        <i className="ri-message-3-line"></i>
                        <span>Message</span>
                      </button>
                      <button className="flex-1 bg-white backdrop-blur-sm py-2 rounded-lg flex items-center justify-center gap-2  transition-colors">
                        <i className="ri-phone-line"></i>
                        <span>Call</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {(isPanelExpanded || isMobileView) && (
              <div className="space-y-6 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <div className="w-0.5 flex-1 bg-gray-300 my-1"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 py-2 space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">PICKUP</p>
                        <p className="font-medium">{ride?.pickup}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          DESTINATION
                        </p>
                        <p className="font-medium">{ride?.destination}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className={`grid ${
                    isMobileView ? "grid-cols-2" : "grid-cols-3"
                  } gap-4`}
                >
                  <div className="bg-gray-50 p-3 rounded-xl text-center">
                    <i className="ri-time-line text-blue-500 mb-1 block text-lg"></i>
                    <p className="text-xs text-gray-500">TIME</p>
                    <p className="font-semibold">15 mins</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl text-center">
                    <i className="ri-route-line text-green-500 mb-1 block text-lg"></i>
                    <p className="text-xs text-gray-500">DISTANCE</p>
                    <p className="font-semibold">5.2 km</p>
                  </div>
                  <div
                    className={`bg-gray-50 p-3 rounded-xl text-center ${
                      isMobileView ? "col-span-2" : ""
                    }`}
                  >
                    <i className="ri-money-dollar-circle-line text-purple-500 mb-1 block text-lg"></i>
                    <p className="text-xs text-gray-500">FARE</p>
                    <p className="font-semibold">₹{calculateFare()}</p>
                  </div>
                </div>

                <button
                  onClick={makepaymentHandler} // Removed the arrow function
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold p-4 rounded-xl flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
                >
                  <i className="ri-secure-payment-line text-lg"></i>
                  Pay ₹{calculateFare()}
                </button>

                <div className="text-center">
                  <button className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 px-4 py-2 rounded-lg">
                    <i className="ri-error-warning-line"></i>
                    <span className="font-medium">Emergency Support</span>
                  </button>
                </div>
                   {/* Chat Section */}
                   <div className="absolute bottom-4 left-4 right-4 z-10">
                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        {isChatOpen ? "Close Chat" : "Chat with Captain"}
                    </button>
                    {isChatOpen && (
                        <div className="mt-2">
                            <UserChat captainId={ride?.captain?._id} />
                        </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Riding;
