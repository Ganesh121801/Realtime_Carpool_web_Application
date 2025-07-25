import React from 'react'

const RidePopUp = ({ ride, setRidePopupPanel, setConfirmRidePopupPanel, confirmRide }) => {
    console.log("RidePopUp rendered with ride:", ride); 
      // Early return if no ride data

      if (!ride || !ride.pickup) {
        return <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>Loading ride details...</p>
        </div>;
    }

    const getCoordinates = async (address) => {
        const geocoder = new window.google.maps.Geocoder();
        try {
            const result = await new Promise((resolve, reject) => {
                geocoder.geocode({ address }, (results, status) => {
                    if (status === 'OK') {
                        resolve(results[0].geometry.location);
                    } else {
                        reject(status);
                    }
                });
            });
            return { lat: result.lat(), lng: result.lng() };
        } catch (error) {
            console.error('Geocoding error:', error);
            return null;
        }
    };

    const handleConfirm = async () => {
        // Get coordinates before confirming
        const pickupCoords = await getCoordinates(ride?.pickup);
        const destinationCoords = await getCoordinates(ride?.destination);
        
        const rideWithCoords = {
            ...ride,
            pickupCoords,
            destinationCoords
        };
        
        await confirmRide(rideWithCoords);
        setRidePopupPanel(false);
        setConfirmRidePopupPanel(true);
    };

   // Safely access nested user data
   const userName = ride.user?.fullname?.firstname || 'User';
   const userImage = ride.user?.profileImage || "/default-avatar.png";
  // Get fare based on ride type
  const fareAmount = ride.type === 'rideshare' ? ride.pricePerSeat : ride.fare;
    const paymentMethod = 'Cash';
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                setRidePopupPanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mb-5'>New Rider Available!</h3>
            <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4'>
                <div className='flex items-center gap-3'>
                    <img 
                        className='h-12 rounded-full object-cover w-12' 
                        src={userImage || "https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg"} 
                        
                    />
                    <h2 className='text-lg font-medium'>
                        {userName || 'User'} 
                    </h2>
                </div>
                <h5 className='text-lg font-semibold'>2.2 KM</h5>
            </div>
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Pickup Location</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{ride.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{ride.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>{fareAmount !== 'N/A' ? `₹${fareAmount}` : 'Price not set'}</h3>
                            <p className='text-sm -mt-1 text-gray-600'> {paymentMethod}</p>
                        </div>
                    </div>
                </div>
                <div className='mt-5 w-full'>
                    <button 
                        onClick={handleConfirm} 
                        className='bg-green-600 w-full text-white font-semibold p-2 px-10 rounded-lg hover:bg-green-700'
                    >
                        Accept
                    </button>

                    <button 
                        onClick={() => setRidePopupPanel(false)} 
                        className='mt-2 w-full bg-gray-300 text-gray-700 font-semibold p-2 px-10 rounded-lg hover:bg-gray-400'
                    >
                        Ignore
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RidePopUp