import React from 'react'

const ConfirmRide = ({ createRide, pickup, destination, fare, vehicleType, setConfirmRidePanel, setVehicleFound }) => {
  return (
    <div className='mb-14'>
      <h5 className='text-xl font-semibold mb-6 text-center'>Confirm Your Carpool</h5>
      <div className='space-y-6'>
        <div className='bg-gray-50 p-4 rounded-lg'>
          <div className='flex items-center gap-4 mb-4'>
            <i className="ri-map-pin-line text-blue-600"></i>
            <div>
              <p className='text-sm text-gray-600'>Pickup</p>
              <p className='font-medium'>{pickup}</p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <i className="ri-map-pin-2-line text-blue-600"></i>
            <div>
              <p className='text-sm text-gray-600'>Destination</p>
              <p className='font-medium'>{destination}</p>
            </div>
          </div>
        </div>

        <div className='bg-gray-50 p-4 rounded-lg'>
          <h4 className='font-medium mb-2'>Ride Details</h4>
          <div className='flex justify-between items-center'>
            <div>
              <p className='text-gray-600'>Price per seat</p>
              <p className='text-sm text-gray-600'>Estimated arrival</p>
            </div>
            <div className='text-right'>
              <p className='font-semibold'>₹{vehicleType === 'carpool' ? Math.round(fare.car * 0.7) : fare.car}</p>
              <p className='text-sm text-gray-600'>20 mins</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            createRide();
            setConfirmRidePanel(false);
            setVehicleFound(true);
          }}
          className='w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors'
        >
          Join Carpool
        </button>
      </div>
    </div>
  );
};

export default ConfirmRide